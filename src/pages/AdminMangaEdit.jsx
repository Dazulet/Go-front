import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mangaService, getImageUrl } from '../services/api'

export default function AdminMangaEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [manga, setManga] = useState(null)
  const [chapters, setChapters] = useState([])
  const [allGenres, setAllGenres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [id])

  const loadData = async () => {
    try {
      const [mData, cData, gData] = await Promise.all([
        mangaService.getById(id),
        mangaService.getChapters(id),
        mangaService.getGenres()
      ])
      
      // Мапим текущие жанры манги в массив ID
      const currentGenreIds = mData.genres?.map(g => g.id) || []
      setManga({ ...mData, genre_ids: currentGenreIds })
      setChapters(cData || [])
      setAllGenres(gData || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const toggleGenre = (genreId) => {
    const currentIds = manga.genre_ids || []
    const newIds = currentIds.includes(genreId)
      ? currentIds.filter(id => id !== genreId)
      : [...currentIds, genreId]
    setManga({ ...manga, genre_ids: newIds })
  }

  const handleUpdateManga = async (e) => {
    e.preventDefault()
    try {
      await mangaService.update(id, manga)
      alert("Manga updated!")
    } catch (e) { alert("Error saving") }
  }

  const handleUploadCover = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      await mangaService.uploadCover(id, file)
      loadData()
    } catch (e) { alert("Upload failed") }
  }

  const handleAddChapter = async () => {
    const num = prompt("Chapter Number:")
    if (!num) return
    try {
      await mangaService.createChapter(id, { number: parseFloat(num), title: `Chapter ${num}` })
      loadData()
    } catch (e) { alert("Failed to add chapter") }
  }

  const handleDeleteChapter = async (chId) => {
    if (confirm("Delete this chapter?")) {
      await mangaService.deleteChapter(chId)
      loadData()
    }
  }

  const handleUploadPages = async (chId) => {
    const input = document.createElement('input')
    input.type = 'file'; input.multiple = true
    input.onchange = async (e) => {
      const files = Array.from(e.target.files)
      if (files.length === 0) return
      alert("Uploading " + files.length + " pages...")
      try {
        await mangaService.uploadPages(chId, files, id)
        alert("Upload complete!")
      } catch (err) { alert("Upload failed") }
    }
    input.click()
  }

  if (loading) return <div className="pt-40 text-center text-neon-blue font-mono">FETCHING SYSTEM DATA...</div>

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Edit System Entry</h1>
        <button onClick={() => navigate('/admin')} className="text-text-muted hover:text-white font-mono text-xs">← EXIT TO DASHBOARD</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Форма инфо */}
          <form onSubmit={handleUpdateManga} className="bg-surface-card border border-border p-6 space-y-6">
             <h2 className="text-xl font-bold border-l-4 border-neon-blue pl-4">Core Metadata</h2>
             <div className="space-y-4">
                <input className="w-full bg-void border border-border p-3 text-white outline-none focus:border-neon-blue" value={manga.title} onChange={e => setManga({...manga, title: e.target.value})} />
                <textarea className="w-full bg-void border border-border p-3 text-white h-40 outline-none focus:border-neon-blue" value={manga.description} onChange={e => setManga({...manga, description: e.target.value})} />
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-mono text-text-muted uppercase">Genre Mapping</label>
                <div className="flex flex-wrap gap-2">
                  {allGenres.map(g => (
                    <button key={g.id} type="button" onClick={() => toggleGenre(g.id)}
                      className={`px-3 py-1.5 text-[10px] font-mono border transition-all ${manga.genre_ids?.includes(g.id) ? 'bg-neon-blue/20 border-neon-blue text-neon-blue' : 'bg-void border-border text-text-muted'}`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
             </div>

<div className="space-y-2">
  <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Publication Status</label>
  <select 
    className="w-full bg-void border border-border p-3 text-white outline-none focus:border-neon-blue appearance-none cursor-pointer"
    value={manga.status}
    onChange={e => setManga({...manga, status: e.target.value})}
  >
    <option value="ongoing">ONGOING</option>
    <option value="completed">COMPLETED</option>
    <option value="hiatus">HIATUS</option>
    <option value="cancelled">CANCELLED</option>
  </select>
</div>
             <button className="bg-neon-blue text-void font-bold px-10 py-3 tracking-widest hover:bg-blue-400">UPDATE DATABASE</button>
          </form>

          {/* Главы */}
          <div className="bg-surface-card border border-border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold border-l-4 border-neon-purple pl-4">Chapter Manager</h2>
              <button onClick={handleAddChapter} className="bg-neon-purple text-white px-4 py-1 text-xs font-black">+ ADD</button>
            </div>
            <div className="space-y-2">
              {chapters.map(ch => (
                <div key={ch.id} className="bg-void border border-border p-4 flex justify-between items-center group hover:border-neon-purple/50 transition-all">
                  <div>
                    <span className="font-mono text-neon-purple mr-4">#{ch.number}</span>
                    <span className="text-sm text-white">{ch.title}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUploadPages(ch.id)} className="text-[10px] bg-white/5 border border-white/10 px-4 py-1 font-bold hover:bg-white/10">PAGES</button>
                    <button onClick={() => handleDeleteChapter(ch.id)} className="text-[10px] text-red-500 border border-red-500/20 px-3 py-1 hover:bg-red-500/10">DEL</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Правая часть */}
        <div className="space-y-6">
           <div className="bg-surface-card border border-border p-6">
             <h2 className="text-xs font-bold text-text-muted mb-4 uppercase">Visual Identity</h2>
             <img src={getImageUrl(manga.cover)} className="w-full aspect-[2/3] object-cover border border-white/10 mb-4" />
             <label className="block w-full text-center bg-surface-3 border border-border py-2.5 text-[10px] font-bold cursor-pointer hover:text-neon-blue transition-all">
               REPLACE COVER IMAGE
               <input type="file" className="hidden" onChange={handleUploadCover} />
             </label>
           </div>
        </div>
      </div>
    </div>
  )
}