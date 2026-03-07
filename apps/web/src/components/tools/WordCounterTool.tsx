'use client';

import { useState, useMemo } from 'react';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function WordCounterTool() {
  const [text, setText] = useState('');
  
  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const lines = text ? text.split('\n').length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);
    
    return [
      { label: 'Words', value: words, icon: '📝' },
      { label: 'Characters', value: chars, icon: '🔤' },
      { label: 'No Spaces', value: charsNoSpace, icon: '➖' },
      { label: 'Lines', value: lines, icon: '🗒️' },
      { label: 'Sentences', value: sentences, icon: '📍' },
      { label: 'Paragraphs', value: paragraphs, icon: '🧱' },
      { label: 'Read Time', value: `~${readingTime}m`, icon: '📖' },
      { label: 'Speak Time', value: `~${speakingTime}m`, icon: '🗣️' },
    ];
  }, [text]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">Input Text</h2>
        {text && (
          <Button variant="ghost" size="sm" onClick={() => setText('')}>
            Clear Text
          </Button>
        )}
      </div>

      <Textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your text here to analyze statistics..."
        className="min-h-[300px] text-base leading-relaxed"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4 flex flex-col items-center justify-center text-center group hover:border-accent/30 transition-all">
            <span className="text-2xl mb-2 opacity-80 group-hover:scale-110 transition-transform">{s.icon}</span>
            <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/30">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Helper Info */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <div>
            <h4 className="text-sm font-bold text-white/90 mb-1">How it works</h4>
            <p className="text-xs text-white/40 leading-relaxed">
                Our counter uses real-time regex-based splitting to accurately count words and sentences. Reading time is calculated based on an average adult reading speed of 200 words per minute, while speaking time is based on 130 words per minute.
            </p>
        </div>
      </div>
    </div>
  );
}
