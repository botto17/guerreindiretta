'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ConflictFilter from './ConflictFilter'
import ArticleCard from './ArticleCard'
import { getArticleImage } from '@/lib/conflict-images'

type ConflictInfo = {
    id: string
    name: string
    slug: string
    color: string
    intensity: string
}

type ArticleData = {
    id: string
    title: string
    subtitle: string | null
    body: string
    slug: string
    image_url: string | null
    published_at: string
    conflict_id: string
    conflicts?: {
        name: string
        color: string
        slug: string
        intensity: string
    }
}

type Props = {
    conflicts: ConflictInfo[]
    articles: ArticleData[]
}

export default function FilterableArticles({ conflicts, articles }: Props) {
    const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

    const filtered = useMemo(() => {
        if (!selectedSlug) return articles
        return articles.filter((a) => a.conflicts?.slug === selectedSlug)
    }, [articles, selectedSlug])

    const featured = filtered.slice(0, 1)
    const secondary = filtered.slice(1, 4)
    const rest = filtered.slice(4, 12)
    const sidebar = filtered.slice(12, 20)

    return (
        <>
            <ConflictFilter
                conflicts={conflicts}
                selected={selectedSlug}
                onSelect={setSelectedSlug}
            />

            {filtered.length === 0 ? (
                <div className="text-center py-20">
                    <p className="font-serif text-lg text-gray-400 mb-2">
                        Nessun articolo per questo conflitto
                    </p>
                    <p className="text-sm font-sans text-gray-400">
                        Prova a selezionare un altro conflitto o &quot;Tutti&quot;.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10">
                    {/* Featured + Secondary: left side */}
                    <div className="lg:col-span-8">
                        {/* Featured large card */}
                        {featured.map((article) => (
                            <article key={article.id} className="mb-8 pb-8 border-b border-gray-200">
                                <Link href={`/articoli/${article.slug}`} className="block mb-4 overflow-hidden">
                                    <div className="relative w-full aspect-[16/9] bg-gray-100">
                                        <img
                                            src={article.image_url || getArticleImage(article.conflicts?.slug, article.title)}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                </Link>
                                {article.conflicts && (
                                    <div className="mb-2">
                                        <span
                                            className="text-[11px] font-sans font-semibold uppercase tracking-wide"
                                            style={{ color: article.conflicts.color }}
                                        >
                                            {article.conflicts.name}
                                        </span>
                                    </div>
                                )}
                                <h2 className="font-serif text-3xl font-bold text-gray-900 leading-tight mb-3">
                                    <Link
                                        href={`/articoli/${article.slug}`}
                                        className="hover:text-accent transition-colors"
                                    >
                                        {article.title}
                                    </Link>
                                </h2>
                                {article.subtitle && (
                                    <p className="font-serif text-lg text-gray-500 leading-relaxed mb-3">
                                        {article.subtitle}
                                    </p>
                                )}
                                <p className="font-serif text-base text-gray-600 leading-relaxed mb-4 line-clamp-3">
                                    {article.body.replace(/[#*_>[\]]/g, '').slice(0, 300)}...
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-sans">
                                    <time dateTime={article.published_at}>
                                        {new Date(article.published_at).toLocaleDateString('it-IT', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </time>
                                    <span>·</span>
                                    <span>{Math.max(1, Math.ceil(article.body.split(/\s+/).length / 200))} min di lettura</span>
                                </div>
                            </article>
                        ))}

                        {/* Secondary row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-0">
                            {secondary.map((article) => (
                                <ArticleCard key={article.id} article={article} showImage />
                            ))}
                        </div>

                        {/* More articles */}
                        {rest.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="font-serif text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                                    Altre analisi
                                </h3>
                                {rest.map((article) => (
                                    <ArticleCard key={article.id} article={article} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 lg:border-l lg:border-gray-200 lg:pl-8">
                        {/* In breve */}
                        {sidebar.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-serif text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-5 flex items-center gap-2">
                                    <span className="w-3 h-px bg-accent inline-block" />
                                    In breve
                                </h3>
                                <div className="space-y-4">
                                    {sidebar.map((article) => (
                                        <div key={article.id} className="border-b border-gray-100 pb-3 group">
                                            {article.conflicts && (
                                                <div className="mb-1">
                                                    <span
                                                        className="text-[10px] font-sans font-semibold uppercase tracking-wide"
                                                        style={{ color: article.conflicts.color }}
                                                    >
                                                        {article.conflicts.name}
                                                    </span>
                                                </div>
                                            )}
                                            <h4 className="font-serif text-sm font-bold text-gray-900 leading-snug group-hover:text-accent transition-colors">
                                                <Link href={`/articoli/${article.slug}`}>
                                                    {article.title}
                                                </Link>
                                            </h4>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
