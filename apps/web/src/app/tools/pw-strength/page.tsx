import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Password Strength Analyzer — WokTool',
  description: 'Analyze password strength, estimate crack time, and generate secure passwords. Entropy-based scoring. Fully client-side.',
  openGraph: { title: 'Password Strength Analyzer — WokTool', description: 'Analyze password strength and generate secure passwords.', type: 'website' },
};
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

const Client = dynamic(() => import('./_client'), { ssr: false });

export default function Page() {
  return (
    <ToolShell id="pw-strength" label="Password Strength Analyzer" description="Entropy-based strength analysis, crack time estimate, common password detection, and secure password generator." icon="🛡️">
      <Client />
    </ToolShell>
  );
}
