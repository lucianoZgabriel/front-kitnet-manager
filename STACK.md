# Tech Stack - Kitnet Manager Frontend

Definição completa da stack tecnológica para o frontend do Kitnet Manager.

---

## Core Framework

### Next.js 15+ (App Router)
- **Por quê:** SSR/SSG, file-based routing, otimizações automáticas, melhor SEO
- **Versão:** 15.x (latest stable)
- **Configuração:** App Router (não Pages Router)
- **Rendering:**
  - Server Components por padrão
  - Client Components apenas quando necessário (interatividade, hooks)

### TypeScript 5+
- **Por quê:** Type safety, melhor DX, menos bugs em produção
- **Configuração:** Strict mode habilitado
- **Path aliases:** `@/` para imports limpos

### React 19+
- **Versão:** Latest (vem com Next.js 15)
- **Features:** Server Components, Server Actions, Suspense

---

## Styling & UI

### TailwindCSS 4+
- **Por quê:** Utility-first, performático, customizável, DX excelente
- **Plugins:**
  - `@tailwindcss/forms` - Estilização de formulários
  - `@tailwindcss/typography` - Tipografia para conteúdo
- **Configuração:** Tema customizado com cores do projeto

### shadcn/ui
- **Por quê:** Componentes acessíveis, customizáveis, copy-paste friendly
- **Componentes principais:**
  - Button, Input, Select, Checkbox, RadioGroup
  - Dialog, Sheet, Dropdown Menu
  - Table, Card, Badge, Alert
  - Calendar, Date Picker
  - Toast, Tooltip
  - Form (React Hook Form integration)
- **Customização:** Adaptação para design brasileiro (pt-BR)

### Lucide React
- **Por quê:** Ícones consistentes, tree-shakeable, bem mantido
- **Alternativa:** Heroicons (caso prefira)

---

## Data Fetching & State Management

### TanStack Query (React Query) v5
- **Por quê:** Cache inteligente, refetch automático, otimistic updates, DevTools
- **Features:**
  - Cache de 5 minutos (staleTime)
  - Refetch on window focus
  - Retry logic configurável
  - Mutations com invalidação automática
- **Estrutura:**
  ```
  src/
  ├── queries/
  │   ├── useAuth.ts
  │   ├── useUnits.ts
  │   ├── useTenants.ts
  │   ├── useLeases.ts
  │   ├── usePayments.ts
  │   └── useDashboard.ts
  ```

### Zustand (Estado Global Leve)
- **Por quê:** Simples, performático, sem boilerplate
- **Uso:**
  - Auth state (user, token)
  - UI state (sidebar, theme, filters)
  - Não usar para dados da API (React Query cuida disso)

### Axios
- **Por quê:** Interceptors para auth, melhor DX que fetch
- **Configuração:**
  - Base URL configurável via env
  - Interceptor para adicionar Bearer token
  - Interceptor para tratar erros 401 (logout automático)
  - Timeout configurável

---

## Forms & Validation

### React Hook Form v7
- **Por quê:** Performático (uncontrolled), validação integrada, menos re-renders
- **Features:**
  - Validação com Zod
  - Integração com shadcn/ui Form component
  - Error handling simplificado

### Zod
- **Por quê:** Schema validation, TypeScript inference, mensagens customizáveis
- **Uso:**
  - Schemas para todos os formulários
  - Validação client-side
  - Type inference para garantir consistência

---

## Utilities

### date-fns
- **Por quê:** Modular, tree-shakeable, i18n pt-BR
- **Funções principais:**
  - `format()` - Formatação de datas
  - `parseISO()` - Parse de strings ISO
  - `addMonths()`, `differenceInDays()` - Cálculos
  - `isPast()`, `isFuture()` - Validações

### clsx + tailwind-merge
- **Por quê:** Composição de classes condicionais
- **Uso:** Utility `cn()` para merge de classes Tailwind

### react-input-mask
- **Por quê:** Máscaras para CPF, telefone, valores
- **Alternativa:** `react-number-format` para valores monetários

---

## Developer Experience

### ESLint
- **Configuração:** Next.js + TypeScript + Prettier
- **Plugins:**
  - `eslint-plugin-react-hooks`
  - `eslint-plugin-tailwindcss`
- **Rules:** Strict, mas pragmático

### Prettier
- **Configuração:**
  - Single quotes
  - No semicolons
  - 2 spaces indentation
  - Tailwind class sorting

### Husky + lint-staged
- **Por quê:** Git hooks para qualidade de código
- **Hooks:**
  - Pre-commit: ESLint + Prettier nos arquivos staged
  - Pre-push: Type check

---

## Testing (Futuro)

### Vitest
- **Por quê:** Rápido, compatível com Vite, mesma API do Jest
- **Uso:** Unit tests para utilities e hooks

### Testing Library
- **Por quê:** Best practices, foco em user behavior
- **Uso:** Component testing

### Playwright
- **Por quê:** E2E testing, multi-browser, DevTools
- **Uso:** Fluxos críticos (login, criar contrato, processar pagamento)

---

## Deployment & Infrastructure

### Vercel
- **Por quê:** Zero-config, otimizado para Next.js, preview deploys
- **Features:**
  - Deploy automático via GitHub
  - Edge Functions
  - Analytics
  - Preview URLs para PRs

### Ambiente
- **Development:** `localhost:3000`
- **Staging:** `kitnet-manager-staging.vercel.app` (branch develop)
- **Production:** `kitnet-manager.vercel.app` (branch main)

---

## Environment Variables

```env
# API
NEXT_PUBLIC_API_URL=https://kitnet-manager-production.up.railway.app/api/v1

# App
NEXT_PUBLIC_APP_NAME=Kitnet Manager
NEXT_PUBLIC_APP_VERSION=1.0.0

# Features (opcional)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

---

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui"
  }
}
```

---

## Dependências Principais

### Production Dependencies
```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.3.0",

  "@tanstack/react-query": "^5.0.0",
  "zustand": "^4.5.0",
  "axios": "^1.6.0",

  "react-hook-form": "^7.49.0",
  "zod": "^3.22.0",

  "date-fns": "^3.0.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0",
  "react-input-mask": "^3.0.0",

  "lucide-react": "^0.300.0",

  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-toast": "^1.1.5",
  "@radix-ui/react-tooltip": "^1.0.7"
}
```

### Development Dependencies
```json
{
  "@types/node": "^20.0.0",
  "@types/react": "^19.0.0",
  "@types/react-dom": "^19.0.0",

  "tailwindcss": "^4.0.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",

  "eslint": "^8.0.0",
  "eslint-config-next": "^15.0.0",
  "eslint-plugin-tailwindcss": "^3.14.0",

  "prettier": "^3.1.0",
  "prettier-plugin-tailwindcss": "^0.5.0",

  "husky": "^8.0.0",
  "lint-staged": "^15.0.0",

  "vitest": "^1.0.0",
  "@testing-library/react": "^14.0.0",
  "playwright": "^1.40.0"
}
```

---

## Considerações de Performance

### Image Optimization
- Usar `next/image` para todas as imagens
- Lazy loading automático
- WebP/AVIF automático

### Code Splitting
- Route-based splitting automático (Next.js)
- Dynamic imports para componentes pesados
- React.lazy() para modals, charts

### Caching Strategy
```typescript
const CACHE_TIMES = {
  dashboard: 1 * 60 * 1000,      // 1 minuto
  lists: 5 * 60 * 1000,          // 5 minutos
  details: 10 * 60 * 1000,       // 10 minutos
  static: 60 * 60 * 1000         // 1 hora
}
```

### Bundle Size
- Tree shaking habilitado
- Import apenas o necessário
- Análise de bundle: `@next/bundle-analyzer`

---

## Acessibilidade

### Padrões
- Semantic HTML
- ARIA labels onde necessário
- Keyboard navigation
- Focus management
- Color contrast (WCAG AA)

### Ferramentas
- shadcn/ui já vem com acessibilidade
- eslint-plugin-jsx-a11y para linting
- Lighthouse para auditorias

---

## Internacionalização (Futuro)

### next-intl
- **Por quê:** Melhor suporte a Server Components
- **Idiomas:** pt-BR (inicial), en (futuro)
- **Escopo:** Labels, mensagens de erro, formatação de datas/moeda

---

## Monitoramento (Futuro)

### Sentry
- Error tracking em produção
- Performance monitoring
- User feedback

### Vercel Analytics
- Web Vitals
- Page views
- User journey

---

## Stack Resumida

| Categoria | Tecnologia |
|-----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5+ |
| **Styling** | TailwindCSS 4 + shadcn/ui |
| **State** | TanStack Query + Zustand |
| **Forms** | React Hook Form + Zod |
| **HTTP** | Axios |
| **Dates** | date-fns |
| **Icons** | Lucide React |
| **Testing** | Vitest + Testing Library + Playwright |
| **Deploy** | Vercel |
| **Linting** | ESLint + Prettier + Husky |

---

## Decisões Técnicas

### Por que não Redux?
- Overhead desnecessário para esse projeto
- React Query já gerencia estado de servidor
- Zustand suficiente para estado de UI

### Por que não Sass/CSS Modules?
- Tailwind mais produtivo
- Melhor DX com autocomplete
- Menor chance de CSS não utilizado

### Por que Axios e não fetch?
- Interceptors são essenciais para auth
- Melhor tratamento de erros
- Timeout configurável out of the box

### Por que shadcn/ui e não MUI/Chakra?
- Copy-paste = controle total
- Menor bundle size
- Customização mais fácil
- Já usa Radix UI (acessível)

---

**Última atualização:** 2025-01-15
**Versão:** 1.0.0
