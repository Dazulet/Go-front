import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ParticleField from '../components/three/ParticleField'

// Subtle ambient orbs — stay fixed, don't move with scroll
function AmbientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top-left warm blue */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(77,166,255,0.04) 0%, transparent 70%)' }} />
      {/* Center-right violet */}
      <div className="absolute top-[40%] -right-24 w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)' }} />
      {/* Bottom-left accent */}
      <div className="absolute -bottom-24 left-1/4 w-[500px] h-[300px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(77,166,255,0.03) 0%, transparent 70%)' }} />
    </div>
  )
}

export default function MainLayout({ children }) {
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])

  return (
    <div className="relative min-h-screen bg-void">
      {/* Particle background — very lightweight */}
      <ParticleField />

      {/* Ambient color orbs */}
      <AmbientOrbs />

      {/* Subtle grid overlay — only visible on dark sections */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.35]"
        style={{
          backgroundImage: 'linear-gradient(rgba(77,166,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(77,166,255,0.03) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 0%, transparent 100%)',
        }}
      />

      {/* App content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1"
          >
            {children}
          </motion.main>
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  )
}
