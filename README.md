# Kitnet Manager - Frontend

Sistema de gestão completo para administração de 31 kitnets - Frontend desenvolvido com Next.js 15.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)](https://tailwindcss.com)

---

## 🚀 Quick Start

### Prerequisites

- [Node.js 18+](https://nodejs.org)
- [npm](https://www.npmjs.com) ou [yarn](https://yarnpkg.com)

### Installation

```bash
# Clone o repositório
git clone https://github.com/lucianogabriel/kitnet-manager-frontend.git
cd kitnet-manager-frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Rode o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Credenciais Padrão

```
Username: admin
Password: admin123
```

**⚠️ ALTERAR APÓS PRIMEIRO ACESSO!**

---

## 📋 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Cria build de produção
npm start            # Inicia servidor de produção
npm run lint         # Executa ESLint
npm run lint:fix     # Executa ESLint e corrige problemas
npm run format       # Formata código com Prettier
npm run type-check   # Verifica tipos TypeScript
```

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router)
- **Language:** [TypeScript 5](https://www.typescriptlang.org)
- **Styling:** [TailwindCSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **State Management:** [TanStack Query](https://tanstack.com/query) + [Zustand](https://zustand-demo.pmnd.rs)
- **Forms:** [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- **HTTP Client:** [Axios](https://axios-http.com)
- **Date Utils:** [date-fns](https://date-fns.org)
- **Icons:** [Lucide React](https://lucide.dev)

---

## 📁 Estrutura do Projeto

```
front-kitnet-manager/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Rotas de autenticação
│   ├── (dashboard)/            # Rotas protegidas
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Estilos globais
│
├── src/
│   ├── components/             # Componentes React
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Header, Sidebar, etc
│   │   ├── dashboard/          # Componentes do dashboard
│   │   ├── units/              # Componentes de unidades
│   │   ├── tenants/            # Componentes de inquilinos
│   │   ├── leases/             # Componentes de contratos
│   │   ├── payments/           # Componentes de pagamentos
│   │   └── shared/             # Componentes compartilhados
│   │
│   ├── lib/
│   │   ├── api/                # Axios client
│   │   ├── queries/            # React Query hooks
│   │   ├── stores/             # Zustand stores
│   │   ├── utils/              # Utility functions
│   │   └── hooks/              # Custom hooks
│   │
│   ├── types/                  # TypeScript types
│   │   └── api/                # API types
│   │
│   ├── schemas/                # Zod validation schemas
│   │
│   └── config/                 # Configurações
│       ├── env.ts              # Variáveis de ambiente
│       ├── site.ts             # Metadados do site
│       └── navigation.ts       # Navegação
│
├── public/                     # Assets estáticos
│
├── frontend-docs/              # Documentação da API
│
├── ARCHITECTURE.md             # Arquitetura detalhada
├── ROADMAP.md                  # Roadmap de desenvolvimento
├── STACK.md                    # Stack tecnológica
├── DECISIONS.md                # Decisões arquiteturais
└── CLAUDE.md                   # Instruções para Claude Code
```

---

## 🔑 Funcionalidades

### ✅ Implementadas (Sprint 0)

- ✅ Setup completo do projeto Next.js 15
- ✅ Configuração de TypeScript + ESLint + Prettier
- ✅ shadcn/ui componentes base instalados
- ✅ Axios client configurado
- ✅ React Query setup
- ✅ Zustand stores (auth, UI)
- ✅ Utilities (format, validation, calculations)
- ✅ Estrutura de pastas completa

### 🚧 Em Desenvolvimento (Sprint 1)

- [ ] Sistema de autenticação (Login/Logout)
- [ ] Layout principal (Header + Sidebar)
- [ ] Proteção de rotas
- [ ] Dashboard home

### 📅 Planejadas (Sprints 2-9)

Veja [ROADMAP.md](./ROADMAP.md) para detalhes completos.

---

## 🌐 API Backend

**Production URL:** https://kitnet-manager-production.up.railway.app
**Swagger Docs:** https://kitnet-manager-production.up.railway.app/swagger/index.html

### Base URL
```
https://kitnet-manager-production.up.railway.app/api/v1
```

Toda a documentação da API está disponível em [frontend-docs/](./frontend-docs/).

---

## 🎨 Design System

Usando **shadcn/ui** com tema customizado:

- **Colors:** Neutral base
- **Border Radius:** Medium
- **Animations:** Enabled (tw-animate-css)
- **Icons:** Lucide React

Para adicionar novos componentes:

```bash
npx shadcn@latest add [component-name]
```

---

## 📚 Documentação

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitetura detalhada
- **[STACK.md](./STACK.md)** - Stack tecnológica completa
- **[ROADMAP.md](./ROADMAP.md)** - Roadmap de desenvolvimento
- **[DECISIONS.md](./DECISIONS.md)** - Decisões arquiteturais (ADRs)
- **[frontend-docs/](./frontend-docs/)** - Documentação da API backend

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nova funcionalidade
fix: correção de bug
docs: mudanças na documentação
style: formatação, ponto e vírgula, etc
refactor: refatoração de código
test: adição de testes
chore: tarefas de manutenção
```

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Luciano Gabriel**

- GitHub: [@lucianoZgabriel](https://github.com/lucianoZgabriel)
- LinkedIn: [Luciano Gabriel](https://linkedin.com/in/lucianogabriel)

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org) - Framework React incrível
- [shadcn/ui](https://ui.shadcn.com) - Componentes acessíveis e customizáveis
- [Vercel](https://vercel.com) - Plataforma de deploy

---

**Made with ❤️ and Next.js**
