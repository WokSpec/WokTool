import type { Metadata } from 'next';
import { Suspense } from 'react';
import ToolShell from '@/components/tools/ToolShell';
import YtDownloaderClient from './_client';

export const metadata: Metadata = {
  title: 'YouTube Downloader',
  description: 'Download YouTube videos as MP4 or extract audio as M4A/WebM. Free, no login required.',
  openGraph: {
    title: 'YouTube Downloader — WokTool',
    description: 'Download YouTube videos as MP4 or extract audio. Free browser tool.',
    type: 'website',
  },
};

export default function Page() {
  return (
    <ToolShell
      id="yt-downloader"
      label="YouTube Downloader"
      description="Download YouTube videos as MP4 or extract audio as M4A. Paste a URL, pick your format, and download. For personal use only."
      icon="▶"
    >
      <Suspense>
        <YtDownloaderClient />
      </Suspense>
    </ToolShell>
  );
}
