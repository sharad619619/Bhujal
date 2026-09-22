'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, Map, Search, BarChart3, Database, Eye, Leaf, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const steps = [
    { icon: Search, title: 'Detect', desc: 'Identify potential contamination using multispectral satellite indices and hydrological sensors.' },
    { icon: Map, title: 'Map', desc: 'Synthesize ground well data, soil strata, and topography into 3D hydrodynamic models.' },
    { icon: BarChart3, title: 'Predict', desc: 'Estimate plume migration pathways and advection velocity using physical aquifer models.' },
    { icon: Database, title: 'Prioritize', desc: 'Rank locations based on population exposure, school density, and contamination severity.' },
    { icon: ShieldCheck, title: 'Protect', desc: 'Implement immediate alternative safe water lifelines and voice turn-by-turn guidance.' },
    { icon: Leaf, title: 'Remediate', desc: 'Design site-specific interventions including permeable reactive barriers and phytoremediation.' },
    { icon: Eye, title: 'Verify', desc: 'Continuously monitor outcomes through certified laboratory data and sensor telemetry.' },
    { icon: FileText, title: 'Document', desc: 'Maintain an immutable chronological evidence dossier for regulatory accountability.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f4fbf7] text-[#0c1f18] font-sans selection:bg-[#c3ebd8] selection:text-[#002116]">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#002116] font-bold">Platform Architecture &amp; Methodology</span>
        </div>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-[#ddf3e7] text-[#002116] font-bold border border-stone-200 inline-block">
            Scientific Foundation
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#002116] tracking-tight">
            About Bhujal AI
          </h1>
          <p className="text-base sm:text-lg text-stone-600 font-serif leading-relaxed">
            Intelligence Beneath the Surface. From contamination data to community action.
          </p>
        </div>

        {/* Mission Card */}
        <section className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-stone-200 space-y-4">
          <h2 className="text-2xl font-serif font-bold text-[#002116]">Our Mission</h2>
          <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
            Bhujal AI is designed for chromium-contaminated communities in Uttar Pradesh, India, initially focusing on the Kanpur Nagar–Kanpur Dehat–Fatehpur industrial corridor.
          </p>
          <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
            The goal is not to build another passive water-quality testing dashboard. The goal is to build an active intelligence, community-response, remediation-planning, accountability, and monitoring platform that connects scientific hydrodynamic models with actionable village-level decisions.
          </p>
        </section>

        {/* 8-Stage Cycle */}
        <section className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-mono text-[#006492] font-bold uppercase tracking-wider">
              OPERATIONAL LIFECYCLE
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#002116]">
              How Bhujal AI Operates
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-center flex flex-col items-center justify-between hover:border-[#2E8B68]/50 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#ddf3e7] text-[#2E8B68] flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-400 block mb-1">STAGE 0{i + 1}</span>
                  <h3 className="font-serif font-bold text-lg text-[#002116] mb-2">{step.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scientific Integrity */}
        <section className="bg-gradient-to-br from-[#002116] via-[#12372A] to-[#003b29] text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-bold">
              Core Principles
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">Scientific Integrity &amp; Ground-Truth Protocols</h2>
          
          <div className="space-y-4 text-stone-200 leading-relaxed text-xs sm:text-sm font-mono">
            <div className="p-4 bg-white/10 rounded-xl border border-white/10">
              <strong className="text-white block mb-1">Strict Differentiation of Data Layers:</strong>
              Our system rigorously differentiates <span className="bg-emerald-400/20 text-emerald-200 px-1.5 py-0.5 rounded font-bold">MEASURED</span> field sensor values from <span className="bg-amber-400/20 text-amber-200 px-1.5 py-0.5 rounded font-bold">ESTIMATED</span> kriging interpolation and <span className="bg-sky-400/20 text-sky-200 px-1.5 py-0.5 rounded font-bold">PREDICTED</span> advection models. Algorithmic simulations are never represented as physical lab truth.
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/10">
              <strong className="text-white block mb-1">Zero Synthetic Fabrication for Actionable Directives:</strong>
              Actionable safe drinking directives are evaluated strictly against verified WHO limits (0.05 mg/L hexavalent chromium). Every observation point displays its collection date, depth, and laboratory verification status.
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/10">
              <strong className="text-white block mb-1">Probabilistic Hydrology:</strong>
              Subsurface contaminant transport models in alluvial floodplains involve hydraulic heterogeneity. We report 90-day and 180-day forecast cones with transparent confidence intervals rather than illusory absolutes.
            </div>
          </div>

          <div className="pt-4 border-t border-white/15 flex flex-wrap gap-4">
            <Link 
              href="/data-sources" 
              className="px-5 py-2.5 bg-emerald-500 text-stone-950 font-mono text-xs font-bold rounded-xl hover:bg-emerald-400 transition-colors shadow-sm"
            >
              Inspect Data Management Center →
            </Link>
            <Link 
              href="/water-safety" 
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold rounded-xl transition-colors border border-white/20"
            >
              Test Water Safety Navigator →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
