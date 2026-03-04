'use client';
import { useState } from 'react';

function escapeAttr(s: string) { return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }

function generateMetaTags(form: MetaForm): string {
  const lines: string[] = ['<!-- Primary Meta Tags -->'];
  if (form.title) lines.push(`<title>${escapeAttr(form.title)}</title>`);
  if (form.title) lines.push(`<meta name="title" content="${escapeAttr(form.title)}">`);
  if (form.description) lines.push(`<meta name="description" content="${escapeAttr(form.description)}">`);
  if (form.keywords) lines.push(`<meta name="keywords" content="${escapeAttr(form.keywords)}">`);
  if (form.author) lines.push(`<meta name="author" content="${escapeAttr(form.author)}">`);
  if (form.canonical) lines.push(`<link rel="canonical" href="${escapeAttr(form.canonical)}">`);
  const robotsValue = [form.indexing, form.following].filter(Boolean).join(', ');
  if (robotsValue) lines.push(`<meta name="robots" content="${robotsValue}">`);
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

export default function MetaTagGenClient() {
  const [form, setForm] = useState<MetaForm>(DEFAULT);
  const [tab, setTab] = useState<'form' | 'code' | 'preview'>('form');
  const [copied, setCopied] = useState(false);

  const set = (k: keyof MetaForm, v: string) => setForm(f => ({ ...f, [k]: v }));
  const tags = generateMetaTags(form);
  const copy = () => navigator.clipboard.writeText(tags).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });

  const inputStyle: React.CSSProperties = {
    padding: '0.45rem 0.7rem', borderRadius: 6, border: '1px solid var(--border)',
    background: 'var(--bg-input)', color: 'var(--text)', fontSize: '0.875rem', width: '100%', outline: 'none',
  };
  const labelStyle: React.CSSProperties = { color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' };
  const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.25rem' };
  const sectionTitleStyle: React.CSSProperties = { color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', marginTop: '0.25rem' };

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.45rem 1rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem', fontWeight: active ? 600 : 400,
    border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
    background: active ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
    color: active ? 'var(--accent)' : 'var(--text-secondary)',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {(['form', 'code', 'preview'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={tabBtnStyle(tab === t)}>
            {t === 'form' ? '⚙ Form' : t === 'code' ? '</> Code' : '👁 Google Preview'}
          </button>
        ))}
        {tab === 'code' && (
          <button onClick={copy} className="btn-secondary" style={{ padding: '0.3rem 0.75rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', border: '1px solid var(--border)', marginLeft: 'auto' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>

      {/* Form Tab */}
      {tab === 'form' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={sectionTitleStyle}>Primary</div>
            <div style={fieldStyle}><label style={labelStyle}>Title</label><input value={form.title} onChange={e => set('title', e.target.value)} style={inputStyle} /></div>
            <div style={fieldStyle}><label style={labelStyle}>Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} /></div>
            <div style={fieldStyle}><label style={labelStyle}>Keywords</label><input value={form.keywords} onChange={e => set('keywords', e.target.value)} style={inputStyle} /></div>
            <div style={fieldStyle}><label style={labelStyle}>Author</label><input value={form.author} onChange={e => set('author', e.target.value)} style={inputStyle} /></div>
            <div style={fieldStyle}><label style={labelStyle}>Canonical URL</label><input value={form.canonical} onChange={e => set('canonical', e.target.value)} style={inputStyle} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div style={fieldStyle}><label style={labelStyle}>Indexing</label><select value={form.indexing} onChange={e => set('indexing', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}><option value="index">index</option><option value="noindex">noindex</option></select></div>
              <div style={fieldStyle}><label style={labelStyle}>Following</label><select value={form.following} onChange={e => set('following', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}><option value="follow">follow</option><option value="nofollow">nofollow</option></select></div>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Theme Color</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="color" value={form.themeColor} onChange={e => set('themeColor', e.target.value)} style={{ width: 40, height: 36, borderRadius: 6, border: '1px solid var(--border)', padding: 2, background: 'var(--bg-input)', cursor: 'pointer' }} />
                <input value={form.themeColor} onChange={e => set('themeColor', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={sectionTitleStyle}>Open Graph</div>
            <div style={fieldStyle}><label style={labelStyle}>OG Title (blank = use Title)</label><input value={form.ogTitle} onChange={e => set('ogTitle', e.target.value)} style={inputStyle} placeholder={form.title} /></div>
            <div style={fieldStyle}><label style={labelStyle}>OG Description</label><textarea value={form.ogDescription} onChange={e => set('ogDescription', e.target.value)} style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} placeholder={form.description} /></div>
            <div style={fieldStyle}><label style={labelStyle}>OG Image URL</label><input value={form.ogImage} onChange={e => set('ogImage', e.target.value)} style={inputStyle} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div style={fieldStyle}><label style={labelStyle}>OG Type</label><select value={form.ogType} onChange={e => set('ogType', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}><option>website</option><option>article</option><option>product</option><option>profile</option></select></div>
              <div style={fieldStyle}><label style={labelStyle}>Site Name</label><input value={form.ogSiteName} onChange={e => set('ogSiteName', e.target.value)} style={inputStyle} /></div>
            </div>
            <div style={sectionTitleStyle}>Twitter Card</div>
            <div style={fieldStyle}><label style={labelStyle}>Card Type</label><select value={form.twitterCard} onChange={e => set('twitterCard', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}><option value="summary">summary</option><option value="summary_large_image">summary_large_image</option><option value="app">app</option><option value="player">player</option></select></div>
            <div style={fieldStyle}><label style={labelStyle}>Twitter Title</label><input value={form.twitterTitle} onChange={e => set('twitterTitle', e.target.value)} style={inputStyle} placeholder={form.title} /></div>
            <div style={fieldStyle}><label style={labelStyle}>Twitter Image URL</label><input value={form.twitterImage} onChange={e => set('twitterImage', e.target.value)} style={inputStyle} placeholder={form.ogImage} /></div>
          </div>
        </div>
      )}

      {/* Code Tab */}
      {tab === 'code' && (
        <pre style={{ margin: 0, padding: '1rem', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.82rem', whiteSpace: 'pre', overflowX: 'auto', minHeight: 400 }}>
          {tags}
        </pre>
      )}

      {/* Google Preview Tab */}
      {tab === 'preview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderRadius: 10, background: '#fff', maxWidth: 600 }}>
            <div style={{ fontSize: '0.75rem', color: '#202124', marginBottom: '0.15rem', fontFamily: 'Arial, sans-serif' }}>
              {form.canonical || 'https://example.com/page'}
            </div>
            <div style={{ fontSize: '1.1rem', color: '#1a0dab', fontWeight: 400, fontFamily: 'Arial, sans-serif', lineHeight: '1.3', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
              {form.title || 'Page Title'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#4d5156', fontFamily: 'Arial, sans-serif', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {form.description || 'Page description will appear here.'}
            </div>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>📌 This is a simplified Google search result preview. Actual appearance may vary.</div>
        </div>
      )}
    </div>
  );
}
