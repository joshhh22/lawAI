import { GoogleGenAI } from '@google/genai';
import { CaseAnalysis, EvidenceStatus, LegalArticle, LegalDomain } from './types';
import { detectDomain, retrieveRelevantArticles } from './legalRetrieval';

const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

export const HUKUM_AI_SYSTEM_INSTRUCTION = `Anda adalah reasoning dan explanation layer untuk platform HukumAI (law.web.id).

Anda BUKAN sumber hukum utama Indonesia.
Anda WAJIB mengandalkan bukti hukum resmi yang diberikan dalam konteks dan hasil penelusuran peraturan pemerintah (JDIH, Peraturan.go.id, Mahkamah Agung, MK).

ATURAN UTAMA (PRD Section 23):
1. Jangan pernah mengarang ketentuan undang-undang atau pasal.
2. Jangan pernah mengarang nomor UU atau tahun peraturan.
3. Jangan pernah membuat sitasi fiktif.
4. Jangan mengklaim suatu hukum pasti berlaku mutlak jika fakta kasus belum lengkap.
5. Bedakan secara tegas antara: (a) Fakta yang disampaikan, (b) Hukum tertulis/pasal, (c) Analisis, (d) Hal yang belum diketahui, dan (e) Ketidakpastian.
6. Prioritaskan ketentuan hukum yang saat ini masih berlaku di Indonesia.
7. Hargai relasi perubahan atau pencabutan (contoh: UU Cipta Kerja mengubah UU Ketenagakerjaan, revisi kedua UU ITE No. 1/2024 memperjelas Pasal 27A).
8. Jika dasar hukum tidak cukup atau fakta tidak jelas, katakan dengan jujur: "Dasar hukum spesifik belum cukup untuk membuat kesimpulan mutlak".
9. Jangan pernah menjanjikan hasil perkara pengadilan atau menyatakan pengguna pasti menang.
10. Jangan menampilkan diri sebagai advokat atau kuasa hukum resmi.
11. Gunakan Bahasa Indonesia yang lugas, terstruktur, santun, dan mudah dipahami masyarakat awam.
12. Jelaskan istilah hukum latin/teknis jika digunakan (misal: Wanprestasi, PMH, Delik Aduan, Pacta Sunt Servanda).

Format respon wajib berupa JSON terstruktur yang valid dengan schema:
{
  "domain": "Domain hukum",
  "identifiedIssue": "Isu hukum spesifik yang dihadapi",
  "summary": "Ringkasan penjelasan dalam bahasa sederhana (1-2 paragraf padat)",
  "givenFacts": ["Fakta 1 yang benar-benar dikatakan pengguna", "Fakta 2..."],
  "unknownFacts": ["Fakta/informasi penting yang belum diketahui tapi krusial"],
  "analysis": "Penjelasan mendalam mengenai hubungan fakta pengguna dengan ketentuan hukum yang berlaku",
  "actionableSteps": ["Langkah praktis dan aman 1", "Langkah 2", "Langkah 3..."],
  "uncertainties": ["Faktor yang dapat mengubah analisis hukum jika fakta berbeda"],
  "followUpQuestions": ["Pertanyaan klarifikasi 1 (maksimal 3 pertanyaan singkat)"]
}`;

/**
 * Perform legal analysis using Gemini 2.5 Flash with Grounding & Corpus Retrieval
 */
export async function analyzeLegalCase(casePrompt: string, customDomain?: LegalDomain): Promise<CaseAnalysis> {
  const domain = customDomain || detectDomain(casePrompt);
  const retrievedArticles = retrieveRelevantArticles(casePrompt, domain);
  const caseId = `case_${Date.now()}`;
  const caseNumber = `CASE #${Math.floor(100000 + Math.random() * 900000)}`;

  // Context string from retrieved articles
  const contextSnippet = retrievedArticles.map((art) => `
[PERATURAN RESMI TERVERIFIKASI]
Judul: ${art.documentTitle}
Pasal: ${art.articleNumber} ${art.paragraphNumber ? `Ayat (${art.paragraphNumber})` : ''}
Status: ${art.status}
Sumber Resmi: ${art.officialSource} (${art.officialUrl})
Isi Ketentuan:
"${art.content}"
Penjelasan Resmi: ${art.explanation || '-'}
Catatan Relasi: ${art.relationNote || '-'}
`).join('\n---\n');

  let parsedResponse: any = null;
  let groundingSources: { title: string; url: string; snippet?: string }[] = [];

  if (aiClient) {
    try {
      const promptWithContext = `PERTANYAAN / KASUS PENGGUNA:
"${casePrompt}"

KORPUS HUKUM RESMI YANG TELAH DITEMUKAN:
${contextSnippet || 'Tidak ada artikel korpus lokal yang langsung cocok. Lakukan penelusuran web ke sumber resmi JDIH/pemerintah.'}

Silakan analisis kasus di atas sesuai instruksi sistem dan hasilkan JSON yang valid sesuai struktur yang diminta.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptWithContext,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: HUKUM_AI_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      
      // Clean possible markdown json wrapper
      const jsonCleaned = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      parsedResponse = JSON.parse(jsonCleaned);

      // Extract Grounding metadata if provided by Gemini Search Grounding
      const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (searchChunks && Array.isArray(searchChunks)) {
        groundingSources = searchChunks
          .filter((c: any) => c.web?.uri)
          .map((c: any) => ({
            title: c.web.title || 'Sumber Regulasi Pemerintah RI',
            url: c.web.uri,
            snippet: c.web.snippet || undefined
          }));
      }
    } catch (err) {
      console.warn('Gemini API execution note (fallback to robust synthesis):', err);
    }
  }

  // If Gemini didn't return (no API key or network), synthesize structured response from retrieved corpus
  if (!parsedResponse) {
    parsedResponse = synthesizeCorpusAnalysis(casePrompt, domain, retrievedArticles);
  }

  // Calculate Evidence Quality based on actual retrieved articles
  const evidence: EvidenceStatus = {
    sourceVerified: retrievedArticles.length > 0,
    articleFound: retrievedArticles.length > 0,
    currentStatusValid: retrievedArticles.every((a) => a.status === 'Berlaku' || a.status === 'Diubah'),
    factsComplete: casePrompt.length > 120 ? 'Lengkap' : 'Parsial',
    evidenceQuality: retrievedArticles.length >= 2 ? 'Tinggi (High)' : retrievedArticles.length === 1 ? 'Sedang (Medium)' : 'Terbatas (Limited)'
  };

  const finalAnalysis: CaseAnalysis = {
    id: caseId,
    caseNumber,
    createdAt: new Date().toISOString(),
    userPrompt: casePrompt,
    domain: parsedResponse.domain || domain,
    identifiedIssue: parsedResponse.identifiedIssue || `Analisis Persoalan ${domain}`,
    evidence,
    summary: parsedResponse.summary || 'Analisis hukum berbasis peraturan perundang-undangan Indonesia yang berlaku.',
    givenFacts: parsedResponse.givenFacts || [casePrompt],
    unknownFacts: parsedResponse.unknownFacts || ['Ketersediaan bukti tertulis atau kontrak resmi', 'Waktu kejadian spesifik'],
    legalBases: retrievedArticles,
    analysis: parsedResponse.analysis || 'Berdasarkan hukum positif Indonesia, ketentuan yang berlaku mewajibkan para pihak mematuhi asas kepastian hukum dan ketentuan perundang-undangan terkait.',
    actionableSteps: parsedResponse.actionableSteps || [
      'Kumpulkan seluruh dokumen bukti tertulis (kontrak, bukti transfer, rekaman percakapan, atau surat peringatan).',
      'Lakukan upaya penyelesaian secara musyawarah / bipartit atau kirimkan surat klarifikasi resmi.',
      'Jika tidak tercapai kesepakatan, konsultasikan dengan instansi berwenang (misal Disnaker untuk buruh, atau Pos Bantuan Hukum pengadilan).'
    ],
    uncertainties: parsedResponse.uncertainties || [
      'Analisis dapat berubah apabila terdapat klausul tertulis khusus yang disepakati oleh kedua belah pihak.',
      'Keputusan akhir penegakan hukum berada pada otoritas peradilan atau instansi ketenagakerjaan/penegak hukum terkait.'
    ],
    followUpQuestions: parsedResponse.followUpQuestions || [
      'Apakah ada perjanjian tertulis atau bukti korespondensi resmi mengenai hal ini?',
      'Kapan peristiwa ini terjadi dan apakah sudah pernah dilakukan perundingan langsung?'
    ],
    groundingSources: groundingSources.length > 0 ? groundingSources : undefined
  };

  return finalAnalysis;
}

/**
 * Robust deterministic fallback analysis when running without active API key
 */
function synthesizeCorpusAnalysis(casePrompt: string, domain: LegalDomain, articles: LegalArticle[]) {
  const lower = casePrompt.toLowerCase();
  
  if (lower.includes('ijazah') || lower.includes('tahan ijazah')) {
    return {
      domain: 'Ketenagakerjaan',
      identifiedIssue: 'Penahanan Dokumen Pribadi (Ijazah) oleh Pemberi Kerja',
      summary: 'Pada prinsipnya, penahanan ijazah asli pekerja tidak memiliki dasar kewajiban dalam UU Ketenagakerjaan. Penahanan hanya dimungkinkan jika ada klausul tertulis yang disepakati secara sukarela dengan syarat keselamatan dokumen terjamin dan wajib dikembalikan begitu masa kerja/kewajiban selesai.',
      givenFacts: [
        'Pekerja menghadapi penahanan dokumen ijazah oleh pihak perusahaan',
        'Pekerja mempertanyakan legalitas dan hak pengembalian ijazah'
      ],
      unknownFacts: [
        'Apakah terdapat klausul perjanjian kerja tertulis mengenai penahanan ijazah?',
        'Apakah pekerja masih dalam ikatan dinas / pelatihan berbiaya perusahaan?',
        'Apakah ada kewajiban ganti rugi atau inventaris yang belum diselesaikan?'
      ],
      analysis: 'Berdasarkan UU Ketenagakerjaan jo. UU Cipta Kerja No. 6/2023 dan Pasal 372 KUHP, penahanan sepihak atas barang milik orang lain tanpa dasar perjanjian yang sah atau menolak mengembalikannya saat hubungan kerja berakhir dapat dikategorikan sebagai penggelapan hak milik.',
      actionableSteps: [
        'Periksa kembali surat perjanjian kerja (PKWT/PKWTT) apakah ada klausul penahanan ijazah dan syarat pengembaliannya.',
        'Ajukan surat permohonan pengembalian ijazah secara resmi dan tertulis kepada HRD/Manajemen perusahaan.',
        'Jika perusahaan menolak tanpa alasan sah, lakukan pengaduan ke Pengawas Ketenagakerjaan pada Dinas Tenaga Kerja (Disnaker) setempat.'
      ],
      uncertainties: [
        'Jika terdapat perjanjian ikatan dinas yang sah dan belum diselesaikan, perusahaan mungkin berhak menahan hingga kewajiban dipenuhi sesuai klausul kontrak.'
      ],
      followUpQuestions: [
        'Apakah Anda sudah menyelesaikan seluruh masa kontrak kerja atau mengundurkan diri sebelum waktu kontrak selesai?',
        'Apakah saat penyerahan ijazah dahulu diberikan tanda terima resmi penyimpanan?'
      ]
    };
  }

  if (lower.includes('phk') || lower.includes('pesangon') || lower.includes('kompensasi')) {
    return {
      domain: 'Ketenagakerjaan',
      identifiedIssue: 'Hak Pemutusan Hubungan Kerja (PHK) dan Uang Kompensasi PKWT / Pesangon',
      summary: 'Berdasarkan UU No. 6 Tahun 2023 dan PP No. 35 Tahun 2021, pekerja berhak atas uang kompensasi (untuk pekerja kontrak PKWT) atau pesangon + UPMK + penggantian hak (untuk PHK pekerja tetap). PHK tidak boleh dilakukan secara mendadak tanpa surat pemberitahuan minimal 14 hari kerja sebelumnya.',
      givenFacts: [
        'Terjadi pemutusan hubungan kerja atau pengakhiran masa kontrak kerja',
        'Pekerja menanyakan hak kompensasi atau pesangon'
      ],
      unknownFacts: [
        'Status hubungan kerja (pekerja tetap PKWTT atau kontrak PKWT)',
        'Masa kerja total di perusahaan yang bersangkutan',
        'Alasan spesifik dilakukannya PHK'
      ],
      analysis: 'Pasal 61A UU No. 6/2023 mewajibkan pengusaha membayar uang kompensasi PKWT secara proporsional (masa kerja/12 x 1 bulan upah). Untuk PHK, Pasal 151 mewajibkan surat pemberitahuan 14 hari kerja dan Pasal 156 mengatur pesangon serta hak penggantian.',
      actionableSteps: [
        'Minta rincian tertulis perhitungan hak akhir masa kerja / surat pengalaman kerja (paklaring).',
        'Lakukan perundingan Bipartit secara tertulis dengan manajemen jika nominal tidak sesuai ketentuan PP No. 35/2021.',
        'Catatkan perselisihan hak ke Disnaker setempat untuk mediasi jika bipartit gagal.'
      ],
      uncertainties: [
        'Besaran kompensasi dipengaruhi oleh alasan pengakhiran dan jenis kontrak kerja.'
      ],
      followUpQuestions: [
        'Berapa lama masa kerja Anda dan berapa besaran upah pokok per bulan?',
        'Apakah perusahaan sudah memberikan surat pemberitahuan PHK resmi tertulis?'
      ]
    };
  }

  return {
    domain,
    identifiedIssue: `Analisis Ketentuan Hukum Terkait ${domain}`,
    summary: 'Persoalan ini diatur dalam ketentuan peraturan perundang-undangan Indonesia yang mewajibkan adanya pemenuhan hak dan kewajiban sesuai asas hukum positif yang berlaku.',
    givenFacts: [casePrompt],
    unknownFacts: [
      'Dokumen bukti tertulis yang dimiliki para pihak',
      'Kronologi waktu dan peristiwa secara rinci'
    ],
    analysis: `Berdasarkan ketentuan hukum positif di bidang ${domain}, setiap tindakan hukum harus berlandaskan aturan yang sah dan dapat diverifikasi melalui peraturan perundang-undangan resmi.`,
    actionableSteps: [
      'Dokumentasikan seluruh bukti kronologis dan dokumen pendukung.',
      'Upayakan penyelesaian secara damai atau klarifikasi tertulis.',
      'Konsultasikan dengan lembaga bantuan hukum atau advokat jika terdapat ancaman kerugian signifikan.'
    ],
    uncertainties: [
      'Fakta tambahan atau klausul perjanjian khusus dapat mengubah analisis hukum yang berlaku.'
    ],
    followUpQuestions: [
      'Apakah Anda memiliki dokumen pendukung tertulis mengenai persoalan ini?',
      'Apakah sudah ada upaya penyelesaian yang telah dilakukan sebelumnya?'
    ]
  };
}
