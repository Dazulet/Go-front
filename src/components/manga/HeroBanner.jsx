import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MOCK_MANGA } from '../../constants/manga'

const FEATURED = MOCK_MANGA.filter(m => m.isTrending).slice(0, 5)

function StarIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

export default function HeroBanner() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setActive(i => (i + 1) % FEATURED.length), [])
  const prev = useCallback(() => setActive(i => (i - 1 + FEATURED.length) % FEATURED.length), [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [paused, next])

  const manga = FEATURED[active]

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(480px, 70vh, 720px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background slides */}
      <AnimatePresence mode="sync">
        <motion.div
          key={manga.id + '-bg'}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={manga.coverWide || manga.cover}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Multi-layer cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-gradient-hero-bottom" />
          {/* Subtle vignette */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 50%, transparent 30%, rgba(8,8,15,0.6) 100%)' }} />
          {/* Color tint from manga accent */}
          <div
            className="absolute inset-0 opacity-15"
            style={{ background: 'radial-gradient(ellipse at 70% 40%, ' + (manga.accentColor || '#4da6ff') + '30 0%, transparent 65%)' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end pb-16 sm:pb-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 w-full">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={manga.id + '-content'}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <StarIcon />
                    <span className="text-sm font-mono font-bold text-yellow-400">{manga.rating}</span>
                  </div>
                  <span className="text-text-muted text-xs">•</span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-sm ${manga.status === 'ongoing' ? 'status-ongoing' : 'status-completed'}`}>
                    {manga.status}
                  </span>
                  <span className="text-text-muted text-xs">•</span>
                  <span className="text-xs text-text-muted font-mono">{manga.chapters} chapters</span>
                  <span className="text-text-muted text-xs">•</span>
                  <span className="text-xs text-text-muted font-mono">{manga.views} reads</span>
                </div>

                {/* Title */}
                <h1 className="font-display font-black text-text-primary leading-[0.95] mb-2 text-balance"
                  style={{ fontSize: 'clamp(2.2rem, 6vw, 4.2rem)' }}>
                  {manga.title}
                </h1>
                <p className="text-sm font-jp text-text-muted mb-4 tracking-widest opacity-70">{manga.titleJp}</p>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {manga.genres?.map(g => (
                    <span key={g} className="text-[11px] font-mono text-text-secondary bg-white/6 border border-white/10 px-2.5 py-1 rounded-sm">
                      {g}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-7 max-w-xl line-clamp-3">
                  {manga.description}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={'/manga/' + manga.id}
                    className="group flex items-center gap-2.5 px-6 py-3.5 bg-white text-void font-display font-bold text-sm tracking-wide rounded-sm hover:bg-white/90 transition-colors shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Read Now
                  </Link>
                  <Link
                    to={'/manga/' + manga.id}
                    className="flex items-center gap-2.5 px-6 py-3.5 bg-white/10 backdrop-blur-sm border border-white/15 text-text-primary font-medium text-sm rounded-sm hover:bg-white/15 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    More Info
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {FEATURED.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`transition-all duration-400 rounded-full ${i === active ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>

      {/* Side arrows — desktop */}
      <button onClick={prev} className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10 rounded-full text-white hover:bg-black/60 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={next} className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10 rounded-full text-white hover:bg-black/60 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-void to-transparent z-[5] pointer-events-none" />
    </div>
  )
}
