'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { Badge } from '@/src/components/ui/badge'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { formatCurrency, formatDate } from '@/src/lib/utils/format'
import { Calendar, CheckCircle2, ArrowRight, Info, DollarSign, Clock } from 'lucide-react'
import type { Lease } from '@/src/types/api/lease'
import type { ChangePaymentDueDayResponse } from '@/src/types/api/lease'

interface ChangePaymentDueDayDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lease: Lease | null
  onConfirm: (data: {
    newPaymentDueDay: number
    effectiveDate: string
    reason?: string
  }) => Promise<ChangePaymentDueDayResponse>
  loading: boolean
}

export function ChangePaymentDueDayDialog({
  open,
  onOpenChange,
  lease,
  onConfirm,
  loading,
}: ChangePaymentDueDayDialogProps) {
  const [newPaymentDueDay, setNewPaymentDueDay] = useState<string>('')
  const [effectiveDate, setEffectiveDate] = useState<string>('')
  const [reason, setReason] = useState<string>('')
  const [result, setResult] = useState<ChangePaymentDueDayResponse | null>(null)
  const [step, setStep] = useState<'form' | 'result'>('form')

  // Reset state when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset when closing
      setNewPaymentDueDay('')
      setEffectiveDate('')
      setReason('')
      setResult(null)
      setStep('form')
    }
    onOpenChange(newOpen)
  }

  // Validações
  const dayNumber = parseInt(newPaymentDueDay)
  const isDayValid = !isNaN(dayNumber) && dayNumber >= 1 && dayNumber <= 31
  const isDateValid = effectiveDate !== '' && new Date(effectiveDate) >= new Date()
  const isDifferentDay = lease ? dayNumber !== lease.payment_due_day : false
  const isFormValid = isDayValid && isDateValid && isDifferentDay

  const handleSubmit = async () => {
    if (!isFormValid) return

    try {
      const response = await onConfirm({
        newPaymentDueDay: dayNumber,
        effectiveDate,
        reason: reason.trim() || undefined,
      })
      setResult(response)
      setStep('result')
    } catch (error) {
      // Error handling is done by the parent component
      console.error('Error changing payment due day:', error)
    }
  }

  const handleClose = () => {
    handleOpenChange(false)
  }

  if (!lease) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle>Alterar Data de Vencimento</DialogTitle>
              <DialogDescription>
                Altere o dia de vencimento dos pagamentos deste contrato. Um pagamento proporcional
                será gerado automaticamente.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Current Info Card */}
              <div className="bg-muted rounded-lg p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Informações Atuais</span>
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Dia de vencimento atual:</span>
                    <span className="font-semibold">Dia {lease.payment_due_day}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Valor do aluguel:</span>
                    <span className="font-semibold">
                      {formatCurrency(parseFloat(lease.monthly_rent_value))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vigência do contrato:</span>
                    <span className="font-semibold">
                      {formatDate(lease.start_date)} a {formatDate(lease.end_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-due-day">
                    Novo Dia de Vencimento <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                    <Input
                      id="new-due-day"
                      type="number"
                      min="1"
                      max="31"
                      placeholder="Digite o dia (1-31)"
                      value={newPaymentDueDay}
                      onChange={(e) => setNewPaymentDueDay(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                  {newPaymentDueDay && !isDayValid && (
                    <p className="text-destructive text-xs">O dia deve estar entre 1 e 31</p>
                  )}
                  {newPaymentDueDay && isDayValid && !isDifferentDay && (
                    <p className="text-xs text-amber-600">O novo dia deve ser diferente do atual</p>
                  )}
                  {isDayValid && isDifferentDay && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>
                        Dia {lease.payment_due_day} → Dia {dayNumber}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="effective-date">
                    Data Efetiva da Mudança <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Clock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                    <Input
                      id="effective-date"
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      max={lease.end_date}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    A data em que o novo vencimento passa a valer. Deve estar entre hoje e o fim do
                    contrato.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Motivo (Opcional)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Ex: Ajuste de fluxo de caixa do inquilino"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Info Alert */}
              <div className="border-primary/20 bg-primary/5 flex gap-3 rounded-lg border p-4">
                <Info className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="space-y-1 text-sm">
                  <p className="text-primary font-medium">O que acontecerá:</p>
                  <ul className="text-muted-foreground list-inside list-disc space-y-1">
                    <li>Será gerado um pagamento proporcional ao período</li>
                    <li>Todos os pagamentos futuros pendentes serão recalculados</li>
                    <li>Pagamentos já realizados não serão alterados</li>
                    <li>O dia de vencimento do contrato será atualizado</li>
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t pt-4">
              <div className="flex w-full justify-between gap-2">
                <Button variant="outline" onClick={handleClose} disabled={loading}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={!isFormValid || loading}>
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Confirmar Mudança
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Mudança Realizada com Sucesso
              </DialogTitle>
              <DialogDescription>
                O dia de vencimento foi alterado e os pagamentos foram recalculados.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-muted rounded-lg p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-base">
                      Dia {result?.old_payment_due_day}
                    </Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge variant="default" className="text-base">
                      Dia {result?.new_payment_due_day}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    Efetivo em: {result?.effective_date && formatDate(result.effective_date)}
                  </span>
                </div>
              </div>

              {/* Proportional Payment */}
              {result?.proportional_payment && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <DollarSign className="h-5 w-5 text-amber-500" />
                    Pagamento Proporcional Gerado
                  </h3>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
                    <div className="grid gap-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Período:</span>
                        <span className="font-medium">
                          {result.proportional_payment.reference_period}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Dias:</span>
                        <span className="font-medium">{result.proportional_payment.days} dias</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Valor:</span>
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-500">
                          {formatCurrency(result.proportional_payment.amount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Vencimento:</span>
                        <span className="font-medium">
                          {formatDate(result.proportional_payment.due_date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant="secondary">
                          {result.proportional_payment.status === 'pending'
                            ? 'Pendente'
                            : result.proportional_payment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Updated Payments */}
              {result && result.updated_payments_count > 0 && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Pagamentos Recalculados
                  </h3>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                    <p className="mb-3 text-sm text-blue-900 dark:text-blue-100">
                      {result.updated_payments_count} pagamento(s) futuro(s) tiveram a data de
                      vencimento atualizada:
                    </p>
                    <div className="max-h-60 space-y-2 overflow-y-auto">
                      {result.updated_payments.slice(0, 5).map((payment) => (
                        <div
                          key={payment.id}
                          className="bg-background flex items-center justify-between rounded border p-2 text-xs"
                        >
                          <span className="text-muted-foreground">
                            Ref: {formatDate(payment.reference_month)}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground line-through">
                              {formatDate(payment.old_due_date)}
                            </span>
                            <ArrowRight className="h-3 w-3" />
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              {formatDate(payment.new_due_date)}
                            </span>
                          </div>
                        </div>
                      ))}
                      {result.updated_payments.length > 5 && (
                        <p className="text-muted-foreground pt-2 text-center text-xs">
                          + {result.updated_payments.length - 5} pagamento(s) adicional(is)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Success Info */}
              <div className="flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                <div className="space-y-1 text-sm text-green-900 dark:text-green-100">
                  <p className="font-medium">Mudança aplicada com sucesso!</p>
                  <p className="text-green-700 dark:text-green-300">
                    O contrato foi atualizado e todos os pagamentos futuros já refletem o novo dia
                    de vencimento.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t pt-4">
              <Button onClick={handleClose} className="w-full">
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
