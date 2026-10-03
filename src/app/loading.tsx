'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-[#F7FAF8] text-[#0c1f18]">
      <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
        {/* Official Bhujal AI Logo on Loading / Splash Screen */}
        <div className="relative w-16 h-20 rounded-2xl bg-[#01261E] p-2 flex items-center justify-center shadow-xl ring-4 ring-emerald-500/20 animate-pulse">
          <img
            src="/logo.png"
            alt="Bhujal AI"
            width={242}
            height={310}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-serif font-bold text-[#002116] tracking-tight">
            Bhujal AI
          </h2>
          <p className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Loading Subsurface Telemetry...
          </p>
        </div>

        <div className="w-32 h-1 bg-stone-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-emerald-600 rounded-full animate-indeterminate"></div>
        </div>
      </div>
    </div>
  );
}
