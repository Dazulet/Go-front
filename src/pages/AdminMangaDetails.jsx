import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mangaService, getImageUrl } from '../services/api'

export default function AdminMangaDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [manga, setManga] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)

  // Для новой главы
  const [newCh, setNewCh] = useState({ number: '', title: '' })

  useEffect(() => {
    loadMangaData()
  }, [id])

  const loadMangaData = async () => {
    try {
      const mData = await mangaService.getById(id)
      const cData = await mangaService.getChapters(id)
      setManga(mData)
      setChapters(cData || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const handleCreateChapter = async (e) => {
    e.preventDefault()
    const num = parseFloat(newCh.number);
  
  if (isNaN(num)) {
    alert("Number must be a valid number");
    return;
  }
    try {
    await mangaService.createChapter(id, {
      number: num,
      title: newCh.title || "",
        volume: 1
      })
      setNewCh({ number: '', title: '' })
      loadMangaData()
      alert("Глава создана!")
    } catch (e) { alert("Ошибка при создании главы") }
  }

  const handleUploadPages = async (chapterId) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = async (e) => {
      const files = Array.from(e.target.files)
      if (files.length === 0) return
      
      try {
        alert("Загрузка началась, подождите...")
        await mangaService.uploadPages(chapterId, files, id)
        alert(`Успешно загружено ${files.length} страниц!`)
        loadMangaData()
      } catch (err) { alert("Ошибка при загрузке") }
    }
    input.click()
  }

  if (loading) return <div className="pt-20 text-center font-mono">LOADING MANGA SETTINGS...</div>
  if (!manga) return <div className="pt-20 text-center">Manga not found</div>

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-5xl mx-auto">
      <button onClick={() => navigate('/admin')} className="mb-6 text-neon-blue text-sm">← Back to Admin</button>
      
      <div className="flex gap-8 bg-surface-card border border-border p-6 mb-10">
        <img src={getImageUrl(manga.cover)} className="w-32 h-48 object-cover rounded-sm" />
        <div>
          <h1 className="text-3xl font-display font-black text-white">{manga.title}</h1>
          <p className="text-text-muted mb-4">Manage Chapters & Content</p>
          <div className="flex gap-2">
             <span className="px-2 py-1 bg-surface-3 text-xs">ID: {manga.id}</span>
             <span className="px-2 py-1 bg-surface-3 text-xs">Status: {manga.status}</span>
          </div>
        </div>
      </div>

      {/* Форма создания главы */}
      <section className="bg-surface-2 border border-border p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Add New Chapter</h2>
        <form onSubmit={handleCreateChapter} className="flex gap-4">
          <input type="number" step="0.1" placeholder="Ch. Number" className="bg-void border border-border p-2 w-24 outline-none focus:border-neon-blue" 
                 value={newCh.number} onChange={e => setNewCh({...newCh, number: e.target.value})} required />
          <input type="text" placeholder="Chapter Title (optional)" className="bg-void border border-border p-2 flex-1 outline-none focus:border-neon-blue" 
                 value={newCh.title} onChange={e => setNewCh({...newCh, title: e.target.value})} />
          <button className="bg-neon-blue text-void font-bold px-6 py-2 hover:bg-blue-400">CREATE</button>
        </form>
      </section>

      {/* Список глав */}
      <section>
        <h2 className="text-xl font-bold mb-6">Chapters ({chapters.length})</h2>
        <div className="space-y-2">
          {chapters.map(ch => (
            <div key={ch.id} className="bg-surface-card border border-border p-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-neon-purple mr-4">#{ch.number}</span>
                <span className="text-white">{ch.title || `Chapter ${ch.number}`}</span>
              </div>
              <button 
                onClick={() => handleUploadPages(ch.id)}
                className="px-4 py-1 border border-neon-blue text-neon-blue text-xs hover:bg-neon-blue/10"
              >
                UPLOAD PAGES
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}