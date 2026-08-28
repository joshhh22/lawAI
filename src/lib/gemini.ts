import { GoogleGenAI } from '@google/genai';
import { CaseAnalysis, EvidenceStatus, LegalArticle, LegalDomain } from './types';
import { detectDomain, retrieveRelevantArticles } from './legalRetrieval';

function getAiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY || '';
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

export const HUKUM_AI_SYSTEM_INSTRUCTION = `Anda adalah reasoning dan explanation layer untuk platform HukumAI (law.web.id).

Anda BUKAN sumber hukum utama Indonesia.
Anda WAJIB mengandalkan bukti hukum resmi yang diberikan dalam konteks dan hasil penelusuran peraturan pemerintah (JDIH, Peraturan.go.id, Mahkamah Agung, MK).

ATURAN UTAMA (PRD Section 23):
1. Jika pengguna hanya menyapa (seperti 'halo', 'tes', 'hi', 'selamat pagi', 'bisa bantu saya?'), sambut pengguna dengan ramah, perkenalkan diri Anda sebagai HukumAI, jelaskan lingkup hukum Indonesia yang dapat Anda bantu (Ketenagakerjaan, Pidana, ITE, Perdata, Perlindungan Konsumen, UU PDP, Pertanahan), dan undang pengguna untuk menjelaskan kasus hukumnya.
2. Jangan pernah mengarang ketentuan undang-undang atau pasal.
3. Jangan pernah mengarang nomor UU atau tahun peraturan.
4. Jangan pernah membuat sitasi fiktif.
5. Jangan mengklaim suatu hukum pasti berlaku mutlak jika fakta kasus belum lengkap.
6. Bedakan secara tegas antara: (a) Fakta yang disampaikan, (b) Hukum tertulis/pasal, (c) Analisis, (d) Hal yang belum diketahui, dan (e) Ketidakpastian.
7. Prioritaskan ketentuan hukum yang saat ini masih berlaku di Indonesia.
8. Hargai relasi perubahan atau pencabutan (contoh: UU Cipta Kerja mengubah UU Ketenagakerjaan, revisi kedua UU ITE No. 1/2024 memperjelas Pasal 27A).
9. Jika dasar hukum tidak cukup atau fakta tidak jelas, katakan dengan jujur: "Dasar hukum spesifik belum cukup untuk membuat kesimpulan mutlak".
10. Jangan pernah menjanjikan hasil perkara pengadilan atau menyatakan pengguna pasti menang.
11. Jangan menampilkan diri sebagai advokat atau kuasa hukum resmi.
12. Gunakan Bahasa Indonesia yang lugas, terstruktur, santun, dan mudah dipahami masyarakat awam.
13. Jelaskan istilah hukum latin/teknis jika digunakan (misal: Wanprestasi, PMH, Delik Aduan, Pacta Sunt Servanda).

Format respon wajib berupa JSON terstruktur yang valid dengan schema:
{
  "domain": "Domain hukum",
  "identifiedIssue": "Isu hukum spesifik yang dihadapi",
  "summary": "Ringkasan temuan dan ketentuan hukum (lugas, santun, objektif)",
  "legalVerdict": {
    "statusText": "Contoh: KESIMPULAN: PENAHANAN IJAZAH TANPA PERJANJIAN ADALAH MELANGGAR HUKUM",
    "level": "MELANGGAR HUKUM / ILEGAL | BERHAK MENUNTUT / KOMPENSASI | DELIK ADUAN / PIDANA | SAH BERSYARAT | PERLU BUKTI TAMBAHAN",
    "bpkRef": "Rujukan Dasar: UU No. 6/2023 & PP No. 35/2021 (peraturan.bpk.go.id)"
  },
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

  const aiClient = getAiClient();
  if (aiClient) {
    try {
      const promptWithContext = `PERTANYAAN / KASUS PENGGUNA:
"${casePrompt}"

KORPUS HUKUM RESMI YANG TELAH DITEMUKAN:
${contextSnippet || 'Tidak ada artikel korpus lokal yang langsung cocok. Lakukan penelusuran web ke sumber resmi JDIH/pemerintah.'}

Silakan analisis kasus di atas sesuai instruksi sistem dan hasilkan JSON yang valid sesuai struktur yang diminta.`;

      let response;
      try {
        response = await aiClient.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: promptWithContext,
          config: {
            tools: [{ googleSearch: {} }],
            systemInstruction: HUKUM_AI_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json'
          }
        });
      } catch {
        response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptWithContext,
          config: {
            tools: [{ googleSearch: {} }],
            systemInstruction: HUKUM_AI_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json'
          }
        });
      }

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
    legalVerdict: parsedResponse.legalVerdict || {
      statusText: `TELAAH STATUS: ${parsedResponse.identifiedIssue || domain}`,
      level: 'SAH BERSYARAT',
      bpkRef: 'Database Resmi BPK RI (peraturan.bpk.go.id)'
    },
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
  const lower = casePrompt.toLowerCase().trim();

  // Handle greetings and test messages warmly
  const isGreetingOrTest = /^(halo|hai|hi|hey|tes|test|p|assalamu[']?alaikum|selamat\s*(pagi|siang|sore|malam)|bisa bantu|siapa kamu)\b/i.test(lower) || lower.length < 5;
  if (isGreetingOrTest) {
    return {
      domain: 'Umum / Lainnya',
      identifiedIssue: 'Konsultasi & Pengenalan Asisten HukumAI',
      summary: 'Halo! Saya adalah HukumAI (law.web.id), asisten kecerdasan buatan spesialis hukum dan perundang-undangan Republik Indonesia. Saya dapat membantu Anda menelusuri dasar undang-undang, bunyi pasal, serta analisis hukum positif terkait ketenagakerjaan, pidana, ITE, data pribadi (PDP), perdata, perlindungan konsumen, dan pertanahan. Ada persoalan hukum atau pasal yang ingin Anda tanyakan hari ini?',
      givenFacts: [
        'Pengguna memulai sesi sapaan / uji coba konsultasi awal'
      ],
      unknownFacts: [
        'Detail persoalan atau kasus hukum spesifik yang ingin dibahas'
      ],
      analysis: 'HukumAI menghubungkan pertanyaan Anda dengan korpus resmi perundang-undangan Republik Indonesia (JDIHN, BPK RI, Peraturan.go.id, Mahkamah Agung, dan MK). Setiap jawaban dilengkapi kutipan pasal asli dan status keberlakuan peraturan.',
      actionableSteps: [
        'Ketik persoalan hukum Anda secara bebas menggunakan bahasa sehari-hari.',
        'Sebutkan nomor pasal atau undang-undang jika Anda ingin mencari naskah peraturan tertentu.',
        'Atau klik salah satu contoh topik cepat di bawah ini untuk melihat contoh analisis.'
      ],
      uncertainties: [
        'Analisis hukum yang mendalam membutuhkan uraian fakta atau kronologi peristiwa yang jelas.'
      ],
      followUpQuestions: [
        'Apakah Anda memiliki pertanyaan seputar ketenagakerjaan (PHK / PKWT / Ijazah)?',
        'Apakah Anda ingin menanyakan tindak pidana (KUHP / UU ITE / UU PDP)?',
        'Apakah Anda memiliki persoalan perjanjian perdata atau perlindungan konsumen?'
      ]
    };
  }

  if (lower.includes('maling') || lower.includes('begal') || lower.includes('lawan maling') || lower.includes('bela diri') || (lower.includes('tersangka') && lower.includes('lawan'))) {
    return {
      domain: 'Hukum Pidana',
      identifiedIssue: 'Pembelaan Terpaksa (Noodweer) Melawan Pelaku Kejahatan & Penetapan Status Tersangka',
      legalVerdict: {
        statusText: 'KESIMPULAN: TIDAK, ANDA TIDAK SERTA-MERTA BERSALAH — DILINDUNGI HAK PEMBELAAN TERPAKSA (PASAL 49 KUHP)',
        level: 'SAH BERSYARAT',
        bpkRef: 'Pasal 49 KUHP Positif jo. Pasal 34 UU No. 1/2023 (peraturan.bpk.go.id)'
      },
      summary: 'Tidak, Anda tidak sepenuhnya atau serta-merta bersalah di mata hukum pidana Indonesia. Tindakan melawan pelaku kejahatan (maling/pencuri) untuk melindungi keselamatan nyawa, kehormatan, atau harta benda diri sendiri/orang lain dari ancaman seketika yang melawan hukum diakui secara tegas sebagai Pembelaan Terpaksa (Noodweer) berdasarkan Pasal 49 ayat (1) KUHP dan Pasal 34 UU No. 1/2023 (KUHP Baru), yang merupakan alasan penghapus pidana (alasan pembenar) sehingga Anda tidak dapat dipidana.',
      givenFacts: [
        'Terjadi tindak pidana pencurian/kemalingan secara langsung',
        'Korban melakukan tindakan perlawanan fisik terhadap pelaku maling',
        'Penyidik kepolisian menetapkan korban sebagai tersangka'
      ],
      unknownFacts: [
        'Apakah perlawanan dilakukan saat serangan masih berlangsung (seketika) atau saat maling sudah menyerah / melarikan diri jauh?',
        'Tingkat luka/akibat yang diderita oleh pelaku maling (luka ringan, luka berat, atau meninggal dunia)',
        'Alat yang digunakan korban untuk membela diri vs senjata yang dibawa oleh maling (proporsionalitas)'
      ],
      analysis: 'Berdasarkan hukum acara pidana (KUHAP), penetapan status Tersangka oleh polisi adalah pintu masuk formil penyelidikan/penyidikan untuk memeriksa fakta peristiwa secara utuh, BUKAN vonis bahwa Anda bersalah. Menurut Pasal 49 ayat (1) KUHP, barang siapa melakukan pembelaan terpaksa terhadap serangan yang melawan hukum TIDAK DAPAT DIPIDANA. Jika perlawanan melampaui batas akibat guncangan jiwa yang hebat karena ancaman tersebut, Pasal 49 ayat (2) KUHP (Noodweer Exces) tetap membebaskan Anda dari pidana. Jika pembelaan terpaksa terbukti, penyidik wajib menghentikan penyidikan dengan menerbitkan SP3 (Pasal 109 ayat 2 KUHAP).',
      actionableSteps: [
        'Gunakan hak Anda untuk didampingi oleh Advokat / Penasihat Hukum dalam setiap pemeriksaan Berita Acara Pemeriksaan (BAP) tambahan di kepolisian.',
        'Jelaskan secara konsisten dalam BAP bahwa tindakan perlawanan dilakukan semata-mata karena rasa takut, ancaman bahaya mendadak, dan demi melindungi nyawa serta harta benda seketika.',
        'Kumpulkan seluruh alat bukti pembelaan: rekaman CCTV di lokasi kejadian, saksi tetangga/keluarga yang mendengar teriakan, bukti senjata/alat yang dibawa maling, dan visum luka lebam pada diri Anda.',
        'Melalui kuasa hukum, ajukan surat permohonan gelar perkara khusus dan permohonan penghentian penyidikan (SP3) kepada Kapolres/Kapolda berdasarkan Pasal 49 KUHP demi hukum.'
      ],
      uncertainties: [
        'Jika perlawanan dilakukan setelah maling sudah tertangkap, diikat, tidak berdaya, atau dipukuli secara beramai-ramai saat sudah tidak ada ancaman (main hakim sendiri / eigenrichting), unsur pembelaan terpaksa dapat gugur.'
      ],
      followUpQuestions: [
        'Apakah saat Anda melawan, maling tersebut membawa senjata tajam atau melakukan ancaman kekerasan fisik?',
        'Apakah perlawanan dilakukan seketika di lokasi atau mengejar pelaku yang sudah kabur jauh?',
        'Apakah Anda sudah didampingi oleh kuasa hukum saat memberikan keterangan BAP di kantor polisi?'
      ]
    };
  }

  if (lower.includes('ijazah') || lower.includes('tahan ijazah')) {
    return {
      domain: 'Ketenagakerjaan',
      identifiedIssue: 'Penahanan Dokumen Pribadi (Ijazah) oleh Pemberi Kerja',
      legalVerdict: {
        statusText: 'KESIMPULAN: PENAHANAN IJAZAH SEPIHAK ADALAH PERBUATAN MELANGGAR HUKUM',
        level: 'MELANGGAR HUKUM / ILEGAL',
        bpkRef: 'UU No. 6/2023 & Pasal 372 KUHP (peraturan.bpk.go.id)'
      },
      summary: 'Berdasarkan hukum ketenagakerjaan positif Indonesia, tidak ada kewajiban hukum bagi pekerja untuk menyerahkan ijazah asli kepada perusahaan. Penahanan ijazah sepihak tanpa perjanjian yang sah atau menolak mengembalikan ijazah saat hubungan kerja selesai melanggar hak dasar tenaga kerja dan dapat dikategorikan sebagai tindak pidana penggelapan hak milik.',
      givenFacts: [
        'Pekerja menghadapi penahanan dokumen ijazah asli oleh pihak perusahaan',
        'Pekerja mempertanyakan dasar legalitas penahanan dan hak pengembalian dokumen'
      ],
      unknownFacts: [
        'Apakah terdapat klausul perjanjian kerja tertulis mengenai penahanan ijazah?',
        'Apakah pekerja masih dalam ikatan dinas / pelatihan berbiaya perusahaan?',
        'Apakah ada kewajiban ganti rugi atau serah terima inventaris yang belum diselesaikan?'
      ],
      analysis: 'Berdasarkan UU Ketenagakerjaan jo. UU Cipta Kerja No. 6/2023 (Pasal 86) dan Pasal 372 KUHP, penahanan sepihak atas barang milik orang lain tanpa dasar perjanjian sukarela atau menolak mengembalikannya saat hubungan kerja berakhir merupakan perbuatan melawan hukum. Pengusaha dilarang menyandera hak dokumen pekerja untuk membatasi kebebasan mencari penghidupan yang layak.',
      actionableSteps: [
        'Periksa kembali surat perjanjian kerja (PKWT/PKWTT) apakah ada klausul penahanan ijazah dan syarat pengembaliannya.',
        'Ajukan surat somasi / permohonan pengembalian ijazah secara tertulis dan resmi kepada manajemen perusahaan.',
        'Jika perusahaan menolak tanpa alasan sah, laporkan ke Pengawas Ketenagakerjaan di Dinas Tenaga Kerja (Disnaker) setempat atau laporkan dugaan penggelapan ke Kepolisian.'
      ],
      uncertainties: [
        'Jika terdapat ikatan dinas yang sah dengan biaya pelatihan nyata dari perusahaan, penahanan dapat dipertahankan sementara hingga kewajiban ganti rugi dipenuhi sesuai kesepakatan tertulis.'
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
      legalVerdict: {
        statusText: 'KESIMPULAN: PEKERJA BERHAK PENUH ATAS UANG KOMPENSASI & PESANGON SESUAI HUKUM',
        level: 'BERHAK MENUNTUT / KOMPENSASI',
        bpkRef: 'Pasal 61A UU No. 6/2023 jo. PP No. 35/2021 (peraturan.bpk.go.id)'
      },
      summary: 'Berdasarkan UU No. 6 Tahun 2023 (UU Cipta Kerja) dan PP No. 35 Tahun 2021, pekerja kontrak (PKWT) berhak atas uang kompensasi minimal masa kerja 1 bulan berturut-turut saat kontrak selesai. Untuk pekerja tetap (PKWTT) yang terkena PHK, pengusaha wajib membayarkan pesangon, uang penghargaan masa kerja (UPMK), dan penggantian hak.',
      givenFacts: [
        'Terjadi pemutusan hubungan kerja atau pengakhiran masa kontrak kerja',
        'Pekerja menanyakan hak kompensasi atau pesangon yang belum dibayarkan'
      ],
      unknownFacts: [
        'Status hubungan kerja (pekerja tetap PKWTT atau kontrak PKWT)',
        'Masa kerja total di perusahaan yang bersangkutan',
        'Alasan spesifik dilakukannya PHK'
      ],
      analysis: 'Pasal 61A UU No. 6/2023 dan Pasal 15-17 PP No. 35/2021 mewajibkan pengusaha membayar uang kompensasi PKWT dengan rumus baku: (Masa Kerja / 12) x 1 Bulan Upah. Untuk PHK, Pasal 151 mewajibkan surat pemberitahuan 14 hari kerja dan Pasal 156 mengatur kewajiban pesangon.',
      actionableSteps: [
        'Minta rincian tertulis perhitungan hak akhir masa kerja / surat pengalaman kerja (paklaring).',
        'Lakukan perundingan Bipartit secara tertulis dengan manajemen jika nominal tidak sesuai ketentuan PP No. 35/2021.',
        'Catatkan perselisihan hak ke Disnaker setempat untuk mediasi jika perundingan bipartit menemui jalan buntu.'
      ],
      uncertainties: [
        'Besaran kompensasi dipengaruhi oleh alasan pengakhiran dan jenis kontrak kerja yang disepakati.'
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
    legalVerdict: {
      statusText: `KESIMPULAN: PERSOALAN DIATUR DALAM REGULASI HUKUM ${domain.toUpperCase()}`,
      level: 'PERLU BUKTI TAMBAHAN',
      bpkRef: 'Database Resmi BPK RI (peraturan.bpk.go.id)'
    },
    summary: 'Persoalan ini diatur dalam ketentuan peraturan perundang-undangan Indonesia yang mewajibkan adanya pemenuhan hak dan kewajiban sesuai asas hukum positif yang berlaku.',
    givenFacts: [casePrompt],
    unknownFacts: [
      'Dokumen bukti tertulis yang dimiliki para pihak',
      'Kronologi waktu dan peristiwa secara rinci'
    ],
    analysis: `Berdasarkan ketentuan hukum positif di bidang ${domain}, setiap tindakan hukum harus berlandaskan aturan yang sah dan dapat diverifikasi melalui peraturan perundang-undangan resmi (peraturan.bpk.go.id).`,
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
