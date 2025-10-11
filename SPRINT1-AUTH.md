# Sprint 1 - Autenticacao (Authentication)

## Implementado

### 1. API Client (src/lib/api/client.ts)

**Configuracoes:**
- Base URL configurada via variavel de ambiente
- Timeout de 30 segundos
- Interceptors de request e response implementados

**Request Interceptor:**
- Adiciona automaticamente o token JWT no header Authorization: Bearer {token}
- Le o token do Zustand persist storage (auth-storage)

**Response Interceptor:**
- Retorna a resposta completa da API (nao apenas data)
- Trata erro 401 (Unauthorized):
  - Remove token do localStorage
  - Redireciona para /login (exceto se ja estiver em /login)
- Retorna erros formatados com message, status, data e originalError

---

### 2. Auth Types (src/types/api/auth.ts)

**Types existentes:**
- User - Dados do usuario
- UserRole - Roles: admin, manager, viewer
- LoginRequest / LoginResponse
- RefreshTokenRequest / RefreshTokenResponse
- CreateUserRequest
- ChangePasswordRequest
- ChangeRoleRequest

**Adicionado:**
- ApiResponse<T> - Wrapper generico para respostas da API

---

### 3. Auth Service (src/lib/api/auth.service.ts)

Servico completo com todos os endpoints de autenticacao da API.

**Metodos implementados:**
- login(credentials) - POST /auth/login
- getCurrentUser() - GET /auth/me
- refreshToken(token) - POST /auth/refresh
- createUser(userData) - POST /auth/users (Admin only)
- listUsers() - GET /auth/users (Admin only)
- getUserById(id) - GET /auth/users/:id (Admin only)
- changePassword(data) - POST /auth/change-password
- changeUserRole(userId, role) - PATCH /auth/users/:id/role (Admin only)
- deactivateUser(userId) - POST /auth/users/:id/deactivate (Admin only)
- activateUser(userId) - POST /auth/users/:id/activate (Admin only)

Todos os metodos retornam Promise<ApiResponse<T>> com tipagem adequada.

---

### 4. Auth Store (src/lib/stores/auth-store.ts)

Zustand store com persist middleware.

**State:**
- user: User | null
- token: string | null

**Actions:**
- setAuth(user, token) - Define usuario e token
- clearAuth() - Limpa autenticacao

**Helper functions:**
- getAuthToken() - Pega token fora de componentes React
- getAuthUser() - Pega usuario fora de componentes React
- setAuth() - Define auth fora de componentes React
- clearAuth() - Limpa auth fora de componentes React

**Persistencia:** localStorage com chave auth-storage

---

### 5. Auth Context (src/contexts/auth-context.tsx)

React Context para gerenciar estado de autenticacao globalmente.

**Provider:** AuthProvider

**Funcionalidades:**
- Inicializacao automatica ao carregar (verifica token e busca dados do usuario)
- Metodo login com feedback via toast
- Metodo logout com feedback via toast
- Metodo refreshUser para atualizar dados do usuario
- Estado isLoading para indicadores de carregamento
- Estado isAuthenticated calculado

**Hook exportado:** useAuth()

---

### 6. useAuth Hook (src/hooks/use-auth.ts)

Re-exportacao do hook do contexto para importacao semantica.

---

### 7. Providers (app/providers.tsx)

Client Component que agrupa todos os providers da aplicacao:
- React Query Client
- Auth Provider
- Sonner Toaster (para notificacoes)

---

### 8. Root Layout (app/layout.tsx)

Layout principal atualizado:
- Idioma alterado para pt-BR
- Titulo alterado para "Kitnet Manager"
- Descricao atualizada
- Providers integrado ao layout

---

## Estrutura de Arquivos

```
src/
├── types/api/
│   └── auth.ts                    ✅ Types de autenticacao (atualizado)
├── lib/
│   ├── api/
│   │   ├── client.ts              ✅ API Client (melhorado)
│   │   └── auth.service.ts        ✅ Auth Service (novo)
│   └── stores/
│       └── auth-store.ts          ✅ Zustand store (ja existia)
├── contexts/
│   └── auth-context.tsx           ✅ Auth Context (novo)
└── hooks/
    └── use-auth.ts                ✅ useAuth hook (novo)

app/
├── layout.tsx                     ✅ Root layout (atualizado)
└── providers.tsx                  ✅ Providers wrapper (novo)
```

---

## Testes Realizados

- Build de producao: Compilado com sucesso
- Dev server: Iniciando corretamente
- TypeScript: Sem erros de tipo
- ESLint: Warnings resolvidos

---

## Proximos Passos

1. Criar pagina de Login
2. Criar middleware de autenticacao
3. Criar componente ProtectedRoute ou HOC
4. Implementar refresh token automatico
5. Adicionar React Query hooks para auth

---

## Referencias

- Backend API: https://kitnet-manager-production.up.railway.app
- Swagger Docs: https://kitnet-manager-production.up.railway.app/swagger/index.html
- Documentacao API: frontend-docs/endpoints/auth.md
- Credenciais padrao: admin / admin123

---

**Status:** API Client e Auth Context implementados e funcionando
