'use client';

import { useState, useCallback, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Tabs from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

type Platform = 'twitter' | 'facebook' | 'linkedin' | 'discord' | 'slack';

interface OgFields {
  title: string;
  description: string;
  image: string;
  siteName: string;
  url: string;
}

const LIMITS: Record<Platform, { title: number; description: number }> = {
  twitter:  { title: 70,  description: 200 },
  facebook: { title: 100, description: 300 },
  linkedin: { title: 119, description: 400 },
  discord:  { title: 256, description: 2048 },
  slack:    { title: 120, description: 500 },
};

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

export default function OgPreviewTool() {
  const [fields, setFields] = useState<OgFields>({
    title: 'WokTool — Free Professional Browser Utilities',
    description: 'A comprehensive collection of 80+ free, client-side tools for developers and designers. No tracking, no uploads.',
    image: 'https://tools.wokspec.org/og.png',
    siteName: 'WokTool',
    url: 'https://tools.wokspec.org',
  });
  const [platform, setPlatform] = useState<Platform>('twitter');

  const update = (k: keyof OgFields, v: string) => setFields(f => ({ ...f, [k]: v }));

  const metaTags = useMemo(() => `<!-- SEO & Social Meta Tags -->
<title>${fields.title}</title>
<meta name="description" content="${fields.description}" />

<meta property="og:type" content="website" />
<meta property="og:url" content="${fields.url}" />
<meta property="og:title" content="${fields.title}" />
<meta property="og:description" content="${fields.description}" />
${fields.image ? `<meta property="og:image" content="${fields.image}" />` : ''}
${fields.siteName ? `<meta property="og:site_name" content="${fields.siteName}" />` : ''}

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${fields.url}" />
<meta name="twitter:title" content="${fields.title}" />
<meta name="twitter:description" content="${fields.description}" />
${fields.image ? `<meta name="twitter:image" content="${fields.image}" />` : ''}`, [fields]);

  const domain = useMemo(() => {
    try { return new URL(fields.url).hostname; } catch { return fields.url || 'example.com'; }
  }, [fields.url]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-6">
            <Card title="Social Metadata">
                <div className="space-y-4">
                    <Input 
                        label="Title"
                        value={fields.title}
                        onChange={e => update('title', e.target.value)}
                        helper={`${fields.title.length} / ${LIMITS[platform].title} characters`}
                        error={fields.title.length > LIMITS[platform].title ? 'Exceeds limit' : ''}
                    />
                    <Textarea 
                        label="Description"
                        value={fields.description}
                        onChange={e => update('description', e.target.value)}
                        helper={`${fields.description.length} / ${LIMITS[platform].description} characters`}
                        error={fields.description.length > LIMITS[platform].description ? 'Exceeds limit' : ''}
                        rows={3}
                    />
                    <Input label="Image URL" value={fields.image} onChange={e => update('image', e.target.value)} placeholder="https://..." />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Site Name" value={fields.siteName} onChange={e => update('siteName', e.target.value)} />
                        <Input label="Page URL" value={fields.url} onChange={e => update('url', e.target.value)} />
                    </div>
                </div>
            </Card>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Generated Tags</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(metaTags)} className="h-7 text-[10px]">Copy All</Button>
                </div>
                <CodeBlock code={metaTags} language="xml" maxHeight="300px" />
            </div>
        </div>

        {/* Right: Previews */}
        <div className="space-y-6">
            <div className="flex justify-center">
                <Tabs 
                    activeTab={platform}
                    onChange={id => setPlatform(id as Platform)}
                    tabs={[
                        { id: 'twitter', label: 'X / Twitter' },
                        { id: 'facebook', label: 'Facebook' },
                        { id: 'linkedin', label: 'LinkedIn' },
                        { id: 'discord', label: 'Discord' },
                    ]}
                    className="w-full"
                />
            </div>

            <div className="min-h-[400px] flex items-start justify-center pt-4">
                {platform === 'twitter' && (
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black overflow-hidden shadow-2xl animate-in zoom-in-95">
                        {fields.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={fields.image} alt="X Preview" className="w-full aspect-[1.91/1] object-cover border-b border-white/10" />
                        )}
                        <div className="p-3">
                            <div className="text-[13px] text-zinc-500 mb-0.5">{domain}</div>
                            <div className="text-[15px] font-bold text-white truncate">{truncate(fields.title, 70)}</div>
                            <div className="text-[14px] text-zinc-400 line-clamp-2 leading-snug">{truncate(fields.description, 200)}</div>
                        </div>
                    </div>
                )}

                {platform === 'facebook' && (
                    <div className="w-full max-w-md bg-[#242526] border border-[#3e4042] overflow-hidden shadow-2xl animate-in zoom-in-95">
                        {fields.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={fields.image} alt="FB Preview" className="w-full aspect-[1.91/1] object-cover" />
                        )}
                        <div className="p-3 bg-[#3a3b3c]">
                            <div className="text-[12px] text-[#b0b3b8] uppercase tracking-wide">{domain}</div>
                            <div className="text-[16px] font-bold text-[#e4e6eb] mt-1 line-clamp-2 leading-tight">{fields.title}</div>
                            <div className="text-[14px] text-[#b0b3b8] mt-1 line-clamp-1">{fields.description}</div>
                        </div>
                    </div>
                )}

                {platform === 'linkedin' && (
                    <div className="w-full max-w-md bg-white overflow-hidden shadow-2xl animate-in zoom-in-95 rounded-sm">
                        {fields.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={fields.image} alt="LI Preview" className="w-full aspect-[1.91/1] object-cover" />
                        )}
                        <div className="p-3 bg-[#f3f6f8] border-t border-zinc-200">
                            <div className="text-[14px] font-bold text-zinc-900 line-clamp-2 leading-snug">{fields.title}</div>
                            <div className="text-[12px] text-zinc-500 mt-1">{domain}</div>
                        </div>
                    </div>
                )}

                {platform === 'discord' && (
                    <div className="w-full max-w-md bg-[#2f3136] p-4 rounded border-l-4 border-[#4f545c] flex flex-col gap-2 shadow-2xl animate-in zoom-in-95">
                        <div className="text-[12px] text-white/60 font-medium">{fields.siteName || domain}</div>
                        <div className="text-[16px] font-bold text-[#00b0f4] hover:underline cursor-pointer">{fields.title}</div>
                        <div className="text-[14px] text-[#dcddde] leading-relaxed whitespace-pre-wrap">{fields.description}</div>
                        {fields.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={fields.image} alt="Discord Preview" className="mt-2 rounded max-h-[300px] w-auto object-contain self-start" />
                        )}
                    </div>
                )}
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-4 items-start opacity-60">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 font-bold">
                    i
                </div>
                <p className="text-xs text-white/40 leading-relaxed italic">
                    Previews are approximations based on current platform UI standards. Real appearance may vary depending on device, client version, and cache.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
