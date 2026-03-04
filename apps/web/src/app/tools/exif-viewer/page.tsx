import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'EXIF / Image Metadata Viewer — WokTool',
  description: 'View EXIF metadata from JPEG images: camera info, GPS coordinates, exposure settings. Pure browser-side EXIF parser.',
  openGraph: { title: 'EXIF / Image Metadata Viewer — WokTool', description: 'View EXIF metadata and GPS data from images.', type: 'website' },
};
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

const Client = dynamic(() => import('./_client'), { ssr: false });

export default function Page() {
  return (
    <ToolShell id="exif-viewer" label="EXIF / Image Metadata Viewer" description="Extract camera info, GPS coordinates, and exposure settings from JPEG images. No server upload needed." icon="📷">
      <Client />
    </ToolShell>
  );
}
