import type { Metadata } from 'next';
import { Suspense } from 'react';
import ToolsHubClient from './page-client';

export const metadata: Metadata = {
  title: 'All Tools',
  description: 'Browse all 80+ free browser-based tools on WokTool — image editing, dev utilities, design tools, and more.',
};

export default function ToolsPage() {
  return (
    <Suspense>
      <ToolsHubClient />
    </Suspense>
  );
}
