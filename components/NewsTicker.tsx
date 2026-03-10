'use client'

import Link from 'next/link'

type TickerArticle = {
  id: string
  title: string
  slug: string
}

type Props = {
  items: TickerArticle[]
}

export default function NewsTicker({ items }: Props) {
  if (items.length === 0) return null

  const doubled = [...items, ...items]

  return (
    <div className="bg-white border-y border-gray-200 text-gray-700 overflow-hidden h-8 flex items-center">
      <div className="flex-shrink-0 border-r border-gray-200 px-4 h-full flex items-center">
        <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-accent whitespace-nowrap">
          Ultimi articoli
        </span>
      </div>
      <div className="overflow-hidden flex-1">
        <div className="ticker-track flex gap-8 whitespace-nowrap">
          {doubled.map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              href={`/articoli/${item.slug}`}
              className="text-xs font-sans text-gray-600 hover:text-accent transition-colors flex-shrink-0"
            >
              <span className="text-gray-300 mr-2">◆</span>
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
