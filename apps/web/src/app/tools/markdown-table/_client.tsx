'use client';
import { useState, useCallback } from 'react';

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

const inpStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text)',
  padding: '0.3rem 0.5rem',
  fontSize: '0.85rem',
  width: '100%',
  outline: 'none',
};

export default function MarkdownTableClient() {
  const [headers, setHeaders] = useState(['Column 1', 'Column 2', 'Column 3']);
  const [rows, setRows] = useState<string[][]>([
    ['Cell 1', 'Cell 2', 'Cell 3'],
    ['Cell 4', 'Cell 5', 'Cell 6'],
  ]);
  const [alignments, setAlignments] = useState<Alignment[]>(['left', 'center', 'right']);
  const [view, setView] = useState<'editor'|'preview'|'markdown'>('editor');
  const [csvInput, setCsvInput] = useState('');
  const [copied, setCopied] = useState(false);

  const numCols = headers.length;

  function setHeader(i: number, v: string) {
    setHeaders(h => h.map((x, j) => j === i ? v : x));
  }
  function setCell(r: number, c: number, v: string) {
    setRows(rows => rows.map((row, ri) => ri === r ? row.map((cell, ci) => ci === c ? v : cell) : row));
  }
  function addCol() {
    setHeaders(h => [...h, `Column ${h.length + 1}`]);
    setAlignments(a => [...a, 'left']);
    setRows(r => r.map(row => [...row, '']));
  }
  function removeCol(i: number) {
    if (headers.length <= 1) return;
    setHeaders(h => h.filter((_, j) => j !== i));
    setAlignments(a => a.filter((_, j) => j !== i));
    setRows(r => r.map(row => row.filter((_, j) => j !== i)));
  }
  function addRow() {
    setRows(r => [...r, Array(numCols).fill('')]);
  }
  function removeRow(i: number) {
    setRows(r => r.filter((_, j) => j !== i));
  }
  function setAlignment(i: number, a: Alignment) {
    setAlignments(al => al.map((x, j) => j === i ? a : x));
  }

  function importCSV() {
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
  }

  const markdown = buildMarkdown(headers, rows, alignments);

  async function copy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function renderHTMLTable() {
    return (
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ border: '1px solid var(--border)', padding: '0.5rem 0.75rem', textAlign: alignments[i], background: 'var(--bg-surface)', color: 'var(--text)', fontWeight: 600 }}>{h || <span style={{ color: 'var(--text-muted)' }}>—</span>}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {headers.map((_, ci) => (
                <td key={ci} style={{ border: '1px solid var(--border)', padding: '0.5rem 0.75rem', textAlign: alignments[ci], color: 'var(--text)', background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>{row[ci] || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  const s: React.CSSProperties = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    borderRadius: 8,
    padding: '0.45rem 0.75rem',
    fontSize: '0.85rem',
    outline: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {(['editor','preview','markdown'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={view === v ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem', textTransform: 'capitalize' }}>{v}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={addCol} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}>+ Column</button>
        <button onClick={addRow} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}>+ Row</button>
        <button onClick={copy} className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}>{copied ? '✓ Copied!' : '📋 Copy MD'}</button>
      </div>

      {view === 'editor' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', minWidth: '100%' }}>
            {/* Alignment row */}
            <thead>
              <tr>
                {headers.map((_, i) => (
                  <th key={i} style={{ padding: '0.25rem 0.25rem', background: 'var(--bg-surface)' }}>
                    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                      {(['left','center','right'] as Alignment[]).map(a => (
                        <button key={a} onClick={() => setAlignment(i, a)}
                          style={{ padding: '2px 6px', fontSize: '0.65rem', borderRadius: 4, border: 'none', cursor: 'pointer',
                            background: alignments[i] === a ? 'var(--accent)' : 'var(--bg-elevated)',
                            color: alignments[i] === a ? 'white' : 'var(--text-muted)' }}>
                          {a === 'left' ? '⬅' : a === 'center' ? '↔' : '➡'}
                        </button>
                      ))}
                      <button onClick={() => removeCol(i)}
                        style={{ padding: '2px 5px', fontSize: '0.65rem', borderRadius: 4, border: 'none', cursor: 'pointer', background: 'var(--danger-bg)', color: 'var(--danger)' }}>✕</button>
                    </div>
                  </th>
                ))}
                <th style={{ padding: '0.25rem', background: 'var(--bg-surface)' }} />
              </tr>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} style={{ padding: '2px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                    <input value={h} onChange={e => setHeader(i, e.target.value)} style={{ ...inpStyle, fontWeight: 700, textAlign: alignments[i] }} placeholder={`Col ${i+1}`} />
                  </th>
                ))}
                <th style={{ border: '1px solid var(--border)', background: 'var(--bg-elevated)' }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {headers.map((_, ci) => (
                    <td key={ci} style={{ padding: '2px', border: '1px solid var(--border)' }}>
                      <input value={row[ci] ?? ''} onChange={e => setCell(ri, ci, e.target.value)} style={{ ...inpStyle, textAlign: alignments[ci] }} placeholder="..." />
                    </td>
                  ))}
                  <td style={{ padding: '0.25rem', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                    <button onClick={() => removeRow(ri)} style={{ padding: '2px 6px', fontSize: '0.7rem', borderRadius: 4, border: 'none', cursor: 'pointer', background: 'var(--danger-bg)', color: 'var(--danger)' }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'preview' && (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', overflowX: 'auto' }}>
          {renderHTMLTable()}
        </div>
      )}

      {view === 'markdown' && (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Raw Markdown</span>
            <button onClick={copy} className="btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>{copied ? '✓ Copied!' : '📋 Copy'}</button>
          </div>
          <pre style={{ margin: 0, padding: '1rem', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.85rem', overflowX: 'auto', whiteSpace: 'pre' }}>{markdown}</pre>
        </div>
      )}

      {/* CSV Import */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h4 style={{ margin: 0, color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600 }}>📥 Import from CSV</h4>
        <textarea
          value={csvInput}
          onChange={e => setCsvInput(e.target.value)}
          placeholder={'Paste CSV here...\nName, Age, City\nAlice, 30, NYC\nBob, 25, LA'}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            borderRadius: 8,
            padding: '0.75rem',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            resize: 'vertical',
            minHeight: 80,
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
        <button onClick={importCSV} className="btn-primary" style={{ alignSelf: 'flex-start', padding: '0.45rem 1rem', fontSize: '0.85rem' }} disabled={!csvInput.trim()}>
          Import CSV
        </button>
      </div>
    </div>
  );
}
