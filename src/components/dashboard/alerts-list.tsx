import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Alerts, Alert } from '@/src/types/api/dashboard'
import { AlertTriangle, Clock, Home, DollarSign, ExternalLink } from 'lucide-react'
import { useLeases } from '@/src/hooks/use-leases'
import { useUnits } from '@/src/hooks/use-units'
import { useOverduePayments } from '@/src/hooks/use-payments'
import type { Lease } from '@/src/types/api/lease'
import type { Unit } from '@/src/types/api/unit'
import type { Payment } from '@/src/types/api/payment'

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

interface AlertSectionProps {
  alerts: Alert[]
  type: 'overdue_payment' | 'expiring_lease' | 'vacant_unit'
  leases?: Lease[]
  units?: Unit[]
  payments?: Payment[]
}

function AlertSection({ alerts, type, leases, units, payments }: AlertSectionProps) {
  if (alerts.length === 0) return null

  const config = typeConfig[type]
  const Icon = config.icon

  // Função para buscar dados do pagamento, lease e unidade pelo entity_id (payment_id)
  const getPaymentInfo = (
    entityId: string
  ): { unitNumber: string; leaseId: string | null } | null => {
    if (!payments || !leases || !units) return null

    // entity_id é o payment_id para alertas de pagamento atrasado
    const payment = payments.find((p) => p.id === entityId)
    if (!payment) return null

    const lease = leases.find((l) => l.id === payment.lease_id)
    if (!lease) return null

    const unit = units.find((u) => u.id === lease.unit_id)
    if (!unit) return null

    return {
      unitNumber: unit.number,
      leaseId: lease.id,
    }
  }

  return (
    <div>
      <h3 className={`mb-2 text-sm font-semibold ${config.titleColor}`}>{config.sectionTitle}</h3>
      <div className="space-y-2">
        {alerts.map((alert, index) => {
          const severityStyle = severityConfig[alert.severity]
          const paymentInfo = type === 'overdue_payment' ? getPaymentInfo(alert.entity_id) : null

          return (
            <div
              key={alert.entity_id || `${type}-${index}`}
              className={`flex items-start gap-3 rounded-lg border p-3 ${severityStyle.className}`}
            >
              <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${severityStyle.iconColor}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {paymentInfo && `Unidade ${paymentInfo.unitNumber} • `}
                      {alert.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">{alert.description}</p>
                  </div>
                  <Badge variant={severityStyle.variant} className="text-xs">
                    {config.label}
                  </Badge>
                </div>
                {paymentInfo?.leaseId && (
                  <div className="mt-2">
                    <Button variant="link" size="sm" asChild className="h-auto p-0 text-xs">
                      <Link href={`/leases/${paymentInfo.leaseId}`}>
                        Ver Contrato
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AlertsList({ alerts }: AlertsListProps) {
  // Buscar dados de leases, units e payments para enriquecer os alertas
  const { data: leases } = useLeases()
  const { data: units } = useUnits()
  const { data: payments } = useOverduePayments()

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
          <AlertSection
            alerts={alerts.overdue_payments}
            type="overdue_payment"
            leases={leases}
            units={units}
            payments={payments}
          />
          <AlertSection
            alerts={alerts.expiring_leases}
            type="expiring_lease"
            leases={leases}
            units={units}
            payments={payments}
          />
          <AlertSection
            alerts={alerts.vacant_units}
            type="vacant_unit"
            leases={leases}
            units={units}
            payments={payments}
          />
        </div>
      </CardContent>
    </Card>
  )
}
