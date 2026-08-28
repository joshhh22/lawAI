import { NextRequest, NextResponse } from 'next/server';
import { analyzeLegalCase } from '@/lib/gemini';
import { AnalyzeRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    let body: AnalyzeRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Format JSON permintaan tidak valid.' },
        { status: 400 }
      );
    }

    if (!body || typeof body.caseText !== 'string' || body.caseText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Silakan ketik pertanyaan atau sapaan Anda.' },
        { status: 400 }
      );
    }

    const result = await analyzeLegalCase(body.caseText.trim(), body.domain);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error analyzing legal case:', error);
    return NextResponse.json(
      { error: 'Terjadi kendala saat menganalisis kasus. Silakan coba kembali.' },
      { status: 500 }
    );
  }
}
