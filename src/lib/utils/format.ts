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
 * @returns Data formatada como "DD/MM/YYYY"
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateFnsFormat(dateObj, 'dd/MM/yyyy', { locale: ptBR })
}

/**
 * Formata data ISO para formato brasileiro com hora DD/MM/YYYY HH:mm
 * @param date - Data em formato ISO ou Date object
 * @returns Data formatada como "DD/MM/YYYY HH:mm"
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateFnsFormat(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

/**
 * Formata data para formato ISO YYYY-MM-DD (para enviar à API)
 * @param date - Date object
 * @returns Data formatada como "YYYY-MM-DD"
 */
export function formatDateISO(date: Date): string {
  return dateFnsFormat(date, 'yyyy-MM-dd')
}
