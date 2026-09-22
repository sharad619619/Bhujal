// ============================================================
// Bhujal AI — Domain Types (aligned with demo data)
// ============================================================

export type DataStatus = 'verified' | 'reported' | 'estimated' | 'predicted' | 'unknown' | 'pending';
export type WaterSourceStatus = 'safe' | 'restricted' | 'do_not_use' | 'unknown' | 'not_tested';
export type ReportStatus = 'new' | 'reported' | 'under_review' | 'investigating' | 'field_verified' | 'lab_verified' | 'confirmed' | 'unverified' | 'resolved' | 'closed';
export type ReportCategory = 'water' | 'water_quality' | 'soil' | 'waste_dumping' | 'hand_pump' | 'crop_vegetation' | 'health' | 'agriculture' | 'other';
export type Language = 'en' | 'hi';

export interface Village {
  id: string;
  name: string;
  hindiName: string;
  coordinates: { lat: number; lon: number };
  population: number;
  isDemo: boolean;
  riskLevel: string;
  // Additional fields used by village pages
  district?: string;
  block?: string;
  state?: string;
  households?: number;
  totalWaterSources?: number;
  affectedWaterSources?: number;
  schools?: number;
  healthcareFacilities?: number;
  agriculturalZones?: number;
  groundwaterDepth?: number;
  contaminationSources?: number;
  contaminationStatus?: string;
  lastUpdated?: string;
  remediationProjects?: number;
}

export interface WaterSource {
  id: string;
  villageId: string;
  type: string;
  status: string;
  coordinates: { lat: number; lon: number };
  restrictions: {
    drinking: boolean;
    cooking: boolean;
    bathing: boolean;
    irrigation: boolean;
    livestock: boolean;
  };
  populationServed: number;
  nearestSchoolDistance: number;
  agriculturalArea: number;
  alternativeSourceId?: string;
  isDemo: boolean;
  // Additional fields
  name?: string;
  depthMeters?: number;
  depth?: number;
  latestCrMgL?: number;
  lastVerified?: string;
  lastTestedDate?: string;
  contaminant?: string;
  riskLevel?: string;
  dataStatus?: string;
  lastMeasurement?: Measurement;
}

export interface Measurement {
  id: string;
  sourceId: string;
  date: string;
  parameter: string;
  value: number;
  unit: string;
  method: string;
  laboratoryId: string;
  verificationStatus: string;
  isDemo: boolean;
}

export interface GroundwaterPoint {
  id: string;
  name: string;
  coordinates: { lat: number; lon: number };
  depth: number;
  villageId: string;
  isDemo: boolean;
}

export interface SoilSample {
  id: string;
  villageId: string;
  coordinates: { lat: number; lon: number };
  date: string;
  chromiumLevel: number;
  ph: number;
  moisture: number;
  soilType: string;
  isDemo: boolean;
}

export interface School {
  id: string;
  villageId: string;
  name: string;
  studentCount: number;
  nearestWaterSourceId: string;
  coordinates: { lat: number; lon: number };
  isDemo: boolean;
}

export interface HealthcareFacility {
  id: string;
  villageId: string;
  name: string;
  type: string;
  coordinates: { lat: number; lon: number };
  isDemo: boolean;
}

export interface AgriculturalZone {
  id: string;
  villageId: string;
  cropType: string;
  irrigationSourceId: string;
  exposureLevel: string;
  coordinates: { lat: number; lon: number };
  isDemo: boolean;
}

export interface ContaminationSource {
  id: string;
  name: string;
  type: string;
  coordinates: { lat: number; lon: number };
  status: string;
  estimatedImpactRadius: number;
  isDemo: boolean;
}

export interface RemediationProject {
  id: string;
  title: string;
  villageId: string;
  stage: string;
  type: string;
  interventionType?: string;
  location?: string;
  name?: string;
  status?: string;
  description?: string;
  budget?: string;
  targetReduction?: string;
  leadAgency?: string;
  responsibleOrg?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  baselineMeasurementId?: string;
  latestMeasurementId?: string;
  isDemo: boolean;
}

export interface CommunityReport {
  id: string;
  villageId: string;
  date: string;
  category: string;
  status: string;
  description: string;
  mediaAssetId?: string;
  waterSourceId?: string;
  coordinates?: { lat: number; lon: number };
  title?: string;
  locationName?: string;
  reporterName?: string;
  reporterPhone?: string;
  reporterType?: string;
  urgency?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  actions?: string[];
  resolution?: string;
  timeline?: any[];
  hasPhoto?: boolean;
  photoUrl?: string;
  photoDataUrl?: string;
  verified?: boolean;
  verificationStatus?: string;
  evidenceCount?: number;
  lastUpdated?: string;
  isDemo: boolean;
}

export interface TimelineEvent {
  id: string;
  villageId: string;
  date: string;
  title: string;
  description: string;
  isDemo: boolean;
  type?: string;
  source?: string;
}

export interface PredictionResult {
  id: string;
  targetId: string;
  targetType: string;
  predictedValue: number;
  confidenceLevel: number;
  contributingFactors: string[];
  date: string;
  isDemo: boolean;
}

export interface RiskScore {
  id: string;
  targetId: string;
  targetType: string;
  score: number;
  factors: { name: string; weight: number; value: number }[];
  date: string;
  isDemo: boolean;
}

export interface DataSource {
  id: string;
  name: string;
  type: string;
  isDemo: boolean;
}

export interface MediaAsset {
  id: string;
  url: string;
  type: 'image' | 'document' | 'video';
  caption: string;
  source: string;
  license: string;
  attribution: string;
  hash: string;
  createdAt: string;
}

export interface BotanicalSpecies {
  id: string;
  scientificName: string;
  commonName: string;
  hindiName?: string;
  photoUrl: string;
  source: string;
  license: string;
  preferredPhMin: number;
  preferredPhMax: number;
  preferredMoistureMin: number;
  preferredMoistureMax: number;
  maxCrToleranceMgKg: number;
  effectiveRootDepthMeters: number;
  bioaccumulationFactor: number;
  mechanism: string;
  agronomicCare: string;
  citations: string[];
}
