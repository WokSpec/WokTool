'use client';
import { useState, useMemo } from 'react';

// ── Block font (7 rows, 5 cols each letter) ───────────────────────────────
type FontData = Record<string, string[]>;

const BLOCK_FONT: FontData = {
  'A': ['  #  ','  #  ',' # # ','#####','#   #','#   #','#   #'],
  'B': ['#### ','#   #','#   #','#### ','#   #','#   #','#### '],
  'C': [' ####','#    ','#    ','#    ','#    ','#    ',' ####'],
  'D': ['#### ','#   #','#   #','#   #','#   #','#   #','#### '],
  'E': ['#####','#    ','#    ','#### ','#    ','#    ','#####'],
  'F': ['#####','#    ','#    ','#### ','#    ','#    ','#    '],
  'G': [' ####','#    ','#    ','# ###','#   #','#   #',' ####'],
  'H': ['#   #','#   #','#   #','#####','#   #','#   #','#   #'],
  'I': ['#####','  #  ','  #  ','  #  ','  #  ','  #  ','#####'],
  'J': ['#####','   # ','   # ','   # ','   # ','#  # ',' ##  '],
  'K': ['#   #','#  # ','# #  ','##   ','# #  ','#  # ','#   #'],
  'L': ['#    ','#    ','#    ','#    ','#    ','#    ','#####'],
  'M': ['#   #','## ##','# # #','#   #','#   #','#   #','#   #'],
  'N': ['#   #','##  #','# # #','#  ##','#   #','#   #','#   #'],
  'O': [' ### ','#   #','#   #','#   #','#   #','#   #',' ### '],
  'P': ['#### ','#   #','#   #','#### ','#    ','#    ','#    '],
  'Q': [' ### ','#   #','#   #','#   #','# # #','#  ##',' ## #'],
  'R': ['#### ','#   #','#   #','#### ','# #  ','#  # ','#   #'],
  'S': [' ####','#    ','#    ',' ### ','    #','    #','#### '],
  'T': ['#####','  #  ','  #  ','  #  ','  #  ','  #  ','  #  '],
  'U': ['#   #','#   #','#   #','#   #','#   #','#   #',' ### '],
  'V': ['#   #','#   #','#   #','#   #',' # # ',' # # ','  #  '],
  'W': ['#   #','#   #','#   #','# # #','# # #','## ##','#   #'],
  'X': ['#   #',' # # ','  #  ','  #  ','  #  ',' # # ','#   #'],
  'Y': ['#   #','#   #',' # # ','  #  ','  #  ','  #  ','  #  '],
  'Z': ['#####','    #','   # ','  #  ',' #   ','#    ','#####'],
  '0': [' ### ','#  ##','# # #','## ##','#   #','#   #',' ### '],
  '1': ['  #  ',' ##  ','  #  ','  #  ','  #  ','  #  ','#####'],
  '2': [' ### ','#   #','    #','   # ','  #  ',' #   ','#####'],
  '3': [' ### ','#   #','    #',' ### ','    #','#   #',' ### '],
  '4': ['   # ','  ## ',' # # ','#  # ','#####','   # ','   # '],
  '5': ['#####','#    ','#    ','#### ','    #','    #','#### '],
  '6': [' ### ','#    ','#    ','#### ','#   #','#   #',' ### '],
  '7': ['#####','    #','   # ','  #  ',' #   ','#    ','#    '],
  '8': [' ### ','#   #','#   #',' ### ','#   #','#   #',' ### '],
  '9': [' ### ','#   #','#   #',' ####','    #','    #',' ### '],
  ' ': ['     ','     ','     ','     ','     ','     ','     '],
  '!': ['  #  ','  #  ','  #  ','  #  ','  #  ','     ','  #  '],
  '?': [' ### ','#   #','    #','   # ','  #  ','     ','  #  '],
  '.': ['     ','     ','     ','     ','     ','     ','  #  '],
};

const BANNER_FONT: FontData = {
  'A': ['  *  ','  *  ',' * * ','*****','*   *','*   *','*   *'],
  'B': ['**** ','*   *','*   *','**** ','*   *','*   *','**** '],
  'C': [' ****','*    ','*    ','*    ','*    ','*    ',' ****'],
  'D': ['**** ','*   *','*   *','*   *','*   *','*   *','**** '],
  'E': ['*****','*    ','*    ','**** ','*    ','*    ','*****'],
  'F': ['*****','*    ','*    ','**** ','*    ','*    ','*    '],
  'G': [' ****','*    ','*    ','* ***','*   *','*   *',' ****'],
  'H': ['*   *','*   *','*   *','*****','*   *','*   *','*   *'],
  'I': ['*****','  *  ','  *  ','  *  ','  *  ','  *  ','*****'],
  'J': ['*****','  *  ','  *  ','  *  ','  *  ','*  * ',' **  '],
  'K': ['*   *','*  * ','* *  ','**   ','* *  ','*  * ','*   *'],
  'L': ['*    ','*    ','*    ','*    ','*    ','*    ','*****'],
  'M': ['*   *','** **','* * *','*   *','*   *','*   *','*   *'],
  'N': ['*   *','**  *','* * *','*  **','*   *','*   *','*   *'],
  'O': [' *** ','*   *','*   *','*   *','*   *','*   *',' *** '],
  'P': ['**** ','*   *','*   *','**** ','*    ','*    ','*    '],
  'Q': [' *** ','*   *','*   *','*   *','* * *','*  **',' ** *'],
  'R': ['**** ','*   *','*   *','**** ','* *  ','*  * ','*   *'],
  'S': [' ****','*    ','*    ',' *** ','    *','    *','**** '],
  'T': ['*****','  *  ','  *  ','  *  ','  *  ','  *  ','  *  '],
  'U': ['*   *','*   *','*   *','*   *','*   *','*   *',' *** '],
  'V': ['*   *','*   *','*   *','*   *',' * * ',' * * ','  *  '],
  'W': ['*   *','*   *','*   *','* * *','* * *','** **','*   *'],
  'X': ['*   *',' * * ','  *  ','  *  ','  *  ',' * * ','*   *'],
  'Y': ['*   *','*   *',' * * ','  *  ','  *  ','  *  ','  *  '],
  'Z': ['*****','    *','   * ','  *  ',' *   ','*    ','*****'],
  '0': [' *** ','*  **','* * *','** **','*   *','*   *',' *** '],
  '1': ['  *  ',' **  ','  *  ','  *  ','  *  ','  *  ','*****'],
  '2': [' *** ','*   *','    *','   * ','  *  ',' *   ','*****'],
  '3': [' *** ','*   *','    *',' *** ','    *','*   *',' *** '],
  '4': ['   * ','  ** ',' * * ','*  * ','*****','   * ','   * '],
  '5': ['*****','*    ','*    ','**** ','    *','    *','**** '],
  '6': [' *** ','*    ','*    ','**** ','*   *','*   *',' *** '],
  '7': ['*****','    *','   * ','  *  ',' *   ','*    ','*    '],
  '8': [' *** ','*   *','*   *',' *** ','*   *','*   *',' *** '],
  '9': [' *** ','*   *','*   *',' ****','    *','    *',' *** '],
  ' ': ['     ','     ','     ','     ','     ','     ','     '],
  '!': ['  *  ','  *  ','  *  ','  *  ','  *  ','     ','  *  '],
  '?': [' *** ','*   *','    *','   * ','  *  ','     ','  *  '],
  '.': ['     ','     ','     ','     ','     ','     ','  *  '],
};

function getFontData(font: string): FontData {
  if (font === 'Banner') return BANNER_FONT;
  if (font === 'Simple') {
    const d: FontData = {};
    for (const k of Object.keys(BLOCK_FONT)) {
      d[k] = BLOCK_FONT[k].map(row => row.replace(/#/g, '▓').replace(/ /g, ' '));
    }
    return d;
  }
  return BLOCK_FONT;
}

function textToAscii(text: string, font: string): string {
  const upper = text.toUpperCase();
  const fontData = getFontData(font);
  const rows: string[] = ['','','','','','',''];
  for (const ch of upper) {
    const glyph = fontData[ch] ?? fontData[' '] ?? ['     ','     ','     ','     ','     ','     ','     '];
    for (let r = 0; r < 7; r++) {
      rows[r] += (glyph[r] ?? '     ') + ' ';
    }
  }
  return rows.join('\n');
}

function addBorder(text: string, style: string): string {
  if (style === 'none') return text;
  const lines = text.split('\n');
  const maxLen = Math.max(...lines.map(l => l.length));
  const chars = {
    'single': { tl:'┌',tr:'┐',bl:'└',br:'┘',h:'─',v:'│' },
    'double': { tl:'╔',tr:'╗',bl:'╚',br:'╝',h:'═',v:'║' },
    'ascii':  { tl:'+',tr:'+',bl:'+',br:'+',h:'-',v:'|' },
    'stars':  { tl:'*',tr:'*',bl:'*',br:'*',h:'*',v:'*' },
  }[style] ?? { tl:'+',tr:'+',bl:'+',br:'+',h:'-',v:'|' };
  const top = chars.tl + chars.h.repeat(maxLen + 2) + chars.tr;
  const bot = chars.bl + chars.h.repeat(maxLen + 2) + chars.br;
  const mid = lines.map(l => `${chars.v} ${l.padEnd(maxLen)} ${chars.v}`);
  return [top, ...mid, bot].join('\n');
}

export default function AsciiArtClient() {
  const [text, setText] = useState('Hello');
  const [font, setFont] = useState('Block');
  const [border, setBorder] = useState('none');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!text.trim()) return '';
    const art = textToAscii(text, font);
    return addBorder(art, border);
  }, [text, font, border]);

  async function copy() {
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
        <div>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: 4 }}>Input Text (A-Z, 0-9)</label>
          <input
            value={text}
            onChange={e => setText(e.target.value.slice(0, 20))}
            placeholder="Enter text..."
            style={{ ...s, width: '100%', fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: 4 }}>Font Style</label>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {['Block','Banner','Simple'].map(f => (
                <button key={f} onClick={() => setFont(f)} className={font === f ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}>{f}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: 4 }}>Border / Frame</label>
            <select value={border} onChange={e => setBorder(e.target.value)} style={s}>
              <option value="none">None</option>
              <option value="single">Single Line ┌─┐</option>
              <option value="double">Double Line ╔═╗</option>
              <option value="ascii">ASCII +--+</option>
              <option value="stars">Stars ***</option>
            </select>
          </div>
        </div>
      </div>

      {/* Output */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ASCII Art Output</span>
          <button onClick={copy} className="btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
        <pre style={{
          padding: '1rem',
          color: 'var(--accent)',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          lineHeight: 1.3,
          overflow: 'auto',
          margin: 0,
          minHeight: 120,
          whiteSpace: 'pre',
        }}>
          {output || <span style={{ color: 'var(--text-muted)' }}>Enter text above to generate ASCII art</span>}
        </pre>
      </div>
    </div>
  );
}
