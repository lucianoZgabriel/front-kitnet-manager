import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/src/types/api/auth'

interface AuthState {
  user: User | null
  token: string | null
  _hasHydrated: boolean
  setHasHydrated: (hydrated: boolean) => void
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

// Storage customizado com fallback para sessionStorage
const createResilientStorage = () => {
  const BACKUP_KEY = 'auth-storage-backup'

  return {
    getItem: (name: string) => {
      if (typeof window === 'undefined') return null

      // Tentar ler do localStorage primeiro
      const value = localStorage.getItem(name)

      if (value) {
        try {
          const parsed = JSON.parse(value)
          const hasValidData = parsed?.state?.user && parsed?.state?.token

          // Se localStorage tem dados válidos, usar e fazer backup
          if (hasValidData) {
            sessionStorage.setItem(BACKUP_KEY, value)
            return value
          }
        } catch {
          // Erro ao parse, continuar para tentar backup
        }
      }

      // Tentar recuperar do sessionStorage (backup)
      const backup = sessionStorage.getItem(BACKUP_KEY)

      if (backup) {
        try {
          const parsed = JSON.parse(backup)
          if (parsed?.state?.user && parsed?.state?.token) {
            // Restaurar no localStorage
            localStorage.setItem(name, backup)
            return backup
          }
        } catch {
          // Erro ao parse do backup
        }
      }

      return null
    },

    setItem: (name: string, value: string) => {
      if (typeof window === 'undefined') return

      try {
        const parsed = JSON.parse(value)
        const state = parsed?.state

        // Não persistir estado vazio sobre dados válidos
        if (!state?.user || !state?.token) {
          const existing = localStorage.getItem(name)
          if (existing) {
            const existingParsed = JSON.parse(existing)
            const existingState = existingParsed?.state

            // Se já existe user E token válidos, NÃO sobrescrever
            if (existingState?.user && existingState?.token) {
              return // Bloquear persist de estado vazio
            }
          }

          // Se está limpando auth (logout), limpar backup também
          sessionStorage.removeItem(BACKUP_KEY)
        }

        // Persistir normalmente
        localStorage.setItem(name, value)

        // Se tem dados válidos, salvar backup
        if (state?.user && state?.token) {
          sessionStorage.setItem(BACKUP_KEY, value)
        }
      } catch {
        // Erro ao validar persist
      }
    },

    removeItem: (name: string) => {
      if (typeof window === 'undefined') return
      localStorage.removeItem(name)
      sessionStorage.removeItem(BACKUP_KEY)
    },
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      _hasHydrated: false,
      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
      setAuth: (user, token) => {
        set({ user, token })
      },
      clearAuth: () => {
        set({ user: null, token: null })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => createResilientStorage()),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHasHydrated(true)
        }
      },
      skipHydration: false,
    }
  )
)

// Helper functions para usar fora de componentes React
export const getAuthToken = () => useAuthStore.getState().token
export const getAuthUser = () => useAuthStore.getState().user
export const setAuth = (user: User, token: string) => useAuthStore.getState().setAuth(user, token)
export const clearAuth = () => useAuthStore.getState().clearAuth()
