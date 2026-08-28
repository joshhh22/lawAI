'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'id' | 'en';

interface Translations {
  // Brand & Nav
  appName: string;
  appSubtitle: string;
  navChat: string;
  navSearch: string;
  navCatalog: string;
  navDisclaimer: string;
  newChat: string;
  searchHistoryPlaceholder: string;
  historyTitle: string;
  historyEmpty: string;
  historyEmptySearch: string;
  popularTopics: string;
  officialJdihSources: string;
  settings: string;
  clearHistory: string;
  
  // Hero
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  
  // Presets
  preset1Label: string;
  preset1Text: string;
  preset2Label: string;
  preset2Text: string;
  preset3Label: string;
  preset3Text: string;
  preset4Label: string;
  preset4Text: string;
  preset5Label: string;
  preset5Text: string;
  preset6Label: string;
  preset6Text: string;
  
  // Chat & Input
  inputPlaceholder: string;
  inputDisclaimer: string;
  sessionActive: string;
  newTopicBtn: string;
  you: string;
  copyAnswer: string;
  copied: string;
  openDocView: string;
  expandArticles: string;
  collapseArticles: string;
  verdictVerified: string;
  
  // Section Headings
  verdictTitle: string;
  summaryTitle: string;
  legalBasesTitle: string;
  analysisTitle: string;
  practicalStepsTitle: string;
  uncertaintiesTitle: string;
  followUpTitle: string;
  officialSourceLabel: string;
  openInBpkBtn: string;
  
  // Settings Modal
  settingsTitle: string;
  languageSetting: string;
  languageDesc: string;
  chatHistorySetting: string;
  chatHistoryDesc: string;
  clearHistoryBtn: string;
  clearHistoryConfirmTitle: string;
  clearHistoryConfirmDesc: string;
  clearHistoryConfirmBtn: string;
  cancelBtn: string;
  historyClearedSuccess: string;
  systemModelSetting: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  id: {
    appName: 'CEKHUKUM',
    appSubtitle: 'Legal AI Assistant',
    navChat: 'Obrolan',
    navSearch: 'Cari Regulasi',
    navCatalog: 'Katalog Hukum',
    navDisclaimer: 'Batasan AI',
    newChat: '+ Konsultasi Baru',
    searchHistoryPlaceholder: 'Cari riwayat...',
    historyTitle: 'RIWAYAT KONSULTASI',
    historyEmpty: 'Belum ada riwayat konsultasi. Ajukan pertanyaan untuk memulai.',
    historyEmptySearch: 'Tidak ada riwayat yang cocok.',
    popularTopics: 'TOPIK KASUS POPULER',
    officialJdihSources: 'PORTAL JDIH PEMERINTAH RESMI',
    settings: 'Pengaturan',
    clearHistory: 'Hapus Semua Riwayat',
    
    heroTitle1: 'Pahami hukum &',
    heroTitle2: 'temukan dasarnya.',
    heroSubtitle: 'Konsultasikan persoalan hukum sehari-hari dengan asisten AI berbasis naskah undang-undang resmi pemerintah (peraturan.bpk.go.id) dan rujukan pasal yang dapat diverifikasi.',
    
    preset1Label: 'Penahanan Ijazah Kerja',
    preset1Text: 'Perusahaan tempat saya bekerja menahan ijazah asli saya dan menolak mengembalikannya saat saya mengundurkan diri. Apakah perusahaan berhak menahan ijazah saya menurut hukum ketenagakerjaan?',
    preset2Label: 'Kompensasi PKWT (PP 35/2021)',
    preset2Text: 'Saya bekerja sebagai karyawan kontrak (PKWT) selama 1 tahun penuh dan kontrak saya berakhir tanpa diperpanjang. Apakah saya berhak mendapatkan uang kompensasi menurut UU Cipta Kerja dan PP 35/2021?',
    preset3Label: 'Pencemaran Medsos (UU ITE)',
    preset3Text: 'Saya memberikan ulasan kritis di media sosial tentang pelayanan sebuah instansi dan diancam dilaporkan menggunakan Pasal 27A UU ITE. Bagaimana batasan hukum pencemaran nama baik dalam revisi UU ITE terbaru?',
    preset4Label: 'Penyalahgunaan Data (UU PDP)',
    preset4Text: 'Pihak pinjaman online menghubungi dan menyebarkan data saya kepada seluruh kontak darurat di ponsel saya tanpa persetujuan. Apakah hal ini melanggar UU Perlindungan Data Pribadi (UU PDP)?',
    preset5Label: 'Klausula Baku Konsumen',
    preset5Text: 'Saya membeli barang yang ternyata cacat tersembunyi, namun toko menolak ganti rugi dengan alasan nota tertulis "Barang yang dibeli tidak dapat ditukar". Apakah klausul sepihak itu sah menurut UU Perlindungan Konsumen?',
    preset6Label: 'Wanprestasi & Ganti Rugi',
    preset6Text: 'Rekan bisnis saya tidak membayar pesanan barang sesuai tanggal jatuh tempo surat perjanjian. Langkah hukum apa yang tepat untuk menuntut ganti rugi wanprestasi menurut KUHPerdata?',
    
    inputPlaceholder: 'Ketik persoalan hukum Anda, atau sebutkan pasal...',
    inputDisclaimer: 'CekHukum terhubung ke korpus perundang-undangan resmi RI (peraturan.bpk.go.id). Bukan pengganti nasihat advokat.',
    sessionActive: 'KONSULTASI HUKUM AKTIF',
    newTopicBtn: 'Mulai Topik Baru',
    you: 'Anda',
    copyAnswer: 'Salin Jawaban Lengkap',
    copied: 'Tersalin',
    openDocView: 'Buka Format Dokumen 12-Kolom',
    expandArticles: 'Buka Bunyi Pasal Lengkap',
    collapseArticles: 'Tutup Rincian',
    verdictVerified: 'Terverifikasi peraturan.bpk.go.id',
    
    verdictTitle: 'HASIL TELAAH HUKUM RESMI',
    summaryTitle: 'RINGKASAN TEMUAN & KETENTUAN HUKUM',
    legalBasesTitle: 'DASAR HUKUM FAKTUAL (PERATURAN.BPK.GO.ID)',
    analysisTitle: 'ALASAN YURIDIS & ANALISIS HUBUNGAN FAKTA',
    practicalStepsTitle: 'LANGKAH PRAKTIS & JALUR PENYELESAIAN YANG DAPAT DITEMPUH',
    uncertaintiesTitle: 'Faktor yang Dapat Mengubah Analisis Hukum',
    followUpTitle: 'PERTANYAAN LANJUTAN YANG DISARANKAN',
    officialSourceLabel: 'Sumber Terverifikasi',
    openInBpkBtn: 'Buka di peraturan.bpk.go.id',
    
    settingsTitle: 'Pengaturan Sistem',
    languageSetting: 'Bahasa Antarmuka (Language)',
    languageDesc: 'Pilih bahasa tampilan dan konsultasi hukum AI.',
    chatHistorySetting: 'Riwayat Obrolan',
    chatHistoryDesc: 'Kelola data riwayat konsultasi yang tersimpan di perangkat ini.',
    clearHistoryBtn: 'Hapus Semua Riwayat Chat',
    clearHistoryConfirmTitle: 'Hapus Semua Riwayat Konsultasi?',
    clearHistoryConfirmDesc: 'Tindakan ini akan menghapus seluruh percakapan yang tersimpan secara permanen dari perangkat Anda. Tindakan ini tidak dapat dibatalkan.',
    clearHistoryConfirmBtn: 'Ya, Hapus Semua',
    cancelBtn: 'Batal',
    historyClearedSuccess: 'Seluruh riwayat obrolan berhasil dibersihkan.',
    systemModelSetting: 'Model AI & Dasar Data'
  },
  en: {
    appName: 'CEKHUKUM',
    appSubtitle: 'Legal AI Assistant',
    navChat: 'Chat / Consultation',
    navSearch: 'Search Regulations',
    navCatalog: 'Legal Catalog',
    navDisclaimer: 'AI Limitations',
    newChat: '+ New Consultation',
    searchHistoryPlaceholder: 'Search history...',
    historyTitle: 'CONSULTATION HISTORY',
    historyEmpty: 'No consultation history yet. Ask a legal question to start.',
    historyEmptySearch: 'No matching history found.',
    popularTopics: 'POPULAR LEGAL TOPICS',
    officialJdihSources: 'OFFICIAL GOVERNMENT JDIH PORTALS',
    settings: 'Settings',
    clearHistory: 'Clear All History',
    
    heroTitle1: 'Understand the law &',
    heroTitle2: 'find its legal basis.',
    heroSubtitle: 'Consult everyday Indonesian legal matters with an AI assistant grounded in official government statutes (peraturan.bpk.go.id) and verifiable articles.',
    
    preset1Label: 'Withholding of Diploma',
    preset1Text: 'My employer is holding my original university diploma and refusing to return it upon my resignation. Is the company legally allowed to withhold my diploma under Indonesian labor law?',
    preset2Label: 'Fixed-Term Contract Compensation',
    preset2Text: 'I worked as a fixed-term contract worker (PKWT) for 1 full year and my contract was not renewed. Am I entitled to severance compensation under the Job Creation Law & Government Regulation No. 35/2021?',
    preset3Label: 'Social Media Defamation (UU ITE)',
    preset3Text: 'I posted a critical online review about a service provider and was threatened with Article 27A of the ITE Law. What are the legal boundaries of criminal defamation in the newest ITE Law revision?',
    preset4Label: 'Personal Data Misuse (UU PDP)',
    preset4Text: 'An online lending app contacted and distributed my personal contact data to my emergency contacts without my consent. Does this violate Indonesia’s Personal Data Protection Law (UU PDP)?',
    preset5Label: 'Consumer Standard Clauses',
    preset5Text: 'I bought goods that had hidden defects, but the merchant refused a refund citing "Goods purchased cannot be returned". Is this unilateral disclaimer valid under Indonesia’s Consumer Protection Law?',
    preset6Label: 'Breach of Contract & Damages',
    preset6Text: 'My business partner failed to pay for goods delivered according to our written agreement due date. What is the proper legal procedure to claim breach of contract (wanprestasi) under the Indonesian Civil Code?',
    
    inputPlaceholder: 'Type your legal question or cite a specific statute / article...',
    inputDisclaimer: 'CekHukum is grounded in official Indonesian legislation (peraturan.bpk.go.id). Not a substitute for formal legal counsel.',
    sessionActive: 'ACTIVE LEGAL CONSULTATION',
    newTopicBtn: 'Start New Topic',
    you: 'You',
    copyAnswer: 'Copy Full Response',
    copied: 'Copied',
    openDocView: 'Open 12-Column Report View',
    expandArticles: 'Expand Full Statutory Text',
    collapseArticles: 'Collapse Details',
    verdictVerified: 'Verified against peraturan.bpk.go.id',
    
    verdictTitle: 'OFFICIAL LEGAL VERDICT',
    summaryTitle: 'FINDINGS & LEGAL PROVISIONS SUMMARY',
    legalBasesTitle: 'FACTUAL STATUTORY BASES (PERATURAN.BPK.GO.ID)',
    analysisTitle: 'LEGAL REASONING & FACTUAL ANALYSIS',
    practicalStepsTitle: 'PRACTICAL ACTION STEPS & LEGAL RECOURSE',
    uncertaintiesTitle: 'Factors That May Alter This Legal Analysis',
    followUpTitle: 'SUGGESTED FOLLOW-UP QUESTIONS',
    officialSourceLabel: 'Verified Source',
    openInBpkBtn: 'Open on peraturan.bpk.go.id',
    
    settingsTitle: 'System Settings',
    languageSetting: 'Interface Language',
    languageDesc: 'Choose interface language and AI consultation output.',
    chatHistorySetting: 'Chat History',
    chatHistoryDesc: 'Manage consultation logs saved locally on this device.',
    clearHistoryBtn: 'Clear All Chat History',
    clearHistoryConfirmTitle: 'Clear All Consultation History?',
    clearHistoryConfirmDesc: 'This will permanently delete all saved conversations from this browser. This action cannot be undone.',
    clearHistoryConfirmBtn: 'Yes, Clear All',
    cancelBtn: 'Cancel',
    historyClearedSuccess: 'All chat history has been cleared successfully.',
    systemModelSetting: 'AI Engine & Grounding Source'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = useState<Language>('id');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hukumai_language') as Language;
      if (saved && (saved === 'id' || saved === 'en')) {
        setLangState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hukumai_language', lang);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: TRANSLATIONS[language]
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
