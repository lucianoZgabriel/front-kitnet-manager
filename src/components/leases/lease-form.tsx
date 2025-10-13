'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { leaseFormSchema, type LeaseFormData } from '@/src/lib/validations/lease'
import { useCreateLease } from '@/src/hooks/use-leases'
import { useUnits } from '@/src/hooks/use-units'
import { useTenants } from '@/src/hooks/use-tenants'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { ErrorMessage } from '@/src/components/shared/error-message'
import { formatCurrency } from '@/src/lib/utils/format'

interface LeaseFormProps {
  mode: 'create'
}

export function LeaseForm({}: LeaseFormProps) {
  const router = useRouter()
  const createLease = useCreateLease()

  // Buscar unidades disponíveis
  const {
    data: units,
    isLoading: unitsLoading,
    error: unitsError,
    refetch: refetchUnits,
  } = useUnits({ status: 'available' })

  // Buscar todos os inquilinos
  const {
    data: tenants,
    isLoading: tenantsLoading,
    error: tenantsError,
    refetch: refetchTenants,
  } = useTenants()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeaseFormData>({
    resolver: zodResolver(leaseFormSchema),
    defaultValues: {
      unit_id: '',
      tenant_id: '',
      contract_signed_date: '',
      start_date: '',
      payment_due_day: 5,
      monthly_rent_value: '',
      painting_fee_total: '',
      painting_fee_installments: 2,
    },
  })

  const selectedUnitId = watch('unit_id')
  const selectedUnit = units?.find((u) => u.id === selectedUnitId)

  // Quando selecionar unidade, auto-preencher valor do aluguel
  const handleUnitChange = (unitId: string) => {
    setValue('unit_id', unitId)
    const unit = units?.find((u) => u.id === unitId)
    if (unit) {
      setValue('monthly_rent_value', unit.current_rent_value)
    }
  }

  const onSubmit = async (data: LeaseFormData) => {
    try {
      const result = await createLease.mutateAsync(data)
      router.push(`/leases/${result.lease.id}`)
    } catch (error) {
      console.error('Erro ao criar contrato:', error)
    }
  }

  // Loading states
  if (unitsLoading || tenantsLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    )
  }

  // Error states
  if (unitsError || tenantsError) {
    return (
      <ErrorMessage
        title="Erro ao carregar dados"
        message="Não foi possível carregar unidades ou inquilinos"
        retry={() => {
          refetchUnits()
          refetchTenants()
        }}
      />
    )
  }

  // Validar se há unidades disponíveis
  if (!units || units.length === 0) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="font-semibold text-yellow-900">Nenhuma unidade disponível</h3>
        <p className="text-sm text-yellow-700">
          Não há unidades disponíveis para criar um novo contrato. Verifique se existem unidades com
          status &quot;Disponível&quot;.
        </p>
      </div>
    )
  }

  // Validar se há inquilinos
  if (!tenants || tenants.length === 0) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="font-semibold text-yellow-900">Nenhum inquilino cadastrado</h3>
        <p className="text-sm text-yellow-700">
          Não há inquilinos cadastrados. Cadastre um inquilino antes de criar um contrato.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Unidade */}
      <div className="space-y-2">
        <Label htmlFor="unit_id">
          Unidade <span className="text-red-500">*</span>
        </Label>
        <Select value={watch('unit_id')} onValueChange={handleUnitChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma unidade" />
          </SelectTrigger>
          <SelectContent>
            {units.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                Unidade {unit.number} - Andar {unit.floor} -{' '}
                {formatCurrency(parseFloat(unit.current_rent_value))}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.unit_id && <p className="text-destructive text-sm">{errors.unit_id.message}</p>}
        {selectedUnit && (
          <p className="text-muted-foreground text-sm">
            Valor atual: {formatCurrency(parseFloat(selectedUnit.current_rent_value))} •{' '}
            {selectedUnit.is_renovated ? 'Renovada' : 'Não renovada'}
          </p>
        )}
      </div>

      {/* Inquilino */}
      <div className="space-y-2">
        <Label htmlFor="tenant_id">
          Inquilino <span className="text-red-500">*</span>
        </Label>
        <Select value={watch('tenant_id')} onValueChange={(val) => setValue('tenant_id', val)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um inquilino" />
          </SelectTrigger>
          <SelectContent>
            {tenants.map((tenant) => (
              <SelectItem key={tenant.id} value={tenant.id}>
                {tenant.full_name} - {tenant.cpf}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tenant_id && <p className="text-destructive text-sm">{errors.tenant_id.message}</p>}
      </div>

      {/* Datas */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contract_signed_date">
            Data de Assinatura <span className="text-red-500">*</span>
          </Label>
          <Input id="contract_signed_date" type="date" {...register('contract_signed_date')} />
          {errors.contract_signed_date && (
            <p className="text-destructive text-sm">{errors.contract_signed_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_date">
            Data de Início <span className="text-red-500">*</span>
          </Label>
          <Input id="start_date" type="date" {...register('start_date')} />
          {errors.start_date && (
            <p className="text-destructive text-sm">{errors.start_date.message}</p>
          )}
          <p className="text-muted-foreground text-xs">
            Duração fixa de 6 meses. Término será calculado automaticamente.
          </p>
        </div>
      </div>

      {/* Valores */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="monthly_rent_value">
            Valor do Aluguel Mensal <span className="text-red-500">*</span>
          </Label>
          <Input
            id="monthly_rent_value"
            type="text"
            placeholder="1000.00"
            {...register('monthly_rent_value')}
          />
          {errors.monthly_rent_value && (
            <p className="text-destructive text-sm">{errors.monthly_rent_value.message}</p>
          )}
          <p className="text-muted-foreground text-xs">
            Use formato: 1000.00 (ponto como separador decimal)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_due_day">
            Dia de Vencimento <span className="text-red-500">*</span>
          </Label>
          <Input
            id="payment_due_day"
            type="number"
            min={1}
            max={31}
            {...register('payment_due_day', { valueAsNumber: true })}
          />
          {errors.payment_due_day && (
            <p className="text-destructive text-sm">{errors.payment_due_day.message}</p>
          )}
          <p className="text-muted-foreground text-xs">Dia do mês (1-31)</p>
        </div>
      </div>

      {/* Taxa de Pintura */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="painting_fee_total">
            Taxa de Pintura Total <span className="text-red-500">*</span>
          </Label>
          <Input
            id="painting_fee_total"
            type="text"
            placeholder="250.00"
            {...register('painting_fee_total')}
          />
          {errors.painting_fee_total && (
            <p className="text-destructive text-sm">{errors.painting_fee_total.message}</p>
          )}
          <p className="text-muted-foreground text-xs">Use 0.00 se não houver taxa</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="painting_fee_installments">
            Parcelas da Taxa <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch('painting_fee_installments')?.toString()}
            onValueChange={(val) => setValue('painting_fee_installments', parseInt(val))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="3">3x</SelectItem>
              <SelectItem value="4">4x</SelectItem>
            </SelectContent>
          </Select>
          {errors.painting_fee_installments && (
            <p className="text-destructive text-sm">{errors.painting_fee_installments.message}</p>
          )}
          <p className="text-muted-foreground text-xs">A taxa será dividida nos primeiros meses</p>
        </div>
      </div>

      {/* Botões */}
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={isSubmitting || createLease.isPending}
          className="min-w-[120px]"
        >
          {isSubmitting || createLease.isPending ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Criando...
            </>
          ) : (
            'Criar Contrato'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting || createLease.isPending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
