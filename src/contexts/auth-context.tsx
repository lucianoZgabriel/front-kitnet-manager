'use client'

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { useAuthStore } from '@/src/lib/stores/auth-store'
import { authService } from '@/src/lib/api/auth.service'
import type { User, LoginRequest } from '@/src/types/api/auth'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, token, _hasHydrated, setAuth, clearAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Aguardar hidratação do Zustand antes de inicializar
  useEffect(() => {
    // Só executar UMA VEZ após a hidratação completar
    if (!_hasHydrated || hasInitialized) {
      if (!_hasHydrated) {
        console.log('⏳ [AuthContext] Aguardando hidratação...')
      }
      return
    }

    console.log('🔄 [AuthContext] Hidratação completa, verificando token...', {
      hasToken: !!token,
      hasUser: !!user,
    })

    const initializeAuth = async () => {
      if (token) {
        console.log('✅ [AuthContext] Token encontrado, buscando dados do usuário...')

        try {
          const response = await authService.getCurrentUser()
          if (response.success && response.data) {
            console.log('✅ [AuthContext] Usuário autenticado:', response.data.username)
            setAuth(response.data, token)
          } else {
            console.warn('⚠️ [AuthContext] Falha ao buscar usuário (resposta não sucesso)')
            // NÃO limpar auth - pode ser erro temporário do backend
            // O usuário já tem user+token no store, deixar como está
          }
        } catch (error) {
          console.error('❌ [AuthContext] Erro ao buscar dados do usuário:', error)
          // NÃO limpar auth automaticamente - pode ser erro temporário (500, network, etc)
          // Se for 401, o interceptor do axios já vai redirecionar
          // Para outros erros, manter o usuário logado com dados em cache
          console.warn('⚠️ [AuthContext] Mantendo autenticação em cache (erro pode ser temporário)')
        } finally {
          // SEMPRE setar isLoading = false DEPOIS da API call completar
          console.log('✅ [AuthContext] Finalizando inicialização')
          setIsLoading(false)
          setHasInitialized(true)
        }
      } else {
        console.warn('⚠️ [AuthContext] Nenhum token após hidratação')
        setIsLoading(false)
        setHasInitialized(true)
      }
    }

    initializeAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated]) // Executar APENAS quando hidratação completar

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setIsLoading(true)
        const response = await authService.login(credentials)

        if (response.success && response.data) {
          const { user: userData, token: userToken } = response.data
          setAuth(userData, userToken)
          toast.success(response.message || 'Login realizado com sucesso!')
        } else {
          throw new Error(response.error || 'Falha no login')
        }
      } catch (error: unknown) {
        const errorMessage =
          (error as { message?: string })?.message ||
          'Erro ao fazer login. Verifique suas credenciais.'
        toast.error(errorMessage)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [setAuth]
  )

  const logout = useCallback(() => {
    clearAuth()
    toast.success('Logout realizado com sucesso!')
  }, [clearAuth])

  const refreshUser = useCallback(async () => {
    if (!token) return

    try {
      const response = await authService.getCurrentUser()
      if (response.success && response.data) {
        setAuth(response.data, token)
      } else {
        console.warn('⚠️ [AuthContext] refreshUser: falha ao buscar usuário (resposta não sucesso)')
        // NÃO limpar auth - manter dados em cache
      }
    } catch (error) {
      console.error('❌ [AuthContext] refreshUser: erro ao buscar dados:', error)
      // NÃO limpar auth - manter dados em cache
      // Se for 401, o interceptor do axios já vai redirecionar
    }
  }, [token, setAuth])

  const value: AuthContextType = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!user && !!token,
      login,
      logout,
      refreshUser,
    }),
    [user, token, isLoading, login, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook para acessar o contexto de autentica��o
 * @throws Error se usado fora do AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }

  return context
}
