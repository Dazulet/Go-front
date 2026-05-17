import api from './api'
import { MOCK_MANGA, MOCK_CHAPTERS, MOCK_COMMENTS, MOCK_PAGES } from '@/constants'

// ─── Auth Service ────────────────────────────────────────────────────────────
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => {
    localStorage.removeItem('mv_token')
    localStorage.removeItem('mv_user')
  },
  getMe: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
}

// ─── Manga Service ───────────────────────────────────────────────────────────
const delay = (ms = 600) => new Promise(r => setTimeout(r, ms))

export const mangaService = {
  getList: async (params = {}) => {
    await delay()
    let results = [...MOCK_MANGA]
    if (params.genre) results = results.filter(m => m.genres.map(g => g.toLowerCase()).includes(params.genre))
    if (params.status && params.status !== 'all') results = results.filter(m => m.status === params.status)
    if (params.search) results = results.filter(m => m.title.toLowerCase().includes(params.search.toLowerCase()))
    if (params.sort === 'rating') results.sort((a, b) => b.rating - a.rating)
    if (params.sort === 'popular') results.sort((a, b) => parseFloat(b.views) - parseFloat(a.views))
    return { data: results, total: results.length, page: 1, hasMore: false }
  },

  getById: async (id) => {
    await delay()
    const manga = MOCK_MANGA.find(m => m.id === id) || MOCK_MANGA[0]
    return manga
  },

  getTrending: async () => {
    await delay(400)
    return MOCK_MANGA.filter(m => m.trending)
  },

  getFeatured: async () => {
    await delay(300)
    return MOCK_MANGA.filter(m => m.featured)
  },

  getLatest: async () => {
    await delay(500)
    return [...MOCK_MANGA].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  },

  getChapters: async (mangaId) => {
    await delay(400)
    return MOCK_CHAPTERS
  },

  getChapterPages: async (mangaId, chapterNumber) => {
    await delay(600)
    return MOCK_PAGES
  },

  search: async (query) => {
    await delay(300)
    return MOCK_MANGA.filter(m =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.author.toLowerCase().includes(query.toLowerCase())
    )
  },
}

// ─── Comments Service ────────────────────────────────────────────────────────
export const commentsService = {
  getComments: async (mangaId) => {
    await delay(500)
    return MOCK_COMMENTS
  },

  addComment: async (mangaId, text) => {
    await delay(400)
    return {
      id: `c-${Date.now()}`,
      user: { name: 'You', avatar: null, level: 1 },
      text,
      likes: 0,
      createdAt: new Date().toISOString(),
      replies: 0,
    }
  },

  likeComment: (commentId) => api.post(`/comments/${commentId}/like`),
}

// ─── Bookmarks Service ───────────────────────────────────────────────────────
export const bookmarksService = {
  getBookmarks: () => {
    const saved = localStorage.getItem('mv_bookmarks')
    return saved ? JSON.parse(saved) : []
  },

  toggleBookmark: (manga) => {
    const bookmarks = bookmarksService.getBookmarks()
    const idx = bookmarks.findIndex(b => b.id === manga.id)
    let updated
    if (idx >= 0) {
      updated = bookmarks.filter(b => b.id !== manga.id)
    } else {
      updated = [{ ...manga, bookmarkedAt: new Date().toISOString() }, ...bookmarks]
    }
    localStorage.setItem('mv_bookmarks', JSON.stringify(updated))
    return updated
  },

  isBookmarked: (mangaId) => {
    const bookmarks = bookmarksService.getBookmarks()
    return bookmarks.some(b => b.id === mangaId)
  },
}

// ─── Reading History ─────────────────────────────────────────────────────────
export const historyService = {
  getHistory: () => {
    const saved = localStorage.getItem('mv_history')
    return saved ? JSON.parse(saved) : []
  },

  saveProgress: (mangaId, chapterId, page) => {
    const history = historyService.getHistory()
    const existing = history.findIndex(h => h.mangaId === mangaId)
    const entry = { mangaId, chapterId, page, updatedAt: new Date().toISOString() }
    if (existing >= 0) {
      history[existing] = entry
    } else {
      history.unshift(entry)
    }
    localStorage.setItem('mv_history', JSON.stringify(history.slice(0, 100)))
  },

  getProgress: (mangaId) => {
    const history = historyService.getHistory()
    return history.find(h => h.mangaId === mangaId) || null
  },
}
