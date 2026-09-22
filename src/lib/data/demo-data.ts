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

// 11. Community Reports (28 Realistic Operational Observations)
export const demoCommunityReports: CommunityReport[] = [
  {
    id: 'CR-2026-001',
    title: 'Yellow Tinted Water in Morning Collection',
    category: 'Yellow coloration',
    villageId: 'V-002',
    locationName: 'Rania Ward 2, Near Primary School',
    waterSourceId: 'HP-016',
    coordinates: { lat: 26.4485, lon: 80.3015 },
    date: '2026-09-18',
    status: 'Under Review',
    priority: 'Critical',
    description: 'Resident reported distinct yellow-amber coloration from hand pump HP-016 during early morning domestic water collection. Water left a faint yellowish ring on stainless steel utensils.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Ward Resident',
    verificationStatus: 'Field Officer Assigned',
    evidenceCount: 1,
    lastUpdated: '2026-09-19',
    isDemo: true
  },
  {
    id: 'CR-2026-002',
    title: 'Acrid Chemical Odor from Drainage Culvert',
    category: 'Chemical odor',
    villageId: 'V-003',
    locationName: 'Panki Site 4 Industrial Buffer',
    coordinates: { lat: 26.4718, lon: 80.2862 },
    date: '2026-09-16',
    status: 'Field Verified',
    priority: 'High',
    description: 'Pungent chemical vapor observed rising from the unlined irrigation channel following overnight tannery discharge upstream. Causing eye irritation among farm laborers.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Local Farmer',
    verificationStatus: 'Visual Discoloration & pH 8.4 Logged',
    evidenceCount: 2,
    lastUpdated: '2026-09-17',
    isDemo: true
  },
  {
    id: 'CR-2026-003',
    title: 'Metallic / Bitter Taste in Tube-well Water',
    category: 'Unusual taste',
    villageId: 'V-001',
    locationName: 'Khanchandpur South Basti',
    waterSourceId: 'HP-003',
    coordinates: { lat: 26.4632, lon: 80.3411 },
    date: '2026-09-15',
    status: 'Lab Verified',
    priority: 'Critical',
    description: 'Community borewell HP-003 producing water with strong metallic astringency. Two household cattle refused to drink from the trough.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Gram Panchayat Member',
    verificationStatus: 'Lab Spectrometry: 0.19 mg/L Cr(VI)',
    evidenceCount: 1,
    lastUpdated: '2026-09-16',
    isDemo: true
  },
  {
    id: 'CR-2026-004',
    title: 'Yellow Hexavalent Sludge Dumping on Farmland Border',
    category: 'Waste dumping',
    villageId: 'V-002',
    locationName: 'Rania North Agricultural Sector',
    coordinates: { lat: 26.4521, lon: 80.3045 },
    date: '2026-09-12',
    status: 'Confirmed',
    priority: 'Critical',
    description: 'Approximately 3 tractor trolleys of yellow-green cake sludge dumped along the unpaved boundary between two wheat plots. Wind carrying dust toward adjacent tube-well.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Local Farmer',
    verificationStatus: 'UPPCB District Team Notified',
    evidenceCount: 3,
    lastUpdated: '2026-09-13',
    isDemo: true
  },
  {
    id: 'CR-2026-005',
    title: 'Rusty Yellow Precipitate on Handpump Spout',
    category: 'Hand pump discoloration',
    villageId: 'V-004',
    locationName: 'Sachendi Main Market Chowk',
    waterSourceId: 'HP-021',
    coordinates: { lat: 26.4258, lon: 80.2541 },
    date: '2026-09-10',
    status: 'Under Review',
    priority: 'Medium',
    description: 'Crusty orange-yellow crystalline sediment forming around the brass cylinder mouth of HP-021. Flow becomes cloudy after 20 continuous strokes.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Shop Owner',
    verificationStatus: 'Scheduled for Sampling',
    evidenceCount: 1,
    lastUpdated: '2026-09-11',
    isDemo: true
  },
  {
    id: 'CR-2026-006',
    title: 'Foamy Discharge in Stormwater Drain',
    category: 'Industrial discharge observation',
    villageId: 'V-003',
    locationName: 'Panki Canal Siphon Road',
    coordinates: { lat: 26.4745, lon: 80.2831 },
    date: '2026-09-08',
    status: 'Field Verified',
    priority: 'High',
    description: 'Dense greenish-yellow foam bubbling at the discharge outflow into the irrigation feeder canal. Flow rate visibly elevated compared to dry season baselines.',
    hasPhoto: false,
    reporterType: 'Asha Health Worker',
    verificationStatus: 'Field Survey Conducted',
    evidenceCount: 0,
    lastUpdated: '2026-09-09',
    isDemo: true
  },
  {
    id: 'CR-2026-007',
    title: 'Pond Surface Sheen & Discoloration',
    category: 'Surface water discoloration',
    villageId: 'V-005',
    locationName: 'Rooma Village Community Tank',
    coordinates: { lat: 26.3982, lon: 80.4135 },
    date: '2026-09-05',
    status: 'Reported',
    priority: 'Medium',
    description: 'Irridescent greenish-yellow film covering roughly 40 percent of the village retention pond following heavy monsoon showers. Water has pungent chemical sulfur odor.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Ward Resident',
    verificationStatus: 'Pending Inspection',
    evidenceCount: 1,
    lastUpdated: '2026-09-05',
    isDemo: true
  },
  {
    id: 'CR-2026-008',
    title: 'School Drinking Water Discoloration',
    category: 'Water source concern',
    villageId: 'V-001',
    locationName: 'Khanchandpur Primary School No. 1',
    waterSourceId: 'HP-002',
    coordinates: { lat: 26.4641, lon: 80.3429 },
    date: '2026-09-03',
    status: 'Confirmed',
    priority: 'Critical',
    description: 'School handpump HP-002 dispenses light yellowish water after resting overnight. Handpump was immediately locked by headmaster to prevent children drinking.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    reporterType: 'School Headmaster',
    verificationStatus: 'Danger Lock Applied & Tanker Supply Routed',
    evidenceCount: 2,
    lastUpdated: '2026-09-04',
    isDemo: true
  },
  {
    id: 'CR-2026-009',
    title: 'Seepage into Irrigation Drain from Waste Mound',
    category: 'Drainage contamination concern',
    villageId: 'V-002',
    locationName: 'Rania Industrial Perimeter Drain',
    coordinates: { lat: 26.4468, lon: 80.2995 },
    date: '2026-08-30',
    status: 'Field Verified',
    priority: 'High',
    description: 'Percolation of yellow leach liquid observed trickling out of the legacy chrome sludge mound into the open field drain. Soil at seepage point shows heavy mineral crusting.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Local Farmer',
    verificationStatus: 'Samples Collected for ICPOES',
    evidenceCount: 2,
    lastUpdated: '2026-08-31',
    isDemo: true
  },
  {
    id: 'CR-2026-010',
    title: 'Skin Irritation Reported After Bathing from Well HP-008',
    category: 'Water source concern',
    villageId: 'V-001',
    locationName: 'Khanchandpur East Hamlet',
    waterSourceId: 'HP-008',
    coordinates: { lat: 26.4661, lon: 80.3445 },
    date: '2026-08-27',
    status: 'Lab Verified',
    priority: 'Critical',
    description: 'Four family members experienced severe skin redness and contact dermatitis after using handpump HP-008 for bathing. Sample submitted to district surveillance lab.',
    hasPhoto: false,
    reporterType: 'Asha Health Worker',
    verificationStatus: 'Lab Verified: 0.24 mg/L Cr(VI)',
    evidenceCount: 0,
    lastUpdated: '2026-08-28',
    isDemo: true
  },
  {
    id: 'CR-2026-011',
    title: 'Unusual Sweetish-Metallic Odor at Well HP-025',
    category: 'Chemical odor',
    villageId: 'V-004',
    locationName: 'Sachendi Railway Crossing Cluster',
    waterSourceId: 'HP-025',
    coordinates: { lat: 26.4239, lon: 80.2529 },
    date: '2026-08-24',
    status: 'Under Review',
    priority: 'Medium',
    description: 'Tube-well emits distinct synthetic chemical odor when primed in the evening. Water appears clear but residents avoid cooking dal or rice with it.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Ward Resident',
    verificationStatus: 'Field Inspection Queued',
    evidenceCount: 1,
    lastUpdated: '2026-08-25',
    isDemo: true
  },
  {
    id: 'CR-2026-012',
    title: 'Mustard Crop Stunting Along Tannery Runoff Trench',
    category: 'Other',
    villageId: 'V-003',
    locationName: 'Panki Agricultural Extension',
    coordinates: { lat: 26.4705, lon: 80.2885 },
    date: '2026-08-20',
    status: 'Field Verified',
    priority: 'Medium',
    description: 'Mustard seedlings exhibiting severe leaf chlorosis and stunted root elongation within 30m of the industrial effluent canal. Soil pH tested at 8.7.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Local Farmer',
    verificationStatus: 'Soil Core Samples Retrieved',
    evidenceCount: 2,
    lastUpdated: '2026-08-22',
    isDemo: true
  },
  {
    id: 'CR-2026-013',
    title: 'Yellowish Scum on Domestic Water Storage Drums',
    category: 'Yellow coloration',
    villageId: 'V-002',
    locationName: 'Rania Old Basti, Lane 4',
    waterSourceId: 'HP-014',
    coordinates: { lat: 26.4475, lon: 80.3021 },
    date: '2026-08-16',
    status: 'Lab Verified',
    priority: 'High',
    description: 'Overnight settling of water in plastic storage containers produces a faint yellow sedimentary film at the base. Source pump is HP-014.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Ward Resident',
    verificationStatus: 'Lab Analysis: 0.12 mg/L Cr(VI)',
    evidenceCount: 1,
    lastUpdated: '2026-08-18',
    isDemo: true
  },
  {
    id: 'CR-2026-014',
    title: 'Sealed Well Lock Broken by Unauthorized Users',
    category: 'Water source concern',
    villageId: 'V-001',
    locationName: 'Khanchandpur North Border',
    waterSourceId: 'HP-005',
    coordinates: { lat: 26.4678, lon: 80.3402 },
    date: '2026-08-12',
    status: 'Resolved',
    priority: 'Critical',
    description: 'Red danger seal on contaminated pump HP-005 was broken with a crowbar. Immediate resealing requested to prevent migrant workers drinking.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Gram Panchayat Member',
    verificationStatus: 'Welded Cap Applied & Warning Sign Re-erected',
    evidenceCount: 2,
    lastUpdated: '2026-08-13',
    isDemo: true
  },
  {
    id: 'CR-2026-015',
    title: 'Dark Yellow Effluent Discharged during Thunderstorm',
    category: 'Industrial discharge observation',
    villageId: 'V-003',
    locationName: 'Panki Industrial Area Phase 2',
    coordinates: { lat: 26.4751, lon: 80.2825 },
    date: '2026-08-08',
    status: 'Confirmed',
    priority: 'Critical',
    description: 'During heavy cloudburst, untreated yellow liquid was released directly from factory boundary drain into roadside stormwater swale.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Ward Resident',
    verificationStatus: 'Enforcement Action Forwarded to UPPCB',
    evidenceCount: 3,
    lastUpdated: '2026-08-10',
    isDemo: true
  },
  {
    id: 'CR-2026-016',
    title: 'Strong Sulfur and Chlorine Odor at Handpump HP-029',
    category: 'Chemical odor',
    villageId: 'V-005',
    locationName: 'Rooma Transport Nagar Approach',
    waterSourceId: 'HP-029',
    coordinates: { lat: 26.3965, lon: 80.4118 },
    date: '2026-08-04',
    status: 'Reported',
    priority: 'Medium',
    description: 'Users report sharp chlorinated vapor when pumping water at HP-029. Nearby tire recapping and chemical storage godowns suspected.',
    hasPhoto: false,
    reporterType: 'Truck Driver / Commuter',
    verificationStatus: 'Preliminary Screening Logged',
    evidenceCount: 0,
    lastUpdated: '2026-08-04',
    isDemo: true
  },
  {
    id: 'CR-2026-017',
    title: 'Discolored Irrigation Water Causing Soil Salinization',
    category: 'Drainage contamination concern',
    villageId: 'V-002',
    locationName: 'Rania South Fields',
    coordinates: { lat: 26.4442, lon: 80.3005 },
    date: '2026-07-28',
    status: 'Field Verified',
    priority: 'High',
    description: 'Water drawn from 18m shallow irrigation bore shows persistent yellow tint. Surface of irrigated soil develops white-yellow crust upon drying.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Local Farmer',
    verificationStatus: 'Soil Salinity 4.8 dS/m Confirmed',
    evidenceCount: 1,
    lastUpdated: '2026-07-30',
    isDemo: true
  },
  {
    id: 'CR-2026-018',
    title: 'Orange Sludge Found in Dug Well Excavation',
    category: 'Waste dumping',
    villageId: 'V-004',
    locationName: 'Sachendi Rural Ward 1',
    coordinates: { lat: 26.4271, lon: 80.2562 },
    date: '2026-07-22',
    status: 'Field Verified',
    priority: 'High',
    description: 'Laborers excavating foundation trench for pump house struck buried stratum of orange-brown gelatinous sludge at 3.5m depth.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Construction Contractor',
    verificationStatus: 'Work Halted & Site Barricaded',
    evidenceCount: 2,
    lastUpdated: '2026-07-24',
    isDemo: true
  },
  {
    id: 'CR-2026-019',
    title: 'Yellow Water from Newly Bored Shallow Handpump',
    category: 'Yellow coloration',
    villageId: 'V-001',
    locationName: 'Khanchandpur Western Colony',
    waterSourceId: 'HP-009',
    coordinates: { lat: 26.4635, lon: 80.3392 },
    date: '2026-07-15',
    status: 'Confirmed',
    priority: 'Critical',
    description: 'Newly installed 15m handpump yielded yellow water on initial pump-out. Driller failed to seal through the upper unconfined aquifer layer.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Ward Resident',
    verificationStatus: 'Source Decommissioned by Block Dev Officer',
    evidenceCount: 1,
    lastUpdated: '2026-07-17',
    isDemo: true
  },
  {
    id: 'CR-2026-020',
    title: 'Chemical Sheen on Village Livestock Water Trough',
    category: 'Surface water discoloration',
    villageId: 'V-003',
    locationName: 'Panki Gaushala Cluster',
    waterSourceId: 'HP-011',
    coordinates: { lat: 26.4729, lon: 80.2842 },
    date: '2026-07-09',
    status: 'Under Review',
    priority: 'Medium',
    description: 'Multi-colored oil/chemical sheen floating on cement water tank supplied by handpump HP-011. Livestock herdsman noticed reduced water intake by cows.',
    hasPhoto: false,
    reporterType: 'Asha Health Worker',
    verificationStatus: 'Inspection Scheduled',
    evidenceCount: 0,
    lastUpdated: '2026-07-10',
    isDemo: true
  },
  {
    id: 'CR-2026-021',
    title: 'Bitter Taste and Staining of Cooked Rice',
    category: 'Unusual taste',
    villageId: 'V-002',
    locationName: 'Rania Central Mohalla',
    waterSourceId: 'HP-017',
    coordinates: { lat: 26.4491, lon: 80.3018 },
    date: '2026-07-01',
    status: 'Lab Verified',
    priority: 'High',
    description: 'Cooked white rice turns greyish-yellow within 2 hours when boiled with water from HP-017. Taste is notably alkaline and bitter.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Ward Resident',
    verificationStatus: 'Lab Verified: 0.16 mg/L Cr(VI)',
    evidenceCount: 1,
    lastUpdated: '2026-07-03',
    isDemo: true
  },
  {
    id: 'CR-2026-022',
    title: 'Pipe Corrosion and Orange Scale in Deep Bore',
    category: 'Hand pump discoloration',
    villageId: 'V-005',
    locationName: 'Rooma Industrial Border Hamlet',
    waterSourceId: 'HP-031',
    coordinates: { lat: 26.3995, lon: 80.4148 },
    date: '2026-06-25',
    status: 'Resolved',
    priority: 'Medium',
    description: 'Galvanized riser pipe pulled out for repair exhibited deep pitting corrosion and dense orange-yellow mineral crusting along lower 6 meters.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Tube-well Mechanic',
    verificationStatus: 'Riser Pipe Replaced with UPVC & Strainer Cleaned',
    evidenceCount: 1,
    lastUpdated: '2026-06-27',
    isDemo: true
  },
  {
    id: 'CR-2026-023',
    title: 'Chemical Effluent Backflow into Irrigation Channel',
    category: 'Drainage contamination concern',
    villageId: 'V-003',
    locationName: 'Panki North Drain Bridge',
    coordinates: { lat: 26.4735, lon: 80.2871 },
    date: '2026-06-18',
    status: 'Confirmed',
    priority: 'Critical',
    description: 'High pressure discharge from industrial stormwater outlet caused backflow of greenish wastewater into the village irrigation culvert.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Gram Panchayat Member',
    verificationStatus: 'Backflow Flap Gate Installed by District Irrigation',
    evidenceCount: 2,
    lastUpdated: '2026-06-20',
    isDemo: true
  },
  {
    id: 'CR-2026-024',
    title: 'Yellow Groundwater Encountered during Well Drilling',
    category: 'Yellow coloration',
    villageId: 'V-004',
    locationName: 'Sachendi East Agriculture Belt',
    coordinates: { lat: 26.4265, lon: 80.2555 },
    date: '2026-06-11',
    status: 'Under Review',
    priority: 'High',
    description: 'Rotary drilling rig hit water strike at 14m depth that was bright yellow. Rig operator discontinued drilling and requested groundwater officer inspection.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Drilling Contractor',
    verificationStatus: 'Sampling Team Dispatched',
    evidenceCount: 1,
    lastUpdated: '2026-06-12',
    isDemo: true
  },
  {
    id: 'CR-2026-025',
    title: 'Odor of Organic Solvents near Abandoned Tannery Yard',
    category: 'Chemical odor',
    villageId: 'V-001',
    locationName: 'Khanchandpur Industrial Fringe',
    coordinates: { lat: 26.4682, lon: 80.3435 },
    date: '2026-06-03',
    status: 'Field Verified',
    priority: 'Medium',
    description: 'Intense chemical odor emanating from unsealed concrete basins in abandoned tannery compound. Vapor strongest after sunset when ground cools.',
    hasPhoto: false,
    reporterType: 'Ward Resident',
    verificationStatus: 'Fencing Verified; Neutralization Scheduled',
    evidenceCount: 0,
    lastUpdated: '2026-06-05',
    isDemo: true
  },
  {
    id: 'CR-2026-026',
    title: 'Discolored Effluent Ponding on Public Right of Way',
    category: 'Industrial discharge observation',
    villageId: 'V-002',
    locationName: 'Rania Bypass Link Road',
    coordinates: { lat: 26.4498, lon: 80.3032 },
    date: '2026-05-27',
    status: 'Resolved',
    priority: 'High',
    description: 'Tannery tanker spillage created an amber puddle across 50 meters of the village link road. Soil was scraped and lime buffer applied by municipality.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Gram Panchayat Member',
    verificationStatus: 'Neutralized with Lime & Re-tarred',
    evidenceCount: 2,
    lastUpdated: '2026-05-29',
    isDemo: true
  },
  {
    id: 'CR-2026-027',
    title: 'Persistent Greenish Hue in Village Community Well',
    category: 'Surface water discoloration',
    villageId: 'V-005',
    locationName: 'Rooma Main Bazaar Well',
    waterSourceId: 'HP-033',
    coordinates: { lat: 26.3978, lon: 80.4125 },
    date: '2026-05-19',
    status: 'Lab Verified',
    priority: 'High',
    description: 'Deep open well used for secondary washing displays faint greenish-yellow tint in direct sunlight. Test shows elevated chromium and sulfate.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    reporterType: 'School Headmaster',
    verificationStatus: 'Lab Verified: 0.11 mg/L Cr(VI)',
    evidenceCount: 1,
    lastUpdated: '2026-05-21',
    isDemo: true
  },
  {
    id: 'CR-2026-028',
    title: 'Yellowish Sediments in Livestock Drinking Trough',
    category: 'Yellow coloration',
    villageId: 'V-001',
    locationName: 'Khanchandpur Dairy Cooperative',
    waterSourceId: 'HP-007',
    coordinates: { lat: 26.4655, lon: 80.3418 },
    date: '2026-05-12',
    status: 'Resolved',
    priority: 'Critical',
    description: 'Cooperative cattle trough fed by HP-007 showed yellow flocculent settle out. Pump was marked Do Not Use and piped safe water line was extended.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    reporterType: 'Dairy Cooperative Secretary',
    verificationStatus: 'Alternative Supply Connected; Well Capped',
    evidenceCount: 2,
    lastUpdated: '2026-05-14',
    isDemo: true
  }
];

// 12. Timeline Events
export const demoTimelineEvents: TimelineEvent[] = [
  {
    id: 'TE-001',
    villageId: 'V-001',
    date: '2020-05-15',
    title: 'Initial Hydrogeological Anomaly Detected',
    description: 'CGWB regional water sampling detected hexavalent chromium concentrations exceeding 0.12 mg/L in shallow unconfined alluvium.',
    type: 'Detection',
    source: 'Central Ground Water Board (CGWB)',
    isDemo: true
  },
  {
    id: 'TE-002',
    villageId: 'V-001',
    date: '2021-08-20',
    title: 'Hazardous Waste Dump Site Inspection',
    description: 'Joint UPPCB-CPCB inspection identified unlined legacy chrome sludge dumps at the industrial perimeter leaching into topsoil.',
    type: 'Inspection',
    source: 'Central Pollution Control Board',
    isDemo: true
  },
  {
    id: 'TE-003',
    villageId: 'V-001',
    date: '2022-11-14',
    title: 'National Green Tribunal (NGT) Directives',
    description: 'NGT Principal Bench ordered emergency supply of piped drinking water and mandatory red-stenciling on 12 contaminated handpumps.',
    type: 'Regulatory',
    source: 'National Green Tribunal',
    isDemo: true
  },
  {
    id: 'TE-004',
    villageId: 'V-001',
    date: '2023-04-10',
    title: 'Multi-Barrier Solar RO Plant Commissioned',
    description: 'Jal Jeevan Mission commissioned 15,000 LPD solar-powered water purification plant at Khanchandpur Primary School.',
    type: 'Remediation',
    source: 'Jal Jeevan Mission (JJM)',
    isDemo: true
  },
  {
    id: 'TE-005',
    villageId: 'V-001',
    date: '2024-09-05',
    title: 'Pump & Treat Pilot System Deployed',
    description: 'In-situ chemical reduction with ferrous sulfate and zero-valent iron initiated by State Groundwater Directorate.',
    type: 'Engineering',
    source: 'State Groundwater Directorate',
    isDemo: true
  },
  {
    id: 'TE-006',
    villageId: 'V-001',
    date: '2025-11-18',
    title: 'Subsurface Plume Monitoring Array',
    description: 'Installation of 8 multi-depth piezometric monitoring wells tracking Cr(VI) advection towards agricultural plains.',
    type: 'Monitoring',
    source: 'IIT Kanpur Environmental Lab',
    isDemo: true
  },
  {
    id: 'TE-007',
    villageId: 'V-001',
    date: '2026-03-02',
    title: 'Community Ground Telemetry Active',
    description: 'Continuous digital twin integration and real-time citizen water safety alert network activated across Khanchandpur.',
    type: 'Telemetry',
    source: 'Bhujal AI Platform',
    isDemo: true
  },
  {
    id: 'TE-008',
    villageId: 'V-002',
    date: '2021-03-12',
    title: 'Legacy Tannery Sludge Heap Identified',
    description: 'Over 50,000 tonnes of untreated basic chromium sulfate waste reported at Rania-Chirhli border requiring urgent containment.',
    type: 'Detection',
    source: 'District Administration',
    isDemo: true
  },
  {
    id: 'TE-009',
    villageId: 'V-002',
    date: '2023-01-25',
    title: 'Bioremediation Pilot Initiated',
    description: 'CSIR-NBRI commenced Vetiveria zizanioides phytocapping trial on 2 hectares of contaminated topsoil to arrest leaching.',
    type: 'Remediation',
    source: 'CSIR-NBRI Lucknow',
    isDemo: true
  },
  {
    id: 'TE-010',
    villageId: 'V-002',
    date: '2024-06-30',
    title: 'Geomembrane Capping Completed',
    description: 'High-density polyethylene (HDPE) liner capping executed over core waste mound to arrest monsoonal leachate percolation.',
    type: 'Engineering',
    source: 'UP State Industrial Development',
    isDemo: true
  },
  {
    id: 'TE-011',
    villageId: 'V-002',
    date: '2025-10-14',
    title: 'Aquifer Recharge Dilution Trench',
    description: 'Artificial groundwater recharge trench operationalized upgradient to dilute hexavalent chromium plume concentrations.',
    type: 'Hydrogeology',
    source: 'State Groundwater Directorate',
    isDemo: true
  },
  {
    id: 'TE-012',
    villageId: 'V-003',
    date: '2022-04-18',
    title: 'Industrial Estate Drain Effluent Alert',
    description: 'UPPCB reported untreated electroplating wastewater bypass entering stormwater drainage near Panki Power Station.',
    type: 'Alert',
    source: 'UPPCB Kanpur Regional Office',
    isDemo: true
  },
  {
    id: 'TE-013',
    villageId: 'V-003',
    date: '2023-08-11',
    title: 'CETP Chromium Reduction Facility',
    description: 'Installation of automated chromium reduction and zero-liquid discharge (ZLD) tertiary polishing unit at Panki Industrial Area.',
    type: 'Remediation',
    source: 'Kanpur CETP Society',
    isDemo: true
  },
  {
    id: 'TE-014',
    villageId: 'V-003',
    date: '2025-02-20',
    title: 'Panki Handpump Safety Audit',
    description: 'Comprehensive survey of 18 tubewells identified 5 high-risk sources; red warning stencils and safety locks applied.',
    type: 'Safety',
    source: 'Jal Sansthan Kanpur',
    isDemo: true
  },
  {
    id: 'TE-015',
    villageId: 'V-004',
    date: '2023-03-05',
    title: 'Agricultural Soil & Crop Metal Screening',
    description: 'ICAR regional center conducted trace metal screening across 40 wheat and mustard agricultural plots in Sachendi.',
    type: 'Agriculture',
    source: 'ICAR Regional Centre',
    isDemo: true
  },
  {
    id: 'TE-016',
    villageId: 'V-004',
    date: '2024-11-19',
    title: 'Deep Confined Aquifer Tubewell Boring',
    description: 'State Water Corporation drilled 160-meter deep tubewell into clean confined aquifer below impermeable clay layer.',
    type: 'Infrastructure',
    source: 'UP Jal Nigam',
    isDemo: true
  },
  {
    id: 'TE-017',
    villageId: 'V-005',
    date: '2022-09-08',
    title: 'Rooma Industrial Corridor Screening',
    description: 'Baseline hydrogeological survey conducted along NH-19 industrial strip; 3 wells restricted due to chromium plume edge.',
    type: 'Detection',
    source: 'CGWB Northern Region',
    isDemo: true
  },
  {
    id: 'TE-018',
    villageId: 'V-005',
    date: '2025-05-16',
    title: 'Mobile Water Testing Van Deployment',
    description: 'District Health Authority deployed mobile spectrophotometry lab for weekly on-site water testing and health screening.',
    type: 'Monitoring',
    source: 'Chief Medical Officer Kanpur',
    isDemo: true
  }
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
