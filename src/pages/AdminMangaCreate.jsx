import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { mangaService } from '../services/api'

export default function AdminMangaCreate() {
  const navigate = useNavigate()
  const [allGenres, setAllGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '', author: '', description: '', 
    status: 'ongoing', year: 2024, genre_ids: []
  })

  useEffect(() => {
    mangaService.getGenres().then(data => {
      setAllGenres(data || [])
      setLoading(false)
    })
  }, [])

  const toggleGenre = (id) => {
    setForm(prev => ({
      ...prev,
      genre_ids: prev.genre_ids.includes(id)
        ? prev.genre_ids.filter(gid => gid !== id)
        : [...prev.genre_ids, id]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const created = await mangaService.create(form)
      alert("Manga Created! Now add a cover and chapters.")
      navigate(`/admin/manga/edit/${created.id}`)
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Failed to create"))
    }
  }

  if (loading) return <div className="pt-40 text-center text-neon-blue font-mono">LOADING DATABASE...</div>

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-display font-black text-neon-blue mb-8 tracking-tighter">CREATE NEW MANGA</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-surface-card border border-border p-8 rounded-sm shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Manga Title</label>
            <input className="w-full bg-void border border-border p-3 text-white outline-none focus:border-neon-blue transition-all" 
                   placeholder="e.g. One Piece" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Author Name</label>
            <input className="w-full bg-void border border-border p-3 text-white outline-none focus:border-neon-blue transition-all" 
                   placeholder="e.g. Eiichiro Oda" value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Description</label>
            <textarea className="w-full bg-void border border-border p-3 text-white h-32 outline-none focus:border-neon-blue transition-all resize-none" 
                      placeholder="About this story..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="space-y-2">
  <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Status</label>
  <select 
    className="w-full bg-void border border-border p-3 text-white outline-none focus:border-neon-blue appearance-none cursor-pointer"
    value={form.status}
    onChange={e => setForm({...form, status: e.target.value})}
  >
    <option value="ongoing" className="bg-surface-2">ONGOING (Выходит)</option>
    <option value="completed" className="bg-surface-2">COMPLETED (Завершено)</option>
    <option value="hiatus" className="bg-surface-2">HIATUS (Перерыв)</option>
    <option value="cancelled" className="bg-surface-2">CANCELLED (Брошено)</option>
  </select>
</div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Assign Genres</label>
          <div className="flex flex-wrap gap-2 p-4 bg-void border border-border rounded-sm">
            {allGenres.map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGenre(g.id)}
                className={`px-4 py-2 text-xs font-mono border transition-all ${
                  form.genre_ids.includes(g.id)
                    ? 'bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(77,166,255,0.3)]'
                    : 'bg-surface-3 border-transparent text-text-muted hover:border-white/20'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-neon-blue text-void font-black py-4 tracking-[0.2em] hover:bg-blue-400 transition-all shadow-lg">
          SAVE TO DATABASE
        </button>
      </form>
    </div>
  )
}