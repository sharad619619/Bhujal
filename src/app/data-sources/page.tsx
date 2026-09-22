'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  Database,
  Search,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
  Eye,
  RefreshCw,
  FolderDown,
} from 'lucide-react';

interface SampleDataset {
  id: string;
  title: string;
  description: string;
  records: number;
  wells: number;
  coverage: string;
  parameters: string[];
  dateRange: string;
  accreditation: string;
  active?: boolean;
}

const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'up-09a',
    title: 'Rania Industrial Sector Chromium Plume (UP-09A)',
    description: 'High-density hydrogeological observation network measuring hexavalent chromium dispersion from legacy tannery sludge dumps.',
    records: 2438,
    wells: 38,
    coverage: 'Rania Cluster, Kanpur Dehat (24.3 km²)',
    parameters: ['Cr(VI)', 'Total Cr', 'pH', 'Conductivity', 'TDS', 'Arsenic'],
    dateRange: 'Sept 2024 – Dec 2024',
    accreditation: 'ISO/IEC 17025 Certified Spectrometry',
    active: true,
  },
  {
    id: 'up-08b',
    title: 'Fatehpur Agricultural Vadose Zone Survey',
    description: 'Irrigation tube-well monitoring focusing on bio-accumulation risks in wheat and mustard crops receiving runoff.',
    records: 1120,
    wells: 24,
    coverage: 'Malwan & Bindki Blocks, Fatehpur',
    parameters: ['Cr(VI)', 'Soil Cr', 'Lead (Pb)', 'Nitrate', 'Fluoride'],
    dateRange: 'Jan 2023 – Nov 2023',
    accreditation: 'State Groundwater Directorate Survey',
    active: false,
  },
  {
    id: 'up-ts10',
    title: 'Kanpur Dehat Decadal Time-Series (2015–2025)',
    description: 'Long-term groundwater migration benchmark tracking monsoon advection pulses across 10 contiguous village panchayats.',
    records: 5890,
    wells: 62,
    coverage: 'Maitha & Sarbankhera Blocks',
    parameters: ['Cr(VI)', 'Total Cr', 'Water Table Depth', 'Precipitation'],
    dateRange: '2015 – 2025 Continuous',
    accreditation: 'Central Ground Water Board (CGWB)',
    active: false,
  },
];

const PREVIEW_ROWS = [
  { id: 'REC-1092', wellId: 'HP-047', lat: 26.4481, lon: 80.0102, crVI: 0.72, totalCr: 0.84, depth: 28, date: '2024-10-16', status: 'VERIFIED' },
  { id: 'REC-1093', wellId: 'HP-019', lat: 26.4522, lon: 80.0065, crVI: 0.84, totalCr: 0.98, depth: 32, date: '2024-11-02', status: 'VERIFIED' },
  { id: 'REC-1094', wellId: 'DW-02', lat: 26.4498, lon: 80.0140, crVI: 0.002, totalCr: 0.005, depth: 145, date: '2025-01-14', status: 'VERIFIED' },
  { id: 'REC-1095', wellId: 'HP-088', lat: 26.4410, lon: 80.0188, crVI: 0.14, totalCr: 0.19, depth: 24, date: '2024-12-08', status: 'VERIFIED' },
  { id: 'REC-1096', wellId: 'HP-023', lat: 26.4580, lon: 80.0210, crVI: 0.045, totalCr: 0.06, depth: 40, date: '2024-12-20', status: 'REPORTED' },
];

export default function DataCenterPage() {
  const [activeDatasetId, setActiveDatasetId] = useState('up-09a');
  const [uploadStep, setUploadStep] = useState<number>(1);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const handleSimulateUpload = () => {
    setUploadedFileName('kanpur_dehat_borewells_2025.csv');
    setUploadStep(2);
  };

  const handleDownloadSample = (dataset: SampleDataset) => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "sample_id,well_id,latitude,longitude,cr_vi_mg_l,total_cr_mg_l,depth_m,collection_date,lab_status\n" +
      PREVIEW_ROWS.map(r => `${r.id},${r.wellId},${r.lat},${r.lon},${r.crVI},${r.totalCr},${r.depth},${r.date},${r.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${dataset.id}_sample_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e8fff3] text-[#0c1f18] font-sans selection:bg-[#c3ebd8] selection:text-[#002116]">
      <Header />

      <main className="flex-1 w-full max-w-[1536px] mx-auto px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-8">
        {/* Breadcrumb & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <nav className="flex items-center gap-2 text-stone-600">
            <span className="hover:text-stone-900 cursor-pointer">Data Center</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#002116] font-bold">Upload &amp; Sample Datasets</span>
          </nav>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[#2E8B68] bg-[#2E8B68]/15 border border-[#2E8B68]/30 font-bold">
              <span className="material-symbols-outlined text-sm">cloud_done</span>
              Telemetry Engine Active · Kriging v4.2
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[#006492] bg-[#006492]/15 border border-[#006492]/30 font-bold">
              <span className="material-symbols-outlined text-sm">storage</span>
              Buffer: 98.4% Clean
            </span>
          </div>
        </div>

        {/* Header Section with Strata Bar */}
        <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-stone-200 shadow-md overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-2 strata-indicator"></div>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pl-3">
            <div className="max-w-3xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-[#ddf3e7] text-[#002116] font-bold border border-stone-200">
                  Ingestion Hub
                </span>
                <span className="text-xs font-mono text-stone-500">Hydro-Spatial Standard ISO/IEC 17025</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif text-[#002116] font-bold tracking-tight">
                Environmental Data Management &amp; Ingestion Center
              </h1>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Power Bhujal AI with your field measurements, groundwater sensor logs, and community surveys — or explore using structured sample datasets.
              </p>
            </div>

            {/* Top Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById('uploadWizardSection');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 bg-[#12372a] hover:bg-[#002116] text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-emerald-300" />
                <span>Upload Your Data (CSV, GeoJSON, XLSX)</span>
              </button>
              <button
                onClick={() => handleDownloadSample(SAMPLE_DATASETS[0])}
                className="flex items-center gap-2 bg-white hover:bg-stone-50 text-[#002116] border border-stone-300 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#006492]" />
                <span>Download Sample Dataset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sample Datasets Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-[#006492] font-bold uppercase tracking-wider">
                CURATED HYDRO-GEO REPOSITORIES
              </span>
              <h2 className="text-2xl font-serif text-[#002116] font-bold">Standard Reference Sample Datasets</h2>
            </div>
            <span className="text-xs text-stone-500 hidden sm:inline">
              Select any dataset to activate it across all maps &amp; consoles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_DATASETS.map((ds) => {
              const isSelected = activeDatasetId === ds.id;
              return (
                <div
                  key={ds.id}
                  className={`bg-white rounded-2xl p-6 border-2 flex flex-col justify-between transition-all shadow-sm hover:shadow-md ${
                    isSelected ? 'border-[#2E8B68] bg-emerald-50/20' : 'border-stone-200'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-stone-100 text-stone-700">
                        {ds.id.toUpperCase()}
                      </span>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#2E8B68] bg-emerald-100 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> ACTIVE IN CONSOLE
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400 font-mono">STANDBY</span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-serif text-[#002116] font-bold">{ds.title}</h3>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{ds.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-[#f2f8f5] p-3 rounded-xl text-xs font-mono">
                      <div>
                        <span className="text-stone-500 text-[10px] block">RECORDS</span>
                        <strong className="text-stone-900">{ds.records.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 text-[10px] block">WELLS</span>
                        <strong className="text-stone-900">{ds.wells} Borewells</strong>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-stone-200 text-[11px]">
                        <span className="text-stone-500">Coverage: </span>
                        <span className="text-stone-800">{ds.coverage}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {ds.parameters.map((p) => (
                        <span key={p} className="text-[10px] font-mono bg-white border border-stone-200 px-1.5 py-0.5 rounded text-stone-700">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-stone-200 mt-4 flex items-center gap-2">
                    <button
                      onClick={() => setActiveDatasetId(ds.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-colors ${
                        isSelected
                          ? 'bg-[#2E8B68] text-white'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                      }`}
                    >
                      {isSelected ? 'Loaded Active' : 'Load Dataset'}
                    </button>
                    <button
                      onClick={() => handleDownloadSample(ds)}
                      className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700"
                      title="Download CSV"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4-Step Interactive Upload Wizard */}
        <section id="uploadWizardSection" className="bg-white rounded-2xl p-6 lg:p-8 border border-stone-200 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-mono text-[#006492] font-bold uppercase">INGESTION PIPELINE</span>
              <h2 className="text-2xl font-serif text-[#002116] font-bold">4-Step Environmental Data Upload Wizard</h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Upload raw groundwater samples from lab reports or spreadsheet monitoring records.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className={`px-3 py-1 rounded-full font-bold ${uploadStep >= 1 ? 'bg-[#002116] text-white' : 'bg-stone-100 text-stone-400'}`}>1. File</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className={`px-3 py-1 rounded-full font-bold ${uploadStep >= 2 ? 'bg-[#002116] text-white' : 'bg-stone-100 text-stone-400'}`}>2. Schema</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className={`px-3 py-1 rounded-full font-bold ${uploadStep >= 3 ? 'bg-[#002116] text-white' : 'bg-stone-100 text-stone-400'}`}>3. Geotag</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className={`px-3 py-1 rounded-full font-bold ${uploadStep >= 4 ? 'bg-[#2E8B68] text-white' : 'bg-stone-100 text-stone-400'}`}>4. Ingest</span>
            </div>
          </div>

          {/* Wizard Step Content */}
          {uploadStep === 1 && (
            <div className="space-y-6">
              <div
                onClick={handleSimulateUpload}
                className="border-2 border-dashed border-[#006492]/50 hover:border-[#006492] bg-[#f2f8f5]/60 hover:bg-[#f2f8f5] rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#006492]/10 text-[#006492] flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="text-base sm:text-lg font-serif text-[#002116] font-bold">
                  Click or drag and drop your hydrogeological dataset file here
                </h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md">
                  Supports CSV, GeoJSON, Excel (.xlsx), or KML up to 50MB. Columns will be automatically mapped to standard Bhujal schemas.
                </p>
                <span className="mt-4 px-4 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-mono font-bold text-[#006492] shadow-xs">
                  Simulate Upload Demo CSV
                </span>
              </div>
            </div>
          )}

          {uploadStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs font-mono">
                <span className="font-bold text-emerald-900">
                  ✓ File uploaded: {uploadedFileName} (2,438 rows detected)
                </span>
                <span className="text-[#2E8B68] font-bold">Auto-Schema Match: 98%</span>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-mono font-bold text-stone-700 uppercase">Column Mapping Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[10px]">WELL / SOURCE ID</span>
                    <strong className="text-stone-900">well_id ➔ Handpump ID</strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[10px]">COORDINATES</span>
                    <strong className="text-stone-900">lat, lon ➔ EPSG:4326</strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[10px]">HEXAVALENT CHROMIUM</span>
                    <strong className="text-red-700 font-bold">cr_vi_mg_l ➔ Primary Analyte</strong>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  onClick={() => setUploadStep(1)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                >
                  Back
                </button>
                <button
                  onClick={() => setUploadStep(3)}
                  className="px-5 py-2 bg-[#002116] text-white rounded-lg text-xs font-mono font-bold"
                >
                  Confirm Schema &amp; Verify Coordinates →
                </button>
              </div>
            </div>
          )}

          {uploadStep === 3 && (
            <div className="space-y-6">
              <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl text-xs font-mono space-y-2">
                <span className="font-bold text-sky-900 block">
                  GEOSPATIAL BOUNDING BOX CHECK (Uttar Pradesh Sector)
                </span>
                <p className="text-sky-800 text-[11px]">
                  All 2,438 coordinate pairs lie inside the Kanpur Nagar / Kanpur Dehat / Fatehpur bounding polygon (26.0°–26.8°N, 79.8°–80.8°E). Zero out-of-bounds outliers detected.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  onClick={() => setUploadStep(2)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setUploadStep(4);
                    setUploadSuccess(true);
                  }}
                  className="px-5 py-2 bg-[#2E8B68] text-white rounded-lg text-xs font-mono font-bold"
                >
                  Ingest &amp; Generate Kriging Plume Layer →
                </button>
              </div>
            </div>
          )}

          {uploadStep === 4 && (
            <div className="bg-emerald-50 border-2 border-[#2E8B68] p-8 rounded-2xl text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#2E8B68] text-white mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-[#002116] font-bold">
                Dataset Ingested Successfully!
              </h3>
              <p className="text-sm text-stone-700 max-w-lg mx-auto">
                2,438 records from <strong>{uploadedFileName}</strong> have been validated against ISO/IEC 17025 standards and integrated into the live Bhujal 3D hydrodynamic model.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="px-6 py-2.5 bg-[#002116] text-white rounded-xl text-xs font-mono font-bold uppercase shadow-sm"
                >
                  View In Intelligence Console
                </Link>
                <button
                  onClick={() => {
                    setUploadStep(1);
                    setUploadedFileName(null);
                  }}
                  className="px-4 py-2.5 border border-stone-300 bg-white rounded-xl text-xs font-mono font-semibold"
                >
                  Upload Another File
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Live Data Registry Table Preview */}
        <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-mono text-stone-500 uppercase">ACTIVE BUFFER PREVIEW</span>
              <h3 className="text-lg font-serif text-[#002116] font-bold">Observation Point Measurement Logs</h3>
            </div>
            <div className="relative w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter by Well ID or status..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-[#006492]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#f2f8f5] text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="p-3">Record ID</th>
                  <th className="p-3">Well / Source ID</th>
                  <th className="p-3">Coordinates</th>
                  <th className="p-3">Cr(VI) (mg/L)</th>
                  <th className="p-3">Total Cr (mg/L)</th>
                  <th className="p-3">Depth (m)</th>
                  <th className="p-3">Sample Date</th>
                  <th className="p-3">Quality Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {PREVIEW_ROWS.filter(r => !searchFilter || r.wellId.toLowerCase().includes(searchFilter.toLowerCase()) || r.status.toLowerCase().includes(searchFilter.toLowerCase())).map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3 font-semibold text-stone-700">{row.id}</td>
                    <td className="p-3 font-bold text-[#002116]">{row.wellId}</td>
                    <td className="p-3 text-stone-500">{row.lat.toFixed(4)}°N, {row.lon.toFixed(4)}°E</td>
                    <td className="p-3">
                      <span className={`font-bold ${row.crVI > 0.05 ? 'text-red-700' : 'text-[#2E8B68]'}`}>
                        {row.crVI}
                      </span>
                    </td>
                    <td className="p-3 text-stone-700">{row.totalCr}</td>
                    <td className="p-3 text-stone-500">{row.depth}m</td>
                    <td className="p-3 text-stone-500">{row.date}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
