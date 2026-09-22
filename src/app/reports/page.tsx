'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { getDb, CommunityReportRecord } from '@/lib/db/store';
import { 
  Filter, 
  Image as ImageIcon, 
  MapPin, 
  Calendar, 
  Search, 
  Plus, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function ReportsDashboardPage() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<CommunityReportRecord[]>([]);
  const [villages, setVillages] = useState<{ id: string; name: string }[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [villageFilter, setVillageFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<CommunityReportRecord | null>(null);

  const loadData = () => {
    const db = getDb();
    setReports(db.getCommunityReports());
    setVillages(db.getVillages().map(v => ({ id: v.id, name: v.name })));
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('bhujal_data_updated', handleUpdate);
    return () => window.removeEventListener('bhujal_data_updated', handleUpdate);
  }, []);

  const filteredReports = reports.filter(report => {
    if (statusFilter !== 'All' && report.status !== statusFilter) return false;
    if (villageFilter !== 'All' && report.villageId !== villageFilter) return false;
    if (categoryFilter !== 'All' && report.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = report.id.toLowerCase().includes(q);
      const matchDesc = report.description.toLowerCase().includes(q);
      const matchCat = report.category.toLowerCase().includes(q);
      const matchLoc = report.locationName?.toLowerCase().includes(q) || false;
      if (!matchId && !matchDesc && !matchCat && !matchLoc) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Reported':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200"><Clock className="w-3 h-3" /> Submitted</span>;
      case 'Under Review':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200"><Clock className="w-3 h-3" /> Under Review</span>;
      case 'Field Verified':
      case 'Lab Verified':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200"><CheckCircle2 className="w-3 h-3" /> Lab Verified</span>;
      case 'Confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200"><AlertCircle className="w-3 h-3" /> Contamination Confirmed</span>;
      case 'Closed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Remediation Resolved</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">{status}</span>;
    }
  };

  const categories = Array.from(new Set(reports.map(r => r.category))).filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4fbf7] text-[#0c1f18] font-sans selection:bg-[#c3ebd8] selection:text-[#002116]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-6">
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#002116] font-bold">Community Reports &amp; Field Telemetry</span>
        </div>

        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-[#ddf3e7] text-[#002116] font-bold border border-stone-200">
                Participatory Sentinel Network
              </span>
              <span className="text-xs font-mono text-stone-500">
                {reports.length} observations documented
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#002116] tracking-tight">
              Community Ground Observations
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-1 max-w-2xl">
              Citizen reports of yellow coloration, chemical taste, or gastrointestinal incidents across Kanpur Nagar, Kanpur Dehat, and Fatehpur.
            </p>
          </div>
          
          <Link 
            href="/reports/new" 
            className="flex items-center gap-2 px-6 py-3 bg-[#12372a] hover:bg-[#002116] text-white font-mono text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>+ Submit Observation</span>
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by Report ID, village, or symptoms (e.g., 'yellow water', 'Panki')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#2E8B68] focus:bg-white font-mono text-stone-800 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Select Filters */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
              <div className="flex items-center gap-1.5 text-xs font-mono text-stone-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>
              
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-stone-200 bg-stone-50 rounded-xl focus:ring-2 focus:ring-[#2E8B68] text-xs font-mono text-stone-800 outline-none"
              >
                <option value="All">All Statuses ({reports.length})</option>
                <option value="Reported">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Field Verified">Field Verified</option>
                <option value="Confirmed">Confirmed Contamination</option>
                <option value="Closed">Remediation Resolved</option>
              </select>

              <select 
                value={villageFilter} 
                onChange={(e) => setVillageFilter(e.target.value)}
                className="p-2 border border-stone-200 bg-stone-50 rounded-xl focus:ring-2 focus:ring-[#2E8B68] text-xs font-mono text-stone-800 outline-none"
              >
                <option value="All">All Locations</option>
                {villages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>

              {categories.length > 0 && (
                <select 
                  value={categoryFilter} 
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="p-2 border border-stone-200 bg-stone-50 rounded-xl focus:ring-2 focus:ring-[#2E8B68] text-xs font-mono text-stone-800 outline-none"
                >
                  <option value="All">All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Active Result Count */}
          <div className="flex items-center justify-between text-xs font-mono text-stone-500 pt-2 border-t border-stone-100">
            <span>Showing {filteredReports.length} of {reports.length} reports</span>
            {(statusFilter !== 'All' || villageFilter !== 'All' || categoryFilter !== 'All' || searchQuery) && (
              <button 
                onClick={() => {
                  setStatusFilter('All');
                  setVillageFilter('All');
                  setCategoryFilter('All');
                  setSearchQuery('');
                }}
                className="text-[#2E8B68] hover:underline font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map(report => {
            const villageName = villages.find(v => v.id === report.villageId)?.name || report.locationName || 'Unknown Location';
            return (
              <div 
                key={report.id} 
                className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md hover:border-[#2E8B68]/50 transition-all flex flex-col justify-between"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <span className="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {report.id}
                    </span>
                    {getStatusBadge(report.status)}
                  </div>
                  
                  <h3 className="text-base font-serif font-bold text-[#002116] mb-2 leading-snug">
                    {report.category}
                  </h3>
                  
                  <p className="text-stone-600 text-xs sm:text-sm mb-4 line-clamp-3 leading-relaxed">
                    "{report.description}"
                  </p>

                  <div className="space-y-2 text-xs font-mono text-stone-500 pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#2E8B68] flex-shrink-0" />
                      <span className="truncate font-semibold text-stone-700">{villageName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                      <span>{new Date(report.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    {report.hasPhoto && (
                      <div className="flex items-center gap-2 text-emerald-700 font-bold">
                        <ImageIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Visual Evidence Attached</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#f2f8f5] px-5 py-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-stone-500">
                    {report.verified ? '✓ Lab Verified' : 'Pending Verification'}
                  </span>
                  <button 
                    onClick={() => setSelectedReport(report)}
                    className="text-xs font-mono font-bold text-[#006492] hover:text-[#002116] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredReports.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300">
            <AlertCircle className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <p className="text-stone-700 font-serif text-lg font-bold">No community reports found</p>
            <p className="text-stone-500 text-xs font-mono mt-1">Try clearing your search query or loosening filter criteria.</p>
            <button 
              onClick={() => {
                setStatusFilter('All');
                setVillageFilter('All');
                setCategoryFilter('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-mono rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Report Inspection Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl">
              <div className="p-6 border-b border-stone-200 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded">
                      {selectedReport.id}
                    </span>
                    {getStatusBadge(selectedReport.status)}
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#002116]">
                    {selectedReport.category}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 text-sm">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-stone-400 mb-1">Description</h4>
                  <p className="text-stone-800 bg-stone-50 p-4 rounded-xl leading-relaxed border border-stone-200">
                    {selectedReport.description}
                  </p>
                </div>

                {selectedReport.photoUrl && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase text-stone-400 mb-2">Photographic Evidence</h4>
                    <div className="rounded-xl overflow-hidden border border-stone-200 max-h-72 bg-black flex items-center justify-center">
                      <img 
                        src={selectedReport.photoUrl} 
                        alt="Submitted evidence" 
                        className="max-h-72 object-contain w-full"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-[#f2f8f5] p-4 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-stone-500 block">LOCATION</span>
                    <strong className="text-stone-900 text-sm">
                      {villages.find(v => v.id === selectedReport.villageId)?.name || selectedReport.locationName || 'Rural Cluster'}
                    </strong>
                    {selectedReport.coordinates && (
                      <span className="text-stone-500 text-[11px] block mt-0.5">
                        {(typeof (selectedReport.coordinates as any)?.lat === 'number' ? (selectedReport.coordinates as any).lat : (selectedReport.coordinates as any)?.[1] ?? 26.4481).toFixed(4)}°N, {(typeof (selectedReport.coordinates as any)?.lon === 'number' ? (selectedReport.coordinates as any).lon : (selectedReport.coordinates as any)?.[0] ?? 80.0102).toFixed(4)}°E
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-stone-500 block">SUBMISSION DATE</span>
                    <strong className="text-stone-900 text-sm">
                      {new Date(selectedReport.date).toLocaleString()}
                    </strong>
                  </div>

                  {selectedReport.reporterName && (
                    <div>
                      <span className="text-stone-500 block">OBSERVER</span>
                      <strong className="text-stone-900">{selectedReport.reporterName}</strong>
                    </div>
                  )}

                  {selectedReport.reporterPhone && (
                    <div>
                      <span className="text-stone-500 block">CONTACT</span>
                      <strong className="text-stone-900">{selectedReport.reporterPhone}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-3">
                <Link
                  href={`/map?lat=${typeof (selectedReport.coordinates as any)?.lat === 'number' ? (selectedReport.coordinates as any).lat : (selectedReport.coordinates as any)?.[1] ?? 26.4481}&lon=${typeof (selectedReport.coordinates as any)?.lon === 'number' ? (selectedReport.coordinates as any).lon : (selectedReport.coordinates as any)?.[0] ?? 80.0102}`}
                  className="px-4 py-2 bg-white border border-stone-300 text-stone-800 rounded-xl text-xs font-mono font-bold hover:bg-stone-100 flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#2E8B68]" />
                  Locate on Spatial Map
                </Link>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-[#002116] text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

