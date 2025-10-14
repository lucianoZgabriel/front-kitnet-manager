'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useUpcomingPayments, useCancelPayment } from '@/src/hooks/use-payments'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { ErrorMessage } from '@/src/components/shared/error-message'
import { EmptyState } from '@/src/components/shared/empty-state'
import { ConfirmDialog } from '@/src/components/shared/confirm-dialog'
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
import { Input } from '@/src/components/ui/input'
import { Calendar, Search, DollarSign, Clock } from 'lucide-react'
import { PaymentStatusBadge } from '@/src/components/payments/payment-status-badge'
import { PayPaymentDialog } from '@/src/components/payments/pay-payment-dialog'
import { formatCurrency, formatDate } from '@/src/lib/utils/format'
import { differenceInDays, parseISO, startOfDay, endOfWeek } from 'date-fns'
import type { Payment, PaymentType } from '@/src/types/api/payment'

const paymentTypeLabels: Record<PaymentType, string> = {
  rent: 'Aluguel',
  painting_fee: 'Taxa de Pintura',
  adjustment: 'Ajuste',
}

export default function UpcomingPaymentsPage() {
  const [daysAhead, setDaysAhead] = useState(7)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showPayDialog, setShowPayDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [paymentToCancel, setPaymentToCancel] = useState<Payment | null>(null)
  const cancelPayment = useCancelPayment()

  const { data: payments, isLoading, error, refetch } = useUpcomingPayments(daysAhead)

  // Filtrar por busca
  const filteredPayments = useMemo(() => {
    if (!payments) return []
    if (!searchTerm) return payments

    const term = searchTerm.toLowerCase()
    return payments.filter(
      (payment) =>
        payment.lease_id.toLowerCase().includes(term) ||
        paymentTypeLabels[payment.payment_type].toLowerCase().includes(term)
    )
  }, [payments, searchTerm])

  // Calcular totais
  const totalUpcoming = useMemo(() => {
    if (!filteredPayments) return { count: 0, amount: 0 }

    const amount = filteredPayments.reduce((sum, payment) => {
      return sum + parseFloat(payment.amount)
    }, 0)

    return {
      count: filteredPayments.length,
      amount,
    }
  }, [filteredPayments])

  // Agrupar por período
  const groupedPayments = useMemo(() => {
    if (!filteredPayments) return { today: [], thisWeek: [], later: [] }

    const today = startOfDay(new Date())
    const endOfThisWeek = endOfWeek(today, { weekStartsOn: 0 })

    const today_payments: Payment[] = []
    const thisWeek_payments: Payment[] = []
    const later_payments: Payment[] = []

    filteredPayments.forEach((payment) => {
      const dueDate = startOfDay(parseISO(payment.due_date))
      const daysUntilDue = differenceInDays(dueDate, today)

      if (daysUntilDue === 0) {
        today_payments.push(payment)
      } else if (dueDate <= endOfThisWeek) {
        thisWeek_payments.push(payment)
      } else {
        later_payments.push(payment)
      }
    })

    return {
      today: today_payments,
      thisWeek: thisWeek_payments,
      later: later_payments,
    }
  }, [filteredPayments])

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar próximos vencimentos"
        message="Não foi possível carregar os dados dos próximos vencimentos"
        retry={refetch}
      />
    )
  }

  const handlePayClick = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowPayDialog(true)
  }

  const handleCancelClick = (payment: Payment) => {
    setPaymentToCancel(payment)
    setShowCancelDialog(true)
  }

  const handleCancelConfirm = async () => {
    if (paymentToCancel) {
      await cancelPayment.mutateAsync(paymentToCancel.id)
      setShowCancelDialog(false)
      setPaymentToCancel(null)
    }
  }

  const PaymentRow = ({ payment }: { payment: Payment }) => {
    const dueDate = parseISO(payment.due_date)
    const today = startOfDay(new Date())
    const daysUntilDue = differenceInDays(dueDate, today)

    return (
      <TableRow key={payment.id}>
        <TableCell>
          <Button variant="link" asChild className="h-auto p-0">
            <Link href={`/leases/${payment.lease_id}`}>Ver Contrato</Link>
          </Button>
        </TableCell>
        <TableCell>
          <div className="text-sm">{formatDate(payment.reference_month)}</div>
        </TableCell>
        <TableCell>
          <span className="text-sm">{paymentTypeLabels[payment.payment_type]}</span>
        </TableCell>
        <TableCell>
          <div>
            <div className="text-sm font-medium">{formatDate(payment.due_date)}</div>
            <div className="text-muted-foreground text-xs">
              {daysUntilDue === 0
                ? 'Vence hoje'
                : daysUntilDue === 1
                  ? 'Vence amanhã'
                  : `Em ${daysUntilDue} dias`}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="font-medium">{formatCurrency(payment.amount)}</div>
        </TableCell>
        <TableCell>
          <PaymentStatusBadge status={payment.status} showIcon />
        </TableCell>
        <TableCell className="text-right">
          {payment.status === 'pending' && (
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => handlePayClick(payment)}>
                Registrar Pagamento
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleCancelClick(payment)}>
                Cancelar
              </Button>
            </div>
          )}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Próximos Vencimentos</h1>
        <p className="text-muted-foreground">Acompanhe pagamentos que vencem em breve</p>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Vencimentos</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalUpcoming.count}</div>
            <p className="text-muted-foreground text-xs">Nos próximos {daysAhead} dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalUpcoming.amount)}</div>
            <p className="text-muted-foreground text-xs">A receber</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vence Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{groupedPayments.today.length}</div>
            <p className="text-muted-foreground text-xs">
              {formatCurrency(
                groupedPayments.today.reduce((sum, p) => sum + parseFloat(p.amount), 0)
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Ajuste o período e busque por pagamentos</CardDescription>
            </div>

            <div className="flex gap-2">
              <Select
                value={daysAhead.toString()}
                onValueChange={(value) => setDaysAhead(parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Próximos 7 dias</SelectItem>
                  <SelectItem value="15">Próximos 15 dias</SelectItem>
                  <SelectItem value="30">Próximos 30 dias</SelectItem>
                  <SelectItem value="60">Próximos 60 dias</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative w-full sm:w-72">
                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                <Input
                  placeholder="Buscar por contrato ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Vence Hoje */}
      {groupedPayments.today.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Calendar className="h-5 w-5" />
              Vence Hoje ({groupedPayments.today.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-orange-200">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-orange-100/50">
                    <TableHead>Contrato</TableHead>
                    <TableHead>Referência</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedPayments.today.map((payment) => (
                    <PaymentRow key={payment.id} payment={payment} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Esta Semana */}
      {groupedPayments.thisWeek.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Esta Semana ({groupedPayments.thisWeek.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Referência</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedPayments.thisWeek.map((payment) => (
                    <PaymentRow key={payment.id} payment={payment} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Depois desta semana */}
      {groupedPayments.later.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-5 w-5" />
              Depois desta Semana ({groupedPayments.later.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Referência</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedPayments.later.map((payment) => (
                    <PaymentRow key={payment.id} payment={payment} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <Card>
          <CardContent className="py-10">
            <EmptyState
              icon={Calendar}
              title={searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum vencimento próximo'}
              description={
                searchTerm
                  ? 'Tente ajustar os termos de busca'
                  : `Não há pagamentos com vencimento nos próximos ${daysAhead} dias`
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Dialog de Pagamento */}
      <PayPaymentDialog
        payment={selectedPayment}
        open={showPayDialog}
        onOpenChange={setShowPayDialog}
      />

      {/* Dialog de Cancelamento */}
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancelar Pagamento"
        description={
          paymentToCancel ? (
            <div className="space-y-2">
              <p>Tem certeza que deseja cancelar este pagamento?</p>
              <div className="bg-muted rounded-md p-3 text-sm">
                <p>
                  <strong>Tipo:</strong> {paymentTypeLabels[paymentToCancel.payment_type]}
                </p>
                <p>
                  <strong>Referência:</strong> {formatDate(paymentToCancel.reference_month)}
                </p>
                <p>
                  <strong>Valor:</strong> {formatCurrency(paymentToCancel.amount)}
                </p>
                <p>
                  <strong>Vencimento:</strong> {formatDate(paymentToCancel.due_date)}
                </p>
              </div>
              <p className="text-destructive font-medium">Esta ação não pode ser desfeita.</p>
            </div>
          ) : (
            'Tem certeza que deseja cancelar este pagamento?'
          )
        }
        confirmText="Sim, Cancelar"
        cancelText="Não, Voltar"
        onConfirm={handleCancelConfirm}
        variant="destructive"
        loading={cancelPayment.isPending}
      />
    </div>
  )
}
