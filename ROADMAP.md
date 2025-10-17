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

## Sprint 1: Authentication & Layout (Semana 2) ✅

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
- [x] Criar layout group `(dashboard)`
- [x] Implementar Header component
  - Logo + título
  - User dropdown (perfil + logout)
  - Toggle de menu (mobile e desktop)
- [x] Implementar Sidebar component
  - Navegação principal
  - Indicador de rota ativa
  - Collapsible (80px ↔ 256px)
- [x] Criar MobileSidebar component
  - Sheet drawer deslizante
  - Navegação completa para mobile
  - Auto-close ao navegar
- [x] Implementar toggle de sidebar (Zustand)

#### Proteção de Rotas
- [x] Layout-level auth protection (redirect para /login se não autenticado)
- [x] Redirect para /dashboard se já autenticado (na página de login)
- [ ] Middleware para verificar auth (opcional - proteção adicional)

#### Componentes Compartilhados
- [x] LoadingSpinner (com LoadingPage variant)
- [x] EmptyState (com ícone, ação e descrição)
- [x] ErrorMessage (com ErrorPage variant e retry)
- [x] ConfirmDialog (com variant destructive e loading state)

### Entregáveis
✅ Auth Store e API Client implementados
✅ AuthContext e useAuth hook criados
✅ Login funcional com JWT
✅ Layout principal responsivo (desktop + mobile)
✅ Navegação entre páginas (sidebar + mobile drawer)
✅ Proteção de rotas implementada
✅ Componentes compartilhados (LoadingSpinner, EmptyState, ErrorMessage, ConfirmDialog)

**Concluído em:** 11/01/2025
**Branch:** feature/sprint1-authentication
**Commits:** 573ca53 → current

---

## Sprint 2: Dashboard & Units (Semana 3) ✅

### Objetivos
- Dashboard home com métricas
- CRUD completo de Unidades

### Tarefas

#### Dashboard
- [x] Criar `useDashboard` query
- [x] Página dashboard (`app/(dashboard)/page.tsx`)
- [x] StatsCard component (ocupação, receita, pendentes)
- [x] AlertsList component com badges de severidade
- [x] UpcomingPayments component (próximos 7 dias)
- [ ] Gráfico de ocupação (opcional: recharts ou tremor) - **Movido para Sprint 6**

#### Units - Listagem
- [x] Criar `useUnits` query com filtros
- [x] Página de listagem (`app/(dashboard)/units/page.tsx`)
- [x] UnitsTable component com:
  - Filtro por status
  - Busca por número/andar
  - Contador de resultados
- [ ] UnitCard component (view alternativa) - **Não implementado (não necessário)**
- [x] UnitStatusBadge component

#### Units - Criação
- [x] Schema Zod para unit form
- [x] Criar `useCreateUnit` mutation
- [x] Página de criação (`app/(dashboard)/units/new/page.tsx`)
- [x] UnitForm component
- [x] Toast de sucesso/erro
- [x] Redirect após criação
- [x] **Workaround para `is_renovated` (2 chamadas API)**

#### Units - Detalhes/Edição
- [x] Criar `useUnit` query (by ID)
- [x] Criar `useUpdateUnit` mutation
- [x] Criar `useDeleteUnit` mutation
- [x] Criar `useUpdateUnitStatus` mutation
- [x] Página de detalhes (`app/(dashboard)/units/[id]/page.tsx`)
- [x] Modo edição inline (toggle view/edit)
- [x] Botão de delete com confirmação
- [x] Alteração rápida de status (dropdown)
- [x] Proteção para unidades ocupadas (delete bloqueado)
- [ ] Mostrar contrato ativo (se houver) - **Depende da Sprint 4 (Leases)**

#### Units - Estatísticas
- [x] Criar `useOccupancyStats` query
- [x] Cards de estatísticas na página de listagem
- [ ] Gráfico de ocupação por andar - **Movido para Sprint 6**

### Entregáveis
✅ Dashboard funcional com métricas reais (4 seções: Ocupação, Financeiro, Contratos, Alertas)
✅ CRUD completo de unidades (criar, listar, visualizar, editar, deletar)
✅ Filtros e busca funcionando (status, andar, número, busca em tempo real)
✅ UI responsiva e polida (mobile, tablet, desktop)
✅ Validações client-side e server-side
✅ Loading states e error handling robusto
✅ Atualização automática do dashboard (60s)

**Concluído em:** 13/01/2025
**Branch:** feature/sprint2-dashboard-units
**Commits:**
- 7250caa feat: implement unit creation page with form validation
- bcd863f feat: implement workaround for is_renovated during unit creation
- 2169751 feat: implement unit details and edit page with advanced features
- 88bb505 feat: add edit icon, redirect to unit page after editing
- eb5f635 feat: implement units listing page with filters
- (dashboard commits)

---

## Sprint 3: Tenants (Semana 4) ✅

### Objetivos
- CRUD completo de Inquilinos
- Validação de CPF
- Busca por CPF

### Tarefas

#### Tenants - Listagem
- [x] Criar `useTenants` query com busca
- [x] Página de listagem (`app/(dashboard)/tenants/page.tsx`)
- [x] TenantsTable component (implementado direto na página)
- [x] Busca por nome ou CPF
- [x] Ícones Eye e Edit para ações rápidas
- [ ] TenantCard component - **Não implementado (não necessário)**

#### Tenants - Criação
- [x] Schema Zod para tenant form (validação CPF)
- [x] Criar `useCreateTenant` mutation
- [x] Página de criação (`app/(dashboard)/tenants/new/page.tsx`)
- [x] TenantForm component (reutilizável create/edit)
- [x] Formatação automática de CPF (integrada no Input)
- [x] Formatação automática de telefone
- [x] Validação de CPF único (error handling)

#### Tenants - Detalhes/Edição
- [x] Criar `useTenant` query (by ID)
- [x] Criar `useTenantByCPF` query
- [x] Criar `useUpdateTenant` mutation
- [x] Criar `useDeleteTenant` mutation
- [x] Página de detalhes (`app/(dashboard)/tenants/[id]/page.tsx`)
- [x] Modo visualização com cards informativos
- [x] Modo edição inline (toggle)
- [x] CPF readonly com aviso sobre limitação da API
- [x] Email clicável (mailto link)
- [ ] Mostrar histórico de contratos - **Depende da Sprint 4 (Leases)**
- [ ] Mostrar contrato ativo (se houver) - **Depende da Sprint 4 (Leases)**

#### Utilities
- [x] Função `formatCPF` (XXX.XXX.XXX-XX) - já existia
- [x] Função `validateCPF` (regex + dígitos) - criada
- [x] Função `formatPhone` (máscara de telefone) - já existia

### Entregáveis
✅ CRUD completo de inquilinos (criar, listar, visualizar, editar, deletar)
✅ Validação de CPF funcionando (formato e dígitos)
✅ Busca por nome/CPF em tempo real
✅ Formatação automática de CPF e telefone ao digitar
✅ Ícones Eye e Edit na listagem para ações rápidas
✅ Modo visualização/edição inline
✅ Email clicável (mailto link)
✅ CPF readonly com aviso claro sobre limitação da API
✅ Loading states e error handling robusto
✅ Toast notifications (sucesso/erro)
✅ UI responsiva e polida (mobile, tablet, desktop)

**Concluído em:** 13/01/2025
**Branch:** feature/sprint3-tenants
**Commits:**
- d6506fc feat: implement tenants listing page with search
- 473a47c feat: implement tenant creation page with form validation
- b1f4997 feat: implement tenant details and edit page
- 8107818 fix: improve tenant UX with view/edit icons and better CPF handling

---

## Sprint 4: Leases (Semana 5) ✅

### Objetivos
- CRUD de Contratos
- Criação com geração automática de pagamentos
- Renovação de contratos
- Cancelamento de contratos

### Tarefas

#### Leases - Listagem
- [x] Criar `useLeases` query com filtros
- [x] Página de listagem (`app/(dashboard)/leases/page.tsx`)
- [x] LeasesTable component
- [x] Filtros: status, unidade, inquilino
- [x] LeaseStatusBadge component
- [ ] Indicador de contratos expirando (45 dias) - **Opcional (não implementado)**

#### Leases - Criação
- [x] Schema Zod para lease form
- [x] Criar `useCreateLease` mutation
- [x] Página de criação (`app/(dashboard)/leases/new/page.tsx`)
- [x] LeaseForm component com:
  - [x] Select de unidade (apenas available)
  - [ ] Select de inquilino (ou criar novo inline) - **Opcional (não implementado)**
  - [x] Data de assinatura e início
  - [x] Valor do aluguel
  - [x] Taxa de pintura + parcelamento
  - [x] Dia de vencimento
- [x] Validações de negócio (unidade disponível, etc)
- [x] Toast mostrando quantos pagamentos foram gerados

#### Leases - Detalhes
- [x] Criar `useLease` query (by ID)
- [x] Página de detalhes (`app/(dashboard)/leases/[id]/page.tsx`)
- [x] Mostrar informações do contrato
- [x] Mostrar unidade e inquilino
- [x] Timeline de pagamentos
- [x] Botões de ação (renovar, cancelar)

#### Leases - Renovação
- [x] Criar `useRenewLease` mutation
- [x] Criar `useLeasesExpiringSoon` query
- [x] RenewLeaseDialog component
- [x] Validação: apenas contratos ativos próximos ao fim
- [x] Mostrar preview do novo contrato

#### Leases - Cancelamento
- [x] Criar `useCancelLease` mutation
- [x] CancelLeaseDialog component com confirmação
- [x] Validação: apenas contratos ativos
- [x] Atualizar status da unidade

#### Leases - Estatísticas
- [x] Criar `useLeaseStats` query
- [x] Página ou seção de estatísticas
- [x] Contratos ativos vs encerrados
- [x] Taxa de renovação

#### Correções e Melhorias
- [x] Corrigir tipos TypeScript de LeaseStats (API retorna campos sem sufixo `_leases`)
- [x] Corrigir exibição de estatísticas na página de listagem
- [x] Melhorar tratamento de erros na página de detalhes (loading states robustos)
- [x] Adicionar mensagens amigáveis para erros ao carregar tenant/unit

### Entregáveis
✅ CRUD completo de contratos
✅ Criação com seleção de unidade/inquilino
✅ Renovação funcionando
✅ Cancelamento com validações
✅ Dashboard de contratos expirando
✅ Estatísticas funcionando corretamente
✅ Tratamento de erros robusto

**Concluído em:** 13/01/2025
**Branch:** feature/sprint4-leases
**Commits:**
- 18820c7 feat: implement Sprint 4 leases with unit/tenant integration
- 24e941f fix: correct lease creation with proper date and money formatting
- 38fa487 fix: resolve intermittent logout issue on page refresh
- f44fccc fix: improve auth context re-rendering with useMemo and useCallback
- 30dcbe9 chore: remove debug logs and temporary debug utilities
- (current) fix: correct lease stats types and improve error handling

---

## Sprint 5: Payments (Semana 6) ✅

### Objetivos
- Visualização de pagamentos
- Marcar pagamentos como pagos
- Pagamentos atrasados e próximos vencimentos
- Cálculo de multas

### Tarefas

#### Payments - Por Contrato
- [x] Criar `useLeasePayments` query
- [x] Página de pagamentos (`app/(dashboard)/leases/[id]/payments/page.tsx`)
- [x] PaymentsTable component (implementado inline na página)
- [x] PaymentStatusBadge component
- [x] Filtros: status, tipo, período

#### Payments - Marcar como Pago
- [x] Criar `useMarkPaymentAsPaid` mutation
- [x] PayPaymentDialog component
- [x] Campos: data de pagamento, método
- [x] Auto-preencher data atual
- [x] Mostrar valor original vs com multa

#### Payments - Atrasados
- [x] Criar `useOverduePayments` query
- [x] Página de atrasados (`app/(dashboard)/payments/overdue/page.tsx`)
- [x] Destacar dias de atraso
- [x] Mostrar valor da multa calculada
- [x] Botão rápido para marcar como pago

#### Payments - Próximos Vencimentos
- [x] Criar `useUpcomingPayments` query
- [x] Página de upcoming (`app/(dashboard)/payments/upcoming/page.tsx`)
- [x] Filtro por dias (7, 15, 30, 60)
- [x] Ordenar por data de vencimento
- [x] Agrupar por período (Hoje, Esta Semana, Depois)

#### Payments - Estatísticas
- [x] Criar `usePaymentStats` query (por lease)
- [x] Componente de estatísticas do contrato
- [x] Pagamentos em dia vs atrasados
- [x] Total pago vs total esperado

#### Payments - Cancelamento
- [x] Criar `useCancelPayment` mutation
- [x] Botão de cancelar em todas as páginas de pagamentos
- [x] ConfirmDialog para cancelamento
- [x] Apenas para pagamentos pending/overdue

#### Utilities
- [x] Função `calculateLateFee` (2% + 1%/mês pro-rata)
- [x] Função `formatCurrency` (R$ 1.000,00) - já existia
- [ ] CurrencyInput component com máscara - **Não implementado (não necessário)**

#### Extras Implementados
- [x] Página principal de pagamentos (`app/(dashboard)/payments/page.tsx`)
- [x] Dashboard com resumo de atrasados e próximos vencimentos
- [x] Integração completa com API backend
- [x] Modo escuro desabilitado (forçado light mode)

### Entregáveis
✅ Visualização completa de pagamentos
✅ Marcar como pago funcionando
✅ Dashboard de atrasados
✅ Dashboard de próximos vencimentos
✅ Cálculo de multas correto
✅ Cancelamento de pagamentos
✅ Filtros avançados (status, tipo, período)
✅ Estatísticas por contrato
✅ UI responsiva e polida

**Concluído em:** 14/10/2025
**Branch:** feature/sprint5-payments
**Commits:**
- 951de34 feat: implement Sprint 5 - Payments module with full CRUD functionality
- 898b81e feat: add payment cancellation feature and force light mode

---

## Sprint 6: Reports & Advanced Features (Semana 7) ✅

### Objetivos
- Relatórios financeiros
- Relatórios de pagamentos
- Filtros avançados
- Exportação (futuro)

### Tarefas

#### Reports - Financial
- [x] Criar `useFinancialReport` query
- [x] Página de relatório (`app/(dashboard)/reports/financial/page.tsx`)
- [x] Filtros de período (date range picker)
- [x] Filtros de tipo e status
- [x] Tabela de resultados
- [x] Totalizadores

#### Reports - Payments
- [x] Criar `usePaymentHistory` query
- [x] Página de relatório (`app/(dashboard)/reports/payments/page.tsx`)
- [x] Filtros avançados (contrato, inquilino, status, período)
- [x] Visualização por contrato
- [x] Totalizadores por status de pagamento

#### Components
- [x] DateRangePicker component (shadcn calendar)
- [x] Calendar component (shadcn)
- [x] Popover component (shadcn)
- [ ] DataTable genérica com filtros - **Não implementado (não necessário)**
- [ ] ExportButton (preparar para futuro) - **Movido para backlog**

#### Dashboard - Melhorias
- [ ] Adicionar gráfico de receita mensal (recharts/tremor) - **Movido para backlog (opcional)**
- [ ] Gráfico de inadimplência - **Movido para backlog (opcional)**
- [ ] Top unidades por receita - **Movido para backlog (opcional)**

#### Correções e Melhorias
- [x] Adicionar safe access (optional chaining) para dados da API
- [x] Validação de datas inválidas/vazias em formatDate
- [x] Fallback values para todos os campos opcionais
- [x] Error handling robusto em todas as páginas
- [x] Loading states e empty states

### Entregáveis
✅ Relatórios financeiros completos com filtros avançados
✅ Histórico de pagamentos com múltiplos filtros
✅ Filtros avançados funcionando (período, tipo, status, contrato, inquilino)
✅ DateRangePicker component reutilizável
✅ Página principal de relatórios com navegação
✅ Validação e tratamento de erros robusto

**Concluído em:** 14/01/2025
**Branch:** feature/sprint6-reports
**Commits:**
- 19827d8 feat: implement Sprint 6 - Reports module with Financial and Payments reports
- 06cb782 fix: add safe access and validation to prevent errors in reports

---

## Sprint 7: Settings & User Management (Semana 8) ✅

### Objetivos
- Gestão de usuários (admin only)
- Perfil do usuário
- Troca de senha
- Configurações da aplicação

### Tarefas

#### Settings - Profile
- [x] Criar `useChangePassword` mutation
- [x] Página de perfil (`app/(dashboard)/settings/profile/page.tsx`)
- [x] Formulário de troca de senha
- [x] Exibir informações do usuário atual

#### Settings - Users (Admin Only)
- [x] Criar `useUsers` query
- [x] Criar `useCreateUser` mutation
- [x] Criar `useUpdateUserRole` mutation (useChangeUserRole)
- [x] Criar `useDeactivateUser` mutation
- [x] Criar `useActivateUser` mutation
- [x] Página de usuários (`app/(dashboard)/settings/users/page.tsx`)
- [x] UsersTable component (implementado inline)
- [x] CreateUserDialog
- [x] ChangeRoleDialog
- [x] Verificação de role (apenas admin vê)

#### Settings - General
- [x] Página de configurações (`app/(dashboard)/settings/page.tsx`)
- [ ] Toggle de tema (light/dark) - **Não implementado (tema forçado em light)**
- [ ] Preferências de notificação (preparar para futuro) - **Movido para backlog**

### Entregáveis
✅ Gestão de usuários completa
✅ Troca de senha funcionando
✅ Role-based access control implementado
✅ Página de configurações
✅ Hooks de usuários com todas as mutations necessárias
✅ Estatísticas de usuários (total, admins, managers, ativos)
✅ Busca e filtros na listagem de usuários
✅ UI responsiva e polida

**Concluído em:** 15/01/2025
**Branch:** feature/sprint7-settings-user-management
**Commit:** 04fdf32 feat: implement Sprint 7 - Settings & User Management module

---

## Sprint 8: Polish & Testing (Semana 9) 🔄

### Objetivos
- Refinamento de UI/UX
- Responsividade mobile
- Testes
- Otimizações de performance

### Tarefas

#### UI/UX Polish
- [x] Revisar todas as páginas para consistência
- [x] Melhorar mensagens de erro
- [x] Adicionar skeletons/loading states
- [x] Melhorar empty states
- [x] Simplificar interface de pagamentos (remover complexidade de juros)
- [x] Implementar lookup de unidades em tabelas de pagamentos
- [x] Corrigir erro 400 ao registrar pagamentos (formato de data ISO)
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

#### Backend Improvements
- [x] Gerar todos os 6 aluguéis mensais na criação de contratos (antes: apenas 1)
- [x] Modificar RenewLease para também gerar todos os 6 aluguéis
- [x] Atualizar testes do backend (100% passando)
- [x] Criar PR no backend com melhorias

#### Testing
- [ ] Setup Vitest
- [ ] Testes unitários para utilities
  - formatCPF, validateCPF
  - formatCurrency
  - calculateLateFee (removido)
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

### Entregáveis (Parcial)
✅ **UI/UX Melhorias:**
  - Interface de pagamentos simplificada (sem juros)
  - Lookup de unidades implementado (mostra "Kit 101" ao invés de UUID)
  - Erro 400 corrigido (formato de data ISO)
  - Mensagens de erro melhoradas
  - Loading states e empty states consistentes

✅ **Backend Melhorias:**
  - Geração de todos os 6 aluguéis automática
  - Testes 100% passando
  - PR #6 criado e pronto para merge

✅ **Frontend Melhorias:**
  - Arquitetura preparada para filtros futuros
  - Performance otimizada (2 requisições, cache eficiente)
  - PR #9 criado e pronto para merge

🔄 **Pendente:**
  - Testes automatizados
  - Responsividade mobile completa
  - Performance audit
  - Documentação

**Status:** Em andamento (15/10/2025)
**Branches:**
- Backend: `fix/generate-all-monthly-rent-payments` → PR #6
- Frontend: `fix/payment-date-format-and-improvements` → PR #9

---

## Sprint 9: Production Ready (Semana 10) 🚀

### Objetivos
- Preparação para produção na Vercel
- Deploy inicial básico (fast track)
- Configuração essencial
- Melhorias incrementais (opcional)

### Estratégia: Deploy Rápido e Incremental

**Fase 1: Deploy Básico** (Hoje - 15 min) ✅
- [x] Testar build localmente
- [x] Criar `vercel.json` com configurações otimizadas
- [x] Criar `DEPLOYMENT.md` (guia completo)
- [x] Atualizar `ROADMAP.md`

**Fase 2: Deploy na Vercel** (Hoje - 30 min)
- [ ] Fazer push do código para repositório remoto
- [ ] Conectar repositório na Vercel (via interface web)
- [ ] Configurar variáveis de ambiente
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_APP_NAME`
  - `NEXT_PUBLIC_APP_VERSION`
- [ ] Deploy inicial (automático)
- [ ] Smoke tests em produção
  - Login funcionando
  - Dashboard carregando
  - CRUD básico (unidades, inquilinos)
  - Integração com API Railway

**Fase 3: Melhorias Incrementais** (Próximos dias - opcional)
- [ ] Configurar domínio customizado (opcional)
- [ ] Ativar Vercel Analytics (gratuito)
- [ ] Ativar Speed Insights (gratuito)
- [ ] Testar performance com Lighthouse
- [ ] Setup error tracking (Sentry - opcional)
- [ ] Configurar alertas de uptime (opcional)

### Tarefas Detalhadas

#### Deploy Básico ✅
- [x] **Verificar build local**
  - Build passou com sucesso
  - 22 rotas geradas
  - Bundle size: ~100KB (excelente)
  - Warning sobre lockfiles (não crítico)

- [x] **Criar `vercel.json`**
  - Framework: Next.js
  - Região: `gru1` (São Paulo - melhor latência Brasil)
  - Security headers configurados
  - Rewrites para SPA routing

- [x] **Criar `DEPLOYMENT.md`**
  - Guia completo passo a passo
  - Método via interface web (recomendado)
  - Método via CLI (avançado)
  - Configuração de domínio customizado
  - Troubleshooting comum
  - Checklist de segurança
  - Performance otimização

#### Deploy na Vercel
- [ ] **Preparar repositório**
  ```bash
  git add vercel.json DEPLOYMENT.md ROADMAP.md
  git commit -m "chore: prepare for Vercel deployment"
  git push origin main
  ```

- [ ] **Deploy via Vercel Interface Web** (Método Recomendado)
  1. Acessar [vercel.com/new](https://vercel.com/new)
  2. Login com GitHub
  3. Importar repositório `front-kitnet-manager`
  4. Configurar environment variables
  5. Deploy!

- [ ] **Configurar Variáveis de Ambiente**
  | Variável | Valor | Ambiente |
  |----------|-------|----------|
  | `NEXT_PUBLIC_API_URL` | `https://kitnet-manager-production.up.railway.app/api/v1` | Production, Preview, Development |
  | `NEXT_PUBLIC_APP_NAME` | `Kitnet Manager` | Production, Preview, Development |
  | `NEXT_PUBLIC_APP_VERSION` | `1.0.0` | Production, Preview, Development |

- [ ] **Smoke Tests em Produção**
  - [ ] Aplicação carrega sem erros
  - [ ] Login funciona (admin/admin123)
  - [ ] Dashboard mostra dados da API
  - [ ] Criar unidade funciona
  - [ ] Criar inquilino funciona
  - [ ] Criar contrato funciona
  - [ ] Marcar pagamento como pago funciona
  - [ ] Relatórios carregam
  - [ ] Configurações funcionam
  - [ ] Mobile responsivo
  - [ ] Sem erros no console

#### Melhorias Pós-Deploy (Opcional)
- [ ] **Domínio Customizado**
  - Comprar domínio (Registro.br, GoDaddy, etc)
  - Configurar DNS (A record ou CNAME)
  - Adicionar na Vercel
  - Aguardar propagação (5-15 min)

- [ ] **Analytics & Monitoring**
  - [ ] Ativar Vercel Analytics (gratuito)
  - [ ] Ativar Speed Insights
    ```bash
    npm install @vercel/speed-insights
    ```
  - [ ] Configurar Web Vitals tracking

- [ ] **Error Tracking (Sentry - opcional)**
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs
  ```

- [ ] **Performance Audit**
  - [ ] Rodar Lighthouse (score > 90)
  - [ ] Analisar bundle size
  - [ ] Otimizar imagens se necessário
  - [ ] Verificar Core Web Vitals

- [ ] **Security Audit**
  - [ ] Headers de segurança (já configurados)
  - [ ] HTTPS funcionando (automático na Vercel)
  - [ ] Variáveis sensíveis não expostas
  - [ ] Rate limiting na API (backend)

#### CI/CD - Configuração
- [ ] **Branch Protection**
  - Proteger branch `main`
  - Require PR reviews
  - Require status checks

- [ ] **Deploy Automático**
  - ✅ Push para `main` → Deploy Production (já configurado pela Vercel)
  - ✅ Abrir PR → Preview deploy (já configurado pela Vercel)
  - ✅ Deploy apenas se build passar (já configurado pela Vercel)

#### Documentation
- [ ] Atualizar README.md com:
  - [ ] URL de produção
  - [ ] Credenciais de demo
  - [ ] Screenshots da aplicação
  - [ ] Status badges (build, deploy)

- [ ] Criar USER_GUIDE.md (opcional)
  - [ ] Como fazer login
  - [ ] Como gerenciar unidades
  - [ ] Como gerenciar inquilinos
  - [ ] Como criar contratos
  - [ ] Como processar pagamentos
  - [ ] Como gerar relatórios

- [ ] Criar FAQ.md (opcional)
  - [ ] Problemas comuns e soluções
  - [ ] Perguntas frequentes de usuários

### Arquivos Criados

✅ **[vercel.json](vercel.json)**
- Configuração otimizada para Next.js
- Região São Paulo (gru1)
- Security headers
- SPA routing rewrites

✅ **[DEPLOYMENT.md](DEPLOYMENT.md)**
- Guia completo de deploy (3500+ palavras)
- Método via interface web
- Método via CLI
- Configuração de domínio
- Troubleshooting
- Performance otimização
- Security checklist

### Entregáveis

**Fase 1 (Completa):** ✅
- ✅ Build testado localmente
- ✅ `vercel.json` criado
- ✅ `DEPLOYMENT.md` criado
- ✅ Roadmap atualizado

**Fase 2 (Pendente):**
- [ ] Aplicação em produção na Vercel
- [ ] URL pública acessível
- [ ] Smoke tests passando
- [ ] Integração com API funcionando

**Fase 3 (Opcional):**
- [ ] Analytics configurado
- [ ] Performance otimizado (Lighthouse > 90)
- [ ] Monitoring ativo
- [ ] Domínio customizado (se aplicável)

### Métricas de Sucesso

#### Performance (Target)
- **Lighthouse Score:** > 90
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Bundle Size:** < 300KB (✅ atual: ~100KB)

#### Deployment
- **Build Time:** < 3 min (✅ atual: ~3.5s compile + ~2min total)
- **Deploy Time:** < 5 min
- **Uptime:** > 99.9%

#### User Experience
- **Login Response:** < 1s
- **Dashboard Load:** < 2s
- **API Response:** < 500ms
- **Mobile Score:** > 85

### Próximos Passos Imediatos

1. **Fazer commit dos novos arquivos:**
   ```bash
   git add vercel.json DEPLOYMENT.md ROADMAP.md
   git commit -m "chore: prepare for Vercel deployment"
   git push origin main
   ```

2. **Seguir o guia [DEPLOYMENT.md](DEPLOYMENT.md)** para fazer o deploy

3. **Testar em produção** seguindo o checklist de smoke tests

4. **Considerar melhorias opcionais** conforme necessidade

---

**Status:** Fase 1 completa ✅ | Fase 2 pronta para começar
**Data:** 17/10/2025
**Branch:** fix/payment-date-format-and-improvements (merge para main antes do deploy)

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
Semana 1: [████████████████████████] Setup & Foundation ✅
Semana 2: [████████████████████████] Auth & Layout ✅
Semana 3: [████████████████████████] Dashboard & Units ✅
Semana 4: [████████████████████████] Tenants ✅
Semana 5: [████████████████████████] Leases ✅
Semana 6: [████████████████████████] Payments ✅
Semana 7: [████████████████████████] Reports & Advanced ✅
Semana 8: [████████████████████████] Settings & Users ✅
Semana 9: [------------------------] Polish & Testing
Semana 10: [------------------------] Production Ready

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         MVP Core Features  │  Advanced  │  Launch
             (80% ✅)        │            │
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
