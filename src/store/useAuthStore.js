import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Умный логин: сам идет в API и сохраняет данные
      loginAction: async (credentials) => {
        try {
          const data = await authService.login(credentials)
          // data ожидается как { token: "...", user: {...} }
          set({ 
            user: data.user, 
            token: data.token, 
            isAuthenticated: true 
          })
          return { success: true }
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.message || 'Login failed' 
          }
        }
      },

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem('mv_token')
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

      // Можно синхронизировать с бэкендом при необходимости
      setBookmarks: (list) => set({ bookmarks: list }),

      addBookmark: (manga) => set((state) => ({
        bookmarks: state.bookmarks.find(b => b.id === manga.id)
          ? state.bookmarks
          : [...state.bookmarks, manga],
      })),

      removeBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.filter(b => b.id !== id),
      })),

      isBookmarked: (id) => get().bookmarks.some(b => b.id === id),
    }),
    { name: 'mangaverse-bookmarks' }
  )
)