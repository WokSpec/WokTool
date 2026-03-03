import { NextRequest } from 'next/server';
import ytdl from '@distube/ytdl-core';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limiter';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';
// Allow up to 60 s on Vercel Pro; on Hobby the hard cap is 10 s
export const maxDuration = 60;

function isYouTubeUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'].includes(hostname);
  } catch { return false; }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w\s.-]/g, '').trim().replace(/\s+/g, '_').slice(0, 120);
}

export async function GET(req: NextRequest) {
  const rl = checkRateLimit(getRateLimitKey(req, 'yt-dl'), 10, 60_000);
  if (!rl.ok) {
    return new Response('Too many requests.', {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
    });
  }

  const { searchParams } = req.nextUrl;
  const url = searchParams.get('url');
  const itag = searchParams.get('itag');
  const label = searchParams.get('label') ?? 'download';

  if (!url || !itag) {
    return new Response('url and itag are required.', { status: 400 });
  }
  if (!isYouTubeUrl(url)) {
    return new Response('Only YouTube URLs are supported.', { status: 400 });
  }

  const itagNum = parseInt(itag);
  if (isNaN(itagNum)) {
    return new Response('Invalid itag.', { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(url);
    const format = info.formats.find(f => f.itag === itagNum);
    if (!format) {
      return new Response('Requested format not available.', { status: 404 });
    }

    const isAudio = !format.hasVideo;
    const ext = format.container ?? (isAudio ? 'm4a' : 'mp4');
    const title = sanitizeFilename(info.videoDetails.title);
    const filename = `${title}.${ext}`;

    const mimeType = isAudio
      ? `audio/${ext === 'webm' ? 'webm' : 'mp4'}`
      : `video/${ext}`;

    const nodeStream = ytdl.downloadFromInfo(info, { format });

    // Convert Node.js Readable to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', chunk => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', err => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    const headers: Record<string, string> = {
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    };
    if (format.contentLength) {
      headers['Content-Length'] = format.contentLength;
    }

    return new Response(webStream, { headers });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(`Download failed: ${msg}`, { status: 502 });
  }
}
