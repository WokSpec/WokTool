'use client';
import { useState } from 'react';

const BACKGROUNDS = [
  { label: 'Purple Wave',  css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { label: 'Sunset',       css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { label: 'Ocean',        css: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { label: 'Forest',       css: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { label: 'Fire',         css: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { label: 'Aurora',       css: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
  { label: 'Night',        css: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
  { label: 'Candy',        css: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
];

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

export default function GlassmorphismClient() {
  const [blur, setBlur] = useState(10);
  const [transparency, setTransparency] = useState(0.15);
  const [borderOpacity, setBorderOpacity] = useState(0.3);
  const [radius, setRadius] = useState(16);
  const [color, setColor] = useState('#ffffff');
  const [bg, setBg] = useState(BACKGROUNDS[0].css);
  const [copied, setCopied] = useState(false);

  const bgRgba = hexToRgba(color, transparency);
  const borderRgba = hexToRgba(color, borderOpacity);

  const glassStyle: React.CSSProperties = {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    background: bgRgba,
    border: `1px solid ${borderRgba}`,
    borderRadius: radius,
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  };

  const css = `.glass {
  background: ${bgRgba};
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border-radius: ${radius}px;
  border: 1px solid ${borderRgba};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}`;

  async function copy() {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    accentColor: 'var(--accent)',
    cursor: 'pointer',
  };

  const labelStyle: React.CSSProperties = {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
  };

  const valStyle: React.CSSProperties = {
    color: 'var(--accent)',
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    minWidth: 40,
    textAlign: 'right',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Controls */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text)', fontSize: '0.95rem', fontWeight: 600 }}>Controls</h3>

          {[
            { label: `Blur`, value: blur, set: setBlur, min: 0, max: 20, step: 0.5, unit: 'px' },
            { label: `Transparency`, value: transparency, set: setTransparency, min: 0, max: 1, step: 0.01, unit: '' },
            { label: `Border Opacity`, value: borderOpacity, set: setBorderOpacity, min: 0, max: 1, step: 0.01, unit: '' },
            { label: `Border Radius`, value: radius, set: setRadius, min: 0, max: 50, step: 1, unit: 'px' },
          ].map(({ label, value, set, min, max, step, unit }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={labelStyle}>{label}</span>
                <span style={valStyle}>{value}{unit}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={value}
                onChange={e => set(parseFloat(e.target.value))} style={sliderStyle} />
            </div>
          ))}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={labelStyle}>Tint Color</span>
            </div>
            <input type="color" value={color} onChange={e => setColor(e.target.value)}
              style={{ width: '100%', height: 36, border: '1px solid var(--border)', borderRadius: 8, background: 'none', cursor: 'pointer', padding: '2px' }} />
          </div>

          <div>
            <span style={{ ...labelStyle, display: 'block', marginBottom: 6 }}>Background</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {BACKGROUNDS.map(b => (
                <button key={b.label} onClick={() => setBg(b.css)}
                  style={{
                    padding: '0.4rem 0.5rem',
                    borderRadius: 6,
                    border: bg === b.css ? '2px solid var(--accent)' : '1px solid var(--border)',
                    cursor: 'pointer',
                    background: b.css,
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                  }}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ borderRadius: 10, overflow: 'hidden', minHeight: 260, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
            {/* Background decorations */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', top: '10%', left: '5%' }} />
              <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', bottom: '15%', right: '10%' }} />
            </div>
            <div style={{ ...glassStyle, padding: '1.5rem 2rem', width: '100%', maxWidth: 260, position: 'relative', zIndex: 1 }}>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>Glass Card</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', marginBottom: 12 }}>Glassmorphism effect preview</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ height: 8, flex: 2, background: 'rgba(255,255,255,0.4)', borderRadius: 4 }} />
                <div style={{ height: 8, flex: 1, background: 'rgba(255,255,255,0.25)', borderRadius: 4 }} />
              </div>
              <div style={{ marginTop: 8, height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 4 }} />
            </div>
          </div>
        </div>
      </div>

      {/* CSS Output */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'monospace' }}>Generated CSS</span>
          <button onClick={copy} className="btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
            {copied ? '✓ Copied!' : '📋 Copy CSS'}
          </button>
        </div>
        <pre style={{ margin: 0, padding: '1rem', color: 'var(--accent)', fontFamily: 'monospace', fontSize: '0.85rem', overflowX: 'auto', whiteSpace: 'pre' }}>
          {css}
        </pre>
      </div>
    </div>
  );
}
