// Subsurface Map Entity & State Types

import type {
  Village,
  WaterSource,
  GroundwaterPoint,
  School,
  HealthcareFacility,
  ContaminationSource,
  CommunityReport,
  AgriculturalZone,
  RemediationProject,
  Measurement,
} from '@/lib/types';

export type MapEntityType =
  | 'village'
  | 'waterSource'
  | 'handPump'
  | 'groundwaterPoint'
  | 'school'
  | 'healthcare'
  | 'contaminationSource'
  | 'wasteSite'
  | 'communityReport'
  | 'agriculturalZone'
  | 'remediationProject';

export interface MapLayerState {
  villages: boolean;
  waterSources: boolean;
  groundwaterPoints: boolean;
  schools: boolean;
  healthcare: boolean;
  contaminationSources: boolean;
  communityReports: boolean;
  agriculturalZones: boolean;
  remediationProjects: boolean;
  predictedZones: boolean;
}

export type QuickFilterCategory =
  | 'all'
  | 'water'
  | 'contamination'
  | 'community'
  | 'infrastructure'
  | 'remediation';

export type DataStatusFilter = 'all' | 'verified' | 'reported' | 'estimated' | 'predicted';
export type WaterSafetyFilter = 'all' | 'safe' | 'restricted' | 'do_not_use';

export interface UnifiedMapEntity {
  id: string;
  _type: MapEntityType;
  name: string;
  coordinates: { lat: number; lon: number };
  status?: string;
  dataStatus?: string;
  villageId?: string;
  villageName?: string;
  raw: any;
}
