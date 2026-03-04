'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

type Mode = 'work' | 'short' | 'long';

interface Session {
  id: number;
  task: string;
  mode: Mode;
  completedAt: string;
}

function playBeep(ctx: AudioContext, freq: number = 880, duration: number = 0.3) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playDone(ctx: AudioContext) {
  // 3 ascending beeps
  playBeep(ctx, 523, 0.2);
  setTimeout(() => playBeep(ctx, 659, 0.2), 250);
  setTimeout(() => playBeep(ctx, 784, 0.35), 500);
}

const MODE_LABELS: Record<Mode, string> = {
  work: '🎯 Work',
  short: '☕ Short Break',
  long: '🛋️ Long Break',
};

const MODE_COLORS: Record<Mode, string> = {
  work: '#818cf8',
  short: '#34d399',
  long: '#60a5fa',
};

const SVG_SIZE = 240;
const STROKE_W = 12;
const RADIUS = (SVG_SIZE - STROKE_W * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function PomodoroClient() {
  const [workDur, setWorkDur] = useState(25);
  const [shortDur, setShortDur] = useState(5);
  const [longDur, setLongDur] = useState(15);
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [task, setTask] = useState('');
  const [history, setHistory] = useState<Session[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionIdRef = useRef(0);

  const totalTime = mode === 'work' ? workDur * 60 : mode === 'short' ? shortDur * 60 : longDur * 60;
  const progress = timeLeft / totalTime;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const color = MODE_COLORS[mode];

  function getAudioCtx(): AudioContext {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }

  function switchMode(m: Mode) {
    setMode(m);
    setRunning(false);
    setTimeLeft(m === 'work' ? workDur * 60 : m === 'short' ? shortDur * 60 : longDur * 60);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function handleComplete() {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const ctx = getAudioCtx();
    playDone(ctx);

    if (mode === 'work') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      setHistory(h => [...h, {
        id: ++sessionIdRef.current,
        task: task || 'Untitled',
        mode: 'work',
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      // Auto-switch to break
      const nextMode: Mode = newCount % 4 === 0 ? 'long' : 'short';
      setMode(nextMode);
      setTimeLeft(nextMode === 'long' ? longDur * 60 : shortDur * 60);
    } else {
      setMode('work');
      setTimeLeft(workDur * 60);
    }
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode]);

  function toggleRun() {
    if (!running) getAudioCtx(); // unlock audio on first click
    setRunning(r => !r);
  }

  function reset() {
    setRunning(false);
    setTimeLeft(mode === 'work' ? workDur * 60 : mode === 'short' ? shortDur * 60 : longDur * 60);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function applySettings() {
    setShowSettings(false);
    if (!running) {
      setTimeLeft(mode === 'work' ? workDur * 60 : mode === 'short' ? shortDur * 60 : longDur * 60);
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 600, margin: '0 auto' }}>
      {/* Mode selector */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        {(['work','short','long'] as Mode[]).map(m => (
          <button key={m} onClick={() => switchMode(m)}
            className={mode === m ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Task input */}
      <input value={task} onChange={e => setTask(e.target.value)} placeholder="What are you working on?"
        style={{ ...s, width: '100%', boxSizing: 'border-box', textAlign: 'center', fontSize: '1rem' }} />

      {/* SVG Timer */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: SVG_SIZE, height: SVG_SIZE }}>
          <svg width={SVG_SIZE} height={SVG_SIZE} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={SVG_SIZE / 2} cy={SVG_SIZE / 2} r={RADIUS}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE_W}
            />
            <circle
              cx={SVG_SIZE / 2} cy={SVG_SIZE / 2} r={RADIUS}
              fill="none" stroke={color} strokeWidth={STROKE_W}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700, fontFamily: 'monospace', color, letterSpacing: '-2px' }}>
              {formatTime(timeLeft)}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
              {MODE_LABELS[mode]}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={reset} className="btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>↺ Reset</button>
        <button onClick={toggleRun} className="btn-primary"
          style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem', fontWeight: 700, minWidth: 120, background: color, border: 'none' }}>
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button onClick={() => setShowSettings(s => !s)} className="btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>⚙️</button>
      </div>

      {/* Session counter */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i < (sessionCount % 4) || (sessionCount % 4 === 0 && sessionCount > 0 && i < 4) ? color : 'var(--bg-elevated)', border: `2px solid ${color}`, transition: 'background 0.3s' }} />
        ))}
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginLeft: 8 }}>
          {sessionCount} session{sessionCount !== 1 ? 's' : ''} completed
        </span>
      </div>

      {/* Settings */}
      {showSettings && (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ margin: 0, color: 'var(--text)', fontWeight: 600 }}>⚙️ Settings (minutes)</h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Work', val: workDur, set: setWorkDur },
              { label: 'Short Break', val: shortDur, set: setShortDur },
              { label: 'Long Break', val: longDur, set: setLongDur },
            ].map(({ label, val, set }) => (
              <div key={label}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: 4 }}>{label}</label>
                <input type="number" min={1} max={120} value={val} onChange={e => set(parseInt(e.target.value) || 1)}
                  style={{ ...s, width: 70 }} />
              </div>
            ))}
          </div>
          <button onClick={applySettings} className="btn-primary" style={{ alignSelf: 'flex-start', padding: '0.4rem 1rem' }}>Apply</button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem' }}>
          <h4 style={{ margin: '0 0 0.75rem', color: 'var(--text)', fontWeight: 600, fontSize: '0.9rem' }}>📋 Today's Sessions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {history.slice().reverse().map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.75rem', background: 'var(--bg-surface)', borderRadius: 6 }}>
                <span style={{ color: 'var(--text)', fontSize: '0.85rem' }}>🎯 {s.task}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{s.completedAt}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setHistory([])} className="btn-secondary" style={{ marginTop: '0.75rem', padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>Clear history</button>
        </div>
      )}
    </div>
  );
}
