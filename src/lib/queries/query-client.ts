import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: (failureCount, error: unknown) => {
        const err = error as { status?: number }

        // Não retry em erros de autenticação ou permissão
        if (err.status === 401 || err.status === 403) {
          return false
        }

        // Não retry em outros erros 4xx (client errors)
        if (err.status && err.status >= 400 && err.status < 500) {
          return false
        }

        // Retry até 2 vezes para erros de rede ou 5xx (server errors)
        return failureCount < 2
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: false,
    },
  },
})
