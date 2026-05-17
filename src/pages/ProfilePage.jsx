import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore, useBookmarkStore } from '../store/useAuthStore'
import MangaCard from '../components/manga/MangaCard'
import { MOCK_MANGA } from '../constants/manga'

const TABS = ['Bookmarks', 'History', 'Settings']

function StatCard({ value, label, accent = false }) {
  return (
    <div className={`p-4 rounded-[4px] border ${accent ? 'bg-neon-blue/8 border-neon-blue/25' : 'bg-surface-card border-border'}`}>
      <div className={`text-2xl font-display font-black mb-0.5 ${accent ? 'text-neon-blue' : 'gradient-text'}`}>{value}</div>
      <div className="text-xs font-mono text-text-muted uppercase tracking-wider">{label}</div>
    </div>
  )
}

// Fake history items
const HISTORY = MOCK_MANGA.slice(0, 5).map((m, i) => ({
  ...m,
  readAt: ['Just now', '2h ago', '1d ago', '3d ago', '1w ago'][i],
  lastChapter: Math.floor(Math.random() * m.chapters) + 1,
}))

export default function ProfilePage() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { bookmarks, removeBookmark } = useBookmarkStore()
  const [activeTab, setActiveTab] = useState('Bookmarks')
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({ username: user?.username || '', bio: 'Manga enthusiast. Reading since 2019.' })

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: '/profile' }} replace />

  return (
    <div className="min-h-screen pt-16">
      {/* ── Profile hero ─────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Banner */}
        <div className="h-44 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a28] via-[#0d0d22] to-void" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(77,166,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(77,166,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/8 via-transparent to-neon-violet/8" />
        </div>

        {/* Profile card floating over banner */}
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="relative -mt-16 pb-6 flex flex-col sm:flex-row gap-5 items-start sm:items-end">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex-none"
            >
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-neon-blue via-neon-violet to-neon-pink flex items-center justify-center text-void text-4xl font-display font-black ring-4 ring-void shadow-neon-purple">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-void" />
            </motion.div>

            {/* Name + actions */}
            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-display font-black text-text-primary">{user?.username}</h1>
                <p className="text-text-muted text-sm font-mono">{user?.email}</p>
                <p className="text-text-secondary text-sm mt-1">{editData.bio}</p>
              </div>
              <div className="flex gap-2 flex-none">
                <button
                  onClick={() => setEditMode(p => !p)}
                  className={`px-4 py-2 text-sm border rounded-[4px] font-medium transition-all ${editMode ? 'bg-neon-blue/12 border-neon-blue/40 text-neon-blue' : 'bg-surface-2 border-border text-text-secondary hover:text-text-primary hover:border-border-glow'}`}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm border border-border bg-surface-2 text-text-secondary rounded-[4px] hover:border-red-500/40 hover:text-red-400 transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatCard value={bookmarks.length} label="Bookmarks" accent />
            <StatCard value="47" label="Chapters Read" />
            <StatCard value="12" label="Series Following" />
            <StatCard value="8" label="Completed" />
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────── */}
      <div className="border-b border-border sticky top-16 z-30 bg-void/95 backdrop-blur-xl">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex gap-0">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-3.5 text-sm font-medium transition-colors ${activeTab === tab ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="profile-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-blue" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab content ──────────────────────────────── */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <AnimatePresence mode="wait">

          {/* Bookmarks */}
          {activeTab === 'Bookmarks' && (
            <motion.div key="bookmarks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {bookmarks.length > 0 ? (
                <>
                  <p className="text-sm text-text-muted mb-6 font-mono">{bookmarks.length} saved title{bookmarks.length !== 1 ? 's' : ''}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-7">
                    {bookmarks.map((manga, i) => (
                      <div key={manga.id} className="relative group/bm">
                        <MangaCard manga={manga} index={i} />
                        <button
                          onClick={() => removeBookmark(manga.id)}
                          className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-red-500/80 text-white text-[9px] font-mono rounded-sm opacity-0 group-hover/bm:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-28 text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-2 border border-border flex items-center justify-center mb-5">
                    <svg className="w-7 h-7 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-display font-bold text-text-secondary mb-2">No bookmarks yet</h3>
                  <p className="text-sm text-text-muted mb-6 max-w-xs">Save manga to your library while browsing the catalog.</p>
                  <Link to="/catalog" className="px-5 py-2.5 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-sm font-medium rounded-[4px] hover:bg-neon-blue/15 transition-colors">
                    Browse Catalog
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* History */}
          {activeTab === 'History' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <p className="text-sm text-text-muted mb-6 font-mono">{HISTORY.length} recently read</p>
              <div className="space-y-2">
                {HISTORY.map((manga, i) => (
                  <motion.div key={manga.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link
                      to={'/reader/' + manga.id + '/' + manga.lastChapter}
                      className="flex items-center gap-4 p-3.5 bg-surface-card border border-border rounded-[4px] hover:border-neon-blue/25 hover:bg-surface-2 transition-all group"
                    >
                      <img src={manga.cover} alt={manga.title} className="w-10 h-14 object-cover rounded-sm flex-none" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary group-hover:text-neon-blue transition-colors line-clamp-1">{manga.title}</p>
                        <p className="text-xs text-neon-blue font-mono mt-0.5">Ch.{manga.lastChapter} — Continue Reading</p>
                      </div>
                      <div className="text-right flex-none">
                        <p className="text-[11px] font-mono text-text-muted">{manga.readAt}</p>
                        <div className="mt-1 w-20 h-1 bg-surface-3 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-neon-blue to-neon-violet rounded-full"
                            style={{ width: Math.round((manga.lastChapter / manga.chapters) * 100) + '%' }}
                          />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings */}
          {activeTab === 'Settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="max-w-lg space-y-6">
                <div className="bg-surface-card border border-border rounded-[4px] p-6">
                  <h3 className="text-sm font-display font-bold text-text-primary mb-5">Profile Information</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Display Name', key: 'username', value: editData.username },
                      { label: 'Bio', key: 'bio', value: editData.bio },
                    ].map(({ label, key, value }) => (
                      <div key={key}>
                        <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">{label}</label>
                        <input
                          defaultValue={value}
                          onChange={e => setEditData(p => ({ ...p, [key]: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-[4px] text-sm text-text-primary outline-none focus:border-neon-blue/40 transition-colors"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Email</label>
                      <input
                        defaultValue={user?.email}
                        disabled
                        className="w-full px-4 py-2.5 bg-surface-3 border border-border rounded-[4px] text-sm text-text-muted cursor-not-allowed opacity-60"
                      />
                    </div>
                    <button className="px-5 py-2.5 bg-neon-blue text-void text-sm font-display font-bold rounded-[4px] hover:bg-blue-400 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="bg-surface-card border border-red-500/15 rounded-[4px] p-6">
                  <h3 className="text-sm font-display font-bold text-red-400 mb-2">Danger Zone</h3>
                  <p className="text-xs text-text-muted mb-4">Once you delete your account, there is no going back.</p>
                  <button className="px-5 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium rounded-[4px] hover:bg-red-500/15 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
