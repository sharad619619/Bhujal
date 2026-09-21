'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AlertTriangle, Settings2, ChevronDown, ChevronUp, MapPin } from 'lucide-react';

const DemoBanner = () => (
  <div className="bg-amber-100 text-amber-800 p-2 text-center text-sm font-medium w-full flex items-center justify-center gap-2">
    <AlertTriangle className="h-4 w-4" />
    <span>DEMO DATA - Priority scores are prototype estimates for decision support only.</span>
  </div>
);

type Village = {
  id: string; name: string; baseScore: number; priority: 'Very High' | 'High' | 'Medium' | 'Low';
  stats: { population: number; contamination: string; schools: number; agriExposure: string; trend: string; altWater: string; };
  factors: { popExposure: number; contaminationSeverity: number; gwExposure: number; sensitiveLocations: number; agriExposure: number; };
};

const initialVillages: Village[] = [
  { id: 'v1', name: 'Khanchandpur', baseScore: 92, priority: 'Very High', stats: { population: 8240, contamination: '0.18 mg/L', schools: 3, agriExposure: 'High', trend: 'Increasing', altWater: 'Poor' }, factors: { popExposure: 95, contaminationSeverity: 98, gwExposure: 85, sensitiveLocations: 90, agriExposure: 70 } },
  { id: 'v2', name: 'Panki', baseScore: 78, priority: 'High', stats: { population: 15400, contamination: '0.09 mg/L', schools: 6, agriExposure: 'Low', trend: 'Stable', altWater: 'Partial' }, factors: { popExposure: 88, contaminationSeverity: 75, gwExposure: 60, sensitiveLocations: 85, agriExposure: 30 } },
  { id: 'v3', name: 'Rania', baseScore: 71, priority: 'High', stats: { population: 4300, contamination: '0.12 mg/L', schools: 1, agriExposure: 'High', trend: 'Stable', altWater: 'None' }, factors: { popExposure: 60, contaminationSeverity: 85, gwExposure: 80, sensitiveLocations: 40, agriExposure: 85 } },
  { id: 'v4', name: 'Rooma', baseScore: 54, priority: 'Medium', stats: { population: 6100, contamination: '0.06 mg/L', schools: 2, agriExposure: 'Medium', trend: 'Decreasing', altWater: 'Good' }, factors: { popExposure: 65, contaminationSeverity: 55, gwExposure: 50, sensitiveLocations: 60, agriExposure: 50 } },
  { id: 'v5', name: 'Sachendi', baseScore: 35, priority: 'Low', stats: { population: 9200, contamination: '0.03 mg/L', schools: 4, agriExposure: 'Low', trend: 'Stable', altWater: 'Good' }, factors: { popExposure: 75, contaminationSeverity: 20, gwExposure: 30, sensitiveLocations: 55, agriExposure: 20 } }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Very High': return 'bg-red-100 text-red-800 border-red-200';
    case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getMapDotColor = (priority: string) => {
  switch (priority) {
    case 'Very High': return 'bg-red-500';
    case 'High': return 'bg-orange-500';
    case 'Medium': return 'bg-yellow-500';
    case 'Low': return 'bg-green-500';
    default: return 'bg-slate-500';
  }
};

export default function PrioritizationPage() {
  const [villages, setVillages] = useState(initialVillages);
  const [expandedId, setExpandedId] = useState<string | null>('v1');
  const [weights, setWeights] = useState({ popExposure: 25, contaminationSeverity: 30, gwExposure: 20, sensitiveLocations: 15, agriExposure: 10 });

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  const handleRecalculate = () => {
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) return;
    const newVillages = villages.map(v => {
      const score = (
        (v.factors.popExposure * (weights.popExposure / totalWeight)) +
        (v.factors.contaminationSeverity * (weights.contaminationSeverity / totalWeight)) +
        (v.factors.gwExposure * (weights.gwExposure / totalWeight)) +
        (v.factors.sensitiveLocations * (weights.sensitiveLocations / totalWeight)) +
        (v.factors.agriExposure * (weights.agriExposure / totalWeight))
      );
      const newScore = Math.round(score);
      let newPriority: Village['priority'] = 'Low';
      if (newScore > 85) newPriority = 'Very High';
      else if (newScore > 65) newPriority = 'High';
      else if (newScore > 45) newPriority = 'Medium';
      return { ...v, baseScore: newScore, priority: newPriority };
    });
    newVillages.sort((a, b) => b.baseScore - a.baseScore);
    setVillages(newVillages);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <DemoBanner />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Intervention Prioritization</h1>
          <p className="text-lg text-slate-600">Prototype Intervention Priority Index</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/5 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative h-[400px] flex items-center justify-center bg-slate-100">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
              <div className="relative w-full h-full p-8">
                <span className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded text-xs font-medium text-slate-600 shadow-sm">Kanpur Nagar District Overview</span>
                
                <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full shadow-md border-2 border-white ${getMapDotColor(villages.find(v=>v.name==='Khanchandpur')?.priority || 'High')}`}></div>
                  <span className="text-xs font-bold mt-1 bg-white/70 px-1 rounded">Khanchandpur</span>
                </div>
                <div className="absolute top-1/2 left-2/3 flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full shadow-md border-2 border-white ${getMapDotColor(villages.find(v=>v.name==='Panki')?.priority || 'High')}`}></div>
                  <span className="text-xs font-bold mt-1 bg-white/70 px-1 rounded">Panki</span>
                </div>
                <div className="absolute bottom-1/4 left-1/3 flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full shadow-md border-2 border-white ${getMapDotColor(villages.find(v=>v.name==='Rania')?.priority || 'High')}`}></div>
                  <span className="text-xs font-bold mt-1 bg-white/70 px-1 rounded">Rania</span>
                </div>
                <div className="absolute top-2/3 right-1/4 flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full shadow-md border-2 border-white ${getMapDotColor(villages.find(v=>v.name==='Rooma')?.priority || 'Medium')}`}></div>
                  <span className="text-xs font-bold mt-1 bg-white/70 px-1 rounded">Rooma</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings2 className="h-5 w-5 text-slate-500" />
                <h2 className="text-lg font-bold text-slate-900">Modify Factor Weights</h2>
              </div>
              <div className="space-y-4">
                {Object.entries(weights).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-4">
                    <label className="w-1/3 text-sm font-medium text-slate-700 capitalize truncate">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <input type="range" min="0" max="100" value={value} onChange={(e) => handleWeightChange(key as keyof typeof weights, parseInt(e.target.value))} className="w-1/2 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    <span className="w-1/6 text-sm text-right font-mono text-slate-500">{value}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                <p className="text-xs text-slate-400 max-w-[60%]">Modified weights affect the prototype priority index only.</p>
                <button onClick={handleRecalculate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Recalculate</button>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/5 flex flex-col gap-4">
            <h3 className="font-bold text-slate-800 mb-2 flex justify-between items-end">
              <span>Priority Ranking</span><span className="text-sm font-normal text-slate-500">Based on Index Score</span>
            </h3>

            {villages.map((village, idx) => (
              <div key={village.id} className={`bg-white rounded-xl shadow-sm border ${expandedId === village.id ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'} overflow-hidden transition-all`}>
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => setExpandedId(expandedId === village.id ? null : village.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">#{idx + 1}</div>
                    <div>
                      <h4 className="font-bold text-slate-900">{village.name}</h4>
                      <div className="flex gap-2 items-center mt-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(village.priority)}`}>{village.priority}</span>
                        <span className="text-xs font-mono text-slate-500">Score: {village.baseScore}</span>
                      </div>
                    </div>
                  </div>
                  {expandedId === village.id ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </div>

                {expandedId === village.id && (
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6 text-sm">
                      <div><span className="block text-slate-500 text-xs">Affected Pop.</span><span className="font-medium text-slate-900">{village.stats.population.toLocaleString()}</span></div>
                      <div><span className="block text-slate-500 text-xs">Contamination</span><span className="font-medium text-red-600">{village.stats.contamination}</span></div>
                      <div><span className="block text-slate-500 text-xs">Agri Exposure</span><span className="font-medium text-slate-900">{village.stats.agriExposure}</span></div>
                      <div><span className="block text-slate-500 text-xs">Alt. Water</span><span className="font-medium text-slate-900">{village.stats.altWater}</span></div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Why is this prioritized?</p>
                      {[
                        { label: 'Pop. Exposure', val: village.factors.popExposure, w: weights.popExposure },
                        { label: 'Severity', val: village.factors.contaminationSeverity, w: weights.contaminationSeverity },
                        { label: 'GW Exposure', val: village.factors.gwExposure, w: weights.gwExposure },
                        { label: 'Sens. Locs', val: village.factors.sensitiveLocations, w: weights.sensitiveLocations },
                        { label: 'Agri Risk', val: village.factors.agriExposure, w: weights.agriExposure }
                      ].map(f => (
                        <div key={f.label} className="text-xs">
                          <div className="flex justify-between mb-1"><span className="text-slate-600">{f.label} (W: {f.w}%)</span><span className="font-mono text-slate-500">{f.val}/100</span></div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${f.val}%` }}></div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
