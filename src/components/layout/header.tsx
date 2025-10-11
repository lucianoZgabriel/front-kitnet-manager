'use client'

import { Menu, User, LogOut } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu'
import { useAuth } from '@/src/hooks/use-auth'
import { useUIStore } from '@/src/lib/stores/ui-store'
import { useRouter } from 'next/navigation'

export function Header() {
  const { user, logout } = useAuth()
  const { toggleSidebar, sidebarOpen } = useUIStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="bg-background sticky top-0 z-20 flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        {!sidebarOpen && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden lg:flex">
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline-block">{user?.username}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-muted-foreground text-xs capitalize">{user?.role}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings/profile')}>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
