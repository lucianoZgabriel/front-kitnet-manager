import { Badge } from '@/src/components/ui/badge'
import type { LeaseStatus } from '@/src/types/api/lease'
import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react'

interface LeaseStatusBadgeProps {
  status: LeaseStatus
  showIcon?: boolean
}

const statusConfig: Record<
  LeaseStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    icon: typeof CheckCircle
    className: string
  }
> = {
  active: {
    label: 'Ativo',
    variant: 'default',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  expiring_soon: {
    label: 'Expirando em Breve',
    variant: 'outline',
    icon: AlertTriangle,
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  expired: {
    label: 'Expirado',
    variant: 'secondary',
    icon: Clock,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'destructive',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
}

export function LeaseStatusBadge({ status, showIcon = false }: LeaseStatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  )
}
