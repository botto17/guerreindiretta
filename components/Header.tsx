import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="py-6 text-center">
          <Link href="/">
            <h1
              className="text-4xl md:text-5xl font-black tracking-tight text-gray-900"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              GuerreInDiretta
            </h1>
          </Link>
        </div>

        {/* Red line */}
        <div className="h-[2px] bg-accent" />

        {/* Nav */}
        <nav className="flex items-center justify-center gap-8 py-3">
          {[
            { href: '/#mappa', label: 'Mappa' },
            { href: '/conflitti', label: 'Conflitti' },
            { href: '/articoli', label: 'Articoli' },
            { href: '/fonti', label: 'Fonti' },
            { href: '/about', label: 'About' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs font-sans text-gray-500 hover:text-accent transition-colors uppercase tracking-widest"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom border */}
      <div className="border-b border-gray-200" />
    </header>
  )
}
