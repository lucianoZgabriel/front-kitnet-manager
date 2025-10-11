'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
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
  const { user, token, setAuth, clearAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  // Verificar se h� token ao carregar e buscar dados do usu�rio
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const response = await authService.getCurrentUser()
          if (response.success && response.data) {
            setAuth(response.data, token)
          } else {
            clearAuth()
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          clearAuth()
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Executar apenas na montagem inicial

  const login = async (credentials: LoginRequest) => {
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
  }

  const logout = () => {
    clearAuth()
    toast.success('Logout realizado com sucesso!')
  }

  const refreshUser = async () => {
    if (!token) return

    try {
      const response = await authService.getCurrentUser()
      if (response.success && response.data) {
        setAuth(response.data, token)
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error)
      clearAuth()
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    refreshUser,
  }

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
