'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Clipboard, ArrowRight, X } from 'lucide-react';
import { TOOLS } from '@/lib/tools-registry';

interface Suggestion {
  id: string;
  label: string;
  icon: string;
  href: string;
  reason: string;
}

export default function MagicMirror() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const analyze = useCallback((val: string) => {
    const trimmed = val.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    const res: Suggestion[] = [];

    const findTool = (id: string, reason: string) => {
      const t = TOOLS.find(x => x.id === id);
      if (t) res.push({ id: t.id, label: t.label, icon: t.icon, href: t.href, reason });
    };

    // 1. YouTube
    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(trimmed)) {
      findTool('yt-downloader', 'YouTube link detected');
    }
    // 2. Generic URL
    else if (/^https?:\/\/.+/i.test(trimmed)) {
      findTool('link-scraper', 'Webpage link detected');
      findTool('og-preview', 'Preview social card');
      findTool('link-checker', 'Check for broken links');
    }
    // 3. JSON
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        JSON.parse(trimmed);
        findTool('json-tools', 'Valid JSON detected');
        findTool('json-to-types', 'Convert to TypeScript');
        findTool('json-schema', 'Generate JSON Schema');
      } catch { /* ignore */ }
    }
    // 4. JWT
    if (/^ey[a-zA-Z0-9_-]+\.ey[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/i.test(trimmed)) {
      findTool('jwt-debugger', 'JWT token detected');
    }
    // 5. SVG
    if (trimmed.toLowerCase().includes('<svg') && trimmed.toLowerCase().includes('</svg>')) {
      findTool('svg-optimizer', 'SVG code detected');
      findTool('css-generator', 'Build with CSS');
    }
    // 6. Base64 Image
    if (trimmed.startsWith('data:image/')) {
      findTool('background-remover', 'Image data detected');
      findTool('image-converter', 'Convert image format');
    }
    // 7. Colors
    if (/^#([A-Fa-f0-9]{3}){1,2}$/i.test(trimmed) || /^rgb/i.test(trimmed) || /^hsl/i.test(trimmed)) {
      findTool('color-tools', 'Color value detected');
      findTool('color-converter', 'Convert color format');
    }
    // 8. UUID
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) {
      findTool('uuid', 'UUID detected');
    }
    // 9. SQL
    if (/SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER/i.test(trimmed) && trimmed.length > 20) {
      findTool('sql-formatter', 'SQL query detected');
    }
    // 10. Cron
    if (/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/i.test(trimmed)) {
      findTool('cron-builder', 'Cron expression detected');
    }

    setSuggestions(res.slice(0, 4));
  }, []);

  useEffect(() => {
    analyze(input);
  }, [input, analyze]);

  // Global paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Don't intercept if user is typing in another input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      const text = e.clipboardData?.getData('text');
      if (text) {
        setInput(text);
        setIsFocused(true);
        inputRef.current?.focus();
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleClear = () => {
    setInput('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div className={`magic-mirror ${isFocused || input ? '--active' : ''}`}>
      <div className="magic-mirror-inner">
        <div className="magic-mirror-input-wrap">
          <Zap className="magic-mirror-zap" size={18} />
          <input
            ref={inputRef}
            className="magic-mirror-input"
            placeholder="Paste anything... URL, JSON, Code, JWT, Color"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            spellCheck={false}
          />
          {input ? (
            <button className="magic-mirror-clear" onClick={handleClear}>
              <X size={16} />
            </button>
          ) : (
            <div className="magic-mirror-hint">
              <Clipboard size={12} />
              <span>Paste to analyze</span>
            </div>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="magic-mirror-suggestions">
            <div className="magic-mirror-label">Magic Suggestions</div>
            <div className="magic-mirror-grid">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  className="magic-mirror-item"
                  onClick={() => router.push(s.href)}
                >
                  <span className="magic-mirror-item-icon">{s.icon}</span>
                  <div className="magic-mirror-item-body">
                    <div className="magic-mirror-item-name">{s.label}</div>
                    <div className="magic-mirror-item-reason">{s.reason}</div>
                  </div>
                  <ArrowRight className="magic-mirror-item-arrow" size={14} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .magic-mirror {
          margin: 0 auto 2.5rem;
          max-width: 640px;
          position: relative;
          z-index: 10;
          transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
        }
        .magic-mirror.--active {
          transform: translateY(-2px);
        }
        .magic-mirror-inner {
          background: var(--bg-surface);
          border: 1px solid var(--border-strong);
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05);
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .magic-mirror.--active .magic-mirror-inner {
          border-color: var(--accent);
          box-shadow: 0 12px 48px rgba(0,0,0,0.5), 0 0 20px var(--accent-glow);
        }
        .magic-mirror-input-wrap {
          display: flex;
          align-items: center;
          padding: 0.875rem 1.125rem;
          gap: 0.875rem;
          position: relative;
        }
        .magic-mirror-zap {
          color: var(--accent);
          filter: drop-shadow(0 0 8px var(--accent-glow));
          flex-shrink: 0;
        }
        .magic-mirror-input {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1rem;
          width: 100%;
          outline: none;
        }
        .magic-mirror-input::placeholder {
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        .magic-mirror-hint {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          background: rgba(255,255,255,0.05);
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
        }
        .magic-mirror-clear {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s;
        }
        .magic-mirror-clear:hover { color: var(--text-primary); }

        .magic-mirror-suggestions {
          border-top: 1px solid var(--border);
          padding: 0.75rem;
          background: rgba(255,255,255,0.01);
        }
        .magic-mirror-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-bottom: 0.625rem;
          padding-left: 0.375rem;
        }
        .magic-mirror-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        @media (max-width: 500px) {
          .magic-mirror-grid { grid-template-columns: 1fr; }
        }
        .magic-mirror-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.875rem;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid transparent;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
        }
        .magic-mirror-item:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
          transform: scale(1.02);
        }
        .magic-mirror-item-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }
        .magic-mirror-item-body {
          flex: 1;
          min-width: 0;
        }
        .magic-mirror-item-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .magic-mirror-item-reason {
          font-size: 0.7rem;
          color: var(--accent);
          font-weight: 500;
        }
        .magic-mirror-item-arrow {
          color: var(--text-muted);
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.15s;
        }
        .magic-mirror-item:hover .magic-mirror-item-arrow {
          opacity: 1;
          transform: translateX(0);
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}
