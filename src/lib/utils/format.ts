import { format as dateFnsFormat, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Formata valor monetário para formato brasileiro
 * @param value - Valor em string ou número
 * @returns String formatada como "R$ 1.000,00"
 */
export function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value

  // Se o valor não for válido, retornar R$ 0,00
  if (isNaN(num) || !isFinite(num)) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(0)
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num)
}

/**
 * Valida CPF (formato e dígitos)
 * @param cpf - CPF em qualquer formato
 * @returns true se válido
 */
export function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, '')

  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) return false

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(numbers)) return false

  return true
}

/**
 * Formata CPF para formato XXX.XXX.XXX-XX
 * @param cpf - CPF em qualquer formato
 * @returns CPF formatado ou string vazia se inválido
 */
export function formatCPF(cpf: string): string {
  const numbers = cpf.replace(/\D/g, '')
  if (numbers.length !== 11) return cpf

  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Formata telefone para formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 * @param phone - Telefone em qualquer formato
 * @returns Telefone formatado
 */
export function formatPhone(phone: string): string {
  const numbers = phone.replace(/\D/g, '')

  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  return phone
}

/**
 * Formata data ISO para formato brasileiro DD/MM/YYYY
 * @param date - Data em formato ISO (YYYY-MM-DD) ou Date object
 * @returns Data formatada como "DD/MM/YYYY" ou "-" se data inválida
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-'

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    const formatted = dateFnsFormat(dateObj, 'dd/MM/yyyy', { locale: ptBR })

    // Verifica se a data é válida
    if (formatted === 'Invalid Date' || isNaN(dateObj.getTime())) {
      return '-'
    }

    return formatted
  } catch {
    return '-'
  }
}

/**
 * Formata data ISO para formato brasileiro com hora DD/MM/YYYY HH:mm
 * @param date - Data em formato ISO ou Date object
 * @returns Data formatada como "DD/MM/YYYY HH:mm" ou "-" se data inválida
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '-'

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    const formatted = dateFnsFormat(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR })

    // Verifica se a data é válida
    if (formatted === 'Invalid Date' || isNaN(dateObj.getTime())) {
      return '-'
    }

    return formatted
  } catch {
    return '-'
  }
}

/**
 * Formata data para formato ISO YYYY-MM-DD (para enviar à API)
 * @param date - Date object
 * @returns Data formatada como "YYYY-MM-DD"
 */
export function formatDateISO(date: Date): string {
  return dateFnsFormat(date, 'yyyy-MM-dd')
}

/**
 * Calcula multa por atraso no pagamento
 * Business Rule:
 * - 2% de multa fixa sobre o valor
 * - 1% de juros ao mês (pro-rata diário)
 *
 * @param amount - Valor original do pagamento (string ou número)
 * @param daysOverdue - Dias de atraso
 * @returns Objeto com valores calculados
 */
export function calculateLateFee(
  amount: string | number,
  daysOverdue: number
): {
  amount: number
  penalty: number
  interest: number
  total: number
} {
  const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount

  // Sem atraso = sem multa
  if (daysOverdue <= 0) {
    return {
      amount: amountNum,
      penalty: 0,
      interest: 0,
      total: amountNum,
    }
  }

  // Multa de 2%
  const penalty = amountNum * 0.02

  // Juros de 1% ao mês (pro-rata diário)
  const dailyInterestRate = 0.01 / 30
  const interest = amountNum * dailyInterestRate * daysOverdue

  // Total com multa e juros
  const total = amountNum + penalty + interest

  return {
    amount: amountNum,
    penalty: Math.round(penalty * 100) / 100, // Arredondar para 2 casas decimais
    interest: Math.round(interest * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}
