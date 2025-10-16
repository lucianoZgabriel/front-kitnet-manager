import { Badge } from '@/src/components/ui/badge'
import type { PaymentStatus } from '@/src/types/api/payment'
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react'

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  showIcon?: boolean
}

const statusConfig: Record<
  PaymentStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'outline'
    icon: typeof CheckCircle
  }
> = {
  pending: {
    label: 'Pendente',
    variant: 'info',
    icon: Clock,
  },
  paid: {
    label: 'Pago',
    variant: 'success',
    icon: CheckCircle,
  },
  overdue: {
    label: 'Atrasado',
    variant: 'destructive',
    icon: AlertCircle,
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'secondary',
    icon: XCircle,
  },
}

export function PaymentStatusBadge({ status, showIcon = false }: PaymentStatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  )
}
