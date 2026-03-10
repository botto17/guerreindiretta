import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import ConflictBadge from '@/components/ConflictBadge'
import { getArticleImage } from '@/lib/conflict-images'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data: article } = await supabase
    .from('articles')
    .select('title, subtitle')
    .eq('slug', slug)
    .single()

  if (!article) return { title: 'Articolo non trovato' }

  return {
    title: `${article.title} — GuerreInDiretta`,
    description: article.subtitle || article.title,
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params

  const { data: article } = await supabase
    .from('articles')
    .select('*, conflicts(name, color, slug, intensity)')
    .eq('slug', slug)
    .single()

  if (!article) notFound()

  const date = format(new Date(article.published_at), 'd MMMM yyyy', { locale: it })
  const readTime = Math.max(1, Math.ceil(article.body.split(/\s+/).length / 200))
  const imageUrl = getArticleImage(article.conflicts?.slug, article.title)

  // Get prev/next articles
  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from('articles')
      .select('title, slug')
      .lt('published_at', article.published_at)
      .order('published_at', { ascending: false })
      .limit(1),
    supabase
      .from('articles')
      .select('title, slug')
      .gt('published_at', article.published_at)
      .order('published_at', { ascending: true })
      .limit(1),
  ])
  const prev = prevRes.data?.[0] || null
  const next = nextRes.data?.[0] || null

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero image */}
        <div className="mb-8 -mx-4 sm:-mx-6">
          <div className="relative w-full aspect-[2/1] bg-gray-100">
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Meta */}
        <div className="mb-8">
          {article.conflicts && (
            <div className="mb-3">
              <Link href={`/conflitti/${article.conflicts.slug}`}>
                <ConflictBadge
                  name={article.conflicts.name}
                  color={article.conflicts.color}
                  size="md"
                />
              </Link>
            </div>
          )}
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="font-serif text-lg text-gray-500 leading-relaxed mb-4">
              {article.subtitle}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs font-sans text-gray-400 border-y border-gray-200 py-3">
            <time dateTime={article.published_at}>{date}</time>
            <span>·</span>
            <span>{readTime} min di lettura</span>
            {article.conflicts && (
              <>
                <span>·</span>
                <Link
                  href={`/conflitti/${article.conflicts.slug}`}
                  className="hover:text-accent transition-colors"
                >
                  {article.conflicts.name}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <MarkdownRenderer content={article.body} />

        {/* Sources */}
        {article.sources && article.sources.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-serif text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">
              Fonti
            </h3>
            <ul className="space-y-2">
              {article.sources.map((url: string, i: number) => (
                <li key={i}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-sans text-accent hover:underline break-all"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prev/Next */}
        <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-2 gap-8">
          <div>
            {prev && (
              <>
                <span className="text-[10px] font-sans uppercase tracking-widest text-gray-400 block mb-1">
                  ← Precedente
                </span>
                <Link
                  href={`/articoli/${prev.slug}`}
                  className="font-serif text-sm font-bold text-gray-900 hover:text-accent transition-colors leading-snug"
                >
                  {prev.title}
                </Link>
              </>
            )}
          </div>
          <div className="text-right">
            {next && (
              <>
                <span className="text-[10px] font-sans uppercase tracking-widest text-gray-400 block mb-1">
                  Successivo →
                </span>
                <Link
                  href={`/articoli/${next.slug}`}
                  className="font-serif text-sm font-bold text-gray-900 hover:text-accent transition-colors leading-snug"
                >
                  {next.title}
                </Link>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16 py-6 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-sans text-gray-400">
            © 2026 GuerreInDiretta
          </p>
        </div>
      </footer>
    </>
  )
}
