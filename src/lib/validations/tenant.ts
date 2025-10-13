import { z } from 'zod'
import { validateCPF } from '@/src/lib/utils/format'

/**
 * Schema de validação para criação/edição de inquilino
 */
export const tenantFormSchema = z.object({
  full_name: z.string().min(1, 'Nome completo é obrigatório').max(100, 'Nome muito longo').trim(),
  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .refine((val) => validateCPF(val), {
      message: 'CPF inválido. Use o formato: XXX.XXX.XXX-XX',
    }),
  phone: z.string().min(1, 'Telefone é obrigatório').max(20, 'Telefone muito longo'),
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  id_document_type: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  id_document_number: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
})

/**
 * Schema para atualização (sem CPF, que é imutável)
 */
export const updateTenantFormSchema = tenantFormSchema.omit({ cpf: true })

export type TenantFormData = z.infer<typeof tenantFormSchema>
export type UpdateTenantFormData = z.infer<typeof updateTenantFormSchema>
