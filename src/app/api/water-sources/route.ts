import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const villageId = searchParams.get('villageId');
  const yearStr = searchParams.get('year');

  if (yearStr) {
    const year = parseInt(yearStr, 10);
    const sources = db.getWaterSourcesByYear(year);
    if (villageId) {
      const resolved = db.resolveVillageId(villageId) || villageId;
      return NextResponse.json(sources.filter(s => s.villageId === resolved));
    }
    return NextResponse.json(sources);
  }

  if (villageId) {
    const resolved = db.resolveVillageId(villageId) || villageId;
    return NextResponse.json(db.getWaterSourcesByVillage(resolved));
  }

  return NextResponse.json(db.getWaterSources());
}
