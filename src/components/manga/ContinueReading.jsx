import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MOCK_MANGA } from '../../constants/manga'
import { useBookmarkStore } from '../../store/useAuthStore'
import { useAuthStore } from '../../store/useAuthStore'

export default function ContinueReading() {
  const { isAuthenticated } = useAuthStore()
  const { bookmarks } = useBookmarkStore()

  // Show bookmarks as "continue reading" if logged in, or featured titles otherwise
  const items = isAuthenticated && bookmarks.length > 0
    ? bookmarks.slice(0, 4).map(m => ({ ...m, continueChapter: m.continueChapter || Math.floor(m.chapters * 0.4) }))
    : MOCK_MANGA.filter(m => m.continueChapter).slice(0, 4)

  if (!items.length) return null

  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="section-label">
          {isAuthenticated ? 'Continue' : 'Featured'}
        </div>
        <h2 className="text-lg sm:text-xl font-display font-bold text-text-primary">
          {isAuthenticated ? 'Continue Reading' : 'Pick Up Where You Left Off'}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((manga, i) => {
          const pct = Math.round((manga.continueChapter / manga.chapters) * 100)
          return (
            <motion.div
              key={manga.id + '-cr'}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <Link
                to={'/reader/' + manga.id + '/' + manga.continueChapter}
                className="group flex gap-3.5 p-3.5 bg-surface-card border border-border rounded-[4px] hover:border-neon-blue/30 hover:bg-surface-2 transition-all duration-250"
              >
                {/* Cover with progress ring */}
                <div className="relative flex-none">
                  <img
                    src={manga.cover}
                    alt={manga.title}
                    className="w-14 h-[76px] object-cover rounded-sm"
                  />
                  {/* Progress bar on bottom of cover */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60 rounded-b-sm overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-violet transition-all"
                      style={{ width: pct + '%' }}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-neon-blue transition-colors line-clamp-1 mb-0.5">
                      {manga.title}
                    </p>
                    <p className="text-[11px] text-neon-blue font-mono">
                      Ch.{manga.continueChapter} / {manga.chapters}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-text-muted font-mono">{pct}% read</span>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-text-muted group-hover:text-neon-blue transition-colors">
                      <span>Continue</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
