import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      // Retry strategy adaptada para lidar com problema do backend
      retry: (failureCount, error: unknown) => {
        const err = error as { status?: number; message?: string }

        // WORKAROUND: Backend às vezes retorna 401 "Invalid or expired token"
        // em requests simultâneas devido a problema de connection pool no PostgreSQL.
        // Fazer retry com backoff exponencial nesses casos específicos.
        if (err.status === 401 && err.message?.includes('Invalid or expired token')) {
          if (failureCount < 3) {
            console.warn(
              `[QUERY] Retrying 401 error (attempt ${failureCount + 1}/3) - backend connection pool issue`
            )
            return true
          }
          return false
        }

        // Não retry em erros de permissão ou outros 4xx
        if (err.status && err.status >= 400 && err.status < 500) {
          return false
        }

        // Retry até 2 vezes para erros de rede ou 5xx (server errors)
        return failureCount < 2
      },
      // Exponential backoff: 1s, 2s, 4s, 8s...
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Desabilitar refetch on focus para evitar race conditions em dev mode
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: false,
    },
  },
})
