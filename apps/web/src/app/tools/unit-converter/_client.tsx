'use client';
import { useState, useCallback } from 'react';

// === CONVERSION DATA ===
type Category = 'Length' | 'Weight' | 'Temperature' | 'Speed' | 'Area' | 'Volume' | 'Time' | 'Data Storage' | 'Pressure' | 'Energy';

interface UnitDef {
  key: string;
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

// All conversions are to/from base unit (SI)
const CATEGORIES: Record<Category, UnitDef[]> = {
  Length: [
    { key: 'mm',  label: 'Millimeter (mm)',   toBase: v => v / 1000,     fromBase: v => v * 1000 },
    { key: 'cm',  label: 'Centimeter (cm)',   toBase: v => v / 100,      fromBase: v => v * 100 },
    { key: 'm',   label: 'Meter (m)',          toBase: v => v,            fromBase: v => v },
    { key: 'km',  label: 'Kilometer (km)',     toBase: v => v * 1000,     fromBase: v => v / 1000 },
    { key: 'in',  label: 'Inch (in)',          toBase: v => v * 0.0254,   fromBase: v => v / 0.0254 },
    { key: 'ft',  label: 'Foot (ft)',          toBase: v => v * 0.3048,   fromBase: v => v / 0.3048 },
    { key: 'yd',  label: 'Yard (yd)',          toBase: v => v * 0.9144,   fromBase: v => v / 0.9144 },
    { key: 'mi',  label: 'Mile (mi)',          toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    { key: 'nmi', label: 'Nautical Mile (nmi)',toBase: v => v * 1852,     fromBase: v => v / 1852 },
  ],
  Weight: [
    { key: 'mg',  label: 'Milligram (mg)',   toBase: v => v / 1e6,      fromBase: v => v * 1e6 },
    { key: 'g',   label: 'Gram (g)',          toBase: v => v / 1000,     fromBase: v => v * 1000 },
    { key: 'kg',  label: 'Kilogram (kg)',     toBase: v => v,            fromBase: v => v },
    { key: 't',   label: 'Metric Ton (t)',    toBase: v => v * 1000,     fromBase: v => v / 1000 },
    { key: 'oz',  label: 'Ounce (oz)',        toBase: v => v * 0.0283495,fromBase: v => v / 0.0283495 },
    { key: 'lb',  label: 'Pound (lb)',        toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    { key: 'st',  label: 'Stone (st)',        toBase: v => v * 6.35029,  fromBase: v => v / 6.35029 },
  ],
  Temperature: [
    { key: 'C',  label: 'Celsius (°C)',     toBase: v => v,               fromBase: v => v },
    { key: 'F',  label: 'Fahrenheit (°F)', toBase: v => (v - 32) * 5/9,  fromBase: v => v * 9/5 + 32 },
    { key: 'K',  label: 'Kelvin (K)',       toBase: v => v - 273.15,      fromBase: v => v + 273.15 },
    { key: 'R',  label: 'Rankine (°R)',     toBase: v => (v - 491.67) * 5/9, fromBase: v => (v + 273.15) * 9/5 },
  ],
  Speed: [
    { key: 'ms',  label: 'm/s',          toBase: v => v,          fromBase: v => v },
    { key: 'kmh', label: 'km/h',         toBase: v => v / 3.6,    fromBase: v => v * 3.6 },
    { key: 'mph', label: 'mph',          toBase: v => v * 0.44704,fromBase: v => v / 0.44704 },
    { key: 'kn',  label: 'Knot (kn)',    toBase: v => v * 0.514444,fromBase: v => v / 0.514444 },
    { key: 'mach',label: 'Mach',         toBase: v => v * 340.29, fromBase: v => v / 340.29 },
  ],
  Area: [
    { key: 'mm2', label: 'mm²',          toBase: v => v / 1e6,     fromBase: v => v * 1e6 },
    { key: 'cm2', label: 'cm²',          toBase: v => v / 1e4,     fromBase: v => v * 1e4 },
    { key: 'm2',  label: 'm²',           toBase: v => v,           fromBase: v => v },
    { key: 'km2', label: 'km²',          toBase: v => v * 1e6,     fromBase: v => v / 1e6 },
    { key: 'ha',  label: 'Hectare (ha)', toBase: v => v * 1e4,     fromBase: v => v / 1e4 },
    { key: 'ac',  label: 'Acre',         toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
    { key: 'ft2', label: 'ft²',          toBase: v => v * 0.092903,fromBase: v => v / 0.092903 },
    { key: 'in2', label: 'in²',          toBase: v => v * 6.4516e-4,fromBase: v => v / 6.4516e-4 },
    { key: 'mi2', label: 'mi²',          toBase: v => v * 2589988, fromBase: v => v / 2589988 },
  ],
  Volume: [
    { key: 'ml',  label: 'Milliliter (ml)',  toBase: v => v / 1000,     fromBase: v => v * 1000 },
    { key: 'l',   label: 'Liter (l)',        toBase: v => v,            fromBase: v => v },
    { key: 'm3',  label: 'm³',              toBase: v => v * 1000,     fromBase: v => v / 1000 },
    { key: 'cm3', label: 'cm³',             toBase: v => v / 1000,     fromBase: v => v * 1000 },
    { key: 'tsp', label: 'Teaspoon (tsp)',   toBase: v => v * 0.00492892,fromBase: v => v / 0.00492892 },
    { key: 'tbsp',label: 'Tablespoon (tbsp)',toBase: v => v * 0.0147868, fromBase: v => v / 0.0147868 },
    { key: 'floz',label: 'fl oz (US)',       toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
    { key: 'cup', label: 'Cup (US)',         toBase: v => v * 0.236588,  fromBase: v => v / 0.236588 },
    { key: 'pt',  label: 'Pint (US)',        toBase: v => v * 0.473176,  fromBase: v => v / 0.473176 },
    { key: 'qt',  label: 'Quart (US)',       toBase: v => v * 0.946353,  fromBase: v => v / 0.946353 },
    { key: 'gal', label: 'Gallon (US)',      toBase: v => v * 3.78541,   fromBase: v => v / 3.78541 },
    { key: 'imp_gal', label: 'Gallon (UK)', toBase: v => v * 4.54609,   fromBase: v => v / 4.54609 },
  ],
  Time: [
    { key: 'ns',  label: 'Nanosecond (ns)',  toBase: v => v / 1e9,       fromBase: v => v * 1e9 },
    { key: 'us',  label: 'Microsecond (µs)', toBase: v => v / 1e6,       fromBase: v => v * 1e6 },
    { key: 'ms',  label: 'Millisecond (ms)', toBase: v => v / 1000,      fromBase: v => v * 1000 },
    { key: 's',   label: 'Second (s)',        toBase: v => v,             fromBase: v => v },
    { key: 'min', label: 'Minute (min)',      toBase: v => v * 60,        fromBase: v => v / 60 },
    { key: 'h',   label: 'Hour (h)',          toBase: v => v * 3600,      fromBase: v => v / 3600 },
    { key: 'd',   label: 'Day',              toBase: v => v * 86400,     fromBase: v => v / 86400 },
    { key: 'wk',  label: 'Week',             toBase: v => v * 604800,    fromBase: v => v / 604800 },
    { key: 'mo',  label: 'Month (avg)',       toBase: v => v * 2629800,   fromBase: v => v / 2629800 },
    { key: 'yr',  label: 'Year (avg)',        toBase: v => v * 31557600,  fromBase: v => v / 31557600 },
  ],
  'Data Storage': [
    { key: 'bit', label: 'Bit',         toBase: v => v / 8,        fromBase: v => v * 8 },
    { key: 'B',   label: 'Byte (B)',    toBase: v => v,            fromBase: v => v },
    { key: 'KB',  label: 'Kilobyte',    toBase: v => v * 1024,     fromBase: v => v / 1024 },
    { key: 'MB',  label: 'Megabyte',    toBase: v => v * 1048576,  fromBase: v => v / 1048576 },
    { key: 'GB',  label: 'Gigabyte',    toBase: v => v * 1073741824, fromBase: v => v / 1073741824 },
    { key: 'TB',  label: 'Terabyte',    toBase: v => v * 1099511627776, fromBase: v => v / 1099511627776 },
    { key: 'PB',  label: 'Petabyte',    toBase: v => v * 1.1259e15, fromBase: v => v / 1.1259e15 },
    { key: 'kbit',label: 'Kilobit',     toBase: v => v * 125,      fromBase: v => v / 125 },
    { key: 'Mbit',label: 'Megabit',     toBase: v => v * 125000,   fromBase: v => v / 125000 },
    { key: 'Gbit',label: 'Gigabit',     toBase: v => v * 125000000,fromBase: v => v / 125000000 },
  ],
  Pressure: [
    { key: 'pa',   label: 'Pascal (Pa)',   toBase: v => v,            fromBase: v => v },
    { key: 'kpa',  label: 'kPa',           toBase: v => v * 1000,     fromBase: v => v / 1000 },
    { key: 'mpa',  label: 'MPa',           toBase: v => v * 1e6,      fromBase: v => v / 1e6 },
    { key: 'bar',  label: 'Bar',           toBase: v => v * 100000,   fromBase: v => v / 100000 },
    { key: 'mbar', label: 'Millibar',      toBase: v => v * 100,      fromBase: v => v / 100 },
    { key: 'atm',  label: 'Atmosphere',    toBase: v => v * 101325,   fromBase: v => v / 101325 },
    { key: 'psi',  label: 'PSI',           toBase: v => v * 6894.76,  fromBase: v => v / 6894.76 },
    { key: 'torr', label: 'Torr (mmHg)',   toBase: v => v * 133.322,  fromBase: v => v / 133.322 },
    { key: 'inhg', label: 'inHg',          toBase: v => v * 3386.39,  fromBase: v => v / 3386.39 },
  ],
  Energy: [
    { key: 'j',    label: 'Joule (J)',        toBase: v => v,            fromBase: v => v },
    { key: 'kj',   label: 'Kilojoule (kJ)',   toBase: v => v * 1000,     fromBase: v => v / 1000 },
    { key: 'mj',   label: 'Megajoule (MJ)',   toBase: v => v * 1e6,      fromBase: v => v / 1e6 },
    { key: 'cal',  label: 'Calorie (cal)',     toBase: v => v * 4.184,    fromBase: v => v / 4.184 },
    { key: 'kcal', label: 'Kilocalorie (kcal)',toBase: v => v * 4184,     fromBase: v => v / 4184 },
    { key: 'wh',   label: 'Watt-hour (Wh)',   toBase: v => v * 3600,     fromBase: v => v / 3600 },
    { key: 'kwh',  label: 'kWh',              toBase: v => v * 3600000,  fromBase: v => v / 3600000 },
    { key: 'eV',   label: 'Electronvolt (eV)',toBase: v => v * 1.602e-19,fromBase: v => v / 1.602e-19 },
    { key: 'btu',  label: 'BTU',              toBase: v => v * 1055.06,  fromBase: v => v / 1055.06 },
    { key: 'ftlb', label: 'Foot-pound',       toBase: v => v * 1.35582,  fromBase: v => v / 1.35582 },
  ],
};

const CATEGORY_KEYS = Object.keys(CATEGORIES) as Category[];

function formatNum(n: number): string {
  if (!isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (abs === 0) return '0';
  if (abs >= 1e15 || (abs < 1e-10 && abs > 0)) return n.toExponential(6);
  if (abs >= 1000) return n.toPrecision(10).replace(/\.?0+$/, '');
  return parseFloat(n.toPrecision(10)).toString();
}

export default function UnitConverterClient() {
  const [category, setCategory] = useState<Category>('Length');
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState(CATEGORIES['Length'][2].key); // meter

  const units = CATEGORIES[category];
  const fromDef = units.find(u => u.key === fromUnit) ?? units[0];
  const numVal = parseFloat(value);
  const baseVal = isNaN(numVal) ? NaN : fromDef.toBase(numVal);

  function handleCategoryChange(cat: Category) {
    setCategory(cat);
    setFromUnit(CATEGORIES[cat][0].key);
    setValue('1');
  }

  function handleRowClick(unit: UnitDef) {
    const result = isNaN(baseVal) ? NaN : unit.fromBase(baseVal);
    if (!isNaN(result)) {
      setValue(formatNum(result));
      setFromUnit(unit.key);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Category tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {CATEGORY_KEYS.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={category === cat ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            borderRadius: 8,
            padding: '0.5rem 0.75rem',
            fontSize: '1.1rem',
            width: 180,
            outline: 'none',
          }}
          placeholder="Enter value"
        />
        <select
          value={fromUnit}
          onChange={e => setFromUnit(e.target.value)}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            borderRadius: 8,
            padding: '0.5rem 0.75rem',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        >
          {units.map(u => (
            <option key={u.key} value={u.key}>{u.label}</option>
          ))}
        </select>
      </div>

      {/* Results table */}
      <div style={{ background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface)' }}>
              <th style={{ padding: '0.6rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Unit</th>
              <th style={{ padding: '0.6rem 1rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u, i) => {
              const result = isNaN(baseVal) ? NaN : u.fromBase(baseVal);
              const isActive = u.key === fromUnit;
              return (
                <tr
                  key={u.key}
                  onClick={() => handleRowClick(u)}
                  style={{
                    borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                    background: isActive ? 'var(--accent-subtle)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                >
                  <td style={{ padding: '0.55rem 1rem', color: isActive ? 'var(--accent)' : 'var(--text)', fontSize: '0.9rem' }}>
                    {u.label}
                  </td>
                  <td style={{ padding: '0.55rem 1rem', textAlign: 'right', color: isActive ? 'var(--accent)' : 'var(--text)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    {formatNum(result)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>💡 Click any row to use that unit as the input</p>
    </div>
  );
}
