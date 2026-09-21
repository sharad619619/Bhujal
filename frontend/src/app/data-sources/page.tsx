'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AlertTriangle, CheckCircle, HelpCircle, Eye, Calculator, Network } from 'lucide-react';

const DemoBanner = () => (
  <div className="bg-amber-100 text-amber-800 p-2 text-center text-sm font-medium w-full flex items-center justify-center gap-2">
    <AlertTriangle className="h-4 w-4" />
    <span>DEMO DATA - Not for real-world environmental action.</span>
  </div>
);

type DataSource = {
  id: string; name: string; organization: string; category: string; collectionDate: string; coverage: string; method: string; updateFreq: string; status: 'VERIFIED' | 'REPORTED' | 'ESTIMATED' | 'PREDICTED' | 'UNKNOWN'; license: string; citation: string;
};

const demoDataSources: DataSource[] = [
  { id: 'ds1', name: 'Groundwater Quality Monitoring Stations', organization: 'Central Ground Water Board (CGWB)', category: 'Laboratory', collectionDate: '2023-11', coverage: 'Uttar Pradesh (Select Districts)', method: 'Spectrophotometry', updateFreq: 'Annual', status: 'VERIFIED', license: 'Open Government Data License - India', citation: 'CGWB. (2023). Groundwater Quality Report.' },
  { id: 'ds2', name: 'Sentinel-2 Multispectral Imagery', organization: 'European Space Agency (ESA)', category: 'Satellite', collectionDate: '2024-01', coverage: 'Global', method: 'Optical Remote Sensing', updateFreq: '5 days', status: 'REPORTED', license: 'Copernicus Open Access', citation: 'ESA. (2024). Sentinel-2 Data.' },
  { id: 'ds3', name: 'Local Borewell Survey', organization: 'Kanpur Environmental NGO', category: 'Community', collectionDate: '2023-08', coverage: 'Khanchandpur, Panki', method: 'Field test kits + Visual', updateFreq: 'Ad-hoc', status: 'REPORTED', license: 'CC BY-NC 4.0', citation: 'Local NGO Survey (2023).' },
  { id: 'ds4', name: 'Soil Type Map (1:50,000)', organization: 'National Bureau of Soil Survey', category: 'Government', collectionDate: '2015-01', coverage: 'India', method: 'Soil Sampling & Mapping', updateFreq: 'Decadal', status: 'ESTIMATED', license: 'Restricted Public', citation: 'NBSS&LUP. (2015).' },
  { id: 'ds5', name: 'Plume Migration Model', organization: 'AquaShield AI Engine', category: 'Model', collectionDate: '2024-02', coverage: 'Study Area', method: 'MODFLOW + MT3DMS', updateFreq: 'On-demand', status: 'PREDICTED', license: 'Proprietary System', citation: 'AquaShield Internal Model.' }
];

const QualityBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'VERIFIED': return <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold border border-green-200"><CheckCircle className="h-3 w-3" /> VERIFIED</span>;
    case 'REPORTED': return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold border border-blue-200"><Eye className="h-3 w-3" /> REPORTED</span>;
    case 'ESTIMATED': return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-bold border border-amber-200"><Calculator className="h-3 w-3" /> ESTIMATED</span>;
    case 'PREDICTED': return <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-bold border border-purple-200"><Network className="h-3 w-3" /> PREDICTED</span>;
    default: return <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full font-bold border border-slate-200"><HelpCircle className="h-3 w-3" /> UNKNOWN</span>;
  }
};

export default function DataSourcesPage() {
  const groupedData = demoDataSources.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, DataSource[]>);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <DemoBanner />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Data & Methodology</h1>
          <p className="text-lg text-slate-600">Transparency in data collection, origin, and analytical confidence.</p>
        </div>

        <section className="mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Data Quality Index</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4"><div className="mt-1 w-28 shrink-0"><QualityBadge status="VERIFIED" /></div><p className="text-sm text-slate-600">Directly measured in a certified lab using standard protocols (e.g., Spectrophotometry). Highest confidence level.</p></div>
              <div className="flex items-start gap-4"><div className="mt-1 w-28 shrink-0"><QualityBadge status="REPORTED" /></div><p className="text-sm text-slate-600">Observed visually or tested using rapid field kits. Useful for early warning but requires lab verification.</p></div>
              <div className="flex items-start gap-4"><div className="mt-1 w-28 shrink-0"><QualityBadge status="ESTIMATED" /></div><p className="text-sm text-slate-600">Derived from secondary interpolation of related verified data or remote sensing proxies.</p></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4"><div className="mt-1 w-28 shrink-0"><QualityBadge status="PREDICTED" /></div><p className="text-sm text-slate-600">Generated by hydrogeological or machine learning models. Subject to algorithmic assumptions and uncertainties.</p></div>
              <div className="flex items-start gap-4"><div className="mt-1 w-28 shrink-0"><QualityBadge status="UNKNOWN" /></div><p className="text-sm text-slate-600">Data origin unclear or documentation missing. Excluded from critical decision-making.</p></div>
            </div>
          </div>
        </section>

        <section>
          {Object.entries(groupedData).map(([category, sources]) => (
            <div key={category} className="mb-10">
              <h3 className="text-lg font-bold text-slate-800 mb-4 px-2 uppercase tracking-wider">{category} Sources</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sources.map(source => (
                  <div key={source.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-2"><h4 className="font-bold text-slate-900">{source.name}</h4><QualityBadge status={source.status} /></div>
                    <p className="text-sm text-slate-700 font-medium mb-4">{source.organization}</p>
                    <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div><span className="font-semibold text-slate-800 block mb-0.5">Method</span>{source.method}</div>
                      <div><span className="font-semibold text-slate-800 block mb-0.5">Coverage</span>{source.coverage}</div>
                      <div><span className="font-semibold text-slate-800 block mb-0.5">Date</span>{source.collectionDate}</div>
                      <div><span className="font-semibold text-slate-800 block mb-0.5">Frequency</span>{source.updateFreq}</div>
                    </div>
                    <div className="mt-auto pt-3 border-t border-slate-100 text-xs">
                      <p className="text-slate-500 mb-1"><span className="font-semibold">License:</span> {source.license}</p>
                      <p className="text-slate-400 font-mono italic">Citation: {source.citation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
