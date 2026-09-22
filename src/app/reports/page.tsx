'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { getDb, CommunityReportRecord } from '@/lib/db/store';
import type { WaterSource, Village, GroundwaterPoint, ContaminationSource } from '@/lib/types';
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
  category: 'water' | 'hazard' | 'community' | 'infrastructure';
  color: string;
  activeColor: string;
  badgeBg: string;
  badgeBorder: string;
  icon: string;
  description: string;
  defaultVisible: boolean;
  isModelEstimated?: boolean;
}

export const COMMUNITY_MAP_LAYERS: CommunityMapLayerDef[] = [
  {
    id: 'safeSources',
    label: 'Safe Drinking Sources',
    category: 'water',
    color: '#15803d',
    activeColor: 'bg-emerald-700',
    badgeBg: 'bg-emerald-100 text-emerald-950',
    badgeBorder: 'border-emerald-400',
    icon: '●',
    description: 'Verified Potable Wells, Solar RO & JJM Standposts (Cr ≤ 0.05 mg/L)',
    defaultVisible: true,
  },
  {
    id: 'contaminatedSources',
    label: 'Contaminated / Restricted',
    category: 'hazard',
    color: '#dc2626',
    activeColor: 'bg-red-700',
    badgeBg: 'bg-red-100 text-red-950',
    badgeBorder: 'border-red-400',
    icon: '●',
    description: 'Hazardous Unconfined Aquifer Sources Exceeding Permissible Limits',
    defaultVisible: true,
  },
  {
    id: 'plumes',
    label: 'Hexavalent Cr(VI) Dispersion Plume',
    category: 'hazard',
    color: '#fb7185',
    activeColor: 'bg-rose-600',
    badgeBg: 'bg-rose-100 text-rose-950',
    badgeBorder: 'border-rose-400',
    icon: '▰',
    description: 'Hydrogeological Model-Estimated Subsurface Dispersion Footprint',
    defaultVisible: true,
    isModelEstimated: true,
  },
  {
    id: 'reports',
    label: 'Citizen Ground Observations',
    category: 'community',
    color: '#f59e0b',
    activeColor: 'bg-amber-600',
    badgeBg: 'bg-amber-100 text-amber-950',
    badgeBorder: 'border-amber-400',
    icon: '⚠️',
    description: 'Participatory Field Telemetry & Contamination Observations',
    defaultVisible: true,
  },
  {
    id: 'villages',
    label: 'Village Population Hubs',
    category: 'community',
    color: '#12372a',
    activeColor: 'bg-stone-800',
    badgeBg: 'bg-emerald-50 text-emerald-950',
    badgeBorder: 'border-emerald-300',
    icon: '●',
    description: 'Regional Panchayats & High-Density Settlement Clusters',
    defaultVisible: true,
  },
  {
    id: 'groundwaterPoints',
    label: 'Aquifer Piezometers',
    category: 'infrastructure',
    color: '#0284c7',
    activeColor: 'bg-sky-700',
    badgeBg: 'bg-sky-100 text-sky-950',
    badgeBorder: 'border-sky-400',
    icon: '■',
    description: 'Automated Piezometric Transducers Logging Water Table & Salinity',
    defaultVisible: true,
  },
  {
    id: 'contaminationSources',
    label: 'Point Emission Vectors',
    category: 'infrastructure',
    color: '#7c3aed',
    activeColor: 'bg-purple-700',
    badgeBg: 'bg-purple-100 text-purple-950',
    badgeBorder: 'border-purple-400',
    icon: '🏭',
    description: 'Tannery Industrial Estates, Unlined Drains & Hazardous Dump Zones',
    defaultVisible: true,
  },
];

// Plume GeoJSON Generator with temporal advection scaling
function generatePlumeGeoJSON(year: number): any {
  if (year < 2020) {
    return {
      type: 'FeatureCollection',
      features: [],
    };
  }

  // Expansion coefficient: 2020 baseline (0.75) up to 2026 peak (1.35)
  const growth = 0.75 + (year - 2020) * 0.10;

  const raniaCenter = [80.301, 26.448];
  const khanchandpurCenter = [80.342, 26.465];

  const generateRotatedEllipse = (center: number[], semiMajor: number, semiMinor: number, angleDeg: number) => {
    const coords: number[][] = [];
    const rad = (angleDeg * Math.PI) / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);

    for (let i = 0; i <= 36; i++) {
      const theta = (i * 2 * Math.PI) / 36;
      const x = semiMajor * Math.cos(theta);
      const y = semiMinor * Math.sin(theta);
      const rotX = x * cosA - y * sinA;
      const rotY = x * sinA + y * cosA;
      coords.push([center[0] + rotX, center[1] + rotY]);
    }
    return coords;
  };

  const raniaBoundary = generateRotatedEllipse(raniaCenter, 0.024 * growth, 0.013 * growth, -30);
  const khanchandpurBoundary = generateRotatedEllipse(khanchandpurCenter, 0.021 * growth, 0.011 * growth, -25);

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'plume-rania',
        properties: {
          zoneId: 'PLUME-001',
          name: 'Rania Hexavalent Chromium Dispersion Plume',
          status: 'Model Estimated',
          contaminant: 'Hexavalent Chromium — Cr(VI)',
          temporalHorizon: `${year}`,
          temporalContext: `${year} Dispersion Boundary`,
          confidence: '89% Hydrogeological Confidence',
          associatedVillage: 'Rania (V-002)',
          nearbyWaterSources: 'HP-010, HP-011, HP-014',
          maxObservedCr: '0.34 mg/L Cr(VI)',
          flowDirection: 'South-Southeast (1.4 m/km regional gradient)',
          hydraulicConductivity: '14.2 m/day (Medium Alluvial Sand)',
          plumeAreaKm2: (1.8 * growth).toFixed(2),
          notes: 'High-risk unconfined aquifer advection zone moving southeast toward agricultural tube-wells.',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [raniaBoundary],
        },
      },
      {
        type: 'Feature',
        id: 'plume-khanchandpur',
        properties: {
          zoneId: 'PLUME-002',
          name: 'Khanchandpur Tannery Sludge Leaching Zone',
          status: 'Model Estimated',
          contaminant: 'Hexavalent Chromium — Cr(VI)',
          temporalHorizon: `${year}`,
          temporalContext: `${year} Dispersion Boundary`,
          confidence: '92% Hydrogeological Confidence',
          associatedVillage: 'Khanchandpur (V-001)',
          nearbyWaterSources: 'HP-001, HP-003, HP-007',
          maxObservedCr: '0.28 mg/L Cr(VI)',
          flowDirection: 'East-Southeast (0.9 m/km gradient)',
          hydraulicConductivity: '11.8 m/day (Fine-Medium Silty Sand)',
          plumeAreaKm2: (1.3 * growth).toFixed(2),
          notes: 'Legacy chrome cake dumpsite leaching into shallow unconfined handpumps during monsoon percolation.',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [khanchandpurBoundary],
        },
      },
    ],
  };
}

// Entity types that can be selected on map or cards
export type SelectedMapEntity =
  | { type: 'report'; report: CommunityReportRecord }
  | { type: 'safeSource'; source: WaterSource }
  | { type: 'contaminatedSource'; source: WaterSource }
  | {
      type: 'plume';
      zoneId: string;
      name: string;
      status: string;
      contaminant: string;
      temporalHorizon: string;
      confidence: string;
      associatedVillage: string;
      nearbyWaterSources: string;
      maxObservedCr: string;
      flowDirection: string;
      hydraulicConductivity: string;
      plumeAreaKm2: string;
      notes: string;
    }
  | { type: 'village'; village: Village }
  | { type: 'groundwaterPoint'; point: GroundwaterPoint }
  | { type: 'contaminationSource'; source: ContaminationSource };

function CommunityReportsContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const deepReportId = searchParams.get('reportId') || searchParams.get('id');

  // Core Data States
  const [reports, setReports] = useState<CommunityReportRecord[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [rawWaterSources, setRawWaterSources] = useState<WaterSource[]>([]);
  const [groundwaterPoints, setGroundwaterPoints] = useState<GroundwaterPoint[]>([]);
  const [contaminationSources, setContaminationSources] = useState<ContaminationSource[]>([]);
  const [deletedCount, setDeletedCount] = useState<number>(0);

  // View & UI States
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [selectedEntity, setSelectedEntity] = useState<SelectedMapEntity | null>(null);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [fullModalReport, setFullModalReport] = useState<CommunityReportRecord | null>(null);
  const [reportToDelete, setReportToDelete] = useState<CommunityReportRecord | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [villageFilter, setVillageFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Temporal Horizon Engine
  const [temporalYear, setTemporalYear] = useState<number>(2026);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // MapLibre Instances
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const maplibreglRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

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

  // Load fresh data from store
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
    const handleUpdate = () => loadData();
    window.addEventListener('bhujal_data_updated', handleUpdate);
    return () => window.removeEventListener('bhujal_data_updated', handleUpdate);
  }, [loadData]);

  // Handle deep link
  useEffect(() => {
    if (deepReportId && reports.length > 0) {
      const target = reports.find(r => r.id === deepReportId);
      if (target) {
        setSelectedEntity({ type: 'report', report: target });
        setActiveMarkerId(target.id);
      }
    }
  }, [deepReportId, reports]);

  // Toast auto-hide
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      playbackTimerRef.current = setInterval(() => {
        setTemporalYear(prev => {
          if (prev >= 2026) {
            setIsPlaying(false);
            return 2018;
          }
          return prev + 1;
        });
      }, 1800);
    } else {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    }
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying]);

  // Water sources evaluated for the selected temporal year
  const temporalWaterSources = useMemo(() => {
    const db = getDb();
    return db.getWaterSourcesByYear ? db.getWaterSourcesByYear(temporalYear) : rawWaterSources;
  }, [temporalYear, rawWaterSources]);

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

  // Summary Counters
  const safeSourcesCount = useMemo(() => temporalWaterSources.filter(s => s.status === 'safe').length, [temporalWaterSources]);
  const contaminatedSourcesCount = useMemo(() => temporalWaterSources.filter(s => s.status === 'do_not_use' || s.status === 'restricted').length, [temporalWaterSources]);
  const activeReportsCount = useMemo(() => filteredReports.length, [filteredReports]);
  const criticalReportsCount = useMemo(() => filteredReports.filter(r => r.priority === 'Critical').length, [filteredReports]);

  // Categories list
  const categories = useMemo(() => {
    return Array.from(new Set(reports.map(r => r.category))).filter(Boolean);
  }, [reports]);

  // Safe GeoJSON builders
  const safeSourcesGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: temporalWaterSources
        .filter(s => s.status === 'safe')
        .map(s => ({
          type: 'Feature',
          id: s.id,
          properties: {
            entityType: 'safeSource',
            id: s.id,
            name: s.name || s.id,
            villageId: s.villageId,
            type: s.type,
            status: s.status,
            populationServed: s.populationServed,
          },
          geometry: {
            type: 'Point',
            coordinates: [s.coordinates.lon, s.coordinates.lat],
          },
        })),
    };
  }, [temporalWaterSources]);

  const contaminatedSourcesGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: temporalWaterSources
        .filter(s => s.status === 'do_not_use' || s.status === 'restricted')
        .map(s => ({
          type: 'Feature',
          id: s.id,
          properties: {
            entityType: 'contaminatedSource',
            id: s.id,
            name: s.name || s.id,
            villageId: s.villageId,
            type: s.type,
            status: s.status,
            populationServed: s.populationServed,
          },
          geometry: {
            type: 'Point',
            coordinates: [s.coordinates.lon, s.coordinates.lat],
          },
        })),
    };
  }, [temporalWaterSources]);

  const reportsGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: filteredReports.map(r => {
        const lat = typeof (r.coordinates as any)?.lat === 'number' ? (r.coordinates as any).lat : 26.4481;
        const lon = typeof (r.coordinates as any)?.lon === 'number' ? (r.coordinates as any).lon : 80.0102;
        return {
          type: 'Feature',
          id: r.id,
          properties: {
            entityType: 'report',
            id: r.id,
            title: r.title || r.category,
            category: r.category,
            priority: r.priority,
            status: r.status,
            villageId: r.villageId,
            locationName: r.locationName,
          },
          geometry: {
            type: 'Point',
            coordinates: [lon, lat],
          },
        };
      }),
    };
  }, [filteredReports]);

  const villagesGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: villages.map(v => ({
        type: 'Feature',
        id: v.id,
        properties: {
          entityType: 'village',
          id: v.id,
          name: v.name,
          hindiName: v.hindiName,
          population: v.population,
        },
        geometry: {
          type: 'Point',
          coordinates: [v.coordinates.lon, v.coordinates.lat],
        },
      })),
    };
  }, [villages]);

  const piezometersGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: groundwaterPoints.map(gp => {
        const lon = gp.coordinates?.lon ?? (gp as any).location?.coordinates?.[0] ?? 80.34;
        const lat = gp.coordinates?.lat ?? (gp as any).location?.coordinates?.[1] ?? 26.46;
        return {
          type: 'Feature',
          id: gp.id,
          properties: {
            entityType: 'groundwaterPoint',
            id: gp.id,
            name: gp.name,
            depth: gp.depth || (gp as any).depthM || 15,
            villageId: gp.villageId,
          },
          geometry: {
            type: 'Point',
            coordinates: [lon, lat],
          },
        };
      }),
    };
  }, [groundwaterPoints]);

  const contaminationSourcesGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: contaminationSources.map(cs => {
        const lon = cs.coordinates?.lon ?? (cs as any).location?.coordinates?.[0] ?? 80.34;
        const lat = cs.coordinates?.lat ?? (cs as any).location?.coordinates?.[1] ?? 26.46;
        return {
          type: 'Feature',
          id: cs.id,
          properties: {
            entityType: 'contaminationSource',
            id: cs.id,
            name: cs.name,
            type: cs.type,
            status: cs.status,
            impactRadius: cs.estimatedImpactRadius || 500,
          },
          geometry: {
            type: 'Point',
            coordinates: [lon, lat],
          },
        };
      }),
    };
  }, [contaminationSources]);

  // Highlight Feature GeoJSON for selected entity
  const highlightGeoJSON = useMemo(() => {
    if (!selectedEntity) {
      return { type: 'FeatureCollection', features: [] };
    }

    let coords: [number, number] | null = null;
    if (selectedEntity.type === 'report') {
      const lat = typeof (selectedEntity.report.coordinates as any)?.lat === 'number' ? (selectedEntity.report.coordinates as any).lat : 26.4481;
      const lon = typeof (selectedEntity.report.coordinates as any)?.lon === 'number' ? (selectedEntity.report.coordinates as any).lon : 80.0102;
      coords = [lon, lat];
    } else if (selectedEntity.type === 'safeSource' || selectedEntity.type === 'contaminatedSource') {
      coords = [selectedEntity.source.coordinates.lon, selectedEntity.source.coordinates.lat];
    } else if (selectedEntity.type === 'village') {
      coords = [selectedEntity.village.coordinates.lon, selectedEntity.village.coordinates.lat];
    } else if (selectedEntity.type === 'groundwaterPoint') {
      const lon = selectedEntity.point.coordinates?.lon ?? (selectedEntity.point as any).location?.coordinates?.[0] ?? 80.34;
      const lat = selectedEntity.point.coordinates?.lat ?? (selectedEntity.point as any).location?.coordinates?.[1] ?? 26.46;
      coords = [lon, lat];
    } else if (selectedEntity.type === 'contaminationSource') {
      const lon = selectedEntity.source.coordinates?.lon ?? (selectedEntity.source as any).location?.coordinates?.[0] ?? 80.34;
      const lat = selectedEntity.source.coordinates?.lat ?? (selectedEntity.source as any).location?.coordinates?.[1] ?? 26.46;
      coords = [lon, lat];
    }

    if (!coords) {
      return { type: 'FeatureCollection', features: [] };
    }

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { selected: true },
          geometry: {
            type: 'Point',
            coordinates: coords,
          },
        },
      ],
    };
  }, [selectedEntity]);

  // Initialize MapLibre GL GIS Map
  useEffect(() => {
    let isMounted = true;

    // Load MapLibre GL JS dynamically
    import('maplibre-gl')
      .then(maplibreModule => {
        if (!isMounted || !mapContainer.current) return;
        const maplibregl = (maplibreModule as any).default || maplibreModule;
        maplibreglRef.current = maplibregl;

        // Ensure MapLibre CSS is injected
        if (!document.getElementById('maplibre-css')) {
          const link = document.createElement('link');
          link.id = 'maplibre-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css';
          document.head.appendChild(link);
        }

        // Avoid re-initializing if instance exists
        if (mapInstanceRef.current) return;

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
          zoom: 11.2,
          attributionControl: false,
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

        map.on('load', () => {
          if (!isMounted) return;
          mapInstanceRef.current = map;

          // 1. Cr(VI) Plume Source & Layers (Pink / Rose)
          map.addSource('source-crvi-plume', {
            type: 'geojson',
            data: generatePlumeGeoJSON(temporalYear),
          });

          map.addLayer({
            id: 'crvi-plume-fill',
            type: 'fill',
            source: 'source-crvi-plume',
            paint: {
              'fill-color': '#fb7185',
              'fill-opacity': 0.35,
            },
          });

          map.addLayer({
            id: 'crvi-plume-line',
            type: 'line',
            source: 'source-crvi-plume',
            paint: {
              'line-color': '#e11d48',
              'line-width': 2.5,
              'line-dasharray': [3, 2],
            },
          });

          // 2. Safe Sources Layer (GREEN)
          map.addSource('source-safe-sources', {
            type: 'geojson',
            data: safeSourcesGeoJSON,
          });

          map.addLayer({
            id: 'layer-safe-sources',
            type: 'circle',
            source: 'source-safe-sources',
            paint: {
              'circle-color': '#15803d',
              'circle-radius': 7.5,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            },
          });

          // 3. Contaminated Sources Layer (RED / AMBER)
          map.addSource('source-contaminated-sources', {
            type: 'geojson',
            data: contaminatedSourcesGeoJSON,
          });

          map.addLayer({
            id: 'layer-contaminated-sources',
            type: 'circle',
            source: 'source-contaminated-sources',
            paint: {
              'circle-color': [
                'match',
                ['get', 'status'],
                'do_not_use', '#dc2626',
                '#d97706'
              ],
              'circle-radius': 7.5,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            },
          });

          // 4. Village Population Hubs Layer
          map.addSource('source-villages', {
            type: 'geojson',
            data: villagesGeoJSON,
          });

          map.addLayer({
            id: 'layer-villages',
            type: 'circle',
            source: 'source-villages',
            paint: {
              'circle-color': '#12372a',
              'circle-radius': 9,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#a7f3d0',
            },
          });

          // 5. Aquifer Piezometers Layer (Sky Blue)
          map.addSource('source-piezometers', {
            type: 'geojson',
            data: piezometersGeoJSON,
          });

          map.addLayer({
            id: 'layer-piezometers',
            type: 'circle',
            source: 'source-piezometers',
            paint: {
              'circle-color': '#0284c7',
              'circle-radius': 6.5,
              'circle-stroke-width': 1.5,
              'circle-stroke-color': '#ffffff',
            },
          });

          // 6. Point Contamination Sources Layer (Purple)
          map.addSource('source-contamination-sources', {
            type: 'geojson',
            data: contaminationSourcesGeoJSON,
          });

          map.addLayer({
            id: 'layer-contamination-sources',
            type: 'circle',
            source: 'source-contamination-sources',
            paint: {
              'circle-color': '#7c3aed',
              'circle-radius': 8,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#e9d5ff',
            },
          });

          // 7. Community Reports Layer (AMBER ⚠️)
          map.addSource('source-community-reports', {
            type: 'geojson',
            data: reportsGeoJSON,
          });

          map.addLayer({
            id: 'layer-community-reports',
            type: 'circle',
            source: 'source-community-reports',
            paint: {
              'circle-color': '#f59e0b',
              'circle-radius': 8.5,
              'circle-stroke-width': 2.5,
              'circle-stroke-color': '#ffffff',
            },
          });

          // 8. Dynamic Selection Highlight Halo
          map.addSource('source-selection-halo', {
            type: 'geojson',
            data: highlightGeoJSON,
          });

          map.addLayer({
            id: 'layer-selection-halo',
            type: 'circle',
            source: 'source-selection-halo',
            paint: {
              'circle-color': '#f59e0b',
              'circle-radius': 16,
              'circle-opacity': 0.15,
              'circle-stroke-width': 3,
              'circle-stroke-color': '#d97706',
            },
          });

          // Single Unified Click Dispatcher across all GIS layers
          map.on('click', (e: any) => {
            const interactiveLayers = [
              'layer-community-reports',
              'layer-safe-sources',
              'layer-contaminated-sources',
              'layer-villages',
              'layer-piezometers',
              'layer-contamination-sources',
              'crvi-plume-fill',
            ].filter(id => map.getLayer(id) && map.getLayoutProperty(id, 'visibility') !== 'none');

            const queried = map.queryRenderedFeatures(e.point, { layers: interactiveLayers });

            if (queried.length > 0) {
              const topFeature = queried[0];
              const layerId = topFeature.layer.id;
              const props = topFeature.properties;

              if (layerId === 'crvi-plume-fill') {
                setSelectedEntity({
                  type: 'plume',
                  zoneId: props.zoneId || 'PLUME-001',
                  name: props.name || 'Cr(VI) Dispersion Plume',
                  status: props.status || 'Model Estimated',
                  contaminant: props.contaminant || 'Hexavalent Chromium — Cr(VI)',
                  temporalHorizon: props.temporalHorizon || `${temporalYear}`,
                  confidence: props.confidence || '89% Hydrogeological Confidence',
                  associatedVillage: props.associatedVillage || 'Regional Cluster',
                  nearbyWaterSources: props.nearbyWaterSources || 'HP-010, HP-016',
                  maxObservedCr: props.maxObservedCr || '0.34 mg/L Cr(VI)',
                  flowDirection: props.flowDirection || 'South-Southeast (1.4 m/km)',
                  hydraulicConductivity: props.hydraulicConductivity || '14.2 m/day',
                  plumeAreaKm2: props.plumeAreaKm2 || '2.4',
                  notes: props.notes || 'Subsurface advection plume modeling.',
                });
                setActiveMarkerId(props.zoneId);
              } else if (layerId === 'layer-community-reports') {
                const r = reports.find(item => item.id === props.id);
                if (r) {
                  setSelectedEntity({ type: 'report', report: r });
                  setActiveMarkerId(r.id);
                }
              } else if (layerId === 'layer-safe-sources') {
                const s = temporalWaterSources.find(item => item.id === props.id);
                if (s) {
                  setSelectedEntity({ type: 'safeSource', source: s });
                  setActiveMarkerId(s.id);
                }
              } else if (layerId === 'layer-contaminated-sources') {
                const s = temporalWaterSources.find(item => item.id === props.id);
                if (s) {
                  setSelectedEntity({ type: 'contaminatedSource', source: s });
                  setActiveMarkerId(s.id);
                }
              } else if (layerId === 'layer-villages') {
                const v = villages.find(item => item.id === props.id);
                if (v) {
                  setSelectedEntity({ type: 'village', village: v });
                  setActiveMarkerId(v.id);
                }
              } else if (layerId === 'layer-piezometers') {
                const gp = groundwaterPoints.find(item => item.id === props.id);
                if (gp) {
                  setSelectedEntity({ type: 'groundwaterPoint', point: gp });
                  setActiveMarkerId(gp.id);
                }
              } else if (layerId === 'layer-contamination-sources') {
                const cs = contaminationSources.find(item => item.id === props.id);
                if (cs) {
                  setSelectedEntity({ type: 'contaminationSource', source: cs });
                  setActiveMarkerId(cs.id);
                }
              }
            }
          });

          // Hover cursor
          map.on('mousemove', (e: any) => {
            const interactiveLayers = [
              'layer-community-reports',
              'layer-safe-sources',
              'layer-contaminated-sources',
              'layer-villages',
              'layer-piezometers',
              'layer-contamination-sources',
              'crvi-plume-fill',
            ].filter(id => map.getLayer(id) && map.getLayoutProperty(id, 'visibility') !== 'none');

            const queried = map.queryRenderedFeatures(e.point, { layers: interactiveLayers });
            map.getCanvas().style.cursor = queried.length > 0 ? 'pointer' : '';
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

  // Update GeoJSON Sources when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;

    const plumeSource = map.getSource('source-crvi-plume');
    if (plumeSource) plumeSource.setData(generatePlumeGeoJSON(temporalYear));

    const safeSource = map.getSource('source-safe-sources');
    if (safeSource) safeSource.setData(safeSourcesGeoJSON);

    const contamSource = map.getSource('source-contaminated-sources');
    if (contamSource) contamSource.setData(contaminatedSourcesGeoJSON);

    const reportsSource = map.getSource('source-community-reports');
    if (reportsSource) reportsSource.setData(reportsGeoJSON);

    const villagesSource = map.getSource('source-villages');
    if (villagesSource) villagesSource.setData(villagesGeoJSON);

    const piezometersSource = map.getSource('source-piezometers');
    if (piezometersSource) piezometersSource.setData(piezometersGeoJSON);

    const csSource = map.getSource('source-contamination-sources');
    if (csSource) csSource.setData(contaminationSourcesGeoJSON);

    const highlightSource = map.getSource('source-selection-halo');
    if (highlightSource) highlightSource.setData(highlightGeoJSON);
  }, [
    mapLoaded,
    temporalYear,
    safeSourcesGeoJSON,
    contaminatedSourcesGeoJSON,
    reportsGeoJSON,
    villagesGeoJSON,
    piezometersGeoJSON,
    contaminationSourcesGeoJSON,
    highlightGeoJSON,
  ]);

  // Synchronize Layer Visibility toggles with MapLibre layers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;

    const toggle = (layerId: string, visible: boolean) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
      }
    };

    toggle('layer-safe-sources', activeLayers.safeSources);
    toggle('layer-contaminated-sources', activeLayers.contaminatedSources);
    toggle('crvi-plume-fill', activeLayers.plumes);
    toggle('crvi-plume-line', activeLayers.plumes);
    toggle('layer-community-reports', activeLayers.reports);
    toggle('layer-villages', activeLayers.villages);
    toggle('layer-piezometers', activeLayers.groundwaterPoints);
    toggle('layer-contamination-sources', activeLayers.contaminationSources);
  }, [activeLayers, mapLoaded]);

  // Handle Resize when switching view modes
  useEffect(() => {
    if (mapInstanceRef.current && (viewMode === 'split' || viewMode === 'map')) {
      const timer = setTimeout(() => {
        mapInstanceRef.current?.resize();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  // Action: Locate report on map
  const handleLocateOnMap = (report: CommunityReportRecord) => {
    setSelectedEntity({ type: 'report', report });
    setActiveMarkerId(report.id);

    if (viewMode === 'cards' || viewMode === 'registry') {
      setViewMode('split');
    }

    const lat = typeof (report.coordinates as any)?.lat === 'number' ? (report.coordinates as any).lat : 26.4481;
    const lon = typeof (report.coordinates as any)?.lon === 'number' ? (report.coordinates as any).lon : 80.0102;

    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.resize();
        mapInstanceRef.current.flyTo({
          center: [lon, lat],
          zoom: 13.5,
          speed: 1.2,
          curve: 1.4,
          essential: true,
        });
      }, 100);
    }
  };

  // Action: Reset map camera
  const handleResetMapView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [80.32, 26.45],
        zoom: 11.2,
        speed: 1.0,
      });
    }
  };

  // Action: Geolocation
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { longitude, latitude } = pos.coords;
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 14,
              speed: 1.2,
            });
            setToastMessage(`GPS Located: [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`);
          }
        },
        () => {
          setToastMessage('GPS location unavailable. Centering on Kanpur region.');
          handleResetMapView();
        }
      );
    }
  };

  // Action: Delete Report Handler
  const confirmDeleteReport = () => {
    if (!reportToDelete) return;
    const db = getDb();
    const success = db.deleteCommunityReport(reportToDelete.id, 'Citizen observation soft-deleted via Community interface');
    if (success) {
      if (selectedEntity?.type === 'report' && selectedEntity.report.id === reportToDelete.id) {
        setSelectedEntity(null);
        setActiveMarkerId(null);
      }
      setToastMessage(`Record ${reportToDelete.id} successfully removed from Community Registry & Map.`);
      loadData();
    }
    setReportToDelete(null);
  };

  // Action: Restore Deleted Reports
  const handleRestoreDeleted = () => {
    const db = getDb();
    db.resetDeletedReports();
    loadData();
    setToastMessage('All soft-deleted community records have been restored.');
  };

  // Action: Export CSV
  const handleExportCsv = () => {
    if (filteredReports.length === 0) {
      setToastMessage('No observations available to export.');
      return;
    }

    const headers = ['Report ID', 'Date', 'Priority', 'Category', 'Village', 'Location', 'Status', 'Reporter', 'Verified', 'Description'];
    const rows = filteredReports.map(r => {
      const v = villages.find(v => v.id === r.villageId)?.name || r.villageId;
      return [
        `"${r.id}"`,
        `"${r.date}"`,
        `"${r.priority || 'Medium'}"`,
        `"${r.category}"`,
        `"${v}"`,
        `"${(r.locationName || '').replace(/"/g, '""')}"`,
        `"${r.status}"`,
        `"${r.reporterType || r.reporterName || 'Resident'}"`,
        `"${r.verified ? 'Yes' : 'No'}"`,
        `"${(r.description || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bhujal_community_reports_${temporalYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage(`Exported ${filteredReports.length} records to CSV.`);
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-100 text-red-800 border border-red-200">CRITICAL</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 text-orange-800 border border-orange-200">HIGH</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-100 text-stone-800 border border-stone-200">LOW</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('verified') || s.includes('confirmed') || s.includes('resolved')) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> {status}
        </span>
      );
    }
    if (s.includes('review') || s.includes('pending') || s.includes('investigating')) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {status}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-100 text-stone-700 border border-stone-200">
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa] text-stone-900 font-sans selection:bg-[#2E8B68]/20 selection:text-[#002116]">
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
              Real-time community telemetry tracking hexavalent chromium discoloration, pungent chemical odors, and industrial discharge across Kanpur Nagar and Kanpur Dehat.
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
                <span>Full GIS Map</span>
              </button>
            </div>

            {/* Temporal Simulation Player Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTemporalYear(2018)}
                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 cursor-pointer"
                title="Reset to 2018 baseline"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  isPlaying ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Advection' : 'Play Timeline'}</span>
              </button>
              <button
                onClick={() => setTemporalYear(2026)}
                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 cursor-pointer"
                title="Fast forward to present (2026)"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Temporal Slider Track */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex justify-between items-center text-xs font-mono text-stone-500 mb-2">
              <span className="flex items-center gap-1.5 text-stone-700 font-bold">
                <Clock className="w-3.5 h-3.5 text-[#2E8B68]" />
                Temporal Advection Horizon:
              </span>
              <span className="px-2 py-0.5 bg-[#ddf3e7] text-[#002116] font-bold rounded border border-emerald-300 text-xs">
                {temporalYear} {temporalYear === 2026 ? '(Current Field Telemetry)' : '(Historical Reconstruction)'}
              </span>
            </div>

            <div className="relative">
              <input
                type="range"
                min="2018"
                max="2026"
                step="1"
                value={temporalYear}
                onChange={e => setTemporalYear(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#12372a]"
              />
              <div className="flex justify-between text-[11px] font-mono text-stone-400 mt-1.5 px-0.5">
                <span>2018 Baseline</span>
                <span>2020</span>
                <span>2022</span>
                <span>2024</span>
                <span className="font-bold text-[#002116]">2026 Present</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search observation by ID (CR-2026-001), village, chemical keyword, well ID..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B68]/30 focus:border-[#2E8B68] font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Selects */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Village Filter */}
              <select
                value={villageFilter}
                onChange={e => setVillageFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#2E8B68]/30"
              >
                <option value="All">All Villages ({villages.length})</option>
                {villages.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.hindiName})
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#2E8B68]/30"
              >
                <option value="All">All Statuses</option>
                <option value="Verified">Verified / Confirmed</option>
                <option value="Reported">Reported / Under Review</option>
                <option value="Resolved">Resolved / Decommissioned</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#2E8B68]/30"
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#2E8B68]/30"
              >
                <option value="All">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-stone-100 text-xs font-mono text-stone-500">
            <div className="flex items-center gap-2">
              <span>Showing:</span>
              <strong className="text-[#002116]">{filteredReports.length}</strong> of {reports.length} observations
              {(statusFilter !== 'All' || villageFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All' || searchQuery) && (
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

        {/* Spatial Map & Contextual Info Workspace (Continuously Mounted in DOM to prevent map loss) */}
        <div className={`mb-8 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden ${viewMode === 'cards' || viewMode === 'registry' ? 'hidden' : 'block'}`}>
          {/* Map Header & Toolbar */}
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2E8B68]" />
              <span className="font-serif font-bold text-sm text-[#002116]">
                Community Environmental GIS Map
              </span>
              <span className="text-[11px] font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                OpenStreetMap GIS Vector · {temporalYear} Telemetry
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
                title="Toggle Contaminated Water Sources"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]"></span>
                <span>Contaminated ({contaminatedSourcesCount})</span>
              </button>

              {/* 3. Cr(VI) Plumes (PINK) */}
              <button
                onClick={() => setActiveLayers(prev => ({ ...prev, plumes: !prev.plumes }))}
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeLayers.plumes ? 'bg-rose-100 border-rose-300 text-rose-900 font-bold' : 'bg-stone-100 border-stone-200 text-stone-400'
                }`}
                title="Toggle Model-Estimated Cr(VI) Plumes"
              >
                <span className="w-2.5 h-2.5 bg-[#fb7185] rounded-xs"></span>
                <span>Cr(VI) Plume (Model-Est)</span>
              </button>

              {/* 4. Citizen Reports (AMBER ⚠️) */}
              <button
                onClick={() => setActiveLayers(prev => ({ ...prev, reports: !prev.reports }))}
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeLayers.reports ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold' : 'bg-stone-100 border-stone-200 text-stone-400'
                }`}
                title="Toggle Community Reports"
              >
                <span className="text-[10px]">⚠️</span>
                <span>Reports ({filteredReports.length})</span>
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
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[11px] text-white font-mono flex items-center gap-1">
                              <Maximize2 className="w-3.5 h-3.5" /> Enlarge
                            </span>
                          </div>
                          <span className={`absolute bottom-1.5 left-1.5 text-[9px] font-bold px-2 py-0.5 rounded text-white ${
                            selectedEntity.report.isSynthetic ? 'bg-amber-600/90' : 'bg-[#12372a]/90'
                          }`}>
                            {selectedEntity.report.isSynthetic ? 'Illustrative — Synthetic Image' : 'Photographic Evidence'}
                          </span>
                        </div>
                      )}

                      <div className="bg-white p-3 rounded-xl border border-stone-200 text-[11px] space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-stone-400">REPORT ID:</span>
                          <span className="font-bold text-[#002116]">{selectedEntity.report.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">LOCATION:</span>
                          <span className="font-semibold text-stone-700">{selectedEntity.report.locationName || 'Field Incident'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">DATE:</span>
                          <span>{selectedEntity.report.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">REPORTER:</span>
                          <span>{selectedEntity.report.reporterType || 'Resident'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">VERIFICATION:</span>
                          <span className="text-emerald-700 font-bold">{selectedEntity.report.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setFullModalReport(selectedEntity.report)}
                          className="flex-1 py-2 bg-[#12372a] hover:bg-[#002116] text-white font-bold rounded-lg text-center cursor-pointer transition-colors"
                        >
                          View Full Dossier
                        </button>
                        <button
                          onClick={() => setReportToDelete(selectedEntity.report)}
                          className="p-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg cursor-pointer transition-colors"
                          title="Delete this observation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedEntity.type === 'safeSource' && (
                    <div className="space-y-3 text-xs font-mono">
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-950 text-[11px]">
                        <span className="font-bold block mb-1">VERIFIED SAFE POTABLE DRINKING WATER</span>
                        <p className="font-sans text-xs text-emerald-900">
                          Total Hexavalent Chromium tests consistently below WHO permissible limit (0.05 mg/L). Certified suitable for drinking and infant food preparation.
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-stone-200 text-[11px] space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-stone-400">SOURCE ID:</span>
                          <strong className="text-emerald-800">{selectedEntity.source.id}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">SOURCE TYPE:</span>
                          <span>{selectedEntity.source.type.toUpperCase().replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">POPULATION SERVED:</span>
                          <span>{selectedEntity.source.populationServed} Residents</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">STATUS:</span>
                          <span className="text-emerald-700 font-bold">POTABLE (SAFE)</span>
                        </div>
                      </div>

                      <Link
                        href={`/water-safety?sourceId=${selectedEntity.source.id}`}
                        className="block w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-center cursor-pointer transition-colors"
                      >
                        Inspect Water Safety Certificate →
                      </Link>
                    </div>
                  )}

                  {selectedEntity.type === 'contaminatedSource' && (
                    <div className="space-y-3 text-xs font-mono">
                      <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-red-950 text-[11px]">
                        <span className="font-bold block mb-1">HEALTH HAZARD: DO NOT CONSUME</span>
                        <p className="font-sans text-xs text-red-900">
                          Source draws from shallow unconfined aquifer impacted by tannery leachate plume. Heavy metals exceed permissible safety standards.
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-stone-200 text-[11px] space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-stone-400">SOURCE ID:</span>
                          <strong className="text-red-700">{selectedEntity.source.id}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">TYPE:</span>
                          <span>{selectedEntity.source.type.toUpperCase().replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">STATUS:</span>
                          <strong className="text-red-700">{selectedEntity.source.status.toUpperCase()}</strong>
                        </div>
                        {selectedEntity.source.alternativeSourceId && (
                          <div className="flex justify-between text-emerald-700 font-bold">
                            <span>SAFE ALTERNATIVE:</span>
                            <span>{selectedEntity.source.alternativeSourceId}</span>
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/water-safety?sourceId=${selectedEntity.source.id}`}
                        className="block w-full py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-center cursor-pointer transition-colors"
                      >
                        View Contamination Profile →
                      </Link>
                    </div>
                  )}

                  {selectedEntity.type === 'plume' && (
                    <div className="space-y-3 text-xs font-mono">
                      <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-950 text-[11px]">
                        <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-900">
                          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                          <span>MODEL-ESTIMATED DISPERSION ENVELOPE</span>
                        </div>
                        <p className="font-sans text-xs text-rose-800">
                          Calibrated 2D subsurface solute transport advection model simulating hexavalent chromium migration along the regional hydraulic gradient.
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-stone-200 text-[11px] space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-stone-400">PLUME ID:</span>
                          <strong className="text-[#002116]">{selectedEntity.zoneId}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">ASSOCIATED CLUSTER:</span>
                          <span>{selectedEntity.associatedVillage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">ESTIMATED AREA:</span>
                          <strong className="text-rose-700">{selectedEntity.plumeAreaKm2} km²</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">MAX OBSERVED Cr(VI):</span>
                          <strong className="text-red-700">{selectedEntity.maxObservedCr}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">FLOW VECTOR:</span>
                          <span>{selectedEntity.flowDirection}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">HYDRAULIC COND:</span>
                          <span>{selectedEntity.hydraulicConductivity}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-stone-600">
                        <span className="font-bold block mb-1 text-stone-800">NEARBY THREATENED SOURCES:</span>
                        <span>{selectedEntity.nearbyWaterSources}</span>
                      </div>
                    </div>
                  )}

                  {selectedEntity.type === 'village' && (
                    <div className="space-y-3 text-xs font-mono">
                      <div className="bg-[#ddf3e7] p-3 rounded-xl border border-emerald-300 text-[11px]">
                        <span className="font-bold text-[#002116] block mb-1">{selectedEntity.village.name} ({selectedEntity.village.hindiName})</span>
                        <p className="font-sans text-xs text-stone-700">
                          District: {selectedEntity.village.district} · Population: {selectedEntity.village.population.toLocaleString()} residents
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-stone-200 text-[11px] grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-stone-400 block text-[10px]">RISK TIER</span>
                          <strong className="text-red-700 uppercase">{selectedEntity.village.riskLevel}</strong>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px]">WATER DEPTH</span>
                          <strong>{selectedEntity.village.groundwaterDepth}m</strong>
                        </div>
                      </div>

                      <Link
                        href={`/villages/${selectedEntity.village.id}`}
                        className="block w-full py-2 bg-[#12372a] hover:bg-[#002116] text-white font-bold rounded-lg text-center cursor-pointer transition-colors"
                      >
                        Open Village Hydrogeological Profile →
                      </Link>
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
                  <span className="text-xs font-mono font-bold text-stone-600 mb-1">
                    Spatial Telemetry Inspector
                  </span>
                  <p className="text-[11px] font-sans text-stone-400 max-w-xs leading-relaxed">
                    Click any safe drinking source, contaminated borewell, pink plume polygon, or citizen observation on the map to load real-time telemetry.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ground Observations Cards View (Visible in 'split' or 'cards' mode) */}
        {(viewMode === 'split' || viewMode === 'cards') && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-[#2E8B68]" />
                <h2 className="font-serif font-bold text-lg text-[#002116]">
                  Citizen Ground Telemetry Feed
                </h2>
                <span className="text-xs font-mono text-stone-500 bg-white px-2.5 py-0.5 rounded-full border border-stone-200">
                  {filteredReports.length} Reports
                </span>
              </div>
            </div>

            {filteredReports.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="font-serif font-bold text-[#002116]">No matching field observations</h3>
                <p className="text-xs font-mono text-stone-500 max-w-md mx-auto">
                  No citizen reports match the currently applied filters or temporal horizon ({temporalYear}).
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
                  className="px-4 py-2 bg-[#12372a] text-white text-xs font-mono font-bold rounded-xl cursor-pointer hover:bg-[#002116]"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredReports.map(report => {
                  const village = villages.find(v => v.id === report.villageId);
                  const isSelected = activeMarkerId === report.id || (selectedEntity?.type === 'report' && selectedEntity.report.id === report.id);

                  return (
                    <div
                      key={report.id}
                      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between group ${
                        isSelected 
                          ? 'border-amber-500 ring-2 ring-amber-400/40 shadow-lg' 
                          : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
                      }`}
                    >
                      {/* Card Image Banner */}
                      <div className="relative h-44 w-full bg-stone-900 overflow-hidden">
                        {report.photoUrl ? (
                          <img
                            src={report.photoUrl}
                            alt={report.title || report.category}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-800 text-stone-400">
                            <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
                            <span className="text-[10px] font-mono">No Image Attached</span>
                          </div>
                        )}

                        {/* Image Classification Tag */}
                        <span className={`absolute top-2.5 left-2.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-sm text-white ${
                          report.isSynthetic ? 'bg-amber-600/90' : 'bg-[#12372a]/90'
                        }`}>
                          {report.isSynthetic ? 'Illustrative — Synthetic Image' : 'Photographic Evidence'}
                        </span>

                        {/* Priority Badge */}
                        <div className="absolute top-2.5 right-2.5">
                          {getPriorityBadge(report.priority)}
                        </div>

                        {/* Location Tag on bottom of image */}
                        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white/95 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                          <span className="truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            {report.locationName || village?.name || 'Kanpur Region'}
                          </span>
                          <span className="text-stone-300 text-[10px]">{report.date}</span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-1">
                            <span>{report.id}</span>
                            <span>{village?.name || 'Village'}</span>
                          </div>

                          <h3 className="font-serif font-bold text-base text-[#002116] leading-snug group-hover:text-[#2E8B68] transition-colors line-clamp-2">
                            {report.title || report.category}
                          </h3>

                          <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed font-sans">
                            {report.description}
                          </p>
                        </div>

                        {/* Metadata Footer */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-stone-500">
                          <span>Reporter: {report.reporterType || 'Resident'}</span>
                          {getStatusBadge(report.status)}
                        </div>
                      </div>

                      {/* Visible Card Actions Row including Direct DELETE Button */}
                      <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setFullModalReport(report)}
                            className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-xs font-mono font-bold text-stone-800 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>Details</span>
                            <ArrowRight className="w-3 h-3 text-stone-400" />
                          </button>

                          <button
                            onClick={() => handleLocateOnMap(report)}
                            className="px-3 py-1.5 bg-[#12372a] hover:bg-[#002116] text-white rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Highlight on Community GIS Map"
                          >
                            <MapPin className="w-3 h-3 text-emerald-300" />
                            <span>View on Map</span>
                          </button>
                        </div>

                        {/* Prominently visible Direct Delete Action */}
                        <button
                          onClick={() => setReportToDelete(report)}
                          className="px-2.5 py-1.5 border border-red-200 hover:border-red-400 bg-white hover:bg-red-50 text-red-600 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                          title="Delete this observation record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Community Registry Table View (Visible in 'split' or 'registry' mode) */}
        {(viewMode === 'split' || viewMode === 'registry') && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-8">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-50">
              <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-[#2E8B68]" />
                <h2 className="font-serif font-bold text-base sm:text-lg text-[#002116]">
                  Synchronized Community Registry Records
                </h2>
                <span className="text-xs font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                  {filteredReports.length} Synchronized Records
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Observation ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Category &amp; Title</th>
                    <th className="py-3 px-4">Village / Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Evidence</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-700">
                  {filteredReports.map(report => {
                    const village = villages.find(v => v.id === report.villageId);
                    const isSelected = activeMarkerId === report.id || (selectedEntity?.type === 'report' && selectedEntity.report.id === report.id);

                    return (
                      <tr 
                        key={report.id} 
                        className={`hover:bg-amber-50/40 transition-colors ${isSelected ? 'bg-amber-100/50 font-bold' : ''}`}
                      >
                        <td className="py-3 px-4 font-bold text-[#002116]">
                          {report.id}
                        </td>
                        <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                          {report.date}
                        </td>
                        <td className="py-3 px-4">
                          {getPriorityBadge(report.priority)}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-bold text-[#002116] truncate">{report.title || report.category}</div>
                          <div className="text-[11px] text-stone-500 truncate font-sans">{report.description}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div>{village?.name || 'Kanpur Region'}</div>
                          <div className="text-[10px] text-stone-400 truncate">{report.locationName || 'Field Point'}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getStatusBadge(report.status)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {report.photoUrl ? (
                            <button
                              onClick={() => setEnlargedImage(report.photoUrl || null)}
                              className="text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>{report.isSynthetic ? 'Synthetic' : 'Photo'}</span>
                            </button>
                          ) : (
                            <span className="text-stone-400">None</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleLocateOnMap(report)}
                              className="p-1.5 hover:bg-stone-200 rounded text-stone-700 cursor-pointer"
                              title="View on Map"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setFullModalReport(report)}
                              className="p-1.5 hover:bg-stone-200 rounded text-stone-700 cursor-pointer"
                              title="Full Dossier"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setReportToDelete(report)}
                              className="p-1.5 hover:bg-red-100 rounded text-red-600 cursor-pointer"
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
      </main>

      {/* Accessible Confirmation Modal for Deleting Community Record */}
      {reportToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600 border-b border-stone-100 pb-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Delete Community Observation?
                </h3>
                <span className="text-xs font-mono text-stone-500">Irreversible field record removal</span>
              </div>
            </div>

            <div className="text-xs font-mono space-y-2 bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-stone-700">
              <div className="flex justify-between">
                <span className="text-stone-400">RECORD ID:</span>
                <strong className="text-stone-900">{reportToDelete.id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">TITLE:</span>
                <span className="font-semibold text-stone-800 truncate max-w-[220px]">{reportToDelete.title || reportToDelete.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">LOCATION:</span>
                <span>{reportToDelete.locationName || 'Field site'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">DATE:</span>
                <span>{reportToDelete.date}</span>
              </div>
            </div>

            <p className="text-xs font-sans text-stone-600 leading-relaxed">
              This action will purge this observation from the Community Map, Registry table, and summary statistical counters across all temporal horizons.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setReportToDelete(null)}
                className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteReport}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-mono font-bold shadow-sm hover:shadow cursor-pointer transition-colors"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Observation Dossier Modal */}
      {fullModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-start justify-between border-b border-stone-200 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-stone-400">{fullModalReport.id}</span>
                  {getPriorityBadge(fullModalReport.priority)}
                  {getStatusBadge(fullModalReport.status)}
                </div>
                <h3 className="font-serif font-bold text-xl text-[#002116]">
                  {fullModalReport.title || fullModalReport.category}
                </h3>
              </div>
              <button
                onClick={() => setFullModalReport(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {fullModalReport.photoUrl && (
              <div className="relative h-64 rounded-xl overflow-hidden border border-stone-200 bg-stone-950">
                <img
                  src={fullModalReport.photoUrl}
                  alt={fullModalReport.title || 'Evidence'}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute bottom-2 left-2 text-[10px] font-mono font-bold px-2.5 py-1 rounded text-white ${
                  fullModalReport.isSynthetic ? 'bg-amber-600/90' : 'bg-[#12372a]/90'
                }`}>
                  {fullModalReport.isSynthetic ? 'Illustrative — Synthetic Image' : 'Photographic Evidence'}
                </span>
              </div>
            )}

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <span className="text-stone-400 block text-[10px] font-bold">DESCRIPTION &amp; WITNESS TESTIMONY</span>
                <p className="font-sans text-stone-800 leading-relaxed text-sm">
                  {fullModalReport.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-stone-400 text-[10px] block">LOCATION</span>
                  <span className="font-bold text-stone-800">{fullModalReport.locationName || 'Field Point'}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-stone-400 text-[10px] block">DATE LOGGED</span>
                  <span className="font-bold text-stone-800">{fullModalReport.date}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-stone-400 text-[10px] block">REPORTER TYPE</span>
                  <span className="font-bold text-stone-800">{fullModalReport.reporterType || 'Resident'}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-stone-400 text-[10px] block">VERIFICATION NOTES</span>
                  <span className="font-bold text-emerald-800">{fullModalReport.verificationStatus || fullModalReport.status}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <button
                onClick={() => {
                  setReportToDelete(fullModalReport);
                  setFullModalReport(null);
                }}
                className="px-3.5 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Observation</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleLocateOnMap(fullModalReport);
                    setFullModalReport(null);
                  }}
                  className="px-4 py-2 bg-[#12372a] hover:bg-[#002116] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Locate on Map</span>
                </button>
                <button
                  onClick={() => setFullModalReport(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-mono font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Image Lightbox Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm cursor-pointer animate-in fade-in"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
            <img 
              src={enlargedImage} 
              alt="Enlarged evidence" 
              className="w-full h-full object-contain max-h-[85vh]"
            />
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function CommunityReportsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfa]">
        <div className="flex flex-col items-center gap-2">
          <Activity className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="font-mono text-xs text-stone-500">Loading Community GIS &amp; Observations...</span>
        </div>
      </div>
    }>
      <CommunityReportsContent />
    </Suspense>
  );
}
