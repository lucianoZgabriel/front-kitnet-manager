'use client'

import { useState, useMemo } from 'react'
import { usePaymentHistory } from '@/src/hooks/use-reports'
import { useLeases } from '@/src/hooks/use-leases'
import { useTenants } from '@/src/hooks/use-tenants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { DateRangePicker } from '@/src/components/ui/date-range-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table'
import { FileText, AlertCircle, Loader2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/src/lib/utils/format'
import type { DateRange } from 'react-day-picker'
import type { PaymentType, PaymentStatus } from '@/src/types/api/payment'
import { format } from 'date-fns'

export default function PaymentsReportPage() {
  // Estado para filtros
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [leaseId, setLeaseId] = useState<string>('all')
  const [tenantId, setTenantId] = useState<string>('all')
  const [status, setStatus] = useState<PaymentStatus | 'all'>('all')

  // Buscar dados para selects
  const { data: leases } = useLeases()
  const { data: tenants } = useTenants()

  // Preparar parâmetros da query
  const queryParams = useMemo(() => {
    const params: {
      lease_id?: string
      tenant_id?: string
      status?: PaymentStatus
      start_date?: string
      end_date?: string
    } = {}

    if (leaseId !== 'all') params.lease_id = leaseId
    if (tenantId !== 'all') params.tenant_id = tenantId
    if (status !== 'all') params.status = status as PaymentStatus
    if (dateRange?.from) params.start_date = format(dateRange.from, 'yyyy-MM-dd')
    if (dateRange?.to) params.end_date = format(dateRange.to, 'yyyy-MM-dd')

    return Object.keys(params).length > 0 ? params : undefined
  }, [dateRange, leaseId, tenantId, status])

  // Buscar histórico
  const { data: report, isLoading, isError } = usePaymentHistory(queryParams)

  // Helper para badge de status
  const getStatusBadge = (status: PaymentStatus) => {
    const variants: Record<
      PaymentStatus,
      { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
    > = {
      paid: { label: 'Pago', variant: 'default' },
      pending: { label: 'Pendente', variant: 'secondary' },
      overdue: { label: 'Atrasado', variant: 'destructive' },
      cancelled: { label: 'Cancelado', variant: 'outline' },
    }
    const config = variants[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  // Helper para tipo de pagamento
  const getPaymentTypeLabel = (type: PaymentType) => {
    const labels: Record<PaymentType, string> = {
      rent: 'Aluguel',
      painting_fee: 'Taxa de Pintura',
      adjustment: 'Ajuste',
    }
    return labels[type] || type
  }

  // Calcular totais
  const totals = useMemo(() => {
    if (!report?.payments) return { total: 0, paid: 0, pending: 0, overdue: 0 }

    return report.payments.reduce(
      (acc, payment) => {
        const amount = parseFloat(payment.amount)
        acc.total += amount
        if (payment.status === 'paid') acc.paid += amount
        else if (payment.status === 'pending') acc.pending += amount
        else if (payment.status === 'overdue') acc.overdue += amount
        return acc
      },
      { total: 0, paid: 0, pending: 0, overdue: 0 }
    )
  }, [report])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Histórico de Pagamentos</h1>
        <p className="text-muted-foreground">
          Consulte o histórico completo de pagamentos com filtros avançados
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Selecione os filtros para buscar pagamentos específicos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Contrato */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Contrato</label>
              <Select value={leaseId} onValueChange={setLeaseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os contratos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os contratos</SelectItem>
                  {leases?.map((lease) => (
                    <SelectItem key={lease.id} value={lease.id}>
                      Contrato {lease.id.slice(0, 8)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Inquilino */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Inquilino</label>
              <Select value={tenantId} onValueChange={setTenantId}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os inquilinos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os inquilinos</SelectItem>
                  {tenants?.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as PaymentStatus | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="overdue">Atrasado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Período (opcional)</label>
              <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Carregando histórico...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {isError && (
        <Card className="border-red-200">
          <CardContent className="flex items-center gap-3 py-6 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">Erro ao carregar histórico</p>
              <p className="text-sm">Tente novamente ou verifique os filtros selecionados</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo */}
      {report && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
                <FileText className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.total_count}</div>
                <p className="text-muted-foreground text-xs">
                  Valor: {formatCurrency(totals.total)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagos</CardTitle>
                <div className="h-4 w-4 rounded-full bg-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {report.payments?.filter((p) => p.status === 'paid').length || 0}
                </div>
                <p className="text-muted-foreground text-xs">
                  Valor: {formatCurrency(totals.paid)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <div className="h-4 w-4 rounded-full bg-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {report.payments?.filter((p) => p.status === 'pending').length || 0}
                </div>
                <p className="text-muted-foreground text-xs">
                  Valor: {formatCurrency(totals.pending)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
                <div className="h-4 w-4 rounded-full bg-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {report.payments?.filter((p) => p.status === 'overdue').length || 0}
                </div>
                <p className="text-muted-foreground text-xs">
                  Valor: {formatCurrency(totals.overdue)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Pagamentos */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico Detalhado</CardTitle>
              <CardDescription>
                Lista completa de pagamentos com base nos filtros selecionados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!report.payments || report.payments.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  <FileText className="mx-auto mb-2 h-12 w-12 opacity-20" />
                  <p>Nenhum pagamento encontrado</p>
                  <p className="text-sm">Tente ajustar os filtros para ver mais resultados</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Referência</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Método</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.payments?.map((payment, index) => (
                        <TableRow key={payment.id || `payment-${index}`}>
                          <TableCell className="font-medium">
                            {getPaymentTypeLabel(payment.payment_type)}
                          </TableCell>
                          <TableCell>{formatDate(payment.reference_month)}</TableCell>
                          <TableCell>{formatDate(payment.due_date)}</TableCell>
                          <TableCell>
                            {payment.payment_date ? formatDate(payment.payment_date) : '-'}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(parseFloat(payment.amount))}
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell className="capitalize">
                            {payment.payment_method?.replace('_', ' ') || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
