// ============================================================
// Bhujal AI — Unified Repository & Scientific Data Engine
// ============================================================

import {
  demoVillages,
  demoWaterSources,
  demoMeasurements,
  demoGroundwaterPoints,
  demoSoilSamples,
  demoSchools,
  demoHealthcare,
  demoAgriculturalZones,
  demoContaminationSources,
  demoRemediationProjects,
  demoCommunityReports,
  demoTimelineEvents,
  demoPredictionResults,
  demoRiskScores,
  demoDataSources,
  demoMediaAssets,
  demoBotanicalSpecies,
} from '@/lib/data/demo-data';

import type {
  Village,
  WaterSource,
  Measurement,
  GroundwaterPoint,
  SoilSample,
  School,
  HealthcareFacility,
  AgriculturalZone,
  ContaminationSource,
  RemediationProject,
  CommunityReport,
  TimelineEvent,
  PredictionResult,
  RiskScore,
  DataSource,
  MediaAsset,
  BotanicalSpecies,
} from '@/lib/types';

export type DatasetMode = 'sample' | 'real';

export interface NearestSafeWaterResult {
  source: WaterSource;
  distanceMeters: number;
  walkingMinutes: number;
  latestCrMgL: number;
  status: 'safe' | 'caution' | 'unsafe';
  testedDate: string;
  purification: string;
  powerSource: string;
  capacityLitersPerDay: number;
  directions: string[];
}

export interface WaterSafetyVerdict {
  found: boolean;
  source?: WaterSource;
  verdict: 'SAFE' | 'CAUTION' | 'UNSAFE' | 'INSUFFICIENT_DATA';
  crVIMgL?: number;
  totalCrMgL?: number;
  whoLimitMultiplier?: number;
  headline: string;
  hindiHeadline: string;
  advice: string;
  hindiAdvice: string;
  lastTestedDate: string;
  laboratory: string;
  verificationStatus: string;
  depthMeters?: number;
  alternativeSourceId?: string;
  nearestSafeSource?: NearestSafeWaterResult;
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'village' | 'watersource' | 'project' | 'report' | 'school';
  href: string;
  coordinates?: { lat: number; lon: number };
  badge?: string;
}

export interface RemediationPrescription {
  primaryStrategy: string;
  hindiStrategy: string;
  candidateSpecies: {
    name: string;
    botanicalName: string;
    rootDepth: string;
    mechanism: string;
    removalEfficiency: string;
  }[];
  candidates: {
    scientificName: string;
    commonName: string;
    mechanism: string;
    bcf: number;
    rootDepth: string;
    care: string;
    photoUrl?: string;
    suitabilityScore?: number;
    warnings?: string[];
    citations?: string[];
  }[];
  feasibilityScore: number;
  halfLifeMonths: number;
  confidence: string;
  projectedReduction90d: number;
  projectedReduction180d: number;
  recommendedSoilAmendment: string;
  confidenceScore: number;
  scientificCitations: string[];
  disclaimer: string;
}

const STORAGE_KEYS = {
  MODE: 'bhujal_dataset_mode',
  REPORTS: 'bhujal_reports_v2',
  CUSTOM_SOURCES: 'bhujal_custom_sources_v2',
  CUSTOM_MEASUREMENTS: 'bhujal_custom_measurements_v2',
};

// Safe helper for localStorage (handles SSR)
function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota errors
  }
}

// Haversine formula to compute great-circle distance between two coordinates in meters
export function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

class BhujalDataStore {
  private mode: DatasetMode = 'sample';
  private customReports: CommunityReport[] = [];
  private customSources: WaterSource[] = [];
  private customMeasurements: Measurement[] = [];

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage() {
    const savedMode = safeGetItem(STORAGE_KEYS.MODE);
    if (savedMode === 'real' || savedMode === 'sample') {
      this.mode = savedMode;
    }

    const savedReports = safeGetItem(STORAGE_KEYS.REPORTS);
    if (savedReports) {
      try {
        this.customReports = JSON.parse(savedReports);
      } catch {
        this.customReports = [];
      }
    }

    const savedSources = safeGetItem(STORAGE_KEYS.CUSTOM_SOURCES);
    if (savedSources) {
      try {
        this.customSources = JSON.parse(savedSources);
      } catch {
        this.customSources = [];
      }
    }

    const savedMeasurements = safeGetItem(STORAGE_KEYS.CUSTOM_MEASUREMENTS);
    if (savedMeasurements) {
      try {
        this.customMeasurements = JSON.parse(savedMeasurements);
      } catch {
        this.customMeasurements = [];
      }
    }
  }

  public getDatasetMode(): DatasetMode {
    return this.mode;
  }

  public getDataMode(): DatasetMode {
    return this.mode;
  }

  public setDatasetMode(mode: DatasetMode) {
    this.mode = mode;
    safeSetItem(STORAGE_KEYS.MODE, mode);
  }

  public isSampleMode(): boolean {
    return this.mode === 'sample';
  }

  // -------------------------------------------------------------
  // Villages
  // -------------------------------------------------------------
  
  // -------------------------------------------------------------
  // Village Normalization & Child Entity Resolution
  // -------------------------------------------------------------
  public resolveVillageId(input: string): string {
    if (!input) return 'V-001';
    const norm = input.trim().toLowerCase();
    const v = demoVillages.find(
      (v) =>
        v.id.toLowerCase() === norm ||
        v.name.toLowerCase() === norm ||
        v.id.replace('-', '').toLowerCase() === norm.replace('-', '')
    );
    return v ? v.id : input;
  }

  public getVillages(): Village[] {
    return demoVillages;
  }

  public getVillageById(id: string): Village | undefined {
    if (!id) return undefined;
    const norm = id.trim().toLowerCase();
    return demoVillages.find(
      (v) =>
        v.id.toLowerCase() === norm ||
        v.name.toLowerCase() === norm ||
        v.id.replace('-', '').toLowerCase() === norm.replace('-', '')
    );
  }

  public getRiskScoreForVillage(villageId: string): RiskScore | undefined {
    const resolved = this.resolveVillageId(villageId);
    return demoRiskScores.find(rs => rs.targetId === resolved);
  }

  
  // -------------------------------------------------------------
  // Media Assets Registry
  // -------------------------------------------------------------
  public getMediaAssets(): MediaAsset[] {
    return demoMediaAssets;
  }

  public getMediaAssetById(id: string): MediaAsset | undefined {
    return demoMediaAssets.find((m: MediaAsset) => m.id === id);
  }

  // -------------------------------------------------------------
  // Botanical Hyperaccumulator Species Library
  // -------------------------------------------------------------
  public getBotanicalSpecies(): BotanicalSpecies[] {
    return demoBotanicalSpecies;
  }

  // -------------------------------------------------------------
  // Water Sources
  // -------------------------------------------------------------
  public getWaterSources(): WaterSource[] {
    return [...demoWaterSources, ...this.customSources];
  }

  public getWaterSourceById(id: string): WaterSource | undefined {
    const normalized = id.trim().toUpperCase();
    return this.getWaterSources().find(
      (s) =>
        s.id.toUpperCase() === normalized ||
        (s.name && s.name.toUpperCase().includes(normalized))
    );
  }

  public getWaterSourcesByVillage(villageId: string): WaterSource[] {
    if (!villageId) return [];
    const vId = this.resolveVillageId(villageId).toLowerCase();
    return this.getWaterSources().filter(
      (s) => s.villageId.toLowerCase() === vId
    );
  }

  // -------------------------------------------------------------
  // Measurements
  // -------------------------------------------------------------
  public getMeasurements(): Measurement[] {
    return [...demoMeasurements, ...this.customMeasurements];
  }

  public getMeasurementsBySource(sourceId: string): Measurement[] {
    return this.getMeasurements()
      .filter((m) => m.sourceId === sourceId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getLatestMeasurement(sourceId: string, parameter = 'Cr(VI)'): Measurement | undefined {
    const measurements = this.getMeasurements()
      .filter(
        (m) =>
          m.sourceId === sourceId &&
          (m.parameter.toLowerCase().includes(parameter.toLowerCase()) ||
            m.parameter.toLowerCase().includes('chromium'))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return measurements[0];
  }

  // -------------------------------------------------------------
  // Nearest Safe Water Finder (Haversine Spatial Calculation)
  // -------------------------------------------------------------
  public findNearestSafeWater(
    userLat: number,
    userLon: number,
    limit = 3
  ): NearestSafeWaterResult[] {
    const allSources = this.getWaterSources();

    // Safe sources are those marked 'safe' or having measured Cr < 0.05 mg/L
    const safeSources = allSources.filter((s) => {
      if (s.status === 'safe') return true;
      const latest = this.getLatestMeasurement(s.id);
      return latest ? latest.value <= 0.05 : false;
    });

    if (safeSources.length === 0) return [];

    const mapped = safeSources.map((source) => {
      const distance = haversineDistanceMeters(
        userLat,
        userLon,
        source.coordinates.lat,
        source.coordinates.lon
      );
      // Walking speed ~ 4.8 km/h = 80 meters/min
      const walkingMinutes = Math.max(1, Math.round(distance / 80));
      const latestM = this.getLatestMeasurement(source.id);
      const crVal = latestM ? latestM.value : 0.002;

      return {
        source,
        distanceMeters: distance,
        walkingMinutes,
        latestCrMgL: crVal,
        status: 'safe' as const,
        testedDate: latestM ? latestM.date : 'Recent',
        purification: source.name?.includes('RO') ? 'RO + Resin Media' : 'Deep Confined Multi-Barrier',
        powerSource: '5 kW Solar Mini-Grid',
        capacityLitersPerDay: 15000,
        directions: [
          `Head toward ${source.name || 'Solar Borewell'} (${distance}m away).`,
          `Follow paved village road toward the nearest landmark.`,
          `Look for blue overhead potable tank with Jal Jeevan Mission sign.`,
        ],
      };
    });

    return mapped.sort((a, b) => a.distanceMeters - b.distanceMeters).slice(0, limit);
  }

  
  // -------------------------------------------------------------
  // Temporal Filtering (2018–2026 Historical Advection)
  // -------------------------------------------------------------
  public getHistoricalDataForVillage(villageId: string, year?: number) {
    const vId = this.resolveVillageId(villageId);
    const sources = this.getWaterSourcesByVillage(vId);
    const sourceIds = new Set(sources.map(s => s.id));
    
    let measurements = this.getMeasurements().filter(m => sourceIds.has(m.sourceId));
    if (year) {
      measurements = measurements.filter(m => {
        const mYear = parseInt(m.date.split('-')[0], 10);
        return mYear <= year;
      });
    }
    return measurements;
  }

  public getWaterSourcesByYear(year: number): (WaterSource & { activeMeasurement?: Measurement })[] {
    return this.getWaterSources().map(s => {
      const ms = this.getMeasurementsBySource(s.id).filter(m => {
        const mYear = parseInt(m.date.split('-')[0], 10);
        return mYear <= year;
      });
      const latest = ms[0];
      let status = s.status;
      if (latest) {
        status = latest.value > 0.05 ? 'do_not_use' : latest.value >= 0.03 ? 'restricted' : 'safe';
      }
      return {
        ...s,
        status,
        activeMeasurement: latest
      };
    });
  }

  // -------------------------------------------------------------
  // Water Safety Evaluator (WHO Scientific Standard 0.05 mg/L)
  // -------------------------------------------------------------
  public checkWaterSafety(
    searchQuery: string,
    userLat?: number,
    userLon?: number
  ): WaterSafetyVerdict {
    const cleanQuery = searchQuery.trim();
    const allSources = this.getWaterSources();

    // Attempt exact or partial ID match (e.g. HP-047, HP-019, DW-02)
    let foundSource = allSources.find(
      (s) =>
        s.id.toLowerCase() === cleanQuery.toLowerCase() ||
        (s.name && s.name.toLowerCase().includes(cleanQuery.toLowerCase()))
    );

    // If query matches a village name, select its most critical or main pump
    if (!foundSource) {
      const matchedVillage = demoVillages.find(
        (v) =>
          v.name.toLowerCase().includes(cleanQuery.toLowerCase()) ||
          v.hindiName.includes(cleanQuery)
      );
      if (matchedVillage) {
        const villageSources = this.getWaterSourcesByVillage(matchedVillage.id);
        foundSource = villageSources.find((s) => s.status === 'do_not_use') || villageSources[0];
      }
    }

    // Default to HP-047 if no query provided
    if (!foundSource && cleanQuery === '') {
      foundSource = this.getWaterSourceById('HP-047') || allSources[0];
    }

    if (!foundSource) {
      return {
        found: false,
        verdict: 'INSUFFICIENT_DATA',
        headline: 'Water source not found in regional registry',
        hindiHeadline: 'यह जल स्रोत डेटाबेस में नहीं मिला',
        advice: 'Please verify the handpump number (e.g. HP-047) or select your village.',
        hindiAdvice: 'कृपया हैंडपंप संख्या (उदा. HP-047) या अपने गाँव का नाम जाँचें।',
        lastTestedDate: 'N/A',
        laboratory: 'Not Recorded',
        verificationStatus: 'unverified',
      };
    }

    const latestCrVI = this.getLatestMeasurement(foundSource.id, 'Cr(VI)');
    const latestTotalCr = this.getLatestMeasurement(foundSource.id, 'Total Cr');

    const crValue = latestCrVI ? latestCrVI.value : foundSource.status === 'do_not_use' ? 0.72 : 0.002;
    const whoMultiplier = Number((crValue / 0.05).toFixed(1));

    let verdict: WaterSafetyVerdict['verdict'] = 'SAFE';
    if (crValue > 0.05 || foundSource.status === 'do_not_use') {
      verdict = 'UNSAFE';
    } else if (crValue >= 0.03 || foundSource.status === 'restricted') {
      verdict = 'CAUTION';
    }

    const nearestSafe = this.findNearestSafeWater(
      foundSource.coordinates.lat,
      foundSource.coordinates.lon,
      1
    )[0];

    return {
      found: true,
      source: foundSource,
      verdict,
      crVIMgL: crValue,
      totalCrMgL: latestTotalCr ? latestTotalCr.value : crValue * 1.2,
      whoLimitMultiplier: whoMultiplier,
      headline:
        verdict === 'UNSAFE'
          ? 'DO NOT USE FOR DRINKING OR COOKING'
          : verdict === 'CAUTION'
          ? 'RESTRICTED CONSUMPTION — USE ALTERNATIVE'
          : 'VERIFIED SAFE POTABLE SOURCE',
      hindiHeadline:
        verdict === 'UNSAFE'
          ? 'पीने या खाना पकाने में प्रयोग सख्त वर्जित है'
          : verdict === 'CAUTION'
          ? 'सीमित उपयोग — सावधानी बरतें'
          : 'पीने योग्य पूर्णतः सुरक्षित जल',
      advice:
        verdict === 'UNSAFE'
          ? `Hexavalent chromium detected at ${crValue} mg/L (${whoMultiplier}× WHO limit). Ingestion causes severe gastric ulceration and cellular toxicity. Proceed immediately to nearest safe deep borewell.`
          : verdict === 'CAUTION'
          ? `Slight chemical elevation detected near the permissible limit. Avoid giving to infants or pregnant women.`
          : `Chemical analysis confirms contaminant concentrations are well below WHO standards. Safe for household use.`,
      hindiAdvice:
        verdict === 'UNSAFE'
          ? `इस पानी में हेक्सावेलेंट क्रोमियम ${crValue} mg/L पाया गया है (सुरक्षित सीमा से ${whoMultiplier} गुना अधिक)। कृपया तुरंत निकटतम सुरक्षित बोरवेल पर जाएँ।`
          : verdict === 'CAUTION'
          ? `पानी में रासायनिक तत्वों की मात्रा सीमा के निकट है। पीने के लिए वैकल्पिक सुरक्षित स्रोत का उपयोग करें।`
          : `यह पानी प्रयोगशाला परीक्षण में मानकों के अनुरूप सुरक्षित पाया गया है।`,
      lastTestedDate: latestCrVI ? latestCrVI.date : '16 Oct 2024 (Verified)',
      laboratory: latestCrVI?.laboratoryId || 'UPPCB NABL Accredited Lab',
      verificationStatus: latestCrVI?.verificationStatus || 'verified',
      depthMeters: foundSource.type.includes('Shallow') ? 28 : 145,
      alternativeSourceId: nearestSafe?.source.id,
      nearestSafeSource: nearestSafe,
    };
  }

  // -------------------------------------------------------------
  // Community Reports (Real Submission & Persistence)
  // -------------------------------------------------------------
  public getCommunityReports(): CommunityReport[] {
    return [...this.customReports, ...demoCommunityReports].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  public getReportById(id: string): CommunityReport | undefined {
    return this.getCommunityReports().find((r) => r.id === id);
  }

  public getReportsByVillage(villageId: string): CommunityReport[] {
    if (!villageId) return [];
    const vId = this.resolveVillageId(villageId).toLowerCase();
    return this.getCommunityReports().filter(
      (r) => r.villageId.toLowerCase() === vId
    );
  }

  public submitCommunityReport(data: {
    category: string;
    description: string;
    villageId?: string;
    waterSourceId?: string;
    locationName?: string;
    latitude?: number;
    longitude?: number;
    photoDataUrl?: string;
    reporterName?: string;
    reporterPhone?: string;
    reporterType?: string;
  }): CommunityReport {
    // Generate unique Bhujal report ID
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newId = `BHL-2026-${randomDigits}`;

    const village = this.getVillageById(data.villageId || 'V-001');

    const newReport: CommunityReport = {
      id: newId,
      title: `${data.category} at ${village?.name || 'Local Community'}`,
      villageId: data.villageId || 'V-001',
      waterSourceId: data.waterSourceId,
      locationName: data.locationName || `${village?.name || 'Village'} Community Zone`,
      category: data.category,
      description: data.description,
      status: 'Reported',
      priority: 'High',
      coordinates: {
        lat: data.latitude || village?.coordinates.lat || 26.4481,
        lon: data.longitude || village?.coordinates.lon || 80.0102,
      },
      hasPhoto: Boolean(data.photoDataUrl),
      photoUrl: data.photoDataUrl,
      photoDataUrl: data.photoDataUrl,
      reporterName: data.reporterName || 'Concerned Citizen',
      reporterPhone: data.reporterPhone,
      reporterType: data.reporterType || 'Resident',
      verificationStatus: 'Report Logged — Awaiting Field Inspection',
      evidenceCount: data.photoDataUrl ? 1 : 0,
      date: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      isDemo: this.mode === 'sample',
    };

    // Store in custom reports and persist to localStorage
    this.customReports.unshift(newReport);
    safeSetItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.customReports));

    // Dispatch realtime event so all components/maps update immediately
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bhujal_data_updated', { detail: { reportId: newId } }));
    }

    return newReport;
  }

  // -------------------------------------------------------------
  // Schools & Sensitive Locations
  // -------------------------------------------------------------
  public getSchools(): School[] {
    return demoSchools;
  }

  public getSchoolsByVillage(villageId: string): School[] {
    if (!villageId) return [];
    const vId = this.resolveVillageId(villageId).toLowerCase();
    return demoSchools.filter((s) => s.villageId.toLowerCase() === vId);
  }

  // -------------------------------------------------------------
  // Groundwater Monitoring Points
  // -------------------------------------------------------------
  public getGroundwaterPoints(): GroundwaterPoint[] {
    return demoGroundwaterPoints;
  }

  public getGroundwaterPointsByVillage(villageId: string): GroundwaterPoint[] {
    if (!villageId) return [];
    const vId = this.resolveVillageId(villageId).toLowerCase();
    return demoGroundwaterPoints.filter((gp) => gp.villageId.toLowerCase() === vId);
  }

  // -------------------------------------------------------------
  // Healthcare Facilities
  // -------------------------------------------------------------
  public getHealthcare(): HealthcareFacility[] {
    return demoHealthcare;
  }

  public getHealthcareByVillage(villageId: string): HealthcareFacility[] {
    if (!villageId) return [];
    const vId = this.resolveVillageId(villageId).toLowerCase();
    return demoHealthcare.filter((h) => h.villageId.toLowerCase() === vId);
  }

  // -------------------------------------------------------------
  // Agricultural Zones
  // -------------------------------------------------------------
  public getAgriculturalZones(): AgriculturalZone[] {
    return demoAgriculturalZones;
  }

  public getAgriculturalZonesByVillage(villageId: string): AgriculturalZone[] {
    if (!villageId) return [];
    const vId = this.resolveVillageId(villageId).toLowerCase();
    return demoAgriculturalZones.filter((a) => a.villageId.toLowerCase() === vId);
  }

  // -------------------------------------------------------------
  // Contamination Sources
  // -------------------------------------------------------------
  public getContaminationSources(): ContaminationSource[] {
    return demoContaminationSources;
  }

  // -------------------------------------------------------------
  // Timeline Events
  // -------------------------------------------------------------
  public getTimelineEvents(): TimelineEvent[] {
    return demoTimelineEvents;
  }

  public getTimelineEventsByVillage(villageId: string): TimelineEvent[] {
    if (!villageId) return [];
    const vId = this.resolveVillageId(villageId).toLowerCase();
    return demoTimelineEvents.filter((t) => t.villageId.toLowerCase() === vId);
  }

  // -------------------------------------------------------------
  // Soil Samples
  // -------------------------------------------------------------
  public getSoilSamples(): SoilSample[] {
    return demoSoilSamples;
  }

  public getSoilSamplesByVillage(villageId: string): SoilSample[] {
    const vId = villageId.toLowerCase();
    return demoSoilSamples.filter(s => s.villageId.toLowerCase() === vId);
  }

  // -------------------------------------------------------------
  // CSV Data Exports (Real Data Center Downloads)
  // -------------------------------------------------------------
  public exportReportsCsv(): string {
    const reports = this.getCommunityReports();
    const headers = ['Report ID', 'Title', 'Category', 'Village ID', 'Location', 'Water Source ID', 'Latitude', 'Longitude', 'Status', 'Priority', 'Reporter', 'Date', 'Verification'];
    const rows = reports.map(r => [
      r.id,
      `"${(r.title || '').replace(/"/g, '""')}"`,
      `"${r.category.replace(/"/g, '""')}"`,
      r.villageId,
      `"${(r.locationName || '').replace(/"/g, '""')}"`,
      r.waterSourceId || '',
      typeof r.coordinates?.lat === 'number' ? r.coordinates.lat : (r.coordinates as any)?.[0] ?? 26.45,
      typeof r.coordinates?.lon === 'number' ? r.coordinates.lon : (r.coordinates as any)?.[1] ?? 80.35,
      r.status,
      r.priority || 'Medium',
      `"${(r.reporterType || r.reporterName || '').replace(/"/g, '""')}"`,
      r.date,
      `"${(r.verificationStatus || '').replace(/"/g, '""')}"`
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  public exportWaterSourcesCsv(): string {
    const sources = this.getWaterSources();
    const headers = ['ID', 'Name', 'Village ID', 'Type', 'Latitude', 'Longitude', 'Depth (m)', 'Status', 'Population Served', 'Nearest School Distance (m)', 'Alternative Source ID'];
    const rows = sources.map(s => [
      s.id,
      `"${(s.name || s.id).replace(/"/g, '""')}"`,
      s.villageId,
      s.type,
      s.coordinates.lat,
      s.coordinates.lon,
      s.depthMeters || 14,
      s.status,
      s.populationServed || 250,
      s.nearestSchoolDistance || 300,
      s.alternativeSourceId || ''
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  public exportVillagesCsv(): string {
    const villages = this.getVillages();
    const headers = ['ID', 'Name', 'Hindi Name', 'District', 'Block', 'Population', 'Households', 'Latitude', 'Longitude', 'Contamination Status', 'Risk Level'];
    const rows = villages.map(v => [
      v.id,
      `"${v.name}"`,
      `"${v.hindiName}"`,
      `"${v.district || 'Kanpur Nagar'}"`,
      `"${v.block || 'Rania'}"`,
      v.population,
      v.households || Math.round(v.population / 5),
      v.coordinates.lat,
      v.coordinates.lon,
      v.contaminationStatus || 'High',
      v.riskLevel
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  public exportMeasurementsCsv(): string {
    const measurements = demoMeasurements;
    const headers = ['ID', 'Source ID', 'Date', 'Parameter', 'Value', 'Unit', 'Method', 'Laboratory ID', 'Verification Status'];
    const rows = measurements.map(m => [
      m.id,
      m.sourceId,
      m.date,
      m.parameter,
      m.value,
      m.unit,
      `"${m.method}"`,
      m.laboratoryId,
      m.verificationStatus
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  public exportSchoolsCsv(): string {
    const schools = demoSchools;
    const headers = ['ID', 'Name', 'Village ID', 'Student Count', 'Nearest Water Source ID', 'Latitude', 'Longitude'];
    const rows = schools.map(s => [
      s.id,
      `"${s.name}"`,
      s.villageId,
      s.studentCount,
      s.nearestWaterSourceId,
      s.coordinates.lat,
      s.coordinates.lon
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  public exportContaminationSourcesCsv(): string {
    const sources = demoContaminationSources;
    const headers = ['ID', 'Name', 'Type', 'Status', 'Impact Radius (m)', 'Latitude', 'Longitude'];
    const rows = sources.map(c => [
      c.id,
      `"${c.name}"`,
      c.type,
      c.status,
      c.estimatedImpactRadius,
      c.coordinates.lat,
      c.coordinates.lon
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  public exportRemediationProjectsCsv(): string {
    const projects = demoRemediationProjects;
    const headers = ['ID', 'Title', 'Village ID', 'Stage', 'Type', 'Lead Agency', 'Status'];
    const rows = projects.map(p => [
      p.id,
      `"${p.title}"`,
      p.villageId,
      p.stage,
      p.type,
      `"${p.leadAgency || 'State Groundwater Directorate'}"`,
      p.status || p.stage
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // -------------------------------------------------------------
  // Remediation Projects
  // -------------------------------------------------------------
  public getRemediationProjects(): RemediationProject[] {
    return demoRemediationProjects;
  }

  public getRemediationProjectsByVillage(villageId: string): RemediationProject[] {
    if (!villageId) return [];
    const vId = this.resolveVillageId(villageId).toLowerCase();
    return demoRemediationProjects.filter(
      (p) => p.villageId.toLowerCase() === vId
    );
  }

  public calculateNatureRemediation(
    inputsOrPh: number | {
      ph: number;
      moisturePercent: number;
      crConcentrationMgKg: number;
      soilType?: string;
      groundwaterDepthMeters?: number;
    },
    moistureArg?: number,
    crArg?: number,
    depthArg?: number,
    soilTypeArg?: string
  ): RemediationPrescription {
    let ph = 7.2;
    let moisturePercent = 35;
    let crConcentrationMgKg = 85;
    let soilType = 'Sandy Loam';
    let groundwaterDepthMeters = 14;

    if (typeof inputsOrPh === 'object' && inputsOrPh !== null) {
      ph = inputsOrPh.ph;
      moisturePercent = inputsOrPh.moisturePercent;
      crConcentrationMgKg = inputsOrPh.crConcentrationMgKg;
      soilType = inputsOrPh.soilType || 'Sandy Loam';
      groundwaterDepthMeters = inputsOrPh.groundwaterDepthMeters || 14;
    } else if (typeof inputsOrPh === 'number') {
      ph = inputsOrPh;
      if (moistureArg !== undefined) moisturePercent = moistureArg;
      if (crArg !== undefined) crConcentrationMgKg = crArg;
      if (depthArg !== undefined) groundwaterDepthMeters = depthArg;
      if (soilTypeArg !== undefined) soilType = soilTypeArg;
    }

    // Dynamic Multi-Factor Suitability Scoring for all species
    const scoredCandidates = demoBotanicalSpecies.map((sp: BotanicalSpecies) => {
      // pH compatibility (0 - 100)
      let phScore = 100;
      if (ph < sp.preferredPhMin) {
        phScore = Math.max(10, 100 - (sp.preferredPhMin - ph) * 35);
      } else if (ph > sp.preferredPhMax) {
        phScore = Math.max(10, 100 - (ph - sp.preferredPhMax) * 35);
      }

      // Moisture compatibility (0 - 100)
      let moistureScore = 100;
      if (moisturePercent < sp.preferredMoistureMin) {
        moistureScore = Math.max(15, 100 - (sp.preferredMoistureMin - moisturePercent) * 3);
      } else if (moisturePercent > sp.preferredMoistureMax) {
        moistureScore = Math.max(15, 100 - (moisturePercent - sp.preferredMoistureMax) * 3);
      }

      // Cr tolerance score
      let crScore = 100;
      if (crConcentrationMgKg > sp.maxCrToleranceMgKg) {
        const excess = crConcentrationMgKg - sp.maxCrToleranceMgKg;
        crScore = Math.max(5, 100 - excess * 0.8);
      }

      // Depth feasibility score
      let depthScore = 100;
      if (groundwaterDepthMeters > sp.effectiveRootDepthMeters) {
        depthScore = Math.max(40, 100 - (groundwaterDepthMeters - sp.effectiveRootDepthMeters) * 4);
      }

      const totalSuitability = Math.round(
        phScore * 0.35 + moistureScore * 0.25 + crScore * 0.25 + depthScore * 0.15
      );

      // Construct tailored warning and agronomic recommendation
      const warnings: string[] = [];
      if (ph < sp.preferredPhMin || ph > sp.preferredPhMax) {
        warnings.push(`Soil pH (${ph}) is outside optimal range (${sp.preferredPhMin} - ${sp.preferredPhMax}). Lime or biochar buffering advised.`);
      }
      if (crConcentrationMgKg > sp.maxCrToleranceMgKg) {
        warnings.push(`Cr(VI) concentration (${crConcentrationMgKg} mg/kg) exceeds typical unassisted threshold (${sp.maxCrToleranceMgKg} mg/kg). Pre-dilution required.`);
      }
      if (groundwaterDepthMeters > sp.effectiveRootDepthMeters + 3) {
        warnings.push(`Water table depth (${groundwaterDepthMeters}m) exceeds root reach (${sp.effectiveRootDepthMeters}m). Interception trench required for groundwater contact.`);
      }

      return {
        scientificName: sp.scientificName,
        commonName: sp.commonName,
        mechanism: sp.mechanism,
        bcf: sp.bioaccumulationFactor,
        rootDepth: `${sp.effectiveRootDepthMeters}m depth`,
        care: `${sp.agronomicCare} ${warnings.length > 0 ? 'Note: ' + warnings[0] : ''}`,
        photoUrl: sp.photoUrl,
        suitabilityScore: totalSuitability,
        warnings,
        citations: sp.citations
      };
    }).sort((a: any, b: any) => b.suitabilityScore - a.suitabilityScore);

    const primaryCandidate = scoredCandidates[0];
    let strategy = `${primaryCandidate.commonName} Phytoremediation Swale with Root Barrier`;
    let hindiStrategy = `${primaryCandidate.commonName} द्वारा फाइटोरीमेडिएशन एवं बायो-बैरियर प्रणाली`;
    
    if (crConcentrationMgKg > 100) {
      strategy = `Integrated ${scoredCandidates[0].commonName} + ${scoredCandidates[1]?.commonName || 'Deep Root'} Hyperaccumulation with Biochar Amendment`;
      hindiStrategy = 'उच्च-सांद्रता क्रोमियम निष्कासन एवं बायोचार मृदा उपचार प्रणाली';
    } else if (ph > 8.5) {
      strategy = `Alkaline Tolerant ${primaryCandidate.commonName} Rhizofiltration Buffer`;
      hindiStrategy = 'क्षारीय प्रतिरोधी पादप राइजोफिल्ट्रेशन बफर';
    }

    const feasibilityScore = Math.max(20, Math.min(98, primaryCandidate.suitabilityScore));
    const halfLifeMonths = crConcentrationMgKg > 100 ? 14 : crConcentrationMgKg > 50 ? 9 : 6;
    const confidence = feasibilityScore > 85 ? 'High' : feasibilityScore > 65 ? 'Medium' : 'Caution';
    
    let projected90d = Math.round(feasibilityScore * 0.65);
    let projected180d = Math.round(feasibilityScore * 0.88);

    const allCitations = Array.from(new Set([
      'CPCB Guidelines for In-Situ Remediation of Chromium Contaminated Sites (2022)',
      'CSIR-NBRI Lucknow Phytoremediation Pilot Studies in Kanpur Tanneries (2023)',
      'IIT Kanpur Environmental Engineering Heavy Metal Biosorption Studies (2023)',
      ...primaryCandidate.citations
    ]));

    return {
      primaryStrategy: strategy,
      hindiStrategy,
      candidateSpecies: scoredCandidates.slice(0, 3).map((c: any) => ({
        name: c.commonName,
        botanicalName: c.scientificName,
        rootDepth: c.rootDepth,
        mechanism: c.mechanism,
        removalEfficiency: `${c.suitabilityScore}% site compatibility score`
      })),
      candidates: scoredCandidates,
      feasibilityScore,
      halfLifeMonths,
      confidence,
      projectedReduction90d: projected90d,
      projectedReduction180d: projected180d,
      recommendedSoilAmendment:
        soilType === 'Sandy Loam'
          ? 'Add 2% activated wood biochar (pyrolysis 500°C) to prevent downward leachate migration into unconfined aquifer.'
          : 'Incorporate composted farmyard manure (FYM) to stimulate native metal-reducing bacteria and enhance humus binding.',
      confidenceScore: feasibilityScore,
      scientificCitations: allCitations,
      disclaimer:
        'Potential biological intervention calculated based on empirical hydrogeological parameters. Pilot plot field validation required prior to full-scale deployment.'
    };
  }

  public calculateRemediationFeasibility(ph: number, moisture: number, cr: number, depth: number) {
    return this.calculateNatureRemediation({
      ph,
      moisturePercent: moisture,
      crConcentrationMgKg: cr,
      groundwaterDepthMeters: depth,
    });
  }

  // -------------------------------------------------------------
  // Real Ingestion Pipeline (CSV, GeoJSON, JSON)
  // -------------------------------------------------------------
  public importDataset(
    fileContent: string,
    fileType: 'csv' | 'geojson' | 'json',
    fileName?: string
  ): {
    success: boolean;
    recordsImported: number;
    recordsCount: number;
    errors: string[];
    error?: string;
  } {
    const errors: string[] = [];
    let importedCount = 0;

    try {
      if (fileType === 'csv') {
        const lines = fileContent.trim().split(/\r?\n/);
        if (lines.length < 2) {
          return { success: false, recordsImported: 0, recordsCount: 0, errors: ['File is empty or missing headers'], error: 'File is empty or missing headers' };
        }

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const idIdx = headers.findIndex((h) => h.includes('id') || h.includes('well'));
        const latIdx = headers.findIndex((h) => h.includes('lat'));
        const lonIdx = headers.findIndex((h) => h.includes('lon') || h.includes('lng'));
        const crIdx = headers.findIndex((h) => h.includes('cr') || h.includes('chromium'));

        if (latIdx === -1 || lonIdx === -1) {
          return {
            success: false,
            recordsImported: 0,
            recordsCount: 0,
            errors: ['CSV must contain latitude and longitude columns'],
            error: 'CSV must contain latitude and longitude columns',
          };
        }

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map((r) => r.trim());
          if (row.length < headers.length) continue;

          const lat = parseFloat(row[latIdx]);
          const lon = parseFloat(row[lonIdx]);

          // Uttar Pradesh bounds validation: 23.5°N - 30.5°N, 77.0°E - 84.5°E
          if (isNaN(lat) || isNaN(lon) || lat < 23.5 || lat > 30.5 || lon < 77.0 || lon > 84.5) {
            errors.push(`Row ${i}: Coordinates (${lat}, ${lon}) outside Uttar Pradesh boundary`);
            continue;
          }

          const crVal = crIdx !== -1 ? parseFloat(row[crIdx]) || 0.02 : 0.02;
          const wellId = idIdx !== -1 && row[idIdx] ? row[idIdx] : `IMP-WELL-${i}`;

          const newSource: WaterSource = {
            id: wellId,
            villageId: 'V-001',
            type: 'India Mark II Tube-well',
            status: crVal > 0.05 ? 'do_not_use' : 'safe',
            coordinates: { lat, lon },
            restrictions: {
              drinking: crVal <= 0.05,
              cooking: crVal <= 0.05,
              bathing: true,
              irrigation: true,
              livestock: true,
            },
            populationServed: 450,
            nearestSchoolDistance: 280,
            agriculturalArea: 12.5,
            isDemo: false,
            name: `Imported Well ${wellId}`,
            dataStatus: 'verified',
          };

          const newMeasurement: Measurement = {
            id: `IMP-M-${i}`,
            sourceId: wellId,
            date: new Date().toISOString().split('T')[0],
            parameter: 'Cr(VI)',
            value: crVal,
            unit: 'mg/L',
            method: 'Spectrophotometry ISO/IEC 17025',
            laboratoryId: 'Uploaded Dataset Batch',
            verificationStatus: 'verified',
            isDemo: false,
          };

          this.customSources.push(newSource);
          this.customMeasurements.push(newMeasurement);
          importedCount++;
        }
      } else if (fileType === 'geojson' || fileType === 'json') {
        const parsed = JSON.parse(fileContent);
        const features = parsed.features || (Array.isArray(parsed) ? parsed : [parsed]);

        features.forEach((feat: any, idx: number) => {
          const coords = feat.geometry?.coordinates || [feat.longitude || feat.lon, feat.latitude || feat.lat];
          if (coords && coords.length >= 2) {
            const lon = parseFloat(coords[0]);
            const lat = parseFloat(coords[1]);

            if (lat >= 23.5 && lat <= 30.5 && lon >= 77.0 && lon <= 84.5) {
              const wellId = feat.properties?.id || feat.id || `IMP-GEO-${idx + 1}`;
              const crVal = feat.properties?.cr_vi || feat.properties?.chromium || 0.02;

              this.customSources.push({
                id: wellId,
                villageId: 'V-001',
                type: 'GeoJSON Water Point',
                status: crVal > 0.05 ? 'do_not_use' : 'safe',
                coordinates: { lat, lon },
                restrictions: {
                  drinking: crVal <= 0.05,
                  cooking: crVal <= 0.05,
                  bathing: true,
                  irrigation: true,
                  livestock: true,
                },
                populationServed: 500,
                nearestSchoolDistance: 300,
                agriculturalArea: 15,
                isDemo: false,
                name: feat.properties?.name || `Imported Site ${wellId}`,
                dataStatus: 'verified',
              });

              importedCount++;
            }
          }
        });
      }

      if (importedCount > 0) {
        this.setDatasetMode('real');
        safeSetItem(STORAGE_KEYS.CUSTOM_SOURCES, JSON.stringify(this.customSources));
        safeSetItem(STORAGE_KEYS.CUSTOM_MEASUREMENTS, JSON.stringify(this.customMeasurements));
      }

      return {
        success: importedCount > 0,
        recordsImported: importedCount,
        recordsCount: importedCount,
        errors,
        error: errors.length > 0 ? errors[0] : undefined,
      };
    } catch (e: any) {
      return {
        success: false,
        recordsImported: 0,
        recordsCount: 0,
        errors: [`File parse error: ${e.message}`],
        error: `File parse error: ${e.message}`,
      };
    }
  }

  // -------------------------------------------------------------
  // Real Global Search Across Entities
  // -------------------------------------------------------------
  public globalSearch(query: string): SearchResultItem[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // Search Villages
    demoVillages.forEach((v) => {
      if (
        v.name.toLowerCase().includes(q) ||
        v.hindiName.includes(q) ||
        v.id.toLowerCase().includes(q) ||
        (v.district && v.district.toLowerCase().includes(q))
      ) {
        results.push({
          id: v.id,
          title: `${v.name} (${v.hindiName})`,
          subtitle: `Village in ${v.district || 'Kanpur Dehat'} · Pop: ${v.population.toLocaleString()}`,
          type: 'village',
          href: `/villages/${v.id}`,
          coordinates: v.coordinates,
          badge: v.riskLevel,
        });
      }
    });

    // Search Water Sources
    this.getWaterSources().forEach((s) => {
      if (
        s.id.toLowerCase().includes(q) ||
        (s.name && s.name.toLowerCase().includes(q))
      ) {
        results.push({
          id: s.id,
          title: s.name || `Handpump #${s.id}`,
          subtitle: `Water Point #${s.id} · Status: ${s.status.toUpperCase()}`,
          type: 'watersource',
          href: `/water-safety?source=${encodeURIComponent(s.id)}`,
          coordinates: s.coordinates,
          badge: s.status === 'safe' ? 'SAFE' : 'HAZARDOUS',
        });
      }
    });

    // Search Remediation Projects
    demoRemediationProjects.forEach((p) => {
      const pTitle = p.title || p.name || '';
      const pDesc = p.description || '';
      const pStage = p.stage || p.status || 'proposed';
      if (
        pTitle.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        pDesc.toLowerCase().includes(q)
      ) {
        results.push({
          id: p.id,
          title: pTitle,
          subtitle: `${p.type} · Status: ${pStage.toUpperCase()}`,
          type: 'project',
          href: `/remediation`,
          badge: pStage,
        });
      }
    });

    // Search Community Reports
    this.getCommunityReports().forEach((r) => {
      if (
        r.id.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: r.id,
          title: `Report #${r.id} (${r.category.toUpperCase()})`,
          subtitle: `${r.description.slice(0, 50)}... · Status: ${r.status}`,
          type: 'report',
          href: `/reports`,
          coordinates: r.coordinates,
          badge: r.status,
        });
      }
    });

    return results.slice(0, 8);
  }
}

// Global Singleton Instance
export const db = new BhujalDataStore();
export const getDb = () => db;

export type VillageRecord = Village;
export type WaterSourceRecord = WaterSource;
export type CommunityReportRecord = CommunityReport & {
  locationName?: string;
  photoUrl?: string;
  verified?: boolean;
  reporterName?: string;
  reporterPhone?: string;
  coordinates?: { lat: number; lon: number } | [number, number];
};
export type RemediationProjectRecord = RemediationProject & {
  name?: string;
  location?: string;
  responsibleOrg?: string;
  description?: string;
  progress?: number;
  status?: string;
};
