'use client';

import React, { useState, useRef, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { getDb, VillageRecord, WaterSourceRecord } from '@/lib/db/store';
import {
  AlertTriangle,
  Droplet,
  Sprout,
  Factory,
  Droplets,
  Wheat,
  MapPin,
  Camera,
  Upload,
  CheckCircle,
  X,
  ArrowRight,
  Shield,
  Clock,
  Eye,
  Send,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';

function NewReportContent() {
  const searchParams = useSearchParams();
  const sourceParam = searchParams.get('source');
  const villageParam = searchParams.get('village');

  const { language } = useTranslation();
  const isHindi = language === 'hi';

  const [step, setStep] = useState(1);
  const [villages, setVillages] = useState<VillageRecord[]>([]);
  const [availableSources, setAvailableSources] = useState<WaterSourceRecord[]>([]);

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    locationType: villageParam ? 'village' : sourceParam ? 'source' : 'village',
    villageId: villageParam || 'V-001',
    waterSourceId: sourceParam || '',
    customLocation: '',
    latitude: 26.4481,
    longitude: 80.0102,
    description: sourceParam ? `Report regarding water point #${sourceParam}` : '',
    reporterName: '',
    reporterPhone: '',
    reporterType: 'Resident',
    photoDataUrl: '',
  });

  const [locating, setLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const db = getDb();
    const vList = db.getVillages();
    setVillages(vList);

    const initialVillage = villageParam || 'V-001';
    setAvailableSources(db.getWaterSourcesByVillage(initialVillage));
  }, [villageParam]);

  const handleVillageChange = (vId: string) => {
    const db = getDb();
    const v = db.getVillageById(vId);
    const sources = db.getWaterSourcesByVillage(vId);
    setAvailableSources(sources);

    setFormData((prev) => ({
      ...prev,
      villageId: vId,
      waterSourceId: sources[0]?.id || '',
      latitude: v?.coordinates.lat || 26.4481,
      longitude: v?.coordinates.lon || 80.0102,
    }));
    setValidationError(null);
  };

  const handleCategorySelect = (catId: string, defaultTitle: string) => {
    setFormData((prev) => ({
      ...prev,
      category: catId,
      title: prev.title || defaultTitle,
    }));
    setValidationError(null);
    setStep(2);
  };

  const handleGpsLocation = () => {
    if (!navigator.geolocation) {
      setValidationError('Geolocation not supported by browser. Please choose village manually.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setLocationSuccess(true);
        setFormData((prev) => ({
          ...prev,
          locationType: 'gps',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
        setValidationError(null);
      },
      (err) => {
        setLocating(false);
        setValidationError('Location access denied. Please select your village and water source manually.');
      },
      { timeout: 8000 }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setValidationError('Photo size exceeds 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, photoDataUrl: reader.result as string }));
      setValidationError(null);
    };
    reader.readAsDataURL(file);
  };

  const validateAndProceedToReview = () => {
    if (!formData.description.trim() && !formData.photoDataUrl) {
      setValidationError('Please provide a description or attach a photo before continuing.');
      return;
    }
    setValidationError(null);
    setStep(5);
  };

  const submitReportToDatabase = () => {
    const db = getDb();
    const finalLocationName = formData.waterSourceId === 'OTHER' || !formData.waterSourceId
      ? formData.customLocation || `${villages.find((v) => v.id === formData.villageId)?.name || 'Rural'} Cluster`
      : `${formData.waterSourceId} (${villages.find((v) => v.id === formData.villageId)?.name || 'Village'})`;

    const report = db.submitCommunityReport({
      category: formData.category,
      description: formData.description.trim() || `${formData.category} observed in field inspection`,
      villageId: formData.villageId,
      waterSourceId: formData.waterSourceId !== 'OTHER' ? formData.waterSourceId : undefined,
      locationName: finalLocationName,
      latitude: formData.latitude,
      longitude: formData.longitude,
      photoDataUrl: formData.photoDataUrl || undefined,
      reporterName: formData.reporterName.trim() || undefined,
      reporterPhone: formData.reporterPhone.trim() || undefined,
      reporterType: formData.reporterType,
    });

    setSubmittedReport(report);
    setStep(6);
  };

  const CATEGORIES = [
    { id: 'Yellow coloration', icon: Droplets, label: 'Yellow Coloration', labelHi: 'पीला / झागदार पानी', color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'Chemical odor', icon: Droplet, label: 'Chemical Odor', labelHi: 'रासायनिक दुर्गंध', color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'Unusual taste', icon: AlertTriangle, label: 'Unusual Taste / Metallic', labelHi: 'कड़वा / धातु जैसा स्वाद', color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'Waste dumping', icon: Factory, label: 'Waste Dumping', labelHi: 'कचरा / कीचड़ डंपिंग', color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'Industrial discharge observation', icon: Factory, label: 'Industrial Discharge', labelHi: 'औद्योगिक बहाव', color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'Hand pump discoloration', icon: Droplet, label: 'Hand Pump Discoloration', labelHi: 'हैंडपंप पर जंग / रंग', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'Water source concern', icon: Shield, label: 'Water Source Concern', labelHi: 'स्रोत सुरक्षा चिंता', color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'Drainage contamination concern', icon: Sprout, label: 'Drainage Contamination', labelHi: 'नाली / नहर प्रदूषण', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'Surface water discoloration', icon: Droplets, label: 'Surface Water Sheen', labelHi: 'तालाब / सतह पर चमक', color: 'text-teal-600', bg: 'bg-teal-50' },
    { id: 'Other', icon: HelpCircle, label: 'Other Observation', labelHi: 'अन्य अवलोकन', color: 'text-stone-600', bg: 'bg-stone-100' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8] text-[#0c1f18] font-sans">
      <Header />

      <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold text-[#006492] uppercase tracking-wider">
            CITIZEN OBSERVATION SENTINEL
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#002116] font-bold mt-1">
            {isHindi ? 'पर्यावरणीय समस्या की रिपोर्ट करें' : 'Report an Environmental Concern'}
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-md mx-auto">
            {isHindi
              ? 'आपकी रिपोर्ट सीधे ब्लॉक स्तर के अधिकारियों एवं परीक्षण दल को प्रेषित की जाती है।'
              : 'Help protect your community. Observations are logged into the database and routed to inspection teams.'}
          </p>
        </div>

        {/* 6-Step Indicator */}
        {step < 6 && (
          <div className="mb-6 flex justify-center overflow-x-auto pb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-stone-500">
              {[
                { s: 1, label: '1. Category' },
                { s: 2, label: '2. Location' },
                { s: 3, label: '3. Details' },
                { s: 4, label: '4. Evidence' },
                { s: 5, label: '5. Review' },
              ].map((item, idx) => (
                <React.Fragment key={item.s}>
                  <span
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap ${
                      step === item.s
                        ? 'bg-[#002116] text-white font-bold'
                        : step > item.s
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {item.label}
                  </span>
                  {idx < 4 && <div className="w-3 h-0.5 bg-stone-300"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-6 sm:p-8">
          {validationError && (
            <div className="p-3 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: CATEGORY */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-[11px] font-mono uppercase text-stone-400 font-bold">STEP 1 OF 5</span>
                <h2 className="text-xl sm:text-2xl font-serif text-[#002116] font-bold">
                  {isHindi ? 'आपने क्या समस्या देखी?' : 'What did you observe?'}
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleCategorySelect(item.id, item.label)}
                    className="flex flex-col items-center justify-center p-4 border-2 border-stone-200 rounded-xl hover:border-[#002116] hover:bg-stone-50 transition-all text-center group cursor-pointer"
                  >
                    <item.icon className={`w-8 h-8 mb-2 ${item.color} p-1.5 rounded-full ${item.bg} group-hover:scale-110 transition-transform`} />
                    <span className="font-bold text-stone-800 text-xs">{isHindi ? item.labelHi : item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & WATER SOURCE DROPDOWN */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-[11px] font-mono uppercase text-stone-400 font-bold">STEP 2 OF 5</span>
                <h2 className="text-xl sm:text-2xl font-serif text-[#002116] font-bold">
                  {isHindi ? 'यह समस्या कहाँ स्थित है?' : 'Select Community & Water Source'}
                </h2>
              </div>

              {/* GPS Auto-detect */}
              <button
                type="button"
                onClick={handleGpsLocation}
                disabled={locating}
                className="w-full flex items-center justify-between p-3.5 border-2 border-[#006492] rounded-xl bg-sky-50/50 hover:bg-sky-50 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#006492] shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-[#002116] block">
                      {locating ? 'Acquiring GPS...' : isHindi ? 'वर्तमान जीपीएस स्थान लें' : '📍 Detect Current GPS Coordinates'}
                    </span>
                    <span className="text-xs text-stone-500">
                      {locationSuccess ? `Locked: ${formData.latitude.toFixed(4)}°N, ${formData.longitude.toFixed(4)}°E` : 'Auto-fill latitude & longitude'}
                    </span>
                  </div>
                </div>
                {locationSuccess && <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">LOCKED</span>}
              </button>

              <div className="space-y-4 pt-2">
                {/* Village Selector */}
                <div>
                  <label className="block text-xs font-mono font-bold text-stone-600 mb-1.5 uppercase">
                    🏘️ Village / Gram Panchayat
                  </label>
                  <select
                    value={formData.villageId}
                    onChange={(e) => handleVillageChange(e.target.value)}
                    className="w-full text-sm p-3 border border-stone-300 rounded-xl bg-white outline-none focus:border-[#006492] font-medium"
                  >
                    {villages.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.hindiName}) · {v.district || 'Kanpur Nagar'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Water Source Dropdown (HP-001 ... HP-035 + Other) */}
                <div>
                  <label className="block text-xs font-mono font-bold text-stone-600 mb-1.5 uppercase">
                    🚰 Water Point / Hand Pump (Dropdown)
                  </label>
                  <select
                    value={formData.waterSourceId}
                    onChange={(e) => setFormData({ ...formData, waterSourceId: e.target.value })}
                    className="w-full text-sm p-3 border border-stone-300 rounded-xl bg-white outline-none focus:border-[#006492] font-medium font-mono"
                  >
                    <option value="">-- Choose Monitored Handpump --</option>
                    {availableSources.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id} — {s.name || s.type} (Status: {s.status.toUpperCase()})
                      </option>
                    ))}
                    <option value="OTHER">Other / Unregistered Location</option>
                  </select>
                </div>

                {/* Custom location input if "OTHER" or no water source */}
                {formData.waterSourceId === 'OTHER' && (
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-600 mb-1.5 uppercase">
                      Specify Water Source / Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Tube-well behind Primary Health Sub-Centre, Ward 3"
                      value={formData.customLocation}
                      onChange={(e) => setFormData({ ...formData, customLocation: e.target.value })}
                      className="w-full text-sm p-3 border border-stone-300 rounded-xl bg-stone-50 outline-none focus:border-[#006492]"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-mono text-stone-500 hover:text-stone-800"
                >
                  ← Back to Category
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-[#002116] hover:bg-[#12372a] text-white font-bold rounded-xl text-xs font-mono uppercase"
                >
                  Continue to Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS & REPORTER INFO */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-[11px] font-mono uppercase text-stone-400 font-bold">STEP 3 OF 5</span>
                <h2 className="text-xl sm:text-2xl font-serif text-[#002116] font-bold">
                  {isHindi ? 'समस्या का विवरण दें' : 'Describe What You Observed'}
                </h2>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-mono font-bold text-stone-600 mb-1.5 uppercase">
                  Report Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Yellow tinted water from morning collection"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-sm p-3 border border-stone-300 rounded-xl bg-stone-50 outline-none focus:border-[#006492]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono font-bold text-stone-600 mb-1.5 uppercase">
                  Observations Description (विवरण) *
                </label>
                <textarea
                  className="w-full p-3 border border-stone-300 rounded-xl text-xs sm:text-sm bg-stone-50 outline-none focus:border-[#006492] h-28 leading-relaxed"
                  placeholder="Describe color (yellow/amber), smell, taste, duration, household impact, or cattle refusal..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Reporter Persona */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-stone-600 mb-1 uppercase">
                    Your Role / Type
                  </label>
                  <select
                    value={formData.reporterType}
                    onChange={(e) => setFormData({ ...formData, reporterType: e.target.value })}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-stone-50 outline-none"
                  >
                    <option value="Ward Resident">Ward Resident</option>
                    <option value="Local Farmer">Local Farmer</option>
                    <option value="Asha Health Worker">Asha Health Worker</option>
                    <option value="School Headmaster">School Headmaster</option>
                    <option value="Gram Panchayat Member">Gram Panchayat Member</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-stone-600 mb-1 uppercase">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name (or Anonymized)"
                    value={formData.reporterName}
                    onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-stone-50 outline-none focus:border-[#006492]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-stone-600 mb-1 uppercase">
                    Phone for SMS Updates
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile"
                    value={formData.reporterPhone}
                    onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-stone-50 outline-none focus:border-[#006492]"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-mono text-stone-500 hover:text-stone-800"
                >
                  ← Back to Location
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.description.trim()) {
                      setValidationError('Please provide a brief description.');
                      return;
                    }
                    setValidationError(null);
                    setStep(4);
                  }}
                  className="px-6 py-2.5 bg-[#002116] hover:bg-[#12372a] text-white font-bold rounded-xl text-xs font-mono uppercase"
                >
                  Continue to Evidence →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PHOTO / EVIDENCE */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-[11px] font-mono uppercase text-stone-400 font-bold">STEP 4 OF 5</span>
                <h2 className="text-xl sm:text-2xl font-serif text-[#002116] font-bold">
                  {isHindi ? 'तस्वीर / प्रमाण अपलोड करें' : 'Attach Photo Evidence'}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Photographic proof drastically accelerates rapid-response lab dispatch.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {formData.photoDataUrl ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 h-64 group bg-black flex items-center justify-center">
                  <img src={formData.photoDataUrl} alt="Report evidence" className="max-h-64 w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photoDataUrl: '' })}
                    className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md cursor-pointer"
                    title="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-3 left-3 text-xs font-mono bg-black/80 text-white px-2.5 py-1 rounded-md border border-white/20">
                    Visual Evidence Attached ✓
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-[#002116] rounded-2xl p-10 text-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer group"
                >
                  <Camera className="w-12 h-12 text-stone-400 group-hover:text-[#002116] mx-auto mb-3 transition-colors" />
                  <span className="text-sm font-bold text-stone-800 block">
                    Click to Take Photo or Upload Image File
                  </span>
                  <span className="text-xs text-stone-500 mt-1 block">
                    Supports JPG, PNG, WEBP (Max 10MB)
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs font-mono text-stone-500 hover:text-stone-800"
                >
                  ← Back to Description
                </button>
                <button
                  type="button"
                  onClick={validateAndProceedToReview}
                  className="px-6 py-2.5 bg-[#002116] hover:bg-[#12372a] text-white font-bold rounded-xl text-xs font-mono uppercase"
                >
                  Review Summary →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW SUMMARY */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-[11px] font-mono uppercase text-stone-400 font-bold">STEP 5 OF 5</span>
                <h2 className="text-xl sm:text-2xl font-serif text-[#002116] font-bold">
                  Review &amp; Confirm Submission
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Verify your observation details before logging into the database.
                </p>
              </div>

              <div className="bg-[#f2f8f5] p-5 rounded-xl border border-stone-200 space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-3 border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-stone-500 block text-[10px]">CATEGORY</span>
                    <strong className="text-stone-900 text-sm">{formData.category}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">VILLAGE / PANCHAYAT</span>
                    <strong className="text-stone-900 text-sm">
                      {villages.find((v) => v.id === formData.villageId)?.name}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-stone-500 block text-[10px]">WATER POINT / LOCATION</span>
                    <strong className="text-stone-900">
                      {formData.waterSourceId || formData.customLocation || 'Village Cluster'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">COORDINATES</span>
                    <strong className="text-stone-900">
                      {formData.latitude.toFixed(4)}°N, {formData.longitude.toFixed(4)}°E
                    </strong>
                  </div>
                </div>

                <div>
                  <span className="text-stone-500 block text-[10px] mb-1">DESCRIPTION</span>
                  <p className="text-stone-800 bg-white p-3 rounded-lg border border-stone-200 leading-relaxed font-sans text-xs">
                    "{formData.description}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-stone-200 pt-3">
                  <div>
                    <span className="text-stone-500 block text-[10px]">REPORTER</span>
                    <strong className="text-stone-900">
                      {formData.reporterName || 'Anonymous'} ({formData.reporterType})
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">PHOTO ATTACHED</span>
                    <strong className={formData.photoDataUrl ? 'text-emerald-700 font-bold' : 'text-stone-500'}>
                      {formData.photoDataUrl ? 'Yes (1 Evidence Image)' : 'No Photo'}
                    </strong>
                  </div>
                </div>

                {formData.photoDataUrl && (
                  <div className="pt-2">
                    <img
                      src={formData.photoDataUrl}
                      alt="Review evidence"
                      className="h-28 rounded-lg border border-stone-200 object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs font-mono text-stone-500 hover:text-stone-800"
                >
                  ← Back to Evidence
                </button>
                <button
                  type="button"
                  onClick={submitReportToDatabase}
                  className="px-6 py-3 bg-[#002116] hover:bg-[#12372a] text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-emerald-300" />
                  Submit Official Report →
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMATION */}
          {step === 6 && submittedReport && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2E8B68] mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#002116] font-bold">
                {isHindi ? 'रिपोर्ट सफलतापूर्वक दर्ज की गई' : 'Report Received & Logged'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Your environmental report has been inserted into the live database and will be reflected immediately across the Participatory Sentinel network.
              </p>

              <div className="bg-[#f2f8f5] p-5 rounded-xl border border-stone-200 inline-block w-full max-w-sm text-left font-mono">
                <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-0.5">REFERENCE NUMBER</p>
                <p className="text-xl font-bold text-stone-900 mb-3">{submittedReport.id}</p>

                <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-0.5">STATUS</p>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  <Clock className="w-3 h-3" /> Reported · Awaiting Field Verification
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <Link
                  href="/reports"
                  className="px-6 py-2.5 bg-[#002116] text-white font-mono text-xs font-bold uppercase rounded-xl hover:bg-[#12372a] transition-colors"
                >
                  View in Community Registry
                </Link>
                <Link
                  href={`/map?lat=${submittedReport.coordinates.lat}&lon=${submittedReport.coordinates.lon}`}
                  className="px-5 py-2.5 bg-white border border-stone-300 text-stone-800 font-mono text-xs font-bold uppercase rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#2E8B68]" />
                  Locate on Spatial Map
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setSubmittedReport(null);
                    setFormData({
                      category: '',
                      title: '',
                      locationType: 'village',
                      villageId: 'V-001',
                      waterSourceId: '',
                      customLocation: '',
                      latitude: 26.4481,
                      longitude: 80.0102,
                      description: '',
                      reporterName: '',
                      reporterPhone: '',
                      reporterType: 'Resident',
                      photoDataUrl: '',
                    });
                  }}
                  className="px-4 py-2.5 bg-stone-100 text-stone-700 font-mono text-xs font-semibold rounded-xl hover:bg-stone-200 transition-colors"
                >
                  + New Report
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function NewReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f4fbf7]">
          <div className="font-mono text-sm text-[#12372A]">Loading reporting portal...</div>
        </div>
      }
    >
      <NewReportContent />
    </Suspense>
  );
}
