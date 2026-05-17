import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MOCK_PAGES, MOCK_CHAPTERS, MOCK_MANGA } from '../constants/manga'

// Lazy-load each page image with IntersectionObserver
function ReaderPage_({ src, index, onVisible }) {
  const ref = useRef()
  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); onVisible?.(index); io.disconnect() }
    }, { rootMargin: '600px' })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [index, onVisible])

  return (
    <div ref={ref} className="relative w-full select-none" style={{ minHeight: visible ? 'auto' : '80vh' }}>
      {!loaded && visible && (
        <div className="absolute inset-0 flex items-center justify-center min-h-[60vh] bg-surface">
          <div className="w-8 h-8 border-2 border-white/10 border-t-neon-blue/80 rounded-full animate-spin" />
        </div>
      )}
      {visible && (
        <img
          src={src}
          alt={'Page ' + (index + 1)}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`w-full h-auto block transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}

export default function ReaderPage() {
  const { mangaId, chapterId } = useParams()
  const navigate = useNavigate()
  const manga = MOCK_MANGA.find(m => m.id === mangaId) || MOCK_MANGA[0]
  const chapterNum = parseInt(chapterId) || 1
  const chapter = MOCK_CHAPTERS.find(c => c.number === chapterNum) || MOCK_CHAPTERS[0]

  const [uiVisible, setUiVisible] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [width, setWidth] = useState('max-w-3xl') // 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl' | 'max-w-full'
  const hideTimer = useRef(null)

  const prevChapter = chapterNum > 1 ? chapterNum - 1 : null
  const nextChapter = chapterNum < MOCK_CHAPTERS.length ? chapterNum + 1 : null
  const progress = Math.round(((currentPage + 1) / MOCK_PAGES.length) * 100)

  const showUI = useCallback(() => {
    setUiVisible(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setUiVisible(false), 3500)
  }, [])

  useEffect(() => {
    showUI()
    return () => clearTimeout(hideTimer.current)
  }, [showUI])

  // Keyboard shortcuts
  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'ArrowLeft' && prevChapter) navigate('/reader/' + mangaId + '/' + prevChapter)
      if (e.key === 'ArrowRight' && nextChapter) navigate('/reader/' + mangaId + '/' + nextChapter)
      if (e.key === 'Escape') navigate('/manga/' + mangaId)
      if (e.key === ' ') { e.preventDefault(); showUI() }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [prevChapter, nextChapter, mangaId, navigate, showUI])

  const widthOptions = [
    { label: 'Narrow', value: 'max-w-2xl' },
    { label: 'Normal', value: 'max-w-3xl' },
    { label: 'Wide', value: 'max-w-4xl' },
    { label: 'Full', value: 'max-w-full' },
  ]

  return (
    <div
      className="min-h-screen bg-[#0a0a0e] relative"
      onMouseMove={showUI}
      onClick={() => { setSettingsOpen(false); showUI() }}
    >
      {/* ── Top bar ───────────────────────────────────── */}
      <AnimatePresence>
        {uiVisible && (
          <motion.header
            initial={{ y: -64 }}
            animate={{ y: 0 }}
            exit={{ y: -64 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 inset-x-0 z-50"
          >
            <div className="bg-void/96 backdrop-blur-xl border-b border-white/6">
              <div className="flex items-center h-14 px-4 gap-4">
                {/* Back */}
                <Link
                  to={'/manga/' + mangaId}
                  className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors flex-none group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-medium hidden sm:block truncate max-w-[120px]">{manga.title}</span>
                </Link>

                <div className="w-px h-5 bg-border flex-none hidden sm:block" />

                {/* Chapter selector */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xs text-text-muted font-mono hidden sm:block flex-none">Ch.</span>
                  <select
                    value={chapterNum}
                    onChange={e => navigate('/reader/' + mangaId + '/' + e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className="bg-surface-2 border border-border text-text-primary text-xs font-mono px-2 py-1.5 rounded-sm outline-none cursor-pointer max-w-[180px]"
                  >
                    {MOCK_CHAPTERS.map(c => (
                      <option key={c.id} value={c.number}>
                        Ch.{c.number} — {c.title.split(':')[1]?.trim() || c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Page info */}
                <span className="text-xs font-mono text-text-muted flex-none hidden sm:block">
                  {currentPage + 1} / {MOCK_PAGES.length}
                </span>

                {/* Width picker */}
                <div className="relative flex-none" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setSettingsOpen(p => !p)}
                    className={`p-2 rounded-sm transition-colors ${settingsOpen ? 'text-neon-blue bg-neon-blue/10' : 'text-text-secondary hover:text-text-primary hover:bg-white/6'}`}
                    title="Reader settings"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {settingsOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-void/98 backdrop-blur-xl border border-border rounded-[4px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
                      >
                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-3">Page Width</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {widthOptions.map(o => (
                            <button
                              key={o.value}
                              onClick={() => { setWidth(o.value); setSettingsOpen(false) }}
                              className={`py-1.5 text-xs font-mono rounded-sm transition-colors ${width === o.value ? 'bg-neon-blue/15 border border-neon-blue/40 text-neon-blue' : 'bg-surface-2 border border-border text-text-muted hover:text-text-secondary'}`}
                            >
                              {o.label}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mt-4 mb-2">Shortcuts</p>
                        <div className="space-y-1">
                          {[['←', 'Prev chapter'], ['→', 'Next chapter'], ['Esc', 'Back to manga']].map(([k, v]) => (
                            <div key={k} className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-text-muted">{v}</span>
                              <kbd className="text-[9px] font-mono bg-surface-3 border border-border px-1.5 py-0.5 rounded text-text-muted">{k}</kbd>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-0.5 bg-surface-3 relative">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-blue to-neon-violet"
                  animate={{ width: progress + '%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ── Pages ─────────────────────────────────────── */}
      <div className={`mx-auto pt-14 ${width}`}>
        {MOCK_PAGES.map((page, i) => (
          <ReaderPage_
            key={page.id}
            src={'https://picsum.photos/seed/reader_ch' + chapterNum + '_p' + i + '/800/1200'}
            index={i}
            onVisible={(idx) => setCurrentPage(idx)}
          />
        ))}

        {/* ── End of chapter ─────────────────────────── */}
        <div className="flex flex-col items-center justify-center py-20 px-4 border-t border-border/40 mt-2">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent mb-6" />
          <p className="text-xs font-mono text-neon-blue tracking-[0.25em] uppercase mb-1">End of Chapter {chapterNum}</p>
          <h3 className="text-lg font-display font-bold text-text-primary mb-1 text-center">{chapter?.title}</h3>
          <p className="text-sm text-text-muted mb-8 font-mono">{manga.title}</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {prevChapter && (
              <Link
                to={'/reader/' + mangaId + '/' + prevChapter}
                className="flex items-center gap-2 px-5 py-3 bg-surface-2 border border-border text-text-secondary text-sm rounded-sm hover:border-border-glow hover:text-text-primary transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Ch.{prevChapter}
              </Link>
            )}
            <Link
              to={'/manga/' + mangaId}
              className="flex items-center gap-2 px-5 py-3 bg-surface-2 border border-border text-text-secondary text-sm rounded-sm hover:border-border-glow hover:text-text-primary transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              All Chapters
            </Link>
            {nextChapter ? (
              <Link
                to={'/reader/' + mangaId + '/' + nextChapter}
                className="flex items-center gap-2 px-6 py-3 bg-neon-blue text-void font-display font-bold text-sm rounded-sm hover:bg-blue-400 transition-colors shadow-neon-blue"
              >
                Ch.{nextChapter}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            ) : (
              <Link
                to={'/manga/' + mangaId}
                className="flex items-center gap-2 px-6 py-3 bg-neon-blue text-void font-display font-bold text-sm rounded-sm hover:bg-blue-400 transition-colors shadow-neon-blue"
              >
                Finished — Back to Details
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────── */}
      <AnimatePresence>
        {uiVisible && (
          <motion.footer
            initial={{ y: 56 }}
            animate={{ y: 0 }}
            exit={{ y: 56 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 inset-x-0 z-50 bg-void/96 backdrop-blur-xl border-t border-white/6"
          >
            <div className={`flex items-center justify-between h-12 px-4 mx-auto ${width}`}>
              <button
                onClick={() => prevChapter && navigate('/reader/' + mangaId + '/' + prevChapter)}
                disabled={!prevChapter}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary disabled:opacity-25 hover:text-text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                <span className="hidden sm:block font-mono text-xs">Ch.{prevChapter}</span>
              </button>

              <span className="text-xs font-mono text-text-muted">
                Page {currentPage + 1} / {MOCK_PAGES.length} · {progress}%
              </span>

              <button
                onClick={() => nextChapter && navigate('/reader/' + mangaId + '/' + nextChapter)}
                disabled={!nextChapter}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary disabled:opacity-25 hover:text-text-primary transition-colors"
              >
                <span className="hidden sm:block font-mono text-xs">Ch.{nextChapter}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  )
}
