"use client";

// ============================================================
// Legit — VoteSummaryBar
// Horizontal bar chart showing vote distribution
// ============================================================

import React from "react";
import { MeasureVoteSummary } from "@/types/database";

interface VoteSummaryBarProps {
  summary: MeasureVoteSummary | undefined;
}

export function VoteSummaryBar({ summary }: VoteSummaryBarProps) {
  if (!summary || summary.total_votes === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-[11px] text-gray-400">
          Soyez le premier à donner votre avis
        </p>
      </div>
    );
  }

  const { total_votes, positive_votes, negative_votes, neutral_votes, average_score } =
    summary;

  const positivePercent = Math.round((positive_votes / total_votes) * 100);
  const neutralPercent = Math.round((neutral_votes / total_votes) * 100);
  const negativePercent = Math.round((negative_votes / total_votes) * 100);

  return (
    <div className="px-5 py-2">
      {/* Score & count */}
      <div className="flex items-center justify-between mb-1.5 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-gray-900 leading-none">
            {average_score.toFixed(1)}
          </span>
          <span className="text-[10px] text-gray-400 font-medium leading-none">/5</span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">
          {total_votes.toLocaleString("fr-BE")} votes
        </span>
      </div>

      {/* Bar */}
      <div className="flex h-[4px] rounded-full overflow-hidden bg-gray-200 gap-px">
        {negativePercent > 0 && (
          <div
            className="bg-red-500/80 rounded-l-full bar-animate"
            style={{ width: `${negativePercent}%` }}
          />
        )}
        {neutralPercent > 0 && (
          <div
            className="bg-gray-400/60 bar-animate"
            style={{ width: `${neutralPercent}%` }}
          />
        )}
        {positivePercent > 0 && (
          <div
            className="bg-green-500/80 rounded-r-full bar-animate"
            style={{ width: `${positivePercent}%` }}
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-1 px-1">
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-gray-400 font-medium">Contre</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-gray-400 font-medium">Pour</span>
        </div>
      </div>
    </div>
  );
}
