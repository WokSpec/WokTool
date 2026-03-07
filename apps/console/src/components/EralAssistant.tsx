'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function EralAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I\'m Eral, your AI assistant. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `eral-${Date.now()}`);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/eral/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId,
          pageContext: 'The user is in the WokTool console dashboard. Help them navigate tools, workflows, and account-level actions.',
          integration: {
            name: 'WokTool Console',
            kind: 'console',
            url: window.location.href,
            origin: window.location.origin,
            pageTitle: document.title,
            capabilities: ['tool-guidance', 'workspace-assistant'],
            metadata: {
              pathname: window.location.pathname,
              surface: 'dashboard-widget',
            },
          },
        }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: 'assistant', content: data.reply ?? 'Sorry, I couldn\'t respond right now.' },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: `e-${Date.now()}`, role: 'assistant', content: 'Connection error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 flex items-center justify-center w-12 h-12 rounded-full shadow-lg z-50 transition-transform hover:scale-105"
        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        aria-label="Open Eral AI assistant"
      >
        {open ? <X size={20} /> : <Sparkles size={20} />}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-22 right-6 w-80 md:w-96 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            height: '480px',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-4 py-3 shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <Sparkles size={16} style={{ color: 'var(--accent)' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
              Eral Assistant
            </span>
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
            >
              AI
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed',
                  msg.role === 'user' ? 'self-end' : 'self-start'
                )}
                style={
                  msg.role === 'user'
                    ? { backgroundColor: 'var(--accent)', color: '#fff' }
                    : { backgroundColor: 'var(--surface-raised)', color: 'var(--text)' }
                }
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div
                className="self-start rounded-xl px-3 py-2 flex items-center gap-2"
                style={{ backgroundColor: 'var(--surface-raised)' }}
              >
                <Loader2 size={14} className="animate-spin" style={{ color: 'var(--accent)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Eral is thinking…
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-3 shrink-0"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <input
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-subtle)]"
              style={{ color: 'var(--text)' }}
              placeholder="Ask Eral anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="flex items-center justify-center w-7 h-7 rounded-lg disabled:opacity-40 transition-colors"
              style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
              aria-label="Send"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
