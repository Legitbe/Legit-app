"use client";

// ============================================================
// Legit — LikertScale
// 5-button anonymous vote widget (Totalement Contre → Totalement Pour)
// ============================================================

import React, { useState, useCallback, useEffect } from "react";
import { submitVote } from "@/app/actions/vote";
import { getDeviceFingerprint } from "@/lib/fingerprint";
import { LIKERT_OPTIONS } from "@/lib/constants";
import type { LikertValue } from "@/types/database";

interface LikertScaleProps {
  measureId: string;
  compact?: boolean;
}

export function LikertScale({ measureId, compact }: LikertScaleProps) {
  const [selectedValue, setSelectedValue] = useState<LikertValue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Check for existing vote on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(`legit_vote_${measureId}`);
    if (stored) {
      setSelectedValue(parseInt(stored) as LikertValue);
      setHasVoted(true);
    }
  }, [measureId]);

  const handleVote = useCallback(
    async (value: LikertValue) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      setSelectedValue(value);

      try {
        const deviceFingerprint = getDeviceFingerprint();
        const result = await submitVote({
          measureId,
          deviceFingerprint,
          voteValue: value,
        });

        if (result.success) {
          // Persist vote locally
          localStorage.setItem(`legit_vote_${measureId}`, value.toString());
          setHasVoted(true);
          setShowConfirmation(true);
          setTimeout(() => setShowConfirmation(false), 2000);
        }
      } catch (err) {
        console.error("Vote error:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [measureId, isSubmitting]
  );

  return (
    <div className="py-1 relative">

      {/* Likert buttons */}
      <div className="flex items-center justify-between w-full relative">
        <div className="flex items-center justify-between flex-1 max-w-full px-1">
          {LIKERT_OPTIONS.map((option) => {
            const isSelected = selectedValue === option.value;
            // Only show word labels for the first and last options
            const labelWord = option.value === 1 ? "Contre" : option.value === 5 ? "Pour" : null;

            return (
              <button
                key={option.value}
                onClick={() => handleVote(option.value)}
                disabled={isSubmitting}
                className={`likert-btn relative flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-200
                  ${
                    isSelected
                      ? `${option.activeColor} shadow-sm border border-transparent`
                      : "hover:bg-gray-100/80 border border-transparent hover:border-gray-200"
                  }
                  ${isSubmitting ? "opacity-50 pointer-events-none" : ""}
                `}
                aria-label={option.label}
                title={option.label}
              >
                <span className="text-[22px] leading-none mb-0.5">{option.emoji}</span>
                {labelWord && !compact && (
                  <span
                    className={`text-[9px] font-bold mt-0.5 ${
                      isSelected ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {labelWord}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
