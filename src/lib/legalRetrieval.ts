import { ALL_LEGAL_ARTICLES, LEGAL_DOCUMENTS } from '../data/legalCorpus';
import { LegalArticle, LegalDocument, LegalDomain, RegulationType, SearchQuery } from './types';

// Keyword domain mapping
const DOMAIN_KEYWORDS: Record<LegalDomain, string[]> = {
  Ketenagakerjaan: ['kerja', 'karyawan', 'buruh', 'ijazah', 'phk', 'pesangon', 'pkwt', 'kontrak kerja', 'gaji', 'upah', 'lembur', 'perusahaan', 'surat peringatan', 'sp3', 'kompensasi'],
  'Hukum Pidana': ['pidana', 'lapor polisi', 'polisi', 'tilang', 'razia', 'surat perintah', 'surat tugas', 'lalu lintas', 'sim', 'stnk', 'helm', 'lampu merah', 'lawan arus', 'abaikan', 'melarikan diri', 'penipuan', 'penggelapan', 'pemerasan', 'ancaman', 'pencurian', 'maling', 'begal', 'kekerasan', 'pasal 378', 'pasal 372', 'pasal 49', 'pasal 216', 'kuhp', 'kejahatan'],
  'Hukum Perdata & Kontrak': ['perdata', 'kontrak', 'perjanjian', 'surat perjanjian', 'wanprestasi', 'ingkar janji', 'somasi', 'ganti rugi', 'utang', 'piutang', '1320', '1338', '1365', 'pmh', 'perbuatan melawan hukum'],
  'Informasi & Transaksi Elektronik (ITE)': ['ite', 'medsos', 'instagram', 'twitter', 'tiktok', 'whatsapp', 'pencemaran nama baik', 'fitnah online', 'hoaks', 'berita bohong', 'pasal 27a', 'hacker', 'transaksi elektronik'],
  'Perlindungan Data Pribadi': ['pdp', 'data pribadi', 'doxxing', 'bocor data', 'sebar data', 'kontak darurat', 'pinjol sebar data', 'ktp', 'nik', 'privasi'],
  'Perlindungan Konsumen': ['konsumen', 'barang cacat', 'beli barang', 'pengembalian barang', 'klausula baku', 'refund', 'garansi', 'toko online', 'penjual'],
  'Hukum Bisnis & Perusahaan': ['pt', 'perseroan', 'direksi', 'komisaris', 'saham', 'investasi', 'modal', 'izin usaha', 'nib'],
  'Agraria & Pertanahan': ['tanah', 'sertifikat', 'shm', 'hgb', 'girik', 'sengketa tanah', 'waris tanah', 'bpn', 'agraria'],
  'Kekayaan Intelektual': ['hak cipta', 'merek', 'paten', 'plagiat', 'pembajakan', 'lisensi', 'royalti'],
  'Hukum Keluarga & Waris': ['waris', 'harta gono gini', 'cerai', 'hak asuh', 'anak', 'wasiat', 'hibah'],
  'Umum / Lainnya': ['hukum', 'aturan', 'uu', 'undang-undang', 'pemerintah', 'pasal']
};

/**
 * Detect the primary legal domain from user prompt
 */
export function detectDomain(prompt: string): LegalDomain {
  const lower = prompt.toLowerCase();
  let bestDomain: LegalDomain = 'Umum / Lainnya';
  let maxMatches = 0;

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    const matches = keywords.filter((kw) => lower.includes(kw)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestDomain = domain as LegalDomain;
    }
  }

  return bestDomain;
}

/**
 * Hybrid retrieval: search legal articles in the verified corpus
 */
export function retrieveRelevantArticles(query: string, domain?: LegalDomain): LegalArticle[] {
  const lowerQuery = query.toLowerCase();
  const detected = domain || detectDomain(query);

  const scoredArticles = ALL_LEGAL_ARTICLES.map((article) => {
    let score = 0;
    const contentLower = article.content.toLowerCase();
    const expLower = (article.explanation || '').toLowerCase();
    const titleLower = article.documentTitle.toLowerCase();
    const artNumLower = article.articleNumber.toLowerCase();

    // Direct article number match (e.g. "378", "27A", "61A", "216", "15", "22")
    if (artNumLower && lowerQuery.includes(artNumLower)) {
      score += 50;
    }

    // Direct terms in query matching content or explanation
    const terms = lowerQuery.split(/[^\w\d]+/).filter((t) => t.length > 2);
    for (const term of terms) {
      if (contentLower.includes(term)) score += 8;
      if (expLower.includes(term)) score += 10;
      if (titleLower.includes(term)) score += 12;
    }

    // Specific police / tilang / razia terms
    if (lowerQuery.includes('tilang') || lowerQuery.includes('razia') || lowerQuery.includes('surat perintah') || lowerQuery.includes('surat tugas')) {
      if (article.documentId.includes('pp-80-2012') || article.documentId.includes('uu-22-2009') || article.id === 'kuhp-art-216') {
        score += 40;
      }
    }

    // Specific self-defense terms
    if (lowerQuery.includes('maling') || lowerQuery.includes('lawan') || lowerQuery.includes('bela diri') || lowerQuery.includes('tersangka')) {
      if (article.id === 'kuhp-art-49-noodweer') {
        score += 50;
      }
    }

    return { article, score };
  });

  // Sort by score descending and only return articles with genuine relevance (score >= 12)
  const sorted = scoredArticles
    .filter((item) => item.score >= 12)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.article);

  return sorted.slice(0, 4);
}

/**
 * Filter legal documents and articles by global search query
 */
export function searchLegalDatabase(searchQuery: SearchQuery): {
  documents: LegalDocument[];
  articles: LegalArticle[];
} {
  const { q, type, domain } = searchQuery;
  const lowerQ = (q || '').toLowerCase().trim();

  let filteredDocs = LEGAL_DOCUMENTS;
  if (type && type !== 'Semua') {
    filteredDocs = filteredDocs.filter((d) => d.type === type);
  }
  if (domain && domain !== 'Semua') {
    filteredDocs = filteredDocs.filter((d) => d.domain === domain);
  }

  if (lowerQ) {
    filteredDocs = filteredDocs.filter((d) => {
      const titleMatch = d.title.toLowerCase().includes(lowerQ);
      const descMatch = d.description.toLowerCase().includes(lowerQ);
      const articleMatch = d.articles.some(
        (a) => a.content.toLowerCase().includes(lowerQ) || (a.explanation || '').toLowerCase().includes(lowerQ)
      );
      return titleMatch || descMatch || articleMatch;
    });
  }

  const articles: LegalArticle[] = filteredDocs.flatMap((d) => d.articles);

  return {
    documents: filteredDocs,
    articles
  };
}
