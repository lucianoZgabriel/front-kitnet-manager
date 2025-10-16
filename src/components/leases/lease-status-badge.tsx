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
    variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'outline'
    icon: typeof CheckCircle
  }
> = {
  active: {
    label: 'Ativo',
    variant: 'success',
    icon: CheckCircle,
  },
  expiring_soon: {
    label: 'Expirando em Breve',
    variant: 'warning',
    icon: AlertTriangle,
  },
  expired: {
    label: 'Expirado',
    variant: 'secondary',
    icon: Clock,
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'destructive',
    icon: XCircle,
  },
}

export function LeaseStatusBadge({ status, showIcon = false }: LeaseStatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  )
}
