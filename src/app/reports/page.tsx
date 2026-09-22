'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { getDb, CommunityReportRecord } from '@/lib/db/store';
import type { WaterSource, Village, GroundwaterPoint, ContaminationSource, School } from '@/lib/types';
import { 
  Filter, 
  Image as ImageIcon, 
  MapPin, 
  Calendar, 
  Search, 
  Plus, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  ExternalLink,
  Maximize2,
  Trash2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Download,
  Layers,
  Eye,
  Crosshair,
  Grid,
  Table as TableIcon,
  Map as MapIcon,
  AlertTriangle,
  Check,
  Share2,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Info,
  Droplet,
  Compass,
  ArrowRight,
  RefreshCw,
  Activity
} from 'lucide-react';
import Link from 'next/link';

// View modes
type ViewMode = 'split' | 'cards' | 'registry' | 'map';

// Single source of truth for Community Map Layer Definitions
export interface CommunityMapLayerDef {
  id: string;
  label: string;
  type: 'point' | 'polygon';
  color: string;
  borderColor?: string;
  icon: string;
  visible: boolean;
  dataSource: string;
  statusRules: string;
  description: string;
}

export const COMMUNITY_MAP_LAYER_DEFINITIONS: Record<string, CommunityMapLayerDef> = {
  safeSources: {
    id: 'safeSources',
    label: 'Safe Drinking Sources',
    type: 'point',
    color: '#15803d', // Green
    borderColor: '#ffffff',
    icon: '●',
    visible: true,
    dataSource: 'waterSources (status === safe / Cr < 0.05 mg/L)',
    statusRules: 'WHO Permissible Standard: Total Cr < 0.05 mg/L',
    description: 'Verified potable drinking groundwater wells and deep borewells'
  },
  contaminatedSources: {
    id: 'contaminatedSources',
    label: 'Contaminated / Restricted',
    type: 'point',
    color: '#dc2626', // Red
    borderColor: '#ffffff',
    icon: '●',
    visible: true,
    dataSource: 'waterSources (status === do_not_use | restricted)',
    statusRules: 'Hazardous: Total Cr >= 0.05 mg/L or hexavalent chromium detected',
    description: 'Borewells and handpumps exceeding maximum contaminant levels'
  },
  plumes: {
    id: 'plumes',
    label: 'Cr(VI) Dispersion Plume',
    type: 'polygon',
    color: '#fb7185', // Pink / Rose tinted
    borderColor: '#e11d48',
    icon: '▱',
    visible: true,
    dataSource: 'GeoJSON Cr(VI) Hydrogeological Plume Model',
    statusRules: 'MODEL-ESTIMATED: 2D Advection-Dispersion Solute Transport',
    description: 'Predicted subsurface hexavalent chromium contaminant dispersion boundary'
  },
  reports: {
    id: 'reports',
    label: 'Citizen Field Observations',
    type: 'point',
    color: '#f59e0b', // Amber
    borderColor: '#ffffff',
    icon: '⚠️',
    visible: true,
    dataSource: 'communityReports',
    statusRules: 'Citizen telemetry & field verified incidents',
    description: 'Ground observations filed by residents, panchayat & health workers'
  },
  villages: {
    id: 'villages',
    label: 'Village Community Hubs',
    type: 'point',
    color: '#12372a', // Deep Forest Emerald
    borderColor: '#ffffff',
    icon: 'V',
    visible: true,
    dataSource: 'villages',
    statusRules: 'Census population centers',
    description: 'Gram panchayats and residential settlement clusters'
  },
  groundwaterPoints: {
    id: 'groundwaterPoints',
    label: 'Piezometric Monitoring Wells',
    type: 'point',
    color: '#0284c7', // Sky Blue
    borderColor: '#ffffff',
    icon: 'GW',
    visible: true,
    dataSource: 'groundwaterPoints',
    statusRules: 'CGWB & UPPCB monitoring piezometers',
    description: 'Surveillance piezometers measuring aquifer depth & hydrochemistry'
  },
  contaminationSources: {
    id: 'contaminationSources',
    label: 'Industrial & Contamination Sources',
    type: 'point',
    color: '#581c87', // Deep Purple
    borderColor: '#ffffff',
    icon: '🏭',
    visible: true,
    dataSource: 'contaminationSources',
    statusRules: 'Tannery waste mounds, unlined lagoons, and chemical dump sites',
    description: 'Primary origin points of hexavalent chromium leaching'
  }
};

// Selected Entity polymorphic union
export type SelectedMapEntity =
  | { type: 'report'; report: CommunityReportRecord }
  | { type: 'safeSource'; source: WaterSource & { activeMeasurement?: any } }
  | { type: 'contaminatedSource'; source: WaterSource & { activeMeasurement?: any } }
  | { type: 'plume'; zoneId: string; name: string; status: string; contaminant: string; temporalContext: string; confidence: string; associatedVillage: string; nearbyWaterSources: string; maxObservedCr: string; flowDirection: string; hydraulicConductivity: string; notes: string }
  | { type: 'village'; village: Village }
  | { type: 'groundwaterPoint'; point: GroundwaterPoint }
  | { type: 'contaminationSource'; source: ContaminationSource }
  | null;

// Helper to generate dynamic GeoJSON plumes based on temporal year
function generatePlumeGeoJSON(year: number) {
  // If year before 2020: pre-surveillance baseline (no formal plume model)
  if (year < 2020) {
    return {
      type: 'FeatureCollection',
      features: []
    };
  }

  // Expansion scale factor (2020 = 0.45, 2022 = 0.65, 2024 = 0.85, 2026 = 1.0)
  const factor = Math.max(0.45, Math.min(1.0, 0.45 + ((year - 2020) / 6) * 0.55));

  // Helper to create smooth oval polygon
  const createOval = (lon: number, lat: number, rx: number, ry: number, angleDeg: number) => {
    const coords: [number, number][] = [];
    const rad = (angleDeg * Math.PI) / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);
    const steps = 36;
    for (let i = 0; i <= steps; i++) {
      const theta = (i * 2 * Math.PI) / steps;
      const x0 = rx * Math.cos(theta);
      const y0 = ry * Math.sin(theta);
      const xRot = x0 * cosA - y0 * sinA;
      const yRot = x0 * sinA + y0 * cosA;
      coords.push([lon + xRot, lat + yRot]);
    }
    return coords;
  };

  // Plume 1: Rania Tannery Industrial Plume
  const raniaCoords = createOval(80.3015, 26.4485, 0.016 * factor, 0.009 * factor, -35);

  // Plume 2: Khanchandpur Heavy Solute Plume
  const khanchandpurCoords = createOval(80.3420, 26.4650, 0.019 * factor, 0.011 * factor, -25);

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'PLUME-001',
        geometry: {
          type: 'Polygon',
          coordinates: [raniaCoords]
        },
        properties: {
          zoneId: 'PLUME-001',
          name: 'Rania South-East Groundwater Advection Plume',
          status: 'Model Estimated',
          contaminant: 'Hexavalent Chromium — Cr(VI)',
          temporalContext: `${year} Spatial Dispersion Horizon`,
          confidence: '87% Hydrogeological Confidence',
          associatedVillage: 'Rania (V-002)',
          nearbyWaterSources: 'HP-010, HP-016, HP-017, HP-020',
          maxObservedCr: '0.34 mg/L Cr(VI) (6.8× WHO Standard)',
          flowDirection: 'South-Southeast (1.4 m/km regional hydraulic gradient)',
          hydraulicConductivity: '14.2 m/day (Unconfined sandy alluvium)',
          notes: 'High-risk solute transport plume originating from legacy chromite ore processing residue (COPR) dumps along the Rania industrial fringe.'
        }
      },
      {
        type: 'Feature',
        id: 'PLUME-002',
        geometry: {
          type: 'Polygon',
          coordinates: [khanchandpurCoords]
        },
        properties: {
          zoneId: 'PLUME-002',
          name: 'Khanchandpur Deep Alluvial Leachate Dispersion Plume',
          status: 'Model Estimated',
          contaminant: 'Hexavalent Chromium — Cr(VI)',
          temporalContext: `${year} Spatial Dispersion Horizon`,
          confidence: '92% Hydrogeological Confidence',
          associatedVillage: 'Khanchandpur (V-001)',
          nearbyWaterSources: 'HP-001, HP-002, HP-003, HP-005, HP-008',
          maxObservedCr: '0.72 mg/L Cr(VI) (14.4× WHO Standard)',
          flowDirection: 'East-Southeast along unconfined micaceous sand aquifer',
          hydraulicConductivity: '18.5 m/day (High permeability)',
          notes: 'Persistent regional plume affecting 12 shallow community borewells and domestic handpumps.'
        }
      }
    ]
  };
}

function ReportsDashboardContent() {
  const searchParams = useSearchParams();
  const deepReportId = searchParams.get('reportId');

  const { t } = useTranslation();

  // Core Data States
  const [reports, setReports] = useState<CommunityReportRecord[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [rawWaterSources, setRawWaterSources] = useState<WaterSource[]>([]);
  const [groundwaterPoints, setGroundwaterPoints] = useState<GroundwaterPoint[]>([]);
  const [contaminationSources, setContaminationSources] = useState<ContaminationSource[]>([]);
  const [deletedCount, setDeletedCount] = useState<number>(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [villageFilter, setVillageFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // View Mode & Selection
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [selectedEntity, setSelectedEntity] = useState<SelectedMapEntity>(null);
  const [fullModalReport, setFullModalReport] = useState<CommunityReportRecord | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [reportToDelete, setReportToDelete] = useState<CommunityReportRecord | null>(null);
  const [deleteReason, setDeleteReason] = useState('Resolved / Decommissioned site');
  const [customDeleteReason, setCustomDeleteReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Temporal Horizon Engine (2018–2026)
  const [temporalYear, setTemporalYear] = useState<number>(2026);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // MapLibre Reference & Layers
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const maplibreglRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  // Layer Toggles
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    safeSources: true,
    contaminatedSources: true,
    plumes: true,
    reports: true,
    villages: true,
    groundwaterPoints: true,
    contaminationSources: true,
  });

  // Load fresh data
  const loadData = useCallback(() => {
    const db = getDb();
    setReports(db.getCommunityReports());
    setVillages(db.getVillages());
    setRawWaterSources(db.getWaterSources());
    setGroundwaterPoints(db.getGroundwaterPoints());
    setContaminationSources(db.getContaminationSources());
    setDeletedCount(db.getDeletedReportsCount());
  }, []);

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('bhujal_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('bhujal_data_updated', handleUpdate);
    };
  }, [loadData]);

  // Deep link handler
  useEffect(() => {
    if (deepReportId && reports.length > 0) {
      const target = reports.find(r => r.id === deepReportId);
      if (target) {
        setSelectedEntity({ type: 'report', report: target });
        setActiveMarkerId(target.id);
      }
    }
  }, [deepReportId, reports]);

  // Toast timer
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Temporal Horizon Playback
  useEffect(() => {
    if (isPlaying) {
      playbackTimerRef.current = setInterval(() => {
        setTemporalYear(prev => {
          if (prev >= 2026) {
            setIsPlaying(false);
            return 2026;
          }
          return prev + 1;
        });
      }, 1300);
    } else if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying]);

  // Dynamically calculate water sources for the selected temporal year
  const temporalWaterSources = useMemo(() => {
    const db = getDb();
    return db.getWaterSourcesByYear(temporalYear);
  }, [temporalYear]);

  // Filtered Community Reports based on temporal year, search and filters
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // 1. Temporal Horizon Filter (strictly on or before selected year)
      const reportYear = report.date ? parseInt(report.date.split('-')[0], 10) : 2026;
      if (reportYear > temporalYear) return false;

      // 2. Status Filter
      if (statusFilter !== 'All') {
        const s = report.status.toLowerCase();
        const f = statusFilter.toLowerCase();
        if (!s.includes(f) && s !== f) return false;
      }

      // 3. Village Filter
      if (villageFilter !== 'All' && report.villageId !== villageFilter) return false;

      // 4. Priority Filter
      if (priorityFilter !== 'All' && report.priority !== priorityFilter) return false;

      // 5. Category Filter
      if (categoryFilter !== 'All' && report.category !== categoryFilter) return false;

      // 6. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = report.id.toLowerCase().includes(q);
        const matchTitle = (report.title || '').toLowerCase().includes(q);
        const matchDesc = report.description.toLowerCase().includes(q);
        const matchCat = report.category.toLowerCase().includes(q);
        const matchLoc = (report.locationName || '').toLowerCase().includes(q);
        const matchReporter = (report.reporterType || report.reporterName || '').toLowerCase().includes(q);
        const matchSource = (report.waterSourceId || '').toLowerCase().includes(q);
        const vObj = villages.find(v => v.id === report.villageId);
        const matchVillage = vObj ? (vObj.name.toLowerCase().includes(q) || vObj.hindiName.includes(q)) : false;

        if (!matchId && !matchTitle && !matchDesc && !matchCat && !matchLoc && !matchReporter && !matchSource && !matchVillage) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reports, temporalYear, statusFilter, villageFilter, priorityFilter, categoryFilter, searchQuery, villages]);

  // Categories list
  const categories = useMemo(() => {
    return Array.from(new Set(reports.map(r => r.category))).filter(Boolean);
  }, [reports]);

  // Dynamic counts
  const safeSourcesCount = temporalWaterSources.filter(s => s.status === 'safe').length;
  const contaminatedSourcesCount = temporalWaterSources.filter(s => s.status === 'do_not_use' || s.status === 'restricted').length;
  const activeReportsCount = filteredReports.length;
  const criticalReportsCount = filteredReports.filter(r => r.priority === 'Critical').length;

  // Initialize MapLibre GIS Map
  useEffect(() => {
    if (mapInstanceRef.current || !mapContainer.current) return;

    let isMounted = true;

    import('maplibre-gl')
      .then((maplibreglModule: any) => {
        if (!isMounted || !mapContainer.current) return;
        const maplibregl = maplibreglModule.default || maplibreglModule;
        maplibreglRef.current = maplibregl;

        const map = new maplibregl.Map({
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
          center: [80.32, 26.45],
          zoom: 11,
          attributionControl: false,
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

        map.on('load', () => {
          if (!isMounted) return;
          mapInstanceRef.current = map;

          // Add Cr(VI) Dispersion Plume GeoJSON Source & Layers
          const plumeData = generatePlumeGeoJSON(temporalYear);
          map.addSource('cr-plumes-source', {
            type: 'geojson',
            data: plumeData,
          });

          // Plume Fill Layer
          map.addLayer({
            id: 'cr-plumes-fill',
            type: 'fill',
            source: 'cr-plumes-source',
            paint: {
              'fill-color': '#fb7185', // Pink / Rose
              'fill-opacity': 0.28,
            },
          });

          // Plume Boundary Line
          map.addLayer({
            id: 'cr-plumes-line',
            type: 'line',
            source: 'cr-plumes-source',
            paint: {
              'line-color': '#e11d48',
              'line-width': 2,
              'line-dasharray': [3, 2],
            },
          });

          // Clickable interaction on Plume Polygon!
          map.on('click', 'cr-plumes-fill', (e: any) => {
            if (e.features && e.features[0]) {
              const props = e.features[0].properties;
              setSelectedEntity({
                type: 'plume',
                zoneId: props.zoneId || 'PLUME-001',
                name: props.name || 'Cr(VI) Dispersion Plume',
                status: props.status || 'Model Estimated',
                contaminant: props.contaminant || 'Hexavalent Chromium — Cr(VI)',
                temporalContext: props.temporalContext || `${temporalYear} Dispersion Horizon`,
                confidence: props.confidence || '87% Hydrogeological Confidence',
                associatedVillage: props.associatedVillage || 'Rania Cluster',
                nearbyWaterSources: props.nearbyWaterSources || 'HP-010, HP-016',
                maxObservedCr: props.maxObservedCr || '0.34 mg/L Cr(VI)',
                flowDirection: props.flowDirection || 'South-Southeast (1.4 m/km)',
                hydraulicConductivity: props.hydraulicConductivity || '14.2 m/day',
                notes: props.notes || 'Subsurface advection plume modeling.'
              });
              setActiveMarkerId(props.zoneId);
            }
          });

          map.on('mouseenter', 'cr-plumes-fill', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'cr-plumes-fill', () => {
            map.getCanvas().style.cursor = '';
          });

          setMapLoaded(true);
        });
      })
      .catch(err => {
        console.error('Failed to initialize MapLibre in Community view:', err);
      });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Plume GeoJSON and Layer Visibility dynamically when temporal year or toggles change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;

    const source = map.getSource('cr-plumes-source');
    if (source) {
      source.setData(generatePlumeGeoJSON(temporalYear));
    }

    if (map.getLayer('cr-plumes-fill')) {
      map.setLayoutProperty('cr-plumes-fill', 'visibility', activeLayers.plumes ? 'visible' : 'none');
      map.setLayoutProperty('cr-plumes-line', 'visibility', activeLayers.plumes ? 'visible' : 'none');
    }
  }, [temporalYear, activeLayers.plumes, mapLoaded]);

  // Synchronize Markers on Map Canvas
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const maplibregl = maplibreglRef.current;
    const map = mapInstanceRef.current;

    // Interactive marker builder
    const createMarker = (
      lng: number, 
      lat: number, 
      elementHtml: string, 
      tooltipTitle: string, 
      tooltipSubtitle: string, 
      onClick: () => void,
      isSelected = false
    ) => {
      const el = document.createElement('div');
      el.className = 'cursor-pointer select-none group relative';
      el.innerHTML = `
        ${elementHtml}
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 bg-[#002116] text-white text-[11px] font-mono py-1.5 px-2.5 rounded-lg shadow-2xl whitespace-nowrap pointer-events-none border border-emerald-500/30">
          <div class="font-bold text-amber-200">${tooltipTitle}</div>
          <div class="text-stone-300 text-[10px] mt-0.5">${tooltipSubtitle}</div>
        </div>
      `;

      if (isSelected) {
        el.style.transform = 'scale(1.4)';
        el.style.zIndex = '50';
      }

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onClick();
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current.push(marker);
    };

    // 1. Citizen Observation Markers (Amber ⚠️)
    if (activeLayers.reports) {
      filteredReports.forEach(report => {
        const lat = typeof (report.coordinates as any)?.lat === 'number' ? (report.coordinates as any).lat : 26.4481;
        const lon = typeof (report.coordinates as any)?.lon === 'number' ? (report.coordinates as any).lon : 80.0102;
        const isSelected = activeMarkerId === report.id || (selectedEntity?.type === 'report' && selectedEntity.report.id === report.id);

        const iconHtml = `
          <div class="w-6 h-6 rounded-full bg-amber-500 text-[#002116] border-2 ${
            isSelected ? 'border-red-500 ring-4 ring-red-400/60 scale-125' : 'border-white shadow-md'
          } flex items-center justify-center font-bold text-xs shadow-lg transition-transform hover:scale-130">
            ⚠️
          </div>
        `;

        createMarker(
          lon,
          lat,
          iconHtml,
          `${report.id} · ${report.category}`,
          `${report.locationName || 'Field Incident'} · ${report.priority} Priority`,
          () => {
            setSelectedEntity({ type: 'report', report });
            setActiveMarkerId(report.id);
          },
          isSelected
        );
      });
    }

    // 2. Safe Water Sources (GREEN ●)
    if (activeLayers.safeSources) {
      temporalWaterSources.filter(s => s.status === 'safe').forEach(s => {
        const isSelected = activeMarkerId === s.id || (selectedEntity?.type === 'safeSource' && selectedEntity.source.id === s.id);
        const iconHtml = `
          <div class="w-4 h-4 rounded-full bg-[#15803d] border-2 ${
            isSelected ? 'border-amber-300 ring-4 ring-amber-400/70 scale-125' : 'border-white shadow-sm'
          } hover:scale-150 transition-transform"></div>
        `;

        createMarker(
          s.coordinates.lon,
          s.coordinates.lat,
          iconHtml,
          `Safe Source: ${s.name || s.id}`,
          'Verified Potable Water (Cr < 0.05 mg/L)',
          () => {
            setSelectedEntity({ type: 'safeSource', source: s });
            setActiveMarkerId(s.id);
          },
          isSelected
        );
      });
    }

    // 3. Contaminated / Restricted Sources (RED ●)
    if (activeLayers.contaminatedSources) {
      temporalWaterSources.filter(s => s.status === 'do_not_use' || s.status === 'restricted').forEach(s => {
        const isCritical = s.status === 'do_not_use';
        const isSelected = activeMarkerId === s.id || (selectedEntity?.type === 'contaminatedSource' && selectedEntity.source.id === s.id);
        const iconHtml = `
          <div class="w-4 h-4 rounded-full ${isCritical ? 'bg-[#dc2626]' : 'bg-[#d97706]'} border-2 ${
            isSelected ? 'border-amber-300 ring-4 ring-amber-400/70 scale-125' : 'border-white shadow-sm'
          } hover:scale-150 transition-transform"></div>
        `;

        createMarker(
          s.coordinates.lon,
          s.coordinates.lat,
          iconHtml,
          `Hazardous Source: ${s.name || s.id}`,
          isCritical ? 'CRITICAL: Do Not Drink (>0.05 mg/L Cr)' : 'Restricted Domestic Water',
          () => {
            setSelectedEntity({ type: 'contaminatedSource', source: s });
            setActiveMarkerId(s.id);
          },
          isSelected
        );
      });
    }

    // 4. Village Community Hubs (Navy V)
    if (activeLayers.villages) {
      villages.forEach(v => {
        const isSelected = activeMarkerId === v.id || (selectedEntity?.type === 'village' && selectedEntity.village.id === v.id);
        const iconHtml = `
          <div class="w-6 h-6 rounded-full bg-[#12372a] text-white border-2 ${
            isSelected ? 'border-amber-400 ring-4 ring-amber-400/50 scale-125' : 'border-white'
          } flex items-center justify-center text-[10px] font-bold shadow-md hover:scale-125 transition-transform">
            V
          </div>
        `;

        createMarker(
          v.coordinates.lon,
          v.coordinates.lat,
          iconHtml,
          `${v.name} (${v.hindiName})`,
          `Community Cluster · ${v.population.toLocaleString()} Population`,
          () => {
            setSelectedEntity({ type: 'village', village: v });
            setActiveMarkerId(v.id);
          },
          isSelected
        );
      });
    }

    // 5. Piezometric Monitoring Wells (Sky Blue GW)
    if (activeLayers.groundwaterPoints) {
      groundwaterPoints.forEach(gp => {
        const isSelected = activeMarkerId === gp.id || (selectedEntity?.type === 'groundwaterPoint' && selectedEntity.point.id === gp.id);
        const iconHtml = `
          <div class="w-4 h-4 rounded-md bg-sky-600 text-white border ${
            isSelected ? 'border-amber-300 ring-4 ring-amber-400/60 scale-125' : 'border-white'
          } flex items-center justify-center text-[8px] font-bold shadow-sm hover:scale-140 transition-transform">
            GW
          </div>
        `;

        const lon = gp.coordinates?.lon ?? (gp as any).location?.coordinates?.[0] ?? (gp as any).location?.lon ?? 80.34;
        const lat = gp.coordinates?.lat ?? (gp as any).location?.coordinates?.[1] ?? (gp as any).location?.lat ?? 26.46;
        const depthVal = gp.depth || (gp as any).depthM || 15;

        createMarker(
          lon,
          lat,
          iconHtml,
          `Piezometer ${gp.id}`,
          `${depthVal}m Depth · Unconfined Aquifer`,
          () => {
            setSelectedEntity({ type: 'groundwaterPoint', point: gp });
            setActiveMarkerId(gp.id);
          },
          isSelected
        );
      });
    }

    // 6. Contamination Sources (Purple 🏭)
    if (activeLayers.contaminationSources) {
      contaminationSources.forEach(cs => {
        const isSelected = activeMarkerId === cs.id || (selectedEntity?.type === 'contaminationSource' && selectedEntity.source.id === cs.id);
        const iconHtml = `
          <div class="w-6 h-6 rounded-lg bg-purple-900 border-2 ${
            isSelected ? 'border-amber-400 ring-4 ring-amber-400/50 scale-125' : 'border-purple-300'
          } shadow-lg flex items-center justify-center text-xs hover:scale-125 transition-transform">
            🏭
          </div>
        `;

        const lon = cs.coordinates?.lon ?? (cs as any).location?.coordinates?.[0] ?? (cs as any).location?.lon ?? 80.34;
        const lat = cs.coordinates?.lat ?? (cs as any).location?.coordinates?.[1] ?? (cs as any).location?.lat ?? 26.46;

        createMarker(
          lon,
          lat,
          iconHtml,
          cs.name,
          `Industrial Contamination Source (${cs.status})`,
          () => {
            setSelectedEntity({ type: 'contaminationSource', source: cs });
            setActiveMarkerId(cs.id);
          },
          isSelected
        );
      });
    }

  }, [mapLoaded, filteredReports, temporalWaterSources, villages, groundwaterPoints, contaminationSources, activeLayers, activeMarkerId, selectedEntity]);

  // Locate report on map and open its contextual panel
  const handleLocateOnMap = (report: CommunityReportRecord) => {
    setSelectedEntity({ type: 'report', report });
    setActiveMarkerId(report.id);

    const lat = typeof (report.coordinates as any)?.lat === 'number' ? (report.coordinates as any).lat : 26.4481;
    const lon = typeof (report.coordinates as any)?.lon === 'number' ? (report.coordinates as any).lon : 80.0102;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [lon, lat],
        zoom: 15.5,
        essential: true,
      });
    }

    if (viewMode === 'cards' || viewMode === 'registry') {
      setViewMode('split');
    }

    // Scroll to map if needed on mobile
    if (mapContainer.current && window.innerWidth < 1024) {
      mapContainer.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset map zoom
  const handleResetMapView = () => {
    setActiveMarkerId(null);
    setSelectedEntity(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [80.32, 26.45],
        zoom: 11,
        essential: true,
      });
    }
  };

  // GPS Locate
  const handleLocateMe = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          mapInstanceRef.current.flyTo({ center: [longitude, latitude], zoom: 14.5, essential: true });
          setToastMessage('Map centered on current GPS coordinates.');
        },
        () => {
          mapInstanceRef.current.flyTo({ center: [80.3015, 26.4485], zoom: 14, essential: true });
          setToastMessage('GPS unavailable. Centered on Rania sentinel cluster.');
        }
      );
    }
  };

  // Execute Deletion
  const handleConfirmDelete = () => {
    if (!reportToDelete) return;

    const db = getDb();
    const reason = deleteReason === 'Other' ? customDeleteReason || 'Administrative deletion' : deleteReason;
    const success = db.deleteCommunityReport(reportToDelete.id, reason);

    if (success) {
      setToastMessage(`Observation ${reportToDelete.id} successfully removed from registry.`);
      if (selectedEntity?.type === 'report' && selectedEntity.report.id === reportToDelete.id) {
        setSelectedEntity(null);
      }
      if (fullModalReport?.id === reportToDelete.id) {
        setFullModalReport(null);
      }
      setReportToDelete(null);
      setCustomDeleteReason('');
      loadData();
    }
  };

  // Restore deleted reports (for easy testing)
  const handleRestoreDeleted = () => {
    const db = getDb();
    db.resetDeletedReports();
    loadData();
    setToastMessage('All previously deleted observations have been restored.');
  };

  // CSV Export
  const handleExportCsv = () => {
    const db = getDb();
    const csvContent = db.exportReportsCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhujal_community_registry_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToastMessage('Community Registry CSV exported successfully.');
  };

  // Status Badge
  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('report') || s === 'new') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
          <Clock className="w-3 h-3" /> Reported
        </span>
      );
    }
    if (s.includes('under_review') || s.includes('review') || s.includes('investigat')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3 h-3" /> Under Review
        </span>
      );
    }
    if (s.includes('field') || s.includes('lab') || s.includes('verified')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
          <CheckCircle2 className="w-3 h-3" /> Verified
        </span>
      );
    }
    if (s.includes('confirm')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
          <AlertCircle className="w-3 h-3" /> Confirmed
        </span>
      );
    }
    if (s.includes('resolve') || s.includes('closed')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" /> Resolved
        </span>
      );
    }
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">{status}</span>;
  };

  // Priority Badge
  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-100 text-red-800 border border-red-200">Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-orange-100 text-orange-800 border border-orange-200">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-stone-100 text-stone-600 border border-stone-200">Low</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4fbf7] text-[#0c1f18] font-sans selection:bg-[#c3ebd8] selection:text-[#002116]">
      <Header />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#002116] text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white ml-2 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-4">
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#002116] font-bold">Community Intelligence &amp; Field Telemetry</span>
        </div>

        {/* Top Header & Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-[#ddf3e7] text-[#002116] font-bold border border-emerald-200 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                Participatory Sentinel Network
              </span>
              <span className="text-xs font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                {reports.length} Documented Observations · {activeReportsCount} in Temporal Horizon ({temporalYear})
              </span>
              {criticalReportsCount > 0 && (
                <span className="text-xs font-mono text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  {criticalReportsCount} Critical Incidents
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#002116] tracking-tight">
              Community Ground Observations &amp; Registry
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Real-time community telemetry tracking hexavalent chromium discoloration, pungent chemical odors, and illegal industrial discharge across Kanpur Nagar and Kanpur Dehat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {deletedCount > 0 && (
              <button
                onClick={handleRestoreDeleted}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                title="Restore all soft-deleted records"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                <span>Restore ({deletedCount}) Deleted</span>
              </button>
            )}

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-mono text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              title="Download full community registry as CSV"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>Export CSV</span>
            </button>

            <Link 
              href="/reports/new" 
              className="flex items-center gap-2 px-5 py-2.5 bg-[#12372a] hover:bg-[#002116] text-white font-mono text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-emerald-300" />
              <span>+ Submit Observation</span>
            </Link>
          </div>
        </div>

        {/* Temporal Horizon Slider & View Switcher Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 self-start md:self-auto">
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewMode === 'split' ? 'bg-white text-[#002116] shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewMode === 'cards' ? 'bg-white text-[#002116] shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Ground Cards</span>
              </button>
              <button
                onClick={() => setViewMode('registry')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewMode === 'registry' ? 'bg-white text-[#002116] shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Registry Table</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewMode === 'map' ? 'bg-white text-[#002116] shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Full Map</span>
              </button>
            </div>

            {/* Dynamic Temporal Horizon Controller */}
            <div className="flex-1 max-w-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#f2f8f5] p-2.5 rounded-xl border border-emerald-200/70">
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-lg bg-[#002116] text-emerald-300 hover:bg-[#12372a] transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause Playback' : 'Play Historical Progression'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>
                <button
                  onClick={() => setTemporalYear(prev => Math.max(2018, prev - 1))}
                  className="p-2 rounded-lg bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                  title="Step Backward (1 Year)"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTemporalYear(prev => Math.min(2026, prev + 1))}
                  className="p-2 rounded-lg bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                  title="Step Forward (1 Year)"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setTemporalYear(2026);
                    setIsPlaying(false);
                  }}
                  className="p-2 rounded-lg bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                  title="Reset to 2026 Horizon"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Slider Component */}
              <div className="flex-1 w-full flex items-center gap-3">
                <input
                  type="range"
                  min="2018"
                  max="2026"
                  step="1"
                  value={temporalYear}
                  onChange={(e) => {
                    setTemporalYear(parseInt(e.target.value, 10));
                    setIsPlaying(false);
                  }}
                  className="w-full accent-[#002116] cursor-pointer"
                />
                <div className="shrink-0 text-right">
                  <span className="text-xs font-mono font-bold text-[#002116] bg-white px-2.5 py-1 rounded-md border border-emerald-300 shadow-xs block">
                    {temporalYear} Horizon
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pt-3 border-t border-stone-100">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by Report ID, village, water source (e.g. 'HP-016'), or symptom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#2E8B68] focus:bg-white font-mono text-stone-800 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Select Filters */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-stone-200 bg-stone-50 rounded-xl focus:ring-2 focus:ring-[#2E8B68] text-xs font-mono text-stone-800 outline-none cursor-pointer"
              >
                <option value="All">All Statuses ({reports.length})</option>
                <option value="Reported">Reported</option>
                <option value="Under Review">Under Review</option>
                <option value="Field Verified">Field Verified</option>
                <option value="Lab Verified">Lab Verified</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select 
                value={villageFilter} 
                onChange={(e) => setVillageFilter(e.target.value)}
                className="p-2 border border-stone-200 bg-stone-50 rounded-xl focus:ring-2 focus:ring-[#2E8B68] text-xs font-mono text-stone-800 outline-none cursor-pointer"
              >
                <option value="All">All Villages</option>
                {villages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>

              <select 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="p-2 border border-stone-200 bg-stone-50 rounded-xl focus:ring-2 focus:ring-[#2E8B68] text-xs font-mono text-stone-800 outline-none cursor-pointer"
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {categories.length > 0 && (
                <select 
                  value={categoryFilter} 
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="p-2 border border-stone-200 bg-stone-50 rounded-xl focus:ring-2 focus:ring-[#2E8B68] text-xs font-mono text-stone-800 outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Active Result Count & Reset Button */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-stone-500 pt-2 border-t border-stone-100 gap-2">
            <span>
              Showing <strong className="text-stone-900">{filteredReports.length}</strong> of <strong className="text-stone-900">{reports.length}</strong> observations
              {temporalYear < 2026 && (
                <span className="ml-2 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                  (Filtered to ≤ {temporalYear})
                </span>
              )}
            </span>

            <div className="flex items-center gap-3">
              {(statusFilter !== 'All' || villageFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All' || searchQuery || temporalYear < 2026) && (
                <button 
                  onClick={() => {
                    setStatusFilter('All');
                    setVillageFilter('All');
                    setPriorityFilter('All');
                    setCategoryFilter('All');
                    setSearchQuery('');
                    setTemporalYear(2026);
                  }}
                  className="text-[#2E8B68] hover:underline font-bold cursor-pointer text-xs"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Spatial Map & Contextual Info Workspace (Visible in 'split' or 'map' mode) */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className="mb-8 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            {/* Map Header & Toolbar */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2E8B68]" />
                <span className="font-serif font-bold text-sm text-[#002116]">
                  Community Environmental GIS Map
                </span>
                <span className="text-[11px] font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                  OpenStreetMap Raster Layer · {temporalYear} Historical Telemetry
                </span>
              </div>

              {/* Data-Driven Map Layer Legend & Toggles (Single Source of Truth) */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                {/* 1. Safe Sources (GREEN) */}
                <button
                  onClick={() => setActiveLayers(prev => ({ ...prev, safeSources: !prev.safeSources }))}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeLayers.safeSources ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold' : 'bg-stone-100 border-stone-200 text-stone-400'
                  }`}
                  title="Toggle Safe Potable Water Sources"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#15803d]"></span>
                  <span>Safe Sources ({safeSourcesCount})</span>
                </button>

                {/* 2. Contaminated Sources (RED) */}
                <button
                  onClick={() => setActiveLayers(prev => ({ ...prev, contaminatedSources: !prev.contaminatedSources }))}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeLayers.contaminatedSources ? 'bg-red-100 border-red-300 text-red-900 font-bold' : 'bg-stone-100 border-stone-200 text-stone-400'
                  }`}
                  title="Toggle Contaminated Wells"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]"></span>
                  <span>Contaminated ({contaminatedSourcesCount})</span>
                </button>

                {/* 3. Cr(VI) Dispersion Plume (PINK/ORANGE) */}
                <button
                  onClick={() => setActiveLayers(prev => ({ ...prev, plumes: !prev.plumes }))}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeLayers.plumes ? 'bg-rose-100 border-rose-300 text-rose-900 font-bold' : 'bg-stone-100 border-stone-200 text-stone-400'
                  }`}
                  title="Toggle Model-Estimated Cr(VI) Plume Overlays"
                >
                  <span className="w-3 h-2 rounded bg-[#fb7185] border border-[#e11d48]"></span>
                  <span>Cr(VI) Plume (Model-Estimated)</span>
                </button>

                {/* 4. Citizen Reports (AMBER) */}
                <button
                  onClick={() => setActiveLayers(prev => ({ ...prev, reports: !prev.reports }))}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeLayers.reports ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold' : 'bg-stone-100 border-stone-200 text-stone-400'
                  }`}
                  title="Toggle Citizen Field Observations"
                >
                  <span className="text-amber-600 font-bold">⚠️</span>
                  <span>Citizen Reports ({filteredReports.length})</span>
                </button>

                {/* 5. Village Hubs */}
                <button
                  onClick={() => setActiveLayers(prev => ({ ...prev, villages: !prev.villages }))}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeLayers.villages ? 'bg-stone-200 border-stone-400 text-stone-900 font-bold' : 'bg-stone-100 border-stone-200 text-stone-400'
                  }`}
                  title="Toggle Village Hubs"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#12372a]"></span>
                  <span>Villages ({villages.length})</span>
                </button>

                <button
                  onClick={handleLocateMe}
                  className="p-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-stone-700 cursor-pointer"
                  title="Locate Current Position (GPS)"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleResetMapView}
                  className="p-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-stone-700 cursor-pointer"
                  title="Reset Map Bounds"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2-Column GIS Workspace (Map on Left, Contextual Panel on Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
              {/* Map Canvas (8 Columns) */}
              <div className="lg:col-span-8 relative">
                <div 
                  ref={mapContainer} 
                  className={`w-full ${viewMode === 'map' ? 'h-[75vh]' : 'h-96 sm:h-[480px]'} bg-stone-100 relative`}
                />

                {/* Floating Map Hint */}
                <div className="absolute top-3 left-3 pointer-events-none bg-white/90 backdrop-blur-xs px-3 py-1 rounded-lg border border-stone-200 text-[10px] font-mono text-stone-600 shadow-sm flex items-center gap-1.5">
                  <Info className="w-3 h-3 text-[#2E8B68]" />
                  <span>Click any marker or plume polygon to open telemetry</span>
                </div>

                {/* Micro banner if temporal year before 2020 */}
                {temporalYear < 2020 && (
                  <div className="absolute bottom-2 left-2 right-2 bg-amber-50/95 backdrop-blur-xs p-2 rounded-lg border border-amber-300 text-center text-xs font-mono text-amber-800 shadow-sm">
                    Pre-surveillance baseline ({temporalYear}): Verified CGWB testing and citizen reporting commenced in January 2020.
                  </div>
                )}
              </div>

              {/* Contextual Entity Information Panel (4 Columns) */}
              <div className="lg:col-span-4 bg-stone-50 border-t lg:border-t-0 lg:border-l border-stone-200 p-5 flex flex-col justify-between overflow-y-auto max-h-[500px]">
                {selectedEntity ? (
                  <div className="space-y-4">
                    {/* Panel Header */}
                    <div className="flex items-start justify-between border-b border-stone-200 pb-3">
                      <div>
                        {selectedEntity.type === 'report' && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                              CITIZEN FIELD OBSERVATION
                            </span>
                            {getPriorityBadge(selectedEntity.report.priority)}
                          </div>
                        )}
                        {selectedEntity.type === 'safeSource' && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-[#15803d]"></span> SAFE DRINKING SOURCE
                            </span>
                          </div>
                        )}
                        {selectedEntity.type === 'contaminatedSource' && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-mono font-bold bg-red-100 text-red-900 px-2 py-0.5 rounded flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-red-600" /> CONTAMINATED WATER POINT
                            </span>
                          </div>
                        )}
                        {selectedEntity.type === 'plume' && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-900 px-2 py-0.5 rounded border border-rose-300 flex items-center gap-1">
                              <span className="w-2 h-2 bg-[#fb7185] rounded"></span> MODEL-ESTIMATED Cr(VI) PLUME
                            </span>
                          </div>
                        )}
                        {selectedEntity.type === 'village' && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-mono font-bold bg-[#ddf3e7] text-[#002116] px-2 py-0.5 rounded">
                              COMMUNITY POPULATION HUB
                            </span>
                          </div>
                        )}
                        {selectedEntity.type === 'groundwaterPoint' && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-mono font-bold bg-sky-100 text-sky-900 px-2 py-0.5 rounded">
                              PIEZOMETRIC MONITORING WELL
                            </span>
                          </div>
                        )}
                        {selectedEntity.type === 'contaminationSource' && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                              CONTAMINATION SOURCE
                            </span>
                          </div>
                        )}

                        <h3 className="font-serif font-bold text-lg text-[#002116] leading-snug">
                          {selectedEntity.type === 'report' ? selectedEntity.report.title || selectedEntity.report.category :
                           selectedEntity.type === 'safeSource' ? selectedEntity.source.name || selectedEntity.source.id :
                           selectedEntity.type === 'contaminatedSource' ? selectedEntity.source.name || selectedEntity.source.id :
                           selectedEntity.type === 'plume' ? selectedEntity.name :
                           selectedEntity.type === 'village' ? `${selectedEntity.village.name} (${selectedEntity.village.hindiName})` :
                           selectedEntity.type === 'groundwaterPoint' ? `Piezometer ${selectedEntity.point.id}` :
                           selectedEntity.source.name}
                        </h3>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedEntity(null);
                          setActiveMarkerId(null);
                        }}
                        className="p-1 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-700 cursor-pointer"
                        title="Close Detail Panel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content Details */}
                    {selectedEntity.type === 'report' && (
                      <div className="space-y-3 text-xs font-mono">
                        <p className="font-sans text-stone-700 bg-white p-3 rounded-xl border border-stone-200 leading-relaxed italic">
                          "{selectedEntity.report.description}"
                        </p>

                        {selectedEntity.report.photoUrl && (
                          <div 
                            className="relative h-28 rounded-xl overflow-hidden border border-stone-200 bg-stone-900 cursor-pointer group"
                            onClick={() => setEnlargedImage(selectedEntity.report.photoUrl || null)}
                          >
                            <img 
                              src={selectedEntity.report.photoUrl} 
                              alt="Evidence thumbnail" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute bottom-1.5 left-2 text-[9px] bg-black/80 text-emerald-300 px-1.5 py-0.5 rounded">
                              {selectedEntity.report.isSynthetic ? 'Illustrative Image — Synthetic' : 'Photographic Evidence'}
                            </span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-stone-200 text-[11px]">
                          <div>
                            <span className="text-stone-400 block text-[10px]">RECORD ID</span>
                            <strong>{selectedEntity.report.id}</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">DATE FILED</span>
                            <strong>{selectedEntity.report.date}</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">LOCATION</span>
                            <span>{selectedEntity.report.locationName || 'Village Cluster'}</span>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">REPORTER</span>
                            <span>{selectedEntity.report.reporterType || 'Resident'}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-200">
                          <button
                            onClick={() => setFullModalReport(selectedEntity.report)}
                            className="px-3 py-1.5 bg-[#002116] hover:bg-[#12372a] text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            View Full Details →
                          </button>
                          <button
                            onClick={() => setReportToDelete(selectedEntity.report)}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedEntity.type === 'safeSource' && (
                      <div className="space-y-3 text-xs font-mono">
                        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                          <span className="text-emerald-800 font-bold block mb-1">WHO COMPLIANT POTABLE SOURCE</span>
                          <p className="text-emerald-700 font-sans text-xs">
                            Chemical lab analysis confirms total chromium concentration is well below the 0.05 mg/L drinking water threshold.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-stone-200 text-[11px]">
                          <div>
                            <span className="text-stone-400 block text-[10px]">SOURCE ID</span>
                            <strong className="text-stone-900">{selectedEntity.source.id}</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">STATUS</span>
                            <strong className="text-emerald-700">Verified Safe</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">LATEST Cr(VI)</span>
                            <strong className="text-emerald-800">
                              {selectedEntity.source.activeMeasurement?.value || 0.002} mg/L
                            </strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">TEST HORIZON</span>
                            <span>{temporalYear}</span>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">POPULATION</span>
                            <span>{selectedEntity.source.populationServed || 250} Served</span>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">PUMP TYPE</span>
                            <span>{selectedEntity.source.type || 'India Mark II'}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex flex-wrap gap-2">
                          <Link
                            href={`/water-safety?source=${encodeURIComponent(selectedEntity.source.id)}`}
                            className="px-3 py-1.5 bg-[#12372a] hover:bg-[#002116] text-white rounded-lg text-xs font-bold"
                          >
                            Check Water Safety →
                          </Link>
                          <Link
                            href={`/villages/${selectedEntity.source.villageId}`}
                            className="px-3 py-1.5 bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg text-xs"
                          >
                            View Village Twin
                          </Link>
                        </div>
                      </div>
                    )}

                    {selectedEntity.type === 'contaminatedSource' && (
                      <div className="space-y-3 text-xs font-mono">
                        <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-red-900">
                          <span className="font-bold block mb-1">HAZARDOUS: DO NOT USE FOR DRINKING</span>
                          <p className="font-sans text-xs text-red-800">
                            Hexavalent chromium concentration exceeds WHO permissible standard. Direct ingestion causes acute gastric cytotoxicity and cellular ulceration.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-stone-200 text-[11px]">
                          <div>
                            <span className="text-stone-400 block text-[10px]">SOURCE ID</span>
                            <strong className="text-red-700">{selectedEntity.source.id}</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">CRITICAL Cr(VI)</span>
                            <strong className="text-red-700 text-sm">
                              {selectedEntity.source.activeMeasurement?.value || 0.19} mg/L
                            </strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">WHO MULTIPLIER</span>
                            <strong className="text-red-800">
                              {((selectedEntity.source.activeMeasurement?.value || 0.19) / 0.05).toFixed(1)}× Limit
                            </strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">STATUS</span>
                            <span className="text-red-600 font-bold">{selectedEntity.source.status.toUpperCase()}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex flex-wrap gap-2">
                          <Link
                            href={`/water-safety?source=${encodeURIComponent(selectedEntity.source.id)}`}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
                          >
                            Alternative Safe Sources →
                          </Link>
                          <Link
                            href={`/villages/${selectedEntity.source.villageId}`}
                            className="px-3 py-1.5 bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg text-xs"
                          >
                            Village Digital Twin
                          </Link>
                        </div>
                      </div>
                    )}

                    {selectedEntity.type === 'plume' && (
                      <div className="space-y-3 text-xs font-mono">
                        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-900">
                          <span className="font-bold block mb-1">MODEL-ESTIMATED DISPERSION ZONE</span>
                          <p className="font-sans text-xs text-rose-800 leading-relaxed">
                            {selectedEntity.notes}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-stone-200 text-[11px]">
                          <div>
                            <span className="text-stone-400 block text-[10px]">ZONE ID</span>
                            <strong className="text-stone-900">{selectedEntity.zoneId}</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">TEMPORAL HORIZON</span>
                            <strong>{selectedEntity.temporalContext}</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">MAX MEASURED Cr</span>
                            <strong className="text-red-700">{selectedEntity.maxObservedCr}</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">CONFIDENCE</span>
                            <span className="text-emerald-700 font-semibold">{selectedEntity.confidence}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-stone-400 block text-[10px]">NEARBY WATER SOURCES</span>
                            <span className="text-[#006492] font-semibold">{selectedEntity.nearbyWaterSources}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-stone-400 block text-[10px]">HYDRAULIC TRANSPORT</span>
                            <span>{selectedEntity.flowDirection}</span>
                          </div>
                        </div>

                        <div className="pt-1">
                          <span className="text-[10px] text-stone-400 block italic">
                            *Predicted spatial boundary computed using 2D solute advection in unconfined micaceous sands.
                          </span>
                        </div>
                      </div>
                    )}

                    {selectedEntity.type === 'village' && (
                      <div className="space-y-3 text-xs font-mono">
                        <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2 text-[11px]">
                          <div>
                            <span className="text-stone-400 block text-[10px]">POPULATION</span>
                            <strong className="text-stone-900 text-sm">{selectedEntity.village.population.toLocaleString()} Residents</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">DISTRICT &amp; BLOCK</span>
                            <span>{selectedEntity.village.district} · {selectedEntity.village.block} Block</span>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">VULNERABILITY LEVEL</span>
                            <span className="font-bold text-red-700">{selectedEntity.village.riskLevel.toUpperCase()}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex flex-wrap gap-2">
                          <Link
                            href={`/villages/${selectedEntity.village.id}`}
                            className="px-3 py-1.5 bg-[#002116] hover:bg-[#12372a] text-white rounded-lg text-xs font-bold"
                          >
                            Open Digital Twin →
                          </Link>
                          <button
                            onClick={() => setVillageFilter(selectedEntity.village.id)}
                            className="px-3 py-1.5 bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg text-xs cursor-pointer"
                          >
                            Filter Reports
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedEntity.type === 'groundwaterPoint' && (
                      <div className="space-y-3 text-xs font-mono">
                        <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl text-sky-900 text-[11px]">
                          <span className="font-bold block mb-1">AQUIFER SURVEILLANCE WELL</span>
                          <p className="font-sans text-xs text-sky-800">
                            Equipped with automated piezometric transducers logging unconfined water table depth and baseline mineralization.
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-stone-200 text-[11px] grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-stone-400 block text-[10px]">DEPTH</span>
                            <strong>{selectedEntity.point.depth ?? (selectedEntity.point as any).depthM ?? 15} Meters</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">DATA STATUS</span>
                            <span className="font-bold text-emerald-700">{((selectedEntity.point as any).dataStatus || 'VERIFIED').toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedEntity.type === 'contaminationSource' && (
                      <div className="space-y-3 text-xs font-mono">
                        <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-purple-900 text-[11px]">
                          <span className="font-bold block mb-1">POINT EMISSION VECTOR</span>
                          <p className="font-sans text-xs text-purple-800">
                            {selectedEntity.source.description || `${selectedEntity.source.name} point emission effluent vector with estimated impact radius of ${selectedEntity.source.estimatedImpactRadius || 500}m.`}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-stone-200 text-[11px] grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-stone-400 block text-[10px]">FACILITY TYPE</span>
                            <strong>{selectedEntity.source.type.toUpperCase()}</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">STATUS</span>
                            <strong className="text-red-700">{selectedEntity.source.status.toUpperCase()}</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Compass className="w-10 h-10 text-stone-300 mb-2" />
                    <h4 className="font-serif font-bold text-sm text-stone-700">No Entity Selected</h4>
                    <p className="text-stone-500 text-xs font-mono mt-1 max-w-xs leading-relaxed">
                      Click any pin, safe water well, contaminated pump, or Cr(VI) dispersion plume on the map to inspect real-time scientific telemetry.
                    </p>
                  </div>
                )}

                {/* Micro panel footer */}
                <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span>Sentinel Region: Kanpur</span>
                  <span>Spatial GIS Engine</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode: Community Registry (High-Density Table View) */}
        {(viewMode === 'registry') && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden mb-8">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[#002116]">Community Telemetry Registry</h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">Filterable tabular registry of field observations and community telemetry</p>
              </div>
              <span className="text-xs font-mono bg-white px-2.5 py-1 rounded border border-stone-200 font-bold">
                {filteredReports.length} Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-stone-100 text-stone-600 uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Report ID</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Location / Village</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Linked Source</th>
                    <th className="p-3.5">Reporter</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {filteredReports.map(report => {
                    const villageObj = villages.find(v => v.id === report.villageId);
                    return (
                      <tr key={report.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-[#002116]">
                          <button
                            onClick={() => setFullModalReport(report)}
                            className="hover:text-[#2E8B68] hover:underline cursor-pointer"
                          >
                            {report.id}
                          </button>
                        </td>
                        <td className="p-3.5 text-stone-500 whitespace-nowrap">
                          {report.date}
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-stone-900 block">{villageObj?.name || 'Kanpur Cluster'}</span>
                          <span className="text-stone-400 text-[10px] block">{report.locationName || 'Ward Area'}</span>
                        </td>
                        <td className="p-3.5 text-stone-700">
                          {report.category}
                        </td>
                        <td className="p-3.5">
                          {getPriorityBadge(report.priority)}
                        </td>
                        <td className="p-3.5">
                          {getStatusBadge(report.status)}
                        </td>
                        <td className="p-3.5">
                          {report.waterSourceId ? (
                            <Link 
                              href={`/water-safety?source=${encodeURIComponent(report.waterSourceId)}`}
                              className="text-[#006492] font-bold hover:underline"
                            >
                              {report.waterSourceId}
                            </Link>
                          ) : (
                            <span className="text-stone-400">—</span>
                          )}
                        </td>
                        <td className="p-3.5 text-stone-500">
                          {report.reporterType || 'Resident'}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleLocateOnMap(report)}
                              className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors cursor-pointer"
                              title="Locate on Map"
                            >
                              <MapPin className="w-3.5 h-3.5 text-[#2E8B68]" />
                            </button>
                            <button
                              onClick={() => setFullModalReport(report)}
                              className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors cursor-pointer"
                              title="Inspect Details"
                            >
                              <Eye className="w-3.5 h-3.5 text-sky-700" />
                            </button>
                            <button
                              onClick={() => setReportToDelete(report)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors cursor-pointer"
                              title="Delete Observation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Mode: Ground Cards Grid (Visible in 'split' or 'cards' mode) */}
        {(viewMode === 'split' || viewMode === 'cards') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-bold text-xl text-[#002116]">
                Community Ground Observations
              </h2>
              <span className="text-xs font-mono text-stone-500">
                {filteredReports.length} documented observations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map(report => {
                const villageObj = villages.find(v => v.id === report.villageId);
                const villageName = villageObj?.name || report.locationName || 'Rural Cluster';
                const photoSrc = report.photoUrl || report.photoDataUrl;
                const isSelected = activeMarkerId === report.id || (selectedEntity?.type === 'report' && selectedEntity.report.id === report.id);

                return (
                  <div 
                    key={report.id} 
                    className={`bg-white rounded-2xl shadow-sm border ${
                      isSelected ? 'border-[#2E8B68] ring-2 ring-[#2E8B68]/30 shadow-md' : 'border-stone-200'
                    } overflow-hidden hover:shadow-md hover:border-[#2E8B68]/60 transition-all flex flex-col justify-between`}
                  >
                    <div>
                      {/* Photo Banner with Authentic Semantic Image and Fallback */}
                      {photoSrc ? (
                        <div className="relative h-44 w-full overflow-hidden bg-stone-900 group">
                          <img 
                            src={photoSrc} 
                            alt={report.title || report.category} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => setEnlargedImage(photoSrc)}
                            onError={(e) => {
                              // Elegant fallback if network fails
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                          
                          {/* Provenance Badge (Phase 29: Differentiate Synthetic from Real Field Evidence) */}
                          <span className={`absolute bottom-2.5 left-3 text-[10px] font-mono px-2.5 py-0.5 rounded flex items-center gap-1.5 border ${
                            report.isSynthetic ? 'bg-indigo-950/90 text-indigo-300 border-indigo-500/40' : 'bg-black/80 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {report.isSynthetic ? (
                              <>
                                <Sparkles className="w-3 h-3 text-indigo-400" /> Illustrative Image — Synthetic
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-3 h-3 text-emerald-400" /> Photographic Evidence
                              </>
                            )}
                          </span>

                          <button
                            onClick={() => setEnlargedImage(photoSrc)}
                            className="absolute top-2.5 right-3 p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-lg transition-colors cursor-pointer"
                            title="Expand Image Lightbox"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-20 bg-stone-100 border-b border-stone-200 px-5 flex items-center justify-between text-xs font-mono text-stone-500">
                          <span className="flex items-center gap-1.5 font-semibold text-stone-700">
                            <Droplet className="w-4 h-4 text-[#2E8B68]" /> Field Incident Record
                          </span>
                          <span className="text-[10px] bg-stone-200 px-2 py-0.5 rounded text-stone-600">Observation Filed</span>
                        </div>
                      )}

                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2.5 gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                              {report.id}
                            </span>
                            {getPriorityBadge(report.priority)}
                          </div>
                          {getStatusBadge(report.status)}
                        </div>
                        
                        <h3 className="text-base font-serif font-bold text-[#002116] mb-1.5 leading-snug">
                          {report.title || report.category}
                        </h3>
                        
                        <p className="text-stone-600 text-xs mb-4 line-clamp-2 leading-relaxed">
                          "{report.description}"
                        </p>

                        <div className="space-y-1.5 text-xs font-mono text-stone-500 pt-3 border-t border-stone-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#2E8B68]" />
                              <Link 
                                href={`/villages/${report.villageId}`}
                                className="font-semibold text-stone-800 hover:text-[#006492] hover:underline truncate"
                                title="Open Village Digital Twin"
                              >
                                {villageName}
                              </Link>
                            </div>
                            {report.waterSourceId && (
                              <Link
                                href={`/water-safety?source=${encodeURIComponent(report.waterSourceId)}`}
                                className="text-[11px] bg-sky-50 text-[#006492] px-1.5 py-0.5 rounded font-bold hover:underline"
                                title="Check Water Safety"
                              >
                                {report.waterSourceId}
                              </Link>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-stone-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-stone-400" />
                              {new Date(report.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                            <span>{report.reporterType || 'Resident'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Action Footer with Visible DELETE Button (Phase 18 & 19) */}
                    <div className="bg-[#f2f8f5] px-4 py-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleLocateOnMap(report)}
                        className="text-xs font-mono font-bold text-[#2E8B68] hover:text-[#002116] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Locate & Highlight on Map"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Locate</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setFullModalReport(report)}
                          className="text-xs font-mono font-bold text-[#006492] hover:text-[#002116] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          View Details →
                        </button>

                        <button
                          onClick={() => setReportToDelete(report)}
                          className="px-2.5 py-1 text-red-600 hover:text-red-800 hover:bg-red-100 bg-red-50 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Delete Community Observation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 my-8">
            <AlertCircle className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <p className="text-stone-800 font-serif text-xl font-bold">No community observations match this criteria</p>
            <p className="text-stone-500 text-xs font-mono mt-1 max-w-md mx-auto">
              Try adjusting your search terms, loosening status filters, or advancing the temporal horizon slider to 2026.
            </p>
            <button 
              onClick={() => {
                setStatusFilter('All');
                setVillageFilter('All');
                setPriorityFilter('All');
                setCategoryFilter('All');
                setSearchQuery('');
                setTemporalYear(2026);
              }}
              className="mt-4 px-5 py-2.5 bg-[#002116] hover:bg-[#12372a] text-white text-xs font-mono font-bold rounded-xl cursor-pointer"
            >
              Reset All Filters &amp; Horizon
            </button>
          </div>
        )}

        {/* Full Report Inspection Modal */}
        {fullModalReport && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl">
              <div className="p-6 border-b border-stone-200 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded">
                      {fullModalReport.id}
                    </span>
                    {getPriorityBadge(fullModalReport.priority)}
                    {getStatusBadge(fullModalReport.status)}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#002116]">
                    {fullModalReport.title || fullModalReport.category}
                  </h2>
                </div>
                <button 
                  onClick={() => setFullModalReport(null)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 text-sm">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-stone-400 mb-1.5">Field Narrative</h4>
                  <p className="text-stone-800 bg-stone-50 p-4 rounded-xl leading-relaxed border border-stone-200 font-sans text-sm">
                    "{fullModalReport.description}"
                  </p>
                </div>

                {/* Render Photographic Evidence */}
                {(fullModalReport.photoUrl || fullModalReport.photoDataUrl) && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-mono font-bold uppercase text-stone-400 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                        {fullModalReport.isSynthetic ? 'Illustrative Image — Synthetic' : 'Photographic Evidence'}
                      </h4>
                      <button
                        onClick={() => setEnlargedImage(fullModalReport.photoUrl || fullModalReport.photoDataUrl || null)}
                        className="text-xs font-mono text-[#006492] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> Full Lightbox View
                      </button>
                    </div>
                    <div 
                      onClick={() => setEnlargedImage(fullModalReport.photoUrl || fullModalReport.photoDataUrl || null)}
                      className="rounded-xl overflow-hidden border border-stone-200 max-h-80 bg-black flex items-center justify-center cursor-zoom-in group relative"
                    >
                      <img 
                        src={fullModalReport.photoUrl || fullModalReport.photoDataUrl} 
                        alt="Submitted evidence" 
                        className="max-h-80 object-contain w-full group-hover:scale-102 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/70 text-white px-2 py-1 rounded">
                        Click to enlarge
                      </span>
                    </div>
                  </div>
                )}

                {/* Geography & Location Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-[#f2f8f5] p-4 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-stone-500 block text-[10px]">VILLAGE / COMMUNITY</span>
                    <Link
                      href={`/villages/${fullModalReport.villageId}`}
                      className="text-stone-900 text-sm font-bold hover:text-[#006492] flex items-center gap-1"
                    >
                      {villages.find(v => v.id === fullModalReport.villageId)?.name || 'Rural Cluster'}
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </Link>
                    <span className="text-stone-500 text-[11px] block mt-0.5">
                      {fullModalReport.locationName || 'Local Panchayat Ward'}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px]">COORDINATES</span>
                    <strong className="text-stone-900 text-sm">
                      {(typeof (fullModalReport.coordinates as any)?.lat === 'number' ? (fullModalReport.coordinates as any).lat : (fullModalReport.coordinates as any)?.[1] ?? 26.4481).toFixed(4)}°N, {(typeof (fullModalReport.coordinates as any)?.lon === 'number' ? (fullModalReport.coordinates as any).lon : (fullModalReport.coordinates as any)?.[0] ?? 80.0102).toFixed(4)}°E
                    </strong>
                    {fullModalReport.waterSourceId && (
                      <Link
                        href={`/water-safety?source=${encodeURIComponent(fullModalReport.waterSourceId)}`}
                        className="text-stone-600 text-[11px] block mt-0.5 hover:underline"
                      >
                        Linked Source: <strong className="text-[#006492]">{fullModalReport.waterSourceId}</strong>
                      </Link>
                    )}
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px]">SUBMISSION DATE</span>
                    <strong className="text-stone-900">
                      {new Date(fullModalReport.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </strong>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px]">VERIFICATION PROGRESS</span>
                    <strong className="text-emerald-800 font-bold">
                      {fullModalReport.verificationStatus || 'En route to District Team'}
                    </strong>
                  </div>

                  {fullModalReport.reporterType && (
                    <div>
                      <span className="text-stone-500 block text-[10px]">REPORTER PERSONA</span>
                      <strong className="text-stone-900">
                        {fullModalReport.reporterName || 'Anonymized'} ({fullModalReport.reporterType})
                      </strong>
                    </div>
                  )}

                  {fullModalReport.reporterPhone && (
                    <div>
                      <span className="text-stone-500 block text-[10px]">CONTACT PHONE</span>
                      <strong className="text-stone-900">{fullModalReport.reporterPhone}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setReportToDelete(fullModalReport);
                  }}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Observation
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleLocateOnMap(fullModalReport);
                      setFullModalReport(null);
                    }}
                    className="px-4 py-2 bg-white border border-stone-300 text-stone-800 rounded-xl text-xs font-mono font-bold hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#2E8B68]" />
                    Locate on Spatial Map
                  </button>

                  <button
                    onClick={() => setFullModalReport(null)}
                    className="px-4 py-2 bg-[#002116] text-white rounded-xl text-xs font-mono font-bold cursor-pointer hover:bg-[#12372a]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog (Phase 20 & 21: Persistent Soft Deletion) */}
        {reportToDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
              <div className="flex items-start gap-3 text-red-600">
                <div className="p-2.5 bg-red-100 rounded-xl shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Delete Community Observation?
                  </h3>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">
                    This action will remove the observation from the active Community Registry, the spatial GIS map, and regional health risk models.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono space-y-1">
                <div><span className="text-stone-400">ID:</span> <strong className="text-stone-800">{reportToDelete.id}</strong></div>
                <div><span className="text-stone-400">Title:</span> <span className="text-stone-800">{reportToDelete.title || reportToDelete.category}</span></div>
                <div><span className="text-stone-400">Date:</span> <span className="text-stone-800">{reportToDelete.date}</span></div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-stone-700 mb-1.5">
                  Reason for Deletion:
                </label>
                <select
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="Resolved / Decommissioned site">Resolved / Decommissioned site</option>
                  <option value="Duplicate community observation">Duplicate community observation</option>
                  <option value="Erroneous coordinates or misidentification">Erroneous coordinates or misidentification</option>
                  <option value="Lab testing proved non-chromium related">Lab testing proved non-chromium related</option>
                  <option value="Administrative / Test record cleanup">Administrative / Test record cleanup</option>
                  <option value="Other">Other / Custom justification</option>
                </select>

                {deleteReason === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter specific justification..."
                    value={customDeleteReason}
                    onChange={(e) => setCustomDeleteReason(e.target.value)}
                    className="w-full mt-2 p-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-red-500"
                  />
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setReportToDelete(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Confirm Deletion
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enlarged Photo Lightbox Modal */}
        {enlargedImage && (
          <div 
            onClick={() => setEnlargedImage(null)}
            className="fixed inset-0 bg-black/90 z-70 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
              <img 
                src={enlargedImage} 
                alt="Enlarged photographic evidence" 
                className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
              />
              <button
                onClick={() => setEnlargedImage(null)}
                className="absolute top-2 right-2 p-2 bg-black/80 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                title="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ReportsDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f4fbf7]">
        <div className="text-center font-mono text-sm text-[#002116] flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-[#002116] border-t-transparent animate-spin"></div>
          <span>Loading Community Telemetry Workspace...</span>
        </div>
      </div>
    }>
      <ReportsDashboardContent />
    </Suspense>
  );
}
