# Decisões Técnicas - Kitnet Manager Frontend

Registro de decisões arquiteturais e tecnológicas do projeto (Architecture Decision Records - ADR).

---

## Formato

Cada decisão segue o formato:

- **Status:** Aceita / Proposta / Rejeitada / Substituída
- **Contexto:** Por que essa decisão foi necessária
- **Decisão:** O que foi decidido
- **Consequências:** Impactos positivos e negativos

---

## ADR-001: Next.js 15 com App Router

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
Precisamos escolher um framework React que suporte SSR, otimizações automáticas e tenha bom DX.

### Decisão
Usar Next.js 15 (latest stable) com App Router ao invés de Pages Router.

### Alternativas Consideradas
- **Vite + React Router:** Mais leve, mas sem SSR nativo
- **Remix:** Excelente, mas menor ecossistema
- **Next.js Pages Router:** Mais maduro, mas App Router é o futuro
- **Gatsby:** Focado em static sites, overkill para esse projeto

### Consequências

**Positivas:**
- SSR/SSG out of the box
- Otimizações automáticas (code splitting, image optimization)
- Server Components reduzem bundle size
- File-based routing simplifica estrutura
- Ecossistema rico (Vercel, plugins, community)
- Melhor SEO (se precisar no futuro)

**Negativas:**
- Curva de aprendizado do App Router (novo)
- Algumas libs podem ter problemas com Server Components
- Vercel vendor lock-in (mas pode hospedar em outros lugares)

---

## ADR-002: TailwindCSS + shadcn/ui

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
Precisamos de uma solução de styling que seja produtiva, customizável e performática.

### Decisão
Usar TailwindCSS 4 para styling + shadcn/ui para componentes.

### Alternativas Consideradas
- **Material-UI (MUI):** Bundle grande, opinionated demais
- **Chakra UI:** Bom, mas menos controle sobre componentes
- **Ant Design:** Muito enterprise, design chinês
- **CSS Modules / Sass:** Menos produtivo
- **Styled Components:** Runtime overhead
- **Mantine:** Boa alternativa, mas menor ecossistema

### Consequências

**Positivas:**
- Desenvolvimento rápido com utility classes
- shadcn/ui = copy-paste = controle total do código
- Menor bundle size (vs component libraries)
- Customização fácil via Tailwind config
- Acessibilidade built-in (Radix UI)
- Zero JavaScript runtime (Tailwind)

**Negativas:**
- HTML pode ficar verboso (muitas classes)
- Precisa configurar componentes um por um (shadcn)
- Curva de aprendizado inicial do Tailwind

---

## ADR-003: TanStack Query (React Query) v5

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
Precisamos gerenciar estado de servidor (API data) com cache inteligente.

### Decisão
Usar TanStack Query v5 como solução principal de data fetching e caching.

### Alternativas Consideradas
- **SWR:** Mais simples, mas menos features
- **Redux Toolkit Query:** Overkill, muito boilerplate
- **Apollo Client:** Só para GraphQL
- **Fetch nativo + useState:** Reinventar a roda

### Consequências

**Positivas:**
- Cache automático e inteligente
- Refetch on window focus, reconnect, interval
- Optimistic updates fáceis
- DevTools excelentes
- Retry logic configurável
- Invalidação granular de cache
- Reduz drasticamente código boilerplate

**Negativas:**
- Mais uma dependência
- Curva de aprendizado (conceitos de staleTime, cacheTime, etc)
- Pode ser overkill para apps muito simples

---

## ADR-004: Zustand para Estado Global de UI

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
Precisamos gerenciar estado global de UI (auth, sidebar, filtros) de forma simples.

### Decisão
Usar Zustand para estado global **apenas de UI**, não de dados da API.

### Alternativas Consideradas
- **Redux Toolkit:** Muito boilerplate para necessidades simples
- **Context API:** Performance issues em apps grandes
- **Jotai / Recoil:** Mais complexo que necessário
- **Sem estado global:** Props drilling

### Consequências

**Positivas:**
- API extremamente simples
- Zero boilerplate
- Excelente performance (subscriptions granulares)
- Persist middleware para localStorage
- Pequeno (< 3KB)
- Pode usar fora de componentes React

**Negativas:**
- Menos structure que Redux (pode virar bagunça se não disciplinar)
- DevTools menos poderosos que Redux DevTools

**Regra importante:** Zustand APENAS para UI state. React Query gerencia API data.

---

## ADR-005: React Hook Form + Zod

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
Precisamos gerenciar formulários complexos com validação robusta.

### Decisão
Usar React Hook Form para gestão de forms + Zod para validação schema-based.

### Alternativas Consideradas
- **Formik:** Mais antigo, menos performático
- **React Final Form:** Bom, mas menor comunidade
- **Controlled forms nativos:** Muito boilerplate, muitos re-renders
- **Yup (validação):** Zod tem melhor integração com TypeScript

### Consequências

**Positivas:**
- Mínimo de re-renders (uncontrolled)
- Validação type-safe com Zod
- Type inference automática dos schemas
- Integração perfeita com shadcn/ui Form
- Excelente DX
- Menos código que soluções alternativas

**Negativas:**
- Dois conceitos para aprender (RHF + Zod)
- Schemas podem ficar grandes em forms complexos

---

## ADR-006: Axios ao invés de Fetch

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
Precisamos de um HTTP client com suporte a interceptors para auth.

### Decisão
Usar Axios como HTTP client.

### Alternativas Consideradas
- **Fetch nativo:** Sem interceptors, mais verboso
- **ky:** Moderno, mas menor ecossistema
- **ofetch:** Bom, mas menos features

### Consequências

**Positivas:**
- Interceptors para adicionar Bearer token automaticamente
- Interceptor para tratar 401 (logout automático)
- Timeout configurável
- Melhor tratamento de erros
- API mais amigável que fetch
- Amplamente usado (muitos exemplos)

**Negativas:**
- Dependência adicional (fetch é nativo)
- Precisa polyfill em ambientes muito antigos (não relevante)

---

## ADR-007: date-fns para Manipulação de Datas

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
Precisamos manipular e formatar datas com suporte a pt-BR.

### Decisão
Usar date-fns ao invés de moment.js ou Day.js.

### Alternativas Consideradas
- **Moment.js:** Deprecated, bundle grande
- **Day.js:** Menor, mas menos features
- **Luxon:** Bom, mas mais pesado
- **Date nativo:** API ruim, sem i18n fácil

### Consequências

**Positivas:**
- Modular (tree-shakeable)
- Imutável (functional)
- i18n pt-BR built-in
- Bem mantido
- TypeScript support excelente

**Negativas:**
- Import statements podem ficar longos
- Precisa importar locale pt-BR manualmente

---

## ADR-008: Vercel para Deploy

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
Precisamos de uma plataforma de deploy otimizada para Next.js.

### Decisão
Usar Vercel para CI/CD e hosting.

### Alternativas Consideradas
- **Netlify:** Bom para static, menos otimizado para Next.js
- **AWS Amplify:** Mais complexo
- **Cloudflare Pages:** Bom, mas menos integração
- **Self-hosted (Docker):** Mais trabalho

### Consequências

**Positivas:**
- Zero-config para Next.js
- Preview deploys automáticos
- Edge Functions
- CDN global
- Analytics built-in
- Excelente DX
- Deploy via git push

**Negativas:**
- Vendor lock-in (mas Next.js roda em qualquer lugar)
- Custos podem crescer (mas free tier é generoso)
- Dependência de um provider

---

## ADR-009: TypeScript Strict Mode

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
Precisamos maximizar type safety e prevenir bugs.

### Decisão
Usar TypeScript com strict mode habilitado.

### Alternativas Consideradas
- **TypeScript normal:** Menos strict
- **JavaScript + JSDoc:** Sem garantias reais
- **JavaScript puro:** Mais bugs, menos DX

### Consequências

**Positivas:**
- Catch bugs em compile time
- Melhor autocomplete
- Refactoring mais seguro
- Documentação via types
- Força boas práticas

**Negativas:**
- Pode ser mais verboso
- Curva de aprendizado inicial
- Algumas libs podem ter types ruins

---

## ADR-010: Feature-Based Folder Structure

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
Precisamos organizar o código de forma escalável e fácil de navegar.

### Decisão
Organizar components por feature (units/, tenants/, leases/) ao invés de por tipo.

### Alternativas Consideradas
- **Por tipo:** components/, hooks/, utils/ (tudo misturado)
- **Flat:** Tudo em um diretório
- **Atomic Design:** Atoms, molecules, organisms (muito abstrato)

### Consequências

**Positivas:**
- Fácil encontrar código relacionado
- Deletar feature é fácil (delete pasta)
- Menor acoplamento
- Escala melhor

**Negativas:**
- Componentes compartilhados precisam de pasta separada
- Pode ter duplicação se não disciplinar

---

## ADR-011: Nenhum CSS-in-JS

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
CSS-in-JS (styled-components, emotion) tem runtime overhead.

### Decisão
Não usar CSS-in-JS. Usar apenas TailwindCSS (zero runtime).

### Alternativas Consideradas
- **Styled Components:** Popular, mas runtime overhead
- **Emotion:** Performático, mas ainda runtime
- **CSS Modules:** OK, mas menos produtivo que Tailwind

### Consequências

**Positivas:**
- Zero JavaScript runtime
- Melhor performance
- Menor bundle size
- Server Components friendly

**Negativas:**
- Sem dynamic styles baseados em props (mas Tailwind resolve via classes condicionais)
- HTML pode ficar verboso

---

## ADR-012: Shadcn/ui ao invés de Component Library

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
Component libraries tradicionais (MUI, Chakra) aumentam bundle size e limitam customização.

### Decisão
Usar shadcn/ui (copy-paste components) ao invés de instalar biblioteca completa.

### Alternativas Consideradas
- **MUI:** Bundle grande, difícil customizar
- **Chakra UI:** Melhor que MUI, mas ainda limita customização
- **Ant Design:** Muito enterprise, difícil customizar
- **Headless UI:** Sem estilos (mais trabalho)

### Consequências

**Positivas:**
- Controle total do código (está no seu repo)
- Apenas o que você usa (tree-shakeable)
- Fácil customizar
- Acessibilidade (Radix UI base)
- Menor bundle size

**Negativas:**
- Precisa adicionar componentes um por um
- Atualizações manuais (não via npm update)
- Mais código no repo

---

## ADR-013: Path Aliases (@/ notation)

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
Imports relativos ficam confusos: `../../../components/ui/button`

### Decisão
Usar path aliases com `@/` notation: `@/components/ui/button`

### Alternativas Consideradas
- **Imports relativos:** Funciona, mas confuso
- **Outros prefixes:** `~`, `#` (menos comum)

### Consequências

**Positivas:**
- Imports mais limpos
- Refactoring mais fácil (mover arquivos)
- Autocomplete funciona melhor

**Negativas:**
- Configuração extra (tsconfig, jest)
- Pode confundir iniciantes

---

## ADR-014: ESLint + Prettier + Husky

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
Precisamos garantir qualidade e consistência de código.

### Decisão
Usar ESLint para linting + Prettier para formatação + Husky para git hooks.

### Alternativas Consideradas
- **Apenas ESLint:** Sem auto-format
- **Apenas Prettier:** Sem validação de regras
- **Sem hooks:** Depende de disciplina manual

### Consequências

**Positivas:**
- Código consistente
- Catch erros antes do commit
- Auto-format on save
- Menos discussões sobre estilo

**Negativas:**
- Setup inicial mais complexo
- Commits podem ser rejeitados (se lint falhar)

---

## ADR-015: React Query ao invés de Server Actions (para data fetching)

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
Next.js 15 tem Server Actions, mas projeto já tem API externa.

### Decisão
Usar React Query para data fetching ao invés de Server Actions.

### Alternativas Consideradas
- **Server Actions:** Bom para Next.js full-stack, mas temos API separada
- **Server Components com fetch:** Sem cache client-side

### Consequências

**Positivas:**
- API externa já existe (não vamos reescrever no Next.js)
- Cache client-side inteligente
- Melhor UX (optimistic updates, loading states)

**Negativas:**
- Não usa feature nativa do Next.js 15
- Mais código client-side

**Nota:** Podemos usar Server Actions para formulários específicos no futuro, mas React Query é principal.

---

## ADR-016: Sem GraphQL

**Status:** ✅ Aceita
**Data:** 2025-01-15

### Contexto
API backend é REST, não GraphQL.

### Decisão
Usar REST API diretamente, sem adicionar GraphQL layer.

### Alternativas Consideradas
- **Adicionar GraphQL wrapper:** Overkill para esse projeto
- **Migrar backend para GraphQL:** Muito trabalho

### Consequências

**Positivas:**
- Simplicidade
- API já está pronta e testada
- Menos overhead

**Negativas:**
- Over-fetching em alguns casos (aceito)
- Múltiplas requests em algumas telas (poderia ser resolvido com GraphQL)

---

## ADR-017: Vitest ao invés de Jest

**Status:** ✅ Aceita (quando implementar testes)
**Data:** 2025-01-15

### Contexto
Precisamos de test runner para unit tests.

### Decisão
Usar Vitest quando implementarmos testes.

### Alternativas Consideradas
- **Jest:** Mais maduro, mas mais lento
- **Node test runner:** Muito básico

### Consequências

**Positivas:**
- Muito mais rápido que Jest
- API compatível com Jest
- Melhor integração com Vite/ES modules
- Watch mode excelente

**Negativas:**
- Menos maduro que Jest
- Algumas libs podem ter problemas (raro)

---

## ADR-018: Playwright para E2E

**Status:** ✅ Aceita (quando implementar testes)
**Data:** 2025-01-15

### Contexto
Precisamos testar fluxos completos (E2E).

### Decisão
Usar Playwright para E2E testing.

### Alternativas Consideradas
- **Cypress:** Popular, mas Playwright é mais rápido
- **Selenium:** Antigo, complexo

### Consequências

**Positivas:**
- Multi-browser (Chromium, Firefox, WebKit)
- Muito rápido
- Excelente DevTools
- Auto-wait inteligente

**Negativas:**
- Curva de aprendizado
- Testes E2E sempre são mais lentos

---

## Decisões a Revisar no Futuro

### Dark Mode
**Status:** 🤔 A decidir

Implementar tema dark? Adiciona complexidade, mas usuários podem gostar.

**Prós:** UX melhor em ambientes escuros
**Contras:** Mais trabalho, testar duas versões

### Internacionalização (i18n)
**Status:** 🤔 A decidir

Adicionar suporte a inglês além de pt-BR?

**Prós:** Alcance maior
**Contras:** Manutenção de traduções

### Monorepo
**Status:** ❌ Não necessário agora

Se crescer muito, considerar monorepo com Turborepo.

---

## Princípios Gerais

1. **KISS (Keep It Simple, Stupid)**
   - Preferir soluções simples
   - Não over-engineer

2. **YAGNI (You Aren't Gonna Need It)**
   - Não adicionar features "por precaução"
   - Implementar quando realmente necessário

3. **DRY (Don't Repeat Yourself)**
   - Reutilizar componentes e lógica
   - Mas não abstrair prematuramente

4. **Progressive Enhancement**
   - Funcionar sem JavaScript (quando possível)
   - Melhorar progressivamente

5. **Performance First**
   - Considerar performance em cada decisão
   - Medir antes de otimizar

---

**Última atualização:** 2025-01-15
**Versão:** 1.0.0

**Nota:** Este documento é vivo. Adicionar novas decisões conforme projeto evolui.
