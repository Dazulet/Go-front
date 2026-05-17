import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }

function Field({ label, type = 'text', value, onChange, placeholder, error, autoFocus }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">{label}</label>
      <div className={`relative flex items-center border rounded-[4px] transition-all duration-200 ${error ? 'border-red-500/60 bg-red-500/5' : focused ? 'border-neon-blue/50 bg-surface-2 ring-1 ring-neon-blue/15' : 'border-border bg-surface-2 hover:border-border-glow'}`}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-4 py-3 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400 font-mono">{error}</p>}
    </div>
  )
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const set = field => e => { setForm(p => ({ ...p, [field]: e.target.value })); setErrors(p => ({ ...p, [field]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setAuth({ id: '1', username: form.email.split('@')[0], email: form.email }, 'demo-token-xxx')
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-void flex">
      {/* ── Left decorative panel — hidden on mobile ─── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1f] to-void" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(77,166,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(77,166,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-violet/8 rounded-full blur-[80px]" />

        {/* Featured manga poster stack */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative flex gap-4">
            {[0, 1, 2].map((_, i) => {
              const angles = [-8, 0, 8]
              const manga = [
                { cover: 'https://picsum.photos/seed/login1/300/420', title: 'Ghost Circuit' },
                { cover: 'https://picsum.photos/seed/login2/300/420', title: 'Void Protocol' },
                { cover: 'https://picsum.photos/seed/login3/300/420', title: 'Stellar Divide' },
              ][i]
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, rotate: angles[i] }}
                  animate={{ opacity: 1, y: 0, rotate: angles[i] }}
                  transition={{ delay: i * 0.15 + 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ zIndex: i === 1 ? 3 : 1 }}
                  className="relative"
                >
                  <img
                    src={manga.cover}
                    alt={manga.title}
                    className="w-28 rounded-[4px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10"
                  />
                  {i === 1 && (
                    <div className="absolute -inset-2 rounded-[6px] ring-1 ring-neon-blue/30 blur-sm" />
                  )}
                </motion.div>
              )
            })}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <p className="text-xs font-mono text-neon-blue tracking-[0.2em] mb-2 uppercase">MangaVerse</p>
            <h2 className="text-2xl font-display font-black text-text-primary mb-2">50,000+ Titles</h2>
            <p className="text-sm text-text-muted max-w-xs">Your gateway to infinite manga worlds. New chapters every day.</p>
          </motion.div>
        </div>
      </div>

      {/* ── Right auth panel ────────────────────────── */}
      <div className="w-full lg:w-[440px] flex items-center justify-center p-6 lg:border-l lg:border-white/6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <motion.div variants={item} className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 flex-none">
                <div className="absolute inset-[3px] bg-gradient-to-br from-neon-blue to-neon-violet rounded-[2px] rotate-12" />
                <span className="absolute inset-0 flex items-center justify-center text-void font-display font-black text-sm">M</span>
              </div>
              <span className="font-display font-bold text-base tracking-[0.12em] text-text-primary">
                MANGA<span className="text-neon-blue">VERSE</span>
              </span>
            </Link>
          </motion.div>

          <motion.div variants={item} className="mb-8">
            <h1 className="text-2xl font-display font-black text-text-primary mb-1">Welcome back</h1>
            <p className="text-text-muted text-sm">Sign in to continue your reading journey</p>
          </motion.div>

          <form onSubmit={submit} className="space-y-5">
            <motion.div variants={item}>
              <Field label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" error={errors.email} autoFocus />
            </motion.div>
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Password</label>
                <Link to="#" className="text-xs text-neon-blue hover:text-blue-400 transition-colors font-mono">Forgot?</Link>
              </div>
              <Field type="password" value={form.password} onChange={set('password')} placeholder="••••••••" error={errors.password} />
            </motion.div>

            <motion.div variants={item} className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-neon-blue text-void font-display font-bold text-sm tracking-wider rounded-[4px] hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-neon-blue"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </motion.div>
          </form>

          <motion.div variants={item} className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-text-muted">
              New to MangaVerse?{' '}
              <Link to="/register" className="text-neon-blue hover:text-blue-400 transition-colors font-medium">Create an account</Link>
            </p>
          </motion.div>

          {/* Demo hint */}
          <motion.div variants={item} className="mt-4 p-3 bg-surface-2 border border-border rounded-[4px]">
            <p className="text-[11px] font-mono text-text-muted text-center">
              Demo: any email + any password
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
