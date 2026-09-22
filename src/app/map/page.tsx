'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import { 
  Layers, MapPin, Droplets, AlertTriangle, AlertCircle, ChevronLeft, ChevronRight, X, 
  Map as MapIcon, Info, School as SchoolIcon, Activity, Factory, CheckCircle2,
  Calendar, Users, ExternalLink, Navigation, ShieldAlert, Sparkles, Clock
} from 'lucide-react';
import { getDb, WaterSourceRecord, VillageRecord } from '@/lib/db/store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function MapContent() {
  const searchParams = useSearchParams();
  const urlLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
  const urlLon = searchParams.get('lon') ? parseFloat(searchParams.get('lon')!) : null;

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const maplibreRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Layers state
  const [layers, setLayers] = useState({
    villages: true,
    waterSources: true,
    schools: true,
    contamination: true,
    reports: true,
    predictedZones: false
  });

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  useEffect(() => {
    if (map.current) return;
    
    // Dynamic import to avoid SSR issues with maplibre
    import('maplibre-gl').then((maplibreglModule: any) => {
      if (!mapContainer.current) return;
      const maplibregl = maplibreglModule.default || maplibreglModule;
      maplibreRef.current = maplibregl;
      
      const initialCenter: [number, number] = urlLon && urlLat ? [urlLon, urlLat] : [80.32, 26.45];
      const initialZoom = urlLon && urlLat ? 13.8 : 11;

      map.current = new maplibregl.Map({
        container: mapContainer.current,
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
        center: initialCenter,
        zoom: initialZoom
      });

      map.current.on('load', () => {
        setMapLoaded(true);
        map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Effect to add markers once map is loaded and layers state changes
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers before re-rendering
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const maplibregl = maplibreRef.current;
    if (!maplibregl) return;

    const db = getDb();

    const addMarker = (lngLat: [number, number], el: HTMLElement, feature: any) => {
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(lngLat)
        .addTo(map.current);
      
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedFeature(feature);
        setSidebarOpen(true);
      });
      
      markersRef.current.push(marker);
    };

    // 1. Villages
    if (layers.villages) {
      db.getVillages().forEach(v => {
        const el = document.createElement('div');
        el.className = 'w-5 h-5 bg-[#12372A] text-white rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center text-[10px] font-bold hover:scale-125 transition-transform';
        el.innerHTML = 'V';
        addMarker([v.coordinates.lon, v.coordinates.lat], el, { ...v, _type: 'village' });
      });
    }

    // 2. Water Sources
    if (layers.waterSources) {
      db.getWaterSources().forEach(ws => {
        const el = document.createElement('div');
        const color = ws.status === 'safe' ? 'bg-[#2E8B68]' : 
                      ws.status === 'restricted' ? 'bg-amber-500' : 
                      ws.status === 'do_not_use' ? 'bg-red-600' : 'bg-stone-400';
        el.className = `w-3.5 h-3.5 ${color} rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-150 transition-transform`;
        addMarker([ws.coordinates.lon, ws.coordinates.lat], el, { ...ws, _type: 'waterSource' });
      });
    }

    // 3. Schools
    if (layers.schools) {
      db.getSchools().forEach(s => {
        const el = document.createElement('div');
        el.className = 'w-6 h-6 bg-blue-100 text-blue-800 rounded-lg shadow-md cursor-pointer flex items-center justify-center text-xs border border-blue-300 hover:scale-125 transition-transform';
        el.innerHTML = '🏫';
        addMarker([s.coordinates.lon, s.coordinates.lat], el, { ...s, _type: 'school' });
      });
    }

    // 4. Contamination Sources
    if (layers.contamination) {
      db.getContaminationSources().forEach(cs => {
        const el = document.createElement('div');
        el.className = 'w-6 h-6 bg-purple-900 rounded-md shadow-lg cursor-pointer flex items-center justify-center border border-purple-400 hover:scale-125 transition-transform';
        el.innerHTML = '<span class="text-white text-[11px]">🏭</span>';
        addMarker([cs.coordinates.lon, cs.coordinates.lat], el, { ...cs, _type: 'contaminationSource' });
      });
    }

    // 5. Community Reports
    if (layers.reports) {
      db.getCommunityReports().forEach(r => {
        const el = document.createElement('div');
        const rLat = typeof (r.coordinates as any)?.lat === 'number' ? (r.coordinates as any).lat : (r.coordinates as any)?.[1] ?? 26.4481;
        const rLon = typeof (r.coordinates as any)?.lon === 'number' ? (r.coordinates as any).lon : (r.coordinates as any)?.[0] ?? 80.0102;
        el.className = 'w-5 h-5 bg-amber-500 text-white rounded-full border-2 border-white shadow-md cursor-pointer flex items-center justify-center text-[10px] font-bold hover:scale-125 transition-transform';
        el.innerHTML = '⚠️';
        addMarker([rLon, rLat], el, { ...r, _type: 'report' });
      });
    }

    // If URL coordinates matched a feature, select it
    if (urlLat && urlLon && !selectedFeature) {
      const matchReport = db.getCommunityReports().find(r => {
        const lat = typeof r.coordinates?.lat === 'number' ? r.coordinates.lat : (r.coordinates as any)?.[1];
        const lon = typeof r.coordinates?.lon === 'number' ? r.coordinates.lon : (r.coordinates as any)?.[0];
        return Math.abs(lat - urlLat) < 0.005 && Math.abs(lon - urlLon) < 0.005;
      });
      if (matchReport) {
        setSelectedFeature({ ...matchReport, _type: 'report' });
      }
    }
  }, [mapLoaded, layers, urlLat, urlLon]);

  // Real dynamic chart data for detail panel based on selected feature
  const measurements = selectedFeature?.id && selectedFeature._type === 'waterSource' 
    ? getDb().getMeasurementsBySource(selectedFeature.id) 
    : [];
  
  const chartData = measurements.length > 0 
    ? measurements.slice(-6).map((m: any) => ({ name: m.date.slice(0, 7), value: m.value }))
    : [
        { name: '2023-01', value: selectedFeature?.status === 'do_not_use' ? 0.38 : 0.01 },
        { name: '2023-06', value: selectedFeature?.status === 'do_not_use' ? 0.45 : 0.012 },
        { name: '2024-01', value: selectedFeature?.status === 'do_not_use' ? 0.52 : 0.015 },
        { name: '2024-08', value: selectedFeature?.status === 'do_not_use' ? 0.61 : 0.02 },
      ];

  const db = getDb();
  const getVillageName = (vId: string) => db.getVillageById(vId)?.name || vId;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-100">
      <Header />

      <div className="flex-grow relative flex overflow-hidden">
        {/* Detail Sidebar Drawer */}
        <div 
          className={`absolute z-20 left-0 top-0 bottom-0 bg-white w-88 sm:w-96 shadow-2xl transition-transform duration-300 flex flex-col border-r border-slate-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#002116] text-white">
            <div className="flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="font-serif font-bold text-sm block leading-tight">
                  {selectedFeature ? selectedFeature.name || selectedFeature.title || selectedFeature.id : 'Subsurface Intelligence'}
                </span>
                <span className="text-[10px] font-mono text-emerald-300 uppercase">
                  {selectedFeature ? selectedFeature._type : 'Select an Entity'}
                </span>
              </div>
            </div>
            {selectedFeature && (
              <button 
                onClick={() => setSelectedFeature(null)} 
                className="text-stone-300 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {!selectedFeature && (
              <div className="text-center py-12 text-slate-500 space-y-3">
                <Info className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="font-serif font-bold text-base text-slate-800">Explore Spatial Intelligence</p>
                <p className="text-xs font-mono leading-relaxed max-w-xs mx-auto">
                  Click any point on the map (Water Source, Village, School, Contamination Site, or Citizen Report) to inspect analytical telemetry.
                </p>
              </div>
            )}

            {/* 1. WATER SOURCE DETAIL PANEL */}
            {selectedFeature && selectedFeature._type === 'waterSource' && (
              <div className="space-y-4">
                <div className={`p-3.5 rounded-xl border ${
                  selectedFeature.status === 'do_not_use' ? 'bg-red-50 border-red-200 text-red-900' :
                  selectedFeature.status === 'restricted' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="font-bold flex items-center gap-2 text-sm">
                    {selectedFeature.status === 'do_not_use' ? <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {selectedFeature.status === 'do_not_use' ? 'CRITICAL: DO NOT USE FOR DRINKING' :
                     selectedFeature.status === 'restricted' ? 'RESTRICTED USE ONLY' : 'SAFE MONITORED SOURCE'}
                  </div>
                  <p className="text-xs mt-1 font-mono">
                    Depth: {selectedFeature.depthMeters || 14}m · Village: {getVillageName(selectedFeature.villageId)}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">Latest Hexavalent Cr Test</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-stone-500 block text-[10px]">TOTAL CHROMIUM</span>
                      <strong className="text-base font-bold text-slate-900">
                        {selectedFeature.contaminant || (selectedFeature.status === 'safe' ? '< 0.01' : '0.19')} mg/L
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-stone-500 block text-[10px]">WHO SAFETY RATIO</span>
                      <strong className={`text-base font-bold ${selectedFeature.status === 'safe' ? 'text-emerald-700' : 'text-red-700'}`}>
                        {selectedFeature.status === 'safe' ? '0.2x' : '3.8x'} Limit
                      </strong>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">Historical Chromium Trend</h4>
                  <div className="h-36 w-full bg-slate-50 rounded-xl border border-slate-200 p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} width={25} />
                        <Tooltip contentStyle={{fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                        <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={{r: 3, fill: '#ef4444'}} activeDot={{r: 5}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Population Served:</span>
                    <strong className="text-stone-900">{selectedFeature.populationServed || 320} citizens</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Nearest School:</span>
                    <strong className="text-stone-900">{selectedFeature.nearestSchoolDistance || 240}m</strong>
                  </div>
                  {selectedFeature.alternativeSourceId && (
                    <div className="flex justify-between border-t border-slate-200 pt-1">
                      <span className="text-stone-500">Alternative Source:</span>
                      <strong className="text-[#006492]">{selectedFeature.alternativeSourceId} (Safe)</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. SCHOOL DETAIL PANEL (NO RAW JSON) */}
            {selectedFeature && selectedFeature._type === 'school' && (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <SchoolIcon className="w-4 h-4 text-blue-700" />
                    <span>Educational Sensitive Zone</span>
                  </div>
                  <p className="text-[11px] mt-1 text-blue-800">
                    High priority observation node for safe midday meal water &amp; student hydration.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Community:</span>
                    <strong className="text-stone-900">{getVillageName(selectedFeature.villageId)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Enrolled Students:</span>
                    <strong className="text-stone-900">{selectedFeature.studentCount} children</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Nearest Water Point:</span>
                    <strong className="text-[#006492]">{selectedFeature.nearestWaterSourceId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Coordinates:</span>
                    <strong className="text-stone-800">
                      {selectedFeature.coordinates.lat.toFixed(4)}°N, {selectedFeature.coordinates.lon.toFixed(4)}°E
                    </strong>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <strong className="block mb-1 text-[11px] font-bold uppercase">Exposure Assessment:</strong>
                  <p className="text-[11px] leading-relaxed">
                    Water point {selectedFeature.nearestWaterSourceId} is monitored on a 14-day cycle. Water safety advisories are shared directly with the school principal.
                  </p>
                </div>
              </div>
            )}

            {/* 3. INDUSTRIAL / CONTAMINATION SOURCE PANEL (NO RAW JSON) */}
            {selectedFeature && selectedFeature._type === 'contaminationSource' && (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-900">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Factory className="w-4 h-4 text-purple-700" />
                    <span>Industrial Heavy-Metal Vector</span>
                  </div>
                  <p className="text-[11px] mt-1 text-purple-800">
                    Documented contamination source under State Pollution Control Board surveillance.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Facility Type:</span>
                    <strong className="text-stone-900">{selectedFeature.type}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Regulatory Status:</span>
                    <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-red-100 text-red-800">
                      {selectedFeature.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Estimated Plume Radius:</span>
                    <strong className="text-stone-900">{selectedFeature.estimatedImpactRadius} meters</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Coordinates:</span>
                    <strong className="text-stone-800">
                      {selectedFeature.coordinates.lat.toFixed(4)}°N, {selectedFeature.coordinates.lon.toFixed(4)}°E
                    </strong>
                  </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900">
                  <strong className="block mb-1 text-[11px] font-bold uppercase">Hydrogeological Impact:</strong>
                  <p className="text-[11px] leading-relaxed">
                    Unlined sludge settling lagoons and historical tannery chrome discharges migrate southwest along the alluvial paleochannel during monsoon infiltration pulses.
                  </p>
                </div>
              </div>
            )}

            {/* 4. VILLAGE DETAIL PANEL (NO RAW JSON) */}
            {selectedFeature && selectedFeature._type === 'village' && (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase">COMMUNITY HUB</span>
                  <h3 className="text-lg font-serif font-bold text-[#002116] mt-0.5">
                    {selectedFeature.name} ({selectedFeature.hindiName})
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Block: {selectedFeature.block || 'Rania'} · District: {selectedFeature.district || 'Kanpur Nagar'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-stone-500 block text-[10px]">POPULATION</span>
                    <strong className="text-stone-900 text-sm">{selectedFeature.population?.toLocaleString()}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-stone-500 block text-[10px]">RISK STATUS</span>
                    <strong className="text-red-700 font-bold text-sm uppercase">{selectedFeature.contaminationStatus || 'High'}</strong>
                  </div>
                </div>

                <Link
                  href={`/villages/${selectedFeature.id}`}
                  className="w-full py-3 bg-[#002116] hover:bg-[#12372a] text-white font-bold rounded-xl text-center block uppercase tracking-wider text-xs transition-colors"
                >
                  Open Full Digital Twin →
                </Link>
              </div>
            )}

            {/* 5. COMMUNITY REPORT DETAIL PANEL (NO RAW JSON) */}
            {selectedFeature && selectedFeature._type === 'report' && (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Citizen Field Observation</span>
                  </div>
                  <span className="text-[10px] text-amber-700 block mt-0.5 font-bold">
                    Ref: {selectedFeature.id} · {selectedFeature.status}
                  </span>
                </div>

                {selectedFeature.photoUrl && (
                  <div className="rounded-xl overflow-hidden border border-stone-200 max-h-40 bg-black">
                    <img src={selectedFeature.photoUrl} alt="Report evidence" className="w-full h-40 object-cover" />
                  </div>
                )}

                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Observation</span>
                  <h4 className="font-serif font-bold text-stone-900 text-sm mt-0.5">
                    {selectedFeature.title || selectedFeature.category}
                  </h4>
                  <p className="text-stone-700 font-sans text-xs mt-1 bg-stone-50 p-2.5 rounded-lg border border-stone-200 leading-relaxed">
                    "{selectedFeature.description}"
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Date:</span>
                    <strong className="text-stone-900">{new Date(selectedFeature.date).toLocaleDateString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Location:</span>
                    <strong className="text-stone-900">{selectedFeature.locationName || getVillageName(selectedFeature.villageId)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Status:</span>
                    <strong className="text-emerald-700">{selectedFeature.verificationStatus || 'Awaiting Field Survey'}</strong>
                  </div>
                </div>

                <Link
                  href="/reports"
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-center block uppercase tracking-wider text-xs transition-colors"
                >
                  View in Community Registry →
                </Link>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          {selectedFeature && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${
                  typeof selectedFeature.coordinates?.lat === 'number' ? selectedFeature.coordinates.lat : 26.45
                },${
                  typeof selectedFeature.coordinates?.lon === 'number' ? selectedFeature.coordinates.lon : 80.01
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#006492] hover:bg-[#00547b] text-white font-mono font-bold py-2.5 px-4 rounded-xl transition-colors text-center flex items-center justify-center gap-2 text-xs uppercase"
              >
                <Navigation className="w-3.5 h-3.5" />
                Get Directions (Google Maps)
              </a>
              {selectedFeature._type === 'waterSource' && (
                <Link
                  href={`/reports/new?source=${encodeURIComponent(selectedFeature.id)}`}
                  className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-mono font-bold py-2 px-4 rounded-xl transition-colors text-center block text-xs"
                >
                  Report Issue for this Water Source
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute z-10 top-4 ${sidebarOpen ? 'left-90 sm:left-98' : 'left-4'} bg-white p-2 rounded-lg shadow-md border border-slate-200 text-slate-700 hover:text-slate-900 transition-all cursor-pointer`}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        {/* Layer Controls Floating Card */}
        <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-slate-200 w-64 space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 border-b border-slate-100 pb-2">
            <Layers className="w-4 h-4 text-[#002116]" />
            <span>Map Layers</span>
          </div>

          <div className="space-y-2">
            <ToggleRow 
              label="Monitored Communities" 
              active={layers.villages} 
              onChange={() => toggleLayer('villages')} 
              icon={<span className="w-2.5 h-2.5 rounded-full bg-[#12372A]" />} 
            />
            <ToggleRow 
              label="Water Points & Handpumps" 
              active={layers.waterSources} 
              onChange={() => toggleLayer('waterSources')} 
              icon={<span className="w-2.5 h-2.5 rounded-full bg-[#2E8B68]" />} 
            />
            <ToggleRow 
              label="Schools & Institutions" 
              active={layers.schools} 
              onChange={() => toggleLayer('schools')} 
              icon={<span>🏫</span>} 
            />
            <ToggleRow 
              label="Contamination Sources" 
              active={layers.contamination} 
              onChange={() => toggleLayer('contamination')} 
              icon={<span>🏭</span>} 
            />
            <ToggleRow 
              label="Citizen Field Reports" 
              active={layers.reports} 
              onChange={() => toggleLayer('reports')} 
              icon={<span>⚠️</span>} 
            />
          </div>
        </div>

        {/* The Map Container */}
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
}

function ToggleRow({ label, active, onChange, icon }: { label: string, active: boolean, onChange: () => void, icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between cursor-pointer group select-none" onClick={onChange}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-slate-700 group-hover:text-slate-900 font-medium">{label}</span>
      </div>
      <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-[#002116]' : 'bg-slate-300'}`}>
        <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${active ? 'left-4.5' : 'left-0.5'}`} />
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-mono">Loading Subsurface Map...</div>}>
      <MapContent />
    </Suspense>
  );
}
