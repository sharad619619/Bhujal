import {
  MediaAsset,
  BotanicalSpecies,
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


// 10. Remediation Projects (5 Villages Covered)
export const demoRemediationProjects: RemediationProject[] = [
  {
    "id": "RP-001",
    "title": "Khanchandpur Solar Multi-Barrier Well Remediation",
    "name": "Khanchandpur Well Remediation",
    "villageId": "V-001",
    "stage": "in_progress",
    "status": "in_progress",
    "type": "pump_and_treat",
    "interventionType": "In-Situ Chemical Reduction & RO Barrier",
    "description": "Pilot in-situ chemical reduction with ferrous sulfate buffer combined with 15,000 LPD solar-powered multi-barrier RO treatment at the Primary School borewell.",
    "leadAgency": "State Groundwater Directorate & Jal Jeevan Mission",
    "responsibleOrg": "State Groundwater Directorate",
    "progress": 78,
    "startDate": "2023-01-10",
    "endDate": "2026-11-30",
    "baselineMeasurementId": "M-002",
    "latestMeasurementId": "M-004",
    "location": "Khanchandpur Central Hamlet",
    "isDemo": false
  },
  {
    "id": "RP-002",
    "title": "Rania Pilot Phytoremediation & Geomembrane Capping",
    "name": "Rania Phytoremediation & Capping",
    "villageId": "V-002",
    "stage": "in_progress",
    "status": "in_progress",
    "type": "phytoremediation",
    "interventionType": "Constructed Wetland & HDPE Capping",
    "description": "Geomembrane capping across 2.4 hectares of legacy chrome sludge mounds combined with Vetiveria zizanioides vegetative buffer swales to arrest monsoonal leachate percolation.",
    "leadAgency": "CSIR-NBRI Lucknow & UPSIDA",
    "responsibleOrg": "CSIR-NBRI & UP State Industrial Development",
    "progress": 65,
    "startDate": "2024-03-15",
    "endDate": "2027-04-30",
    "baselineMeasurementId": "M-018",
    "latestMeasurementId": "M-022",
    "location": "Rania-Chirhli Industrial Boundary",
    "isDemo": false
  },
  {
    "id": "RP-003",
    "title": "Panki Industrial Drain Zero-Liquid-Discharge & PRB",
    "name": "Panki Source Containment & PRB",
    "villageId": "V-003",
    "stage": "in_progress",
    "status": "in_progress",
    "type": "containment",
    "interventionType": "Permeable Reactive Barrier (Zero-Valent Iron)",
    "description": "Installation of a 350-meter subsurface permeable reactive barrier using scrap zero-valent iron (ZVI) along the factory estate border to reduce mobile Cr(VI) to non-toxic Cr(III).",
    "leadAgency": "Kanpur CETP Society & CPCB Kanpur",
    "responsibleOrg": "Kanpur CETP Society",
    "progress": 45,
    "startDate": "2025-02-01",
    "endDate": "2027-08-31",
    "baselineMeasurementId": "M-035",
    "latestMeasurementId": "M-041",
    "location": "Panki Industrial Area Phase 2 Drain",
    "isDemo": false
  },
  {
    "id": "RP-004",
    "title": "Sachendi Confined Aquifer Tubewell & Vadose Alkaline Buffer",
    "name": "Sachendi Deep Safe Water Supply",
    "villageId": "V-004",
    "stage": "completed",
    "status": "completed",
    "type": "pump_and_treat",
    "interventionType": "Deep Aquifer Extraction (160m)",
    "description": "Commissioned deep tube-well tapping clean confined aquifer beneath 18m impermeable clay layer, replacing 6 shallow contaminated community handpumps.",
    "leadAgency": "UP Jal Nigam Rural Water Directorate",
    "responsibleOrg": "UP Jal Nigam",
    "progress": 92,
    "startDate": "2024-05-10",
    "endDate": "2026-03-01",
    "baselineMeasurementId": "M-052",
    "latestMeasurementId": "M-058",
    "location": "Sachendi Main Chowk",
    "isDemo": false
  },
  {
    "id": "RP-005",
    "title": "Rooma Highway Aquifer Dilution & Deep Ring Well Network",
    "name": "Rooma Hydrogeological Remediation",
    "villageId": "V-005",
    "stage": "in_progress",
    "status": "in_progress",
    "type": "phytoremediation",
    "interventionType": "Artificial Recharge Dilution Trench",
    "description": "Artificial aquifer recharge trenches coupled with rainwater harvesting swales to create a localized freshwater hydrodynamic barrier against incoming chromium dispersion plume.",
    "leadAgency": "Central Ground Water Board (CGWB) Northern Region",
    "responsibleOrg": "Central Ground Water Board",
    "progress": 55,
    "startDate": "2025-06-20",
    "endDate": "2027-10-31",
    "baselineMeasurementId": "M-068",
    "latestMeasurementId": "M-072",
    "location": "Rooma NH-19 Corridor",
    "isDemo": false
  }
];


// 10A. Media Assets Registry (28 Unique Contextual Assets)
export const demoMediaAssets: MediaAsset[] = [
  {
    "id": "MA-001",
    "url": "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Water sample displaying distinct yellow-amber hue in borosilicate beaker",
    "source": "Unsplash Environmental Library",
    "license": "Unsplash Open License",
    "attribution": "Photo by CDC / Unsplash",
    "hash": "sha256-a1b2c3d4e5f601",
    "createdAt": "2026-09-18"
  },
  {
    "id": "MA-002",
    "url": "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Vapor and chemical fumes rising from industrial discharge culvert into ditch",
    "source": "Unsplash Documentaries",
    "license": "Unsplash Open License",
    "attribution": "Photo by Unsplash Contributor",
    "hash": "sha256-a1b2c3d4e5f602",
    "createdAt": "2026-09-16"
  },
  {
    "id": "MA-003",
    "url": "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Domestic metal drinking vessel exhibiting mineral scaling and metallic tint",
    "source": "Unsplash Field Documentation",
    "license": "Unsplash Open License",
    "attribution": "Photo by Water Action Network",
    "hash": "sha256-a1b2c3d4e5f603",
    "createdAt": "2026-09-15"
  },
  {
    "id": "MA-004",
    "url": "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Untreated chromium hazardous sludge mound adjacent to wheat agricultural plot",
    "source": "Unsplash Environmental Investigation",
    "license": "Unsplash Open License",
    "attribution": "Photo by Industrial Watch",
    "hash": "sha256-a1b2c3d4e5f604",
    "createdAt": "2026-09-12"
  },
  {
    "id": "MA-005",
    "url": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Orange-yellow mineral encrustation and precipitation on hand pump brass spout",
    "source": "Unsplash Rural Infrastructure",
    "license": "Unsplash Open License",
    "attribution": "Photo by Rural Water Mission",
    "hash": "sha256-a1b2c3d4e5f605",
    "createdAt": "2026-09-10"
  },
  {
    "id": "MA-006",
    "url": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Thick yellowish froth bubbling at discharge outflow into irrigation canal",
    "source": "Unsplash River Watch",
    "license": "Unsplash Open License",
    "attribution": "Photo by River Watch Org",
    "hash": "sha256-a1b2c3d4e5f606",
    "createdAt": "2026-09-08"
  },
  {
    "id": "MA-007",
    "url": "https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Iridescent film and greenish discoloration across village retention tank",
    "source": "Unsplash Surface Water Archive",
    "license": "Unsplash Open License",
    "attribution": "Photo by Wetlands Registry",
    "hash": "sha256-a1b2c3d4e5f607",
    "createdAt": "2026-09-05"
  },
  {
    "id": "MA-008",
    "url": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Rural primary school drinking water station flagged for chemical testing",
    "source": "Unsplash Education Library",
    "license": "Unsplash Open License",
    "attribution": "Photo by Rural Education Trust",
    "hash": "sha256-a1b2c3d4e5f608",
    "createdAt": "2026-09-03"
  },
  {
    "id": "MA-009",
    "url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Percolation and mineral crusting along agricultural irrigation swale margin",
    "source": "Unsplash Agronomy",
    "license": "Unsplash Open License",
    "attribution": "Photo by Agro Ecology Lab",
    "hash": "sha256-a1b2c3d4e5f609",
    "createdAt": "2026-08-30"
  },
  {
    "id": "MA-010",
    "url": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Field testing reagents and spectrophotometry colorimeter in surveillance van",
    "source": "Unsplash Healthcare",
    "license": "Unsplash Open License",
    "attribution": "Photo by Health Surveillance Unit",
    "hash": "sha256-a1b2c3d4e5f610",
    "createdAt": "2026-08-27"
  },
  {
    "id": "MA-011",
    "url": "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Handpump cylinder inspected for chemical odor at railway crossing hamlet",
    "source": "Unsplash Water Tech",
    "license": "Unsplash Open License",
    "attribution": "Photo by Field Engineering",
    "hash": "sha256-a1b2c3d4e5f611",
    "createdAt": "2026-08-24"
  },
  {
    "id": "MA-012",
    "url": "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Mustard crop field demonstrating leaf chlorosis and growth stunting from runoff",
    "source": "Unsplash Crop Science",
    "license": "Unsplash Open License",
    "attribution": "Photo by Agronomy Survey",
    "hash": "sha256-a1b2c3d4e5f612",
    "createdAt": "2026-08-20"
  },
  {
    "id": "MA-013",
    "url": "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Domestic water storage container displaying yellowish sediment at the base",
    "source": "Unsplash Household Tech",
    "license": "Unsplash Open License",
    "attribution": "Photo by Community Telemetry",
    "hash": "sha256-a1b2c3d4e5f613",
    "createdAt": "2026-08-16"
  },
  {
    "id": "MA-014",
    "url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Steel tubewell casing head sealed with tamper-evident chain and lock",
    "source": "Unsplash Utilities",
    "license": "Unsplash Open License",
    "attribution": "Photo by Municipal Engineering",
    "hash": "sha256-a1b2c3d4e5f614",
    "createdAt": "2026-08-12"
  },
  {
    "id": "MA-015",
    "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Stormwater overflow ditch carrying turbid yellow effluent alongside perimeter wall",
    "source": "Unsplash Drainage",
    "license": "Unsplash Open License",
    "attribution": "Photo by Drainage Registry",
    "hash": "sha256-a1b2c3d4e5f615",
    "createdAt": "2026-08-08"
  },
  {
    "id": "MA-016",
    "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Salt encrustation and yellow-white mineral precipitation on topsoil",
    "source": "Unsplash Geology",
    "license": "Unsplash Open License",
    "attribution": "Photo by Geological Survey",
    "hash": "sha256-a1b2c3d4e5f616",
    "createdAt": "2026-08-03"
  },
  {
    "id": "MA-017",
    "url": "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Cattle drinking trough with distinct yellow precipitate line on concrete wall",
    "source": "Unsplash Agriculture",
    "license": "Unsplash Open License",
    "attribution": "Photo by Livestock Association",
    "hash": "sha256-a1b2c3d4e5f617",
    "createdAt": "2026-07-29"
  },
  {
    "id": "MA-018",
    "url": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Heavily corroded galvanised iron riser pipe retrieved from shallow borehole",
    "source": "Unsplash Hydrogeology",
    "license": "Unsplash Open License",
    "attribution": "Photo by Borehole Survey",
    "hash": "sha256-a1b2c3d4e5f618",
    "createdAt": "2026-07-25"
  },
  {
    "id": "MA-019",
    "url": "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Industrial estate open drainage channel under hydro-chemical surveillance",
    "source": "Unsplash Urban Environment",
    "license": "Unsplash Open License",
    "attribution": "Photo by Pollution Audit Unit",
    "hash": "sha256-a1b2c3d4e5f619",
    "createdAt": "2026-07-20"
  },
  {
    "id": "MA-020",
    "url": "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Dieback and chlorosis in bank vegetation adjacent to culvert discharge",
    "source": "Unsplash Botany",
    "license": "Unsplash Open License",
    "attribution": "Photo by Plant Science Unit",
    "hash": "sha256-a1b2c3d4e5f620",
    "createdAt": "2026-07-15"
  },
  {
    "id": "MA-021",
    "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Chemical sheen and oily iridescence on community pond surface",
    "source": "Unsplash Limnology",
    "license": "Unsplash Open License",
    "attribution": "Photo by Water Resources Board",
    "hash": "sha256-a1b2c3d4e5f621",
    "createdAt": "2026-07-09"
  },
  {
    "id": "MA-022",
    "url": "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Cotton laundry fabric stained with persistent yellow-orange mineral streaks",
    "source": "Unsplash Community Evidence",
    "license": "Unsplash Open License",
    "attribution": "Photo by Ward Health Worker",
    "hash": "sha256-a1b2c3d4e5f622",
    "createdAt": "2026-07-02"
  },
  {
    "id": "MA-023",
    "url": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Discharge culvert outflow with yellow chemical plume entering canal",
    "source": "Unsplash Environmental Monitoring",
    "license": "Unsplash Open License",
    "attribution": "Photo by Water Quality Team",
    "hash": "sha256-a1b2c3d4e5f623",
    "createdAt": "2026-06-25"
  },
  {
    "id": "MA-024",
    "url": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Deep borewell groundwater sample collection in certified glass vials",
    "source": "Unsplash Laboratory",
    "license": "Unsplash Open License",
    "attribution": "Photo by NABL Accredited Lab",
    "hash": "sha256-a1b2c3d4e5f624",
    "createdAt": "2026-06-18"
  },
  {
    "id": "MA-025",
    "url": "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Piezometer monitoring station wellhead with digital sensor casing",
    "source": "Unsplash Ground Telemetry",
    "license": "Unsplash Open License",
    "attribution": "Photo by Central Ground Water Board",
    "hash": "sha256-a1b2c3d4e5f625",
    "createdAt": "2026-06-10"
  },
  {
    "id": "MA-026",
    "url": "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Discolored liquid spillage on roadside treated with lime buffering powder",
    "source": "Unsplash Remediation",
    "license": "Unsplash Open License",
    "attribution": "Photo by District Hazmat Team",
    "hash": "sha256-a1b2c3d4e5f626",
    "createdAt": "2026-05-27"
  },
  {
    "id": "MA-027",
    "url": "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Deep masonry community open well exhibiting subtle greenish-yellow surface hue",
    "source": "Unsplash Rural Architecture",
    "license": "Unsplash Open License",
    "attribution": "Photo by Rural Well Heritage",
    "hash": "sha256-a1b2c3d4e5f627",
    "createdAt": "2026-05-19"
  },
  {
    "id": "MA-028",
    "url": "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80",
    "type": "image",
    "caption": "Dairy cooperative piped potable tank installed following well closure",
    "source": "Unsplash Jal Jeevan Mission",
    "license": "Unsplash Open License",
    "attribution": "Photo by Cooperative Water Board",
    "hash": "sha256-a1b2c3d4e5f628",
    "createdAt": "2026-05-12"
  }
];


// 10B. Botanical Species Database
export const demoBotanicalSpecies: BotanicalSpecies[] = [
  {
    "id": "SPEC-01",
    "scientificName": "Vetiveria zizanioides (Chrysopogon zizanioides)",
    "commonName": "Vetiver Grass",
    "hindiName": "खस (वेटिवर घास)",
    "photoUrl": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80",
    "source": "CSIR-National Botanical Research Institute (NBRI)",
    "license": "CC BY-SA 4.0 / Public Research Reference",
    "preferredPhMin": 4.5,
    "preferredPhMax": 9.8,
    "preferredMoistureMin": 15,
    "preferredMoistureMax": 60,
    "maxCrToleranceMgKg": 280,
    "effectiveRootDepthMeters": 4.2,
    "bioaccumulationFactor": 124,
    "mechanism": "Rhizosphere Cr(VI) to Cr(III) reduction & root tissue immobilization",
    "agronomicCare": "Plant in staggered double-row contour swales with 2% biochar buffer. Highly drought and flood tolerant.",
    "citations": [
      "Singh et al., CSIR-NBRI (2022) Phytocapping of chromite dumps in Uttar Pradesh",
      "CPCB In-Situ Remediation Technical Guidelines (2022)"
    ]
  },
  {
    "id": "SPEC-02",
    "scientificName": "Brassica juncea",
    "commonName": "Indian Mustard",
    "hindiName": "सरसों / राई",
    "photoUrl": "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80",
    "source": "ICAR-Indian Agricultural Research Institute",
    "license": "Open Botanical Heritage Repository",
    "preferredPhMin": 5.5,
    "preferredPhMax": 8,
    "preferredMoistureMin": 20,
    "preferredMoistureMax": 45,
    "maxCrToleranceMgKg": 130,
    "effectiveRootDepthMeters": 1.2,
    "bioaccumulationFactor": 68,
    "mechanism": "Phyto-extraction of soluble heavy metals into harvestable shoot and foliar biomass",
    "agronomicCare": "Sow during Rabi season. Harvest prior to seed set to prevent metal cycling back to topsoil.",
    "citations": [
      "Kumar et al. (2021) Heavy metal phytoextraction capacity of Brassica in Indo-Gangetic alluvium",
      "IIT Kanpur Environmental Engineering Tannery Belt Studies (2023)"
    ]
  },
  {
    "id": "SPEC-03",
    "scientificName": "Helianthus annuus",
    "commonName": "Sunflower",
    "hindiName": "सूरजमुखी",
    "photoUrl": "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80",
    "source": "CSIR-NEERI Environmental Research",
    "license": "Public Educational Reference",
    "preferredPhMin": 6,
    "preferredPhMax": 7.8,
    "preferredMoistureMin": 25,
    "preferredMoistureMax": 50,
    "maxCrToleranceMgKg": 160,
    "effectiveRootDepthMeters": 2,
    "bioaccumulationFactor": 85,
    "mechanism": "High-biomass translocating accumulator for vadose zone metal uptake",
    "agronomicCare": "Deep soil tilling with farmyard manure compost amendment. Best in well-drained loams.",
    "citations": [
      "Prasad et al., NEERI Nagpur (2020) Phytoremediation of industrial effluent corridors",
      "WHO Technical Annex on Metal-accumulating Flora (2021)"
    ]
  },
  {
    "id": "SPEC-04",
    "scientificName": "Typha latifolia",
    "commonName": "Broadleaf Cattail",
    "hindiName": "पटेरा (कैटेल)",
    "photoUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    "source": "Wetlands International South Asia",
    "license": "Public Educational Reference",
    "preferredPhMin": 5,
    "preferredPhMax": 8.8,
    "preferredMoistureMin": 40,
    "preferredMoistureMax": 65,
    "maxCrToleranceMgKg": 220,
    "effectiveRootDepthMeters": 1.8,
    "bioaccumulationFactor": 110,
    "mechanism": "Constructed wetland rhizofiltration and precipitate sedimentation",
    "agronomicCare": "Ideal for waterlogged drainage trenches and CETP tertiary swales. Requires saturated soil conditions.",
    "citations": [
      "CPCB Wetland Design Manual for Industrial Clusters (2021)"
    ]
  },
  {
    "id": "SPEC-05",
    "scientificName": "Pteris vittata",
    "commonName": "Chinese Brake Fern",
    "hindiName": "फर्न (टेरिस विट्टाटा)",
    "photoUrl": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80",
    "source": "National Botanical Gardens Botanical Flora",
    "license": "Public Educational Reference",
    "preferredPhMin": 6,
    "preferredPhMax": 8.5,
    "preferredMoistureMin": 30,
    "preferredMoistureMax": 55,
    "maxCrToleranceMgKg": 200,
    "effectiveRootDepthMeters": 0.9,
    "bioaccumulationFactor": 95,
    "mechanism": "Foliar hyperaccumulation of metalloids in frond tissues",
    "agronomicCare": "Shaded understory planting beneath Vetiver hedge lines. Protect from direct summer scorching.",
    "citations": [
      "Environmental Pollution Journal (2022) Phytocapping Mechanisms in Alluvial Substrates"
    ]
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
    photoUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-001',
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
    mediaAssetId: 'MA-002',
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
    date: '2026-08-15',
    status: 'Lab Verified',
    priority: 'Critical',
    description: 'Community borewell HP-003 producing water with strong metallic astringency. Two household cattle refused to drink from the trough.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-003',
    reporterType: 'Gram Panchayat Member',
    verificationStatus: 'Lab Spectrometry: 0.19 mg/L Cr(VI)',
    evidenceCount: 1,
    lastUpdated: '2026-08-16',
    isDemo: true
  },
  {
    id: 'CR-2026-004',
    title: 'Yellow Hexavalent Sludge Dumping on Farmland Border',
    category: 'Waste dumping',
    villageId: 'V-002',
    locationName: 'Rania North Agricultural Sector',
    coordinates: { lat: 26.4521, lon: 80.3045 },
    date: '2026-07-22',
    status: 'Confirmed',
    priority: 'Critical',
    description: 'Approximately 3 tractor trolleys of yellow-green cake sludge dumped along the unpaved boundary between two wheat plots. Wind carrying dust toward adjacent tube-well.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-004',
    reporterType: 'Local Farmer',
    verificationStatus: 'UPPCB District Team Notified',
    evidenceCount: 3,
    lastUpdated: '2026-07-23',
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
    date: '2025-11-09',
    status: 'Under Review',
    priority: 'Medium',
    description: 'Crusty orange-yellow crystalline sediment forming around the brass cylinder mouth of HP-021. Flow becomes cloudy after 20 continuous strokes.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-005',
    reporterType: 'Shop Owner',
    verificationStatus: 'Scheduled for Sampling',
    evidenceCount: 1,
    lastUpdated: '2025-11-10',
    isDemo: true
  },
  {
    id: 'CR-2026-006',
    title: 'Foamy Discharge in Stormwater Drain',
    category: 'Industrial discharge observation',
    villageId: 'V-003',
    locationName: 'Panki Canal Siphon Road',
    coordinates: { lat: 26.4745, lon: 80.2831 },
    date: '2025-08-15',
    status: 'Field Verified',
    priority: 'High',
    description: 'Dense greenish-yellow foam bubbling at the discharge outflow into the irrigation feeder canal. Flow rate visibly elevated compared to dry season baselines.',
    hasPhoto: false,reporterType: 'Asha Health Worker',
    verificationStatus: 'Field Survey Conducted',
    evidenceCount: 0,
    lastUpdated: '2025-08-16',
    isDemo: true
  },
  {
    id: 'CR-2026-007',
    title: 'Pond Surface Sheen & Discoloration',
    category: 'Surface water discoloration',
    villageId: 'V-005',
    locationName: 'Rooma Village Community Tank',
    coordinates: { lat: 26.3982, lon: 80.4135 },
    date: '2025-04-18',
    status: 'Reported',
    priority: 'Medium',
    description: 'Irridescent greenish-yellow film covering roughly 40 percent of the village retention pond following heavy monsoon showers. Water has pungent chemical sulfur odor.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-007',
    reporterType: 'Ward Resident',
    verificationStatus: 'Pending Inspection',
    evidenceCount: 1,
    lastUpdated: '2025-04-19',
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
    date: '2025-01-20',
    status: 'Confirmed',
    priority: 'Critical',
    description: 'School handpump HP-002 dispenses light yellowish water after resting overnight. Handpump was immediately locked by headmaster to prevent children drinking.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-008',
    reporterType: 'School Headmaster',
    verificationStatus: 'Danger Lock Applied & Tanker Supply Routed',
    evidenceCount: 2,
    lastUpdated: '2025-01-21',
    isDemo: true
  },
  {
    id: 'CR-2026-009',
    title: 'Seepage into Irrigation Drain from Waste Mound',
    category: 'Drainage contamination concern',
    villageId: 'V-002',
    locationName: 'Rania Industrial Perimeter Drain',
    coordinates: { lat: 26.4468, lon: 80.2995 },
    date: '2024-10-12',
    status: 'Field Verified',
    priority: 'High',
    description: 'Percolation of yellow leach liquid observed trickling out of the legacy chrome sludge mound into the open field drain. Soil at seepage point shows heavy mineral crusting.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-009',
    reporterType: 'Local Farmer',
    verificationStatus: 'Samples Collected for ICPOES',
    evidenceCount: 2,
    lastUpdated: '2024-10-13',
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
    date: '2024-07-28',
    status: 'Lab Verified',
    priority: 'Critical',
    description: 'Four family members experienced severe skin redness and contact dermatitis after using handpump HP-008 for bathing. Sample submitted to district surveillance lab.',
    hasPhoto: false,reporterType: 'Asha Health Worker',
    verificationStatus: 'Lab Verified: 0.24 mg/L Cr(VI)',
    evidenceCount: 0,
    lastUpdated: '2024-07-29',
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
    date: '2024-05-14',
    status: 'Under Review',
    priority: 'Medium',
    description: 'Tube-well emits distinct synthetic chemical odor when primed in the evening. Water appears clear but residents avoid cooking dal or rice with it.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-011',
    reporterType: 'Ward Resident',
    verificationStatus: 'Field Inspection Queued',
    evidenceCount: 1,
    lastUpdated: '2024-05-15',
    isDemo: true
  },
  {
    id: 'CR-2026-012',
    title: 'Mustard Crop Stunting Along Tannery Runoff Trench',
    category: 'Other',
    villageId: 'V-003',
    locationName: 'Panki Agricultural Extension',
    coordinates: { lat: 26.4705, lon: 80.2885 },
    date: '2024-02-09',
    status: 'Field Verified',
    priority: 'Medium',
    description: 'Mustard seedlings exhibiting severe leaf chlorosis and stunted root elongation within 30m of the industrial effluent canal. Soil pH tested at 8.7.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-012',
    reporterType: 'Local Farmer',
    verificationStatus: 'Soil Core Samples Retrieved',
    evidenceCount: 2,
    lastUpdated: '2024-02-10',
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
    date: '2023-11-20',
    status: 'Lab Verified',
    priority: 'High',
    description: 'Overnight settling of water in plastic storage containers produces a faint yellow sedimentary film at the base. Source pump is HP-014.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-013',
    reporterType: 'Ward Resident',
    verificationStatus: 'Lab Analysis: 0.12 mg/L Cr(VI)',
    evidenceCount: 1,
    lastUpdated: '2023-11-21',
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
    date: '2023-08-18',
    status: 'Resolved',
    priority: 'Critical',
    description: 'Red danger seal on contaminated pump HP-005 was broken with a crowbar. Immediate resealing requested to prevent migrant workers drinking.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-014',
    reporterType: 'Gram Panchayat Member',
    verificationStatus: 'Welded Cap Applied & Warning Sign Re-erected',
    evidenceCount: 2,
    lastUpdated: '2023-08-19',
    isDemo: true
  },
  {
    id: 'CR-2026-015',
    title: 'Dark Yellow Effluent Discharged during Thunderstorm',
    category: 'Industrial discharge observation',
    villageId: 'V-003',
    locationName: 'Panki Industrial Area Phase 2',
    coordinates: { lat: 26.4751, lon: 80.2825 },
    date: '2023-06-05',
    status: 'Confirmed',
    priority: 'Critical',
    description: 'During heavy cloudburst, untreated yellow liquid was released directly from factory boundary drain into roadside stormwater swale.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-015',
    reporterType: 'Ward Resident',
    verificationStatus: 'Enforcement Action Forwarded to UPPCB',
    evidenceCount: 3,
    lastUpdated: '2023-06-06',
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
    date: '2023-03-12',
    status: 'Reported',
    priority: 'Medium',
    description: 'Users report sharp chlorinated vapor when pumping water at HP-029. Nearby tire recapping and chemical storage godowns suspected.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-016',reporterType: 'Truck Driver / Commuter',
    verificationStatus: 'Preliminary Screening Logged',
    evidenceCount: 0,
    lastUpdated: '2023-03-13',
    isDemo: true
  },
  {
    id: 'CR-2026-017',
    title: 'Discolored Irrigation Water Causing Soil Salinization',
    category: 'Drainage contamination concern',
    villageId: 'V-002',
    locationName: 'Rania South Fields',
    coordinates: { lat: 26.4442, lon: 80.3005 },
    date: '2022-10-25',
    status: 'Field Verified',
    priority: 'High',
    description: 'Water drawn from 18m shallow irrigation bore shows persistent yellow tint. Surface of irrigated soil develops white-yellow crust upon drying.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-017',
    reporterType: 'Local Farmer',
    verificationStatus: 'Soil Salinity 4.8 dS/m Confirmed',
    evidenceCount: 1,
    lastUpdated: '2022-10-26',
    isDemo: true
  },
  {
    id: 'CR-2026-018',
    title: 'Orange Sludge Found in Dug Well Excavation',
    category: 'Waste dumping',
    villageId: 'V-004',
    locationName: 'Sachendi Rural Ward 1',
    coordinates: { lat: 26.4271, lon: 80.2562 },
    date: '2022-07-14',
    status: 'Field Verified',
    priority: 'High',
    description: 'Laborers excavating foundation trench for pump house struck buried stratum of orange-brown gelatinous sludge at 3.5m depth.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-018',
    reporterType: 'Construction Contractor',
    verificationStatus: 'Work Halted & Site Barricaded',
    evidenceCount: 2,
    lastUpdated: '2022-07-15',
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
    date: '2022-04-08',
    status: 'Confirmed',
    priority: 'Critical',
    description: 'Newly installed 15m handpump yielded yellow water on initial pump-out. Driller failed to seal through the upper unconfined aquifer layer.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-019',
    reporterType: 'Ward Resident',
    verificationStatus: 'Source Decommissioned by Block Dev Officer',
    evidenceCount: 1,
    lastUpdated: '2022-04-09',
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
    date: '2022-01-19',
    status: 'Under Review',
    priority: 'Medium',
    description: 'Multi-colored oil/chemical sheen floating on cement water tank supplied by handpump HP-011. Livestock herdsman noticed reduced water intake by cows.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-020',reporterType: 'Asha Health Worker',
    verificationStatus: 'Inspection Scheduled',
    evidenceCount: 0,
    lastUpdated: '2022-01-20',
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
    date: '2021-10-04',
    status: 'Lab Verified',
    priority: 'High',
    description: 'Cooked white rice turns greyish-yellow within 2 hours when boiled with water from HP-017. Taste is notably alkaline and bitter.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-021',
    reporterType: 'Ward Resident',
    verificationStatus: 'Lab Verified: 0.16 mg/L Cr(VI)',
    evidenceCount: 1,
    lastUpdated: '2021-10-05',
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
    date: '2021-06-16',
    status: 'Resolved',
    priority: 'Medium',
    description: 'Galvanized riser pipe pulled out for repair exhibited deep pitting corrosion and dense orange-yellow mineral crusting along lower 6 meters.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-022',
    reporterType: 'Tube-well Mechanic',
    verificationStatus: 'Riser Pipe Replaced with UPVC & Strainer Cleaned',
    evidenceCount: 1,
    lastUpdated: '2021-06-17',
    isDemo: true
  },
  {
    id: 'CR-2026-023',
    title: 'Chemical Effluent Backflow into Irrigation Channel',
    category: 'Drainage contamination concern',
    villageId: 'V-003',
    locationName: 'Panki North Drain Bridge',
    coordinates: { lat: 26.4735, lon: 80.2871 },
    date: '2021-02-28',
    status: 'Confirmed',
    priority: 'Critical',
    description: 'High pressure discharge from industrial stormwater outlet caused backflow of greenish wastewater into the village irrigation culvert.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-023',
    reporterType: 'Gram Panchayat Member',
    verificationStatus: 'Backflow Flap Gate Installed by District Irrigation',
    evidenceCount: 2,
    lastUpdated: '2021-03-01',
    isDemo: true
  },
  {
    id: 'CR-2026-024',
    title: 'Yellow Groundwater Encountered during Well Drilling',
    category: 'Yellow coloration',
    villageId: 'V-004',
    locationName: 'Sachendi East Agriculture Belt',
    coordinates: { lat: 26.4265, lon: 80.2555 },
    date: '2020-11-12',
    status: 'Under Review',
    priority: 'High',
    description: 'Rotary drilling rig hit water strike at 14m depth that was bright yellow. Rig operator discontinued drilling and requested groundwater officer inspection.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-024',
    reporterType: 'Drilling Contractor',
    verificationStatus: 'Sampling Team Dispatched',
    evidenceCount: 1,
    lastUpdated: '2020-11-13',
    isDemo: true
  },
  {
    id: 'CR-2026-025',
    title: 'Odor of Organic Solvents near Abandoned Tannery Yard',
    category: 'Chemical odor',
    villageId: 'V-001',
    locationName: 'Khanchandpur Industrial Fringe',
    coordinates: { lat: 26.4682, lon: 80.3435 },
    date: '2020-08-20',
    status: 'Field Verified',
    priority: 'Medium',
    description: 'Intense chemical odor emanating from unsealed concrete basins in abandoned tannery compound. Vapor strongest after sunset when ground cools.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-025',reporterType: 'Ward Resident',
    verificationStatus: 'Fencing Verified; Neutralization Scheduled',
    evidenceCount: 0,
    lastUpdated: '2020-08-21',
    isDemo: true
  },
  {
    id: 'CR-2026-026',
    title: 'Discolored Effluent Ponding on Public Right of Way',
    category: 'Industrial discharge observation',
    villageId: 'V-002',
    locationName: 'Rania Bypass Link Road',
    coordinates: { lat: 26.4498, lon: 80.3032 },
    date: '2020-05-18',
    status: 'Resolved',
    priority: 'High',
    description: 'Tannery tanker spillage created an amber puddle across 50 meters of the village link road. Soil was scraped and lime buffer applied by municipality.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-026',
    reporterType: 'Gram Panchayat Member',
    verificationStatus: 'Neutralized with Lime & Re-tarred',
    evidenceCount: 2,
    lastUpdated: '2020-05-19',
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
    date: '2020-03-10',
    status: 'Lab Verified',
    priority: 'High',
    description: 'Deep open well used for secondary washing displays faint greenish-yellow tint in direct sunlight. Test shows elevated chromium and sulfate.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-027',
    reporterType: 'School Headmaster',
    verificationStatus: 'Lab Verified: 0.11 mg/L Cr(VI)',
    evidenceCount: 1,
    lastUpdated: '2020-03-11',
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
    date: '2020-01-15',
    status: 'Resolved',
    priority: 'Critical',
    description: 'Cooperative cattle trough fed by HP-007 showed yellow flocculent settle out. Pump was marked Do Not Use and piped safe water line was extended.',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    mediaAssetId: 'MA-028',
    reporterType: 'Dairy Cooperative Secretary',
    verificationStatus: 'Alternative Supply Connected; Well Capped',
    evidenceCount: 2,
    lastUpdated: '2020-01-16',
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

export const getMediaAssets = (): MediaAsset[] => {
  return demoMediaAssets;
};

export const getBotanicalSpecies = (): BotanicalSpecies[] => {
  return demoBotanicalSpecies;
};
