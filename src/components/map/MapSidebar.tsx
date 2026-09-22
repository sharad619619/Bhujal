'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Layers, Filter, MapPin, Droplets, AlertTriangle, AlertCircle,
  School as SchoolIcon, Factory, Activity, HeartPulse, Wheat,
  RotateCcw, ChevronDown, ChevronRight, CheckCircle2, ShieldCheck, X
} from 'lucide-react';
import type { MapLayerState, QuickFilterCategory } from './types';
import { getDb } from '@/lib/db/store';

interface MapSidebarProps {
  layers: MapLayerState;
  onToggleLayer: (layerKey: keyof MapLayerState) => void;
  onSetAllLayers: (layers: Partial<MapLayerState>) => void;
  selectedVillageId: string;
  onSelectVillage: (villageId: string) => void;
  safetyFilter: string;
  onSelectSafetyFilter: (filter: string) => void;
  onSelectEntity: (entity: any) => void;
  onResetView: () => void;
  year: number;
}

export default function MapSidebar({
  layers,
  onToggleLayer,
  onSetAllLayers,
  selectedVillageId,
  onSelectVillage,
  safetyFilter,
  onSelectSafetyFilter,
  onSelectEntity,
  onResetView,
  year,
}: MapSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilterCategory>('all');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const db = getDb();
  const villages = db.getVillages();

  // Close search dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Global Multi-Entity Search Query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: any[] = [];

    // 1. Villages
    villages.forEach(v => {
      if (v.name.toLowerCase().includes(q) || v.hindiName.includes(q) || 'village'.includes(q) || 'community'.includes(q)) {
        results.push({
          id: v.id,
          name: `${v.name} (${v.hindiName})`,
          _type: 'village',
          layerKey: 'villages',
          location: `${v.block || 'Rania'} · ${v.district || 'Kanpur'}`,
          status: v.contaminationStatus || 'High Risk',
          coordinates: v.coordinates,
          raw: v,
        });
      }
    });

    // 2. Water Sources & Hand Pumps
    const sourcesList = year === 2026 ? db.getWaterSources() : db.getWaterSourcesByYear(year);
    sourcesList.forEach(ws => {
      const matchName = ws.name?.toLowerCase().includes(q);
      const matchId = ws.id.toLowerCase().includes(q);
      const matchKeyword = ('hand pump'.includes(q) || 'water'.includes(q) || 'pump'.includes(q) || 'well'.includes(q));
      if (matchName || matchId || matchKeyword) {
        const v = db.getVillageById(ws.villageId);
        results.push({
          id: ws.id,
          name: ws.name || ws.id,
          _type: 'waterSource',
          layerKey: 'waterSources',
          location: v?.name || ws.villageId,
          status: ws.status === 'safe' ? 'Verified Safe' : ws.status === 'restricted' ? 'Restricted' : 'Contaminated',
          coordinates: ws.coordinates,
          raw: ws,
        });
      }
    });

    // 3. Schools
    db.getSchools().forEach(sc => {
      if (sc.name.toLowerCase().includes(q) || 'school'.includes(q) || 'primary'.includes(q)) {
        const v = db.getVillageById(sc.villageId);
        results.push({
          id: sc.id,
          name: sc.name,
          _type: 'school',
          layerKey: 'schools',
          location: v?.name || sc.villageId,
          status: `${sc.studentCount} Students`,
          coordinates: sc.coordinates,
          raw: sc,
        });
      }
    });

    // 4. Groundwater Points
    db.getGroundwaterPoints().forEach(gp => {
      if (gp.name?.toLowerCase().includes(q) || gp.id.toLowerCase().includes(q) || 'groundwater'.includes(q) || 'piezometric'.includes(q)) {
        const v = db.getVillageById(gp.villageId);
        results.push({
          id: gp.id,
          name: gp.name || gp.id,
          _type: 'groundwaterPoint',
          layerKey: 'groundwaterPoints',
          location: v?.name || gp.villageId,
          status: `${gp.depth?.toFixed(1) || 14}m Depth`,
          coordinates: gp.coordinates,
          raw: gp,
        });
      }
    });

    // 5. Contamination Sources & Industrial Sites
    db.getContaminationSources().forEach(cs => {
      if (cs.name.toLowerCase().includes(q) || cs.type.toLowerCase().includes(q) || 'industrial'.includes(q) || 'tannery'.includes(q) || 'waste'.includes(q)) {
        results.push({
          id: cs.id,
          name: cs.name,
          _type: 'contaminationSource',
          layerKey: 'contaminationSources',
          location: `${cs.type.toUpperCase()} · ${cs.estimatedImpactRadius}km plume`,
          status: cs.status.toUpperCase(),
          coordinates: cs.coordinates,
          raw: cs,
        });
      }
    });

    // 6. Citizen Community Reports
    db.getCommunityReports().forEach(cr => {
      const matchCat = cr.category.toLowerCase().includes(q);
      const matchDesc = cr.description.toLowerCase().includes(q);
      const matchId = cr.id.toLowerCase().includes(q);
      if (matchCat || matchDesc || matchId || 'report'.includes(q) || 'citizen'.includes(q)) {
        const v = db.getVillageById(cr.villageId);
        results.push({
          id: cr.id,
          name: cr.title || cr.category,
          _type: 'communityReport',
          layerKey: 'communityReports',
          location: v?.name || cr.villageId,
          status: cr.priority || 'Medium',
          coordinates: typeof cr.coordinates?.lat === 'number' ? cr.coordinates : { lat: 26.45, lon: 80.35 },
          raw: cr,
        });
      }
    });

    // 7. Healthcare Facilities
    db.getHealthcare().forEach(hc => {
      if (hc.name.toLowerCase().includes(q) || 'health'.includes(q) || 'hospital'.includes(q) || 'phc'.includes(q) || 'chc'.includes(q)) {
        const v = db.getVillageById(hc.villageId);
        results.push({
          id: hc.id,
          name: hc.name,
          _type: 'healthcare',
          layerKey: 'healthcare',
          location: v?.name || hc.villageId,
          status: hc.type,
          coordinates: hc.coordinates,
          raw: hc,
        });
      }
    });

    // 8. Remediation Deployments
    db.getRemediationProjects().forEach(rp => {
      if (rp.name?.toLowerCase().includes(q) || rp.title?.toLowerCase().includes(q) || rp.type.toLowerCase().includes(q) || 'remediation'.includes(q) || 'barrier'.includes(q)) {
        const v = db.getVillageById(rp.villageId);
        results.push({
          id: rp.id,
          name: rp.name || rp.title,
          _type: 'remediationProject',
          layerKey: 'remediationProjects',
          location: v?.name || rp.villageId,
          status: (rp.status || rp.stage || 'in_progress').replace('_', ' '),
          coordinates: v ? { lat: v.coordinates.lat + 0.003, lon: v.coordinates.lon + 0.003 } : { lat: 26.45, lon: 80.35 },
          raw: rp,
        });
      }
    });

    // 9. Agricultural Zones
    db.getAgriculturalZones().forEach(az => {
      if (az.cropType.toLowerCase().includes(q) || az.id.toLowerCase().includes(q) || 'agriculture'.includes(q) || 'crop'.includes(q)) {
        const v = db.getVillageById(az.villageId);
        results.push({
          id: az.id,
          name: `${az.cropType} Cultivation Plain`,
          _type: 'agriculturalZone',
          layerKey: 'agriculturalZones',
          location: v?.name || az.villageId,
          status: `${az.exposureLevel} exposure`,
          coordinates: az.coordinates,
          raw: az,
        });
      }
    });

    return results.slice(0, 10);
  }, [searchQuery, year, villages]);

  const handleSelectResult = (res: any) => {
    // If the layer is currently disabled, turn it on!
    if (res.layerKey && !layers[res.layerKey as keyof MapLayerState]) {
      onToggleLayer(res.layerKey as keyof MapLayerState);
    }
    onSelectEntity(res.raw ? { ...res.raw, _type: res._type } : res);
    setSearchQuery('');
    setSearchFocused(false);
  };

  const handleApplyQuickFilter = (category: QuickFilterCategory) => {
    setActiveQuickFilter(category);
    switch (category) {
      case 'all':
        onSetAllLayers({
          villages: true,
          waterSources: true,
          groundwaterPoints: true,
          schools: true,
          healthcare: true,
          contaminationSources: true,
          communityReports: true,
          agriculturalZones: true,
          remediationProjects: true,
          predictedZones: true,
        });
        break;
      case 'water':
        onSetAllLayers({
          villages: true,
          waterSources: true,
          groundwaterPoints: true,
          schools: false,
          healthcare: false,
          contaminationSources: false,
          communityReports: false,
          agriculturalZones: false,
          remediationProjects: false,
          predictedZones: false,
        });
        break;
      case 'contamination':
        onSetAllLayers({
          villages: true,
          waterSources: false,
          groundwaterPoints: true,
          schools: false,
          healthcare: false,
          contaminationSources: true,
          communityReports: true,
          agriculturalZones: false,
          remediationProjects: false,
          predictedZones: true,
        });
        break;
      case 'community':
        onSetAllLayers({
          villages: true,
          waterSources: false,
          groundwaterPoints: false,
          schools: true,
          healthcare: true,
          contaminationSources: false,
          communityReports: true,
          agriculturalZones: false,
          remediationProjects: false,
          predictedZones: false,
        });
        break;
      case 'infrastructure':
        onSetAllLayers({
          villages: true,
          waterSources: true,
          groundwaterPoints: false,
          schools: true,
          healthcare: true,
          contaminationSources: false,
          communityReports: false,
          agriculturalZones: false,
          remediationProjects: false,
          predictedZones: false,
        });
        break;
      case 'remediation':
        onSetAllLayers({
          villages: true,
          waterSources: true,
          groundwaterPoints: false,
          schools: false,
          healthcare: false,
          contaminationSources: true,
          communityReports: false,
          agriculturalZones: false,
          remediationProjects: true,
          predictedZones: true,
        });
        break;
    }
  };

  // Live real data counts
  const villagesCount = villages.length;
  const sourcesCount = (year === 2026 ? db.getWaterSources() : db.getWaterSourcesByYear(year)).length;
  const schoolsCount = db.getSchools().length;
  const groundwaterCount = db.getGroundwaterPoints().length;
  const healthcareCount = db.getHealthcare().length;
  const contamCount = db.getContaminationSources().length;
  const reportsCount = db.getCommunityReports().length;
  const remediationCount = db.getRemediationProjects().length;
  const agriCount = db.getAgriculturalZones().length;

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 overflow-hidden font-mono text-xs">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-200 bg-[#002116] text-white flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-base text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            Subsurface Intelligence
          </h2>
          <span className="text-[10px] text-emerald-300 font-mono">
            Kanpur Heavy-Metal Alluvium GIS
          </span>
        </div>
        <button
          onClick={onResetView}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer"
          title="Reset map view to default"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Global Map Search Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 relative" ref={searchContainerRef}>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search village, handpump, school, water source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-8 py-2 text-xs placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchFocused && searchResults.length > 0 && (
          <div className="absolute left-3 right-3 top-14 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 divide-y divide-slate-100 max-h-72 overflow-y-auto">
            <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Matching Entities</span>
              <span>{searchResults.length} Found</span>
            </div>
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectResult(item)}
                className="w-full text-left px-3 py-2.5 hover:bg-emerald-50 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-slate-900 group-hover:text-emerald-900 truncate block text-xs">
                      {item.name}
                    </strong>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {item._type}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                    {item.location} · {item.status}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0" />
              </button>
            ))}
          </div>
        )}

        {searchFocused && searchQuery.trim() && searchResults.length === 0 && (
          <div className="absolute left-3 right-3 top-14 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-4 text-center text-slate-500 text-xs">
            No entities found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Scrollable Filters & Layer Toggles */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Quick Category Filters */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Quick Layer Presets
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'water', label: 'Water' },
              { id: 'contamination', label: 'Pollution' },
              { id: 'community', label: 'Community' },
              { id: 'infrastructure', label: 'Services' },
              { id: 'remediation', label: 'Remediation' },
            ].map((q) => (
              <button
                key={q.id}
                onClick={() => handleApplyQuickFilter(q.id as QuickFilterCategory)}
                className={`py-1.5 px-2 rounded-lg font-bold text-center transition-colors cursor-pointer ${
                  activeQuickFilter === q.id
                    ? 'bg-[#002116] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Spatial Scope: Village Selector */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
            Focus Community
          </label>
          <div className="relative">
            <select
              value={selectedVillageId}
              onChange={(e) => onSelectVillage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs appearance-none font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600 cursor-pointer"
            >
              <option value="all">All Regional Communities (5)</option>
              {villages.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.hindiName})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Water Safety Filter */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
            Water Safety Standard
          </label>
          <div className="relative">
            <select
              value={safetyFilter}
              onChange={(e) => onSelectSafetyFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs appearance-none font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600 cursor-pointer"
            >
              <option value="all">All Water Points ({sourcesCount})</option>
              <option value="safe">Verified Safe (Drinking Compliant)</option>
              <option value="restricted">Restricted / Caution</option>
              <option value="do_not_use">Critical (Exceeds WHO Limit)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Map Layers List */}
        <div className="space-y-2.5 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Map Layers
            </span>
            <span className="text-[10px] text-slate-500">Live Telemetry</span>
          </div>

          <div className="space-y-1.5">
            <LayerToggleRow
              label={`Communities (${villagesCount})`}
              active={layers.villages}
              onChange={() => onToggleLayer('villages')}
              badge={<span className="w-3.5 h-3.5 rounded-full bg-[#12372A] border border-white text-white flex items-center justify-center text-[8px] font-bold">V</span>}
            />

            <LayerToggleRow
              label={`Water Points & Wells (${sourcesCount})`}
              active={layers.waterSources}
              onChange={() => onToggleLayer('waterSources')}
              badge={<span className="w-3 h-3 rounded-full bg-[#2E8B68]" />}
            />

            <LayerToggleRow
              label={`Piezometric Wells (${groundwaterCount})`}
              active={layers.groundwaterPoints}
              onChange={() => onToggleLayer('groundwaterPoints')}
              badge={<span className="w-3 h-3 rounded-full bg-sky-500" />}
            />

            <LayerToggleRow
              label={`Educational Zones (${schoolsCount})`}
              active={layers.schools}
              onChange={() => onToggleLayer('schools')}
              badge={<span className="text-xs">🏫</span>}
            />

            <LayerToggleRow
              label={`Healthcare Facilities (${healthcareCount})`}
              active={layers.healthcare}
              onChange={() => onToggleLayer('healthcare')}
              badge={<span className="text-xs">🏥</span>}
            />

            <LayerToggleRow
              label={`Industrial Vectors (${contamCount})`}
              active={layers.contaminationSources}
              onChange={() => onToggleLayer('contaminationSources')}
              badge={<span className="text-xs">🏭</span>}
            />

            <LayerToggleRow
              label={`Citizen Observations (${reportsCount})`}
              active={layers.communityReports}
              onChange={() => onToggleLayer('communityReports')}
              badge={<span className="text-xs">⚠️</span>}
            />

            <LayerToggleRow
              label={`Agricultural Plains (${agriCount})`}
              active={layers.agriculturalZones}
              onChange={() => onToggleLayer('agriculturalZones')}
              badge={<span className="text-xs">🌾</span>}
            />

            <LayerToggleRow
              label={`Remediation Sites (${remediationCount})`}
              active={layers.remediationProjects}
              onChange={() => onToggleLayer('remediationProjects')}
              badge={<span className="text-xs">🌱</span>}
            />

            <LayerToggleRow
              label="Predicted Plume Dispersion"
              active={layers.predictedZones}
              onChange={() => onToggleLayer('predictedZones')}
              badge={<span className="w-3 h-3 rounded-full bg-red-400/40 border border-red-500" />}
            />
          </div>
        </div>

        {/* Map Legend */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
            Cartographic Legend
          </span>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-[11px] text-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-700 border border-white shrink-0"></span>
              <span>Safe / Verified Water Point (&lt;0.05 mg/L)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shrink-0"></span>
              <span>Restricted Use (0.03 – 0.05 mg/L)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 border border-white shrink-0"></span>
              <span>Contaminated Handpump (&gt;0.05 mg/L)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500 border border-white shrink-0"></span>
              <span>Piezometric Monitoring Station</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs shrink-0">🏭</span>
              <span>Industrial / Contamination Vector</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs shrink-0">🌱</span>
              <span>Remediation Intervention</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-400 border-dashed shrink-0"></span>
              <span>Model-Estimated Dispersion Zone</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerToggleRow({
  label,
  active,
  onChange,
  badge,
}: {
  label: string;
  active: boolean;
  onChange: () => void;
  badge: React.ReactNode;
}) {
  return (
    <div
      onClick={onChange}
      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer select-none transition-colors group"
    >
      <div className="flex items-center gap-2 min-w-0 pr-2">
        {badge}
        <span className="text-slate-700 group-hover:text-slate-900 font-medium truncate">
          {label}
        </span>
      </div>
      <div
        className={`w-8 h-4.5 rounded-full relative transition-colors shrink-0 ${
          active ? 'bg-[#002116]' : 'bg-slate-300'
        }`}
      >
        <div
          className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
            active ? 'left-4' : 'left-0.5'
          }`}
        />
      </div>
    </div>
  );
}
