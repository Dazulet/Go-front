export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
}

export const glowPulse = {
  initial: { boxShadow: '0 0 10px rgba(0, 212, 255, 0.2)' },
  animate: {
    boxShadow: ['0 0 10px rgba(0, 212, 255, 0.2)', '0 0 30px rgba(0, 212, 255, 0.5)', '0 0 10px rgba(0, 212, 255, 0.2)'],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.03, y: -8, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
}
