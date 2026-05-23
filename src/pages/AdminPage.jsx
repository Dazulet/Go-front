import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' // <-- ЭТОГО ИМПОРТА НЕ ХВАТАЛО
import { mangaService, authService, getImageUrl } from '../services/api'
import { useAuthStore } from '../store/useAuthStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminPage() {
  const { user: currentUser } = useAuthStore()
  const [tab, setTab] = useState('manga') // 'manga' | 'users'
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [tab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (tab === 'manga') {
        const res = await mangaService.getAll({ limit: 100 })
        setItems(res.data)
      } else {
        const data = await authService.getAllUsers()
        setItems(data)
      }
    } catch (e) { 
      console.error("Admin Load Error:", e) 
    }
    setLoading(false)
  }

  const handleDeleteManga = async (id) => {
    if (confirm("Delete this manga and all its chapters?")) {
      await mangaService.delete(id)
      loadData()
    }
  }

  const handleEditUser = async (user) => {
    const userId = user.ID || user.id
    const currentName = user.Username || user.username
    const currentRole = user.Role || user.role

    const newRole = prompt("New role (user/admin):", currentRole)
    const newName = prompt("New username:", currentName)
    
    if (newRole || newName) {
      await authService.updateUser(userId, { 
        role: newRole || currentRole, 
        username: newName || currentName 
      })
      loadData()
    }
  }

  if (currentUser?.role !== 'admin') return <div className="pt-40 text-center text-red-500 font-display">ACCESS DENIED</div>

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex gap-6 mb-10 border-b border-white/10 pb-4">
        <button onClick={() => setTab('manga')} className={`text-xl font-display font-black transition-all ${tab === 'manga' ? 'text-neon-blue' : 'text-text-muted hover:text-white'}`}>MANGA</button>
        <button onClick={() => setTab('users')} className={`text-xl font-display font-black transition-all ${tab === 'users' ? 'text-neon-pink' : 'text-text-muted hover:text-white'}`}>USERS</button>
      </div>

      {loading ? (
        <div className="text-center py-20 font-mono animate-pulse text-neon-blue">SYNCHRONIZING...</div>
      ) : (
        <div className="space-y-4">
          {tab === 'manga' ? (
            <div className="grid grid-cols-1 gap-3">
              {items.map(m => (
                <div key={m.id} className="bg-surface-2 border border-border p-4 flex items-center justify-between group hover:border-neon-blue/50 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={getImageUrl(m.cover)} className="w-12 h-16 object-cover rounded-sm border border-white/10" />
                    <div>
                      <h3 className="font-bold text-white">{m.title}</h3>
                      <p className="text-[10px] font-mono text-text-muted">ID: {m.id} | Views: {m.views}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/manga/${m.id}`} className="px-4 py-1.5 bg-white/5 border border-white/10 text-[10px] font-bold text-white hover:bg-white/10 transition-all">
                      MANAGE
                    </Link>
                    <button onClick={() => handleDeleteManga(m.id)} className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 hover:bg-red-500/20 transition-all">
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && <div className="text-center py-10 text-text-muted">No manga found in database.</div>}
            </div>
          ) : (
            <div className="bg-surface-card border border-border overflow-hidden">
              <table className="w-full text-left">
                <thead className="text-[10px] text-text-muted uppercase bg-white/5 font-mono">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {items.map(u => (
                    <tr key={u.ID || u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">{u.ID || u.id}</td>
    <td className="p-4 font-bold">{u.Username || u.username}</td>
    <td className="p-4">{u.Email || u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${u.Role === 'admin' || u.role === 'admin' ? 'bg-neon-pink text-void' : 'bg-surface-3 text-text-secondary'}`}>
                          {(u.Role || u.role || 'user').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleEditUser(u)} className="text-neon-blue text-xs font-bold hover:underline">EDIT</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}