'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { Checkbox } from '@/src/components/ui/checkbox'
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import { unitFormSchema, type UnitFormData } from '@/src/lib/validations/unit'
import { useCreateUnit, useUpdateUnit } from '@/src/hooks/use-units'
import type { Unit } from '@/src/types/api/unit'

interface UnitFormProps {
  unit?: Unit
  mode: 'create' | 'edit'
}

export function UnitForm({ unit, mode }: UnitFormProps) {
  const router = useRouter()
  const createUnit = useCreateUnit()
  const updateUnit = useUpdateUnit()

  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
      number: unit?.number || '',
      floor: unit?.floor || 1,
      base_rent_value: unit?.base_rent_value || '',
      renovated_rent_value: unit?.renovated_rent_value || '',
      is_renovated: unit?.is_renovated || false,
      notes: unit?.notes || '',
    },
  })

  const onSubmit = async (data: UnitFormData) => {
    try {
      if (mode === 'create') {
        await createUnit.mutateAsync({
          number: data.number,
          floor: data.floor,
          base_rent_value: data.base_rent_value,
          renovated_rent_value: data.renovated_rent_value,
        })
        router.push('/units')
      } else if (unit) {
        await updateUnit.mutateAsync({
          id: unit.id,
          data: {
            number: data.number,
            floor: data.floor,
            base_rent_value: data.base_rent_value,
            renovated_rent_value: data.renovated_rent_value,
            is_renovated: data.is_renovated,
            notes: data.notes,
          },
        })
        router.push(`/units/${unit.id}`)
      }
    } catch (error) {
      // Erro já é tratado pelo hook com toast
      console.error('Error submitting form:', error)
    }
  }

  const isSubmitting = createUnit.isPending || updateUnit.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Número da Unidade */}
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número da Unidade</FormLabel>
                <FormControl>
                  <Input placeholder="101" {...field} />
                </FormControl>
                <FormDescription>Número identificador da unidade</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Andar */}
          <FormField
            control={form.control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Andar</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormDescription>Andar onde a unidade está localizada</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Valor Base */}
          <FormField
            control={form.control}
            name="base_rent_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Base do Aluguel</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="800.00" {...field} />
                </FormControl>
                <FormDescription>Valor do aluguel sem reforma (em R$)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Valor Renovado */}
          <FormField
            control={form.control}
            name="renovated_rent_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Renovado do Aluguel</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="1000.00" {...field} />
                </FormControl>
                <FormDescription>Valor do aluguel após reforma (em R$)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Unidade Renovada */}
        {mode === 'edit' && (
          <FormField
            control={form.control}
            name="is_renovated"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Unidade Renovada</FormLabel>
                  <FormDescription>
                    Marque se a unidade já passou por reforma (isso altera o valor atual do aluguel)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        )}

        {/* Observações */}
        {mode === 'edit' && (
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Input placeholder="Informações adicionais sobre a unidade..." {...field} />
                </FormControl>
                <FormDescription>Observações ou notas sobre a unidade</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Botões */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <LoadingSpinner className="mr-2" size="sm" />}
            {mode === 'create' ? 'Criar Unidade' : 'Salvar Alterações'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}
