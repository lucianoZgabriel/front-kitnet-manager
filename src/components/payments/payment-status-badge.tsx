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
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    icon: typeof CheckCircle
    className: string
  }
> = {
  pending: {
    label: 'Pendente',
    variant: 'outline',
    icon: Clock,
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  paid: {
    label: 'Pago',
    variant: 'default',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  overdue: {
    label: 'Atrasado',
    variant: 'destructive',
    icon: AlertCircle,
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'secondary',
    icon: XCircle,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
}

export function PaymentStatusBadge({ status, showIcon = false }: PaymentStatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  )
}
