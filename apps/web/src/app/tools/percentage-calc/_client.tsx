'use client';
import { useState } from 'react';

function CardBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <h3 style={{ color: 'var(--text)', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>{title}</h3>
      {children}
    </div>
  );
}

const inpStyle: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  borderRadius: 8,
  padding: '0.45rem 0.75rem',
  fontSize: '0.9rem',
  width: '100%',
  outline: 'none',
};

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>{children}</div>;
}

function ResultBox({ value }: { value: string }) {
  return (
    <div style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent)', borderRadius: 8, padding: '0.6rem 1rem', color: 'var(--accent)', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'monospace' }}>
      {value}
    </div>
  );
}

function Inp({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? '0'} style={{ ...inpStyle, width: 100 }} />;
}

function fmt(n: number, decimals = 4): string {
  if (!isFinite(n)) return '—';
  return parseFloat(n.toFixed(decimals)).toString();
}

export default function PercentageCalcClient() {
  // Card 1: What is X% of Y?
  const [c1x, setC1x] = useState('');
  const [c1y, setC1y] = useState('');
  const c1result = (() => {
    const x = parseFloat(c1x), y = parseFloat(c1y);
    if (isNaN(x) || isNaN(y)) return null;
    return fmt(x / 100 * y);
  })();

  // Card 2: X is what % of Y?
  const [c2x, setC2x] = useState('');
  const [c2y, setC2y] = useState('');
  const c2result = (() => {
    const x = parseFloat(c2x), y = parseFloat(c2y);
    if (isNaN(x) || isNaN(y) || y === 0) return null;
    return fmt(x / y * 100) + '%';
  })();

  // Card 3: % change from X to Y
  const [c3x, setC3x] = useState('');
  const [c3y, setC3y] = useState('');
  const c3result = (() => {
    const x = parseFloat(c3x), y = parseFloat(c3y);
    if (isNaN(x) || isNaN(y) || x === 0) return null;
    const pct = (y - x) / Math.abs(x) * 100;
    const sign = pct >= 0 ? '▲ +' : '▼ ';
    return `${sign}${fmt(pct)}%`;
  })();
  const c3color = (() => {
    const x = parseFloat(c3x), y = parseFloat(c3y);
    if (isNaN(x) || isNaN(y)) return 'var(--accent)';
    return y >= x ? 'var(--success)' : 'var(--danger)';
  })();

  // Card 4: X plus/minus Y%
  const [c4x, setC4x] = useState('');
  const [c4y, setC4y] = useState('');
  const [c4op, setC4op] = useState<'plus'|'minus'>('plus');
  const c4result = (() => {
    const x = parseFloat(c4x), y = parseFloat(c4y);
    if (isNaN(x) || isNaN(y)) return null;
    const delta = x * y / 100;
    const res = c4op === 'plus' ? x + delta : x - delta;
    return fmt(res);
  })();

  // Card 5: Tip calculator
  const [bill, setBill] = useState('');
  const [tipPct, setTipPct] = useState('18');
  const [people, setPeople] = useState('1');
  const tipResult = (() => {
    const b = parseFloat(bill), t = parseFloat(tipPct), p = parseInt(people);
    if (isNaN(b) || isNaN(t) || isNaN(p) || p < 1) return null;
    const tip = b * t / 100;
    const total = b + tip;
    const perPerson = total / p;
    return { tip: fmt(tip, 2), total: fmt(total, 2), perPerson: fmt(perPerson, 2) };
  })();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
      <CardBox title="What is X% of Y?">
        <Row>
          <Inp value={c1x} onChange={setC1x} placeholder="X %" />
          <span style={{ color: 'var(--text-muted)' }}>% of</span>
          <Inp value={c1y} onChange={setC1y} placeholder="Y" />
          <span style={{ color: 'var(--text-muted)' }}>= ?</span>
        </Row>
        {c1result && <ResultBox value={c1result} />}
      </CardBox>

      <CardBox title="X is what % of Y?">
        <Row>
          <Inp value={c2x} onChange={setC2x} placeholder="X" />
          <span style={{ color: 'var(--text-muted)' }}>is what % of</span>
          <Inp value={c2y} onChange={setC2y} placeholder="Y" />
        </Row>
        {c2result && <ResultBox value={c2result} />}
      </CardBox>

      <CardBox title="Percentage Change">
        <Row>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>From</span>
          <Inp value={c3x} onChange={setC3x} placeholder="from" />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>to</span>
          <Inp value={c3y} onChange={setC3y} placeholder="to" />
        </Row>
        {c3result && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${c3color}`, borderRadius: 8, padding: '0.6rem 1rem', color: c3color, fontWeight: 700, fontSize: '1.1rem', fontFamily: 'monospace' }}>
            {c3result}
          </div>
        )}
      </CardBox>

      <CardBox title="X ± Y%">
        <Row>
          <Inp value={c4x} onChange={setC4x} placeholder="X" />
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button onClick={() => setC4op('plus')} className={c4op === 'plus' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.35rem 0.65rem', fontSize: '1rem' }}>+</button>
            <button onClick={() => setC4op('minus')} className={c4op === 'minus' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.35rem 0.65rem', fontSize: '1rem' }}>−</button>
          </div>
          <Inp value={c4y} onChange={setC4y} placeholder="Y %" />
          <span style={{ color: 'var(--text-muted)' }}>%</span>
        </Row>
        {c4result && <ResultBox value={c4result} />}
      </CardBox>

      <CardBox title="🍽️ Tip Calculator">
        <div>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: 3 }}>Bill Amount ($)</label>
          <input type="number" value={bill} onChange={e => setBill(e.target.value)} placeholder="0.00" style={inpStyle} />
        </div>
        <div>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: 3 }}>Tip %</label>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
            {['10','15','18','20','25'].map(t => (
              <button key={t} onClick={() => setTipPct(t)} className={tipPct === t ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}>{t}%</button>
            ))}
          </div>
          <input type="number" value={tipPct} onChange={e => setTipPct(e.target.value)} placeholder="18" style={{ ...inpStyle, width: 80 }} />
        </div>
        <div>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: 3 }}>Number of People</label>
          <input type="number" min={1} value={people} onChange={e => setPeople(e.target.value)} placeholder="1" style={{ ...inpStyle, width: 80 }} />
        </div>
        {tipResult && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            {[['Tip', `$${tipResult.tip}`], ['Total', `$${tipResult.total}`], ['Per Person', `$${tipResult.perPerson}`]].map(([l, v]) => (
              <div key={l} style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent)', borderRadius: 8, padding: '0.5rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{l}</div>
                <div style={{ color: 'var(--accent)', fontWeight: 700 }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </CardBox>
    </div>
  );
}
