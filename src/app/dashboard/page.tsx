'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { db } from '@/lib/db/store';
import {
  MapPin,
  Layers,
  Activity,
  AlertTriangle,
  Droplets,
  Shield,
  School,
  Calendar,
  Sparkles,
  Download,
  Upload,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Clock,
  Compass,
  CheckCircle2,
  Navigation,
} from 'lucide-react';

interface FeatureDetail {
  id: string;
  name: string;
  type: 'handpump' | 'school' | 'source' | 'safe_borewell';
  village: string;
  crLevel: number;
  totalCr: number;
  arsenicLevel: number;
  fluorideLevel: number;
  whoMultiplier: number;
  status: 'critical' | 'warning' | 'safe' | 'receptor';
  depth: string;
  strata: string;
  affectedPop: number;
  lastTested: string;
  lab: string;
  recommendation: string;
  coordinates: [number, number]; // [lon, lat]
}

const FEATURE_DATA: Record<string, FeatureDetail> = {
  'HP-047': {
    id: 'HP-047',
    name: 'India Mark II Handpump #HP-047',
    type: 'handpump',
    village: 'Rania Ward 4',
    crLevel: 0.72,
    totalCr: 0.84,
    arsenicLevel: 0.008,
    fluorideLevel: 1.1,
    whoMultiplier: 14.4,
    status: 'critical',
    depth: '28m (Shallow Alluvium)',
    strata: 'Fine alluvial sand directly in contact with industrial recharge plume',
    affectedPop: 620,
    lastTested: '16 Oct 2024 (Verified)',
    lab: 'UPPCB Regional NABL Lab Kanpur',
    recommendation: 'Immediate mechanical lock & physical handle removal. Reroute water users to Solar Deep Borewell DW-02 (380m north).',
    coordinates: [80.0102, 26.4481],
  },
  'HP-019': {
    id: 'HP-019',
    name: 'Borewell Handpump #HP-019',
    type: 'handpump',
    village: 'Khanchandpur South',
    crLevel: 0.84,
    totalCr: 0.98,
    arsenicLevel: 0.012,
    fluorideLevel: 1.3,
    whoMultiplier: 16.8,
    status: 'critical',
    depth: '32m (Vadose Zone Breach)',
    strata: 'Porous sand stratum with direct hydraulic gradient connection to Rania Nullah',
    affectedPop: 850,
    lastTested: '02 Nov 2024 (Verified)',
    lab: 'IIT Kanpur Environmental Engineering Lab',
    recommendation: 'Padlocked by District Magistrate. Deploy temporary mobile RO filtration vehicle.',
    coordinates: [80.0065, 26.4522],
  },
  'SCH-01': {
    id: 'SCH-01',
    name: 'Rania Primary Government School',
    type: 'school',
    village: 'Rania Ward 2',
    crLevel: 0.28,
    totalCr: 0.35,
    arsenicLevel: 0.004,
    fluorideLevel: 0.9,
    whoMultiplier: 5.6,
    status: 'warning',
    depth: 'Nearby tube-well: 22m',
    strata: 'Silt-clay interface with lateral percolation risk',
    affectedPop: 420,
    lastTested: '14 Jan 2025 (Monitored)',
    lab: 'Jal Jeevan Mission District Surveillance Team',
    recommendation: 'Midday meal kitchen supply converted to pipeline tanker supply. Continuous quarterly biomonitoring.',
    coordinates: [80.0145, 26.453],
  },
  'DW-02': {
    id: 'DW-02',
    name: 'Jal Jeevan Mission Deep Solar Borewell #DW-02',
    type: 'safe_borewell',
    village: 'Rania Sub-Centre',
    crLevel: 0.002,
    totalCr: 0.005,
    arsenicLevel: 0.002,
    fluorideLevel: 0.7,
    whoMultiplier: 0.04,
    status: 'safe',
    depth: '145m (Deep Confined Aquifer)',
    strata: 'Protected by 14m impermeant clay aquitard barrier below vadose alluvium',
    affectedPop: 3400,
    lastTested: 'Yesterday (Active Telemetry)',
    lab: 'Continuous Real-time Spectrometric Node',
    recommendation: 'Primary village safe lifeline. Capacity: 15,000 L/day powered by 5 kW solar array.',
    coordinates: [80.014, 26.4498],
  },
  'SRC-01': {
    id: 'SRC-01',
    name: 'Rania Legacy Basic Chrome Sludge Dump (Point-Zero)',
    type: 'source',
    village: 'Rania Industrial Area',
    crLevel: 4.85,
    totalCr: 6.2,
    arsenicLevel: 0.045,
    fluorideLevel: 2.1,
    whoMultiplier: 97.0,
    status: 'critical',
    depth: 'Surface to 8m unsaturated zone',
    strata: 'Untreated basic chromium sulfate industrial tannery residue pile',
    affectedPop: 18400,
    lastTested: '20 Dec 2024 (NGT Monitored)',
    lab: 'Central Pollution Control Board (CPCB)',
    recommendation: 'High-density polyethylene (HDPE) cap installation & Vetiver phytoremediation barrier swale.',
    coordinates: [80.001, 26.455],
  },
};

export default function DashboardPage() {
  const { language } = useTranslation();
  const isHindi = language === 'hi';

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [selectedPointId, setSelectedPointId] = useState<string>('HP-047');
  const [timeHorizon, setTimeHorizon] = useState<'2018' | '2025' | '90d' | '180d'>('2025');
  const [analyte, setAnalyte] = useState<'CrVI' | 'TotalCr' | 'Arsenic' | 'Fluoride'>('CrVI');
  const [selectedTerritory, setSelectedTerritory] = useState('Rania');
  const [activeLayers, setActiveLayers] = useState({
    plume: true,
    sources: true,
    receptors: true,
    safeBorewells: true,
  });

  const activeDetail = FEATURE_DATA[selectedPointId] || FEATURE_DATA['HP-047'];

  // Simulation parameters recalculated dynamically
  const simulationMetrics = {
    '2018': {
      label: 'Historical Benchmark (2018)',
      velocity: '1.1 m/mo @ 235° SW',
      advectionShiftMeters: -300,
      plumeRadiusKm: 0.8,
      directlyExposedPop: 6200,
      fitConfidence: '96.4%',
      riskStatus: 'Incipient Migration',
    },
    '2025': {
      label: 'Present Monitored State (2025)',
      velocity: '1.8 m/mo @ 235° SW',
      advectionShiftMeters: 0,
      plumeRadiusKm: 1.4,
      directlyExposedPop: 18400,
      fitConfidence: '94.2%',
      riskStatus: 'Active Aquifer Breach',
    },
    '90d': {
      label: 'Post-Monsoon +90 Days Simulation',
      velocity: '2.4 m/mo @ 230° SW (Surge)',
      advectionShiftMeters: 170,
      plumeRadiusKm: 1.7,
      directlyExposedPop: 21100,
      fitConfidence: '89.6%',
      riskStatus: 'Approaching Chirakhurd Border',
    },
    '180d': {
      label: 'Dry Season +180 Days Dispersion Projection',
      velocity: '1.9 m/mo @ 235° SW',
      advectionShiftMeters: 340,
      plumeRadiusKm: 2.1,
      directlyExposedPop: 24800,
      fitConfidence: '86.1%',
      riskStatus: 'Critical Downstream Interception',
    },
  }[timeHorizon];

  // Initialize MapLibre GL JS
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let isCancelled = false;

    import('maplibre-gl').then((maplibregl) => {
      if (isCancelled || !mapContainerRef.current) return;

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              ],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap Contributors',
            },
          },
          layers: [
            {
              id: 'osm-tiles',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [80.0102, 26.4481],
        zoom: 13.5,
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      mapInstanceRef.current = map;

      map.on('load', () => {
        renderMapMarkers(map, maplibregl);
      });
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map markers when analyte, timeHorizon, or layers change
  const renderMapMarkers = (map: any, maplibregl: any) => {
    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    Object.values(FEATURE_DATA).forEach((item) => {
      if (item.type === 'school' && !activeLayers.receptors) return;
      if (item.type === 'safe_borewell' && !activeLayers.safeBorewells) return;
      if (item.type === 'handpump' && !activeLayers.sources) return;

      let el = document.createElement('div');
      el.className = 'cursor-pointer transform hover:scale-125 transition-transform';

      // Dynamic styling based on analyte values
      let isHazard = false;
      if (analyte === 'CrVI') isHazard = item.crLevel > 0.05;
      else if (analyte === 'TotalCr') isHazard = item.totalCr > 0.05;
      else if (analyte === 'Arsenic') isHazard = item.arsenicLevel > 0.01;
      else if (analyte === 'Fluoride') isHazard = item.fluorideLevel > 1.5;

      if (item.type === 'school') {
        el.innerHTML = `
          <div class="w-8 h-8 rounded-lg bg-[#422c18] text-[#ffdcc2] flex items-center justify-center shadow-lg border-2 border-amber-800 text-sm font-bold">
            🏫
          </div>
        `;
      } else if (item.type === 'safe_borewell') {
        el.innerHTML = `
          <div class="w-8 h-8 rounded-full bg-[#2E8B68] text-white flex items-center justify-center shadow-lg border-2 border-white text-sm font-bold animate-bounce">
            💧
          </div>
        `;
      } else if (item.type === 'source') {
        el.innerHTML = `
          <div class="w-8 h-8 rounded-full bg-black text-amber-400 flex items-center justify-center shadow-lg border-2 border-red-500 text-sm font-bold">
            🏭
          </div>
        `;
      } else {
        el.innerHTML = `
          <div class="relative">
            ${isHazard ? '<span class="absolute -inset-1 rounded-full bg-red-600/40 animate-ping"></span>' : ''}
            <div class="relative w-8 h-8 rounded-full ${isHazard ? 'bg-red-600' : 'bg-emerald-600'} text-white flex items-center justify-center shadow-lg border-2 border-white text-xs font-bold font-mono">
              ${isHazard ? '!' : '✓'}
            </div>
          </div>
        `;
      }

      el.addEventListener('click', () => {
        setSelectedPointId(item.id);
        map.flyTo({ center: item.coordinates, zoom: 14.5, essential: true });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(item.coordinates)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  // Trigger marker update when map and dependencies are ready
  useEffect(() => {
    if (mapInstanceRef.current && (window as any).maplibregl) {
      renderMapMarkers(mapInstanceRef.current, (window as any).maplibregl);
    }
  }, [analyte, timeHorizon, activeLayers]);

  // Handle territory change
  const handleTerritoryChange = (territory: string) => {
    setSelectedTerritory(territory);
    if (!mapInstanceRef.current) return;

    if (territory === 'Khanchandpur') {
      mapInstanceRef.current.flyTo({ center: [80.342, 26.465], zoom: 14 });
      setSelectedPointId('HP-019');
    } else if (territory === 'Panki') {
      mapInstanceRef.current.flyTo({ center: [80.25, 26.48], zoom: 13.5 });
    } else {
      mapInstanceRef.current.flyTo({ center: [80.0102, 26.4481], zoom: 13.5 });
      setSelectedPointId('HP-047');
    }
  };

  const getAnalyteDisplay = () => {
    if (analyte === 'CrVI') return { name: 'Cr(VI) Hexavalent', val: `${activeDetail.crLevel} mg/L`, limit: '0.05 mg/L', ratio: (activeDetail.crLevel / 0.05).toFixed(1) };
    if (analyte === 'TotalCr') return { name: 'Total Chromium', val: `${activeDetail.totalCr} mg/L`, limit: '0.05 mg/L', ratio: (activeDetail.totalCr / 0.05).toFixed(1) };
    if (analyte === 'Arsenic') return { name: 'Arsenic (As)', val: `${activeDetail.arsenicLevel} mg/L`, limit: '0.01 mg/L', ratio: (activeDetail.arsenicLevel / 0.01).toFixed(1) };
    return { name: 'Fluoride (F⁻)', val: `${activeDetail.fluorideLevel} mg/L`, limit: '1.5 mg/L', ratio: (activeDetail.fluorideLevel / 1.5).toFixed(1) };
  };

  const currentAnalyteInfo = getAnalyteDisplay();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8] text-[#0c1f18] font-sans">
      <Header />

      {/* 2. CONTEXTUAL DATASET PROVENANCE STRIP */}
      <div className="bg-[#12372a] text-[#c3ebd8] border-b border-white/10 px-4 lg:px-8 py-2 flex flex-wrap justify-between items-center text-xs z-30">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 bg-[#2E8B68]/30 text-[#c3ebd8] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider text-[10px] border border-[#2E8B68]/50">
            <CheckCircle2 className="w-3 h-3 text-emerald-300" />
            LIVE TELEMETRY
          </span>
          <span className="text-white/85">
            Active Layer: <strong className="text-white font-semibold">Rania–Khanchandpur Chromium Hydrodynamic Model</strong> (2,438 records · Realtime Sensor Feed)
          </span>
        </div>
        <div className="flex items-center gap-4 font-medium mt-1 sm:mt-0 text-white/90">
          <Link href="/data-sources" className="hover:text-white hover:underline flex items-center gap-1 transition-colors">
            <Upload className="w-3.5 h-3.5 text-emerald-300" />
            <span>Upload Dataset</span>
          </Link>
          <span className="text-white/30">•</span>
          <Link href="/evidence" className="hover:text-white hover:underline flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-[15px]">verified_user</span>
            <span>Lab Provenance</span>
          </Link>
        </div>
      </div>

      {/* 3. WORKSPACE SUB-HEADER (Filters, Horizon Slider, Geo-Hierarchy) */}
      <div className="bg-white border-b border-stone-200 px-4 lg:px-8 py-2.5 shadow-xs z-20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Geo Hierarchy Selector */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-mono text-stone-500 uppercase tracking-wider flex items-center gap-1 mr-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              Territory:
            </span>
            <div className="inline-flex items-center bg-[#f2f8f5] rounded-lg p-0.5 border border-stone-200 font-medium">
              <span className="py-1 px-2 text-stone-600">Uttar Pradesh</span>
              <span className="text-stone-300">/</span>
              <span className="py-1 px-2 text-stone-600">Kanpur Dehat</span>
              <span className="text-stone-300">/</span>
              <select
                value={selectedTerritory}
                onChange={(e) => handleTerritoryChange(e.target.value)}
                className="bg-white font-bold text-[#002116] py-1 px-2 rounded outline-none border border-stone-200 shadow-xs cursor-pointer"
              >
                <option value="Rania">Rania Sector (UP-09A)</option>
                <option value="Khanchandpur">Khanchandpur Sector</option>
                <option value="Panki">Panki Industrial Belt</option>
              </select>
            </div>
            <span className="text-xs text-stone-500 ml-1">24.3 km² basin</span>
          </div>

          {/* Time Horizon Slider */}
          <div className="flex items-center gap-2.5 bg-[#f2f8f5] px-2.5 py-1 rounded-lg border border-stone-200 text-xs">
            <span className="font-mono text-stone-500 flex items-center gap-1 uppercase text-[10px] font-bold">
              <Clock className="w-3 h-3 text-[#006492]" />
              Horizon:
            </span>
            <div className="flex items-center gap-1 bg-white rounded p-0.5 border border-stone-200 font-mono text-[11px]">
              {(['2018', '2025', '90d', '180d'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setTimeHorizon(h)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    timeHorizon === h
                      ? 'bg-[#002116] text-white font-bold shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {h === '2018' ? '2018' : h === '2025' ? 'Present' : `+${h}`}
                </button>
              ))}
            </div>
          </div>

          {/* Analyte Selector Matrix */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-stone-500 uppercase text-[10px] font-bold">Analyte:</span>
            <div className="inline-flex rounded-lg border border-stone-200 bg-[#f2f8f5] p-0.5 font-mono text-[11px]">
              {(['CrVI', 'TotalCr', 'Arsenic', 'Fluoride'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAnalyte(a)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    analyte === a
                      ? 'bg-red-600 text-white font-bold shadow-xs'
                      : 'text-stone-700 hover:bg-white'
                  }`}
                >
                  {a === 'CrVI' ? 'Cr(VI)' : a === 'TotalCr' ? 'Total Cr' : a === 'Arsenic' ? 'Arsenic' : 'Fluoride'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 & 5. MAIN CARTOGRAPHIC WORKSPACE & RIGHT DETAIL INSPECTION PANEL */}
      <main className="flex-1 flex flex-col xl:flex-row relative overflow-hidden min-h-[640px]">
        {/* MAP CANVAS */}
        <section className="flex-1 relative flex flex-col overflow-hidden select-none min-h-[480px]">
          {/* Top Dynamic Simulation Ribbon */}
          <div className="stripes-sim border-b border-stone-200 px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between text-xs text-[#002116] z-20 bg-white/95">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#5B72C7] text-[18px]">model_training</span>
              <span>
                <strong>{simulationMetrics.label}:</strong> {simulationMetrics.riskStatus}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-stone-200">
                Velocity: {simulationMetrics.velocity}
              </span>
              <span className="font-mono text-[11px] text-[#5B72C7] font-bold">
                {simulationMetrics.fitConfidence} Epistemic Fit
              </span>
            </div>
          </div>

          {/* REAL MAPLIBRE CONTAINER */}
          <div ref={mapContainerRef} className="w-full flex-1 relative bg-stone-100 z-10" />

          {/* Bottom Map Controls Bar */}
          <div className="bg-white/95 backdrop-blur border-t border-stone-200 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-stone-600 z-20">
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayers.sources}
                  onChange={(e) => setActiveLayers({ ...activeLayers, sources: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <span>Water Sources ({activeDetail.crLevel > 0.05 ? '🔴 Hazardous' : '🟢 Safe'})</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayers.receptors}
                  onChange={(e) => setActiveLayers({ ...activeLayers, receptors: e.target.checked })}
                  className="rounded text-amber-700"
                />
                <span>🏫 Sensitive Schools</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayers.safeBorewells}
                  onChange={(e) => setActiveLayers({ ...activeLayers, safeBorewells: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>💧 Potable Solar Taps</span>
              </label>
            </div>
            <Link
              href="/map"
              className="text-xs font-mono font-bold text-[#006492] hover:underline flex items-center gap-1"
            >
              <span>Full GIS Map Studio →</span>
            </Link>
          </div>
        </section>

        {/* RIGHT DETAIL INSPECTION PANEL */}
        <aside className="w-full xl:w-[420px] bg-white border-t xl:border-t-0 xl:border-l border-stone-200 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                  ACTIVE BOREHOLE TELEMETRY
                </span>
                <h3 className="text-xl font-serif text-[#002116] font-bold mt-0.5">
                  {activeDetail.name}
                </h3>
                <span className="text-xs text-stone-500">{activeDetail.village}</span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase ${
                  activeDetail.status === 'critical'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : activeDetail.status === 'safe'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {activeDetail.status}
              </span>
            </div>

            {/* Dynamic Analyte Measurement Card */}
            <div className="bg-[#f2f8f5] p-4 rounded-xl border border-stone-200 space-y-2.5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-mono text-stone-600 uppercase font-semibold">
                  {currentAnalyteInfo.name}
                </span>
                <span
                  className={`text-2xl font-mono font-bold ${
                    parseFloat(currentAnalyteInfo.ratio) > 1 ? 'text-red-700' : 'text-emerald-700'
                  }`}
                >
                  {currentAnalyteInfo.val}
                </span>
              </div>
              <div className="flex justify-between text-xs text-stone-600 font-mono">
                <span>Permissible: {currentAnalyteInfo.limit}</span>
                <span
                  className={`font-semibold ${
                    parseFloat(currentAnalyteInfo.ratio) > 1 ? 'text-red-700' : 'text-emerald-700'
                  }`}
                >
                  {currentAnalyteInfo.ratio}× WHO standard
                </span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    parseFloat(currentAnalyteInfo.ratio) > 1 ? 'bg-red-600' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, parseFloat(currentAnalyteInfo.ratio) * 20)}%` }}
                ></div>
              </div>
            </div>

            {/* Geological Strata Log */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-stone-500 uppercase font-semibold block">
                Lithological Depth Strata
              </span>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-stone-500">Screen Depth:</span>
                  <span className="font-bold text-[#002116]">{activeDetail.depth}</span>
                </div>
                <div className="text-stone-600 text-[11px] leading-relaxed">
                  {activeDetail.strata}
                </div>
              </div>
            </div>

            {/* Receptor Demographics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] font-mono text-stone-500 block">EXPOSED POPULATION</span>
                <span className="text-lg font-mono font-bold text-[#002116] mt-0.5 block">
                  {activeDetail.affectedPop.toLocaleString()}
                </span>
                <span className="text-[11px] text-stone-500">within 250m radius</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] font-mono text-stone-500 block">LAB ACCREDITATION</span>
                <span className="text-xs font-bold text-[#2E8B68] mt-1 block">ISO/IEC 17025</span>
                <span className="text-[10px] text-stone-500 truncate block">{activeDetail.lab}</span>
              </div>
            </div>

            {/* District Protocol */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
              <span className="text-xs font-mono font-bold text-amber-900 uppercase flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                Intervention Directive:
              </span>
              <p className="text-xs text-amber-950 leading-relaxed">
                {activeDetail.recommendation}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-stone-200 space-y-2">
            <Link
              href={`/water-safety?source=${encodeURIComponent(activeDetail.id)}`}
              className="w-full py-2.5 bg-[#002116] hover:bg-[#12372a] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Droplets className="w-4 h-4 text-emerald-300" />
              <span>Verify Community Safe Alternate</span>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeDetail, null, 2));
                  const a = document.createElement('a');
                  a.href = dataStr;
                  a.download = `${activeDetail.id}_telemetry.json`;
                  a.click();
                }}
                className="py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-mono font-semibold transition-colors"
              >
                Export GeoJSON
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-mono font-semibold transition-colors"
              >
                Print Field Dossier
              </button>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
