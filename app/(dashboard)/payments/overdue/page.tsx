'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useOverduePayments, useCancelPayment } from '@/src/hooks/use-payments'
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
import { Input } from '@/src/components/ui/input'
import { AlertTriangle, Search, DollarSign } from 'lucide-react'
import { PayPaymentDialog } from '@/src/components/payments/pay-payment-dialog'
import { formatCurrency, formatDate } from '@/src/lib/utils/format'
import { differenceInDays, parseISO } from 'date-fns'
import type { Payment, PaymentType } from '@/src/types/api/payment'

const paymentTypeLabels: Record<PaymentType, string> = {
  rent: 'Aluguel',
  painting_fee: 'Taxa de Pintura',
  adjustment: 'Ajuste',
}

export default function OverduePaymentsPage() {
  const { data: payments, isLoading, error, refetch } = useOverduePayments()
  const cancelPayment = useCancelPayment()
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showPayDialog, setShowPayDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [paymentToCancel, setPaymentToCancel] = useState<Payment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

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
  const totalOverdue = useMemo(() => {
    if (!filteredPayments) return { count: 0, amount: 0 }

    let amount = 0

    filteredPayments.forEach((payment) => {
      amount += parseFloat(payment.amount)
    })

    return {
      count: filteredPayments.length,
      amount,
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
        title="Erro ao carregar pagamentos atrasados"
        message="Não foi possível carregar os dados dos pagamentos atrasados"
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

  // Ordenar por dias de atraso (maior primeiro)
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    const daysA = differenceInDays(new Date(), parseISO(a.due_date))
    const daysB = differenceInDays(new Date(), parseISO(b.due_date))
    return daysB - daysA
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Pagamentos Atrasados</h1>
        <p className="text-muted-foreground">Acompanhe e gerencie pagamentos em atraso</p>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Atrasado</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalOverdue.count}</div>
            <p className="text-muted-foreground text-xs">
              {totalOverdue.count === 1 ? 'pagamento' : 'pagamentos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalOverdue.amount)}</div>
            <p className="text-muted-foreground text-xs">Pagamentos em atraso</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pagamentos */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Lista de Atrasados</CardTitle>
              <CardDescription>{filteredPayments.length} pagamento(s) atrasado(s)</CardDescription>
            </div>

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
        </CardHeader>
        <CardContent>
          {sortedPayments.length === 0 ? (
            <EmptyState
              icon={AlertTriangle}
              title={searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum pagamento atrasado'}
              description={
                searchTerm
                  ? 'Tente ajustar os termos de busca'
                  : 'Todos os pagamentos estão em dia!'
              }
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Referência</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Dias de Atraso</TableHead>
                    <TableHead>Valor Original</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPayments.map((payment) => {
                    const dueDateObj = parseISO(payment.due_date)
                    const today = new Date()
                    const daysOverdue = differenceInDays(today, dueDateObj)

                    return (
                      <TableRow key={payment.id} className="hover:bg-red-50/50">
                        <TableCell>
                          <Button variant="link" asChild className="h-auto p-0">
                            <Link href={`/leases/${payment.lease_id}`}>Ver Contrato</Link>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {payment.lease_id.slice(0, 8)}...
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(payment.reference_month)}</div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{paymentTypeLabels[payment.payment_type]}</span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(payment.due_date)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="font-semibold text-red-600">
                              {daysOverdue} {daysOverdue === 1 ? 'dia' : 'dias'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{formatCurrency(payment.amount)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold">{formatCurrency(payment.amount)}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => handlePayClick(payment)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Registrar Pagamento
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelClick(payment)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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
        title="Cancelar Pagamento Atrasado"
        description={
          paymentToCancel ? (
            <div className="space-y-2">
              <p>Tem certeza que deseja cancelar este pagamento atrasado?</p>
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
