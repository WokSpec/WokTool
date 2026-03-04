'use client';
import { useState, useEffect } from 'react';

type Tab = 'age' | 'diff' | 'addsub' | 'week';

// Helper: days in month
function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// ISO week number
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

// Age calculation
function calcAge(birthDate: Date, now: Date) {
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();
  if (days < 0) { months--; days += daysInMonth(now.getFullYear(), now.getMonth() - 1); }
  if (months < 0) { years--; months += 12; }
  const totalDays = Math.floor((now.getTime() - birthDate.getTime()) / 86400000);
  const totalHours = Math.floor((now.getTime() - birthDate.getTime()) / 3600000);
  return { years, months, days, totalDays, totalHours };
}

// Date diff
function dateDiff(d1: Date, d2: Date) {
  const [from, to] = d1 <= d2 ? [d1, d2] : [d2, d1];
  const sign = d1 <= d2 ? 1 : -1;
  const totalMs = to.getTime() - from.getTime();
  const totalSecs = Math.floor(totalMs / 1000);
  const totalMins = Math.floor(totalSecs / 60);
  const totalHours = Math.floor(totalMins / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) { months--; days += daysInMonth(to.getFullYear(), to.getMonth() - 1); }
  if (months < 0) { years--; months += 12; }
  return { sign, years, months, days, totalDays, totalWeeks, totalHours, totalMins, totalSecs };
}

// Add/subtract date
function addToDate(date: Date, amount: number, unit: string, op: 'add' | 'sub'): Date {
  const n = op === 'add' ? amount : -amount;
  const d = new Date(date);
  if (unit === 'days') d.setDate(d.getDate() + n);
  else if (unit === 'weeks') d.setDate(d.getDate() + n * 7);
  else if (unit === 'months') d.setMonth(d.getMonth() + n);
  else if (unit === 'years') d.setFullYear(d.getFullYear() + n);
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

const today = new Date().toISOString().split('T')[0];

const TABS: { key: Tab; label: string }[] = [
  { key: 'age', label: '🎂 Age' },
  { key: 'diff', label: '📐 Difference' },
  { key: 'addsub', label: '➕ Add/Subtract' },
  { key: 'week', label: '📆 Week Number' },
];

export default function DateCalculatorClient() {
  const [tab, setTab] = useState<Tab>('age');

  // Tab 1
  const [birthdate, setBirthdate] = useState('1990-01-01');
  // Tab 2
  const [date1, setDate1] = useState(today);
  const [date2, setDate2] = useState(today);
  // Tab 3
  const [baseDate, setBaseDate] = useState(today);
  const [addAmount, setAddAmount] = useState('7');
  const [addUnit, setAddUnit] = useState('days');
  const [addOp, setAddOp] = useState<'add'|'sub'>('add');
  // Tab 4
  const [weekDate, setWeekDate] = useState(today);

  const s: React.CSSProperties = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    borderRadius: 8,
    padding: '0.5rem 0.75rem',
    fontSize: '0.9rem',
    outline: 'none',
  };

  // Age tab
  const ageResult = (() => {
    try {
      const birth = new Date(birthdate);
      if (isNaN(birth.getTime())) return null;
      const now = new Date();
      const age = calcAge(birth, now);
      const nextBD = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
      if (nextBD <= now) nextBD.setFullYear(now.getFullYear() + 1);
      const daysUntilBD = Math.ceil((nextBD.getTime() - now.getTime()) / 86400000);
      return { ...age, daysUntilBD, nextBD };
    } catch { return null; }
  })();

  // Diff tab
  const diffResult = (() => {
    try {
      const d1 = new Date(date1), d2 = new Date(date2);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
      return dateDiff(d1, d2);
    } catch { return null; }
  })();

  // AddSub tab
  const addSubResult = (() => {
    try {
      const d = new Date(baseDate);
      if (isNaN(d.getTime()) || !addAmount) return null;
      return addToDate(d, parseInt(addAmount), addUnit, addOp);
    } catch { return null; }
  })();

  // Week tab
  const weekResult = (() => {
    try {
      const d = new Date(weekDate);
      if (isNaN(d.getTime())) return null;
      const doy = getDayOfYear(d);
      const leap = isLeapYear(d.getFullYear());
      const totalDays = leap ? 366 : 365;
      return {
        week: getISOWeek(d),
        doy,
        leap,
        daysLeft: totalDays - doy,
        year: d.getFullYear(),
      };
    } catch { return null; }
  })();

  const card = (children: React.ReactNode) => (
    <div style={{ background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {children}
    </div>
  );

  const stat = (label: string, value: string | number) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</span>
      <span style={{ color: 'var(--text)', fontWeight: 600, fontFamily: 'monospace' }}>{value}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={tab === t.key ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Age */}
      {tab === 'age' && card(<>
        <div>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'block', marginBottom: 4 }}>Date of Birth</label>
          <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} style={s} />
        </div>
        {ageResult && <>
          <div style={{ fontWeight: 700, fontSize: '1.6rem', color: 'var(--accent)', textAlign: 'center' }}>
            {ageResult.years} years, {ageResult.months} months, {ageResult.days} days
          </div>
          {stat('Total Days Lived', ageResult.totalDays.toLocaleString())}
          {stat('Total Hours Lived', ageResult.totalHours.toLocaleString())}
          {stat('Next Birthday', formatDate(ageResult.nextBD))}
          {stat('Days Until Birthday', ageResult.daysUntilBD === 0 ? '🎉 Today!' : `${ageResult.daysUntilBD} days`)}
        </>}
        {!ageResult && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Enter a valid birth date.</p>}
      </>)}

      {/* Tab 2: Difference */}
      {tab === 'diff' && card(<>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'block', marginBottom: 4 }}>Start Date</label>
            <input type="date" value={date1} onChange={e => setDate1(e.target.value)} style={s} />
          </div>
          <div>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'block', marginBottom: 4 }}>End Date</label>
            <input type="date" value={date2} onChange={e => setDate2(e.target.value)} style={s} />
          </div>
        </div>
        {diffResult && <>
          <div style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--accent)', textAlign: 'center' }}>
            {diffResult.sign < 0 ? '−' : ''}{diffResult.years}y {diffResult.months}m {diffResult.days}d
          </div>
          {stat('Total Days', Math.abs(diffResult.totalDays).toLocaleString())}
          {stat('Total Weeks', Math.abs(diffResult.totalWeeks).toLocaleString())}
          {stat('Total Hours', Math.abs(diffResult.totalHours).toLocaleString())}
          {stat('Total Minutes', Math.abs(diffResult.totalMins).toLocaleString())}
          {stat('Total Seconds', Math.abs(diffResult.totalSecs).toLocaleString())}
        </>}
      </>)}

      {/* Tab 3: Add/Subtract */}
      {tab === 'addsub' && card(<>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'block', marginBottom: 4 }}>Base Date</label>
            <input type="date" value={baseDate} onChange={e => setBaseDate(e.target.value)} style={s} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setAddOp('add')} className={addOp === 'add' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.5rem 1rem' }}>+ Add</button>
            <button onClick={() => setAddOp('sub')} className={addOp === 'sub' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.5rem 1rem' }}>− Subtract</button>
          </div>
          <div>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'block', marginBottom: 4 }}>Amount</label>
            <input type="number" min={1} value={addAmount} onChange={e => setAddAmount(e.target.value)} style={{ ...s, width: 80 }} />
          </div>
          <div>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'block', marginBottom: 4 }}>Unit</label>
            <select value={addUnit} onChange={e => setAddUnit(e.target.value)} style={s}>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
        </div>
        {addSubResult && (
          <div style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent)', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 4 }}>Result</div>
            <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.2rem' }}>{formatDate(addSubResult)}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4 }}>
              {addSubResult.toISOString().split('T')[0]}
            </div>
          </div>
        )}
      </>)}

      {/* Tab 4: Week Number */}
      {tab === 'week' && card(<>
        <div>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'block', marginBottom: 4 }}>Date</label>
          <input type="date" value={weekDate} onChange={e => setWeekDate(e.target.value)} style={s} />
        </div>
        {weekResult && <>
          <div style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--accent)', textAlign: 'center' }}>
            Week {weekResult.week}
          </div>
          {stat('ISO Week Number', weekResult.week)}
          {stat('Day of Year', `${weekResult.doy} / ${weekResult.leap ? 366 : 365}`)}
          {stat('Days Until Year End', weekResult.daysLeft)}
          {stat('Leap Year', weekResult.leap ? '✅ Yes' : '❌ No')}
        </>}
      </>)}
    </div>
  );
}
