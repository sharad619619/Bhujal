import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const village = db.getVillageById(id);
  if (!village) {
    return NextResponse.json({ error: 'Village not found' }, { status: 404 });
  }

  const resolvedId = db.resolveVillageId(id) || village.id;
  const waterSources = db.getWaterSourcesByVillage(resolvedId);
  const schools = db.getSchoolsByVillage(resolvedId);
  const reports = db.getReportsByVillage(resolvedId);

  const features: any[] = [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [village.coordinates.lon, village.coordinates.lat],
      },
      properties: {
        id: village.id,
        entityType: 'village',
        name: village.name,
        hindiName: village.hindiName,
        population: village.population,
        riskLevel: village.riskLevel,
      },
    },
    ...waterSources.map(ws => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [ws.coordinates.lon, ws.coordinates.lat],
      },
      properties: {
        id: ws.id,
        entityType: 'waterSource',
        name: ws.name,
        type: ws.type,
        status: ws.status,
        latestCrMgL: ws.latestCrMgL,
        depth: ws.depth,
      },
    })),
    ...schools.map(sc => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [sc.coordinates.lon, sc.coordinates.lat],
      },
      properties: {
        id: sc.id,
        entityType: 'school',
        name: sc.name,
        studentCount: sc.studentCount,
      },
    })),
    ...reports.filter(r => r.coordinates).map(r => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [r.coordinates!.lon, r.coordinates!.lat],
      },
      properties: {
        id: r.id,
        entityType: 'communityReport',
        category: r.category,
        status: r.status,
        date: r.date,
        photoUrl: r.photoUrl,
      },
    })),
  ];

  return NextResponse.json({
    type: 'FeatureCollection',
    features,
  });
}
