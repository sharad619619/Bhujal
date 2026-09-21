'use client';

import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/layout/Header';
import { 
  Layers, MapPin, Droplets, AlertTriangle, AlertCircle, ChevronLeft, ChevronRight, X, 
  Map as MapIcon, Info, School as SchoolIcon, Activity
} from 'lucide-react';
import { 
  demoVillages, demoWaterSources, demoSchools, demoContaminationSources, demoMeasurements
} from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MapPage() {
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
    predictedZones: false
  });

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  useEffect(() => {
    if (map.current) return;
    
    // Dynamic import to avoid SSR issues with maplibre
    import('maplibre-gl').then(maplibregl => {
      if (!mapContainer.current) return;
      maplibreRef.current = maplibregl;
      
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
        center: [80.32, 26.45],
        zoom: 11
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

    const addMarker = (lngLat: [number, number], el: HTMLElement, feature: any) => {
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(lngLat)
        .addTo(map.current);
      
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedFeature(feature);
      });
      
      markersRef.current.push(marker);
    };

    if (layers.villages) {
      demoVillages.forEach(v => {
        const el = document.createElement('div');
        el.className = 'w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md cursor-pointer';
        addMarker([v.coordinates.lon, v.coordinates.lat], el, { ...v, _type: 'village' });
      });
    }

    if (layers.waterSources) {
      demoWaterSources.forEach(ws => {
        const el = document.createElement('div');
        const color = ws.status === 'safe' ? 'bg-blue-500' : 
                      ws.status === 'restricted' ? 'bg-amber-500' : 
                      ws.status === 'do_not_use' ? 'bg-red-500' : 'bg-gray-400';
        el.className = `w-3 h-3 ${color} rounded-full border border-white shadow-sm cursor-pointer`;
        addMarker([ws.coordinates.lon, ws.coordinates.lat], el, { ...ws, _type: 'waterSource' });
      });
    }

    if (layers.schools) {
      demoSchools.forEach(s => {
        const el = document.createElement('div');
        el.className = 'w-5 h-5 bg-blue-100 text-blue-700 rounded shadow-md cursor-pointer flex items-center justify-center text-[10px] border border-blue-300';
        el.innerHTML = '🏫';
        addMarker([s.coordinates.lon, s.coordinates.lat], el, { ...s, _type: 'school' });
      });
    }

    if (layers.contamination) {
      demoContaminationSources.forEach(cs => {
        const el = document.createElement('div');
        el.className = 'w-6 h-6 bg-slate-900 rounded-sm shadow-lg cursor-pointer flex items-center justify-center opacity-80';
        el.innerHTML = '<span class="text-white text-[10px]">🏭</span>';
        addMarker([cs.coordinates.lon, cs.coordinates.lat], el, { ...cs, _type: 'contaminationSource' });
      });
    }
  }, [mapLoaded, layers]);


  // Dummy chart data for detail panel
  const chartData = [
    { name: '2021', value: 0.05 },
    { name: '2022', value: 0.08 },
    { name: '2023', value: 0.12 },
    { name: '2024', value: 0.25 },
    { name: '2025', value: 0.22 },
    { name: '2026', value: 0.28 },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-100">
      <Header />
      
      {/* Demo Banner */}
      <div className="bg-amber-100 border-b border-amber-200 text-amber-800 px-4 py-1.5 text-center text-xs font-medium shrink-0">
        DEMO DATA — This data is synthetic and for demonstration purposes only
      </div>

      <div className="flex-grow relative flex overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`absolute z-10 left-0 top-0 bottom-0 bg-white w-80 shadow-xl transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="font-semibold flex items-center gap-2"><Layers className="w-5 h-5 text-blue-600" /> Map Layers</h2>
            <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-6">
            {/* Toggles */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Features</h3>
              
              <ToggleRow label="Villages" active={layers.villages} onChange={() => toggleLayer('villages')} icon={<MapPin className="w-4 h-4 text-green-600" />} />
              <ToggleRow label="Water Sources" active={layers.waterSources} onChange={() => toggleLayer('waterSources')} icon={<Droplets className="w-4 h-4 text-blue-500" />} />
              <ToggleRow label="Schools" active={layers.schools} onChange={() => toggleLayer('schools')} icon={<SchoolIcon className="w-4 h-4 text-blue-700" />} />
              <ToggleRow label="Contamination Sources" active={layers.contamination} onChange={() => toggleLayer('contamination')} icon={<Activity className="w-4 h-4 text-slate-700" />} />
              <ToggleRow label="Predicted Zones" active={layers.predictedZones} onChange={() => toggleLayer('predictedZones')} icon={<AlertCircle className="w-4 h-4 text-purple-500" />} />
            </div>

            <hr className="border-slate-200" />
            
            {/* Legend */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Legend</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Verified Safe Water</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Elevated Concern (Restricted)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> High Concern (Do Not Use)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 border border-white"></span> Village Center</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-slate-900 opacity-80 flex items-center justify-center text-[8px] text-white">🏭</span> Industrial Source</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-blue-100 border border-blue-300 flex items-center justify-center text-[8px]">🏫</span> School</div>
              </div>
            </div>

            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 text-xs text-slate-500 flex gap-2">
              <Info className="w-4 h-4 shrink-0 text-slate-400" />
              <p>Map data is a mix of reported observations, lab measurements, and AI predictions. Always verify critical information.</p>
            </div>
          </div>
        </div>

        {/* Sidebar Toggle Button (when closed) */}
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="absolute z-10 left-0 top-4 bg-white p-2 rounded-r-lg shadow-md border border-l-0 border-slate-200 text-slate-600 hover:text-blue-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Map Container */}
        <div ref={mapContainer} className="w-full h-full" />

        {/* Detail Panel */}
        <div 
          className={`absolute z-10 right-0 top-0 bottom-0 bg-white w-96 shadow-2xl transition-transform duration-300 flex flex-col border-l border-slate-200 ${selectedFeature ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {selectedFeature && (
            <>
              <div className="p-4 border-b border-slate-200 flex justify-between items-start bg-slate-50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedFeature._type === 'waterSource' ? `Water Source ${selectedFeature.id}` : 
                     selectedFeature._type === 'village' ? selectedFeature.name :
                     selectedFeature.name || selectedFeature.id}
                  </h2>
                  <p className="text-sm text-slate-500 capitalize">{selectedFeature._type.replace(/([A-Z])/g, ' $1').trim()}</p>
                </div>
                <button onClick={() => setSelectedFeature(null)} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-5 space-y-6">
                
                {selectedFeature._type === 'waterSource' && (
                  <>
                    {/* Status Badge */}
                    <div className={`p-3 rounded-lg border ${
                      selectedFeature.status === 'do_not_use' ? 'bg-red-50 border-red-200 text-red-800' :
                      selectedFeature.status === 'restricted' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                      'bg-blue-50 border-blue-200 text-blue-800'
                    }`}>
                      <div className="font-bold flex items-center gap-2">
                        {selectedFeature.status === 'do_not_use' && <AlertTriangle className="w-5 h-5" />}
                        {selectedFeature.status === 'do_not_use' ? 'DO NOT USE FOR DRINKING' :
                         selectedFeature.status === 'restricted' ? 'RESTRICTED USE' : 'SAFE SOURCE'}
                      </div>
                      <p className="text-xs mt-1 opacity-90">Based on recent measurements.</p>
                    </div>

                    {/* Data Section */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">Latest Measurement</h3>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-50 p-3 rounded border border-slate-100">
                          <div className="text-xs text-slate-500 mb-1">Total Cr</div>
                          <div className="text-lg font-bold text-slate-900">0.28 <span className="text-xs font-normal text-slate-500">mg/L</span></div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded border border-slate-100">
                          <div className="text-xs text-slate-500 mb-1">Date</div>
                          <div className="text-lg font-bold text-slate-900 text-sm mt-1">12 Sep 2026</div>
                        </div>
                      </div>
                      
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">Historical Trend</h3>
                      <div className="h-40 w-full bg-slate-50 rounded border border-slate-100 p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} width={30} />
                            <Tooltip contentStyle={{fontSize: '12px', borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={{r: 3, fill: '#ef4444'}} activeDot={{r: 5}} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Context */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">Context</h3>
                      <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex justify-between border-b border-slate-100 pb-1">
                          <span>Population Served:</span> <span className="font-medium text-slate-900">{selectedFeature.populationServed}</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-100 pb-1">
                          <span>Nearest School:</span> <span className="font-medium text-slate-900">{selectedFeature.nearestSchoolDistance}m</span>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
                
                {selectedFeature._type !== 'waterSource' && (
                   <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
                     <p>Additional details for {selectedFeature._type} entities are available in the full platform.</p>
                     <pre className="mt-4 text-xs overflow-x-auto p-2 bg-white rounded border border-slate-200 text-slate-500">
                       {JSON.stringify(selectedFeature, null, 2)}
                     </pre>
                   </div>
                )}
                
              </div>
              
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Get Directions
                </button>
                <button className="w-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium py-2 px-4 rounded-lg transition-colors">
                  Report an Issue
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, active, onChange, icon }: { label: string, active: boolean, onChange: () => void, icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between cursor-pointer group" onClick={onChange}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
      </div>
      <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-blue-600' : 'bg-slate-200'}`}>
        <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-transform ${active ? 'left-6' : 'left-1'}`} />
      </div>
    </div>
  );
}
