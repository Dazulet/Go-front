# MangaVerse

Premium cyberpunk manga reading platform — React + Vite + TailwindCSS + Framer Motion + Three.js

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## Stack
- React 18 + Vite 5
- TailwindCSS 3 with custom cyberpunk design system
- Framer Motion 11 — cinematic animations
- React Three Fiber — 3D particle field background
- React Router DOM 6
- Zustand — auth + bookmarks
- React Query — data fetching / caching

## Pages
- / — Hero, trending manga, latest releases, stats
- /catalog — Search, genre filters, sort, grid
- /manga/:id — Detail page, chapters list, comments
- /reader/:mangaId/:chapterId — Immersive vertical reader
- /login — Auth with validation
- /register — Registration
- /profile — User bookmarks, history, settings

## Project Structure
src/
  components/layout/   Navbar, Footer
  components/manga/    MangaCard
  components/three/    ParticleField (3D bg)
  components/ui/       GlassButton, AnimatedInput, Loader, StarRating, GenreTag
  pages/               All route pages
  layouts/             MainLayout, AuthLayout
  hooks/               useManga (React Query)
  services/            Axios API layer (ready for backend)
  store/               Zustand (auth, bookmarks)
  animations/          Framer Motion variants
  constants/           Mock data

## Environment
Copy .env.example to .env:
  VITE_API_URL=http://localhost:8000/api/v1
