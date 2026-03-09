import type { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'About — Guerre Indiretta',
  description: 'Come funziona Guerre Indiretta.',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">About</h1>
        </div>

        <div className="prose prose-sm max-w-none font-sans text-gray-700 space-y-4">
          <p>
            <strong className="font-serif">Guerre Indiretta</strong> è un aggregatore automatico di notizie
            sui conflitti armati e le crisi geopolitiche nel mondo.
          </p>
          <p>
            Il sistema monitora <strong>20 fonti internazionali</strong> — testate giornalistiche, think tank
            e centri di ricerca — e aggiorna automaticamente la mappa e le notizie ogni 30 minuti.
          </p>
          <h2 className="font-serif text-lg font-bold text-gray-900 mt-6 mb-2">Come funziona</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>I feed RSS vengono parsati ogni 30 minuti</li>
            <li>Ogni notizia viene classificata per conflitto tramite keyword matching</li>
            <li>La mappa SVG mostra in tempo reale i 15 conflitti attivi monitorati</li>
            <li>I dati sui conflitti provengono da <a href="https://acleddata.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">ACLED</a></li>
          </ul>
          <h2 className="font-serif text-lg font-bold text-gray-900 mt-6 mb-2">Conflitti monitorati</h2>
          <p>
            Attualmente monitoriamo 15 conflitti attivi nel mondo, classificati per intensità:
            alta intensità, media intensità e zone di tensione.
          </p>
          <h2 className="font-serif text-lg font-bold text-gray-900 mt-6 mb-2">Disclaimer</h2>
          <p>
            Questo sito aggrega notizie da fonti terze. Non siamo responsabili del contenuto
            degli articoli linkati. Le classificazioni di intensità sono indicative.
          </p>
        </div>
      </main>
    </>
  )
}
