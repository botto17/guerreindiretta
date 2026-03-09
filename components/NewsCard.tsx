import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'
import ConflictBadge from './ConflictBadge'
import { NewsItem } from '@/lib/supabase'

type Props = {
  item: NewsItem
  featured?: boolean
}

export default function NewsCard({ item, featured = false }: Props) {
  const timeAgo = formatDistanceToNow(new Date(item.published_at), {
    addSuffix: true,
    locale: it,
  })

  return (
    <article className={`border-b border-gray-200 pb-4 ${featured ? 'mb-2' : ''}`}>
      {item.conflicts && (
        <div className="mb-2">
          <ConflictBadge
            name={item.conflicts.name}
            color={item.conflicts.color}
          />
        </div>
      )}
      <h2 className={`font-serif font-bold text-gray-900 leading-snug mb-1 ${featured ? 'text-xl' : 'text-base'}`}>
        <Link
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors"
        >
          {item.title}
        </Link>
      </h2>
      {item.excerpt && (
        <p className="text-sm text-gray-600 font-sans line-clamp-2 mb-2">
          {item.excerpt}
        </p>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-400 font-sans">
        {item.sources && (
          <>
            <span className="font-medium text-gray-500">via {item.sources.name}</span>
            <span>·</span>
          </>
        )}
        <time dateTime={item.published_at}>{timeAgo}</time>
      </div>
    </article>
  )
}
