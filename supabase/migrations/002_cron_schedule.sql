-- ============================================================
-- Legit — CRON Schedule for Edge Functions
-- Run this in your Supabase SQL Editor AFTER deploying the
-- Edge Functions via Supabase Dashboard.
-- ============================================================

-- Enable pg_cron extension (already enabled on most Supabase projects)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ──────────────────────────────────────────────────────────────
-- Job 1: ingest-laws (Scraper)
-- Runs every 15 minutes. Fetches new documents from the
-- Belgian Parliament API and inserts them into pending_queue.
-- Does NOT call Gemini or Unsplash.
-- ──────────────────────────────────────────────────────────────
SELECT cron.schedule(
  'ingest-laws-scraper',        -- Job name
  '*/15 * * * *',               -- Every 15 minutes
  $$
  SELECT net.http_post(
    url := 'https://vwozusfxwhmkmijdrmja.supabase.co/functions/v1/ingest-laws',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b3p1c2Z4d2hta21pamRybWphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTY0MDI0MiwiZXhwIjoyMDkxMjE2MjQyfQ.8DINa-2xgc13RdgAMcKy40-V7ys2r8RSWb69qreQB7Y',
      'Content-Type', 'application/json'
    )
  );
  $$
);

-- ──────────────────────────────────────────────────────────────
-- Job 2: process-batch-queue (AI Processor)
-- Runs every 15 minutes OFFSET by 5 minutes from the scraper.
-- Picks 5 oldest 'pending' items and processes them with
-- Gemini + Unsplash, respecting all API quotas.
--
-- QUOTA MATH (per hour):
--   - 4 runs × 5 items = 20 Gemini calls (limit: 60/hour = 15 RPM)
--   - 4 runs × 5 items = 20 Unsplash calls (limit: 50/hour)
--   - Each run ~30-45s execution (well under Edge Function timeout)
-- ──────────────────────────────────────────────────────────────
SELECT cron.schedule(
  'process-batch-queue',        -- Job name
  '5,20,35,50 * * * *',        -- At :05, :20, :35, :50 (offset from scraper)
  $$
  SELECT net.http_post(
    url := 'https://vwozusfxwhmkmijdrmja.supabase.co/functions/v1/process-batch-queue',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b3p1c2Z4d2hta21pamRybWphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTY0MDI0MiwiZXhwIjoyMDkxMjE2MjQyfQ.8DINa-2xgc13RdgAMcKy40-V7ys2r8RSWb69qreQB7Y',
      'Content-Type', 'application/json'
    )
  );
  $$
);

-- ──────────────────────────────────────────────────────────────
-- To verify your CRON jobs:
-- SELECT * FROM cron.job;
--
-- To see execution history:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;
--
-- To delete a job:
-- SELECT cron.unschedule('ingest-laws-scraper');
-- SELECT cron.unschedule('process-batch-queue');
-- ──────────────────────────────────────────────────────────────
