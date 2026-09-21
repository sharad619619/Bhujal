from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class VillageBase(BaseModel):
    name: str
    name_hi: Optional[str] = None
    state: str = "Uttar Pradesh"
    district: str = "Kanpur Nagar"
    block: Optional[str] = None
    latitude: float
    longitude: float
    population: int = 0
    households: int = 0
    groundwater_depth_m: float = 0.0
    contamination_status: str = "Unknown"
    data_status: str = "verified"
    is_demo: bool = True

class VillageResponse(VillageBase):
    id: str
    created_at: datetime
    class Config:
        from_attributes = True

class WaterSourceBase(BaseModel):
    village_id: str
    type: str = "hand_pump"
    name: str
    latitude: float
    longitude: float
    status: str = "unknown"
    restrictions: Dict[str, bool] = Field(default_factory=dict)
    population_served: int = 0
    nearest_school_dist_m: float = 0.0
    agricultural_area_km2: float = 0.0
    alternative_source_id: Optional[str] = None
    data_status: str = "verified"
    is_demo: bool = True

class WaterSourceResponse(WaterSourceBase):
    id: str
    last_verified: datetime
    class Config:
        from_attributes = True

class MeasurementCreate(BaseModel):
    water_source_id: str
    sample_date: datetime
    parameter: str = "Total Chromium"
    value_mg_l: float
    unit: str = "mg/L"
    method: str
    laboratory: str
    verification_status: str = "verified"
    uploaded_by: str
    is_demo: bool = True

class MeasurementResponse(MeasurementCreate):
    id: str
    created_at: datetime
    class Config:
        from_attributes = True

class CommunityReportCreate(BaseModel):
    village_id: str
    water_source_id: Optional[str] = None
    category: str
    description: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    photo_url: Optional[str] = None
    reporter_contact: Optional[str] = None

class CommunityReportResponse(BaseModel):
    id: str
    reference_number: str
    village_id: str
    water_source_id: Optional[str]
    category: str
    description: str
    latitude: Optional[float]
    longitude: Optional[float]
    photo_url: Optional[str]
    status: str
    reported_at: datetime
    is_demo: bool
    class Config:
        from_attributes = True

class RemediationProjectResponse(BaseModel):
    id: str
    village_id: str
    name: str
    type: str
    status: str
    responsible_org: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    baseline_value: Optional[float]
    latest_observed_value: Optional[float]
    description: Optional[str]
    is_demo: bool
    class Config:
        from_attributes = True
