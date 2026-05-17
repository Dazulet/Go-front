import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MOCK_MANGA } from '../../constants/manga'

export default function NewChapters() {
  // Simulate recently-updated titles
  const updates = [...MOCK_MANGA]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)
    .map((m, i) => ({ ...m, newChapter: Math.floor(Math.random() * 30) + m.chapters - 30, updatedAt: ['Just now', '1h ago', '3h ago', '5h ago', '8h ago', '12h ago', '1d ago', '2d ago'][i] }))

  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="section-label">Updates</div>
        <h2 className="text-lg sm:text-xl font-display font-bold text-text-primary">New Chapters</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {updates.map((manga, i) => (
          <motion.div
            key={manga.id + '-update'}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              to={'/reader/' + manga.id + '/' + manga.newChapter}
              className="flex gap-3 p-3 rounded-[4px] bg-surface-card border border-border hover:border-neon-blue/25 hover:bg-surface-2 transition-all duration-250 group"
            >
              {/* Cover */}
              <div className="relative flex-none">
                <img src={manga.cover} alt={manga.title} className="w-12 h-16 object-cover rounded-sm" />
                {i < 2 && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-neon-blue rounded-full border-2 border-void" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <p className="text-sm font-semibold text-text-primary group-hover:text-neon-blue transition-colors line-clamp-1 mb-0.5">{manga.title}</p>
                  <p className="text-[11px] text-neon-blue font-mono">Chapter {manga.newChapter}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-muted font-mono">{manga.updatedAt}</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[10px] text-yellow-400 font-mono">{manga.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
