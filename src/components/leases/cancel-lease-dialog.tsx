'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Checkbox } from '@/src/components/ui/checkbox'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { formatCurrency, formatDate } from '@/src/lib/utils/format'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import type { Payment } from '@/src/types/api/payment'

interface CancelLeaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payments: Payment[]
  onConfirm: (paymentIds: string[]) => void
  loading: boolean
}

export function CancelLeaseDialog({
  open,
  onOpenChange,
  payments,
  onConfirm,
  loading,
}: CancelLeaseDialogProps) {
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<string[]>([])

  // Reset selection when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Selecionar todos os pagamentos por padrão ao abrir
      setSelectedPaymentIds(payments.map((p) => p.id))
    } else {
      setSelectedPaymentIds([])
    }
    onOpenChange(newOpen)
  }

  // Toggle individual payment selection
  const togglePayment = (paymentId: string) => {
    setSelectedPaymentIds((prev) =>
      prev.includes(paymentId) ? prev.filter((id) => id !== paymentId) : [...prev, paymentId]
    )
  }

  // Toggle all payments
  const toggleAll = () => {
    if (selectedPaymentIds.length === payments.length) {
      setSelectedPaymentIds([])
    } else {
      setSelectedPaymentIds(payments.map((p) => p.id))
    }
  }

  // Calculate totals
  const totals = useMemo(() => {
    const selectedPayments = payments.filter((p) => selectedPaymentIds.includes(p.id))
    const total = selectedPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0)
    return {
      count: selectedPayments.length,
      amount: total,
    }
  }, [payments, selectedPaymentIds])

  const handleConfirm = () => {
    if (selectedPaymentIds.length > 0) {
      onConfirm(selectedPaymentIds)
    }
  }

  const allSelected = selectedPaymentIds.length === payments.length
  const someSelected = selectedPaymentIds.length > 0 && !allSelected

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-3xl flex-col">
        <DialogHeader>
          <DialogTitle>Cancelar Contrato</DialogTitle>
          <DialogDescription>
            Selecione os pagamentos que deseja cancelar. O contrato será marcado como cancelado e a
            unidade ficará disponível.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {/* Summary Card */}
          <div className="bg-muted space-y-2 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pagamentos Selecionados</span>
              <span className="text-2xl font-bold">{totals.count}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Valor Total a Cancelar</span>
              <span className="text-destructive text-2xl font-bold">
                {formatCurrency(totals.amount)}
              </span>
            </div>
          </div>

          {/* Select All Checkbox */}
          <div className="flex items-center space-x-2 border-b pb-3">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={toggleAll}
              className={someSelected ? 'data-[state=checked]:bg-muted' : ''}
            />
            <label
              htmlFor="select-all"
              className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Selecionar todos ({payments.length} pagamentos)
            </label>
          </div>

          {/* Payments Table */}
          {payments.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <AlertCircle className="mx-auto mb-2 h-12 w-12" />
              <p>Nenhum pagamento cancelável encontrado</p>
              <p className="mt-1 text-xs">Todos os pagamentos já foram pagos ou cancelados</p>
            </div>
          ) : (
            <div className="space-y-2">
              {payments.map((payment) => {
                const isSelected = selectedPaymentIds.includes(payment.id)
                return (
                  <div
                    key={payment.id}
                    className={`hover:border-primary cursor-pointer rounded-lg border p-3 transition-all ${
                      isSelected ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => togglePayment(payment.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`payment-${payment.id}`}
                        checked={isSelected}
                        onCheckedChange={() => togglePayment(payment.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {payment.payment_type === 'rent'
                                ? 'Aluguel'
                                : payment.payment_type === 'painting_fee'
                                  ? 'Taxa Pintura'
                                  : 'Ajuste'}
                            </span>
                            <Badge
                              variant={payment.status === 'overdue' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {payment.status === 'pending'
                                ? 'Pendente'
                                : payment.status === 'overdue'
                                  ? 'Atrasado'
                                  : payment.status}
                            </Badge>
                          </div>
                          <span className="text-lg font-semibold">
                            {formatCurrency(parseFloat(payment.amount))}
                          </span>
                        </div>
                        <div className="text-muted-foreground space-y-1 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Referência: {formatDate(payment.reference_month)}</span>
                            <span>Vencimento: {formatDate(payment.due_date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              {selectedPaymentIds.length > 0 ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>
                    {selectedPaymentIds.length} pagamento(s) selecionado(s) para cancelamento
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span>Nenhum pagamento selecionado</span>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
                Voltar
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={loading || selectedPaymentIds.length === 0}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Cancelando...
                  </>
                ) : (
                  'Confirmar Cancelamento'
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
