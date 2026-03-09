import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-2 h-8 bg-accent" />
            <span className="font-serif text-xl font-bold uppercase tracking-widest text-white">
              Guerre Indiretta
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: '/#mappa', label: 'Mappa' },
              { href: '/conflitti', label: 'Conflitti' },
              { href: '/fonti', label: 'Fonti' },
              { href: '/about', label: 'About' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-sans text-gray-300 hover:text-white transition-colors uppercase tracking-wide"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-gray-400 font-sans">Live</span>
          </div>
        </div>
      </div>
    </header>
  )
}
