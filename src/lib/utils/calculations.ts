/**
 * Calcula multa por atraso de pagamento
 * Regra: 2% de multa fixa + 1% de juros ao mês (pro-rata diário)
 * @param amount - Valor original do pagamento
 * @param daysOverdue - Dias de atraso
 * @returns Objeto com penalty, interest e total
 */
export function calculateLateFee(amount: number, daysOverdue: number) {
  const penalty = amount * 0.02 // 2% fixo
  const monthlyInterest = amount * 0.01 // 1% ao mês
  const dailyInterest = monthlyInterest / 30
  const interest = dailyInterest * daysOverdue

  return {
    penalty: parseFloat(penalty.toFixed(2)),
    interest: parseFloat(interest.toFixed(2)),
    total: parseFloat((penalty + interest).toFixed(2)),
  }
}

/**
 * Calcula valor total com multa
 * @param amount - Valor original
 * @param daysOverdue - Dias de atraso
 * @returns Valor total com multa
 */
export function calculateTotalWithLateFee(amount: number, daysOverdue: number): number {
  if (daysOverdue <= 0) return amount

  const { total } = calculateLateFee(amount, daysOverdue)
  return parseFloat((amount + total).toFixed(2))
}
