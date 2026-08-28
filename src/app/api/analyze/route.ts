import { NextRequest, NextResponse } from 'next/server';
import { analyzeLegalCase } from '@/lib/gemini';
import { AnalyzeRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();

    if (!body.caseText || body.caseText.trim().length < 5) {
      return NextResponse.json(
        { error: 'Deskripsi persoalan hukum minimal 5 karakter.' },
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
