'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { differenceInDays, parseISO } from 'date-fns'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { Checkbox } from '@/src/components/ui/checkbox'
import {
  formatCurrency,
  formatDateISO,
  formatDateTimeISO,
  calculateLateFee,
} from '@/src/lib/utils/format'
import type { Payment, PaymentMethod } from '@/src/types/api/payment'
import { useMarkPaymentAsPaid } from '@/src/hooks/use-payments'

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'pix', label: 'PIX' },
  { value: 'cash', label: 'Dinheiro' },
  { value: 'bank_transfer', label: 'Transferência Bancária' },
  { value: 'credit_card', label: 'Cartão de Crédito' },
]

const payPaymentSchema = z.object({
  payment_date: z.string().min(1, 'Data de pagamento é obrigatória'),
  payment_method: z.enum(['pix', 'cash', 'bank_transfer', 'credit_card']),
  apply_late_fee: z.boolean().optional(),
})

type PayPaymentFormData = z.infer<typeof payPaymentSchema>

interface PayPaymentDialogProps {
  payment: Payment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PayPaymentDialog({ payment, open, onOpenChange }: PayPaymentDialogProps) {
  const [daysOverdue, setDaysOverdue] = useState(0)
  const markAsPaid = useMarkPaymentAsPaid()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PayPaymentFormData>({
    resolver: zodResolver(payPaymentSchema),
    defaultValues: {
      payment_date: formatDateISO(new Date()),
      payment_method: 'pix',
      apply_late_fee: false,
    },
  })

  const selectedMethod = watch('payment_method')
  const applyLateFee = watch('apply_late_fee')

  // Auto-preencher data atual ao abrir o dialog
  useEffect(() => {
    if (open) {
      setValue('payment_date', formatDateISO(new Date()))
      setValue('payment_method', 'pix')

      // Calcular dias de atraso
      if (payment && payment.status === 'overdue') {
        const dueDateObj = parseISO(payment.due_date)
        const today = new Date()
        const days = differenceInDays(today, dueDateObj)
        setDaysOverdue(days > 0 ? days : 0)
      } else {
        setDaysOverdue(0)
      }
    }
  }, [open, payment, setValue])

  // Reset form ao fechar
  useEffect(() => {
    if (!open) {
      reset()
      setDaysOverdue(0)
    }
  }, [open, reset])

  if (!payment) return null

  const lateFeeData = calculateLateFee(payment.amount, daysOverdue)
  const hasLateFee = daysOverdue > 0

  const onSubmit = async (data: PayPaymentFormData) => {
    await markAsPaid.mutateAsync({
      id: payment.id,
      data: {
        payment_date: formatDateTimeISO(data.payment_date),
        payment_method: data.payment_method,
      },
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Marcar Pagamento como Pago</DialogTitle>
          <DialogDescription>
            Confirme a data e o método de pagamento para registrar este pagamento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Informações do pagamento */}
          <div className="bg-muted/50 space-y-2 rounded-lg border p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor Original:</span>
              <span className="font-medium">{formatCurrency(payment.amount)}</span>
            </div>

            {hasLateFee && (
              <>
                <div className="flex items-center space-x-2 border-t pt-3">
                  <Checkbox
                    id="apply_late_fee"
                    checked={applyLateFee}
                    onCheckedChange={(checked) => setValue('apply_late_fee', checked as boolean)}
                  />
                  <Label
                    htmlFor="apply_late_fee"
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aplicar juros e multa por atraso ({daysOverdue}{' '}
                    {daysOverdue === 1 ? 'dia' : 'dias'})
                  </Label>
                </div>

                {applyLateFee && (
                  <>
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Multa (2%):</span>
                      <span>+ {formatCurrency(lateFeeData.penalty)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Juros ({daysOverdue} dias):</span>
                      <span>+ {formatCurrency(lateFeeData.interest)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-base font-bold">
                      <span>Total com Juros:</span>
                      <span className="text-red-600">{formatCurrency(lateFeeData.total)}</span>
                    </div>
                  </>
                )}

                {!applyLateFee && (
                  <div className="flex justify-between border-t pt-2 text-base font-bold">
                    <span>Total a Receber:</span>
                    <span>{formatCurrency(payment.amount)}</span>
                  </div>
                )}

                <p className="text-muted-foreground text-xs">
                  {applyLateFee
                    ? '* O valor com juros será usado como referência para o pagamento.'
                    : '* O pagamento será registrado sem juros.'}
                </p>
              </>
            )}

            {!hasLateFee && (
              <div className="flex justify-between border-t pt-2 text-base font-bold">
                <span>Total a Receber:</span>
                <span>{formatCurrency(payment.amount)}</span>
              </div>
            )}
          </div>

          {/* Data de pagamento */}
          <div className="space-y-2">
            <Label htmlFor="payment_date">Data do Pagamento *</Label>
            <Input
              id="payment_date"
              type="date"
              {...register('payment_date')}
              max={formatDateISO(new Date())}
            />
            {errors.payment_date && (
              <p className="text-destructive text-sm">{errors.payment_date.message}</p>
            )}
          </div>

          {/* Método de pagamento */}
          <div className="space-y-2">
            <Label htmlFor="payment_method">Método de Pagamento *</Label>
            <Select
              value={selectedMethod}
              onValueChange={(value) => setValue('payment_method', value as PaymentMethod)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.payment_method && (
              <p className="text-destructive text-sm">{errors.payment_method.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={markAsPaid.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={markAsPaid.isPending}>
              {markAsPaid.isPending ? 'Processando...' : 'Confirmar Pagamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
