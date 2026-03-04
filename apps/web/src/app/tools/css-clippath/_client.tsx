'use client';
import { useState, useRef, useCallback } from 'react';

type Point = { x: number; y: number };
type ShapeType = 'triangle' | 'diamond' | 'hexagon' | 'star' | 'pentagon' | 'arrow' | 'custom';

// Preset shapes (percentage coords 0-100)
const PRESETS: Record<ShapeType, Point[]> = {
  triangle:  [{ x:50,y:0 }, { x:100,y:100 }, { x:0,y:100 }],
  diamond:   [{ x:50,y:0 }, { x:100,y:50 }, { x:50,y:100 }, { x:0,y:50 }],
  hexagon:   [{ x:50,y:0 }, { x:100,y:25 }, { x:100,y:75 }, { x:50,y:100 }, { x:0,y:75 }, { x:0,y:25 }],
  star:      [
    { x:50,y:0 }, { x:61,y:35 }, { x:98,y:35 }, { x:68,y:57 },
    { x:79,y:91 }, { x:50,y:70 }, { x:21,y:91 }, { x:32,y:57 },
    { x:2,y:35 }, { x:39,y:35 },
  ],
  pentagon:  [{ x:50,y:0 }, { x:100,y:38 }, { x:82,y:100 }, { x:18,y:100 }, { x:0,y:38 }],
  arrow:     [{ x:0,y:25 }, { x:60,y:25 }, { x:60,y:0 }, { x:100,y:50 }, { x:60,y:100 }, { x:60,y:75 }, { x:0,y:75 }],
  custom:    [{ x:10,y:10 }, { x:90,y:10 }, { x:90,y:90 }, { x:10,y:90 }],
};

const PRESET_LABELS: { key: ShapeType; label: string }[] = [
  { key: 'triangle', label: '▲ Triangle' },
  { key: 'diamond',  label: '◆ Diamond'  },
  { key: 'hexagon',  label: '⬡ Hexagon'  },
  { key: 'star',     label: '★ Star'     },
  { key: 'pentagon', label: '⬠ Pentagon' },
  { key: 'arrow',    label: '➤ Arrow'    },
  { key: 'custom',   label: '✏ Custom'   },
];

const POINT_RADIUS = 8;
const CANVAS_W = 400;
const CANVAS_H = 280;

function pctToPx(p: Point): { px: number; py: number } {
  return { px: (p.x / 100) * CANVAS_W, py: (p.y / 100) * CANVAS_H };
}
function pxToPct(px: number, py: number): Point {
  return {
    x: Math.max(0, Math.min(100, (px / CANVAS_W) * 100)),
    y: Math.max(0, Math.min(100, (py / CANVAS_H) * 100)),
  };
}

function buildClipPath(points: Point[]): string {
  const coords = points.map(p => `${p.x.toFixed(1)}% ${p.y.toFixed(1)}%`).join(', ');
  return `polygon(${coords})`;
}

function buildCSS(clipPath: string, animate: boolean): string {
  const base = `.element {\n  clip-path: ${clipPath};\n}`;
  if (!animate) return base;
  // Generate a simple morph animation (current → slightly rotated version)
  return `${base}\n\n.element {\n  animation: clipMorph 3s ease-in-out infinite alternate;\n}\n\n@keyframes clipMorph {\n  from {\n    clip-path: ${clipPath};\n  }\n  to {\n    /* Modify points for end keyframe */\n    clip-path: ${clipPath};\n  }\n}`;
}

export default function CssClippathClient() {
  const [shape, setShape] = useState<ShapeType>('hexagon');
  const [points, setPoints] = useState<Point[]>(PRESETS['hexagon']);
  const [dragging, setDragging] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);
  const [bgColor, setBgColor] = useState('#818cf8');
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  function selectPreset(s: ShapeType) {
    setShape(s);
    setPoints([...PRESETS[s]]);
  }

  function getSVGCoords(e: React.MouseEvent): { x: number; y: number } | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_H,
    };
  }

  function onMouseDown(i: number) {
    setDragging(i);
  }

  function onSVGMouseMove(e: React.MouseEvent) {
    if (dragging === null) return;
    const coords = getSVGCoords(e);
    if (!coords) return;
    const pct = pxToPct(coords.x, coords.y);
    setPoints(pts => pts.map((p, i) => i === dragging ? pct : p));
  }

  function onSVGMouseUp() {
    setDragging(null);
  }

  function addPoint(e: React.MouseEvent) {
    if (dragging !== null) return;
    const coords = getSVGCoords(e);
    if (!coords) return;
    const pct = pxToPct(coords.x, coords.y);
    setPoints(pts => [...pts, pct]);
    setShape('custom');
  }

  function removePoint(i: number, e: React.MouseEvent) {
    e.stopPropagation();
    if (points.length <= 3) return;
    setPoints(pts => pts.filter((_, j) => j !== i));
  }

  const clipPath = buildClipPath(points);
  const css = buildCSS(clipPath, animate);
  const polygonStr = points.map(p => { const { px, py } = pctToPx(p); return `${px},${py}`; }).join(' ');

  async function copy() {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Presets */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {PRESET_LABELS.map(({ key, label }) => (
          <button key={key} onClick={() => selectPreset(key)}
            className={shape === key ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* SVG Editor */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Drag points · Double-click canvas to add · Right-click point to remove</div>
          <svg
            ref={svgRef}
            width="100%"
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            style={{ background: 'var(--bg-surface)', borderRadius: 8, cursor: dragging !== null ? 'grabbing' : 'crosshair', border: '1px solid var(--border)' }}
            onMouseMove={onSVGMouseMove}
            onMouseUp={onSVGMouseUp}
            onMouseLeave={onSVGMouseUp}
            onDoubleClick={addPoint}
          >
            {/* Clip shape fill */}
            <polygon points={polygonStr} fill="rgba(129,140,248,0.2)" stroke="var(--accent)" strokeWidth="1.5" />
            {/* Points */}
            {points.map((p, i) => {
              const { px, py } = pctToPx(p);
              return (
                <circle
                  key={i}
                  cx={px}
                  cy={py}
                  r={POINT_RADIUS}
                  fill={dragging === i ? 'var(--accent)' : 'white'}
                  stroke="var(--accent)"
                  strokeWidth="2"
                  style={{ cursor: 'grab' }}
                  onMouseDown={e => { e.preventDefault(); e.stopPropagation(); onMouseDown(i); }}
                  onContextMenu={e => { e.preventDefault(); removePoint(i, e); }}
                />
              );
            })}
            {/* Point labels */}
            {points.map((p, i) => {
              const { px, py } = pctToPx(p);
              return (
                <text key={i} x={px} y={py - 12} textAnchor="middle" fill="var(--text-muted)" fontSize="10">
                  {i + 1}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: 8 }}>Live Preview</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Color:</span>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: 36, height: 26, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 0 0 / 20px 20px', borderRadius: 8, padding: '1rem', minHeight: 160 }}>
              <div style={{
                width: 180,
                height: 120,
                background: bgColor,
                clipPath,
                transition: 'clip-path 0.2s ease',
              }} />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <input type="checkbox" checked={animate} onChange={e => setAnimate(e.target.checked)} style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
            Generate CSS animation keyframes
          </label>
        </div>
      </div>

      {/* CSS Output */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'monospace' }}>CSS Output</span>
          <button onClick={copy} className="btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
            {copied ? '✓ Copied!' : '📋 Copy CSS'}
          </button>
        </div>
        <pre style={{ margin: 0, padding: '1rem', color: 'var(--accent)', fontFamily: 'monospace', fontSize: '0.82rem', overflowX: 'auto', whiteSpace: 'pre' }}>
          {css}
        </pre>
      </div>
    </div>
  );
}
