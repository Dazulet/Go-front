import { motion } from 'framer-motion'
import { GENRES } from '@/constants'
import clsx from 'clsx'

export default function GenreFilter({ selected = [], onChange, multi = false }) {
  const toggle = (id) => {
    if (multi) {
      if (selected.includes(id)) {
        onChange(selected.filter(g => g !== id))
      } else {
        onChange([...selected, id])
      }
    } else {
      onChange(selected[0] === id ? [] : [id])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* All option */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => onChange([])}
        className={clsx(
          'tag h-8 px-3 rounded-lg border transition-all duration-200 cursor-pointer',
          selected.length === 0
            ? 'bg-neon-purple/20 border-neon-purple/50 text-neon-purple'
            : 'bg-surface border-glass text-ink-muted hover:border-glass-bright hover:text-ink-base'
        )}
      >
        All
      </motion.button>

      {GENRES.map((genre) => {
        const active = selected.includes(genre.id)
        return (
          <motion.button
            key={genre.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => toggle(genre.id)}
            className={clsx(
              'tag h-8 px-3 rounded-lg border transition-all duration-200 cursor-pointer',
              active
                ? 'border-opacity-50'
                : 'bg-surface border-glass text-ink-muted hover:border-glass-bright hover:text-ink-base'
            )}
            style={active ? {
              backgroundColor: `${genre.color}18`,
              borderColor: `${genre.color}50`,
              color: genre.color,
            } : {}}
          >
            {genre.label}
          </motion.button>
        )
      })}
    </div>
  )
}
