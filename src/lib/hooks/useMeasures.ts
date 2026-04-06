"use client";

// ============================================================
// Legit — SWR Hook for Measures
// Fetches measures from Supabase (or mock data in dev mode).
// Polls every 5 minutes for silent background updates.
// ============================================================

import useSWR from "swr";
import { MeasureWithSlides } from "@/types/database";
import { SWR_REFRESH_INTERVAL } from "@/lib/constants";
import { getMockMeasures } from "@/lib/mock-data";
import { getSupabaseClient } from "@/lib/supabase/client";

async function fetchMeasures(): Promise<MeasureWithSlides[]> {
  const supabase = getSupabaseClient();

  // If Supabase is not configured, use mock data
  if (!supabase) {
    return getMockMeasures();
  }

  // Fetch measures with slides from Supabase
  const { data: measures, error } = await supabase
    .from("measures")
    .select(
      `
      *,
      measure_slides (*)
    `
    )
    .eq("status", "processed")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching measures:", error);
    throw error;
  }

  // Fetch vote summaries
  const { data: voteSummaries } = await supabase
    .from("measure_vote_summary")
    .select("*");

  // Merge vote summaries into measures
  const voteSummaryMap = new Map(
    (voteSummaries ?? []).map((vs) => [vs.measure_id, vs])
  );

  return (measures ?? []).map((m) => ({
    ...m,
    measure_slides: (m.measure_slides ?? []).sort(
      (a: { slide_order: number }, b: { slide_order: number }) =>
        a.slide_order - b.slide_order
    ),
    vote_summary: voteSummaryMap.get(m.id) ?? undefined,
  }));
}

export function useMeasures() {
  const { data, error, isLoading, mutate } = useSWR<MeasureWithSlides[]>(
    "measures",
    fetchMeasures,
    {
      refreshInterval: SWR_REFRESH_INTERVAL,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    }
  );

  return {
    measures: data ?? [],
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}
