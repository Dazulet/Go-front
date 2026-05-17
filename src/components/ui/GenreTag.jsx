import { motion } from 'framer-motion'

const COLORS = {
  Action: 'text-red-400 border-red-400/30 hover:bg-red-400/10',
  Adventure: 'text-orange-400 border-orange-400/30 hover:bg-orange-400/10',
  Comedy: 'text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/10',
  Drama: 'text-pink-400 border-pink-400/30 hover:bg-pink-400/10',
  Fantasy: 'text-purple-400 border-purple-400/30 hover:bg-purple-400/10',
  Horror: 'text-red-600 border-red-600/30 hover:bg-red-600/10',
  Mystery: 'text-indigo-400 border-indigo-400/30 hover:bg-indigo-400/10',
  Romance: 'text-rose-400 border-rose-400/30 hover:bg-rose-400/10',
  'Sci-Fi': 'text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10',
  'Slice of Life': 'text-green-400 border-green-400/30 hover:bg-green-400/10',
  default: 'text-neon-blue border-neon-blue/30 hover:bg-neon-blue/10',
}

export default function GenreTag({ genre, onClick, active = false }) {
  const color = COLORS[genre] || COLORS.default
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`px-3 py-1 text-xs font-mono border rounded-sm transition-all duration-200 ${
        active ? `${color} bg-current/10` : `text-text-muted border-border hover:border-border-glow hover:text-text-secondary`
      }`}
    >
      {genre}
    </motion.button>
  )
}
