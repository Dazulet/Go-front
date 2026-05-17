import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/services'
import toast from 'react-hot-toast'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true })
        try {
          // Mock login — replace with real API call
          await new Promise(r => setTimeout(r, 800))
          const mockUser = {
            id: 'u1',
            name: credentials.email.split('@')[0],
            email: credentials.email,
            avatar: null,
            level: 12,
            joinedAt: new Date().toISOString(),
            readCount: 47,
            bookmarkCount: 8,
          }
          const mockToken = 'mock-jwt-token-' + Date.now()
          localStorage.setItem('mv_token', mockToken)
          set({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false })
          toast.success('Welcome back!')
          return true
        } catch (err) {
          set({ isLoading: false })
          toast.error('Invalid credentials')
          return false
        }
      },

      register: async (data) => {
        set({ isLoading: true })
        try {
          await new Promise(r => setTimeout(r, 1000))
          const mockUser = {
            id: 'u' + Date.now(),
            name: data.name,
            email: data.email,
            avatar: null,
            level: 1,
            joinedAt: new Date().toISOString(),
            readCount: 0,
            bookmarkCount: 0,
          }
          const mockToken = 'mock-jwt-token-' + Date.now()
          localStorage.setItem('mv_token', mockToken)
          set({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false })
          toast.success('Account created successfully!')
          return true
        } catch (err) {
          set({ isLoading: false })
          toast.error('Registration failed')
          return false
        }
      },

      logout: () => {
        authService.logout()
        set({ user: null, token: null, isAuthenticated: false })
        toast.success('Logged out')
      },

      updateUser: (updates) => {
        set(state => ({ user: { ...state.user, ...updates } }))
      },
    }),
    {
      name: 'mv-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)

export default useAuthStore
