# Development Roadmap - Kitnet Manager Frontend

Roadmap completo para desenvolvimento do frontend do Kitnet Manager, organizado em sprints de 1 semana cada.

---

## Overview

**Objetivo:** Desenvolver frontend completo integrado com API em produção
**Duração estimada:** 8-10 semanas
**Metodologia:** Sprints semanais com entregas incrementais
**Deploy:** Continuous deployment via Vercel (preview + production)

---

## Sprint 0: Setup & Foundation (Semana 1) ✅

### Objetivos
- Inicializar projeto Next.js 15
- Configurar tooling completo
- Setup CI/CD
- Componentes base do shadcn/ui

### Tarefas

#### Setup Inicial
- [x] Criar projeto Next.js 15 com TypeScript
- [x] Configurar estrutura de pastas conforme ARCHITECTURE.md
- [x] Copiar types de `frontend-docs/types/` para `src/types/api/`
- [x] Setup ESLint + Prettier + Husky
- [x] Configurar `tsconfig.json` com path aliases

#### shadcn/ui
- [x] Inicializar shadcn/ui
- [x] Adicionar componentes base:
  - Button, Input, Label, Textarea
  - Card, Badge, Alert
  - Dialog, Sheet, Dropdown Menu
  - Table, Checkbox, RadioGroup
  - Toast, Tooltip
  - Form, Select

#### Core Setup
- [x] Configurar TailwindCSS com tema customizado
- [x] Setup axios client (`lib/api/client.ts`)
- [x] Setup React Query (`lib/queries/query-client.ts`)
- [x] Setup Zustand stores (auth, ui)
- [x] Criar utilities base (cn, format, validation)
- [x] Configurar environment variables

#### Layout Base
- [x] Root layout com providers
- [x] Loading e error boundaries globais
- [x] Página 404

#### CI/CD
- [x] Setup GitHub Actions (lint + type-check + build)
- [x] Conectar repositório com Vercel
- [x] Configurar environment variables na Vercel

### Entregáveis
✅ Projeto inicializado e rodando em `localhost:3000`
✅ CI/CD funcionando com preview deploys
✅ Componentes shadcn/ui prontos para uso
✅ Estrutura base completa

**Concluído em:** 11/01/2025
**Commit:** 0176b33

---

## Sprint 1: Authentication & Layout (Semana 2) 🚧

### Objetivos
- Sistema de autenticação completo
- Layout principal com sidebar/header
- Proteção de rotas

### Tarefas

#### Authentication
- [x] Implementar auth store (Zustand + persist)
- [x] Configurar axios interceptors (token + 401 handling)
- [x] Criar auth service com todos os endpoints
- [x] Criar AuthContext e useAuth hook
- [x] Integrar providers no layout principal
- [x] Criar página de login (`app/(auth)/login/page.tsx`)
- [x] Implementar LoginForm com React Hook Form + Zod
- [x] Implementar logout funcional
- [x] Dashboard temporário para testes
- [x] Corrigir encoding UTF-8 e redirect issues

#### Layout Principal
- [ ] Criar layout group `(dashboard)`
- [ ] Implementar Header component
  - Logo + título
  - User dropdown (perfil + logout)
  - Breadcrumbs
- [ ] Implementar Sidebar component
  - Navegação principal
  - Indicador de rota ativa
  - Versão mobile (Sheet)
- [ ] Criar MobileNav component
- [ ] Implementar toggle de sidebar (Zustand)

#### Proteção de Rotas
- [ ] Middleware para verificar auth
- [ ] Redirect para /login se não autenticado
- [ ] Redirect para /dashboard se já autenticado (na página de login)

#### Componentes Compartilhados
- [ ] LoadingSpinner
- [ ] EmptyState
- [ ] ErrorMessage
- [ ] ConfirmDialog

### Entregáveis
✅ Auth Store e API Client implementados
✅ AuthContext e useAuth hook criados
⏳ Login funcional com JWT
⏳ Layout principal responsivo
⏳ Navegação entre páginas
⏳ Proteção de rotas implementada

**Em progresso desde:** 11/01/2025
**Branch:** feature/sprint1-authentication
**Último commit:** 09886ad

---

## Sprint 2: Dashboard & Units (Semana 3)

### Objetivos
- Dashboard home com métricas
- CRUD completo de Unidades

### Tarefas

#### Dashboard
- [ ] Criar `useDashboard` query
- [ ] Página dashboard (`app/(dashboard)/page.tsx`)
- [ ] StatsCard component (ocupação, receita, pendentes)
- [ ] AlertsList component com badges de severidade
- [ ] UpcomingPayments component (próximos 7 dias)
- [ ] Gráfico de ocupação (opcional: recharts ou tremor)

#### Units - Listagem
- [ ] Criar `useUnits` query com filtros
- [ ] Página de listagem (`app/(dashboard)/units/page.tsx`)
- [ ] UnitsTable component com:
  - Paginação
  - Filtro por status
  - Busca por número
  - Ordenação
- [ ] UnitCard component (view alternativa)
- [ ] UnitStatusBadge component

#### Units - Criação
- [ ] Schema Zod para unit form
- [ ] Criar `useCreateUnit` mutation
- [ ] Página de criação (`app/(dashboard)/units/new/page.tsx`)
- [ ] UnitForm component
- [ ] Toast de sucesso/erro
- [ ] Redirect após criação

#### Units - Detalhes/Edição
- [ ] Criar `useUnit` query (by ID)
- [ ] Criar `useUpdateUnit` mutation
- [ ] Criar `useDeleteUnit` mutation
- [ ] Página de detalhes (`app/(dashboard)/units/[id]/page.tsx`)
- [ ] Modo edição inline
- [ ] Botão de delete com confirmação
- [ ] Mostrar contrato ativo (se houver)

#### Units - Estatísticas
- [ ] Criar `useOccupancyStats` query
- [ ] Página de estatísticas (ou seção na listagem)
- [ ] Gráfico de ocupação por andar

### Entregáveis
✅ Dashboard funcional com métricas reais
✅ CRUD completo de unidades
✅ Filtros e busca funcionando
✅ UI responsiva e polida

---

## Sprint 3: Tenants (Semana 4)

### Objetivos
- CRUD completo de Inquilinos
- Validação de CPF
- Busca por CPF

### Tarefas

#### Tenants - Listagem
- [ ] Criar `useTenants` query com busca
- [ ] Página de listagem (`app/(dashboard)/tenants/page.tsx`)
- [ ] TenantsTable component
- [ ] Busca por nome ou CPF
- [ ] TenantCard component

#### Tenants - Criação
- [ ] Schema Zod para tenant form (validação CPF)
- [ ] Criar `useCreateTenant` mutation
- [ ] Página de criação (`app/(dashboard)/tenants/new/page.tsx`)
- [ ] TenantForm component
- [ ] CPFInput component com máscara
- [ ] Validação de CPF único (error handling)

#### Tenants - Detalhes/Edição
- [ ] Criar `useTenant` query (by ID)
- [ ] Criar `useTenantByCPF` query
- [ ] Criar `useUpdateTenant` mutation
- [ ] Criar `useDeleteTenant` mutation
- [ ] Página de detalhes (`app/(dashboard)/tenants/[id]/page.tsx`)
- [ ] Mostrar histórico de contratos
- [ ] Mostrar contrato ativo (se houver)

#### Utilities
- [ ] Função `formatCPF` (XXX.XXX.XXX-XX)
- [ ] Função `validateCPF` (regex + dígitos)
- [ ] Máscara de telefone

### Entregáveis
✅ CRUD completo de inquilinos
✅ Validação de CPF funcionando
✅ Busca por nome/CPF
✅ Histórico de contratos visível

---

## Sprint 4: Leases (Semana 5)

### Objetivos
- CRUD de Contratos
- Criação com geração automática de pagamentos
- Renovação de contratos
- Cancelamento de contratos

### Tarefas

#### Leases - Listagem
- [ ] Criar `useLeases` query com filtros
- [ ] Página de listagem (`app/(dashboard)/leases/page.tsx`)
- [ ] LeasesTable component
- [ ] Filtros: status, unidade, inquilino
- [ ] LeaseStatusBadge component
- [ ] Indicador de contratos expirando (45 dias)

#### Leases - Criação
- [ ] Schema Zod para lease form
- [ ] Criar `useCreateLease` mutation
- [ ] Página de criação (`app/(dashboard)/leases/new/page.tsx`)
- [ ] LeaseForm component com:
  - Select de unidade (apenas available)
  - Select de inquilino (ou criar novo inline)
  - Data de assinatura e início
  - Valor do aluguel
  - Taxa de pintura + parcelamento
  - Dia de vencimento
- [ ] Validações de negócio (unidade disponível, etc)
- [ ] Toast mostrando quantos pagamentos foram gerados

#### Leases - Detalhes
- [ ] Criar `useLease` query (by ID)
- [ ] Página de detalhes (`app/(dashboard)/leases/[id]/page.tsx`)
- [ ] Mostrar informações do contrato
- [ ] Mostrar unidade e inquilino
- [ ] Timeline de pagamentos
- [ ] Botões de ação (renovar, cancelar)

#### Leases - Renovação
- [ ] Criar `useRenewLease` mutation
- [ ] Criar `useLeasesExpiringSoon` query
- [ ] RenewLeaseDialog component
- [ ] Validação: apenas contratos ativos próximos ao fim
- [ ] Mostrar preview do novo contrato

#### Leases - Cancelamento
- [ ] Criar `useCancelLease` mutation
- [ ] CancelLeaseDialog component com confirmação
- [ ] Validação: apenas contratos ativos
- [ ] Atualizar status da unidade

#### Leases - Estatísticas
- [ ] Criar `useLeaseStats` query
- [ ] Página ou seção de estatísticas
- [ ] Contratos ativos vs encerrados
- [ ] Taxa de renovação

### Entregáveis
✅ CRUD completo de contratos
✅ Criação com seleção de unidade/inquilino
✅ Renovação funcionando
✅ Cancelamento com validações
✅ Dashboard de contratos expirando

---

## Sprint 5: Payments (Semana 6)

### Objetivos
- Visualização de pagamentos
- Marcar pagamentos como pagos
- Pagamentos atrasados e próximos vencimentos
- Cálculo de multas

### Tarefas

#### Payments - Por Contrato
- [ ] Criar `useLeasePayments` query
- [ ] Página de pagamentos (`app/(dashboard)/leases/[id]/payments/page.tsx`)
- [ ] PaymentsTable component
- [ ] PaymentStatusBadge component
- [ ] Filtros: status, tipo, período

#### Payments - Marcar como Pago
- [ ] Criar `usePayPayment` mutation
- [ ] PayPaymentDialog component
- [ ] Campos: data de pagamento, método
- [ ] Auto-preencher data atual
- [ ] Mostrar valor original vs com multa

#### Payments - Atrasados
- [ ] Criar `useOverduePayments` query
- [ ] Página de atrasados (`app/(dashboard)/payments/overdue/page.tsx`)
- [ ] Destacar dias de atraso
- [ ] Mostrar valor da multa calculada
- [ ] Botão rápido para marcar como pago

#### Payments - Próximos Vencimentos
- [ ] Criar `useUpcomingPayments` query
- [ ] Página de upcoming (`app/(dashboard)/payments/upcoming/page.tsx`)
- [ ] Filtro por dias (7, 15, 30)
- [ ] Ordenar por data de vencimento
- [ ] Agrupar por semana/mês

#### Payments - Estatísticas
- [ ] Criar `usePaymentStats` query (por lease)
- [ ] Componente de estatísticas do contrato
- [ ] Pagamentos em dia vs atrasados
- [ ] Total pago vs total esperado

#### Utilities
- [ ] Função `calculateLateFee` (2% + 1%/mês pro-rata)
- [ ] Função `formatCurrency` (R$ 1.000,00)
- [ ] CurrencyInput component com máscara

### Entregáveis
✅ Visualização completa de pagamentos
✅ Marcar como pago funcionando
✅ Dashboard de atrasados
✅ Dashboard de próximos vencimentos
✅ Cálculo de multas correto

---

## Sprint 6: Reports & Advanced Features (Semana 7)

### Objetivos
- Relatórios financeiros
- Relatórios de pagamentos
- Filtros avançados
- Exportação (futuro)

### Tarefas

#### Reports - Financial
- [ ] Criar `useFinancialReport` query
- [ ] Página de relatório (`app/(dashboard)/reports/financial/page.tsx`)
- [ ] Filtros de período (date range picker)
- [ ] Filtros de tipo e status
- [ ] Tabela de resultados
- [ ] Totalizadores

#### Reports - Payments
- [ ] Criar `usePaymentsReport` query
- [ ] Página de relatório (`app/(dashboard)/reports/payments/page.tsx`)
- [ ] Filtros avançados
- [ ] Visualização por contrato
- [ ] Totalizadores por método de pagamento

#### Components
- [ ] DateRangePicker component (shadcn calendar)
- [ ] DataTable genérica com filtros
- [ ] ExportButton (preparar para futuro)

#### Dashboard - Melhorias
- [ ] Adicionar gráfico de receita mensal (recharts/tremor)
- [ ] Gráfico de inadimplência
- [ ] Top unidades por receita

### Entregáveis
✅ Relatórios financeiros completos
✅ Filtros avançados funcionando
✅ Visualizações gráficas
✅ Dashboard enriquecido

---

## Sprint 7: Settings & User Management (Semana 8)

### Objetivos
- Gestão de usuários (admin only)
- Perfil do usuário
- Troca de senha
- Configurações da aplicação

### Tarefas

#### Settings - Profile
- [ ] Criar `useChangePassword` mutation
- [ ] Página de perfil (`app/(dashboard)/settings/profile/page.tsx`)
- [ ] Formulário de troca de senha
- [ ] Exibir informações do usuário atual

#### Settings - Users (Admin Only)
- [ ] Criar `useUsers` query
- [ ] Criar `useCreateUser` mutation
- [ ] Criar `useUpdateUserRole` mutation
- [ ] Criar `useDeactivateUser` mutation
- [ ] Página de usuários (`app/(dashboard)/settings/users/page.tsx`)
- [ ] UsersTable component
- [ ] CreateUserDialog
- [ ] ChangeRoleDialog
- [ ] Verificação de role (apenas admin vê)

#### Settings - General
- [ ] Página de configurações (`app/(dashboard)/settings/page.tsx`)
- [ ] Toggle de tema (light/dark) - opcional
- [ ] Preferências de notificação (preparar para futuro)

### Entregáveis
✅ Gestão de usuários completa
✅ Troca de senha funcionando
✅ Role-based access control implementado
✅ Página de configurações

---

## Sprint 8: Polish & Testing (Semana 9)

### Objetivos
- Refinamento de UI/UX
- Responsividade mobile
- Testes
- Otimizações de performance

### Tarefas

#### UI/UX Polish
- [ ] Revisar todas as páginas para consistência
- [ ] Melhorar mensagens de erro
- [ ] Adicionar skeletons/loading states
- [ ] Melhorar empty states
- [ ] Adicionar animações suaves (framer-motion - opcional)
- [ ] Revisar acessibilidade (keyboard navigation)

#### Responsividade
- [ ] Testar todas as páginas em mobile
- [ ] Ajustar tabelas para mobile (cards view)
- [ ] Otimizar sidebar para mobile
- [ ] Testar em tablet

#### Performance
- [ ] Analisar bundle size (`@next/bundle-analyzer`)
- [ ] Implementar lazy loading onde necessário
- [ ] Otimizar imagens
- [ ] Revisar React Query cache times
- [ ] Adicionar `React.memo` onde apropriado

#### Testing
- [ ] Setup Vitest
- [ ] Testes unitários para utilities
  - formatCPF, validateCPF
  - formatCurrency
  - calculateLateFee
- [ ] Setup Testing Library
- [ ] Testes de componentes críticos
  - LoginForm
  - UnitForm
  - LeaseForm
- [ ] Setup Playwright
- [ ] Testes E2E para fluxos críticos
  - Login/logout
  - Criar contrato completo
  - Processar pagamento

#### Documentation
- [ ] Atualizar README.md
- [ ] Documentar componentes principais
- [ ] Criar CONTRIBUTING.md
- [ ] Adicionar comentários JSDoc em funções complexas

### Entregáveis
✅ UI polida e consistente
✅ App totalmente responsivo
✅ Testes básicos implementados
✅ Performance otimizada
✅ Documentação atualizada

---

## Sprint 9: Production Ready (Semana 10)

### Objetivos
- Preparação para produção
- Deploy final
- Monitoramento
- Documentação de usuário

### Tarefas

#### Production Checklist
- [ ] Configurar variáveis de ambiente de produção
- [ ] Configurar domínio customizado (opcional)
- [ ] Setup error tracking (Sentry - opcional)
- [ ] Setup analytics (Vercel Analytics)
- [ ] Configurar Web Vitals
- [ ] Testar performance com Lighthouse
- [ ] Security audit

#### Deployment
- [ ] Deploy final para produção
- [ ] Smoke tests em produção
- [ ] Configurar monitoring/alertas
- [ ] Backup plan (rollback strategy)

#### Documentation
- [ ] Manual do usuário (PDF ou wiki)
- [ ] Video tutorial (opcional)
- [ ] FAQ
- [ ] Troubleshooting guide

#### Training
- [ ] Treinamento para admin
- [ ] Treinamento para managers
- [ ] Documentar workflows principais

### Entregáveis
✅ Aplicação em produção
✅ Monitoring configurado
✅ Documentação de usuário completa
✅ Usuários treinados

---

## Backlog (Futuro)

### Features Planejadas
- [ ] **Notificações SMS** (Twilio)
  - Lembrete de vencimento
  - Alerta de atraso
  - Confirmação de pagamento

- [ ] **Exportação de Relatórios**
  - PDF (jsPDF)
  - Excel (xlsx)
  - CSV

- [ ] **Geração de Contratos em PDF**
  - Template de contrato
  - Assinatura digital
  - Envio por email

- [ ] **Dashboard Avançado**
  - Mais gráficos e métricas
  - Período customizável
  - Comparação YoY

- [ ] **Bulk Operations**
  - Marcar múltiplos pagamentos como pagos
  - Atualização em massa

- [ ] **Histórico de Alterações**
  - Audit log
  - Quem fez o quê e quando

- [ ] **Notificações In-App**
  - Toast notifications em tempo real
  - Centro de notificações

- [ ] **Tema Dark Mode**
  - Toggle light/dark
  - Persistência de preferência

- [ ] **Multi-tenancy** (se expandir)
  - Múltiplos complexos
  - Dados isolados

---

## Métricas de Sucesso

### Performance
- **Lighthouse Score:** > 90 (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Bundle Size:** < 300KB (gzipped)

### Qualidade
- **Test Coverage:** > 70%
- **Type Coverage:** 100% (TypeScript strict)
- **Zero** ESLint errors
- **Zero** console errors em produção

### UX
- **Mobile Responsivo:** 100% das páginas
- **Acessibilidade:** WCAG AA compliance
- **Loading States:** Todas as ações assíncronas
- **Error Handling:** Mensagens claras em todos os fluxos

---

## Timeline Visual

```
Semana 1: [████████████████████████] Setup & Foundation
Semana 2: [████████████████████████] Auth & Layout
Semana 3: [████████████████████████] Dashboard & Units
Semana 4: [████████████████████████] Tenants
Semana 5: [████████████████████████] Leases
Semana 6: [████████████████████████] Payments
Semana 7: [████████████████████████] Reports & Advanced
Semana 8: [████████████████████████] Settings & Users
Semana 9: [████████████████████████] Polish & Testing
Semana 10: [████████████████████████] Production Ready

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         MVP Core Features  │  Advanced  │  Launch
```

---

## Dependências Entre Sprints

```
Sprint 0 (Setup)
   │
   ▼
Sprint 1 (Auth) ────┐
   │                │
   ▼                │
Sprint 2 (Dashboard + Units) ────┐
   │                              │
   ▼                              │
Sprint 3 (Tenants) ────────┐     │
   │                        │     │
   ▼                        │     │
Sprint 4 (Leases) ─────────┤     │
   │                        │     │
   ▼                        │     │
Sprint 5 (Payments) ────────┤     │
   │                        │     │
   ▼                        ▼     ▼
Sprint 6 (Reports) ────> Sprint 7 (Settings)
   │                        │
   ▼                        ▼
Sprint 8 (Polish) ──────────┤
   │                        │
   ▼                        ▼
Sprint 9 (Production)
```

---

## Próximos Passos

1. **Revisar e aprovar roadmap**
2. **Criar repositório Git**
3. **Iniciar Sprint 0**
4. **Setup daily standups** (se trabalho em equipe)
5. **Configurar board no GitHub Projects** (ou Trello/Jira)

---

**Criado em:** 2025-01-15
**Versão:** 1.0.0
**Estimativa total:** 8-10 semanas (pode variar conforme disponibilidade)
