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
  const remediationProjects = db.getRemediationProjectsByVillage(resolvedId);
  const timeline = db.getTimelineEventsByVillage(resolvedId);
  const riskScore = db.getRiskScoreForVillage(resolvedId);

  return NextResponse.json({
    village,
    waterSources,
    schools,
    reports,
    remediationProjects,
    timeline,
    riskScore,
  });
}
