import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MangaCard from '../components/manga/MangaCard'
import { MOCK_MANGA, GENRES, SORT_OPTIONS, STATUS_OPTIONS } from '../constants/manga'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

function ActiveFilterBadge({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-neon-blue/12 border border-neon-blue/25 text-neon-blue text-xs font-mono rounded-sm">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}

export default function CatalogPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'trending')
  const [status, setStatus] = useState('all')
  const [selectedGenres, setSelectedGenres] = useState(
    searchParams.get('genre') ? [searchParams.get('genre')] : []
  )
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

  const toggleGenre = (g) =>
    setSelectedGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    )

  const filtered = useMemo(() => {
    let r = [...MOCK_MANGA]
    if (query.trim())
      r = r.filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.author?.toLowerCase().includes(query.toLowerCase()) ||
        m.genres?.some(g => g.toLowerCase().includes(query.toLowerCase()))
      )
    if (status !== 'all') r = r.filter(m => m.status === status)
    if (selectedGenres.length)
      r = r.filter(m => selectedGenres.every(g => m.genres?.includes(g)))
    if (sort === 'rating')   r.sort((a, b) => b.rating - a.rating)
    else if (sort === 'newest')  r.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    else if (sort === 'trending') r.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0))
    else if (sort === 'views')   r.sort((a, b) => parseFloat(b.views) - parseFloat(a.views))
    return r
  }, [query, sort, status, selectedGenres])

  const hasActiveFilters = selectedGenres.length > 0 || status !== 'all' || query.trim()

  return (
    <div className="min-h-screen pt-20">
      {/* Page header */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-surface to-void" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(77,166,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(77,166,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <div className="section-label mb-3">Library</div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-text-primary mb-1">Catalog</h1>
          <p className="text-text-muted text-sm">Browse {MOCK_MANGA.length}+ titles</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* ── Search + Controls bar ───────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search titles, authors, genres..."
              className="w-full pl-10 pr-10 py-2.5 bg-surface-2 border border-border text-text-primary placeholder-text-muted text-sm rounded-sm outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="px-3 py-2.5 bg-surface-2 border border-border text-text-secondary text-sm rounded-sm outline-none focus:border-neon-blue/40 transition-colors cursor-pointer min-w-[140px]"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="px-3 py-2.5 bg-surface-2 border border-border text-text-secondary text-sm rounded-sm outline-none focus:border-neon-blue/40 transition-colors cursor-pointer min-w-[130px]"
          >
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Genre filter toggle */}
          <button
            onClick={() => setFiltersVisible(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 border text-sm rounded-sm font-medium transition-all whitespace-nowrap ${
              filtersVisible || selectedGenres.length
                ? 'border-neon-blue/50 bg-neon-blue/10 text-neon-blue'
                : 'border-border bg-surface-2 text-text-secondary hover:border-border-glow'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Genres
            {selectedGenres.length > 0 && (
              <span className="min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-neon-blue text-void rounded-sm px-1">
                {selectedGenres.length}
              </span>
            )}
          </button>

          {/* View toggle */}
          <div className="hidden sm:flex border border-border rounded-sm overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-2.5 transition-colors ${viewMode === 'grid' ? 'bg-surface-3 text-text-primary' : 'bg-surface-2 text-text-muted hover:text-text-secondary'}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-2.5 transition-colors border-l border-border ${viewMode === 'list' ? 'bg-surface-3 text-text-primary' : 'bg-surface-2 text-text-muted hover:text-text-secondary'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>

        {/* ── Genre filter panel ───────────────────────────── */}
        <AnimatePresence>
          {filtersVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-4"
            >
              <div className="p-4 bg-surface-2 border border-border rounded-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Select Genres</span>
                  {selectedGenres.length > 0 && (
                    <button onClick={() => setSelectedGenres([])} className="text-xs text-red-400 hover:text-red-300 transition-colors font-mono">
                      Clear all
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(g => (
                    <button
                      key={g}
                      onClick={() => toggleGenre(g)}
                      className={`px-3 py-1.5 text-xs font-mono rounded-sm border transition-all duration-150 ${
                        selectedGenres.includes(g)
                          ? 'bg-neon-blue/15 border-neon-blue/50 text-neon-blue'
                          : 'bg-surface-3 border-border text-text-muted hover:border-border-glow hover:text-text-secondary'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-xs text-text-muted font-mono">Active:</span>
            {query.trim() && <ActiveFilterBadge label={'Search: ' + query} onRemove={() => setQuery('')} />}
            {status !== 'all' && <ActiveFilterBadge label={status} onRemove={() => setStatus('all')} />}
            {selectedGenres.map(g => <ActiveFilterBadge key={g} label={g} onRemove={() => toggleGenre(g)} />)}
            <button
              onClick={() => { setQuery(''); setStatus('all'); setSelectedGenres([]) }}
              className="text-xs text-text-muted hover:text-text-secondary font-mono underline underline-offset-2 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-text-muted font-mono">
            <span className="text-text-primary font-semibold">{filtered.length}</span> {filtered.length === 1 ? 'title' : 'titles'} found
          </p>
        </div>

        {/* ── Results grid ─────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            viewMode === 'grid' ? (
              <motion.div
                key="grid"
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-7"
              >
                {filtered.map((manga, i) => (
                  <motion.div key={manga.id} variants={item}>
                    <MangaCard manga={manga} index={i} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // ── List view ─────────────────────────────────
              <motion.div key="list" variants={stagger} initial="hidden" animate="show" className="space-y-2">
                {filtered.map((manga, i) => (
                  <motion.div key={manga.id} variants={item}>
                    <Link
                      to={'/manga/' + manga.id}
                      className="flex gap-4 p-3 bg-surface-card border border-border rounded-[4px] hover:border-neon-blue/25 hover:bg-surface-2 transition-all duration-200 group"
                    >
                      <img src={manga.cover} alt={manga.title} className="w-12 h-16 object-cover rounded-sm flex-none" />
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <h3 className="font-semibold text-text-primary group-hover:text-neon-blue transition-colors text-sm line-clamp-1 mb-0.5">{manga.title}</h3>
                          <p className="text-xs text-text-muted line-clamp-1">{manga.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {manga.genres?.slice(0, 3).map(g => (
                            <span key={g} className="text-[10px] font-mono text-text-muted bg-surface-3 px-1.5 py-0.5 rounded-sm">{g}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between flex-none">
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          <span className="text-sm font-mono font-bold text-yellow-400">{manga.rating}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm ${manga.status === 'ongoing' ? 'status-ongoing' : manga.status === 'completed' ? 'status-completed' : 'status-hiatus'}`}>{manga.status}</span>
                        <span className="text-[11px] font-mono text-text-muted">{manga.chapters} ch.</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-surface-2 border border-border flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-display font-bold text-text-secondary mb-2">No results found</h3>
              <p className="text-sm text-text-muted mb-6 max-w-xs">Try adjusting your search query or removing some filters.</p>
              <button
                onClick={() => { setQuery(''); setStatus('all'); setSelectedGenres([]) }}
                className="px-5 py-2.5 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-sm font-medium rounded-sm hover:bg-neon-blue/15 transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
