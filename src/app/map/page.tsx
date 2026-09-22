'use client';

import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import MapSidebar from '@/components/map/MapSidebar';
import EntityDetailsPanel from '@/components/map/EntityDetailsPanel';
import TemporalController from '@/components/map/TemporalController';
import type { MapLayerState } from '@/components/map/types';
import { getDb } from '@/lib/db/store';
import { 
  ChevronLeft, ChevronRight, Navigation, RotateCcw, 
  Layers, Maximize2, AlertTriangle, ShieldCheck
} from 'lucide-react';

function SubsurfaceMapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
  const urlLon = searchParams.get('lon') ? parseFloat(searchParams.get('lon')!) : null;
  const urlEntityType = searchParams.get('entityType');
  const urlEntityId = searchParams.get('entityId') || searchParams.get('source');

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const maplibreRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Layout & UI State
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Application Filters & Temporal State
  const [year, setYear] = useState<number>(2026);
  const [selectedVillageId, setSelectedVillageId] = useState<string>('all');
  const [safetyFilter, setSafetyFilter] = useState<string>('all');
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  // Layer Visibility State
  const [layers, setLayers] = useState<MapLayerState>({
    villages: true,
    waterSources: true,
    groundwaterPoints: true,
    schools: true,
    healthcare: true,
    contaminationSources: true,
    communityReports: true,
    agriculturalZones: false,
    remediationProjects: true,
    predictedZones: true,
  });

  const toggleLayer = useCallback((key: keyof MapLayerState) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const setAllLayers = useCallback((newLayers: Partial<MapLayerState>) => {
    setLayers(prev => ({ ...prev, ...newLayers }));
  }, []);

  // 1. Initialize MapLibre Map with Reliable OpenStreetMap Tiles
  useEffect(() => {
    if (map.current) return;

    let isMounted = true;

    import('maplibre-gl')
      .then((maplibreglModule: any) => {
        if (!isMounted || !mapContainer.current) return;
        const maplibregl = maplibreglModule.default || maplibreglModule;
        maplibreRef.current = maplibregl;

        const defaultCenter: [number, number] = urlLon && urlLat ? [urlLon, urlLat] : [80.32, 26.45];
        const defaultZoom = urlLon && urlLat ? 14 : 11;

        const mapInstance = new maplibregl.Map({
          container: mapContainer.current,
          style: {
            version: 8,
            sources: {
              osm: {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '&copy; OpenStreetMap Contributors',
              },
            },
            layers: [
              {
                id: 'osm-layer',
                type: 'raster',
                source: 'osm',
              },
            ],
          },
          center: defaultCenter,
          zoom: defaultZoom,
          attributionControl: false,
        });

        mapInstance.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

        mapInstance.on('load', () => {
          if (!isMounted) return;
          map.current = mapInstance;
          setMapLoaded(true);
        });

        mapInstance.on('error', (e: any) => {
          console.warn('MapLibre error notice:', e);
        });
      })
      .catch((err) => {
        console.error('Failed to initialize MapLibre:', err);
        setMapError('Map visualization engine could not be initialized.');
      });

    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // 2. Center and Zoom Handlers
  const handleCenterMap = useCallback((coords: { lat: number; lon: number }) => {
    if (map.current) {
      map.current.flyTo({
        center: [coords.lon, coords.lat],
        zoom: 14.5,
        essential: true,
      });
    }
  }, []);

  const handleResetView = useCallback(() => {
    setSelectedEntity(null);
    setSelectedVillageId('all');
    setSafetyFilter('all');
    if (map.current) {
      map.current.flyTo({
        center: [80.32, 26.45],
        zoom: 11,
        essential: true,
      });
    }
    // Clear URL parameters
    window.history.replaceState(null, '', '/map');
  }, []);

  const handleLocateMe = useCallback(() => {
    if (navigator.geolocation && map.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.current.flyTo({ center: [longitude, latitude], zoom: 14.5, essential: true });
        },
        () => {
          // Graceful fallback to center of Khanchandpur hotspot
          map.current.flyTo({ center: [80.345, 26.470], zoom: 14, essential: true });
        }
      );
    }
  }, []);

  // 3. Entity Selection Handler
  const handleSelectEntity = useCallback((entity: any) => {
    setSelectedEntity(entity);
    setRightPanelOpen(true);

    if (entity.coordinates && map.current) {
      const lat = typeof entity.coordinates.lat === 'number' ? entity.coordinates.lat : entity.coordinates[0];
      const lon = typeof entity.coordinates.lon === 'number' ? entity.coordinates.lon : entity.coordinates[1];
      if (typeof lat === 'number' && typeof lon === 'number') {
        const zoomLevel = entity._type === 'village' ? 13 : entity._type === 'contaminationSource' ? 13.5 : 15;
        map.current.flyTo({ center: [lon, lat], zoom: zoomLevel, essential: true });
      }
    }

    // Update URL query parameters for deep linking
    const params = new URLSearchParams(window.location.search);
    params.set('entityType', entity._type);
    params.set('entityId', entity.id);
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }, []);

  // 4. Cross-Navigation (Clicking related entity inside details panel)
  const handleSelectRelated = useCallback((type: string, id: string) => {
    const db = getDb();
    let found: any = null;

    if (type === 'waterSource' || type === 'handPump') {
      found = db.getWaterSourceById(id);
      if (found) found._type = 'waterSource';
    } else if (type === 'village') {
      found = db.getVillageById(id);
      if (found) found._type = 'village';
    } else if (type === 'school') {
      found = db.getSchools().find(s => s.id === id);
      if (found) found._type = 'school';
    } else if (type === 'contaminationSource') {
      found = db.getContaminationSources().find(c => c.id === id);
      if (found) found._type = 'contaminationSource';
    }

    if (found) {
      handleSelectEntity(found);
    }
  }, [handleSelectEntity]);

  // 5. Initial deep-link entity loader on mount
  useEffect(() => {
    if (!mapLoaded || selectedEntity) return;

    const db = getDb();
    if (urlEntityId) {
      let entity: any = db.getWaterSourceById(urlEntityId);
      if (entity) {
        handleSelectEntity({ ...entity, _type: 'waterSource' });
        return;
      }
      entity = db.getVillageById(urlEntityId);
      if (entity) {
        handleSelectEntity({ ...entity, _type: 'village' });
        return;
      }
      entity = db.getReportById(urlEntityId);
      if (entity) {
        handleSelectEntity({ ...entity, _type: 'communityReport' });
        return;
      }
    } else if (urlLat && urlLon) {
      const match = db.getWaterSources().find(s => 
        Math.abs(s.coordinates.lat - urlLat) < 0.005 && Math.abs(s.coordinates.lon - urlLon) < 0.005
      );
      if (match) {
        handleSelectEntity({ ...match, _type: 'waterSource' });
      }
    }
  }, [mapLoaded, urlEntityId, urlLat, urlLon, selectedEntity, handleSelectEntity]);

  // 6. Real Marker Rendering & Layer Toggling
  useEffect(() => {
    if (!mapLoaded || !map.current || !maplibreRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const maplibregl = maplibreRef.current;
    const db = getDb();

    // Helper to add interactive marker
    const createMarker = (
      lngLat: [number, number],
      elementHtml: string,
      feature: any,
      tooltipTitle: string,
      tooltipStatus: string
    ) => {
      const el = document.createElement('div');
      el.className = 'cursor-pointer select-none group relative';
      el.innerHTML = `
        ${elementHtml}
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-50 bg-[#002116] text-white text-[10px] font-mono py-1 px-2 rounded-md shadow-xl whitespace-nowrap pointer-events-none border border-emerald-500/30">
          <div class="font-bold">${tooltipTitle}</div>
          <div class="text-emerald-300 text-[9px]">${tooltipStatus}</div>
        </div>
      `;

      // Active selected marker styling
      const isSelected = selectedEntity && selectedEntity.id === feature.id;
      if (isSelected) {
        el.style.transform = 'scale(1.35)';
        el.style.zIndex = '40';
      }

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(lngLat)
        .addTo(map.current);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        handleSelectEntity(feature);
      });

      markersRef.current.push(marker);
    };

    // Filter helper by village
    const inSelectedVillage = (villageId?: string) => {
      if (selectedVillageId === 'all') return true;
      if (!villageId) return true;
      return db.resolveVillageId(villageId) === selectedVillageId;
    };

    // 1. Villages
    if (layers.villages) {
      db.getVillages().forEach(v => {
        if (selectedVillageId !== 'all' && v.id !== selectedVillageId) return;
        const isSelected = selectedEntity?.id === v.id;
        const iconHtml = `
          <div class="w-6 h-6 rounded-full bg-[#12372A] border-2 ${isSelected ? 'border-amber-400 ring-4 ring-amber-400/40' : 'border-white'} shadow-lg flex items-center justify-center text-white text-[10px] font-bold transition-transform hover:scale-125">
            V
          </div>
        `;
        createMarker([v.coordinates.lon, v.coordinates.lat], iconHtml, { ...v, _type: 'village' }, v.name, `Community Hub · ${v.population?.toLocaleString()} Pop`);
      });
    }

    // 2. Water Sources & Hand Pumps (Filtered by temporal year & safety status)
    if (layers.waterSources) {
      const sourcesList = year === 2026 ? db.getWaterSources() : db.getWaterSourcesByYear(year);
      sourcesList.forEach(ws => {
        if (!inSelectedVillage(ws.villageId)) return;
        if (safetyFilter !== 'all' && ws.status !== safetyFilter) return;

        const isSelected = selectedEntity?.id === ws.id;
        const color = ws.status === 'safe' ? 'bg-[#15803d]' : 
                      ws.status === 'restricted' ? 'bg-[#d97706]' : 
                      ws.status === 'do_not_use' ? 'bg-[#dc2626]' : 'bg-stone-400';
        
        const iconHtml = `
          <div class="w-4 h-4 rounded-full ${color} border-2 ${isSelected ? 'border-amber-300 ring-4 ring-amber-400/50 scale-125' : 'border-white'} shadow-md transition-transform hover:scale-150"></div>
        `;
        createMarker(
          [ws.coordinates.lon, ws.coordinates.lat],
          iconHtml,
          { ...ws, _type: 'waterSource' },
          ws.name || ws.id,
          ws.status === 'safe' ? 'Verified Safe (<0.05 mg/L)' : ws.status === 'restricted' ? 'Restricted Water' : 'Critical Contamination'
        );
      });
    }

    // 3. Groundwater Piezometric Points
    if (layers.groundwaterPoints) {
      db.getGroundwaterPoints().forEach(gp => {
        if (!inSelectedVillage(gp.villageId)) return;
        const isSelected = selectedEntity?.id === gp.id;
        const iconHtml = `
          <div class="w-4 h-4 rounded-md bg-sky-600 border-2 ${isSelected ? 'border-amber-300 ring-4 ring-amber-400/50' : 'border-white'} shadow-md flex items-center justify-center text-white text-[8px] font-bold hover:scale-150 transition-transform">
            GW
          </div>
        `;
        createMarker([gp.coordinates.lon, gp.coordinates.lat], iconHtml, { ...gp, _type: 'groundwaterPoint' }, gp.name || gp.id, 'Piezometric Well');
      });
    }

    // 4. Schools & Sensitive Zones
    if (layers.schools) {
      db.getSchools().forEach(sc => {
        if (!inSelectedVillage(sc.villageId)) return;
        const isSelected = selectedEntity?.id === sc.id;
        const iconHtml = `
          <div class="w-6 h-6 rounded-lg bg-blue-100 border ${isSelected ? 'border-amber-400 ring-4 ring-amber-400/50' : 'border-blue-400'} shadow-md flex items-center justify-center text-xs hover:scale-125 transition-transform">
            🏫
          </div>
        `;
        createMarker([sc.coordinates.lon, sc.coordinates.lat], iconHtml, { ...sc, _type: 'school' }, sc.name, `School (${sc.studentCount} Students)`);
      });
    }

    // 5. Healthcare Facilities
    if (layers.healthcare) {
      db.getHealthcare().forEach(hc => {
        if (!inSelectedVillage(hc.villageId)) return;
        const isSelected = selectedEntity?.id === hc.id;
        const iconHtml = `
          <div class="w-6 h-6 rounded-lg bg-rose-100 border ${isSelected ? 'border-amber-400 ring-4 ring-amber-400/50' : 'border-rose-400'} shadow-md flex items-center justify-center text-xs hover:scale-125 transition-transform">
            🏥
          </div>
        `;
        createMarker([hc.coordinates.lon, hc.coordinates.lat], iconHtml, { ...hc, _type: 'healthcare' }, hc.name, `Healthcare (${hc.type})`);
      });
    }

    // 6. Contamination Sources & Industrial Sites
    if (layers.contaminationSources) {
      db.getContaminationSources().forEach(cs => {
        const isSelected = selectedEntity?.id === cs.id;
        const iconHtml = `
          <div class="w-7 h-7 rounded-lg bg-purple-900 border-2 ${isSelected ? 'border-amber-400 ring-4 ring-amber-400/50 scale-125' : 'border-purple-300'} shadow-xl flex items-center justify-center text-xs hover:scale-125 transition-transform">
            🏭
          </div>
        `;
        createMarker([cs.coordinates.lon, cs.coordinates.lat], iconHtml, { ...cs, _type: 'contaminationSource' }, cs.name, `Industrial Site (${cs.status})`);
      });
    }

    // 7. Citizen Community Reports (Filtered up to selected year)
    if (layers.communityReports) {
      db.getCommunityReports().forEach(cr => {
        if (!inSelectedVillage(cr.villageId)) return;
        const reportYear = parseInt(cr.date.split('-')[0], 10);
        if (reportYear > year) return; // Temporal filtering

        const isSelected = selectedEntity?.id === cr.id;
        const rLat = typeof cr.coordinates?.lat === 'number' ? cr.coordinates.lat : (cr.coordinates as any)?.[0] ?? 26.45;
        const rLon = typeof cr.coordinates?.lon === 'number' ? cr.coordinates.lon : (cr.coordinates as any)?.[1] ?? 80.35;

        const iconHtml = `
          <div class="w-5 h-5 rounded-full bg-amber-500 border-2 ${isSelected ? 'border-white ring-4 ring-amber-400/50' : 'border-white'} shadow-md flex items-center justify-center text-[10px] text-white hover:scale-150 transition-transform">
            ⚠️
          </div>
        `;
        createMarker([rLon, rLat], iconHtml, { ...cr, _type: 'communityReport' }, cr.title || cr.category, `Citizen Report · ${cr.priority || 'Medium'}`);
      });
    }

    // 8. Agricultural Zones
    if (layers.agriculturalZones) {
      db.getAgriculturalZones().forEach(az => {
        if (!inSelectedVillage(az.villageId)) return;
        const isSelected = selectedEntity?.id === az.id;
        const iconHtml = `
          <div class="w-5 h-5 rounded-md bg-yellow-100 border ${isSelected ? 'border-amber-400 ring-4 ring-amber-400/50' : 'border-yellow-500'} shadow-sm flex items-center justify-center text-[10px] hover:scale-125 transition-transform">
            🌾
          </div>
        `;
        createMarker([az.coordinates.lon, az.coordinates.lat], iconHtml, { ...az, _type: 'agriculturalZone' }, `${az.cropType} Zone`, `Exposure: ${az.exposureLevel}`);
      });
    }

    // 9. Remediation Projects
    if (layers.remediationProjects) {
      db.getRemediationProjects().forEach(rp => {
        if (!inSelectedVillage(rp.villageId)) return;
        const isSelected = selectedEntity?.id === rp.id;
        const v = db.getVillageById(rp.villageId);
        const rLat = v ? v.coordinates.lat + 0.003 : 26.45;
        const rLon = v ? v.coordinates.lon + 0.003 : 80.35;

        const iconHtml = `
          <div class="w-6 h-6 rounded-full bg-emerald-700 border-2 ${isSelected ? 'border-amber-400 ring-4 ring-amber-400/50' : 'border-white'} shadow-lg flex items-center justify-center text-xs hover:scale-125 transition-transform">
            🌱
          </div>
        `;
        createMarker([rLon, rLat], iconHtml, { ...rp, _type: 'remediationProject', coordinates: { lat: rLat, lon: rLon } }, rp.name || rp.title, `Remediation (${rp.progress}%)`);
      });
    }

    // 10. Predicted Contamination Zones (Translucent GeoJSON layer)
    const mapInstance = map.current;
    if (mapInstance.getSource('predicted-zones-source')) {
      mapInstance.setLayoutProperty(
        'predicted-zones-fill',
        'visibility',
        layers.predictedZones ? 'visible' : 'none'
      );
      mapInstance.setLayoutProperty(
        'predicted-zones-line',
        'visibility',
        layers.predictedZones ? 'visible' : 'none'
      );
    } else if (layers.predictedZones) {
      // Add simulated plume features
      const features = db.getContaminationSources().map(cs => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [cs.coordinates.lon, cs.coordinates.lat],
        },
        properties: {
          radius: cs.estimatedImpactRadius * 600,
        },
      }));

      mapInstance.addSource('predicted-zones-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features,
        },
      });

      mapInstance.addLayer({
        id: 'predicted-zones-fill',
        type: 'circle',
        source: 'predicted-zones-source',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 30, 15, 180],
          'circle-color': '#dc2626',
          'circle-opacity': 0.16,
          'circle-blur': 0.8,
        },
      });

      mapInstance.addLayer({
        id: 'predicted-zones-line',
        type: 'circle',
        source: 'predicted-zones-source',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 30, 15, 180],
          'circle-color': '#b91c1c',
          'circle-opacity': 0.4,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#dc2626',
        },
      });
    }
  }, [
    mapLoaded,
    layers,
    year,
    selectedVillageId,
    safetyFilter,
    selectedEntity,
    handleSelectEntity,
  ]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-100">
      <Header />

      {/* Main 3-Part Workspace Layout */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* LEFT PANEL: Subsurface Intelligence (Sidebar) */}
        <div
          className={`w-80 sm:w-88 lg:w-96 flex-shrink-0 z-30 transition-all duration-300 bg-white border-r border-slate-200 relative ${
            leftSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute left-0 top-0 bottom-0'
          }`}
        >
          <MapSidebar
            layers={layers}
            onToggleLayer={toggleLayer}
            onSetAllLayers={setAllLayers}
            selectedVillageId={selectedVillageId}
            onSelectVillage={(vId) => {
              setSelectedVillageId(vId);
              if (vId !== 'all') {
                const v = getDb().getVillageById(vId);
                if (v && map.current) {
                  map.current.flyTo({ center: [v.coordinates.lon, v.coordinates.lat], zoom: 13.5 });
                }
              }
            }}
            safetyFilter={safetyFilter}
            onSelectSafetyFilter={setSafetyFilter}
            onSelectEntity={handleSelectEntity}
            onResetView={handleResetView}
            year={year}
          />
        </div>

        {/* Toggle Left Sidebar Button */}
        <button
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className={`absolute top-4 z-40 bg-white p-2 rounded-xl shadow-lg border border-slate-200 text-slate-700 hover:text-slate-900 transition-all cursor-pointer ${
            leftSidebarOpen ? 'left-82 sm:left-90 lg:left-98' : 'left-4'
          }`}
          title={leftSidebarOpen ? 'Collapse Left Sidebar' : 'Expand Subsurface Intelligence'}
        >
          {leftSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* CENTER PANEL: Large Interactive Map Canvas */}
        <div className="flex-1 relative h-full w-full overflow-hidden bg-slate-200">
          {mapError && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/90">
              <div className="max-w-md bg-white p-6 rounded-2xl shadow-2xl border border-red-200 text-center space-y-3 font-mono">
                <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">Cartographic Layer Offline</h3>
                <p className="text-xs text-slate-500">{mapError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#002116] text-white rounded-xl text-xs font-bold"
                >
                  Reload GIS Interface
                </button>
              </div>
            </div>
          )}

          {/* Floating Top-Right Utilities */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={handleLocateMe}
              className="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg border border-slate-200 text-slate-700 hover:text-[#002116] hover:bg-slate-50 transition-colors cursor-pointer"
              title="Locate my current position"
            >
              <Navigation className="w-4 h-4 text-[#2E8B68]" />
            </button>
            <button
              onClick={handleResetView}
              className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-slate-200 text-slate-700 hover:text-[#002116] hover:bg-slate-50 transition-colors font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Reset map view to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset View</span>
            </button>
          </div>

          {/* Floating Bottom Center Temporal Horizon Controller */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 max-w-[94vw]">
            <TemporalController
              year={year}
              onChangeYear={setYear}
              minYear={2018}
              maxYear={2026}
            />
          </div>

          {/* MapLibre DOM Node */}
          <div ref={mapContainer} className="w-full h-full" />
        </div>

        {/* RIGHT PANEL: Selected Entity Context Drawer */}
        <div
          className={`w-88 sm:w-96 flex-shrink-0 z-30 transition-all duration-300 bg-white border-l border-slate-200 relative ${
            rightPanelOpen && selectedEntity
              ? 'translate-x-0'
              : 'translate-x-full absolute right-0 top-0 bottom-0 pointer-events-none opacity-0'
          }`}
        >
          <EntityDetailsPanel
            entity={selectedEntity}
            onClose={() => {
              setSelectedEntity(null);
              // Clear URL entity parameters
              const params = new URLSearchParams(window.location.search);
              params.delete('entityType');
              params.delete('entityId');
              window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
            }}
            onSelectRelated={handleSelectRelated}
            onCenterMap={handleCenterMap}
            onFilterVillage={(vId) => setSelectedVillageId(vId)}
            selectedYear={year}
          />
        </div>
      </div>
    </div>
  );
}

export default function SubsurfaceMapPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center font-mono bg-slate-50 text-slate-600">
          Loading Subsurface GIS Intelligence...
        </div>
      }
    >
      <SubsurfaceMapContent />
    </Suspense>
  );
}
