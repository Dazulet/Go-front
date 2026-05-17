import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const LINKS = {
  Platform: [
    { label: 'Home', to: '/' },
    { label: 'Catalog', to: '/catalog' },
    { label: 'Trending', to: '/catalog?sort=trending' },
    { label: 'New Releases', to: '/catalog?sort=newest' },
    { label: 'Top Rated', to: '/catalog?sort=rating' },
  ],
  Account: [
    { label: 'Sign In', to: '/login' },
    { label: 'Register', to: '/register' },
    { label: 'Profile', to: '/profile' },
    { label: 'Bookmarks', to: '/profile' },
  ],
  Genres: [
    { label: 'Action', to: '/catalog?genre=Action' },
    { label: 'Fantasy', to: '/catalog?genre=Fantasy' },
    { label: 'Romance', to: '/catalog?genre=Romance' },
    { label: 'Sci-Fi', to: '/catalog?genre=Sci-Fi' },
    { label: 'Horror', to: '/catalog?genre=Horror' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-neon-blue/4 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="relative w-7 h-7 flex-none">
                <div className="absolute inset-[3px] bg-gradient-to-br from-neon-blue to-neon-violet rounded-[2px] rotate-12" />
                <span className="absolute inset-0 flex items-center justify-center text-void font-display font-black text-xs">M</span>
              </div>
              <span className="font-display font-bold text-sm tracking-[0.12em] text-text-primary">
                MANGA<span className="text-neon-blue">VERSE</span>
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed mb-5 max-w-[220px]">
              The next generation manga reading platform. Infinite worlds, one place.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z', label: 'Twitter' },
                { icon: 'M21 2H3v16l4-4h14V2zm-9 12H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V4h10v2z', label: 'Discord' },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center bg-surface-2 border border-border rounded-sm text-text-muted hover:text-neon-blue hover:border-neon-blue/30 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-[10px] font-display font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-mono text-text-muted">
            © 2024 MangaVerse. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'DMCA'].map(l => (
              <a key={l} href="#" className="text-xs text-text-muted hover:text-text-secondary transition-colors font-mono">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
