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

// Storage com validação para prevenir estado corrompido em dev mode
const createValidatedStorage = () => {
  return {
    getItem: (name: string) => {
      if (typeof window === 'undefined') return null
      try {
        return localStorage.getItem(name)
      } catch {
        return null
      }
    },

    setItem: (name: string, value: string) => {
      if (typeof window === 'undefined') return

      try {
        // Validar que o estado tem user E token antes de persistir
        const parsed = JSON.parse(value)
        const state = parsed?.state

        // Se estado é inválido (sem user OU sem token)
        if (state && (!state.user || !state.token)) {
          // Verificar se já existe estado válido no storage
          const existing = localStorage.getItem(name)
          if (existing) {
            const existingParsed = JSON.parse(existing)
            const existingState = existingParsed?.state

            // Se já tem auth válido, NÃO sobrescrever com inválido
            if (existingState?.user && existingState?.token) {
              console.warn(
                '[AUTH STORE] BLOQUEADO: tentativa de sobrescrever auth válido com inválido'
              )
              return // BLOQUEAR persist
            }
          }

          // Se não tem auth válido no storage, permitir limpar
          console.log('[AUTH STORE] Limpando auth storage (logout ou estado inicial)')
        }

        // Estado válido OU limpeza intencional, persistir
        localStorage.setItem(name, value)
      } catch (error) {
        console.error('[AUTH STORE] Erro ao validar persist:', error)
      }
    },

    removeItem: (name: string) => {
      if (typeof window === 'undefined') return
      try {
        localStorage.removeItem(name)
      } catch {
        // Falha silenciosa
      }
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
        // Validar antes de salvar
        if (user && token) {
          set({ user, token })
        } else {
          console.error('[AUTH STORE] Tentativa de setAuth com dados inválidos:', {
            hasUser: !!user,
            hasToken: !!token,
          })
        }
      },
      clearAuth: () => {
        set({ user: null, token: null })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => createValidatedStorage()),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          // Validar estado após hydration
          if (state) {
            const hasValidAuth = state.user && state.token

            if (hasValidAuth) {
              console.log('[AUTH STORE] Hydration bem-sucedida com auth válido')
            } else {
              // IMPORTANTE: Durante HMR, o state pode estar temporariamente inválido
              // MAS o localStorage pode ainda ter dados válidos que foram bloqueados
              // Verificar localStorage antes de limpar
              if (typeof window !== 'undefined') {
                try {
                  const authStorage = localStorage.getItem('auth-storage')
                  if (authStorage) {
                    const { state: storedState } = JSON.parse(authStorage)
                    if (storedState?.user && storedState?.token) {
                      console.log(
                        '[AUTH STORE] Hydration com state inválido MAS localStorage válido - restaurando'
                      )
                      // Restaurar do localStorage
                      state.user = storedState.user
                      state.token = storedState.token
                      state.setHasHydrated(true)
                      return // NÃO limpar
                    }
                  }
                } catch (error) {
                  console.error('[AUTH STORE] Erro ao verificar localStorage:', error)
                }
              }

              // Só limpar se localStorage também está inválido
              console.warn(
                '[AUTH STORE] Hydration com auth inválido E localStorage inválido, limpando...'
              )
              state.clearAuth()
            }
            state.setHasHydrated(true)
          }
        }
      },
      skipHydration: false,
      // CRÍTICO: Versão do storage para forçar invalidação em caso de mudanças
      version: 1,
    }
  )
)

// Helper functions para usar fora de componentes React
export const getAuthToken = () => useAuthStore.getState().token
export const getAuthUser = () => useAuthStore.getState().user
export const setAuth = (user: User, token: string) => useAuthStore.getState().setAuth(user, token)
export const clearAuth = () => useAuthStore.getState().clearAuth()
