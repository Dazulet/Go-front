import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedInput({ label, type = 'text', value, onChange, placeholder, error, icon, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <div className="relative">
      {label && (
        <label className="block text-xs font-mono font-medium text-text-secondary mb-2 tracking-wider uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-surface-2 border rounded-sm font-body text-sm text-text-primary placeholder-text-muted outline-none transition-all duration-200 ${
            error ? 'border-red-500/60' : focused ? 'border-neon-blue/60 shadow-neon-sm' : 'border-border hover:border-border-glow'
          }`}
          {...props}
        />
        {focused && (
          <motion.div
            layoutId="input-focus"
            className="absolute bottom-0 left-0 right-0 h-px bg-neon-blue"
            initial={false}
          />
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400 font-mono">{error}</p>}
    </div>
  )
}
