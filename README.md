# HukumAI (law.web.id) 🏛️🇮🇩

> **Pahami hukum Indonesia. Temukan dasar hukumnya. Tetap verifikasi.**

**HukumAI** adalah platform kecerdasan buatan (AI) publik yang membantu masyarakat Indonesia memahami persoalan hukum menggunakan bahasa sehari-hari, dengan jawaban yang **berbasis pada sumber perundang-undangan positif Indonesia yang dapat diverifikasi** (JDIHN, BPK RI, Peraturan.go.id, Mahkamah Agung RI, dan Mahkamah Konstitusi).

---

## 🌟 Prinsip Utama (Swiss Modernism 2.0 + Editorial Legal)

- **Accuracy First & Anti-Halusinasi**: Sistem tidak mengarang pasal. Jawaban dihasilkan berdasarkan korpus regulasi resmi dan *Google Search Grounding* ke portal pemerintah.
- **Dapat Diverifikasi**: Setiap ketentuan menyertakan kartu rujukan pasal asli, nomor UU, tahun, status keberlakuan (*Berlaku/Diubah/Dicabut*), dan tautan langsung ke naskah JDIH asli.
- **Bahasa Manusia**: Menjelaskan istilah hukum teknis (Wanprestasi, PMH, Delik Aduan, Pacta Sunt Servanda) secara terstruktur dan mudah dipahami.
- **Mandatory First-Open Disclaimer**: Menampilkan peringatan etika & batasan AI sebelum sesi konsultasi dimulai.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript + React 19
- **Styling**: Tailwind CSS (Swiss Modernism 2.0, Paper Background `#fbfbfa`, 12-Column Editorial Grid, Crisp 1px Rules)
- **AI Engine**: `@google/genai` (SDK Resmi Google) dengan model **Gemini 2.5 Flash**
- **Grounding**: Google Search Grounding untuk penelusuran live regulasi pemerintah
- **Icons**: Lucide React

---

## 🚀 Cara Menjalankan Lokal

1. **Clone repository**:
   ```bash
   git clone https://github.com/joshhh22/lawAI.git
   cd lawAI
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Buat file `.env.local`**:
   ```bash
   cp .env.example .env.local
   ```
   Isi `GEMINI_API_KEY` dari [Google AI Studio](https://aistudio.google.com/).

4. **Jalankan local development server**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🌐 Panduan Deploy ke Vercel & Domain `law.web.id`

### 1. Push ke GitHub
```bash
git add .
git commit -m "feat: complete HukumAI law.web.id with Gemini 2.5 Flash & Swiss Modernism 2.0"
git branch -M main
git remote add origin https://github.com/joshhh22/lawAI.git
git push -u origin main
```

### 2. Deploy di Vercel
1. Buka [Vercel Dashboard](https://vercel.com/new).
2. Pilih repository `joshhh22/lawAI` dan klik **Import**.
3. Pada bagian **Environment Variables**, tambahkan:
   - `GEMINI_API_KEY`: API Key Gemini Anda dari Google AI Studio.
4. Klik **Deploy**.

### 3. Menghubungkan Domain `law.web.id`
1. Di Dashboard Vercel project `lawAI`, buka tab **Settings** → **Domains**.
2. Masukkan `law.web.id` dan klik **Add**.
3. Masuk ke panel kontrol DNS registrar domain Anda (tempat Anda membeli `law.web.id` seperti Rumahweb, Niagahoster, DomaiNesia, dll).
4. Tambahkan DNS Record sesuai petunjuk Vercel:
   - **Type A**: `@` diarahkan ke `76.76.21.21`
   - **Type CNAME**: `www` diarahkan ke `cname.vercel-dns.com`
5. Tunggu propagasi DNS (biasanya 5–30 menit). Website Anda sudah aktif di `https://law.web.id` dengan sertifikat SSL gratis otomatis dari Vercel!

---

## ⚖️ Legal Disclaimer
HukumAI adalah alat bantu edukatif dan penelusuran informasi hukum awal. HukumAI **bukan pengacara, bukan kantor hukum, dan bukan pengganti nasihat atau pendampingan advokat resmi**.
