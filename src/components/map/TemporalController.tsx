'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface TemporalControllerProps {
  year: number;
  onChangeYear: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}

export default function TemporalController({
  year,
  onChangeYear,
  minYear = 2018,
  maxYear = 2026,
}: TemporalControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        onChangeYear(year < maxYear ? year + 1 : minYear);
      }, 1400);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, year, minYear, maxYear, onChangeYear]);

  const stepBackward = () => {
    if (year > minYear) {
      onChangeYear(year - 1);
    }
  };

  const stepForward = () => {
    if (year < maxYear) {
      onChangeYear(year + 1);
    }
  };

  const resetToLatest = () => {
    setIsPlaying(false);
    onChangeYear(maxYear);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-2xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-3 sm:gap-5 text-xs font-mono select-none">
      {/* Label and Badge */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-slate-800 block text-[11px] leading-tight">Temporal Horizon</span>
          <span className="text-[10px] text-slate-500">{year === 2026 ? 'Latest Verified' : `Historical Context (${year})`}</span>
        </div>
        <span className="px-2 py-0.5 bg-[#002116] text-emerald-300 font-bold rounded-md text-xs ml-1 shadow-xs">
          {year}
        </span>
      </div>

      {/* Interactive Range Slider */}
      <div className="flex items-center gap-2 flex-1 min-w-[140px] max-w-xs">
        <span className="text-[10px] text-slate-400">{minYear}</span>
        <input
          type="range"
          min={minYear}
          max={maxYear}
          step="1"
          value={year}
          onChange={(e) => {
            setIsPlaying(false);
            onChangeYear(parseInt(e.target.value, 10));
          }}
          className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2E8B68]"
        />
        <span className="text-[10px] text-slate-800 font-bold">{maxYear}</span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
        {/* Step Back */}
        <button
          onClick={stepBackward}
          disabled={year <= minYear}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          title="Step back 1 year"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Play / Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg font-bold flex items-center gap-1 text-[11px] cursor-pointer transition-colors"
          title={isPlaying ? 'Pause timeline playback' : 'Play timeline animation'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 text-emerald-700" /> : <Play className="w-3.5 h-3.5 text-emerald-700" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        {/* Step Forward */}
        <button
          onClick={stepForward}
          disabled={year >= maxYear}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          title="Step forward 1 year"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Reset to Latest */}
        {year !== maxYear && (
          <button
            onClick={resetToLatest}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors ml-1"
            title="Reset to 2026 Latest"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
