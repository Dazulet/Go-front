import { motion } from 'framer-motion'

export default function Loader({ fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-blue"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border border-transparent border-t-neon-purple/60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse-glow" />
        </div>
      </div>
      <span className="text-xs font-mono text-text-muted tracking-widest animate-pulse">LOADING</span>
    </div>
  )
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-void flex items-center justify-center">
        {content}
      </div>
    )
  }
  return <div className="flex items-center justify-center py-16">{content}</div>
}
