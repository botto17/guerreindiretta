import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Header from '@/components/Header'
import ConflictBadge from '@/components/ConflictBadge'

export const revalidate = 3600 // Cache for 1 hour

export default async function ConflictsPage() {
    const { data: conflicts } = await supabase
        .from('conflicts')
        .select('*')
        .eq('active', true)

    if (!conflicts) {
        return null
    }

    // Sort by intensity: alta -> media -> tensione
    const sortOrder: Record<'alta' | 'media' | 'tensione', number> = { alta: 0, media: 1, tensione: 2 }
    const sortedConflicts = [...conflicts].sort(
        (a, b) => sortOrder[a.intensity as 'alta' | 'media' | 'tensione'] - sortOrder[b.intensity as 'alta' | 'media' | 'tensione']
    )

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <Header />

            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className="border-b-4 border-black mb-12">
                    <h1 className="font-serif text-5xl font-black text-black leading-none mb-6 tracking-tight">
                        I Conflitti nel Mondo
                    </h1>
                    <p className="font-serif text-xl text-gray-600 mb-8 max-w-3xl leading-relaxed">
                        Una panoramica costantemente aggiornata dei principali focolai di crisi globale,
                        dalle guerre ad alta intensità alle situazioni di tensione latente.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedConflicts.map((conflict) => (
                        <Link
                            key={conflict.id}
                            href={`/conflitti/${conflict.slug}`}
                            className="group block"
                        >
                            <article className="h-full bg-white border border-gray-200 p-6 flex flex-col transition-all duration-300 hover:border-black hover:shadow-lg hover:-translate-y-1">
                                <div className="mb-4">
                                    <ConflictBadge name={conflict.name} color={conflict.color} />
                                </div>

                                <h2 className="font-serif text-2xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-accent transition-colors">
                                    {conflict.name}
                                </h2>

                                <p className="font-sans text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                                    {conflict.region}
                                </p>

                                <p className="font-serif text-gray-600 leading-relaxed text-base flex-grow mb-6 line-clamp-4">
                                    {conflict.description}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                    <span className="font-sans font-medium text-black underline decoration-1 underline-offset-4 group-hover:decoration-2 transition-all">
                                        Analisi e News →
                                    </span>
                                    {conflict.intensity === 'alta' && (
                                        <span className="flex items-center gap-1.5 text-accent font-sans font-semibold text-[10px] tracking-widest uppercase">
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                            Alta Intensità
                                        </span>
                                    )}
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}
