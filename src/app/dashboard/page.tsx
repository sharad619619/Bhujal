'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
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
} from 'lucide-react';

interface FeatureDetail {
  id: string;
  name: string;
  type: 'handpump' | 'school' | 'source' | 'safe_borewell';
  village: string;
  crLevel: number;
  whoMultiplier: number;
  status: 'critical' | 'warning' | 'safe' | 'receptor';
  depth: string;
  strata: string;
  affectedPop: number;
  lastTested: string;
  lab: string;
  recommendation: string;
}

const FEATURE_DATA: Record<string, FeatureDetail> = {
  'HP-047': {
    id: 'HP-047',
    name: 'India Mark II Handpump #HP-047',
    type: 'handpump',
    village: 'Rania Ward 4',
    crLevel: 0.72,
    whoMultiplier: 14.4,
    status: 'critical',
    depth: '28m (Shallow Unconfined Alluvium)',
    strata: 'Fine alluvial sand directly in contact with industrial recharge plume',
    affectedPop: 620,
    lastTested: '16 Oct 2024 (Verified)',
    lab: 'UPPCB Regional NABL Lab Kanpur',
    recommendation: 'Immediate mechanical lock & physical handle removal. Reroute water users to Solar Deep Borewell DW-02 (380m north).',
  },
  'HP-019': {
    id: 'HP-019',
    name: 'Borewell Handpump #HP-019',
    type: 'handpump',
    village: 'Khanchandpur South',
    crLevel: 0.84,
    whoMultiplier: 16.8,
    status: 'critical',
    depth: '32m (Vadose Zone Breach)',
    strata: 'Porous sand stratum with direct hydraulic gradient connection to Rania Nullah',
    affectedPop: 850,
    lastTested: '02 Nov 2024 (Verified)',
    lab: 'IIT Kanpur Environmental Engineering Lab',
    recommendation: 'Padlocked by District Magistrate. Deploy temporary mobile RO filtration vehicle.',
  },
  'SCH-01': {
    id: 'SCH-01',
    name: 'Rania Primary Government School',
    type: 'school',
    village: 'Rania Ward 2',
    crLevel: 0.28,
    whoMultiplier: 5.6,
    status: 'warning',
    depth: 'Nearby tube-well: 22m',
    strata: 'Silt-clay interface with lateral percolation risk',
    affectedPop: 420, // 420 students
    lastTested: '14 Jan 2025 (Monitored)',
    lab: 'Jal Jeevan Mission District Surveillance Team',
    recommendation: 'Midday meal kitchen supply converted to pipeline tanker supply. Continuous quarterly biomonitoring.',
  },
  'DW-02': {
    id: 'DW-02',
    name: 'Jal Jeevan Mission Deep Solar Borewell #DW-02',
    type: 'safe_borewell',
    village: 'Rania Sub-Centre',
    crLevel: 0.002,
    whoMultiplier: 0.04,
    status: 'safe',
    depth: '145m (Deep Confined Aquifer)',
    strata: 'Protected by 14m impermeant clay aquitard barrier below vadose alluvium',
    affectedPop: 3400,
    lastTested: 'Yesterday (Active Telemetry)',
    lab: 'Continuous Real-time Spectrometric Node',
    recommendation: 'Primary village safe lifeline. Capacity: 15,000 L/day powered by 5 kW solar array.',
  },
  'SRC-01': {
    id: 'SRC-01',
    name: 'Rania Legacy Basic Chrome Sludge Dump (Point-Zero)',
    type: 'source',
    village: 'Rania Industrial Area',
    crLevel: 4.85,
    whoMultiplier: 97.0,
    status: 'critical',
    depth: 'Surface to 8m unsaturated zone',
    strata: 'Untreated basic chromium sulfate industrial tannery residue pile',
    affectedPop: 18400,
    lastTested: '20 Dec 2024 (NGT Monitored)',
    lab: 'Central Pollution Control Board (CPCB)',
    recommendation: 'High-density polyethylene (HDPE) cap installation & Vetiver phytoremediation barrier swale.',
  },
};

export default function DashboardPage() {
  const { language } = useTranslation();
  const [selectedPointId, setSelectedPointId] = useState<string>('HP-047');
  const [timeHorizon, setTimeHorizon] = useState<'2018' | '2025' | '90d' | '180d'>('2025');
  const [analyte, setAnalyte] = useState<'CrVI' | 'TotalCr' | 'Arsenic' | 'Fluoride'>('CrVI');

  const activeDetail = FEATURE_DATA[selectedPointId] || FEATURE_DATA['HP-047'];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8] text-[#0c1f18] font-sans">
      <Header />

      {/* ========================================================================= */}
      {/* 2. CONTEXTUAL DATASET PROVENANCE STRIP                                     */}
      {/* ========================================================================= */}
      <div className="bg-[#12372a] text-[#c3ebd8] border-b border-white/10 px-4 lg:px-10 py-2.5 flex flex-wrap justify-between items-center text-xs z-30">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 bg-[#2E8B68]/30 text-[#c3ebd8] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider text-[10px] border border-[#2E8B68]/50">
            <span className="material-symbols-outlined text-[13px]">verified</span>
            SAMPLE DATASET
          </span>
          <span className="text-white/85">
            Active Dataset: <strong className="text-white font-semibold">Rania Sector Chromium Plume</strong> (Sample Dataset UP-09A · 2,438 records · Hydrogeological survey Sept–Dec 2024)
          </span>
        </div>
        <div className="flex items-center gap-4 font-medium mt-1 sm:mt-0 text-white/90">
          <Link href="/data-sources" className="hover:text-white hover:underline flex items-center gap-1 transition-colors">
            <Upload className="w-3.5 h-3.5 text-emerald-300" />
            <span>Upload Your Dataset</span>
          </Link>
          <span className="text-white/30">•</span>
          <Link href="/data-sources" className="hover:text-white hover:underline flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
            <span>Switch Sample Data</span>
          </Link>
          <span className="text-white/30">•</span>
          <Link href="/evidence" className="hover:text-white hover:underline flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-[15px]">verified_user</span>
            <span>View Data Provenance</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. WORKSPACE SUB-HEADER (Filters, Horizon Slider, Geo-Hierarchy)         */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-stone-200 px-4 lg:px-10 py-3 shadow-xs z-20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Geo Hierarchy Selector */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-mono text-stone-500 uppercase tracking-wider flex items-center gap-1 mr-1">
              <span className="material-symbols-outlined text-[15px]">pin_drop</span>
              Territory:
            </span>
            <div className="inline-flex items-center bg-[#f2f8f5] rounded-lg p-0.5 border border-stone-200 font-medium">
              <span className="py-1 px-2 text-stone-700">Uttar Pradesh</span>
              <span className="text-stone-400">/</span>
              <span className="py-1 px-2 text-stone-700">Kanpur Dehat</span>
              <span className="text-stone-400">/</span>
              <span className="py-1 px-2 text-stone-700">Maitha</span>
              <span className="text-stone-400">/</span>
              <span className="py-1 px-2.5 bg-white text-[#002116] font-bold rounded shadow-xs">
                Rania (Cluster UP-09A)
              </span>
            </div>
            <span className="text-xs text-stone-500 ml-1">Ward 1–6 (24.3 km² basin)</span>
          </div>

          {/* Time Horizon / Simulation Slider */}
          <div className="flex items-center gap-3 bg-[#f2f8f5] px-3 py-1.5 rounded-lg border border-stone-200 text-xs">
            <span className="font-mono text-stone-500 flex items-center gap-1 uppercase text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[15px]">history</span>
              Temporal Horizon:
            </span>
            <div className="flex items-center gap-1 bg-white rounded p-0.5 border border-stone-200">
              <button
                onClick={() => setTimeHorizon('2018')}
                className={`px-2.5 py-1 rounded transition-colors ${timeHorizon === '2018' ? 'bg-[#002116] text-white font-bold' : 'text-stone-600 hover:bg-stone-50'}`}
              >
                2018 Hist
              </button>
              <button
                onClick={() => setTimeHorizon('2025')}
                className={`px-2.5 py-1 rounded transition-colors ${timeHorizon === '2025' ? 'bg-[#002116] text-white font-bold' : 'text-stone-600 hover:bg-stone-50'}`}
              >
                Present (2025)
              </button>
              <button
                onClick={() => setTimeHorizon('90d')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${timeHorizon === '90d' ? 'bg-[#006492] text-white font-bold' : 'text-[#006492] hover:bg-sky-50'}`}
              >
                <Sparkles className="w-3 h-3" />
                +90d Sim
              </button>
              <button
                onClick={() => setTimeHorizon('180d')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${timeHorizon === '180d' ? 'bg-[#006492] text-white font-bold' : 'text-[#006492] hover:bg-sky-50'}`}
              >
                <Activity className="w-3 h-3" />
                +180d Sim
              </button>
            </div>
          </div>

          {/* Contaminant Selector Matrix */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-stone-500 uppercase text-[11px] font-semibold">Analyte:</span>
            <div className="inline-flex rounded-lg border border-stone-200 bg-[#f2f8f5] p-0.5">
              <button
                onClick={() => setAnalyte('CrVI')}
                className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1 ${analyte === 'CrVI' ? 'bg-red-600 text-white shadow-xs' : 'text-stone-700 hover:bg-white'}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                Cr(VI) Hexavalent
              </button>
              <button
                onClick={() => setAnalyte('TotalCr')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${analyte === 'TotalCr' ? 'bg-[#002116] text-white shadow-xs' : 'text-stone-700 hover:bg-white'}`}
              >
                Total Cr
              </button>
              <button
                onClick={() => setAnalyte('Arsenic')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${analyte === 'Arsenic' ? 'bg-[#002116] text-white shadow-xs' : 'text-stone-700 hover:bg-white'}`}
              >
                Arsenic (As)
              </button>
              <button
                onClick={() => setAnalyte('Fluoride')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${analyte === 'Fluoride' ? 'bg-[#002116] text-white shadow-xs' : 'text-stone-700 hover:bg-white'}`}
              >
                Fluoride (F⁻)
              </button>
            </div>
            <div className="hidden xl:flex font-mono text-[10px] text-stone-500 bg-stone-100 px-2 py-1 rounded">
              WHO Permissible: 0.05 mg/L
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 & 5. MAIN CARTOGRAPHIC WORKSPACE & RIGHT DETAIL INSPECTION PANEL        */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col xl:flex-row relative overflow-hidden min-h-[640px]">
        {/* ========================================================== */}
        {/* CENTRAL SCIENTIFIC MAP CANVAS                              */}
        {/* ========================================================== */}
        <section className="flex-1 relative bg-[#F7FAF8] carto-grid contour-lines flex flex-col overflow-hidden select-none min-h-[480px]">
          {/* Top Overlay: Simulation Warning Banner (Diagonal Stripes) */}
          <div className="stripes-sim border-b border-stone-200 px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between text-xs text-[#002116] z-20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#5B72C7] text-[18px]">model_training</span>
              <span>
                <strong>HYDRO-DYNAMIC TRANSPORT OVERLAY:</strong> Visualizing active advection-dispersion plume in unconfined alluvial aquifer (#UP-09A).
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] bg-white/90 px-2 py-0.5 rounded border border-stone-200">
                Advection Velocity: 1.8 m/mo @ 235° SW
              </span>
              <span className="font-mono text-[11px] text-[#5B72C7] font-bold">94.2% Epistemic Fit</span>
            </div>
          </div>

          {/* MAP INTERFACE BACKGROUND & GEOSPATIAL VECTOR RECONSTRUCTION */}
          <div className="relative w-full flex-1 overflow-hidden flex items-center justify-center p-4">
            <svg className="absolute inset-0 w-full h-full" fill="none" viewBox="0 0 1000 680" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient cx="44%" cy="48%" fx="42%" fy="46%" id="plumeCore" r="35%">
                  <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.55"></stop>
                  <stop offset="35%" stopColor="#ba1a1a" stopOpacity="0.30"></stop>
                  <stop offset="70%" stopColor="#e28743" stopOpacity="0.18"></stop>
                  <stop offset="100%" stopColor="#ddf3e7" stopOpacity="0"></stop>
                </radialGradient>
                <radialGradient cx="40%" cy="50%" id="dispersionBuffer" r="50%">
                  <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.15"></stop>
                  <stop offset="100%" stopColor="#006492" stopOpacity="0"></stop>
                </radialGradient>
                <linearGradient id="drainGradient" x1="15%" x2="85%" y1="10%" y2="85%">
                  <stop offset="0%" stopColor="#2b1706" stopOpacity="0.8"></stop>
                  <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0.6"></stop>
                </linearGradient>
              </defs>

              {/* Topographical Contours */}
              <g fill="none" stroke="#12372a" strokeDasharray="2 2" strokeOpacity="0.08" strokeWidth="1">
                <path d="M -50 120 C 200 100, 400 240, 600 180 C 800 120, 950 200, 1100 170"></path>
                <path d="M -50 240 C 180 200, 350 360, 550 310 C 750 260, 900 380, 1100 340"></path>
                <path d="M -50 380 C 220 360, 390 520, 620 450 C 850 380, 950 540, 1100 500"></path>
                <path d="M -50 520 C 150 480, 380 620, 670 580 C 860 540, 980 640, 1100 620"></path>
              </g>

              {/* Aquifer Geological Strata Boundary Fault Line */}
              <path d="M 120 -20 Q 340 320 480 720" stroke="#765A43" strokeDasharray="4 6" strokeOpacity="0.35" strokeWidth="1.5"></path>
              <text fill="#765A43" fontFamily="Inter" fontSize="10" letterSpacing="0.08em" opacity="0.65" transform="rotate(65 310 240)" x="310" y="240">
                ALLUVIAL SAND / SILT CLAY FAULT BOUNDARY
              </text>

              {/* Rania Industrial Drain (Effluent Trench) */}
              <path d="M 220 110 Q 320 280 430 380 T 560 540" fill="none" stroke="url(#drainGradient)" strokeLinecap="round" strokeWidth="3.5"></path>
              <text fill="#ba1a1a" fontFamily="Inter" fontSize="11" fontWeight="600" letterSpacing="0.05em" x="340" y="325">
                Rania Industrial Nullah (Point Source Effluent)
              </text>

              {/* Village Abadi Settlement Footprints */}
              <polygon fill="#12372a" fillOpacity="0.04" points="380,180 440,195 435,260 370,245" stroke="#12372a" strokeOpacity="0.15" strokeWidth="1"></polygon>
              <text fill="#414844" fontFamily="Inter" fontSize="10" fontWeight="500" x="382" y="220">Rania Ward 2</text>

              <polygon fill="#12372a" fillOpacity="0.04" points="460,340 560,355 545,460 450,430" stroke="#12372a" strokeOpacity="0.15" strokeWidth="1"></polygon>
              <text fill="#414844" fontFamily="Inter" fontSize="10" fontWeight="500" x="475" y="405">Rania Ward 4 (High Exposure)</text>

              <polygon fill="#12372a" fillOpacity="0.04" points="620,220 730,230 710,320 610,300" stroke="#12372a" strokeOpacity="0.15" strokeWidth="1"></polygon>
              <text fill="#414844" fontFamily="Inter" fontSize="10" fontWeight="500" x="635" y="275">Khanpur Village Outskirts</text>

              {/* THE CHROMIUM HEXAVALENT PLUME */}
              <ellipse cx="450" cy="370" fill="url(#dispersionBuffer)" rx="210" ry="140" transform="rotate(-18 450 370)"></ellipse>
              <path d="M 280 340 C 310 240, 520 220, 620 310 C 690 380, 630 480, 520 500 C 390 520, 260 440, 280 340 Z" fill="url(#plumeCore)" stroke="#ba1a1a" strokeDasharray="6 4" strokeWidth="1.8"></path>
              <path d="M 360 350 C 370 290, 480 280, 530 330 C 570 370, 530 440, 460 445 C 400 450, 350 400, 360 350 Z" fill="#ba1a1a" fillOpacity="0.25" stroke="#ba1a1a" strokeWidth="2"></path>

              {/* Epistemic Boundary Label Tag on Contour */}
              <g transform="translate(420, 248)">
                <rect fill="#ffffff" height="20" opacity="0.95" rx="4" stroke="#ba1a1a" strokeWidth="1" width="280" x="-10" y="-12"></rect>
                <text fill="#ba1a1a" fontFamily="Inter" fontSize="10" fontWeight="600" letterSpacing="0.02em" x="0" y="2">
                  ⌁ MODEL ESTIMATE — NOT A VERIFIED BOUNDARY (78% CONFIDENCE)
                </text>
              </g>

              {/* Agricultural Borewells & Tube Wells */}
              <g fill="none" opacity="0.75" stroke="#006492" strokeWidth="1.5">
                <circle cx="210" cy="460" fill="#ddf3e7" r="4"></circle>
                <circle cx="290" cy="580" fill="#ddf3e7" r="4"></circle>
                <circle cx="680" cy="430" fill="#ddf3e7" r="4"></circle>
                <circle cx="740" cy="280" fill="#ddf3e7" r="4"></circle>
              </g>

              {/* Flow Direction Vectors */}
              <g opacity="0.6" stroke="#006492" strokeWidth="1.2">
                <line x1="390" x2="430" y1="310" y2="350"></line>
                <line x1="460" x2="505" y1="360" y2="405"></line>
                <line x1="510" x2="560" y1="410" y2="460"></line>
              </g>
            </svg>

            {/* Interactive DOM Map Markers */}
            {/* POINT A: PRIMARY CRITICAL HANDPUMP #HP-047 */}
            <button
              type="button"
              onClick={() => setSelectedPointId('HP-047')}
              className={`absolute left-[44%] top-[45%] -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group ${selectedPointId === 'HP-047' ? 'scale-110' : ''}`}
            >
              <span className="absolute -inset-3 rounded-full bg-red-600/20 animate-ping"></span>
              <span className="absolute -inset-1.5 rounded-full bg-red-600/30"></span>
              <div className="relative w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                <span className="material-symbols-outlined text-[18px]">priority_high</span>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white px-2.5 py-1.5 rounded-lg shadow-md border border-red-300 whitespace-nowrap pointer-events-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span className="text-[10px] font-mono font-bold text-red-600 uppercase">HP-047: DO NOT DRINK</span>
                </div>
                <div className="text-xs font-mono font-bold text-stone-900">
                  Cr(VI): 0.72 mg/L <span className="text-red-600 text-[10px] font-normal">(14.4x WHO)</span>
                </div>
              </div>
            </button>

            {/* POINT B: HANDPUMP HP-019 */}
            <button
              type="button"
              onClick={() => setSelectedPointId('HP-019')}
              className="absolute left-[39%] top-[37%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-red-700 text-white flex items-center justify-center shadow border border-white">
                <span className="material-symbols-outlined text-[15px]">warning</span>
              </div>
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-white px-2.5 py-1 rounded shadow text-[10px] font-mono text-red-600 border border-red-200 whitespace-nowrap">
                HP-019 · Cr: 0.84 mg/L
              </div>
            </button>

            {/* POINT C: RANIA PRIMARY SCHOOL */}
            <button
              type="button"
              onClick={() => setSelectedPointId('SCH-01')}
              className="absolute left-[48%] top-[38%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#422c18] text-[#ffdcc2] flex items-center justify-center shadow border border-amber-800">
                <School className="w-4 h-4" />
              </div>
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-white px-2.5 py-1 rounded shadow text-xs text-[#002116] border border-stone-200 whitespace-nowrap">
                <strong>Rania Primary School</strong> (420 Students within 120m)
              </div>
            </button>

            {/* POINT D: SAFE STATION DW-02 */}
            <button
              type="button"
              onClick={() => setSelectedPointId('DW-02')}
              className="absolute left-[54%] top-[30%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#2E8B68] text-white flex items-center justify-center shadow-lg border-2 border-white">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-white px-2.5 py-1 rounded shadow text-xs text-[#2E8B68] font-bold border border-emerald-300 whitespace-nowrap">
                ✓ Solar Borewell DW-02 (Safe Tap)
              </div>
            </button>

            {/* POINT E: INDUSTRIAL SLUDGE DUMP POINT ZERO */}
            <button
              type="button"
              onClick={() => setSelectedPointId('SRC-01')}
              className="absolute left-[28%] top-[24%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-black text-amber-400 flex items-center justify-center shadow border border-amber-500 animate-bounce">
                <span className="material-symbols-outlined text-[16px]">factory</span>
              </div>
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black text-white px-2.5 py-1 rounded shadow text-[10px] font-mono border border-stone-700 whitespace-nowrap">
                Rania Legacy Sludge Dump (Point-Zero)
              </div>
            </button>
          </div>

          {/* Bottom Map Controls Bar */}
          <div className="bg-white/95 backdrop-blur border-t border-stone-200 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-stone-600 z-20">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-red-600"></span> Hazardous &gt;0.05 mg/L
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span> Restricted
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-[#2E8B68]"></span> Verified Safe
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded bg-[#422c18]"></span> Sensitive Receptor
              </span>
            </div>
            <Link
              href="/map"
              className="text-xs font-mono font-bold text-[#006492] hover:underline flex items-center gap-1"
            >
              <span>Launch Full GIS Layer Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ========================================================== */}
        {/* RIGHT DETAIL INSPECTION PANEL                              */}
        {/* ========================================================== */}
        <aside className="w-full xl:w-[420px] bg-white border-t xl:border-t-0 xl:border-l border-stone-200 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-5">
            {/* Header & Status Indicator */}
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

            {/* Chemical Telemetry Card */}
            <div className="bg-[#f2f8f5] p-4 rounded-xl border border-stone-200 space-y-2.5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-mono text-stone-600 uppercase font-semibold">Cr(VI) Concentration</span>
                <span className="text-2xl font-mono font-bold text-red-700">{activeDetail.crLevel} mg/L</span>
              </div>
              <div className="flex justify-between text-xs text-stone-600">
                <span>WHO Limit: 0.05 mg/L</span>
                <span className="font-mono font-semibold text-red-700">{activeDetail.whoMultiplier}× permissible</span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${activeDetail.crLevel > 0.05 ? 'bg-red-600' : 'bg-emerald-600'}`}
                  style={{ width: `${Math.min(100, (activeDetail.crLevel / 0.8) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Geological Strata Log */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-stone-500 uppercase font-semibold block">Lithological Depth Strata</span>
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
                <span className="text-lg font-mono font-bold text-[#002116] mt-0.5 block">{activeDetail.affectedPop}</span>
                <span className="text-[11px] text-stone-500">within 250m radius</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] font-mono text-stone-500 block">LAB ACCREDITATION</span>
                <span className="text-xs font-bold text-[#2E8B68] mt-1 block">ISO/IEC 17025</span>
                <span className="text-[10px] text-stone-500 truncate block">{activeDetail.lab}</span>
              </div>
            </div>

            {/* Recommended District Protocol */}
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
              href="/water-safety"
              className="w-full py-2.5 bg-[#002116] hover:bg-[#12372a] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Droplets className="w-4 h-4 text-emerald-300" />
              <span>Verify Community Safe Alternate</span>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => alert(`Exporting JSON telemetry for ${activeDetail.id}...`)}
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
