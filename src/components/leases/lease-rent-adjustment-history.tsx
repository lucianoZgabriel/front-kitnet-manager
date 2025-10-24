'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { useLeaseRentAdjustments } from '@/src/hooks/use-leases'
import { formatCurrency, formatDateTime } from '@/src/lib/utils/format'
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react'

interface LeaseRentAdjustmentHistoryProps {
  leaseId: string
}

export function LeaseRentAdjustmentHistory({ leaseId }: LeaseRentAdjustmentHistoryProps) {
  const { data: adjustments, isLoading } = useLeaseRentAdjustments(leaseId)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Reajustes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!adjustments || adjustments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Reajustes</CardTitle>
          <CardDescription>Nenhum reajuste aplicado neste contrato</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Os reajustes de aluguel são aplicados a cada 12 meses (2 renovações de 6 meses).
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Reajustes</CardTitle>
        <CardDescription>
          {adjustments.length} reajuste{adjustments.length > 1 ? 's' : ''} aplicado
          {adjustments.length > 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {adjustments.map((adjustment) => {
            const isIncrease = adjustment.adjustment_percentage > 0
            const Icon = isIncrease ? TrendingUp : TrendingDown

            return (
              <div
                key={adjustment.id}
                className="flex items-start justify-between rounded-lg border p-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${isIncrease ? 'text-green-600' : 'text-red-600'}`} />
                    <Badge variant={isIncrease ? 'default' : 'secondary'}>
                      {isIncrease ? '+' : ''}
                      {adjustment.adjustment_percentage.toFixed(2)}%
                    </Badge>
                    <span className="text-sm font-medium">
                      {formatCurrency(adjustment.previous_rent_value)} →{' '}
                      {formatCurrency(adjustment.new_rent_value)}
                    </span>
                  </div>

                  {adjustment.reason && (
                    <p className="text-muted-foreground text-sm">{adjustment.reason}</p>
                  )}

                  <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" />
                    <span>Aplicado em {formatDateTime(adjustment.applied_at)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-muted-foreground text-xs">Variação</p>
                  <p
                    className={`text-sm font-semibold ${
                      isIncrease ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isIncrease ? '+' : ''}
                    {formatCurrency(adjustment.new_rent_value - adjustment.previous_rent_value)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
