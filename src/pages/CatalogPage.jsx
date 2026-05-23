import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MangaCard from '../components/manga/MangaCard'
import { mangaService } from '../services/api' // Подключаем бэкенд

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest' },
  { value: 'views', label: 'Most Read' },
  { value: 'title', label: 'A-Z' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
]

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }

export default function CatalogPage() {
  const [searchParams] = useSearchParams()
  const [manga, setManga] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Состояния фильтров
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [sort, setSort] = useState('created_at')
  const [status, setStatus] = useState('')

  useEffect(() => {
    setLoading(true)
    // Запрос к бэкенду со всеми фильтрами
    mangaService.getAll({
      search: query,
      sort_by: sort,
      status: status,
      limit: 24
    }).then(res => {
      setManga(res.data)
      setTotal(res.pagination.total)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [query, sort, status]) // Перезапрашивать при смене фильтра

  return (
    <div className="min-h-screen pt-20">
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-surface to-void" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <div className="section-label mb-3">Library</div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-text-primary mb-1">Catalog</h1>
          <p className="text-text-muted text-sm">Found {total} titles in database</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search in database..."
              className="w-full pl-10 pr-10 py-2.5 bg-surface-2 border border-border text-text-primary text-sm rounded-sm outline-none focus:border-neon-blue/50"
            />
          </div>

          <select value={sort} onChange={e => setSort(e.target.value)} className="px-3 py-2.5 bg-surface-2 border border-border text-text-secondary text-sm rounded-sm outline-none">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2.5 bg-surface-2 border border-border text-text-secondary text-sm rounded-sm outline-none">
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {loading ? (
           <div className="py-20 text-center text-neon-blue font-mono">FETCHING DATA...</div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-7">
            {manga.map((m, i) => (
              <motion.div key={m.id} variants={item}>
                <MangaCard manga={m} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && manga.length === 0 && (
          <div className="text-center py-20 text-text-muted">No results found in your database.</div>
        )}
      </div>
    </div>
  )
}