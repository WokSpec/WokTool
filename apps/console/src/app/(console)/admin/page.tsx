import Link from 'next/link';
import StatCard from '@/components/StatCard';
import ClientCard from '@/components/ClientCard';
import { Users, TrendingUp, Clock, DollarSign } from 'lucide-react';
import type { Client } from '@/lib/types';

const MOCK_CLIENTS: Client[] = [
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
  {
    id: 'cl2',
    name: 'Nair Legal',
    email: 'priya@nairlegal.io',
    businessType: 'Legal Services',
    status: 'active',
    ghlLocationId: 'loc_nair456',
    createdAt: '2024-04-15T00:00:00Z',
    stats: { contacts: 95, openDeals: 5, automations: 3 },
  },
  {
    id: 'cl3',
    name: 'Reyes Studio',
    email: 'sofia@reyesstudio.com',
    businessType: 'Creative Agency',
    status: 'onboarding',
    createdAt: '2024-06-01T00:00:00Z',
    stats: { contacts: 12, openDeals: 2, automations: 0 },
  },
  {
    id: 'cl4',
    name: 'Webb Tech',
    email: 'marcus@webbtech.dev',
    businessType: 'SaaS',
    status: 'paused',
    ghlLocationId: 'loc_webb789',
    createdAt: '2024-02-20T00:00:00Z',
    stats: { contacts: 180, openDeals: 0, automations: 4 },
  },
];

export default function AdminPage() {
  const totalClients = MOCK_CLIENTS.length;
  const activeClients = MOCK_CLIENTS.filter((c) => c.status === 'active').length;
  const onboardingClients = MOCK_CLIENTS.filter((c) => c.status === 'onboarding').length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          Admin Overview
        </h1>
        <Link
          href="/admin/clients/new"
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        >
          + Add New Client
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Clients" value={totalClients} icon={<Users size={16} />} />
        <StatCard
          label="Active"
          value={activeClients}
          icon={<TrendingUp size={16} />}
          accent
        />
        <StatCard label="Onboarding" value={onboardingClients} icon={<Clock size={16} />} />
        <StatCard label="MRR" value="$12,400" change="+8%" icon={<DollarSign size={16} />} />
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_CLIENTS.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}
