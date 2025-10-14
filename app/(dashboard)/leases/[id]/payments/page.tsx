'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useLease } from '@/src/hooks/use-leases'
import { useLeasePayments, usePaymentStats } from '@/src/hooks/use-payments'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { ErrorMessage } from '@/src/components/shared/error-message'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { ArrowLeft, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react'
import { PaymentStatusBadge } from '@/src/components/payments/payment-status-badge'
import { PayPaymentDialog } from '@/src/components/payments/pay-payment-dialog'
import { formatCurrency, formatDate, calculateLateFee } from '@/src/lib/utils/format'
import { differenceInDays, parseISO } from 'date-fns'
import type { Payment, PaymentStatus, PaymentType } from '@/src/types/api/payment'

const paymentTypeLabels: Record<PaymentType, string> = {
  rent: 'Aluguel',
  painting_fee: 'Taxa de Pintura',
  adjustment: 'Ajuste',
}

export default function LeasePaymentsPage() {
  const params = useParams()
  const id = params.id as string

  const { data: lease, isLoading: leaseLoading, error: leaseError } = useLease(id)
  const {
    data: payments,
    isLoading: paymentsLoading,
    error: paymentsError,
    refetch,
  } = useLeasePayments(id)
  const { data: stats, isLoading: statsLoading } = usePaymentStats(id)

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showPayDialog, setShowPayDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<PaymentType | 'all'>('all')

  const isLoading = leaseLoading || paymentsLoading
  const error = leaseError || paymentsError

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !lease) {
    return (
      <ErrorMessage
        title="Erro ao carregar pagamentos"
        message="Não foi possível carregar os dados dos pagamentos"
        retry={refetch}
      />
    )
  }

  // Filtrar pagamentos
  const filteredPayments =
    payments?.filter((payment) => {
      if (statusFilter !== 'all' && payment.status !== statusFilter) return false
      if (typeFilter !== 'all' && payment.payment_type !== typeFilter) return false
      return true
    }) || []

  // Calcular dias de atraso para cada pagamento
  const getPaymentWithLateFee = (payment: Payment) => {
    if (payment.status !== 'overdue') {
      return { payment, daysOverdue: 0, lateFee: null }
    }

    const dueDateObj = parseISO(payment.due_date)
    const today = new Date()
    const daysOverdue = differenceInDays(today, dueDateObj)

    const lateFee = calculateLateFee(payment.amount, daysOverdue)

    return { payment, daysOverdue, lateFee }
  }

  const handlePayClick = (payment: Payment) => {
    if (payment.status === 'pending' || payment.status === 'overdue') {
      setSelectedPayment(payment)
      setShowPayDialog(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={`/leases/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Contrato
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Pagamentos do Contrato</h1>
          <p className="text-muted-foreground">
            Unidade {lease.unit_id} - Vencimento dia {lease.payment_due_day}
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      {!statsLoading && stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
              <DollarSign className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_payments}</div>
              <p className="text-muted-foreground text-xs">{formatCurrency(stats.total_amount)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.paid_count}</div>
              <p className="text-muted-foreground text-xs">{formatCurrency(stats.paid_amount)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue_count}</div>
              <p className="text-muted-foreground text-xs">
                {formatCurrency(stats.overdue_amount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pending_count}</div>
              <p className="text-muted-foreground text-xs">
                {formatCurrency(stats.pending_amount)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros e Tabela */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Lista de Pagamentos</CardTitle>
              <CardDescription>
                {filteredPayments.length} pagamento(s) encontrado(s)
              </CardDescription>
            </div>

            <div className="flex gap-2">
              {/* Filtro de Status */}
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as PaymentStatus | 'all')}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="overdue">Atrasado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro de Tipo */}
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as PaymentType | 'all')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Tipos</SelectItem>
                  <SelectItem value="rent">Aluguel</SelectItem>
                  <SelectItem value="painting_fee">Taxa de Pintura</SelectItem>
                  <SelectItem value="adjustment">Ajuste</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referência</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum pagamento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => {
                    const { daysOverdue, lateFee } = getPaymentWithLateFee(payment)
                    const hasLateFee = daysOverdue > 0 && lateFee !== null

                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="font-medium">{formatDate(payment.reference_month)}</div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{paymentTypeLabels[payment.payment_type]}</span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{formatDate(payment.due_date)}</div>
                            {hasLateFee && (
                              <div className="text-xs text-red-600">
                                {daysOverdue} dia(s) de atraso
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{formatCurrency(payment.amount)}</div>
                            {hasLateFee && lateFee && (
                              <div className="text-xs text-red-600">
                                + {formatCurrency(lateFee.penalty + lateFee.interest)} (multa)
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={payment.status} showIcon />
                        </TableCell>
                        <TableCell>
                          {payment.payment_date ? (
                            <div className="text-sm">
                              <div>{formatDate(payment.payment_date)}</div>
                              <div className="text-muted-foreground text-xs">
                                {payment.payment_method === 'pix' && 'PIX'}
                                {payment.payment_method === 'cash' && 'Dinheiro'}
                                {payment.payment_method === 'bank_transfer' && 'Transferência'}
                                {payment.payment_method === 'credit_card' && 'Cartão'}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {(payment.status === 'pending' || payment.status === 'overdue') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePayClick(payment)}
                            >
                              Marcar como Pago
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Pagamento */}
      <PayPaymentDialog
        payment={selectedPayment}
        open={showPayDialog}
        onOpenChange={setShowPayDialog}
      />
    </div>
  )
}
