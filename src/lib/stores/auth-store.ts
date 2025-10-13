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

          console.log('📖 [AuthStore] getItem - Lendo do localStorage:', {
            hasUser: !!parsed?.state?.user,
            hasToken: !!parsed?.state?.token,
            username: parsed?.state?.user?.username,
            hasValidData,
          })

          // CRÍTICO: Se localStorage tem dados válidos, usar e fazer backup
          if (hasValidData) {
            sessionStorage.setItem(BACKUP_KEY, value)
            return value
          }

          // Se localStorage existe mas está com state vazio, NÃO usar!
          // Tentar recuperar do backup em vez disso
          console.warn(
            '⚠️ [AuthStore] localStorage tem dados MAS state está vazio! Tentando backup...'
          )
        } catch {
          console.error('❌ [AuthStore] Erro ao parse do localStorage')
        }
      } else {
        console.log('📖 [AuthStore] localStorage completamente vazio, tentando backup...')
      }

      // Tentar recuperar do sessionStorage (backup)
      const backup = sessionStorage.getItem(BACKUP_KEY)

      if (backup) {
        try {
          const parsed = JSON.parse(backup)
          if (parsed?.state?.user && parsed?.state?.token) {
            console.log('🔄 [AuthStore] RECUPERADO do backup! Restaurando...', {
              username: parsed.state.user.username,
            })
            // Restaurar no localStorage
            localStorage.setItem(name, backup)
            return backup
          }
        } catch {
          console.error('❌ [AuthStore] Erro ao parse do backup')
        }
      }

      console.warn('⚠️ [AuthStore] Nenhum dado encontrado (nem localStorage nem backup)')
      return null
    },

    setItem: (name: string, value: string) => {
      if (typeof window === 'undefined') return

      try {
        const parsed = JSON.parse(value)
        const state = parsed?.state

        console.log('🔍 [AuthStore] setItem chamado:', {
          hasUser: !!state?.user,
          hasToken: !!state?.token,
          username: state?.user?.username,
          tokenPreview: state?.token?.substring(0, 20) + '...',
        })

        // CRÍTICO: Não persistir estado vazio!
        if (!state?.user || !state?.token) {
          // Se tentando salvar estado vazio, verificar se já existe dados válidos
          const existing = localStorage.getItem(name)
          if (existing) {
            const existingParsed = JSON.parse(existing)
            const existingState = existingParsed?.state

            // Se já existe user E token válidos, NÃO sobrescrever com vazio
            if (existingState?.user && existingState?.token) {
              console.warn(
                '⚠️ [AuthStore] BLOQUEADO! Tentativa de sobrescrever dados válidos com vazio'
              )
              return // Abortar persist de estado vazio
            }
          }

          // Se está limpando auth (logout), limpar backup também
          sessionStorage.removeItem(BACKUP_KEY)
          console.log('✅ [AuthStore] Permitindo persist de estado vazio (nenhum dado anterior)')
        }

        // Persistir normalmente
        console.log('💾 [AuthStore] Persistindo no localStorage')
        localStorage.setItem(name, value)

        // Se tem dados válidos, salvar backup
        if (state?.user && state?.token) {
          sessionStorage.setItem(BACKUP_KEY, value)
          console.log('💾 [AuthStore] Backup salvo no sessionStorage')
        }
      } catch (error) {
        console.error('[AuthStore] Erro ao validar persist:', error)
      }
    },

    removeItem: (name: string) => {
      if (typeof window === 'undefined') return
      console.log('🗑️ [AuthStore] removeItem chamado')
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
        console.log('✅ [AuthStore] setAuth chamado:', { username: user.username })
        set({ user, token })
      },
      clearAuth: () => {
        console.error('🚨 [AuthStore] clearAuth CHAMADO! Stack trace:')
        console.trace()
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
