'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { getDb, CommunityReportRecord } from '@/lib/db/store';
import type { WaterSource, Village } from '@/lib/types';
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
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

// Define view modes
type ViewMode = 'split' | 'cards' | 'registry' | 'map';

interface MapLayerVisibility {
  reports: boolean;
  safeSources: boolean;
  contaminatedSources: boolean;
  plumes: boolean;
  villages: boolean;
}

function ReportsDashboardContent() {
  const searchParams = useSearchParams();
  const deepReportId = searchParams.get('reportId');

  const { t } = useTranslation();

  // State Management
  const [reports, setReports] = useState<CommunityReportRecord[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [waterSources, setWaterSources] = useState<WaterSource[]>([]);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [villageFilter, setVillageFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // View & UI State
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [selectedReport, setSelectedReport] = useState<CommunityReportRecord | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [reportToDelete, setReportToDelete] = useState<CommunityReportRecord | null>(null);
  const [deleteReason, setDeleteReason] = useState('Resolved / Decommissioned site');
  const [customDeleteReason, setCustomDeleteReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Temporal Horizon Engine (2018–2026)
  const [temporalYear, setTemporalYear] = useState<number>(2026);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Spatial Map Reference & Controls
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const maplibreglRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  const [mapLayers, setMapLayers] = useState<MapLayerVisibility>({
    reports: true,
    safeSources: true,
    contaminatedSources: true,
    plumes: true,
    villages: true,
  });

  // Load fresh data from store
  const loadData = useCallback(() => {
    const db = getDb();
    setReports(db.getCommunityReports());
    setVillages(db.getVillages());
    setWaterSources(db.getWaterSources());
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

  // Handle deep link selection on mount
  useEffect(() => {
    if (deepReportId && reports.length > 0) {
      const target = reports.find(r => r.id === deepReportId);
      if (target) {
        setSelectedReport(target);
        setActiveMarkerId(target.id);
      }
    }
  }, [deepReportId, reports]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Temporal Playback Animation
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

  // Filtered reports calculation
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // 1. Temporal Horizon Filter
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

      // 6. Search Query Filter
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

  // Count metrics
  const activeCount = filteredReports.length;
  const criticalCount = filteredReports.filter(r => r.priority === 'Critical').length;
  const verifiedCount = filteredReports.filter(r => r.status.toLowerCase().includes('verified') || r.status.toLowerCase().includes('confirmed')).length;

  // Initialize MapLibre GIS Canvas
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

  // Synchronize Markers on the Map
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const maplibregl = maplibreglRef.current;
    const map = mapInstanceRef.current;

    // Helper to create an interactive marker
    const addMarker = (
      lng: number, 
      lat: number, 
      elementHtml: string, 
      tooltipTitle: string, 
      tooltipSubtitle: string, 
      onClick: () => void,
      isHighlighted = false
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

      if (isHighlighted) {
        el.style.transform = 'scale(1.35)';
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

    // 1. Citizen Observation Markers (Filtered by temporal year, search & category)
    if (mapLayers.reports) {
      filteredReports.forEach(report => {
        const lat = typeof (report.coordinates as any)?.lat === 'number' ? (report.coordinates as any).lat : 26.4481;
        const lon = typeof (report.coordinates as any)?.lon === 'number' ? (report.coordinates as any).lon : 80.0102;
        const isSelected = activeMarkerId === report.id || selectedReport?.id === report.id;

        const iconHtml = `
          <div class="w-6 h-6 rounded-full bg-amber-500 text-[#002116] border-2 ${isSelected ? 'border-red-500 ring-4 ring-red-400/60 scale-125' : 'border-white shadow-md'} flex items-center justify-center font-bold text-xs shadow-lg transition-transform hover:scale-130">
            ⚠
          </div>
        `;

        addMarker(
          lon,
          lat,
          iconHtml,
          `${report.id} · ${report.category}`,
          `${report.locationName || 'Field'} · ${report.priority} Priority`,
          () => {
            setSelectedReport(report);
            setActiveMarkerId(report.id);
          },
          isSelected
        );
      });
    }

    // 2. Safe Water Sources
    if (mapLayers.safeSources) {
      waterSources.filter(s => s.status === 'safe').forEach(s => {
        addMarker(
          s.coordinates.lon,
          s.coordinates.lat,
          `<div class="w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-sm hover:scale-140 transition-transform"></div>`,
          `Safe Source: ${s.name || s.id}`,
          'Verified Safe Potable Water (<0.05 mg/L)',
          () => {
            setToastMessage(`Safe Source ${s.name || s.id}: Verified Potable (<0.05 mg/L)`);
          }
        );
      });
    }

    // 3. Contaminated Water Sources
    if (mapLayers.contaminatedSources) {
      waterSources.filter(s => s.status === 'do_not_use' || s.status === 'restricted').forEach(s => {
        const isCritical = s.status === 'do_not_use';
        addMarker(
          s.coordinates.lon,
          s.coordinates.lat,
          `<div class="w-3.5 h-3.5 rounded-full ${isCritical ? 'bg-red-600' : 'bg-amber-600'} border-2 border-white shadow-sm hover:scale-140 transition-transform"></div>`,
          `Hazardous Source: ${s.name || s.id}`,
          isCritical ? 'CRITICAL: Do Not Drink (>0.05 mg/L Cr)' : 'Restricted Use',
          () => {
            setToastMessage(`Water Source ${s.name || s.id}: Contaminated (${s.status.toUpperCase()})`);
          }
        );
      });
    }

    // 4. Village Community Hubs
    if (mapLayers.villages) {
      villages.forEach(v => {
        addMarker(
          v.coordinates.lon,
          v.coordinates.lat,
          `<div class="w-6 h-6 rounded-full bg-[#12372A] text-white border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-md hover:scale-125 transition-transform">V</div>`,
          `${v.name} (${v.hindiName})`,
          `Community Cluster · ${v.population.toLocaleString()} Population`,
          () => {
            setToastMessage(`Village Hub: ${v.name} · ${v.population.toLocaleString()} Residents`);
          }
        );
      });
    }

  }, [mapLoaded, filteredReports, waterSources, villages, mapLayers, activeMarkerId, selectedReport]);

  // Locate report on map and open its details
  const handleLocateOnMap = (report: CommunityReportRecord) => {
    setSelectedReport(report);
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

    // If in cards or registry view, automatically switch to split or scroll to map
    if (viewMode === 'cards' || viewMode === 'registry') {
      setViewMode('split');
    }

    // Scroll map container into view if on mobile
    if (window.innerWidth < 1024 && mapContainer.current) {
      mapContainer.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset map spatial view
  const handleResetMapView = () => {
    setActiveMarkerId(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [80.32, 26.45],
        zoom: 11,
        essential: true,
      });
    }
  };

  // Locate user GPS
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

  // Deletion execution
  const handleConfirmDelete = () => {
    if (!reportToDelete) return;

    const db = getDb();
    const reason = deleteReason === 'Other' ? customDeleteReason || 'Administrative deletion' : deleteReason;
    const success = db.deleteCommunityReport(reportToDelete.id, reason);

    if (success) {
      setToastMessage(`Observation ${reportToDelete.id} successfully removed from registry.`);
      if (selectedReport?.id === reportToDelete.id) {
        setSelectedReport(null);
      }
      setReportToDelete(null);
      setCustomDeleteReason('');
      loadData();
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    const db = getDb();
    const csvContent = db.exportReportsCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhujal_community_reports_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToastMessage('Community Registry CSV exported successfully.');
  };

  // Helper for Status Badge styling
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

  // Helper for Priority Badge
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
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white ml-2">
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
                {reports.length} total observations · {activeCount} active in view
              </span>
              {criticalCount > 0 && (
                <span className="text-xs font-mono text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  {criticalCount} Critical
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#002116] tracking-tight">
              Community Ground Observations &amp; Registry
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Decentralized field intelligence tracking groundwater discoloration, chemical taste, industrial discharge, and infrastructure tampering across Kanpur Nagar and Kanpur Dehat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-mono text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              title="Download full registry as CSV"
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  viewMode === 'split' ? 'bg-white text-[#002116] shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  viewMode === 'cards' ? 'bg-white text-[#002116] shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Ground Cards</span>
              </button>
              <button
                onClick={() => setViewMode('registry')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  viewMode === 'registry' ? 'bg-white text-[#002116] shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Registry Table</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  viewMode === 'map' ? 'bg-white text-[#002116] shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Full Map</span>
              </button>
            </div>

            {/* Temporal Horizon Controller Controls */}
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
                  className="p-2 rounded-lg bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors"
                  title="Step Backward (1 Year)"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTemporalYear(prev => Math.min(2026, prev + 1))}
                  className="p-2 rounded-lg bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors"
                  title="Step Forward (1 Year)"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setTemporalYear(2026);
                    setIsPlaying(false);
                  }}
                  className="p-2 rounded-lg bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors"
                  title="Reset to 2026"
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
                    {temporalYear}
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
              Showing <strong className="text-stone-900">{filteredReports.length}</strong> of <strong className="text-stone-900">{reports.length}</strong> reports
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

        {/* Spatial Map Canvas (Visible in 'split' or 'map' mode) */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className="mb-8 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            {/* Map Header & Toolbar */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2E8B68]" />
                <span className="font-serif font-bold text-sm text-[#002116]">
                  Regional Field Observation GIS
                </span>
                <span className="text-[11px] font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                  OpenStreetMap Raster Layer · {filteredReports.length} Observation Pins
                </span>
              </div>

              {/* Map Layer Legend & Toggles */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <button
                  onClick={() => setMapLayers(prev => ({ ...prev, reports: !prev.reports }))}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
                    mapLayers.reports ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold' : 'bg-stone-100 border-stone-200 text-stone-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Citizen Reports ({filteredReports.length})</span>
                </button>

                <button
                  onClick={() => setMapLayers(prev => ({ ...prev, safeSources: !prev.safeSources }))}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
                    mapLayers.safeSources ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold' : 'bg-stone-100 border-stone-200 text-stone-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Safe Sources</span>
                </button>

                <button
                  onClick={() => setMapLayers(prev => ({ ...prev, contaminatedSources: !prev.contaminatedSources }))}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
                    mapLayers.contaminatedSources ? 'bg-red-100 border-red-300 text-red-900 font-bold' : 'bg-stone-100 border-stone-200 text-stone-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>Contaminated Wells</span>
                </button>

                <button
                  onClick={() => setMapLayers(prev => ({ ...prev, villages: !prev.villages }))}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
                    mapLayers.villages ? 'bg-stone-200 border-stone-400 text-stone-900 font-bold' : 'bg-stone-100 border-stone-200 text-stone-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#12372a]"></span>
                  <span>Village Hubs</span>
                </button>

                <button
                  onClick={handleLocateMe}
                  className="p-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-stone-700"
                  title="Locate Me (GPS)"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleResetMapView}
                  className="p-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-stone-700"
                  title="Reset Map Bounds"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div 
              ref={mapContainer} 
              className={`w-full ${viewMode === 'map' ? 'h-[75vh]' : 'h-96 sm:h-[420px]'} bg-stone-100 relative`}
            />

            {/* Micro banner if temporal year before 2020 */}
            {temporalYear < 2020 && (
              <div className="bg-amber-50 p-2.5 border-t border-amber-200 text-center text-xs font-mono text-amber-800">
                Pre-surveillance baseline ({temporalYear}): Official citizen observation records began in January 2020 with initial CGWB testing.
              </div>
            )}
          </div>
        )}

        {/* View Mode: Community Registry (High-Density Table View) */}
        {(viewMode === 'registry') && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden mb-8">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[#002116]">Community Registry Table</h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">Filterable tabular registry of field telemetry and citizen observations</p>
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
                            onClick={() => setSelectedReport(report)}
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
                              onClick={() => setSelectedReport(report)}
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
                Ground Observation Cards
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
                const isSelected = activeMarkerId === report.id || selectedReport?.id === report.id;

                return (
                  <div 
                    key={report.id} 
                    className={`bg-white rounded-2xl shadow-sm border ${
                      isSelected ? 'border-[#2E8B68] ring-2 ring-[#2E8B68]/30 shadow-md' : 'border-stone-200'
                    } overflow-hidden hover:shadow-md hover:border-[#2E8B68]/60 transition-all flex flex-col justify-between`}
                  >
                    <div>
                      {/* Photo Banner if available */}
                      {photoSrc ? (
                        <div className="relative h-44 w-full overflow-hidden bg-stone-900 group">
                          <img 
                            src={photoSrc} 
                            alt={report.title || report.category} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => setEnlargedImage(photoSrc)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                          <span className="absolute bottom-2.5 left-3 text-[10px] font-mono bg-black/80 text-emerald-300 px-2.5 py-0.5 rounded flex items-center gap-1.5 border border-emerald-500/30">
                            <ImageIcon className="w-3 h-3 text-emerald-400" /> Photographic Evidence
                          </span>
                          <button
                            onClick={() => setEnlargedImage(photoSrc)}
                            className="absolute top-2.5 right-3 p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-lg transition-colors cursor-pointer"
                            title="Expand Image"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-14 bg-gradient-to-r from-stone-100 to-stone-50 border-b border-stone-100 px-5 flex items-center justify-between text-xs font-mono text-stone-400">
                          <span className="flex items-center gap-1.5 text-stone-500">
                            <Clock className="w-3.5 h-3.5" /> Filed Telemetry
                          </span>
                          <span>No Image Attached</span>
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
                              <MapPin className="w-3.5 h-3.5 text-[#2E8B68] shrink-0" />
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

                    {/* Card Action Footer */}
                    <div className="bg-[#f2f8f5] px-4 py-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleLocateOnMap(report)}
                        className="text-xs font-mono font-bold text-[#2E8B68] hover:text-[#002116] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Focus on Spatial Map"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Locate</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="text-xs font-mono font-bold text-[#006492] hover:text-[#002116] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          View Details →
                        </button>

                        <button
                          onClick={() => setReportToDelete(report)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Community Observation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

        {/* Report Inspection Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl">
              <div className="p-6 border-b border-stone-200 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded">
                      {selectedReport.id}
                    </span>
                    {getPriorityBadge(selectedReport.priority)}
                    {getStatusBadge(selectedReport.status)}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#002116]">
                    {selectedReport.title || selectedReport.category}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 text-sm">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-stone-400 mb-1.5">Field Narrative</h4>
                  <p className="text-stone-800 bg-stone-50 p-4 rounded-xl leading-relaxed border border-stone-200 font-sans text-sm">
                    "{selectedReport.description}"
                  </p>
                </div>

                {/* Render Photographic Evidence */}
                {(selectedReport.photoUrl || selectedReport.photoDataUrl) && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-mono font-bold uppercase text-stone-400 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                        Photographic Evidence
                      </h4>
                      <button
                        onClick={() => setEnlargedImage(selectedReport.photoUrl || selectedReport.photoDataUrl || null)}
                        className="text-xs font-mono text-[#006492] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> Full Lightbox View
                      </button>
                    </div>
                    <div 
                      onClick={() => setEnlargedImage(selectedReport.photoUrl || selectedReport.photoDataUrl || null)}
                      className="rounded-xl overflow-hidden border border-stone-200 max-h-80 bg-black flex items-center justify-center cursor-zoom-in group relative"
                    >
                      <img 
                        src={selectedReport.photoUrl || selectedReport.photoDataUrl} 
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
                      href={`/villages/${selectedReport.villageId}`}
                      className="text-stone-900 text-sm font-bold hover:text-[#006492] flex items-center gap-1"
                    >
                      {villages.find(v => v.id === selectedReport.villageId)?.name || 'Rural Cluster'}
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </Link>
                    <span className="text-stone-500 text-[11px] block mt-0.5">
                      {selectedReport.locationName || 'Local Panchayat Ward'}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px]">COORDINATES</span>
                    <strong className="text-stone-900 text-sm">
                      {(typeof (selectedReport.coordinates as any)?.lat === 'number' ? (selectedReport.coordinates as any).lat : (selectedReport.coordinates as any)?.[1] ?? 26.4481).toFixed(4)}°N, {(typeof (selectedReport.coordinates as any)?.lon === 'number' ? (selectedReport.coordinates as any).lon : (selectedReport.coordinates as any)?.[0] ?? 80.0102).toFixed(4)}°E
                    </strong>
                    {selectedReport.waterSourceId && (
                      <Link
                        href={`/water-safety?source=${encodeURIComponent(selectedReport.waterSourceId)}`}
                        className="text-stone-600 text-[11px] block mt-0.5 hover:underline"
                      >
                        Linked Source: <strong className="text-[#006492]">{selectedReport.waterSourceId}</strong>
                      </Link>
                    )}
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px]">SUBMISSION DATE</span>
                    <strong className="text-stone-900">
                      {new Date(selectedReport.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </strong>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px]">VERIFICATION PROGRESS</span>
                    <strong className="text-emerald-800 font-bold">
                      {selectedReport.verificationStatus || 'En route to District Team'}
                    </strong>
                  </div>

                  {selectedReport.reporterType && (
                    <div>
                      <span className="text-stone-500 block text-[10px]">REPORTER PERSONA</span>
                      <strong className="text-stone-900">
                        {selectedReport.reporterName || 'Anonymized'} ({selectedReport.reporterType})
                      </strong>
                    </div>
                  )}

                  {selectedReport.reporterPhone && (
                    <div>
                      <span className="text-stone-500 block text-[10px]">CONTACT PHONE</span>
                      <strong className="text-stone-900">{selectedReport.reporterPhone}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setReportToDelete(selectedReport);
                  }}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Observation
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleLocateOnMap(selectedReport);
                      setSelectedReport(null);
                    }}
                    className="px-4 py-2 bg-white border border-stone-300 text-stone-800 rounded-xl text-xs font-mono font-bold hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#2E8B68]" />
                    Locate on Spatial Map
                  </button>

                  <button
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 bg-[#002116] text-white rounded-xl text-xs font-mono font-bold cursor-pointer hover:bg-[#12372a]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {reportToDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
              <div className="flex items-start gap-3 text-red-600">
                <div className="p-2 bg-red-100 rounded-xl shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Delete Community Observation?
                  </h3>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">
                    This action removes the record from public telemetry, the spatial GIS map, and regional health risk models.
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
                  <option value="Erroneous coordinates or false report">Erroneous coordinates or false report</option>
                  <option value="Lab testing proved non-chromium related">Lab testing proved non-chromium related</option>
                  <option value="Administrative / Test record cleanup">Administrative / Test record cleanup</option>
                  <option value="Other">Other / Custom reason</option>
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
                className="absolute top-2 right-2 p-2 bg-black/80 text-white rounded-full hover:bg-red-600 transition-colors"
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
