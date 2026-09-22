'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { Layers, Shield, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  const { t, language } = useTranslation();

  return (
    <footer className="bg-[#002116] text-white/70 border-t border-white/10 lg:pb-0 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold shadow-inner">
                <span className="material-symbols-outlined text-[20px]">layers</span>
              </div>
              <span className="text-xl font-serif font-bold text-white tracking-tight">
                Bhujal AI
              </span>
            </Link>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              Intelligence Beneath the Surface. Connecting physical bore logs, 3D Kriging advection plumes, and biological phytoremediation to safeguard unseen drinking aquifers in Uttar Pradesh.
            </p>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono text-emerald-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>HYDRO-GEO v2.4 TELEMETRY ACTIVE</span>
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h3 className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider mb-4">
              Intelligence Platform
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Overview &amp; Environmental Story
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-white transition-colors">
                  3D Contamination Map
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Hydro-Geo Decision Console
                </Link>
              </li>
              <li>
                <Link href="/water-safety" className="hover:text-white transition-colors">
                  Water Safety &amp; Lifeline Navigator
                </Link>
              </li>
              <li>
                <Link href="/remediation" className="hover:text-white transition-colors">
                  Phytoremediation Planner
                </Link>
              </li>
              <li>
                <Link href="/data-sources" className="hover:text-white transition-colors">
                  Data Center &amp; Upload Wizard
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div>
            <h3 className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider mb-4">
              Community &amp; Civic Action
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/water-safety" className="hover:text-white transition-colors">
                  Is My Water Safe? (पानी की जाँच)
                </Link>
              </li>
              <li>
                <Link href="/reports/new" className="hover:text-white transition-colors">
                  Report Water Contamination (समस्या दर्ज करें)
                </Link>
              </li>
              <li>
                <Link href="/villages" className="hover:text-white transition-colors">
                  Village Risk Registry
                </Link>
              </li>
              <li>
                <Link href="/prioritization" className="hover:text-white transition-colors">
                  Intervention Priority Index
                </Link>
              </li>
              <li>
                <Link href="/evidence" className="hover:text-white transition-colors">
                  Field Verification &amp; Evidence
                </Link>
              </li>
            </ul>
          </div>

          {/* Research & Compliance */}
          <div>
            <h3 className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider mb-4">
              Standards &amp; Science
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="text-white/90 font-medium block">WHO Drinking Standard:</span>
                <span className="font-mono text-emerald-300 text-[11px]">0.05 mg/L Max Cr(Total)</span>
              </li>
              <li className="pt-1">
                <span className="text-white/90 font-medium block">Laboratory Protocol:</span>
                <span className="text-stone-400 text-[11px]">ISO/IEC 17025 ICP-MS Spectrometry</span>
              </li>
              <li className="pt-1">
                <span className="text-white/90 font-medium block">Target Basin:</span>
                <span className="text-stone-400 text-[11px]">Kanpur Dehat, Kanpur Nagar &amp; Fatehpur</span>
              </li>
              <li className="pt-2">
                <Link href="/about" className="text-emerald-300 hover:underline inline-flex items-center gap-1 font-mono text-[11px]">
                  <span>Methodology Documentation</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 font-mono">
          <p>© 2026 Bhujal AI. Dedicated to clean drinking water and environmental justice.</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400/70">From contamination data to community action.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
