-- ============================================================
-- Legit — Initial Database Schema
-- 3 tables: measures, measure_slides, votes
-- + aggregation view for vote summaries
-- ============================================================

-- Table 1: Measures (Les Lois)
CREATE TABLE IF NOT EXISTS measures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chamber_doc_id TEXT UNIQUE NOT NULL,
  tag_id TEXT NOT NULL DEFAULT 'general',
  title TEXT,
  raw_text TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 2: Measure Slides (Le Contenu Séquencé)
CREATE TABLE IF NOT EXISTS measure_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  measure_id UUID NOT NULL REFERENCES measures(id) ON DELETE CASCADE,
  slide_order INTEGER NOT NULL CHECK (slide_order BETWEEN 1 AND 3),
  content_html TEXT NOT NULL,
  unsplash_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (measure_id, slide_order)
);

-- Table 3: Votes (Le Baromètre Anonyme)
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  measure_id UUID NOT NULL REFERENCES measures(id),
  device_fingerprint TEXT NOT NULL,
  vote_value INTEGER NOT NULL CHECK (vote_value BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Anti-stuffing: one device = one vote per measure
  UNIQUE (measure_id, device_fingerprint)
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE measures ENABLE ROW LEVEL SECURITY;
ALTER TABLE measure_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Public read access for measures and slides
CREATE POLICY "Public read measures"
  ON measures FOR SELECT
  USING (true);

CREATE POLICY "Public read slides"
  ON measure_slides FOR SELECT
  USING (true);

-- Public read/insert/update for votes (anonymous voting)
CREATE POLICY "Public read votes"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Public insert votes"
  ON votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update own votes"
  ON votes FOR UPDATE
  USING (true);

-- ============================================================
-- Aggregation View for Vote Summaries
-- ============================================================

CREATE OR REPLACE VIEW measure_vote_summary AS
SELECT
  measure_id,
  COUNT(*)::integer AS total_votes,
  ROUND(AVG(vote_value)::numeric, 2) AS average_score,
  COUNT(*) FILTER (WHERE vote_value >= 4)::integer AS positive_votes,
  COUNT(*) FILTER (WHERE vote_value <= 2)::integer AS negative_votes,
  COUNT(*) FILTER (WHERE vote_value = 3)::integer AS neutral_votes
FROM votes
GROUP BY measure_id;

-- ============================================================
-- Indexes for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_measures_status ON measures(status);
CREATE INDEX IF NOT EXISTS idx_measures_created_at ON measures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_slides_measure_id ON measure_slides(measure_id);
CREATE INDEX IF NOT EXISTS idx_votes_measure_id ON votes(measure_id);
CREATE INDEX IF NOT EXISTS idx_votes_fingerprint ON votes(device_fingerprint);
