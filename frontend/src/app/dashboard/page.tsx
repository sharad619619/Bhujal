'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MapPin, Droplets, AlertTriangle, Wrench, MessageSquare, Clock, 
  Map as MapIcon, PlusCircle, CheckCircle, FileText
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { demoTimelineEvents } from '@/lib/data';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [selectedVillageId, setSelectedVillageId] = React.useState('V-001');

  const villagesMap: Record<string, { affected: number; verified: number; highPriority: number; activeRem: number; reports: number; lastUpdate: string; block: string }> = {
    'V-001': { affected: 17, verified: 42, highPriority: 8, activeRem: 4, reports: 126, lastUpdate: '12 Sep 2026', block: 'Rania' },
    'V-002': { affected: 8, verified: 28, highPriority: 5, activeRem: 2, reports: 64, lastUpdate: '20 Aug 2026', block: 'Rania' },
    'V-003': { affected: 10, verified: 35, highPriority: 7, activeRem: 3, reports: 88, lastUpdate: '05 Sep 2026', block: 'Kalyanpur' },
    'V-004': { affected: 5, verified: 19, highPriority: 2, activeRem: 1, reports: 32, lastUpdate: '15 Jul 2026', block: 'Sachendi' },
    'V-005': { affected: 7, verified: 24, highPriority: 1, activeRem: 1, reports: 22, lastUpdate: '10 Jun 2026', block: 'Ghatampur' },
  };

  const currentStats = villagesMap[selectedVillageId] || villagesMap['V-001'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      {/* Demo Banner */}
      <div className="bg-amber-100 border-b border-amber-200 text-amber-800 px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        <span>DEMO DATA — This data is synthetic and for demonstration purposes only</span>
        <Link href={`/villages/${selectedVillageId}`} className="ml-2 font-bold underline hover:text-amber-900">
          🚀 Open Digital Twin for Selected Village &rarr;
        </Link>
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Environmental Situation Overview</h1>
            <p className="text-sm text-slate-500 mt-1">Real-time indicators across monitored clusters</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
            <select className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer">
              <option>Uttar Pradesh</option>
            </select>
            <span className="text-slate-400 text-xs">→</span>
            <select className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer">
              <option>Kanpur Nagar</option>
            </select>
            <span className="text-slate-400 text-xs">→</span>
            <span className="text-sm font-medium text-slate-700 px-1">{currentStats.block}</span>
            <span className="text-slate-400 text-xs">→</span>
            <select 
              value={selectedVillageId}
              onChange={(e) => setSelectedVillageId(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-blue-700 focus:ring-0 cursor-pointer"
            >
              <option value="V-001">Khanchandpur (Demo Main)</option>
              <option value="V-002">Rania</option>
              <option value="V-003">Panki</option>
              <option value="V-004">Sachendi</option>
              <option value="V-005">Rooma</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard 
            icon={<MapPin className="w-6 h-6 text-amber-600" />} 
            label="Affected Locations" 
            value={String(currentStats.affected)} 
            bgColor="bg-amber-100" 
          />
          <KpiCard 
            icon={<Droplets className="w-6 h-6 text-blue-600" />} 
            label="Verified Water Sources" 
            value={String(currentStats.verified)} 
            bgColor="bg-blue-100" 
          />
          <KpiCard 
            icon={<AlertTriangle className="w-6 h-6 text-red-600" />} 
            label="High-Priority Locations" 
            value={String(currentStats.highPriority)} 
            bgColor="bg-red-100" 
          />
          <KpiCard 
            icon={<Wrench className="w-6 h-6 text-green-600" />} 
            label="Active Remediation Sites" 
            value={String(currentStats.activeRem)} 
            bgColor="bg-green-100" 
          />
          <KpiCard 
            icon={<MessageSquare className="w-6 h-6 text-purple-600" />} 
            label="Community Reports" 
            value={String(currentStats.reports)} 
            bgColor="bg-purple-100" 
          />
          <KpiCard 
            icon={<Clock className="w-6 h-6 text-slate-600" />} 
            label="Last Data Update" 
            value={currentStats.lastUpdate} 
            bgColor="bg-slate-100" 
            valueSize="text-sm font-semibold"
          />
        </div>


        {/* Map Preview & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Preview */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800">Contamination Overview</h2>
              <Link href="/map" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                View Full Map <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className="relative flex-grow min-h-[300px] bg-[#e5e7eb]">
              {/* Fake map background using SVG or just a colored block */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cartographer.png")' }}></div>
              
              {/* Colored dots */}
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50 border-2 border-white animate-pulse"></div>
              <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50 border-2 border-white"></div>
              <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-red-500 rounded-full shadow-lg border-2 border-white"></div>
              <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-green-500 rounded-full shadow-lg border-2 border-white"></div>
              <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-amber-500 rounded-full shadow-lg border-2 border-white"></div>
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-slate-200 flex justify-between text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> High Concern</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Elevated</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Lower</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
            </div>
            <div className="p-0 overflow-y-auto max-h-[400px]">
              <ul className="divide-y divide-slate-100">
                {demoTimelineEvents.slice(0, 7).map((event) => (
                  <li key={event.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-4 items-start">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{event.title}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard 
              title="View Map" 
              description="Explore detailed contamination maps and data layers."
              icon={<MapIcon className="w-6 h-6 text-blue-600" />}
              href="/map"
            />
            <ActionCard 
              title="Submit Report" 
              description="Report new community observations or health issues."
              icon={<PlusCircle className="w-6 h-6 text-green-600" />}
              href="/reports/new"
            />
            <ActionCard 
              title="Check Water Safety" 
              description="Verify if a specific water source is safe for use."
              icon={<CheckCircle className="w-6 h-6 text-amber-600" />}
              href="/water-safety"
            />
            <ActionCard 
              title="View Evidence" 
              description="Access documents, lab results, and research papers."
              icon={<FileText className="w-6 h-6 text-purple-600" />}
              href="/evidence"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function KpiCard({ icon, label, value, bgColor, valueSize = "text-3xl" }: { icon: React.ReactNode, label: string, value: string, bgColor: string, valueSize?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-sm font-medium text-slate-500 mb-1">{label}</div>
      <div className={`${valueSize} font-bold text-slate-900`}>{value}</div>
    </div>
  );
}

function ActionCard({ title, description, icon, href }: { title: string, description: string, icon: React.ReactNode, href: string }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all h-full">
        <div className="mb-4 bg-slate-50 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-2 group-hover:text-blue-700">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
