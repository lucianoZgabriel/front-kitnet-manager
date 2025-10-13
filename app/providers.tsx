'use client'

// Importar monitor PRIMEIRO (antes de qualquer outro código)
import '@/src/lib/utils/localStorage-monitor'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/src/lib/queries/query-client'
import { AuthProvider } from '@/src/contexts/auth-context'
import { Toaster } from '@/src/components/ui/sonner'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}
