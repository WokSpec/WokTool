'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

const KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'CROSS',
  'ON', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'LIKE', 'BETWEEN',
  'INSERT', 'INTO', 'UPDATE', 'DELETE', 'CREATE', 'TABLE', 'INDEX', 'DROP', 'ALTER',
  'ADD', 'SET', 'VALUES', 'HAVING', 'GROUP BY', 'ORDER BY', 'LIMIT', 'OFFSET',
  'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'UNION', 'ALL',
  'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'WITH', 'RETURNING',
];

const LINE_BREAK_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
  'OUTER JOIN', 'CROSS JOIN', 'ON', 'AND', 'OR', 'HAVING', 'GROUP BY',
  'ORDER BY', 'LIMIT', 'OFFSET', 'UNION', 'RETURNING', 'SET', 'VALUES',
  'INSERT INTO', 'UPDATE', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE',
]);

function formatSQL(raw: string): string {
  if (!raw.trim()) return '';
  let sql = raw.replace(/\s+/g, ' ').trim();
  const sortedKeywords = [...KEYWORDS].sort((a, b) => b.length - a.length);
  for (const kw of sortedKeywords) {
    const re = new RegExp('\\b' + kw.replace(/ /g, '\\s+') + '\\b', 'gi');
    sql = sql.replace(re, kw);
  }
  const breakers = [...LINE_BREAK_KEYWORDS].sort((a, b) => b.length - a.length);
  for (const br of breakers) {
    const re = new RegExp('\\s+' + br.replace(/ /g, '\\s+') + '\\b', 'gi');
    sql = sql.replace(re, '\n' + br);
  }
  const lines = sql.split(/\n+/).map(l => l.trim()).filter(Boolean);
  let outLines: string[] = [];
  for (const line of lines) {
    if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|WITH)\b/i.test(line)) {
      outLines.push(line);
      if (line.startsWith('SELECT')) {
        const rest = line.slice(6).trim();
        if (rest) {
          const cols = rest.split(/,\s*/).map(c => '  ' + c.trim());
          outLines = outLines.concat(cols);
        }
      }
    } else {
      outLines.push('  ' + line);
    }
  }
  return outLines.join('\n');
}

export default function SqlFormatterTool() {
  const [input, setInput] = useState('SELECT u.id, u.name, p.title FROM users u LEFT JOIN posts p ON u.id = p.user_id WHERE u.active = 1 AND p.published_at IS NOT NULL ORDER BY u.created_at DESC LIMIT 10;');
  const [output, setOutput] = useState('');

  const handleFormat = () => setOutput(formatSQL(input));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Raw SQL Query</h3>
                    <Button variant="ghost" size="sm" onClick={() => { setInput(''); setOutput(''); }} className="h-7 text-[10px]">Clear</Button>
                </div>
                <Textarea 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="SELECT * FROM table..."
                    className="min-h-[300px] font-mono text-sm leading-relaxed"
                    spellCheck={false}
                />
            </div>
            <Button onClick={handleFormat} className="w-full" size="lg" disabled={!input.trim()}>
                Format & Beautify
            </Button>
        </div>

        {/* Right: Output */}
        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Formatted Result</h3>
            {output ? (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                    <CodeBlock code={output} language="sql" maxHeight="450px" />
                    <Button variant="primary" className="w-full" size="lg" onClick={() => navigator.clipboard.writeText(output)}>
                        Copy SQL
                    </Button>
                </div>
            ) : (
                <div className="h-[400px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12 opacity-20">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 text-2xl">📊</div>
                    <p className="text-sm">Prettified SQL will appear here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
