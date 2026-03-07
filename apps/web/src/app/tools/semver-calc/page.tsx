import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'Semver Calculator — WokTool',
  description: 'Calculate, compare, and validate semantic versions in your browser.',
};

import Client from './_client';

export default function Page() {
  return (
    <ToolShell id="semver-calc" label="Semver Calculator" description="Calculate next versions, compare semver strings, validate, and check ranges. All client-side." icon="🔢">
      <Client />
    </ToolShell>
  );
}
