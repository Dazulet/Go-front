import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'

// Функция для создания инстанса с интерцептором (подстановкой токена)
const createInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
  })

  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        useAuthStore.getState().logout()
      }
      return Promise.reject(err)
    }
  )
  return instance
}

// Создаем API для каждого микросервиса
export const authApi = createInstance(import.meta.env.VITE_AUTH_URL)
export const mangaApi = createInstance(import.meta.env.VITE_MANGA_URL)
export const commentApi = createInstance(import.meta.env.VITE_COMMENT_URL)

// --- MANGA SERVICE ---
// --- MANGA SERVICE (Полный CRUD) ---
export const mangaService = {
  getAll: (params) => mangaApi.get('/manga', { params }).then(res => res.data),
  getById: (id) => mangaApi.get(`/manga/${id}`).then(res => res.data.data),
  getBySlug: (slug) => mangaApi.get(`/manga/slug/${slug}`).then(res => res.data.data),
  
  // Создание, обновление, удаление манги
  create: (data) => mangaApi.post('/manga', data).then(res => res.data.data),
  update: (id, data) => mangaApi.put(`/manga/${id}`, data).then(res => res.data.data),
  delete: (id) => mangaApi.delete(`/manga/${id}`).then(res => res.data),
  


  // Загрузка обложки
  uploadCover: (id, file) => {
    const formData = new FormData();
    formData.append('cover', file);
    return mangaApi.post(`/manga/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  // ГЛАВЫ
  getChapters: (id) => mangaApi.get(`/manga/${id}/chapters`).then(res => res.data.data),
  getChapterDetails: (id) => mangaApi.get(`/chapters/${id}`).then(res => res.data.data),
  createChapter: (mangaId, data) => mangaApi.post(`/manga/${mangaId}/chapters`, data).then(res => res.data.data),
  updateChapter: (id, data) => mangaApi.put(`/chapters/${id}`, data).then(res => res.data.data),
  deleteChapter: (id) => mangaApi.delete(`/chapters/${id}`).then(res => res.data),

  // Загрузка страниц в главу
  // src/services/api.js

uploadPages: (chapterId, files, mangaId) => {
  const fd = new FormData(); // Мы создали переменную fd
  
  // Добавляем файлы
  files.forEach(file => {
    fd.append('pages', file); 
  });
  
  // ИСПРАВЛЕНИЕ: здесь было formData.append, а нужно fd.append
  fd.append('manga_id', mangaId); 
  
  return mangaApi.post(`/chapters/${chapterId}/pages`, fd, {
    headers: { 
      // Важно: браузер сам подставит правильный boundary для multipart, 
      // поэтому лучше оставить заголовок пустым или не указывать его вручную вовсе
      'Content-Type': 'multipart/form-data' 
    }
  }).then(res => res.data);
},

  // Прочее
  getGenres: () => mangaApi.get('/genres').then(res => res.data.data),
    createGenre: (data) => mangaApi.post('/genres', data).then(res => res.data.data),

  getTags: () => mangaApi.get('/tags').then(res => res.data.data),
  saveProgress: (mangaId, chapterId, pageNum = 1) => 
  mangaApi.post('/progress', { 
    manga_id: parseInt(mangaId), 
    chapter_id: parseInt(chapterId), 
    page_number: pageNum 
  }).then(res => res.data),

getProgress: () => mangaApi.get('/progress').then(res => res.data.data),
}

// --- AUTH SERVICE (Управление пользователями) ---
export const authService = {
  login: (data) => authApi.post('/auth/login', data).then(res => res.data.data),
  register: (data) => authApi.post('/auth/register', data).then(res => res.data.data),
  getMe: () => authApi.get('/users/me').then(res => res.data.data),
    getProfile: (id) => authApi.get(`/users/${id}`).then(res => res.data.data),

  // Методы для админа
  getAllUsers: () => authApi.get('/users').then(res => res.data.data),
  updateUser: (id, data) => authApi.patch(`/users/${id}`, data).then(res => res.data.data),
  deleteUser: (id) => authApi.delete(`/users/${id}`).then(res => res.data),
}

// --- BOOKMARK SERVICE ---
export const bookmarkService = {
  getAll: () => mangaApi.get('/bookmarks').then(res => res.data.data),
  
  add: (mangaId) => {
    // Явно превращаем в число
    const id = typeof mangaId === 'string' ? parseInt(mangaId, 10) : mangaId;
    return mangaApi.post('/bookmarks', { 
      manga_id: id, 
      status: "reading" 
    }).then(res => res.data.data);
  },

  remove: (mangaId) => {
    // Передаем ID именно как часть пути
    const id = typeof mangaId === 'string' ? parseInt(mangaId, 10) : mangaId;
    return mangaApi.delete(`/bookmarks/${id}`).then(res => res.data);
  },
}


// --- COMMENT SERVICE ---
export const commentService = {
  getByManga: (mangaId) => commentApi.get(`/comments?manga_id=${mangaId}`).then(res => res.data.data),
  create: (data) => commentApi.post('/comments', data).then(res => res.data.data),
  delete: (id) => commentApi.delete(`/comments/${id}`).then(res => res.data),
toggleLike: (id) => commentApi.post(`/comments/${id}/like`).then(res => res.data),
}

// Утилита для получения полных URL картинок (т.к. бэк шлет относительные пути)
export const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/400x560?text=No+Cover'
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_ASSETS_URL}/${path}`
}