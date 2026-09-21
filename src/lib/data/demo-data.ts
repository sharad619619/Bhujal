import {
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
  DataSource
} from '@/lib/types';

export const DEMO_MODE = true;

// 1. Villages
export const demoVillages: Village[] = [
  {
    id: 'V-001',
    name: 'Khanchandpur',
    hindiName: 'खानचंदपुर',
    coordinates: { lat: 26.465, lon: 80.342 },
    population: 8240,
    isDemo: true,
    riskLevel: 'critical',
    district: 'Kanpur Nagar',
    block: 'Rania',
    state: 'Uttar Pradesh',
    households: 1648,
    totalWaterSources: 17,
    affectedWaterSources: 12,
    schools: 3,
    healthcareFacilities: 1,
    agriculturalZones: 4,
    groundwaterDepth: 14,
    contaminationSources: 2,
    contaminationStatus: 'High',
    lastUpdated: '2026-09-12',
    remediationProjects: 1,
  },
  {
    id: 'V-002',
    name: 'Rania',
    hindiName: 'रनिया',
    coordinates: { lat: 26.448, lon: 80.301 },
    population: 4500,
    isDemo: true,
    riskLevel: 'high',
    district: 'Kanpur Nagar',
    block: 'Rania',
    state: 'Uttar Pradesh',
    households: 900,
    totalWaterSources: 8,
    affectedWaterSources: 5,
    schools: 2,
    healthcareFacilities: 1,
    agriculturalZones: 2,
    groundwaterDepth: 16,
    contaminationSources: 1,
    contaminationStatus: 'Moderate',
    lastUpdated: '2026-08-20',
    remediationProjects: 1,
  },
  {
    id: 'V-003',
    name: 'Panki',
    hindiName: 'पनकी',
    coordinates: { lat: 26.472, lon: 80.285 },
    population: 6100,
    isDemo: true,
    riskLevel: 'high',
    district: 'Kanpur Nagar',
    block: 'Kalyanpur',
    state: 'Uttar Pradesh',
    households: 1220,
    totalWaterSources: 10,
    affectedWaterSources: 7,
    schools: 2,
    healthcareFacilities: 1,
    agriculturalZones: 2,
    groundwaterDepth: 12,
    contaminationSources: 1,
    contaminationStatus: 'High',
    lastUpdated: '2026-09-05',
    remediationProjects: 1,
  },
  {
    id: 'V-004',
    name: 'Sachendi',
    hindiName: 'सचेंडी',
    coordinates: { lat: 26.425, lon: 80.254 },
    population: 3200,
    isDemo: true,
    riskLevel: 'moderate',
    district: 'Kanpur Dehat',
    block: 'Sachendi',
    state: 'Uttar Pradesh',
    households: 640,
    totalWaterSources: 5,
    affectedWaterSources: 2,
    schools: 1,
    healthcareFacilities: 1,
    agriculturalZones: 1,
    groundwaterDepth: 18,
    contaminationSources: 1,
    contaminationStatus: 'Moderate',
    lastUpdated: '2026-07-15',
    remediationProjects: 0,
  },
  {
    id: 'V-005',
    name: 'Rooma',
    hindiName: 'रूमा',
    coordinates: { lat: 26.385, lon: 80.412 },
    population: 5800,
    isDemo: true,
    riskLevel: 'low',
    district: 'Kanpur Nagar',
    block: 'Ghatampur',
    state: 'Uttar Pradesh',
    households: 1160,
    totalWaterSources: 7,
    affectedWaterSources: 1,
    schools: 2,
    healthcareFacilities: 1,
    agriculturalZones: 1,
    groundwaterDepth: 22,
    contaminationSources: 0,
    contaminationStatus: 'Low',
    lastUpdated: '2026-06-10',
    remediationProjects: 0,
  }
];

// 2. Hand Pumps / Water Sources
export const demoWaterSources: WaterSource[] = [
  {
    id: 'HP-001',
    villageId: 'V-001',
    type: 'hand_pump',
    status: 'do_not_use',
    coordinates: { lat: 26.466, lon: 80.343 },
    restrictions: {
      drinking: true,
      cooking: true,
      bathing: true,
      irrigation: false,
      livestock: true
    },
    populationServed: 120,
    nearestSchoolDistance: 300,
    agriculturalArea: 1.5,
    alternativeSourceId: 'HP-008',
    isDemo: true
  },
  {
    id: 'HP-002',
    villageId: 'V-001',
    type: 'hand_pump',
    status: 'restricted',
    coordinates: { lat: 26.464, lon: 80.341 },
    restrictions: {
      drinking: true,
      cooking: true,
      bathing: false,
      irrigation: false,
      livestock: false
    },
    populationServed: 85,
    nearestSchoolDistance: 500,
    agriculturalArea: 2.0,
    alternativeSourceId: 'HP-008',
    isDemo: true
  },
  {
    id: 'HP-008',
    villageId: 'V-001',
    type: 'deep_borewell',
    status: 'safe',
    coordinates: { lat: 26.468, lon: 80.340 },
    restrictions: {
      drinking: false,
      cooking: false,
      bathing: false,
      irrigation: false,
      livestock: false
    },
    populationServed: 500,
    nearestSchoolDistance: 200,
    agriculturalArea: 5.0,
    isDemo: true
  },
  {
    id: 'HP-010',
    villageId: 'V-002',
    type: 'hand_pump',
    status: 'do_not_use',
    coordinates: { lat: 26.449, lon: 80.300 },
    restrictions: {
      drinking: true,
      cooking: true,
      bathing: true,
      irrigation: true,
      livestock: true
    },
    populationServed: 60,
    nearestSchoolDistance: 800,
    agriculturalArea: 1.2,
    isDemo: true
  },
  {
    id: 'HP-015',
    villageId: 'V-003',
    type: 'hand_pump',
    status: 'unknown',
    coordinates: { lat: 26.473, lon: 80.286 },
    restrictions: {
      drinking: false,
      cooking: false,
      bathing: false,
      irrigation: false,
      livestock: false
    },
    populationServed: 150,
    nearestSchoolDistance: 400,
    agriculturalArea: 0.5,
    isDemo: true
  },
  // Adding more dummy ones for total 35
  ...Array.from({ length: 30 }).map((_, i) => ({
    id: `HP-0${16 + i}`,
    villageId: i < 15 ? 'V-001' : i < 20 ? 'V-002' : i < 25 ? 'V-003' : i < 28 ? 'V-004' : 'V-005',
    type: 'hand_pump',
    status: i % 4 === 0 ? 'safe' : i % 3 === 0 ? 'do_not_use' : 'restricted',
    coordinates: { lat: 26.4 + Math.random() * 0.1, lon: 80.2 + Math.random() * 0.2 },
    restrictions: {
      drinking: i % 4 !== 0,
      cooking: i % 4 !== 0,
      bathing: i % 3 === 0,
      irrigation: false,
      livestock: i % 3 === 0
    },
    populationServed: 50 + Math.floor(Math.random() * 100),
    nearestSchoolDistance: Math.floor(Math.random() * 1000),
    agriculturalArea: Math.random() * 5,
    isDemo: true
  }))
];

// 3. Historical Chromium Measurements (2020-2026)
export const demoMeasurements: Measurement[] = [
  {
    id: 'M-001',
    sourceId: 'HP-001',
    date: '2020-05-15',
    parameter: 'Total Chromium',
    value: 0.08,
    unit: 'mg/L',
    method: 'AAS',
    laboratoryId: 'LAB-01',
    verificationStatus: 'verified',
    isDemo: true
  },
  {
    id: 'M-002',
    sourceId: 'HP-001',
    date: '2022-08-20',
    parameter: 'Total Chromium',
    value: 0.15,
    unit: 'mg/L',
    method: 'AAS',
    laboratoryId: 'LAB-01',
    verificationStatus: 'verified',
    isDemo: true
  },
  {
    id: 'M-003',
    sourceId: 'HP-001',
    date: '2024-11-10',
    parameter: 'Total Chromium',
    value: 0.25,
    unit: 'mg/L',
    method: 'ICP-MS',
    laboratoryId: 'LAB-02',
    verificationStatus: 'verified',
    isDemo: true
  },
  {
    id: 'M-004',
    sourceId: 'HP-008',
    date: '2025-02-15',
    parameter: 'Total Chromium',
    value: 0.02,
    unit: 'mg/L',
    method: 'ICP-MS',
    laboratoryId: 'LAB-02',
    verificationStatus: 'verified',
    isDemo: true
  },
  {
    id: 'M-005',
    sourceId: 'HP-010',
    date: '2023-04-12',
    parameter: 'Chromium (VI)',
    value: 0.12,
    unit: 'mg/L',
    method: 'Colorimetric',
    laboratoryId: 'LAB-03',
    verificationStatus: 'pending',
    isDemo: true
  },
  ...Array.from({ length: 145 }).map((_, i) => {
    const year = 2020 + Math.floor(Math.random() * 7);
    const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
    const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
    return {
      id: `M-0${6 + i}`,
      sourceId: `HP-0${1 + Math.floor(Math.random() * 35)}`,
      date: `${year}-${month}-${day}`,
      parameter: Math.random() > 0.8 ? 'Chromium (VI)' : 'Total Chromium',
      value: Number((0.005 + Math.random() * 0.35).toFixed(3)),
      unit: 'mg/L',
      method: Math.random() > 0.5 ? 'AAS' : 'ICP-MS',
      laboratoryId: Math.random() > 0.5 ? 'LAB-01' : 'LAB-02',
      verificationStatus: Math.random() > 0.2 ? 'verified' : 'pending',
      isDemo: true
    };
  })
];

// 4. Groundwater Monitoring Points
export const demoGroundwaterPoints: GroundwaterPoint[] = [
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `GW-${i + 1}`,
    name: `Monitoring Well ${i + 1}`,
    coordinates: { lat: 26.4 + Math.random() * 0.1, lon: 80.2 + Math.random() * 0.2 },
    depth: 8 + Math.random() * 17,
    villageId: demoVillages[i % 5].id,
    isDemo: true
  }))
];

// 5. Soil Samples
export const demoSoilSamples: SoilSample[] = [
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `SS-${i + 1}`,
    villageId: demoVillages[i % 5].id,
    coordinates: { lat: 26.4 + Math.random() * 0.1, lon: 80.2 + Math.random() * 0.2 },
    date: `2025-${String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')}-15`,
    chromiumLevel: Number((10 + Math.random() * 500).toFixed(1)),
    ph: Number((5.5 + Math.random() * 3).toFixed(1)),
    moisture: Number((10 + Math.random() * 30).toFixed(1)),
    soilType: ['Clay', 'Sandy', 'Loam', 'Silt'][i % 4],
    isDemo: true
  }))
];

// 6. Schools
export const demoSchools: School[] = [
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `SCH-${i + 1}`,
    villageId: demoVillages[i % 5].id,
    name: `Government Primary School ${i + 1}`,
    studentCount: 150 + Math.floor(Math.random() * 300),
    nearestWaterSourceId: demoWaterSources[i % demoWaterSources.length].id,
    coordinates: { lat: 26.4 + Math.random() * 0.1, lon: 80.2 + Math.random() * 0.2 },
    isDemo: true
  }))
];

// 7. Healthcare Facilities
export const demoHealthcare: HealthcareFacility[] = [
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `HC-${i + 1}`,
    villageId: demoVillages[i % 5].id,
    name: i % 2 === 0 ? `PHC ${demoVillages[i % 5].name}` : `CHC ${demoVillages[i % 5].name}`,
    type: i % 2 === 0 ? 'PHC' : 'CHC',
    coordinates: { lat: 26.4 + Math.random() * 0.1, lon: 80.2 + Math.random() * 0.2 },
    isDemo: true
  }))
];

// 8. Agricultural Zones
export const demoAgriculturalZones: AgriculturalZone[] = [
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `AZ-${i + 1}`,
    villageId: demoVillages[i % 5].id,
    cropType: ['Wheat', 'Rice', 'Mustard', 'Sugarcane'][i % 4],
    irrigationSourceId: demoWaterSources[Math.floor(Math.random() * demoWaterSources.length)].id,
    exposureLevel: ['low', 'medium', 'high'][i % 3],
    coordinates: { lat: 26.4 + Math.random() * 0.1, lon: 80.2 + Math.random() * 0.2 },
    isDemo: true
  }))
];

// 9. Contamination Sources
export const demoContaminationSources: ContaminationSource[] = [
  {
    id: 'CS-001',
    name: 'Abandoned Tannery A',
    type: 'tannery',
    coordinates: { lat: 26.470, lon: 80.345 },
    status: 'inactive',
    estimatedImpactRadius: 2.5,
    isDemo: true
  },
  {
    id: 'CS-002',
    name: 'Industrial Waste Dump',
    type: 'waste_dump',
    coordinates: { lat: 26.475, lon: 80.280 },
    status: 'active',
    estimatedImpactRadius: 4.0,
    isDemo: true
  },
  ...Array.from({ length: 3 }).map((_, i) => ({
    id: `CS-00${i + 3}`,
    name: `Industrial Site ${i + 1}`,
    type: 'industrial',
    coordinates: { lat: 26.4 + Math.random() * 0.1, lon: 80.2 + Math.random() * 0.2 },
    status: 'active',
    estimatedImpactRadius: 1 + Math.random() * 3,
    isDemo: true
  }))
];

// 10. Remediation Projects
export const demoRemediationProjects: RemediationProject[] = [
  {
    id: 'RP-001',
    title: 'Khanchandpur Well Remediation',
    villageId: 'V-001',
    stage: 'completed',
    type: 'pump_and_treat',
    startDate: '2023-01-10',
    endDate: '2024-06-20',
    baselineMeasurementId: 'M-002',
    latestMeasurementId: 'M-004',
    isDemo: true
  },
  {
    id: 'RP-002',
    title: 'Panki Source Containment',
    villageId: 'V-003',
    stage: 'in_progress',
    type: 'containment',
    startDate: '2025-03-15',
    isDemo: true
  },
  {
    id: 'RP-003',
    title: 'Rania Phytoremediation',
    villageId: 'V-002',
    stage: 'proposed',
    type: 'phytoremediation',
    isDemo: true
  }
];

// 11. Community Reports
export const demoCommunityReports: CommunityReport[] = [
  ...Array.from({ length: 100 }).map((_, i) => ({
    id: `CR-${i + 1}`,
    villageId: demoVillages[i % 5].id,
    date: `202${4 + (i % 3)}-${String(1 + (i % 12)).padStart(2, '0')}-15`,
    category: ['health', 'water_quality', 'agriculture', 'other'][i % 4],
    status: ['new', 'investigating', 'resolved'][i % 3],
    description: 'DEMO DATA: Citizen reported issue regarding water quality.',
    isDemo: true
  }))
];

// 12. Timeline Events
export const demoTimelineEvents: TimelineEvent[] = [
  {
    id: 'TE-001',
    villageId: 'V-001',
    date: '2020-05-15',
    title: 'Initial Discovery',
    description: 'High chromium levels first measured in Khanchandpur.',
    isDemo: true
  },
  {
    id: 'TE-002',
    villageId: 'V-001',
    date: '2023-01-10',
    title: 'Remediation Action Started',
    description: 'Pump and treat system installed.',
    isDemo: true
  },
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `TE-00${i + 3}`,
    villageId: demoVillages[i % 5].id,
    date: `202${2 + (i % 5)}-01-10`,
    title: `Event ${i + 3}`,
    description: 'DEMO DATA: Milestone event recorded.',
    isDemo: true
  }))
];

// 13. Prediction Results
export const demoPredictionResults: PredictionResult[] = [
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `PR-${i + 1}`,
    targetId: demoWaterSources[i].id,
    targetType: 'water_source',
    predictedValue: Number((0.05 + Math.random() * 0.2).toFixed(3)),
    confidenceLevel: Number((0.6 + Math.random() * 0.35).toFixed(2)),
    contributingFactors: ['proximity_to_source', 'historical_trend'],
    date: '2026-09-19',
    isDemo: true
  }))
];

// 14. Risk Scores
export const demoRiskScores: RiskScore[] = [
  ...demoVillages.map((v, i) => ({
    id: `RS-${i + 1}`,
    targetId: v.id,
    targetType: 'village',
    score: i === 0 ? 95 : i === 1 ? 80 : i === 2 ? 75 : i === 3 ? 45 : 20,
    factors: [
      { name: 'Water Contamination', weight: 0.5, value: Math.random() },
      { name: 'Population Exposure', weight: 0.3, value: Math.random() },
      { name: 'Agricultural Impact', weight: 0.2, value: Math.random() }
    ],
    date: '2026-09-19',
    isDemo: true
  }))
];

// 15. Data Sources
export const demoDataSources: DataSource[] = [
  { id: 'LAB-01', name: 'Kanpur Central Laboratory', type: 'laboratory', isDemo: true },
  { id: 'LAB-02', name: 'UP Pollution Control Board', type: 'government', isDemo: true },
  { id: 'LAB-03', name: 'IIT Kanpur Environmental Lab', type: 'research', isDemo: true }
];

// --- Helper Functions ---

export const getVillageById = (id: string): Village | undefined => {
  return demoVillages.find(v => v.id === id);
};

export const getWaterSourcesByVillage = (villageId: string): WaterSource[] => {
  return demoWaterSources.filter(ws => ws.villageId === villageId);
};

export const getMeasurementsBySource = (sourceId: string): Measurement[] => {
  return demoMeasurements.filter(m => m.sourceId === sourceId);
};

export const getReportsByVillage = (villageId: string): CommunityReport[] => {
  return demoCommunityReports.filter(cr => cr.villageId === villageId);
};

export const getPredictionForSource = (sourceId: string): PredictionResult | undefined => {
  return demoPredictionResults.find(pr => pr.targetId === sourceId);
};

export const getRiskScoreForVillage = (villageId: string): RiskScore | undefined => {
  return demoRiskScores.find(rs => rs.targetId === villageId);
};
