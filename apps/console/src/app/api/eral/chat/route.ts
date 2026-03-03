import { NextRequest, NextResponse } from 'next/server';

const ERAL_API = process.env.ERAL_API_URL ?? 'https://eral.wokspec.org/api';

interface ChatRequestBody {
  message: string;
  sessionId: string;
  pageContext?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;

    const res = await fetch(`${ERAL_API}/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.ERAL_API_KEY
          ? { Authorization: `Bearer ${process.env.ERAL_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        message: body.message,
        sessionId: body.sessionId,
        pageContext: body.pageContext,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { reply: 'Eral is unavailable right now. Please try again later.' },
        { status: 200 }
      );
    }

    const data = (await res.json()) as { reply?: string; sessionId?: string };
    return NextResponse.json({ reply: data.reply, sessionId: data.sessionId ?? body.sessionId });
  } catch {
    return NextResponse.json(
      { reply: 'Eral is unavailable right now. Please try again later.' },
      { status: 200 }
    );
  }
}
