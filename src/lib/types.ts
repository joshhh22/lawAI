export type LegalDomain =
  | 'Ketenagakerjaan'
  | 'Hukum Pidana'
  | 'Hukum Perdata & Kontrak'
  | 'Informasi & Transaksi Elektronik (ITE)'
  | 'Perlindungan Data Pribadi'
  | 'Perlindungan Konsumen'
  | 'Hukum Bisnis & Perusahaan'
  | 'Agraria & Pertanahan'
  | 'Kekayaan Intelektual'
  | 'Hukum Keluarga & Waris'
  | 'Umum / Lainnya';

export type RegulationType =
  | 'UU'
  | 'PP'
  | 'Perpres'
  | 'Permen'
  | 'Putusan MA / MK'
  | 'KUHP'
  | 'KUHPerdata';

export type LegalStatus =
  | 'Berlaku'
  | 'Diubah'
  | 'Dicabut Sebagian'
  | 'Dicabut / Tidak Berlaku'
  | 'Masa Transisi';

export interface LegalArticle {
  id: string;
  documentId: string;
  documentTitle: string;
  documentType: RegulationType;
  number: string;
  year: string;
  chapter?: string;
  section?: string;
  articleNumber: string;
  paragraphNumber?: string;
  letter?: string;
  content: string;
  explanation?: string;
  status: LegalStatus;
  officialSource: string;
  officialUrl: string;
  relationNote?: string;
  lastVerifiedAt: string;
}

export interface LegalDocument {
  id: string;
  type: RegulationType;
  number: string;
  year: string;
  title: string;
  shortTitle: string;
  domain: LegalDomain;
  status: LegalStatus;
  effectiveDate: string;
  officialSource: string;
  officialUrl: string;
  description: string;
  articles: LegalArticle[];
}

export interface EvidenceStatus {
  sourceVerified: boolean;
  articleFound: boolean;
  currentStatusValid: boolean;
  factsComplete: 'Lengkap' | 'Parsial' | 'Kurang';
  evidenceQuality: 'Tinggi (High)' | 'Sedang (Medium)' | 'Terbatas (Limited)';
}

export interface CaseAnalysis {
  id: string;
  caseNumber: string;
  createdAt: string;
  userPrompt: string;
  domain: LegalDomain;
  identifiedIssue: string;
  evidence: EvidenceStatus;
  
  // Editorial Blocks (PRD Sections)
  summary: string; // 01 / Ringkasan
  givenFacts: string[]; // 02 / Fakta yang Diberikan
  unknownFacts: string[]; // 03 / Yang Belum Diketahui
  legalBases: LegalArticle[]; // 04 / Dasar Hukum
  analysis: string; // 05 / Analisis
  actionableSteps: string[]; // 06 / Yang Dapat Dilakukan
  uncertainties: string[]; // 07 / Ketidakpastian & Batasan
  followUpQuestions?: string[]; // 08 / Pertanyaan Lanjutan
  groundingSources?: {
    title: string;
    url: string;
    snippet?: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  analysis?: CaseAnalysis;
  suggestedFollowUps?: string[];
}

export interface AnalyzeRequest {
  caseText: string;
  domain?: LegalDomain;
  chatHistory?: { sender: 'user' | 'assistant'; text: string }[];
}

export interface SearchQuery {
  q: string;
  type?: RegulationType | 'Semua';
  domain?: LegalDomain | 'Semua';
}
