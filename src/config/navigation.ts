import {
  Home,
  Building2,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  disabled?: boolean
  roles?: string[] // Se definido, apenas esses roles têm acesso
}

export const mainNav: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Unidades',
    href: '/units',
    icon: Building2,
  },
  {
    title: 'Inquilinos',
    href: '/tenants',
    icon: Users,
  },
  {
    title: 'Contratos',
    href: '/leases',
    icon: FileText,
  },
  {
    title: 'Pagamentos',
    href: '/payments',
    icon: CreditCard,
  },
  {
    title: 'Relatórios',
    href: '/reports',
    icon: BarChart3,
  },
  {
    title: 'Configurações',
    href: '/settings',
    icon: Settings,
  },
]

export const settingsNav: NavItem[] = [
  {
    title: 'Perfil',
    href: '/settings/profile',
    icon: Users,
  },
  {
    title: 'Usuários',
    href: '/settings/users',
    icon: Users,
    roles: ['admin'], // Apenas admin
  },
]
