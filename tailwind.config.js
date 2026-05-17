/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#08080f',
        'void-light': '#0c0c18',
        surface: '#0f0f1c',
        'surface-2': '#141428',
        'surface-3': '#1c1c35',
        'surface-card': '#111122',
        border: '#1e1e38',
        'border-glow': '#2e2e58',
        neon: {
          blue: '#4da6ff',
          purple: '#7c3aed',
          violet: '#a855f7',
          pink: '#ec4899',
          cyan: '#22d3ee',
        },
        text: {
          primary: '#f0f0f8',
          secondary: '#9898b8',
          muted: '#52527a',
          accent: '#4da6ff',
        },
      },
      fontFamily: {
        display: ['"Orbitron"', 'monospace'],
        body: ['"Syne"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        jp: ['"Noto Serif JP"', 'serif'],
      },
      backgroundImage: {
        'gradient-void': 'radial-gradient(ellipse at top, #0f0f28 0%, #08080f 70%)',
        'gradient-card': 'linear-gradient(180deg, transparent 40%, rgba(8,8,15,0.95) 100%)',
        'gradient-card-full': 'linear-gradient(180deg, rgba(8,8,15,0.1) 0%, rgba(8,8,15,0.7) 50%, rgba(8,8,15,0.98) 100%)',
        'gradient-hero': 'linear-gradient(90deg, rgba(8,8,15,0.97) 0%, rgba(8,8,15,0.7) 50%, rgba(8,8,15,0.2) 100%)',
        'gradient-hero-bottom': 'linear-gradient(0deg, rgba(8,8,15,1) 0%, rgba(8,8,15,0.5) 40%, transparent 100%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
      },
      boxShadow: {
        'neon-blue': '0 0 24px rgba(77,166,255,0.35)',
        'neon-purple': '0 0 24px rgba(124,58,237,0.35)',
        'card': '0 4px 32px rgba(0,0,0,0.7)',
        'card-hover': '0 16px 48px rgba(0,0,0,0.8), 0 0 0 1px rgba(77,166,255,0.15)',
        'poster': '0 8px 40px rgba(0,0,0,0.8)',
        'inner-top': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      },
    },
  },
  plugins: [],
}
