'use client';
import { useState, useMemo } from 'react';

const WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor',
  'incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud',
  'exercitation','ullamco','laboris','nisi','ex','ea','commodo','consequat','duis','aute','irure',
  'reprehenderit','voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint',
  'occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id',
  'est','laborum','pellentesque','habitant','morbi','tristique','senectus','netus','malesuada','fames',
  'turpis','egestas','volutpat','mi','euismod','neque','ornare','arcu','dui','vivamus','arcu','felis',
  'bibendum','ut','tristique','et','egestas','quis','ipsum','suspendisse','ultrices','gravida','risus',
  'commodo','viverra','maecenas','accumsan','lacus','vel','facilisis','volutpat','est','velit','egestas',
  'dui','id','ornare','arcu','odio','ut','sem','nulla','pharetra','diam','sit','amet','nisl','suscipit',
  'adipiscing','bibendum','est','ultricies','integer','quis','auctor','elit','sed','vulputate','mi','sit',
  'amet','mauris','commodo','quis','imperdiet','massa','tincidunt','nunc','pulvinar','sapien','et',
  'ligula','ullamcorper','malesuada','proin','libero','nunc','consequat','interdum','varius','sit','amet',
  'mattis','vulputate','enim','nulla','aliquet','porttitor','lacus','luctus','accumsan','tortor','posuere',
  'ac','ut','consequat','semper','viverra','nam','libero','justo','laoreet','sit','amet','cursus','sit',
  'amet','dictum','sit','amet','justo','donec','enim','diam','vulputate','ut','pharetra','sit','amet',
  'aliquam','id','diam','maecenas','ultricies','mi','eget','mauris','pharetra','et','ultrices','neque',
  'ornare','aenean','euismod','elementum','nisi','quis','eleifend','quam','adipiscing','vitae','proin',
  'sagittis','nisl','rhoncus','mattis','rhoncus','urna','neque','viverra','justo','nec','ultrices','dui',
  'sapien','eget','mi','proin','sed','libero','enim','sed','faucibus','turpis','in','eu','mi','bibendum',
  'neque','egestas','congue','quisque','egestas','diam','in','arcu','cursus','euismod','quis','viverra',
  'nibh','cras','pulvinar','mattis','nunc','sed','blandit','libero','volutpat','sed','cras','ornare',
].filter((v, i, a) => a.indexOf(v) === i);

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateWords(count: number, scramble: boolean, seed: number): string[] {
  const rng = seededRandom(seed);
  const pool = scramble ? shuffle(WORDS, rng) : WORDS;
  const result: string[] = [];
  for (let i = 0; i < count; i++) result.push(pool[i % pool.length]);
  return result;
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function wordsToSentences(words: string[], minWords = 8, maxWords = 18): string[] {
  const sentences: string[] = [];
  let i = 0;
  const rng = seededRandom(42);
  while (i < words.length) {
    const len = minWords + Math.floor(rng() * (maxWords - minWords + 1));
    const chunk = words.slice(i, i + len);
    if (chunk.length === 0) break;
    sentences.push(capitalize(chunk.join(' ')) + '.');
    i += len;
  }
  return sentences;
}

function sentencesToParagraphs(sentences: string[], minSent = 3, maxSent = 7): string[] {
  const paragraphs: string[] = [];
  let i = 0;
  const rng = seededRandom(99);
  while (i < sentences.length) {
    const len = minSent + Math.floor(rng() * (maxSent - minSent + 1));
    const chunk = sentences.slice(i, i + len);
    if (chunk.length === 0) break;
    paragraphs.push(chunk.join(' '));
    i += len;
  }
  return paragraphs;
}

const LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

export default function LoremIpsumClient() {
  const [mode, setMode] = useState<'paragraphs'|'sentences'|'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [classic, setClassic] = useState(true);
  const [htmlTags, setHtmlTags] = useState(false);
  const [scramble, setScramble] = useState(false);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const wordCount = mode === 'words' ? count : mode === 'sentences' ? count * 12 : count * 60;
    let words = generateWords(wordCount + 50, scramble, 12345);
    
    let result: string;
    
    if (mode === 'words') {
      const w = words.slice(0, count);
      if (classic && count >= 2) {
        w[0] = 'Lorem'; w[1] = 'ipsum';
      }
      result = w.join(' ');
    } else if (mode === 'sentences') {
      const sentences = wordsToSentences(words).slice(0, count);
      if (classic && sentences.length > 0) sentences[0] = LOREM_START;
      result = htmlTags
        ? sentences.map(s => `<p>${s}</p>`).join('\n')
        : sentences.join('\n');
    } else {
      const sentences = wordsToSentences(words);
      const paragraphs = sentencesToParagraphs(sentences).slice(0, count);
      if (classic && paragraphs.length > 0) {
        paragraphs[0] = LOREM_START + ' ' + paragraphs[0].split('. ').slice(1).join('. ');
      }
      result = htmlTags
        ? paragraphs.map(p => `<p>${p}</p>`).join('\n\n')
        : paragraphs.join('\n\n');
    }
    return result;
  }, [mode, count, classic, htmlTags, scramble]);

  const wordCountResult = output.split(/\s+/).filter(Boolean).length;
  const charCount = output.length;

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const s: React.CSSProperties = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    borderRadius: 8,
    padding: '0.45rem 0.75rem',
    fontSize: '0.9rem',
    outline: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Controls */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: 4 }}>Type</label>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {(['paragraphs','sentences','words'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)} className={mode === m ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem', textTransform: 'capitalize' }}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: 4 }}>Count</label>
            <input type="number" min={1} max={100} value={count} onChange={e => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} style={{ ...s, width: 80 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Start with "Lorem ipsum..."', val: classic, set: setClassic },
            { label: 'Wrap in <p> tags', val: htmlTags, set: setHtmlTags },
            { label: 'Scramble words', val: scramble, set: setScramble },
          ].map(({ label, val, set }) => (
            <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Output */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {wordCountResult.toLocaleString()} words · {charCount.toLocaleString()} chars
          </span>
          <button onClick={copyOutput} className="btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
        <textarea
          readOnly
          value={output}
          style={{
            width: '100%',
            minHeight: 280,
            background: 'transparent',
            border: 'none',
            color: 'var(--text)',
            padding: '1rem',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            fontFamily: 'Georgia, serif',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  );
}
