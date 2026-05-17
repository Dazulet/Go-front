import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useBookmarkStore } from '../../store/useAuthStore'

// ── Tilt-on-hover 3D effect (lightweight, no WebGL)
function useTilt(strength = 12) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 300, damping: 30 })

  const onMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onMouseLeave = () => { x.set(0); y.set(0) }

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave }
}

// ── Small card used in horizontal rows (poster ratio 2:3)
export function MangaCardSmall({ manga, index = 0 }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore()
  const bookmarked = isBookmarked(manga.id)
  const tilt = useTilt(8)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.4) }}
      className="flex-none w-[148px] sm:w-[164px] group perspective-1000"
    >
      <Link to={'/manga/' + manga.id}>
        <motion.div
          ref={tilt.ref}
          style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: 'preserve-3d' }}
          onMouseMove={tilt.onMouseMove}
          onMouseLeave={tilt.onMouseLeave}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.25 }}
          className="manga-poster aspect-[2/3] mb-2.5 shadow-poster cursor-pointer"
        >
          {/* Skeleton */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-surface-3 animate-pulse">
              <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer" />
            </div>
          )}
          <img
            src={manga.cover}
            alt={manga.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
          />

          {/* Gradient overlay — always present for readability */}
          <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[3]" />

          {/* Hover info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 z-[4] translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex flex-wrap gap-1 mb-1.5">
              {manga.genres?.slice(0, 2).map(g => (
                <span key={g} className="text-[9px] font-mono bg-black/60 backdrop-blur-sm text-white/80 px-1.5 py-0.5 rounded-sm border border-white/10">{g}</span>
              ))}
            </div>
          </div>

          {/* Top badges */}
          <div className="absolute top-2 left-2 z-[4] flex flex-col gap-1">
            {manga.isNew && (
              <span className="text-[9px] font-display font-bold bg-neon-blue text-void px-1.5 py-0.5 rounded-sm leading-none">NEW</span>
            )}
            {manga.isTrending && !manga.isNew && (
              <span className="text-[9px] font-display font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white px-1.5 py-0.5 rounded-sm leading-none">HOT</span>
            )}
          </div>

          {/* Bookmark */}
          <button
            onClick={(e) => { e.preventDefault(); bookmarked ? removeBookmark(manga.id) : addBookmark(manga) }}
            className={`absolute top-2 right-2 z-[4] w-7 h-7 flex items-center justify-center rounded-sm transition-all duration-200 opacity-0 group-hover:opacity-100 ${bookmarked ? 'bg-neon-blue text-void' : 'bg-black/70 backdrop-blur-sm text-white hover:bg-neon-blue/80'}`}
          >
            <svg className="w-3.5 h-3.5" fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          {/* Shine effect */}
          <div className="absolute inset-0 z-[5] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
        </motion.div>

        {/* Text below */}
        <div className="px-0.5">
          <h3 className="text-[13px] font-body font-semibold text-text-primary leading-snug line-clamp-1 group-hover:text-neon-blue transition-colors duration-200 mb-0.5">{manga.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted font-mono">Ch.{manga.chapters}</span>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="text-[11px] font-mono text-yellow-400 font-medium">{manga.rating}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Large card for grid view in Catalog
export default function MangaCard({ manga, index = 0 }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore()
  const bookmarked = isBookmarked(manga.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
    >
      <Link to={'/manga/' + manga.id}>
        <div className="manga-poster aspect-[2/3] mb-3 shadow-card group-hover:shadow-card-hover transition-shadow duration-400">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-surface-3">
              <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer" />
            </div>
          )}
          <img
            src={manga.cover}
            alt={manga.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-[1.06]`}
          />

          {/* Full gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-card-full opacity-0 group-hover:opacity-100 transition-opacity duration-350 z-[3]" />

          {/* Hover content */}
          <div className="absolute inset-x-0 bottom-0 p-4 z-[4] translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {manga.genres?.slice(0, 2).map(g => (
                <span key={g} className="text-[10px] font-mono text-white/70 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-sm border border-white/10">{g}</span>
              ))}
            </div>
            <p className="text-xs text-white/70 leading-relaxed line-clamp-2">{manga.description}</p>
          </div>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-[4] flex flex-col gap-1.5">
            {manga.isNew && <span className="text-[10px] font-display font-bold bg-neon-blue text-void px-2 py-0.5 rounded-sm">NEW</span>}
            {manga.isTrending && <span className="text-[10px] font-display font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2 py-0.5 rounded-sm">TRENDING</span>}
          </div>

          {/* Bookmark */}
          <button
            onClick={(e) => { e.preventDefault(); bookmarked ? removeBookmark(manga.id) : addBookmark(manga) }}
            className={`absolute top-2.5 right-2.5 z-[4] w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-200 opacity-0 group-hover:opacity-100 ${bookmarked ? 'bg-neon-blue text-void' : 'bg-black/70 backdrop-blur-sm text-white hover:bg-neon-blue/80'}`}
          >
            <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          {/* Border glow on hover */}
          <div className="absolute inset-0 rounded-[4px] ring-0 group-hover:ring-1 ring-neon-blue/30 transition-all duration-300 pointer-events-none z-[6]" />
        </div>

        <div>
          <h3 className="font-body font-semibold text-sm text-text-primary group-hover:text-neon-blue transition-colors duration-200 line-clamp-1 mb-1">{manga.title}</h3>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm ${manga.status === 'ongoing' ? 'status-ongoing' : manga.status === 'completed' ? 'status-completed' : 'status-hiatus'}`}>
              {manga.status}
            </span>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="text-xs font-mono text-yellow-400 font-medium">{manga.rating}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
