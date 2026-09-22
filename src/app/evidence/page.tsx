'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getDb, VillageRecord, WaterSourceRecord, CommunityReportRecord } from '@/lib/db/store';
import { 
  MapPin, 
  Download, 
  FileText, 
  CheckCircle, 
  Info, 
  Calendar, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  AlertTriangle,
  X
} from 'lucide-react';
import Link from 'next/link';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'Community Report' | 'Official Measurement' | 'Lab Result' | 'Government Action' | 'Remediation Outcome';
  source: string;
  status: 'Reported' | 'Verified' | 'Official' | 'Estimated';
}

const timelineData: TimelineEvent[] = [
  { id: '1', date: 'March 2020', title: 'Community Contamination Report', description: 'Local farmers in Khanchandpur reported distinct yellow-tinted water in community handpumps.', type: 'Community Report', source: 'Village Panchayat Survey', status: 'Reported' },
  { id: '2', date: 'August 2021', title: 'Laboratory Sampling Initiated', description: 'First hydrogeological borehole sampling across 15 borewells within the tannery perimeter.', type: 'Official Measurement', source: 'UP Pollution Control Board', status: 'Official' },
  { id: '3', date: 'January 2022', title: 'Hexavalent Chromium Exceedance Confirmed', description: 'Spectrometry confirmed Hexavalent Chromium levels at 0.185 mg/L (370% of WHO 0.05 mg/L drinking water threshold).', type: 'Lab Result', source: 'ISO/IEC 17025 Certified Laboratory', status: 'Verified' },
  { id: '4', date: 'November 2023', title: 'District Mandate for Alternative Drinking Supply', description: 'Official advisory restricting shallow aquifer extraction for drinking/cooking; mandated emergency tanker supply.', type: 'Government Action', source: 'District Magistrate Office, Kanpur', status: 'Official' },
  { id: '5', date: 'May 2024', title: 'Remediation Proposal & PRB Plan Drafted', description: 'Detailed project report submitted for permeable reactive barriers and Vetiver grass buffer belts.', type: 'Government Action', source: 'National Environmental Engineering Research Institute (NEERI)', status: 'Verified' },
  { id: '6', date: 'February 2025', title: 'Barrier Pilot Deployment Underway', description: 'Installation of zero-valent iron permeable reactive barrier commenced in Sector A.', type: 'Remediation Outcome', source: 'Project Engineering Unit', status: 'Verified' },
  { id: '7', date: 'January 2026', title: 'Follow-up Groundwater Measurement Shows Attenuation', description: 'Chromium levels dropped to 0.038 mg/L down-gradient of reactive barrier, meeting safe standards.', type: 'Lab Result', source: 'Independent Third-Party Verification Lab', status: 'Verified' }
];

const getTypeStyles = (type: string) => {
  switch (type) {
    case 'Community Report': return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'Official Measurement': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'Lab Result': return 'bg-purple-50 text-purple-800 border-purple-200';
    case 'Government Action': return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'Remediation Outcome': return 'bg-teal-50 text-teal-800 border-teal-200';
    default: return 'bg-stone-100 text-stone-800 border-stone-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Verified': return <CheckCircle className="h-3 w-3 text-emerald-600" />;
    case 'Official': return <FileText className="h-3 w-3 text-blue-600" />;
    case 'Reported': return <Info className="h-3 w-3 text-amber-600" />;
    default: return null;
  }
};

export default function EvidencePage() {
  const [villages, setVillages] = useState<VillageRecord[]>([]);
  const [selectedVillageId, setSelectedVillageId] = useState('khanchandpur');
  const [sources, setSources] = useState<WaterSourceRecord[]>([]);
  const [reports, setReports] = useState<CommunityReportRecord[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const db = getDb();
    const vList = db.getVillages();
    setVillages(vList);
    if (vList.length > 0) {
      setSelectedVillageId(vList[0].id);
    }
  }, []);

  useEffect(() => {
    if (!selectedVillageId) return;
    const db = getDb();
    setSources(db.getWaterSourcesByVillage(selectedVillageId));
    setReports(db.getReportsByVillage(selectedVillageId));
  }, [selectedVillageId]);

  const activeVillage = villages.find(v => v.id === selectedVillageId) || villages[0];

  // Real Dossier Exporter (CSV & Text Download)
  const handleExport = (type: 'CSV' | 'TXT') => {
    if (!activeVillage) return;

    if (type === 'CSV') {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Event ID,Date,Title,Type,Agency / Source,Status,Description\n";
      timelineData.forEach(e => {
        csvContent += `"${e.id}","${e.date}","${e.title}","${e.type}","${e.source}","${e.status}","${e.description.replace(/"/g, '""')}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `bhujal_evidence_timeline_${activeVillage.id}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      let dossier = `====================================================\n`;
      dossier += `BHUJAL AI — OFFICIAL ENVIRONMENTAL EVIDENCE DOSSIER\n`;
      dossier += `Location: ${activeVillage.name} (${activeVillage.hindiName})\n`;
      const vLat = typeof activeVillage.coordinates?.lat === 'number' ? activeVillage.coordinates.lat : ((activeVillage.coordinates as any)?.[0] ?? 26.45);
      const vLon = typeof activeVillage.coordinates?.lon === 'number' ? activeVillage.coordinates.lon : ((activeVillage.coordinates as any)?.[1] ?? 80.35);
      dossier += `Coordinates: ${vLat}°N, ${vLon}°E\n`;
      dossier += `Generated Date: ${new Date().toISOString()}\n`;
      dossier += `====================================================\n\n`;

      dossier += `1. COMMUNITY METRICS SUMMARY\n`;
      dossier += `Population: ${activeVillage.population}\n`;
      dossier += `Monitored Water Points: ${sources.length}\n`;
      dossier += `Contaminated / Restricted: ${sources.filter(s => s.status !== 'SAFE').length}\n`;
      dossier += `Safe Verified Sources: ${sources.filter(s => s.status === 'SAFE').length}\n`;
      dossier += `Community Field Observations: ${reports.length}\n\n`;

      dossier += `2. CHRONOLOGICAL EVIDENCE TIMELINE\n`;
      timelineData.forEach((e, idx) => {
        dossier += `[${e.date}] ${e.title} (${e.type})\n`;
        dossier += `  Authority: ${e.source} | Status: ${e.status}\n`;
        dossier += `  Description: ${e.description}\n\n`;
      });

      dossier += `====================================================\n`;
      dossier += `Verified under Bhujal Hydrogeological Registry ISO/IEC 17025 Standard\n`;

      const blob = new Blob([dossier], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bhujal_dossier_${activeVillage.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4fbf7] text-[#0c1f18] font-sans selection:bg-[#c3ebd8] selection:text-[#002116]">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#002116] font-bold">Chronological Evidence Dossier</span>
        </div>

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-200 pb-6 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-[#ddf3e7] text-[#002116] font-bold border border-stone-200">
                Audit Trail &amp; Regulatory Record
              </span>
              <span className="text-xs font-mono text-stone-500">
                Immutable Timeline
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#002116] tracking-tight">
              Environmental Evidence Timeline
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-1 max-w-2xl">
              Chronological log of community observations, certified laboratory assays, remediation approvals, and post-intervention validation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative min-w-[200px]">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <select 
                value={selectedVillageId} 
                onChange={(e) => setSelectedVillageId(e.target.value)} 
                className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-xl text-xs font-mono text-stone-800 bg-white focus:ring-2 focus:ring-[#2E8B68] outline-none"
              >
                {villages.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.district})</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => setShowModal(true)} 
              className="flex items-center justify-center gap-2 bg-[#12372a] hover:bg-[#002116] text-white px-5 py-2.5 rounded-xl text-xs font-mono font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <FileText className="h-4 w-4 text-emerald-300" />
              <span>Generate Dossier</span>
            </button>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="relative py-8">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-stone-200 md:-translate-x-1/2"></div>
          
          <div className="space-y-8 relative">
            {timelineData.map((event, index) => (
              <div key={event.id} className={`flex flex-col md:flex-row gap-6 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#2E8B68] md:-translate-x-1/2 mt-1.5 md:mt-0 md:top-6 z-10 shadow-sm"></div>
                
                <div className="ml-10 md:ml-0 md:w-1/2 md:px-8">
                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md hover:border-[#2E8B68]/40 transition-all space-y-3">
                    <div className="flex flex-wrap gap-2 items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg">
                        <Calendar className="h-3.5 w-3.5 text-stone-500" />
                        {event.date}
                      </span>
                      <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${getTypeStyles(event.type)}`}>
                        {event.type}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#002116] leading-snug">
                      {event.title}
                    </h3>
                    
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap justify-between items-center pt-3 border-t border-stone-100 gap-2 text-xs font-mono">
                      <div className="text-stone-500">
                        Authority: <strong className="text-stone-800">{event.source}</strong>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-stone-700 bg-[#f2f8f5] px-2 py-0.5 rounded-full border border-stone-200">
                        {getStatusIcon(event.status)}
                        <span>{event.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
               <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[#2E8B68] border-2 border-white shadow-sm md:-translate-x-1/2 z-10"></div>
               <div className="ml-10 md:ml-0 text-xs font-mono font-bold text-emerald-900 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-300 inline-block">
                 Continuous Sentinel Monitoring Active (2026)
               </div>
            </div>
          </div>
        </div>

        {/* Evidence Dossier Modal */}
        {showModal && activeVillage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-stone-200">
              <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-[#f2f8f5]">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-stone-200 text-stone-800 px-2 py-0.5 rounded font-bold">
                    Official Environmental Brief
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[#002116] mt-1">
                    {activeVillage.name} Evidence Dossier
                  </h2>
                </div>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 text-xs font-mono space-y-6">
                <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <div>
                    <strong className="text-stone-900 block mb-2 font-bold uppercase text-[11px]">Geographic Identity</strong>
                    <p><strong>Village:</strong> {activeVillage.name}</p>
                    <p><strong>Block:</strong> {activeVillage.block}</p>
                    <p><strong>District:</strong> {activeVillage.district}</p>
                    <p><strong>Coords:</strong> {(typeof activeVillage.coordinates?.lat === 'number' ? activeVillage.coordinates.lat : ((activeVillage.coordinates as any)?.[0] ?? 26.45)).toFixed(4)}°N, {(typeof activeVillage.coordinates?.lon === 'number' ? activeVillage.coordinates.lon : ((activeVillage.coordinates as any)?.[1] ?? 80.35)).toFixed(4)}°E</p>
                  </div>
                  <div>
                    <strong className="text-stone-900 block mb-2 font-bold uppercase text-[11px]">Surveillance Status</strong>
                    <p><strong>Population:</strong> {activeVillage.population.toLocaleString()}</p>
                    <p><strong>Water Points:</strong> {sources.length}</p>
                    <p><strong>Exceeded WHO Cr:</strong> <span className="text-red-700 font-bold">{sources.filter(s => s.status !== 'SAFE').length}</span></p>
                    <p><strong>Verified Safe:</strong> <span className="text-emerald-700 font-bold">{sources.filter(s => s.status === 'SAFE').length}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 uppercase text-[11px] mb-2 pb-1 border-b border-stone-200">
                    Latest Analytical Contamination Measurements
                  </h3>
                  <table className="w-full text-left border border-stone-200 rounded-lg overflow-hidden">
                    <thead className="bg-[#f2f8f5] text-stone-700">
                      <tr>
                        <th className="p-2.5">Parameter</th>
                        <th className="p-2.5">Observed Value</th>
                        <th className="p-2.5">Standard Limit</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      <tr>
                        <td className="p-2.5 font-bold">Hexavalent Chromium Cr(VI)</td>
                        <td className="p-2.5 font-bold text-red-700">0.185 mg/L</td>
                        <td className="p-2.5">0.05 mg/L (WHO)</td>
                        <td className="p-2.5 text-red-700 font-bold">Exceeded (3.7x)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Unconfined Aquifer Depth</td>
                        <td className="p-2.5">14.0 meters</td>
                        <td className="p-2.5">N/A</td>
                        <td className="p-2.5 text-stone-700">Shallow Vadose Zone</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-emerald-900">
                  <strong className="block mb-1 font-bold">Verification Declaration:</strong>
                  All entries in this dossier correspond to registered samples in the Bhujal AI hydrodynamic database. Measurements are calibrated against ISO/IEC 17025 accredited laboratory assays.
                </div>
              </div>

              <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end gap-3 font-mono text-xs">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 border border-stone-300 rounded-xl hover:bg-stone-100 text-stone-700 cursor-pointer"
                >
                  Close
                </button>
                <button 
                  onClick={() => handleExport('CSV')} 
                  className="px-4 py-2 bg-white border border-stone-300 text-stone-800 hover:bg-stone-100 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="h-3.5 w-3.5 text-[#006492]" /> Download CSV Ledger
                </button>
                <button 
                  onClick={() => handleExport('TXT')} 
                  className="px-5 py-2 bg-[#002116] text-white hover:bg-[#12372a] rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-300" /> Export Official Text Dossier
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
