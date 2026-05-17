import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { backdropVariants, modalVariants } from '@/animations/variants'
import clsx from 'clsx'

export default function Modal({ isOpen, onClose, title, children, size = 'md', className }) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-void/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={clsx(
              'relative w-full z-10',
              'glass-elevated rounded-2xl',
              'border border-glass-bright',
              'shadow-[0_32px_80px_rgba(0,0,0,0.6)]',
              sizes[size],
              className
            )}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-glass">
                <h3 className="font-display text-lg font-semibold text-ink-bright">{title}</h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-dim hover:text-ink-bright hover:bg-white/8 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Close button if no title */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-lg text-ink-dim hover:text-ink-bright hover:bg-white/8 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Content */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
