'use client';

import { useState, useEffect, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Textarea from '@/components/ui/Textarea';

interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  tags: string[];
  createdAt: number;
}

const LANGUAGES = [
    { value: 'plaintext', label: 'Plain Text' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'bash', label: 'Bash / Shell' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Go' },
    { value: 'css', label: 'CSS' },
    { value: 'html', label: 'HTML' },
    { value: 'json', label: 'JSON' },
    { value: 'sql', label: 'SQL' },
    { value: 'yaml', label: 'YAML' },
    { value: 'dockerfile', label: 'Dockerfile' },
];

const STORAGE_KEY = 'woktool_snippets_v2';

export default function SnippetsTool() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editing, setEditing] = useState<Snippet | null>(null);
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try { setSnippets(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
  }, [snippets]);

  const filtered = useMemo(() => snippets.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || s.title.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q));
    const matchL = filterLang === 'all' || s.language === filterLang;
    return matchQ && matchL;
  }), [snippets, search, filterLang]);

  const startNew = () => {
    setEditing({
      id: crypto.randomUUID(),
      title: '',
      language: 'javascript',
      code: '',
      tags: [],
      createdAt: Date.now(),
    });
    setView('edit');
  };

  const saveSnippet = () => {
    if (!editing || !editing.code.trim()) return;
    setSnippets(prev => {
      const idx = prev.findIndex(s => s.id === editing.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = editing;
        return next;
      }
      return [editing, ...prev];
    });
    setView('list');
    setEditing(null);
  };

  const deleteSnippet = (id: string) => {
    if (confirm('Delete this snippet?')) {
        setSnippets(prev => prev.filter(s => s.id !== id));
    }
  };

  if (view === 'edit' && editing) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between px-1">
            <Button variant="ghost" size="sm" onClick={() => { setView('list'); setEditing(null); }}>← Back to Library</Button>
            <div className="flex gap-3">
                <Button variant="primary" onClick={saveSnippet} disabled={!editing.code.trim()}>Save Snippet</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card title="Editor">
                    <div className="space-y-4">
                        <Input 
                            label="Title"
                            value={editing.title}
                            onChange={e => setEditing({...editing, title: e.target.value})}
                            placeholder="Descriptive name for this snippet..."
                        />
                        <Textarea 
                            label="Source Code"
                            value={editing.code}
                            onChange={e => setEditing({...editing, code: e.target.value})}
                            placeholder="Paste or write your code here..."
                            className="min-h-[400px] font-mono text-sm"
                            spellCheck={false}
                        />
                    </div>
                </Card>
            </div>

            <div className="space-y-6">
                <Card title="Metadata">
                    <div className="space-y-6">
                        <Select 
                            label="Language"
                            value={editing.language}
                            onChange={e => setEditing({...editing, language: e.target.value})}
                            options={LANGUAGES}
                        />
                        <Input 
                            label="Tags"
                            value={editing.tags.join(', ')}
                            onChange={e => setEditing({...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                            placeholder="React, CSS, Utility..."
                            helper="Separate tags with commas"
                        />
                    </div>
                </Card>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h4 className="text-sm font-bold text-white/60 mb-2 uppercase tracking-widest">Live Preview</h4>
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0d0d0d] p-4 text-[10px] font-mono text-white/40 italic">
                        {editing.code ? 'Formatting will be applied in library view.' : 'Waiting for code...'}
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-6 border-b border-white/5">
        <div className="flex flex-1 gap-3 w-full">
            <Input 
                placeholder="Search your snippets..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1"
                leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            />
            <div className="w-48 hidden md:block">
                <Select 
                    value={filterLang}
                    onChange={e => setFilterLang(e.target.value)}
                    options={[{ value: 'all', label: 'All Languages' }, ...LANGUAGES]}
                />
            </div>
        </div>
        <Button onClick={startNew} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
            Create New
        </Button>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(s => (
                <Card key={s.id} className="p-0 overflow-hidden border-white/10 flex flex-col group hover:border-accent/30 transition-all">
                    <div className="p-5 border-b border-white/5 flex items-start justify-between bg-white/[0.01]">
                        <div>
                            <h3 className="font-bold text-white text-lg group-hover:text-accent transition-colors">{s.title || 'Untitled Snippet'}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full">{s.language}</span>
                                {s.tags.map(t => (
                                    <span key={t} className="text-[10px] font-medium text-accent opacity-60">#{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditing(s); setView('edit'); }} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                            <button onClick={() => deleteSnippet(s.id)} className="p-2 rounded-lg hover:bg-danger/10 text-white/40 hover:text-danger transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                    </div>
                    <div className="p-5 flex-1 bg-[#0d0d0d]">
                        <CodeBlock code={s.code} language={s.language} maxHeight="200px" />
                    </div>
                </Card>
            ))}
        </div>
      ) : (
        <div className="h-96 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.03] flex items-center justify-center mb-6 text-3xl opacity-20">📑</div>
            <h3 className="text-xl font-bold text-white/80 mb-2">
                {snippets.length === 0 ? 'Your code library is empty' : 'No matches found'}
            </h3>
            <p className="text-sm text-white/30 max-w-sm mb-8">
                {snippets.length === 0 
                    ? 'Start building your collection of useful code snippets. Everything is stored locally in your browser.'
                    : 'Try adjusting your search query or language filter.'}
            </p>
            {snippets.length === 0 && (
                <Button onClick={startNew}>Create First Snippet</Button>
            )}
        </div>
      )}
    </div>
  );
}
