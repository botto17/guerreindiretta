import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import NewsTicker from '@/components/NewsTicker'
import WorldMap from '@/components/WorldMap'
import NewsCard from '@/components/NewsCard'
import Link from 'next/link'

export const revalidate = 300

async function getData() {
  const [conflictsRes, newsRes, tickerRes] = await Promise.all([
    supabase
      .from('conflicts')
      .select('*')
      .eq('active', true)
      .order('intensity', { ascending: true }),
    supabase
      .from('news_items')
      .select('*, sources(name, website_url), conflicts(name, color, slug, intensity)')
      .order('published_at', { ascending: false })
      .limit(30),
    supabase
      .from('news_items')
      .select('id, title, url, published_at')
      .order('published_at', { ascending: false })
      .limit(5),
  ])

  return {
    conflicts: conflictsRes.data || [],
    news: newsRes.data || [],
    ticker: tickerRes.data || [],
  }
}

export default async function HomePage() {
  const { conflicts, news, ticker } = await getData()

  const featured = news.slice(0, 2)
  const secondary = news.slice(2, 9)
  const sidebar = news.slice(9, 18)

  return (
    <>
      <Header />
      <NewsTicker items={ticker} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Map */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-sm uppercase tracking-widest text-gray-500">
              Conflitti Attivi — Mappa
            </h2>
            <span className="text-xs font-sans text-gray-400">
              {conflicts.length} conflitti monitorati
            </span>
          </div>
          <WorldMap conflicts={conflicts} />

          {/* Legend */}
          <div className="flex gap-4 mt-3 flex-wrap">
            {[
              { label: 'Alta intensità', color: '#E3120B' },
              { label: 'Media intensità', color: '#F5A623' },
              { label: 'Tensione', color: '#F5D623' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs font-sans text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-200 mb-8" />

        {/* News Grid */}
        <section>
          <h2 className="font-serif text-sm uppercase tracking-widest text-gray-500 mb-6">
            Ultime Notizie
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main column */}
            <div className="lg:col-span-2">
              {/* Featured 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {featured.map((item) => (
                  <NewsCard key={item.id} item={item} featured />
                ))}
              </div>

              <hr className="border-gray-200 mb-6" />

              {/* Secondary grid */}
              <div className="space-y-4">
                {secondary.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="border-l border-gray-200 pl-6">
              <h3 className="font-serif text-xs uppercase tracking-widest text-gray-400 mb-4">
                In breve
              </h3>
              <div className="space-y-4">
                {sidebar.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 pb-3">
                    {item.conflicts && (
                      <div className="mb-1">
                        <span
                          className="text-xs font-sans font-semibold uppercase tracking-wide"
                          style={{ color: item.conflicts.color }}
                        >
                          {item.conflicts.name}
                        </span>
                      </div>
                    )}
                    <h4 className="font-serif text-sm font-bold text-gray-900 leading-snug">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent transition-colors"
                      >
                        {item.title}
                      </a>
                    </h4>
                  </div>
                ))}
              </div>

              <hr className="border-gray-200 my-6" />

              {/* Conflict list */}
              <h3 className="font-serif text-xs uppercase tracking-widest text-gray-400 mb-4">
                Conflitti
              </h3>
              <div className="space-y-2">
                {conflicts.map((c) => (
                  <Link
                    key={c.id}
                    href={`/conflitti/${c.slug}`}
                    className="flex items-center gap-2 text-sm font-sans hover:text-accent transition-colors group"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-gray-700 group-hover:text-accent">{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-navy text-gray-400 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-accent" />
              <span className="font-serif text-white font-bold uppercase tracking-widest">
                Guerre Indiretta
              </span>
            </div>
            <p className="text-xs font-sans text-center">
              © 2026 Guerre Indiretta · Dati conflitti: ACLED · Aggiornato ogni 30 minuti
            </p>
            <div className="flex gap-4">
              <Link href="/fonti" className="text-xs hover:text-white transition-colors">Fonti</Link>
              <Link href="/about" className="text-xs hover:text-white transition-colors">About</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
