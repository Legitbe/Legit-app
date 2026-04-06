// ============================================================
// Legit — Supabase Edge Function: ingest-laws
// Orchestrates the full pipeline:
//   1. Fetch from Belgian Chamber API (data.dekamer.be)
//   2. Process through Gemini AI (NLP summarization)
//   3. Enrich with Unsplash images
//   4. Validate with Zod
//   5. Store in Supabase
//
// Triggered via pg_cron (hourly).
// ============================================================

// @ts-nocheck — Deno environment, not Node.js
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3";

// ─── Configuration ───────────────────────────────────────────

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const UNSPLASH_ACCESS_KEY = Deno.env.get("UNSPLASH_ACCESS_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Rate limiting: 5 seconds between Gemini calls
const GEMINI_DELAY_MS = 5_000;

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

// ─── Tag Inference (simple keyword matching) ─────────────────

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

// ─── Helpers ─────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Phase 1: Fetch from Chamber API ─────────────────────────

interface RawDocument {
  chamber_doc_id: string;
  title: string;
  raw_text: string;
}

async function fetchNewDocuments(): Promise<RawDocument[]> {
  // TODO: Replace with actual data.dekamer.be API call when FLWB endpoint is available
  // For now, this function returns an empty array.
  // In production, this would:
  //   1. fetch("https://data.dekamer.be/v0/flwb?legid=55&lang=fr")
  //   2. Parse XML response
  //   3. Extract chamber_doc_id, title, raw_text
  //   4. Filter out documents already in the measures table
  console.log("[Ingest] Phase 1: Checking for new documents...");

  // Check existing documents to avoid duplicates
  const { data: existing } = await supabaseAdmin
    .from("measures")
    .select("chamber_doc_id");

  const existingIds = new Set((existing ?? []).map((m: { chamber_doc_id: string }) => m.chamber_doc_id));

  // Placeholder: no new documents from mock source
  const newDocs: RawDocument[] = [];

  console.log(`[Ingest] Found ${newDocs.length} new documents (${existingIds.size} already in DB)`);
  return newDocs;
}

// ─── Phase 2: Gemini NLP Pipeline ────────────────────────────

async function summarizeWithGemini(rawText: string): Promise<z.infer<typeof GeminiResponseSchema> | null> {
  const systemPrompt = `Tu es un analyste juridique neutre. Résume ce texte de loi belge en un tableau JSON strict contenant exactement 3 objets (les slides). Slide 1: Le problème initial. Slide 2: Le mécanisme de la solution. Slide 3: L'impact concret. Contrainte absolue : Dans chaque slide, identifie exactement 2 mots-clés ou concepts techniques majeurs et entoure-les des balises <legit-gradient> et </legit-gradient>. Ne génère aucun texte en dehors du JSON.`;

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

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

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

    // Validate with Zod (anti-hallucination)
    const result = GeminiResponseSchema.safeParse(parsed);
    if (!result.success) {
      console.error("[Gemini] Zod validation failed:", result.error.issues);
      return null;
    }

    return result.data;
  } catch (err) {
    console.error("[Gemini] Error:", err);
    return null;
  }
}

// ─── Phase 3: Unsplash Image Enrichment ──────────────────────

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

    if (!response.ok) return null;

    const data = await response.json();
    return data.results?.[0]?.urls?.regular ?? null;
  } catch {
    return null;
  }
}

// ─── Phase 4 & 5: Validate + Store ──────────────────────────

async function processDocument(doc: RawDocument): Promise<boolean> {
  console.log(`[Process] Processing: ${doc.chamber_doc_id}`);

  const tag = inferTag(doc.raw_text);

  // Insert measure (idempotent: ON CONFLICT DO NOTHING)
  const { data: measure, error: measureError } = await supabaseAdmin
    .from("measures")
    .upsert(
      {
        chamber_doc_id: doc.chamber_doc_id,
        tag_id: tag,
        title: doc.title,
        raw_text: doc.raw_text,
        status: "pending",
      },
      { onConflict: "chamber_doc_id" }
    )
    .select()
    .single();

  if (measureError || !measure) {
    console.error("[DB] Measure insert error:", measureError);
    return false;
  }

  // Phase 2: Gemini NLP
  const slides = await summarizeWithGemini(doc.raw_text);
  if (!slides) {
    await supabaseAdmin
      .from("measures")
      .update({ status: "failed" })
      .eq("id", measure.id);
    return false;
  }

  // Phase 3: Unsplash images
  const imageUrl = await getUnsplashImage(tag);

  // Phase 4 & 5: Insert slides
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
    return false;
  }

  // Mark as processed
  await supabaseAdmin
    .from("measures")
    .update({ status: "processed" })
    .eq("id", measure.id);

  console.log(`[Process] Successfully processed: ${doc.chamber_doc_id}`);
  return true;
}

// ─── Main Handler ────────────────────────────────────────────

serve(async (req) => {
  try {
    console.log("[Ingest] Starting ingestion pipeline...");

    // Phase 1: Fetch new documents
    const newDocs = await fetchNewDocuments();

    if (newDocs.length === 0) {
      return new Response(
        JSON.stringify({ message: "No new documents to process.", processed: 0 }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    let processed = 0;
    let failed = 0;

    for (const doc of newDocs) {
      const success = await processDocument(doc);
      if (success) processed++;
      else failed++;

      // Rate limiting: 5s between Gemini calls
      if (newDocs.indexOf(doc) < newDocs.length - 1) {
        await sleep(GEMINI_DELAY_MS);
      }
    }

    console.log(`[Ingest] Done. Processed: ${processed}, Failed: ${failed}`);

    return new Response(
      JSON.stringify({ message: "Ingestion complete.", processed, failed }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[Ingest] Fatal error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error during ingestion." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
