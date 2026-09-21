from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uuid
from datetime import datetime

from .schemas import (
    VillageResponse, WaterSourceResponse, MeasurementCreate,
    MeasurementResponse, CommunityReportCreate, CommunityReportResponse,
    RemediationProjectResponse
)

app = FastAPI(
    title="AquaShield / Bhujal AI Intelligence API",
    description="Groundwater Chromium Response & Remediation Intelligence API for Uttar Pradesh, India",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated in-memory storage for immediate demo usability
villages_db = [
    {
        "id": "V-001",
        "name": "Khanchandpur",
        "name_hi": "खानचंदपुर",
        "state": "Uttar Pradesh",
        "district": "Kanpur Nagar",
        "block": "Rania",
        "latitude": 26.465,
        "longitude": 80.342,
        "population": 8240,
        "households": 1648,
        "groundwater_depth_m": 14.0,
        "contamination_status": "High",
        "data_status": "verified",
        "is_demo": True,
        "created_at": datetime(2020, 1, 15)
    },
    {
        "id": "V-002",
        "name": "Rania",
        "name_hi": "रनिया",
        "state": "Uttar Pradesh",
        "district": "Kanpur Nagar",
        "block": "Rania",
        "latitude": 26.448,
        "longitude": 80.301,
        "population": 4500,
        "households": 900,
        "groundwater_depth_m": 16.0,
        "contamination_status": "Moderate",
        "data_status": "verified",
        "is_demo": True,
        "created_at": datetime(2020, 3, 20)
    }
]

reports_db = [
    {
        "id": "CR-001",
        "reference_number": "AS-2026-00127",
        "village_id": "V-001",
        "water_source_id": "HP-001",
        "category": "water",
        "description": "Noticeable yellow discoloration in water from hand pump after heavy monsoon showers.",
        "latitude": 26.466,
        "longitude": 80.343,
        "photo_url": None,
        "status": "Under Review",
        "reported_at": datetime(2026, 9, 12),
        "is_demo": True
    }
]

@app.get("/")
def health_check():
    return {
        "status": "operational",
        "system": "AquaShield / Bhujal AI Intelligence Engine",
        "version": "1.0.0",
        "mode": "DEMO DATA MODE"
    }

@app.get("/villages", response_model=List[VillageResponse])
def get_villages():
    return villages_db

@app.get("/villages/{village_id}", response_model=VillageResponse)
def get_village(village_id: str):
    v = next((item for item in villages_db if item["id"] == village_id), None)
    if not v:
        raise HTTPException(status_code=404, detail="Village not found")
    return v

@app.get("/community-reports", response_model=List[CommunityReportResponse])
def get_community_reports():
    return reports_db

@app.post("/community-reports", response_model=CommunityReportResponse)
def create_community_report(report: CommunityReportCreate):
    new_report = {
        "id": f"CR-{uuid.uuid4().hex[:6]}",
        "reference_number": f"AS-2026-{uuid.uuid4().hex[:5].upper()}",
        "village_id": report.village_id,
        "water_source_id": report.water_source_id,
        "category": report.category,
        "description": report.description,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "photo_url": report.photo_url,
        "status": "Reported",
        "reported_at": datetime.utcnow(),
        "is_demo": True
    }
    reports_db.insert(0, new_report)
    return new_report
