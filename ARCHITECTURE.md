# Frontend Architecture - Kitnet Manager

Arquitetura detalhada do frontend do Kitnet Manager seguindo as melhores práticas de Next.js 15 com App Router.

---

## Princípios Arquiteturais

### 1. Feature-Based Organization
- Organização por funcionalidade, não por tipo de arquivo
- Cada feature é auto-contida
- Fácil localização e manutenção

### 2. Separation of Concerns
- **Presentation Layer:** Componentes React
- **Business Logic:** Custom hooks e utilities
- **Data Layer:** React Query queries/mutations
- **API Layer:** Axios client e tipos

### 3. DRY (Don't Repeat Yourself)
- Componentes reutilizáveis
- Hooks customizados
- Utilities compartilhadas

### 4. Type Safety First
- TypeScript strict mode
- Zod schemas para validação
- Type inference onde possível

---

## Estrutura de Pastas

```
front-kitnet-manager/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI/CD pipeline
│       └── deploy.yml             # Deploy automático
│
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── images/
│
├── src/
│   ├── app/                       # Next.js 15 App Router
│   │   ├── (auth)/                # Route group - não autenticado
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx         # Layout para rotas de auth
│   │   │
│   │   ├── (dashboard)/           # Route group - autenticado
│   │   │   ├── layout.tsx         # Layout com sidebar/header
│   │   │   ├── page.tsx           # Dashboard home
│   │   │   │
│   │   │   ├── units/             # Gestão de unidades
│   │   │   │   ├── page.tsx       # Lista de unidades
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx   # Criar unidade
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx   # Detalhes/editar
│   │   │   │       └── loading.tsx
│   │   │   │
│   │   │   ├── tenants/           # Gestão de inquilinos
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── leases/            # Gestão de contratos
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── payments/  # Pagamentos do contrato
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── payments/          # Gestão de pagamentos
│   │   │   │   ├── page.tsx
│   │   │   │   ├── overdue/       # Pagamentos atrasados
│   │   │   │   │   └── page.tsx
│   │   │   │   └── upcoming/      # Próximos vencimentos
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── reports/           # Relatórios
│   │   │   │   ├── page.tsx
│   │   │   │   ├── financial/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── payments/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   └── settings/          # Configurações
│   │   │       ├── page.tsx
│   │   │       ├── profile/
│   │   │       │   └── page.tsx
│   │   │       └── users/         # Gestão de usuários (admin)
│   │   │           └── page.tsx
│   │   │
│   │   ├── api/                   # Route Handlers (opcional)
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   │
│   │   ├── layout.tsx             # Root layout
│   │   ├── loading.tsx            # Global loading
│   │   ├── error.tsx              # Global error
│   │   └── not-found.tsx          # 404 page
│   │
│   ├── components/                # Componentes React
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                # Componentes de layout
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── mobile-nav.tsx
│   │   │
│   │   ├── dashboard/             # Componentes do dashboard
│   │   │   ├── stats-card.tsx
│   │   │   ├── occupancy-chart.tsx
│   │   │   ├── revenue-chart.tsx
│   │   │   ├── alerts-list.tsx
│   │   │   └── upcoming-payments.tsx
│   │   │
│   │   ├── units/                 # Componentes de unidades
│   │   │   ├── unit-card.tsx
│   │   │   ├── unit-form.tsx
│   │   │   ├── unit-status-badge.tsx
│   │   │   └── units-table.tsx
│   │   │
│   │   ├── tenants/               # Componentes de inquilinos
│   │   │   ├── tenant-card.tsx
│   │   │   ├── tenant-form.tsx
│   │   │   ├── cpf-input.tsx
│   │   │   └── tenants-table.tsx
│   │   │
│   │   ├── leases/                # Componentes de contratos
│   │   │   ├── lease-card.tsx
│   │   │   ├── lease-form.tsx
│   │   │   ├── lease-status-badge.tsx
│   │   │   ├── renew-lease-dialog.tsx
│   │   │   └── cancel-lease-dialog.tsx
│   │   │
│   │   ├── payments/              # Componentes de pagamentos
│   │   │   ├── payment-card.tsx
│   │   │   ├── payment-status-badge.tsx
│   │   │   ├── pay-payment-dialog.tsx
│   │   │   └── payments-table.tsx
│   │   │
│   │   └── shared/                # Componentes compartilhados
│   │       ├── data-table.tsx     # Tabela genérica com filtros
│   │       ├── search-input.tsx
│   │       ├── date-picker.tsx
│   │       ├── currency-input.tsx
│   │       ├── loading-spinner.tsx
│   │       ├── empty-state.tsx
│   │       ├── error-message.tsx
│   │       └── confirm-dialog.tsx
│   │
│   ├── lib/                       # Core utilities e configurações
│   │   ├── api/                   # API client
│   │   │   ├── client.ts          # Axios instance configurado
│   │   │   ├── interceptors.ts    # Auth/error interceptors
│   │   │   └── endpoints.ts       # Constantes de endpoints
│   │   │
│   │   ├── queries/               # React Query hooks
│   │   │   ├── auth.ts            # useLogin, useLogout, useCurrentUser
│   │   │   ├── units.ts           # useUnits, useUnit, useCreateUnit, etc
│   │   │   ├── tenants.ts         # useTenants, useTenant, etc
│   │   │   ├── leases.ts          # useLeases, useLease, useRenewLease, etc
│   │   │   ├── payments.ts        # usePayments, usePayPayment, etc
│   │   │   ├── dashboard.ts       # useDashboard
│   │   │   ├── reports.ts         # useFinancialReport, etc
│   │   │   └── query-client.ts    # Query client config
│   │   │
│   │   ├── stores/                # Zustand stores
│   │   │   ├── auth-store.ts      # Auth state
│   │   │   ├── ui-store.ts        # UI state (sidebar, theme)
│   │   │   └── filters-store.ts   # Filtros persistentes
│   │   │
│   │   ├── utils/                 # Utility functions
│   │   │   ├── cn.ts              # clsx + tailwind-merge
│   │   │   ├── format.ts          # Formatação (datas, moeda, CPF)
│   │   │   ├── validation.ts      # Validações (CPF, etc)
│   │   │   ├── calculations.ts    # Cálculos (multas, juros)
│   │   │   └── constants.ts       # Constantes
│   │   │
│   │   └── hooks/                 # Custom hooks
│   │       ├── use-debounce.ts
│   │       ├── use-media-query.ts
│   │       ├── use-local-storage.ts
│   │       └── use-toast.ts
│   │
│   ├── types/                     # TypeScript types
│   │   ├── api/                   # Types da API (copiados de frontend-docs)
│   │   │   ├── auth.ts
│   │   │   ├── unit.ts
│   │   │   ├── tenant.ts
│   │   │   ├── lease.ts
│   │   │   ├── payment.ts
│   │   │   └── dashboard.ts
│   │   │
│   │   ├── forms.ts               # Types de formulários
│   │   └── ui.ts                  # Types de UI
│   │
│   ├── schemas/                   # Zod schemas
│   │   ├── auth.ts                # Login, register schemas
│   │   ├── unit.ts                # Unit form schemas
│   │   ├── tenant.ts              # Tenant form schemas
│   │   ├── lease.ts               # Lease form schemas
│   │   └── payment.ts             # Payment form schemas
│   │
│   ├── config/                    # Configurações
│   │   ├── env.ts                 # Validação de env vars
│   │   ├── site.ts                # Metadados do site
│   │   └── navigation.ts          # Navegação/rotas
│   │
│   └── styles/
│       └── globals.css            # Global styles + Tailwind
│
├── .env.local                     # Environment variables (local)
├── .env.example                   # Template de env vars
├── .eslintrc.json                 # ESLint config
├── .prettierrc                    # Prettier config
├── tailwind.config.ts             # Tailwind config
├── tsconfig.json                  # TypeScript config
├── next.config.js                 # Next.js config
├── package.json
├── components.json                # shadcn/ui config
└── README.md
```

---

## Camadas da Aplicação

### 1. Presentation Layer (Components)
**Responsabilidade:** UI e interação com usuário

```typescript
// components/units/unit-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { unitSchema } from '@/schemas/unit'
import { useCreateUnit } from '@/lib/queries/units'

export function UnitForm() {
  const { mutate: createUnit } = useCreateUnit()
  const form = useForm({
    resolver: zodResolver(unitSchema)
  })

  const onSubmit = (data) => {
    createUnit(data)
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

### 2. Data Layer (React Query)
**Responsabilidade:** Fetching, caching, mutations

```typescript
// lib/queries/units.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import type { Unit, CreateUnitRequest } from '@/types/api/unit'

export function useUnits(filters?: UnitFilters) {
  return useQuery({
    queryKey: ['units', filters],
    queryFn: () => api.get<Unit[]>('/units', { params: filters }),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export function useCreateUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUnitRequest) => api.post('/units', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] })
    }
  })
}
```

### 3. API Layer (Axios)
**Responsabilidade:** Comunicação HTTP

```typescript
// lib/api/client.ts
import axios from 'axios'
import { getAuthToken, clearAuth } from '@/lib/stores/auth-store'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - adiciona token
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - trata erros
api.interceptors.response.use(
  (response) => response.data.data, // retorna só o data
  (error) => {
    if (error.response?.status === 401) {
      clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)
```

### 4. State Layer (Zustand)
**Responsabilidade:** Estado global de UI e auth

```typescript
// lib/stores/auth-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/api/auth'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null })
    }),
    {
      name: 'auth-storage'
    }
  )
)

// Helpers para usar fora de componentes
export const getAuthToken = () => useAuthStore.getState().token
export const clearAuth = () => useAuthStore.getState().clearAuth()
```

---

## Patterns e Convenções

### Naming Conventions

```typescript
// Components: PascalCase
export function UnitCard() {}

// Files: kebab-case
// unit-card.tsx, use-units.ts, auth-store.ts

// Types/Interfaces: PascalCase
interface UnitFormProps {}
type UnitStatus = 'available' | 'occupied'

// Constants: UPPER_SNAKE_CASE
const MAX_UNITS = 31
const API_TIMEOUT = 30000

// Functions: camelCase
function calculateLateFee() {}

// React Query keys: array notation
['units', { status: 'available' }]
['lease', leaseId]
```

### File Organization

```typescript
// Ordem preferida dentro de um arquivo:

// 1. Imports
import { useState } from 'react'
import type { Unit } from '@/types/api/unit'

// 2. Types/Interfaces
interface Props {
  unit: Unit
}

// 3. Constants
const STATUSES = ['available', 'occupied']

// 4. Component
export function UnitCard({ unit }: Props) {
  // 4.1. Hooks
  const [isOpen, setIsOpen] = useState(false)
  const { mutate } = useUpdateUnit()

  // 4.2. Derivações
  const statusColor = getStatusColor(unit.status)

  // 4.3. Handlers
  const handleUpdate = () => {
    mutate(unit.id)
  }

  // 4.4. Effects
  useEffect(() => {}, [])

  // 4.5. Render
  return <div>...</div>
}

// 5. Helper functions (fora do componente)
function getStatusColor(status: string) {
  return status === 'available' ? 'green' : 'red'
}
```

### Server vs Client Components

```typescript
// Server Component (padrão)
// ✅ Bom para: Data fetching inicial, layouts, páginas estáticas
// app/units/page.tsx
export default async function UnitsPage() {
  // Pode fazer fetch direto aqui se quiser SSR
  return <UnitsContent />
}

// Client Component
// ✅ Bom para: Interatividade, hooks, event handlers
// components/units/units-table.tsx
'use client'

export function UnitsTable() {
  const { data: units } = useUnits()
  const [selected, setSelected] = useState<string[]>([])

  return <Table data={units} />
}
```

### Error Handling

```typescript
// Component level
function UnitsList() {
  const { data, error, isLoading } = useUnits()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!data?.length) return <EmptyState />

  return <UnitsTable data={data} />
}

// Form level
async function onSubmit(data: FormData) {
  try {
    await createUnit(data)
    toast.success('Unidade criada com sucesso!')
    router.push('/units')
  } catch (error) {
    toast.error(error.message || 'Erro ao criar unidade')
  }
}
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                        User Action                       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Component (Presentation Layer)              │
│  - Captura input                                         │
│  - Valida com React Hook Form + Zod                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│               React Query (Data Layer)                   │
│  - useMutation hook                                      │
│  - Optimistic updates (opcional)                         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                Axios Client (API Layer)                  │
│  - Adiciona Bearer token (interceptor)                   │
│  - Faz POST/PUT/DELETE request                           │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend API                           │
│  - Valida request                                        │
│  - Executa business logic                                │
│  - Retorna response                                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Axios Interceptor (Response)                │
│  - Trata erros (401 → logout)                            │
│  - Extrai data do response                               │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   React Query                            │
│  - Atualiza cache                                        │
│  - Invalida queries relacionadas                         │
│  - Trigger re-render                                     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Component                             │
│  - Recebe dados atualizados                              │
│  - Mostra toast de sucesso                               │
│  - Redireciona se necessário                             │
└─────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
Login Page
   │
   ├─ User submits credentials
   │
   ▼
useLogin mutation (React Query)
   │
   ├─ POST /auth/login (Axios)
   │
   ▼
Backend validates
   │
   ├─ Returns { user, token }
   │
   ▼
authStore.setAuth(user, token)
   │
   ├─ Persisted to localStorage
   │
   ▼
Redirect to /dashboard
   │
   ▼
Protected routes check authStore.token
   │
   ├─ If no token → redirect to /login
   ├─ If token exists → allow access
   │
   ▼
Axios interceptor adds token to all requests
   │
   ▼
If 401 error → clearAuth() + redirect to /login
```

---

## Performance Optimizations

### 1. Code Splitting
```typescript
// Dynamic imports para componentes pesados
const ExpensiveChart = dynamic(() => import('@/components/charts/revenue-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false // se não precisa SSR
})
```

### 2. Memoization
```typescript
// useMemo para cálculos pesados
const totalRevenue = useMemo(() => {
  return payments.reduce((sum, p) => sum + parseFloat(p.amount), 0)
}, [payments])

// useCallback para funções passadas como props
const handleDelete = useCallback((id: string) => {
  deleteUnit(id)
}, [deleteUnit])
```

### 3. Virtual Scrolling
```typescript
// Para listas muito grandes
import { useVirtualizer } from '@tanstack/react-virtual'

function LargeList({ items }) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50
  })
  // ...
}
```

### 4. Image Optimization
```typescript
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={50}
  priority // para above-the-fold images
/>
```

---

## Security Considerations

### 1. Token Storage
```typescript
// ✅ Usar Zustand com persist (localStorage)
// ❌ Não usar cookies sem httpOnly
// ℹ️ Para máxima segurança: usar httpOnly cookies + servidor

// Limpar token ao detectar 401
if (error.response?.status === 401) {
  clearAuth()
  router.push('/login')
}
```

### 2. Input Sanitization
```typescript
// Zod já valida, mas para campos text/textarea:
import DOMPurify from 'isomorphic-dompurify'

const sanitized = DOMPurify.sanitize(userInput)
```

### 3. CSRF Protection
```typescript
// Next.js Server Actions têm CSRF protection built-in
// Para API routes externos, usar tokens CSRF se necessário
```

---

## Testing Strategy

### 1. Unit Tests (Vitest)
```typescript
// lib/utils/format.test.ts
import { formatCurrency, formatCPF } from './format'

describe('formatCurrency', () => {
  it('formats BRL currency correctly', () => {
    expect(formatCurrency('1000.50')).toBe('R$ 1.000,50')
  })
})
```

### 2. Component Tests (Testing Library)
```typescript
// components/units/unit-card.test.tsx
import { render, screen } from '@testing-library/react'
import { UnitCard } from './unit-card'

test('renders unit number', () => {
  render(<UnitCard unit={mockUnit} />)
  expect(screen.getByText('Unidade 101')).toBeInTheDocument()
})
```

### 3. E2E Tests (Playwright)
```typescript
// e2e/lease-creation.spec.ts
test('create new lease', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name=username]', 'admin')
  await page.fill('[name=password]', 'admin123')
  await page.click('[type=submit]')

  await page.goto('/leases/new')
  // ... preencher form
  await page.click('button:has-text("Criar Contrato")')

  await expect(page).toHaveURL(/\/leases\/\w+/)
})
```

---

## Deployment Architecture

```
GitHub Repository
   │
   ├─ Push to branch
   │
   ▼
GitHub Actions (CI)
   │
   ├─ Run linter
   ├─ Run type check
   ├─ Run tests
   │
   ▼
Vercel (CD)
   │
   ├─ Build Next.js app
   ├─ Deploy to edge
   │
   ▼
Production URL
   │
   ├─ main → kitnet-manager.vercel.app
   ├─ develop → kitnet-manager-staging.vercel.app
   └─ PR → preview-xxx.vercel.app
```

---

## Conclusão

Esta arquitetura fornece:

✅ **Escalabilidade:** Fácil adicionar novas features
✅ **Manutenibilidade:** Código organizado e testável
✅ **Performance:** Otimizações automáticas do Next.js
✅ **Type Safety:** TypeScript + Zod em toda aplicação
✅ **Developer Experience:** Hot reload, DevTools, autocomplete
✅ **Best Practices:** Patterns modernos do ecossistema React

---

**Última atualização:** 2025-01-15
**Versão:** 1.0.0
