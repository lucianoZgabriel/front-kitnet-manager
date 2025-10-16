'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/src/lib/utils/cn'
import { mainNav } from '@/src/config/navigation'
import { useAuth } from '@/src/hooks/use-auth'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/src/components/ui/sheet'

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredNav = mainNav.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(user?.role || '')
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="from-primary/5 border-b bg-gradient-to-r to-transparent p-6">
          <SheetTitle className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-lg shadow-md">
              <span className="text-lg font-bold">K</span>
            </div>
            <span className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent">
              Kitnet Manager
            </span>
          </SheetTitle>
        </SheetHeader>

        <nav className="space-y-1 p-4">
          {filteredNav.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow-sm',
                  item.disabled && 'pointer-events-none opacity-50'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
