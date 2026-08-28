'use client';

import React, { useState } from 'react';
import LegalChatInterface from '@/components/LegalChatInterface';
import AnalysisView from '@/components/AnalysisView';
import { CaseAnalysis } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

export default function HomePage() {
  const [documentAnalysis, setDocumentAnalysis] = useState<CaseAnalysis | null>(null);

  const handleSwitchToDoc = (analysis: CaseAnalysis) => {
    setDocumentAnalysis(analysis);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between">
      {documentAnalysis ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <button
            onClick={() => setDocumentAnalysis(null)}
            className="flex items-center gap-2 px-4 py-2 bg-white swiss-border text-xs font-mono uppercase font-bold text-neutral-800 hover:bg-neutral-100 transition rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Mode Chat AI</span>
          </button>
          
          <AnalysisView 
            analysis={documentAnalysis} 
            onReset={() => setDocumentAnalysis(null)} 
          />
        </div>
      ) : (
        <LegalChatInterface onSwitchToDocumentView={handleSwitchToDoc} />
      )}
    </div>
  );
}
