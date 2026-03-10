-- ============================================
-- Migration 004: Add image_url to news and articles
-- ============================================

ALTER TABLE news_items ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_url text;
