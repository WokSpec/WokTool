'use client';

import { useState, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Keyframe {
  id: string;
  stop: number; // 0-100
  translateX: number; // px
  translateY: number;
  rotate: number; // deg
  scale: number;
  opacity: number;
  bgColor: string;
}

interface AnimConfig {
  name: string;
  duration: number;
  timingFn: string;
  delay: number;
  iterationCount: string;
  direction: string;
  fillMode: string;
  keyframes: Keyframe[];
}

// ─── Presets ─────────────────────────────────────────────────────────────────

const PRESETS: Record<string, Partial<AnimConfig>> = {
  'fade-in': { duration: 0.6, timingFn: 'ease', keyframes: [
    { id: '0', stop: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 0, bgColor: '#818cf8' },
    { id: '1', stop: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
  ]},
  'slide-in': { duration: 0.5, timingFn: 'ease-out', keyframes: [
    { id: '0', stop: 0, translateX: -60, translateY: 0, rotate: 0, scale: 1, opacity: 0, bgColor: '#818cf8' },
    { id: '1', stop: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
  ]},
  'bounce': { duration: 0.8, timingFn: 'ease', keyframes: [
    { id: '0', stop: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
    { id: '1', stop: 40, translateX: 0, translateY: -30, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
    { id: '2', stop: 60, translateX: 0, translateY: -15, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
    { id: '3', stop: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
  ]},
  'spin': { duration: 1, timingFn: 'linear', iterationCount: 'infinite', keyframes: [
    { id: '0', stop: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
    { id: '1', stop: 100, translateX: 0, translateY: 0, rotate: 360, scale: 1, opacity: 1, bgColor: '#818cf8' },
  ]},
  'pulse': { duration: 1, timingFn: 'ease-in-out', iterationCount: 'infinite', direction: 'alternate', keyframes: [
    { id: '0', stop: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
    { id: '1', stop: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1.3, opacity: 0.7, bgColor: '#6366f1' },
  ]},
  'shake': { duration: 0.5, timingFn: 'ease-in-out', keyframes: [
    { id: '0', stop: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#f87171' },
    { id: '1', stop: 20, translateX: -8, translateY: 0, rotate: -3, scale: 1, opacity: 1, bgColor: '#f87171' },
    { id: '2', stop: 40, translateX: 8, translateY: 0, rotate: 3, scale: 1, opacity: 1, bgColor: '#f87171' },
    { id: '3', stop: 60, translateX: -6, translateY: 0, rotate: -2, scale: 1, opacity: 1, bgColor: '#f87171' },
    { id: '4', stop: 80, translateX: 6, translateY: 0, rotate: 2, scale: 1, opacity: 1, bgColor: '#f87171' },
    { id: '5', stop: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#f87171' },
  ]},
};

const DEFAULT_CONFIG: AnimConfig = {
  name: 'my-animation',
  duration: 1,
  timingFn: 'ease',
  delay: 0,
  iterationCount: '1',
  direction: 'normal',
  fillMode: 'none',
  keyframes: [
    { id: '0', stop: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
    { id: '1', stop: 100, translateX: 0, translateY: 20, rotate: 0, scale: 1, opacity: 0, bgColor: '#818cf8' },
  ],
};

// ─── CSS generation ──────────────────────────────────────────────────────────

function generateCss(config: AnimConfig): string {
  const kfLines = [...config.keyframes]
    .sort((a, b) => a.stop - b.stop)
    .map(kf => {
      const transforms: string[] = [];
      if (kf.translateX || kf.translateY) transforms.push(`translate(${kf.translateX}px, ${kf.translateY}px)`);
      if (kf.rotate) transforms.push(`rotate(${kf.rotate}deg)`);
      if (kf.scale !== 1) transforms.push(`scale(${kf.scale})`);
      const rules: string[] = [];
      if (transforms.length) rules.push(`  transform: ${transforms.join(' ')};`);
      if (kf.opacity !== 1) rules.push(`  opacity: ${kf.opacity};`);
      rules.push(`  background-color: ${kf.bgColor};`);
      return `  ${kf.stop}% {\n${rules.join('\n')}\n  }`;
    })
    .join('\n');

  const animProp = [
    `${config.duration}s`,
    config.timingFn,
    config.delay ? `${config.delay}s` : '',
    config.iterationCount,
    config.direction !== 'normal' ? config.direction : '',
    config.fillMode !== 'none' ? config.fillMode : '',
  ].filter(Boolean).join(' ');

  return `@keyframes ${config.name} {\n${kfLines}\n}\n\n.animated-element {\n  animation: ${config.name} ${animProp};\n}`;
}

function kfStyle(kf: Keyframe): React.CSSProperties {
  const transforms: string[] = [];
  if (kf.translateX || kf.translateY) transforms.push(`translate(${kf.translateX}px, ${kf.translateY}px)`);
  if (kf.rotate) transforms.push(`rotate(${kf.rotate}deg)`);
  if (kf.scale !== 1) transforms.push(`scale(${kf.scale})`);
  return {
    ...(transforms.length ? { transform: transforms.join(' ') } : {}),
    opacity: kf.opacity,
    backgroundColor: kf.bgColor,
  };
}

let kfIdCounter = 10;

// ─── Component ───────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 940 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  label: { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
  group: { display: 'flex', flexDirection: 'column' as const, gap: 6 },
  input: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.55rem 0.75rem', color: 'var(--text)', fontSize: '0.875rem', width: '100%', boxSizing: 'border-box' as const },
  select: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.55rem 0.75rem', color: 'var(--text)', fontSize: '0.875rem', cursor: 'pointer', width: '100%', boxSizing: 'border-box' as const },
  card: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem' },
  kfRow: { display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr 1fr auto auto', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem' },
  kfInput: { background: 'var(--bg-elevated, #161616)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.35rem 0.4rem', color: 'var(--text)', fontSize: '0.78rem', width: '100%', boxSizing: 'border-box' as const },
  previewBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160, background: 'repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px', borderRadius: 10, border: '1px solid var(--border)' },
  textarea: { width: '100%', background: 'var(--bg-elevated, #161616)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono, monospace)', resize: 'vertical' as const, boxSizing: 'border-box' as const, minHeight: 180 },
};

export default function CssAnimationClient() {
  const [config, setConfig] = useState<AnimConfig>(DEFAULT_CONFIG);
  const [animKey, setAnimKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const css = generateCss(config);

  const update = (patch: Partial<AnimConfig>) => setConfig(c => ({ ...c, ...patch }));

  const updateKf = (id: string, patch: Partial<Keyframe>) => {
    setConfig(c => ({ ...c, keyframes: c.keyframes.map(k => k.id === id ? { ...k, ...patch } : k) }));
  };

  const addKf = () => {
    const newId = String(kfIdCounter++);
    setConfig(c => ({ ...c, keyframes: [...c.keyframes, { id: newId, stop: 50, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' }] }));
  };

  const removeKf = (id: string) => {
    setConfig(c => ({ ...c, keyframes: c.keyframes.filter(k => k.id !== id) }));
  };

  const applyPreset = (name: string) => {
    const p = PRESETS[name];
    if (!p) return;
    setConfig(c => ({ ...c, name, ...p, keyframes: p.keyframes!.map((k, i) => ({ ...k, id: String(i) })) }));
    setTimeout(() => setAnimKey(k => k + 1), 50);
  };

  const replay = () => setAnimKey(k => k + 1);

  const copy = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Inject keyframe CSS into a style tag
  const styleId = 'css-anim-preview-style';
  useEffect(() => {
    const animStyle = `
      @keyframes ${config.name} {
        ${[...config.keyframes].sort((a,b) => a.stop - b.stop).map(kf => {
          const transforms: string[] = [];
          if (kf.translateX || kf.translateY) transforms.push(`translate(${kf.translateX}px, ${kf.translateY}px)`);
          if (kf.rotate) transforms.push(`rotate(${kf.rotate}deg)`);
          if (kf.scale !== 1) transforms.push(`scale(${kf.scale})`);
          return `${kf.stop}% { ${transforms.length ? `transform: ${transforms.join(' ')};` : ''} opacity: ${kf.opacity}; background-color: ${kf.bgColor}; }`;
        }).join(' ')}
      }
    `;
    let el = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!el) { el = document.createElement('style'); el.id = styleId; document.head.appendChild(el); }
    el.textContent = animStyle;
  }, [config]);

  const previewStyle: React.CSSProperties = {
    width: 80, height: 80, borderRadius: 12,
    backgroundColor: config.keyframes[0]?.bgColor ?? '#818cf8',
    animationName: config.name,
    animationDuration: `${config.duration}s`,
    animationTimingFunction: config.timingFn,
    animationDelay: `${config.delay}s`,
    animationIterationCount: config.iterationCount,
    animationDirection: config.direction as any,
    animationFillMode: config.fillMode as any,
  };

  return (
    <div style={S.root}>
      {/* Presets */}
      <div>
        <div style={{ ...S.label, marginBottom: 8 }}>Presets</div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {Object.keys(PRESETS).map(p => (
            <button key={p} className="btn-secondary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }} onClick={() => applyPreset(p)}>{p}</button>
          ))}
        </div>
      </div>

      <div style={S.twoCol}>
        {/* Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <div style={S.group}><div style={S.label}>Name</div><input style={S.input} value={config.name} onChange={e => update({ name: e.target.value })} /></div>
            <div style={S.group}><div style={S.label}>Duration (s)</div><input type="number" step={0.1} min={0.1} style={S.input} value={config.duration} onChange={e => update({ duration: parseFloat(e.target.value) || 1 })} /></div>
            <div style={S.group}><div style={S.label}>Timing</div>
              <select style={S.select} value={config.timingFn} onChange={e => update({ timingFn: e.target.value })}>
                {['ease','linear','ease-in','ease-out','ease-in-out'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={S.group}><div style={S.label}>Delay (s)</div><input type="number" step={0.1} min={0} style={S.input} value={config.delay} onChange={e => update({ delay: parseFloat(e.target.value) || 0 })} /></div>
            <div style={S.group}><div style={S.label}>Iteration</div><input style={S.input} value={config.iterationCount} onChange={e => update({ iterationCount: e.target.value })} placeholder="1 or infinite" /></div>
            <div style={S.group}><div style={S.label}>Direction</div>
              <select style={S.select} value={config.direction} onChange={e => update({ direction: e.target.value })}>
                {['normal','reverse','alternate','alternate-reverse'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={S.group}><div style={S.label}>Fill mode</div>
              <select style={S.select} value={config.fillMode} onChange={e => update({ fillMode: e.target.value })}>
                {['none','forwards','backwards','both'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          {/* Keyframes */}
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={S.label}>Keyframes</div>
              <button className="btn-ghost" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={addKf}>+ Add</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '38px 55px 55px 48px 44px 44px 36px 24px', gap: '0.3rem', marginBottom: 6 }}>
              {['Stop%','TX px','TY px','Rot°','Scale','Opacity','Color',''].map(h => <div key={h} style={{ fontSize: '0.68rem', color: 'var(--text-faint, rgba(255,255,255,0.2))', fontWeight: 600 }}>{h}</div>)}
            </div>
            {[...config.keyframes].sort((a, b) => a.stop - b.stop).map(kf => (
              <div key={kf.id} style={{ display: 'grid', gridTemplateColumns: '38px 55px 55px 48px 44px 44px 36px 24px', gap: '0.3rem', marginBottom: '0.3rem', alignItems: 'center' }}>
                <input type="number" min={0} max={100} style={S.kfInput} value={kf.stop} onChange={e => updateKf(kf.id, { stop: Number(e.target.value) })} />
                <input type="number" style={S.kfInput} value={kf.translateX} onChange={e => updateKf(kf.id, { translateX: Number(e.target.value) })} />
                <input type="number" style={S.kfInput} value={kf.translateY} onChange={e => updateKf(kf.id, { translateY: Number(e.target.value) })} />
                <input type="number" style={S.kfInput} value={kf.rotate} onChange={e => updateKf(kf.id, { rotate: Number(e.target.value) })} />
                <input type="number" step={0.1} min={0} max={5} style={S.kfInput} value={kf.scale} onChange={e => updateKf(kf.id, { scale: Number(e.target.value) })} />
                <input type="number" step={0.1} min={0} max={1} style={S.kfInput} value={kf.opacity} onChange={e => updateKf(kf.id, { opacity: Number(e.target.value) })} />
                <input type="color" style={{ ...S.kfInput, padding: '0.1rem', height: 28, cursor: 'pointer' }} value={kf.bgColor} onChange={e => updateKf(kf.id, { bgColor: e.target.value })} />
                {config.keyframes.length > 2 ? (
                  <button onClick={() => removeKf(kf.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}>×</button>
                ) : <span />}
              </div>
            ))}
          </div>
        </div>

        {/* Preview + CSS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Preview */}
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={S.label}>Live Preview</div>
              <button className="btn-ghost" style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }} onClick={replay}>▶ Replay</button>
            </div>
            <div style={S.previewBox}>
              <div key={animKey} style={previewStyle} />
            </div>
          </div>

          {/* Generated CSS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={S.label}>Generated CSS</div>
              <button className="btn-ghost" style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }} onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
            </div>
            <textarea style={S.textarea} value={css} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}
