"use client";

import React, { useState } from "react";
import { VoteSummaryBar } from "./VoteSummaryBar";
import { LikertScale } from "./LikertScale";
import { handleShare } from "./MeasureCard";

interface MeasureInteractionProps {
  measureId: string;
  summary: any;
  measureTitle?: string;
}

export function MeasureInteraction({ measureId, summary, measureTitle }: MeasureInteractionProps) {
  const [showVotes, setShowVotes] = useState(false);

  return (
    <div className="px-2 mt-1 mb-2">
      {/* Discreet Share Button just above Likert Scale */}
      <div className="flex justify-end pr-2 mb-1">
        <button
          onClick={() => handleShare(measureTitle || "Mesure Législative", window.location.href)}
          className="text-[10px] text-white/50 hover:text-white/80 transition-colors flex items-center gap-1 py-1"
          aria-label="Partager"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[10px] h-[10px] translate-y-[-1px]">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          Partager
        </button>
      </div>

      <div className="flex items-start justify-between gap-4">
        {/* Toggle Votes Button (1/3) */}
        <button
          onClick={() => setShowVotes(!showVotes)}
          className="w-1/3 py-2 px-3 mt-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white/90 active:scale-95 transition-transform shadow-sm"
        >
          {showVotes ? "Masquer" : "Résultats"}
        </button>

        {/* Likert Scale (2/3) */}
        <div className="w-2/3">
          <LikertScale measureId={measureId} compact={true} />
        </div>
      </div>

      {/* Expandable Vote Summary - Placed BELOW so it doesn't push the layout up and cover the text */}
      {showVotes && (
        <div className="mt-4 pb-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <VoteSummaryBar summary={summary} />
        </div>
      )}
    </div>
  );
}
