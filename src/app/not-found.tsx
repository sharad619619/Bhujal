'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Home, Map } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8] text-[#0c1f18] font-sans">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          {/* Official Bhujal AI Logo on Not Found State */}
          <div className="mx-auto w-16 h-20 rounded-2xl bg-[#01261E] p-2 flex items-center justify-center shadow-xl ring-4 ring-emerald-500/20">
            <img
              src="/logo.png"
              alt="Bhujal AI"
              width={242}
              height={310}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              404 • Resource Not Located
            </span>
            <h1 className="text-3xl font-serif font-bold text-[#002116] tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm text-stone-600 font-sans leading-relaxed">
              The requested hydrogeological coordinate or page does not exist or has been relocated within the Bhujal AI registry.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono text-xs">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#002116] hover:bg-[#12372A] text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
            <Link
              href="/map"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-semibold px-5 py-2.5 rounded-xl transition-all"
            >
              <Map className="w-4 h-4 text-emerald-700" />
              <span>Subsurface Map</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
