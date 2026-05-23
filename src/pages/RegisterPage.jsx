import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { authService } from '../services/api' // берем наш реальный сервис

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }

function Field({ label, type = 'text', value, onChange, placeholder, error, hint }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">{label}</label>
      <div className={`border rounded-[4px] transition-all duration-200 ${error ? 'border-red-500/60 bg-red-500/5' : focused ? 'border-neon-blue/50 bg-surface-2 ring-1 ring-neon-blue/15' : 'border-border bg-surface-2 hover:border-border-glow'}`}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-4 py-3 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
        />
      </div>
      {error ? <p className="mt-1.5 text-xs text-red-400 font-mono">{error}</p> : hint ? <p className="mt-1 text-xs text-text-muted">{hint}</p> : null}
    </div>
  )
}

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const set = field => e => { 
    setForm(p => ({ ...p, [field]: e.target.value })); 
    setErrors(p => ({ ...p, [field]: '' })) 
  }

  const validate = () => {
    const e = {}
    if (!form.username || form.username.length < 3) e.username = 'Min. 3 characters'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.password || form.password.length < 8) e.password = 'Min. 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    
    setLoading(true)
    try {
      // ВЫЗОВ БЭКЕНДА
      const data = await authService.register({
        username: form.username,
        email: form.email,
        password: form.password
      })
      
      // После успешной регистрации записываем данные в Zustand
      setAuth(data.user, data.token)
      localStorage.setItem('mv_token', data.token)
      navigate('/')
    } catch (err) {
      setErrors({ email: err.response?.data?.message || 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1f] to-void" />
      
      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 w-full max-w-md">
        <motion.div variants={item} className="mb-8 flex justify-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="relative w-8 h-8 flex-none">
              <div className="absolute inset-[3px] bg-gradient-to-br from-neon-blue to-neon-violet rounded-[2px] rotate-12" />
              <span className="absolute inset-0 flex items-center justify-center text-void font-display font-black text-sm">M</span>
            </div>
            <span className="font-display font-bold text-base tracking-[0.12em] text-text-primary">MANGA<span className="text-neon-blue">VERSE</span></span>
          </Link>
        </motion.div>

        <motion.div variants={item} className="bg-surface/60 border border-border rounded-[4px] p-8 backdrop-blur-xl shadow-2xl">
          <div className="mb-7">
            <h1 className="text-2xl font-display font-black text-text-primary mb-1">Create account</h1>
            <p className="text-text-muted text-sm">Join the Verse library</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <motion.div variants={item}>
              <Field label="Username" value={form.username} onChange={set('username')} placeholder="Luffy_2024" error={errors.username} />
            </motion.div>
            <motion.div variants={item}>
              <Field label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" error={errors.email} />
            </motion.div>
            <motion.div variants={item}>
              <Field label="Password" type="password" value={form.password} onChange={set('password')} placeholder="Min. 8 characters" error={errors.password} />
            </motion.div>
            <motion.div variants={item}>
              <Field label="Confirm" type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" error={errors.confirm} />
            </motion.div>

            <motion.div variants={item} className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-neon-blue text-void font-display font-bold text-sm tracking-wider rounded-[4px] hover:bg-blue-400 disabled:opacity-50 transition-all"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </motion.div>
          </form>

          <motion.div variants={item} className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-sm text-text-muted">
              Already have an account? <Link to="/login" className="text-neon-blue hover:text-blue-400 font-medium">Sign in</Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}