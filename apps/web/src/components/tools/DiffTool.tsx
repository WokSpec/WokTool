'use client';

import { useState, useMemo } from 'react';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}

function computeDiff(original: string, modified: string): DiffLine[] {
  const a = original.split('\n');
  const b = modified.split('\n');
  const result: DiffLine[] = [];

  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i+1][j+1] + 1 : Math.max(dp[i+1][j], dp[i][j+1]);
    }
  }

  let i = 0, j = 0;
  while (i < m || j < n) {
    if (i < m && j < n && a[i] === b[j]) {
      result.push({ type: 'unchanged', text: a[i] });
      i++; j++;
    } else if (j < n && (i >= m || dp[i+1][j] >= dp[i][j+1])) {
      result.push({ type: 'added', text: b[j] });
      j++;
    } else {
      result.push({ type: 'removed', text: a[i] });
      i++;
    }
  }
  return result;
}

export default function DiffTool() {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [copied, setCopied] = useState(false);

  const diff = useMemo(() => {
    if (!original && !modified) return null;
    return computeDiff(original, modified);
  }, [original, modified]);

  const stats = useMemo(() => {
    if (!diff) return null;
    return {
      added: diff.filter(l => l.type === 'added').length,
      removed: diff.filter(l => l.type === 'removed').length,
      unchanged: diff.filter(l => l.type === 'unchanged').length,
    };
  }, [diff]);

  const copyDiff = () => {
    if (!diff) return;
    const text = diff.map(l => {
      const marker = l.type === 'added' ? '+' : l.type === 'removed' ? '-' : ' ';
      return `${marker} ${l.text}`;
    }).join('\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Original Text</label>
                <Button variant="ghost" size="sm" onClick={() => setOriginal('')} className="h-7 text-[10px]">Clear</Button>
            </div>
            <Textarea
                value={original}
                onChange={e => setOriginal(e.target.value)}
                placeholder="Paste original text here..."
                className="min-h-[200px] font-mono text-xs leading-relaxed"
                spellCheck={false}
            />
        </div>
        <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Modified Text</label>
                <Button variant="ghost" size="sm" onClick={() => setModified('')} className="h-7 text-[10px]">Clear</Button>
            </div>
            <Textarea
                value={modified}
                onChange={e => setModified(e.target.value)}
                placeholder="Paste modified text here..."
                className="min-h-[200px] font-mono text-xs leading-relaxed"
                spellCheck={false}
            />
        </div>
      </div>

      {diff && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="p-0 overflow-hidden border-white/10 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 bg-white/[0.03] border-b border-white/5">
                <div className="flex gap-4">
                    {stats && (
                        <>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-success" />
                                <span className="text-xs font-bold text-white/70">{stats.added} additions</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-danger" />
                                <span className="text-xs font-bold text-white/70">{stats.removed} removals</span>
                            </div>
                        </>
                    )}
                </div>
                <Button variant="secondary" size="sm" onClick={copyDiff}>
                    {copied ? 'Copied Unified Diff' : 'Copy Unified Diff'}
                </Button>
            </div>
            
            <div className="overflow-x-auto bg-[#0d0d0d]">
                <div className="min-w-full inline-block py-4">
                    {diff.map((line, i) => (
                        <div 
                            key={i} 
                            className={`
                                flex font-mono text-xs leading-6 px-6 group
                                ${line.type === 'added' ? 'bg-success/10' : ''}
                                ${line.type === 'removed' ? 'bg-danger/10' : ''}
                                ${line.type === 'unchanged' ? 'hover:bg-white/[0.02]' : ''}
                            `}
                        >
                            <span className={`
                                w-8 shrink-0 select-none font-bold
                                ${line.type === 'added' ? 'text-success' : ''}
                                ${line.type === 'removed' ? 'text-danger' : ''}
                                ${line.type === 'unchanged' ? 'text-white/20' : ''}
                            `}>
                                {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                            </span>
                            <span className={`
                                whitespace-pre break-all
                                ${line.type === 'added' ? 'text-success-hover' : ''}
                                ${line.type === 'removed' ? 'text-danger-hover' : ''}
                                ${line.type === 'unchanged' ? 'text-white/60' : ''}
                            `}>
                                {line.text || ' '}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
          </Card>
        </div>
      )}

      {!diff && (
        <div className="p-12 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 text-2xl">🔍</div>
            <h3 className="text-lg font-bold text-white/80 mb-1">Waiting for input</h3>
            <p className="text-sm text-white/30 max-w-xs">Paste text into both fields above to see a detailed line-by-line comparison.</p>
        </div>
      )}
    </div>
  );
}
