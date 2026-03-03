'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const BUSINESS_TYPES = [
  'E-commerce',
  'Legal Services',
  'Medical / Health',
  'Real Estate',
  'SaaS / Tech',
  'Creative Agency',
  'Consulting',
  'Other',
];

const PLANS = ['Starter', 'Growth', 'Pro', 'Enterprise'];

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    businessType: '',
    plan: '',
    provisionGHL: false,
  });

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/admin');
      }
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    backgroundColor: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
  } as const;

  const labelStyle = {
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    fontWeight: 500,
  } as const;

  return (
    <div className="max-w-lg">
      <div
        className="rounded-xl p-6 flex flex-col gap-5"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <h2 className="font-semibold" style={{ color: 'var(--text)' }}>
          New Client
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span style={labelStyle}>Business Name *</span>
            <input
              required
              style={inputStyle}
              placeholder="Acme Corp"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span style={labelStyle}>Contact Email *</span>
            <input
              required
              type="email"
              style={inputStyle}
              placeholder="owner@business.com"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span style={labelStyle}>Business Type *</span>
            <select
              required
              style={inputStyle}
              value={form.businessType}
              onChange={(e) => update('businessType', e.target.value)}
            >
              <option value="">Select type…</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span style={labelStyle}>Plan *</span>
            <select
              required
              style={inputStyle}
              value={form.plan}
              onChange={(e) => update('plan', e.target.value)}
            >
              <option value="">Select plan…</option>
              {PLANS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          {/* Provision with GHL */}
          <div className="flex items-start gap-3">
            <div className="relative group mt-0.5">
              <input
                type="checkbox"
                id="provisionGHL"
                disabled
                checked={form.provisionGHL}
                onChange={(e) => update('provisionGHL', e.target.checked)}
                className="w-4 h-4 rounded cursor-not-allowed opacity-40"
              />
              {/* Tooltip */}
              <div
                className="absolute bottom-full left-0 mb-1 hidden group-hover:block text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none z-10"
                style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              >
                Connect GHL account first
              </div>
            </div>
            <label
              htmlFor="provisionGHL"
              className="text-sm cursor-not-allowed opacity-50"
              style={{ color: 'var(--text-muted)' }}
            >
              Provision with GHL
              <span className="block text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>
                Automatically create a GHL sub-account
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60 transition-colors"
              style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Create Client
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-muted)' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
