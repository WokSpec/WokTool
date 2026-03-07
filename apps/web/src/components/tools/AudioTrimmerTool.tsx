'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Scissors, Download, Music, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Dropzone from '@/components/ui/Dropzone';

export default function AudioTrimmerTool() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selection, setSelection] = useState<[number, number]>([0, 0]); // start, end in seconds
  const [fileName, setFileName] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Audio Context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw Waveform
    ctx.beginPath();
    ctx.moveTo(0, amp);
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.fillStyle = '#4f46e5'; // Indigo-600
      const h = Math.max(1, (max - min) * amp);
      ctx.fillRect(i, (1 + min) * amp, 1, h);
    }

    // Draw Selection Overlay
    const duration = audioBuffer.duration;
    const startX = (selection[0] / duration) * width;
    const endX = (selection[1] / duration) * width;
    
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)'; // Accent glow
    ctx.fillRect(startX, 0, endX - startX, height);
    
    // Draw Playhead
    const playX = (currentTime / duration) * width;
    ctx.fillStyle = '#ef4444'; // Red playhead
    ctx.fillRect(playX, 0, 2, height);

  }, [audioBuffer, selection, currentTime]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('audio/')) return;
    setFileName(file.name);
    
    const arrayBuffer = await file.arrayBuffer();
    if (!audioContextRef.current) return;
    
    const buffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
    setAudioBuffer(buffer);
    setSelection([0, buffer.duration]);
    setCurrentTime(0);
  };

  const playAudio = () => {
    if (!audioContextRef.current || !audioBuffer) return;

    if (sourceNodeRef.current) sourceNodeRef.current.stop();

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    
    // Start from selection start or current time if within selection
    let start = currentTime;
    if (currentTime < selection[0] || currentTime >= selection[1]) {
        start = selection[0];
        setCurrentTime(start);
    }

    source.start(0, start, selection[1] - start);
    sourceNodeRef.current = source;
    startTimeRef.current = audioContextRef.current.currentTime - start;
    setIsPlaying(true);

    const animate = () => {
        if (!audioContextRef.current) return;
        const now = audioContextRef.current.currentTime - startTimeRef.current;
        if (now >= selection[1]) {
            stopAudio();
            setCurrentTime(selection[0]);
        } else {
            setCurrentTime(now);
            animationFrameRef.current = requestAnimationFrame(animate);
        }
    };
    animationFrameRef.current = requestAnimationFrame(animate);

    source.onended = () => {
        setIsPlaying(false);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
        try { sourceNodeRef.current.stop(); } catch {}
        sourceNodeRef.current = null;
    }
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setIsPlaying(false);
  };

  const togglePlay = () => isPlaying ? stopAudio() : playAudio();

  const trimAndExport = () => {
    if (!audioBuffer) return;
    
    // Create offline context to render new buffer
    const duration = selection[1] - selection[0];
    const offlineCtx = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        duration * audioBuffer.sampleRate,
        audioBuffer.sampleRate
    );

    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineCtx.destination);
    source.start(0, selection[0], duration);

    offlineCtx.startRendering().then(renderedBuffer => {
        // Convert AudioBuffer to WAV (simplified)
        const wav = audioBufferToWav(renderedBuffer);
        const blob = new Blob([wav], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `trimmed-${fileName.replace(/\.[^/.]+$/, "")}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
  };

  // Helper: Simple WAV encoder
  function audioBufferToWav(buffer: AudioBuffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    let result;
    if (numChannels === 2) {
        result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
        result = buffer.getChannelData(0);
    }

    return encodeWAV(result, format, sampleRate, numChannels, bitDepth);
  }

  function interleave(inputL: Float32Array, inputR: Float32Array) {
    const length = inputL.length + inputR.length;
    const result = new Float32Array(length);
    let index = 0;
    let inputIndex = 0;
    while (index < length) {
        result[index++] = inputL[inputIndex];
        result[index++] = inputR[inputIndex];
        inputIndex++;
    }
    return result;
  }

  function encodeWAV(samples: Float32Array, format: number, sampleRate: number, numChannels: number, bitDepth: number) {
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
    const view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* RIFF chunk length */
    view.setUint32(4, 36 + samples.length * bytesPerSample, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, format, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * blockAlign, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, blockAlign, true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * bytesPerSample, true);

    floatTo16BitPCM(view, 44, samples);

    return view;
  }

  function floatTo16BitPCM(output: DataView, offset: number, input: Float32Array) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  }

  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!audioBuffer) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickTime = (x / rect.width) * audioBuffer.duration;
    
    // Simple logic: if closer to start, move start; if closer to end, move end
    const distStart = Math.abs(clickTime - selection[0]);
    const distEnd = Math.abs(clickTime - selection[1]);
    
    if (distStart < distEnd) {
        setSelection([clickTime, selection[1]]);
        setCurrentTime(clickTime);
    } else {
        setSelection([selection[0], clickTime]);
        setCurrentTime(clickTime);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {!audioBuffer ? (
        <Dropzone 
            onFileSelect={handleFile} 
            accept="audio/*" 
            label="Upload Audio File" 
            description="MP3, WAV, M4A supported"
            className="h-64"
        />
      ) : (
        <div className="space-y-6">
            <div className="relative h-48 bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 shadow-inner group cursor-crosshair">
                <canvas 
                    ref={canvasRef} 
                    width={1000} 
                    height={200} 
                    className="w-full h-full"
                    onClick={handleCanvasClick}
                />
            </div>

            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                <div className="flex items-center gap-4">
                    <Button onClick={togglePlay} variant={isPlaying ? 'secondary' : 'primary'} icon={isPlaying ? <Pause size={16} /> : <Play size={16} />}>
                        {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <div className="font-mono text-sm text-zinc-400 space-x-2">
                        <span>{selection[0].toFixed(2)}s</span>
                        <span className="text-zinc-600">to</span>
                        <span>{selection[1].toFixed(2)}s</span>
                        <span className="text-zinc-600">|</span>
                        <span className="text-white">{(selection[1] - selection[0]).toFixed(2)}s duration</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button onClick={() => setAudioBuffer(null)} variant="ghost" icon={<RotateCcw size={16} />}>
                        Reset
                    </Button>
                    <Button onClick={trimAndExport} variant="primary" icon={<Scissors size={16} />}>
                        Trim & Download
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
