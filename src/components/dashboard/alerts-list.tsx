import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Alerts, Alert } from '@/src/types/api/dashboard'
import { AlertTriangle, Clock, Home, DollarSign } from 'lucide-react'

interface AlertsListProps {
  alerts: Alerts
}

const severityConfig = {
  high: {
    variant: 'destructive' as const,
    className: 'border-red-200 bg-red-50/50',
    iconColor: 'text-red-600',
  },
  medium: {
    variant: 'default' as const,
    className: 'border-yellow-200 bg-yellow-50/50',
    iconColor: 'text-yellow-600',
  },
  low: {
    variant: 'secondary' as const,
    className: 'border-gray-200 bg-gray-50/50',
    iconColor: 'text-gray-600',
  },
}

const typeConfig = {
  overdue_payment: {
    icon: DollarSign,
    label: 'Atrasado',
    sectionTitle: 'Pagamentos Atrasados',
    titleColor: 'text-red-700',
  },
  expiring_lease: {
    icon: Clock,
    label: 'Expirando',
    sectionTitle: 'Contratos Expirando em Breve',
    titleColor: 'text-yellow-700',
  },
  vacant_unit: {
    icon: Home,
    label: 'Disponível',
    sectionTitle: 'Unidades Disponíveis',
    titleColor: 'text-blue-700',
  },
}

function renderAlertSection(
  alerts: Alert[],
  type: 'overdue_payment' | 'expiring_lease' | 'vacant_unit'
) {
  if (alerts.length === 0) return null

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div>
      <h3 className={`mb-2 text-sm font-semibold ${config.titleColor}`}>{config.sectionTitle}</h3>
      <div className="space-y-2">
        {alerts.map((alert, index) => {
          const severityStyle = severityConfig[alert.severity]

          return (
            <div
              key={alert.entity_id || `${type}-${index}`}
              className={`flex items-start gap-3 rounded-lg border p-3 ${severityStyle.className}`}
            >
              <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${severityStyle.iconColor}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                <p className="mt-1 text-xs text-gray-600">{alert.description}</p>
              </div>
              <Badge variant={severityStyle.variant} className="text-xs">
                {config.label}
              </Badge>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AlertsList({ alerts }: AlertsListProps) {
  const hasAlerts =
    alerts.overdue_payments.length > 0 ||
    alerts.expiring_leases.length > 0 ||
    alerts.vacant_units.length > 0

  if (!hasAlerts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alertas e Notificações</CardTitle>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Alertas e Notificações
          {alerts.total_alerts > 0 && (
            <Badge variant="destructive" className="ml-2">
              {alerts.total_alerts}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renderAlertSection(alerts.overdue_payments, 'overdue_payment')}
          {renderAlertSection(alerts.expiring_leases, 'expiring_lease')}
          {renderAlertSection(alerts.vacant_units, 'vacant_unit')}
        </div>
      </CardContent>
    </Card>
  )
}
