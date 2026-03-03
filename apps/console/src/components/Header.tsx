'use client';

import { Bell } from 'lucide-react';
import type { ConsoleUser } from '@/lib/types';

interface HeaderProps {
  user: ConsoleUser;
  title: string;
}

export default function Header({ user, title }: HeaderProps) {
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <header
      className="flex items-center justify-between px-6 h-14 shrink-0"
      style={{
        backgroundColor: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <h1 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
        {title}
      </h1>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[var(--surface)]"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Notifications"
        >
          <Bell size={16} />
          {/* badge */}
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--accent)' }}
          />
        </button>

        {/* Avatar */}
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold shrink-0 select-none"
          style={{
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
          }}
          title={user.name}
        >
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            initial
          )}
        </div>
      </div>
    </header>
  );
}
