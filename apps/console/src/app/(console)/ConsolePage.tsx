'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import type { ConsoleUser } from '@/lib/types';

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/crm': 'CRM',
  '/dashboard/automations': 'Automations',
  '/dashboard/ai': 'Eral AI',
  '/dashboard/settings': 'Settings',
  '/admin': 'Admin Overview',
  '/admin/clients/new': 'New Client',
};

function getTitle(pathname: string): string {
  return TITLES[pathname] ?? 'Console';
}

export default function ConsolePage({
  user,
  children,
}: {
  user: ConsoleUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col flex-1 min-w-0">
      <Header user={user} title={getTitle(pathname)} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
