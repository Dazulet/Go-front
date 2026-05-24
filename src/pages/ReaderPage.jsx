import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { mangaService, getImageUrl } from '../services/api'

// Компонент одной страницы с ленивой загрузкой
function ReaderPage_({ src, index, onVisible }) {
  const ref = useRef()
  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { 
        setVisible(true)
        onVisible?.(index)
        io.disconnect() 
      }
    }, { rootMargin: '800px' }) // Загружаем заранее за 800px
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [index, onVisible])

  return (
    <div ref={ref} className="relative w-full select-none min-h-[60vh] bg-white/5 mb-2">
      {!loaded && visible && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/10 border-t-neon-blue rounded-full animate-spin" />
        </div>
      )}
      {visible && (
        <img
          src={getImageUrl(src)}
          alt={`Page ${index + 1}`}
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
  const { user, isAuthenticated } = useAuthStore()

  const [manga, setManga] = useState(null)
  const [chapter, setChapter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uiVisible, setUiVisible] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [width, setWidth] = useState('max-w-3xl') 
  const hideTimer = useRef(null)

  // 1. Загрузка данных из API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [mData, cData] = await Promise.all([
          mangaService.getById(mangaId),
          mangaService.getChapterDetails(chapterId)
        ])
        setManga(mData)
        setChapter(cData)

        // 2. Сохранение прогресса в БД
        if (isAuthenticated) {
          mangaService.saveProgress(mangaId, chapterId, 1)
        }
      } catch (err) {
        console.error("Reader data load error:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [mangaId, chapterId, isAuthenticated])

  // Логика скрытия интерфейса
  const showUI = useCallback(() => {
    setUiVisible(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setUiVisible(false), 3500)
  }, [])

  useEffect(() => {
    showUI()
    return () => clearTimeout(hideTimer.current)
  }, [showUI])

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-neon-blue font-mono animate-pulse tracking-[0.3em]">LOADING_PAGES...</div>
    </div>
  )

  if (!chapter || !chapter.pages || chapter.pages.length === 0) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <p>This chapter has no pages yet.</p>
      <Link to={`/manga/${mangaId}`} className="text-neon-blue underline">Go Back</Link>
    </div>
  )

  const progress = Math.round(((currentPage + 1) / chapter.pages.length) * 100)

  return (
    <div 
      className="min-h-screen bg-[#08080c] relative" 
      onMouseMove={showUI} 
      onClick={showUI}
    >
      {/* Шапка */}
      <AnimatePresence>
        {uiVisible && (
          <motion.header
            initial={{ y: -64 }} animate={{ y: 0 }} exit={{ y: -64 }}
            className="fixed top-0 inset-x-0 z-50 bg-void/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="flex items-center h-14 px-4 justify-between">
              <div className="flex items-center gap-4">
                <Link to={`/manga/${mangaId}`} className="text-text-muted hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div className="min-w-0">
                  <h1 className="text-xs font-bold text-white truncate max-w-[200px] uppercase tracking-wider">{manga?.title}</h1>
                  <p className="text-[10px] text-neon-blue font-mono">CH. {chapter.number} — {chapter.title || 'No Title'}</p>
                </div>
              </div>
              <div className="text-[10px] font-mono text-text-muted bg-white/5 px-2 py-1 rounded-sm">
                PAGE {currentPage + 1} / {chapter.pages.length} ({progress}%)
              </div>
            </div>
            {/* Progress Bar */}
            <div className="h-0.5 bg-white/5 w-full">
              <motion.div 
                className="h-full bg-gradient-to-r from-neon-blue to-neon-violet" 
                animate={{ width: `${progress}%` }} 
              />
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Список страниц */}
      <div className={`mx-auto pt-14 pb-20 ${width} px-2 sm:px-0`}>
        {chapter.pages.map((page, i) => (
          <ReaderPage_
            key={page.id}
            src={page.image_url}
            index={i}
            onVisible={(idx) => setCurrentPage(idx)}
          />
        ))}

        {/* Конец главы */}
        <div className="mt-20 py-20 border-t border-white/5 text-center">
          <p className="text-xs font-mono text-neon-blue tracking-[0.3em] uppercase mb-2">Chapter Complete</p>
          <h3 className="text-xl font-display font-black text-white mb-8">{chapter.title || `Chapter ${chapter.number}`}</h3>
          <div className="flex justify-center gap-4">
            <Link to={`/manga/${mangaId}`} className="px-8 py-3 bg-surface-2 border border-border text-white text-xs font-bold hover:bg-white/5 transition-all">
              BACK TO TITLES
            </Link>
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="px-8 py-3 bg-neon-blue text-void text-xs font-bold hover:bg-blue-400 transition-all shadow-neon-blue">
              SCROLL TO TOP ↑
            </button>
          </div>
        </div>
      </div>

      {/* Нижняя панель (мобильная) */}
      <AnimatePresence>
        {uiVisible && (
          <motion.footer
            initial={{ y: 56 }} animate={{ y: 0 }} exit={{ y: 56 }}
            className="fixed bottom-0 inset-x-0 z-50 bg-void/95 backdrop-blur-xl border-t border-white/5 h-12 flex items-center justify-center"
          >
             <span className="text-[10px] font-mono text-text-muted tracking-widest">
               VERSED_READER_STATION_v1.0
             </span>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  )
}