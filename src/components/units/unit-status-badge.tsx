import { Badge } from '@/src/components/ui/badge'
import type { UnitStatus } from '@/src/types/api/unit'
import { CheckCircle, AlertTriangle, Wrench, Hammer } from 'lucide-react'

interface UnitStatusBadgeProps {
  status: UnitStatus
  showIcon?: boolean
}

const statusConfig: Record<
  UnitStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'outline'
    icon: typeof CheckCircle
  }
> = {
  available: {
    label: 'Disponível',
    variant: 'success',
    icon: CheckCircle,
  },
  occupied: {
    label: 'Ocupada',
    variant: 'info',
    icon: AlertTriangle,
  },
  maintenance: {
    label: 'Manutenção',
    variant: 'warning',
    icon: Wrench,
  },
  renovation: {
    label: 'Reforma',
    variant: 'secondary',
    icon: Hammer,
  },
}

export function UnitStatusBadge({ status, showIcon = false }: UnitStatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  )
}
