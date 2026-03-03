import { getSessionOrMock } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import { UserProvider } from '@/lib/user-context';
import ConsolePage from './ConsolePage';

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionOrMock();

  return (
    <UserProvider user={user}>
      <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        <Sidebar user={user} />
        <ConsolePage user={user}>{children}</ConsolePage>
      </div>
    </UserProvider>
  );
}
