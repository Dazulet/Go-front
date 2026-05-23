import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService,bookmarkService } from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Умный логин: сам идет в API и сохраняет данные
      // Внутри useAuthStore в методе loginAction (после успешного входа):
loginAction: async (credentials) => {
  try {
    const data = await authService.login(credentials)
    set({ user: data.user, token: data.token, isAuthenticated: true })
    
    // ВАЖНО: Сразу после логина скачиваем закладки этого юзера из базы
    useBookmarkStore.getState().fetchBookmarks(); 
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Login failed' }
  }
},

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      
      logout: () => {
  set({ user: null, token: null, isAuthenticated: false });
  localStorage.removeItem('mv_token');
  // Очищаем кэш закладок в браузере, чтобы новый юзер их не видел
  localStorage.removeItem('mangaverse-bookmarks'); 
  window.location.href = '/login';
},

      
      updateUser: (data) => set((state) => ({ 
        user: { ...state.user, ...data } 
      })),
    }),
    {
      name: 'mangaverse-auth',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

export const useBookmarkStore = create(
  persist(
    (set, get) => ({
      bookmarks: [],

      // Функция загрузки закладок с сервера (вызывай её при логине или на странице профиля)
      fetchBookmarks: async () => {
        try {
          const data = await bookmarkService.getAll()
          set({ bookmarks: data || [] })
        } catch (e) { console.error(e) }
      },

      // Добавление закладки (с запросом к БД)
    addBookmark: async (manga) => {
  try {
    // 1. Шлем запрос в базу
    await bookmarkService.add(manga.id || manga.ID);
    
    // 2. Если бэк ответил успехом, добавляем в локальный список
    set((state) => ({
      bookmarks: [...state.bookmarks, manga]
    }));
    
    console.log("Добавлено в базу и в локальный стор");
  } catch (e) {
    alert("Ошибка при сохранении");
  }
},

removeBookmark: async (mangaId) => {
  try {
    const mid = parseInt(mangaId);
    // 1. Шлем запрос на удаление
    await bookmarkService.remove(mid);
    
    // 2. ВАЖНО: Удаляем из локального списка по ЛЮБОМУ из возможных ID
    set((state) => ({
      bookmarks: state.bookmarks.filter(b => 
        (b.id !== mid) && (b.manga_id !== mid) && (b.ID !== mid)
      ),
    }));
    
    console.log("Удалено из базы и из локального стора");
  } catch (e) {
    alert("Ошибка при удалении");
  }
},

isBookmarked: (id) => {
  const list = get().bookmarks;
  if (!id || !list) return false;
  const mid = parseInt(id);
  // Проверяем все варианты названий ID, которые могут прийти от Go
  return list.some(b => {
    // Проверяем все возможные варианты, как бэкенд мог прислать ID
    const bookmarkMangaId = b.manga_id || b.id || (b.manga && b.manga.id);
    return parseInt(bookmarkMangaId) === mid;
  });

},

    }),
    { name: 'mangaverse-bookmarks' }
  )
)
