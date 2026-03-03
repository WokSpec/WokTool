import { NextRequest, NextResponse } from 'next/server';
import { getAutomations } from '@/lib/ghl';

export async function GET() {
  const automations = await getAutomations();
  return NextResponse.json(automations);
}

interface ToggleBody {
  id: string;
  action: 'activate' | 'pause';
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ToggleBody;
  // In a real implementation this would call GHL API to toggle the automation.
  // For now we just return success.
  return NextResponse.json({ success: true, id: body.id, action: body.action });
}
