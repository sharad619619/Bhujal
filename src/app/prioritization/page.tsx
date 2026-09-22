'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getDb } from '@/lib/db/store';
import { 
  Settings2, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  ChevronRight,
  Map as MapIcon
} from 'lucide-react';
import Link from 'next/link';

interface VillagePriorityItem {
  id: string;
  name: string;
  hindiName?: string;
  district: string;
  block: string;
  coordinates: [number, number];
  baseScore: number;
  priority: 'Very High' | 'High' | 'Medium' | 'Low';
  stats: {
    population: number;
    affectedRatio: string;
    schools: number;
    contaminationStatus: string;
  };
  factors: {
    popExposure: number;
    contaminationSeverity: number;
    gwExposure: number;
    sensitiveLocations: number;
    agriExposure: number;
  };
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'Very High':
      return 'bg-red-50 text-red-800 border-red-200';
    case 'High':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'Medium':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    case 'Low':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    default:
      return 'bg-stone-100 text-stone-700 border-stone-200';
  }
};

const getMapColor = (priority: string) => {
  switch (priority) {
    case 'Very High': return '#b91c1c';
    case 'High': return '#d97706';
    case 'Medium': return '#ca8a04';
    case 'Low': return '#15803d';
    default: return '#64748b';
  }
};

export default function PrioritizationPage() {
  const [villages, setVillages] = useState<VillagePriorityItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(null);

  const [weights, setWeights] = useState({
    popExposure: 25,
    contaminationSeverity: 30,
    gwExposure: 20,
    sensitiveLocations: 15,
    agriExposure: 10,
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Initial load from store
  useEffect(() => {
    const db = getDb();
    const rawVillages = db.getVillages();

    const items: VillagePriorityItem[] = rawVillages.map(v => {
      // Derive factors
      const popScore = Math.min(100, Math.round((v.population / 15000) * 100));
      const affected = v.affectedWaterSources ?? 0;
      const total = v.totalWaterSources ?? 1;
      const ratio = affected / Math.max(1, total);
      const sevScore = Math.round(ratio * 95) + (v.contaminationStatus === 'High' ? 10 : 0);
      const cleanSev = Math.min(100, Math.max(15, sevScore));
      const gwScore = v.contaminationStatus === 'High' ? 88 : v.contaminationStatus === 'Moderate' ? 62 : 25;
      const schoolScore = Math.min(100, (v.schools || 2) * 22);
      const blockStr = (v.block || '').toLowerCase();
      const agriScore = blockStr.includes('rani') || blockStr.includes('panki') ? 85 : 45;

      const initialScore = Math.round(
        (popScore * 0.25) +
        (cleanSev * 0.30) +
        (gwScore * 0.20) +
        (schoolScore * 0.15) +
        (agriScore * 0.10)
      );

      let priority: VillagePriorityItem['priority'] = 'Low';
      if (initialScore > 75) priority = 'Very High';
      else if (initialScore > 58) priority = 'High';
      else if (initialScore > 40) priority = 'Medium';

      return {
        id: v.id,
        name: v.name,
        hindiName: v.hindiName,
        district: v.district || 'Kanpur Nagar',
        block: v.block || 'Rania',
        coordinates: [
          typeof v.coordinates?.lat === 'number' ? v.coordinates.lat : ((v.coordinates as any)?.[0] ?? 26.45),
          typeof v.coordinates?.lon === 'number' ? v.coordinates.lon : ((v.coordinates as any)?.[1] ?? 80.35),
        ],
        baseScore: initialScore,
        priority,
        stats: {
          population: v.population,
          affectedRatio: `${affected} / ${total}`,
          schools: v.schools || 2,
          contaminationStatus: v.contaminationStatus || 'Moderate',
        },
        factors: {
          popExposure: popScore,
          contaminationSeverity: cleanSev,
          gwExposure: gwScore,
          sensitiveLocations: schoolScore,
          agriExposure: agriScore,
        }
      };
    });

    items.sort((a, b) => b.baseScore - a.baseScore);
    setVillages(items);
    if (items.length > 0) {
      setExpandedId(items[0].id);
      setSelectedVillageId(items[0].id);
    }
  }, []);

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  const handleRecalculate = () => {
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) return;

    const recalculated = villages.map(v => {
      const score = (
        (v.factors.popExposure * (weights.popExposure / totalWeight)) +
        (v.factors.contaminationSeverity * (weights.contaminationSeverity / totalWeight)) +
        (v.factors.gwExposure * (weights.gwExposure / totalWeight)) +
        (v.factors.sensitiveLocations * (weights.sensitiveLocations / totalWeight)) +
        (v.factors.agriExposure * (weights.agriExposure / totalWeight))
      );
      const newScore = Math.round(score);
      let newPriority: VillagePriorityItem['priority'] = 'Low';
      if (newScore > 75) newPriority = 'Very High';
      else if (newScore > 58) newPriority = 'High';
      else if (newScore > 40) newPriority = 'Medium';
      return { ...v, baseScore: newScore, priority: newPriority };
    });

    recalculated.sort((a, b) => b.baseScore - a.baseScore);
    setVillages(recalculated);
  };

  const renderMarkers = (map: any, maplibregl: any) => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    villages.forEach((v, idx) => {
      const el = document.createElement('div');
      el.className = 'cursor-pointer transform hover:scale-125 transition-transform';
      const color = getMapColor(v.priority);
      el.innerHTML = `
        <div style="
          background: ${color};
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: monospace;
          font-weight: bold;
          font-size: 11px;
        ">
          #${idx + 1}
        </div>
      `;

      el.onclick = () => {
        setExpandedId(v.id);
        setSelectedVillageId(v.id);
        map.flyTo({ center: [v.coordinates[1], v.coordinates[0]], zoom: 12 });
      };

      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
        <div style="padding: 6px 10px; font-family: sans-serif;">
          <strong style="font-size: 13px; color: #002116;">${v.name}</strong>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            Rank: #${idx + 1} · Score: ${v.baseScore} (${v.priority})
          </div>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([v.coordinates[1], v.coordinates[0]])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  // Setup MapLibre GL instance for regional prioritization
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;

    import('maplibre-gl').then((maplibreglModule: any) => {
      if (!isMounted || !mapContainerRef.current) return;
      const maplibregl = maplibreglModule.default || maplibreglModule;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [80.15, 26.35],
        zoom: 9.8,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

      map.on('load', () => {
        if (!isMounted) return;
        renderMarkers(map, maplibregl);
      });

      mapInstanceRef.current = map;
    }).catch(console.error);

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Re-render markers when villages score changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      import('maplibre-gl').then((maplibreglModule: any) => {
        const maplibregl = maplibreglModule.default || maplibreglModule;
        renderMarkers(mapInstanceRef.current, maplibregl);
      });
    }
  }, [villages]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4fbf7] text-[#0c1f18] font-sans selection:bg-[#c3ebd8] selection:text-[#002116]">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#002116] font-bold">Intervention Prioritization Index</span>
        </div>

        {/* Title Header */}
        <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-[#ddf3e7] text-[#002116] font-bold border border-stone-200">
                Decision Support Matrix
              </span>
              <span className="text-xs font-mono text-stone-500">
                Multi-Criteria Resource Allocation Engine
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#002116] tracking-tight">
              Community Intervention Prioritization
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-1 max-w-2xl">
              Equitably allocate remediation budgets, filtration plants, and medical checkups based on empirical exposure, contamination severity, and school density.
            </p>
          </div>
        </div>

        {/* Main Grid: Left Map & Sliders, Right Priority Ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Map + Sliders (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Real GIS Prioritization Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-[#2E8B68]" />
                  <h3 className="font-serif font-bold text-base text-[#002116]">
                    Regional Vulnerability Geospace (Kanpur Sector)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-stone-500">
                  Numbered by Priority Rank
                </span>
              </div>

              <div className="w-full h-80 rounded-xl overflow-hidden border border-stone-200 relative">
                <div ref={mapContainerRef} className="w-full h-full" />
                
                {/* Floating Map Legend */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-2 rounded-lg border border-stone-200 text-[10px] font-mono shadow-md space-y-1 z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-700"></span>
                    <span>Very High Priority</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                    <span>High Priority</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-600"></span>
                    <span>Medium Priority</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Factor Weight Sliders */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-[#2E8B68]" />
                  <h2 className="font-serif font-bold text-lg text-[#002116]">
                    Multi-Factor Weight Calibration
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setWeights({
                      popExposure: 25,
                      contaminationSeverity: 30,
                      gwExposure: 20,
                      sensitiveLocations: 15,
                      agriExposure: 10,
                    });
                  }}
                  className="text-xs font-mono text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Defaults
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                {Object.entries(weights).map(([key, value]) => {
                  const labelMap: Record<string, string> = {
                    popExposure: 'Population Exposure (Census)',
                    contaminationSeverity: 'Contamination Severity (Cr Plume Exceedance)',
                    gwExposure: 'Groundwater Vulnerability & Depth',
                    sensitiveLocations: 'Sensitive Receptors (Schools / Anganwadis)',
                    agriExposure: 'Agricultural Bio-Accumulation Exposure',
                  };

                  return (
                    <div key={key} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-700 font-bold">{labelMap[key] || key}</span>
                        <strong className="text-[#006492] font-mono text-sm">{value}%</strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => handleWeightChange(key as keyof typeof weights, parseInt(e.target.value))}
                        className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#2E8B68]"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-stone-500">
                  Scores normalize dynamically to 100% composite weight.
                </span>
                <button
                  onClick={handleRecalculate}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#12372a] hover:bg-[#002116] text-white rounded-xl text-xs font-mono font-bold shadow-sm transition-all cursor-pointer"
                >
                  Recalculate Priority Ranks →
                </button>
              </div>
            </div>
          </div>

          {/* Right: Priority Ranking List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex justify-between items-end mb-1">
              <div>
                <span className="text-xs font-mono text-[#006492] font-bold uppercase">INDEX RESULTS</span>
                <h3 className="font-serif font-bold text-xl text-[#002116]">Prioritized Action List</h3>
              </div>
              <span className="text-xs font-mono text-stone-500">{villages.length} Communities</span>
            </div>

            <div className="space-y-3">
              {villages.map((village, idx) => {
                const isExpanded = expandedId === village.id;
                return (
                  <div
                    key={village.id}
                    className={`bg-white rounded-2xl shadow-sm border transition-all overflow-hidden ${
                      isExpanded ? 'border-[#2E8B68] ring-2 ring-[#2E8B68]/15' : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50/70 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : village.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-mono font-bold text-xs">
                          #{idx + 1}
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-base text-[#002116]">{village.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(village.priority)}`}>
                              {village.priority} Priority
                            </span>
                            <span className="text-xs font-mono text-stone-500">
                              Score: <strong className="text-stone-800">{village.baseScore}</strong>/100
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-stone-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 border-t border-stone-100 bg-[#f4fbf7]/40 space-y-4 text-xs font-mono">
                        <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-stone-200">
                          <div>
                            <span className="text-stone-400 block text-[10px]">POPULATION</span>
                            <strong className="text-stone-900">{village.stats.population.toLocaleString()}</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">AFFECTED SOURCES</span>
                            <strong className="text-red-700">{village.stats.affectedRatio}</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">SCHOOLS</span>
                            <strong className="text-stone-900">{village.stats.schools} institutions</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">DISTRICT</span>
                            <strong className="text-stone-900">{village.district}</strong>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-stone-700 block uppercase">
                            Contributing Multi-Criteria Factors:
                          </span>
                          {[
                            { label: 'Pop. Exposure', val: village.factors.popExposure, w: weights.popExposure },
                            { label: 'Contamination Severity', val: village.factors.contaminationSeverity, w: weights.contaminationSeverity },
                            { label: 'Aquifer Vulnerability', val: village.factors.gwExposure, w: weights.gwExposure },
                            { label: 'School Density', val: village.factors.sensitiveLocations, w: weights.sensitiveLocations },
                            { label: 'Agricultural Risk', val: village.factors.agriExposure, w: weights.agriExposure },
                          ].map(f => (
                            <div key={f.label} className="space-y-0.5">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-stone-600">{f.label} (W: {f.w}%)</span>
                                <strong className="text-stone-800">{f.val}/100</strong>
                              </div>
                              <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-[#2E8B68] h-1.5 rounded-full" style={{ width: `${f.val}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex justify-end">
                          <Link
                            href={`/villages/${village.id}`}
                            className="text-[#006492] hover:text-[#002116] font-bold flex items-center gap-1"
                          >
                            Open Digital Twin Profile →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
