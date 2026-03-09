import { formatDistanceToNow, format } from 'date-fns'
import { it } from 'date-fns/locale'
import { NewsItem } from '@/lib/supabase'

type Props = {
  items: NewsItem[]
}

export default function ConflictTimeline({ items }: Props) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />

      <div className="space-y-6">
        {items.map((item) => {
          const timeAgo = formatDistanceToNow(new Date(item.published_at), {
            addSuffix: true,
            locale: it,
          })
          const fullDate = format(new Date(item.published_at), 'd MMMM yyyy, HH:mm', { locale: it })

          return (
            <div key={item.id} className="relative pl-10">
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-accent flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent" />
              </div>

              <article className="bg-white border border-gray-100 rounded-sm p-4 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-serif font-bold text-gray-900 mb-1 leading-snug">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    {item.title}
                  </a>
                </h3>
                {item.excerpt && (
                  <p className="text-sm text-gray-600 font-sans mb-2 line-clamp-3">
                    {item.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-400 font-sans">
                  {item.sources && (
                    <>
                      <span className="font-medium text-gray-500">{item.sources.name}</span>
                      <span>·</span>
                    </>
                  )}
                  <time dateTime={item.published_at} title={fullDate}>
                    {timeAgo}
                  </time>
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </div>
  )
}
