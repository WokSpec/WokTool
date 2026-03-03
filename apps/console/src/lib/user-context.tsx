'use client';

import { createContext, useContext } from 'react';
import type { ConsoleUser } from '@/lib/types';

export const UserContext = createContext<ConsoleUser | null>(null);

export function useUser(): ConsoleUser {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}

export function UserProvider({
  user,
  children,
}: {
  user: ConsoleUser;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
