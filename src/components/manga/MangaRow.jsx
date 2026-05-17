import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MangaCardSmall } from './MangaCard'

export default function MangaRow({ label, title, manga = [], linkTo, badge }) {
  const rowRef = useRef(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  const updateArrows = () => {
    const el = rowRef.current
    if (!el) return
    setShowLeft(el.scrollLeft > 20)
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20)
  }

  useEffect(() => {
    const el = rowRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', updateArrows); ro.disconnect() }
  }, [manga])

  const scroll = (dir) => {
    rowRef.current?.scrollBy({ left: dir * 620, behavior: 'smooth' })
  }

  if (!manga.length) return null

  return (
    <section>
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-10 flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="section-label">{label}</div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-text-primary">{title}</h2>
          {badge && (
            <span className="text-[9px] font-display font-black bg-red-500 text-white px-1.5 py-0.5 rounded-sm animate-pulse-soft">
              {badge}
            </span>
          )}
        </div>
        {linkTo && (
          <Link
            to={linkTo}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-neon-blue transition-colors font-mono group"
          >
            See All
            <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Scroll container with edge fades */}
      <div className="relative">
        {/* Left edge fade */}
        <div
          className="absolute left-0 top-0 bottom-4 w-16 sm:w-24 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'linear-gradient(90deg, rgba(8,8,15,1) 0%, transparent 100%)',
            opacity: showLeft ? 1 : 0,
          }}
        />
        {/* Right edge fade */}
        <div
          className="absolute right-0 top-0 bottom-4 w-16 sm:w-24 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'linear-gradient(270deg, rgba(8,8,15,1) 0%, transparent 100%)',
            opacity: showRight ? 1 : 0,
          }}
        />

        {/* Left arrow */}
        {showLeft && (
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => scroll(-1)}
            className="hidden sm:flex row-nav-btn left-2 z-20"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        )}

        {/* Right arrow */}
        {showRight && (
          <motion.button
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => scroll(1)}
            className="hidden sm:flex row-nav-btn right-2 z-20"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        )}

        {/* Scrollable row */}
        <div
          ref={rowRef}
          className="scroll-row pl-4 sm:pl-6 lg:pl-10 pr-4 sm:pr-6 lg:pr-10"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {manga.map((m, i) => (
            <div key={m.id} style={{ scrollSnapAlign: 'start' }}>
              <MangaCardSmall manga={m} index={i} />
            </div>
          ))}
          {/* Spacer so last card isn't hidden under right fade */}
          <div className="flex-none w-4" />
        </div>
      </div>
    </section>
  )
}
