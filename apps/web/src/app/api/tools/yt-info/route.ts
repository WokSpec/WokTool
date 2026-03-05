import { NextRequest } from 'next/server';
import ytdl from '@distube/ytdl-core';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

function isYouTubeUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'].includes(hostname);
  } catch { return false; }
}

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(getRateLimitKey(req, 'yt-info'), 30, 60_000);
  if (!rl.ok) {
    return Response.json({ error: 'Too many requests.' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
    });
  }

  let url: string;
  try {
    ({ url } = await req.json());
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!url || typeof url !== 'string') {
    return Response.json({ error: 'url is required.' }, { status: 400 });
  }
  if (!isYouTubeUrl(url)) {
    return Response.json({ error: 'Only YouTube URLs are supported.' }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(url);
    const { videoDetails } = info;

    // Build a clean list of downloadable formats
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly')
      .sort((a, b) => (b.audioBitrate ?? 0) - (a.audioBitrate ?? 0))
      .map(f => ({
        itag: f.itag,
        container: f.container,
        audioBitrate: f.audioBitrate,
        audioCodec: f.audioCodec,
        contentLength: f.contentLength,
        label: `Audio — ${f.audioBitrate ?? '?'}kbps ${f.container?.toUpperCase()}`,
        ext: (f.container as string) === 'm4a' ? 'm4a' : 'webm',
        type: 'audio' as const,
      }));

    const videoFormats = ytdl.filterFormats(info.formats, f =>
      !!(f.hasVideo && f.hasAudio)
    )
      .sort((a, b) => (parseInt(b.qualityLabel ?? '0') || 0) - (parseInt(a.qualityLabel ?? '0') || 0))
      .map(f => ({
        itag: f.itag,
        container: f.container,
        qualityLabel: f.qualityLabel,
        audioBitrate: f.audioBitrate,
        contentLength: f.contentLength,
        label: `Video — ${f.qualityLabel} ${f.container?.toUpperCase()}`,
        ext: f.container || 'mp4',
        type: 'video' as const,
      }));

    // Adaptive formats (Video only) - often higher quality
    const adaptiveFormats = ytdl.filterFormats(info.formats, f => f.hasVideo && !f.hasAudio)
      .sort((a, b) => (parseInt(b.qualityLabel ?? '0') || 0) - (parseInt(a.qualityLabel ?? '0') || 0))
      .filter(f => parseInt(f.qualityLabel ?? '0') >= 1080)
      .slice(0, 3)
      .map(f => ({
        itag: f.itag,
        container: f.container,
        qualityLabel: f.qualityLabel,
        contentLength: f.contentLength,
        label: `High-Res — ${f.qualityLabel} (No Audio) ${f.container?.toUpperCase()}`,
        ext: f.container || 'mp4',
        type: 'video' as const,
      }));

    return Response.json({
      title: videoDetails.title,
      author: videoDetails.author?.name,
      durationSeconds: parseInt(videoDetails.lengthSeconds),
      thumbnail: videoDetails.thumbnails.at(-1)?.url,
      viewCount: videoDetails.viewCount,
      formats: [...audioFormats.slice(0, 6), ...videoFormats, ...adaptiveFormats],
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return Response.json({ error: `Could not fetch video info: ${msg}` }, { status: 502 });
  }
}
