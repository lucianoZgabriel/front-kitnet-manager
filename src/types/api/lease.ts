// Lease Types

export type LeaseStatus = 'active' | 'expiring_soon' | 'expired' | 'cancelled'

export interface Lease {
  id: string
  unit_id: string
  tenant_id: string
  contract_signed_date: string // ISO date
  start_date: string // ISO date
  end_date: string // ISO date
  payment_due_day: number // 1-31
  monthly_rent_value: string // decimal as string
  painting_fee_total: string // decimal as string
  painting_fee_installments: number // 1-4
  painting_fee_paid: string // decimal as string
  status: LeaseStatus
  parent_lease_id?: string // ID do contrato anterior (null = contrato original)
  generation: number // Geração do contrato (1=original, 2=1ª renovação, etc)
  total_months: number // Total de meses de locação (generation * 6)
  should_apply_adjustment: boolean // Se deve aplicar reajuste anual
  created_at: string
  updated_at: string
}

export interface CreateLeaseRequest {
  unit_id: string
  tenant_id: string
  contract_signed_date: string // ISO date
  start_date: string // ISO date
  payment_due_day: number // 1-31
  monthly_rent_value: string
  painting_fee_total: string
  painting_fee_installments: number // 1-4
}

export interface RenewLeaseRequest {
  painting_fee_total: string
  painting_fee_installments: number // 1-4
  new_rent_value?: string // Novo valor de aluguel (opcional, para reajuste)
  adjustment_reason?: string // Motivo do reajuste (opcional)
}

export interface UpdatePaintingFeePaidRequest {
  amount_paid: string
}

export interface LeaseStats {
  total: number
  active: number
  expiring_soon: number
  expired: number
  cancelled: number
}

// Change Payment Due Day Types

export interface ChangePaymentDueDayRequest {
  new_payment_due_day: number // 1-31
  effective_date: string // ISO date (YYYY-MM-DD)
  reason?: string
}

export interface ProportionalPaymentInfo {
  id: string
  reference_period: string // "DD/MM/YYYY - DD/MM/YYYY"
  days: number
  amount: number
  due_date: string // ISO date
  status: string
}

export interface UpdatedPaymentInfo {
  id: string
  reference_month: string // ISO date
  old_due_date: string // ISO date
  new_due_date: string // ISO date
}

export interface ChangePaymentDueDayResponse {
  lease_id: string
  old_payment_due_day: number
  new_payment_due_day: number
  effective_date: string // ISO date
  proportional_payment?: ProportionalPaymentInfo
  updated_payments_count: number
  updated_payments: UpdatedPaymentInfo[]
}

// Annual Rent Adjustment Types

export interface LeaseRentAdjustment {
  id: string
  lease_id: string
  previous_rent_value: number
  new_rent_value: number
  adjustment_percentage: number // Percentual de reajuste
  applied_at: string // ISO datetime
  reason?: string // Motivo do reajuste
  applied_by?: string // UUID do usuário que aplicou
  created_at: string // ISO datetime
}
