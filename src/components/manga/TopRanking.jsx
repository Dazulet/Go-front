import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getImageUrl } from '../../services/api'

export default function TopRanking({ manga = [] }) {
  const ranked = [...manga].sort((a, b) => b.avg_rating - a.avg_rating).slice(0, 6)

  return (
    <div className="px-4 sm:px-6 lg:px-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="section-label">Charts</div>
        <h2 className="text-lg sm:text-xl font-display font-bold text-text-primary">Top Rated</h2>
      </div>
      <div className="space-y-2">
        {ranked.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Link to={`/manga/${m.id}`} className="flex items-center gap-4 p-3 rounded-[4px] bg-surface/60 border border-border hover:border-neon-blue/20 hover:bg-surface-2 transition-all group">
              <span className={`w-8 text-center font-display font-black text-sm flex-none ${i < 3 ? 'text-neon-blue' : 'text-text-muted'}`}>
                {i + 1}
              </span>
              <img src={getImageUrl(m.cover)} className="w-10 h-[56px] object-cover rounded-sm flex-none" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary group-hover:text-neon-blue transition-colors line-clamp-1">{m.title}</p>
                <p className="text-[11px] text-text-muted font-mono mt-0.5">{m.genres?.[0]?.name} • {m.status}</p>
              </div>
              <div className="flex items-center gap-1 flex-none">
                <span className="text-xs font-mono font-bold text-yellow-400">★ {m.avg_rating || '0.0'}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}