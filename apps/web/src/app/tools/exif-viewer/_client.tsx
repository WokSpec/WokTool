'use client';

import { useState, useRef } from 'react';

// ─── EXIF tag dictionary ─────────────────────────────────────────────────────
const EXIF_TAGS: Record<number, string> = {
  0x010F: 'Make', 0x0110: 'Model', 0x0112: 'Orientation',
  0x011A: 'XResolution', 0x011B: 'YResolution', 0x0128: 'ResolutionUnit',
  0x0131: 'Software', 0x0132: 'DateTime', 0x013B: 'Artist',
  0x013E: 'WhitePoint', 0x013F: 'PrimaryChromaticities',
  0x0213: 'YCbCrPositioning', 0x8769: 'ExifIFD', 0x8825: 'GPSIFD',
  0x9000: 'ExifVersion', 0x9003: 'DateTimeOriginal', 0x9004: 'DateTimeDigitized',
  0x9201: 'ShutterSpeedValue', 0x9202: 'ApertureValue',
  0x9204: 'ExposureBiasValue', 0x9205: 'MaxApertureValue',
  0x9207: 'MeteringMode', 0x9208: 'LightSource', 0x9209: 'Flash',
  0x920A: 'FocalLength', 0x9214: 'SubjectArea',
  0xA000: 'FlashPixVersion', 0xA001: 'ColorSpace',
  0xA002: 'PixelXDimension', 0xA003: 'PixelYDimension',
  0xA20E: 'FocalPlaneXResolution', 0xA20F: 'FocalPlaneYResolution',
  0xA210: 'FocalPlaneResolutionUnit', 0xA401: 'CustomRendered',
  0xA402: 'ExposureMode', 0xA403: 'WhiteBalance',
  0xA404: 'DigitalZoomRatio', 0xA405: 'FocalLengthIn35mmFilm',
  0xA406: 'SceneCaptureType', 0xA407: 'GainControl',
  0xA408: 'Contrast', 0xA409: 'Saturation', 0xA40A: 'Sharpness',
  0x829A: 'ExposureTime', 0x829D: 'FNumber',
  0x8822: 'ExposureProgram', 0x8827: 'ISO',
  // GPS tags
  0x0000: 'GPSVersionID', 0x0001: 'GPSLatitudeRef', 0x0002: 'GPSLatitude',
  0x0003: 'GPSLongitudeRef', 0x0004: 'GPSLongitude', 0x0005: 'GPSAltitudeRef',
  0x0006: 'GPSAltitude', 0x0007: 'GPSTimeStamp', 0x0008: 'GPSSatellites',
  0x0009: 'GPSStatus', 0x000A: 'GPSMeasureMode', 0x000C: 'GPSSpeedRef',
  0x000D: 'GPSSpeed', 0x0010: 'GPSImgDirectionRef', 0x0011: 'GPSImgDirection',
  0x0012: 'GPSMapDatum', 0x001D: 'GPSDateStamp',
};

type ExifData = Record<string, string | number | number[]>;

function readExif(buffer: ArrayBuffer): { exif: ExifData; gps: ExifData } {
  const view = new DataView(buffer);
  const exif: ExifData = {};
  const gps: ExifData = {};

  // Find APP1 marker (FF E1)
  let offset = 2;
  while (offset < view.byteLength - 2) {
    const marker = view.getUint16(offset);
    if (marker === 0xFFE1) break;
    if ((marker & 0xFF00) !== 0xFF00) break;
    offset += 2 + view.getUint16(offset + 2);
  }
  if (offset >= view.byteLength - 2) return { exif, gps };

  const app1Start = offset + 4; // skip marker + length
  // Check Exif header
  if (view.getUint32(app1Start) !== 0x45786966) return { exif, gps }; // "Exif"

  const tiffStart = app1Start + 6;
  const byteOrder = view.getUint16(tiffStart);
  const le = byteOrder === 0x4949; // "II" = little endian

  function getUint16(o: number) { return le ? view.getUint16(tiffStart + o, true) : view.getUint16(tiffStart + o); }
  function getUint32(o: number) { return le ? view.getUint32(tiffStart + o, true) : view.getUint32(tiffStart + o); }
  function getInt32(o: number) { return le ? view.getInt32(tiffStart + o, true) : view.getInt32(tiffStart + o); }

  function readRational(o: number): number {
    const num = getUint32(o);
    const den = getUint32(o + 4);
    return den ? num / den : 0;
  }

  function readString(o: number, len: number): string {
    let s = '';
    for (let i = 0; i < len - 1; i++) {
      const c = view.getUint8(tiffStart + o + i);
      if (c === 0) break;
      s += String.fromCharCode(c);
    }
    return s;
  }

  function readIFD(ifdOffset: number, target: ExifData) {
    if (ifdOffset + 2 > view.byteLength - tiffStart) return;
    const count = getUint16(ifdOffset);
    for (let i = 0; i < count; i++) {
      const entry = ifdOffset + 2 + i * 12;
      const tag = getUint16(entry);
      const type = getUint16(entry + 2);
      const num = getUint32(entry + 4);
      const valOff = entry + 8;
      const tagName = EXIF_TAGS[tag] ?? `0x${tag.toString(16)}`;

      if (tagName === 'ExifIFD') { readIFD(getUint32(valOff), target); continue; }
      if (tagName === 'GPSIFD') { readIFD(getUint32(valOff), gps); continue; }

      try {
        if (type === 2) { // ASCII
          const off = num > 4 ? getUint32(valOff) : valOff;
          target[tagName] = readString(off, num);
        } else if (type === 3) { // SHORT
          if (num === 1) target[tagName] = le ? view.getUint16(tiffStart + valOff, true) : view.getUint16(tiffStart + valOff);
          else {
            const off = num > 2 ? getUint32(valOff) : valOff;
            const vals: number[] = [];
            for (let j = 0; j < Math.min(num, 8); j++) vals.push(getUint16(off + j * 2));
            target[tagName] = vals;
          }
        } else if (type === 4) { // LONG
          target[tagName] = num === 1 ? getUint32(valOff) : getUint32(getUint32(valOff));
        } else if (type === 5) { // RATIONAL
          const off = getUint32(valOff);
          if (num === 1) {
            target[tagName] = readRational(off);
          } else {
            const vals: number[] = [];
            for (let j = 0; j < Math.min(num, 3); j++) vals.push(readRational(off + j * 8));
            target[tagName] = vals;
          }
        } else if (type === 10) { // SRATIONAL
          const off = getUint32(valOff);
          const snum = getInt32(off);
          const sden = getInt32(off + 4);
          target[tagName] = sden ? snum / sden : 0;
        }
      } catch { /* skip bad entry */ }
    }
  }

  const ifd0 = getUint32(4);
  readIFD(ifd0, exif);
  return { exif, gps };
}

function dmsToDecimal(dms: number[]): number {
  return dms[0] + dms[1] / 60 + dms[2] / 3600;
}

function formatValue(key: string, val: string | number | number[]): string {
  if (Array.isArray(val)) {
    if (key === 'GPSLatitude' || key === 'GPSLongitude') return `${val[0]}° ${val[1]}' ${val[2].toFixed(4)}"`;
    return val.map(v => typeof v === 'number' && !Number.isInteger(v) ? v.toFixed(4) : String(v)).join(', ');
  }
  if (key === 'ExposureTime' && typeof val === 'number') return val < 1 ? `1/${Math.round(1 / val)}s` : `${val}s`;
  if (key === 'FNumber' && typeof val === 'number') return `f/${val.toFixed(1)}`;
  if (key === 'FocalLength' && typeof val === 'number') return `${val.toFixed(1)}mm`;
  if (typeof val === 'number' && !Number.isInteger(val)) return val.toFixed(4);
  return String(val);
}

const S: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 860 },
  dropzone: { border: '2px dashed var(--border-strong, rgba(255,255,255,0.15))', borderRadius: 12, padding: '2.5rem', textAlign: 'center' as const, cursor: 'pointer', transition: 'all 0.2s', background: 'var(--bg-surface)' },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.85rem' },
  th: { textAlign: 'left' as const, padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' as const, borderBottom: '1px solid var(--border)' },
  td: { padding: '0.45rem 0.75rem', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.03)', verticalAlign: 'top' as const },
  tdKey: { padding: '0.45rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.03)', whiteSpace: 'nowrap' as const },
  section: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' },
  sectionTitle: { padding: '0.75rem 1rem', background: 'var(--bg-elevated, #161616)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)', borderBottom: '1px solid var(--border)' },
};

const CAMERA_TAGS = ['Make', 'Model', 'Software', 'Artist'];
const IMAGE_TAGS = ['DateTime', 'DateTimeOriginal', 'PixelXDimension', 'PixelYDimension', 'Orientation', 'ColorSpace', 'ExifVersion'];
const SETTINGS_TAGS = ['ExposureTime', 'FNumber', 'ISO', 'FocalLength', 'ExposureBiasValue', 'MeteringMode', 'Flash', 'ExposureProgram', 'WhiteBalance', 'FocalLengthIn35mmFilm'];

export default function ExifViewerClient() {
  const [dragging, setDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string; type: string; dims?: string } | null>(null);
  const [exif, setExif] = useState<ExifData | null>(null);
  const [gps, setGps] = useState<ExifData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError(''); setExif(null); setGps(null); setPreviewUrl(null); setFileInfo(null);
    if (!file.type.includes('jpeg') && !file.type.includes('jpg') && !file.name.toLowerCase().endsWith('.jpg') && !file.name.toLowerCase().endsWith('.jpeg')) {
      setError('EXIF parsing supports JPEG files only.');
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    const sizeFmt = file.size < 1024 ? `${file.size} B` : file.size < 1048576 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / 1048576).toFixed(2)} MB`;
    // Get dimensions via image element
    const img = new Image();
    img.onload = () => {
      setFileInfo({ name: file.name, size: sizeFmt, type: file.type || 'image/jpeg', dims: `${img.naturalWidth} × ${img.naturalHeight}` });
    };
    img.src = url;
    // Parse EXIF
    const buf = await file.arrayBuffer();
    try {
      const { exif: e, gps: g } = readExif(buf);
      setExif(e);
      setGps(g);
    } catch (err) {
      setExif({});
      setGps({});
    }
    setFileInfo({ name: file.name, size: sizeFmt, type: file.type || 'image/jpeg' });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  };

  const Section = ({ title, data, keys }: { title: string; data: ExifData; keys: string[] }) => {
    const entries = keys.filter(k => data[k] !== undefined);
    if (!entries.length) return null;
    return (
      <div style={S.section}>
        <div style={S.sectionTitle}>{title}</div>
        <table style={S.table}>
          <tbody>
            {entries.map(k => (
              <tr key={k}>
                <td style={S.tdKey}>{k}</td>
                <td style={S.td}>{formatValue(k, data[k])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const gpsDecimal = gps && Array.isArray(gps['GPSLatitude']) && Array.isArray(gps['GPSLongitude']) ? {
    lat: dmsToDecimal(gps['GPSLatitude'] as number[]) * (gps['GPSLatitudeRef'] === 'S' ? -1 : 1),
    lng: dmsToDecimal(gps['GPSLongitude'] as number[]) * (gps['GPSLongitudeRef'] === 'W' ? -1 : 1),
  } : null;

  return (
    <div style={S.root}>
      {/* Dropzone */}
      <div
        style={{ ...S.dropzone, borderColor: dragging ? 'var(--accent)' : undefined, background: dragging ? 'var(--accent-subtle, rgba(129,140,248,0.05))' : undefined }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📷</div>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Drop a JPEG image or click to browse</p>
        <p style={{ color: 'var(--text-faint, rgba(255,255,255,0.18))', fontSize: '0.8rem', marginTop: 4 }}>EXIF data is extracted entirely in your browser</p>
        <input ref={fileRef} type="file" accept="image/jpeg,image/jpg" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
      </div>

      {error && <div style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</div>}

      {previewUrl && (
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Preview */}
          <div style={{ flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" style={{ maxWidth: 240, maxHeight: 180, borderRadius: 8, border: '1px solid var(--border)', objectFit: 'cover' }} />
          </div>
          {/* File info */}
          {fileInfo && (
            <div style={{ ...S.section, flex: 1, minWidth: 220 }}>
              <div style={S.sectionTitle}>File Info</div>
              <table style={S.table}><tbody>
                {[['Name', fileInfo.name], ['Size', fileInfo.size], ['Type', fileInfo.type], fileInfo.dims ? ['Dimensions', fileInfo.dims] : null].filter(Boolean).map(([k, v]) => (
                  <tr key={k as string}><td style={S.tdKey}>{k}</td><td style={S.td}>{v}</td></tr>
                ))}
              </tbody></table>
            </div>
          )}
        </div>
      )}

      {exif && (
        <>
          <Section title="📸 Camera Info" data={exif} keys={CAMERA_TAGS} />
          <Section title="🖼️ Image Info" data={exif} keys={IMAGE_TAGS} />
          <Section title="⚙️ Exposure Settings" data={exif} keys={SETTINGS_TAGS} />

          {gps && Object.keys(gps).length > 0 && (
            <div style={S.section}>
              <div style={S.sectionTitle}>📍 GPS Info</div>
              <table style={S.table}><tbody>
                {Object.entries(gps).map(([k, v]) => (
                  <tr key={k}><td style={S.tdKey}>{k}</td><td style={S.td}>{formatValue(k, v)}</td></tr>
                ))}
                {gpsDecimal && (
                  <tr>
                    <td style={S.tdKey}>Map Link</td>
                    <td style={S.td}>
                      <a href={`https://www.google.com/maps?q=${gpsDecimal.lat},${gpsDecimal.lng}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                        {gpsDecimal.lat.toFixed(6)}, {gpsDecimal.lng.toFixed(6)} ↗
                      </a>
                    </td>
                  </tr>
                )}
              </tbody></table>
            </div>
          )}

          {/* All raw tags */}
          <details>
            <summary style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.875rem', userSelect: 'none' }}>Show all EXIF tags ({Object.keys(exif).length})</summary>
            <div style={{ ...S.section, marginTop: 8 }}>
              <table style={S.table}><tbody>
                {Object.entries(exif).map(([k, v]) => (
                  <tr key={k}><td style={S.tdKey}>{k}</td><td style={S.td}>{formatValue(k, v)}</td></tr>
                ))}
              </tbody></table>
            </div>
          </details>
        </>
      )}
    </div>
  );
}
