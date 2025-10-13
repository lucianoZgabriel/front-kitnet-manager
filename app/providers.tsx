'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/src/contexts/auth-context'
import { Toaster } from '@/src/components/ui/sonner'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // Criar queryClient dentro do componente para evitar problemas de estado
  // em dev mode com HMR (Hot Module Replacement)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutos
            // Retry strategy: apenas retry em erros de rede ou 500+
            retry: (failureCount, error: unknown) => {
              const err = error as { status?: number }
              // Não retry se for erro de autenticação
              if (err.status === 401 || err.status === 403) {
                return false
              }
              // Não retry em erros 4xx (client errors)
              if (err.status && err.status >= 400 && err.status < 500) {
                return false
              }
              // Retry até 2 vezes para erros de rede ou 5xx
              return failureCount < 2
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
          mutations: {
            retry: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}
