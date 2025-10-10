/**
 * Valida CPF no formato XXX.XXX.XXX-XX
 * @param cpf - CPF a ser validado
 * @returns true se válido, false caso contrário
 */
export function validateCPF(cpf: string): boolean {
  // Verifica formato com regex
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
  if (!cpfRegex.test(cpf)) return false

  // Remove pontos e hífen
  const digits = cpf.replace(/[.\-]/g, '')

  // Verifica se tem 11 dígitos
  if (digits.length !== 11) return false

  // Verifica se todos os dígitos são iguais (caso inválido)
  if (/^(\d)\1{10}$/.test(digits)) return false

  return true
}

/**
 * Valida telefone brasileiro
 * @param phone - Telefone a ser validado
 * @returns true se válido, false caso contrário
 */
export function validatePhone(phone: string): boolean {
  const numbers = phone.replace(/\D/g, '')
  return numbers.length === 10 || numbers.length === 11
}

/**
 * Valida se valor monetário é válido
 * @param value - Valor a ser validado
 * @returns true se válido, false caso contrário
 */
export function validateCurrency(value: string): boolean {
  const num = parseFloat(value)
  return !isNaN(num) && num >= 0
}
