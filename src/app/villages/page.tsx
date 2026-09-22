'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { getDb, VillageRecord } from '@/lib/db/store';
import { 
  Users, 
  Droplets, 
  AlertTriangle, 
  School, 
  ArrowRight, 
  Search, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

export default function VillagesPage() {
  const { t } = useTranslation();
  const [villages, setVillages] = useState<VillageRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  const loadData = () => {
    const db = getDb();
    setVillages(db.getVillages());
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('bhujal_data_updated', handleUpdate);
    return () => window.removeEventListener('bhujal_data_updated', handleUpdate);
  }, []);

  const filteredVillages = villages.filter(v => {
    if (riskFilter !== 'All' && v.contaminationStatus !== riskFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = v.name.toLowerCase().includes(q);
      const matchHindi = v.hindiName?.toLowerCase().includes(q) || false;
      const matchBlock = v.block?.toLowerCase().includes(q) || false;
      const matchDistrict = v.district?.toLowerCase().includes(q) || false;
      if (!matchName && !matchHindi && !matchBlock && !matchDistrict) return false;
    }
    return true;
  });

  const totalPop = villages.reduce((acc, v) => acc + (v.population || 0), 0);
  const totalSources = villages.reduce((acc, v) => acc + (v.totalWaterSources || 0), 0);
  const totalAffectedSources = villages.reduce((acc, v) => acc + (v.affectedWaterSources || 0), 0);
  const highRiskCount = villages.filter(v => v.contaminationStatus === 'High').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f4fbf7] text-[#0c1f18] font-sans selection:bg-[#c3ebd8] selection:text-[#002116]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-6">
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#002116] font-bold">Communities Directory &amp; Digital Twins</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-[#ddf3e7] text-[#002116] font-bold border border-stone-200">
                Panchayat Registry
              </span>
              <span className="text-xs font-mono text-stone-500">
                Kanpur Nagar · Kanpur Dehat · Fatehpur
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#002116] tracking-tight">
              Community Profiles &amp; Digital Twins
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-1 max-w-2xl">
              Village-level environmental surveillance, drinking water safety status, and hyper-local groundwater monitoring networks.
            </p>
          </div>
        </div>

        {/* Regional KPI Summary Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-[11px] font-mono font-bold text-stone-500 uppercase block mb-1">MONITORED COMMUNITIES</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#002116]">{villages.length} Villages</div>
            <span className="text-[11px] font-mono text-stone-500">Across 3 districts</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-[11px] font-mono font-bold text-stone-500 uppercase block mb-1">TOTAL POPULATION</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#002116]">{totalPop.toLocaleString()}</div>
            <span className="text-[11px] font-mono text-stone-500">Census monitored</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-[11px] font-mono font-bold text-stone-500 uppercase block mb-1">MONITORED WATER POINTS</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#006492]">{totalSources} Borewells</div>
            <span className="text-[11px] font-mono text-stone-500">{totalAffectedSources} exceed WHO safe limits</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-[11px] font-mono font-bold text-stone-500 uppercase block mb-1">CRITICAL RISK CLUSTERS</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-red-700">{highRiskCount} Panchayats</div>
            <span className="text-[11px] font-mono text-red-600 font-bold">Priority remediation action</span>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search community by name, block, or district (e.g. Khanchandpur, Sarbankhera)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#2E8B68] focus:bg-white font-mono text-stone-800 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-stone-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Risk Level:</span>
            </div>
            
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="p-2 border border-stone-200 bg-stone-50 rounded-xl focus:ring-2 focus:ring-[#2E8B68] text-xs font-mono text-stone-800 outline-none"
            >
              <option value="All">All Risk Profiles ({villages.length})</option>
              <option value="High">High Contamination Risk</option>
              <option value="Moderate">Moderate Risk</option>
              <option value="Safe">Safe / Low Risk</option>
            </select>
          </div>
        </div>

        {/* Village Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVillages.map(village => {
            const isHigh = village.contaminationStatus === 'High';
            const isMod = village.contaminationStatus === 'Moderate';
            return (
              <Link key={village.id} href={`/villages/${village.id}`} className="group block">
                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md hover:border-[#2E8B68]/60 transition-all h-full flex flex-col justify-between">
                  
                  {/* Status indicator bar */}
                  <div className={`h-2 w-full ${isHigh ? 'bg-red-500' : isMod ? 'bg-amber-500' : 'bg-[#2E8B68]'}`}></div>
                  
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-[#002116] group-hover:text-[#2E8B68] transition-colors">
                          {village.name}
                        </h2>
                        <p className="text-stone-500 font-serif text-base">{village.hindiName}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                        {village.block}, {village.district}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-[#f2f8f5] p-3 rounded-xl border border-stone-200">
                        <div className="flex items-center gap-1.5 text-stone-500 mb-1 text-xs font-mono">
                          <Users className="w-3.5 h-3.5 text-[#2E8B68]" /> Population
                        </div>
                        <div className="font-serif font-bold text-lg text-[#002116]">{village.population.toLocaleString()}</div>
                      </div>
                      <div className="bg-[#f2f8f5] p-3 rounded-xl border border-stone-200">
                        <div className="flex items-center gap-1.5 text-stone-500 mb-1 text-xs font-mono">
                          <Droplets className="w-3.5 h-3.5 text-[#006492]" /> Water Points
                        </div>
                        <div className="font-serif font-bold text-lg text-[#002116]">{village.totalWaterSources}</div>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs font-mono">
                      <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                        <span className="text-stone-600 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Non-Compliant Sources
                        </span>
                        <span className="font-bold text-red-700">{village.affectedWaterSources} / {village.totalWaterSources}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                        <span className="text-stone-600 flex items-center gap-1.5">
                          <School className="w-3.5 h-3.5 text-[#006492]" /> Schools / Anganwadis
                        </span>
                        <span className="font-bold text-stone-900">{village.schools || 2}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-stone-600">Risk Assessment</span>
                        <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] border ${
                          isHigh 
                            ? 'bg-red-50 text-red-800 border-red-200' 
                            : isMod 
                              ? 'bg-amber-50 text-amber-800 border-amber-200' 
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {village.contaminationStatus} Risk
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f2f8f5] p-4 border-t border-stone-100 flex justify-between items-center group-hover:bg-emerald-50/50 transition-colors">
                    <span className="text-xs font-mono text-stone-500">
                      Coordinates: {(village.coordinates?.lat ?? (village.coordinates as any)?.[0] ?? 26.465).toFixed(3)}°N, {(village.coordinates?.lon ?? (village.coordinates as any)?.[1] ?? 80.342).toFixed(3)}°E
                    </span>
                    <span className="text-[#006492] group-hover:text-[#2E8B68] flex items-center gap-1 text-xs font-mono font-bold transition-colors">
                      Digital Twin <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredVillages.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300">
            <MapPin className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <p className="text-stone-700 font-serif text-lg font-bold">No communities found</p>
            <p className="text-stone-500 text-xs font-mono mt-1">Try adjusting your search query or reset risk filters.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

