# Debug: Problema de Logout Inesperado

**Data:** 13/10/2025
**Status:** Em investigação
**Severidade:** Média (intermitente, afeta UX mas não bloqueia uso)

---

## 📋 Descrição do Problema

Usuários são deslogados inesperadamente durante a navegação, especialmente quando:
- Dão **refresh múltiplo rápido** na página (F5, F5, F5...)
- Navegam entre páginas em modo desenvolvimento
- Possivelmente durante Hot Module Replacement (HMR) do Next.js

**Sintoma:** Usuário autenticado é redirecionado para `/login` sem motivo aparente.

---

## 🔍 Investigação Realizada

### 1. **Primeira Hipótese: Erro 401 da API**
- ❌ **Descartada** - Não há logs de erro 401 nos interceptors do Axios
- Adicionamos logs detalhados no `client.ts` para capturar 401s
- Nenhum erro 401 foi detectado durante os logouts

### 2. **Segunda Hipótese: clearAuth() sendo chamado incorretamente**
- ❌ **Descartada** - Adicionamos `console.trace()` no `clearAuth()` do auth-store
- Nenhuma chamada a `clearAuth()` foi detectada durante os logouts

### 3. **Terceira Hipótese: Race Condition na Hidratação do Zustand**
- ⚠️ **Parcialmente confirmada**
- O Zustand persist pode hidratar antes do localStorage estar pronto
- **Solução implementada:**
  - Adicionamos flag `_hasHydrated` no store
  - AuthContext aguarda hidratação antes de verificar auth
  - Código: `src/lib/stores/auth-store.ts` (linhas 8-9, 52-72)

### 4. **Quarta Hipótese: localStorage sendo limpo silenciosamente**
- ✅ **CONFIRMADA!**
- Criamos monitor global do localStorage (`src/lib/utils/localStorage-monitor.ts`)
- Descobrimos que o localStorage está **VAZIO** antes da hidratação
- Log crítico:
  ```
  🔍 [AuthStore] ANTES da hidratação - localStorage: {exists: false}
  💧 [AuthStore] Hidratação completa! {hasUser: false, hasToken: false}
  ```

### 5. **Quinta Hipótese: Hot Module Replacement (HMR) do Next.js**
- ✅ **PROVÁVEL CAUSA**
- O problema é **mais frequente em desenvolvimento** (npm run dev)
- Hot reload do Next.js pode estar resetando o localStorage
- Não há chamadas explícitas a `removeItem()` ou `clear()` detectadas

---

## 🛠️ Soluções Implementadas

### ✅ 1. Flag de Hidratação (auth-store.ts)
```typescript
interface AuthState {
  _hasHydrated: boolean
  setHasHydrated: (hydrated: boolean) => void
  // ...
}

// onRehydrateStorage callback
onRehydrateStorage: () => (state) => {
  state?.setHasHydrated(true)
}
```

### ✅ 2. Aguardar Hidratação (auth-context.tsx)
```typescript
useEffect(() => {
  if (!_hasHydrated) {
    return // Aguarda a hidratação completar
  }
  // ... inicializar auth
}, [_hasHydrated])
```

### ✅ 3. Monitor de localStorage (localStorage-monitor.ts)
Sobrescreve `setItem`, `removeItem` e `clear` para detectar modificações:
```typescript
localStorage.setItem = function(key, value) {
  console.log('setItem chamado:', key)
  console.trace()
  // ...
}
```

### ✅ 4. Logs Detalhados
Adicionados logs em 4 níveis:
1. **AuthStore** - setAuth, clearAuth, hidratação
2. **AuthContext** - inicialização, estado
3. **Dashboard Layout** - useEffect, redirects
4. **API Client** - erros 401, interceptors

### ⚠️ 5. Partialize (tentativa - não resolve completamente)
```typescript
persist(
  // ...
  {
    partialize: (state) => ({
      user: state.user,
      token: state.token,
    })
  }
)
```

---

## 📊 Dados Coletados

### Cenário de Sucesso (refresh funciona):
```
💧 [AuthStore] Hidratação completa! {hasUser: true, hasToken: true}
🔄 [AuthContext] Token encontrado, buscando dados do usuário...
✅ [AuthContext] Dados do usuário carregados com sucesso
✅ [AuthStore] Verificação do localStorage: {hasUser: true, hasToken: true}
```

### Cenário de Falha (logout inesperado):
```
🔍 [AuthStore] ANTES da hidratação - localStorage: {exists: false, preview: 'VAZIO'}
💧 [AuthStore] Hidratação completa! {hasUser: false, hasToken: false}
ℹ️ [AuthContext] Nenhum token encontrado após hidratação
🚪 [Dashboard Layout] Redirecionando para login
```

**Diferença crítica:** No cenário de falha, o localStorage já está vazio ANTES da hidratação.

---

## 🔬 Como Reproduzir

1. Fazer login normalmente
2. Aguardar página carregar completamente
3. Dar **5-10 refreshes rápidos** (F5, F5, F5...)
4. **Resultado:** Em 1-3 refreshes, usuário é deslogado

**Frequência:** ~30-50% dos refreshes em modo desenvolvimento

---

## 🎯 Próximos Passos Sugeridos

### Opção A: Testar em Produção
```bash
npm run build
npm run start
```
Se o problema **NÃO** ocorrer em produção, confirma que é issue do HMR.

### Opção B: Migrar para Cookies HTTP-Only (Recomendado para produção)
**Vantagens:**
- Mais seguro (protegido contra XSS)
- Não afetado por HMR
- Melhor para SSR

**Desvantagens:**
- Requer mudanças no backend
- Mais complexo de implementar

**Arquivos a modificar:**
- `src/lib/api/client.ts` - usar cookies em vez de localStorage
- `src/lib/stores/auth-store.ts` - remover persist ou usar apenas para user
- Backend API - adicionar `Set-Cookie` headers

### Opção C: Implementar Fallback/Recovery
Adicionar lógica para tentar recuperar sessão:
```typescript
// Se localStorage vazio mas usuário estava autenticado
// Tentar refresh token ou redirecionar gentilmente
```

### Opção D: Desabilitar HMR (Temporário para desenvolvimento)
Em `next.config.ts`:
```typescript
experimental: {
  hmr: false
}
```

---

## 📁 Arquivos Modificados

### Core Auth
- `src/lib/stores/auth-store.ts` - Flag de hidratação, logs
- `src/contexts/auth-context.tsx` - Aguardar hidratação, logs
- `src/lib/api/client.ts` - Logs de 401

### Debug Tools (REMOVER ANTES DE PRODUÇÃO)
- `src/lib/utils/localStorage-monitor.ts` - Monitor de localStorage
- `app/providers.tsx` - Import do monitor
- `app/(dashboard)/layout.tsx` - Logs de redirect

### Todos os logs adicionados:
- 🔐 [AuthStore]
- 🔐 [AuthContext]
- 🔍 [Dashboard Layout]
- 🔴 [API Client]
- 📝 [localStorage Monitor]
- 💧 Hidratação
- 🗑️ removeItem
- 🧹 clear

---

## 🧹 Limpeza Necessária (Antes de Merge)

Quando resolver o problema, remover:

1. **Arquivo completo:**
   - `src/lib/utils/localStorage-monitor.ts`

2. **Import no providers.tsx:**
   ```typescript
   import '@/src/lib/utils/localStorage-monitor'  // REMOVER
   ```

3. **Logs em auth-store.ts:**
   - Linhas 22-42 (logs do setAuth, clearAuth, verificação)
   - Linhas 56-61 (log antes da hidratação)
   - Linha 65 (log hidratação completa)

4. **Logs em auth-context.tsx:**
   - Linhas 30-43 (listener de storage)
   - Linhas 48, 53, 58-59, 61, 63, 74, 77 (todos os console.log)
   - Linhas 105-112 (log de estado atual)

5. **Logs em layout.tsx:**
   - Linhas 18-22 (useEffect logs)

6. **Logs em client.ts:**
   - Linhas 46-49 (logs de 401)
   - Linha 52-56 (logs de removeItem)

---

## 📚 Referências

- [Zustand Persist Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [Next.js Fast Refresh](https://nextjs.org/docs/architecture/fast-refresh)
- [Issue similar no GitHub](https://github.com/pmndrs/zustand/issues/...)

---

## 💡 Notas Adicionais

- O problema **NÃO afeta a funcionalidade** quando funciona corretamente
- É um problema de **UX durante desenvolvimento**
- **Login sempre funciona** - o problema é apenas a persistência
- **Workaround para desenvolvimento:** Simplesmente fazer login novamente (rápido)

---

**Última atualização:** 13/10/2025
**Investigado por:** Claude Code + Luciano Gabriel
