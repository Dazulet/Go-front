import { motion } from 'framer-motion'

export default function GlassButton({ children, onClick, variant = 'default', size = 'md', className = '', disabled = false, type = 'button' }) {
  const variants = {
    default: 'border-border text-text-secondary hover:text-text-primary hover:border-border-glow',
    primary: 'border-neon-blue/40 text-neon-blue hover:border-neon-blue hover:bg-neon-blue/10 hover:shadow-neon-sm',
    purple: 'border-neon-purple/40 text-neon-violet hover:border-neon-purple hover:bg-neon-purple/10',
    danger: 'border-red-500/40 text-red-400 hover:border-red-500 hover:bg-red-500/10',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`relative glass border font-body font-medium rounded-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.button>
  )
}
