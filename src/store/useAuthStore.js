import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
    }),
    {
      name: 'mangaverse-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)

export const useBookmarkStore = create(
  persist(
    (set, get) => ({
      bookmarks: [],

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
