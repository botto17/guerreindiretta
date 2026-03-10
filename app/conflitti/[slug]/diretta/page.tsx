import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import ConflictBadge from '@/components/ConflictBadge'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const { data: conflict } = await supabase
        .from('conflicts')
        .select('name')
        .eq('slug', slug)
        .single()

    if (!conflict) return { title: 'Conflitto non trovato' }

    return {
        title: `Diretta ${conflict.name} — GuerreInDiretta`,
        description: `Segui in diretta gli ultimi sviluppi del conflitto: ${conflict.name}`,
    }
}

export async function generateStaticParams() {
    const { data } = await supabase.from('conflicts').select('slug')
    return (data || []).map((c) => ({ slug: c.slug }))
}

export default async function DirettaPage({ params }: Props) {
    const { slug } = await params

    const { data: conflict } = await supabase
        .from('conflicts')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!conflict) notFound()

    // Fetch all news + articles for live feed
    const [newsRes, articlesRes] = await Promise.all([
        supabase
            .from('news_items')
            .select('id, title, excerpt, url, published_at')
            .eq('conflict_id', conflict.id)
            .order('published_at', { ascending: false })
            .limit(100),
        supabase
            .from('articles')
            .select('id, title, subtitle, slug, published_at')
            .eq('conflict_id', conflict.id)
            .order('published_at', { ascending: false })
            .limit(30),
    ])

    // Unified events feed
    type LiveEvent = {
        id: string
        title: string
        excerpt: string | null
        url: string | null
        slug: string | null
        published_at: string
        type: 'news' | 'article'
    }

    const events: LiveEvent[] = [
        ...(articlesRes.data || []).map(a => ({
            id: a.id,
            title: a.title,
            excerpt: a.subtitle,
            url: null,
            slug: a.slug,
            published_at: a.published_at,
            type: 'article' as const,
        })),
        ...(newsRes.data || []).map(n => ({
            id: n.id,
            title: n.title,
            excerpt: n.excerpt,
            url: n.url,
            slug: null,
            published_at: n.published_at,
            type: 'news' as const,
        })),
    ].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

    // Group by day
    const grouped: Record<string, LiveEvent[]> = {}
    for (const event of events) {
        const dayKey = format(new Date(event.published_at), 'd MMMM yyyy', { locale: it })
        if (!grouped[dayKey]) grouped[dayKey] = []
        grouped[dayKey].push(event)
    }

    const intensityLabels: Record<string, string> = {
        alta: 'Alta Intensità',
        media: 'Media Intensità',
        tensione: 'Tensione',
    }
    const intensityLabel = intensityLabels[conflict.intensity] ?? conflict.intensity

    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="mb-8 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <Link
                            href={`/conflitti/${slug}`}
                            className="text-xs font-sans text-gray-400 hover:text-accent transition-colors"
                        >
                            ← {conflict.name}
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                        {/* Pulsing LIVE badge */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white rounded-sm">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                            </span>
                            <span className="text-xs font-sans font-bold uppercase tracking-wider">Diretta</span>
                        </div>
                        <ConflictBadge name={intensityLabel} color={conflict.color} size="md" />
                    </div>

                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {conflict.name}
                    </h1>
                    <p className="text-sm font-sans text-gray-500">
                        Segui in tempo reale tutti gli sviluppi · Aggiornamento automatico ogni 5 minuti
                    </p>
                </div>

                {/* Live feed timeline */}
                {events.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="font-serif text-lg text-gray-400 mb-2">
                            Nessun evento registrato
                        </p>
                        <p className="text-sm font-sans text-gray-400">
                            Gli eventi appariranno qui non appena saranno disponibili.
                        </p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Vertical timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

                        {Object.entries(grouped).map(([day, dayEvents]) => (
                            <div key={day} className="mb-10">
                                {/* Day header */}
                                <div className="relative flex items-center mb-5 pl-12">
                                    <div
                                        className="absolute left-2 w-4 h-4 rounded-full border-2 border-white z-10"
                                        style={{ backgroundColor: conflict.color }}
                                    />
                                    <h2 className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-gray-500">
                                        {day}
                                    </h2>
                                </div>

                                {/* Events */}
                                <div className="space-y-0 pl-12">
                                    {dayEvents.map((event) => {
                                        const time = format(new Date(event.published_at), 'HH:mm', { locale: it })
                                        const isArticle = event.type === 'article'

                                        return (
                                            <div
                                                key={event.id}
                                                className="relative group border-b border-gray-100 py-4"
                                            >
                                                {/* Dot on timeline */}
                                                <div
                                                    className={`absolute -left-[36px] top-5 w-2.5 h-2.5 rounded-full border-2 border-white z-10 ${isArticle ? 'bg-accent' : 'bg-gray-300'
                                                        }`}
                                                />

                                                <div className={`transition-colors ${isArticle ? 'hover:bg-gray-50 rounded px-2 -mx-2' : ''}`}>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <time className="text-xs font-sans text-gray-400 font-mono tabular-nums">
                                                            {time}
                                                        </time>
                                                        {isArticle && (
                                                            <span className="text-[9px] font-sans uppercase tracking-widest text-accent font-semibold px-1.5 py-0.5 bg-red-50 rounded-sm">
                                                                Articolo
                                                            </span>
                                                        )}
                                                    </div>

                                                    {isArticle && event.slug ? (
                                                        <Link
                                                            href={`/articoli/${event.slug}`}
                                                            className="font-serif text-base font-bold text-gray-900 leading-snug hover:text-accent transition-colors block"
                                                        >
                                                            {event.title}
                                                        </Link>
                                                    ) : event.url ? (
                                                        <a
                                                            href={event.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-serif text-base text-gray-700 leading-snug hover:text-gray-900 transition-colors block"
                                                        >
                                                            {event.title}
                                                            <span className="text-gray-300 ml-1 text-xs">↗</span>
                                                        </a>
                                                    ) : (
                                                        <span className="font-serif text-base text-gray-700 leading-snug block">
                                                            {event.title}
                                                        </span>
                                                    )}

                                                    {event.excerpt && (
                                                        <p className="text-sm font-sans text-gray-500 mt-1 leading-relaxed">
                                                            {event.excerpt}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="border-t border-gray-200 mt-16 py-8 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
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
