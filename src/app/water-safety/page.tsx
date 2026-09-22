'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Volume2,
  Share2,
  MapPin,
  Camera,
  Send,
  Navigation,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function WaterSafetyPage() {
  const { language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('Handpump #HP-047 (Rania Ward 4)');
  const [selectedSymptom, setSelectedSymptom] = useState('yellow-water');
  const [reportedState, setReportedState] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'report' | 'remediation'>('status');

  // Interactive Web Speech API audio walking directions
  const handlePlayAudioDirections = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      const text = language === 'hi'
        ? 'कृपया ध्यान दें। हैंडपंप 47 का पानी दूषित है। सुरक्षित पानी के लिए रानिया पंचायत भवन से दाएँ मुड़ें, 180 मीटर सीधे चलें। प्राथमिक स्वास्थ्य केंद्र के सामने सोलर डीप बोरवेल स्थित है।'
        : 'Warning. Handpump HP-047 is severely contaminated. For clean safe water, turn right at Rania Panchayat Bhawan, walk 180 meters straight. Safe Jal Jeevan solar deep borewell DW-02 is directly opposite the sub-health centre.';

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Audio narration not supported in your browser.');
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      '🚨 BHUJAL AI WATER SAFETY ALERT: Handpump #HP-047 in Rania is RED-FLAGGED with 0.72 mg/L Hexavalent Chromium (14.4x limit). DO NOT DRINK. Nearest safe source: Jal Jeevan Solar Borewell #DW-02 (380m walk, opposite Sub-Health Centre). Check live at: https://bhujal-ai.vercel.app/water-safety'
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportedState(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e8fff3] text-[#0c1f18] font-sans selection:bg-[#7dc9ff] selection:text-[#002116]">
      <Header />

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-8">
        {/* HERO HEADER & RAPID LOOKUP */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#c1c8c3]/40 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#006492]/10 text-[#006492] border border-[#006492]/20">
                  <span className="w-2 h-2 rounded-full bg-[#006492] animate-pulse"></span>
                  LIVE COMMUNITY TELEMETRY FEED
                </span>
                <span className="text-xs text-stone-500">Kanpur Dehat Basin · UP-09A</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif text-[#002116] font-bold">
                Water Safety &amp; Community Action Center
              </h1>
              <p className="text-sm sm:text-base text-stone-600 mt-1">
                जल सुरक्षा एवं जन सहायता केंद्र — 3-second rapid contamination verification and emergency clean water dispatch.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto bg-white p-2 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-mono text-stone-500 px-2 uppercase font-semibold">STATUS MODE:</span>
              <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">fmd_bad</span>
                Emergency Mode Active
              </span>
            </div>
          </div>

          {/* Rapid Search Bar */}
          <div className="bg-white border-2 border-[#002116]/20 rounded-2xl p-4 sm:p-5 shadow-md">
            <label className="block text-lg font-serif text-[#002116] font-bold mb-1" htmlFor="water-check-input">
              क्या आपका पानी सुरक्षित है? / Is My Water Safe?
            </label>
            <p className="text-xs sm:text-sm text-stone-600 mb-3">
              Instant chemical test verdict, toxic hexavalent chromium report, and nearest safe clean supply point.
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-4 top-3.5 text-[#002116] text-xl">search</span>
                <input
                  className="w-full bg-[#f2f8f5]/60 border border-stone-300 rounded-xl pl-12 pr-4 py-3 text-sm sm:text-base text-[#0c1f18] font-medium focus:ring-2 focus:ring-[#006492] focus:border-[#006492] transition-all outline-none"
                  id="water-check-input"
                  placeholder="Enter Village Name or Handpump # (e.g., HP-047 or Rania Ward 4)..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('Handpump #HP-047 (Rania Ward 4)')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#006492] text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#00547b] transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">my_location</span>
                <span>Use Current Location (वर्तमान स्थान लें)</span>
              </button>
              <button
                type="button"
                onClick={() => alert(`Verification details loaded for: ${searchQuery}`)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#12372a] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-[#002116] transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">verified</span>
                <span>Check Safety (जाँच करें)</span>
              </button>
            </div>
          </div>
        </section>

        {/* 1. URGENT 3-SECOND VISUAL WATER STATUS WITH AUTHENTIC DOCUMENTARY PHOTOGRAPH */}
        <section aria-label="Rapid Safety Verdict" className="bg-white rounded-2xl shadow-xl border-2 border-red-500/30 overflow-hidden strata-edge-danger">
          {/* Emergency Top Bar */}
          <div className="bg-[#ba1a1a] px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-1.5 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-white">dangerous</span>
              </span>
              <div>
                <span className="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded text-white tracking-widest uppercase font-semibold">
                  IMMEDIATE HAZARD LEVEL 5 · तत्काल चेतावनी
                </span>
                <div className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                  🔴 पानी सुरक्षित नहीं है / DO NOT USE FOR DRINKING OR COOKING
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-black/25 px-3.5 py-1.5 rounded-xl border border-white/20">
              <span className="text-xs font-mono text-white/80">HANDPUMP ID:</span>
              <span className="text-base font-mono font-bold text-white">#HP-047</span>
              <span className="text-xs text-white/90 hidden sm:inline">(Rania Ward 4, Primary School)</span>
            </div>
          </div>

          {/* Integrated Visual Proof Grid: Documentary Photo + Action Pills + Secondary Lab Telemetry */}
          <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Authentic Documentary Photo of Sealed India Mark II Handpump */}
            <div className="lg:col-span-5 relative rounded-xl overflow-hidden border-2 border-red-500/40 shadow-md group">
              <img
                className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                alt="Documentary environmental photography in rural Uttar Pradesh: India Mark II hand pump sealed with bold red warning lock"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa9iLRFPzOhlvw6RAtYeLSGF582uuEYV-FWdfThhLi85BRKTnt-msuWQReU3fPVq2_XUd_wLYjmI6cfNQ6jKshaLW7lTnqpuiYtrqJCZFfjwxZY0NKFD6qo21wnYOGx8P47ou962CKDXoCVJGImYIgPxim55MTXP7FdMMzfQZzkbstc3OvQS7lw2aXHLL5fUFWwZsnmoWDIoXbq9kD_xgVdI3w_ply12U35caU0jx1JFK0rAshyXGvtQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-red-600 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">lock</span> SEALED RED · ताला बंद
                  </span>
                  <span className="text-xs text-white/90">Gram Panchayat Sealed 16 Oct 2024</span>
                </div>
                <p className="text-xs text-white/90 font-medium">
                  Site inspection: Handpump handle locked with warning notice board.
                </p>
              </div>
            </div>

            {/* Clear Warning & Large Action Pills for Rapid Rural Comprehension */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 text-xs font-bold font-mono">
                  <span className="material-symbols-outlined text-base">block</span>
                  पीने या खाना पकाने में प्रयोग सख्त वर्जित है
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#002116] font-bold leading-tight">
                  Severe Chemical Contamination Detected at Handpump #HP-047
                </h2>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  This water contains heavy industrial toxins. Using this water causes severe organ damage, skin lesions, and carcinogenic risks. Please proceed to the safe borewell lifeline immediately.
                </p>
              </div>

              {/* High Priority Large Action Pills (3-Second Action) */}
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2E8B68] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-[#257355] transition-all shadow-md active:scale-95"
                  href="#nearest-safe-water"
                >
                  <span className="material-symbols-outlined text-xl">directions_walk</span>
                  <span>Find Nearest Safe Water (निकटतम सुरक्षित पानी)</span>
                </a>
                <a
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-red-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-red-700 transition-all shadow-md active:scale-95"
                  href="#report-section"
                >
                  <span className="material-symbols-outlined text-xl">report_problem</span>
                  <span>Report Sickness / Issue (समस्या दर्ज करें)</span>
                </a>
              </div>

              {/* Secondary Scientific Telemetry Box */}
              <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 bg-[#f2f8f5] p-3.5 rounded-xl border border-stone-200">
                <div>
                  <div className="text-[10px] font-mono text-stone-500 uppercase font-semibold">LAB TELEMETRY (VISUALLY SECONDARY)</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl font-bold text-red-600 font-mono">0.72 mg/L</span>
                    <span className="text-xs text-stone-600">Cr(VI) Hexavalent Chromium</span>
                    <span className="text-[10px] font-mono text-red-700 bg-red-100 px-2 py-0.5 rounded font-bold">14.4x limit (0.05 max)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-[#2E8B68] font-semibold flex items-center justify-end gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span> UPPCB NABL Lab Verified
                  </span>
                  <span className="text-xs text-stone-500">Sample #KAN-8921-Cr</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. LIFELINE NAVIGATOR / NEAREST SAFE ALTERNATIVE */}
        <section aria-label="Nearest Safe Clean Alternative" className="space-y-4" id="nearest-safe-water">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="text-xs font-mono text-[#2E8B68] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">emergency_home</span>
                LIFELINE NAVIGATOR · जीवन रेखा
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#002116] font-bold">
                निकटतम सुरक्षित पानी का स्रोत / Nearest Safe Alternative
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2E8B68]/15 text-[#2E8B68] text-xs font-bold border border-[#2E8B68]/30">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              100% Tested Safe Source (पीने योग्य शुद्ध जल)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden strata-edge-safe">
            {/* Left Safe Source Details (7 cols) */}
            <div className="p-6 lg:p-8 lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-[#12372a] text-white rounded text-[11px] font-mono font-semibold">
                    JAL JEEVAN MISSION · GOVT APPROVED
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#2E8B68]/15 text-[#2E8B68] rounded text-[11px] font-mono font-bold">
                    ✓ TESTED SAFE YESTERDAY (0.002 mg/L Cr)
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-[#002116] font-bold">
                  Jal Jeevan Mission Solar Deep Borewell #DW-02
                </h3>
                <p className="text-sm sm:text-base text-stone-600 mt-1.5">
                  Opposite Primary Health Sub-Centre, Rania (प्राथमिक स्वास्थ्य केंद्र के सामने, रानिया). Deep confined aquifer at 145m depth, completely shielded from industrial leachate.
                </p>

                {/* Key 4-Item Telemetry Matrix with Distance & Capacity */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  <div className="bg-[#f2f8f5] p-3.5 rounded-xl border border-stone-200">
                    <div className="text-[10px] font-mono text-stone-500">DISTANCE</div>
                    <div className="text-xl font-bold font-mono text-[#002116]">380 m</div>
                    <div className="text-xs font-bold text-[#2E8B68]">~5 min walk</div>
                  </div>
                  <div className="bg-[#f2f8f5] p-3.5 rounded-xl border border-stone-200">
                    <div className="text-[10px] font-mono text-stone-500">DAILY CAPACITY</div>
                    <div className="text-xl font-bold font-mono text-[#002116]">15,000 L</div>
                    <div className="text-xs text-stone-600">Liters / Day Available</div>
                  </div>
                  <div className="bg-[#f2f8f5] p-3.5 rounded-xl border border-stone-200">
                    <div className="text-[10px] font-mono text-stone-500">PURIFICATION</div>
                    <div className="text-base font-bold text-[#002116]">RO + Resin</div>
                    <div className="text-xs text-stone-600">Dual-Bed Media</div>
                  </div>
                  <div className="bg-[#f2f8f5] p-3.5 rounded-xl border border-stone-200">
                    <div className="text-[10px] font-mono text-stone-500">POWER SOURCE</div>
                    <div className="text-base font-bold text-[#002116]">5 kW Solar</div>
                    <div className="text-xs font-semibold text-[#2E8B68]">Active (Continuous)</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Audio Walking Directions & WhatsApp */}
              <div className="pt-5 border-t border-stone-200 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handlePlayAudioDirections}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#12372a] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-[#002116] transition-all shadow active:scale-95 cursor-pointer"
                >
                  <Volume2 className="w-5 h-5 text-emerald-300" />
                  <span>
                    {isPlayingAudio
                      ? 'Stop Voice Directions (ऑडियो बंद करें)'
                      : 'सुरक्षित पानी तक रास्ता दिखाएं / Get Audio Walking Directions'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-[#20ba5a] transition-all shadow active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-5 h-5 text-white" />
                  <span>Share via WhatsApp (शेयर करें)</span>
                </button>
              </div>
            </div>

            {/* Integrated Satellite Walking Map (5 cols) */}
            <div className="lg:col-span-5 bg-stone-100 relative min-h-[320px] flex flex-col justify-between p-5 border-t lg:border-t-0 lg:border-l border-stone-200">
              <div className="absolute inset-0 overflow-hidden opacity-95">
                <img
                  className="w-full h-full object-cover"
                  alt="Satellite map showing highlighted paved path from contaminated handpump to safe solar deep borewell"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATnoMqi8V4WMIrs8SF99bUPHEKzmsLmeQz6bktQ8GCDXtgkbf7eyTkiHPvdZUMLtMbiy72m6rqwllPq0GUdp2TSyFKWuVYc3l1ABo8mT0cKgfk6dZ4k7i-NjoQr_jEj5xb6AlQWT832ANpHgqyr_kDdMclFGMH0xALzw409MBv3G1IA6r7APyT-FKSzoVeA_A5qa18IJtB949J3Pqg_j8dCNu4506nHbQNTRZD83Dl4vJBdHhoZ3__8g"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent"></div>
              </div>

              {/* Floating Map Badges */}
              <div className="relative z-10 flex justify-between items-start">
                <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold text-[#002116] border border-stone-200 flex items-center gap-1.5 shadow">
                  <span className="material-symbols-outlined text-base text-[#2E8B68]">route</span>
                  Paved Path: Handpump #HP-047 ➔ Safe Station #DW-02
                </span>
              </div>

              {/* Waypoint Instructions Card */}
              <div className="relative z-10 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-stone-200 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#2E8B68]/15 text-[#2E8B68] rounded-xl shrink-0">
                    <span className="material-symbols-outlined text-2xl">turn_right</span>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <strong className="text-[#002116] block font-bold">Turn right at Rania Panchayat Bhawan</strong>
                    <span className="text-stone-600">Walk straight 180m along paved lane. Landmark: Blue overhead solar water tank opposite sub-health clinic.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 & 4. BENTO DUAL COLUMN: VISUAL COMMUNITY REPORTING & NATURE-BASED REMEDIATION WETLAND */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="report-section">
          {/* 3. VISUAL COMMUNITY REPORTING FLOW (7 Cols) */}
          <section aria-label="Community Incident Report" className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-stone-200 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6">
                <div>
                  <span className="text-xs font-mono text-[#006492] font-bold uppercase">RAPID CITIZEN ACTION</span>
                  <h2 className="text-xl sm:text-2xl font-serif text-[#002116] font-bold">
                    समस्या की रिपोर्ट करें / Report an Issue
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600">Tap visual options below for immediate field officer inspection.</p>
                </div>
                <span className="material-symbols-outlined text-[#006492] text-3xl">add_alert</span>
              </div>

              {reportedState ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950">रिपोर्ट सफलतापूर्वक दर्ज की गई / Report Lodged #BHL-8943</h3>
                  <p className="text-sm text-emerald-800 max-w-md mx-auto">
                    A field verification request has been dispatched to the Kanpur Dehat Mobile Water Testing Lab. SMS updates sent to registered village Mukhiya.
                  </p>
                  <button
                    onClick={() => setReportedState(false)}
                    className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                  >
                    Submit Another Report
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmitReport}>
                  {/* Step 1: Visual Icon Selection Buttons for Symptoms/Observations */}
                  <div>
                    <label className="block text-xs font-mono text-stone-500 uppercase font-semibold mb-2.5">
                      चरण 1 / Step 1: What did you observe? (लक्षण चुनें)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        onClick={() => setSelectedSymptom('yellow-water')}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedSymptom === 'yellow-water'
                            ? 'border-[#006492] bg-[#006492]/10'
                            : 'border-stone-200 hover:border-[#006492] bg-stone-50/50'
                        }`}
                      >
                        <span className="text-2xl">🟡</span>
                        <div>
                          <div className="text-sm font-bold text-stone-900">Yellow-tinted water</div>
                          <div className="text-xs text-stone-600">पीला पानी / झागदार पानी</div>
                        </div>
                      </label>

                      <label
                        onClick={() => setSelectedSymptom('chemical-odor')}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedSymptom === 'chemical-odor'
                            ? 'border-[#006492] bg-[#006492]/10'
                            : 'border-stone-200 hover:border-[#006492] bg-stone-50/50'
                        }`}
                      >
                        <span className="text-2xl">👃</span>
                        <div>
                          <div className="text-sm font-bold text-stone-900">Chemical odor</div>
                          <div className="text-xs text-stone-600">रासायनिक गंध / बदबू</div>
                        </div>
                      </label>

                      <label
                        onClick={() => setSelectedSymptom('waste-dumping')}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedSymptom === 'waste-dumping'
                            ? 'border-red-600 bg-red-50'
                            : 'border-red-200 hover:border-red-600 bg-red-50/30'
                        }`}
                      >
                        <span className="text-2xl">🧴</span>
                        <div>
                          <div className="text-sm font-bold text-red-700">Waste dumping</div>
                          <div className="text-xs text-stone-600">अवैध रासायनिक कचरा / कीचड़</div>
                        </div>
                      </label>

                      <label
                        onClick={() => setSelectedSymptom('livestock-illness')}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedSymptom === 'livestock-illness'
                            ? 'border-[#006492] bg-[#006492]/10'
                            : 'border-stone-200 hover:border-[#006492] bg-stone-50/50'
                        }`}
                      >
                        <span className="text-2xl">🐄</span>
                        <div>
                          <div className="text-sm font-bold text-stone-900">Livestock illness</div>
                          <div className="text-xs text-stone-600">पशु अस्वस्थता / त्वचा रोग</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Step 2: Visual Photo Capture Card with Auto-GPS Geotagging */}
                  <div>
                    <label className="block text-xs font-mono text-stone-500 uppercase font-semibold mb-2.5">
                      चरण 2 / Step 2: Photo Capture &amp; GPS (तस्वीर और स्थान)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="border-2 border-dashed border-[#006492]/40 hover:border-[#006492] bg-[#f2f8f5] rounded-xl p-4 flex flex-col items-center justify-center text-center group transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-[#006492]/10 flex items-center justify-center text-[#006492] group-hover:scale-110 transition-transform">
                          <Camera className="w-6 h-6" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#002116] mt-2">Take Photo (फोटो खींचें)</span>
                        <span className="text-xs text-stone-500">Capture pump color or sludge</span>
                      </div>

                      <div className="bg-[#f2f8f5] rounded-xl p-4 border border-stone-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-stone-500 font-semibold uppercase">AUTO GPS GEOTAG:</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#2E8B68]/15 text-[#2E8B68] text-[10px] font-mono font-bold">
                            <span className="material-symbols-outlined text-xs">gps_fixed</span> LOCKED
                          </span>
                        </div>
                        <div className="my-2">
                          <div className="text-sm font-bold text-[#002116] font-mono">
                            26.4481° N, 80.0102° E (±4m)
                          </div>
                          <div className="text-xs text-stone-500">Rania Rural Sector, UP-09A</div>
                        </div>
                        <div className="text-xs text-stone-500">
                          Live Time: Realtime IST Active
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    className="w-full py-3.5 px-6 bg-[#12372a] text-white font-bold rounded-xl shadow hover:bg-[#002116] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    type="submit"
                  >
                    <Send className="w-5 h-5 text-emerald-300" />
                    <span>Submit Incident Report (रिपोर्ट दर्ज करें)</span>
                  </button>
                </form>
              )}
            </div>

            {/* Step 3: Visual Report Tracking Timeline */}
            <div className="pt-5 border-t border-stone-200">
              <div className="text-xs font-mono text-stone-500 font-semibold uppercase mb-3">
                चरण 3 / Step 3: Live Incident Status Tracker (#BHL-8942)
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-[#f2f8f5] border border-stone-200">
                  <div className="w-6 h-6 rounded-full bg-[#2E8B68] text-white mx-auto flex items-center justify-center text-xs font-bold mb-1">✓</div>
                  <div className="text-[11px] font-mono font-bold text-[#002116]">Reported</div>
                  <div className="text-xs text-stone-500">10:14 AM</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#f2f8f5] border border-stone-200">
                  <div className="w-6 h-6 rounded-full bg-[#2E8B68] text-white mx-auto flex items-center justify-center text-xs font-bold mb-1">✓</div>
                  <div className="text-[11px] font-mono font-bold text-[#002116]">Under Review</div>
                  <div className="text-xs text-stone-500">10:30 AM</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#006492]/15 border-2 border-[#006492] relative overflow-hidden">
                  <div className="w-6 h-6 rounded-full bg-[#006492] text-white mx-auto flex items-center justify-center text-xs font-bold mb-1 animate-pulse">●</div>
                  <div className="text-[11px] font-mono font-bold text-[#006492]">Dispatched (Live)</div>
                  <div className="text-xs text-stone-700 font-medium">Officer on Site</div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. NATURE-BASED REMEDIATION WETLAND SHOWCASE */}
          <section aria-label="Remediation Strategy" className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-stone-200 flex flex-col justify-between strata-edge-tertiary">
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#765A43]">psychiatry</span>
                  <span className="text-xs font-mono text-[#765A43] font-bold uppercase">LONG-TERM RESTORATION PILOT</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif text-[#002116] mt-0.5 font-bold">
                  Rania Phytoremediation Wetland
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  प्रकृति-आधारित क्रोमियम निष्कासन एवं मृदा स्थिरीकरण पायलट परियोजना
                </p>
              </div>

              {/* Authentic Photographic Showcase of Vetiver & Indian Mustard Project */}
              <div className="relative rounded-xl overflow-hidden h-52 border border-stone-200 shadow-sm group">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Real-world environmental engineering and nature-based phytoremediation wetland in India: Vetiver grass in filtration swales"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSrY9otWZR2VjuaPIa0nnbP3YDKo-m4rZcrtj5sWD8vmUYhmFwnhSN6F4DO4KLhEuLiKkxK7KR_c4iFsCR3cJ1pSfZBzkaC6MZba1jRT-IvzTEG-AaypAR6uDcBE5NTPFX40BzD9Y-Uf0Qej6D6fniNOI0eA2vQ9G5DjBshtYa946R1BgDyQw-PJthH2S06alnVZFXCoyZBqHWgWTj0jUUxWCK8E8BFGDK4dWa7Z5aqeEDTo34B085kw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <span className="text-[10px] font-mono bg-[#2E8B68] text-white px-2 py-0.5 rounded font-bold">PILOT AREA #1 · 2.4 HECTARES</span>
                    <h4 className="text-sm sm:text-base font-bold text-white mt-1">Vetiver Grass &amp; Indian Mustard Hyperaccumulators</h4>
                  </div>
                </div>
              </div>

              {/* Scientific Plant Mechanisms */}
              <div className="space-y-2.5">
                <div className="p-3 bg-[#f2f8f5] rounded-xl border border-stone-200">
                  <div className="flex justify-between items-center text-xs font-mono font-bold text-[#002116]">
                    <span>VETIVER GRASS (Chrysopogon zizanioides)</span>
                    <span className="text-[#2E8B68]">3.2m Root Barrier</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    Deep roots bind and immobilize Cr(VI) cations, preventing plume migration toward lower village drinking horizons.
                  </p>
                </div>

                <div className="p-3 bg-[#f2f8f5] rounded-xl border border-stone-200">
                  <div className="flex justify-between items-center text-xs font-mono font-bold text-[#002116]">
                    <span>INDIAN MUSTARD (Brassica juncea)</span>
                    <span className="text-[#006492]">Phyto-Extraction</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    Absorbs soluble heavy metals from upper soil matrix into stems for safe ecological harvest.
                  </p>
                </div>
              </div>

              {/* Verified 42.8% Soil Chromium Reduction Metric */}
              <div className="p-3.5 rounded-xl bg-[#2E8B68]/10 border border-[#2E8B68]/30 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-[#2E8B68] font-bold uppercase">VERIFIED REDUCTION METRIC</span>
                  <span className="text-lg font-mono font-bold text-[#2E8B68]">42.8% Reduced</span>
                </div>
                <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#2E8B68]/20">
                  <div className="bg-[#2E8B68] h-full rounded-full" style={{ width: '42.8%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-stone-500">
                  <span>Pre-treatment: 380 mg/kg</span>
                  <span>Current: 217 mg/kg</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200">
              <Link
                href="/remediation"
                className="w-full py-3 bg-[#765A43] hover:bg-[#5b422c] text-white text-center rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-colors block"
              >
                Inspect Full Remediation Blueprint →
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
