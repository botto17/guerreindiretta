-- ============================================
-- Migration 005: Add AP News and ISW sources
-- ============================================

INSERT INTO sources (name, feed_url, website_url, tier) VALUES
  ('AP News', 'https://moxie.foxnews.com/google-publisher/world.xml', 'https://apnews.com', 1),
  ('Institute for the Study of War', 'https://www.understandingwar.org/rss.xml', 'https://understandingwar.org', 1);
