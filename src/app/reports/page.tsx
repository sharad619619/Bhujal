'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { communityReports, villages } from '@/lib/data';
import { AlertTriangle, Filter, Image as ImageIcon, MapPin, Calendar, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function ReportsDashboardPage() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState('All');
  const [villageFilter, setVillageFilter] = useState('All');

  const filteredReports = communityReports.filter(report => {
    if (statusFilter !== 'All' && report.status !== statusFilter) return false;
    if (villageFilter !== 'All' && report.villageId !== villageFilter) return false;
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reported': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Under Review': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Field Verified': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Lab Verified': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Confirmed': return 'bg-red-100 text-red-800 border-red-200';
      case 'Closed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 mb-8 rounded shadow-sm">
          <AlertTriangle className="inline-block w-5 h-5 mr-2 -mt-1" />
          <span className="font-semibold text-sm">DEMO DATA: The reports listed below are simulated for demonstration purposes.</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Community Reports</h1>
            <p className="text-slate-600">{communityReports.length} total observations submitted</p>
          </div>
          
          <Link href="/reports/new" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors whitespace-nowrap">
            + Submit New Report
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Filter className="w-5 h-5" /> Filters:
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Under Review">Under Review</option>
            <option value="Field Verified">Field Verified</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Closed">Closed</option>
          </select>

          <select 
            value={villageFilter} 
            onChange={(e) => setVillageFilter(e.target.value)}
            className="w-full sm:w-auto p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="All">All Villages</option>
            {villages.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Reports List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map(report => {
            const village = villages.find(v => v.id === report.villageId);
            return (
              <div key={report.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono font-bold text-slate-500">{report.id}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{report.category}</h3>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    "{report.description}"
                  </p>

                  <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{village?.name || 'Unknown Location'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                    {report.hasPhoto && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <ImageIcon className="w-4 h-4 flex-shrink-0" />
                        <span>Photo attached</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-slate-50 p-3 border-t border-slate-100 text-center">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800">View Full Details →</button>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredReports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 text-lg">No reports found matching your filters.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
