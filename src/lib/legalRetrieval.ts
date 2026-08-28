import { ALL_LEGAL_ARTICLES, LEGAL_DOCUMENTS } from '../data/legalCorpus';
import { LegalArticle, LegalDocument, LegalDomain, RegulationType, SearchQuery } from './types';

// Keyword domain mapping
const DOMAIN_KEYWORDS: Record<LegalDomain, string[]> = {
  Ketenagakerjaan: ['kerja', 'karyawan', 'buruh', 'ijazah', 'phk', 'pesangon', 'pkwt', 'kontrak kerja', 'gaji', 'upah', 'lembur', 'perusahaan', 'surat peringatan', 'sp3', 'kompensasi'],
  'Hukum Pidana': ['pidana', 'lapor polisi', 'polisi', 'penipuan', 'penggelapan', 'pemerasan', 'ancaman', 'pencurian', 'kekerasan', 'pasal 378', 'pasal 372', 'kuhp', 'kejahatan'],
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

    // Direct article number match (e.g. "378", "27A", "61A")
    if (artNumLower && lowerQuery.includes(artNumLower)) {
      score += 50;
    }

    // Matching document title
    if (titleLower && lowerQuery.includes(titleLower)) {
      score += 20;
    }

    // Keyword matching
    const keywords = DOMAIN_KEYWORDS[detected] || [];
    keywords.forEach((kw) => {
      if (lowerQuery.includes(kw)) {
        if (contentLower.includes(kw)) score += 10;
        if (expLower.includes(kw)) score += 10;
      }
    });

    // Substring queries
    const searchTerms = lowerQuery.split(/\s+/).filter((t) => t.length > 3);
    searchTerms.forEach((term) => {
      if (contentLower.includes(term)) score += 5;
      if (expLower.includes(term)) score += 5;
    });

    // Domain relevance bonus
    const parentDoc = LEGAL_DOCUMENTS.find((d) => d.id === article.documentId);
    if (parentDoc && parentDoc.domain === detected) {
      score += 15;
    }

    return { article, score };
  });

  // Sort by score descending and return top matches
  const sorted = scoredArticles
    .filter((item) => item.score > 5)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.article);

  // If no specific scored results, return top 2 general domain articles if available
  if (sorted.length === 0) {
    const fallbackDoc = LEGAL_DOCUMENTS.find((d) => d.domain === detected);
    if (fallbackDoc && fallbackDoc.articles.length > 0) {
      return fallbackDoc.articles.slice(0, 2);
    }
  }

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

  let filteredArticles = ALL_LEGAL_ARTICLES;
  if (type && type !== 'Semua') {
    filteredArticles = filteredArticles.filter((a) => a.documentType === type);
  }

  if (lowerQ) {
    filteredDocs = filteredDocs.filter((d) =>
      d.title.toLowerCase().includes(lowerQ) ||
      d.shortTitle.toLowerCase().includes(lowerQ) ||
      d.description.toLowerCase().includes(lowerQ) ||
      d.number.includes(lowerQ) ||
      d.year.includes(lowerQ)
    );

    filteredArticles = filteredArticles.filter((a) =>
      a.documentTitle.toLowerCase().includes(lowerQ) ||
      a.articleNumber.toLowerCase().includes(lowerQ) ||
      a.content.toLowerCase().includes(lowerQ) ||
      (a.explanation && a.explanation.toLowerCase().includes(lowerQ))
    );
  }

  return {
    documents: filteredDocs,
    articles: filteredArticles
  };
}
