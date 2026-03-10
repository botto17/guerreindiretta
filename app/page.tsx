import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import NewsTicker from '@/components/NewsTicker'
import WorldMap from '@/components/WorldMap'
import FilterableArticles from '@/components/FilterableArticles'
import Link from 'next/link'

export const revalidate = 300

async function getData() {
  const [conflictsRes, articlesRes, tickerRes] = await Promise.all([
    supabase
      .from('conflicts')
      .select('*')
      .eq('active', true)
      .order('intensity', { ascending: true }),
    supabase
      .from('articles')
      .select('*, conflicts(id, name, color, slug, intensity)')
      .order('published_at', { ascending: false })
      .limit(30),
    supabase
      .from('articles')
      .select('id, title, slug')
      .order('published_at', { ascending: false })
      .limit(8),
  ])

  return {
    conflicts: conflictsRes.data || [],
    articles: articlesRes.data || [],
    ticker: tickerRes.data || [],
  }
}

export default async function HomePage() {
  const { conflicts, articles, ticker } = await getData()

  return (
    <>
      <Header />
      <NewsTicker items={ticker} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Map Section */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-[11px] uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <span className="w-4 h-px bg-accent inline-block" />
              Conflitti Attivi nel Mondo
            </h2>
            <span className="text-[11px] font-sans text-gray-400">
              {conflicts.length} conflitti monitorati
            </span>
          </div>
          <div className="border border-gray-200 overflow-hidden">
            <WorldMap conflicts={conflicts} />
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-3 flex-wrap">
            {[
              { label: 'Alta intensità', color: '#E3120B' },
              { label: 'Media intensità', color: '#F5A623' },
              { label: 'Tensione', color: '#F5D623' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[10px] font-sans text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* Articles Section with Filter */}
        <section className="py-10">
          <h2 className="font-serif text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-2">
            <span className="w-4 h-px bg-accent inline-block" />
            Ultimi Articoli
          </h2>

          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-lg text-gray-400 mb-2">
                Nessun articolo disponibile
              </p>
              <p className="text-sm font-sans text-gray-400">
                Il sistema di curation genererà articoli automaticamente.
              </p>
            </div>
          ) : (
            <FilterableArticles
              conflicts={conflicts.map((c) => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                color: c.color,
                intensity: c.intensity,
              }))}
              articles={articles}
            />
          )}
        </section>

        {/* Conflicts sidebar section */}
        <section className="border-t border-gray-200 pt-8 pb-10">
          <h3 className="font-serif text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-5 flex items-center gap-2">
            <span className="w-3 h-px bg-accent inline-block" />
            Tutti i Conflitti
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {conflicts.map((c) => (
              <Link
                key={c.id}
                href={`/conflitti/${c.slug}`}
                className="flex items-center gap-2.5 group py-2 px-3 border border-gray-100 hover:border-gray-300 transition-colors rounded-sm"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125"
                  style={{ backgroundColor: c.color }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-sans text-gray-700 group-hover:text-accent transition-colors block truncate">
                    {c.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Lead Generation Boxes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Newsletter Box */}
          <div className="border border-gray-200 bg-white p-8 md:p-10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-accent font-semibold block mb-3">
                Newsletter
              </span>
              <h3
                className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Non perdere nessun aggiornamento
              </h3>
              <p className="font-sans text-sm text-gray-500 leading-relaxed mb-6">
                Ogni settimana nella tua inbox: le analisi più importanti sui conflitti in corso, gli sviluppi diplomatici e le dinamiche geopolitiche che stanno ridisegnando il mondo.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="La tua email"
                className="flex-1 border border-gray-300 px-4 py-3 text-sm font-sans focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="button"
                className="bg-accent text-white font-sans text-sm font-semibold px-6 py-3 hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                Iscriviti
              </button>
            </div>
            <p className="text-[10px] font-sans text-gray-400 mt-3">
              Niente spam, solo geopolitica. Cancellazione in un click.
            </p>
          </div>

          {/* Quiz Box */}
          <div className="border border-accent bg-accent p-8 md:p-10 flex flex-col justify-between text-white">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-red-200 font-semibold block mb-3">
                Mettiti alla prova
              </span>
              <h3
                className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Quanto ne sai davvero di geopolitica?
              </h3>
              <p className="font-sans text-sm text-red-100 leading-relaxed mb-6">
                Dalla guerra in Ucraina alle tensioni nel Pacifico, dall&apos;escalation in Medio Oriente alla crisi in Myanmar: 10 domande per scoprire se sei un vero esperto di conflitti internazionali.
              </p>
            </div>
            <Link href="/quiz" className="block w-full">
              <button
                className="w-full bg-white text-accent font-sans text-sm font-bold px-6 py-3.5 hover:bg-red-50 transition-colors"
              >
                Inizia il quiz →
              </button>
            </Link>
            <p className="text-[10px] font-sans text-red-200 mt-3">
              2 minuti · 10 domande · Risultato immediato
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 mt-0 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-gray-900 block mb-3">
                GuerreInDiretta
              </span>
              <p className="text-xs font-sans text-gray-400 leading-relaxed">
                Analisi e copertura dei conflitti armati e delle crisi geopolitiche nel mondo. Aggiornato quotidianamente con fonti internazionali verificate.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] text-gray-400 mb-3">Sezioni</h4>
              <div className="space-y-2">
                {['Mappa', 'Conflitti', 'Articoli', 'Fonti', 'About'].map(link => (
                  <Link key={link} href={`/${link.toLowerCase()}`} className="block text-xs font-sans text-gray-500 hover:text-accent transition-colors">
                    {link}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] text-gray-400 mb-3">Info</h4>
              <p className="text-xs font-sans text-gray-400">
                © 2026 GuerreInDiretta
              </p>
              <p className="text-xs font-sans text-gray-400 mt-1">
                Dati conflitti: ACLED · Fonti: Reuters, Al Jazeera, BBC, Le Monde
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
