'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, 
  Plus, 
  Scale, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  ExternalLink,
  HelpCircle,
  FileText,
  Info,
  CheckCircle2
} from 'lucide-react';
import { ChatMessage, CaseAnalysis } from '@/lib/types';
import { useChat } from '@/context/ChatContext';
import LegalSourceCard from './LegalSourceCard';
import EditorialLoader from './EditorialLoader';

interface LegalChatInterfaceProps {
  onSwitchToDocumentView?: (analysis: CaseAnalysis) => void;
}

const PILL_PRESETS = [
  { label: 'Penahanan Ijazah Kerja', icon: '🔗', text: 'Perusahaan tempat saya bekerja menahan ijazah asli saya dan menolak mengembalikannya saat saya mengundurkan diri. Apakah perusahaan berhak menahan ijazah saya menurut hukum ketenagakerjaan?' },
  { label: 'Kompensasi PKWT (PP 35/2021)', icon: '⚠️', text: 'Saya bekerja sebagai karyawan kontrak (PKWT) selama 1 tahun penuh dan kontrak saya berakhir tanpa diperpanjang. Apakah saya berhak mendapatkan uang kompensasi menurut UU Cipta Kerja dan PP 35/2021?' },
  { label: 'Pencemaran Medsos (UU ITE)', icon: '🛡️', text: 'Saya memberikan ulasan kritis di media sosial tentang pelayanan sebuah instansi dan diancam dilaporkan menggunakan Pasal 27A UU ITE. Bagaimana batasan hukum pencemaran nama baik dalam revisi UU ITE terbaru?' },
  { label: 'Penyalahgunaan Data (UU PDP)', icon: '🔒', text: 'Pihak pinjaman online menghubungi dan menyebarkan data saya kepada seluruh kontak darurat di ponsel saya tanpa persetujuan. Apakah hal ini melanggar UU Perlindungan Data Pribadi (UU PDP)?' },
  { label: 'Klausula Baku Konsumen', icon: '🛒', text: 'Saya membeli barang yang ternyata cacat tersembunyi, namun toko menolak ganti rugi dengan alasan nota tertulis "Barang yang dibeli tidak dapat ditukar". Apakah klausul sepihak itu sah menurut UU Perlindungan Konsumen?' }
];

export default function LegalChatInterface({ onSwitchToDocumentView }: LegalChatInterfaceProps) {
  const { activeSession, createNewChat, updateActiveSessionWithAnalysis } = useChat();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = activeSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    if (!textToSend) setInputText('');
    setShowPresetsMenu(false);
    setIsLoading(true);

    try {
      const chatHistory = messages.map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseText: text, chatHistory })
      });

      if (!res.ok) throw new Error('Gagal memproses konsultasi hukum.');

      const analysis: CaseAnalysis = await res.json();

      // Automatically persists and adds session in sidebar!
      updateActiveSessionWithAnalysis(text, analysis);
    } catch (error) {
      console.error('Error in chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (msg: ChatMessage) => {
    let copyContent = msg.text;
    if (msg.analysis) {
      copyContent = `=== TELAAH YURIDIS HUKUMAI (${msg.analysis.identifiedIssue}) ===\n\nKESIMPULAN:\n${msg.analysis.legalVerdict?.statusText || msg.analysis.summary}\n\nRINGKASAN:\n${msg.analysis.summary}\n\nDASAR HUKUM RESMI (peraturan.bpk.go.id):\n${msg.analysis.legalBases.map((b) => `- ${b.documentTitle} Pasal ${b.articleNumber}: "${b.content}" (Sumber: ${b.officialUrl})`).join('\n')}\n\nALASAN & ANALISIS:\n${msg.analysis.analysis}\n\nLANGKAH PRAKTIS:\n${msg.analysis.actionableSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nSumber Resmi: law.web.id & peraturan.bpk.go.id`;
    }
    navigator.clipboard.writeText(copyContent);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSourceExpand = (id: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between relative min-h-[calc(100vh-100px)]">
      {/* Top action bar when messages exist */}
      {messages.length > 0 && (
        <div className="flex items-center justify-between pb-4 swiss-border-b mb-6 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="editorial-meta text-[#c2410c] font-bold">
              {activeSession?.title || 'KONSULTASI HUKUM AKTIF'}
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-mono text-neutral-500">
              {messages.filter((m) => m.sender === 'user').length} Pertanyaan
            </span>
          </div>

          <button
            onClick={() => createNewChat()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase bg-white swiss-border hover:bg-neutral-100 transition text-neutral-700 cursor-pointer rounded-md shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mulai Topik Baru</span>
          </button>
        </div>
      )}

      {/* Main Conversation / Hero Area */}
      <div className="flex-1 flex flex-col justify-center">
        {/* HERO CANVAS (Clean minimalist initial state) */}
        {messages.length === 0 && (
          <div className="my-auto py-12 px-4 text-center space-y-8 max-w-3xl mx-auto animate-in fade-in duration-300">
            {/* Title with Subtle Rhombus Graphic Accent */}
            <div className="relative inline-block py-2">
              <div className="absolute -inset-4 border border-neutral-300/60 skew-x-12 pointer-events-none rounded-xl"></div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111215] font-serif leading-[1.12]">
                Pahami hukum &<br />
                <span className="italic font-light">temukan dasarnya.</span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm font-mono text-neutral-600 max-w-xl mx-auto leading-relaxed">
              Konsultasikan persoalan hukum sehari-hari dengan asisten AI berbasis naskah undang-undang resmi pemerintah (peraturan.bpk.go.id) dan rujukan pasal yang dapat diverifikasi.
            </p>

            {/* Pill Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              {PILL_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(preset.text)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/90 swiss-border hover:border-black hover:bg-white text-xs font-mono text-neutral-800 transition duration-150 rounded-full shadow-2xs cursor-pointer group hover:scale-[1.02] active:scale-98"
                >
                  <span>{preset.icon}</span>
                  <span className="group-hover:text-black">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Thread when Active */}
        {messages.length > 0 && (
          <div className="space-y-8 pb-28">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2 animate-in fade-in duration-200`}
                >
                  {/* Sender Tag & Timestamp */}
                  <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 px-1">
                    {isUser ? (
                      <>
                        <span>Anda</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-[#c2410c] flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          HukumAI
                        </span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                        {msg.analysis && (
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.2 border border-emerald-200 text-[10px] rounded">
                            {msg.analysis.domain}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Message Bubble Body */}
                  <div
                    className={`max-w-4xl swiss-border p-6 rounded-2xl ${
                      isUser
                        ? 'bg-[#111215] text-[#fbfbfa] ml-8 rounded-tr-xs'
                        : 'bg-white text-[#111215] shadow-xs mr-2 sm:mr-6 w-full rounded-tl-xs'
                    }`}
                  >
                    {/* User Text */}
                    {isUser && (
                      <p className="text-[15px] leading-relaxed font-mono whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    )}

                    {/* Assistant Structured Fact & Law Response (Screenshot style) */}
                    {!isUser && (
                      <div className="space-y-6">
                        {/* Friendly Opener */}
                        <p className="text-sm font-mono text-neutral-700">
                          Halo! Saya sudah menelusuri dasar hukum positif dan naskah regulasi resmi pemerintah mengenai persoalan ini.
                        </p>

                        {/* VERDICT BANNER BOX (Screenshot Factize style, adapted for HukumAI & peraturan.bpk.go.id) */}
                        {msg.analysis && (
                          <div className="bg-[#fef9f2] border border-[#f5d9bc] p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#fde6cf] text-[#c2410c] flex items-center justify-center shrink-0 mt-0.5">
                                <Info className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-[10px] font-mono tracking-wider text-[#9a3412] uppercase font-bold block">
                                  HASIL TELAAH HUKUM RESMI
                                </span>
                                <h4 className="font-bold text-sm sm:text-base text-[#7c2d12] leading-snug">
                                  {msg.analysis.legalVerdict?.statusText || `TELAAH STATUS: ${msg.analysis.identifiedIssue.toUpperCase()}`}
                                </h4>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 border border-[#f5d9bc] rounded-full text-[11px] font-mono text-[#9a3412] shrink-0 self-start sm:self-auto font-medium">
                              <span className="w-2 h-2 rounded-full bg-[#c2410c] animate-pulse"></span>
                              <span>Terverifikasi peraturan.bpk.go.id</span>
                            </div>
                          </div>
                        )}

                        {/* Section: Headline Title */}
                        {msg.analysis && (
                          <div className="swiss-border-b pb-3">
                            <h3 className="font-bold text-lg text-[#111215] flex items-center gap-2">
                              <span>🔍 Telaah Yuridis: {msg.analysis.identifiedIssue}</span>
                            </h3>
                          </div>
                        )}

                        {/* Section 1: 📄 Ringkasan Temuan & Ketentuan Hukum */}
                        <div className="space-y-2">
                          <span className="editorial-meta text-neutral-600 block flex items-center gap-1.5 font-bold">
                            <span>📄 RINGKASAN TEMUAN & KETENTUAN HUKUM</span>
                          </span>
                          <div className="text-[15px] leading-relaxed font-serif text-[#111215] bg-[#fafafa] p-4 rounded-xl border border-neutral-200/80">
                            {msg.text}
                          </div>
                        </div>

                        {/* Section 2: 🏛️ Dasar Hukum Faktual (peraturan.bpk.go.id & JDIHN) */}
                        {msg.analysis && msg.analysis.legalBases.length > 0 && (
                          <div className="bg-[#fbfbfa] swiss-border p-5 rounded-xl space-y-3.5">
                            <div className="flex items-center justify-between">
                              <span className="editorial-meta font-bold text-neutral-800 flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4 text-[#c2410c]" />
                                <span>🏛️ DASAR HUKUM FAKTUAL ({msg.analysis.legalBases.length} PASAL DI PERATURAN.BPK.GO.ID)</span>
                              </span>
                              <button
                                onClick={() => toggleSourceExpand(msg.id)}
                                className="text-xs font-mono text-neutral-600 hover:text-black flex items-center gap-1 cursor-pointer underline"
                              >
                                <span>{expandedSources[msg.id] ? 'Tutup Rincian' : 'Buka Bunyi Pasal Lengkap'}</span>
                                {expandedSources[msg.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            {/* List of articles */}
                            <div className="space-y-3">
                              {msg.analysis.legalBases.map((art, idx) => (
                                <div key={art.id || idx} className="bg-white p-4 swiss-border rounded-xl space-y-2.5 shadow-2xs">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-xs font-mono text-neutral-900">
                                        {art.documentTitle} · PASAL {art.articleNumber}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold rounded">
                                      Status: {art.status}
                                    </span>
                                  </div>

                                  <p className="font-serif italic text-neutral-800 bg-[#fbfbfa] p-3.5 border-l-2 border-[#c2410c] text-xs leading-relaxed rounded-r">
                                    &ldquo;{art.content}&rdquo;
                                  </p>

                                  {art.explanation && (
                                    <p className="font-mono text-neutral-700 text-xs leading-relaxed">
                                      💡 <strong>Keterangan Resmi:</strong> {art.explanation}
                                    </p>
                                  )}

                                  <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-500">
                                    <span>Sumber Terverifikasi: {art.officialSource}</span>
                                    <a
                                      href={art.officialUrl || 'https://peraturan.bpk.go.id'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[#c2410c] hover:underline font-semibold flex items-center gap-1 bg-[#fef2f2] px-2.5 py-1 rounded border border-[#fecaca]"
                                    >
                                      <span>Buka di peraturan.bpk.go.id</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Section 3: ⚖️ Alasan Yuridis & Analisis Fakta */}
                        {msg.analysis && msg.analysis.analysis && (
                          <div className="space-y-2">
                            <span className="editorial-meta text-[#c2410c] block font-bold">
                              ⚖️ ALASAN YURIDIS & ANALISIS HUBUNGAN FAKTA:
                            </span>
                            <div className="text-xs sm:text-[13px] font-mono text-neutral-800 leading-relaxed bg-[#fbfbfa] p-4 border border-neutral-200 rounded-xl whitespace-pre-wrap">
                              {msg.analysis.analysis}
                            </div>
                          </div>
                        )}

                        {/* Section 4: 🛡️ Langkah Praktis & Upaya Hukum */}
                        {msg.analysis && msg.analysis.actionableSteps.length > 0 && (
                          <div className="space-y-2.5">
                            <span className="editorial-meta block text-[#c2410c] font-bold">
                              🛡️ LANGKAH PRAKTIS & JALUR PENYELESAIAN YANG DAPAT DITEMPUH:
                            </span>
                            <div className="space-y-2">
                              {msg.analysis.actionableSteps.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 text-xs font-mono text-neutral-800 bg-[#fbfbfa] p-3.5 border border-neutral-200 rounded-xl">
                                  <span className="font-bold text-[#c2410c] shrink-0">[{idx + 1}]</span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Section 5: ⚠️ Batasan & Ketidakpastian */}
                        {msg.analysis && msg.analysis.uncertainties.length > 0 && (
                          <div className="text-[11.5px] font-mono text-neutral-600 bg-neutral-50 p-3.5 border border-neutral-200 rounded-xl space-y-1">
                            <div className="flex items-center gap-1.5 font-semibold text-neutral-800">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Faktor yang Dapat Mengubah Analisis Hukum:</span>
                            </div>
                            <p>{msg.analysis.uncertainties.join(' ')}</p>
                          </div>
                        )}

                        {/* Message Actions */}
                        <div className="swiss-border-t pt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-neutral-600">
                          <button
                            onClick={() => handleCopyMessage(msg)}
                            className="flex items-center gap-1.5 px-3 py-1.5 swiss-border bg-white hover:bg-neutral-100 transition cursor-pointer rounded-md"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === msg.id ? 'Tersalin' : 'Salin Jawaban Lengkap'}</span>
                          </button>

                          {onSwitchToDocumentView && msg.analysis && (
                            <button
                              onClick={() => onSwitchToDocumentView(msg.analysis!)}
                              className="text-[#c2410c] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>Buka Format Dokumen 12-Kolom</span>
                              <span>→</span>
                            </button>
                          )}
                        </div>

                        {/* Suggested Follow-ups */}
                        {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                          <div className="pt-2 border-t border-dashed border-neutral-200 space-y-2">
                            <span className="editorial-meta text-neutral-500 flex items-center gap-1">
                              <HelpCircle className="w-3 h-3 text-blue-600" />
                              PERTANYAAN LANJUTAN YANG DISARANKAN:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {msg.suggestedFollowUps.map((q, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSendMessage(q)}
                                  className="text-xs font-mono px-3.5 py-2 bg-white swiss-border hover:bg-neutral-900 hover:text-white transition cursor-pointer text-left rounded-lg shadow-2xs"
                                >
                                  💬 {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading State */}
            {isLoading && (
              <div className="max-w-2xl">
                <EditorialLoader />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* FLOATING BOTTOM INPUT BOX */}
      <div className="sticky bottom-4 z-30 pt-4 max-w-3xl w-full mx-auto">
        {/* Preset Menu Popup if '+' is clicked */}
        {showPresetsMenu && (
          <div className="mb-3 bg-white swiss-border p-4 shadow-2xl rounded-2xl animate-in fade-in slide-in-from-bottom-2 space-y-2">
            <span className="editorial-meta text-neutral-500 block">
              PILIH CONTOH PERTANYAAN CEPAT:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PILL_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSendMessage(preset.text);
                    setShowPresetsMenu(false);
                  }}
                  className="p-2.5 text-left text-xs font-mono text-neutral-800 bg-[#fbfbfa] hover:bg-neutral-900 hover:text-white swiss-border transition rounded-xl"
                >
                  {preset.icon} {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="bg-white swiss-border rounded-2xl shadow-lg p-3 sm:p-4 transition focus-within:ring-2 focus-within:ring-neutral-900/20"
        >
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            rows={2}
            placeholder="Ketik persoalan hukum Anda, atau sebutkan pasal..."
            className="w-full bg-transparent text-sm font-mono text-[#111215] placeholder:text-neutral-400 focus:outline-none resize-none leading-relaxed px-1"
          />

          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 mt-1">
            {/* Left '+' button */}
            <button
              type="button"
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 transition rounded-full cursor-pointer"
              title="Pilih Topik Cepat"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Right '↑' Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-9 h-9 bg-[#111215] text-white hover:bg-[#c2410c] disabled:opacity-30 disabled:cursor-not-allowed transition rounded-full flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
              title="Kirim Pertanyaan"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Micro Disclaimer */}
        <p className="text-[11px] font-mono text-neutral-400 text-center mt-2">
          HukumAI terhubung ke korpus perundang-undangan resmi RI (peraturan.bpk.go.id). Bukan pengganti nasihat advokat.
        </p>
      </div>
    </div>
  );
}
