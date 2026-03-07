'use client';

import { useState, useCallback, useRef } from 'react';
import { marked } from 'marked';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import Card from '@/components/ui/Card';

marked.setOptions({ gfm: true, breaks: true });

const TOOLBAR = [
  { label: 'B',    title: 'Bold',        wrap: ['**', '**'],     placeholder: 'bold text' },
  { label: 'I',    title: 'Italic',      wrap: ['*', '*'],       placeholder: 'italic text' },
  { label: '`',    title: 'Code',        wrap: ['`', '`'],       placeholder: 'code' },
  { label: 'H1',   title: 'Heading 1',   prefix: '# ',           placeholder: 'Heading' },
  { label: 'H2',   title: 'Heading 2',   prefix: '## ',          placeholder: 'Heading' },
  { label: 'Link',  title: 'Link',        wrap: ['[', '](url)'],  placeholder: 'link text' },
  { label: 'List',     title: 'List',        prefix: '- ',           placeholder: 'Item' },
  { label: 'Quote',    title: 'Quote',       prefix: '> ',           placeholder: 'Quote' },
  { label: 'Table',    title: 'Table',       table: true },
] as const;

const EXAMPLE = `# Markdown Professional Editor

Experience real-time GFM preview with industrial-grade styling.

## ✨ Features
- **Live Preview**: See your changes as you type.
- **GFM Support**: Tables, task lists, and more.
- **Quick Toolbar**: One-click formatting.

## 🛠️ Tech Stack
\`\`\`ts
import { marked } from 'marked';
const html = marked.parse(markdown);
\`\`\`

| Feature | Status |
| :--- | :--- |
| Speed | Fast |
| Privacy | 100% Client-side |
| Styling | Tailwind CSS |

> "The best way to predict the future is to create it."
`;

export default function MarkdownTool() {
  const [md, setMd] = useState(EXAMPLE);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const taRef = useRef<HTMLTextAreaElement>(null);

  const html = marked(md) as string;

  const insertAtCursor = useCallback((action: any) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = md.slice(start, end);

    let newText = '';
    let cursorPos = start;

    if (action.table) {
      const tbl = '\n| Header 1 | Header 2 |\n| :--- | :--- |\n| Cell 1 | Cell 2 |\n';
      newText = md.slice(0, start) + tbl + md.slice(end);
      cursorPos = start + tbl.length;
    } else if (action.prefix) {
      const lineStart = md.slice(0, start).lastIndexOf('\n') + 1;
      newText = md.slice(0, lineStart) + action.prefix + md.slice(lineStart);
      cursorPos = start + action.prefix.length;
    } else if (action.wrap) {
      const [before, after] = action.wrap;
      const inner = selected || action.placeholder || 'text';
      newText = md.slice(0, start) + before + inner + after + md.slice(end);
      cursorPos = start + before.length + inner.length + after.length;
    }

    setMd(newText);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  }, [md]);

  const words = md.trim() ? md.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-surface-raised border border-white/5 rounded-2xl">
        <div className="flex flex-wrap gap-1">
            {TOOLBAR.map((btn, i) => (
                <button
                    key={i}
                    title={btn.title}
                    onClick={() => insertAtCursor(btn)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all"
                >
                    {btn.label}
                </button>
            ))}
        </div>
        <div className="flex items-center gap-2 px-2">
            <Button variant="ghost" size="sm" onClick={() => setMd('')} className="h-8 text-[10px]">Clear</Button>
            <Button variant="ghost" size="sm" onClick={() => setMd(EXAMPLE)} className="h-8 text-[10px]">Example</Button>
        </div>
      </div>

      {/* Mobile Selector */}
      <div className="lg:hidden">
        <Tabs 
            activeTab={activeTab}
            onChange={id => setActiveTab(id as any)}
            tabs={[{id:'edit', label: 'Edit'}, {id:'preview', label: 'Preview'}]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
        {/* Editor */}
        <div className={`${activeTab === 'preview' ? 'hidden lg:block' : 'block'} flex flex-col space-y-4`}>
            <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Markdown Source</span>
                <span className="text-[10px] font-bold text-accent uppercase">{words} Words</span>
            </div>
            <textarea
                ref={taRef}
                value={md}
                onChange={e => setMd(e.target.value)}
                placeholder="Start writing..."
                className="flex-1 w-full p-6 rounded-3xl bg-[#0d0d0d] border border-white/10 text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none custom-scrollbar"
                spellCheck={false}
            />
        </div>

        {/* Preview */}
        <div className={`${activeTab === 'edit' ? 'hidden lg:block' : 'block'} flex flex-col space-y-4`}>
            <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Live Rendering</span>
                <button 
                    onClick={() => navigator.clipboard.writeText(html)}
                    className="text-[10px] font-bold text-white/40 hover:text-white uppercase transition-colors"
                >
                    Copy HTML
                </button>
            </div>
            <div className="flex-1 rounded-3xl bg-white/[0.02] border border-white/5 p-8 overflow-auto custom-scrollbar prose prose-invert prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </div>
      </div>
    </div>
  );
}
