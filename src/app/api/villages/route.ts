import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  const villages = db.getVillages();
  return NextResponse.json(villages);
}
