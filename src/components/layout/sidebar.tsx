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
        'bg-background fixed top-0 left-0 z-30 h-screen border-r transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-64' : 'w-20',
        'hidden lg:block'
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
            <span className="text-lg font-bold">K</span>
          </div>
          {sidebarOpen && <span className="text-lg font-semibold">Kitnet Manager</span>}
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
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                sidebarOpen ? 'space-x-3' : 'justify-center',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
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
