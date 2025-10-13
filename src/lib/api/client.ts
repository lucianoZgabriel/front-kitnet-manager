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

            // LOG DETALHADO: Comparar requests de leases vs units/tenants
            if (
              config.url?.includes('/leases') ||
              config.url?.includes('/units') ||
              config.url?.includes('/tenants')
            ) {
              const endpoint = config.url.split('/').pop() || config.url

              // Decodificar JWT para ver expiração
              let tokenExp = 'unknown'
              try {
                const payload = JSON.parse(atob(state.token.split('.')[1]))
                if (payload.exp) {
                  const expDate = new Date(payload.exp * 1000)
                  const now = new Date()
                  const minutesLeft = Math.floor((expDate.getTime() - now.getTime()) / 60000)
                  tokenExp = `${minutesLeft} minutos restantes (expira às ${expDate.toLocaleTimeString()})`
                }
              } catch (e) {
                tokenExp = 'erro ao decodificar'
              }

              console.log(`[DEBUG REQUEST] ${endpoint}`, {
                url: config.url,
                method: config.method,
                tokenPrefix: state.token.substring(0, 20) + '...',
                tokenLength: state.token.length,
                tokenExpiration: tokenExp,
                hasUser: !!state.user,
                userName: state.user?.name,
              })
            }
          } else {
            // Token ausente mas storage existe - logar apenas se NÃO for login
            if (!config.url?.includes('/auth/login')) {
              console.warn('[AUTH] Request sem token (storage existe mas vazio):', config.url)
            }
          }
        } catch (error) {
          console.error('[AUTH] Error parsing auth storage:', error)
        }
      } else {
        // Storage vazio - logar apenas se NÃO for login
        if (!config.url?.includes('/auth/login')) {
          console.warn('[AUTH] Auth storage vazio, request sem token:', config.url)
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

        // LOG ULTRA DETALHADO para debug
        console.error('[DEBUG 401] ======= ERRO 401 DETECTADO =======')
        console.error('[DEBUG 401] URL:', error.config?.url)
        console.error('[DEBUG 401] Method:', error.config?.method)
        console.error(
          '[DEBUG 401] Has Authorization header:',
          !!error.config?.headers?.Authorization
        )
        console.error(
          '[DEBUG 401] Authorization prefix:',
          error.config?.headers?.Authorization?.substring(0, 20)
        )
        console.error('[DEBUG 401] Response data:', error.response?.data)
        console.error('[DEBUG 401] Stack trace:', new Error().stack)

        // Verificar localStorage
        const authStorage = localStorage.getItem('auth-storage')
        if (authStorage) {
          try {
            const { state } = JSON.parse(authStorage)
            console.error('[DEBUG 401] localStorage token prefix:', state?.token?.substring(0, 20))
            console.error('[DEBUG 401] localStorage has user:', !!state?.user)
          } catch (e) {
            console.error('[DEBUG 401] Erro ao ler localStorage:', e)
          }
        } else {
          console.error('[DEBUG 401] localStorage vazio!')
        }
        console.error('[DEBUG 401] ================================')

        console.warn('[AUTH] 401 Unauthorized - Fazendo logout', {
          url: error.config?.url,
          hasToken: !!error.config?.headers?.Authorization,
        })

        // CRÍTICO: Usar clearAuth do Zustand em vez de manipular localStorage diretamente
        // Isso garante sincronização entre memória e storage
        clearAuthStore()

        // Não redirecionar se já estiver na página de login
        if (!window.location.pathname.includes('/login')) {
          // Usar setTimeout para evitar race condition com múltiplas requisições
          setTimeout(() => {
            window.location.href = '/login'
            isLoggingOut = false // Reset após redirect
          }, 100)
        } else {
          // Resetar flag se já estiver no login
          isLoggingOut = false
        }
      }
    } else if (error.response?.status === 500) {
      // Logar erro 500 mas NÃO fazer logout
      console.error(
        '[API] 500 Internal Server Error:',
        error.config?.url,
        error.response?.data?.error || error.message
      )
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
