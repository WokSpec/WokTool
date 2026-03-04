'use client';

import { useState } from 'react';

// ─── Calculation logic ───────────────────────────────────────────────────────

interface YearRow {
  year: number;
  balance: number;
  interest: number;
  contributions: number;
  simpleBalance: number;
}

function calc(principal: number, rate: number, years: number, freq: number, monthly: number) {
  const r = rate / 100;
  const n = freq;
  const pmt = monthly * 12; // annual contributions
  const rows: YearRow[] = [];
  let balance = principal;
  let totalContrib = principal;

  for (let y = 1; y <= years; y++) {
    const prevBalance = balance;
    // Compound growth for this year
    balance = balance * Math.pow(1 + r / n, n);
    // Add contributions (assume made at start of each sub-period)
    if (pmt > 0) {
      const subPmt = pmt / n;
      const growthFactor = Math.pow(1 + r / n, n);
      balance += subPmt * ((growthFactor - 1) / (r / n));
    }
    totalContrib += pmt;
    const simpleBalance = principal * (1 + r * y) + pmt * y;
    rows.push({
      year: y,
      balance,
      interest: balance - totalContrib,
      contributions: totalContrib,
      simpleBalance,
    });
  }
  return rows;
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
}

const FREQS = [
  { label: 'Annually', value: 1 },
  { label: 'Semi-annually', value: 2 },
  { label: 'Quarterly', value: 4 },
  { label: 'Monthly', value: 12 },
  { label: 'Daily', value: 365 },
];

const S: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 900 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' },
  group: { display: 'flex', flexDirection: 'column' as const, gap: 6 },
  label: { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
  input: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem 0.875rem', color: 'var(--text)', fontSize: '0.875rem', width: '100%', boxSizing: 'border-box' as const },
  select: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem 0.875rem', color: 'var(--text)', fontSize: '0.875rem', cursor: 'pointer', width: '100%', boxSizing: 'border-box' as const },
  resultCards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' },
  card: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem' },
  cardLabel: { fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 4 },
  cardVal: { fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' },
  tableWrap: { overflowX: 'auto' as const, border: '1px solid var(--border)', borderRadius: 10 },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.83rem' },
  th: { padding: '0.6rem 0.75rem', textAlign: 'right' as const, color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' as const, borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated, #161616)', whiteSpace: 'nowrap' as const },
  thL: { textAlign: 'left' as const },
  td: { padding: '0.45rem 0.75rem', textAlign: 'right' as const, borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-secondary)' },
  tdL: { textAlign: 'left' as const },
};

export default function CompoundInterestClient() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('20');
  const [freq, setFreq] = useState(12);
  const [monthly, setMonthly] = useState('0');

  const p = Math.max(0, parseFloat(principal) || 0);
  const r = Math.max(0, parseFloat(rate) || 0);
  const y = Math.max(1, Math.min(100, parseInt(years) || 1));
  const m = Math.max(0, parseFloat(monthly) || 0);
  const rows = calc(p, r, y, freq, m);
  const final = rows[rows.length - 1];

  const maxBalance = Math.max(...rows.map(r => r.balance));

  return (
    <div style={S.root}>
      {/* Inputs */}
      <div style={S.grid}>
        {(([
          ['Principal ($)', principal, setPrincipal],
          ['Annual Rate (%)', rate, setRate],
          ['Time (years)', years, setYears],
          ['Monthly Contribution ($)', monthly, setMonthly],
        ]) as [string, string, (v: string) => void][]).map(([lbl, val, set]) => (
          <div key={lbl} style={S.group}>
            <div style={S.label}>{lbl}</div>
            <input type="number" style={S.input} value={val} onChange={e => set(e.target.value)} min={0} />
          </div>
        ))}
        <div style={S.group}>
          <div style={S.label}>Compound Frequency</div>
          <select style={S.select} value={freq} onChange={e => setFreq(Number(e.target.value))}>
            {FREQS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
      </div>

      {/* Result cards */}
      {final && (
        <div style={S.resultCards}>
          {[
            ['Final Amount', fmt(final.balance), 'var(--accent)'],
            ['Total Interest', fmt(final.interest), '#22c55e'],
            ['Total Contributed', fmt(final.contributions), 'var(--text)'],
            ['Simple Interest (compare)', fmt(final.simpleBalance), 'var(--text-muted)'],
          ].map(([lbl, val, color]) => (
            <div key={lbl as string} style={S.card}>
              <div style={S.cardLabel}>{lbl}</div>
              <div style={{ ...S.cardVal, color: color as string, fontSize: '1.2rem' }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      {/* Inline SVG bar chart */}
      {rows.length > 0 && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ ...S.label, marginBottom: 12 }}>Growth Over Time</div>
          <svg width="100%" viewBox={`0 0 ${Math.min(rows.length, 40) * 22} 120`} style={{ overflow: 'visible' }}>
            {rows.slice(0, 40).map((row, i) => {
              const barH = (row.balance / maxBalance) * 90;
              const contribH = (row.contributions / maxBalance) * 90;
              const x = i * 22 + 2;
              return (
                <g key={row.year}>
                  {/* Contributions bar */}
                  <rect x={x} y={110 - contribH} width={10} height={contribH} fill="rgba(129,140,248,0.3)" rx={1} />
                  {/* Interest bar */}
                  <rect x={x} y={110 - barH} width={10} height={barH - contribH} fill="var(--accent)" rx={1} />
                  {(row.year % 5 === 0 || row.year === 1) && (
                    <text x={x + 5} y={118} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.3)">{row.year}</text>
                  )}
                </g>
              );
            })}
          </svg>
          <div style={{ display: 'flex', gap: '1rem', marginTop: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--accent)', borderRadius: 2, marginRight: 4 }} />Interest earned</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'rgba(129,140,248,0.3)', borderRadius: 2, marginRight: 4 }} />Contributions</span>
          </div>
        </div>
      )}

      {/* Year-by-year table */}
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              {['Year', 'Balance', 'Interest Earned', 'Total Contributed', 'Simple Interest'].map((h, i) => (
                <th key={h} style={{ ...S.th, ...(i === 0 ? S.thL : {}) }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.year}>
                <td style={{ ...S.td, ...S.tdL, color: 'var(--text)', fontWeight: 600 }}>{row.year}</td>
                <td style={{ ...S.td, color: 'var(--accent)', fontWeight: 700 }}>{fmt(row.balance)}</td>
                <td style={{ ...S.td, color: '#22c55e' }}>{fmt(row.interest)}</td>
                <td style={S.td}>{fmt(row.contributions)}</td>
                <td style={{ ...S.td, color: 'var(--text-faint, rgba(255,255,255,0.18))' }}>{fmt(row.simpleBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
