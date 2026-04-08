// ============================================================
// Legit — Supabase Edge Function: ingest-laws
// ROLE: Scraper ONLY — Fetches new documents from the Belgian
//       Parliament API and inserts them into the pending_queue.
//       Does NOT call Gemini or Unsplash.
//
// Triggered via pg_cron (every 15 minutes) or manual invocation.
// ============================================================

// @ts-nocheck — Deno environment, not Node.js
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── Configuration ───────────────────────────────────────────

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://vwozusfxwhmkmijdrmja.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b3p1c2Z4d2hta21pamRybWphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTY0MDI0MiwiZXhwIjoyMDkxMjE2MjQyfQ.8DINa-2xgc13RdgAMcKy40-V7ys2r8RSWb69qreQB7Y";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Max items to queue per run (hard cap at 10/hour)
const MAX_QUEUE_PER_RUN = 10;

// ─── Main Handler ────────────────────────────────────────────

serve(async (_req) => {
  try {
    console.log("[Ingest] Starting scraper (queue-only mode)...");

    // ── Step 1: Fetch from Primary API ───────────────────────
    let apiDocs: any[] = [];
    try {
      const res = await fetch("https://parlement.thundr.be/index.json");
      if (!res.ok) {
        console.warn(`[Ingest] Primary API returned ${res.status}. Aborting.`);
        return jsonResponse({ message: "Primary API unavailable.", queued: 0 });
      }
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        apiDocs = data;
      } else {
        console.warn("[Ingest] Primary API returned empty data.");
        return jsonResponse({ message: "No data from API.", queued: 0 });
      }
    } catch (err) {
      console.error("[Ingest] Failed to fetch primary API:", err);
      return jsonResponse({ error: "Failed to fetch primary API." }, 500);
    }

    // ── Step 2: Check existing items (DB + Queue dedup) ──────
    const [{ data: existingMeasures }, { data: existingQueue }] = await Promise.all([
      supabaseAdmin.from("measures").select("chamber_doc_id"),
      supabaseAdmin.from("pending_queue").select("source_id"),
    ]);

    const existingIds = new Set([
      ...(existingMeasures ?? []).map((m: any) => m.chamber_doc_id),
      ...(existingQueue ?? []).map((q: any) => q.source_id),
    ]);

    // ── Step 3: Filter and limit new documents ───────────────
    const newDocs: { source_id: string; title: string; raw_text: string; source_url: string | null }[] = [];

    for (const doc of apiDocs) {
      if (newDocs.length >= MAX_QUEUE_PER_RUN) break;

      const docId = doc.id || doc.chamber_doc_id || doc.reference;
      if (!docId || existingIds.has(docId)) continue;

      newDocs.push({
        source_id: docId,
        title: doc.title || "Proposition de loi",
        raw_text: doc.text || doc.content || doc.description || JSON.stringify(doc),
        source_url: doc.url || doc.pdf_url || null,
      });
    }

    if (newDocs.length === 0) {
      console.log("[Ingest] No new documents to queue.");
      return jsonResponse({ message: "No new documents to queue.", queued: 0 });
    }

    // ── Step 4: UPSERT into pending_queue with status 'pending' ──
    const queueInserts = newDocs.map((d) => ({
      source_id: d.source_id,
      source_url: d.source_url,
      title: d.title,
      raw_text: d.raw_text,
      status: "pending",
      retry_count: 0,
    }));

    const { error: insertError, count } = await supabaseAdmin
      .from("pending_queue")
      .upsert(queueInserts, { onConflict: "source_id", ignoreDuplicates: true });

    if (insertError) {
      console.error("[Ingest] Queue insert error:", insertError);
      return jsonResponse({ error: "Failed to insert into queue." }, 500);
    }

    console.log(`[Ingest] Queued ${newDocs.length} new documents for batch processing.`);

    return jsonResponse({
      message: "Scraping complete. Documents queued for processing.",
      queued: newDocs.length,
    });
  } catch (err) {
    console.error("[Ingest] Fatal error:", err);
    return jsonResponse({ error: "Internal error during ingestion." }, 500);
  }
});

// ─── Utility ─────────────────────────────────────────────────

function jsonResponse(body: Record<string, any>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
