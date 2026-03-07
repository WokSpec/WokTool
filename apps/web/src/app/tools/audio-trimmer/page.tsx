import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'Audio Trimmer — WokTool',
  description: 'Visually trim and cut audio files in your browser. Waveform editor with precision controls.',
};

import Client from '@/components/tools/AudioTrimmerTool';

export default function Page() {
  return (
    <ToolShell
      id="audio-trimmer"
      label="Audio Trimmer"
      description="Precision audio editing suite. Visual waveform interface for trimming MP3, WAV, and M4A files. Lossless export."
      icon="Scissors"
    >
      <Client />
    </ToolShell>
  );
}
