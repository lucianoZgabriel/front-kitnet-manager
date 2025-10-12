import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Alert } from '@/src/types/api/dashboard'
import { cn } from '@/src/lib/utils/cn'
import { AlertTriangle, Clock, Home, DollarSign, FileText, Info } from 'lucide-react'

interface AlertsListProps {
  alerts: Alert[]
}

const severityConfig = {
  high: {
    variant: 'destructive' as const,
    label: 'Alta',
  },
  medium: {
    variant: 'default' as const,
    label: 'Média',
  },
  low: {
    variant: 'secondary' as const,
    label: 'Baixa',
  },
}

const typeIcons = {
  contract_expiring: Clock,
  payment_overdue: DollarSign,
  unit_maintenance: Home,
  lease_expiring: FileText,
  default: Info,
}

export function AlertsList({ alerts }: AlertsListProps) {
  // Garantir que alerts é um array
  const alertsArray = Array.isArray(alerts) ? alerts : []

  if (alertsArray.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="text-muted-foreground mb-3 h-12 w-12" />
            <p className="text-muted-foreground text-sm">Nenhum alerta no momento</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Tudo está funcionando perfeitamente!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Ordenar por severidade (high > medium > low)
  const sortedAlerts = [...alertsArray].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Alertas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedAlerts.map((alert, index) => {
            const IconComponent =
              typeIcons[alert.type as keyof typeof typeIcons] || typeIcons.default
            const config = severityConfig[alert.severity]

            return (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                  alert.severity === 'high' && 'border-red-200 bg-red-50/50',
                  alert.severity === 'medium' && 'border-yellow-200 bg-yellow-50/50',
                  alert.severity === 'low' && 'border-gray-200 bg-gray-50/50'
                )}
              >
                <IconComponent
                  className={cn(
                    'mt-0.5 h-5 w-5 flex-shrink-0',
                    alert.severity === 'high' && 'text-red-600',
                    alert.severity === 'medium' && 'text-yellow-600',
                    alert.severity === 'low' && 'text-gray-600'
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant={config.variant} className="text-xs">
                      {config.label}
                    </Badge>
                    <span className="text-muted-foreground text-xs">{alert.entity_type}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
