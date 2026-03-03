'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_ACTIONS = [
  { label: 'Draft cold email', prompt: 'Write a cold email for a web agency reaching out to a local business owner.' },
  { label: 'Write follow-up sequence', prompt: 'Create a 3-step follow-up email sequence for a prospect who went quiet after a proposal.' },
  { label: 'Generate social post', prompt: 'Write a LinkedIn post showcasing a client success story for a web agency.' },
  { label: 'Summarize pipeline', prompt: 'Summarize our current sales pipeline and suggest which deals to prioritize.' },
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to Eral AI Workspace. I can help you draft emails, sequences, social posts, and more. What would you like to create today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `ai-${Date.now()}`);
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
        body: JSON.stringify({ message: text, sessionId, pageContext: 'ai-workspace' }),
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
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[720px] rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-5 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <Sparkles size={16} style={{ color: 'var(--accent)' }} />
        <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
          Eral AI Workspace
        </span>
      </div>

      {/* Quick Actions */}
      <div
        className="flex flex-wrap gap-2 px-5 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {QUICK_ACTIONS.map((qa) => (
          <button
            key={qa.label}
            onClick={() => sendMessage(qa.prompt)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-50 transition-colors"
            style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
          >
            {qa.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
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
            className="self-start rounded-xl px-4 py-3 flex items-center gap-2"
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
        className="flex items-end gap-2 px-4 py-3 shrink-0"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <textarea
          className="flex-1 bg-transparent text-sm outline-none resize-none placeholder:text-[var(--text-subtle)] leading-relaxed"
          style={{ color: 'var(--text)', maxHeight: '120px' }}
          placeholder="Ask Eral to write, draft, or brainstorm anything…"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="flex items-center justify-center w-8 h-8 rounded-lg disabled:opacity-40 transition-colors shrink-0"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
          aria-label="Send"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
