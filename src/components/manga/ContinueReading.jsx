import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/useAuthStore'
import { mangaService, getImageUrl } from '../../services/api'

export default function ContinueReading() {
  const { isAuthenticated } = useAuthStore()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true)
      try {
        if (isAuthenticated) {
          const history = await mangaService.getProgress()
          
          const mappedHistory = (history || []).map(item => {
            // Твой Go-бэкенд теперь присылает объекты внутри manga и chapter
            const m = item.manga;
            const c = item.chapter;

            return {
              id: item.manga_id,
              chapterId: item.chapter_id,
              // Берем название из вложенного объекта манги
              mangaTitle: m?.title || 'Untitled Manga',
              cover: m?.cover,
              // Считаем прогресс: текущая глава / всего глав
              currentChapter: c?.number || 1,
              totalChapters: m?.chapters || 100 // если в базе 0, ставим заглушку 100
            }
          })
          setItems(mappedHistory.slice(0, 4))
        } else {
          // Логика для гостей (популярное)
          const res = await mangaService.getAll({ limit: 4, sort_by: 'views' })
          setItems(res.data.map(m => ({
            ...m,
            mangaTitle: m.title,
            currentChapter: 1,
            totalChapters: m.chapters || 1
          })))
        }
      } catch (err) {
        console.error("Progress load error:", err)
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [isAuthenticated])

  if (loading || items.length === 0) return null

  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="section-label">{isAuthenticated ? 'Continue' : 'Featured'}</div>
        <h2 className="text-lg sm:text-xl font-display font-bold text-text-primary">
          {isAuthenticated ? 'Continue Reading' : 'Pick Up Where You Left Off'}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((manga, i) => {
          // Вычисляем процент
          const pct = Math.round((manga.currentChapter / manga.totalChapters) * 100)

          return (
            <motion.div
              key={`${manga.id}-${manga.chapterId}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                to={`/reader/${manga.id}/${manga.chapterId}`}
                className="group flex gap-3.5 p-3.5 bg-surface-card border border-border rounded-[4px] hover:border-neon-blue/30 hover:bg-surface-2 transition-all"
              >
                <div className="relative flex-none">
                  <img src={getImageUrl(manga.cover)} alt={manga.mangaTitle} className="w-14 h-[76px] object-cover rounded-sm" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60 rounded-b-sm overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-neon-blue to-neon-violet" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-neon-blue transition-colors line-clamp-1 mb-0.5">
                      {manga.mangaTitle}
                    </p>
                    <p className="text-[11px] text-neon-blue font-mono">
                      Ch.{manga.currentChapter} / {manga.totalChapters}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-text-muted font-mono">{pct}% read</span>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-text-muted group-hover:text-neon-blue">
                      <span>Continue</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}