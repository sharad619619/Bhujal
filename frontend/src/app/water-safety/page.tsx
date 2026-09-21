'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { villages, waterSources } from '@/lib/data';
import { AlertTriangle, MapPin, CheckCircle, XCircle, HelpCircle, PhoneCall, Info } from 'lucide-react';
import Link from 'next/link';

export default function WaterSafetyPage() {
  const { t } = useTranslation();
  const [selectedVillageId, setSelectedVillageId] = useState('');

  const filteredSources = selectedVillageId 
    ? waterSources.filter(s => s.villageId === selectedVillageId)
    : [];

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'SAFE':
        return { bg: 'bg-green-600', text: 'text-white', label: '🟢 VERIFIED STATUS AVAILABLE' };
      case 'UNSAFE':
        return { bg: 'bg-red-600', text: 'text-white', label: '🔴 DO NOT USE FOR DRINKING' };
      default:
        return { bg: 'bg-amber-400', text: 'text-slate-900', label: '🟡 INFORMATION INSUFFICIENT' };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        {/* Demo Banner */}
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 mb-8 rounded shadow-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="font-semibold text-sm">DEMO DATA: The information presented here is for demonstration purposes only. Do not use for actual health or safety decisions.</p>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Is my water source safe?</h1>
          <p className="text-xl text-slate-600">Check the verified status of water sources in your area</p>
        </div>

        {/* Step 1: Select Village */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 max-w-xl mx-auto">
          <label htmlFor="village-select" className="block text-lg font-medium text-slate-700 mb-3">
            Step 1: Select your village
          </label>
          <select 
            id="village-select"
            value={selectedVillageId}
            onChange={(e) => setSelectedVillageId(e.target.value)}
            className="w-full text-lg p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
          >
            <option value="">-- Select a Village --</option>
            {villages.map(v => (
              <option key={v.id} value={v.id}>{v.name} ({v.hindiName})</option>
            ))}
          </select>
        </div>

        {/* Step 2: Water Sources Grid */}
        {selectedVillageId && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MapPin className="text-blue-600" /> 
              Water Sources in {villages.find(v => v.id === selectedVillageId)?.name}
            </h2>
            
            {filteredSources.length === 0 ? (
              <p className="text-slate-500 italic">No water sources tracked in this area currently.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSources.map(source => {
                  const statusInfo = getStatusDisplay(source.status);
                  const isOutdated = source.lastTestedDate ? (new Date().getTime() - new Date(source.lastTestedDate).getTime() > 90 * 24 * 60 * 60 * 1000) : false;
                  
                  return (
                    <div key={source.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                      <div className={`${statusInfo.bg} ${statusInfo.text} p-4 text-center font-bold text-lg tracking-wide`}>
                        {statusInfo.label}
                      </div>
                      
                      <div className="p-6 flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{source.name}</h3>
                            <p className="text-sm text-slate-500">ID: {source.id}</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {source.dataStatus || 'Verified'}
                          </span>
                        </div>

                        <div className="space-y-3 mb-6">
                          <p className="text-sm flex justify-between">
                            <span className="text-slate-600">Primary Contaminant:</span>
                            <span className="font-semibold text-slate-900">{source.contaminant || 'Unknown'}</span>
                          </p>
                          <p className="text-sm flex justify-between">
                            <span className="text-slate-600">Risk Level:</span>
                            <span className={`font-semibold ${source.riskLevel === 'HIGH' ? 'text-red-600' : 'text-amber-600'}`}>
                              {source.riskLevel || 'UNKNOWN'}
                            </span>
                          </p>
                          <p className="text-sm flex justify-between">
                            <span className="text-slate-600">Last Verified:</span>
                            <span className="font-medium text-slate-900">{source.lastTestedDate ? new Date(source.lastTestedDate).toLocaleDateString() : 'Recent'}</span>
                          </p>
                        </div>

                        {isOutdated && (
                          <div className="flex gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg mb-4 text-sm">
                            <Info className="w-5 h-5 flex-shrink-0" />
                            <p>Latest verified information is over 90 days old. Conditions may have changed.</p>
                          </div>
                        )}

                        <div className="border-t border-slate-100 pt-4 mb-4">
                          <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Usage Restrictions</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              {source.status === 'UNSAFE' ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                              <span>Drinking</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {source.status === 'UNSAFE' ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                              <span>Cooking</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <HelpCircle className="w-4 h-4 text-amber-500" />
                              <span>Bathing</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <HelpCircle className="w-4 h-4 text-amber-500" />
                              <span>Irrigation</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {source.status === 'UNSAFE' ? <XCircle className="w-4 h-4 text-red-500" /> : <HelpCircle className="w-4 h-4 text-amber-500" />}
                              <span>Livestock</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 border-t border-slate-100">
                        {source.status === 'UNSAFE' && (
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-slate-700 mb-1">Nearest Safe Alternative:</p>
                            <p className="text-sm text-blue-600 hover:underline cursor-pointer">Community RO Plant (400m away) ↗</p>
                          </div>
                        )}
                        <Link href="/reports/new" className="block w-full text-center py-2 px-4 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition-colors">
                          Report an Issue
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Emergency Info */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 mt-8">
          <div className="bg-red-100 p-4 rounded-full text-red-600">
            <PhoneCall className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Health Emergency?</h3>
            <p className="text-red-800">If you suspect immediate health effects from contaminated water, contact your nearest healthcare facility or local authorities immediately.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
