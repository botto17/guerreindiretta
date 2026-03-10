-- Forziamo la sostituzione dell'immagine per l'articolo "Gaza sotto assedio"
UPDATE articles
SET image_url = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=630&fit=crop'
WHERE title ILIKE '%Gaza sotto assedio%';
