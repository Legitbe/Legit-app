// ============================================================
// Legit — Supabase Edge Function: process-batch-queue
// ROLE: Batch Processor — Takes the 5 oldest 'pending' items
//       from pending_queue and processes them sequentially:
//       1. Gemini AI summarization
//       2. Unsplash image enrichment
//       3. Insert into measures + measure_slides
//
// QUOTA SAFETY:
//   - Max 5 items per run (CRON every 15 min = 20/hour max)
//   - 5s delay between each item → 1 item/5s = 12 RPM (Gemini limit: 15)
//   - 5 Unsplash calls per run → 20/hour (Unsplash limit: 50)
//   - Total execution ~30-45s (Edge Function timeout: 60s+)
//
// Triggered via pg_cron (every 15 minutes).
// ============================================================

// @ts-nocheck — Deno environment, not Node.js
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3";

// ─── Configuration ───────────────────────────────────────────

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "AIzaSyArzs1os6TI3Z8UMRuzDwLGb8roYeSKCqs";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://vwozusfxwhmkmijdrmja.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b3p1c2Z4d2hta21pamRybWphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTY0MDI0MiwiZXhwIjoyMDkxMjE2MjQyfQ.8DINa-2xgc13RdgAMcKy40-V7ys2r8RSWb69qreQB7Y";
const UNSPLASH_ACCESS_KEY = Deno.env.get("UNSPLASH_ACCESS_KEY") || "KspQ6sMYzXPkeaL2y4owY2DEMfD7By50T38mup_lXY0";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Strict rate limits
const BATCH_SIZE = 5;           // Max 5 items per CRON run
const INTER_ITEM_DELAY_MS = 5000; // 5 seconds between each item

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Zod Schema for Gemini Response ──────────────────────────

const SlideSchema = z.object({
  slide_order: z.number().int().min(1).max(3),
  content_html: z
    .string()
    .min(50)
    .refine(
      (val) => {
        const matches = val.match(/<legit-gradient>.*?<\/legit-gradient>/g);
        return matches !== null && matches.length === 2;
      },
      { message: "Each slide must contain exactly 2 <legit-gradient> tags." }
    ),
});

const GeminiResponseSchema = z.array(SlideSchema).length(3);

// ─── Tag Inference ───────────────────────────────────────────

function inferTag(text: string): string {
  const lower = text.toLowerCase();
  const tagKeywords: Record<string, string[]> = {
    mobilite: ["transport", "mobilité", "vélo", "voiture", "route", "trafic", "SNCB"],
    fiscalite: ["impôt", "taxe", "fiscal", "TVA", "budget", "dette"],
    sante: ["santé", "hôpital", "médecin", "patient", "maladie", "soin"],
    education: ["école", "enseignement", "éducation", "élève", "université"],
    environnement: ["climat", "environnement", "émission", "pollution", "énergie"],
    securite: ["police", "sécurité", "justice", "prison", "criminalité"],
    economie: ["économie", "emploi", "entreprise", "PIB", "croissance"],
    justice: ["tribunal", "magistrat", "procureur", "droit", "loi pénale"],
  };
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return tag;
    }
  }
  return "general";
}

// ─── Gemini NLP Pipeline ─────────────────────────────────────

async function summarizeWithGemini(rawText: string): Promise<z.infer<typeof GeminiResponseSchema> | null> {
  const systemPrompt = `Tu es un analyste juridique neutre. Analyse ce document législatif belge. Génère un JSON de 3 slides (Slide 1: Le problème initial, Slide 2: Le mécanisme de la solution, Slide 3: L'impact concret). Pour chaque slide, identifie exactement 2 mots-clés essentiels ou concepts techniques majeurs et entoure-les des balises <legit-gradient>...</legit-gradient>. Ton ton doit être absolument neutre et factuel. Ne génère aucun texte en dehors du JSON.`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: `Texte de loi :\n\n${rawText}` },
        ],
      },
    ],
    generationConfig: {
      response_mime_type: "application/json",
      temperature: 0.3,
      maxOutputTokens: 2048,
    },
  };

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (response.status === 429) {
    console.error("[Gemini] 429 — Quota exceeded");
    throw new Error("RATE_LIMIT_429");
  }

  if (!response.ok) {
    console.error(`[Gemini] HTTP ${response.status}: ${await response.text()}`);
    return null;
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error("[Gemini] No text in response");
    return null;
  }

  const parsed = JSON.parse(text);
  const result = GeminiResponseSchema.safeParse(parsed);
  if (!result.success) {
    console.error("[Gemini] Zod validation failed:", result.error.issues);
    return null;
  }

  return result.data;
}

// ─── Unsplash Image Enrichment ───────────────────────────────

async function getUnsplashImage(tag: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) return null;

  try {
    const query = encodeURIComponent(tag);
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&orientation=portrait&per_page=1`,
      {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      }
    );

    if (!response.ok) {
      console.warn(`[Unsplash] HTTP ${response.status} for tag "${tag}"`);
      return null;
    }

    const data = await response.json();
    return data.results?.[0]?.urls?.regular ?? null;
  } catch {
    return null;
  }
}

// ─── Process a single queue item ─────────────────────────────

async function processQueueItem(item: any): Promise<boolean> {
  const sourceId = item.source_id;
  const rawText = item.raw_text || "";
  const title = item.title || "Proposition de loi";

  console.log(`[Batch] Processing queue item: ${sourceId}`);

  // Mark as 'processing'
  await supabaseAdmin
    .from("pending_queue")
    .update({ status: "processing" })
    .eq("id", item.id);

  const tag = inferTag(rawText);

  // ── Gemini AI ──────────────────────────────────────────────
  const slides = await summarizeWithGemini(rawText);
  if (!slides) {
    await markFailed(item.id, item.retry_count, "Gemini returned null or failed validation");
    return false;
  }

  // ── Unsplash Image ─────────────────────────────────────────
  const imageUrl = await getUnsplashImage(tag);

  // ── Insert into measures ───────────────────────────────────
  const { data: measure, error: measureError } = await supabaseAdmin
    .from("measures")
    .upsert(
      {
        chamber_doc_id: sourceId,
        tag_id: tag,
        title: title,
        raw_text: rawText,
        status: "processed",
      },
      { onConflict: "chamber_doc_id" }
    )
    .select()
    .single();

  if (measureError || !measure) {
    console.error("[DB] Measure insert error:", measureError);
    await markFailed(item.id, item.retry_count, `DB Measure error: ${measureError?.message}`);
    return false;
  }

  // ── Insert slides ──────────────────────────────────────────
  const slideInserts = slides.map((slide) => ({
    measure_id: measure.id,
    slide_order: slide.slide_order,
    content_html: slide.content_html,
    unsplash_image_url: imageUrl,
  }));

  const { error: slidesError } = await supabaseAdmin
    .from("measure_slides")
    .upsert(slideInserts, { onConflict: "measure_id,slide_order" });

  if (slidesError) {
    console.error("[DB] Slides insert error:", slidesError);
    await markFailed(item.id, item.retry_count, `DB Slides error: ${slidesError?.message}`);
    return false;
  }

  // ── Mark queue item as completed ───────────────────────────
  await supabaseAdmin
    .from("pending_queue")
    .update({ status: "completed" })
    .eq("id", item.id);

  console.log(`[Batch] Successfully processed: ${sourceId}`);
  return true;
}

// ─── Mark a queue item as failed ─────────────────────────────

async function markFailed(queueId: string, currentRetry: number, reason: string) {
  await supabaseAdmin
    .from("pending_queue")
    .update({
      status: "failed",
      retry_count: currentRetry + 1,
    })
    .eq("id", queueId);

  // Also log in ingestion_logs for audit trail
  await supabaseAdmin.from("ingestion_logs").insert({
    chamber_doc_id: queueId,
    error_message: reason,
    status: "failed",
  });
}

// ─── Main Handler ────────────────────────────────────────────

serve(async (_req) => {
  try {
    console.log(`[Batch] Starting batch processor (max ${BATCH_SIZE} items)...`);

    // Fetch the 5 oldest pending items
    const { data: pendingItems, error: fetchError } = await supabaseAdmin
      .from("pending_queue")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(BATCH_SIZE);

    if (fetchError) {
      console.error("[Batch] Failed to fetch queue:", fetchError);
      return jsonResponse({ error: "Failed to fetch pending queue." }, 500);
    }

    if (!pendingItems || pendingItems.length === 0) {
      console.log("[Batch] Queue is empty. Nothing to process.");
      return jsonResponse({ message: "Queue empty.", processed: 0, failed: 0 });
    }

    console.log(`[Batch] Found ${pendingItems.length} items in queue.`);

    let processed = 0;
    let failed = 0;

    // STRICT sequential for...of — NO Promise.all()
    for (const item of pendingItems) {
      try {
        const success = await processQueueItem(item);
        if (success) processed++;
        else failed++;
      } catch (err: any) {
        if (err.message === "RATE_LIMIT_429") {
          console.error(`[Batch] ABORT — Gemini 429 on item ${item.source_id}. Halting entire batch.`);

          await supabaseAdmin.from("ingestion_logs").insert({
            chamber_doc_id: item.source_id,
            error_message: "Gemini 429 Too Many Requests — Pipeline halted",
            status: "aborted",
          });

          // Revert item to pending so it can be retried next run
          await supabaseAdmin
            .from("pending_queue")
            .update({ status: "pending" })
            .eq("id", item.id);

          return jsonResponse(
            { error: "Gemini API Quota Exceeded. Pipeline securely halted.", processed, failed },
            429
          );
        }

        // Unknown error
        failed++;
        await markFailed(item.id, item.retry_count, `Unexpected: ${err.message}`);
      }

      // ── MANDATORY 5-second delay between items ─────────────
      // Guarantees max 12 RPM (under Gemini's 15 RPM limit)
      // + max 12 Unsplash calls/min (under 50/hour limit)
      await delay(INTER_ITEM_DELAY_MS);
    }

    console.log(`[Batch] Completed. Processed: ${processed}, Failed: ${failed}`);

    return jsonResponse({
      message: "Batch processing complete.",
      processed,
      failed,
      remaining_in_queue: "check pending_queue WHERE status = 'pending'",
    });
  } catch (err) {
    console.error("[Batch] Fatal error:", err);
    return jsonResponse({ error: "Internal error during batch processing." }, 500);
  }
});

// ─── Utility ─────────────────────────────────────────────────

function jsonResponse(body: Record<string, any>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
