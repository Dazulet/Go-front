import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeInUp, staggerContainer, staggerItem, floatAnimation } from '@/animations/variants'
import GlassButton from '@/components/ui/GlassButton'

export default function HeroSection({ featured = [] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const current = featured[activeIdx] || featured[0]

  useEffect(() => {
    if (featured.length <= 1) return
    const interval = setInterval(() => {
      setTransitioning(true)
      setTimeout(() => {
        setActiveIdx(i => (i + 1) % featured.length)
        setTransitioning(false)
      }, 300)
    }, 6000)
    return () => clearInterval(interval)
  }, [featured.length])

  if (!current) return null

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* BG Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 -z-10"
        >
          <img
            src={current.cover}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-void via-void/85 to-void/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/60" />
        </motion.div>
      </AnimatePresence>

      {/* Ambient glow from cover color */}
      <motion.div
        key={current.id + '-glow'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute right-0 top-0 bottom-0 w-1/2 -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at right center, ${current.color}22 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-8 py-20">
        <div className="max-w-2xl">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-purple/15 border border-neon-purple/30 text-xs font-display font-semibold text-neon-purple tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
              Featured
            </span>
            <span className="text-ink-dim text-xs font-mono">
              {String(activeIdx + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
            </span>
          </motion.div>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-display text-5xl md:text-7xl font-bold text-ink-white leading-none mb-2 tracking-tight">
                {current.title}
              </h1>
              <p className="font-japanese text-ink-muted text-lg mb-6">{current.titleJp}</p>
            </motion.div>
          </AnimatePresence>

          {/* Metadata */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mb-6"
          >
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className={`w-4 h-4 ${s <= Math.round(current.rating / 2) ? 'text-warning' : 'text-ink-dim'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="text-ink-white font-bold font-mono text-sm">{current.rating}</span>
            </div>

            {/* Divider */}
            <span className="w-px h-4 bg-glass-bright" />

            {/* Chapters */}
            <span className="text-sm text-ink-muted flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20.5l-3-3H4a2 2 0 01-2-2V4a2 2 0 012-2h16a2 2 0 012 2v11a2 2 0 01-2 2h-5l-3 3z"/>
              </svg>
              <span className="font-mono font-bold text-ink-base">{current.chapters}</span> chapters
            </span>

            {/* Views */}
            <span className="text-sm text-ink-muted flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span className="font-mono font-bold text-ink-base">{current.views}</span>
            </span>

            {/* Year */}
            <span className="text-sm text-ink-muted font-mono">{current.year}</span>
          </motion.div>

          {/* Genres */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {current.genres.map(g => (
              <span
                key={g}
                className="tag bg-surface border border-glass-bright text-ink-base"
              >
                {g}
              </span>
            ))}
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-ink-muted text-base leading-relaxed mb-10 max-w-lg"
          >
            {current.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            <Link to={`/manga/${current.id}`}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 h-12 px-6 rounded-xl bg-neon-purple text-white font-display font-semibold text-base tracking-wide hover:bg-neon-purple/90 transition-colors shadow-neon-purple"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Start Reading
              </motion.button>
            </Link>

            <Link to={`/manga/${current.id}`}>
              <GlassButton variant="secondary" size="lg" icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              }>
                More Info
              </GlassButton>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating cover card */}
      <motion.div
        {...floatAnimation}
        className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 40, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: '1000px' }}
          >
            <div className="relative w-52 group" style={{ transformStyle: 'preserve-3d' }}>
              <img
                src={current.cover}
                alt={current.title}
                className="w-52 h-72 object-cover rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
              />
              {/* Reflection */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent" />
              {/* Glow */}
              <div
                className="absolute -inset-4 -z-10 rounded-3xl blur-2xl"
                style={{ background: `radial-gradient(ellipse, ${current.color}30 0%, transparent 70%)` }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Slider dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={clsx(
              'transition-all duration-300 rounded-full',
              i === activeIdx
                ? 'w-8 h-1.5 bg-neon-purple'
                : 'w-1.5 h-1.5 bg-ink-dim hover:bg-ink-muted'
            )}
          />
        ))}
      </div>
    </section>
  )
}

function clsx(...args) {
  return args.filter(Boolean).join(' ')
}
