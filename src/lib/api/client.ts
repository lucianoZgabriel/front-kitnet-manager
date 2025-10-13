import axios from 'axios'
import { clearAuth as clearAuthStore } from '@/src/lib/stores/auth-store'

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || 'https://kitnet-manager-production.up.railway.app/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Flag para prevenir múltiplos logouts simultâneos
let isLoggingOut = false

// Request interceptor - adiciona Bearer token
api.interceptors.request.use(
  (config) => {
    // Pegar token do localStorage
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage)
          if (state?.token) {
            config.headers.Authorization = `Bearer ${state.token}`
          }
        } catch (error) {
          console.error('[AUTH] Error parsing auth storage:', error)
        }
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - extrai data e trata erros
api.interceptors.response.use(
  (response) => {
    // A API retorna { success: true, data: {...}, message: "..." }
    // Retornar o response completo para ter acesso a success e message quando necessário
    return response.data
  },
  (error) => {
    // IMPORTANTE: Apenas fazer logout em 401 (Unauthorized)
    // Erros 500 (Internal Server Error) NÃO devem causar logout!
    // Usar flag para prevenir múltiplos logouts simultâneos (race condition)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !isLoggingOut) {
        isLoggingOut = true

        // Limpar autenticação e redirecionar para login
        clearAuthStore()

        if (!window.location.pathname.includes('/login')) {
          setTimeout(() => {
            window.location.href = '/login'
            isLoggingOut = false
          }, 100)
        } else {
          isLoggingOut = false
        }
      }
    }

    // Retornar erro formatado baseado na resposta da API
    const apiError = error.response?.data?.error || error.message || 'Erro desconhecido'

    return Promise.reject({
      message: apiError,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    })
  }
)
