'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getDb, RemediationProjectRecord } from '@/lib/db/store';
import { 
  Shield, 
  Droplets, 
  Box, 
  Waves, 
  Layers, 
  Leaf, 
  Activity, 
  ArrowRight, 
  Sliders, 
  CheckCircle2, 
  Sparkles, 
  FlaskConical, 
  Clock, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

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
    <div 
      className="relative w-full max-w-3xl mx-auto h-64 sm:h-80 bg-stone-100 rounded-2xl overflow-hidden cursor-ew-resize select-none border border-stone-200 shadow-sm"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={(e) => handleMove(e.clientX)}
    >
      <div className="absolute inset-0 bg-red-50/70 p-8 flex flex-col justify-center items-end text-right">
        <div className="bg-white/95 backdrop-blur p-4 rounded-xl shadow-sm border border-red-200 max-w-xs">
          <span className="text-[10px] font-mono uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">Baseline Prior to Intervention</span>
          <h4 className="font-serif font-bold text-[#002116] text-lg mt-2 mb-1">Untreated Groundwater</h4>
          <p className="text-xs font-mono text-stone-600">Chromium (Cr): <strong className="text-red-600 font-bold">0.18 mg/L</strong> (3.6x WHO)</p>
          <p className="text-xs font-mono text-stone-500 mt-1">Water depth: 12.0 meters</p>
        </div>
      </div>

      <div 
        className="absolute inset-0 bg-emerald-50/90 p-8 flex flex-col justify-center items-start"
        style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
      >
        <div className="bg-white/95 backdrop-blur p-4 rounded-xl shadow-sm border border-emerald-200 max-w-xs">
          <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Post-Remediation (+180 Days)</span>
          <h4 className="font-serif font-bold text-[#002116] text-lg mt-2 mb-1">Permeable Reactive Barrier</h4>
          <p className="text-xs font-mono text-stone-600">Chromium (Cr): <strong className="text-emerald-700 font-bold">0.038 mg/L</strong> (Safe)</p>
          <p className="text-xs font-mono text-stone-500 mt-1">Reduction rate: <strong className="text-emerald-700 font-bold">-79%</strong></p>
        </div>
      </div>

      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-stone-200">
          <div className="flex gap-1">
            <div className="w-0.5 h-3 bg-stone-400 rounded-full"></div>
            <div className="w-0.5 h-3 bg-stone-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RemediationPage() {
  const [projects, setProjects] = useState<RemediationProjectRecord[]>([]);

  // Nature-Based Remediation interactive inputs
  const [ph, setPh] = useState(7.2);
  const [moisture, setMoisture] = useState(35);
  const [crConcentration, setCrConcentration] = useState(85);
  const [depth, setDepth] = useState(14);
  const [selectedVillage, setSelectedVillage] = useState('Khanchandpur');

  useEffect(() => {
    const db = getDb();
    setProjects(db.getRemediationProjects());
  }, []);

  // Compute live recommendation calling store function
  const recommendation = useMemo(() => {
    const db = getDb();
    return db.calculateNatureRemediation(ph, moisture, crConcentration, depth);
  }, [ph, moisture, crConcentration, depth]);

  const chartData = [
    { day: -30, cr: 0.18, whoLimit: 0.05 },
    { day: 0, cr: 0.18, whoLimit: 0.05 },
    { day: 30, cr: 0.12, whoLimit: 0.05 },
    { day: 90, cr: 0.08, whoLimit: 0.05 },
    { day: 180, cr: 0.038, whoLimit: 0.05 },
    { day: 365, cr: 0.024, whoLimit: 0.05 },
  ];

  const interventions = [
    { id: 1, title: 'Safe Deep Aquifer Supply', icon: Droplets, color: 'text-[#006492]', bg: 'bg-[#006492]/10', desc: 'Deploy deep artesian ring wells into lower unconfined aquifer layers shielded by confining clay strata.' },
    { id: 2, title: 'Permeable Reactive Barriers (PRB)', icon: Box, color: 'text-amber-700', bg: 'bg-amber-100', desc: 'Subsurface trenches filled with zero-valent iron (ZVI) that reduce mobile Cr(VI) to insoluble Cr(III).' },
    { id: 3, title: 'Phytoremediation Buffer Belts', icon: Leaf, color: 'text-[#2E8B68]', bg: 'bg-emerald-100', desc: 'High-density planting of Vetiver grass and hyperaccumulators along tannery effluent canals and drain corridors.' },
    { id: 4, title: 'In-Situ Bio-Augmentation', icon: Waves, color: 'text-indigo-600', bg: 'bg-indigo-100', desc: 'Injection of native bacterial electron donors to catalyze biological hexavalent chromium reduction in groundwater.' },
    { id: 5, title: 'Vadose Zone Soil Capping', icon: Layers, color: 'text-orange-700', bg: 'bg-orange-100', desc: 'Engineered multi-layer geosynthetic capping over legacy tannery sludge dumps to stop monsoon rainwater leaching.' },
    { id: 6, title: 'Sentinel Telemetry Monitoring', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100', desc: 'Continuous multi-parameter sensor arrays measuring ORP, conductivity, and dissolved hexavalent chromium.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f4fbf7] text-[#0c1f18] font-sans selection:bg-[#c3ebd8] selection:text-[#002116]">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#002116] font-bold">Environmental Remediation Engineering</span>
        </div>

        {/* Header */}
        <div className="border-b border-stone-200 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-[#ddf3e7] text-[#002116] font-bold border border-stone-200">
              Intervention Architecture
            </span>
            <span className="text-xs font-mono text-stone-500">
              Groundwater &amp; Soil Decontamination Protocols
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#002116] tracking-tight">
            Remediation Projects &amp; Nature-Based Planning
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-1 max-w-3xl">
            Scientific interventions across Kanpur Nagar and Kanpur Dehat — tracking verified reduction rates, permeable reactive barrier deployments, and plant-based phytoremediation bio-extraction.
          </p>
        </div>

        {/* Section 1: Interactive Nature-Based Remediation Calculator */}
        <section className="bg-gradient-to-br from-[#002116] via-[#12372A] to-[#003b29] rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 text-white space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider">
                  Interactive Hydro-Ecological Prescription Engine
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                Nature-Based Phytoremediation Calculator
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Adjust site hydrogeological parameters below. The scientific engine selects optimal hyperaccumulating species, calculates bio-concentration factors, and models chromium attenuation half-life.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-xs font-mono flex items-center gap-4">
              <div>
                <span className="text-stone-300 block text-[10px]">FEASIBILITY</span>
                <strong className="text-emerald-300 text-base">{recommendation.feasibilityScore}/100</strong>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div>
                <span className="text-stone-300 block text-[10px]">EST. HALF-LIFE</span>
                <strong className="text-white text-base">{recommendation.halfLifeMonths} Mo.</strong>
              </div>
            </div>
          </div>

          {/* Interactive Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-xs font-mono">
            {/* Soil pH Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-stone-300">Soil pH</span>
                <strong className="text-emerald-300 text-sm font-bold">{ph.toFixed(1)}</strong>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.5"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#2E8B68]"
              />
              <span className="text-[10px] text-stone-400 block">
                {ph > 7.5 ? 'Alkaline (tannery lime sludge)' : ph < 6.5 ? 'Acidic vadose' : 'Optimal neutral'}
              </span>
            </div>

            {/* Soil Moisture Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-stone-300">Moisture Content</span>
                <strong className="text-emerald-300 text-sm font-bold">{moisture}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="1"
                value={moisture}
                onChange={(e) => setMoisture(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#2E8B68]"
              />
              <span className="text-[10px] text-stone-400 block">
                {moisture > 40 ? 'Saturated canal margin' : 'Upland alluvial vadose'}
              </span>
            </div>

            {/* Cr Concentration Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-stone-300">Cr(VI) Concentration</span>
                <strong className="text-amber-300 text-sm font-bold">{crConcentration} mg/kg</strong>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={crConcentration}
                onChange={(e) => setCrConcentration(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-[10px] text-stone-400 block">
                {crConcentration > 100 ? 'Severe industrial hotspot' : 'Moderate dispersion zone'}
              </span>
            </div>

            {/* Depth Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-stone-300">Water Table Depth</span>
                <strong className="text-sky-300 text-sm font-bold">{depth} meters</strong>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={depth}
                onChange={(e) => setDepth(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <span className="text-[10px] text-stone-400 block">
                {depth <= 6 ? 'Direct root zone access' : 'Rhizofiltration via interception well'}
              </span>
            </div>
          </div>

          {/* Dynamic Plant Prescription Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-white">Recommended Hyperaccumulator Species</h3>
              <span className="text-xs font-mono text-emerald-300">
                Match Confidence: {recommendation.confidence}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendation.candidates.map((candidate, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    {(candidate as any).photoUrl && (
                      <div className="w-full h-44 rounded-xl overflow-hidden relative border border-white/20">
                        <img 
                          src={(candidate as any).photoUrl} 
                          alt={candidate.scientificName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                          <span className="text-[11px] font-mono text-emerald-200">
                            Botanical Specimen: {candidate.scientificName}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-serif font-bold text-xl text-emerald-100">{candidate.scientificName}</h4>
                        <p className="text-xs font-mono text-stone-300">Common: {candidate.commonName}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                        Zone {String.fromCharCode(65 + idx)} Candidate
                      </span>
                    </div>

                    <p className="text-xs text-stone-200 leading-relaxed">
                      {candidate.mechanism}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs font-mono">
                      <div>
                        <span className="text-stone-400 block text-[10px]">BIO-CONCENTRATION FACTOR</span>
                        <strong className="text-white text-sm">{candidate.bcf}x</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px]">ROOT PENETRATION</span>
                        <strong className="text-white text-sm">{candidate.rootDepth}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/25 p-3 rounded-xl text-[11px] font-mono text-emerald-200 border border-emerald-400/20">
                    <strong className="text-white block mb-0.5">Agronomic Protocol:</strong>
                    {candidate.care}
                  </div>
                </div>
              ))}
            </div>

            {/* Scientific Citations & Regulatory Disclaimer */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-stone-300">
                <span className="font-bold text-emerald-300 uppercase">Scientific Research Citations:</span>
                <span className="text-[11px] text-stone-400">CSIR-NBRI Lucknow · IIT Kanpur Env Engineering · CPCB In-Situ Protocols</span>
              </div>
              <ul className="text-xs text-stone-300 space-y-1 font-mono list-disc list-inside">
                {recommendation.scientificCitations.map((cite, cIdx) => (
                  <li key={cIdx}>{cite}</li>
                ))}
              </ul>
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 text-[11px] text-stone-300 font-mono">
                <strong className="text-amber-300 block mb-0.5">Field Validation Protocol:</strong>
                {recommendation.disclaimer}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Active Projects Registry */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-mono text-[#006492] font-bold uppercase">DEPLOYED ENGINEERING</span>
              <h2 className="text-2xl font-serif font-bold text-[#002116]">Active Remediation Deployments</h2>
            </div>
            <span className="text-xs font-mono text-stone-500">{projects.length} field operations tracked</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col justify-between hover:shadow-md hover:border-[#2E8B68]/40 transition-all">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif font-bold text-lg text-[#002116] leading-snug">{project.name}</h3>
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                      project.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : project.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}>
                      {(project.status || 'proposed').replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-mono text-stone-600">
                    <p><span className="text-stone-400">Village:</span> <strong className="text-stone-800">{project.location}</strong></p>
                    <p><span className="text-stone-400">Type:</span> {project.type}</p>
                    <p><span className="text-stone-400">Agency:</span> {project.responsibleOrg}</p>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
                    {project.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-stone-100 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stone-500">Execution Progress</span>
                    <strong className="text-[#002116]">{project.progress}%</strong>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div 
                      className="bg-[#2E8B68] h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] font-mono text-stone-400 text-right">
                    Expected Completion: {project.endDate || '2026 Q3'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Remediation Outcomes & Time-Series Analytics */}
        <section className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-8">
          <div>
            <span className="text-xs font-mono text-[#2E8B68] font-bold uppercase">EMPIRICAL VALIDATION</span>
            <h2 className="text-2xl font-serif font-bold text-[#002116]">Subsurface Concentration Outcomes</h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Field observations tracking attenuation of hexavalent chromium following zero-valent iron barrier insertion at Pilot Site HP-012.
            </p>
          </div>

          <BeforeAfterSlider />

          <div className="pt-6">
            <h4 className="font-serif font-bold text-base text-[#002116] mb-4 text-center">
              Decadal Attenuation Curve: Hexavalent Chromium (mg/L)
            </h4>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" label={{ value: 'Days Post Intervention', position: 'insideBottomRight', offset: -10 }} className="text-[11px] font-mono" />
                  <YAxis label={{ value: 'Cr (mg/L)', angle: -90, position: 'insideLeft' }} className="text-[11px] font-mono" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontFamily: 'monospace', fontSize: '12px' }}
                    formatter={(value: any, name: any) => [
                      `${value} mg/L`, 
                      name === 'cr' ? 'Observed Cr(VI)' : 'WHO Safety Limit'
                    ]}
                    labelFormatter={(label) => `Day ${label}`}
                  />
                  <Line type="monotone" dataKey="whoLimit" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="whoLimit" />
                  <Line type="monotone" dataKey="cr" stroke="#15803d" strokeWidth={3} dot={{ r: 5, fill: '#15803d' }} activeDot={{ r: 7 }} name="cr" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-xs font-mono mt-3">
              <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <span className="w-3 h-3 rounded-full bg-emerald-700"></span> Observed Plume Concentration
              </span>
              <span className="flex items-center gap-1.5 text-red-600">
                <span className="w-4 h-0.5 bg-red-500"></span> WHO Drinking Limit (0.05 mg/L)
              </span>
            </div>
          </div>
        </section>

        {/* Section 4: Available Technological Approaches */}
        <section className="space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <span className="text-xs font-mono text-[#006492] font-bold uppercase">INTERVENTION TOOLKIT</span>
            <h2 className="text-2xl font-serif font-bold text-[#002116]">Engineered Intervention Portfolio</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {interventions.map((inv) => (
              <div key={inv.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className={`${inv.bg} ${inv.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <inv.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#002116]">{inv.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{inv.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

