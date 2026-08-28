'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
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
  User,
  Bot
} from 'lucide-react';
import { ChatMessage, CaseAnalysis } from '@/lib/types';
import LegalSourceCard from './LegalSourceCard';
import EditorialLoader from './EditorialLoader';

interface LegalChatInterfaceProps {
  onSwitchToDocumentView?: (analysis: CaseAnalysis) => void;
}

const INITIAL_PROMPTS = [
  'Perusahaan saya menahan ijazah asli, apakah sah menurut hukum?',
  'Kontrak PKWT 1 tahun habis, apakah berhak uang kompensasi?',
  'Dituduh mencemarkan nama baik di media sosial karena mengkritik layanan',
  'Data kontak saya disebar pinjol tanpa izin, apakah melanggar UU PDP?',
  'Membeli barang rusak tapi toko menolak retur dengan klausula baku'
];

export default function LegalChatInterface({ onSwitchToDocumentView }: LegalChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessageId = `user_${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
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

      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: analysis.summary,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        analysis,
        suggestedFollowUps: analysis.followUpQuestions || [
          'Bagaimana prosedur pelaporan jika mediasi gagal?',
          'Berapa batas waktu daluwarsa untuk kasus ini?'
        ]
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: 'Maaf, terjadi kendala saat menelusuri korpus hukum. Silakan periksa koneksi atau coba ulangi pertanyaan Anda.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
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

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="w-full bg-white swiss-border flex flex-col shadow-xs min-h-[620px] max-h-[85vh]">
      {/* Top Chat Header */}
      <div className="bg-[#111215] text-[#fbfbfa] p-4 px-6 flex items-center justify-between swiss-border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#c2410c] text-white flex items-center justify-center font-bold text-sm">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">
                ASISTEN KONSULTASI HUKUM AI
              </span>
              <span className="text-[10px] font-mono bg-emerald-900/80 text-emerald-300 px-2 py-0.5 border border-emerald-700">
                GEMINI 2.5 FLASH · JDIH GROUNDED
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono">
              Jawaban berbasis perundang-undangan positif Indonesia & sumber resmi yang dapat diverifikasi
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase swiss-border border-neutral-700 hover:bg-neutral-800 transition text-neutral-300 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Percakapan Baru</span>
          </button>
        )}
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#fbfbfa]">
        {/* Welcome Empty State */}
        {messages.length === 0 && (
          <div className="py-8 px-4 text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-12 h-12 bg-neutral-100 swiss-border mx-auto flex items-center justify-center text-[#c2410c]">
              <Scale className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="editorial-meta text-[#c2410c]">
                KONSULTASI HUKUM DIGITAL INDONESIA
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111215]">
                Ada persoalan hukum apa yang ingin Anda tanyakan?
              </h2>
              <p className="text-xs sm:text-sm font-mono text-neutral-600 leading-relaxed">
                Ketik permasalahan Anda dalam bahasa sehari-hari. AI akan membedah dasar undang-undang, pasal yang relevan, analisis yuridis, dan langkah praktisnya.
              </p>
            </div>

            {/* Starter Suggestion Chips */}
            <div className="space-y-2.5 pt-2">
              <span className="editorial-meta text-neutral-500 block text-center">
                PILIH CONTOH TOPIK PERTANYAAN:
              </span>
              <div className="flex flex-col gap-2">
                {INITIAL_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="p-3 bg-white swiss-border hover:border-black hover:bg-neutral-50 text-left text-xs font-mono text-neutral-800 transition flex items-center justify-between group cursor-pointer"
                  >
                    <span>💬 {prompt}</span>
                    <span className="text-neutral-400 group-hover:text-black font-bold">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Thread */}
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
                      <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.2 border border-emerald-200 text-[10px]">
                        {msg.analysis.domain}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Message Bubble Body */}
              <div
                className={`max-w-3xl swiss-border p-5 ${
                  isUser
                    ? 'bg-[#111215] text-[#fbfbfa] ml-8'
                    : 'bg-white text-[#111215] shadow-xs mr-4 sm:mr-8 w-full'
                }`}
              >
                {/* User Text */}
                {isUser && (
                  <p className="text-[14.5px] leading-relaxed font-mono whitespace-pre-wrap">
                    {msg.text}
                  </p>
                )}

                {/* Assistant Rich Response Structure */}
                {!isUser && (
                  <div className="space-y-5">
                    {/* Header Issue Tag */}
                    {msg.analysis && (
                      <div className="swiss-border-b pb-3 flex items-center justify-between">
                        <div>
                          <span className="editorial-meta text-[#c2410c] block">
                            HASIL ANALISIS KORPUS HUKUM POSITIF
                          </span>
                          <h3 className="font-bold text-base text-[#111215] mt-0.5">
                            {msg.analysis.identifiedIssue}
                          </h3>
                        </div>
                        {onSwitchToDocumentView && (
                          <button
                            onClick={() => onSwitchToDocumentView(msg.analysis!)}
                            className="hidden sm:flex items-center gap-1 text-xs font-mono text-[#c2410c] hover:underline cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Buka Format Dokumen 12-Kolom ↗</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Summary / Direct Answer */}
                    <div className="text-[15px] leading-relaxed font-serif text-[#111215]">
                      {msg.text}
                    </div>

                    {/* Legal Bases & Articles (Expandable Section) */}
                    {msg.analysis && msg.analysis.legalBases.length > 0 && (
                      <div className="bg-[#fbfbfa] swiss-border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="editorial-meta font-bold text-neutral-800 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#c2410c]" />
                            <span>DASAR HUKUM TERVERIFIKASI ({msg.analysis.legalBases.length} PASAL)</span>
                          </span>
                          <button
                            onClick={() => toggleSourceExpand(msg.id)}
                            className="text-xs font-mono text-neutral-600 hover:text-black flex items-center gap-1 cursor-pointer"
                          >
                            <span>{expandedSources[msg.id] ? 'Sembunyikan Pasal' : 'Tampilkan Bunyi Pasal'}</span>
                            {expandedSources[msg.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* List of articles */}
                        <div className="space-y-2">
                          {msg.analysis.legalBases.map((art, idx) => (
                            <div key={art.id || idx} className="bg-white p-3 swiss-border space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs font-mono text-neutral-900">
                                  {art.documentTitle} · PASAL {art.articleNumber}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold">
                                  {art.status}
                                </span>
                              </div>

                              {expandedSources[msg.id] && (
                                <div className="mt-2 pt-2 border-t border-neutral-100 space-y-2 text-xs">
                                  <p className="font-serif italic text-neutral-800 bg-neutral-50 p-2 border-l-2 border-black">
                                    &ldquo;{art.content}&rdquo;
                                  </p>
                                  {art.explanation && (
                                    <p className="font-mono text-neutral-600">
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
                                      <span>Buka JDIH</span>
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
                      <div className="space-y-2 pt-1">
                        <span className="editorial-meta block text-[#c2410c]">
                          LANGKAH PRAKTIS YANG DAPAT DILAKUKAN:
                        </span>
                        <div className="space-y-1.5">
                          {msg.analysis.actionableSteps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs font-mono text-neutral-800 bg-[#fbfbfa] p-2.5 border border-neutral-200">
                              <span className="font-bold text-[#c2410c] shrink-0">[{idx + 1}]</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Uncertainty Notice */}
                    {msg.analysis && msg.analysis.uncertainties.length > 0 && (
                      <div className="text-[11px] font-mono text-neutral-500 bg-neutral-50 p-3 border border-neutral-200 space-y-1">
                        <div className="flex items-center gap-1 font-semibold text-neutral-700">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Faktor yang Dapat Mengubah Analisis:</span>
                        </div>
                        <p>{msg.analysis.uncertainties.join(' ')}</p>
                      </div>
                    )}

                    {/* Message Actions */}
                    <div className="swiss-border-t pt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-neutral-600">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyMessage(msg)}
                          className="flex items-center gap-1 px-2.5 py-1 swiss-border hover:bg-neutral-100 transition cursor-pointer"
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
                          <span>Lihat Format Laporan Lengkap</span>
                          <span>→</span>
                        </button>
                      )}
                    </div>

                    {/* Suggested Follow-ups */}
                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="pt-2 border-t border-dashed border-neutral-200 space-y-2">
                        <span className="editorial-meta text-neutral-500 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3 text-blue-600" />
                          PERTANYAAN LANJUTAN YANG SERING DIAJUKAN:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {msg.suggestedFollowUps.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(q)}
                              className="text-xs font-mono px-3 py-1.5 bg-[#fbfbfa] swiss-border hover:bg-neutral-900 hover:text-white transition cursor-pointer text-left"
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

        {/* Loading Indicator in Chat */}
        {isLoading && (
          <div className="max-w-2xl">
            <EditorialLoader />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Bottom Chat Input */}
      <div className="p-4 sm:p-5 bg-white swiss-border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="space-y-3"
        >
          <div className="relative flex items-center">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={2}
              placeholder="Tanyakan persoalan hukum Indonesia Anda di sini... (Tekan Enter untuk kirim)"
              className="w-full pl-4 pr-24 py-3 bg-[#fbfbfa] swiss-border text-sm font-mono focus:outline-none focus:bg-white focus:ring-1 focus:ring-black resize-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2.5 px-4 py-2 bg-[#111215] text-white hover:bg-[#c2410c] disabled:opacity-40 disabled:cursor-not-allowed transition font-mono uppercase text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Kirim</span>
              <Send className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>💡 AI berbasis korpus JDIH resmi Indonesia & Gemini 2.5 Flash</span>
            <span className="hidden sm:inline">Shift + Enter untuk baris baru</span>
          </div>
        </form>
      </div>
    </div>
  );
}
