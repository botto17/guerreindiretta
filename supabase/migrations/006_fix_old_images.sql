-- ============================================
-- Migration 006: Fix old generic images in existing articles
-- ============================================

-- Sostituisci l'immagine del mappamondo con le bandiere ONU
UPDATE articles
SET image_url = 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=630&fit=crop'
WHERE image_url LIKE '%1451187580459%';

-- Sostituisci l'immagine dei dati con l'assemblea governativa
UPDATE articles
SET image_url = 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?w=1200&h=630&fit=crop'
WHERE image_url LIKE '%1526374965328%';

-- Sostituisci l'immagine del Colosseo e dell'Africa con il palazzo diplomatico
UPDATE articles
SET image_url = 'https://images.unsplash.com/photo-1580128637471-1339ce9ca3fa?w=1200&h=630&fit=crop'
WHERE image_url LIKE '%1504384308090%' OR image_url LIKE '%1523365280197%';
