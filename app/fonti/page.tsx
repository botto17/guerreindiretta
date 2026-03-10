import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Fonti — GuerreInDiretta',
  description: 'Le fonti giornalistiche e di ricerca monitorate da GuerreInDiretta.',
}

export const revalidate = 3600

const tierLabels: Record<number, string> = {
  1: 'Tier 1 — Testate Internazionali',
  2: 'Tier 2 — Media Specializzati',
  3: 'Tier 3 — Think Tank & Ricerca',
  4: 'Tier 4 — Monitoraggio & OSINT',
}

export default async function FontiPage() {
  const { data: sources } = await supabase
    .from('sources')
    .select('*')
    .eq('active', true)
    .order('tier')
    .order('name')

  const grouped = (sources || []).reduce<Record<number, typeof sources>>((acc, s) => {
    if (!s) return acc
    if (!acc[s.tier]) acc[s.tier] = []
    acc[s.tier]!.push(s)
    return acc
  }, {})

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Fonti</h1>
          <p className="font-sans text-gray-500 text-sm">
            {sources?.length || 0} feed RSS monitorati e aggiornati ogni 30 minuti.
          </p>
        </div>

        {Object.entries(grouped).map(([tier, tierSources]) => (
          <section key={tier} className="mb-8">
            <h2 className="font-serif text-sm uppercase tracking-widest text-gray-400 mb-4">
              {tierLabels[Number(tier)] || `Tier ${tier}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(tierSources || []).map((source) => source && (
                <a
                  key={source.id}
                  href={source.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-sm hover:border-accent hover:bg-white transition-all group"
                >
                  <div>
                    <div className="font-sans font-medium text-gray-900 text-sm group-hover:text-accent transition-colors">
                      {source.name}
                    </div>
                    <div className="text-xs text-gray-400 font-sans mt-0.5 truncate max-w-xs">
                      {source.feed_url}
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-accent transition-colors flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  )
}
