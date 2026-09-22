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
  ChevronRight,
  ShieldAlert,
  ExternalLink,
  Maximize2
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
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

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
    if (statusFilter !== 'All' && report.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (villageFilter !== 'All' && report.villageId !== villageFilter) return false;
    if (categoryFilter !== 'All' && report.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = report.id.toLowerCase().includes(q);
      const matchTitle = (report.title || '').toLowerCase().includes(q);
      const matchDesc = report.description.toLowerCase().includes(q);
      const matchCat = report.category.toLowerCase().includes(q);
      const matchLoc = (report.locationName || '').toLowerCase().includes(q);
      const matchVillage = villages.find(v => v.id === report.villageId)?.name.toLowerCase().includes(q) || false;
      if (!matchId && !matchTitle && !matchDesc && !matchCat && !matchLoc && !matchVillage) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('report') || s === 'new') {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200"><Clock className="w-3 h-3" /> Reported</span>;
    }
    if (s.includes('under_review') || s.includes('review') || s.includes('investigat')) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200"><Clock className="w-3 h-3" /> Under Review</span>;
    }
    if (s.includes('field') || s.includes('lab') || s.includes('verified')) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200"><CheckCircle2 className="w-3 h-3" /> Verified</span>;
    }
    if (s.includes('confirm')) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200"><AlertCircle className="w-3 h-3" /> Confirmed</span>;
    }
    if (s.includes('resolve') || s.includes('closed')) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">{status}</span>;
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-100 text-red-800 border border-red-200">Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-orange-100 text-orange-800 border border-orange-200">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-stone-100 text-stone-600 border border-stone-200">Low</span>;
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
              Real-time citizen reporting of hexavalent chromium discoloration, chemical taste, or industrial discharge across Kanpur Nagar, Kanpur Dehat, and Fatehpur.
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
                placeholder="Search by Report ID, village, or symptoms (e.g., 'yellow water', 'Rania', 'HP-016')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#2E8B68] focus:bg-white font-mono text-stone-800 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
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
                className="p-2 border border-stone-200 bg-stone-50 rounded-xl focus:ring-2 focus:ring-[#2E8B68] text-xs font-mono text-stone-800 outline-none cursor-pointer"
              >
                <option value="All">All Statuses ({reports.length})</option>
                <option value="Reported">Reported</option>
                <option value="Under Review">Under Review</option>
                <option value="Field Verified">Field Verified</option>
                <option value="Lab Verified">Lab Verified</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select 
                value={villageFilter} 
                onChange={(e) => setVillageFilter(e.target.value)}
                className="p-2 border border-stone-200 bg-stone-50 rounded-xl focus:ring-2 focus:ring-[#2E8B68] text-xs font-mono text-stone-800 outline-none cursor-pointer"
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
                  className="p-2 border border-stone-200 bg-stone-50 rounded-xl focus:ring-2 focus:ring-[#2E8B68] text-xs font-mono text-stone-800 outline-none cursor-pointer"
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
            <span>Showing <strong className="text-stone-900">{filteredReports.length}</strong> of <strong className="text-stone-900">{reports.length}</strong> reports</span>
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
            const villageObj = villages.find(v => v.id === report.villageId);
            const villageName = villageObj?.name || report.locationName || 'Rural Cluster';
            const photoSrc = report.photoUrl || report.photoDataUrl;

            return (
              <div 
                key={report.id} 
                className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md hover:border-[#2E8B68]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Banner if available */}
                  {photoSrc && (
                    <div className="relative h-40 w-full overflow-hidden bg-stone-900 group">
                      <img 
                        src={photoSrc} 
                        alt={report.title || report.category} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      <span className="absolute bottom-2 left-3 text-[10px] font-mono bg-black/70 text-emerald-300 px-2 py-0.5 rounded flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> Photographic Evidence
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2.5 gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                          {report.id}
                        </span>
                        {getPriorityBadge(report.priority)}
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                    
                    <h3 className="text-base font-serif font-bold text-[#002116] mb-1.5 leading-snug">
                      {report.title || report.category}
                    </h3>
                    
                    <p className="text-stone-600 text-xs mb-4 line-clamp-2 leading-relaxed">
                      "{report.description}"
                    </p>

                    <div className="space-y-1.5 text-xs font-mono text-stone-500 pt-3 border-t border-stone-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#2E8B68] shrink-0" />
                          <Link 
                            href={`/villages/${report.villageId}`}
                            className="font-semibold text-stone-800 hover:text-[#006492] hover:underline truncate"
                            title="Open Village Digital Twin"
                          >
                            {villageName}
                          </Link>
                        </div>
                        {report.waterSourceId && (
                          <span className="text-[11px] bg-sky-50 text-[#006492] px-1.5 py-0.5 rounded font-bold">
                            {report.waterSourceId}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          {new Date(report.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        <span>{report.reporterType || 'Resident'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f2f8f5] px-5 py-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-stone-500 truncate max-w-[170px]">
                    {report.verificationStatus || 'Awaiting Field Survey'}
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl">
              <div className="p-6 border-b border-stone-200 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded">
                      {selectedReport.id}
                    </span>
                    {getPriorityBadge(selectedReport.priority)}
                    {getStatusBadge(selectedReport.status)}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#002116]">
                    {selectedReport.title || selectedReport.category}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 text-sm">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-stone-400 mb-1.5">Description</h4>
                  <p className="text-stone-800 bg-stone-50 p-4 rounded-xl leading-relaxed border border-stone-200 font-sans text-sm">
                    "{selectedReport.description}"
                  </p>
                </div>

                {/* Render Actual Uploaded Image / Evidence */}
                {(selectedReport.photoUrl || selectedReport.photoDataUrl) && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-mono font-bold uppercase text-stone-400">Photographic Evidence</h4>
                      <button
                        onClick={() => setEnlargedImage(selectedReport.photoUrl || selectedReport.photoDataUrl || null)}
                        className="text-xs font-mono text-[#006492] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> Full View
                      </button>
                    </div>
                    <div 
                      onClick={() => setEnlargedImage(selectedReport.photoUrl || selectedReport.photoDataUrl || null)}
                      className="rounded-xl overflow-hidden border border-stone-200 max-h-80 bg-black flex items-center justify-center cursor-zoom-in"
                    >
                      <img 
                        src={selectedReport.photoUrl || selectedReport.photoDataUrl} 
                        alt="Submitted evidence" 
                        className="max-h-80 object-contain w-full"
                      />
                    </div>
                  </div>
                )}

                {/* Geography & Location Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-[#f2f8f5] p-4 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-stone-500 block text-[10px]">VILLAGE / COMMUNITY</span>
                    <Link
                      href={`/villages/${selectedReport.villageId}`}
                      className="text-stone-900 text-sm font-bold hover:text-[#006492] flex items-center gap-1"
                    >
                      {villages.find(v => v.id === selectedReport.villageId)?.name || 'Rural Cluster'}
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </Link>
                    <span className="text-stone-500 text-[11px] block mt-0.5">
                      {selectedReport.locationName || 'Local Panchayat Ward'}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px]">COORDINATES</span>
                    <strong className="text-stone-900 text-sm">
                      {(typeof (selectedReport.coordinates as any)?.lat === 'number' ? (selectedReport.coordinates as any).lat : (selectedReport.coordinates as any)?.[1] ?? 26.4481).toFixed(4)}°N, {(typeof (selectedReport.coordinates as any)?.lon === 'number' ? (selectedReport.coordinates as any).lon : (selectedReport.coordinates as any)?.[0] ?? 80.0102).toFixed(4)}°E
                    </strong>
                    {selectedReport.waterSourceId && (
                      <span className="text-stone-600 text-[11px] block mt-0.5">
                        Linked Source: <strong className="text-[#006492]">{selectedReport.waterSourceId}</strong>
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px]">SUBMISSION DATE</span>
                    <strong className="text-stone-900">
                      {new Date(selectedReport.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </strong>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px]">VERIFICATION PROGRESS</span>
                    <strong className="text-emerald-800 font-bold">
                      {selectedReport.verificationStatus || 'En route to District Team'}
                    </strong>
                  </div>

                  {selectedReport.reporterType && (
                    <div>
                      <span className="text-stone-500 block text-[10px]">REPORTER PERSONA</span>
                      <strong className="text-stone-900">
                        {selectedReport.reporterName || 'Anonymized'} ({selectedReport.reporterType})
                      </strong>
                    </div>
                  )}

                  {selectedReport.reporterPhone && (
                    <div>
                      <span className="text-stone-500 block text-[10px]">CONTACT PHONE</span>
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

        {/* Enlarged Photo Lightbox Modal */}
        {enlargedImage && (
          <div 
            onClick={() => setEnlargedImage(null)}
            className="fixed inset-0 bg-black/90 z-60 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
              <img 
                src={enlargedImage} 
                alt="Enlarged photographic evidence" 
                className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
              <button
                onClick={() => setEnlargedImage(null)}
                className="absolute top-2 right-2 p-2 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
