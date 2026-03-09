'use client'

import { NewsItem } from '@/lib/supabase'
import Link from 'next/link'

type Props = {
  items: NewsItem[]
}

export default function NewsTicker({ items }: Props) {
  if (items.length === 0) return null

  const doubled = [...items, ...items]

  return (
    <div className="bg-accent text-white overflow-hidden h-8 flex items-center">
      <div className="flex-shrink-0 bg-navy px-3 h-full flex items-center z-10">
        <span className="text-xs font-sans font-semibold uppercase tracking-widest whitespace-nowrap">
          Breaking
        </span>
      </div>
      <div className="overflow-hidden flex-1">
        <div className="ticker-track flex gap-8 whitespace-nowrap">
          {doubled.map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-sans hover:underline flex-shrink-0"
            >
              <span className="opacity-70 mr-2">◆</span>
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
