import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');

  const lat = latParam ? parseFloat(latParam) : undefined;
  const lon = lonParam ? parseFloat(lonParam) : undefined;

  const result = db.checkWaterSafety(query, lat, lon);
  return NextResponse.json(result);
}
