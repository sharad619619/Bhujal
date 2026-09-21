from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(String(50), default="community_member") # public, volunteer, researcher, ngo, authority, admin
    created_at = Column(DateTime, default=datetime.utcnow)

class Village(Base):
    __tablename__ = "villages"
    id = Column(String(50), primary_key=True)
    name = Column(String(255), nullable=False)
    name_hi = Column(String(255))
    state = Column(String(100), default="Uttar Pradesh")
    district = Column(String(100), default="Kanpur Nagar")
    block = Column(String(100))
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    population = Column(Integer, default=0)
    households = Column(Integer, default=0)
    groundwater_depth_m = Column(Float, default=0.0)
    contamination_status = Column(String(50), default="Unknown") # Low, Moderate, Elevated, High
    data_status = Column(String(50), default="verified") # verified, reported, estimated, predicted, unknown
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    water_sources = relationship("WaterSource", back_populates="village")
    reports = relationship("CommunityReport", back_populates="village")
    timeline_events = relationship("TimelineEvent", back_populates="village")

class WaterSource(Base):
    __tablename__ = "water_sources"
    id = Column(String(50), primary_key=True)
    village_id = Column(String(50), ForeignKey("villages.id"), nullable=False)
    type = Column(String(50), default="hand_pump") # hand_pump, borewell, community_station, piped
    name = Column(String(255))
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(String(50), default="unknown") # safe, restricted, do_not_use, unknown
    restrictions = Column(JSON, default=dict) # { drinking: bool, cooking: bool, bathing: bool, irrigation: bool, livestock: bool }
    last_verified = Column(DateTime, default=datetime.utcnow)
    population_served = Column(Integer, default=0)
    nearest_school_dist_m = Column(Float, default=0.0)
    agricultural_area_km2 = Column(Float, default=0.0)
    alternative_source_id = Column(String(50), nullable=True)
    data_status = Column(String(50), default="verified")
    is_demo = Column(Boolean, default=True)

    village = relationship("Village", back_populates="water_sources")
    measurements = relationship("ChromiumMeasurement", back_populates="water_source")

class ChromiumMeasurement(Base):
    __tablename__ = "chromium_measurements"
    # Immutable audit-ready scientific measurement table
    id = Column(String(50), primary_key=True)
    water_source_id = Column(String(50), ForeignKey("water_sources.id"), nullable=False)
    sample_date = Column(DateTime, nullable=False)
    parameter = Column(String(50), default="Total Chromium") # Total Chromium, Chromium (VI)
    value_mg_l = Column(Float, nullable=False)
    unit = Column(String(20), default="mg/L")
    method = Column(String(100)) # AAS, ICP-MS, Colorimetric
    laboratory = Column(String(255))
    verification_status = Column(String(50), default="verified") # verified, estimated, predicted, reported
    uploaded_by = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False) # IMMUTABLE
    is_demo = Column(Boolean, default=True)

    water_source = relationship("WaterSource", back_populates="measurements")

class CommunityReport(Base):
    __tablename__ = "community_reports"
    id = Column(String(50), primary_key=True)
    reference_number = Column(String(50), unique=True, index=True) # AS-2026-XXXXX
    village_id = Column(String(50), ForeignKey("villages.id"), nullable=False)
    water_source_id = Column(String(50), nullable=True)
    category = Column(String(50), nullable=False) # water, soil, waste_dumping, hand_pump, crop_vegetation, other
    description = Column(Text)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    photo_url = Column(String(500), nullable=True)
    status = Column(String(50), default="Reported") # Reported -> Under Review -> Field Verified -> Lab Verified -> Resolved
    reported_at = Column(DateTime, default=datetime.utcnow)
    reporter_contact = Column(String(100), nullable=True) # Protected privacy
    is_demo = Column(Boolean, default=True)

    village = relationship("Village", back_populates="reports")

class RemediationProject(Base):
    __tablename__ = "remediation_projects"
    id = Column(String(50), primary_key=True)
    village_id = Column(String(50), ForeignKey("villages.id"), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(String(100)) # pump_and_treat, containment, phytoremediation, alternative_supply
    status = Column(String(50), default="proposed") # proposed, approved, in_progress, monitoring, completed
    responsible_org = Column(String(255))
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    baseline_value = Column(Float, nullable=True)
    latest_observed_value = Column(Float, nullable=True)
    description = Column(Text)
    is_demo = Column(Boolean, default=True)

class TimelineEvent(Base):
    __tablename__ = "timeline_events"
    id = Column(String(50), primary_key=True)
    village_id = Column(String(50), ForeignKey("villages.id"), nullable=False)
    event_date = Column(DateTime, nullable=False)
    title = Column(String(255), nullable=False)
    title_hi = Column(String(255), nullable=True)
    description = Column(Text)
    event_type = Column(String(50)) # community_report, official_measurement, laboratory_result, government_action, remediation_outcome
    source = Column(String(255))
    data_status = Column(String(50), default="verified")
    is_demo = Column(Boolean, default=True)

    village = relationship("Village", back_populates="timeline_events")
