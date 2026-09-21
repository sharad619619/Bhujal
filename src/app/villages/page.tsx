'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { villages } from '@/lib/data';
import { Users, Droplets, AlertTriangle, School, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function VillagesPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 mb-8 rounded shadow-sm">
          <p className="font-semibold text-sm">DEMO DATA: The village statistics and statuses below are simulated models based on region-wide reports.</p>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Communities</h1>
          <p className="text-lg text-slate-600">Village profiles and environmental status monitoring</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {villages.map(village => (
            <Link key={village.id} href={`/villages/${village.id}`} className="group block">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all h-full flex flex-col">
                
                {/* Status bar top */}
                <div className={`h-2 w-full ${village.contaminationStatus === 'High' ? 'bg-red-500' : village.contaminationStatus === 'Moderate' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{village.name}</h2>
                      <p className="text-slate-500 font-medium">{village.hindiName}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      {village.block}, {village.district}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 text-sm">
                        <Users className="w-4 h-4" /> Population
                      </div>
                      <div className="font-bold text-slate-900">{village.population.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1 text-sm">
                        <Droplets className="w-4 h-4" /> Water Sources
                      </div>
                      <div className="font-bold text-slate-900">{village.totalWaterSources}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                      <span className="text-slate-600 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Affected Sources</span>
                      <span className="font-bold text-slate-900">{village.affectedWaterSources} / {village.totalWaterSources}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                      <span className="text-slate-600 flex items-center gap-2"><School className="w-4 h-4 text-blue-500" /> Schools</span>
                      <span className="font-bold text-slate-900">{village.schools}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Risk Assessment</span>
                      <span className={`font-bold ${village.contaminationStatus === 'High' ? 'text-red-600' : village.contaminationStatus === 'Moderate' ? 'text-amber-600' : 'text-green-600'}`}>
                        {village.contaminationStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center group-hover:bg-blue-50 transition-colors">
                  <span className="text-xs text-slate-500">Last updated: {village.lastUpdated ? new Date(village.lastUpdated).toLocaleDateString() : 'Recent'}</span>
                  <span className="text-blue-600 flex items-center gap-1 text-sm font-semibold">
                    View Profile <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
