import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Word Frequency Counter — WokTool',
  description: 'Analyze word frequency in text. Stop words filter, Flesch reading ease score, reading time estimate. Export as CSV.',
  openGraph: { title: 'Word Frequency Counter — WokTool', description: 'Analyze word frequency and text statistics.', type: 'website' },
};
import ToolShell from '@/components/tools/ToolShell';

import Client from './_client';

export default function Page() {
  return (
    <ToolShell id="word-frequency" label="Word Frequency Counter" description="Word frequency table, reading ease score, reading time estimate, unique words. Export CSV." icon="📊">
      <Client />
    </ToolShell>
  );
}
