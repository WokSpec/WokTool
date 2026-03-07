'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import Dropzone from '@/components/ui/Dropzone';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// ─── EXIF tag dictionary ─────────────────────────────────────────────────────
const EXIF_TAGS: Record<number, string> = {
  0x010F: 'Make', 0x0110: 'Model', 0x0112: 'Orientation',
  0x011A: 'XResolution', 0x011B: 'YResolution', 0x0128: 'ResolutionUnit',
  0x0131: 'Software', 0x0132: 'DateTime', 0x013B: 'Artist',
  0x8769: 'ExifIFD', 0x8825: 'GPSIFD',
  0x9000: 'ExifVersion', 0x9003: 'DateTimeOriginal', 0x9004: 'DateTimeDigitized',
  0x9201: 'ShutterSpeed', 0x9202: 'Aperture',
  0x9204: 'ExposureBias', 0x9207: 'MeteringMode', 0x9208: 'LightSource', 0x9209: 'Flash',
  0x920A: 'FocalLength', 0x829A: 'ExposureTime', 0x829D: 'FNumber',
  0x8827: 'ISO',
  0x0001: 'GPSLatitudeRef', 0x0002: 'GPSLatitude',
  0x0003: 'GPSLongitudeRef', 0x0004: 'GPSLongitude',
  0x0006: 'GPSAltitude',
};

type ExifData = Record<string, any>;

function readExif(buffer: ArrayBuffer): { exif: ExifData; gps: ExifData } {
  const view = new DataView(buffer);
  const exif: ExifData = {};
  const gps: ExifData = {};

  let offset = 2;
  while (offset < view.byteLength - 2) {
    const marker = view.getUint16(offset);
    if (marker === 0xFFE1) break;
    offset += 2 + view.getUint16(offset + 2);
  }
  if (offset >= view.byteLength - 2) return { exif, gps };

  const app1Start = offset + 4;
  if (view.getUint32(app1Start) !== 0x45786966) return { exif, gps };

  const tiffStart = app1Start + 6;
  const le = view.getUint16(tiffStart) === 0x4949;

  function getU16(o: number) { return view.getUint16(tiffStart + o, le); }
  function getU32(o: number) { return view.getUint32(tiffStart + o, le); }

  function readRational(o: number) {
    const n = getU32(o), d = getU32(o + 4);
    return d ? n / d : 0;
  }

  function readIFD(ifdOffset: number, target: ExifData) {
    if (ifdOffset + 2 > view.byteLength - tiffStart) return;
    const count = getU16(ifdOffset);
    for (let i = 0; i < count; i++) {
      const entry = ifdOffset + 2 + i * 12;
      const tag = getU16(entry), type = getU16(entry + 2), num = getU32(entry + 4), valOff = entry + 8;
      const tagName = EXIF_TAGS[tag] ?? `0x${tag.toString(16)}`;

      if (tagName === 'ExifIFD') { readIFD(getU32(valOff), target); continue; }
      if (tagName === 'GPSIFD') { readIFD(getU32(valOff), gps); continue; }

      try {
        if (type === 2) {
            const off = num > 4 ? getU32(valOff) : valOff;
            let s = '';
            for (let j = 0; j < num - 1; j++) {
                const c = view.getUint8(tiffStart + off + j);
                if (c === 0) break;
                s += String.fromCharCode(c);
            }
            target[tagName] = s;
        } else if (type === 3) target[tagName] = getU16(valOff);
        else if (type === 4) target[tagName] = getU32(valOff);
        else if (type === 5) {
            const off = getU32(valOff);
            target[tagName] = num === 1 ? readRational(off) : [readRational(off), readRational(off+8), readRational(off+16)];
        }
      } catch {}
    }
  }

  readIFD(getU32(4), exif);
  return { exif, gps };
}

function formatVal(k: string, v: any): string {
  if (k === 'ExposureTime' && typeof v === 'number') return v < 1 ? `1/${Math.round(1/v)}s` : `${v}s`;
  if (k === 'FNumber' && typeof v === 'number') return `f/${v.toFixed(1)}`;
  if (k === 'FocalLength' && typeof v === 'number') return `${v}mm`;
  if (Array.isArray(v)) return v.map(x => typeof x === 'number' ? x.toFixed(2) : x).join(', ');
  return String(v);
}

export default function ExifViewerClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [data, setData] = useState<{ exif: ExifData; gps: ExifData } | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string; dims: string } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const processFile = async (file: File) => {
    if (!file.type.includes('jpeg')) { alert('Only JPEG files support EXIF.'); return; }
    setLoading(true);
    const url = URL.createObjectURL(file);
    setPreview(url);
    
    const img = new Image();
    img.onload = () => setFileInfo({ name: file.name, size: (file.size/1024).toFixed(1) + ' KB', dims: `${img.naturalWidth}×${img.naturalHeight}` });
    img.src = url;

    const buf = await file.arrayBuffer();
    setTimeout(() => {
        setData(readExif(buf));
        setLoading(false);
    }, 100);
  };

  const sections = [
    { title: 'Camera', icon: '📸', tags: ['Make', 'Model', 'Software', 'Artist'] },
    { title: 'Exposure', icon: '⚙️', tags: ['ExposureTime', 'FNumber', 'ISO', 'FocalLength', 'ExposureBias', 'MeteringMode', 'Flash'] },
    { title: 'Image', icon: '🖼️', tags: ['DateTime', 'DateTimeOriginal', 'XResolution', 'YResolution', 'ExifVersion'] },
  ];

  const gpsPos = useMemo(() => {
    if (!data?.gps?.GPSLatitude || !data?.gps?.GPSLongitude) return null;
    const dms = (arr: number[]) => arr[0] + arr[1]/60 + arr[2]/3600;
    const lat = dms(data.gps.GPSLatitude) * (data.gps.GPSLatitudeRef === 'S' ? -1 : 1);
    const lng = dms(data.gps.GPSLongitude) * (data.gps.GPSLongitudeRef === 'W' ? -1 : 1);
    return { lat, lng };
  }, [data]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {!preview ? (
        <Dropzone onFileSelect={processFile} accept="image/jpeg" label="Drop JPEG to view metadata" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
                <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                        {fileInfo && (
                            <>
                                <h4 className="text-white font-bold truncate">{fileInfo.name}</h4>
                                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{fileInfo.dims} • {fileInfo.size}</p>
                            </>
                        )}
                    </div>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => { setPreview(null); setData(null); }}>Change Image</Button>
            </div>

            <div className="lg:col-span-2 space-y-6">
                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4 text-white/20">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium">Extracting metadata...</span>
                    </div>
                ) : data && (
                    <div className="grid grid-cols-1 gap-6">
                        {sections.map(s => {
                            const entries = s.tags.filter(t => data.exif[t] !== undefined);
                            if (!entries.length) return null;
                            return (
                                <Card key={s.title} title={`${s.icon} ${s.title}`}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                        {entries.map(t => (
                                            <div key={t} className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                                                <span className="text-xs text-white/30 font-medium">{t}</span>
                                                <span className="text-xs text-white/80 font-bold">{formatVal(t, data.exif[t])}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            );
                        })}

                        {gpsPos && (
                            <Card title="📍 Location Data">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                            <div className="text-[10px] text-white/20 uppercase font-bold mb-1">Latitude</div>
                                            <div className="text-sm font-mono text-accent">{gpsPos.lat.toFixed(6)}</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                            <div className="text-[10px] text-white/20 uppercase font-bold mb-1">Longitude</div>
                                            <div className="text-sm font-mono text-accent">{gpsPos.lng.toFixed(6)}</div>
                                        </div>
                                    </div>
                                    <Button 
                                        href={`https://www.google.com/maps?q=${gpsPos.lat},${gpsPos.lng}`} 
                                        target="_blank" 
                                        variant="secondary" 
                                        className="w-full"
                                    >
                                        View on Google Maps
                                    </Button>
                                </div>
                            </Card>
                        )}

                        <details className="group">
                            <summary className="cursor-pointer text-xs font-bold text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors list-none flex items-center gap-2">
                                <span className="w-4 h-px bg-white/10" />
                                All Raw Metadata ({Object.keys(data.exif).length})
                            </summary>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {Object.entries(data.exif).map(([k, v]) => (
                                    <div key={k} className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                                        <div className="text-[9px] text-white/20 font-mono truncate">{k}</div>
                                        <div className="text-[10px] text-white/60 font-bold truncate">{String(v)}</div>
                                    </div>
                                ))}
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}
