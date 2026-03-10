'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'

type TimelineEvent = {
  id: string
  title: string
  excerpt: string | null
  url: string | null
  slug?: string | null
  published_at: string
  type: 'news' | 'article'
}

type Props = {
  events: TimelineEvent[]
}

export default function ConflictTimeline({ events }: Props) {
  if (events.length === 0) return null

  // Group events by month
  const grouped: Record<string, TimelineEvent[]> = {}
  for (const event of events) {
    const key = format(new Date(event.published_at), 'MMMM yyyy', { locale: it })
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(event)
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />

      {Object.entries(grouped).map(([month, monthEvents]) => (
        <div key={month} className="mb-8">
          {/* Month label */}
          <div className="relative flex items-center mb-4 pl-10">
            <div className="absolute left-1.5 w-3 h-3 bg-accent rounded-full border-2 border-white z-10" />
            <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-accent">
              {month}
            </h3>
          </div>

          {/* Events in this month */}
          <div className="space-y-3 pl-10">
            {monthEvents.map((event) => {
              const date = format(new Date(event.published_at), 'd MMM, HH:mm', { locale: it })
              const isArticle = event.type === 'article'

              return (
                <div
                  key={event.id}
                  className="relative group"
                >
                  {/* Dot on timeline */}
                  <div className={`absolute -left-[26px] top-1.5 w-2 h-2 rounded-full border border-white z-10 ${
                    isArticle ? 'bg-accent' : 'bg-gray-300'
                  }`} />

                  <div className={`border-b border-gray-100 pb-3 transition-colors ${
                    isArticle ? 'hover:bg-gray-50' : ''
                  }`}>
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <time className="text-[10px] font-sans text-gray-400 whitespace-nowrap flex-shrink-0">
                        {date}
                      </time>
                      {isArticle && (
                        <span className="text-[9px] font-sans uppercase tracking-widest text-accent font-semibold">
                          Articolo
                        </span>
                      )}
                    </div>

                    {isArticle && event.slug ? (
                      <Link
                        href={`/articoli/${event.slug}`}
                        className="font-serif text-sm font-bold text-gray-900 leading-snug hover:text-accent transition-colors block"
                      >
                        {event.title}
                      </Link>
                    ) : event.url ? (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-serif text-sm text-gray-700 leading-snug hover:text-gray-900 transition-colors block"
                      >
                        {event.title}
                        <span className="text-gray-300 ml-1 text-xs">↗</span>
                      </a>
                    ) : (
                      <span className="font-serif text-sm text-gray-700 leading-snug block">
                        {event.title}
                      </span>
                    )}

                    {event.excerpt && (
                      <p className="text-xs font-sans text-gray-400 mt-0.5 line-clamp-2">
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
  )
}
