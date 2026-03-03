import { cookies } from 'next/headers';

export interface ConsoleUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'client';
}

export async function getSession(): Promise<ConsoleUser | null> {
  const sessionCookie = cookies().get('wokspec_session')?.value;
  if (!sessionCookie) return null;
  try {
    const res = await fetch('https://api.wokspec.org/auth/me', {
      headers: { Cookie: `wokspec_session=${sessionCookie}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { user?: ConsoleUser };
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function getSessionOrMock(): Promise<ConsoleUser> {
  const real = await getSession();
  if (real) return real;
  return {
    id: 'demo',
    name: 'Agency Owner',
    email: 'owner@wokspec.org',
    role: 'admin',
  };
}
