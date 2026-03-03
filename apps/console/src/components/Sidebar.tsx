'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Zap,
  Sparkles,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConsoleUser } from '@/lib/types';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/dashboard/crm', label: 'CRM', icon: <Users size={18} /> },
  { href: '/dashboard/automations', label: 'Automations', icon: <Zap size={18} /> },
  { href: '/dashboard/ai', label: 'AI', icon: <Sparkles size={18} /> },
  { href: '/dashboard/settings', label: 'Settings', icon: <Settings size={18} /> },
];

interface SidebarProps {
  user: ConsoleUser;
}

export default function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const width = collapsed ? '64px' : '220px';

  return (
    <aside
      className="relative flex flex-col shrink-0 transition-all duration-200"
      style={{
        width,
        minHeight: '100vh',
        backgroundColor: 'var(--bg-subtle)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-2 px-4 py-4"
        style={{ borderBottom: '1px solid var(--border)', height: '56px' }}
      >
        <span className="text-xl shrink-0" style={{ color: 'var(--accent)' }}>
          ✦
        </span>
        {!collapsed && (
          <span className="font-semibold text-sm tracking-wide" style={{ color: 'var(--text)' }}>
            Console
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-2 py-4 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'text-white'
                  : 'hover:bg-[var(--surface)]'
              )}
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--accent-subtle)',
                      color: 'var(--accent)',
                    }
                  : { color: 'var(--text-muted)' }
              }
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Divider + Admin */}
        {user.role === 'admin' && (
          <>
            <div
              className="my-2"
              style={{ height: '1px', backgroundColor: 'var(--border)' }}
            />
            <Link
              href="/admin"
              title={collapsed ? 'Admin' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                pathname.startsWith('/admin')
                  ? 'text-white'
                  : 'hover:bg-[var(--surface)]'
              )}
              style={
                pathname.startsWith('/admin')
                  ? { backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              <span className="shrink-0">
                <Shield size={18} />
              </span>
              {!collapsed && <span>Admin</span>}
            </Link>
          </>
        )}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-center w-6 h-6 rounded-full absolute -right-3 top-[30px] z-10 transition-colors"
        style={{
          backgroundColor: 'var(--surface-raised)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
