-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: conflicts
-- ============================================
CREATE TABLE conflicts (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  description text,
  latitude    float NOT NULL,
  longitude   float NOT NULL,
  intensity   text NOT NULL CHECK (intensity IN ('alta', 'media', 'tensione')),
  color       text NOT NULL DEFAULT '#E3120B',
  region      text,
  active      boolean NOT NULL DEFAULT true,
  keywords    text[] NOT NULL DEFAULT '{}',
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: sources
-- ============================================
CREATE TABLE sources (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text NOT NULL,
  feed_url    text NOT NULL,
  website_url text NOT NULL,
  tier        int NOT NULL DEFAULT 2,
  active      boolean NOT NULL DEFAULT true
);

-- ============================================
-- TABLE: news_items
-- ============================================
CREATE TABLE news_items (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id    uuid NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  conflict_id  uuid REFERENCES conflicts(id) ON DELETE SET NULL,
  title        text NOT NULL,
  excerpt      text,
  url          text UNIQUE NOT NULL,
  published_at timestamptz NOT NULL,
  fetched_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_news_published_at ON news_items(published_at DESC);
CREATE INDEX idx_news_conflict_id  ON news_items(conflict_id);

-- ============================================
-- SEED: 20 fonti RSS
-- ============================================
INSERT INTO sources (name, feed_url, website_url, tier) VALUES
  ('Foreign Affairs',        'https://www.foreignaffairs.com/rss.xml',                          'https://foreignaffairs.com',          1),
  ('The Economist',          'https://www.economist.com/the-world-this-week/rss.xml',           'https://economist.com',               1),
  ('Foreign Policy',         'https://foreignpolicy.com/feed',                                  'https://foreignpolicy.com',           1),
  ('Financial Times',        'https://www.ft.com/geopolitics?format=rss',                       'https://ft.com',                      1),
  ('Reuters World',          'https://feeds.reuters.com/Reuters/worldNews',                     'https://reuters.com',                 1),
  ('Al Jazeera',             'https://www.aljazeera.com/xml/rss/all.xml',                       'https://aljazeera.com',               1),
  ('BBC World',              'https://feeds.bbci.co.uk/news/world/rss.xml',                     'https://bbc.com/news/world',          1),
  ('War on the Rocks',       'https://warontherocks.com/feed',                                  'https://warontherocks.com',           2),
  ('International Crisis Group', 'https://www.crisisgroup.org/latest-updates/feed',             'https://crisisgroup.org',             2),
  ('Long War Journal',       'https://www.longwarjournal.org/feed',                             'https://longwarjournal.org',          2),
  ('Defense One',            'https://www.defenseone.com/rss/all',                              'https://defenseone.com',              2),
  ('The Diplomat',           'https://thediplomat.com/feed',                                    'https://thediplomat.com',             2),
  ('ACLED',                  'https://acleddata.com/feed',                                      'https://acleddata.com',               3),
  ('Geopolitical Monitor',   'https://www.geopoliticalmonitor.com/feed',                        'https://geopoliticalmonitor.com',     3),
  ('Brookings Foreign Policy','https://www.brookings.edu/topic/foreign-policy/feed',            'https://brookings.edu',               3),
  ('CSIS',                   'https://www.csis.org/analysis/feed',                              'https://csis.org',                    3),
  ('Carnegie Endowment',     'https://carnegieendowment.org/rss/solr',                          'https://carnegieendowment.org',       3),
  ('Global Voices',          'https://globalvoices.org/feed',                                   'https://globalvoices.org',            4),
  ('Bellingcat',             'https://www.bellingcat.com/feed',                                 'https://bellingcat.com',              4),
  ('Stratfor',               'https://worldview.stratfor.com/feed',                             'https://worldview.stratfor.com',      2);

-- ============================================
-- SEED: 15 conflitti attivi (marzo 2026)
-- ============================================
INSERT INTO conflicts (slug, name, description, latitude, longitude, intensity, color, region, keywords) VALUES
  ('ucraina',
   'Guerra Russia-Ucraina',
   'Invasione russa dell''Ucraina iniziata nel febbraio 2022. Scontri attivi su tutto il fronte orientale.',
   48.5, 35.0, 'alta', '#E3120B', 'Europa Orientale',
   ARRAY['Ukraine','Russia','Zelensky','Crimea','Donbas','Kyiv','Kharkiv','Ucraina','Zelenskyy','Putin']),

  ('medio-oriente',
   'Guerra Israele-Gaza-Iran',
   'Conflitto in corso tra Israele e Hamas nella Striscia di Gaza, con rischio di escalation regionale con Iran e Hezbollah.',
   31.5, 34.5, 'alta', '#E3120B', 'Medio Oriente',
   ARRAY['Gaza','Hamas','Israel','Iran','Hezbollah','Netanyahu','Tehran','IDF','West Bank','Cisgiordania']),

  ('sudan',
   'Guerra Civile Sudan',
   'Conflitto tra le Forze Armate Sudanesi (SAF) e le Rapid Support Forces (RSF) scoppiato nell''aprile 2023.',
   15.5, 32.5, 'alta', '#E3120B', 'Africa',
   ARRAY['Sudan','Khartoum','RSF','Darfur','SAF','Sudanese']),

  ('myanmar',
   'Guerra Civile Myanmar',
   'Conflitto tra la giunta militare e le forze di resistenza, con grosse offensive delle milizie etniche.',
   19.7, 96.2, 'alta', '#E3120B', 'Asia Sud-Orientale',
   ARRAY['Myanmar','Burma','junta','Rohingya','Tatmadaw','NUG']),

  ('yemen',
   'Guerra Yemen',
   'Guerra civile con intervento della coalizione guidata dall''Arabia Saudita contro i ribelli Houthi.',
   15.5, 44.2, 'alta', '#E3120B', 'Medio Oriente',
   ARRAY['Yemen','Houthi','Sanaa','Aden','Ansarallah','Saudi Arabia']),

  ('sahel',
   'Crisi Sahel',
   'Insurrezione jihadista e instabilità politica che colpisce Mali, Burkina Faso e Niger dopo i colpi di stato.',
   14.0, -1.5, 'alta', '#E3120B', 'Africa Occidentale',
   ARRAY['Sahel','Mali','Burkina Faso','Niger','JNIM','Wagner','jihadist','AES']),

  ('congo',
   'Conflitto RD Congo',
   'Conflitto armato nella parte orientale della Repubblica Democratica del Congo, con il gruppo M23 sostenuto dal Ruanda.',
   -1.5, 29.0, 'alta', '#E3120B', 'Africa Centrale',
   ARRAY['Congo','DRC','M23','Goma','Kivu','FDLR','Rwanda']),

  ('siria',
   'Siria post-Assad',
   'Fase di transizione post-regime di Assad con presenza di milizie varie, ISIS residuale e tensioni tra gruppi armati.',
   35.0, 38.5, 'media', '#F5A623', 'Medio Oriente',
   ARRAY['Syria','Damascus','Idlib','ISIS','HTS','Assad','Siria']),

  ('haiti',
   'Crisi Haiti',
   'Haiti è sotto il controllo di gang armate che controllano ampie zone del paese, crisi umanitaria in corso.',
   19.0, -72.1, 'media', '#F5A623', 'Caraibi',
   ARRAY['Haiti','Port-au-Prince','gang','Gang','BINUH']),

  ('pakistan',
   'Insurrezione Pakistan',
   'Attacchi del Tehrik-i-Taliban Pakistan (TTP) nelle province del Balochistan e del Khyber Pakhtunkhwa.',
   30.5, 67.0, 'media', '#F5A623', 'Asia Meridionale',
   ARRAY['Pakistan','Balochistan','TTP','Waziristan','Islamabad','Khyber']),

  ('somalia',
   'Conflitto Somalia',
   'Al-Shabaab controlla ampie zone rurali della Somalia e lancia attacchi regolari a Mogadiscio.',
   5.0, 46.0, 'media', '#F5A623', 'Africa Orientale',
   ARRAY['Somalia','Mogadishu','al-Shabaab','Jubaland','ATMIS']),

  ('etiopia',
   'Conflitto Etiopia',
   'Tensioni persistenti nelle regioni Amhara e Oromia dopo il conflitto nel Tigray.',
   9.0, 38.7, 'media', '#F5A623', 'Africa Orientale',
   ARRAY['Ethiopia','Tigray','Amhara','Addis Ababa','Oromo','OLA','Etiopia']),

  ('messico',
   'Narcoguerra Messico',
   'Violento conflitto tra cartelli della droga per il controllo del territorio e delle rotte del narcotraffico.',
   23.0, -102.0, 'media', '#F5A623', 'America Centrale',
   ARRAY['Mexico','cartel','CJNG','Sinaloa','narco','Messico','fentanyl']),

  ('taiwan',
   'Tensione Taiwan',
   'Escalation delle pressioni militari cinesi sullo Stretto di Taiwan con frequenti incursioni aeree.',
   24.0, 121.0, 'tensione', '#F5D623', 'Asia Orientale',
   ARRAY['Taiwan','Strait','PLA','Taipei','ADIZ','China Sea','Cina']),

  ('mar-cinese',
   'Tensione Mar Cinese Meridionale',
   'Dispute territoriali tra Cina e Filippine (e altri paesi) sulle isole Spratly e la piattaforma continentale.',
   12.0, 114.0, 'tensione', '#F5D623', 'Asia',
   ARRAY['South China Sea','Spratly','Philippines','PLA Navy','Paracel','Manila']);
