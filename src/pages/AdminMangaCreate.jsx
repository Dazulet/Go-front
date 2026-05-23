import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { mangaService } from '../services/api'

export default function AdminMangaCreate() {
  const navigate = useNavigate()
  const [genres, setGenres] = useState([])
  const [form, setForm] = useState({
    title: '', alt_title: '', author: '', description: '', 
    status: 'ongoing', year: 2024, genre_ids: []
  })

  useEffect(() => {
    mangaService.getGenres().then(setGenres)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const created = await mangaService.create(form)
      alert("Манга создана! Теперь загрузите обложку.")
      navigate(`/admin/manga/edit/${created.id}`)
    } catch (err) { alert("Ошибка создания") }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-display font-black text-neon-blue mb-8">CREATE NEW MANGA</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-surface-card border border-border p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-muted uppercase">Title</label>
            <input className="w-full bg-void border border-border p-3 text-white outline-none focus:border-neon-blue" 
                   value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-muted uppercase">Author</label>
            <input className="w-full bg-void border border-border p-3 text-white outline-none focus:border-neon-blue" 
                   value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-mono text-text-muted uppercase">Description</label>
            <textarea className="w-full bg-void border border-border p-3 text-white h-32 outline-none focus:border-neon-blue" 
                      value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-muted uppercase">Status</label>
            <select className="w-full bg-void border border-border p-3 text-white outline-none" 
                    value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-muted uppercase">Release Year</label>
            <input type="number" className="w-full bg-void border border-border p-3 text-white outline-none" 
                   value={form.year} onChange={e => setForm({...form, year: parseInt(e.target.value)})} />
          </div>
        </div>

        <button type="submit" className="w-full bg-neon-blue text-void font-black py-4 hover:bg-blue-400 transition-all">
          SAVE AND CONTINUE
        </button>
      </form>
    </div>
  )
}