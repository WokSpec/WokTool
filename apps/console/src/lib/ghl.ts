export interface GHLContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tags: string[];
  stage: string;
  createdAt: string;
  value?: number;
}

export interface GHLPipeline {
  id: string;
  name: string;
  stages: { id: string; name: string; contacts: number; value: number }[];
}

export interface GHLAutomation {
  id: string;
  name: string;
  status: 'active' | 'paused';
  triggers: number;
  lastTriggered?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _API = 'https://services.leadconnectorhq.com';

const MOCK_CONTACTS: GHLContact[] = [
  {
    id: 'c1',
    name: 'Alex Mercer',
    email: 'alex@mercerco.com',
    phone: '+1 555 0101',
    tags: ['hot-lead', 'e-commerce'],
    stage: 'Proposal',
    createdAt: '2024-05-01T10:00:00Z',
    value: 4500,
  },
  {
    id: 'c2',
    name: 'Priya Nair',
    email: 'priya@nairlegal.io',
    phone: '+1 555 0102',
    tags: ['legal', 'retainer'],
    stage: 'Discovery',
    createdAt: '2024-05-08T14:30:00Z',
    value: 2200,
  },
  {
    id: 'c3',
    name: 'James Okafor',
    email: 'james@okaforconsult.com',
    tags: ['consulting'],
    stage: 'Closed Won',
    createdAt: '2024-04-20T09:00:00Z',
    value: 8000,
  },
  {
    id: 'c4',
    name: 'Sofia Reyes',
    email: 'sofia@reyesstudio.com',
    tags: ['design', 'new'],
    stage: 'Lead',
    createdAt: '2024-06-01T11:00:00Z',
    value: 1200,
  },
  {
    id: 'c5',
    name: 'Marcus Webb',
    email: 'marcus@webbtech.dev',
    tags: ['tech', 'saas'],
    stage: 'Negotiation',
    createdAt: '2024-05-15T16:00:00Z',
    value: 6000,
  },
  {
    id: 'c6',
    name: 'Lena Hoffmann',
    email: 'lena@hoffmannbakes.de',
    phone: '+49 30 123456',
    tags: ['food', 'local'],
    stage: 'Discovery',
    createdAt: '2024-05-22T08:45:00Z',
    value: 900,
  },
  {
    id: 'c7',
    name: 'Daniel Park',
    email: 'daniel@parkfitness.co',
    tags: ['fitness', 'hot-lead'],
    stage: 'Proposal',
    createdAt: '2024-06-03T13:00:00Z',
    value: 3100,
  },
  {
    id: 'c8',
    name: 'Amara Diallo',
    email: 'amara@diallotravel.com',
    tags: ['travel', 'retainer'],
    stage: 'Closed Won',
    createdAt: '2024-04-10T10:00:00Z',
    value: 5500,
  },
];

const MOCK_PIPELINES: GHLPipeline[] = [
  {
    id: 'p1',
    name: 'Sales Pipeline',
    stages: [
      { id: 's1', name: 'Lead', contacts: 3, value: 3600 },
      { id: 's2', name: 'Discovery', contacts: 2, value: 3100 },
      { id: 's3', name: 'Proposal', contacts: 2, value: 7600 },
      { id: 's4', name: 'Negotiation', contacts: 1, value: 6000 },
      { id: 's5', name: 'Closed Won', contacts: 2, value: 13500 },
    ],
  },
  {
    id: 'p2',
    name: 'Onboarding Pipeline',
    stages: [
      { id: 'o1', name: 'Kickoff', contacts: 4, value: 0 },
      { id: 'o2', name: 'Setup', contacts: 2, value: 0 },
      { id: 'o3', name: 'Review', contacts: 1, value: 0 },
      { id: 'o4', name: 'Live', contacts: 3, value: 0 },
    ],
  },
];

const MOCK_AUTOMATIONS: GHLAutomation[] = [
  {
    id: 'a1',
    name: 'New Lead Welcome Sequence',
    status: 'active',
    triggers: 47,
    lastTriggered: '2024-06-05T09:00:00Z',
  },
  {
    id: 'a2',
    name: 'Proposal Follow-up',
    status: 'active',
    triggers: 23,
    lastTriggered: '2024-06-04T14:30:00Z',
  },
  {
    id: 'a3',
    name: 'Re-engagement Campaign',
    status: 'paused',
    triggers: 12,
    lastTriggered: '2024-05-20T11:00:00Z',
  },
  {
    id: 'a4',
    name: 'Review Request After Close',
    status: 'active',
    triggers: 31,
    lastTriggered: '2024-06-03T16:00:00Z',
  },
];

export async function getContacts(locationId?: string): Promise<GHLContact[]> {
  if (!process.env.GHL_API_KEY) return MOCK_CONTACTS;

  try {
    const params = new URLSearchParams();
    if (locationId) params.set('locationId', locationId);

    const res = await fetch(`${_API}/contacts/?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${process.env.GHL_API_KEY}`,
        Version: '2021-07-28',
      },
      cache: 'no-store',
    });
    if (!res.ok) return MOCK_CONTACTS;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- GHL API response shape varies
    const data = (await res.json()) as any;
    return (data.contacts ?? []) as GHLContact[];
  } catch {
    return MOCK_CONTACTS;
  }
}

export async function getPipelines(locationId?: string): Promise<GHLPipeline[]> {
  if (!process.env.GHL_API_KEY) return MOCK_PIPELINES;

  try {
    const params = new URLSearchParams();
    if (locationId) params.set('locationId', locationId);

    const res = await fetch(`${_API}/opportunities/pipelines?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${process.env.GHL_API_KEY}`,
        Version: '2021-07-28',
      },
      cache: 'no-store',
    });
    if (!res.ok) return MOCK_PIPELINES;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- GHL API response shape varies
    const data = (await res.json()) as any;
    return (data.pipelines ?? []) as GHLPipeline[];
  } catch {
    return MOCK_PIPELINES;
  }
}

export async function getAutomations(locationId?: string): Promise<GHLAutomation[]> {
  if (!process.env.GHL_API_KEY) return MOCK_AUTOMATIONS;

  try {
    const params = new URLSearchParams();
    if (locationId) params.set('locationId', locationId);

    const res = await fetch(`${_API}/workflows/?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${process.env.GHL_API_KEY}`,
        Version: '2021-07-28',
      },
      cache: 'no-store',
    });
    if (!res.ok) return MOCK_AUTOMATIONS;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- GHL API response shape varies
    const data = (await res.json()) as any;
    return (data.workflows ?? []) as GHLAutomation[];
  } catch {
    return MOCK_AUTOMATIONS;
  }
}
