import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const villageId = searchParams.get('villageId');
  const category = searchParams.get('category');
  const status = searchParams.get('status');

  let reports = db.getCommunityReports();

  if (villageId) {
    const resolved = db.resolveVillageId(villageId) || villageId;
    reports = reports.filter(r => r.villageId === resolved);
  }

  if (category && category !== 'all') {
    reports = reports.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  if (status && status !== 'all') {
    reports = reports.filter(r => r.status.toLowerCase() === status.toLowerCase());
  }

  return NextResponse.json(reports);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.category) {
      return NextResponse.json(
        { error: 'Observation category is required' },
        { status: 400 }
      );
    }

    if (!body.description && !body.photoDataUrl && !body.photoUrl) {
      return NextResponse.json(
        { error: 'Description or photo evidence is required' },
        { status: 400 }
      );
    }

    const report = db.submitCommunityReport({
      category: body.category,
      description: body.description || 'Community incident report submitted via mobile portal',
      villageId: body.villageId,
      waterSourceId: body.waterSourceId,
      latitude: body.latitude,
      longitude: body.longitude,
      photoDataUrl: body.photoDataUrl || body.photoUrl,
      reporterName: body.reporterName,
    });

    return NextResponse.json(report, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Report submission failed: ${err.message}` },
      { status: 500 }
    );
  }
}
