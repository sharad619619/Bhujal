import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');
  const limitParam = searchParams.get('limit');

  if (!latParam || !lonParam) {
    return NextResponse.json(
      { error: 'Latitude and longitude parameters are required' },
      { status: 400 }
    );
  }

  const lat = parseFloat(latParam);
  const lon = parseFloat(lonParam);
  const limit = limitParam ? parseInt(limitParam) : 3;

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: 'Invalid coordinate values' }, { status: 400 });
  }

  const results = db.findNearestSafeWater(lat, lon, limit);
  return NextResponse.json(results);
}
