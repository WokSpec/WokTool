import { NextRequest, NextResponse } from 'next/server';

const ERAL_API = process.env.ERAL_API_URL ?? 'https://eral.wokspec.org/api';
const ERAL_API_KEY = process.env.ERAL_API_KEY ?? '';

interface ChatRequestBody {
  message: string;
  sessionId: string;
  pageContext?: string;
  integration?: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  try {
    if (!ERAL_API_KEY) {
      return NextResponse.json({ error: 'Eral not configured' }, { status: 503 });
    }

    const body = (await req.json()) as ChatRequestBody;
    const message = String(body.message ?? '').trim();
    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    const res = await fetch(`${ERAL_API}/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ERAL_API_KEY}`,
        'X-Eral-Source': 'woktool',
      },
      body: JSON.stringify({
        message,
        sessionId: body.sessionId ?? 'woktool-default',
        product: 'woktool',
        pageContext: body.pageContext,
        integration: body.integration,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ reply: 'Eral is unavailable right now. Please try again later.' }, { status: 200 });
    }

    const data = (await res.json()) as {
      data?: { response?: string; sessionId?: string; model?: string };
    };

    return NextResponse.json({
      reply: data.data?.response ?? 'Eral is unavailable right now. Please try again later.',
      sessionId: data.data?.sessionId ?? body.sessionId ?? 'woktool-default',
      model: data.data?.model ?? 'eral',
    });
  } catch {
    return NextResponse.json(
      { reply: 'Eral is unavailable right now. Please try again later.' },
      { status: 200 }
    );
  }
}
