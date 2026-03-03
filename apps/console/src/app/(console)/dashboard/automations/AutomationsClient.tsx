'use client';

import { useState } from 'react';
import type { GHLAutomation } from '@/lib/ghl';
import { Zap, Pause, Play } from 'lucide-react';

interface AutomationCardProps {
  automation: GHLAutomation;
}

function AutomationCard({ automation: init }: AutomationCardProps) {
  const [automation, setAutomation] = useState(init);
  const [toggling, setToggling] = useState(false);

  async function toggle() {
    setToggling(true);
    try {
      await fetch('/api/ghl/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: automation.id, action: automation.status === 'active' ? 'pause' : 'activate' }),
      });
      setAutomation((a) => ({ ...a, status: a.status === 'active' ? 'paused' : 'active' }));
    } finally {
      setToggling(false);
    }
  }

  const isActive = automation.status === 'active';

  return (
    <div
      className="rounded-xl p-5 flex items-start justify-between gap-4"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 mt-0.5"
          style={{
            backgroundColor: isActive ? 'var(--accent-subtle)' : 'var(--surface-raised)',
            color: isActive ? 'var(--accent)' : 'var(--text-muted)',
          }}
        >
          <Zap size={16} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {automation.name}
          </span>
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-subtle)' }}>
            <span>{automation.triggers} triggers</span>
            {automation.lastTriggered && (
              <span>Last: {new Date(automation.lastTriggered).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: isActive ? 'rgba(34,197,94,0.12)' : 'rgba(161,161,170,0.12)',
            color: isActive ? 'var(--success)' : 'var(--text-muted)',
          }}
        >
          {isActive ? 'Active' : 'Paused'}
        </span>
        <button
          onClick={toggle}
          disabled={toggling}
          className="flex items-center justify-center w-8 h-8 rounded-lg disabled:opacity-50 transition-colors"
          style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-muted)' }}
          aria-label={isActive ? 'Pause automation' : 'Activate automation'}
        >
          {isActive ? <Pause size={14} /> : <Play size={14} />}
        </button>
      </div>
    </div>
  );
}

export default function AutomationsClient({ automations }: { automations: GHLAutomation[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
          {automations.length} automation{automations.length !== 1 ? 's' : ''}
        </h2>
        <button
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        >
          + New Automation
        </button>
      </div>
      {automations.map((a) => (
        <AutomationCard key={a.id} automation={a} />
      ))}
    </div>
  );
}
