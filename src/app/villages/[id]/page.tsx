'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { getDb, VillageRecord, WaterSourceRecord, CommunityReportRecord, RemediationProjectRecord } from '@/lib/db/store';
import { 
  Map as MapIcon, 
  Users, 
  Droplets, 
  Home, 
  Activity, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  ChevronRight, 
  ArrowLeft, 
  Download, 
  ShieldAlert,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default function VillageDigitalTwinPage() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params.id as string;
  const [year, setYear] = useState(2026);
  const [activeTab, setActiveTab] = useState<'measurements' | 'reports' | 'timeline' | 'remediation' | 'geology'>('measurements');
  
  const [village, setVillage] = useState<VillageRecord | null>(null);
  const [sources, setSources] = useState<WaterSourceRecord[]>([]);
  const [reports, setReports] = useState<CommunityReportRecord[]>([]);
  const [remediation, setRemediation] = useState<RemediationProjectRecord[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadData = () => {
      const db = getDb();
      const resolvedId = db.resolveVillageId(id);
      const v = db.getVillageById(resolvedId) || db.getVillageById(id);
      if (v) {
        setVillage(v);
        const actualId = v.id;
        const wsList = year === 2026 
          ? db.getWaterSourcesByVillage(actualId) 
          : db.getWaterSourcesByYear(year).filter(ws => ws.villageId === actualId);
        setSources(wsList);
        setReports(db.getReportsByVillage(actualId));
        setRemediation(db.getRemediationProjectsByVillage(actualId));
        setTimeline(db.getTimelineEventsByVillage(actualId));
        setSchools(db.getSchoolsByVillage(actualId));
      }
    };
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('bhujal_data_updated', handleUpdate);
    return () => window.removeEventListener('bhujal_data_updated', handleUpdate);
  }, [id, year]);

  // Initialize MapLibre map centered on village
  useEffect(() => {
    if (!village || !mapContainerRef.current) return;

    let isMounted = true;

    import('maplibre-gl').then((maplibreglModule: any) => {
      if (!isMounted || !mapContainerRef.current) return;
      const maplibregl = maplibreglModule.default || maplibreglModule;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // GeoJSON coordinates are [lon, lat]
      const centerLon = typeof village.coordinates?.lon === 'number' ? village.coordinates.lon : ((village.coordinates as any)?.[1] ?? 80.342);
      const centerLat = typeof village.coordinates?.lat === 'number' ? village.coordinates.lat : ((village.coordinates as any)?.[0] ?? 26.465);

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap Contributors'
            }
          },
          layers: [{
            id: 'osm',
            type: 'raster',
            source: 'osm'
          }]
        },
        center: [centerLon, centerLat],
        zoom: 13.5,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

      map.on('load', () => {
        if (!isMounted) return;

        // Add plume dispersion circle
        map.addSource('plume-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [centerLon, centerLat],
            },
            properties: {
              radius: 900,
            }
          }
        });

        map.addLayer({
          id: 'plume-heat',
          type: 'circle',
          source: 'plume-source',
          paint: {
            'circle-radius': 140,
            'circle-color': '#dc2626',
            'circle-opacity': 0.18,
            'circle-blur': 0.85,
          }
        });

        // Add Water Source Markers
        sources.forEach((source) => {
          const isSafe = source.status === 'SAFE';
          const el = document.createElement('div');
          el.className = 'cursor-pointer transform hover:scale-125 transition-transform';
          el.innerHTML = `
            <div style="
              width: 26px; 
              height: 26px; 
              border-radius: 50%; 
              background: ${isSafe ? '#15803d' : '#b91c1c'}; 
              border: 2.5px solid white; 
              box-shadow: 0 2px 6px rgba(0,0,0,0.3); 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-size: 11px; 
              font-weight: bold;
            ">
              ${isSafe ? '✓' : '!'}
            </div>
          `;

          const popupContent = `
            <div style="padding: 10px; font-family: sans-serif; min-width: 190px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <strong style="font-size: 13px; color: #0f172a;">${source.name}</strong>
                <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 9999px; background: ${isSafe ? '#dcfce7' : '#fee2e2'}; color: ${isSafe ? '#166534' : '#991b1b'};">
                  ${source.status}
                </span>
              </div>
              <p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0;">Type: ${source.type}</p>
              <div style="font-size: 11px; background: #f8fafc; padding: 6px; border-radius: 6px; border: 1px solid #e2e8f0;">
                <div><strong>Cr Level:</strong> ${source.contaminant || (isSafe ? '< 0.01 mg/L' : '0.14 mg/L')}</div>
                ${source.depthMeters ? `<div><strong>Depth:</strong> ${source.depthMeters}m</div>` : ''}
              </div>
            </div>
          `;

          const popup = new maplibregl.Popup({ offset: 15 }).setHTML(popupContent);

          const sLon = typeof source.coordinates?.lon === 'number' ? source.coordinates.lon : ((source.coordinates as any)?.[1] ?? centerLon);
          const sLat = typeof source.coordinates?.lat === 'number' ? source.coordinates.lat : ((source.coordinates as any)?.[0] ?? centerLat);

          new maplibregl.Marker({ element: el })
            .setLngLat([sLon, sLat])
            .setPopup(popup)
            .addTo(map);
        });

        // Add School Markers
        schools.forEach((school) => {
          const el = document.createElement('div');
          el.className = 'cursor-pointer transform hover:scale-125 transition-transform';
          el.innerHTML = `
            <div style="
              width: 24px;
              height: 24px;
              border-radius: 6px;
              background: #1e3a8a;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 11px;
            ">🏫</div>
          `;
          const sLon = typeof school.coordinates?.lon === 'number' ? school.coordinates.lon : ((school.coordinates as any)?.[1] ?? centerLon);
          const sLat = typeof school.coordinates?.lat === 'number' ? school.coordinates.lat : ((school.coordinates as any)?.[0] ?? centerLat);
          const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
            <div style="padding: 8px; font-family: sans-serif;">
              <strong>${school.name}</strong>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Students: ${school.studentCount}</div>
            </div>
          `);
          new maplibregl.Marker({ element: el }).setLngLat([sLon, sLat]).setPopup(popup).addTo(map);
        });

        // Auto fit bounds around village points
        if (sources.length > 0) {
          const bounds = new maplibregl.LngLatBounds([centerLon, centerLat], [centerLon, centerLat]);
          sources.forEach((s) => {
            const sLon = typeof s.coordinates?.lon === 'number' ? s.coordinates.lon : ((s.coordinates as any)?.[1] ?? centerLon);
            const sLat = typeof s.coordinates?.lat === 'number' ? s.coordinates.lat : ((s.coordinates as any)?.[0] ?? centerLat);
            bounds.extend([sLon, sLat]);
          });
          map.fitBounds(bounds, { padding: 45, maxZoom: 15 });
        }
      });

      mapInstanceRef.current = map;
    }).catch(console.error);

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [village, sources]);

  if (!village) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-stone-200 max-w-md">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h1 className="text-2xl font-serif font-bold text-stone-800 mb-2">Community Profile Not Found</h1>
            <p className="text-stone-500 text-sm mb-6">No village registered with identifier "{id}".</p>
            <Link href="/villages" className="px-5 py-2.5 bg-[#002116] text-white rounded-xl text-xs font-mono font-bold">
              Return to Communities Directory
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const safeCount = sources.filter(s => s.status === 'SAFE').length;
  const affectedCount = sources.filter(s => s.status !== 'SAFE').length;
  const isHighRisk = village.contaminationStatus === 'High' || affectedCount > safeCount;

  return (
    <div className="min-h-screen flex flex-col bg-[#f4fbf7] text-[#0c1f18] font-sans selection:bg-[#c3ebd8] selection:text-[#002116]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
            <Link href="/villages" className="hover:text-stone-900 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Communities
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#002116] font-bold">{village.name} Digital Twin</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/water-safety?query=${encodeURIComponent(village.name)}`}
              className="px-4 py-2 bg-[#2E8B68] text-white rounded-xl text-xs font-mono font-bold hover:bg-[#246e53] transition-colors shadow-xs"
            >
              Check Drinking Safety
            </Link>
            <Link
              href={`/reports/new?village=${encodeURIComponent(village.name)}`}
              className="px-4 py-2 bg-white border border-stone-300 text-stone-800 rounded-xl text-xs font-mono font-bold hover:bg-stone-50 transition-colors"
            >
              Report Issue Here
            </Link>
          </div>
        </div>

        {/* Village Title Banner */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-stone-200 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-[#ddf3e7] text-[#002116] font-bold border border-stone-200">
                Panchayat ID: {village.id.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-stone-500">
                {village.block} Block, {village.district} District
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#002116] tracking-tight">
              {village.name} <span className="font-serif font-normal text-stone-500">({village.hindiName})</span>
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              High-resolution hydrogeological digital twin, subsurface plume simulation, and community water supply registry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border ${
              isHighRisk 
                ? 'bg-red-50 text-red-800 border-red-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              Status: {isHighRisk ? 'Critical Contamination Action Required' : 'Moderate Advisory Active'}
            </div>
          </div>
        </div>

        {/* Main Grid: Live Map + Community Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Left: Map Area (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-stone-200 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-[#2E8B68]" />
                <h3 className="font-serif font-bold text-lg text-[#002116]">Subsurface Plume &amp; Water Point GIS</h3>
              </div>
              <span className="text-xs font-mono bg-stone-100 px-2.5 py-1 rounded text-stone-600 border border-stone-200">
                Center: {(village.coordinates?.lat ?? (village.coordinates as any)?.[0] ?? 26.465).toFixed(4)}°N, {(village.coordinates?.lon ?? (village.coordinates as any)?.[1] ?? 80.342).toFixed(4)}°E
              </span>
            </div>
            
            {/* Real MapLibre Canvas */}
            <div className="w-full h-[420px] rounded-xl overflow-hidden border border-stone-200 relative">
              <div ref={mapContainerRef} className="w-full h-full" />
              
              {/* Floating Legend */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-2.5 rounded-lg border border-stone-200 text-[11px] font-mono shadow-md space-y-1.5 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-700 border border-white"></div>
                  <span className="text-stone-700">Safe Drinking Source ({safeCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-700 border border-white"></div>
                  <span className="text-stone-700">Contaminated / Restricted ({affectedCount})</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-stone-200">
                  <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
                  <span className="text-stone-500">Hexavalent Cr Dispersion Plume</span>
                </div>
              </div>
            </div>

            {/* Temporal Simulation Control */}
            <div className="mt-5 p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-500" />
                <span className="font-bold text-stone-700">Temporal Advection Slider:</span>
                <span className="text-[#006492] font-bold">{year} Horizon</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-stone-400">2018</span>
                <input 
                  type="range" 
                  min="2018" 
                  max="2026" 
                  value={year} 
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="w-48 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#2E8B68]"
                />
                <span className="text-stone-800 font-bold">2026</span>
              </div>
            </div>
          </div>

          {/* Right: Telemetry & Demographic Profile (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h3 className="font-serif font-bold text-lg text-[#002116] mb-4 border-b border-stone-100 pb-3">
                Demographic &amp; Vulnerability Profile
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f2f8f5] p-3.5 rounded-xl border border-stone-200">
                  <div className="text-xs font-mono text-stone-500 flex items-center gap-1.5 mb-1">
                    <Users className="w-4 h-4 text-[#2E8B68]" /> Population
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#002116]">{village.population.toLocaleString()}</div>
                  <span className="text-[11px] font-mono text-stone-500">Census Baseline</span>
                </div>
                <div className="bg-[#f2f8f5] p-3.5 rounded-xl border border-stone-200">
                  <div className="text-xs font-mono text-stone-500 flex items-center gap-1.5 mb-1">
                    <Home className="w-4 h-4 text-[#006492]" /> Households
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#002116]">
                    {Math.round(village.population / 4.8).toLocaleString()}
                  </div>
                  <span className="text-[11px] font-mono text-stone-500">4.8 avg / family</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#002116] mb-4 border-b border-stone-100 pb-3">
                  Groundwater Contamination Telemetry
                </h3>
                
                <div className="space-y-4 text-xs font-mono">
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-stone-600 flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-[#006492]" /> Monitored Water Points
                    </span>
                    <strong className="text-stone-900 text-sm">{sources.length} sources</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-stone-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" /> Non-Compliant Handpumps
                    </span>
                    <strong className="text-red-700 text-sm font-bold">{affectedCount} exceeded WHO limit</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-stone-600 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Safe Verified Sources
                    </span>
                    <strong className="text-emerald-800 text-sm font-bold">{safeCount} safe for drinking</strong>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-stone-600 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-500" /> Depth to Unconfined Aquifer
                    </span>
                    <strong className="text-stone-900 text-sm">12.5 – 18.0 meters</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="font-bold text-stone-700">Vulnerability Ratio</span>
                  <span className="font-bold text-red-600">{Math.round((affectedCount / Math.max(1, sources.length)) * 100)}%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.round((affectedCount / Math.max(1, sources.length)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Detail Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden mb-8">
          <div className="flex border-b border-stone-200 overflow-x-auto bg-stone-50">
            {[
              { id: 'measurements', label: `Water Sources (${sources.length})` },
              { id: 'reports', label: `Community Reports (${reports.length})` },
              { id: 'timeline', label: `Historical Milestones (${timeline.length})` },
              { id: 'remediation', label: `Remediation Projects (${remediation.length})` },
              { id: 'geology', label: 'Hydrogeological Strata' },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3.5 font-mono text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id 
                    ? 'border-b-2 border-[#2E8B68] text-[#002116] bg-white' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-6">
            {activeTab === 'measurements' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h3 className="font-serif font-bold text-lg text-[#002116]">
                    Water Points &amp; Handpump Testing Ledger
                  </h3>
                  <span className="text-xs font-mono text-stone-500">
                    WHO Standard Threshold: 0.05 mg/L Cr(VI)
                  </span>
                </div>
                {sources.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-[#f2f8f5] text-stone-700 border-b border-stone-200">
                        <tr>
                          <th className="p-3">Source Name / ID</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Coordinates</th>
                          <th className="p-3">Depth</th>
                          <th className="p-3">Observed Cr(VI)</th>
                          <th className="p-3">Safety Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {sources.map(source => {
                          const sLat = typeof source.coordinates?.lat === 'number' ? source.coordinates.lat : ((source.coordinates as any)?.[0] ?? 26.45);
                          const sLon = typeof source.coordinates?.lon === 'number' ? source.coordinates.lon : ((source.coordinates as any)?.[1] ?? 80.35);
                          const isSafe = source.status === 'SAFE';
                          return (
                            <tr key={source.id} className="hover:bg-stone-50 transition-colors">
                              <td className="p-3 font-bold text-[#002116]">
                                <div>{source.name}</div>
                                <div className="text-[10px] text-stone-400 font-normal">ID: {source.id}</div>
                              </td>
                              <td className="p-3 text-stone-600">{source.type}</td>
                              <td className="p-3 text-stone-500">{sLat.toFixed(4)}°N, {sLon.toFixed(4)}°E</td>
                              <td className="p-3 text-stone-600">{source.depthMeters ? `${source.depthMeters}m` : '14m'}</td>
                              <td className="p-3">
                                <span className={`font-bold ${isSafe ? 'text-emerald-700' : 'text-red-700'}`}>
                                  {source.contaminant || (isSafe ? '< 0.01 mg/L' : '0.14 mg/L')}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  isSafe ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {source.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Link
                                    href={`/water-safety?source=${encodeURIComponent(source.id)}`}
                                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-[11px] font-bold"
                                  >
                                    Safety Lifeline
                                  </Link>
                                  <Link
                                    href={`/map?lat=${sLat}&lon=${sLon}`}
                                    className="px-2.5 py-1 bg-[#2E8B68]/10 hover:bg-[#2E8B68]/20 text-[#2E8B68] rounded text-[11px] font-bold"
                                  >
                                    Locate on GIS
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-stone-500 font-mono text-sm py-4">No water sources recorded for this community.</p>
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#002116]">Community Ground Observations</h3>
                    <p className="text-xs font-mono text-stone-500">Citizen telemetry and field reports recorded in {village.name}</p>
                  </div>
                  <Link 
                    href={`/reports/new?village=${encodeURIComponent(village.name)}`} 
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E8B68] hover:bg-[#246e53] text-white rounded-xl text-xs font-mono font-bold transition-colors"
                  >
                    + Submit New Observation
                  </Link>
                </div>
                {reports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reports.map(report => {
                      const photo = report.photoUrl || (report as any).photoDataUrl;
                      const rLat = typeof report.coordinates?.lat === 'number' ? report.coordinates.lat : (report.coordinates as any)?.[0];
                      const rLon = typeof report.coordinates?.lon === 'number' ? report.coordinates.lon : (report.coordinates as any)?.[1];
                      return (
                        <div key={report.id} className="p-4 border border-stone-200 rounded-xl bg-stone-50/60 hover:bg-white hover:shadow-sm transition-all space-y-3">
                          {photo && (
                            <div className="relative w-full h-36 rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                              <img 
                                src={photo} 
                                alt={report.title || report.category} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white rounded text-[10px] font-mono">
                                Photographic Evidence
                              </div>
                            </div>
                          )}
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                  report.priority === 'Critical' 
                                    ? 'bg-red-100 text-red-800' 
                                    : report.priority === 'High' 
                                    ? 'bg-amber-100 text-amber-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {report.priority || 'Medium'} Priority
                                </span>
                                <span className="text-xs font-mono text-stone-400">#{report.id}</span>
                              </div>
                              <h4 className="font-serif font-bold text-base text-[#002116] mt-1">{report.title || report.category}</h4>
                            </div>
                            <span className="text-[11px] font-mono text-stone-500 whitespace-nowrap">{new Date(report.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-stone-600 text-xs leading-relaxed line-clamp-3">{report.description}</p>
                          <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs font-mono">
                            <span className="text-stone-500">
                              Reporter: <strong className="text-stone-700">{report.reporterType || 'Resident'}</strong>
                            </span>
                            {rLat && rLon && (
                              <Link 
                                href={`/map?lat=${rLat}&lon=${rLon}`}
                                className="text-[#006492] hover:underline font-bold text-[11px]"
                              >
                                View Location on Map →
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-center">
                    <p className="text-stone-500 font-mono text-sm mb-3">No community reports filed for {village.name} yet.</p>
                    <Link href={`/reports/new?village=${encodeURIComponent(village.name)}`} className="text-xs font-mono font-bold text-[#2E8B68] hover:underline">
                      Be the first to log an environmental observation →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#002116]">Historical Hydrogeological Milestones</h3>
                    <p className="text-xs font-mono text-stone-500">Discovery, regulatory inspections, community actions &amp; remediation timeline</p>
                  </div>
                  <span className="text-xs font-mono bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600">
                    {timeline.length} Documented Milestones
                  </span>
                </div>
                {timeline.length > 0 ? (
                  <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2E8B68]/30">
                    {timeline.map((event, idx) => (
                      <div key={event.id || idx} className="relative group">
                        {/* Timeline Node Icon */}
                        <div className="absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full bg-white border-3 border-[#2E8B68] group-hover:scale-125 transition-transform shadow-xs"></div>
                        
                        <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-4 sm:p-5 hover:bg-white hover:shadow-xs transition-all">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 bg-[#ddf3e7] text-[#002116] rounded text-[11px] font-mono font-bold">
                                {event.date}
                              </span>
                              {event.type && (
                                <span className="px-2 py-0.5 bg-stone-200 text-stone-700 rounded text-[10px] font-mono uppercase font-bold">
                                  {event.type}
                                </span>
                              )}
                            </div>
                            {event.source && (
                              <span className="text-[11px] font-mono text-[#006492] font-bold">
                                Source: {event.source}
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif font-bold text-base text-[#002116] mb-1">
                            {event.title}
                          </h4>
                          <p className="text-stone-600 text-xs font-sans leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-500 font-mono text-sm py-4">No historical milestones cataloged for this village.</p>
                )}
              </div>
            )}

            {activeTab === 'remediation' && (
              <div>
                <h3 className="font-serif font-bold text-lg text-[#002116] mb-4">Active Remediation Engineering</h3>
                {remediation.length > 0 ? (
                  <div className="space-y-4">
                    {remediation.map(project => (
                      <div key={project.id} className="p-5 border border-stone-200 rounded-xl bg-stone-50 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-serif font-bold text-base text-[#002116]">{project.title || project.name}</h4>
                            <p className="text-xs font-mono text-stone-500">{project.type} · Responsible: {(project as any).responsibleOrg || project.leadAgency || 'State Groundwater Directorate'}</p>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-amber-100 text-amber-800">
                            {(project.status || project.stage || 'in_progress').replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-stone-700 leading-relaxed">{project.description || `${project.title} targeting hexavalent chromium reduction.`}</p>
                        <div>
                          <div className="flex justify-between text-xs font-mono mb-1">
                            <span className="text-stone-500">Target Progress</span>
                            <span className="font-bold text-stone-900">{project.progress ?? 65}%</span>
                          </div>
                          <div className="w-full bg-stone-200 rounded-full h-2">
                            <div className="bg-[#2E8B68] h-2 rounded-full" style={{ width: `${project.progress ?? 65}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-center">
                    <p className="text-stone-600 font-mono text-sm">No engineering interventions currently deployed in {village.name}.</p>
                    <Link href="/remediation" className="mt-3 inline-block text-xs font-mono font-bold text-[#006492] hover:underline">
                      Explore Nature-Based Remediation Options →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'geology' && (
              <div className="space-y-4 text-xs font-mono">
                <h3 className="font-serif font-bold text-lg text-[#002116]">Alluvial Subsurface Hydrostratigraphy</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">0 – 3.5m: Vadose Zone</strong>
                    <p className="text-stone-600">Fine silt loam with moderate permeability. Primary zone of surface industrial deposition.</p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">3.5 – 18.0m: Unconfined Aquifer</strong>
                    <p className="text-stone-600">Medium micaceous sand. Primary drinking layer tapped by community handpumps. Plume advection active.</p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">18.0m+: Confining Clay Aquitard</strong>
                    <p className="text-stone-600">Dense silty clay forming a natural hydrodynamic barrier protecting deep artesian aquifers.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

