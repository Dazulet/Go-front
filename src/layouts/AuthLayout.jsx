import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-void flex items-center justify-center overflow-hidden py-12 px-4">
      {/* Layered ambient BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#08081a] via-void to-[#0a0814]" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-40"
        style={{ backgroundImage: 'linear-gradient(rgba(77,166,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(77,166,255,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-neon-blue/[0.05] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-neon-violet/[0.06] blur-[100px] pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,8,0.7) 100%)' }} />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-10"
        >
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 flex-none">
              <div className="absolute inset-0 bg-neon-blue rounded-[3px] rotate-45 opacity-15 group-hover:opacity-30 transition-opacity" />
              <div className="absolute inset-[3px] bg-gradient-to-br from-neon-blue to-neon-violet rounded-[2px] rotate-12" />
              <span className="absolute inset-0 flex items-center justify-center text-void font-display font-black text-base">M</span>
            </div>
            <span className="font-display font-bold text-lg tracking-[0.12em] text-text-primary">
              MANGA<span className="text-neon-blue" style={{ textShadow: '0 0 16px rgba(77,166,255,0.6)' }}>VERSE</span>
            </span>
          </Link>
        </motion.div>

        {children}
      </div>
    </div>
  )
}
