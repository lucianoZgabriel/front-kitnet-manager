'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/hooks/use-auth'
import { Sidebar } from '@/src/components/layout/sidebar'
import { MobileSidebar } from '@/src/components/layout/mobile-sidebar'
import { Header } from '@/src/components/layout/header'
import { useUIStore } from '@/src/lib/stores/ui-store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const { sidebarOpen } = useUIStore()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground mt-2">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

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
