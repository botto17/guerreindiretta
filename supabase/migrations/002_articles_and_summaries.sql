-- ============================================
-- Migration 002: Articles table + Conflict summaries
-- ============================================

-- New table: articles (AI-written original content)
CREATE TABLE articles (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conflict_id  uuid NOT NULL REFERENCES conflicts(id),
  title        text NOT NULL,
  subtitle     text,
  body         text NOT NULL,
  sources      text[] NOT NULL DEFAULT '{}',
  published_at timestamptz NOT NULL DEFAULT now(),
  slug         text UNIQUE NOT NULL
);

CREATE INDEX idx_articles_conflict ON articles(conflict_id);
CREATE INDEX idx_articles_published ON articles(published_at DESC);

-- New columns on conflicts for living pages
ALTER TABLE conflicts ADD COLUMN IF NOT EXISTS summary text;
ALTER TABLE conflicts ADD COLUMN IF NOT EXISTS key_facts jsonb;
ALTER TABLE conflicts ADD COLUMN IF NOT EXISTS last_summary_update timestamptz;

-- Mark news_items as processed or not (for curation pipeline)
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS curated boolean NOT NULL DEFAULT false;

-- RLS policies for articles (allow public read)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Allow service role insert on articles" ON articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role update on articles" ON articles FOR UPDATE USING (true);
