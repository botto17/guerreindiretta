import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import ConflictBadge from './ConflictBadge'
import { getArticleImage } from '@/lib/conflict-images'

type Article = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  body: string
  image_url: string | null
  published_at: string
  conflicts?: {
    name: string
    color: string
    slug: string
    intensity: string
  }
}

type Props = {
  article: Article
  featured?: boolean
  showImage?: boolean
}

function estimateReadingTime(body: string): number {
  const words = body.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export default function ArticleCard({ article, featured = false, showImage = false }: Props) {
  const date = format(new Date(article.published_at), 'd MMMM yyyy', { locale: it })
  const readTime = estimateReadingTime(article.body)
  const imageUrl = article.image_url || getArticleImage(article.conflicts?.slug, article.title)

  return (
    <article className={`border-b border-gray-200 ${featured ? 'pb-6 mb-6' : 'pb-4 mb-4'}`}>
      {showImage && (
        <Link href={`/articoli/${article.slug}`} className="block mb-3 overflow-hidden">
          <div className="relative w-full aspect-[16/9] bg-gray-100">
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
        </Link>
      )}
      {article.conflicts && (
        <div className="mb-2">
          <ConflictBadge
            name={article.conflicts.name}
            color={article.conflicts.color}
          />
        </div>
      )}
      <h2 className={`font-serif font-bold text-gray-900 leading-snug mb-1 ${featured ? 'text-2xl' : 'text-lg'}`}>
        <Link
          href={`/articoli/${article.slug}`}
          className="hover:text-accent transition-colors"
        >
          {article.title}
        </Link>
      </h2>
      {article.subtitle && (
        <p className={`font-serif text-gray-500 leading-relaxed ${featured ? 'text-base mb-3' : 'text-sm mb-2'}`}>
          {article.subtitle}
        </p>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-400 font-sans">
        <time dateTime={article.published_at}>{date}</time>
        <span>·</span>
        <span>{readTime} min di lettura</span>
      </div>
    </article>
  )
}
