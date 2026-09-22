'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import {
  Shield,
  Layers,
  MapPin,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Activity,
  CheckCircle2,
  Droplets,
  Sprout,
  Users,
  Compass,
  FileText,
  Search,
  ChevronRight,
  ExternalLink,
  Volume2,
} from 'lucide-react';

export default function LandingPage() {
  const { language } = useTranslation();
  const [selectedHorizon, setSelectedHorizon] = useState<'90d' | '180d' | '360d'>('180d');

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8] text-[#0c1f18] topo-grid">
      <Header />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 2. HERO: Cinematic National Geographic Environmental Cross-Section        */}
        {/* ========================================================================= */}
        <section className="relative bg-[#002116] text-white pt-10 pb-16 px-4 lg:px-10 overflow-hidden" id="hero">
          {/* Atmospheric Ambient Glows */}
          <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 right-10 w-[500px] h-[500px] bg-amber-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto space-y-8 relative z-10">
            {/* Top Meta Tag */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="inline-flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-300 font-semibold">
                  NATIONAL GEOGRAPHIC × HYDROGEOLOGICAL INTELLIGENCE • DEEP TELEMETRY 2026
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-white/60">
                <span>BASIN: RANIA / KANPUR DEHAT (#UP-09A)</span>
                <span className="text-white/30">•</span>
                <span className="text-amber-300">Cr(VI) SPREAD VELOCITY: 1.4m/day</span>
              </div>
            </div>

            {/* Main Headline & Subtitle */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8 space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light tracking-tight text-white leading-[1.12]">
                  Know where contamination is.<br />
                  <span className="italic text-emerald-300 font-normal">Know who is exposed.</span><br />
                  Know what to do next.
                </h1>
                <p className="text-lg lg:text-xl text-white/80 font-light max-w-2xl leading-relaxed">
                  From contamination data to community action. Bhujal AI connects physical bore logs, 3D Kriging advection plumes, and biological phytoremediation to safeguard unseen drinking aquifers.
                </p>
              </div>

              {/* Hero Primary Actions */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <Link
                  href="/map"
                  className="inline-flex items-center justify-center gap-2.5 bg-emerald-400 hover:bg-emerald-300 text-[#002116] font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg active:scale-95 text-center"
                >
                  <span className="material-symbols-outlined text-[20px]">explore</span>
                  <span>Explore Contamination Map</span>
                </Link>
                <Link
                  href="/reports/new"
                  className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium px-5 py-3.5 rounded-xl text-sm transition-all active:scale-95 text-center"
                >
                  <span className="material-symbols-outlined text-[20px] text-amber-400">report_problem</span>
                  <span>Report an Environmental Issue</span>
                </Link>
              </div>
            </div>

            {/* CENTERPIECE: Cinematic 3D Geological Cross-Section Visual */}
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-2xl mt-4">
              <div className="relative aspect-[16/9] lg:aspect-[21/9] w-full max-h-[560px] overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvKwBZIITaT4OuUjVj7pwR1gYVEAU3r3cQxqAaDrI3YFilfJm9DPG1nea2-DIA7vWzEXTy7nJU4w0BfAb1Ldk8p0wEkbA5UARa3qMB5ylrckfVrfEr4B0lhm7AXsm4f8SbTaOdfiHn35uOQGuzihoQqeH5b_8XOY1qaOQG8RVafGmh_c8DPJ_CkOEiWvDU79ANrLrZYdNtW2SZWS97tkovIthBDzTWUwdHdpEfWGp63f0t72k88umAJw"
                  alt="Cinematic scientific cross-section of Indian rural landscape transitioning deep beneath the surface with toxic chromium plume"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />
                {/* Gradient Vignette & Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#002116] via-transparent to-black/30 pointer-events-none"></div>

                {/* Stratigraphic Legend Badges (Floating on Image) */}
                <div className="absolute top-4 left-4 bg-[#002116]/85 backdrop-blur-md border border-white/15 p-3.5 rounded-xl max-w-xs text-xs space-y-1.5 hidden md:block">
                  <div className="font-mono uppercase tracking-wider text-[10px] text-emerald-300 font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">view_in_ar</span>
                    Stratigraphic Profile UP-09
                  </div>
                  <div className="text-white/85 text-[11px] leading-snug">
                    Surface farmland with Handpumps (0–10m) over Silt-Clay aquitard barrier (50m) sealing a 150m toxic Cr(VI) advection-dispersion plume.
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-red-950/85 backdrop-blur-md border border-red-500/30 px-4 py-2.5 rounded-xl text-right hidden sm:block">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-red-300 font-bold">Unconfined Aquifer Breach</div>
                  <div className="text-sm font-mono text-white font-semibold">Cr(VI) 2.84 mg/L <span className="text-xs text-red-300 font-normal">(56× WHO limit)</span></div>
                </div>
              </div>

              {/* Integrated Live Telemetry Bar Beneath Image */}
              <div className="bg-[#12372A] border-t border-white/10 px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
                <div className="pt-2 md:pt-0 md:px-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-300 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[14px]">sensors</span>
                    Verified Borewells
                  </div>
                  <div className="text-xl font-bold font-mono text-white mt-1">142 <span className="text-xs text-emerald-400 font-normal">Active RT-Nodes</span></div>
                </div>
                <div className="pt-2 md:pt-0 md:px-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-300 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[14px]">group</span>
                    Directly Exposed Pop.
                  </div>
                  <div className="text-xl font-bold font-mono text-amber-400 mt-1">18,400 <span className="text-xs text-white/60 font-normal">in 7 villages</span></div>
                </div>
                <div className="pt-2 md:pt-0 md:px-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[14px]">water_drop</span>
                    Safe Replacement Taps
                  </div>
                  <div className="text-xl font-bold font-mono text-white mt-1">96.2% <span className="text-xs text-cyan-300 font-normal">Jal Jeevan active</span></div>
                </div>
                <div className="pt-2 md:pt-0 md:px-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-300 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[14px]">shield</span>
                    Phyto-Remediation
                  </div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">-68.4% <span className="text-xs text-white/60 font-normal">Toxicity in 90d</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CHAPTER 1: "The Contamination You See Is Only Part of the Story"        */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 lg:px-10 max-w-7xl mx-auto" id="ground-truth">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Documentary Visual with authentic photograph */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200 group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa9iLRFPzOhlvw6RAtYeLSGF582uuEYV-FWdfThhLi85BRKTnt-msuWQReU3fPVq2_XUd_wLYjmI6cfNQ6jKshaLW7lTnqpuiYtrqJCZFfjwxZY0NKFD6qo21wnYOGx8P47ou962CKDXoCVJGImYIgPxim55MTXP7FdMMzfQZzkbstc3OvQS7lw2aXHLL5fUFWwZsnmoWDIoXbq9kD_xgVdI3w_ply12U35caU0jx1JFK0rAshyXGvtQ"
                  alt="Mark II cast-iron hand pump sealed with bold red warning lock in rural Uttar Pradesh"
                  className="w-full h-[460px] object-cover group-hover:scale-102 transition-transform duration-500"
                />
                {/* Documentary Caption Box */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-6 text-white">
                  <div className="inline-flex items-center gap-2 bg-red-600/90 text-white text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider font-bold mb-2">
                    <span className="material-symbols-outlined text-[13px]">lock</span>
                    Field Verification • Khanchandpur Village
                  </div>
                  <p className="text-xs text-white/85 leading-relaxed">
                    India Mark II shallow tube-well (28m depth) red-tagged and padlocked after ICP-MS spectrometric tests detected 1.92 mg/L hexavalent chromium. Villagers are directed to deep municipal taps 650m north.
                  </p>
                </div>
              </div>
            </div>

            {/* Narrative & Depth Comparison Matrix */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold font-mono text-[#765A43] tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-[#765A43]"></span>
                CHAPTER 01 • SENSORY ILLUSION VS HYDROLOGIC FACT
              </div>
              <h2 className="text-3xl lg:text-4xl font-serif text-[#002116] leading-tight font-medium">
                The contamination you see is only part of the story.
              </h2>
              <p className="text-base text-stone-600 leading-relaxed">
                Groundwater looks perfectly clear. It has no distinctive smell when drawn from domestic shallow tube-wells. Yet over two decades of untreated basic chromium sulfate sludge dumping in Rania has quietly penetrated deep below the surface, migrating through fine sands into drinking zones.
              </p>

              {/* Lithological Depth Breakdown Cards */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-start gap-4 shadow-sm strata-edge-danger">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
                    <Droplets className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-700 font-mono">Shallow Aquifer (0 – 25m)</span>
                      <span className="text-xs font-mono text-red-700 font-bold">UNSAFE FOR CONSUMPTION</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Directly impacted by percolation. 82% of household handpumps here exceed CPCB permissible levels of Chromium and Arsenic.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-start gap-4 shadow-sm strata-edge-safe">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono">Deep Confined Aquifer (70m – 120m)</span>
                      <span className="text-xs font-mono text-emerald-700 font-bold">POTABLE PROTECTED</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Protected beneath a 12-meter impermeant aquitard clay stratum. Bhujal AI pinpoints secure geo-coordinates for solar mini-water works.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  href="/water-safety"
                  className="text-xs font-bold text-[#006492] hover:text-[#002116] flex items-center gap-1.5 uppercase tracking-wider font-mono transition-colors"
                >
                  <span>View Village Water Safety Registry</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CHAPTER 2: "Understand What May Happen Next & Prioritize Action"        */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#12372A] text-white px-4 lg:px-10 contour-lines relative overflow-hidden" id="hidden-plume">
          <div className="max-w-7xl mx-auto space-y-12 relative z-10">
            {/* Section Header */}
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold font-mono text-emerald-300 tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                CHAPTER 02 • PREDICTIVE HYDRODYNAMICS & VULNERABILITY
              </div>
              <h2 className="text-3xl lg:text-4xl font-serif font-light text-white leading-tight">
                Understand what may happen next. <span className="italic text-emerald-300">Prioritize where action matters most.</span>
              </h2>
              <p className="text-sm lg:text-base text-white/70 leading-relaxed">
                Groundwater is not stagnant. Monsoon recharge gradients push dissolved heavy-metal plumes downstream. Bhujal AI computes 3D advection-dispersion partial differential equations to project migrations 6, 12, and 24 months forward.
              </p>
            </div>

            {/* Interactive Hydrodynamic Simulation Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Simulation Visual Matrix */}
              <div className="lg:col-span-8 bg-[#002116] border border-white/15 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400">storm</span>
                    <span className="font-mono text-xs text-white uppercase font-bold">Monsoon Surge Dispersion Model (2026–2027)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Hydraulic Head: +2.1m</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/80">Gradient: 0.0034 S-E</span>
                  </div>
                </div>

                {/* Synthetic Plume Contour Visualization */}
                <div className="relative bg-gradient-to-br from-[#0c2f24] via-[#08221a] to-[#041510] rounded-xl p-6 border border-white/10 h-72 overflow-hidden flex flex-col justify-between">
                  <div className="absolute -right-10 top-10 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none plume-pulse"></div>
                  <div className="absolute right-32 top-20 w-48 h-48 bg-amber-500/25 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="flex justify-between items-start z-10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-wider uppercase text-white/50 block">Industrial Leach Source</span>
                      <span className="text-xs font-mono text-red-400 font-bold">Rania Legacy Waste Dumpsite (Point-Zero)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-emerald-300 block">Monsoon Forecast Horizon</span>
                      <span className="text-xs font-mono text-white font-bold">+180 Days Projected Advance</span>
                    </div>
                  </div>

                  {/* Vector Path overlay graphic */}
                  <div className="my-auto z-10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-red-500 ring-4 ring-red-500/30 animate-pulse"></span>
                      <span className="text-red-200 font-bold">Khanchandpur (Critical: 94.2)</span>
                    </div>
                    <div className="flex-1 mx-4 border-t-2 border-dashed border-amber-400/60 relative flex items-center justify-center">
                      <span className="px-2.5 py-0.5 bg-black/80 rounded text-[10px] text-amber-300">
                        Migration: +340m S-E
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-amber-400/30"></span>
                      <span className="text-amber-200">Chirakhurd Primary School</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end text-[11px] font-mono text-white/60 z-10 border-t border-white/10 pt-3">
                    <span>Model Confidence: 91.8% (Validated via 38 observation wells)</span>
                    <span className="text-emerald-300">Action: Preemptive Well Capping Initiated</span>
                  </div>
                </div>

                {/* Dispersion Metric Bar */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono uppercase text-white/50 block">Advection Velocity</span>
                    <span className="text-lg font-mono text-emerald-300 font-bold">1.42 m / day</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono uppercase text-white/50 block">Hydraulic Conductivity</span>
                    <span className="text-lg font-mono text-white font-bold">18.5 m / day</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono uppercase text-white/50 block">Retardation Factor</span>
                    <span className="text-lg font-mono text-cyan-300 font-bold">R = 1.34</span>
                  </div>
                </div>
              </div>

              {/* Village Vulnerability Ranking List */}
              <div className="lg:col-span-4 bg-[#002116] border border-white/15 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-mono text-xs text-white uppercase font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-red-400">crisis_alert</span>
                      Priority Vulnerability Index
                    </span>
                    <span className="text-[10px] font-mono text-white/50">Top At-Risk Zones</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-white">Khanchandpur</div>
                        <div className="text-[11px] text-white/60">Primary School Tube-well #02</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm text-red-400 font-bold">94.2 Score</div>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">Immediate Action</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-white">Chirakhurd</div>
                        <div className="text-[11px] text-white/60">Community Health Centre Tube-well</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm text-amber-300 font-bold">88.7 Score</div>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Seal Scheduled</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-white">Umran Village</div>
                        <div className="text-[11px] text-white/60">Panchayat Basti Central Well</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm text-emerald-300 font-bold">71.0 Score</div>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Monitored</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href="/prioritization"
                  className="mt-6 w-full py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-center rounded-xl text-xs font-bold text-white tracking-wider uppercase font-mono transition-colors block"
                >
                  Open Regional Vulnerability Matrix →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CHAPTER 3: "Nature-Based Restoration & Proving What Changed"           */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 lg:px-10 max-w-7xl mx-auto" id="nature-restoration">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Narrative & Provenance Metrics */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold font-mono text-emerald-800 tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                CHAPTER 03 • BIOLOGICAL RESTORATION & PROOF
              </div>
              <h2 className="text-3xl lg:text-4xl font-serif text-[#002116] leading-tight font-medium">
                Nature-based restoration, <span className="italic text-[#006492]">proven by empirical chemistry.</span>
              </h2>
              <p className="text-base text-stone-600 leading-relaxed">
                High-energy civil remediation is often cost-prohibitive in rural belts. Bhujal AI designs specialized biosorption swales using Vetiver grass (<em>Chrysopogon zizanioides</em>) and Indian mustard (<em>Brassica juncea</em>)—deep-root hyperaccumulators that pull dissolved hexavalent chromium directly from vadose water flows.
              </p>

              {/* Before vs After Empirical Progress Timeline */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider font-mono text-[#002116]">Pilot UP-09 Phytoremediation Swale</span>
                  <span className="text-xs font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded font-semibold">-68.4% Toxicity Over 90 Days</span>
                </div>
                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-stone-900 mb-1">
                      <span>Baseline (Day 0 - Raw Leachate)</span>
                      <span className="text-red-600 font-bold">2.84 mg/L Cr(VI)</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-600 h-full rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-stone-900 mb-1">
                      <span>Day 45 (Post-Swale Filtration)</span>
                      <span className="text-amber-600 font-bold">1.41 mg/L Cr(VI)</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-stone-900 mb-1">
                      <span>Day 90 (Effluent Polishing Wetland)</span>
                      <span className="text-emerald-700 font-bold">0.048 mg/L Cr(VI) (Target Met)</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '17%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-500">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-700">verified</span>
                  <span>ISO/IEC 17025 Accredited Spectrometry</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#006492]">database</span>
                  <span>Tamper-Proof Field Registry</span>
                </div>
              </div>
            </div>

            {/* Real Field Research Photograph */}
            <div className="lg:col-span-6 relative order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200 group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSrY9otWZR2VjuaPIa0nnbP3YDKo-m4rZcrtj5sWD8vmUYhmFwnhSN6F4DO4KLhEuLiKkxK7KR_c4iFsCR3cJ1pSfZBzkaC6MZba1jRT-IvzTEG-AaypAR6uDcBE5NTPFX40BzD9Y-Uf0Qej6D6fniNOI0eA2vQ9G5DjBshtYa946R1BgDyQw-PJthH2S06alnVZFXCoyZBqHWgWTj0jUUxWCK8E8BFGDK4dWa7Z5aqeEDTo34B085kw"
                  alt="Environmental researchers testing water in a lush green phytoremediation wetland swale in India"
                  className="w-full h-[460px] object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-6 text-white">
                  <div className="inline-flex items-center gap-2 bg-emerald-600/90 text-white text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider font-bold mb-2">
                    <span className="material-symbols-outlined text-[13px]">psychology_alt</span>
                    Field Research Unit • Rania Bio-Swale
                  </div>
                  <p className="text-xs text-white/85 leading-relaxed">
                    Environmental engineers collecting multi-depth water samples from active Vetiver filtration swales. Field spectrometry confirms 92% removal of suspended heavy chromium ions before discharge into the agricultural irrigation canal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. DUAL MISSION GATEWAYS (Community Sentinel vs Hydrogeological Console)    */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 lg:px-10 bg-[#eaf4f2] border-t border-stone-200" id="gateways">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold font-mono text-[#002116] tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-[#002116]"></span>
                ACCESS PROTOCOLS
              </div>
              <h2 className="text-3xl lg:text-4xl font-serif text-[#002116] font-medium">Select Your Mission Gateway</h2>
              <p className="text-sm lg:text-base text-stone-600">
                Bhujal AI operates symmetrically: immediate life-saving clarity for rural residents, and high-fidelity mathematical modeling for scientists and district magistrates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Gateway 1: Community & Citizen Sentinel */}
              <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-xl bg-emerald-50 text-[#12372A] flex items-center justify-center border border-emerald-200">
                      <span className="material-symbols-outlined text-[32px]">family_restroom</span>
                    </div>
                    <span className="text-[11px] font-bold font-mono px-3 py-1 rounded-full bg-emerald-100 text-emerald-900">
                      BILINGUAL • हिंदी / EN
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-[#002116] font-semibold">Citizen & Community Sentinel</h3>
                    <p className="text-xs font-mono text-stone-500 mt-1 uppercase">For villagers, gram panchayats, and frontline health workers</p>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Designed for extreme ease-of-use with zero hydrologic jargon. Check if a local tube-well is safe to drink, receive WhatsApp alerts, or report water discoloration with one-tap photo uploads.
                  </p>
                  <ul className="space-y-3 text-xs text-stone-700">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>5-Second Water Point Check:</strong> Instant color-coded safety status for every geotagged pump.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>WhatsApp & Voice Directions:</strong> Audio guidance to the nearest verified potable Jal Jeevan tap.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Crowdsourced Water Reporting:</strong> Report yellow water or foul odor directly to the District Magistrate.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8 border-t border-stone-100 mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/water-safety"
                    className="flex-1 bg-[#002116] text-white text-center py-3 rounded-xl text-xs font-bold font-mono tracking-wider uppercase hover:bg-[#12372A] transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[17px]">verified</span>
                    Check Local Water Point
                  </Link>
                  <Link
                    href="/reports/new"
                    className="px-4 py-3 rounded-xl border border-[#002116]/20 text-[#002116] text-xs font-bold font-mono tracking-wider uppercase hover:bg-stone-50 transition-colors text-center"
                  >
                    रिपोर्ट करें (Report)
                  </Link>
                </div>
              </div>

              {/* Gateway 2: Hydrogeological Research & District Console */}
              <div className="bg-[#12372A] text-white rounded-2xl p-8 border border-white/20 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-xl bg-white/10 text-emerald-300 flex items-center justify-center border border-white/10">
                      <span className="material-symbols-outlined text-[32px]">science</span>
                    </div>
                    <span className="text-[11px] font-bold font-mono px-3 py-1 rounded-full bg-white/10 text-emerald-300 border border-white/15">
                      DISTRICT & GIS RESEARCH
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-white font-semibold">Hydrogeological Intelligence Console</h3>
                    <p className="text-xs font-mono text-emerald-300 mt-1 uppercase">For Hydro-geologists, NGT Commissioners, and District Magistrates</p>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Full spatial stack featuring 3D advection-dispersion plume predictions, Kriging interpolation contours, multi-depth lithological bore logs, and bio-remediation cost-benefit matrices.
                  </p>
                  <ul className="space-y-3 text-xs text-white/85">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Advection-Dispersion Modeling:</strong> Compute hexavalent chromium plume expansion vectors up to 24 months forward.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Multi-Aquifer Strata Logs:</strong> Isolate shallow vadose contaminated layers from deep confined drinking zones.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Remediation Decision Support:</strong> Benchmark Vetiver bio-swales vs deep well sealing and RO networks.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8 border-t border-white/10 mt-6 flex flex-col sm:flex-row gap-3 relative z-10">
                  <Link
                    href="/dashboard"
                    className="flex-1 bg-emerald-400 text-[#002116] text-center py-3 rounded-xl text-xs font-bold font-mono tracking-wider uppercase hover:bg-emerald-300 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[17px]">hub</span>
                    Enter Decision Console
                  </Link>
                  <Link
                    href="/map"
                    className="px-4 py-3 rounded-xl border border-white/20 text-white text-xs font-bold font-mono tracking-wider uppercase hover:bg-white/10 transition-colors text-center"
                  >
                    3D Plume Map
                  </Link>
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
