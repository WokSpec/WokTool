import { NextResponse } from 'next/server';
import { getPipelines } from '@/lib/ghl';

export async function GET() {
  const pipelines = await getPipelines();
  return NextResponse.json(pipelines);
}
