'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { remediationProjects } from '@/lib/data';
import { Shield, Droplets, Box, Waves, Layers, Leaf, Activity, ArrowRight, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DemoBanner = () => (
  <div className="bg-amber-100 text-amber-800 p-2 text-center text-sm font-medium w-full flex items-center justify-center gap-2">
    <AlertTriangle className="h-4 w-4" />
    <span>DEMO DATA - Not for real-world environmental action. Values are synthetic.</span>
  </div>
);

const BeforeAfterSlider = () => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setPosition(newPosition);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto h-64 sm:h-80 bg-gray-200 rounded-xl overflow-hidden cursor-ew-resize select-none border border-slate-200"
         ref={containerRef}
         onMouseMove={handleMouseMove}
         onTouchMove={handleTouchMove}
         onClick={(e) => handleMove(e.clientX)}>
      
      <div className="absolute inset-0 bg-amber-50/80 p-8 flex flex-col justify-center items-end text-right">
        <div className="bg-white/90 p-4 rounded-lg shadow-sm border border-amber-200 max-w-xs">
          <h4 className="font-bold text-amber-900 text-lg mb-2">Before Intervention</h4>
          <p className="text-sm text-slate-600">Chromium (Cr): <span className="font-bold text-red-600">0.18 mg/L</span></p>
          <p className="text-sm text-slate-600">Groundwater depth: <span className="font-medium">12m</span></p>
        </div>
      </div>

      <div className="absolute inset-0 bg-green-50/90 p-8 flex flex-col justify-center items-start"
           style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}>
        <div className="bg-white/90 p-4 rounded-lg shadow-sm border border-green-200 max-w-xs">
          <h4 className="font-bold text-green-900 text-lg mb-2">After 180 Days</h4>
          <p className="text-sm text-slate-600">Chromium (Cr): <span className="font-bold text-green-600">0.04 mg/L</span></p>
          <p className="text-sm text-slate-600">Groundwater depth: <span className="font-medium">11.5m</span></p>
          <div className="mt-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
            -78% reduction
          </div>
        </div>
      </div>

      <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10"
           style={{ left: `${position}%`, transform: 'translateX(-50%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-200">
          <div className="flex gap-1">
            <div className="w-0.5 h-3 bg-slate-400 rounded-full"></div>
            <div className="w-0.5 h-3 bg-slate-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RemediationPage() {
  const chartData = [
    { day: -30, cr: 0.18 },
    { day: 0, cr: 0.18 },
    { day: 30, cr: 0.12 },
    { day: 90, cr: 0.08 },
    { day: 180, cr: 0.04 },
    { day: 365, cr: 0.03 },
  ];

  const interventions = [
    { id: 1, title: 'Immediate Protection', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-100', desc: 'Provide immediate alternative safe water sources for highly affected households.' },
    { id: 2, title: 'Alternative Water Supply', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-100', desc: 'Establish long-term piped water from verified safe sources.' },
    { id: 3, title: 'Source Containment', icon: Box, color: 'text-amber-600', bg: 'bg-amber-100', desc: 'Isolate point sources of contamination to prevent further leaching.' },
    { id: 4, title: 'Groundwater Remediation', icon: Waves, color: 'text-green-600', bg: 'bg-green-100', desc: 'In-situ or ex-situ treatment of contaminated aquifers.' },
    { id: 5, title: 'Soil Remediation', icon: Layers, color: 'text-orange-700', bg: 'bg-orange-100', desc: 'Removal or treatment of heavily contaminated topsoil.' },
    { id: 6, title: 'Phytoremediation', icon: Leaf, color: 'text-green-600', bg: 'bg-green-100', desc: 'Use of hyperaccumulator plants to slowly extract heavy metals.' },
    { id: 7, title: 'Monitoring', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100', desc: 'Continuous or periodic sampling to track natural attenuation.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <DemoBanner />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Remediation Projects</h1>
          <p className="text-lg text-slate-600">Track interventions and verify outcomes</p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Active Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(remediationProjects || []).map((project: any) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-slate-900">{project.name || 'Project Name'}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize
                    ${project.status === 'proposed' ? 'bg-blue-100 text-blue-800' : 
                      project.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 
                      project.status === 'monitoring' ? 'bg-purple-100 text-purple-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {project.status?.replace('_', ' ') || 'Unknown'}
                  </span>
                </div>
                <div className="text-sm text-slate-600 mb-4 flex-1">
                  <p className="mb-1"><span className="font-medium text-slate-700">Village:</span> {project.location || 'Unknown'}</p>
                  <p className="mb-1"><span className="font-medium text-slate-700">Type:</span> {project.type || 'Intervention'}</p>
                  <p className="mb-3"><span className="font-medium text-slate-700">Organization:</span> {project.responsibleOrg || 'Unknown'}</p>
                  <p className="text-slate-500">{project.description}</p>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{project.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full transition-all duration-500" style={{ width: `${project.progress || 0}%` }}></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-right">
                    Expected completion: {project.endDate || 'TBD'}
                  </p>
                </div>
              </div>
            ))}
            {(!remediationProjects || remediationProjects.length === 0) && (
              <div className="col-span-full p-8 text-center text-slate-500 bg-slate-100 rounded-xl border border-dashed border-slate-300">
                No active projects found in demo data.
              </div>
            )}
          </div>
        </section>

        <section className="mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Remediation Outcomes</h2>
          <p className="text-sm text-slate-500 mb-8 italic">Observed changes in groundwater chromium levels over time for Pilot Site A.</p>
          
          <BeforeAfterSlider />

          <div className="mt-10 max-w-3xl mx-auto h-64">
            <h4 className="text-sm font-bold text-slate-700 mb-4 text-center">Observed Change: Chromium Concentration (mg/L)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" label={{ value: 'Days Since Intervention', position: 'insideBottomRight', offset: -10 }} className="text-xs" />
                <YAxis label={{ value: 'Cr (mg/L)', angle: -90, position: 'insideLeft' }} className="text-xs" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`${value} mg/L`, 'Measured Cr']}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Line type="monotone" dataKey="cr" stroke="#166534" strokeWidth={3} dot={{ r: 4, fill: '#166534' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Plan an Intervention</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {interventions.map((inv) => (
              <div key={inv.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className={`${inv.bg} ${inv.color} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                  <inv.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{inv.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{inv.desc}</p>
                <div className="text-xs text-slate-400 border-t border-slate-100 pt-3">
                  Potential intervention for professional assessment
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl shadow-lg p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Nature-Based Remediation Planner</h2>
              <p className="text-green-100 text-sm opacity-90 max-w-2xl">
                Plant-based remediation effectiveness depends on site conditions and requires field validation. 
                This demo suggests hyperaccumulators based on site parameters.
              </p>
            </div>
            <div className="bg-green-950/40 px-4 py-2 rounded-lg border border-green-700/50">
              <p className="text-xs text-green-200 uppercase tracking-wider font-semibold mb-1">Site Parameters (Demo)</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-mono">
                <span>pH: 7.2</span>
                <span>Moisture: 35%</span>
                <span>Cr: 85 mg/kg</span>
                <span>Depth: 14m</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-green-50">Vetiveria zizanioides</h3>
                <span className="bg-green-500/20 text-green-200 text-xs px-2 py-1 rounded-full font-medium border border-green-500/30">
                  Zone A Candidate
                </span>
              </div>
              <p className="text-green-100 text-sm mb-4">Common name: Vetiver grass</p>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="block text-green-300/70 text-xs uppercase mb-1">Primary Reason</span>
                  <p className="text-white">High documented chromium uptake under specified alkaline soil conditions.</p>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-3">
                  <div>
                    <span className="block text-green-300/70 text-xs uppercase mb-1">Confidence</span>
                    <span className="text-yellow-400 font-medium">Medium</span>
                  </div>
                  <a href="#" className="text-green-300 hover:text-white text-xs flex items-center gap-1 transition-colors">
                    Research Ref <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-green-50">Brassica juncea</h3>
                <span className="bg-green-500/20 text-green-200 text-xs px-2 py-1 rounded-full font-medium border border-green-500/30">
                  Zone B Candidate
                </span>
              </div>
              <p className="text-green-100 text-sm mb-4">Common name: Indian mustard</p>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="block text-green-300/70 text-xs uppercase mb-1">Primary Reason</span>
                  <p className="text-white">Documented Cr(VI) accumulation capability in root and shoot tissues.</p>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-3">
                  <div>
                    <span className="block text-green-300/70 text-xs uppercase mb-1">Confidence</span>
                    <span className="text-orange-400 font-medium">Medium-Low</span>
                  </div>
                  <a href="#" className="text-green-300 hover:text-white text-xs flex items-center gap-1 transition-colors">
                    Research Ref <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
