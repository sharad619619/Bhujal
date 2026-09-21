// ============================================================
// Bhujal AI — Domain Types
// ============================================================

// --- Enums & Constants ---

export type DataStatus = 'verified' | 'reported' | 'estimated' | 'predicted' | 'unknown';
export type ContaminationLevel = 'low' | 'moderate' | 'elevated' | 'high';
export type WaterSourceStatus = 'safe' | 'restricted' | 'do_not_use' | 'unknown' | 'not_tested';
export type ReportStatus = 'reported' | 'under_review' | 'field_verified' | 'lab_verified' | 'confirmed' | 'unverified' | 'closed';
export type ReportCategory = 'water' | 'soil' | 'waste_dumping' | 'hand_pump' | 'crop_vegetation' | 'other';
export type RemediationStatus = 'proposed' | 'approved' | 'in_progress' | 'monitoring' | 'completed' | 'suspended';
export type UserRole = 'public' | 'community_member' | 'field_volunteer' | 'researcher' | 'ngo' | 'authority' | 'administrator';
export type WaterUseType = 'drinking' | 'cooking' | 'bathing' | 'irrigation' | 'livestock';
export type EvidenceType = 'community_report' | 'official_measurement' | 'laboratory_result' | 'government_action' | 'remediation_outcome';
export type PredictionHorizon = '30_days' | '90_days' | '180_days' | '1_year';
export type TrendDirection = 'increasing' | 'stable' | 'declining' | 'insufficient_data';

export const CONTAMINATION_COLORS: Record<ContaminationLevel, string> = {
  low: '#22c55e',
  moderate: '#eab308',
  elevated: '#f97316',
  high: '#dc2626',
};

export const STATUS_COLORS: Record<DataStatus, string> = {
  verified: '#16a34a',
  reported: '#2563eb',
  estimated: '#d97706',
  predicted: '#7c3aed',
  unknown: '#6b7280',
};

// --- GeoJSON helpers ---

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: [number, number][][];
}

// --- Core Entities ---

export interface Village {
  id: string;
  name: string;
  nameHi: string;
  state: string;
  district: string;
  block: string;
  location: GeoPoint;
  boundary?: GeoPolygon;
  population: number;
  households: number;
  totalWaterSources: number;
  affectedWaterSources: number;
  highRiskSources: number;
  schools: number;
  healthcareFacilities: number;
  agriculturalZones: number;
  groundwaterDepthM: number;
  knownContaminationSources: number;
  verifiedContaminationPoints: number;
  remediationProjects: number;
  lastDataUpdate: string;
  dataStatus: DataStatus;
  isDemo: boolean;
}

export interface WaterSource {
  id: string;
  villageId: string;
  type: 'hand_pump' | 'borewell' | 'community_station' | 'piped_supply' | 'open_well' | 'tanker';
  name: string;
  nameHi: string;
  location: GeoPoint;
  status: WaterSourceStatus;
  usageRestrictions: Record<WaterUseType, WaterSourceStatus>;
  lastVerified: string;
  lastMeasurement?: ChromiumMeasurement;
  nearbyHouseholds: number;
  populationEstimate: number;
  nearestSchoolDistanceM: number;
  agriculturalAreaKm2: number;
  alternativeSourceId?: string;
  alternativeSourceDistanceM?: number;
  dataStatus: DataStatus;
  isDemo: boolean;
}

export interface ChromiumMeasurement {
  id: string;
  sourceId: string;
  villageId: string;
  location: GeoPoint;
  sampleDate: string;
  chromiumTotalMgL: number | null;
  chromiumVIMgL: number | null;
  unit: string;
  source: string;
  method: string;
  laboratory: string;
  verificationStatus: DataStatus;
  uploadedBy: string;
  createdAt: string;
  isDemo: boolean;
}

export interface GroundwaterPoint {
  id: string;
  villageId: string;
  name: string;
  location: GeoPoint;
  depthM: number;
  lastMeasuredDate: string;
  measurements: ChromiumMeasurement[];
  dataStatus: DataStatus;
  isDemo: boolean;
}

export interface SoilSample {
  id: string;
  villageId: string;
  location: GeoPoint;
  sampleDate: string;
  chromiumMgKg: number | null;
  soilType: string;
  pH: number;
  moisture: number;
  depthCm: number;
  source: string;
  dataStatus: DataStatus;
  isDemo: boolean;
}

export interface School {
  id: string;
  villageId: string;
  name: string;
  nameHi: string;
  location: GeoPoint;
  studentCount: number;
  nearestWaterSourceId: string;
  nearestWaterSourceDistanceM: number;
  isDemo: boolean;
}

export interface HealthcareFacility {
  id: string;
  villageId: string;
  name: string;
  nameHi: string;
  type: 'phc' | 'chc' | 'hospital' | 'clinic';
  location: GeoPoint;
  isDemo: boolean;
}

export interface AgriculturalZone {
  id: string;
  villageId: string;
  name: string;
  nameHi: string;
  boundary: GeoPolygon;
  areaKm2: number;
  cropType: string;
  irrigationSource: string;
  contaminationExposure: ContaminationLevel;
  dataStatus: DataStatus;
  isDemo: boolean;
}

export interface ContaminationSource {
  id: string;
  villageId: string;
  name: string;
  nameHi: string;
  type: 'tannery' | 'industrial' | 'waste_dump' | 'effluent_channel' | 'other';
  location: GeoPoint;
  boundary?: GeoPolygon;
  status: 'active' | 'closed' | 'abandoned' | 'remediated' | 'suspected';
  description: string;
  discoveredDate: string;
  dataStatus: DataStatus;
  isDemo: boolean;
}

export interface CommunityReport {
  id: string;
  referenceNumber: string;
  villageId: string;
  waterSourceId?: string;
  category: ReportCategory;
  location: GeoPoint;
  description: string;
  photoUrl?: string;
  reportedAt: string;
  reporterName?: string;
  reporterContact?: string;
  status: ReportStatus;
  assignedTo?: string;
  verificationNotes?: string;
  resolvedAt?: string;
  isDemo: boolean;
}

export interface RemediationProject {
  id: string;
  villageId: string;
  name: string;
  nameHi: string;
  type: 'immediate_protection' | 'alternative_supply' | 'source_containment' | 'groundwater_remediation' | 'soil_remediation' | 'phytoremediation' | 'monitoring';
  status: RemediationStatus;
  startDate: string;
  expectedEndDate?: string;
  actualEndDate?: string;
  responsibleOrganization: string;
  description: string;
  interventionDetails: string;
  baselineMeasurements: MonitoringMeasurement;
  monitoringMeasurements: MonitoringMeasurement[];
  milestones: RemediationMilestone[];
  isDemo: boolean;
}

export interface MonitoringMeasurement {
  date: string;
  chromiumMgL: number | null;
  chromiumVIMgL: number | null;
  groundwaterDepthM: number | null;
  soilChromiumMgKg: number | null;
  label: string;
  dataStatus: DataStatus;
}

export interface RemediationMilestone {
  id: string;
  title: string;
  titleHi: string;
  dueDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  description: string;
}

export interface TimelineEvent {
  id: string;
  locationId: string;
  date: string;
  title: string;
  titleHi: string;
  description: string;
  type: EvidenceType;
  source: string;
  attachments: string[];
  dataStatus: DataStatus;
  isDemo: boolean;
}

export interface PredictionResult {
  id: string;
  villageId: string;
  runDate: string;
  horizon: PredictionHorizon;
  affectedHandPumps: number;
  affectedAgricultureZones: number;
  confidence: number; // 0-100
  contributingFactors: ContributingFactor[];
  modelVersion: string;
  trainingDataset: string;
  isDemo: boolean;
}

export interface ContributingFactor {
  name: string;
  nameHi: string;
  contribution: number; // 0-100
  description: string;
}

export interface RiskScore {
  locationId: string;
  locationType: 'village' | 'water_source';
  score: number; // 0-100
  priority: 'very_high' | 'high' | 'medium' | 'low';
  factors: PriorityFactor[];
  calculatedAt: string;
  modelVersion: string;
  isDemo: boolean;
}

export interface PriorityFactor {
  name: string;
  nameHi: string;
  weight: number; // 0-100 percentage
  value: string;
  impact: 'high' | 'medium' | 'low';
}

export interface DataSource {
  id: string;
  name: string;
  organization: string;
  collectionDate: string;
  geographicCoverage: string;
  measurementMethod: string;
  lastUpdate: string;
  confidence: DataStatus;
  license: string;
  citation: string;
  category: 'laboratory' | 'government' | 'satellite' | 'groundwater' | 'community' | 'research' | 'model';
}

// --- UI Types ---

export interface KPICard {
  title: string;
  titleHi: string;
  value: number | string;
  icon: string;
  trend?: TrendDirection;
  changeFromPrevious?: number;
}

export interface MapLayer {
  id: string;
  name: string;
  nameHi: string;
  visible: boolean;
  icon: string;
  color: string;
  type: 'point' | 'polygon' | 'heatmap';
}

export interface Notification {
  id: string;
  title: string;
  titleHi: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  createdAt: string;
  link?: string;
}

// --- i18n ---
export type Language = 'en' | 'hi';
