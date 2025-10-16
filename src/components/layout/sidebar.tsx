'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/src/lib/utils/cn'
import { mainNav } from '@/src/config/navigation'
import { useAuth } from '@/src/hooks/use-auth'
import { useUIStore } from '@/src/lib/stores/ui-store'

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { sidebarOpen } = useUIStore()

  const filteredNav = mainNav.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(user?.role || '')
  })

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-30 h-screen border-r bg-white shadow-sm transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-64' : 'w-20',
        'hidden lg:block'
      )}
    >
      <div className="from-primary/5 flex h-16 items-center border-b bg-gradient-to-r to-transparent px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="bg-primary text-primary-foreground flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg shadow-md">
            <span className="text-lg font-bold">K</span>
          </div>
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-base leading-tight font-bold text-transparent">
                Kitnet Manager
              </span>
              <span className="text-muted-foreground text-xs leading-tight">Sistema de Gestão</span>
            </div>
          )}
        </Link>
      </div>

      <nav className="space-y-1 p-4">
        {filteredNav.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                sidebarOpen ? 'space-x-3' : 'justify-center',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow-sm',
                item.disabled && 'pointer-events-none opacity-50'
              )}
              title={!sidebarOpen ? item.title : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
