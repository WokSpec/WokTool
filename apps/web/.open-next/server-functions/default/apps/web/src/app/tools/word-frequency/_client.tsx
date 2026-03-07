'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Switch from '@/components/ui/Switch';

const STOP_WORDS = new Set(['a','an','the','and','or','but','in','on','at','to','for','of','with','by','from','up','about','into','through','during','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','shall','should','may','might','must','can','could','not','that','this','these','those','it','its','i','me','my','we','us','our','you','your','he','him','his','she','her','they','them','their','what','which','who','whom','when','where','why','how','all','each','every','both','more','most','other','some','such','no','nor','so','yet','as','if','then','than','too','very','just','also','here','there','now','only','even','well','back','any']);

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

export default function WordFrequencyClient() {
  const [text, setText] = useState('');
  const [ignoreStop, setIgnoreStop] = useState(true);

  const stats = useMemo(() => {
    if (!text.trim()) return null;
    const tokens = text.match(/\b[a-zA-Z']+\b/g) ?? [];
    const freq: Record<string, number> = {};
    
    tokens.forEach(t => {
      const w = t.toLowerCase();
      if (ignoreStop && STOP_WORDS.has(w)) return;
      freq[w] = (freq[w] || 0) + 1;
    });

    const entries = Object.entries(freq)
      .map(([word, count]) => ({ word, count, pct: (count / tokens.length) * 100 }))
      .sort((a, b) => b.count - a.count);

    return {
      entries,
      total: tokens.length,
      unique: entries.length,
      flesch: fleschReadingEase(text),
      avgLen: tokens.length ? tokens.reduce((s, w) => s + w.length, 0) / tokens.length : 0
    };
  }, [text, ignoreStop]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input */}
        <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Source Text</h3>
                    <Button variant="ghost" size="sm" onClick={() => setText('')} className="h-7 text-[10px]">Clear</Button>
                </div>
                <Textarea 
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Paste article, essay, or code comments here..."
                    className="min-h-[400px] leading-relaxed text-sm"
                />
            </div>
        </div>

        {/* Right: Controls & Stats */}
        <div className="space-y-6">
            <Card title="Analysis Settings">
                <Switch 
                    label="Filter Stop Words"
                    description="Ignore common words like 'the', 'is', 'at'"
                    checked={ignoreStop}
                    onChange={setIgnoreStop}
                />
            </Card>

            {stats && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <div className="text-[10px] font-black text-white/20 uppercase mb-1">Total Words</div>
                            <div className="text-xl font-bold text-white">{stats.total}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <div className="text-[10px] font-black text-white/20 uppercase mb-1">Unique</div>
                            <div className="text-xl font-bold text-white">{stats.unique}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <div className="text-[10px] font-black text-white/20 uppercase mb-1">Readability</div>
                            <div className="text-xl font-bold text-accent">{stats.flesch}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <div className="text-[10px] font-black text-white/20 uppercase mb-1">Avg Length</div>
                            <div className="text-xl font-bold text-white">{stats.avgLen.toFixed(1)}</div>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10">
                        <h4 className="text-sm font-bold text-white mb-2">Reading Ease</h4>
                        <p className="text-xs text-white/40 leading-relaxed">
                            A score of <strong>{stats.flesch}</strong> indicates this text is {stats.flesch > 60 ? 'easy' : 'challenging'} to read. (Flesch-Kincaid Scale)
                        </p>
                    </div>
                </div>
            )}
        </div>
      </div>

      {stats && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Frequency Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.entries.slice(0, 48).map((e, i) => (
                    <div key={e.word} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-raised border border-white/5 group hover:border-white/10 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/20 group-hover:text-accent transition-colors">
                            {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-bold text-white truncate pr-2">{e.word}</span>
                                <span className="text-xs font-mono text-accent">{e.count}</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent/40" style={{ width: `${(e.count / stats.entries[0].count) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {stats.unique > 48 && (
                <p className="text-center text-[10px] text-white/20 uppercase font-bold py-4">Showing top 48 unique words</p>
            )}
        </div>
      )}
    </div>
  );
}
