-- ============================================
-- Migration 003: Add Iran conflict + fix medio-oriente description
-- ============================================

-- Add Iran as a separate conflict with coordinates on Tehran
INSERT INTO conflicts (slug, name, description, latitude, longitude, intensity, color, region, keywords) VALUES
  ('iran',
   'Tensioni Iran',
   'Programma nucleare iraniano, rete di proxy regionali (Hezbollah, Houthi, milizie irachene) e tensioni con Israele e Stati Uniti.',
   35.69, 51.39, 'alta', '#E3120B', 'Medio Oriente',
   ARRAY['Iran','Tehran','IRGC','nuclear','proxy','sanctions','Khamenei','Pasdaran','Quds Force']);

-- Update the existing medio-oriente conflict description to clarify scope
UPDATE conflicts
SET description = 'Conflitto in corso tra Israele e Hamas nella Striscia di Gaza, con escalation in Cisgiordania e Libano.',
    name = 'Guerra Israele-Gaza'
WHERE slug = 'medio-oriente';
