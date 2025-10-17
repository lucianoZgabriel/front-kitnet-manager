import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Alerts } from '@/src/types/api/dashboard'
import { AlertTriangle, Clock, Home, DollarSign } from 'lucide-react'
import { formatCurrency, formatDate } from '@/src/lib/utils/format'

interface AlertsListProps {
  alerts: Alerts
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
          {/* Pagamentos Atrasados */}
          {alerts.overdue_payments.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-red-700">Pagamentos Atrasados</h3>
              <div className="space-y-2">
                {alerts.overdue_payments.map((payment) => (
                  <div
                    key={payment.payment_id}
                    className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/50 p-3"
                  >
                    <DollarSign className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Unidade {payment.unit_number} - {payment.tenant_name}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">
                        Valor: {formatCurrency(payment.amount)} • {payment.days_overdue} dias de
                        atraso
                      </p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      Atrasado
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contratos Expirando */}
          {alerts.expiring_leases.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-yellow-700">
                Contratos Expirando em Breve
              </h3>
              <div className="space-y-2">
                {alerts.expiring_leases.map((lease) => (
                  <div
                    key={lease.lease_id}
                    className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50/50 p-3"
                  >
                    <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Unidade {lease.unit_number} - {lease.tenant_name}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">
                        Expira em: {formatDate(lease.end_date)} •{' '}
                        {lease.days_until_expiry === 0
                          ? 'Expira hoje'
                          : `${lease.days_until_expiry} dias restantes`}
                      </p>
                    </div>
                    <Badge variant="default" className="bg-yellow-100 text-xs text-yellow-800">
                      Expirando
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unidades Vagas */}
          {alerts.vacant_units.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-blue-700">Unidades Disponíveis</h3>
              <div className="space-y-2">
                {alerts.vacant_units.map((unit) => (
                  <div
                    key={unit.unit_id}
                    className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3"
                  >
                    <Home className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Unidade {unit.unit_number}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">
                        Status: {unit.status} •{' '}
                        {unit.days_vacant === 0
                          ? 'Disponível hoje'
                          : `${unit.days_vacant} dias vaga`}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Disponível
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
