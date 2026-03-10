import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { KeyFacts } from '@/lib/supabase'
import Header from '@/components/Header'
import ConflictBadge from '@/components/ConflictBadge'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import ConflictTimeline from '@/components/ConflictTimeline'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data: conflict } = await supabase
    .from('conflicts')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!conflict) return { title: 'Conflitto non trovato' }

  return {
    title: `${conflict.name} — GuerreInDiretta`,
    description: conflict.description,
  }
}

export async function generateStaticParams() {
  const { data } = await supabase.from('conflicts').select('slug')
  return (data || []).map((c) => ({ slug: c.slug }))
}

export default async function ConflictPage({ params }: Props) {
  const { slug } = await params

  const { data: conflict } = await supabase
    .from('conflicts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!conflict) notFound()

  // Fetch articles
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, subtitle, slug, published_at, body')
    .eq('conflict_id', conflict.id)
    .order('published_at', { ascending: false })
    .limit(20)

  // Fetch news items for timeline
  const { data: newsItems } = await supabase
    .from('news_items')
    .select('id, title, excerpt, url, published_at')
    .eq('conflict_id', conflict.id)
    .order('published_at', { ascending: false })
    .limit(50)

  // Build unified timeline
  const timelineEvents = [
    ...(articles || []).map(a => ({
      id: a.id,
      title: a.title,
      excerpt: a.subtitle,
      url: null,
      slug: a.slug,
      published_at: a.published_at,
      type: 'article' as const,
    })),
    ...(newsItems || []).map(n => ({
      id: n.id,
      title: n.title,
      excerpt: n.excerpt,
      url: n.url,
      slug: null,
      published_at: n.published_at,
      type: 'news' as const,
    })),
  ].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

  const intensityLabels: Record<string, string> = {
    alta: 'Alta Intensità',
    media: 'Media Intensità',
    tensione: 'Tensione',
  }
  const intensityLabel = intensityLabels[conflict.intensity] ?? conflict.intensity

  const keyFacts = conflict.key_facts as KeyFacts | null
  const lastUpdate = conflict.last_summary_update
    ? format(new Date(conflict.last_summary_update), 'd MMMM yyyy, HH:mm', { locale: it })
    : null

  // Separate latest news items for the "Ultime News" section
  const latestNews = (newsItems || []).slice(0, 10)

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="max-w-3xl mb-10 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <ConflictBadge
              name={intensityLabel}
              color={conflict.color}
              size="md"
            />
            <span className="text-xs font-sans text-gray-400">·</span>
            <span className="text-xs font-sans text-gray-400">{conflict.region}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {conflict.name}
          </h1>
          {conflict.description && (
            <p className="font-serif text-lg text-gray-500 leading-relaxed">
              {conflict.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-4">
            {lastUpdate && (
              <p className="text-xs font-sans text-gray-400">
                Ultimo aggiornamento: {lastUpdate}
              </p>
            )}
            <Link
              href={`/conflitti/${slug}/diretta`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-xs font-sans font-semibold uppercase tracking-wide hover:bg-red-700 transition-colors rounded-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              Diretta
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12">
          {/* Main content — Timeline prominent */}
          <div className="lg:col-span-2">
            {/* Situazione Attuale */}
            {conflict.summary && (
              <section className="mb-10">
                <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                  <span className="w-3 h-px bg-accent inline-block" />
                  Situazione Attuale
                </h2>
                <MarkdownRenderer content={conflict.summary} />
              </section>
            )}

            {/* Timeline — Now the main content */}
            {timelineEvents.length > 0 && (
              <section className="mb-10">
                <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                  <span className="w-3 h-px bg-accent inline-block" />
                  Cronologia degli eventi
                </h2>
                <ConflictTimeline events={timelineEvents} />
              </section>
            )}

            {/* Ultime News section */}
            {latestNews.length > 0 && (
              <section className="mb-10 border-t border-gray-200 pt-8">
                <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                  <span className="w-3 h-px bg-accent inline-block" />
                  Ultime News
                </h2>
                <div className="space-y-0">
                  {latestNews.map((news) => {
                    const newsDate = format(new Date(news.published_at), 'd MMM yyyy, HH:mm', { locale: it })
                    return (
                      <div key={news.id} className="border-b border-gray-100 py-3 group">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <time className="text-[10px] font-sans text-gray-400 whitespace-nowrap flex-shrink-0">
                            {newsDate}
                          </time>
                        </div>
                        {news.url ? (
                          <a
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-serif text-sm text-gray-700 leading-snug hover:text-gray-900 transition-colors block"
                          >
                            {news.title}
                            <span className="text-gray-300 ml-1 text-xs">↗</span>
                          </a>
                        ) : (
                          <span className="font-serif text-sm text-gray-700 leading-snug block">
                            {news.title}
                          </span>
                        )}
                        {news.excerpt && (
                          <p className="text-xs font-sans text-gray-400 mt-0.5 line-clamp-2">
                            {news.excerpt}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar — Key facts + articles */}
          <div className="lg:border-l lg:border-gray-200 lg:pl-8">
            {/* Dati Chiave */}
            {keyFacts && (
              <section className="mb-8">
                <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                  <span className="w-3 h-px bg-accent inline-block" />
                  Dati Chiave
                </h2>
                <dl className="space-y-4">
                  {keyFacts.parties && keyFacts.parties.length > 0 && (
                    <div>
                      <dt className="text-[10px] font-sans uppercase tracking-[0.15em] text-gray-400 mb-1">
                        Parti in conflitto
                      </dt>
                      <dd className="font-serif text-sm text-gray-900">
                        {keyFacts.parties.join(' · ')}
                      </dd>
                    </div>
                  )}
                  {keyFacts.startDate && (
                    <div>
                      <dt className="text-[10px] font-sans uppercase tracking-[0.15em] text-gray-400 mb-1">
                        Inizio
                      </dt>
                      <dd className="font-serif text-sm text-gray-900">{keyFacts.startDate}</dd>
                    </div>
                  )}
                  {keyFacts.region && (
                    <div>
                      <dt className="text-[10px] font-sans uppercase tracking-[0.15em] text-gray-400 mb-1">
                        Area
                      </dt>
                      <dd className="font-serif text-sm text-gray-900">{keyFacts.region}</dd>
                    </div>
                  )}
                  {keyFacts.estimatedCasualties && (
                    <div>
                      <dt className="text-[10px] font-sans uppercase tracking-[0.15em] text-gray-400 mb-1">
                        Vittime stimate
                      </dt>
                      <dd className="font-serif text-sm text-gray-900 font-bold">{keyFacts.estimatedCasualties}</dd>
                    </div>
                  )}
                  {keyFacts.internationalActors && keyFacts.internationalActors.length > 0 && (
                    <div>
                      <dt className="text-[10px] font-sans uppercase tracking-[0.15em] text-gray-400 mb-1">
                        Attori internazionali
                      </dt>
                      <dd className="font-serif text-sm text-gray-900">
                        {keyFacts.internationalActors.join(' · ')}
                      </dd>
                    </div>
                  )}
                  {keyFacts.latestDevelopment && (
                    <div>
                      <dt className="text-[10px] font-sans uppercase tracking-[0.15em] text-gray-400 mb-1">
                        Ultimo sviluppo
                      </dt>
                      <dd className="font-serif text-xs text-gray-600 leading-relaxed italic">
                        {keyFacts.latestDevelopment}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>
            )}

            {/* Conflict Info */}
            <section className="mb-8 border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: conflict.color }} />
                <span className="text-sm font-sans font-semibold text-gray-900">{intensityLabel}</span>
              </div>
              <p className="text-xs font-sans text-gray-400">
                Regione: {conflict.region}
              </p>
              {lastUpdate && (
                <p className="text-xs font-sans text-gray-400 mt-1">
                  Aggiornato: {lastUpdate}
                </p>
              )}
            </section>

            {/* Articoli (sidebar) */}
            {articles && articles.length > 0 && (
              <section className="border-t border-gray-200 pt-6">
                <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                  <span className="w-3 h-px bg-accent inline-block" />
                  Articoli
                </h2>
                <div className="space-y-0">
                  {articles.map((article) => {
                    const articleDate = format(new Date(article.published_at), 'd MMMM yyyy', { locale: it })
                    const readTime = Math.max(1, Math.ceil(article.body.split(/\s+/).length / 200))
                    return (
                      <article key={article.id} className="border-b border-gray-100 py-3 group">
                        <h3 className="font-serif font-bold text-gray-900 leading-snug mb-1 text-sm">
                          <Link
                            href={`/articoli/${article.slug}`}
                            className="group-hover:text-accent transition-colors"
                          >
                            {article.title}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-sans">
                          <time dateTime={article.published_at}>{articleDate}</time>
                          <span>·</span>
                          <span>{readTime} min</span>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-serif text-sm font-bold tracking-tight text-gray-900 hover:text-accent transition-colors">
            GuerreInDiretta
          </Link>
          <p className="text-xs font-sans text-gray-400">
            © 2026 GuerreInDiretta · Dati conflitti: ACLED
          </p>
        </div>
      </footer>
    </>
  )
}
