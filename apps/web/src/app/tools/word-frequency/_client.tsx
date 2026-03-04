'use client';

import { useState, useMemo } from 'react';

// ─── Stop words ──────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by','from',
  'up','about','into','through','during','is','are','was','were','be','been','being',
  'have','has','had','do','does','did','will','would','shall','should','may','might',
  'must','can','could','not','that','this','these','those','it','its','i','me','my',
  'we','us','our','you','your','he','him','his','she','her','they','them','their',
  'what','which','who','whom','when','where','why','how','all','each','every','both',
  'more','most','other','some','such','no','nor','so','yet','as','if','then','than',
  'too','very','just','also','here','there','now','only','even','well','back','any',
]);

// ─── Sentence counting for Flesch ────────────────────────────────────────────
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

function fleschReadingEase(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words: string[] = text.match(/\b[a-zA-Z]+\b/g) ?? [];
  if (!words.length || !sentences.length) return 0;
  const syllables: number = words.reduce((sum: number, w: string) => sum + countSyllables(w), 0);
  const asl = words.length / sentences.length;
  const asw = syllables / words.length;
  return Math.round(206.835 - 1.015 * asl - 84.6 * asw);
}

function fleschLabel(score: number): string {
  if (score >= 90) return 'Very Easy';
  if (score >= 80) return 'Easy';
  if (score >= 70) return 'Fairly Easy';
  if (score >= 60) return 'Standard';
  if (score >= 50) return 'Fairly Difficult';
  if (score >= 30) return 'Difficult';
  return 'Very Confusing';
}

interface WordEntry { word: string; count: number; pct: number }

function analyzeText(text: string, caseInsensitive: boolean, ignoreStop: boolean, minLen: number) {
  const tokens: string[] = text.match(/\b[a-zA-Z']+\b/g) ?? [];
  const totalWords = tokens.length;
  const freq: Record<string, number> = {};
  for (const tok of tokens) {
    const w = caseInsensitive ? tok.toLowerCase() : tok;
    if (w.length < minLen) continue;
    if (ignoreStop && STOP_WORDS.has(tok.toLowerCase())) continue;
    freq[w] = (freq[w] || 0) + 1;
  }
  const entries: WordEntry[] = Object.entries(freq)
    .map(([word, count]) => ({ word, count, pct: totalWords ? (count / totalWords) * 100 : 0 }))
    .sort((a, b) => b.count - a.count);

  const uniqueWords = Object.keys(freq).length;
  const avgLen = tokens.length ? tokens.reduce((s, w) => s + w.length, 0) / tokens.length : 0;
  const readingMins = Math.ceil(totalWords / 200);
  const flesch = fleschReadingEase(text);

  return { entries, totalWords, uniqueWords, avgLen, readingMins, flesch };
}

function exportCsv(entries: WordEntry[]) {
  const csv = ['Word,Count,Percentage', ...entries.map(e => `${e.word},${e.count},${e.pct.toFixed(2)}%`)].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'word-frequency.csv';
  a.click();
}

const S: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 900 },
  row: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, alignItems: 'center' },
  label: { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
  textarea: { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem', color: 'var(--text)', fontSize: '0.875rem', resize: 'vertical' as const, boxSizing: 'border-box' as const, minHeight: 160 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.65rem' },
  statCard: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem' },
  statLabel: { fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 3 },
  statVal: { fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' },
  tableWrap: { overflowX: 'auto' as const, border: '1px solid var(--border)', borderRadius: 10, maxHeight: 480, overflowY: 'auto' as const },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.84rem' },
  th: { padding: '0.55rem 0.75rem', textAlign: 'left' as const, color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' as const, borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated, #161616)', position: 'sticky' as const, top: 0 },
  td: { padding: '0.4rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-secondary)' },
  bar: { display: 'inline-block', height: 8, borderRadius: 4, background: 'var(--accent)', opacity: 0.6 },
  checkLabel: { display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.875rem', cursor: 'pointer', color: 'var(--text-secondary)' },
};

export default function WordFrequencyClient() {
  const [text, setText] = useState('');
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [ignoreStop, setIgnoreStop] = useState(false);
  const [minLen, setMinLen] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const result = useMemo(() => text.trim() ? analyzeText(text, caseInsensitive, ignoreStop, minLen) : null, [text, caseInsensitive, ignoreStop, minLen]);
  const displayed = result ? (showAll ? result.entries : result.entries.slice(0, 50)) : [];
  const maxCount = displayed[0]?.count ?? 1;

  return (
    <div style={S.root}>
      {/* Text input */}
      <div>
        <div style={{ ...S.label, marginBottom: 6 }}>Text</div>
        <textarea style={S.textarea} placeholder="Paste or type text here…" value={text} onChange={e => setText(e.target.value)} />
      </div>

      {/* Options */}
      <div style={S.row}>
        {[
          ['Case insensitive', caseInsensitive, setCaseInsensitive] as const,
          ['Ignore stop words', ignoreStop, setIgnoreStop] as const,
        ].map(([lbl, val, set]) => (
          <label key={lbl} style={S.checkLabel}>
            <input type="checkbox" checked={val} onChange={e => (set as (v: boolean) => void)(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
            {lbl}
          </label>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <span>Min length:</span>
          <input type="number" min={1} max={20} value={minLen} onChange={e => setMinLen(Math.max(1, Number(e.target.value)))}
            style={{ width: 52, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.35rem 0.5rem', color: 'var(--text)', fontSize: '0.875rem' }} />
        </div>
      </div>

      {result && (
        <>
          {/* Stats */}
          <div style={S.statsGrid}>
            {[
              ['Total words', result.totalWords.toLocaleString()],
              ['Unique words', result.uniqueWords.toLocaleString()],
              ['Avg word length', result.avgLen.toFixed(1)],
              ['Reading time', `~${result.readingMins} min`],
              ['Flesch score', `${result.flesch}`],
              ['Readability', fleschLabel(result.flesch)],
            ].map(([k, v]) => (
              <div key={k} style={S.statCard}>
                <div style={S.statLabel}>{k}</div>
                <div style={S.statVal}>{v}</div>
              </div>
            ))}
          </div>

          {/* Frequency table */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={S.label}>Word Frequency ({result.entries.length} unique)</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {result.entries.length > 50 && (
                  <button className="btn-ghost" style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }} onClick={() => setShowAll(v => !v)}>
                    {showAll ? 'Show Top 50' : `Show All (${result.entries.length})`}
                  </button>
                )}
                <button className="btn-ghost" style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }} onClick={() => exportCsv(result.entries)}>
                  ⬇ CSV
                </button>
              </div>
            </div>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={{ ...S.th, width: 40 }}>#</th>
                    <th style={S.th}>Word</th>
                    <th style={{ ...S.th, textAlign: 'right' as const }}>Count</th>
                    <th style={{ ...S.th, textAlign: 'right' as const }}>%</th>
                    <th style={{ ...S.th, width: 120 }}>Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((entry, i) => (
                    <tr key={entry.word} style={i < 20 ? { background: 'rgba(129,140,248,0.03)' } : {}}>
                      <td style={{ ...S.td, color: 'var(--text-faint, rgba(255,255,255,0.2))', fontSize: '0.75rem' }}>{i + 1}</td>
                      <td style={{ ...S.td, color: i < 20 ? 'var(--text)' : undefined, fontWeight: i < 20 ? 600 : 400 }}>{entry.word}</td>
                      <td style={{ ...S.td, textAlign: 'right' as const }}>{entry.count}</td>
                      <td style={{ ...S.td, textAlign: 'right' as const, color: 'var(--text-muted)' }}>{entry.pct.toFixed(1)}%</td>
                      <td style={S.td}>
                        <span style={{ ...S.bar, width: `${(entry.count / maxCount) * 100}%`, minWidth: entry.count ? 3 : 0 }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
