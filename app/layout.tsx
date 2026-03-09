import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Guerre Indiretta — Conflitti nel Mondo',
  description: 'Aggregatore automatico di notizie sui conflitti armati e le crisi geopolitiche nel mondo. Aggiornato ogni 30 minuti.',
  keywords: 'guerre, conflitti, geopolitica, news, mondo, mappa',
  openGraph: {
    title: 'Guerre Indiretta',
    description: 'Mappa e news sui conflitti nel mondo',
    type: 'website',
    locale: 'it_IT',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream min-h-screen">
        {children}
      </body>
    </html>
  )
}
