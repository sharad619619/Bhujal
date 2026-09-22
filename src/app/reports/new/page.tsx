'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { db } from '@/lib/db/store';
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
} from 'lucide-react';
import Link from 'next/link';

function NewReportContent() {
  const searchParams = useSearchParams();
  const sourceParam = searchParams.get('source');
  const villageParam = searchParams.get('village');

  const { language } = useTranslation();
  const isHindi = language === 'hi';

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    locationType: villageParam ? 'village' : sourceParam ? 'source' : '',
    villageId: villageParam || 'V-001',
    waterSourceId: sourceParam || '',
    latitude: 26.4481,
    longitude: 80.0102,
    description: sourceParam ? `Report regarding water point #${sourceParam}` : '',
    photoDataUrl: '',
    reporterName: '',
  });

  const [locating, setLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [generatedReportId, setGeneratedReportId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const villages = db.getVillages();

  const handleCategorySelect = (cat: string) => {
    setFormData((prev) => ({ ...prev, category: cat }));
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
        setStep(3);
      },
      (err) => {
        setLocating(false);
        setValidationError('Location access denied. Please select your village from the list.');
      },
      { timeout: 8000 }
    );
  };

  const handleVillageSelect = (villageId: string) => {
    const v = villages.find((x) => x.id === villageId);
    setFormData((prev) => ({
      ...prev,
      locationType: 'village',
      villageId,
      latitude: v?.coordinates.lat || 26.4481,
      longitude: v?.coordinates.lon || 80.0102,
    }));
    setValidationError(null);
    setStep(3);
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

  const submitReport = () => {
    // Strict Validation
    if (!formData.category) {
      setValidationError('Please select what problem you observed.');
      setStep(1);
      return;
    }

    if (!formData.villageId && formData.locationType !== 'gps') {
      setValidationError('Please specify the location or village.');
      setStep(2);
      return;
    }

    if (!formData.description.trim() && !formData.photoDataUrl) {
      setValidationError('Please provide a description or attach photo evidence.');
      return;
    }

    // Submit to real database store
    const newReport = db.submitCommunityReport({
      category: formData.category,
      description: formData.description.trim() || `${formData.category} observed in field inspection`,
      villageId: formData.villageId,
      waterSourceId: formData.waterSourceId,
      latitude: formData.latitude,
      longitude: formData.longitude,
      photoDataUrl: formData.photoDataUrl,
      reporterName: formData.reporterName,
    });

    setGeneratedReportId(newReport.id);
    setValidationError(null);
    setStep(4);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8] text-[#0c1f18] font-sans">
      <Header />

      <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold text-[#006492] uppercase tracking-wider">
            CITIZEN REPORTING PORTAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#002116] font-bold mt-1">
            {isHindi ? 'पर्यावरणीय समस्या की रिपोर्ट करें' : 'Report an Environmental Concern'}
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-md mx-auto">
            {isHindi
              ? 'आपकी रिपोर्ट सीधे ब्लॉक स्तर के अधिकारियों एवं परीक्षण दल को प्रेषित की जाती है।'
              : 'Help protect your community. Reports are verified and routed to District Water Teams.'}
          </p>
        </div>

        {/* Multi-Step Indicator */}
        {step < 4 && (
          <div className="mb-6 flex justify-center">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold">
              <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-[#002116] text-white' : 'bg-stone-200 text-stone-500'}`}>
                1. Category
              </span>
              <div className="w-8 h-0.5 bg-stone-300">
                <div className={`h-full bg-[#002116] ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-[#002116] text-white' : 'bg-stone-200 text-stone-500'}`}>
                2. Location
              </span>
              <div className="w-8 h-0.5 bg-stone-300">
                <div className={`h-full bg-[#002116] ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-[#002116] text-white' : 'bg-stone-200 text-stone-500'}`}>
                3. Evidence
              </span>
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

          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-serif text-[#002116] font-bold text-center">
                {isHindi ? 'आपने क्या समस्या देखी?' : 'What did you observe?'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { id: 'water', icon: Droplets, label: 'Yellow/Discolored Water', labelHi: 'पीला/झागदार पानी', color: 'text-amber-500', bg: 'bg-amber-50' },
                  { id: 'odor', icon: Droplet, label: 'Chemical Odor', labelHi: 'रासायनिक दुर्गंध', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { id: 'waste', icon: Factory, label: 'Industrial Waste Dumping', labelHi: 'कचरा/कीचड़ डंपिंग', color: 'text-red-600', bg: 'bg-red-50' },
                  { id: 'pump', icon: Droplet, label: 'Broken/Locked Handpump', labelHi: 'खराब/बंद हैंडपंप', color: 'text-cyan-500', bg: 'bg-cyan-50' },
                  { id: 'soil', icon: Sprout, label: 'Soil Contamination', labelHi: 'मृदा क्षरण/प्रदूषण', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { id: 'crop', icon: Wheat, label: 'Crop/Livestock Sickness', labelHi: 'फसल/पशु रोग', color: 'text-lime-600', bg: 'bg-lime-50' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleCategorySelect(item.id)}
                    className="flex flex-col items-center justify-center p-5 border-2 border-stone-200 rounded-xl hover:border-[#002116] hover:bg-stone-50 transition-all text-center group cursor-pointer"
                  >
                    <item.icon className={`w-10 h-10 mb-2 ${item.color} p-2 rounded-full ${item.bg} group-hover:scale-110 transition-transform`} />
                    <span className="font-bold text-stone-800 text-xs sm:text-sm">{isHindi ? item.labelHi : item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-serif text-[#002116] font-bold text-center">
                {isHindi ? 'यह समस्या कहाँ स्थित है?' : 'Where is the problem located?'}
              </h2>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGpsLocation}
                  disabled={locating}
                  className="w-full flex items-center justify-center gap-3 p-4 border-2 border-[#006492] rounded-xl bg-sky-50/50 hover:bg-sky-50 transition-all cursor-pointer text-left"
                >
                  <MapPin className="w-5 h-5 text-[#006492] shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-[#002116] block">
                      {locating ? 'Acquiring GPS...' : isHindi ? 'वर्तमान जीपीएस स्थान लें' : '📍 Use My Current Location (GPS)'}
                    </span>
                    <span className="text-xs text-stone-500">Auto-detect coordinates within Uttar Pradesh</span>
                  </div>
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs font-mono text-stone-400">OR SELECT VILLAGE</span>
                  </div>
                </div>

                <div className="p-4 border-2 border-stone-200 rounded-xl bg-stone-50">
                  <label className="block text-xs font-mono font-bold text-stone-600 mb-2 uppercase">
                    🏘️ Select Gram Panchayat / Village
                  </label>
                  <select
                    defaultValue={formData.villageId}
                    onChange={(e) => e.target.value && handleVillageSelect(e.target.value)}
                    className="w-full text-sm p-3 border border-stone-300 rounded-lg bg-white outline-none focus:border-[#006492] font-medium"
                  >
                    <option value="">-- Choose Village --</option>
                    {villages.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.hindiName}) · {v.district || 'Kanpur Dehat'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-mono text-stone-500 hover:text-stone-800 underline"
                >
                  ← Back to Categories
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: EVIDENCE & DESCRIPTION */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-serif text-[#002116] font-bold text-center">
                {isHindi ? 'तस्वीर एवं विवरण जोड़ें' : 'Add Photo Evidence & Details'}
              </h2>

              {/* Photo Input */}
              <div>
                <label className="block text-xs font-mono font-bold text-stone-600 mb-2 uppercase">
                  Photo Evidence (फ़ोटो प्रमाण)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {formData.photoDataUrl ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500 h-48 group">
                    <img src={formData.photoDataUrl} alt="Report evidence" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, photoDataUrl: '' })}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-2 left-2 text-xs font-mono bg-black/70 text-white px-2 py-0.5 rounded">
                      Photo Attached ✓
                    </span>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 hover:border-[#002116] rounded-xl p-8 text-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer group"
                  >
                    <Camera className="w-10 h-10 text-stone-400 group-hover:text-[#002116] mx-auto mb-2 transition-colors" />
                    <span className="text-sm font-bold text-stone-800 block">
                      Click to Take Photo or Upload File
                    </span>
                    <span className="text-xs text-stone-500">Supports JPG, PNG up to 10MB</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono font-bold text-stone-600 mb-2 uppercase">
                  Description of Issue (विवरण)
                </label>
                <textarea
                  className="w-full p-3 border border-stone-300 rounded-xl text-xs sm:text-sm bg-stone-50 outline-none focus:border-[#006492] h-28"
                  placeholder="Describe the smell, color, health effects, or timeline of what occurred..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Reporter Name (Optional) */}
              <div>
                <label className="block text-xs font-mono font-bold text-stone-600 mb-1 uppercase">
                  Reporter Name / Contact (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Name or Phone for SMS dispatch updates..."
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-xs bg-stone-50 outline-none focus:border-[#006492]"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-mono text-stone-600 hover:text-stone-900"
                >
                  ← Back to Location
                </button>
                <button
                  type="button"
                  onClick={submitReport}
                  className="px-6 py-3 bg-[#002116] hover:bg-[#12372a] text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider shadow-md transition-all active:scale-95"
                >
                  Submit Official Report →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION */}
          {step === 4 && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2E8B68] mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#002116] font-bold">
                {isHindi ? 'रिपोर्ट सफलतापूर्वक दर्ज की गई' : 'Report Received & Logged'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Thank you for reporting. Your observation has been logged to the active Bhujal AI database and will appear on community telemetry feeds.
              </p>

              <div className="bg-[#f2f8f5] p-5 rounded-xl border border-stone-200 inline-block w-full max-w-sm text-left font-mono">
                <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-0.5">REFERENCE NUMBER</p>
                <p className="text-xl font-bold text-stone-900 mb-3">{generatedReportId}</p>

                <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-0.5">STATUS</p>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Under Review · Dispatch Pending
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <Link
                  href="/reports"
                  className="px-6 py-2.5 bg-[#002116] text-white font-mono text-xs font-bold uppercase rounded-xl hover:bg-[#12372a] transition-colors"
                >
                  View in Community Reports Registry
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      category: '',
                      locationType: '',
                      villageId: 'V-001',
                      waterSourceId: '',
                      latitude: 26.4481,
                      longitude: 80.0102,
                      description: '',
                      photoDataUrl: '',
                      reporterName: '',
                    });
                  }}
                  className="px-4 py-2.5 bg-white border border-stone-300 text-stone-700 font-mono text-xs font-semibold rounded-xl hover:bg-stone-50 transition-colors"
                >
                  Submit Another Report
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
