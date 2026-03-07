import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'Screen Recorder — WokTool',
  description: 'Capture your screen, window, or tab instantly. Record system audio and microphone. No install required.',
};

const Client = dynamic(() => import('@/components/tools/ScreenRecorderTool'), { ssr: false });

export default function Page() {
  return (
    <ToolShell
      id="screen-recorder"
      label="Screen Recorder"
      description="Professional browser-based screen capture. Record video and audio without installing software. Privacy-first local processing."
      icon="Monitor"
    >
      <Client />
    </ToolShell>
  );
}
