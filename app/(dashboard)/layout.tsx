'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/hooks/use-auth'
import { Sidebar } from '@/src/components/layout/sidebar'
import { MobileSidebar } from '@/src/components/layout/mobile-sidebar'
import { Header } from '@/src/components/layout/header'
import { useUIStore } from '@/src/lib/stores/ui-store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  const { isAuthenticated, isLoading, user, token } = auth
  const { sidebarOpen } = useUIStore()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  console.log('🏗️ [Dashboard Layout] Render:', {
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    hasToken: !!token,
    username: user?.username,
    tokenPreview: token ? token.substring(0, 20) + '...' : null,
  })

  // Monitor específico para mudanças no isAuthenticated
  useEffect(() => {
    console.log('🔔 [Dashboard Layout] isAuthenticated MUDOU para:', isAuthenticated, {
      hasUser: !!user,
      hasToken: !!token,
      username: user?.username,
    })
  }, [isAuthenticated, user, token])

  // LÓGICA SUPER SIMPLES: Se não está autenticado E não está carregando, redirecionar
  useEffect(() => {
    console.log('🔍 [Dashboard Layout] Effect rodou:', {
      isLoading,
      isAuthenticated,
    })

    // Se está carregando, não fazer nada
    if (isLoading) {
      console.log('⏳ [Dashboard Layout] Carregando...')
      return
    }

    // Se não está autenticado, redirecionar IMEDIATAMENTE
    if (!isAuthenticated) {
      console.error('🚪 [Dashboard Layout] Não autenticado! Redirecionando...')
      router.push('/login')
    } else {
      console.log('✅ [Dashboard Layout] Usuário autenticado!')
    }
  }, [isAuthenticated, isLoading, router])

  // Mostrar loading enquanto carrega
  if (isLoading) {
    console.log('⏳ [Dashboard Layout] Renderizando loading...')
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground mt-2">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não está autenticado, mostrar nada (vai redirecionar)
  if (!isAuthenticated) {
    console.log('⏸️ [Dashboard Layout] Não autenticado, retornando null...')
    return null
  }

  // Renderizar o layout
  console.log('✅ [Dashboard Layout] Renderizando layout completo')
  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar />
      <MobileSidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
