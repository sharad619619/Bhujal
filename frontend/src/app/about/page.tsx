'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AlertTriangle, ShieldCheck, Map, Search, BarChart3, Database, Eye, Leaf, FileText } from 'lucide-react';
import Link from 'next/link';

const DemoBanner = () => (
  <div className="bg-amber-100 text-amber-800 p-2 text-center text-sm font-medium w-full flex items-center justify-center gap-2">
    <AlertTriangle className="h-4 w-4" />
    <span>DEMO DATA - Not for real-world environmental action.</span>
  </div>
);

export default function AboutPage() {
  const steps = [
    { icon: Search, title: 'Detect', desc: 'Identify potential contamination using multispectral satellite indices.' },
    { icon: Map, title: 'Map', desc: 'Synthesize ground well data, soil types, and topography.' },
    { icon: BarChart3, title: 'Predict', desc: 'Estimate plume migration pathways using hydrogeological models.' },
    { icon: Database, title: 'Prioritize', desc: 'Rank locations based on population exposure and severity.' },
    { icon: ShieldCheck, title: 'Protect', desc: 'Implement immediate alternative water supplies for exposed groups.' },
    { icon: Leaf, title: 'Remediate', desc: 'Design site-specific interventions like phytoremediation.' },
    { icon: Eye, title: 'Verify', desc: 'Continuously monitor outcomes through new lab data.' },
    { icon: FileText, title: 'Document', desc: 'Maintain an immutable chronological evidence dossier.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <DemoBanner />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">About AquaShield</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Intelligence Beneath the Surface. A chromium groundwater contamination response and remediation intelligence platform.</p>
        </div>

        <section className="mb-16 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Mission</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            AquaShield (Bhujal AI) aims to bridge the gap between complex environmental data and actionable community interventions. We provide a consolidated platform to track, model, and address heavy metal contamination in groundwater, specifically targeting hexavalent chromium Cr(VI).
          </p>
          <p className="text-slate-700 leading-relaxed">
            By combining remote sensing, hydrogeological models, and rigorous ground-truth data management, we empower environmental agencies, NGOs, and local communities to make informed, timely decisions.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
                <div className="w-12 h-12 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4"><step.icon className="h-6 w-6" /></div>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 bg-slate-900 text-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Scientific Integrity & Methodology</h2>
          <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
            <p><strong className="text-white">Strict Differentiation:</strong> Our system strictly categorizes data into <span className="bg-green-900 text-green-200 px-1 py-0.5 rounded text-xs">MEASURED</span>, <span className="bg-amber-900 text-amber-200 px-1 py-0.5 rounded text-xs">ESTIMATED</span>, and <span className="bg-purple-900 text-purple-200 px-1 py-0.5 rounded text-xs">PREDICTED</span> values. We never present algorithmic predictions as physical ground truth.</p>
            <p><strong className="text-white">No Fabrication:</strong> We do not fabricate scientific measurements or health claims. All actionable data must be backed by transparent sources and assigned a confidence score.</p>
            <p><strong className="text-white">Language of Probability:</strong> Analytical outputs emphasize "potential exposure" and "estimated plume paths" rather than definitive geographic absolutes. Nature is complex, and models represent probabilities, not certainties.</p>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700">
            <Link href="/data-sources" className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1">View Detailed Data Sources & Quality Guidelines →</Link>
          </div>
        </section>

        <section className="mb-16 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Privacy</h2>
          <p className="text-slate-700 leading-relaxed text-sm">
            Community reports are anonymized at the source to protect the identities of local residents reporting environmental concerns. Precise well locations for private residences are slightly aggregated to grid blocks on public maps to ensure privacy while maintaining epidemiological accuracy.
          </p>
        </section>

        <section className="text-center pb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Contact</h2>
          <p className="text-slate-600 mb-2">For platform inquiries or data access requests:</p>
          <a href="mailto:contact@aquashield-demo.org" className="text-blue-600 hover:underline font-medium">contact@aquashield-demo.org</a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
