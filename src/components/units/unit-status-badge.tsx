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
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    icon: typeof CheckCircle
    className: string
  }
> = {
  available: {
    label: 'Disponível',
    variant: 'default',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  occupied: {
    label: 'Ocupada',
    variant: 'secondary',
    icon: AlertTriangle,
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  maintenance: {
    label: 'Manutenção',
    variant: 'outline',
    icon: Wrench,
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  renovation: {
    label: 'Reforma',
    variant: 'outline',
    icon: Hammer,
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  },
}

export function UnitStatusBadge({ status, showIcon = false }: UnitStatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  )
}
