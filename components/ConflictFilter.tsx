'use client'

import { useState } from 'react'

type ConflictOption = {
    id: string
    name: string
    slug: string
    color: string
}

type Props = {
    conflicts: ConflictOption[]
    selected: string | null
    onSelect: (slug: string | null) => void
}

export default function ConflictFilter({ conflicts, selected, onSelect }: Props) {
    const [expanded, setExpanded] = useState(false)

    // Show first 8 by default on mobile, all on desktop
    const visible = expanded ? conflicts : conflicts.slice(0, 8)
    const hasMore = conflicts.length > 8

    return (
        <div className="mb-8">
            <h3 className="font-serif text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-accent inline-block" />
                Filtra per conflitto
            </h3>
            <div className="flex flex-wrap gap-2 items-center">
                {/* "Tutti" button */}
                <button
                    onClick={() => onSelect(null)}
                    className={`px-3 py-1.5 text-xs font-sans font-medium border transition-all duration-200 rounded-sm ${selected === null
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                >
                    Tutti
                </button>

                {visible.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => onSelect(selected === c.slug ? null : c.slug)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium border transition-all duration-200 rounded-sm ${selected === c.slug
                                ? 'text-white border-transparent'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                            }`}
                        style={
                            selected === c.slug
                                ? { backgroundColor: c.color, borderColor: c.color }
                                : undefined
                        }
                    >
                        <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{
                                backgroundColor: selected === c.slug ? '#fff' : c.color,
                            }}
                        />
                        {c.name}
                    </button>
                ))}

                {hasMore && !expanded && (
                    <button
                        onClick={() => setExpanded(true)}
                        className="px-3 py-1.5 text-xs font-sans text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        +{conflicts.length - 8} altri
                    </button>
                )}
            </div>
        </div>
    )
}
