'use client';

import { useState } from 'react';
import { marked } from 'marked';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Tabs from '@/components/ui/Tabs';

marked.setOptions({ gfm: true, breaks: true });

const DEFAULT_MD = `# Hello World

This is **markdown** converted to **HTML**.

- Item 1
- Item 2

\`\`\`js
console.log("ready");
\`\`\`
`;

export default function MdToHtmlTool() {
  const [md, setMd] = useState(DEFAULT_MD);
  const [activeTab, setActiveTab] = useState<'preview' | 'html'>('preview');

  const html = marked(md) as string;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Markdown Input</h3>
                    <Button variant="ghost" size="sm" onClick={() => setMd('')} className="h-7 text-[10px]">Clear</Button>
                </div>
                <Textarea 
                    value={md}
                    onChange={e => setMd(e.target.value)}
                    placeholder="Type markdown here..."
                    className="min-h-[400px] font-mono text-sm"
                />
            </div>
        </div>

        <div className="space-y-6 flex flex-col">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Output</h3>
                <Tabs 
                    activeTab={activeTab}
                    onChange={id => setActiveTab(id as any)}
                    tabs={[{ id: 'preview', label: 'Preview', icon: '👁️' }, { id: 'html', label: 'HTML Source', icon: '📄' }]}
                    className="scale-90 origin-right"
                />
            </div>

            <div className="flex-1 min-h-[400px]">
                {activeTab === 'preview' ? (
                    <Card className="h-full bg-white/[0.01] border-white/5 prose prose-invert prose-sm max-w-none p-8 overflow-auto custom-scrollbar">
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                    </Card>
                ) : (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                        <CodeBlock code={html} language="xml" maxHeight="450px" />
                        <Button variant="primary" className="w-full" size="lg" onClick={() => navigator.clipboard.writeText(html)}>
                            Copy HTML Code
                        </Button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
