"use client";

import React, { useState } from "react";
import { VoteSummaryBar } from "./VoteSummaryBar";
import { LikertScale } from "./LikertScale";

interface MeasureInteractionProps {
  measureId: string;
  summary: any;
}

export function MeasureInteraction({ measureId, summary }: MeasureInteractionProps) {
  const [showVotes, setShowVotes] = useState(false);

  return (
    <div className="px-2 mt-1 mb-2">
      {/* Expandable Vote Summary */}
      {showVotes && (
        <div className="mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <VoteSummaryBar summary={summary} />
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        {/* Toggle Votes Button (1/3) */}
        <button
          onClick={() => setShowVotes(!showVotes)}
          className="w-1/3 py-2 px-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white active:scale-95 transition-transform"
        >
          {showVotes ? "Masquer" : "Résultats"}
        </button>

        {/* Likert Scale (2/3) */}
        <div className="w-2/3">
          <LikertScale measureId={measureId} compact={true} />
        </div>
      </div>
    </div>
  );
}
