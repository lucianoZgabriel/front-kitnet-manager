import { z } from 'zod'

/**
 * Schema de validação para criação de contrato
 */
export const leaseFormSchema = z
  .object({
    unit_id: z.string().uuid('Selecione uma unidade válida'),
    tenant_id: z.string().uuid('Selecione um inquilino válido'),
    contract_signed_date: z.string().min(1, 'Data de assinatura é obrigatória'),
    start_date: z.string().min(1, 'Data de início é obrigatória'),
    payment_due_day: z
      .number()
      .int('Dia de vencimento deve ser um número inteiro')
      .min(1, 'Dia de vencimento deve ser entre 1 e 31')
      .max(31, 'Dia de vencimento deve ser entre 1 e 31'),
    monthly_rent_value: z
      .string()
      .min(1, 'Valor do aluguel é obrigatório')
      .refine(
        (val) => {
          const num = parseFloat(val)
          return !isNaN(num) && num > 0
        },
        { message: 'Valor do aluguel deve ser maior que zero' }
      ),
    painting_fee_total: z
      .string()
      .min(1, 'Taxa de pintura é obrigatória')
      .refine(
        (val) => {
          const num = parseFloat(val)
          return !isNaN(num) && num >= 0
        },
        { message: 'Taxa de pintura deve ser maior ou igual a zero' }
      ),
    painting_fee_installments: z
      .number()
      .int('Parcelas devem ser um número inteiro')
      .min(1, 'Parcelas devem ser entre 1 e 4')
      .max(4, 'Parcelas devem ser entre 1 e 4'),
  })
  .refine(
    (data) => {
      // Validar que start_date é depois de contract_signed_date
      const signedDate = new Date(data.contract_signed_date)
      const startDate = new Date(data.start_date)
      return startDate >= signedDate
    },
    {
      message: 'Data de início deve ser posterior ou igual à data de assinatura',
      path: ['start_date'],
    }
  )

/**
 * Schema para renovação de contrato
 */
export const renewLeaseFormSchema = z.object({
  painting_fee_total: z
    .string()
    .min(1, 'Taxa de pintura é obrigatória')
    .refine(
      (val) => {
        const num = parseFloat(val)
        return !isNaN(num) && num >= 0
      },
      { message: 'Taxa de pintura deve ser maior ou igual a zero' }
    ),
  painting_fee_installments: z
    .number()
    .int('Parcelas devem ser um número inteiro')
    .min(1, 'Parcelas devem ser entre 1 e 4')
    .max(4, 'Parcelas devem ser entre 1 e 4'),
})

export type LeaseFormData = z.infer<typeof leaseFormSchema>
export type RenewLeaseFormData = z.infer<typeof renewLeaseFormSchema>
