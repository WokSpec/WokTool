'use client';

import { useState, useCallback, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Tabs from '@/components/ui/Tabs';

type Category = 'Length' | 'Weight' | 'Temperature' | 'Speed' | 'Area' | 'Volume' | 'Time' | 'Data Storage' | 'Pressure' | 'Energy';

interface UnitDef {
  key: string;
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

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
  ],
  Weight: [
    { key: 'g',   label: 'Gram (g)',          toBase: v => v / 1000,     fromBase: v => v * 1000 },
    { key: 'kg',  label: 'Kilogram (kg)',     toBase: v => v,            fromBase: v => v },
    { key: 't',   label: 'Metric Ton (t)',    toBase: v => v * 1000,     fromBase: v => v / 1000 },
    { key: 'oz',  label: 'Ounce (oz)',        toBase: v => v * 0.0283495,fromBase: v => v / 0.0283495 },
    { key: 'lb',  label: 'Pound (lb)',        toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
  ],
  Temperature: [
    { key: 'C',  label: 'Celsius (°C)',     toBase: v => v,               fromBase: v => v },
    { key: 'F',  label: 'Fahrenheit (°F)', toBase: v => (v - 32) * 5/9,  fromBase: v => v * 9/5 + 32 },
    { key: 'K',  label: 'Kelvin (K)',       toBase: v => v - 273.15,      fromBase: v => v + 273.15 },
  ],
  Speed: [
    { key: 'ms',  label: 'm/s',          toBase: v => v,          fromBase: v => v },
    { key: 'kmh', label: 'km/h',         toBase: v => v / 3.6,    fromBase: v => v * 3.6 },
    { key: 'mph', label: 'mph',          toBase: v => v * 0.44704,fromBase: v => v / 0.44704 },
    { key: 'kn',  label: 'Knot (kn)',    toBase: v => v * 0.514444,fromBase: v => v / 0.514444 },
  ],
  Area: [
    { key: 'm2',  label: 'm²',           toBase: v => v,           fromBase: v => v },
    { key: 'km2', label: 'km²',          toBase: v => v * 1e6,     fromBase: v => v / 1e6 },
    { key: 'ha',  label: 'Hectare (ha)', toBase: v => v * 1e4,     fromBase: v => v / 1e4 },
    { key: 'ac',  label: 'Acre',         toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
    { key: 'ft2', label: 'ft²',          toBase: v => v * 0.092903,fromBase: v => v / 0.092903 },
  ],
  Volume: [
    { key: 'ml',  label: 'Milliliter (ml)',  toBase: v => v / 1000,     fromBase: v => v * 1000 },
    { key: 'l',   label: 'Liter (l)',        toBase: v => v,            fromBase: v => v },
    { key: 'm3',  label: 'm³',              toBase: v => v * 1000,     fromBase: v => v / 1000 },
    { key: 'gal', label: 'Gallon (US)',      toBase: v => v * 3.78541,   fromBase: v => v / 3.78541 },
  ],
  Time: [
    { key: 's',   label: 'Second (s)',        toBase: v => v,             fromBase: v => v },
    { key: 'min', label: 'Minute (min)',      toBase: v => v * 60,        fromBase: v => v / 60 },
    { key: 'h',   label: 'Hour (h)',          toBase: v => v * 3600,      fromBase: v => v / 3600 },
    { key: 'd',   label: 'Day',              toBase: v => v * 86400,     fromBase: v => v / 86400 },
    { key: 'wk',  label: 'Week',             toBase: v => v * 604800,    fromBase: v => v / 604800 },
  ],
  'Data Storage': [
    { key: 'B',   label: 'Byte (B)',    toBase: v => v,            fromBase: v => v },
    { key: 'KB',  label: 'Kilobyte (KB)',toBase: v => v * 1024,     fromBase: v => v / 1024 },
    { key: 'MB',  label: 'Megabyte (MB)',toBase: v => v * 1048576,  fromBase: v => v / 1048576 },
    { key: 'GB',  label: 'Gigabyte (GB)',toBase: v => v * 1073741824, fromBase: v => v / 1073741824 },
    { key: 'TB',  label: 'Terabyte (TB)',toBase: v => v * 1099511627776, fromBase: v => v / 1099511627776 },
  ],
  Pressure: [
    { key: 'pa',   label: 'Pascal (Pa)',   toBase: v => v,            fromBase: v => v },
    { key: 'bar',  label: 'Bar',           toBase: v => v * 100000,   fromBase: v => v / 100000 },
    { key: 'atm',  label: 'Atmosphere',    toBase: v => v * 101325,   fromBase: v => v / 101325 },
    { key: 'psi',  label: 'PSI',           toBase: v => v * 6894.76,  fromBase: v => v / 6894.76 },
  ],
  Energy: [
    { key: 'j',    label: 'Joule (J)',        toBase: v => v,            fromBase: v => v },
    { key: 'cal',  label: 'Calorie (cal)',     toBase: v => v * 4.184,    fromBase: v => v / 4.184 },
    { key: 'wh',   label: 'Watt-hour (Wh)',   toBase: v => v * 3600,     fromBase: v => v / 3600 },
    { key: 'kwh',  label: 'kWh',              toBase: v => v * 3600000,  fromBase: v => v / 3600000 },
  ],
};

function formatNum(n: number): string {
  if (!isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (abs === 0) return '0';
  if (abs >= 1e12 || (abs < 1e-6 && abs > 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(8)).toString();
}

export default function UnitConverterClient() {
  const [category, setCategory] = useState<Category>('Length');
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('m');

  const units = CATEGORIES[category];
  const fromDef = useMemo(() => units.find(u => u.key === fromUnit) ?? units[0], [units, fromUnit]);
  const numVal = parseFloat(value);
  const baseVal = isNaN(numVal) ? NaN : fromDef.toBase(numVal);

  const handleCategoryChange = (cat: string) => {
    const newCat = cat as Category;
    setCategory(newCat);
    const firstUnit = CATEGORIES[newCat][0];
    setFromUnit(firstUnit.key);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-2 p-1 bg-surface-raised border border-white/5 rounded-2xl max-w-4xl">
            {Object.keys(CATEGORIES).map(cat => (
                <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`
                        px-4 py-2 text-xs font-bold rounded-xl transition-all
                        ${category === cat 
                            ? 'bg-accent text-white shadow-lg' 
                            : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                        }
                    `}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Input */}
        <div className="space-y-6">
            <Card title="Source Value">
                <div className="space-y-4">
                    <Input 
                        type="number"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Enter amount..."
                        className="text-lg font-bold"
                    />
                    <Select 
                        label="From Unit"
                        value={fromUnit}
                        onChange={e => setFromUnit(e.target.value)}
                        options={units.map(u => ({ value: u.key, label: u.label }))}
                    />
                </div>
            </Card>

            <div className="p-6 rounded-2xl bg-accent/5 border border-accent/10 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                    Select a category and enter a value to see instant conversions across all common units. Click any result to use it as the new input.
                </p>
            </div>
        </div>

        {/* Results */}
        <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Conversion Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {units.map((u) => {
                    const result = isNaN(baseVal) ? NaN : u.fromBase(baseVal);
                    const isActive = u.key === fromUnit;
                    return (
                        <button
                            key={u.key}
                            onClick={() => {
                                setValue(formatNum(result));
                                setFromUnit(u.key);
                            }}
                            className={`
                                flex flex-col items-start p-4 rounded-xl border transition-all text-left group
                                ${isActive 
                                    ? 'bg-accent/10 border-accent/30 shadow-inner ring-1 ring-accent/20' 
                                    : 'bg-surface-raised border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                                }
                            `}
                        >
                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors mb-1">{u.label}</div>
                            <div className={`text-lg font-mono font-bold break-all ${isActive ? 'text-accent' : 'text-white/80'}`}>
                                {formatNum(result)}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
}
