'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { villages } from '@/lib/data';
import { AlertTriangle, Droplet, Sprout, Factory, Droplets, Wheat, MapPin, Camera, Upload, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewReportPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    locationType: '',
    villageId: '',
    description: '',
    photoPreview: ''
  });

  const handleCategorySelect = (cat: string) => {
    setFormData({ ...formData, category: cat });
    setStep(2);
  };

  const handleLocationSelect = (type: string, id: string = '') => {
    setFormData({ ...formData, locationType: type, villageId: id });
    setStep(3);
  };

  const submitReport = () => {
    // Mock submission
    setStep(4);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        {/* Demo Banner */}
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 mb-8 rounded shadow-sm">
          <p className="font-semibold text-sm">DEMO DATA: This is a prototype system. Reports submitted here will not reach authorities.</p>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">🚨 Report a Problem</h1>
          <p className="text-lg text-slate-600">Help protect your community by reporting environmental concerns</p>
        </div>

        {step < 4 && (
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1. What</span>
              <div className="w-8 h-1 bg-slate-200"><div className={`h-full bg-blue-600 ${step >= 2 ? 'w-full' : 'w-0'}`}></div></div>
              <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2. Where</span>
              <div className="w-8 h-1 bg-slate-200"><div className={`h-full bg-blue-600 ${step >= 3 ? 'w-full' : 'w-0'}`}></div></div>
              <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3. Details</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">What did you see?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: 'water', icon: Droplets, label: 'Water Problem', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { id: 'soil', icon: Sprout, label: 'Soil Problem', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { id: 'waste', icon: Factory, label: 'Waste Dumping', color: 'text-slate-500', bg: 'bg-slate-100' },
                  { id: 'pump', icon: Droplet, label: 'Hand Pump Issue', color: 'text-cyan-500', bg: 'bg-cyan-50' },
                  { id: 'crop', icon: Wheat, label: 'Crop/Vegetation', color: 'text-lime-600', bg: 'bg-lime-50' },
                  { id: 'other', icon: AlertTriangle, label: 'Other Issue', color: 'text-amber-500', bg: 'bg-amber-50' },
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => handleCategorySelect(item.id)}
                    className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-slate-50 transition-all min-h-[120px]"
                  >
                    <item.icon className={`w-12 h-12 mb-3 ${item.color} p-2 rounded-full ${item.bg}`} />
                    <span className="font-semibold text-slate-700 text-center">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Where is the problem?</h2>
              <div className="space-y-4">
                <button 
                  onClick={() => handleLocationSelect('gps')}
                  className="w-full flex items-center justify-center gap-3 p-5 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-semibold text-slate-700">📍 Use My Current Location</span>
                </button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                  <div className="relative flex justify-center"><span className="bg-white px-4 text-sm text-slate-500">OR</span></div>
                </div>

                <div className="p-5 border-2 border-slate-200 rounded-xl">
                  <label className="block font-semibold text-slate-700 mb-2">🏘️ Select a Village</label>
                  <select 
                    onChange={(e) => e.target.value && handleLocationSelect('village', e.target.value)}
                    className="w-full text-lg p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  >
                    <option value="">-- Choose location --</option>
                    {villages.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.hindiName})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800 underline">Back</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Add Evidence</h2>
              
              <div className="mb-6">
                <label className="block font-semibold text-slate-700 mb-2">Photo (Highly Recommended)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm font-medium text-slate-700 flex items-center justify-center gap-2">
                      <Camera className="w-4 h-4" /> Take Photo
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm font-medium text-slate-700 flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" /> Upload File
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-semibold text-slate-700 mb-2">Description (Optional)</label>
                <textarea 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32 bg-slate-50"
                  placeholder="Describe what you saw, any strange smells, colors, or health issues..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
                <button onClick={() => setStep(2)} className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Back</button>
                <button onClick={submitReport} className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors">
                  Submit Report
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Report Received</h2>
              <p className="text-lg text-slate-600 mb-6">Thank you for reporting. Your observation helps protect the community.</p>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 inline-block mb-8 w-full max-w-sm text-left">
                <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Reference Number</p>
                <p className="text-2xl font-mono font-bold text-slate-900 mb-4">AS-2026-{Math.floor(10000 + Math.random() * 90000)}</p>
                
                <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Status</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                  Under Review
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => { setStep(1); setFormData({category:'', locationType:'', villageId:'', description:'', photoPreview:''}) }} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                  Submit Another Report
                </button>
                <Link href="/dashboard" className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
