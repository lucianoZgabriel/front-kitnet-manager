import axios from 'axios'

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || 'https://kitnet-manager-production.up.railway.app/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor - adiciona Bearer token
api.interceptors.request.use(
  (config) => {
    // Pegar token do localStorage (será implementado com auth store)
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage)
          if (state?.token) {
            config.headers.Authorization = `Bearer ${state.token}`
          }
        } catch (error) {
          console.error('Error parsing auth storage:', error)
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
    // Vamos retornar apenas o data para simplificar
    return response.data.data
  },
  (error) => {
    // Se 401, limpar auth e redirecionar para login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage')
        window.location.href = '/login'
      }
    }

    // Retornar erro formatado
    const errorMessage = error.response?.data?.error || error.message || 'Erro desconhecido'
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    })
  }
)
