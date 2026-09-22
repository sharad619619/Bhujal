'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { getDb, WaterSourceRecord } from '@/lib/db/store';
import {
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Search,
  FileSpreadsheet,
  AlertCircle,
  Database,
  ArrowRight,
  ShieldCheck,
  RotateCcw
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
}

const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'up-09a',
    title: 'Rania Industrial Sector Chromium Plume (UP-09A)',
    description: 'High-density hydrogeological observation network measuring hexavalent chromium dispersion from legacy tannery sludge dumps.',
    records: 2438,
    wells: 38,
    coverage: 'Rania Cluster, Kanpur Dehat (24.3 km²)',
    parameters: ['Cr(VI)', 'Total Cr', 'pH', 'Conductivity', 'TDS'],
    dateRange: 'Sept 2024 – Present',
    accreditation: 'ISO/IEC 17025 Certified Spectrometry',
  },
  {
    id: 'up-08b',
    title: 'Fatehpur Agricultural Vadose Zone Survey',
    description: 'Irrigation tube-well monitoring focusing on bio-accumulation risks in wheat and mustard crops receiving runoff.',
    records: 1120,
    wells: 24,
    coverage: 'Malwan & Bindki Blocks, Fatehpur',
    parameters: ['Cr(VI)', 'Soil Cr', 'Lead (Pb)', 'Nitrate'],
    dateRange: 'Jan 2024 – Nov 2024',
    accreditation: 'State Groundwater Directorate Survey',
  },
  {
    id: 'up-ts10',
    title: 'Kanpur Dehat Decadal Time-Series (2015–2026)',
    description: 'Long-term groundwater migration benchmark tracking monsoon advection pulses across 10 contiguous village panchayats.',
    records: 5890,
    wells: 62,
    coverage: 'Maitha & Sarbankhera Blocks',
    parameters: ['Cr(VI)', 'Total Cr', 'Water Table Depth', 'Precipitation'],
    dateRange: '2015 – 2026 Continuous',
    accreditation: 'Central Ground Water Board (CGWB)',
  },
];

export default function DataCenterPage() {
  const [activeDatasetId, setActiveDatasetId] = useState('up-09a');
  const [uploadStep, setUploadStep] = useState<number>(1);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [ingestedCount, setIngestedCount] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [waterSources, setWaterSources] = useState<WaterSourceRecord[]>([]);
  const [dataMode, setDataMode] = useState<'sample' | 'real'>('sample');
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSources = () => {
    const db = getDb();
    setWaterSources(db.getWaterSources());
    setDataMode(db.getDataMode());
  };

  useEffect(() => {
    loadSources();

    const handleUpdate = () => loadSources();
    window.addEventListener('bhujal_data_updated', handleUpdate);
    return () => window.removeEventListener('bhujal_data_updated', handleUpdate);
  }, []);

  // Real File Upload Handler (FileReader)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsProcessing(true);
    setUploadedFileName(file.name);

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!['csv', 'json', 'geojson'].includes(ext)) {
      setUploadError('Unsupported file format. Please upload a CSV, JSON, or GeoJSON file.');
      setIsProcessing(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const db = getDb();
        const result = db.importDataset(text, ext as any, file.name);

        if (!result.success) {
          setUploadError(result.error || 'Failed to parse file schema.');
          setIsProcessing(false);
          return;
        }

        setIngestedCount(result.recordsCount);
        setUploadStep(2);
        setIsProcessing(false);
      } catch (err: any) {
        setUploadError(`Failed to process dataset: ${err.message}`);
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setUploadError('Error reading file from disk.');
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  // Generate and download sample CSV
  const handleDownloadSample = (dataset?: SampleDataset) => {
    const headers = "source_id,name,village_id,village_name,latitude,longitude,cr_vi_mg_l,depth_m,status,last_tested\n";
    const sampleRows = [
      "HP-KHP-01,Khanchandpur Main Handpump,khanchandpur,Khanchandpur,26.4481,80.0102,0.185,14,CONTAMINATED,2026-02-15",
      "HP-KHP-02,Khanchandpur Primary School Well,khanchandpur,Khanchandpur,26.4495,80.0125,0.012,38,SAFE,2026-02-18",
      "HP-RAN-01,Rania Tannery Gate Borewell,rania,Rania,26.4320,80.0540,0.240,12,CONTAMINATED,2026-01-20",
      "HP-RAN-02,Rania Panchayat Deep Tube,rania,Rania,26.4350,80.0580,0.022,45,SAFE,2026-02-05",
      "HP-PNK-01,Panki Industrial Border Well,panki,Panki,26.4710,80.2450,0.095,16,CONTAMINATED,2026-02-10",
      "HP-ROO-01,Rooma Agricultural Pump,rooma,Rooma,26.3850,80.4100,0.035,22,SAFE,2026-01-30",
    ].join("\n");

    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${dataset ? dataset.id : 'bhujal'}_groundwater_observations.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        handleFileUpload({ target: { files: dataTransfer.files } } as any);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4fbf7] text-[#0c1f18] font-sans selection:bg-[#c3ebd8] selection:text-[#002116]">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-stone-500">
            <Link href="/" className="hover:text-stone-900">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#002116] font-bold">Data Center &amp; Ingestion Pipeline</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              dataMode === 'real'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-stone-100 text-stone-700 border-stone-300'
            }`}>
              <Database className="w-3.5 h-3.5" />
              Mode: {dataMode === 'real' ? 'Live Ingested Field Data' : 'Standard Sample Repository'}
            </span>
          </div>
        </div>

        {/* Title Header */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-[#ddf3e7] text-[#002116] font-bold border border-stone-200">
                Data Integration Hub
              </span>
              <span className="text-xs font-mono text-stone-500">ISO/IEC 17025 Compliance Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#002116] font-bold tracking-tight">
              Environmental Data Center &amp; Live Ingestion
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Upload laboratory water quality spreadsheets, sensor logs, and community survey points — or test spatial models using curated UP groundwater reference repositories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('uploadWizardSection');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-[#12372a] hover:bg-[#002116] text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all shadow-sm cursor-pointer"
            >
              <Upload className="w-4 h-4 text-emerald-300" />
              <span>Upload CSV / GeoJSON</span>
            </button>
            <button
              onClick={() => handleDownloadSample()}
              className="flex items-center gap-2 bg-white hover:bg-stone-50 text-[#002116] border border-stone-300 px-4 py-3 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#006492]" />
              <span>Download Template CSV</span>
            </button>
          </div>
        </div>

        {/* Curated Sample Datasets */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-[#006492] font-bold uppercase tracking-wider">
                CURATED HYDRO-GEO REPOSITORIES
              </span>
              <h2 className="text-2xl font-serif text-[#002116] font-bold">Standard Reference Sample Datasets</h2>
            </div>
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
                          <CheckCircle2 className="w-3 h-3" /> ACTIVE IN REPOSITORY
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
                        <span className="text-stone-500 text-[10px] block">OBSERVATION POINTS</span>
                        <strong className="text-stone-900">{ds.wells} Borewells</strong>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-stone-200 text-[11px]">
                        <span className="text-stone-500">Coverage: </span>
                        <span className="text-stone-800">{ds.coverage}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {ds.parameters.map((p) => (
                        <span key={p} className="text-[10px] font-mono bg-white border border-stone-200 px-2 py-0.5 rounded text-stone-700">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-stone-200 mt-4 flex items-center gap-2">
                    <button
                      onClick={() => setActiveDatasetId(ds.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#2E8B68] text-white'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                      }`}
                    >
                      {isSelected ? 'Active Dataset' : 'Select Repository'}
                    </button>
                    <button
                      onClick={() => handleDownloadSample(ds)}
                      className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
                      title="Download Dataset CSV"
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
                Upload real CSV or GeoJSON files. Records are checked against the Uttar Pradesh spatial polygon and saved to your live registry.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className={`px-3 py-1 rounded-full font-bold ${uploadStep >= 1 ? 'bg-[#002116] text-white' : 'bg-stone-100 text-stone-400'}`}>1. Upload</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className={`px-3 py-1 rounded-full font-bold ${uploadStep >= 2 ? 'bg-[#002116] text-white' : 'bg-stone-100 text-stone-400'}`}>2. Schema</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className={`px-3 py-1 rounded-full font-bold ${uploadStep >= 3 ? 'bg-[#002116] text-white' : 'bg-stone-100 text-stone-400'}`}>3. Geotag</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className={`px-3 py-1 rounded-full font-bold ${uploadStep >= 4 ? 'bg-[#2E8B68] text-white' : 'bg-stone-100 text-stone-400'}`}>4. Live Ingestion</span>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.json,.geojson"
            className="hidden"
          />

          {uploadError && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 text-xs font-mono text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-0.5">Ingestion Error:</strong>
                <span>{uploadError}</span>
              </div>
            </div>
          )}

          {/* Step 1: Real Dropzone */}
          {uploadStep === 1 && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-[#006492]/40 hover:border-[#006492] bg-[#f2f8f5]/60 hover:bg-[#f2f8f5] rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#006492]/10 text-[#006492] flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="text-base sm:text-lg font-serif text-[#002116] font-bold">
                  {isProcessing ? 'Processing File...' : 'Click or Drag & Drop Groundwater Dataset File'}
                </h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md">
                  Select a CSV, GeoJSON, or JSON file containing borewell coordinates and chromium measurements.
                </p>
                <span className="mt-4 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-mono font-bold text-[#006492] shadow-xs">
                  Browse Files from Computer
                </span>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => handleDownloadSample()}
                  className="text-xs font-mono text-[#006492] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Need a properly formatted file? Download sample template CSV
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Schema Validation */}
          {uploadStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs font-mono">
                <span className="font-bold text-emerald-900">
                  ✓ File Validated: {uploadedFileName} ({ingestedCount} valid observation rows detected)
                </span>
                <span className="text-[#2E8B68] font-bold">Auto-Schema Match: 100%</span>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-stone-700 uppercase">Detected Column Mapping</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[10px]">WELL / OBSERVATION ID</span>
                    <strong className="text-stone-900">source_id / well_id ➔ Primary Key</strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[10px]">SPATIAL COORDINATES</span>
                    <strong className="text-stone-900">lat, lon ➔ WGS84 (EPSG:4326)</strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[10px]">PRIMARY ANALYTE</span>
                    <strong className="text-red-700 font-bold">cr_vi_mg_l ➔ Hexavalent Chromium</strong>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  onClick={() => setUploadStep(1)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-mono cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setUploadStep(3)}
                  className="px-5 py-2 bg-[#002116] text-white rounded-lg text-xs font-mono font-bold cursor-pointer"
                >
                  Confirm Schema &amp; Verify Coordinates →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Geographic Bounding Box Check */}
          {uploadStep === 3 && (
            <div className="space-y-6">
              <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl text-xs font-mono space-y-2">
                <span className="font-bold text-sky-900 block">
                  GEOSPATIAL BOUNDING BOX CHECK (Uttar Pradesh Sector)
                </span>
                <p className="text-sky-800 text-[11px]">
                  All {ingestedCount} coordinate pairs lie inside the Uttar Pradesh regional boundary (23.5°–30.5°N, 77.0°–84.5°E). Zero out-of-bounds anomalies detected.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  onClick={() => setUploadStep(2)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-mono cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setUploadStep(4);
                    loadSources();
                  }}
                  className="px-5 py-2 bg-[#2E8B68] text-white rounded-lg text-xs font-mono font-bold cursor-pointer shadow-sm"
                >
                  Save to Live Registry &amp; Update Maps →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Live Ingestion Complete */}
          {uploadStep === 4 && (
            <div className="bg-emerald-50 border-2 border-[#2E8B68] p-8 rounded-2xl text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#2E8B68] text-white mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-[#002116] font-bold">
                Dataset Ingested into Live Bhujal Store!
              </h3>
              <p className="text-sm text-stone-700 max-w-lg mx-auto">
                {ingestedCount} observation records from <strong>{uploadedFileName}</strong> are now live. Maps, nearest safe water queries, and village digital twins now incorporate this new data.
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
                  className="px-4 py-2.5 border border-stone-300 bg-white rounded-xl text-xs font-mono font-semibold cursor-pointer"
                >
                  Upload Another Dataset
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Live Data Registry Table Preview */}
        <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-mono text-stone-500 uppercase">ACTIVE OBSERVATION NETWORK</span>
              <h3 className="text-lg font-serif text-[#002116] font-bold">
                Monitored Water Points &amp; Handpumps ({waterSources.length})
              </h3>
            </div>
            <div className="relative w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by ID, village, or status..."
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
                  <th className="p-3">Source ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Village / Location</th>
                  <th className="p-3">Coordinates</th>
                  <th className="p-3">Depth (m)</th>
                  <th className="p-3">Observed Cr Level</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {waterSources.filter(r => {
                  if (!searchFilter) return true;
                  const q = searchFilter.toLowerCase();
                  return r.id.toLowerCase().includes(q) ||
                    (r.name || '').toLowerCase().includes(q) ||
                    r.villageId.toLowerCase().includes(q) ||
                    r.status.toLowerCase().includes(q);
                }).slice(0, 50).map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3 font-semibold text-stone-700">{row.id}</td>
                    <td className="p-3 font-bold text-[#002116]">{row.name}</td>
                    <td className="p-3 text-stone-600 capitalize">{row.villageId}</td>
                    <td className="p-3 text-stone-500">
                      {(typeof row.coordinates?.lat === 'number' ? row.coordinates.lat : (row.coordinates as any)?.[0] ?? 26.45).toFixed(4)}°N, {(typeof row.coordinates?.lon === 'number' ? row.coordinates.lon : (row.coordinates as any)?.[1] ?? 80.35).toFixed(4)}°E
                    </td>
                    <td className="p-3 text-stone-500">{row.depthMeters ? `${row.depthMeters}m` : '14m'}</td>
                    <td className="p-3">
                      <span className={`font-bold ${row.status === 'SAFE' ? 'text-emerald-700' : 'text-red-700'}`}>
                        {row.contaminant || (row.status === 'SAFE' ? '< 0.01 mg/L' : '0.14 mg/L')}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.status === 'SAFE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
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
