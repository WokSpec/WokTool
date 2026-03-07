'use client';

import React, { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';

function getStartDate(filter: string) {
  if (filter === 'any') return undefined;
  const d = new Date();
  if (filter === 'week') d.setDate(d.getDate() - 7);
  else if (filter === 'month') d.setMonth(d.getMonth() - 1);
  else if (filter === 'year') d.setFullYear(d.getFullYear() - 1);
  return d.toISOString();
}

function getHostname(url: string) {
  try { return new URL(url).hostname; } catch { return url; }
}

export default function ExaSearchTool() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'neural' | 'keyword' | 'auto'>('neural');
  const [dateFilter, setDateFilter] = useState('any');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  async function search() {
    if (!query.trim()) return;
    setLoading(true); setError(''); setResults([]);
    try {
      const res = await fetch('/api/tools/exa-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query, type: searchType, numResults: 8, includeText: true,
          startPublishedDate: getStartDate(dateFilter),
          category: typeFilter === 'all' ? undefined : typeFilter === 'research' ? 'research paper' : typeFilter,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || data.message || 'Search failed'); return; }
      setResults(data.results || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card title="Semantic Intelligence" description="Neural search that understands context and meaning. Find high-quality research, news, and specialized content.">
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                    <Input 
                        placeholder="e.g. latest advancements in solar panel efficiency 2024"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && search()}
                        leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                    />
                </div>
                <Button onClick={search} loading={loading} disabled={!query.trim()}>Search Exa</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-white/20 px-1">Engine</label>
                    <Tabs 
                        activeTab={searchType}
                        onChange={id => setSearchType(id as any)}
                        tabs={[
                            { id: 'neural', label: 'Neural' },
                            { id: 'keyword', label: 'Keyword' },
                            { id: 'auto', label: 'Auto' },
                        ]}
                    />
                </div>
                <Select 
                    label="Recency"
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    options={[
                        { value: 'any', label: 'Any time' },
                        { value: 'week', label: 'Past week' },
                        { value: 'month', label: 'Past month' },
                        { value: 'year', label: 'Past year' },
                    ]}
                />
                <Select 
                    label="Category"
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                    options={[
                        { value: 'all', label: 'All types' },
                        { value: 'news', label: 'News' },
                        { value: 'research', label: 'Research' },
                        { value: 'tweet', label: 'Social' },
                    ]}
                />
            </div>
        </div>
      </Card>

      {error && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
            {error}
        </div>
      )}

      <div className="space-y-4">
        {results.map((r, i) => (
            <Card key={i} className="group hover:border-accent/30 transition-all">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`https://www.google.com/s2/favicons?domain=${getHostname(r.url)}&sz=32`}
                            alt="" className="w-4 h-4 rounded opacity-60 group-hover:opacity-100 transition-opacity"
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-white hover:text-accent transition-colors leading-tight line-clamp-1">{r.title || r.url}</a>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-black uppercase text-white/20 tracking-widest">
                        <span className="text-accent/60">{getHostname(r.url)}</span>
                        {r.publishedDate && <span>· {new Date(r.publishedDate).toLocaleDateString()}</span>}
                        {r.author && <span>· {r.author}</span>}
                    </div>
                    {r.text && <p className="text-sm text-white/40 leading-relaxed line-clamp-3">{r.text}</p>}
                    <div className="pt-2 flex gap-3">
                        <Button href={r.url} target="_blank" variant="secondary" size="sm">Visit Site</Button>
                        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(r.url)}>Copy Link</Button>
                    </div>
                </div>
            </Card>
        ))}

        {results.length === 0 && !loading && !error && (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-20">
                <div className="w-20 h-20 rounded-3xl border-2 border-dashed border-white/40 flex items-center justify-center text-3xl mb-4">🔭</div>
                <p className="text-sm font-medium">Your semantic search results will appear here</p>
            </div>
        )}
      </div>
    </div>
  );
}
