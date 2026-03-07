'use client';

import { useState, useRef, useEffect } from 'react';
import { Video, Mic, Square, Download, Monitor, Play, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Switch from '@/components/ui/Switch';

export default function ScreenRecorderTool() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [timer, setTimer] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stream, previewUrl]);

  const startCapture = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 60 },
        audio: audioEnabled // System audio
      });

      let finalStream = videoStream;

      // If we want mic audio mixed in, we need a separate stream
      if (audioEnabled) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioContext = new AudioContext();
          const dest = audioContext.createMediaStreamDestination();
          
          if (videoStream.getAudioTracks().length > 0) {
            const sysSource = audioContext.createMediaStreamSource(videoStream);
            sysSource.connect(dest);
          }
          
          const micSource = audioContext.createMediaStreamSource(micStream);
          micSource.connect(dest);
          
          finalStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...dest.stream.getAudioTracks()
          ]);
        } catch (err) {
          console.warn('Mic access denied or unavailable', err);
        }
      }

      setStream(finalStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = finalStream;
      }

      // Detect stop sharing
      finalStream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };

    } catch (err) {
      console.error("Error starting screen capture:", err);
    }
  };

  const startRecording = () => {
    if (!stream) return;
    
    setRecordedChunks([]);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
    
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordedChunks(prev => [...prev, e.data]);
      }
    };

    recorder.start(1000); // Collect 1s chunks
    mediaRecorderRef.current = recorder;
    setRecording(true);
    setPaused(false);
    
    // Timer
    setTimer(0);
    timerRef.current = setInterval(() => {
        setTimer(t => t + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
        mediaRecorderRef.current.stop();
        if (timerRef.current) clearInterval(timerRef.current);
        
        // Wait a bit for the last chunk
        setTimeout(() => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            
            // Stop tracks
            if (stream) stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setRecording(false);
        }, 500);
    }
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const download = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `screen-recording-${new Date().toISOString()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
            <Card title="Configuration">
                <div className="space-y-6">
                    <Switch 
                        checked={audioEnabled} 
                        onChange={setAudioEnabled} 
                        label="Include Audio" 
                        description="Record microphone & system audio" 
                    />
                    
                    <div className="pt-4 border-t border-white/[0.06] space-y-3">
                        {!recording && !previewUrl && (
                            <Button onClick={startCapture} className="w-full" icon={<Monitor size={16} />}>
                                {stream ? 'Select Different Screen' : 'Select Screen'}
                            </Button>
                        )}
                        
                        {stream && !recording && (
                            <Button onClick={startRecording} variant="primary" className="w-full" icon={<Video size={16} />}>
                                Start Recording
                            </Button>
                        )}

                        {recording && (
                            <Button onClick={stopRecording} variant="danger" className="w-full" icon={<Square size={16} />}>
                                Stop Recording
                            </Button>
                        )}
                        
                        {previewUrl && (
                            <Button onClick={() => { setPreviewUrl(null); setRecordedChunks([]); }} variant="secondary" className="w-full" icon={<RotateCcw size={16} />}>
                                New Recording
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <div className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${recording ? 'bg-red-500 animate-pulse' : 'bg-zinc-700'}`} />
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
                        {recording ? 'Recording' : 'Ready'}
                    </span>
                </div>
                <div className="text-xl font-mono font-bold text-white tabular-nums">
                    {formatTime(timer)}
                </div>
            </div>
        </div>

        <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-black border border-white/[0.08] shadow-2xl flex items-center justify-center">
                {stream && !previewUrl ? (
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-contain" />
                ) : previewUrl ? (
                    <video src={previewUrl} controls className="w-full h-full object-contain" />
                ) : (
                    <div className="text-center space-y-4 opacity-30">
                        <Monitor size={64} className="mx-auto" strokeWidth={1} />
                        <p className="text-sm font-bold uppercase tracking-widest">No Signal Input</p>
                    </div>
                )}
            </div>
            
            {previewUrl && (
                <div className="mt-6 flex justify-end">
                    <Button onClick={download} size="lg" icon={<Download size={18} />}>
                        Download Recording
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
