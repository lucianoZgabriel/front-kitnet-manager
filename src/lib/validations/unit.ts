import { z } from 'zod'

/**
 * Schema de validação para criação/edição de unidade
 */
export const unitFormSchema = z
  .object({
    number: z.string().min(1, 'Número da unidade é obrigatório').max(10, 'Número muito longo'),
    floor: z
      .number()
      .int('Andar deve ser um número inteiro')
      .min(1, 'Andar deve ser maior ou igual a 1'),
    base_rent_value: z
      .string()
      .min(1, 'Valor base é obrigatório')
      .refine(
        (val) => {
          const num = parseFloat(val)
          return !isNaN(num) && num > 0
        },
        { message: 'Valor base deve ser maior que zero' }
      ),
    renovated_rent_value: z
      .string()
      .min(1, 'Valor renovado é obrigatório')
      .refine(
        (val) => {
          const num = parseFloat(val)
          return !isNaN(num) && num > 0
        },
        { message: 'Valor renovado deve ser maior que zero' }
      ),
    is_renovated: z.boolean(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const baseValue = parseFloat(data.base_rent_value)
      const renovatedValue = parseFloat(data.renovated_rent_value)
      return renovatedValue >= baseValue
    },
    {
      message: 'Valor renovado deve ser maior ou igual ao valor base',
      path: ['renovated_rent_value'],
    }
  )

export type UnitFormData = z.infer<typeof unitFormSchema>
