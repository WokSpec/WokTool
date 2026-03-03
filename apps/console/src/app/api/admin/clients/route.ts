import { NextRequest, NextResponse } from 'next/server';
import type { Client } from '@/lib/types';

// In-memory store for demo purposes
const clients: Client[] = [
  {
    id: 'cl1',
    name: 'Mercer Co.',
    email: 'alex@mercerco.com',
    businessType: 'E-commerce',
    status: 'active',
    ghlLocationId: 'loc_mercer123',
    createdAt: '2024-03-01T00:00:00Z',
    stats: { contacts: 240, openDeals: 14, automations: 6 },
  },
];

interface CreateClientBody {
  name: string;
  email: string;
  businessType: string;
  plan: string;
  provisionGHL?: boolean;
}

export async function GET() {
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateClientBody;

  const newClient: Client = {
    id: `cl-${Date.now()}`,
    name: body.name,
    email: body.email,
    businessType: body.businessType,
    status: 'onboarding',
    createdAt: new Date().toISOString(),
    stats: { contacts: 0, openDeals: 0, automations: 0 },
  };

  clients.push(newClient);

  return NextResponse.json(newClient, { status: 201 });
}
