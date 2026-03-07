'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Slider from '@/components/ui/Slider';
import Tabs from '@/components/ui/Tabs';

type Mode = 'work' | 'short' | 'long';

interface Session {
  id: string;
  task: string;
  mode: Mode;
  completedAt: string;
}

const MODE_CONFIG = {
  work: { label: 'Focus', icon: '🎯', color: 'var(--accent)', bg: 'bg-accent/10' },
  short: { label: 'Short Break', icon: '☕', color: 'var(--success)', bg: 'bg-success/10' },
  long: { label: 'Long Break', icon: '🛋️', color: 'var(--info)', bg: 'bg-info/10' },
};

function playBeep(ctx: AudioContext, freq = 880, duration = 0.3) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playDone(ctx: AudioContext) {
  playBeep(ctx, 523, 0.2);
  setTimeout(() => playBeep(ctx, 659, 0.2), 200);
  setTimeout(() => playBeep(ctx, 784, 0.4), 400);
}

const SVG_SIZE = 300;
const STROKE_W = 10;
const RADIUS = (SVG_SIZE - STROKE_W * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function PomodoroClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

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

  const currentTotal = useMemo(() => {
    if (mode === 'work') return workDur * 60;
    if (mode === 'short') return shortDur * 60;
    return longDur * 60;
  }, [mode, workDur, shortDur, longDur]);

  const progress = timeLeft / currentTotal;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const activeColor = MODE_CONFIG[mode].color;

  const handleComplete = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    if (audioCtxRef.current) playDone(audioCtxRef.current);

    if (mode === 'work') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      setHistory(h => [{
        id: crypto.randomUUID(),
        task: task || 'Untitled Session',
        mode: mode as Mode,
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }, ...h].slice(0, 10));

      const nextMode: Mode = newCount % 4 === 0 ? 'long' : 'short';
      setMode(nextMode);
      setTimeLeft((nextMode === 'long' ? longDur : shortDur) * 60);
    } else {
      setMode('work');
      setTimeLeft(workDur * 60);
    }
  }, [mode, sessionCount, task, workDur, shortDur, longDur]);

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
  }, [running, handleComplete]);

  const toggleTimer = () => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    setRunning(!running);
  };

  const resetTimer = () => {
    setRunning(false);
    setTimeLeft(currentTotal);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setRunning(false);
    setTimeLeft((m === 'work' ? workDur : m === 'short' ? shortDur : longDur) * 60);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Settings & History */}
        <div className="space-y-6">
            <Card title="Controls">
                <div className="space-y-6">
                    <Tabs 
                        activeTab={mode}
                        onChange={id => switchMode(id as Mode)}
                        tabs={[
                            { id: 'work', label: 'Work' },
                            { id: 'short', label: 'Short' },
                            { id: 'long', label: 'Long' },
                        ]}
                    />
                    <Input 
                        placeholder="Current Task..." 
                        value={task} 
                        onChange={e => setTask(e.target.value)}
                        className="text-center"
                    />
                    <div className="flex gap-2">
                        <Button variant="secondary" className="flex-1" onClick={() => setShowSettings(!showSettings)}>
                            {showSettings ? 'Close Settings' : 'Settings'}
                        </Button>
                        <Button variant="ghost" onClick={resetTimer}>Reset</Button>
                    </div>
                </div>
            </Card>

            {showSettings && (
                <Card title="Timer Durations" className="animate-in slide-in-from-top-2">
                    <div className="space-y-6">
                        <Slider label="Work" min={1} max={60} value={workDur} onChange={setWorkDur} unit="m" />
                        <Slider label="Short Break" min={1} max={30} value={shortDur} onChange={setShortDur} unit="m" />
                        <Slider label="Long Break" min={1} max={60} value={longDur} onChange={setLongDur} unit="m" />
                    </div>
                </Card>
            )}

            {history.length > 0 && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-[10px] font-black uppercase text-white/20 tracking-widest">Recent Sessions</h3>
                        <button onClick={() => setHistory([])} className="text-[10px] font-bold text-white/20 hover:text-white uppercase">Clear</button>
                    </div>
                    <div className="space-y-2">
                        {history.map(s => (
                            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs">🎯</span>
                                    <span className="text-xs font-bold text-white/70 truncate max-w-[120px]">{s.task}</span>
                                </div>
                                <span className="text-[10px] font-mono text-white/20">{s.completedAt}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Middle: Timer Visualization */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-8">
            <div className="relative group">
                <div className="absolute -inset-4 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                    <svg width={SVG_SIZE} height={SVG_SIZE} className="transform -rotate-90">
                        <circle
                            cx={SVG_SIZE / 2} cy={SVG_SIZE / 2} r={RADIUS}
                            fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={STROKE_W}
                        />
                        <circle
                            cx={SVG_SIZE / 2} cy={SVG_SIZE / 2} r={RADIUS}
                            fill="none" stroke={activeColor} strokeWidth={STROKE_W}
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">{MODE_CONFIG[mode].label}</div>
                        <div className="text-6xl font-black text-white font-mono tracking-tighter" style={{ color: activeColor }}>
                            {formatTime(timeLeft)}
                        </div>
                        <div className="mt-4 flex gap-1">
                            {[0,1,2,3].map(i => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i < (sessionCount % 4) ? 'bg-accent w-4' : 'bg-white/10'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 w-full max-w-sm">
                <Button 
                    className="flex-1 py-6 text-xl" 
                    onClick={toggleTimer}
                    variant={running ? 'secondary' : 'primary'}
                    style={{ background: !running ? activeColor : undefined }}
                >
                    {running ? 'Pause' : 'Start Focus'}
                </Button>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-4 items-start opacity-40 max-w-md">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 text-xl">💡</div>
                <p className="text-xs text-white/40 leading-relaxed italic">
                    The Pomodoro Technique uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
