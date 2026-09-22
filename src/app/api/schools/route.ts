import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const villageId = searchParams.get('villageId');

  if (villageId) {
    const resolved = db.resolveVillageId(villageId) || villageId;
    return NextResponse.json(db.getSchoolsByVillage(resolved));
  }

  return NextResponse.json(db.getSchools());
}
