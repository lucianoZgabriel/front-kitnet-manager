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
        <SheetHeader className="border-b p-6">
          <SheetTitle className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-lg font-bold">K</span>
            </div>
            <span className="text-lg font-semibold">Kitnet Manager</span>
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
                  'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
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
