-- Aggiorna immagine per l'articolo su Taiwan
UPDATE articles
SET image_url = 'https://images.unsplash.com/photo-1508433957232-3107f5fd5995?w=1200&h=630&fit=crop'
WHERE title ILIKE '%Taiwan: il punto di rottura del Pacifico%';

-- Aggiorna immagine per l'articolo su Iran e Israele
UPDATE articles
SET image_url = 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=1200&h=630&fit=crop'
WHERE title ILIKE '%Iran e Israele: il Medio Oriente sull''orlo di una guerra aperta%';

-- Aggiorna immagine per l'articolo sull'Ucraina
UPDATE articles
SET image_url = 'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=1200&h=630&fit=crop'
WHERE title ILIKE '%Ucraina: la guerra di logoramento entra nella sua fase più critica%';
