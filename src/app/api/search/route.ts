import { NextRequest, NextResponse } from 'next/server';
import { searchLegalDatabase } from '@/lib/legalRetrieval';
import { RegulationType, LegalDomain } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const type = (searchParams.get('type') || 'Semua') as RegulationType | 'Semua';
    const domain = (searchParams.get('domain') || 'Semua') as LegalDomain | 'Semua';

    const results = searchLegalDatabase({ q, type, domain });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching legal database:', error);
    return NextResponse.json(
      { error: 'Gagal melakukan pencarian database hukum.' },
      { status: 500 }
    );
  }
}
