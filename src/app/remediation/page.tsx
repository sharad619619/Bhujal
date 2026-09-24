'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getDb, RemediationProjectRecord } from '@/lib/db/store';
import { BotanicalSpecies, EngineeredIntervention } from '@/lib/types';
import { 
  Shield, 
  Droplets, 
  Box, 
  Waves, 
  Layers, 
  Leaf, 
  Activity, 
  ArrowRight, 
  Sliders, 
  CheckCircle2, 
  Sparkles, 
  FlaskConical, 
  Clock, 
  ChevronRight,
  TrendingDown,
  Info,
  AlertTriangle,
  AlertCircle,
  X,
  ExternalLink,
  Calendar,
  Search,
  Filter,
  BookOpen,
  Microscope,
  RefreshCw,
  Award,
  ArrowUpRight,
  HelpCircle,
  Check,
  Eye,
  ChevronDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import Link from 'next/link';

// -------------------------------------------------------------
// 1. DATASETS & INTERVENTIONS SPECIFICATION
// -------------------------------------------------------------

export const engineeredInterventionsData: EngineeredIntervention[] = [
  {
    id: 'int-1',
    title: 'Safe Deep Aquifer Supply',
    shortDesc: 'Telescoping steel-cased tubewells tapping deep confined aquifer layers (>90–120m) shielded from surficial chromium plumes by regional impermeable clay aquitards.',
    category: 'Water Supply',
    status: 'Standard Practice',
    readinessLevel: 'TRL 9 (Commercial Standard)',
    primaryMechanism: 'Hydrostratigraphic isolation via pressure-grouted bentonite-cement annular seals through confining clay strata.',
    howItWorks: 'Hexavalent chromium contamination in the Kanpur basin is predominantly confined to the shallow unconfined alluvial aquifer (0–28m). Deep drilling penetrates through 15–25m thick impervious regional clay aquitard lenses into the lower confined Pleistocene sand aquifer. The annular space is pressure-grouted with bentonite-cement slurry to permanently prevent downward cross-contamination.',
    whereUsed: 'Khanchandpur Community Water Supply Borewell (HP-028), Rania Jal Jeevan Mission Solar Piped Supply.',
    siteConditionsRequired: {
      phRange: 'Any pH (geologically isolated)',
      soilPermeability: 'Requires presence of confining clay aquitard lens (>10m thick)',
      waterTableDepth: 'Drilling target: 85m–140m below ground level',
      crConcentrationRange: 'Operates independently of surficial Cr(VI) concentration',
      surfaceAreaRequired: '15m x 15m wellhead sanitary perimeter'
    },
    advantages: [
      'Immediate delivery of zero-chromium potable water (<0.005 mg/L)',
      'High sustainable yield (400–800 LPM) for community distribution',
      'Immune to seasonal surface recharge contaminant spikes'
    ],
    limitations: [
      'High initial capital drilling cost',
      'Risk of annular leakage if grout seal is compromised',
      'Requires continuous telemetry to detect accidental aquifer cross-flow'
    ],
    maintenance: [
      'Quarterly wellhead sanitary seal inspection',
      'Annual downhole video caliper inspection',
      'Step-drawdown pumping test every 2 years'
    ],
    monitoringRequirements: [
      'Continuous downhole conductivity & pressure sonde',
      'Monthly ISO/IEC 17025 lab testing for Total Cr and Cr(VI)'
    ],
    potentialRisks: [
      'Over-pumping leading to aquitard breach or drawdown cone reversal',
      'Geogenic arsenic or fluoride presence in deeper strata'
    ],
    evidenceLevel: 'High',
    researchReferences: [
      'CGWB (Central Ground Water Board) Deep Aquifer Exploration in Indo-Gangetic Plains (2021)',
      'IIT Kanpur Hydrogeological Aquitard Integrity Study (2023)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Deep hydrogeological tube well drilling and casing installation rig',
    imageCaption: 'Deep rotary drilling rig installing telescoping casing through confining clay aquitard',
    imageAttribution: 'Industrial Geoscience Photo Archive',
    iconName: 'Droplets',
    accentColor: '#006492',
    bgLight: 'bg-sky-50'
  },
  {
    id: 'int-2',
    title: 'Permeable Reactive Barriers (PRB)',
    shortDesc: 'Subsurface continuous trench filled with granular Zero-Valent Iron (ZVI) and biochar that chemically reduces mobile Cr(VI) to immobile Cr(III) hydroxide precipitates.',
    category: 'Engineering',
    status: 'Field Validated',
    readinessLevel: 'TRL 8 (Proven in Field Pilots)',
    primaryMechanism: 'Abiotic redox reaction: 2 CrO₄²⁻ + 3 Fe⁰ + 10 H₂O → 2 Cr(OH)₃(s) + 3 Fe(OH)₂(s) + 4 OH⁻.',
    howItWorks: 'An engineered vertical trench is excavated perpendicular to the natural groundwater hydraulic gradient down to the impermeable silt/clay base. The trench is backfilled with a high-permeability mix of reactive granular scrap iron (ZVI, Fe⁰), coarse washed silica sand, and 5% activated biochar. As the chromium plume naturally migrates through the barrier under ambient hydraulic head, mobile soluble Cr(VI) is chemically reduced to insoluble Cr(III), which precipitates permanently within the barrier matrix as iron-chromium hydroxide mineral complexes.',
    whereUsed: 'Khanchandpur Down-Gradient Pilot Wall (Site HP-012), Panki Industrial Drain Barrier Corridor.',
    siteConditionsRequired: {
      phRange: 'Optimal 5.5–8.0 (excessive alkalinity >9 causes passivation)',
      soilPermeability: 'Moderate to high (10⁻³ to 10⁻⁴ cm/s); barrier permeability must exceed surrounding soil by 2-5x',
      waterTableDepth: 'Shallow to moderate (3m–16m maximum trenching depth)',
      crConcentrationRange: 'Effective from 0.05 mg/L to 45 mg/L in groundwater',
      surfaceAreaRequired: 'Linear trench corridor (width 1.2m, length 80–250m)'
    },
    advantages: [
      'Zero operational energy consumption (passive gravity-driven filtration)',
      'Reduces Cr(VI) by >90% to below detectable limits',
      'Long operational lifespan (15–25 years before media exhaustion)'
    ],
    limitations: [
      'Iron mineral precipitation (calcite/siderite) can cause media clogging over decades',
      'Not effective if groundwater flow direction shifts seasonally by >45 degrees',
      'High civil trenching cost at depths exceeding 12 meters'
    ],
    maintenance: [
      'Annual hydraulic head differential testing across barrier piezometers',
      'Periodic sonic vibration or acid flushing to re-activate passivated iron surfaces'
    ],
    monitoringRequirements: [
      'Multi-level piezometers installed upstream, within, and downstream of barrier',
      'Monthly Eh (redox), dissolved oxygen, Fe(II)/Fe(III), and Cr(VI) sampling'
    ],
    potentialRisks: [
      'Plume bypass around barrier edges if trench length is undersized',
      'Sulfate reduction producing localized hydrogen sulfide'
    ],
    evidenceLevel: 'High',
    researchReferences: [
      'US EPA Remediation Technology Cost and Performance: Zero-Valent Iron PRBs (2020)',
      'IIT Kanpur Environmental Engineering: Cr(VI) Reduction by Granular ZVI in Gangetic Sands (2022)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Subsurface permeable reactive barrier trench excavation with granular reactive iron media',
    imageCaption: 'Trench excavation and reactive iron/sand media installation for passive groundwater plume interception',
    imageAttribution: 'Groundwater Remediation Engineering Archive',
    iconName: 'Box',
    accentColor: '#b45309',
    bgLight: 'bg-amber-50'
  },
  {
    id: 'int-3',
    title: 'Phytoremediation Buffer Belts',
    shortDesc: 'High-density multi-row contour planting of deep-rooted Vetiver grass and metal-tolerant hyperaccumulators along effluent canals to immobilize and extract chromium.',
    category: 'Nature-Based',
    status: 'Field Validated',
    readinessLevel: 'TRL 8 (Widely Implemented)',
    primaryMechanism: 'Rhizosphere biochemical reduction, root endodermal sequestration, and transpirational hydraulic containment.',
    howItWorks: 'Interlocking vegetative strips of Chrysopogon zizanioides (Vetiver grass) are planted in staggered double rows along contour lines flanking contaminated water channels, tannery discharge swales, and sludge dump perimeters. Vetiver roots penetrate 3.5 to 4.5 meters vertically into the vadose zone, forming a dense biological subterranean curtain. Massive transpiration (up to 70 liters/plant/day in summer) creates a localized cone of hydraulic depression that prevents contaminated runoff from migrating laterally into adjacent agricultural fields.',
    whereUsed: 'Rania Northern Agricultural Perimeter, Khanchandpur Tannery Drain Corridor (Plots A1-A4).',
    siteConditionsRequired: {
      phRange: 'Broad tolerance: 4.5 to 9.8',
      soilPermeability: 'Sandy loam to alluvial clay; requires loose subsoiling before planting',
      waterTableDepth: 'Optimal: 2m to 5m (can access up to 4.5m directly)',
      crConcentrationRange: 'Soil Cr up to 280 mg/kg; effluent Cr up to 35 mg/L',
      surfaceAreaRequired: 'Corridor width 10–25m along drainage rights-of-way'
    },
    advantages: [
      'Extremely low capital cost compared to civil engineering barriers',
      'Permanent slope stabilization and prevention of monsoonal soil erosion',
      'Additional carbon sequestration and biomass production'
    ],
    limitations: [
      'Requires 60–90 days of managed establishment before full root curtain forms',
      'Limited effectiveness on deep groundwater (>6m depth) without interception swales',
      'Accumulated biomass must be managed to prevent wildlife grazing'
    ],
    maintenance: [
      'Semi-annual coppicing of mature foliage (cut at 30cm height)',
      'Annual replacement of damaged slips and compost replenishment',
      'Fencing maintenance to exclude cattle'
    ],
    monitoringRequirements: [
      'Quarterly root core tissue analysis (ICP-MS for Cr speciation)',
      'Perimeter soil moisture and electrical conductivity profiling',
      'Down-gradient shallow piezometer monitoring'
    ],
    potentialRisks: [
      'Frost or catastrophic drought damage during juvenile establishment',
      'Combustion of dry winter biomass if accidental brushfire occurs'
    ],
    evidenceLevel: 'Field Confirmed',
    researchReferences: [
      'CSIR-NBRI Lucknow Field Guide: Vetiver System in Chrome Sludge Management (2022)',
      'Truong & Danh (2015) The Vetiver System for Environmental Protection and Mine Rehabilitation'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Chrysopogon_zizanioides.jpg',
    imageAlt: 'Dense vegetative buffer belts of Vetiver grass planted for environmental remediation',
    imageCaption: 'Deep-rooted Vetiver grass buffer belts establishing bio-curtain along drainage margin',
    imageAttribution: 'Forest & Kim Starr / Wikimedia Commons (CC BY-SA 4.0)',
    iconName: 'Leaf',
    accentColor: '#15803d',
    bgLight: 'bg-emerald-50'
  },
  {
    id: 'int-4',
    title: 'In-Situ Bio-Augmentation',
    shortDesc: 'Subsurface injection of native metal-reducing bacterial consortia (Shewanella, Pseudomonas putida) and lactate/molasses electron donors to stimulate microbiological Cr(VI) reduction.',
    category: 'Engineering',
    status: 'Pilot Stage',
    readinessLevel: 'TRL 7 (Field Demonstration)',
    primaryMechanism: 'Microbial dissimilatory reduction: Chromate (CrO₄²⁻) serves as terminal electron acceptor, converting to insoluble chromium hydroxide (Cr(OH)₃).',
    howItWorks: 'A network of pressurized injection lances or dedicated recharge wells introduces an aqueous solution containing concentrated indigenous chromium-resistant bacterial cultures combined with slow-release organic electron donors (sodium lactate, cheese whey, or agricultural molasses). The injected substrate rapidly induces strongly reducing anaerobic conditions (Eh < -150 mV) in the target groundwater zone. Dissimilatory metal-reducing bacteria utilize the organic carbon to donate electrons, reducing toxic mobile Cr(VI) into non-toxic, highly insoluble Cr(III) precipitates.',
    whereUsed: 'Panki Industrial Area CETP Pilot Well Array (Well Array B-04 to B-08).',
    siteConditionsRequired: {
      phRange: 'Optimal 6.5–8.2 (extreme pH <5 or >9 inhibits microbial enzymes)',
      soilPermeability: 'Moderate to high (10⁻² to 10⁻⁴ cm/s) to enable uniform donor distribution',
      waterTableDepth: '4m to 25m below surface',
      crConcentrationRange: 'Groundwater Cr(VI) 0.5 mg/L to 80 mg/L',
      surfaceAreaRequired: 'Well injection grid with 6–10m spacing across plume footprint'
    },
    advantages: [
      'Direct treatment of deep groundwater plumes without excavation',
      'Fast kinetic reaction (substantial reduction observable within 30–60 days)',
      'Stimulates native microbial ecology without introducing hazardous synthetic chemicals'
    ],
    limitations: [
      'Requires repeated donor re-injections every 6–12 months as substrate depletes',
      'Bio-fouling and bioclogging around injection well screens',
      'Risk of temporary secondary mobilization of iron, manganese, or arsenic under deep reducing conditions'
    ],
    maintenance: [
      'Bi-monthly wellhead redevelopment to clear microbial bio-clogging',
      'Automated dosing pump calibration and substrate batching'
    ],
    monitoringRequirements: [
      'Bi-weekly oxidation-reduction potential (Eh), dissolved organic carbon (DOC), and Cr(VI)',
      'Quarterly 16S rRNA gene sequencing to track microbial community dynamics'
    ],
    potentialRisks: [
      'Transient groundwater odor or taste alteration from fermentation byproducts',
      'Over-reduction causing arsenic release from geogenic iron oxyhydroxides'
    ],
    evidenceLevel: 'Moderate',
    researchReferences: [
      'IIT Kanpur Dept of Civil Engineering: Microbial Remediation of Tannery Wastewater & Aquifers (2023)',
      'Lovely et al. (2004) Dissimilatory Metal Reduction by Microorganisms'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Microbiological laboratory testing and subsurface bacterial culture injection solution',
    imageCaption: 'Microbiological culture preparation and bioreactor optimization for in-situ electron donor injection',
    imageAttribution: 'Applied Biotechnology Research Archive',
    iconName: 'Waves',
    accentColor: '#4f46e5',
    bgLight: 'bg-indigo-50'
  },
  {
    id: 'int-5',
    title: 'Vadose Zone Soil Capping',
    shortDesc: 'Multi-layer composite impermeable geosynthetic cap (HDPE membrane, bentonite clay liner, drainage geonet, topsoil) sealing legacy open-air tannery chrome sludge dumps.',
    category: 'Engineering',
    status: 'Field Validated',
    readinessLevel: 'TRL 9 (Proven Standard Practice)',
    primaryMechanism: 'Physical and hydraulic isolation: Eliminates meteoric rainwater infiltration, preventing leaching of Cr(VI) from unsaturated sludge into underlying aquifers.',
    howItWorks: 'Legacy piles of tannery sludge containing up to 15,000 mg/kg of chromium are regraded and compacted with a minimum 2% crown slope. A composite engineering cap is placed consisting of: (1) 300mm sub-base compacted sand, (2) 600mm low-permeability compacted clay liner (k < 10⁻⁷ cm/s), (3) 1.5mm high-density polyethylene (HDPE) geomembrane, (4) bi-planar drainage geocomposite layer to rapidly shed monsoon rainfall, and (5) 450mm vegetative topsoil planted with shallow-rooted grasses. By eliminating vertical water percolation, the source of groundwater plume replenishment is halted.',
    whereUsed: 'Rania Chromite Waste Dump (Sector 4), Rooma Tannery Sludge Containment Facility.',
    siteConditionsRequired: {
      phRange: 'Any (isolates all chemical matrices)',
      soilPermeability: 'Applicable to any substrate; requires geotechnical stability for slope grading',
      waterTableDepth: 'Minimum 1.5m clearance between base of waste and seasonal high water table',
      crConcentrationRange: 'Capable of containing extremely high waste concentrations (>50,000 mg/kg)',
      surfaceAreaRequired: 'Full footprint of waste dump (typically 1.5 to 8 hectares)'
    },
    advantages: [
      'Permanently stops the primary source of groundwater re-contamination',
      'Rapid installation prevents immediate monsoonal flush events',
      'Converts hazardous open-air dumps into green vegetative open spaces'
    ],
    limitations: [
      'Does not destroy or remediate the waste beneath; requires perpetual containment',
      'Deep-rooted trees or burrowing animals can damage the geomembrane liner',
      'High capital civil construction expenditure ($45–80 per square meter)'
    ],
    maintenance: [
      'Semi-annual visual inspection for slope subsidence, erosion gullies, or tension cracks',
      'Maintenance of perimeter drainage swales and stormwater retention basins',
      'Vegetation mowing to prevent woody root intrusion'
    ],
    monitoringRequirements: [
      'Down-gradient lysimeters installed immediately below cap to detect leakage',
      'Quarterly monitoring of surrounding perimeter piezometer network'
    ],
    potentialRisks: [
      'Puncture of geomembrane during severe seismic shift or heavy machinery traversal',
      'Differential settlement causing pooling of rainwater on top of cap'
    ],
    evidenceLevel: 'High',
    researchReferences: [
      'CPCB Technical Criteria for Capping Hazardous Waste Dumps (2021)',
      'Benson & Daniel (2000) Geosynthetic Capping of Industrial Waste Repositories'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Geomembrane_installation.jpg',
    imageAlt: 'Installation of heavy-duty impermeable HDPE geomembrane liner over industrial hazardous waste',
    imageCaption: 'Field deployment and thermal welding of HDPE geomembrane barrier layer for hazardous waste isolation',
    imageAttribution: 'Wikimedia Commons / Public Engineering Documentation',
    iconName: 'Layers',
    accentColor: '#c2410c',
    bgLight: 'bg-orange-50'
  },
  {
    id: 'int-6',
    title: 'Sentinel Telemetry Monitoring',
    shortDesc: 'Multi-parameter submersible sensor network measuring oxidation-reduction potential (ORP), electrical conductivity, water level, and optical Cr(VI) telemetry at 15-minute intervals.',
    category: 'Monitoring',
    status: 'Continuous Telemetry',
    readinessLevel: 'TRL 9 (Commercial Sensor Fleet)',
    primaryMechanism: 'In-situ optical absorbance and potentiometric electrode telemetry with solar-powered cellular/LoRaWAN telemetry gateway.',
    howItWorks: 'Dedicated sentinel monitoring piezometers are drilled at strategic hydrogeological nodes: up-gradient of suspected sources, at plume centers, along plume margins, and down-gradient of active remediation installations. Each well is equipped with an integrated multi-parameter downhole sonde featuring an optical UV-Vis spectrophotometric flow-through cell calibrated for Cr(VI) (540nm peak with diphenylcarbazide reagent microfluidics or direct UV deconvolution), platinum ORP electrode, 4-electrode conductivity cell, and hydrostatic pressure transducer. Data is transmitted continuously via 4G/NB-IoT to Bhujal AI cloud servers.',
    whereUsed: 'Khanchandpur Regional Telemetry Grid (Wells GW-01 through GW-12), Panki Boundary Sentinels.',
    siteConditionsRequired: {
      phRange: 'pH 2 to 12 compatible',
      soilPermeability: 'Independent of soil; requires properly screened PVC piezometer well (50mm–100mm dia)',
      waterTableDepth: 'Transducers rated up to 100m water column submergence',
      crConcentrationRange: 'Optical detection limit: 0.005 mg/L to 50 mg/L',
      surfaceAreaRequired: 'Compact 1m x 1m concrete plinth with solar mast'
    },
    advantages: [
      'Real-time 15-minute resolution detects seasonal contamination surges immediately',
      'Early warning capability before toxic plumes reach community drinking borewells',
      'Autonomous solar-powered operation requires zero external power infrastructure'
    ],
    limitations: [
      'Submersible optical windows require automated wiper cleaning to prevent biofouling',
      'Sondes require field re-calibration every 90–120 days',
      'Substantial upfront sensor instrumentation cost'
    ],
    maintenance: [
      'Quarterly calibration against certified ISO 17025 standard solutions',
      'Annual battery and wiper blade replacement',
      'Desiccant tube replacement in wellhead telemetry enclosure'
    ],
    monitoringRequirements: [
      'Daily automated data ingestion and outlier validation algorithms in cloud database',
      'Automated SMS/Email alerts when 0.05 mg/L threshold is exceeded'
    ],
    potentialRisks: [
      'Sensor drift if bio-film accumulates without timely servicing',
      'Vandalism or theft of solar panels and cellular antennas in remote rural locations'
    ],
    evidenceLevel: 'Field Confirmed',
    researchReferences: [
      'ISO 15839: Water quality — On-line sensors/measuring devices',
      'CPCB Real-Time Water Quality Monitoring Network Guidelines (2022)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Solar powered hydrological water quality telemetry monitoring station and data logger',
    imageCaption: 'Solar-powered IoT sentinel wellhead station with submersible multiparameter sonde telemetry',
    imageAttribution: 'Environmental Telemetry Systems Archive',
    iconName: 'Activity',
    accentColor: '#7c3aed',
    bgLight: 'bg-purple-50'
  }
];

// Synthetic Monitoring Timeline Milestones
export interface MonitoringMilestone {
  day: number;
  label: string;
  cr: number;
  whoLimit: number;
  reductionPercent: number;
  orpMv: number;
  ph: number;
  doMgL: number;
  conductivityUsCm: number;
  complianceStatus: 'Critical Exceedance' | 'Intervention Commissioned' | 'Active Attenuation' | 'Near Compliance' | 'Fully Compliant' | 'Stable Long-Term';
  testingLab: string;
  analyticalMethod: string;
  fieldNotes: string;
}

export const monitoringTimelineMilestones: MonitoringMilestone[] = [
  {
    day: -30,
    label: 'Baseline Prior',
    cr: 0.18,
    whoLimit: 0.05,
    reductionPercent: 0,
    orpMv: 280,
    ph: 7.8,
    doMgL: 4.8,
    conductivityUsCm: 1420,
    complianceStatus: 'Critical Exceedance',
    testingLab: 'IIT Kanpur Environmental Engineering Analytical Lab',
    analyticalMethod: 'USEPA Method 7196A (Colorimetric Spectrophotometry at 540nm)',
    fieldNotes: 'Baseline pre-intervention monitoring well sampling. Severe yellow chromate discoloration observed; groundwater unpotable and fails drinking standards by 3.6x.'
  },
  {
    day: 0,
    label: 'Day 0 (Commissioning)',
    cr: 0.18,
    whoLimit: 0.05,
    reductionPercent: 0,
    orpMv: 275,
    ph: 7.8,
    doMgL: 4.6,
    conductivityUsCm: 1410,
    complianceStatus: 'Intervention Commissioned',
    testingLab: 'CSIR-National Botanical Research Institute / CPCB Joint Team',
    analyticalMethod: 'Inductively Coupled Plasma Mass Spectrometry (ICP-MS, ISO 17294-2)',
    fieldNotes: 'Trenching and placement of granular Zero-Valent Iron (Fe⁰) permeable reactive barrier completed. Down-gradient sentinel piezometers activated.'
  },
  {
    day: 30,
    label: 'Day 30 (Initial Breakthrough)',
    cr: 0.12,
    whoLimit: 0.05,
    reductionPercent: 33,
    orpMv: 140,
    ph: 7.6,
    doMgL: 3.1,
    conductivityUsCm: 1350,
    complianceStatus: 'Active Attenuation',
    testingLab: 'Uttar Pradesh Pollution Control Board (UPPCB) Regional Lab',
    analyticalMethod: 'USEPA Method 7196A Spectrophotometric Validation',
    fieldNotes: 'Rapid onset of abiotic reduction. Redox potential dropping sharply as iron oxidation consumes dissolved oxygen and donates electrons to chromate oxyanions.'
  },
  {
    day: 90,
    label: 'Day 90 (Sustained Reduction)',
    cr: 0.08,
    whoLimit: 0.05,
    reductionPercent: 55,
    orpMv: 20,
    ph: 7.4,
    doMgL: 2.2,
    conductivityUsCm: 1290,
    complianceStatus: 'Near Compliance',
    testingLab: 'IIT Kanpur Environmental Engineering Analytical Lab',
    analyticalMethod: 'ICP-MS and Colorimetric Speciation Confirmation',
    fieldNotes: 'Insoluble Cr(III) hydroxide complexes actively precipitating on granular iron media. Plume front attenuation advancing according to hydrodynamic advection models.'
  },
  {
    day: 180,
    label: 'Day 180 (Full Compliance)',
    cr: 0.038,
    whoLimit: 0.05,
    reductionPercent: 79,
    orpMv: -45,
    ph: 7.3,
    doMgL: 1.8,
    conductivityUsCm: 1240,
    complianceStatus: 'Fully Compliant',
    testingLab: 'IIT Kanpur Environmental Engineering Analytical Lab',
    analyticalMethod: 'USEPA 7196A & ICP-MS Double-Blind Inter-Laboratory Analysis',
    fieldNotes: 'Chromium concentration drops below the stringent WHO and BIS 10500 drinking water threshold (0.05 mg/L). Water is visually clear; acute cytotoxicity risk eliminated.'
  },
  {
    day: 365,
    label: 'Day 365 (Long-Term Stability)',
    cr: 0.024,
    whoLimit: 0.05,
    reductionPercent: 86,
    orpMv: -60,
    ph: 7.2,
    doMgL: 1.9,
    conductivityUsCm: 1210,
    complianceStatus: 'Stable Long-Term',
    testingLab: 'Central Pollution Control Board (CPCB) Verification Team',
    analyticalMethod: 'ICP-MS Low-Level Detection (<0.002 mg/L LOQ)',
    fieldNotes: 'One-year post-remediation audit confirms persistent attenuation. Passivation indices remain low and no chromium remobilization or breakthrough detected.'
  }
];

// -------------------------------------------------------------
// 2. HELPER COMPONENTS: BEFORE/AFTER SLIDER
// -------------------------------------------------------------

const BeforeAfterSlider = () => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setPosition(newPosition);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto h-72 sm:h-84 bg-stone-100 rounded-3xl overflow-hidden cursor-ew-resize select-none border border-stone-200 shadow-md"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={(e) => handleMove(e.clientX)}
    >
      {/* Background (Untreated / Baseline) */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-red-950/20 to-red-900/30 p-6 sm:p-8 flex flex-col justify-center items-end text-right">
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-red-200 max-w-xs">
          <div className="flex items-center justify-end gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
              Baseline (Untreated)
            </span>
          </div>
          <h4 className="font-serif font-bold text-[#002116] text-lg sm:text-xl">Untreated Groundwater</h4>
          <div className="mt-2 space-y-1 text-xs font-mono text-stone-600">
            <p>Hexavalent Cr: <strong className="text-red-600 text-sm font-bold">0.180 mg/L</strong></p>
            <p className="text-[11px] text-red-700 font-semibold">(3.6x Above WHO 0.05 mg/L Limit)</p>
            <p className="text-stone-500 pt-1 border-t border-stone-200 text-[11px]">Water Appearance: Yellowish tint, metallic odor</p>
          </div>
        </div>
      </div>

      {/* Foreground (Treated / Post-Remediation) */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-emerald-800/15 to-teal-900/20 p-6 sm:p-8 flex flex-col justify-center items-start"
        style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
      >
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-emerald-200 max-w-xs">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              Post-Remediation (+180 Days)
            </span>
          </div>
          <h4 className="font-serif font-bold text-[#002116] text-lg sm:text-xl">Permeable Reactive Barrier</h4>
          <div className="mt-2 space-y-1 text-xs font-mono text-stone-600">
            <p>Hexavalent Cr: <strong className="text-emerald-700 text-sm font-bold">0.038 mg/L</strong></p>
            <p className="text-[11px] text-emerald-700 font-semibold">(Safe &amp; Below WHO Threshold)</p>
            <p className="text-stone-500 pt-1 border-t border-stone-200 text-[11px]">Total Attenuation: <strong className="text-emerald-700">-79%</strong></p>
          </div>
        </div>
      </div>

      {/* Slider Divider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_12px_rgba(0,0,0,0.35)] z-10"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-stone-300">
          <div className="flex gap-1 items-center">
            <div className="w-0.5 h-3.5 bg-stone-500 rounded-full"></div>
            <div className="w-0.5 h-3.5 bg-stone-500 rounded-full"></div>
          </div>
        </div>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur text-white text-[10px] font-mono px-2 py-0.5 rounded-full pointer-events-none whitespace-nowrap">
          Drag to Compare
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. MAIN COMPONENT: REMEDIATION INTELLIGENCE WORKSPACE
// -------------------------------------------------------------

export default function RemediationPage() {
  const [projects, setProjects] = useState<RemediationProjectRecord[]>([]);

  // Real Stateful Inputs for Hydroecological Prescription Engine
  const [ph, setPh] = useState<number>(7.2);
  const [moisture, setMoisture] = useState<number>(35);
  const [crConcentration, setCrConcentration] = useState<number>(85);
  const [depth, setDepth] = useState<number>(14);

  // Staged / Active Parameters that power the generated prescription
  const [activeParams, setActiveParams] = useState({
    ph: 7.2,
    moisture: 35,
    crConcentration: 85,
    depth: 14
  });

  // Calculating state for tactile user feedback
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(true);

  // Selection states for Modals / Drawers
  const [selectedSpecies, setSelectedSpecies] = useState<any | null>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<EngineeredIntervention | null>(null);
  const [selectedMilestoneDay, setSelectedMilestoneDay] = useState<number>(180);
  const [activePathwayFilter, setActivePathwayFilter] = useState<string>('All');
  const [showWhoLimitLine, setShowWhoLimitLine] = useState<boolean>(true);

  // Species lightbox active photo index
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // Load projects from database
  useEffect(() => {
    const db = getDb();
    setProjects(db.getRemediationProjects());
  }, []);

  // Compute recommendation based on active parameters
  const recommendation = useMemo(() => {
    const db = getDb();
    return db.calculateNatureRemediation(
      activeParams.ph,
      activeParams.moisture,
      activeParams.crConcentration,
      activeParams.depth
    );
  }, [activeParams]);

  // Check if current slider values differ from active prescription parameters
  const isDirty = (
    ph !== activeParams.ph ||
    moisture !== activeParams.moisture ||
    crConcentration !== activeParams.crConcentration ||
    depth !== activeParams.depth
  );

  // Handle explicit Generate Recommendations action
  const handleGenerate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setActiveParams({
        ph,
        moisture,
        crConcentration,
        depth
      });
      setIsCalculating(false);
      setHasGenerated(true);
    }, 280);
  };

  // Reset to Kanpur basin default conditions
  const handleResetDefaults = () => {
    setPh(7.2);
    setMoisture(35);
    setCrConcentration(85);
    setDepth(14);
    setActiveParams({
      ph: 7.2,
      moisture: 35,
      crConcentration: 85,
      depth: 14
    });
  };

  // Find active milestone details
  const activeMilestone = useMemo(() => {
    return monitoringTimelineMilestones.find(m => m.day === selectedMilestoneDay) || monitoringTimelineMilestones[4];
  }, [selectedMilestoneDay]);

  // Filtered interventions
  const filteredInterventions = useMemo(() => {
    if (activePathwayFilter === 'All') return engineeredInterventionsData;
    return engineeredInterventionsData.filter(inv => inv.category === activePathwayFilter);
  }, [activePathwayFilter]);

  // Chart data formatted
  const chartData = useMemo(() => {
    return monitoringTimelineMilestones.map(m => ({
      day: m.day,
      label: m.label,
      cr: m.cr,
      whoLimit: m.whoLimit,
      reductionPercent: m.reductionPercent
    }));
  }, []);

  // Keyboard shortcut listener to close modals with Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSpecies(null);
        setSelectedIntervention(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4fbf7] text-[#0c1f18] font-sans selection:bg-[#c3ebd8] selection:text-[#002116]">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
          <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-[#002116] font-bold">Environmental Remediation Intelligence</span>
        </div>

        {/* Header Banner */}
        <div className="border-b border-stone-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-mono uppercase bg-[#ddf3e7] text-[#002116] font-bold border border-emerald-300">
                Intervention Architecture &amp; Prescription Engine
              </span>
              <span className="text-xs font-mono text-stone-500 hidden sm:inline">
                Kanpur Alluvial Basin Hydrogeology
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#002116] tracking-tight">
              Remediation Projects &amp; Nature-Based Planning
            </h1>
            <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
              Scientific environmental workspace integrating empirical hydrochemical parameters, hyperaccumulating botanical species modeling, permeable reactive barriers, and long-term aquifer attenuation telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3 text-xs font-mono">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
              <div>
                <span className="text-stone-400 block text-[10px]">ACTIVE PROJECTS</span>
                <strong className="text-[#002116] text-sm">{projects.length} Field Sites</strong>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3 text-xs font-mono">
              <Award className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="text-stone-400 block text-[10px]">WHO DRINKING LIMIT</span>
                <strong className="text-emerald-800 text-sm">0.05 mg/L</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* SECTION 1: INTERACTIVE HYDROECOLOGICAL PRESCRIPTION ENGINE */}
        {/* ============================================================= */}
        <section className="bg-gradient-to-br from-[#002116] via-[#12372A] to-[#003b29] rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 text-white space-y-8 relative overflow-hidden">
          {/* Subtle background ambient blur */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          {/* Section Header & Feasibility Highlights */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider">
                  Interactive Hydroecological Prescription Engine
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                Site-Tailored Phytoremediation Calculator
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Tune site hydrogeological parameters below and run the deterministic recommendation model. Evaluates physiological pH window, moisture requirements, chromium toxicity ceiling, and root zone penetration reach.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-xs font-mono flex items-center gap-4">
                <div>
                  <span className="text-stone-300 block text-[10px]">FEASIBILITY INDEX</span>
                  <strong className="text-emerald-300 text-lg font-bold">{recommendation.feasibilityScore}/100</strong>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div>
                  <span className="text-stone-300 block text-[10px]">EST. ATTENUATION</span>
                  <strong className="text-white text-lg font-bold">{recommendation.halfLifeMonths} Mo.</strong>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div>
                  <span className="text-stone-300 block text-[10px]">CONFIDENCE</span>
                  <strong className="text-emerald-200 text-sm font-bold uppercase">{recommendation.confidence}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Parameter Sliders Grid */}
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4" /> Site Hydrochemical Inputs (Adjustable)
              </span>
              <button
                onClick={handleResetDefaults}
                className="text-[11px] font-mono text-stone-300 hover:text-white underline underline-offset-4 flex items-center gap-1 transition-colors"
                title="Reset sliders to standard Kanpur alluvial basin parameters"
              >
                <RefreshCw className="w-3 h-3" /> Reset to Basin Defaults
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-black/25 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-xs font-mono">
              {/* 1. Soil pH */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-stone-300 font-medium">Soil pH</span>
                  <strong className="text-emerald-300 text-base font-bold bg-white/10 px-2 py-0.5 rounded">
                    {ph.toFixed(1)}
                  </strong>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="9.8"
                  step="0.1"
                  value={ph}
                  onChange={(e) => setPh(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#2E8B68]"
                />
                <div className="flex justify-between items-center text-[10px] text-stone-400">
                  <span>Acidic (4.0)</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    ph > 7.8 ? 'bg-amber-400/20 text-amber-200' : ph < 6.2 ? 'bg-rose-400/20 text-rose-200' : 'bg-emerald-400/20 text-emerald-200'
                  }`}>
                    {ph > 7.8 ? 'Alkaline Sludge' : ph < 6.2 ? 'Acidic Vadose' : 'Near Neutral'}
                  </span>
                  <span>Alkaline (9.8)</span>
                </div>
              </div>

              {/* 2. Soil Moisture */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-stone-300 font-medium">Moisture Content</span>
                  <strong className="text-emerald-300 text-base font-bold bg-white/10 px-2 py-0.5 rounded">
                    {moisture}%
                  </strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="1"
                  value={moisture}
                  onChange={(e) => setMoisture(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#2E8B68]"
                />
                <div className="flex justify-between items-center text-[10px] text-stone-400">
                  <span>Dry (10%)</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    moisture >= 40 ? 'bg-sky-400/20 text-sky-200' : moisture <= 20 ? 'bg-amber-400/20 text-amber-200' : 'bg-emerald-400/20 text-emerald-200'
                  }`}>
                    {moisture >= 40 ? 'Hydric / Saturated' : moisture <= 20 ? 'Semi-Arid Vadose' : 'Moist Loam'}
                  </span>
                  <span>Saturated (80%)</span>
                </div>
              </div>

              {/* 3. Cr(VI) Concentration */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-stone-300 font-medium">Cr(VI) Concentration</span>
                  <strong className="text-amber-300 text-base font-bold bg-white/10 px-2 py-0.5 rounded">
                    {crConcentration} mg/kg
                  </strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={crConcentration}
                  onChange={(e) => setCrConcentration(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between items-center text-[10px] text-stone-400">
                  <span>Low (10)</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    crConcentration > 150 ? 'bg-red-500/30 text-red-200' : crConcentration > 75 ? 'bg-amber-400/20 text-amber-200' : 'bg-emerald-400/20 text-emerald-200'
                  }`}>
                    {crConcentration > 150 ? 'Critical Hotspot' : crConcentration > 75 ? 'Severe Plume' : 'Moderate'}
                  </span>
                  <span>Extreme (300)</span>
                </div>
              </div>

              {/* 4. Water Table Depth */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-stone-300 font-medium">Water Table Depth</span>
                  <strong className="text-sky-300 text-base font-bold bg-white/10 px-2 py-0.5 rounded">
                    {depth} meters
                  </strong>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={depth}
                  onChange={(e) => setDepth(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
                <div className="flex justify-between items-center text-[10px] text-stone-400">
                  <span>Shallow (2m)</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    depth <= 5 ? 'bg-emerald-400/20 text-emerald-200' : depth <= 12 ? 'bg-sky-400/20 text-sky-200' : 'bg-purple-400/20 text-purple-200'
                  }`}>
                    {depth <= 5 ? 'Direct Root Contact' : depth <= 12 ? 'Capillary Fringe' : 'Deep Aquifer'}
                  </span>
                  <span>Deep (30m)</span>
                </div>
              </div>
            </div>

            {/* Explicit Action Button: Generate Remediation Recommendations */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs font-mono">
                {isDirty ? (
                  <span className="text-amber-300 flex items-center gap-1.5 animate-pulse font-semibold">
                    <AlertTriangle className="w-4 h-4" /> Parameters adjusted. Click button to compute tailored prescription.
                  </span>
                ) : (
                  <span className="text-emerald-300 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Active prescription is synchronized with current hydrochemical values.
                  </span>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={isCalculating}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all ${
                  isDirty 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-[#002116] hover:brightness-110 ring-4 ring-emerald-400/30 scale-102' 
                    : 'bg-emerald-600/80 text-white hover:bg-emerald-600'
                }`}
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Calculating Hydrogeological Model...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    [ GENERATE REMEDIATION RECOMMENDATIONS ]
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Site Condition Summary & Interpretation Panel */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15 space-y-4 text-xs font-mono relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-300" />
                <strong className="text-emerald-200 uppercase tracking-wide">
                  Hydrogeological Diagnosis for Evaluated Site ({activeParams.ph} pH · {activeParams.moisture}% Moisture · {activeParams.crConcentration} mg/kg Cr · {activeParams.depth}m Depth)
                </strong>
              </div>
              <span className="text-[11px] text-stone-300">
                Primary Strategy: <strong className="text-white">{recommendation.primaryStrategy}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-stone-200">
              <div className="bg-black/20 p-3.5 rounded-xl space-y-1">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">1. Chemical Speciation</span>
                <p className="text-[11px] leading-relaxed">
                  {activeParams.ph > 8.0 
                    ? 'Elevated alkalinity favors chromate (CrO₄²⁻) solubility and high vadose mobility. Strong chemical reduction required.' 
                    : activeParams.ph < 6.0 
                      ? 'Acidic conditions increase dichromate (Cr₂O₇²⁻) oxidizing potential, accelerating plant bioaccumulation.' 
                      : 'Near-neutral pH alluvium supports steady enzymatic rhizosphere reduction of Cr(VI) to trivalent Cr(III).'}
                </p>
              </div>

              <div className="bg-black/20 p-3.5 rounded-xl space-y-1">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">2. Vadose Hydraulics</span>
                <p className="text-[11px] leading-relaxed">
                  {activeParams.moisture > 45 
                    ? 'Hydric soil saturation creates low redox conditions favorable for constructed wetland macrophyte filtration.' 
                    : activeParams.moisture < 25 
                      ? 'Semi-arid vadose zone requires drought-resilient perennial graminoids with high transpiration pull.' 
                      : 'Balanced soil moisture enables optimal root aeration and steady vegetative biomass growth.'}
                </p>
              </div>

              <div className="bg-black/20 p-3.5 rounded-xl space-y-1">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">3. Groundwater Interface</span>
                <p className="text-[11px] leading-relaxed">
                  {activeParams.depth <= 4.5 
                    ? 'Shallow water table allows direct root contact by deep-rooted Vetiver grass (4.2m root architecture).' 
                    : 'Deep water table (>5m) exceeds direct root contact; surface buffer prevents downward leaching while deep plume requires PRB interception.'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-[11px] text-emerald-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Prescribed Soil Amendment: </strong>
                {recommendation.recommendedSoilAmendment}
              </div>
            </div>
          </div>

          {/* Recommended Hyperaccumulator Species Cards */}
          <div className="space-y-4 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif font-bold text-xl text-white">
                  Ranked Botanical Remediation Candidates
                </h3>
                <p className="text-stone-300 text-xs mt-0.5">
                  Evaluated across physiological compatibility, bioaccumulation factor (BCF), and rooting depth. Click any card to inspect the full botanical dossier.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-300 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                {recommendation.candidates.length} Species Evaluated
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendation.candidates.map((candidate: any, idx: number) => {
                const isTopMatch = idx === 0;
                return (
                  <div 
                    key={candidate.id || idx} 
                    onClick={() => {
                      setSelectedSpecies(candidate);
                      setActivePhotoIdx(0);
                    }}
                    className={`bg-white/10 backdrop-blur-md rounded-2xl p-5 border transition-all duration-300 cursor-pointer group flex flex-col justify-between hover:bg-white/15 hover:shadow-xl ${
                      isTopMatch 
                        ? 'border-emerald-400/60 ring-2 ring-emerald-400/20' 
                        : 'border-white/15 hover:border-emerald-300/40'
                    }`}
                  >
                    <div className="space-y-3.5">
                      {/* Botanical Specimen Photograph */}
                      <div className="w-full h-44 rounded-xl overflow-hidden relative border border-white/20 bg-black/40">
                        <img 
                          src={candidate.photoUrl} 
                          alt={candidate.scientificName}
                          onError={(e) => {
                            // Fallback to verified secondary photo or placeholder
                            e.currentTarget.src = candidate.galleryUrls?.[1] || 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Chrysopogon_zizanioides.jpg';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-3">
                          <div className="flex justify-between items-start">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-black/70 text-emerald-300 border border-emerald-400/30 backdrop-blur">
                              {candidate.candidateType || 'Phytoextractor'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-[#002116]">
                              {candidate.suitabilityScore}% Match
                            </span>
                          </div>

                          <div className="text-[11px] font-mono text-stone-200">
                            <span className="text-emerald-300 font-bold block">{candidate.commonName}</span>
                            <span className="italic text-stone-300 text-[10px]">{candidate.scientificName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Header & Badges */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-serif font-bold text-lg text-emerald-100 group-hover:text-emerald-300 transition-colors">
                              {candidate.commonName}
                            </h4>
                            {candidate.hindiName && (
                              <span className="text-xs font-mono text-stone-300 font-normal">
                                ({candidate.hindiName.split(' ')[0]})
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-mono italic text-stone-300">{candidate.scientificName}</p>
                        </div>
                        {isTopMatch && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 shrink-0">
                            Primary Pick
                          </span>
                        )}
                      </div>

                      {/* Mechanism Overview */}
                      <p className="text-xs text-stone-200 leading-relaxed line-clamp-2">
                        {candidate.mechanism}
                      </p>

                      {/* Metric Badges */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
                        <div className="bg-black/20 p-2 rounded-lg">
                          <span className="text-stone-400 block text-[9px]">BIOACCUMULATION FACTOR</span>
                          <strong className="text-white text-xs">{candidate.bcf}x Substrate</strong>
                        </div>
                        <div className="bg-black/20 p-2 rounded-lg">
                          <span className="text-stone-400 block text-[9px]">EFFECTIVE ROOT DEPTH</span>
                          <strong className="text-white text-xs">{candidate.rootDepth}</strong>
                        </div>
                      </div>

                      {/* Match Breakdown Bars */}
                      <div className="space-y-1.5 pt-1 text-[11px] font-mono text-stone-300">
                        <div className="flex justify-between text-[10px]">
                          <span>pH Window ({candidate.preferredPhMin}–{candidate.preferredPhMax})</span>
                          <span className="text-emerald-300 font-bold">{candidate.phScore || 90}%</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${candidate.phScore || 90}%` }}></div>
                        </div>

                        <div className="flex justify-between text-[10px] pt-1">
                          <span>Cr Tolerance (≤{candidate.maxCrToleranceMgKg} mg/kg)</span>
                          <span className="text-amber-300 font-bold">{candidate.crScore || 85}%</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-full" style={{ width: `${candidate.crScore || 85}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Trigger */}
                    <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-emerald-300 group-hover:text-emerald-200">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Inspect Botanical Dossier
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scientific Citations & Regulatory Disclaimer */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-3 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-stone-300">
                <span className="font-bold text-emerald-300 uppercase flex items-center gap-1.5">
                  <Microscope className="w-4 h-4" /> Botanical Research Citations &amp; Institutional Validation:
                </span>
                <span className="text-[11px] text-stone-400">
                  CSIR-NBRI Lucknow · IIT Kanpur Env. Engineering · ICAR-IARI
                </span>
              </div>
              <ul className="text-xs text-stone-300 space-y-1 font-mono list-disc list-inside">
                {recommendation.scientificCitations.map((cite: string, cIdx: number) => (
                  <li key={cIdx}>{cite}</li>
                ))}
              </ul>
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 text-[11px] text-stone-300 font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block mb-0.5">Field Pilot Validation Protocol:</strong>
                  {recommendation.disclaimer}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 2: SUBSURFACE CONCENTRATION OUTCOMES & TIMELINE */}
        {/* ============================================================= */}
        <section className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-8 lg:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-amber-50 text-amber-900 font-bold border border-amber-300">
                  Synthetic Demonstration Data
                </span>
                <span className="text-xs font-mono text-stone-500">
                  Pilot Well HP-012 Attenuation Series
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#002116]">
                Subsurface Concentration Outcomes &amp; Attenuation Timeline
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Empirical hydrochemical tracking of hexavalent chromium attenuation following Zero-Valent Iron permeable barrier insertion at Pilot Site HP-012.
              </p>
            </div>

            {/* Clear Demonstration Data Notice Banner */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[11px] font-mono text-stone-600 max-w-md">
              <strong className="text-stone-800 block mb-0.5 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-600" /> Demonstration Simulation Notice
              </strong>
              This multi-stage time-series is synthetic demonstration data modeled from published ZVI kinetic reduction curves for Ganges alluvial sands.
            </div>
          </div>

          {/* Visual Flow: Baseline -> Intervention -> Monitoring -> Observed Change */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs font-mono">
            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-stone-400 block text-[10px] font-bold uppercase">Phase 1: Baseline</span>
              <strong className="text-red-700 block text-sm">0.180 mg/L</strong>
              <p className="text-[11px] text-stone-500">Unmitigated plume, 3.6x WHO limit.</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-stone-400 block text-[10px] font-bold uppercase">Phase 2: Intervention</span>
              <strong className="text-amber-800 block text-sm">ZVI PRB Deployed</strong>
              <p className="text-[11px] text-stone-500">Trenching to 12m with Fe⁰ media.</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-stone-400 block text-[10px] font-bold uppercase">Phase 3: Monitoring</span>
              <strong className="text-sky-800 block text-sm">6 Sampling Events</strong>
              <p className="text-[11px] text-stone-500">Multi-depth piezometer telemetry.</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-stone-400 block text-[10px] font-bold uppercase">Phase 4: Observed Change</span>
              <strong className="text-emerald-700 block text-sm">0.038 mg/L (-79%)</strong>
              <p className="text-[11px] text-stone-500">Compliance achieved &amp; sustained.</p>
            </div>
          </div>

          {/* Interactive Before/After Split Comparison Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-500 font-semibold uppercase">Interactive Split Visualizer:</span>
              <span className="text-stone-400">Drag center handle left/right</span>
            </div>
            <BeforeAfterSlider />
          </div>

          {/* Attenuation Curve & Clickable Timeline */}
          <div className="pt-4 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#002116]">
                  Decadal Attenuation Curve: Hexavalent Chromium (mg/L)
                </h3>
                <p className="text-xs font-mono text-stone-500">
                  Select any milestone below to inspect exact laboratory speciation and electrochemical readings.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowWhoLimitLine(!showWhoLimitLine)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 ${
                    showWhoLimitLine 
                      ? 'bg-red-50 text-red-700 border-red-200 font-bold' 
                      : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                >
                  <span className="w-2.5 h-0.5 bg-red-500"></span>
                  WHO Drinking Limit (0.05 mg/L): {showWhoLimitLine ? 'Visible' : 'Hidden'}
                </button>
              </div>
            </div>

            {/* Recharts Attenuation Graph */}
            <div className="h-72 w-full bg-stone-50/50 p-4 rounded-2xl border border-stone-100">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 15, right: 25, bottom: 15, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="day" 
                    label={{ value: 'Days Post Intervention', position: 'insideBottomRight', offset: -10, fill: '#64748b', fontSize: 11 }} 
                    tickFormatter={(val) => `Day ${val}`}
                    className="text-[11px] font-mono" 
                  />
                  <YAxis 
                    label={{ value: 'Cr (mg/L)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} 
                    domain={[0, 0.22]}
                    className="text-[11px] font-mono" 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #cbd5e1', 
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', 
                      fontFamily: 'monospace', 
                      fontSize: '12px',
                      backgroundColor: '#ffffff'
                    }}
                    formatter={(value: any, name: any) => [
                      `${value} mg/L`, 
                      name === 'cr' ? 'Observed Hexavalent Chromium' : 'WHO Potable Standard'
                    ]}
                    labelFormatter={(label) => `Monitoring Event: Day ${label}`}
                  />
                  {showWhoLimitLine && (
                    <ReferenceLine 
                      y={0.05} 
                      stroke="#ef4444" 
                      strokeDasharray="4 4" 
                      strokeWidth={1.5}
                      label={{ value: 'WHO Threshold (0.05 mg/L)', fill: '#dc2626', fontSize: 10, position: 'top' }} 
                    />
                  )}
                  <Line 
                    type="monotone" 
                    dataKey="cr" 
                    stroke="#15803d" 
                    strokeWidth={3} 
                    dot={{ r: 6, fill: '#15803d', stroke: '#ffffff', strokeWidth: 2 }} 
                    activeDot={{ r: 8, fill: '#002116' }} 
                    name="cr" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Clickable Monitoring Timeline Milestones */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-stone-500 uppercase font-semibold block">
                Interactive Monitoring Milestones (Click to Inspect Lab Records):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {monitoringTimelineMilestones.map((m) => {
                  const isSelected = m.day === selectedMilestoneDay;
                  return (
                    <button
                      key={m.day}
                      onClick={() => setSelectedMilestoneDay(m.day)}
                      className={`p-3.5 rounded-xl border text-left font-mono transition-all ${
                        isSelected 
                          ? 'bg-[#002116] text-white border-[#002116] shadow-md scale-102 ring-2 ring-emerald-400/40' 
                          : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] mb-1">
                        <span className={isSelected ? 'text-emerald-300' : 'text-stone-400'}>
                          {m.day < 0 ? 'Pre-Test' : `Day ${m.day}`}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          m.cr <= 0.05 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {m.cr <= 0.05 ? 'SAFE' : 'HIGH'}
                        </span>
                      </div>
                      <strong className="block text-sm">{m.cr} mg/L</strong>
                      <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        {m.reductionPercent > 0 ? `-${m.reductionPercent}% Attenuation` : 'Baseline Value'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Milestone Detailed Analytical Card */}
            <div className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    activeMilestone.cr <= 0.05 ? 'bg-emerald-600' : 'bg-red-600'
                  }`}></span>
                  <h4 className="font-serif font-bold text-base text-[#002116]">
                    Laboratory Record: {activeMilestone.label}
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    activeMilestone.cr <= 0.05 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {activeMilestone.complianceStatus}
                  </span>
                </div>

                <span className="text-xs font-mono text-stone-500">
                  Testing Facility: <strong className="text-stone-800">{activeMilestone.testingLab}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">TOTAL CR(VI) CONCENTRATION</span>
                  <strong className={`text-base ${activeMilestone.cr <= 0.05 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {activeMilestone.cr} mg/L
                  </strong>
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    {activeMilestone.cr <= 0.05 ? 'Compliant with WHO limit' : `${(activeMilestone.cr / 0.05).toFixed(1)}x WHO limit`}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">REDOX POTENTIAL (ORP)</span>
                  <strong className="text-base text-stone-800">{activeMilestone.orpMv} mV</strong>
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    {activeMilestone.orpMv < 0 ? 'Reducing conditions' : 'Oxidizing conditions'}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">HYDROGEN ION (pH)</span>
                  <strong className="text-base text-stone-800">{activeMilestone.ph}</strong>
                  <span className="text-[10px] text-stone-500 block mt-0.5">Near-neutral alluvial</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">ANALYTICAL PROTOCOL</span>
                  <strong className="text-xs text-stone-800 truncate block">EPA 7196A Spectrophotometry</strong>
                  <span className="text-[10px] text-stone-500 block mt-0.5">Colorimetric at 540nm</span>
                </div>
              </div>

              <p className="text-xs font-mono text-stone-600 bg-white p-3 rounded-xl border border-stone-200 leading-relaxed">
                <strong className="text-stone-800">Field Observer Notes: </strong>
                {activeMilestone.fieldNotes}
              </p>
            </div>

            {/* "What Does This Mean?" Plain-Language Explainer Panel */}
            <div className="bg-emerald-50/70 rounded-2xl p-5 sm:p-6 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-800" />
                <h4 className="font-serif font-bold text-base text-[#002116]">
                  What Does This Attenuation Data Mean for the Community?
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-stone-700">
                <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-100 space-y-1">
                  <strong className="text-emerald-950 block text-[11px] uppercase">1. Chemical Toxicity Shift</strong>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Toxic hexavalent chromium (Cr VI) is soluble, carcinogenic, and easily absorbed by the human digestive tract. Permeable reactive barriers convert it into insoluble trivalent chromium (Cr III), which precipitates safely out of solution.
                  </p>
                </div>

                <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-100 space-y-1">
                  <strong className="text-emerald-950 block text-[11px] uppercase">2. Drinking &amp; Health Clearance</strong>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    The reduction from 0.180 mg/L down to 0.038 mg/L brings water safely below the WHO and Bureau of Indian Standards (BIS 10500) permissible limit of 0.05 mg/L, eliminating acute gastric and dermatological risks.
                  </p>
                </div>

                <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-100 space-y-1">
                  <strong className="text-emerald-950 block text-[11px] uppercase">3. Agricultural Protection</strong>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Groundwater below 0.05 mg/L prevents phytotoxic bioaccumulation in wheat, mustard, and fodder crops, ensuring the rural dairy and food supply chain is preserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 3: ENGINEERED INTERVENTION PORTFOLIO (ALL 6 CLICKABLE) */}
        {/* ============================================================= */}
        <section className="space-y-6">
          <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#006492] font-bold uppercase tracking-wider">
                Intervention Portfolio &amp; Technical Dossiers
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#002116]">
                Engineered Decontamination Technologies
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Six primary technical approaches deployed across Kanpur Nagar and Kanpur Dehat. Click any intervention card below to inspect full engineering specifications, site prerequisites, chemical mechanisms, and monitoring requirements.
              </p>
            </div>

            {/* Pathway Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200 text-xs font-mono">
              {['All', 'Nature-Based', 'Engineering', 'Water Supply', 'Monitoring'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActivePathwayFilter(filter)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activePathwayFilter === filter 
                      ? 'bg-white text-[#002116] font-bold shadow-xs' 
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Interventions Grid — ALL 6 CLICKABLE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterventions.map((inv) => {
              return (
                <div 
                  key={inv.id} 
                  onClick={() => setSelectedIntervention(inv)}
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all p-6 flex flex-col justify-between cursor-pointer group space-y-4"
                >
                  <div className="space-y-4">
                    {/* Technical Image Preview */}
                    <div className="w-full h-40 rounded-xl overflow-hidden relative border border-stone-200 bg-stone-100">
                      <img 
                        src={inv.imageUrl} 
                        alt={inv.imageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                        <span className="text-[10px] font-mono text-stone-200 truncate">
                          {inv.imageCaption}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/90 text-stone-800 shadow-xs border border-stone-200">
                          {inv.readinessLevel.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${inv.bgLight} text-stone-800 border border-stone-200`}>
                          {inv.category}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-800 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> {inv.status}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[#002116] group-hover:text-emerald-800 transition-colors">
                        {inv.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                        {inv.shortDesc}
                      </p>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl text-[11px] font-mono text-stone-700 space-y-1 border border-stone-100">
                      <strong className="text-stone-900 block text-[10px] uppercase">Primary Mechanism:</strong>
                      <p className="text-stone-600 line-clamp-2">{inv.primaryMechanism}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-emerald-800 font-semibold group-hover:text-emerald-950">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> View Engineering Dossier
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 4: INTERVENTION COMPARISON MATRIX */}
        {/* ============================================================= */}
        <section className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <span className="text-xs font-mono text-[#006492] font-bold uppercase">Multi-Criteria Evaluation</span>
            <h2 className="text-2xl font-serif font-bold text-[#002116]">
              Intervention Technology Comparison Matrix
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Cross-cutting evaluation across target depth, implementation horizon, maintenance demand, and chromium removal efficiency.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                  <th className="py-3 px-4 font-bold">Intervention Technology</th>
                  <th className="py-3 px-3 font-bold">Pathway</th>
                  <th className="py-3 px-3 font-bold">Target Depth</th>
                  <th className="py-3 px-3 font-bold">Time Horizon</th>
                  <th className="py-3 px-3 font-bold">Capital Cost</th>
                  <th className="py-3 px-3 font-bold">Maintenance Demand</th>
                  <th className="py-3 px-3 font-bold">Cr(VI) Efficiency</th>
                  <th className="py-3 px-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {engineeredInterventionsData.map((inv) => (
                  <tr key={inv.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-serif font-bold text-stone-900">
                      {inv.title}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inv.bgLight} text-stone-800`}>
                        {inv.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-stone-600">
                      {inv.siteConditionsRequired.waterTableDepth.split('(')[0].trim()}
                    </td>
                    <td className="py-3.5 px-3 text-stone-600">
                      {inv.category === 'Water Supply' ? 'Immediate (<30d)' : inv.category === 'Nature-Based' ? '12–36 Months' : '3–6 Months'}
                    </td>
                    <td className="py-3.5 px-3 text-stone-600 font-semibold">
                      {inv.category === 'Water Supply' ? 'Moderate' : inv.category === 'Nature-Based' ? 'Low' : 'High'}
                    </td>
                    <td className="py-3.5 px-3 text-stone-600">
                      {inv.maintenance.length > 2 ? 'Continuous' : 'Periodic'}
                    </td>
                    <td className="py-3.5 px-3 text-emerald-800 font-bold">
                      {inv.category === 'Monitoring' ? 'Telemetry' : '>90% In-Situ'}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedIntervention(inv)}
                        className="px-2.5 py-1 rounded bg-stone-100 hover:bg-[#002116] hover:text-white text-stone-700 transition-colors text-[11px] font-bold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 5: ACTIVE FIELD PROJECTS REGISTRY */}
        {/* ============================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-mono text-[#006492] font-bold uppercase">DEPLOYED ENGINEERING</span>
              <h2 className="text-2xl font-serif font-bold text-[#002116]">Active Remediation Deployments</h2>
            </div>
            <span className="text-xs font-mono text-stone-500">{projects.length} field operations tracked</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col justify-between hover:shadow-md hover:border-[#2E8B68]/40 transition-all space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif font-bold text-lg text-[#002116] leading-snug">{project.name}</h3>
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                      project.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : project.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}>
                      {(project.status || 'proposed').replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-mono text-stone-600">
                    <p><span className="text-stone-400">Village:</span> <strong className="text-stone-800">{project.location}</strong></p>
                    <p><span className="text-stone-400">Type:</span> {project.type}</p>
                    <p><span className="text-stone-400">Agency:</span> {project.responsibleOrg}</p>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stone-500">Execution Progress</span>
                    <strong className="text-[#002116]">{project.progress}%</strong>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div 
                      className="bg-[#2E8B68] h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] font-mono text-stone-400 text-right">
                    Expected Completion: {project.endDate || '2026 Q3'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 6: DATA GAPS & FIELD VALIDATION REQUIRED */}
        {/* ============================================================= */}
        <section className="bg-amber-50/60 rounded-3xl p-6 sm:p-8 border border-amber-200 space-y-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-800" />
            <div>
              <h3 className="font-serif font-bold text-xl text-[#002116]">
                Data Gaps &amp; Field Validation Prerequisites
              </h3>
              <p className="text-xs font-mono text-stone-600 mt-0.5">
                Critical hydrogeological parameters requiring mandatory field borehole sampling prior to full civil engineering execution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-2">
              <strong className="text-amber-950 block text-[11px] uppercase">1. Continuous Stratigraphic Coring</strong>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                High-resolution sediment logging every 0.5m down to 25m to detect localized sand palaeochannels that could cause plume bypass around permeable barriers.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-2">
              <strong className="text-amber-950 block text-[11px] uppercase">2. Monsoon Head Fluctuation</strong>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Recording seasonal groundwater gradient swings (pre-monsoon water level ~18m vs post-monsoon ~6m) to prevent dry-well desiccation of botanical roots.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-2">
              <strong className="text-amber-950 block text-[11px] uppercase">3. Competing Anion Speciation</strong>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Quantifying dissolved sulfate (SO₄²⁻) and nitrate (NO₃⁻) concentrations that compete with chromate for Zero-Valent Iron reduction sites.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-2">
              <strong className="text-amber-950 block text-[11px] uppercase">4. Participatory Community Stewardship</strong>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Establishing village water committee co-management protocols to protect phytoremediation buffer strips from unauthorized grazing and timber harvest.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SECTION 7: METHODOLOGY & SCIENTIFIC CITATIONS */}
        {/* ============================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            <h3 className="font-serif font-bold text-lg text-[#002116]">
              Sources, Regulatory Standards &amp; Scientific Methodology
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-stone-600">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <strong className="text-stone-900 block text-[11px]">Central Pollution Control Board (CPCB) Guidelines (2022)</strong>
              <p className="text-[11px]">
                Technical Criteria for In-Situ Remediation of Chromium Contaminated Sites, Hazardous Waste Management Division, Ministry of Environment, Forest and Climate Change.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <strong className="text-stone-900 block text-[11px]">CSIR-National Botanical Research Institute (NBRI) Lucknow</strong>
              <p className="text-[11px]">
                Phytocapping and Rhizosphere Immobilization of Heavy Metals in Tannery Sludge Corridors of the Indo-Gangetic Plain (2022–2023).
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <strong className="text-stone-900 block text-[11px]">IIT Kanpur Department of Civil &amp; Environmental Engineering</strong>
              <p className="text-[11px]">
                Hydrogeological Characterization and Zero-Valent Iron Permeable Reactive Barrier Kinetic Models in Gangetic Alluvial Sands (2022–2024).
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <strong className="text-stone-900 block text-[11px]">WHO Guidelines for Drinking-Water Quality (4th Edition)</strong>
              <p className="text-[11px]">
                Chemical Fact Sheets: Chromium in Drinking-Water (Guideline value 0.05 mg/L total chromium; provisional health-based reference value).
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ============================================================= */}
      {/* MODAL 1: SPECIES DETAIL DOSSIER & LIGHTBOX */}
      {/* ============================================================= */}
      {selectedSpecies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 flex flex-col text-[#0c1f18]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Close Button */}
            <div className="p-6 border-b border-stone-200 flex justify-between items-start bg-stone-50 rounded-t-3xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {selectedSpecies.candidateType || 'Phytoextractor'}
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">
                    Botanical ID: {selectedSpecies.id || 'SPEC-REF'}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#002116]">
                  {selectedSpecies.commonName}
                </h3>
                <p className="text-xs font-mono italic text-stone-600">
                  {selectedSpecies.scientificName} {selectedSpecies.hindiName ? `· ${selectedSpecies.hindiName}` : ''}
                </p>
              </div>

              <button
                onClick={() => setSelectedSpecies(null)}
                className="w-9 h-9 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
                title="Close Dossier (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Photo Gallery / Lightbox */}
              <div className="space-y-2">
                <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden relative border border-stone-200 bg-stone-100">
                  <img 
                    src={selectedSpecies.galleryUrls?.[activePhotoIdx] || selectedSpecies.photoUrl} 
                    alt={selectedSpecies.scientificName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white text-xs font-mono">
                    <span className="font-bold">{selectedSpecies.scientificName}</span>
                    <span className="text-stone-300 text-[11px]">{selectedSpecies.attribution || 'Verified Botanical Specimen Photograph'}</span>
                  </div>
                </div>

                {/* Thumbnail selector if multiple images exist */}
                {selectedSpecies.galleryUrls && selectedSpecies.galleryUrls.length > 1 && (
                  <div className="flex gap-2">
                    {selectedSpecies.galleryUrls.map((url: string, pIdx: number) => (
                      <button
                        key={pIdx}
                        onClick={() => setActivePhotoIdx(pIdx)}
                        className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          activePhotoIdx === pIdx ? 'border-emerald-600 scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Thumbnail ${pIdx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap justify-between items-center text-[10px] font-mono text-stone-500 pt-1">
                  <span>Source: {selectedSpecies.source}</span>
                  <span>License: {selectedSpecies.license}</span>
                  <span className="text-emerald-700 font-semibold">{selectedSpecies.verificationStatus || 'Verified Germplasm'}</span>
                </div>
              </div>

              {/* Taxonomic Note */}
              {selectedSpecies.taxonomicNote && (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono text-stone-700">
                  <strong className="text-stone-900 block mb-0.5">Taxonomic &amp; Morphological Profile:</strong>
                  {selectedSpecies.taxonomicNote}
                </div>
              )}

              {/* Key Scientific Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <span className="text-stone-500 block text-[10px]">BCF MULTIPLIER</span>
                  <strong className="text-emerald-900 text-sm">{selectedSpecies.bcf}x Substrate</strong>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <span className="text-stone-500 block text-[10px]">MAX CR TOLERANCE</span>
                  <strong className="text-amber-900 text-sm">{selectedSpecies.maxCrToleranceMgKg} mg/kg</strong>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <span className="text-stone-500 block text-[10px]">ROOT PENETRATION</span>
                  <strong className="text-sky-900 text-sm">{selectedSpecies.rootDepth}</strong>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <span className="text-stone-500 block text-[10px]">OPTIMAL pH WINDOW</span>
                  <strong className="text-stone-900 text-sm">{selectedSpecies.preferredPhMin} – {selectedSpecies.preferredPhMax}</strong>
                </div>
              </div>

              {/* Biochemical Remediation Mechanism */}
              <div className="space-y-1.5 text-xs font-mono">
                <strong className="text-stone-900 block uppercase font-bold text-[11px]">
                  Biochemical Remediation Mechanism:
                </strong>
                <p className="text-stone-600 bg-stone-50 p-3.5 rounded-xl border border-stone-200 leading-relaxed">
                  {selectedSpecies.mechanism}
                </p>
              </div>

              {/* Agronomic & Cultivation Protocol */}
              <div className="space-y-1.5 text-xs font-mono">
                <strong className="text-stone-900 block uppercase font-bold text-[11px]">
                  Agronomic Care &amp; Planting Protocol:
                </strong>
                <p className="text-stone-600 bg-stone-50 p-3.5 rounded-xl border border-stone-200 leading-relaxed">
                  {selectedSpecies.agronomicCare || selectedSpecies.care}
                </p>
              </div>

              {/* Limitations & Field Validation Required */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 space-y-2">
                  <strong className="text-rose-950 block text-[11px] uppercase font-bold">
                    Known Limitations &amp; Site Vulnerabilities:
                  </strong>
                  <ul className="text-rose-900 space-y-1 list-disc list-inside text-[11px]">
                    {selectedSpecies.limitations?.map((lim: string, lIdx: number) => (
                      <li key={lIdx}>{lim}</li>
                    )) || <li>Requires active monitoring during extreme summer drought conditions.</li>}
                  </ul>
                </div>

                <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200 space-y-2">
                  <strong className="text-sky-950 block text-[11px] uppercase font-bold">
                    Mandatory Field Validation Checklist:
                  </strong>
                  <ul className="text-sky-900 space-y-1 list-disc list-inside text-[11px]">
                    {selectedSpecies.fieldValidationRequired?.map((req: string, rIdx: number) => (
                      <li key={rIdx}>{req}</li>
                    )) || <li>Perform composite topsoil bioassay prior to full strip planting.</li>}
                  </ul>
                </div>
              </div>

              {/* Citations */}
              {selectedSpecies.citations && (
                <div className="pt-2 text-xs font-mono text-stone-500 space-y-1">
                  <span className="font-bold text-stone-800 uppercase text-[10px] block">Scientific Citations:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {selectedSpecies.citations.map((cite: string, idx: number) => (
                      <li key={idx}>{cite}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end rounded-b-3xl">
              <button
                onClick={() => setSelectedSpecies(null)}
                className="px-6 py-2.5 rounded-xl bg-[#002116] text-white text-xs font-mono font-bold hover:bg-[#12372A] transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 2: ENGINEERED INTERVENTION TECHNICAL SPECIFICATIONS */}
      {/* ============================================================= */}
      {selectedIntervention && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 flex flex-col text-[#0c1f18]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-200 flex justify-between items-start bg-stone-50 rounded-t-3xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${selectedIntervention.bgLight} text-stone-800 border border-stone-200`}>
                    {selectedIntervention.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-200 text-stone-700">
                    {selectedIntervention.readinessLevel}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#002116]">
                  {selectedIntervention.title}
                </h3>
                <p className="text-xs font-mono text-stone-500">
                  Status: <strong className="text-emerald-800">{selectedIntervention.status}</strong> · Evidence Level: <strong className="text-stone-800">{selectedIntervention.evidenceLevel}</strong>
                </p>
              </div>

              <button
                onClick={() => setSelectedIntervention(null)}
                className="w-9 h-9 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
                title="Close Specification (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Technical Imagery */}
              <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden relative border border-stone-200 bg-stone-100">
                <img 
                  src={selectedIntervention.imageUrl} 
                  alt={selectedIntervention.imageAlt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4 text-white text-xs font-mono">
                  <span className="font-bold">{selectedIntervention.imageCaption}</span>
                  <span className="text-stone-300 text-[11px]">{selectedIntervention.imageAttribution}</span>
                </div>
              </div>

              {/* What It Is & How It Works */}
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <strong className="text-stone-900 block uppercase font-bold text-[11px] mb-1">
                    What It Is:
                  </strong>
                  <p className="text-stone-600 bg-stone-50 p-3.5 rounded-xl border border-stone-200 leading-relaxed">
                    {selectedIntervention.shortDesc}
                  </p>
                </div>

                <div>
                  <strong className="text-stone-900 block uppercase font-bold text-[11px] mb-1">
                    Chemical &amp; Hydrogeological Mechanism:
                  </strong>
                  <p className="text-stone-600 bg-stone-50 p-3.5 rounded-xl border border-stone-200 leading-relaxed">
                    {selectedIntervention.howItWorks}
                  </p>
                </div>
              </div>

              {/* Where Used & Site Prerequisites */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs font-mono">
                <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                  <strong className="text-stone-900 uppercase font-bold text-[11px]">
                    Site Conditions Required:
                  </strong>
                  <span className="text-stone-500">Field Deployments: {selectedIntervention.whereUsed}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-700">
                  <div><span className="text-stone-400">Target Water Depth:</span> <strong className="text-stone-900">{selectedIntervention.siteConditionsRequired.waterTableDepth}</strong></div>
                  <div><span className="text-stone-400">pH Tolerance:</span> <strong className="text-stone-900">{selectedIntervention.siteConditionsRequired.phRange}</strong></div>
                  <div><span className="text-stone-400">Soil Permeability:</span> <strong className="text-stone-900">{selectedIntervention.siteConditionsRequired.soilPermeability}</strong></div>
                  <div><span className="text-stone-400">Surface Footprint:</span> <strong className="text-stone-900">{selectedIntervention.siteConditionsRequired.surfaceAreaRequired}</strong></div>
                </div>
              </div>

              {/* Advantages vs Limitations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
                  <strong className="text-emerald-950 block text-[11px] uppercase font-bold">
                    Key Advantages &amp; Strengths:
                  </strong>
                  <ul className="text-emerald-900 space-y-1 list-disc list-inside text-[11px]">
                    {selectedIntervention.advantages.map((adv, idx) => (
                      <li key={idx}>{adv}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                  <strong className="text-amber-950 block text-[11px] uppercase font-bold">
                    Operational Constraints &amp; Limitations:
                  </strong>
                  <ul className="text-amber-900 space-y-1 list-disc list-inside text-[11px]">
                    {selectedIntervention.limitations.map((lim, idx) => (
                      <li key={idx}>{lim}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Maintenance, Monitoring & Potential Risks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-stone-700">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block text-[10px] uppercase font-bold">Maintenance Regime</strong>
                  <ul className="text-[11px] space-y-1 list-disc list-inside text-stone-600">
                    {selectedIntervention.maintenance.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block text-[10px] uppercase font-bold">Sensor Monitoring</strong>
                  <ul className="text-[11px] space-y-1 list-disc list-inside text-stone-600">
                    {selectedIntervention.monitoringRequirements.map((mr, idx) => (
                      <li key={idx}>{mr}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block text-[10px] uppercase font-bold">Potential Risks</strong>
                  <ul className="text-[11px] space-y-1 list-disc list-inside text-stone-600">
                    {selectedIntervention.potentialRisks.map((pr, idx) => (
                      <li key={idx}>{pr}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* References */}
              <div className="pt-2 text-xs font-mono text-stone-500 space-y-1">
                <span className="font-bold text-stone-800 uppercase text-[10px] block">Published Technical References:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {selectedIntervention.researchReferences.map((ref, idx) => (
                    <li key={idx}>{ref}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end rounded-b-3xl">
              <button
                onClick={() => setSelectedIntervention(null)}
                className="px-6 py-2.5 rounded-xl bg-[#002116] text-white text-xs font-mono font-bold hover:bg-[#12372A] transition-colors"
              >
                Close Technical Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
