# Guerre Indiretta

Aggregatore automatico di notizie sui conflitti armati e le crisi geopolitiche nel mondo.

**[guerreindiretta.com](https://guerreindiretta.com)**

---

## Stack

- **Next.js 15** (App Router, ISR)
- **TypeScript**
- **Tailwind CSS** — palette The Economist
- **Supabase** (PostgreSQL)
- **rss-parser** — fetch + parse feed RSS
- **date-fns** con locale italiano

## Struttura

```
app/
  page.tsx                         # Homepage: mappa + griglia news
  conflitti/[slug]/page.tsx        # News per conflitto
  fonti/page.tsx                   # Lista fonti
  about/page.tsx
  api/
    cron/fetch-feeds/route.ts      # Cron ogni 30min
    cron/update-conflicts/route.ts # Cron settimanale
    news/route.ts                  # API news (paginazione)
components/
  Header.tsx
  NewsTicker.tsx
  NewsCard.tsx
  WorldMap.tsx
  ConflictBadge.tsx
  ConflictTimeline.tsx
lib/
  supabase.ts
  rss.ts
  classifier.ts
  geo.ts
supabase/
  migrations/001_initial.sql
```

## Setup

### 1. Installa dipendenze

```bash
npm install
```

### 2. Crea progetto Supabase

1. Vai su [supabase.com](https://supabase.com) e crea un nuovo progetto
2. Vai su **SQL Editor** ed esegui il file `supabase/migrations/001_initial.sql`
3. Copia le credenziali da **Settings → API**

### 3. Configura variabili d'ambiente

```bash
cp .env.example .env.local
```

Popola `.env.local` con le tue credenziali.

### 4. Avvia in locale

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## Database

### Tabelle

- **conflicts** — 15 conflitti attivi con coordinate, intensità, keywords
- **sources** — 20 fonti RSS classificate per tier
- **news_items** — notizie aggregate, dedup su URL

### Cron Jobs (Vercel)

- `/api/cron/fetch-feeds` — ogni 30 minuti
- `/api/cron/update-conflicts` — ogni lunedì alle 3:00

Protetti con `Authorization: Bearer CRON_SECRET`.

## Conflitti Monitorati (marzo 2026)

| Slug | Conflitto | Intensità |
|------|-----------|-----------|
| ucraina | Guerra Russia-Ucraina | Alta |
| medio-oriente | Guerra Israele-Gaza-Iran | Alta |
| sudan | Guerra Civile Sudan | Alta |
| myanmar | Guerra Civile Myanmar | Alta |
| yemen | Guerra Yemen | Alta |
| sahel | Crisi Sahel | Alta |
| congo | Conflitto RD Congo | Alta |
| siria | Siria post-Assad | Media |
| haiti | Crisi Haiti | Media |
| pakistan | Insurrezione Pakistan | Media |
| somalia | Conflitto Somalia | Media |
| etiopia | Conflitto Etiopia | Media |
| messico | Narcoguerra Messico | Media |
| taiwan | Tensione Taiwan | Tensione |
| mar-cinese | Tensione Mar Cinese Meridionale | Tensione |

## Fonti

20 feed RSS da testate internazionali, think tank e centri di ricerca geopolitica.
Classificati in 4 tier per affidabilità.

## Deploy su Vercel

```bash
vercel
```

Configura le variabili d'ambiente nel pannello Vercel.
I cron job vengono attivati automaticamente dal `vercel.json`.

## Licenza

MIT — © 2026 Guerre Indiretta
