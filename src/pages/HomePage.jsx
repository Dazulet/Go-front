import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import HeroBanner from '../components/manga/HeroBanner'
import MangaRow from '../components/manga/MangaRow'
import ContinueReading from '../components/manga/ContinueReading'
import NewChapters from '../components/manga/NewChapters'
import TopRanking from '../components/manga/TopRanking'
import { mangaService } from '../services/api' // Подключаем бэкенд

function GenreSpotlight() {
  const genres = [
    { name: 'Action',     color: 'from-red-900/60 to-orange-900/40',    text: 'text-orange-400',  count: '2.4K' },
    { name: 'Romance',    color: 'from-rose-900/60 to-pink-900/40',     text: 'text-pink-400',    count: '1.8K' },
    { name: 'Fantasy',    color: 'from-purple-900/60 to-violet-900/40', text: 'text-violet-400',  count: '3.1K' },
    { name: 'Sci-Fi',     color: 'from-blue-900/60 to-cyan-900/40',     text: 'text-cyan-400',    count: '1.2K' },
    { name: 'Horror',     color: 'from-gray-900/60 to-red-900/40',      text: 'text-red-500',     count: '890' },
    { name: 'Slice of Life', color: 'from-green-900/60 to-teal-900/40', text: 'text-teal-400',   count: '1.5K' },
  ]
  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="section-label">Browse</div>
        <h2 className="text-lg sm:text-xl font-display font-bold text-text-primary">Popular Genres</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {genres.map((g, i) => (
          <motion.a
            href={`/catalog?genre_id=${g.id}`} 
            key={g.name}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04, y: -3 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`relative flex flex-col justify-between p-4 h-24 rounded-[4px] bg-gradient-to-br ${g.color} border border-white/8 cursor-pointer overflow-hidden group`}
          >
            <span className={`font-display font-bold text-sm ${g.text}`}>{g.name}</span>
            <span className="text-[11px] font-mono text-white/40">{g.count} titles</span>
            <div className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-current opacity-10 ${g.text}`} />
          </motion.a>
        ))}
      </div>
    </section>
  )
}

function PromoBanner() {
  return (
    <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-4 sm:mx-6 lg:mx-10">
      <div className="relative rounded-[4px] overflow-hidden border border-neon-blue/15">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a20] via-[#0d0d25] to-[#0a0a20]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(77,166,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(77,166,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-10 py-7">
          <div>
            <p className="text-xs font-mono text-neon-blue tracking-[0.25em] uppercase mb-1">Premium Access</p>
            <h3 className="text-xl sm:text-2xl font-display font-black text-text-primary">Unlock <span className="gradient-text">50,000+</span> Titles</h3>
            <p className="text-sm text-text-muted mt-1">Read without limits. New chapters every day.</p>
          </div>
          <div className="flex gap-3 flex-none">
            <a href="/register" className="px-5 py-2.5 bg-neon-blue text-void font-display font-bold text-sm rounded-sm hover:bg-blue-400 transition-colors shadow-neon-blue">Start Free Trial</a>
            <a href="/catalog" className="px-5 py-2.5 bg-white/8 border border-white/12 text-text-secondary font-medium text-sm rounded-sm hover:bg-white/12">Browse Free</a>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default function HomePage() {
  const [allManga, setAllManga] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mangaService.getAll({ limit: 50 })
      .then(res => {
        setAllManga(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-neon-blue font-mono animate-pulse">LOADING VERSE...</div>

  // Фильтрация на основе данных из базы
  const trending   = allManga.filter(m => m.status === 'ongoing').slice(0, 10)
  const popular    = [...allManga].sort((a, b) => b.views - a.views).slice(0, 10)
  const newTitles  = [...allManga].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10)
  const completed  = allManga.filter(m => m.status === 'completed').slice(0, 10)

  return (
    <div className="min-h-screen">
      <HeroBanner />
      <div className="space-y-12 pb-20 pt-2">
        <ContinueReading />
        <MangaRow label="Hot Right Now" title="Trending" manga={trending} linkTo="/catalog?sort=trending" badge="LIVE" />
        <GenreSpotlight />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-0">
          <NewChapters manga={allManga} />
<TopRanking manga={allManga} />
        </div>
        <MangaRow label="Fan Favorites" title="Most Popular" manga={popular} linkTo="/catalog?sort=views" />
        <PromoBanner />
        <MangaRow label="Just Added" title="New Releases" manga={newTitles} linkTo="/catalog?sort=newest" />
        <MangaRow label="Finished Stories" title="Completed Series" manga={completed} linkTo="/catalog?status=completed" />
        <MangaRow label="Picked for You" title="Recommended" manga={[...allManga].reverse().slice(0, 10)} linkTo="/catalog" />
      </div>
    </div>
  )
}