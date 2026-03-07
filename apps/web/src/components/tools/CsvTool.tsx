'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import CodeBlock from '@/components/ui/CodeBlock';
import Textarea from '@/components/ui/Textarea';
import Input from '@/components/ui/Input';

type Tab = 'table' | 'convert' | 'stats';
type ConvertMode = 'csv-json' | 'csv-yaml' | 'json-csv';
type SortDir = 'asc' | 'desc';

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    const cells: string[] = [];
    let inQ = false, cur = '';
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === ',' && !inQ) {
        cells.push(cur); cur = '';
      } else cur += ch;
    }
    cells.push(cur);
    rows.push(cells);
  }
  return rows;
}

function csvToJson(rows: string[][]): string {
  if (rows.length < 2) return '[]';
  const headers = rows[0];
  const data = rows.slice(1).map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ''])));
  return JSON.stringify(data, null, 2);
}

const EXAMPLE_CSV = `name,role,experience,status
Alice,Developer,5 years,Active
Bob,Designer,3 years,On Leave
Carol,Manager,10 years,Active
Dave,Junior,1 year,Active`;

export default function CsvTool() {
  const [csv, setCsv] = useState(EXAMPLE_CSV);
  const [activeTab, setActiveTab] = useState<Tab>('table');
  const [convertMode, setConvertMode] = useState<ConvertMode>('csv-json');
  const [jsonInput, setJsonInput] = useState('');
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filter, setFilter] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rows = useMemo(() => parseCsv(csv), [csv]);
  const headers = rows[0] ?? [];
  const dataRows = rows.slice(1);

  const filtered = useMemo(() => 
    filter ? dataRows.filter(row => row.some(cell => cell.toLowerCase().includes(filter.toLowerCase()))) : dataRows
  , [dataRows, filter]);

  const sorted = useMemo(() => {
    if (sortCol === null) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortCol] ?? '', bv = b[sortCol] ?? '';
      const numA = parseFloat(av), numB = parseFloat(bv);
      const cmp = !isNaN(numA) && !isNaN(numB) ? numA - numB : av.localeCompare(bv);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortDir]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setCsv(ev.target?.result as string ?? '');
    reader.readAsText(file);
  };

  const convertOutput = useMemo(() => {
    if (convertMode === 'csv-json') return csvToJson(rows);
    if (convertMode === 'json-csv') {
        try {
            const data = JSON.parse(jsonInput);
            if (!Array.isArray(data) || !data.length) return 'Input must be a JSON array';
            const keys = Object.keys(data[0]);
            const res = [keys.join(',')];
            data.forEach(obj => res.push(keys.map(k => {
                const v = String(obj[k] ?? '');
                return v.includes(',') || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
            }).join(',')));
            return res.join('\n');
        } catch { return 'Invalid JSON'; }
    }
    return '';
  }, [convertMode, rows, jsonInput]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Data Input */}
        <div className="space-y-6">
            <Card title="CSV Input">
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" className="flex-1" onClick={() => fileInputRef.current?.click()}>Upload .csv</Button>
                        <Button variant="ghost" size="sm" onClick={() => setCsv('')}>Clear</Button>
                    </div>
                    <Textarea 
                        value={csv}
                        onChange={e => setCsv(e.target.value)}
                        placeholder="Paste comma-separated values here..."
                        className="min-h-[300px] font-mono text-[10px] leading-tight"
                        spellCheck={false}
                    />
                    <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFile} />
                </div>
            </Card>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-[10px] text-white/20 font-black uppercase">Rows</div>
                        <div className="text-xl font-bold text-white">{dataRows.length}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-white/20 font-black uppercase">Columns</div>
                        <div className="text-xl font-bold text-white">{headers.length}</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Views */}
        <div className="lg:col-span-2 space-y-6">
            <Tabs 
                activeTab={activeTab}
                onChange={id => setActiveTab(id as Tab)}
                tabs={[
                    { id: 'table', label: 'Data Viewer', icon: '📋' },
                    { id: 'convert', label: 'Converter', icon: '🔄' },
                    { id: 'stats', label: 'Analysis', icon: '📊' },
                ]}
            />

            <div className="min-h-[500px]">
                {activeTab === 'table' && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-2">
                        <div className="flex gap-4">
                            <Input 
                                placeholder="Search in table..."
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                                className="flex-1"
                                leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                            />
                        </div>

                        <div className="relative overflow-x-auto rounded-2xl border border-white/10 bg-[#0d0d0d]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.03]">
                                        {headers.map((h, i) => (
                                            <th 
                                                key={i} 
                                                onClick={() => {
                                                    if (sortCol === i) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                                                    else { setSortCol(i); setSortDir('asc'); }
                                                }}
                                                className="p-4 text-[10px] font-black uppercase tracking-wider text-white/40 cursor-pointer hover:text-white transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {h}
                                                    <span className="text-[8px] opacity-20">
                                                        {sortCol === i ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
                                                    </span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sorted.map((row, ri) => (
                                        <tr key={ri} className="border-t border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                                            {headers.map((_, ci) => (
                                                <td key={ci} className="p-4 text-xs text-white/70 font-mono whitespace-nowrap">
                                                    {row[ci] || <span className="opacity-20 italic">null</span>}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'convert' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-2">
                        <div className="flex gap-2 p-1 bg-surface-raised rounded-xl border border-white/5 w-fit">
                            {(['csv-json', 'json-csv'] as ConvertMode[]).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setConvertMode(m)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                                        convertMode === m ? 'bg-accent text-white' : 'text-white/30 hover:text-white/60'
                                    }`}
                                >
                                    {m.replace('-', ' → ')}
                                </button>
                            ))}
                        </div>

                        {convertMode === 'json-csv' && (
                            <Textarea 
                                value={jsonInput}
                                onChange={e => setJsonInput(e.target.value)}
                                placeholder="Paste JSON array here..."
                                className="min-h-[150px] font-mono text-xs"
                            />
                        )}

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest">Generated Output</h4>
                                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(convertOutput)} className="h-7 text-[10px]">Copy All</Button>
                            </div>
                            <CodeBlock code={convertOutput} language={convertMode.includes('json') ? 'json' : 'text'} maxHeight="400px" />
                        </div>
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-2">
                        {headers.map((h, ci) => {
                            const vals = dataRows.map(r => r[ci]?.trim()).filter(Boolean);
                            const uniques = new Set(vals).size;
                            return (
                                <Card key={ci} title={h}>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[10px] uppercase font-bold">
                                            <span className="text-white/20">Unique Values</span>
                                            <span className="text-accent">{uniques}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] uppercase font-bold">
                                            <span className="text-white/20">Fill Rate</span>
                                            <span className="text-white/60">{Math.round((vals.length / dataRows.length) * 100)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-accent" style={{ width: `${(vals.length / dataRows.length) * 100}%` }} />
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
