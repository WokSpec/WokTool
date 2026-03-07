'use client';

import { useState, useMemo, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import CodeBlock from '@/components/ui/CodeBlock';

interface MetaForm {
  title: string; description: string; keywords: string; author: string;
  canonical: string; indexing: string; following: string;
  viewport: string; themeColor: string;
  ogTitle: string; ogDescription: string; ogImage: string; ogType: string; ogSiteName: string;
  twitterCard: string; twitterTitle: string; twitterDescription: string; twitterImage: string;
}

const DEFAULT: MetaForm = {
  title: 'My Awesome Page', description: 'This is a description of my awesome page.', keywords: 'keyword1, keyword2',
  author: '', canonical: 'https://example.com/page',
  indexing: 'index', following: 'follow', viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
  ogTitle: '', ogDescription: '', ogImage: 'https://example.com/og-image.jpg', ogType: 'website', ogSiteName: 'My Site',
  twitterCard: 'summary_large_image', twitterTitle: '', twitterDescription: '', twitterImage: '',
};

function escapeAttr(s: string) { return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }

function generateMetaTags(form: MetaForm): string {
  const lines: string[] = ['<!-- Primary Meta Tags -->'];
  if (form.title) {
    lines.push(`<title>${escapeAttr(form.title)}</title>`);
    lines.push(`<meta name="title" content="${escapeAttr(form.title)}">`);
  }
  if (form.description) lines.push(`<meta name="description" content="${escapeAttr(form.description)}">`);
  if (form.keywords) lines.push(`<meta name="keywords" content="${escapeAttr(form.keywords)}">`);
  if (form.author) lines.push(`<meta name="author" content="${escapeAttr(form.author)}">`);
  if (form.canonical) lines.push(`<link rel="canonical" href="${escapeAttr(form.canonical)}">`);
  const robots = [form.indexing, form.following].filter(Boolean).join(', ');
  if (robots) lines.push(`<meta name="robots" content="${robots}">`);
  if (form.viewport) lines.push(`<meta name="viewport" content="${escapeAttr(form.viewport)}">`);
  if (form.themeColor) lines.push(`<meta name="theme-color" content="${escapeAttr(form.themeColor)}">`);

  lines.push('');
  lines.push('<!-- Open Graph / Facebook -->');
  lines.push(`<meta property="og:type" content="${escapeAttr(form.ogType)}">`);
  if (form.canonical) lines.push(`<meta property="og:url" content="${escapeAttr(form.canonical)}">`);
  if (form.ogTitle || form.title) lines.push(`<meta property="og:title" content="${escapeAttr(form.ogTitle || form.title)}">`);
  if (form.ogDescription || form.description) lines.push(`<meta property="og:description" content="${escapeAttr(form.ogDescription || form.description)}">`);
  if (form.ogImage) lines.push(`<meta property="og:image" content="${escapeAttr(form.ogImage)}">`);
  if (form.ogSiteName) lines.push(`<meta property="og:site_name" content="${escapeAttr(form.ogSiteName)}">`);

  lines.push('');
  lines.push('<!-- Twitter -->');
  lines.push(`<meta property="twitter:card" content="${escapeAttr(form.twitterCard)}">`);
  if (form.canonical) lines.push(`<meta property="twitter:url" content="${escapeAttr(form.canonical)}">`);
  if (form.twitterTitle || form.title) lines.push(`<meta property="twitter:title" content="${escapeAttr(form.twitterTitle || form.title)}">`);
  if (form.twitterDescription || form.description) lines.push(`<meta property="twitter:description" content="${escapeAttr(form.twitterDescription || form.description)}">`);
  if (form.twitterImage || form.ogImage) lines.push(`<meta property="twitter:image" content="${escapeAttr(form.twitterImage || form.ogImage)}">`);

  return lines.join('\n');
}

export default function MetaTagGenClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [form, setForm] = useState<MetaForm>(DEFAULT);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  const update = (k: keyof MetaForm, v: string) => setForm(f => ({ ...f, [k]: v }));
  const tags = useMemo(() => generateMetaTags(form), [form]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <Tabs 
            activeTab={activeTab}
            onChange={id => setActiveTab(id as any)}
            tabs={[
                { id: 'form', label: 'Editor', icon: '⚙️' },
                { id: 'preview', label: 'Preview', icon: '👁️' },
            ]}
            className="w-full max-w-xs"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className={`lg:col-span-2 space-y-6 ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
            <Card title="Primary SEO Tags">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Page Title" value={form.title} onChange={e => update('title', e.target.value)} />
                    <Input label="Author" value={form.author} onChange={e => update('author', e.target.value)} />
                    <div className="md:col-span-2">
                        <Textarea label="Description" value={form.description} onChange={e => update('description', e.target.value)} rows={2} />
                    </div>
                    <Input label="Keywords" value={form.keywords} onChange={e => update('keywords', e.target.value)} placeholder="comma, separated..." />
                    <Input label="Canonical URL" value={form.canonical} onChange={e => update('canonical', e.target.value)} placeholder="https://example.com/page" />
                    <Select label="Indexing" value={form.indexing} onChange={e => update('indexing', e.target.value)} options={[{value:'index',label:'index'},{value:'noindex',label:'noindex'}]} />
                    <Select label="Following" value={form.following} onChange={e => update('following', e.target.value)} options={[{value:'follow',label:'follow'},{value:'nofollow',label:'nofollow'}]} />
                </div>
            </Card>

            <Card title="Social Graph (OG / Twitter)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="OG Title" value={form.ogTitle} onChange={e => update('ogTitle', e.target.value)} placeholder={form.title} />
                    <Input label="Site Name" value={form.ogSiteName} onChange={e => update('ogSiteName', e.target.value)} />
                    <div className="md:col-span-2">
                        <Textarea label="OG Description" value={form.ogDescription} onChange={e => update('ogDescription', e.target.value)} rows={2} placeholder={form.description} />
                    </div>
                    <Input label="OG Image URL" value={form.ogImage} onChange={e => update('ogImage', e.target.value)} />
                    <Select label="OG Type" value={form.ogType} onChange={e => update('ogType', e.target.value)} options={['website','article','product','profile'].map(v => ({value:v,label:v}))} />
                    <Select label="Twitter Card" value={form.twitterCard} onChange={e => update('twitterCard', e.target.value)} options={['summary','summary_large_image','app','player'].map(v => ({value:v,label:v}))} />
                </div>
            </Card>
        </div>

        {/* Code / Preview Column */}
        <div className="space-y-6">
            {activeTab === 'preview' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Google Search Preview</h3>
                    <div className="p-6 rounded-3xl bg-white shadow-2xl">
                        <div className="text-[14px] text-[#202124] mb-1 font-sans truncate">{form.canonical || 'https://example.com/page'}</div>
                        <div className="text-[20px] text-[#1a0dab] mb-1 font-sans truncate hover:underline cursor-pointer">{form.title || 'Page Title'}</div>
                        <div className="text-[14px] text-[#4d5156] font-sans line-clamp-2 leading-relaxed">
                            {form.description || 'Provide a meta description to see how your page might appear in Google search results.'}
                        </div>
                    </div>

                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1 pt-4">Social Share Preview</h3>
                    <div className="rounded-3xl bg-[#0d0d0d] border border-white/10 overflow-hidden shadow-2xl">
                        <div className="aspect-[1200/630] bg-white/[0.03] flex items-center justify-center relative">
                            {form.ogImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={form.ogImage} alt="OG" className="w-full h-full object-cover opacity-80" />
                            ) : (
                                <div className="text-white/5 text-4xl">🖼️</div>
                            )}
                        </div>
                        <div className="p-5 space-y-1">
                            <div className="text-[10px] font-black uppercase text-accent tracking-widest">{form.ogSiteName || 'EXAMPLE.COM'}</div>
                            <h4 className="text-sm font-bold text-white leading-tight truncate">{form.ogTitle || form.title}</h4>
                            <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed">{form.ogDescription || form.description}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className={`space-y-4 ${activeTab === 'form' ? 'sticky top-8' : ''}`}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Generated HTML</h3>
                <CodeBlock code={tags} language="xml" maxHeight="500px" />
                <Button variant="primary" size="lg" className="w-full" onClick={() => navigator.clipboard.writeText(tags)}>
                    Copy HTML Tags
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
