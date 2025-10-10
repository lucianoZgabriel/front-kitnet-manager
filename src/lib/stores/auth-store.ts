import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/src/types/api/auth'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

// Helper functions para usar fora de componentes React
export const getAuthToken = () => useAuthStore.getState().token
export const getAuthUser = () => useAuthStore.getState().user
export const setAuth = (user: User, token: string) => useAuthStore.getState().setAuth(user, token)
export const clearAuth = () => useAuthStore.getState().clearAuth()
