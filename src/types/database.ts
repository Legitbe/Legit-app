// ============================================================
// Legit — TypeScript Database Interfaces
// Mirrors the Supabase PostgreSQL schema (3 tables + 1 view)
// ============================================================

export interface Measure {
  id: string;
  chamber_doc_id: string;
  tag_id: string;
  title: string | null;
  raw_text: string | null;
  status: 'pending' | 'processed' | 'failed';
  created_at: string;
}

export interface MeasureSlide {
  id: string;
  measure_id: string;
  slide_order: number;
  content_html: string;
  unsplash_image_url: string | null;
  created_at: string;
}

export interface Vote {
  id: string;
  measure_id: string;
  device_fingerprint: string;
  vote_value: 1 | 2 | 3 | 4 | 5;
  created_at: string;
}

export interface MeasureVoteSummary {
  measure_id: string;
  total_votes: number;
  average_score: number;
  positive_votes: number;
  negative_votes: number;
  neutral_votes: number;
}

export interface MeasureWithSlides extends Measure {
  measure_slides: MeasureSlide[];
  vote_summary?: MeasureVoteSummary;
}

// Likert scale type
export type LikertValue = 1 | 2 | 3 | 4 | 5;

// Slide label types
export type SlideType = 'problem' | 'solution' | 'impact';
