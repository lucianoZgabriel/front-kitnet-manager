// Dashboard & Reports Types

export interface OccupancyMetrics {
  total_units: number
  available_units: number
  occupied_units: number
  maintenance_units: number
  renovation_units: number
  occupancy_rate: number
}

export interface FinancialMetrics {
  monthly_projected_revenue: string // decimal as string
  monthly_realized_revenue: string
  overdue_amount: string
  total_pending_amount: string
  default_rate: number
  collection_rate: number
}

export interface ContractMetrics {
  total_active_contracts: number
  contracts_expiring_soon: number
  expired_contracts: number
  cancelled_contracts: number
}

export interface OverduePayment {
  payment_id: string
  unit_number: string
  tenant_name: string
  amount: string
  days_overdue: number
}

export interface ExpiringLease {
  lease_id: string
  unit_number: string
  tenant_name: string
  end_date: string
  days_until_expiry: number
}

export interface VacantUnit {
  unit_id: string
  unit_number: string
  status: string
  days_vacant: number
}

export interface Alerts {
  overdue_payments: OverduePayment[]
  expiring_leases: ExpiringLease[]
  vacant_units: VacantUnit[]
  total_alerts: number
}

export interface DashboardResponse {
  occupancy: OccupancyMetrics
  financial: FinancialMetrics
  contracts: ContractMetrics
  alerts: Alerts
}

export interface FinancialReportRequest {
  start_date: string // YYYY-MM-DD
  end_date: string // YYYY-MM-DD
  payment_type?: PaymentType
  status?: PaymentStatus
}

export interface FinancialReportResponse {
  period: {
    start_date: string
    end_date: string
  }
  summary: {
    total_amount: string
    paid_amount: string
    pending_amount: string
    overdue_amount: string
    payment_count: number
  }
  by_type: {
    [key in PaymentType]: {
      count: number
      total_amount: string
    }
  }
  by_status: {
    [key in PaymentStatus]: {
      count: number
      total_amount: string
    }
  }
  payments: Payment[]
}

export interface PaymentHistoryRequest {
  lease_id?: string
  tenant_id?: string
  status?: PaymentStatus
  start_date?: string // YYYY-MM-DD
  end_date?: string // YYYY-MM-DD
}

export interface PaymentHistoryResponse {
  total_count: number
  payments: Payment[]
}

// Import PaymentType, PaymentStatus, Payment from payment.ts
import type { PaymentType, PaymentStatus, Payment } from './payment'
