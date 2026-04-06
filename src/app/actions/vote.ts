"use server";

// ============================================================
// Legit — Vote Server Action
// Handles anonymous UPSERT votes.
// Falls back to in-memory mock store when Supabase is not configured.
// ============================================================

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { submitMockVote } from "@/lib/mock-data";

interface VotePayload {
  measureId: string;
  deviceFingerprint: string;
  voteValue: number;
}

export async function submitVote(
  payload: VotePayload
): Promise<{ success: boolean; error?: string }> {
  const { measureId, deviceFingerprint, voteValue } = payload;

  // Validate input
  if (!measureId || !deviceFingerprint) {
    return { success: false, error: "Paramètres manquants." };
  }
  if (voteValue < 1 || voteValue > 5 || !Number.isInteger(voteValue)) {
    return { success: false, error: "Valeur de vote invalide." };
  }

  const supabase = getSupabaseServerClient();

  // Mock mode: no Supabase configured
  if (!supabase) {
    return submitMockVote(measureId, deviceFingerprint, voteValue);
  }

  // Real Supabase UPSERT
  // ON CONFLICT (measure_id, device_fingerprint) DO UPDATE SET vote_value
  const { error } = await supabase.from("votes").upsert(
    {
      measure_id: measureId,
      device_fingerprint: deviceFingerprint,
      vote_value: voteValue,
    },
    {
      onConflict: "measure_id,device_fingerprint",
    }
  );

  if (error) {
    console.error("Vote upsert error:", error);
    return { success: false, error: "Erreur lors de l'enregistrement du vote." };
  }

  return { success: true };
}
