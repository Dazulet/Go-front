import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) useAuthStore.getState().logout()
    return Promise.reject(err)
  }
)

export const mangaService = {
  getAll: (params) => api.get('/manga', { params }),
  getById: (id) => api.get(`/manga/${id}`),
  getTrending: () => api.get('/manga/trending'),
  getLatest: () => api.get('/manga/latest'),
  search: (query) => api.get('/manga/search', { params: { q: query } }),
  getChapters: (id) => api.get(`/manga/${id}/chapters`),
  getChapter: (mangaId, chapterId) => api.get(`/manga/${mangaId}/chapters/${chapterId}`),
}

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
}

export const bookmarkService = {
  getAll: () => api.get('/bookmarks'),
  add: (mangaId) => api.post('/bookmarks', { mangaId }),
  remove: (mangaId) => api.delete(`/bookmarks/${mangaId}`),
}

export const commentService = {
  getByManga: (mangaId) => api.get(`/manga/${mangaId}/comments`),
  create: (mangaId, data) => api.post(`/manga/${mangaId}/comments`, data),
  delete: (id) => api.delete(`/comments/${id}`),
}

export default api
