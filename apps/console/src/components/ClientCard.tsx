import type { Client } from '@/lib/types';
import { ExternalLink, MoreHorizontal } from 'lucide-react';

const STATUS_STYLES: Record<Client['status'], { bg: string; color: string; label: string }> = {
  active: { bg: 'rgba(34,197,94,0.12)', color: 'var(--success)', label: 'Active' },
  onboarding: { bg: 'rgba(245,158,11,0.12)', color: 'var(--warning)', label: 'Onboarding' },
  paused: { bg: 'rgba(161,161,170,0.12)', color: 'var(--text-muted)', label: 'Paused' },
};

interface ClientCardProps {
  client: Client;
}

export default function ClientCard({ client }: ClientCardProps) {
  const style = STATUS_STYLES[client.status];

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
            {client.name}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {client.email}
          </span>
        </div>
        <span
          className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: style.bg, color: style.color }}
        >
          {style.label}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-subtle)' }}>
        <span>{client.stats.contacts} contacts</span>
        <span>{client.stats.openDeals} deals</span>
        <span>{client.stats.automations} automations</span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={`/admin/clients/${client.id}`}
          className="flex-1 text-center text-xs font-medium py-1.5 rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-muted)' }}
        >
          Manage
        </a>
        <button
          className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-muted)' }}
          aria-label="More options"
        >
          <MoreHorizontal size={14} />
        </button>
        {client.ghlLocationId && (
          <a
            href={`https://app.gohighlevel.com/location/${client.ghlLocationId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-muted)' }}
            aria-label="Open in GHL"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
