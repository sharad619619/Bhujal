import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, format } = body;

    if (!content) {
      return NextResponse.json({ error: 'File content is required' }, { status: 400 });
    }

    const result = db.importDataset(content, format || 'csv');
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Dataset import failed: ${err.message}` },
      { status: 500 }
    );
  }
}
