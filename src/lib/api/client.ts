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
      console.log('[API REQUEST]', {
        url: config.url,
        method: config.method,
        hasAuthStorage: !!authStorage,
        timestamp: new Date().toISOString(),
      })

      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage)
          if (state?.token) {
            config.headers.Authorization = `Bearer ${state.token}`
            console.log('[API REQUEST] Token added to request', {
              url: config.url,
              tokenPreview: state.token.substring(0, 20) + '...',
            })
          } else {
            console.warn('[API REQUEST] No token found in auth storage', { url: config.url })
          }
        } catch (error) {
          console.error('[AUTH] Error parsing auth storage:', error)
        }
      } else {
        console.warn('[API REQUEST] No auth storage found', { url: config.url })
      }
    }
    return config
  },
  (error) => {
    console.error('[API REQUEST ERROR]', error)
    return Promise.reject(error)
  }
)

// Response interceptor - extrai data e trata erros
api.interceptors.response.use(
  (response) => {
    console.log('[API RESPONSE SUCCESS]', {
      url: response.config.url,
      status: response.status,
      hasData: !!response.data,
    })
    // A API retorna { success: true, data: {...}, message: "..." }
    // Retornar o response completo para ter acesso a success e message quando necessário
    return response.data
  },
  (error) => {
    console.error('[API RESPONSE ERROR]', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      errorMessage: error.message,
      responseData: error.response?.data,
      currentPath: typeof window !== 'undefined' ? window.location.pathname : 'SSR',
    })

    // IMPORTANTE: Apenas fazer logout em 401 (Unauthorized)
    // Erros 500 (Internal Server Error) NÃO devem causar logout!
    // Usar flag para prevenir múltiplos logouts simultâneos (race condition)
    if (error.response?.status === 401) {
      console.warn('[AUTH] 401 Unauthorized detected - initiating logout', {
        url: error.config?.url,
        isLoggingOut,
        currentPath: typeof window !== 'undefined' ? window.location.pathname : 'SSR',
      })

      if (typeof window !== 'undefined' && !isLoggingOut) {
        isLoggingOut = true

        console.log('[AUTH] Clearing auth store and redirecting to login')
        // Limpar autenticação e redirecionar para login
        clearAuthStore()

        if (!window.location.pathname.includes('/login')) {
          console.log('[AUTH] Redirecting to /login in 100ms')
          setTimeout(() => {
            window.location.href = '/login'
            isLoggingOut = false
          }, 100)
        } else {
          console.log('[AUTH] Already on login page, skipping redirect')
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
