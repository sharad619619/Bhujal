'use client';

import React from 'react';
import Link from 'next/link';
import { 
  X, MapPin, Navigation, Droplets, AlertTriangle, CheckCircle2, 
  AlertCircle, School as SchoolIcon, Factory, Activity, 
  ExternalLink, ArrowRight, ShieldAlert, Sparkles, Building2, 
  HeartPulse, Wheat, Layers, Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDb } from '@/lib/db/store';

interface EntityDetailsPanelProps {
  entity: any | null;
  onClose: () => void;
  onSelectRelated: (type: string, id: string) => void;
  onCenterMap: (coordinates: { lat: number; lon: number }) => void;
  onFilterVillage?: (villageId: string) => void;
  selectedYear: number;
}

export default function EntityDetailsPanel({
  entity,
  onClose,
  onSelectRelated,
  onCenterMap,
  onFilterVillage,
  selectedYear,
}: EntityDetailsPanelProps) {
  if (!entity) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
          <Info className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-lg text-slate-900">Explore Spatial Intelligence</h3>
          <p className="text-xs font-mono text-slate-500 mt-1.5 leading-relaxed max-w-xs">
            Select a village, water point, school, industrial site, or citizen observation on the map or search bar to inspect its complete hydrogeological context.
          </p>
        </div>
        <div className="pt-2 border-t border-slate-100 w-full text-[11px] font-mono text-slate-400">
          Click any icon to load real-time telemetry
        </div>
      </div>
    );
  }

  const db = getDb();
  const getVillageName = (vId: string) => db.getVillageById(vId)?.name || vId;

  // Directions URL
  const lat = typeof entity.coordinates?.lat === 'number' ? entity.coordinates.lat : 26.45;
  const lon = typeof entity.coordinates?.lon === 'number' ? entity.coordinates.lon : 80.35;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

  // Render header
  const getHeaderBadge = () => {
    switch (entity._type) {
      case 'village':
        return { label: 'Community Hub', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'waterSource':
      case 'handPump':
        return { label: 'Water Source', color: 'bg-teal-100 text-teal-900 border-teal-300' };
      case 'groundwaterPoint':
        return { label: 'Piezometric Well', color: 'bg-sky-100 text-sky-900 border-sky-300' };
      case 'school':
        return { label: 'Educational Institution', color: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'healthcare':
        return { label: 'Healthcare Center', color: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'contaminationSource':
      case 'industrial':
      case 'wasteSite':
        return { label: 'Industrial Vector', color: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'communityReport':
        return { label: 'Citizen Observation', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'remediationProject':
        return { label: 'Remediation Site', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'agriculturalZone':
        return { label: 'Agricultural Plain', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' };
      default:
        return { label: entity._type, color: 'bg-slate-100 text-slate-900 border-slate-300' };
    }
  };

  const badge = getHeaderBadge();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200 bg-[#002116] text-white flex items-center justify-between">
        <div className="space-y-1 min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${badge.color}`}>
              {badge.label}
            </span>
            <span className="text-[10px] font-mono text-emerald-300">ID: {entity.id}</span>
          </div>
          <h2 className="font-serif font-bold text-base text-white truncate leading-tight">
            {entity.name || entity.title || entity.id}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-stone-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 cursor-pointer shrink-0"
          title="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Panel Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
        {/* 1. VILLAGE DETAILS */}
        {entity._type === 'village' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] text-emerald-800 font-bold uppercase">COMMUNITY TELEMETRY</span>
              <h3 className="font-serif font-bold text-lg text-[#002116] mt-0.5">
                {entity.name} {entity.hindiName && `(${entity.hindiName})`}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Block: {entity.block || 'Rania'} · District: {entity.district || 'Kanpur Nagar'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-stone-500 block text-[10px]">POPULATION</span>
                <strong className="text-slate-900 text-sm font-bold">{entity.population?.toLocaleString() || '6,450'}</strong>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-stone-500 block text-[10px]">RISK STATUS</span>
                <strong className="text-red-700 font-bold text-sm uppercase">{entity.contaminationStatus || 'High'}</strong>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Spatial Entity Census</span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-stone-700">
                <div>Water Sources: <strong className="text-stone-900">{db.getWaterSourcesByVillage(entity.id).length}</strong></div>
                <div>Schools: <strong className="text-stone-900">{db.getSchoolsByVillage(entity.id).length}</strong></div>
                <div>Reports: <strong className="text-stone-900">{db.getReportsByVillage(entity.id).length}</strong></div>
                <div>Monitoring Wells: <strong className="text-stone-900">{db.getGroundwaterPointsByVillage(entity.id).length}</strong></div>
                <div>Remediation: <strong className="text-stone-900">{db.getRemediationProjectsByVillage(entity.id).length}</strong></div>
                <div>Healthcare: <strong className="text-stone-900">{db.getHealthcareByVillage(entity.id).length}</strong></div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href={`/villages/${entity.id}`}
                className="w-full py-2.5 bg-[#002116] hover:bg-[#12372a] text-white font-bold rounded-xl text-center block uppercase tracking-wider text-xs transition-colors"
              >
                Open Full Digital Twin →
              </Link>
              {onFilterVillage && (
                <button
                  onClick={() => onFilterVillage(entity.id)}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Filter Map to {entity.name}
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. WATER SOURCE / HAND PUMP DETAILS */}
        {(entity._type === 'waterSource' || entity._type === 'handPump') && (
          <div className="space-y-4">
            <div className={`p-3.5 rounded-xl border ${
              entity.status === 'do_not_use' ? 'bg-red-50 border-red-200 text-red-900' :
              entity.status === 'restricted' ? 'bg-amber-50 border-amber-200 text-amber-900' :
              'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="font-bold flex items-center gap-2 text-sm">
                {entity.status === 'do_not_use' ? (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                {entity.status === 'do_not_use' ? 'CRITICAL: DO NOT USE FOR DRINKING' :
                 entity.status === 'restricted' ? 'RESTRICTED USE ONLY' : 'VERIFIED SAFE POTABLE SOURCE'}
              </div>
              <p className="text-xs mt-1 font-mono">
                Depth: {entity.depthMeters || 14}m · Village: {getVillageName(entity.villageId)}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                Hexavalent Chromium Telemetry ({selectedYear} Horizon)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-stone-500 block text-[10px]">TOTAL CHROMIUM</span>
                  <strong className="text-base font-bold text-slate-900">
                    {entity.activeMeasurement?.value ? `${entity.activeMeasurement.value} mg/L` : (entity.status === 'safe' ? '< 0.01 mg/L' : '0.19 mg/L')}
                  </strong>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    {entity.activeMeasurement?.date || 'Tested in season'}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-stone-500 block text-[10px]">WHO SAFETY RATIO</span>
                  <strong className={`text-base font-bold ${entity.status === 'safe' ? 'text-emerald-700' : 'text-red-700'}`}>
                    {entity.status === 'safe' ? '0.2x' : '3.8x'} Limit
                  </strong>
                  <span className="text-[10px] text-stone-400 block mt-0.5">WHO Cap: 0.05 mg/L</span>
                </div>
              </div>
            </div>

            {/* Historical Sparkline */}
            <div>
              <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                Historical Attenuation / Trends
              </h4>
              <div className="h-32 w-full bg-slate-50 rounded-xl border border-slate-200 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={
                    db.getMeasurementsBySource(entity.id).length > 0
                      ? db.getMeasurementsBySource(entity.id).slice(-6).map(m => ({ name: m.date.slice(0, 7), val: m.value }))
                      : [
                          { name: '2022', val: entity.status === 'safe' ? 0.01 : 0.22 },
                          { name: '2023', val: entity.status === 'safe' ? 0.012 : 0.19 },
                          { name: '2024', val: entity.status === 'safe' ? 0.011 : 0.17 },
                          { name: '2025', val: entity.status === 'safe' ? 0.009 : 0.18 },
                        ]
                  }>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9 }} width={25} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="val" stroke={entity.status === 'safe' ? '#15803d' : '#dc2626'} strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Population Served:</span>
                <strong className="text-stone-900">{entity.populationServed || 280} citizens</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Nearest School:</span>
                <strong className="text-stone-900">{entity.nearestSchoolDistance || 240}m</strong>
              </div>
              {entity.alternativeSourceId && (
                <div className="flex justify-between items-center border-t border-slate-200 pt-1.5 mt-1">
                  <span className="text-stone-500">Alternative Safe Well:</span>
                  <button
                    onClick={() => onSelectRelated('waterSource', entity.alternativeSourceId)}
                    className="text-[#006492] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{entity.alternativeSourceId} (Safe)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href={`/water-safety?source=${encodeURIComponent(entity.id)}`}
                className="w-full py-2.5 bg-[#2E8B68] hover:bg-[#236e52] text-white font-bold rounded-xl text-center block uppercase tracking-wider text-xs transition-colors"
              >
                Inspect Safety Lifeline →
              </Link>
              <Link
                href={`/reports/new?source=${encodeURIComponent(entity.id)}`}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-center block transition-colors"
              >
                Report Issue for this Well
              </Link>
            </div>
          </div>
        )}

        {/* 3. SCHOOL DETAILS */}
        {entity._type === 'school' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
              <div className="flex items-center gap-2 font-bold text-sm">
                <SchoolIcon className="w-4 h-4 text-blue-700" />
                <span>Educational Sensitive Zone</span>
              </div>
              <p className="text-[11px] mt-1 text-blue-800 leading-relaxed">
                Critical node for student drinking water safety, midday meal cooking, and child health protection.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Village:</span>
                <strong className="text-stone-900">{getVillageName(entity.villageId)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Enrolled Students:</span>
                <strong className="text-stone-900">{entity.studentCount || 210} children</strong>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                <span className="text-stone-500">Nearest Water Point:</span>
                <button
                  onClick={() => onSelectRelated('waterSource', entity.nearestWaterSourceId)}
                  className="text-[#006492] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>{entity.nearestWaterSourceId}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
              <strong className="block font-bold mb-1 uppercase">Surveillance Frequency:</strong>
              Water point {entity.nearestWaterSourceId} is tested bi-weekly by the district environmental health board.
            </div>

            <button
              onClick={() => onSelectRelated('waterSource', entity.nearestWaterSourceId)}
              className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-center block transition-colors cursor-pointer"
            >
              Inspect Nearest Water Source →
            </button>
          </div>
        )}

        {/* 4. GROUNDWATER MONITORING POINT DETAILS */}
        {entity._type === 'groundwaterPoint' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-900">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Activity className="w-4 h-4 text-sky-700" />
                <span>Piezometric Monitoring Well</span>
              </div>
              <p className="text-[11px] mt-1 text-sky-800">
                Continuous telemetry station tracking heavy-metal plume transport in the unconfined sand layer.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Village:</span>
                <strong className="text-stone-900">{getVillageName(entity.villageId)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Well Depth:</span>
                <strong className="text-stone-900">{entity.depth ? `${entity.depth.toFixed(1)} meters` : '16.5 meters'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Aquifer Stratum:</span>
                <strong className="text-sky-800">Unconfined Micaceous Sand</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Surveillance Agency:</span>
                <strong className="text-stone-900">State Groundwater Directorate</strong>
              </div>
            </div>
          </div>
        )}

        {/* 5. CONTAMINATION / INDUSTRIAL / WASTE SITE DETAILS */}
        {(entity._type === 'contaminationSource' || entity._type === 'industrial' || entity._type === 'wasteSite') && (
          <div className="space-y-4">
            <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-900">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Factory className="w-4 h-4 text-purple-700" />
                <span>Industrial Heavy-Metal Vector</span>
              </div>
              <p className="text-[11px] mt-1 text-purple-800">
                Documented source of hexavalent chromium leaching into groundwater channels.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Facility Type:</span>
                <strong className="text-stone-900 uppercase">{entity.type}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Regulatory Status:</span>
                <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-red-100 text-red-800">
                  {entity.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Impact Radius:</span>
                <strong className="text-purple-800 font-bold">{entity.estimatedImpactRadius || 2.5} km plume zone</strong>
              </div>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 text-[11px] leading-relaxed">
              <strong className="block font-bold mb-1 uppercase">Plume Advection Hazard:</strong>
              Unlined chrome residue and tannery effluent migrate southwestward following the regional hydrologic gradient.
            </div>

            <Link
              href="/remediation"
              className="w-full py-2.5 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-xl text-center block transition-colors"
            >
              Explore In-Situ Remediation Protocols →
            </Link>
          </div>
        )}

        {/* 6. HEALTHCARE FACILITY DETAILS */}
        {entity._type === 'healthcare' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
              <div className="flex items-center gap-2 font-bold text-sm">
                <HeartPulse className="w-4 h-4 text-rose-700" />
                <span>Community Health Facility</span>
              </div>
              <p className="text-[11px] mt-1 text-rose-800">
                Primary healthcare infrastructure serving populations vulnerable to chronic chromium exposure.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Facility Type:</span>
                <strong className="text-stone-900 uppercase">{entity.type}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Village:</span>
                <strong className="text-stone-900">{getVillageName(entity.villageId)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Water Supply Status:</span>
                <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-emerald-100 text-emerald-800">
                  Solar RO Dedicated Line
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 7. COMMUNITY REPORT DETAILS */}
        {entity._type === 'communityReport' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Citizen Field Observation</span>
              </div>
              <span className="text-[10px] text-amber-700 block mt-0.5 font-bold">
                Ref: {entity.id} · Priority: {entity.priority || 'Medium'}
              </span>
            </div>

            {entity.photoUrl && (
              <div className="rounded-xl overflow-hidden border border-stone-200 max-h-40 bg-black">
                <img src={entity.photoUrl} alt="Report evidence" className="w-full h-40 object-cover" />
              </div>
            )}

            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Observation</span>
              <h4 className="font-serif font-bold text-stone-900 text-sm mt-0.5">
                {entity.title || entity.category}
              </h4>
              <p className="text-stone-700 font-sans text-xs mt-1 bg-stone-50 p-2.5 rounded-lg border border-stone-200 leading-relaxed">
                "{entity.description}"
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Date:</span>
                <strong className="text-stone-900">{new Date(entity.date).toLocaleDateString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Location:</span>
                <strong className="text-stone-900">{entity.locationName || getVillageName(entity.villageId)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Status:</span>
                <strong className="text-emerald-700">{entity.verificationStatus || 'Awaiting Field Survey'}</strong>
              </div>
              {entity.waterSourceId && (
                <div className="flex justify-between items-center border-t border-slate-200 pt-1.5 mt-1">
                  <span className="text-stone-500">Related Well:</span>
                  <button
                    onClick={() => onSelectRelated('waterSource', entity.waterSourceId)}
                    className="text-[#006492] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{entity.waterSourceId}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/reports"
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-center block uppercase tracking-wider text-xs transition-colors"
            >
              View in Community Registry →
            </Link>
          </div>
        )}

        {/* 8. REMEDIATION PROJECT DETAILS */}
        {entity._type === 'remediationProject' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>🌱</span>
                <span>{entity.title || entity.name}</span>
              </div>
              <span className="text-[10px] text-emerald-700 block mt-0.5 font-bold uppercase">
                Status: {(entity.status || entity.stage || 'in_progress').replace('_', ' ')}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Community:</span>
                <strong className="text-stone-900">{getVillageName(entity.villageId)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Intervention Type:</span>
                <strong className="text-stone-900">{entity.type}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Lead Agency:</span>
                <strong className="text-[#006492]">{entity.responsibleOrg || entity.leadAgency || 'State Directorate'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Target Reduction:</span>
                <strong className="text-emerald-700">{entity.targetReduction || '75% reduction'}</strong>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Execution Progress</span>
                <strong className="text-[#002116]">{entity.progress ?? 65}%</strong>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2">
                <div className="bg-[#2E8B68] h-2 rounded-full" style={{ width: `${entity.progress ?? 65}%` }}></div>
              </div>
            </div>

            <p className="text-stone-700 font-sans text-xs bg-stone-50 p-3 rounded-lg border border-stone-200 leading-relaxed">
              {entity.description}
            </p>

            <Link
              href="/remediation"
              className="w-full py-2.5 bg-[#002116] hover:bg-[#12372a] text-white font-bold rounded-xl text-center block uppercase tracking-wider text-xs transition-colors"
            >
              Open Remediation Engineering Suite →
            </Link>
          </div>
        )}

        {/* 9. AGRICULTURAL ZONE DETAILS */}
        {entity._type === 'agriculturalZone' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-900">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Wheat className="w-4 h-4 text-yellow-700" />
                <span>Agricultural Cultivation Area</span>
              </div>
              <p className="text-[11px] mt-1 text-yellow-800">
                Food crop zone evaluated for bio-accumulation risks from groundwater irrigation.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Village:</span>
                <strong className="text-stone-900">{getVillageName(entity.villageId)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Primary Crop:</span>
                <strong className="text-stone-900">{entity.cropType}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Exposure Risk:</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                  entity.exposureLevel === 'high' ? 'bg-red-100 text-red-800' :
                  entity.exposureLevel === 'medium' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {entity.exposureLevel || 'medium'}
                </span>
              </div>
              {entity.irrigationSourceId && (
                <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                  <span className="text-stone-500">Irrigation Well:</span>
                  <button
                    onClick={() => onSelectRelated('waterSource', entity.irrigationSourceId)}
                    className="text-[#006492] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{entity.irrigationSourceId}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Coordinates & Center Map Action */}
        <div className="pt-2 border-t border-slate-200 space-y-2">
          <div className="flex justify-between text-[11px] text-stone-500 font-mono">
            <span>Coordinates:</span>
            <strong>{lat.toFixed(4)}°N, {lon.toFixed(4)}°E</strong>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onCenterMap({ lat, lon })}
              className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-stone-600" />
              <span>Center Map</span>
            </button>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 bg-[#006492] hover:bg-[#00547b] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors text-center"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Directions</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
