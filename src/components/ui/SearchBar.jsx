import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { mangaService } from '@/services'
import { dropdownVariants } from '@/animations/variants'
import { Spinner } from './Loader'

export default function SearchBar({ onClose, autoFocus = true }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    clearTimeout(timeoutRef.current)
    setLoading(true)
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await mangaService.search(query)
        setResults(res.slice(0, 6))
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [query])

  const handleSelect = (manga) => {
    navigate(`/manga/${manga.id}`)
    onClose?.()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query)}`)
      onClose?.()
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <svg className="absolute left-4 w-5 h-5 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search manga, author, genre..."
            className="w-full h-14 pl-12 pr-12 rounded-2xl bg-elevated border border-glass-bright text-ink-bright placeholder:text-ink-dim font-body text-base outline-none focus:border-neon-purple/50 transition-all duration-200"
          />
          {loading && (
            <div className="absolute right-4">
              <Spinner size="sm" />
            </div>
          )}
          {!loading && query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 text-ink-dim hover:text-ink-bright transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Suggestions */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            variants={dropdownVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute top-full left-0 right-0 mt-2 glass-elevated rounded-xl border border-glass-bright overflow-hidden z-50"
          >
            {results.map((manga, i) => (
              <motion.button
                key={manga.id}
                onClick={() => handleSelect(manga)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0, transition: { delay: i * 0.04 } }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/4 transition-colors text-left border-b border-glass last:border-0"
              >
                <img
                  src={manga.cover}
                  alt={manga.title}
                  className="w-9 h-12 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-bright truncate font-display">{manga.title}</p>
                  <p className="text-xs text-ink-muted">{manga.author} · {manga.chapters} ch.</p>
                </div>
                <div className="flex flex-wrap gap-1 max-w-24">
                  {manga.genres.slice(0, 2).map(g => (
                    <span key={g} className="tag bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                      {g}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
            <button
              onClick={handleSubmit}
              className="w-full px-4 py-3 text-sm text-neon-blue hover:bg-neon-blue/5 transition-colors flex items-center gap-2 font-display font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Search all results for "{query}"
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
