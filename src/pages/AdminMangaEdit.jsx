import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mangaService, getImageUrl } from '../services/api'

export default function AdminMangaEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [manga, setManga] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [id])

  const loadData = async () => {
    try {
      const m = await mangaService.getById(id)
      const c = await mangaService.getChapters(id)
      setManga(m); setChapters(c || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  // --- МАНГА ---
  const handleUpdateManga = async (e) => {
    e.preventDefault()
    await mangaService.update(id, manga)
    alert("Данные сохранены")
  }

  const handleUploadCover = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    await mangaService.uploadCover(id, file)
    loadData()
  }

  const handleDeleteManga = async () => {
    if (confirm("УДАЛИТЬ МАНГУ И ВСЕ ГЛАВЫ?")) {
      await mangaService.delete(id)
      navigate('/admin')
    }
  }

  // --- ГЛАВЫ ---
  const handleAddChapter = async () => {
    const num = prompt("Номер главы:")
    if (!num) return
    await mangaService.createChapter(id, { number: parseFloat(num), title: `Chapter ${num}` })
    loadData()
  }

  const handleDeleteChapter = async (chId) => {
    if (confirm("Удалить главу?")) {
      await mangaService.deleteChapter(chId)
      loadData()
    }
  }

  const handleUploadPages = async (chId) => {
    const input = document.createElement('input')
    input.type = 'file'; input.multiple = true
    input.onchange = async (e) => {
      const files = Array.from(e.target.files)
      alert("Загрузка...")
      await mangaService.uploadPages(chId, files, id)
      alert("Готово!")
    }
    input.click()
  }

  if (loading) return <div className="pt-40 text-center text-neon-blue">LOADING...</div>

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-black text-white">EDIT: {manga.title}</h1>
        <button onClick={handleDeleteManga} className="bg-red-500/20 text-red-500 border border-red-500/50 px-4 py-2 text-xs font-bold hover:bg-red-500 hover:text-white">DELETE MANGA</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка: Основные данные */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpdateManga} className="bg-surface-card border border-border p-6 space-y-4">
             <h2 className="text-xl font-bold border-l-4 border-neon-blue pl-3">Main Info</h2>
             <input className="w-full bg-void border border-border p-3 text-white" value={manga.title} onChange={e => setManga({...manga, title: e.target.value})} />
             <textarea className="w-full bg-void border border-border p-3 text-white h-40" value={manga.description} onChange={e => setManga({...manga, description: e.target.value})} />
             <button className="bg-neon-blue text-void font-bold px-8 py-3">SAVE CHANGES</button>
          </form>

          {/* Список глав */}
          <div className="bg-surface-card border border-border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold border-l-4 border-neon-purple pl-3">Chapters ({chapters.length})</h2>
              <button onClick={handleAddChapter} className="bg-neon-purple text-white px-4 py-1 text-sm font-bold">+ NEW CHAPTER</button>
            </div>
            <div className="space-y-2">
              {chapters.map(ch => (
                <div key={ch.id} className="bg-void border border-border p-4 flex justify-between items-center group">
                  <span className="font-mono text-neon-blue">#{ch.number} - {ch.title}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleUploadPages(ch.id)} className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 hover:bg-white/10">PAGES</button>
                    <button onClick={() => handleDeleteChapter(ch.id)} className="text-[10px] text-red-500 border border-red-500/30 px-3 py-1 hover:bg-red-500/10">DEL</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Правая колонка: Обложка и статус */}
        <div className="space-y-6">
           <div className="bg-surface-card border border-border p-6">
             <h2 className="text-sm font-bold text-text-muted mb-4 uppercase">Cover Image</h2>
             <img src={getImageUrl(manga.cover)} className="w-full aspect-[2/3] object-cover border border-white/10 mb-4" />
             <label className="block w-full text-center bg-surface-3 border border-border py-2 text-xs font-bold cursor-pointer hover:text-neon-blue">
               CHANGE COVER
               <input type="file" className="hidden" onChange={handleUploadCover} />
             </label>
           </div>
        </div>
      </div>
    </div>
  )
}