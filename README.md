# Bhujal AI
**Chromium Groundwater Response & Remediation Intelligence Platform**
*Core Tagline: From contamination data to community action.*
*Focus Region: Kanpur Nagar – Kanpur Dehat – Fatehpur, Uttar Pradesh, India*

---

## 🌊 Overview

**Bhujal AI (AquaShield)** is a comprehensive, production-grade environmental intelligence, community-response, remediation-planning, and evidence-monitoring platform. It bridges the gap between scientific laboratory data and village-level decisions, designed for villagers, volunteers, NGOs, researchers, and district administrators.

---

## 🚀 Key Features

1. **Contamination Digital Twin & Live Map (`/map`)**
   - Built with **MapLibre GL JS** on OpenStreetMap tiles.
   - 14 toggleable GIS layers: Villages, Hand Pumps, Groundwater Points, Soil Samples, Total Chromium, Cr(VI), Predicted Exposure Zones, Schools, Healthcare Facilities, Agricultural Zones, Industrial Sites, Waste Dumps, Drainage, and Remediation Sites.
   - Interactive detail drawer with historical laboratory curves (Recharts) and nearest safe alternative water stations.

2. **Village Digital Twin (`/villages`, `/villages/[id]`)**
   - Deep-dive profiles for monitored villages: *Khanchandpur, Rania, Panki, Sachendi, Rooma*.
   - **Temporal Time Slider (2018 → 2026)** simulating contamination plumes and intervention outcomes across time.

3. **Community Safe-Water Portal (`/water-safety`)**
   - Simple public lookup: *"Is my water source safe?"*
   - Color and icon-coded directives: `DO NOT USE FOR DRINKING`, `RESTRICTED`, `VERIFIED STATUS AVAILABLE`.
   - Clear usage matrix across Drinking, Cooking, Bathing, Irrigation, and Livestock.
   - 90-day data freshness alert.

4. **Community Reporting Wizard (`/reports/new`, `/reports`)**
   - 4-step low-literacy reporting wizard (What did you see → Where → Photo/Details → Reference ID).
   - Generates official tracking IDs (`AS-2026-XXXXX`).
   - Moderator dashboard managing workflow: `Reported` → `Under Review` → `Field Verified` → `Lab Verified` → `Resolved`.

5. **Intervention Prioritization Engine (`/prioritization`)**
   - **Prototype Intervention Priority Index** evaluating population exposure, contamination severity, sensitive institutions, groundwater depth, and agricultural impact.
   - Interactive weight adjusters allowing researchers to adjust factor weights and recalculate urgency rankings in real-time.

6. **Remediation & Phytoremediation Planner (`/remediation`)**
   - Interactive **Before / After Comparison Slider** (-78% reduction observed).
   - 30–365 day monitoring timeline.
   - Botanical hyper-accumulator advisor (*Vetiveria zizanioides*, *Brassica juncea*) based on soil pH, moisture, and chromium levels.

7. **Environmental Evidence Timeline & Dossier (`/evidence`)**
   - Immutable chronological ledger distinguishing community reports, official sampling, lab results, and remediation actions.
   - Structured export-ready evidence dossier generator.

8. **Transparency & Trust Framework (`/data-sources`, `/about`)**
   - Rigorous 5-tier data classification: `VERIFIED`, `REPORTED`, `ESTIMATED`, `PREDICTED`, `UNKNOWN`.
   - Prominent **DEMO DATA** banners and watermarks.
   - Bilingual support (**English | हिंदी**) with one-click toggling.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14/16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **GIS Mapping:** MapLibre GL JS
- **Charts:** Recharts
- **Components:** Radix UI primitives
- **Backend Architecture:** Python FastAPI + SQLAlchemy models (in `/backend` for PostGIS deployments)

---

## ⚡ Quickstart (Local Development)

```bash
# Clone the repository
git clone https://github.com/sharad619619/Bhujal.git
cd Bhujal

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment on Vercel

1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Next.js**.
3. Root Directory: `./` (project root).
4. Click **Deploy**. Zero additional configuration required!
