import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';
import Client from '@/components/tools/ScreenRecorderTool';

export const metadata: Metadata = {
  title: 'Screen Recorder — WokTool',
  description: 'Capture your screen, window, or tab instantly. Record system audio and microphone. No install required.',
};

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
