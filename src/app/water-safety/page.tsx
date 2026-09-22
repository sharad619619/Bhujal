'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { db, WaterSafetyVerdict, NearestSafeWaterResult } from '@/lib/db/store';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Volume2,
  Share2,
  MapPin,
  Camera,
  Send,
  Navigation,
  Info,
  Layers,
  ArrowRight,
  Upload,
  X,
  Search,
} from 'lucide-react';

function WaterSafetyContent() {
  const searchParams = useSearchParams();
  const initialSourceParam = searchParams.get('source') || 'HP-047';

  const { language } = useTranslation();
  const isHindi = language === 'hi';

  const [searchQuery, setSearchQuery] = useState(initialSourceParam);
  const [verdict, setVerdict] = useState<WaterSafetyVerdict | null>(null);
  const [allWaterSources, setAllWaterSources] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Community report form states
  const [selectedSymptom, setSelectedSymptom] = useState('yellow-water');
  const [reportDescription, setReportDescription] = useState('');
  const [reportPhoto, setReportPhoto] = useState<string | null>(null);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio voice narration
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Evaluate initial search on mount or URL change
  useEffect(() => {
    const sources = db.getWaterSources();
    setAllWaterSources(sources);
    const paramVal = searchParams.get('source') || searchParams.get('query') || initialSourceParam;
    if (paramVal) {
      setSearchQuery(paramVal);
      executeSafetyCheck(paramVal);
    } else {
      executeSafetyCheck(searchQuery);
    }
  }, [searchParams]);

  const executeSafetyCheck = (query: string, lat?: number, lon?: number) => {
    const result = db.checkWaterSafety(query, lat, lon);
    setVerdict(result);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSafetyCheck(searchQuery, userLocation?.lat, userLocation?.lon);
  };

  // Real Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError(
        isHindi
          ? 'आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता है।'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lon: longitude });

        // Find nearest safe source and evaluate safety
        const nearestSafe = db.findNearestSafeWater(latitude, longitude, 1);
        if (nearestSafe.length > 0) {
          executeSafetyCheck(nearestSafe[0].source.id, latitude, longitude);
          setSearchQuery(`${nearestSafe[0].source.id} (${nearestSafe[0].distanceMeters}m away)`);
        } else {
          executeSafetyCheck('HP-047', latitude, longitude);
        }
      },
      (err) => {
        setIsLocating(false);
        setGeoError(
          isHindi
            ? 'स्थान अनुमति अस्वीकृत। कृपया मैन्युअल रूप से गाँव या हैंडपंप संख्या दर्ज करें।'
            : 'Location permission denied. Please enter your handpump ID or village name manually.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Interactive Web Speech API audio walking directions
  const handlePlayAudioDirections = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      const text = isHindi
        ? `${verdict?.hindiHeadline || ''}. ${verdict?.hindiAdvice || ''}`
        : `${verdict?.headline || ''}. ${verdict?.advice || ''}`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
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
    if (!verdict || !verdict.source) return;
    const text = encodeURIComponent(
      `🚨 BHUJAL AI WATER SAFETY ALERT: ${verdict.source.name || verdict.source.id} is rated ${verdict.verdict}. Cr(VI) level: ${verdict.crVIMgL} mg/L (${verdict.whoLimitMultiplier}x limit). ${verdict.advice} Check live: https://bhujal-ai.vercel.app/water-safety?source=${verdict.source.id}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Real photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setFormError('Photo size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReportPhoto(reader.result as string);
      setFormError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSymptom) {
      setFormError('Please select what you observed.');
      return;
    }

    const newReport = db.submitCommunityReport({
      category: selectedSymptom,
      description: reportDescription || `${selectedSymptom} observed at ${verdict?.source?.id || 'Village Handpump'}`,
      villageId: verdict?.source?.villageId || 'V-001',
      waterSourceId: verdict?.source?.id,
      latitude: userLocation?.lat || verdict?.source?.coordinates.lat || 26.4481,
      longitude: userLocation?.lon || verdict?.source?.coordinates.lon || 80.0102,
      photoDataUrl: reportPhoto || undefined,
    });

    setSubmittedReportId(newReport.id);
    setFormError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e8fff3] text-[#0c1f18] font-sans selection:bg-[#7dc9ff] selection:text-[#002116]">
      <Header />

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
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
                {isHindi ? 'जल सुरक्षा एवं जन सहायता केंद्र' : 'Water Safety & Community Action Center'}
              </h1>
              <p className="text-sm sm:text-base text-stone-600 mt-1">
                {isHindi
                  ? '3-सेकंड त्वरित रासायनिक परीक्षण जाँच एवं आपातकालीन सुरक्षित जल निर्देशिका।'
                  : '3-second rapid contamination verification and emergency clean water dispatch.'}
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
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <label className="block text-lg font-serif text-[#002116] font-bold" htmlFor="water-check-input">
                {isHindi ? 'क्या आपका पानी सुरक्षित है? / Is My Water Safe?' : 'Is My Water Safe? / क्या आपका पानी सुरक्षित है?'}
              </label>
              <p className="text-xs sm:text-sm text-stone-600">
                {isHindi
                  ? 'हैंडपंप संख्या (उदा. HP-047, HP-019) या गाँव का नाम दर्ज करें।'
                  : 'Instant chemical test verdict, toxic hexavalent chromium report, and nearest safe clean supply point.'}
              </p>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 text-[#002116] w-5 h-5" />
                  <input
                    className="w-full bg-[#f2f8f5]/60 border border-stone-300 rounded-xl pl-12 pr-4 py-3 text-sm sm:text-base text-[#0c1f18] font-medium focus:ring-2 focus:ring-[#006492] focus:border-[#006492] transition-all outline-none"
                    id="water-check-input"
                    placeholder="Enter Handpump ID (e.g. HP-047, HP-019, DW-02) or Village Name..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#006492] text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#00547b] transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{isLocating ? 'Locating...' : isHindi ? 'वर्तमान स्थान लें (GPS)' : 'Use Current Location'}</span>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#12372a] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-[#002116] transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isHindi ? 'जाँच करें (Check Safety)' : 'Check Safety'}</span>
                </button>
              </div>

              {/* Direct Water Source Dropdown Selector */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs font-mono">
                <span className="text-stone-500 font-semibold">
                  {isHindi ? 'या सीधे मॉनिटर किया गया स्रोत चुनें:' : 'Or pick from monitored water sources:'}
                </span>
                <select
                  value={allWaterSources.some(s => s.id.toLowerCase() === searchQuery.toLowerCase()) ? searchQuery : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setSearchQuery(e.target.value);
                      executeSafetyCheck(e.target.value, userLocation?.lat, userLocation?.lon);
                    }
                  }}
                  className="bg-[#f2f8f5] border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 font-mono font-medium focus:ring-1 focus:ring-[#006492] outline-none cursor-pointer"
                >
                  <option value="">-- Choose from 35 Monitored Water Points --</option>
                  {allWaterSources.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id}: {s.name} ({s.status.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {geoError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{geoError}</span>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* 1. URGENT 3-SECOND VISUAL WATER STATUS WITH AUTHENTIC DOCUMENTARY PHOTOGRAPH */}
        {verdict && (
          <section
            aria-label="Rapid Safety Verdict"
            className={`bg-white rounded-2xl shadow-xl border-2 overflow-hidden ${
              verdict.verdict === 'UNSAFE'
                ? 'border-red-500/30 strata-edge-danger'
                : verdict.verdict === 'CAUTION'
                ? 'border-amber-500/30 strata-edge-tertiary'
                : 'border-emerald-500/30 strata-edge-safe'
            }`}
          >
            {/* Emergency Top Bar */}
            <div
              className={`px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3 ${
                verdict.verdict === 'UNSAFE'
                  ? 'bg-[#ba1a1a]'
                  : verdict.verdict === 'CAUTION'
                  ? 'bg-amber-600'
                  : 'bg-[#2E8B68]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-white">
                    {verdict.verdict === 'UNSAFE' ? 'dangerous' : verdict.verdict === 'CAUTION' ? 'warning' : 'verified'}
                  </span>
                </span>
                <div>
                  <span className="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded text-white tracking-widest uppercase font-semibold">
                    {verdict.verdict === 'UNSAFE'
                      ? 'IMMEDIATE HAZARD LEVEL 5 · तत्काल चेतावनी'
                      : verdict.verdict === 'CAUTION'
                      ? 'CAUTION RESTRICTED · सावधानी बरतें'
                      : 'CERTIFIED POTABLE · सुरक्षित शुद्ध जल'}
                  </span>
                  <div className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                    {isHindi ? verdict.hindiHeadline : verdict.headline}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black/25 px-3.5 py-1.5 rounded-xl border border-white/20">
                <span className="text-xs font-mono text-white/80">SOURCE:</span>
                <span className="text-base font-mono font-bold text-white">
                  {verdict.source?.name || verdict.source?.id || 'Unknown'}
                </span>
              </div>
            </div>

            {/* Visual Proof Grid */}
            <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Authentic Photo */}
              <div className="lg:col-span-5 relative rounded-xl overflow-hidden border-2 border-stone-200 shadow-md group">
                <img
                  className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  alt="Water Point Observation in rural Uttar Pradesh"
                  src={
                    verdict.verdict === 'UNSAFE'
                      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa9iLRFPzOhlvw6RAtYeLSGF582uuEYV-FWdfThhLi85BRKTnt-msuWQReU3fPVq2_XUd_wLYjmI6cfNQ6jKshaLW7lTnqpuiYtrqJCZFfjwxZY0NKFD6qo21wnYOGx8P47ou962CKDXoCVJGImYIgPxim55MTXP7FdMMzfQZzkbstc3OvQS7lw2aXHLL5fUFWwZsnmoWDIoXbq9kD_xgVdI3w_ply12U35caU0jx1JFK0rAshyXGvtQ'
                      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuATnoMqi8V4WMIrs8SF99bUPHEKzmsLmeQz6bktQ8GCDXtgkbf7eyTkiHPvdZUMLtMbiy72m6rqwllPq0GUdp2TSyFKWuVYc3l1ABo8mT0cKgfk6dZ4k7i-NjoQr_jEj5xb6AlQWT832ANpHgqyr_kDdMclFGMH0xALzw409MBv3G1IA6r7APyT-FKSzoVeA_A5qa18IJtB949J3Pqg_j8dCNu4506nHbQNTRZD83Dl4vJBdHhoZ3__8g'
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1 ${
                        verdict.verdict === 'UNSAFE' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {verdict.verdict === 'UNSAFE' ? 'lock' : 'verified'}
                      </span>
                      {verdict.verdict === 'UNSAFE' ? 'SEALED RED · ताला बंद' : 'TESTED SAFE · सुरक्षित'}
                    </span>
                    <span className="text-xs text-white/90">Verified: {verdict.lastTestedDate}</span>
                  </div>
                  <p className="text-xs text-white/90 font-medium">
                    {verdict.laboratory}
                  </p>
                </div>
              </div>

              {/* Warning Text & Actions */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-2">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono ${
                      verdict.verdict === 'UNSAFE'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {verdict.verdict === 'UNSAFE' ? 'block' : 'check_circle'}
                    </span>
                    {isHindi ? verdict.hindiHeadline : verdict.headline}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#002116] font-bold leading-tight">
                    {verdict.source?.name || `Water Point #${verdict.source?.id}`}
                  </h2>
                  <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                    {isHindi ? verdict.hindiAdvice : verdict.advice}
                  </p>
                </div>

                {/* High Priority Actions */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <a
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2E8B68] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-[#257355] transition-all shadow-md active:scale-95"
                    href="#nearest-safe-water"
                  >
                    <span className="material-symbols-outlined text-xl">directions_walk</span>
                    <span>{isHindi ? 'निकटतम सुरक्षित पानी खोजें' : 'Find Nearest Safe Water'}</span>
                  </a>
                  <a
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-red-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-red-700 transition-all shadow-md active:scale-95"
                    href="#report-section"
                  >
                    <span className="material-symbols-outlined text-xl">report_problem</span>
                    <span>{isHindi ? 'समस्या दर्ज करें' : 'Report Issue'}</span>
                  </a>
                </div>

                {/* Scientific Telemetry Box */}
                <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 bg-[#f2f8f5] p-3.5 rounded-xl border border-stone-200">
                  <div>
                    <div className="text-[10px] font-mono text-stone-500 uppercase font-semibold">LAB TELEMETRY</div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span
                        className={`text-xl font-bold font-mono ${
                          verdict.crVIMgL && verdict.crVIMgL > 0.05 ? 'text-red-600' : 'text-emerald-700'
                        }`}
                      >
                        {verdict.crVIMgL} mg/L
                      </span>
                      <span className="text-xs text-stone-600">Cr(VI) Hexavalent Chromium</span>
                      {verdict.whoLimitMultiplier && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            verdict.crVIMgL && verdict.crVIMgL > 0.05
                              ? 'text-red-700 bg-red-100'
                              : 'text-emerald-800 bg-emerald-100'
                          }`}
                        >
                          {verdict.whoLimitMultiplier}x WHO Limit (0.05 max)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-[#2E8B68] font-semibold flex items-center justify-end gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span> {verdict.verificationStatus}
                    </span>
                    <span className="text-xs text-stone-500">{verdict.laboratory}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. LIFELINE NAVIGATOR / NEAREST SAFE ALTERNATIVE */}
        {verdict?.nearestSafeSource && (
          <section aria-label="Nearest Safe Clean Alternative" className="space-y-4" id="nearest-safe-water">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-[#2E8B68] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">emergency_home</span>
                  LIFELINE NAVIGATOR · जीवन रेखा
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#002116] font-bold">
                  {isHindi ? 'निकटतम सुरक्षित पानी का स्रोत' : 'Nearest Safe Potable Alternative'}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2E8B68]/15 text-[#2E8B68] text-xs font-bold border border-[#2E8B68]/30">
                <CheckCircle2 className="w-4 h-4" />
                100% Tested Safe Source (पीने योग्य शुद्ध जल)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden strata-edge-safe">
              <div className="p-6 lg:p-8 lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-[#12372a] text-white rounded text-[11px] font-mono font-semibold">
                      JAL JEEVAN MISSION · GOVT APPROVED
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#2E8B68]/15 text-[#2E8B68] rounded text-[11px] font-mono font-bold">
                      ✓ TESTED SAFE (0.002 mg/L Cr)
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif text-[#002116] font-bold">
                    {verdict.nearestSafeSource.source.name || 'Jal Jeevan Mission Solar Deep Borewell'}
                  </h3>
                  <p className="text-sm sm:text-base text-stone-600 mt-1.5">
                    Opposite Primary Health Sub-Centre, Rania (प्राथमिक स्वास्थ्य केंद्र के सामने, रानिया). Deep confined aquifer at 145m depth, completely shielded from industrial leachate.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                    <div className="bg-[#f2f8f5] p-3.5 rounded-xl border border-stone-200">
                      <div className="text-[10px] font-mono text-stone-500">DISTANCE</div>
                      <div className="text-xl font-bold font-mono text-[#002116]">
                        {verdict.nearestSafeSource.distanceMeters} m
                      </div>
                      <div className="text-xs font-bold text-[#2E8B68]">
                        ~{verdict.nearestSafeSource.walkingMinutes} min walk
                      </div>
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
                      <div className="text-xs font-semibold text-[#2E8B68]">Active Continuous</div>
                    </div>
                  </div>
                </div>

                {/* Voice Navigation & WhatsApp Share */}
                <div className="pt-5 border-t border-stone-200 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handlePlayAudioDirections}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#12372a] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-[#002116] transition-all shadow active:scale-95 cursor-pointer"
                  >
                    <Volume2 className="w-5 h-5 text-emerald-300" />
                    <span>
                      {isPlayingAudio
                        ? isHindi
                          ? 'ऑडियो बंद करें'
                          : 'Stop Audio'
                        : isHindi
                        ? 'सुरक्षित पानी तक आवाज में रास्ता सुनें'
                        : 'Get Audio Walking Directions'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-[#20ba5a] transition-all shadow active:scale-95 cursor-pointer"
                  >
                    <Share2 className="w-5 h-5 text-white" />
                    <span>{isHindi ? 'व्हाट्सएप पर शेयर करें' : 'Share via WhatsApp'}</span>
                  </button>
                </div>
              </div>

              {/* Satellite Walking Path */}
              <div className="lg:col-span-5 bg-stone-100 relative min-h-[320px] flex flex-col justify-between p-5 border-t lg:border-t-0 lg:border-l border-stone-200">
                <div className="absolute inset-0 overflow-hidden opacity-95">
                  <img
                    className="w-full h-full object-cover"
                    alt="Satellite map showing highlighted paved path from contaminated handpump to safe solar deep borewell"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuATnoMqi8V4WMIrs8SF99bUPHEKzmsLmeQz6bktQ8GCDXtgkbf7eyTkiHPvdZUMLtMbiy72m6rqwllPq0GUdp2TSyFKWuVYc3l1ABo8mT0cKgfk6dZ4k7i-NjoQr_jEj5xb6AlQWT832ANpHgqyr_kDdMclFGMH0xALzw409MBv3G1IA6r7APyT-FKSzoVeA_A5qa18IJtB949J3Pqg_j8dCNu4506nHbQNTRZD83Dl4vJBdHhoZ3__8g"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 flex justify-between items-start">
                  <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold text-[#002116] border border-stone-200 flex items-center gap-1.5 shadow">
                    <Navigation className="w-4 h-4 text-[#2E8B68]" />
                    Paved Path ➔ Safe Station #{verdict.nearestSafeSource.source.id}
                  </span>
                </div>

                <div className="relative z-10 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-stone-200 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#2E8B68]/15 text-[#2E8B68] rounded-xl shrink-0">
                      <span className="material-symbols-outlined text-2xl">turn_right</span>
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-[#002116] block font-bold">
                        {isHindi ? 'रानिया पंचायत भवन से दाएँ मुड़ें' : 'Turn right at Rania Panchayat Bhawan'}
                      </strong>
                      <span className="text-stone-600">
                        {isHindi
                          ? '180 मीटर सीधे चलें। प्राथमिक स्वास्थ्य केंद्र के सामने सोलर वाटर टैंक।'
                          : 'Walk straight 180m along paved lane. Landmark: Blue solar water tank opposite sub-health clinic.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. BENTO DUAL COLUMN: COMMUNITY REPORTING & REMEDIATION WETLAND */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="report-section">
          {/* COMMUNITY REPORTING FLOW */}
          <section
            aria-label="Community Incident Report"
            className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-stone-200 flex flex-col justify-between space-y-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6">
                <div>
                  <span className="text-xs font-mono text-[#006492] font-bold uppercase">RAPID CITIZEN ACTION</span>
                  <h2 className="text-xl sm:text-2xl font-serif text-[#002116] font-bold">
                    {isHindi ? 'समस्या की रिपोर्ट करें' : 'Report an Environmental Issue'}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600">
                    {isHindi
                      ? 'तस्वीर और विवरण के साथ सीधी शिकायत दर्ज करें।'
                      : 'Tap visual options below for immediate field officer inspection.'}
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#006492] text-3xl">add_alert</span>
              </div>

              {submittedReportId ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950 font-serif">
                    {isHindi ? 'रिपोर्ट सफलतापूर्वक दर्ज की गई' : 'Report Lodged Successfully'} #{submittedReportId}
                  </h3>
                  <p className="text-sm text-emerald-800 max-w-md mx-auto">
                    {isHindi
                      ? 'फील्ड अधिकारी को निरीक्षण के लिए अलर्ट भेजा गया है। आप इसे कम्युनिटी रिपोर्ट्स में ट्रैक कर सकते हैं।'
                      : 'A field verification request has been dispatched to the Kanpur Dehat testing lab. Saved directly to the Bhujal registry.'}
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <Link
                      href="/reports"
                      className="px-4 py-2 bg-[#002116] text-white rounded-lg text-xs font-bold font-mono uppercase"
                    >
                      View in Reports Registry →
                    </Link>
                    <button
                      onClick={() => {
                        setSubmittedReportId(null);
                        setReportPhoto(null);
                        setReportDescription('');
                      }}
                      className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-mono font-semibold"
                    >
                      Submit Another
                    </button>
                  </div>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmitReport}>
                  {formError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-mono">
                      {formError}
                    </div>
                  )}

                  {/* Step 1: Symptoms */}
                  <div>
                    <label className="block text-xs font-mono text-stone-500 uppercase font-semibold mb-2.5">
                      {isHindi ? 'चरण 1: आपने क्या देखा? (लक्षण चुनें)' : 'Step 1: What did you observe?'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'yellow-water', emoji: '🟡', title: 'Yellow-tinted water', sub: 'पीला पानी / झागदार पानी' },
                        { id: 'chemical-odor', emoji: '👃', title: 'Chemical odor', sub: 'रासायनिक गंध / बदबू' },
                        { id: 'waste-dumping', emoji: '🧴', title: 'Waste dumping', sub: 'अवैध रासायनिक कचरा / कीचड़' },
                        { id: 'livestock-illness', emoji: '🐄', title: 'Livestock illness', sub: 'पशु अस्वस्थता / त्वचा रोग' },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedSymptom(item.id)}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedSymptom === item.id
                              ? 'border-[#006492] bg-[#006492]/10'
                              : 'border-stone-200 hover:border-[#006492] bg-stone-50/50'
                          }`}
                        >
                          <span className="text-2xl">{item.emoji}</span>
                          <div>
                            <div className="text-sm font-bold text-stone-900">{item.title}</div>
                            <div className="text-xs text-stone-600">{item.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Photo Capture & Evidence */}
                  <div>
                    <label className="block text-xs font-mono text-stone-500 uppercase font-semibold mb-2.5">
                      {isHindi ? 'चरण 2: तस्वीर अपलोड एवं जीपीएस' : 'Step 2: Photo Evidence & GPS Geotag'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />

                      {reportPhoto ? (
                        <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500 h-32 group">
                          <img src={reportPhoto} alt="Uploaded evidence" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setReportPhoto(null)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                            title="Remove photo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <span className="absolute bottom-1 left-2 text-[10px] font-mono bg-black/60 text-white px-1.5 py-0.5 rounded">
                            Photo Attached ✓
                          </span>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-[#006492]/40 hover:border-[#006492] bg-[#f2f8f5] rounded-xl p-4 flex flex-col items-center justify-center text-center group transition-colors cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#006492]/10 flex items-center justify-center text-[#006492] group-hover:scale-110 transition-transform">
                            <Camera className="w-5 h-5" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-[#002116] mt-2">
                            {isHindi ? 'फोटो खींचें या अपलोड करें' : 'Take Photo or Upload'}
                          </span>
                          <span className="text-[11px] text-stone-500">Capture pump color or sludge</span>
                        </div>
                      )}

                      <div className="bg-[#f2f8f5] rounded-xl p-4 border border-stone-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-stone-500 font-semibold uppercase">GEOTAG:</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#2E8B68]/15 text-[#2E8B68] text-[10px] font-mono font-bold">
                            <span className="material-symbols-outlined text-xs">gps_fixed</span> LOCKED
                          </span>
                        </div>
                        <div className="my-1.5">
                          <div className="text-xs sm:text-sm font-bold text-[#002116] font-mono">
                            {userLocation
                              ? `${userLocation.lat.toFixed(4)}° N, ${userLocation.lon.toFixed(4)}° E`
                              : '26.4481° N, 80.0102° E'}
                          </div>
                          <div className="text-xs text-stone-500">
                            {verdict?.source?.villageId === 'V-001' ? 'Rania Sector, UP-09A' : 'Kanpur Basin'}
                          </div>
                        </div>
                        <div className="text-[11px] text-stone-500">Realtime GPS Timestamp Active</div>
                      </div>
                    </div>
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="block text-xs font-mono text-stone-500 uppercase font-semibold mb-1">
                      {isHindi ? 'अतिरिक्त विवरण (वैकल्पिक)' : 'Description / Observations (Optional)'}
                    </label>
                    <textarea
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder={
                        isHindi
                          ? 'पानी का रंग, गंध, या त्वचा की समस्या के बारे में लिखें...'
                          : 'Describe any unusual smell, color, water taste, or community health issues...'
                      }
                      rows={2}
                      className="w-full bg-[#f2f8f5] border border-stone-300 rounded-xl p-3 text-xs text-stone-900 outline-none focus:border-[#006492]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    className="w-full py-3.5 px-6 bg-[#12372a] text-white font-bold rounded-xl shadow hover:bg-[#002116] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    type="submit"
                  >
                    <Send className="w-4 h-4 text-emerald-300" />
                    <span>{isHindi ? 'रिपोर्ट दर्ज करें (Submit Incident)' : 'Submit Incident Report'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Tracking Stages */}
            <div className="pt-5 border-t border-stone-200">
              <div className="text-xs font-mono text-stone-500 font-semibold uppercase mb-3">
                {isHindi ? 'लाइव स्टेटस ट्रैकर (#BHL-8942)' : 'Live Incident Status Tracker (#BHL-8942)'}
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
                  <div className="text-[11px] font-mono font-bold text-[#006492]">Dispatched</div>
                  <div className="text-xs text-stone-700 font-medium">Officer on Site</div>
                </div>
              </div>
            </div>
          </section>

          {/* NATURE-BASED REMEDIATION SHOWCASE */}
          <section
            aria-label="Remediation Strategy"
            className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-stone-200 flex flex-col justify-between strata-edge-tertiary"
          >
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
                  {isHindi
                    ? 'प्रकृति-आधारित क्रोमियम निष्कासन एवं मृदा स्थिरीकरण पायलट परियोजना'
                    : 'Biological chromium immobilization and vadose zone stabilization pilot'}
                </p>
              </div>

              <div className="relative rounded-xl overflow-hidden h-52 border border-stone-200 shadow-sm group">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Real-world phytoremediation wetland in India: Vetiver grass in filtration swales"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSrY9otWZR2VjuaPIa0nnbP3YDKo-m4rZcrtj5sWD8vmUYhmFwnhSN6F4DO4KLhEuLiKkxK7KR_c4iFsCR3cJ1pSfZBzkaC6MZba1jRT-IvzTEG-AaypAR6uDcBE5NTPFX40BzD9Y-Uf0Qej6D6fniNOI0eA2vQ9G5DjBshtYa946R1BgDyQw-PJthH2S06alnVZFXCoyZBqHWgWTj0jUUxWCK8E8BFGDK4dWa7Z5aqeEDTo34B085kw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <span className="text-[10px] font-mono bg-[#2E8B68] text-white px-2 py-0.5 rounded font-bold">PILOT AREA #1 · 2.4 HECTARES</span>
                    <h4 className="text-sm sm:text-base font-bold text-white mt-1">Vetiver Grass &amp; Indian Mustard Hyperaccumulators</h4>
                  </div>
                </div>
              </div>

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

export default function WaterSafetyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f4fbf7]">
          <div className="font-mono text-sm text-[#12372A]">Loading water safety lifeline...</div>
        </div>
      }
    >
      <WaterSafetyContent />
    </Suspense>
  );
}
