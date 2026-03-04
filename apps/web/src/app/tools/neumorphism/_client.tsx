'use client';
import { useState, useMemo } from 'react';

type Shape = 'flat' | 'concave' | 'convex' | 'pressed';

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r, g, b];
}

function adjustBrightness(r: number, g: number, b: number, factor: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `rgb(${clamp(r*factor)}, ${clamp(g*factor)}, ${clamp(b*factor)})`;
}

function getNeumorphCSS(bg: string, size: number, radius: number, distance: number, blur: number, intensity: number, shape: Shape, dark: boolean): { css: string; lightColor: string; darkColor: string; gradientCSS: string } {
  const [r, g, b] = hexToRgb(bg);
  const lightFactor = dark ? 1 + intensity * 0.4 : 1 + intensity * 0.35;
  const darkFactor  = dark ? 1 - intensity * 0.4 : 1 - intensity * 0.3;
  const lightColor = adjustBrightness(r, g, b, lightFactor);
  const darkColor  = adjustBrightness(r, g, b, darkFactor);

  let boxShadow: string;
  let gradientCSS = '';

  if (shape === 'pressed') {
    boxShadow = `inset ${distance}px ${distance}px ${blur}px ${darkColor}, inset -${distance}px -${distance}px ${blur}px ${lightColor}`;
  } else {
    boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
  }

  if (shape === 'concave') {
    gradientCSS = `\n  background: linear-gradient(145deg, ${darkColor}, ${lightColor});`;
  } else if (shape === 'convex') {
    gradientCSS = `\n  background: linear-gradient(145deg, ${lightColor}, ${darkColor});`;
  }

  const radiusPx = `${Math.round(size * radius / 100)}px`;
  const css = `.element {
  width: ${size}px;
  height: ${size}px;
  border-radius: ${radiusPx};
  background: ${bg};${gradientCSS}
  box-shadow: ${boxShadow};
}`;

  return { css, lightColor, darkColor, gradientCSS };
}

export default function NeumorphismClient() {
  const [bgColor, setBgColor] = useState('#e0e5ec');
  const [size, setSize] = useState(200);
  const [radius, setRadius] = useState(20);
  const [distance, setDistance] = useState(20);
  const [blur, setBlur] = useState(40);
  const [intensity, setIntensity] = useState(0.5);
  const [shape, setShape] = useState<Shape>('flat');
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentBg = darkMode ? '#2d2d2d' : bgColor;

  const { css, lightColor, darkColor, gradientCSS } = useMemo(
    () => getNeumorphCSS(currentBg, size, radius, distance, blur, intensity, shape, darkMode),
    [currentBg, size, radius, distance, blur, intensity, shape, darkMode]
  );

  const radiusPx = Math.round(size * radius / 100);

  let boxShadow: string;
  if (shape === 'pressed') {
    boxShadow = `inset ${distance}px ${distance}px ${blur}px ${darkColor}, inset -${distance}px -${distance}px ${blur}px ${lightColor}`;
  } else {
    boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
  }

  let bgStyle = currentBg;
  if (shape === 'concave') bgStyle = `linear-gradient(145deg, ${darkColor}, ${lightColor})`;
  if (shape === 'convex') bgStyle = `linear-gradient(145deg, ${lightColor}, ${darkColor})`;

  async function copy() {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const sliderStyle: React.CSSProperties = { width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' };
  const labelStyle: React.CSSProperties = { color: 'var(--text-muted)', fontSize: '0.8rem' };
  const valStyle: React.CSSProperties = { color: 'var(--accent)', fontFamily: 'monospace', fontSize: '0.82rem', minWidth: 40, textAlign: 'right' as const };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Controls */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, color: 'var(--text)', fontSize: '0.95rem', fontWeight: 600 }}>Controls</h3>
            <button onClick={() => setDarkMode(d => !d)} className={darkMode ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>
              {darkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>

          {!darkMode && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={labelStyle}>Background Color</span>
              </div>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                style={{ width: '100%', height: 36, border: '1px solid var(--border)', borderRadius: 8, background: 'none', cursor: 'pointer', padding: '2px' }} />
            </div>
          )}

          <div>
            <span style={{ ...labelStyle, display: 'block', marginBottom: 6 }}>Shape</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {(['flat','concave','convex','pressed'] as Shape[]).map(s => (
                <button key={s} onClick={() => setShape(s)}
                  className={shape === s ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '0.4rem 0.5rem', fontSize: '0.82rem', textTransform: 'capitalize' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {[
            { label: 'Size', value: size, set: setSize, min: 80, max: 300, step: 10, unit: 'px' },
            { label: 'Radius', value: radius, set: setRadius, min: 0, max: 50, step: 1, unit: '%' },
            { label: 'Distance', value: distance, set: setDistance, min: 1, max: 50, step: 1, unit: 'px' },
            { label: 'Blur', value: blur, set: setBlur, min: 1, max: 100, step: 1, unit: 'px' },
            { label: 'Intensity', value: intensity, set: setIntensity, min: 0.1, max: 1, step: 0.05, unit: '' },
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
        </div>

        {/* Live Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ borderRadius: 10, overflow: 'hidden', minHeight: 280, background: currentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', border: '1px solid var(--border)' }}>
            <div style={{
              width: size,
              height: size,
              borderRadius: radiusPx,
              background: bgStyle,
              boxShadow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)',
              fontSize: '0.8rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}>
              {shape}
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0 }}>
            💡 Toggle light/dark mode to see both variants
          </p>
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
