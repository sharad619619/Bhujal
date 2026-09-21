'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { villages, waterSources, communityReports } from '@/lib/data';
import { AlertTriangle, Map, Users, Droplets, Home, Activity, MapPin, Search } from 'lucide-react';
import Link from 'next/link';

export default function VillageDigitalTwinPage() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params.id as string;
  const [year, setYear] = useState(2024);
  const [activeTab, setActiveTab] = useState('measurements');

  const village = villages.find(v => v.id === id);
  const sources = waterSources.filter(s => s.villageId === id);
  const reports = communityReports.filter(r => r.villageId === id);

  if (!village) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Village not found</h1>
            <Link href="/villages" className="text-blue-600 hover:underline">Return to Villages List</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Simulated temporal data variations
  const simulationFactor = (year - 2018) / 8; // 0 to 1
  const totalWaterSources = village.totalWaterSources ?? 10;
  const affectedWaterSources = village.affectedWaterSources ?? 5;
  const simAffected = Math.max(0, Math.min(totalWaterSources, Math.round(affectedWaterSources * (0.2 + simulationFactor))));
  const simRisk = simAffected > 3 ? 'High' : simAffected > 0 ? 'Moderate' : 'Low';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-7xl">
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-3 mb-6 rounded shadow-sm text-sm">
          <strong>DEMO DATA:</strong> Digital Twin visualization is running on simulated synthetic data.
        </div>

        <div className="mb-6">
          <Link href="/villages" className="text-blue-600 hover:underline text-sm mb-2 inline-block">← Back to Communities</Link>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{village.name} Digital Twin</h1>
              <p className="text-xl text-slate-500 font-medium">{village.hindiName}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold text-sm ${simRisk === 'High' ? 'bg-red-100 text-red-800' : simRisk === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
              Current Assessment: {simRisk} Risk
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Left: Map Area (60%) */}
          <div className="lg:w-3/5 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Map className="w-5 h-5" /> Subsurface Contamination Map</h3>
              <span className="text-sm bg-slate-100 px-2 py-1 rounded border border-slate-200">Year: {year}</span>
            </div>
            
            <div className="bg-slate-200 rounded-lg flex-grow min-h-[400px] relative overflow-hidden flex items-center justify-center">
              {/* Map Placeholder */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10 10h80v80h-80z\' stroke=\'%23000\' fill=\'none\'/%3E%3C/svg%3E")',
                backgroundSize: '50px 50px'
              }}></div>
              <p className="text-slate-500 font-medium z-10 flex flex-col items-center gap-2">
                <MapPin className="w-8 h-8" />
                Interactive Map View Disabled in Demo Mode
              </p>
              
              {/* Simulated plume visualization */}
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-500 rounded-full blur-3xl" style={{ opacity: 0.1 + (simulationFactor * 0.4) }}></div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                <span>Historical Data (2018)</span>
                <span>Current (2026)</span>
              </div>
              <input 
                type="range" 
                min="2018" 
                max="2026" 
                value={year} 
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Right: Stats Summary (40%) */}
          <div className="lg:w-2/5 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Community Profile</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-sm text-slate-500 flex items-center gap-1.5"><Users className="w-4 h-4" /> Population</div>
                  <div className="text-xl font-bold text-slate-900">{village.population.toLocaleString()}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-sm text-slate-500 flex items-center gap-1.5"><Home className="w-4 h-4" /> Households</div>
                  <div className="text-xl font-bold text-slate-900">{Math.round(village.population / 4.5).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-grow">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Environmental Metrics ({year})</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-500" /> Monitored Sources</span>
                  <span className="font-bold text-slate-900">{village.totalWaterSources}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Affected Sources</span>
                  <span className="font-bold text-red-600">{simAffected}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-500" /> Avg Groundwater Depth</span>
                  <span className="font-bold text-slate-900">12.5 meters</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Predicted Risk Zones</span>
                  <span className="font-bold text-slate-900">{simAffected > 0 ? 'Active' : 'Clear'}</span>
                </div>
                
                {/* Progress bar simulation */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">Contamination Spread Proxy</span>
                    <span>{Math.round(simulationFactor * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${simulationFactor * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Area */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {['measurements', 'reports', 'remediation', 'timeline'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-700 bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="p-6">
            {activeTab === 'measurements' && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Water Measurements</h3>
                {sources.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="p-3 rounded-tl-lg">Source ID</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Last Tested</th>
                          <th className="p-3">Contaminant</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sources.map(source => (
                          <tr key={source.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="p-3 font-medium text-slate-900">{source.name}</td>
                            <td className="p-3 text-slate-600">{source.type}</td>
                            <td className="p-3 text-slate-600">{new Date(source.lastTestedDate || '').toLocaleDateString()}</td>
                            <td className="p-3 text-slate-600">{source.contaminant || 'N/A'}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${source.status === 'SAFE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {source.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No measurement data available for this village.</p>
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Community Reports</h3>
                {reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map(report => (
                      <div key={report.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold text-slate-900">{report.category}</span>
                          <span className="text-sm text-slate-500">{new Date(report.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-2">{report.description}</p>
                        <span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-700">{report.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No community reports submitted for this area.</p>
                )}
              </div>
            )}

            {activeTab === 'remediation' && (
              <div className="py-8 text-center text-slate-500">
                <p>No active remediation projects documented for this village.</p>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="py-8 text-center text-slate-500">
                <p>Historical timeline data is currently being synthesized.</p>
              </div>
            )}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
