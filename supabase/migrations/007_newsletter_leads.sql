-- ============================================
-- Migration 007: Newsletter Subscribers
-- ============================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  source text DEFAULT 'quiz',
  created_at timestamp with time zone DEFAULT now()
);

-- RLS (Row Level Security)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy to allow anonymous inserts (users submitting the quiz)
CREATE POLICY "Anyone can insert a newsletter subscriber"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Policy to allow only authenticated users (admin) to view/select
CREATE POLICY "Only authenticated users can view subscribers"
  ON newsletter_subscribers
  FOR SELECT
  USING (auth.role() = 'authenticated');
