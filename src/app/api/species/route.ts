import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  const species = db.getBotanicalSpecies();
  return NextResponse.json(species);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ph = typeof body.ph === 'number' ? body.ph : 7.2;
    const moisture = typeof body.moisture === 'number' ? body.moisture : 28;
    const cr = typeof body.crConcentration === 'number' ? body.crConcentration : 45;
    const depth = typeof body.depth === 'number' ? body.depth : 12;

    const result = db.calculateRemediationFeasibility(ph, moisture, cr, depth);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: `Calculation failed: ${err.message}` }, { status: 500 });
  }
}
