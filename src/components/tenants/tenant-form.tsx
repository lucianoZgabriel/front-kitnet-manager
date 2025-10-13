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
import { LoadingSpinner } from '@/src/components/shared/loading-spinner'
import {
  tenantFormSchema,
  type TenantFormData,
  type UpdateTenantFormData,
} from '@/src/lib/validations/tenant'
import { useCreateTenant, useUpdateTenant } from '@/src/hooks/use-tenants'
import type { Tenant } from '@/src/types/api/tenant'
import { formatCPF, formatPhone } from '@/src/lib/utils/format'
import { useState } from 'react'

interface TenantFormProps {
  tenant?: Tenant
  mode: 'create' | 'edit'
}

export function TenantForm({ tenant, mode }: TenantFormProps) {
  const router = useRouter()
  const createTenant = useCreateTenant()
  const updateTenant = useUpdateTenant()
  const [cpfValue, setCpfValue] = useState(tenant?.cpf || '')
  const [phoneValue, setPhoneValue] = useState(tenant?.phone || '')

  const form = useForm<TenantFormData>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      full_name: tenant?.full_name || '',
      cpf: tenant?.cpf || '',
      phone: tenant?.phone || '',
      email: tenant?.email || '',
      id_document_type: tenant?.id_document_type || '',
      id_document_number: tenant?.id_document_number || '',
    },
  })

  const onSubmit = async (data: TenantFormData) => {
    try {
      if (mode === 'create') {
        const createData = data as TenantFormData
        await createTenant.mutateAsync(createData)
        router.push('/tenants')
      } else if (tenant) {
        const updateData = data as UpdateTenantFormData
        await updateTenant.mutateAsync({
          id: tenant.id,
          data: updateData,
        })
        router.push(`/tenants/${tenant.id}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const isSubmitting = createTenant.isPending || updateTenant.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Nome Completo */}
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="João Silva Santos" {...field} />
                </FormControl>
                <FormDescription>Nome completo do inquilino</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CPF (apenas no modo create) */}
          {mode === 'create' && (
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123.456.789-00"
                      maxLength={14}
                      value={cpfValue}
                      onChange={(e) => {
                        const formatted = formatCPF(e.target.value)
                        setCpfValue(formatted)
                        field.onChange(formatted)
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    CPF no formato XXX.XXX.XXX-XX (não pode ser alterado depois)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* CPF (readonly no modo edit) */}
          {mode === 'edit' && tenant && (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input value={formatCPF(tenant.cpf)} disabled />
              </FormControl>
              <FormDescription>CPF não pode ser alterado</FormDescription>
            </FormItem>
          )}

          {/* Telefone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(11) 98765-4321"
                    maxLength={15}
                    value={phoneValue}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value)
                      setPhoneValue(formatted)
                      field.onChange(formatted)
                    }}
                  />
                </FormControl>
                <FormDescription>Telefone de contato</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Email (opcional)</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="joao.silva@email.com" {...field} />
                </FormControl>
                <FormDescription>Email do inquilino para contato</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tipo de Documento */}
          <FormField
            control={form.control}
            name="id_document_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Documento (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="RG, CNH, etc" {...field} />
                </FormControl>
                <FormDescription>Tipo do documento de identificação</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Número do Documento */}
          <FormField
            control={form.control}
            name="id_document_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Documento (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="12.345.678-9" {...field} />
                </FormControl>
                <FormDescription>Número do documento de identificação</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <LoadingSpinner className="mr-2" size="sm" />}
            {mode === 'create' ? 'Criar Inquilino' : 'Salvar Alterações'}
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
