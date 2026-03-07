'use client';

import { useState, useCallback, useMemo } from 'react';
import Tabs from '@/components/ui/Tabs';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

type Alignment = 'left' | 'center' | 'right';

function alignSep(a: Alignment) {
  if (a === 'center') return ':---:';
  if (a === 'right')  return '---:';
  return ':---';
}

function buildMarkdown(headers: string[], rows: string[][], alignments: Alignment[]): string {
  const colWidths = headers.map((h, i) => {
    const maxData = rows.reduce((m, r) => Math.max(m, (r[i] ?? '').length), 0);
    return Math.max(h.length, maxData, 5);
  });
  const pad = (s: string, w: number, a: Alignment) => {
    if (a === 'right')  return s.padStart(w);
    if (a === 'center') return s.padStart(Math.floor((w - s.length) / 2) + s.length).padEnd(w);
    return s.padEnd(w);
  };
  const headerRow = '| ' + headers.map((h, i) => pad(h, colWidths[i], alignments[i])).join(' | ') + ' |';
  const sepRow = '| ' + alignments.map((a, i) => {
    const sep = alignSep(a);
    return sep.padEnd(colWidths[i], '-');
  }).join(' | ') + ' |';
  const dataRows = rows.map(row =>
    '| ' + headers.map((_, i) => pad(row[i] ?? '', colWidths[i], alignments[i])).join(' | ') + ' |'
  );
  return [headerRow, sepRow, ...dataRows].join('\n');
}

function parseCSV(csv: string): { headers: string[]; rows: string[][] } {
  const lines = csv.trim().split('\n').filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };
  const parse = (line: string) => line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
  const headers = parse(lines[0]);
  const rows = lines.slice(1).map(parse);
  return { headers, rows };
}

export default function MarkdownTableClient() {
  const [headers, setHeaders] = useState(['Feature', 'Description', 'Status']);
  const [rows, setRows] = useState<string[][]>([
    ['Live Preview', 'See your table as you build it', '✅ Done'],
    ['CSV Import', 'Paste spreadsheet data easily', '✅ Done'],
    ['Cell Alignment', 'Left, center, or right align', '✅ Done'],
  ]);
  const [alignments, setAlignments] = useState<Alignment[]>(['left', 'left', 'center']);
  const [view, setView] = useState<'editor'|'preview'|'markdown'>('editor');
  const [csvInput, setCsvInput] = useState('');

  const numCols = headers.length;

  const setHeader = (i: number, v: string) => setHeaders(h => h.map((x, j) => j === i ? v : x));
  const setCell = (r: number, c: number, v: string) => setRows(rows => rows.map((row, ri) => ri === r ? row.map((cell, ci) => ci === c ? v : cell) : row));
  
  const addCol = () => {
    setHeaders(h => [...h, `Col ${h.length + 1}`]);
    setAlignments(a => [...a, 'left']);
    setRows(r => r.map(row => [...row, '']));
  };

  const removeCol = (i: number) => {
    if (headers.length <= 1) return;
    setHeaders(h => h.filter((_, j) => j !== i));
    setAlignments(a => a.filter((_, j) => j !== i));
    setRows(r => r.map(row => row.filter((_, j) => j !== i)));
  };

  const addRow = () => setRows(r => [...r, Array(numCols).fill('')]);
  const removeRow = (i: number) => setRows(r => r.filter((_, j) => j !== i));
  const setAlignment = (i: number, a: Alignment) => setAlignments(al => al.map((x, j) => j === i ? a : x));

  const importCSV = () => {
    const { headers: h, rows: r } = parseCSV(csvInput);
    if (h.length === 0) return;
    setHeaders(h);
    setAlignments(h.map(() => 'left' as Alignment));
    setRows(r.map(row => {
      const padded = [...row];
      while (padded.length < h.length) padded.push('');
      return padded.slice(0, h.length);
    }));
    setCsvInput('');
  };

  const markdown = useMemo(() => buildMarkdown(headers, rows, alignments), [headers, rows, alignments]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <Tabs 
            activeTab={view}
            onChange={id => setView(id as any)}
            tabs={[
                { id: 'editor', label: 'Editor', icon: '✍️' },
                { id: 'preview', label: 'Visual', icon: '👁️' },
                { id: 'markdown', label: 'Code', icon: '📋' },
            ]}
            className="w-full md:w-auto"
        />
        <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={addCol}>+ Col</Button>
            <Button variant="secondary" size="sm" onClick={addRow}>+ Row</Button>
            <Button variant="primary" size="sm" onClick={() => navigator.clipboard.writeText(markdown)}>Copy MD</Button>
        </div>
      </div>

      <div className="min-h-[400px]">
        {view === 'editor' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2">
                <div className="relative overflow-x-auto rounded-3xl border border-white/10 bg-[#0d0d0d]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.03]">
                                {headers.map((_, i) => (
                                    <th key={i} className="p-2 border-b border-white/5">
                                        <div className="flex items-center justify-center gap-1">
                                            {(['left','center','right'] as Alignment[]).map(a => (
                                                <button 
                                                    key={a} 
                                                    onClick={() => setAlignment(i, a)}
                                                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] transition-all ${alignments[i] === a ? 'bg-accent text-white shadow-lg' : 'bg-white/5 text-white/20 hover:text-white'}`}
                                                >
                                                    {a === 'left' ? '⬅' : a === 'center' ? '↔' : '➡'}
                                                </button>
                                            ))}
                                            <button onClick={() => removeCol(i)} className="w-6 h-6 rounded bg-danger/10 text-danger hover:bg-danger/20 flex items-center justify-center ml-1 text-[10px]">✕</button>
                                        </div>
                                    </th>
                                ))}
                                <th className="w-12 bg-white/[0.01]" />
                            </tr>
                            <tr>
                                {headers.map((h, i) => (
                                    <th key={i} className="p-1 border-white/5 border-r border-b">
                                        <input 
                                            value={h} 
                                            onChange={e => setHeader(i, e.target.value)} 
                                            className={`w-full bg-transparent px-3 py-2 text-xs font-black uppercase text-accent focus:outline-none placeholder-white/10`} 
                                            style={{ textAlign: alignments[i] }}
                                            placeholder={`Header ${i+1}`}
                                        />
                                    </th>
                                ))}
                                <th className="border-b border-white/5" />
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, ri) => (
                                <tr key={ri} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors group">
                                    {headers.map((_, ci) => (
                                        <td key={ci} className="p-1 border-r border-white/[0.03]">
                                            <input 
                                                value={row[ci] ?? ''} 
                                                onChange={e => setCell(ri, ci, e.target.value)} 
                                                className={`w-full bg-transparent px-3 py-2 text-xs text-white/70 focus:outline-none placeholder-white/5`}
                                                style={{ textAlign: alignments[ci] }}
                                                placeholder="..."
                                            />
                                        </td>
                                    ))}
                                    <td className="p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => removeRow(ri)} className="w-6 h-6 rounded bg-danger/10 text-danger hover:bg-danger/20 flex items-center justify-center text-[10px]">✕</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Card title="CSV Bulk Import" description="Paste comma-separated data to populate the table automatically.">
                    <div className="space-y-4">
                        <Textarea 
                            value={csvInput}
                            onChange={e => setCsvInput(e.target.value)}
                            placeholder={"Feature, Description, Status\nFast, Powered by Next.js, ✅\nSecure, Runs in browser, ✅"}
                            className="min-h-[100px] font-mono text-xs"
                        />
                        <Button variant="secondary" size="sm" onClick={importCSV} disabled={!csvInput.trim()}>Import from CSV</Button>
                    </div>
                </Card>
            </div>
        )}

        {view === 'preview' && (
            <div className="animate-in slide-in-from-bottom-2">
                <Card className="p-8 prose prose-invert max-w-none prose-sm bg-white/[0.01]">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    {headers.map((h, i) => (
                                        <th key={i} style={{ textAlign: alignments[i] }} className="font-black text-accent uppercase tracking-tighter border-b-2 border-white/10 pb-4">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, ri) => (
                                    <tr key={ri}>
                                        {headers.map((_, ci) => (
                                            <td key={ci} style={{ textAlign: alignments[ci] }} className="py-4 border-b border-white/5">{row[ci] || '—'}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        )}

        {view === 'markdown' && (
            <div className="animate-in slide-in-from-bottom-2 space-y-4">
                <h3 className="text-[10px] font-black uppercase text-white/20 tracking-widest px-1">Markdown Syntax</h3>
                <CodeBlock code={markdown} language="markdown" maxHeight="500px" />
                <Button variant="primary" className="w-full" size="lg" onClick={() => navigator.clipboard.writeText(markdown)}>Copy Raw Markdown</Button>
            </div>
        )}
      </div>
    </div>
  );
}
