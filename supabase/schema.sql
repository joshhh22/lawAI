-- ==============================================================================
-- CEKHUKUM (cekhukum.web.id) - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda.
-- ==============================================================================

-- 1. Tabel Sesi Konsultasi (Chat Sessions)
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    domain TEXT DEFAULT 'Umum / Lainnya',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Pesan Obrolan (Chat Messages)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
    sender TEXT CHECK (sender IN ('user', 'assistant')) NOT NULL,
    text TEXT NOT NULL,
    analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Riwayat Kasus Hukum (Legal Cases Analysis)
CREATE TABLE IF NOT EXISTS public.legal_cases (
    id TEXT PRIMARY KEY,
    case_number TEXT UNIQUE NOT NULL,
    user_prompt TEXT NOT NULL,
    domain TEXT NOT NULL,
    identified_issue TEXT NOT NULL,
    evidence_status JSONB NOT NULL,
    summary TEXT NOT NULL,
    legal_verdict JSONB,
    given_facts JSONB,
    unknown_facts JSONB,
    legal_bases JSONB,
    analysis TEXT NOT NULL,
    actionable_steps JSONB,
    uncertainties JSONB,
    follow_up_questions JSONB,
    grounding_sources JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabel Umpan Balik Akurasi Pasal (User Feedback)
CREATE TABLE IF NOT EXISTS public.user_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id TEXT REFERENCES public.legal_cases(id) ON DELETE SET NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Publik / Anonim (Bisa disesuaikan jika ingin login mandatory)
CREATE POLICY "Public read chat_sessions" ON public.chat_sessions FOR SELECT USING (true);
CREATE POLICY "Public insert chat_sessions" ON public.chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update chat_sessions" ON public.chat_sessions FOR UPDATE USING (true);
CREATE POLICY "Public delete chat_sessions" ON public.chat_sessions FOR DELETE USING (true);

CREATE POLICY "Public read chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Public insert chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read legal_cases" ON public.legal_cases FOR SELECT USING (true);
CREATE POLICY "Public insert legal_cases" ON public.legal_cases FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert user_feedback" ON public.user_feedback FOR INSERT WITH CHECK (true);
