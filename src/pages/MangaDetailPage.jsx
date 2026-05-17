import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MOCK_MANGA, MOCK_CHAPTERS } from '../constants/manga'
import { useBookmarkStore } from '../store/useAuthStore'

const MOCK_COMMENTS = [
  { id: 1, user: 'CyberReader99', avatar: 'CR', text: 'Absolutely a masterpiece. The art style in chapter 15 completely blew my mind — nothing else comes close this season.', likes: 142, time: '2h ago', liked: false },
  { id: 2, user: 'NeonWatcher', avatar: 'NW', text: 'The plot twist in the latest chapter is insane. Did NOT see that coming. The author is playing 4D chess with us.', likes: 87, time: '5h ago', liked: true },
  { id: 3, user: 'VoidPilot', avatar: 'VP', text: 'Been following since chapter 1. The character development over 200+ chapters is unmatched. This is generational manga.', likes: 63, time: '1d ago', liked: false },
  { id: 4, user: 'SakuraStar', avatar: 'SS', text: 'Just caught up in three days. No regrets, zero sleep, fully worth it.', likes: 41, time: '2d ago', liked: false },
]

function StarIcon({ filled }) {
  return (
    <svg className="w-4 h-4" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 20 20" stroke="currentColor" strokeWidth={filled ? 0 : 1}>
      <path className="text-yellow-400" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

export default function MangaDetailPage() {
  const { id } = useParams()
  const manga = MOCK_MANGA.find(m => m.id === id) || MOCK_MANGA[0]
  const [chaptersExpanded, setChaptersExpanded] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(MOCK_COMMENTS)
  const [likedComments, setLikedComments] = useState(new Set([2]))
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore()
  const bookmarked = isBookmarked(manga.id)

  const displayChapters = chaptersExpanded ? MOCK_CHAPTERS : MOCK_CHAPTERS.slice(0, 10)
  const stars = Math.round((manga.rating / 10) * 5)

  const toggleLike = (commentId) => {
    setLikedComments(prev => {
      const next = new Set(prev)
      next.has(commentId) ? next.delete(commentId) : next.add(commentId)
      return next
    })
  }

  const postComment = () => {
    if (!comment.trim()) return
    setComments(prev => [{
      id: Date.now(), user: 'You', avatar: 'YO', text: comment.trim(),
      likes: 0, time: 'Just now', liked: false
    }, ...prev])
    setComment('')
  }

  return (
    <div className="min-h-screen pt-16">
      {/* ── Cinematic backdrop ─────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(300px, 42vh, 480px)' }}>
        <img
          src={manga.coverWide || manga.cover}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(2px) saturate(0.6)', transform: 'scale(1.06)' }}
        />
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-void/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
        {/* Accent color tint */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at 70% 40%, ' + (manga.accentColor || '#4da6ff') + '50 0%, transparent 60%)' }}
        />
      </div>

      {/* ── Main content overlapping banner ─────────────── */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10 -mt-64 relative z-10">

        {/* ── Hero info block ──────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mb-12">

          {/* Cover poster */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex-none"
          >
            <div className="relative">
              {/* Glow under cover */}
              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-16 blur-2xl opacity-40 rounded-full"
                style={{ background: manga.accentColor || '#4da6ff' }}
              />
              <img
                src={manga.cover}
                alt={manga.title}
                className="relative w-44 sm:w-52 lg:w-56 rounded-[4px] shadow-[0_24px_64px_rgba(0,0,0,0.8)] border border-white/10"
              />
              {/* Corner accents */}
              {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((c, i) => (
                <div key={i} className={`absolute w-5 h-5 ${c}`} style={{ borderColor: manga.accentColor || '#4da6ff' }} />
              ))}
            </div>
          </motion.div>

          {/* Text info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 min-w-0 pt-44 lg:pt-0"
          >
            {/* Status + badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs font-mono px-2 py-0.5 rounded-sm ${manga.status === 'ongoing' ? 'status-ongoing' : manga.status === 'completed' ? 'status-completed' : 'status-hiatus'}`}>
                {manga.status?.toUpperCase()}
              </span>
              {manga.isNew && <span className="text-xs font-display font-bold bg-neon-blue text-void px-2 py-0.5 rounded-sm">NEW</span>}
              {manga.isTrending && <span className="text-xs font-display font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2 py-0.5 rounded-sm">TRENDING</span>}
            </div>

            <h1 className="font-display font-black text-text-primary leading-tight mb-1" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              {manga.title}
            </h1>
            <p className="text-sm font-jp text-text-muted mb-4 tracking-widest opacity-70">{manga.titleJp}</p>

            {/* Star rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={i <= stars ? 'text-yellow-400' : 'text-surface-3'}>
                    <StarIcon filled={i <= stars} />
                  </span>
                ))}
              </div>
              <span className="font-mono font-bold text-yellow-400">{manga.rating}</span>
              <span className="text-text-muted text-xs font-mono">/ 10</span>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-5 mb-5 text-sm">
              {[
                { label: 'Author', val: manga.author },
                { label: 'Chapters', val: manga.chapters },
                { label: 'Views', val: manga.views },
                { label: 'Updated', val: manga.updatedAt },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="font-semibold text-text-primary">{val}</p>
                </div>
              ))}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {manga.genres?.map(g => (
                <Link
                  key={g}
                  to={'/catalog?genre=' + g}
                  className="px-2.5 py-1 text-xs font-mono bg-surface-3 border border-border text-text-secondary rounded-sm hover:border-neon-blue/40 hover:text-neon-blue transition-all"
                >
                  {g}
                </Link>
              ))}
            </div>

            {/* Description */}
            <p className="text-text-secondary leading-relaxed mb-7 max-w-2xl">{manga.description}</p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                to={'/reader/' + manga.id + '/1'}
                className="flex items-center gap-2.5 px-7 py-3.5 bg-white text-void font-display font-bold text-sm rounded-sm hover:bg-white/90 transition-colors shadow-lg"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                Read Now
              </Link>
              <button
                onClick={() => bookmarked ? removeBookmark(manga.id) : addBookmark(manga)}
                className={`flex items-center gap-2.5 px-6 py-3.5 border font-medium text-sm rounded-sm transition-all ${
                  bookmarked
                    ? 'bg-neon-blue/12 border-neon-blue/50 text-neon-blue'
                    : 'bg-surface-2 border-border text-text-secondary hover:border-border-glow hover:text-text-primary'
                }`}
              >
                <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {bookmarked ? 'Saved' : 'Save'}
              </button>
              <button className="flex items-center gap-2.5 px-5 py-3.5 bg-surface-2 border border-border text-text-secondary text-sm rounded-sm hover:border-border-glow hover:text-text-primary transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── Two-column layout ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* Left: chapters + comments */}
          <div>
            {/* ── Chapter list ─────────────────────────── */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="section-label">Contents</div>
                  <h2 className="text-xl font-display font-bold text-text-primary">Chapters</h2>
                  <span className="text-xs font-mono text-text-muted">({MOCK_CHAPTERS.length})</span>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs font-mono text-text-muted hover:text-text-secondary transition-colors">Oldest First</button>
                </div>
              </div>

              <div className="space-y-1.5">
                {displayChapters.map((ch, i) => (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.025, 0.3) }}
                  >
                    <Link
                      to={'/reader/' + manga.id + '/' + ch.number}
                      className="flex items-center gap-4 px-4 py-3.5 bg-surface-card border border-border rounded-[4px] hover:border-neon-blue/25 hover:bg-surface-2 transition-all duration-200 group"
                    >
                      <span className="text-xs font-mono text-text-muted w-10 flex-none text-right">{ch.number}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors line-clamp-1">
                          {ch.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] font-mono text-text-muted flex-none">
                        <span className="hidden sm:block">{ch.pages}p</span>
                        <span className="hidden sm:block">{ch.views}</span>
                        <span>{ch.uploadedAt}</span>
                        <svg className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-neon-blue transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {MOCK_CHAPTERS.length > 10 && (
                <button
                  onClick={() => setChaptersExpanded(v => !v)}
                  className="mt-3 w-full py-3 bg-surface-2 border border-border rounded-[4px] text-sm text-text-secondary hover:text-text-primary hover:border-border-glow transition-all font-medium"
                >
                  {chaptersExpanded ? 'Show Less' : 'Show All ' + MOCK_CHAPTERS.length + ' Chapters'}
                </button>
              )}
            </div>

            {/* ── Comments ─────────────────────────────── */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="section-label">Community</div>
                <h2 className="text-xl font-display font-bold text-text-primary">Discussion</h2>
                <span className="text-xs font-mono text-text-muted">({comments.length})</span>
              </div>

              {/* Comment form */}
              <div className="flex gap-3 mb-7">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center text-void text-xs font-bold flex-none shadow-inner-top">
                  YO
                </div>
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="w-full px-4 py-3 bg-surface-2 border border-border rounded-[4px] text-sm text-text-primary placeholder-text-muted outline-none focus:border-neon-blue/40 focus:ring-1 focus:ring-neon-blue/10 transition-all resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={postComment}
                      disabled={!comment.trim()}
                      className="px-4 py-2 bg-neon-blue/12 border border-neon-blue/30 text-neon-blue text-sm font-medium rounded-sm hover:bg-neon-blue/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>

              {/* Comment list */}
              <div className="space-y-4">
                {comments.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-white text-[10px] font-bold flex-none">
                      {c.avatar}
                    </div>
                    <div className="flex-1 bg-surface-card border border-border rounded-[4px] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-text-primary">{c.user}</span>
                        <span className="text-xs text-text-muted font-mono">{c.time}</span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed mb-3">{c.text}</p>
                      <button
                        onClick={() => toggleLike(c.id)}
                        className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${likedComments.has(c.id) ? 'text-neon-blue' : 'text-text-muted hover:text-text-secondary'}`}
                      >
                        <svg className="w-3.5 h-3.5" fill={likedComments.has(c.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {c.likes + (likedComments.has(c.id) ? 1 : 0)}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right sidebar ─────────────────────────────── */}
          <div className="space-y-6">
            {/* Quick start */}
            <div className="bg-surface-card border border-border rounded-[4px] p-5">
              <h3 className="text-sm font-display font-bold text-text-primary mb-4">Quick Start</h3>
              <div className="space-y-2">
                <Link to={'/reader/' + manga.id + '/1'} className="flex items-center justify-between p-3 bg-surface-2 rounded-sm hover:bg-surface-3 transition-colors group">
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">First Chapter</span>
                  <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
                <Link to={'/reader/' + manga.id + '/' + manga.chapters} className="flex items-center justify-between p-3 bg-neon-blue/8 border border-neon-blue/20 rounded-sm hover:bg-neon-blue/12 transition-colors group">
                  <span className="text-sm text-neon-blue">Latest Chapter</span>
                  <svg className="w-3.5 h-3.5 text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>

            {/* Similar manga */}
            <div className="bg-surface-card border border-border rounded-[4px] p-5">
              <h3 className="text-sm font-display font-bold text-text-primary mb-4">You May Also Like</h3>
              <div className="space-y-3">
                {MOCK_MANGA.filter(m => m.id !== manga.id && m.genres?.some(g => manga.genres?.includes(g))).slice(0, 4).map(m => (
                  <Link key={m.id} to={'/manga/' + m.id} className="flex gap-3 group">
                    <img src={m.cover} alt={m.title} className="w-10 h-14 object-cover rounded-sm flex-none" />
                    <div className="flex-1 min-w-0 py-0.5">
                      <p className="text-sm font-semibold text-text-primary group-hover:text-neon-blue transition-colors line-clamp-1 mb-0.5">{m.title}</p>
                      <p className="text-xs text-text-muted font-mono">{m.genres?.[0]}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span className="text-xs font-mono text-yellow-400">{m.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Info card */}
            <div className="bg-surface-card border border-border rounded-[4px] p-5">
              <h3 className="text-sm font-display font-bold text-text-primary mb-4">Details</h3>
              <div className="space-y-3">
                {[
                  { k: 'Author', v: manga.author },
                  { k: 'Status', v: manga.status },
                  { k: 'Chapters', v: String(manga.chapters) },
                  { k: 'Total Reads', v: manga.views },
                  { k: 'Rating', v: manga.rating + ' / 10' },
                ].map(({ k, v }) => (
                  <div key={k} className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
                    <span className="text-xs font-mono text-text-muted uppercase tracking-wide">{k}</span>
                    <span className="text-xs font-semibold text-text-primary">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
