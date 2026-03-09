import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import ConflictBadge from '@/components/ConflictBadge'
import ConflictTimeline from '@/components/ConflictTimeline'

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
    title: `${conflict.name} — Guerre Indiretta`,
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

  const { data: news } = await supabase
    .from('news_items')
    .select('*, sources(name, website_url)')
    .eq('conflict_id', conflict.id)
    .order('published_at', { ascending: false })
    .limit(20)

  const intensityLabel = {
    alta: 'Alta Intensità',
    media: 'Media Intensità',
    tensione: 'Tensione',
  }[conflict.intensity]

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="mb-8 border-b border-gray-200 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <ConflictBadge
              name={intensityLabel}
              color={conflict.color}
              size="md"
            />
            <span className="text-sm font-sans text-gray-400">{conflict.region}</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-3">
            {conflict.name}
          </h1>
          {conflict.description && (
            <p className="text-lg font-sans text-gray-600 leading-relaxed">
              {conflict.description}
            </p>
          )}
        </div>

        {/* Timeline */}
        <div>
          <h2 className="font-serif text-sm uppercase tracking-widest text-gray-400 mb-6">
            {news?.length || 0} notizie recenti
          </h2>
          {news && news.length > 0 ? (
            <ConflictTimeline items={news} />
          ) : (
            <p className="text-gray-500 font-sans text-sm py-8 text-center">
              Nessuna notizia disponibile. Il sistema aggiornerà automaticamente ogni 30 minuti.
            </p>
          )}
        </div>
      </main>

      <footer className="bg-navy text-gray-400 mt-16 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-sans">
            © 2026 Guerre Indiretta · Dati conflitti: ACLED
          </p>
        </div>
      </footer>
    </>
  )
}
