import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  return NextResponse.json(db.getContaminationSources());
}
