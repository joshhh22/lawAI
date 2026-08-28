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
  FileText
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
      copyContent = `=== KONSULTASI HUKUMAI (${msg.analysis.identifiedIssue}) ===\n\nRINGKASAN:\n${msg.analysis.summary}\n\nDASAR HUKUM:\n${msg.analysis.legalBases.map((b) => `- ${b.documentTitle} Pasal ${b.articleNumber}: "${b.content}"`).join('\n')}\n\nANALISIS:\n${msg.analysis.analysis}\n\nLANGKAH PRAKTIS:\n${msg.analysis.actionableSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nSumber Resmi: law.web.id`;
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
              Konsultasikan persoalan hukum sehari-hari dengan asisten AI berbasis naskah undang-undang resmi pemerintah dan rujukan pasal yang dapat diverifikasi.
            </p>

            {/* Pill Chips (Exact Screenshot Layout with Smooth Hover) */}
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
          <div className="space-y-6 pb-28">
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

                    {/* Assistant Rich Response Structure */}
                    {!isUser && (
                      <div className="space-y-6">
                        {/* Header Issue Tag */}
                        {msg.analysis && (
                          <div className="swiss-border-b pb-3.5 flex items-center justify-between">
                            <div>
                              <span className="editorial-meta text-[#c2410c] block">
                                TELAAH YURIDIS RESMI
                              </span>
                              <h3 className="font-bold text-lg text-[#111215] mt-0.5">
                                {msg.analysis.identifiedIssue}
                              </h3>
                            </div>
                            {onSwitchToDocumentView && (
                              <button
                                onClick={() => onSwitchToDocumentView(msg.analysis!)}
                                className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[#c2410c] hover:underline cursor-pointer bg-neutral-50 px-3 py-1.5 border border-neutral-200 rounded-md"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Buka Dokumen 12-Kolom</span>
                              </button>
                            )}
                          </div>
                        )}

                        {/* Summary / Direct Answer */}
                        <div className="text-[15.5px] leading-relaxed font-serif text-[#111215]">
                          {msg.text}
                        </div>

                        {/* Legal Bases & Articles (Expandable Section) */}
                        {msg.analysis && msg.analysis.legalBases.length > 0 && (
                          <div className="bg-[#fbfbfa] swiss-border p-5 rounded-xl space-y-3.5">
                            <div className="flex items-center justify-between">
                              <span className="editorial-meta font-bold text-neutral-800 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-[#c2410c]" />
                                <span>DASAR HUKUM TERVERIFIKASI ({msg.analysis.legalBases.length} PASAL)</span>
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
                            <div className="space-y-2.5">
                              {msg.analysis.legalBases.map((art, idx) => (
                                <div key={art.id || idx} className="bg-white p-3.5 swiss-border rounded-lg space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-xs font-mono text-neutral-900">
                                      {art.documentTitle} · PASAL {art.articleNumber}
                                    </span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold rounded">
                                      {art.status}
                                    </span>
                                  </div>

                                  {expandedSources[msg.id] && (
                                    <div className="mt-2 pt-2 border-t border-neutral-100 space-y-2.5 text-xs">
                                      <p className="font-serif italic text-neutral-800 bg-[#fbfbfa] p-3 border-l-2 border-black rounded-r">
                                        &ldquo;{art.content}&rdquo;
                                      </p>
                                      {art.explanation && (
                                        <p className="font-mono text-neutral-600 text-[11.5px]">
                                          💡 {art.explanation}
                                        </p>
                                      )}
                                      <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                                        <span>Sumber: {art.officialSource}</span>
                                        <a
                                          href={art.officialUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-neutral-800 hover:text-[#c2410c] font-semibold flex items-center gap-1"
                                        >
                                          <span>Buka JDIH Resmi</span>
                                          <ExternalLink className="w-3 h-3" />
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Practical Action Steps */}
                        {msg.analysis && msg.analysis.actionableSteps.length > 0 && (
                          <div className="space-y-2.5 pt-1">
                            <span className="editorial-meta block text-[#c2410c]">
                              LANGKAH PRAKTIS YANG DAPAT DILAKUKAN:
                            </span>
                            <div className="space-y-2">
                              {msg.analysis.actionableSteps.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 text-xs font-mono text-neutral-800 bg-[#fbfbfa] p-3 border border-neutral-200 rounded-lg">
                                  <span className="font-bold text-[#c2410c] shrink-0">[{idx + 1}]</span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Uncertainty Notice */}
                        {msg.analysis && msg.analysis.uncertainties.length > 0 && (
                          <div className="text-[11px] font-mono text-neutral-500 bg-neutral-50 p-3.5 border border-neutral-200 rounded-lg space-y-1">
                            <div className="flex items-center gap-1 font-semibold text-neutral-700">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Faktor yang Dapat Mengubah Analisis:</span>
                            </div>
                            <p>{msg.analysis.uncertainties.join(' ')}</p>
                          </div>
                        )}

                        {/* Message Actions */}
                        <div className="swiss-border-t pt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-neutral-600">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyMessage(msg)}
                              className="flex items-center gap-1.5 px-3 py-1.5 swiss-border bg-white hover:bg-neutral-100 transition cursor-pointer rounded-md"
                            >
                              {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedId === msg.id ? 'Tersalin' : 'Salin Jawaban'}</span>
                            </button>
                          </div>

                          {onSwitchToDocumentView && msg.analysis && (
                            <button
                              onClick={() => onSwitchToDocumentView(msg.analysis!)}
                              className="text-[#c2410c] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>Buka Format Laporan Lengkap (12-Kolom)</span>
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
          HukumAI adalah asisten informasi hukum berbasis korpus resmi RI dan dapat membuat kekeliruan. Tetap verifikasi sumber resmi.
        </p>
      </div>
    </div>
  );
}
