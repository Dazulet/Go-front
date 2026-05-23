import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/useAuthStore'

const NAV = [
  { path: '/', label: 'Home' },
  { path: '/catalog', label: 'Catalog' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false); setSearchOpen(false) }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) { navigate('/catalog?q=' + encodeURIComponent(query)); setQuery('') }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-void/92 backdrop-blur-2xl border-b border-white/6 shadow-[0_2px_40px_rgba(0,0,0,0.6)]'
            : 'bg-gradient-to-b from-void/80 to-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center h-16 lg:h-[68px] gap-6">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-none group">
              <div className="relative w-8 h-8 flex-none">
                <div className="absolute inset-0 bg-neon-blue rounded-[3px] rotate-45 opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-[3px] bg-gradient-to-br from-neon-blue to-neon-violet rounded-[2px] rotate-12" />
                <span className="absolute inset-0 flex items-center justify-center text-void font-display font-black text-sm">M</span>
              </div>
              <span className="font-display font-bold text-base tracking-[0.12em] text-text-primary">
                MANGA<span className="text-neon-blue" style={{ textShadow: '0 0 16px rgba(77,166,255,0.6)' }}>VERSE</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-sm transition-colors duration-200 ${
                    location.pathname === path
                      ? 'text-text-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {label}
                  {location.pathname === path && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/6 rounded-sm -z-10"
                    />
                  )}
                </Link>
              ))}

              {/* --- АДМИН ССЫЛКА (Desktop) --- */}
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="px-4 py-2 text-sm font-black text-neon-pink hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-pink animate-pulse" />
                  ADMIN
                </Link>
              )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search bar — desktop expandable */}
            <div className="hidden md:flex items-center">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.form
                    key="open"
                    initial={{ width: 40, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 40, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    onSubmit={handleSearch}
                    className="relative"
                  >
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      autoFocus
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onBlur={() => !query && setSearchOpen(false)}
                      placeholder="Search manga, authors..."
                      className="w-full pl-10 pr-10 py-2 bg-surface-2 border border-border focus:border-neon-blue/40 rounded-sm text-sm text-text-primary placeholder-text-muted outline-none transition-colors"
                    />
                    <button type="button" onClick={() => { setSearchOpen(false); setQuery('') }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </motion.form>
                ) : (
                  <motion.button
                    key="closed"
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-sm hover:bg-white/6"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center text-void font-bold text-sm ring-2 ring-transparent group-hover:ring-neon-blue/40 transition-all">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{user?.username}</span>
                </Link>
                <button onClick={logout} className="p-2 text-text-muted hover:text-text-secondary transition-colors rounded-sm hover:bg-white/6" title="Sign out">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-sm hover:bg-white/6">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-display font-semibold bg-neon-blue text-void rounded-sm hover:bg-blue-400 transition-colors shadow-neon-blue tracking-wide">
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile: search + burger */}
            <div className="flex md:hidden items-center gap-1">
              <button onClick={() => setSearchOpen(p => !p)} className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <button onClick={() => setMobileOpen(p => !p)} className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                <div className="w-5 flex flex-col gap-[5px]">
                  <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }} className="block h-[1.5px] w-full bg-current origin-center transition-colors" />
                  <motion.span animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }} className="block h-[1.5px] w-full bg-current" />
                  <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }} className="block h-[1.5px] w-full bg-current origin-center" />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden border-t border-white/6"
              >
                <form onSubmit={handleSearch} className="py-3">
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search manga..." className="w-full pl-10 pr-4 py-2.5 bg-surface-2 border border-border rounded-sm text-sm text-text-primary placeholder-text-muted outline-none focus:border-neon-blue/40" />
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-void/98 backdrop-blur-xl border-l border-white/8 flex flex-col pt-20 pb-8 px-6 md:hidden"
            >
              <nav className="flex flex-col gap-1 mb-6">
                {NAV.map(({ path, label }) => (
                  <Link key={path} to={path} className={`py-3 px-4 rounded-sm text-sm font-medium transition-colors ${location.pathname === path ? 'bg-white/8 text-text-primary border-l-2 border-neon-blue' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'}`}>{label}</Link>
                ))}

                {/* --- АДМИН ССЫЛКА (Mobile) --- */}
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="py-3 px-4 rounded-sm text-sm font-black text-neon-pink hover:bg-neon-pink/10 transition-colors"
                  >
                    ADMIN PANEL
                  </Link>
                )}
              </nav>

              <div className="mt-auto flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="py-3 px-4 bg-surface-2 rounded-sm text-sm font-medium text-text-primary border border-border">My Profile</Link>
                    <button onClick={logout} className="py-3 px-4 text-left text-sm text-text-muted hover:text-text-secondary transition-colors">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="py-3 px-4 text-center border border-border text-text-secondary rounded-sm text-sm hover:text-text-primary transition-colors">Sign In</Link>
                    <Link to="/register" className="py-3 px-4 text-center bg-neon-blue text-void rounded-sm text-sm font-display font-bold tracking-wide">Join Free</Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}