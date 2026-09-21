'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  ArrowRight,
  Factory,
  Layers,
  Droplets,
  Waves,
  Home,
  Wheat,
  Search,
  Map,
  TrendingUp,
  ListOrdered,
  Wrench,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Users,
  Activity,
  School,
  Sprout
} from 'lucide-react';

export default function LandingPage() {
  const { t } = useTranslation();
  const [demoPanelOpen, setDemoPanelOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-slate-900 font-sans">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-b from-white to-stone-50">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
              {/* Hero Text */}
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                  <span className="block">{t('hero.title1') || 'Know where contamination is.'}</span>
                  <span className="block text-green-700">{t('hero.title2') || 'Know who is exposed.'}</span>
                  <span className="block text-blue-700">{t('hero.title3') || 'Know what to do next.'}</span>
                </h1>
                <p className="mt-4 text-lg sm:text-xl text-slate-600 mb-8 max-w-xl leading-relaxed">
                  {t('hero.subtitle') || 'AquaShield empowers communities, researchers, and policymakers with actionable intelligence to respond to groundwater contamination crises.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <Link href="/map" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                    {t('hero.primaryCta') || 'Explore Contamination Map'}
                  </Link>
                  <Link href="/reports/new" className="inline-flex justify-center items-center px-6 py-3 border border-slate-300 text-base font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                    {t('hero.secondaryCta') || 'Report an Environmental Issue'}
                  </Link>
                  <button 
                    onClick={() => {
                      document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex justify-center items-center px-4 py-3 text-base font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {t('hero.tertiaryCta') || 'View Demo Village'} <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Hero Interactive Map Graphic */}
              <div className="relative h-[400px] sm:h-[500px] w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-stone-50/50" 
                     style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>
                
                {/* Simulated Map SVG */}
                <svg viewBox="0 0 400 400" className="w-full h-full relative z-10" preserveAspectRatio="xMidYMid meet">
                  {/* Village Areas */}
                  <path d="M 50 150 Q 100 50 200 100 T 350 150 Q 380 250 300 350 T 100 300 Z" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" opacity="0.6" />
                  <path d="M 150 150 Q 180 120 250 160 T 250 250 Q 200 280 150 220 Z" fill="#fef3c7" stroke="#fcd34d" strokeWidth="2" opacity="0.6" />
                  
                  {/* River/Water body */}
                  <path d="M -20 200 Q 100 180 200 250 T 420 220" fill="none" stroke="#bfdbfe" strokeWidth="15" strokeLinecap="round" opacity="0.8" />
                  
                  {/* Roads */}
                  <path d="M 50 50 L 350 350" fill="none" stroke="#e5e7eb" strokeWidth="6" strokeLinecap="round" strokeDasharray="10 5" />
                  <path d="M 350 50 L 50 350" fill="none" stroke="#e5e7eb" strokeWidth="6" strokeLinecap="round" />

                  {/* Contamination Dots (Red/Orange) */}
                  <circle cx="200" cy="180" r="12" fill="#ef4444" className="animate-pulse" />
                  <circle cx="200" cy="180" r="6" fill="#7f1d1d" />
                  
                  <circle cx="240" cy="150" r="10" fill="#f97316" />
                  <circle cx="170" cy="210" r="10" fill="#f97316" />
                  
                  <circle cx="280" cy="190" r="8" fill="#eab308" />
                  <circle cx="140" cy="140" r="8" fill="#eab308" />

                  {/* Water Sources (Blue) */}
                  <circle cx="100" cy="100" r="6" fill="#3b82f6" />
                  <circle cx="300" cy="100" r="6" fill="#3b82f6" />
                  <circle cx="320" cy="280" r="6" fill="#3b82f6" />
                  <circle cx="120" cy="300" r="6" fill="#3b82f6" />
                  
                  {/* Safe Sources (Green) */}
                  <circle cx="80" cy="250" r="6" fill="#22c55e" />
                  <circle cx="350" cy="150" r="6" fill="#22c55e" />

                  {/* Schools/Institutions */}
                  <rect x="250" y="220" width="16" height="16" fill="#6366f1" rx="2" />
                  <rect x="150" y="100" width="16" height="16" fill="#6366f1" rx="2" />
                </svg>

                {/* Legend Overlay */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-slate-200 text-xs z-20">
                  <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Critical Level</div>
                  <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div> High Risk</div>
                  <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Water Source</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-indigo-500"></div> School</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Problem Section: The Hidden Crisis */}
        <section className="py-16 lg:py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">{t('landing.problemTitle') || 'The Hidden Crisis'}</h2>
              <p className="text-lg text-slate-600">
                {t('landing.problemSubtitle') || 'Groundwater contamination is often invisible until health impacts appear. Understanding the pathway is the first step to intervention.'}
              </p>
            </div>

            <div className="relative">
              {/* Subtle background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-50/50 to-red-50/50 rounded-3xl -m-4 sm:-m-8 z-0 hidden lg:block"></div>
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                
                <div className="flex flex-col items-center text-center max-w-[150px]">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shadow-sm border border-slate-200 mb-4">
                    <Factory className="w-10 h-10" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Industrial Waste</h3>
                  <p className="text-xs text-slate-500">Untreated effluents</p>
                </div>

                <ArrowRight className="hidden lg:block w-8 h-8 text-slate-300" />
                <ArrowRight className="lg:hidden w-8 h-8 text-slate-300 rotate-90" />

                <div className="flex flex-col items-center text-center max-w-[150px]">
                  <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm border border-orange-100 mb-4">
                    <Layers className="w-10 h-10" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Soil Seepage</h3>
                  <p className="text-xs text-slate-500">Leaching through earth</p>
                </div>

                <ArrowRight className="hidden lg:block w-8 h-8 text-slate-300" />
                <ArrowRight className="lg:hidden w-8 h-8 text-slate-300 rotate-90" />

                <div className="flex flex-col items-center text-center max-w-[150px]">
                  <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-600 shadow-sm border border-red-100 mb-4">
                    <Waves className="w-10 h-10" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Groundwater</h3>
                  <p className="text-xs text-slate-500">Aquifer contamination</p>
                </div>

                <ArrowRight className="hidden lg:block w-8 h-8 text-slate-300" />
                <ArrowRight className="lg:hidden w-8 h-8 text-slate-300 rotate-90" />

                <div className="flex flex-col items-center text-center max-w-[150px]">
                  <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 mb-4">
                    <Droplets className="w-10 h-10" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Hand Pumps</h3>
                  <p className="text-xs text-slate-500">Extraction point</p>
                </div>

                <ArrowRight className="hidden lg:block w-8 h-8 text-slate-300" />
                <ArrowRight className="lg:hidden w-8 h-8 text-slate-300 rotate-90" />

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center max-w-[150px]">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 mb-2">
                      <Home className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm">Households</h3>
                  </div>
                  <div className="flex flex-col items-center text-center max-w-[150px]">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 mb-2">
                      <Wheat className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm">Agriculture</h3>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 lg:py-24 bg-stone-50 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">{t('landing.howItWorksTitle') || 'How AquaShield Works'}</h2>
              <p className="text-lg text-slate-600">A systematic approach to identifying, tracking, and mitigating contamination.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative z-10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">1. Detect</h3>
                <p className="text-slate-600">Gather environmental reports, field tests, and sensor data to identify potential contamination sites.</p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative z-10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6">
                  <Map className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">2. Map</h3>
                <p className="text-slate-600">Geospatially visualize affected water sources, populations, and infrastructure like schools and hospitals.</p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative z-10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">3. Predict</h3>
                <p className="text-slate-600">Use hydrological models to estimate potential spread plumes and future risk areas.</p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative z-10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-6">
                  <ListOrdered className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">4. Prioritize</h3>
                <p className="text-slate-600">Rank interventions based on exposure risk, population vulnerability, and contamination severity.</p>
              </div>

              {/* Step 5 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative z-10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">5. Remediate</h3>
                <p className="text-slate-600">Deploy targeted solutions such as alternative water sources, filtration systems, or policy actions.</p>
              </div>

              {/* Step 6 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative z-10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">6. Verify</h3>
                <p className="text-slate-600">Continuously monitor remediated sites with updated lab tests to ensure long-term safety.</p>
              </div>

            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo-section" className="py-16 lg:py-24 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">Interactive Demo</h2>
              <p className="text-lg text-slate-600">See how village-level intelligence is presented.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-stone-50 rounded-2xl p-6 lg:p-10 border border-stone-200 shadow-inner flex flex-col md:flex-row gap-8 items-start">
              
              {/* Clickable Map Card */}
              <div 
                className="w-full md:w-1/2 cursor-pointer group relative rounded-xl overflow-hidden shadow-md border border-slate-200 bg-white"
                onClick={() => setDemoPanelOpen(!demoPanelOpen)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setDemoPanelOpen(!demoPanelOpen); }}
              >
                <div className="aspect-[4/3] bg-slate-100 relative" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                  {/* Map Pin */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 ${demoPanelOpen ? 'bg-red-600 text-white' : 'bg-white text-red-600 border-2 border-red-600 group-hover:bg-red-50'}`}>
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="mt-2 bg-slate-900 text-white text-xs px-2 py-1 rounded font-medium shadow-sm">Khanchandpur (DEMO)</div>
                  </div>
                  
                  {/* Overlay pulse instruction */}
                  {!demoPanelOpen && (
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <span className="inline-block bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-slate-700 shadow-sm border border-slate-200 animate-bounce">
                        Click to explore village data
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Panel */}
              <div className="w-full md:w-1/2 flex flex-col h-full justify-center">
                {demoPanelOpen ? (
                  <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider rounded mb-2">Critical Priority</span>
                        <h3 className="text-2xl font-bold text-slate-900">Khanchandpur</h3>
                        <p className="text-slate-500 text-sm">Demo Village Profile</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center text-slate-500 mb-1"><Users className="w-4 h-4 mr-1.5" /> <span className="text-xs font-medium uppercase">Population</span></div>
                        <div className="text-lg font-bold text-slate-900">8,240</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <div className="flex items-center text-red-700 mb-1"><Droplets className="w-4 h-4 mr-1.5" /> <span className="text-xs font-medium uppercase">High Risk Sources</span></div>
                        <div className="text-lg font-bold text-red-700">6 <span className="text-sm font-normal text-red-500">/ 17 total</span></div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center text-slate-500 mb-1"><School className="w-4 h-4 mr-1.5" /> <span className="text-xs font-medium uppercase">Schools</span></div>
                        <div className="text-lg font-bold text-slate-900">3</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center text-slate-500 mb-1"><Activity className="w-4 h-4 mr-1.5" /> <span className="text-xs font-medium uppercase">Recent Tests</span></div>
                        <div className="text-lg font-bold text-slate-900">24</div>
                      </div>
                    </div>

                    <Link href="/dashboard" className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors">
                      Explore Full Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <p>Select a location on the map to view detailed local intelligence.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Dual Persona Split Section */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              
              {/* For Communities */}
              <div className="bg-slate-800 rounded-2xl p-8 lg:p-10 border border-slate-700">
                <div className="w-14 h-14 rounded-2xl bg-green-500/20 text-green-400 flex items-center justify-center mb-6">
                  <Home className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">For Communities</h3>
                <p className="text-slate-300 mb-6 line-clamp-3">Access clear, understandable information about the water safety in your immediate area and learn what practical steps you can take.</p>
                
                <ul className="space-y-3 mb-8 text-slate-300">
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-green-400 mr-3 shrink-0" /> Check nearby hand pump safety status</li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-green-400 mr-3 shrink-0" /> Learn safe usage guidelines (e.g. washing vs drinking)</li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-green-400 mr-3 shrink-0" /> Report new issues in your locality</li>
                </ul>

                <Link href="/water-safety" className="inline-flex justify-center items-center px-5 py-2.5 border-2 border-green-500 text-sm font-semibold rounded-md text-green-400 hover:bg-green-500 hover:text-slate-900 transition-colors w-full sm:w-auto">
                  Check Local Water Safety
                </Link>
              </div>

              {/* For Researchers */}
              <div className="bg-slate-800 rounded-2xl p-8 lg:p-10 border border-slate-700">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
                  <Activity className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">For Researchers & Admins</h3>
                <p className="text-slate-300 mb-6">Access aggregate data, hydrological models, and risk prioritization tools to coordinate large-scale response efforts.</p>
                
                <ul className="space-y-3 mb-8 text-slate-300">
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-blue-400 mr-3 shrink-0" /> Geospatial analysis of contaminant plumes</li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-blue-400 mr-3 shrink-0" /> Prioritization matrices for intervention</li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-blue-400 mr-3 shrink-0" /> Exportable datasets and demographic overlay</li>
                </ul>

                <Link href="/dashboard" className="inline-flex justify-center items-center px-5 py-2.5 border-2 border-blue-500 text-sm font-semibold rounded-md text-blue-400 hover:bg-blue-500 hover:text-slate-900 transition-colors w-full sm:w-auto">
                  Access Intelligence Dashboard
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Data to Action Visual */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">From Data to Action</h2>
            </div>
            
            <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 lg:gap-8">
              
              <div className="flex-1 bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-wide">DATA</h3>
                <ul className="space-y-2 text-sm text-slate-600 flex-grow">
                  <li>• Lab Test Results</li>
                  <li>• Field Reports</li>
                  <li>• Sensor Readings</li>
                  <li>• Village Demographics</li>
                </ul>
              </div>

              <div className="hidden md:flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-slate-300" />
              </div>

              <div className="flex-1 bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col">
                <h3 className="text-lg font-bold text-blue-900 mb-4 tracking-wide">INTELLIGENCE</h3>
                <ul className="space-y-2 text-sm text-blue-800 flex-grow">
                  <li>• Risk Heatmaps</li>
                  <li>• Spread Prediction Models</li>
                  <li>• Population Exposure Stats</li>
                  <li>• Prioritization Scoring</li>
                </ul>
              </div>

              <div className="hidden md:flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-slate-300" />
              </div>

              <div className="flex-1 bg-green-50 p-6 rounded-xl border border-green-100 flex flex-col">
                <h3 className="text-lg font-bold text-green-900 mb-4 tracking-wide">ACTION</h3>
                <ul className="space-y-2 text-sm text-green-800 flex-grow">
                  <li>• Filter Distribution</li>
                  <li>• New Safe Sources</li>
                  <li>• Community Warnings</li>
                  <li>• Policy Enforcement</li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="py-8 bg-[#fafaf9]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 mb-1">Important Data Disclaimer</h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  AquaShield provides estimated risk profiles based on modeling, sparse field tests, and reported data. <strong>It does not replace certified laboratory testing.</strong> All synthetic or demonstration data is clearly marked as [DEMO DATA]. Always consult local health authorities for definitive guidance.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
