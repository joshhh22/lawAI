# CekHukum (cekhukum.web.id) 🏛️🇮🇩

> **Pahami hukum Indonesia. Temukan dasar hukumnya. Tetap verifikasi.**

**CekHukum** adalah platform kecerdasan buatan (*AI Legal Assistant*) publik yang membantu masyarakat Indonesia memahami persoalan hukum sehari-hari dengan rujukan naskah perundang-undangan positif yang dapat diverifikasi langsung ke portal pemerintah (**JDIHN, BPK RI [peraturan.bpk.go.id], Peraturan.go.id, Mahkamah Agung, dan Mahkamah Konstitusi**).

---

## 🌟 Fitur Utama & Desain

- ⚡ **Gemini 3.6 Flash & Live Search Grounding**: Model AI generasi terbaru dengan latensi ultra-rendah dan kemampuan verifikasi data regulasi pemerintah secara *real-time*.
- 🏛️ **Dasar Hukum Faktual BPK RI**: Setiap analisis menyertakan kutipan resmi bunyi Pasal, Ayat, status keberlakuan (*Berlaku/Diubah/Dicabut*), dan tombol langsung ke `peraturan.bpk.go.id`.
- 🏷️ **Banner Status Kesimpulan (*Verdict Card*)**: Kotak ringkasan status hukum (*Melanggar Hukum / Berhak Menuntut / Delik Aduan / Sah Bersyarat*).
- 💬 **Riwayat Percakapan Cerdas (*Chat History*)**: Sesi obrolan tersimpan otomatis dengan judul cerdas, waktu relatif, dan kolom pencarian riwayat.
- 🌐 **Bilingual (Indonesia 🇮🇩 / English 🇬🇧)**: Antarmuka dan konsultasi dwibahasa penuh dengan 1 tombol ganti bahasa.
- ⚙️ **Pengaturan & Manajemen Riwayat**: Kemudahan menghapus riwayat chat per-sesi atau hapus semua (*Clear All*).
- 📱 **Minimalist Full-Canvas Hero**: Desain modern dengan *icon dock sidebar* yang dapat disembunyikan untuk memberikan 100% ruang canvas obrolan.

---

## 🛠️ Panduan Lengkap Instalasi & Setup (Tutorial)

### 1. 🔑 Setup Google Gemini API Key
1. Buka situs **[Google AI Studio](https://aistudio.google.com/)**.
2. Login dengan akun Google Anda.
3. Klik tombol **Get API Key** ➔ **Create API key in new project**.
4. Salin string API key yang muncul.
5. Buat file `.env.local` di folder root project dan masukkan:
   ```env
   GEMINI_API_KEY=masukkan_api_key_gemini_anda_disini
   ```

---

### 2. 🗄️ Setup Database Supabase (PostgreSQL Cloud)
Project ini mendukung **Arsitektur Hybrid**: dapat berjalan 100% instan di browser (`localStorage`), dan dapat disinkronkan ke cloud database **Supabase** secara otomatis.

Langkah setup Supabase:
1. Buka dan buat akun di **[Supabase](https://supabase.com/)**.
2. Buat project baru (pilih region terdekat, misal *Singapore*).
3. Masuk ke menu **SQL Editor** pada bilah kiri dashboard Supabase.
4. Buka file **`supabase/schema.sql`** di project ini, lalu **Salin (Copy)** seluruh isinya dan **Tempel (Paste)** ke SQL Editor Supabase ➔ Klik tombol **Run**.
5. Masuk ke menu **Project Settings** (ikon gerigi) ➔ pilih **API**.
6. Salin **Project URL** dan **anon public key**.
7. Tambahkan ke file `.env.local` Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
   ```

---

### 3. 💻 Menjalankan Project di Komputer Lokal (Localhost)
1. **Instal dependensi**:
   ```bash
   npm install
   ```
2. **Jalankan local server**:
   ```bash
   npm run dev
   ```
3. Buka browser dan akses: **[http://localhost:3000](http://localhost:3000)**.

---

### 4. 🚀 Panduan Deploy ke Vercel (Production)
1. Buka **[Vercel Dashboard](https://vercel.com/new)** dan login menggunakan akun GitHub Anda.
2. Pilih repository **`lawAI`** dan klik **Import**.
3. Di bagian **Environment Variables**, tambahkan:
   - `GEMINI_API_KEY`: API Key Gemini Anda.
   - *(Opsional)* `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase Anda.
   - *(Opsional)* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon Key Supabase Anda.
4. Klik tombol **Deploy**. Vercel akan meng-compile dan menghasilkan URL live (contoh: `https://law-ai.vercel.app`).

---

### 5. 🌐 Menghubungkan Domain Kustom `cekhukum.web.id`
1. Di Dashboard Vercel project Anda, masuk ke menu **Settings** ➔ pilih tab **Domains**.
2. Masukkan nama domain Anda: `cekhukum.web.id` (dan `www.cekhukum.web.id`), lalu klik **Add**.
3. Buka panel kontrol DNS IDCloudHost Anda.
4. Tambahkan 2 baris DNS Record berikut:
   - **Type A**:
     - Name / Host: `@`
     - Value / Destination: `216.198.79.1` (atau `76.76.21.21`)
     - TTL: `Auto` / `14400`
   - **Type CNAME**:
     - Name / Host: `www`
     - Value / Destination: `cname.vercel-dns.com`
     - TTL: `Auto` / `14400`
5. Tunggu proses propagasi DNS (biasanya 5 hingga 30 menit). Vercel akan otomatis menerbitkan **Sertifikat SSL (HTTPS)** gratis dan website Anda resmi aktif di **https://cekhukum.web.id**!

---

## ⚖️ Legal Disclaimer
CekHukum adalah sarana edukasi dan penelusuran informasi hukum berbasis teknologi kecerdasan buatan. CekHukum **bukan pengacara, bukan kantor hukum, dan bukan pengganti nasihat atau pendampingan advokat resmi**.
