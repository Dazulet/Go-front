import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getImageUrl } from '../../services/api'

export default function NewChapters({ manga = [] }) {
  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="section-label">Updates</div>
        <h2 className="text-lg sm:text-xl font-display font-bold text-text-primary">New Chapters</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {manga.slice(0, 8).map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
            <Link to={`/manga/${m.id}`} className="flex gap-3 p-3 rounded-[4px] bg-surface-card border border-border hover:border-neon-blue/25 hover:bg-surface-2 transition-all group">
              <img src={getImageUrl(m.cover)} className="w-12 h-16 object-cover rounded-sm flex-none" />
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <p className="text-sm font-semibold text-text-primary group-hover:text-neon-blue transition-colors line-clamp-1 mb-0.5">{m.title}</p>
                  <p className="text-[11px] text-neon-blue font-mono">Recently Updated</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-muted font-mono">{m.status}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-yellow-400 font-mono">★ {m.avg_rating || '0.0'}</span>
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