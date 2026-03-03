import { getContacts, getPipelines, getAutomations } from '@/lib/ghl';
import StatCard from '@/components/StatCard';
import EralAssistant from '@/components/EralAssistant';
import { Users, TrendingUp, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const [contacts, pipelines, automations] = await Promise.all([
    getContacts(),
    getPipelines(),
    getAutomations(),
  ]);

  const openDealsValue = pipelines
    .flatMap((p) => p.stages)
    .reduce((sum, s) => sum + s.value, 0);

  const activeAutomations = automations.filter((a) => a.status === 'active').length;
  const recentContacts = contacts.slice(-5).reverse();

  return (
    <div className="flex flex-col gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Contacts"
          value={contacts.length}
          change="+3 this week"
          icon={<Users size={16} />}
        />
        <StatCard
          label="Open Deals"
          value={`$${openDealsValue.toLocaleString()}`}
          change="+12%"
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          label="Active Automations"
          value={activeAutomations}
          icon={<Zap size={16} />}
        />
        <StatCard
          label="AI Requests"
          value={142}
          change="+24 today"
          icon={<Sparkles size={16} />}
          accent
        />
      </div>

      {/* Recent Contacts */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            Recent Contacts
          </h2>
          <Link
            href="/dashboard/crm"
            className="text-xs"
            style={{ color: 'var(--accent)' }}
          >
            View all →
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Name', 'Email', 'Stage', 'Value'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-2 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--text-subtle)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentContacts.map((c) => (
              <tr
                key={c.id}
                className="transition-colors hover:bg-[var(--surface-raised)]"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <td className="px-5 py-3 font-medium" style={{ color: 'var(--text)' }}>
                  {c.name}
                </td>
                <td className="px-5 py-3" style={{ color: 'var(--text-muted)' }}>
                  {c.email}
                </td>
                <td className="px-5 py-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{
                      backgroundColor: 'var(--accent-subtle)',
                      color: 'var(--accent)',
                    }}
                  >
                    {c.stage}
                  </span>
                </td>
                <td className="px-5 py-3 tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {c.value != null ? `$${c.value.toLocaleString()}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <span className="text-sm font-semibold self-center" style={{ color: 'var(--text-muted)' }}>
          Quick Actions:
        </span>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
        >
          <Sparkles size={14} />
          Draft follow-up with Eral
        </button>
        <Link
          href="/dashboard/crm"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <Users size={14} />
          Add Contact
        </Link>
        <Link
          href="/dashboard/automations"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <Zap size={14} />
          New Automation
        </Link>
      </div>

      <EralAssistant />
    </div>
  );
}
