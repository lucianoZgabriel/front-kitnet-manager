'use client'

import { useState, useMemo } from 'react'
import { useFinancialReport } from '@/src/hooks/use-reports'
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
import { TrendingUp, DollarSign, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/src/lib/utils/format'
import type { DateRange } from 'react-day-picker'
import type { PaymentType, PaymentStatus } from '@/src/types/api/payment'
import { format } from 'date-fns'

export default function FinancialReportPage() {
  // Estado para filtros
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return { from: firstDayOfMonth, to: lastDayOfMonth }
  })
  const [paymentType, setPaymentType] = useState<PaymentType | 'all'>('all')
  const [status, setStatus] = useState<PaymentStatus | 'all'>('all')

  // Preparar parâmetros da query
  const queryParams = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return null

    return {
      start_date: format(dateRange.from, 'yyyy-MM-dd'),
      end_date: format(dateRange.to, 'yyyy-MM-dd'),
      ...(paymentType !== 'all' && { payment_type: paymentType as PaymentType }),
      ...(status !== 'all' && { status: status as PaymentStatus }),
    }
  }, [dateRange, paymentType, status])

  // Buscar relatório
  const { data: report, isLoading, isError } = useFinancialReport(queryParams!)

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Relatório Financeiro</h1>
        <p className="text-muted-foreground">
          Análise completa de receitas e pagamentos por período
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Selecione o período e filtros para gerar o relatório</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Date Range Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            </div>

            {/* Tipo de Pagamento */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Pagamento</label>
              <Select
                value={paymentType}
                onValueChange={(value) => setPaymentType(value as PaymentType | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="rent">Aluguel</SelectItem>
                  <SelectItem value="painting_fee">Taxa de Pintura</SelectItem>
                  <SelectItem value="adjustment">Ajuste</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Gerando relatório...</span>
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
              <p className="font-medium">Erro ao carregar relatório</p>
              <p className="text-sm">Tente novamente ou verifique os filtros selecionados</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo Financeiro */}
      {report && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
                <DollarSign className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(parseFloat(report.summary.total_amount))}
                </div>
                <p className="text-muted-foreground text-xs">
                  {report.summary.payment_count} pagamentos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(parseFloat(report.summary.paid_amount))}
                </div>
                <p className="text-muted-foreground text-xs">
                  {report.by_status?.paid?.count || 0} pagamentos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendente</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(parseFloat(report.summary.pending_amount))}
                </div>
                <p className="text-muted-foreground text-xs">
                  {report.by_status?.pending?.count || 0} pagamentos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atrasado</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(parseFloat(report.summary.overdue_amount))}
                </div>
                <p className="text-muted-foreground text-xs">
                  {report.by_status?.overdue?.count || 0} pagamentos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown por Tipo */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Aluguel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {formatCurrency(parseFloat(report.by_type?.rent?.total_amount || '0'))}
                </div>
                <p className="text-muted-foreground text-xs">
                  {report.by_type?.rent?.count || 0} pagamentos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Taxa de Pintura</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {formatCurrency(parseFloat(report.by_type?.painting_fee?.total_amount || '0'))}
                </div>
                <p className="text-muted-foreground text-xs">
                  {report.by_type?.painting_fee?.count || 0} pagamentos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Ajustes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {formatCurrency(parseFloat(report.by_type?.adjustment?.total_amount || '0'))}
                </div>
                <p className="text-muted-foreground text-xs">
                  {report.by_type?.adjustment?.count || 0} pagamentos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Pagamentos */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento de Pagamentos</CardTitle>
              <CardDescription>Lista completa de pagamentos no período selecionado</CardDescription>
            </CardHeader>
            <CardContent>
              {!report.payments || report.payments.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  Nenhum pagamento encontrado no período selecionado
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
