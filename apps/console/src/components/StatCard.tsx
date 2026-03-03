import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: ReactNode;
  accent?: boolean;
}

export default function StatCard({ label, value, change, icon, accent }: StatCardProps) {
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        backgroundColor: accent ? 'var(--accent-subtle)' : 'var(--surface)',
        border: `1px solid ${accent ? 'var(--accent)' : 'var(--border)'}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{
            backgroundColor: accent ? 'rgba(124,58,237,0.2)' : 'var(--surface-raised)',
            color: accent ? 'var(--accent)' : 'var(--text-muted)',
          }}
        >
          {icon}
        </span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text)' }}>
          {value}
        </span>
        {change && (
          <span
            className="text-xs font-medium mb-0.5"
            style={{
              color: isPositive
                ? 'var(--success)'
                : isNegative
                ? 'var(--error)'
                : 'var(--text-muted)',
            }}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
