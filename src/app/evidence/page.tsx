'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AlertTriangle, MapPin, Download, FileText, CheckCircle, Info, Calendar } from 'lucide-react';

const DemoBanner = () => (
  <div className="bg-amber-100 text-amber-800 p-2 text-center text-sm font-medium w-full flex items-center justify-center gap-2">
    <AlertTriangle className="h-4 w-4" />
    <span>DEMO DATA - Not for real-world environmental action.</span>
  </div>
);

type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'Community Report' | 'Official Measurement' | 'Lab Result' | 'Government Action' | 'Remediation Outcome';
  source: string;
  status: 'Reported' | 'Verified' | 'Official' | 'Estimated';
};

const timelineData: TimelineEvent[] = [
  { id: '1', date: 'March 2020', title: 'Community contamination report', description: 'Local residents reported yellow-tinted water in community handpumps.', type: 'Community Report', source: 'Local NGO Survey', status: 'Reported' },
  { id: '2', date: 'August 2021', title: 'Laboratory sampling initiated', description: 'First official sampling of 15 borewells across the village perimeter.', type: 'Official Measurement', source: 'State Pollution Control Board', status: 'Official' },
  { id: '3', date: 'January 2022', title: 'Chromium detected above WHO limits', description: 'Lab results confirmed Hexavalent Chromium levels at 0.18 mg/L (WHO limit: 0.05 mg/L).', type: 'Lab Result', source: 'Accredited Environmental Lab', status: 'Verified' },
  { id: '4', date: 'November 2023', title: 'Government notification issued', description: 'Official notice marking the area as severely contaminated. Alternative water supply mandated.', type: 'Government Action', source: 'Ministry of Jal Shakti', status: 'Official' },
  { id: '5', date: 'May 2024', title: 'Remediation proposal submitted', description: 'Phytoremediation and point-source containment strategy outlined.', type: 'Government Action', source: 'Environmental Task Force', status: 'Verified' },
  { id: '6', date: 'February 2025', title: 'Intervention initiated', description: 'Pilot scale containment project started in Sector A.', type: 'Remediation Outcome', source: 'Project Management Unit', status: 'Verified' },
  { id: '7', date: 'January 2026', title: 'Follow-up measurement shows improvement', description: 'Cr levels measured at 0.08 mg/L near containment zone.', type: 'Lab Result', source: 'Accredited Environmental Lab', status: 'Verified' }
];

const getTypeStyles = (type: string) => {
  switch (type) {
    case 'Community Report': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Official Measurement': return 'bg-green-100 text-green-800 border-green-200';
    case 'Lab Result': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Government Action': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Remediation Outcome': return 'bg-teal-100 text-teal-800 border-teal-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Verified': return <CheckCircle className="h-3 w-3 text-green-600" />;
    case 'Official': return <FileText className="h-3 w-3 text-blue-600" />;
    case 'Reported': return <Info className="h-3 w-3 text-amber-600" />;
    default: return null;
  }
};

export default function EvidencePage() {
  const [selectedVillage, setSelectedVillage] = useState('Khanchandpur');
  const [showModal, setShowModal] = useState(false);

  const handleExport = (type: string) => {
    alert(`Export feature for ${type} - coming soon`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <DemoBanner />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Environmental Evidence Timeline</h1>
            <p className="text-lg text-slate-600">Chronological record of environmental observations, measurements, and actions</p>
          </div>
          <div className="flex flex-col gap-2 min-w-[200px]">
            <label className="text-sm font-medium text-slate-700">Select Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select value={selectedVillage} onChange={(e) => setSelectedVillage(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white">
                <option value="Khanchandpur">Khanchandpur</option>
                <option value="Panki">Panki</option>
                <option value="Rania">Rania</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-8 flex justify-end">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
            <FileText className="h-4 w-4" />
            Generate Evidence Report
          </button>
        </div>

        <div className="relative py-8">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 md:-translate-x-1/2"></div>
          <div className="space-y-8 relative">
            {timelineData.map((event, index) => (
              <div key={event.id} className={`flex flex-col md:flex-row gap-6 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-400 md:-translate-x-1/2 mt-1.5 md:mt-0 md:top-6 z-10 shadow-sm"></div>
                <div className="ml-10 md:ml-0 md:w-1/2 md:px-8">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
                    <div className="flex flex-wrap gap-2 items-center mb-3">
                      <span className="flex items-center gap-1 text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        <Calendar className="h-3 w-3" />{event.date}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getTypeStyles(event.type)}`}>{event.type}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{event.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">{event.description}</p>
                    <div className="flex flex-wrap justify-between items-center pt-3 border-t border-slate-100 gap-2">
                      <div className="text-xs text-slate-500">Source: <span className="font-medium text-slate-700">{event.source}</span></div>
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {getStatusIcon(event.status)}{event.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
               <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm md:-translate-x-1/2 z-10"></div>
               <div className="ml-10 md:ml-0 text-sm font-medium text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-200 inline-block">Monitoring Continues</div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-900">Evidence Dossier Preview</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 text-sm text-slate-700 space-y-6">
                <div className="bg-amber-50 text-amber-800 p-3 rounded-lg border border-amber-200 text-xs font-medium mb-4">Note: This dossier contains prototype demo data. Do not use for legal or official proceedings.</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Location Identity</h3>
                    <p><strong>Village:</strong> {selectedVillage}</p>
                    <p><strong>District:</strong> Kanpur Nagar</p>
                    <p><strong>Coordinates:</strong> 26.45°N, 80.35°E</p>
                    <p><strong>Est. Population:</strong> 8,240</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Record Summary</h3>
                    <p><strong>Community Reports:</strong> 14</p>
                    <p><strong>Verified Measurements:</strong> 6</p>
                    <p><strong>Remediation Activities:</strong> 2</p>
                    <p><strong>Latest Status:</strong> Critical, Under Intervention</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-2">Measurement Summary</h3>
                  <table className="w-full text-left text-sm mt-2">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="p-2 border border-slate-200">Parameter</th>
                        <th className="p-2 border border-slate-200">Latest Value</th>
                        <th className="p-2 border border-slate-200">Threshold</th>
                        <th className="p-2 border border-slate-200">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border border-slate-200">Cr(VI)</td>
                        <td className="p-2 border border-slate-200 font-bold text-red-600">0.08 mg/L</td>
                        <td className="p-2 border border-slate-200">0.05 mg/L</td>
                        <td className="p-2 border border-slate-200 text-red-600">Exceeded</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-slate-200">Groundwater Depth</td>
                        <td className="p-2 border border-slate-200">12.5m</td>
                        <td className="p-2 border border-slate-200">N/A</td>
                        <td className="p-2 border border-slate-200">Stable</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Outstanding Evidence Gaps</h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>Recent soil samples from agricultural sector B missing.</li>
                    <li>Source apportionment study not yet concluded.</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm">Cancel</button>
                <button onClick={() => handleExport('CSV')} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium flex items-center gap-2"><Download className="h-4 w-4" /> CSV</button>
                <button onClick={() => handleExport('PDF')} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2"><Download className="h-4 w-4" /> PDF Report</button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
