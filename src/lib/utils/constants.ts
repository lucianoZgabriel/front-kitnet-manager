// Configurações da aplicação
export const APP_NAME = 'Kitnet Manager'
export const APP_VERSION = '1.0.0'

// Configurações de paginação
export const DEFAULT_PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// Configurações de cache (React Query)
export const CACHE_TIMES = {
  dashboard: 1 * 60 * 1000, // 1 minuto
  lists: 5 * 60 * 1000, // 5 minutos
  details: 10 * 60 * 1000, // 10 minutos
  static: 60 * 60 * 1000, // 1 hora
}

// Status das unidades
export const UNIT_STATUS = {
  available: 'Disponível',
  occupied: 'Ocupada',
  maintenance: 'Manutenção',
  renovation: 'Reforma',
} as const

// Status dos contratos
export const LEASE_STATUS = {
  active: 'Ativo',
  ended: 'Encerrado',
  cancelled: 'Cancelado',
} as const

// Status dos pagamentos
export const PAYMENT_STATUS = {
  pending: 'Pendente',
  paid: 'Pago',
  overdue: 'Atrasado',
  cancelled: 'Cancelado',
} as const

// Tipos de pagamento
export const PAYMENT_TYPE = {
  monthly_rent: 'Aluguel',
  painting_fee: 'Taxa de Pintura',
} as const

// Métodos de pagamento
export const PAYMENT_METHODS = [
  { value: 'pix', label: 'PIX' },
  { value: 'cash', label: 'Dinheiro' },
  { value: 'bank_transfer', label: 'Transferência' },
  { value: 'credit_card', label: 'Cartão de Crédito' },
  { value: 'debit_card', label: 'Cartão de Débito' },
]

// Roles de usuários
export const USER_ROLES = {
  admin: 'Administrador',
  manager: 'Gerente',
  viewer: 'Visualizador',
} as const

// Cores para badges de status
export const STATUS_COLORS = {
  available: 'bg-green-100 text-green-800',
  occupied: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  renovation: 'bg-purple-100 text-purple-800',
  active: 'bg-green-100 text-green-800',
  ended: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
}

// Severidade de alertas
export const ALERT_SEVERITY = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
} as const

// Cores para severidade de alertas
export const ALERT_SEVERITY_COLORS = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
}
