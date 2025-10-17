# 🚀 Guia de Deploy - Kitnet Manager Frontend

Este documento contém o passo a passo completo para fazer o deploy da aplicação na Vercel.

---

## 📋 Pré-requisitos

- ✅ Código no GitHub/GitLab/Bitbucket
- ✅ Conta na [Vercel](https://vercel.com) (gratuita)
- ✅ Build funcionando localmente (`npm run build`)
- ✅ Variáveis de ambiente documentadas

---

## 🎯 Método 1: Deploy via Interface Web (RECOMENDADO)

### Passo 1: Preparar o Repositório

1. **Certifique-se de que seu código está no GitHub**
   ```bash
   git status
   git add .
   git commit -m "chore: prepare for deployment"
   git push origin main
   ```

2. **Verifique se os arquivos essenciais estão commitados:**
   - ✅ `vercel.json`
   - ✅ `.env.example`
   - ✅ `package.json`
   - ✅ `next.config.ts`

### Passo 2: Conectar na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Faça login com sua conta GitHub
3. Clique em **"Import Project"**
4. Selecione o repositório `front-kitnet-manager`
5. Clique em **"Import"**

### Passo 3: Configurar o Projeto

A Vercel detectará automaticamente que é um projeto Next.js. Você verá:

```
Framework Preset: Next.js
Build Command: npm run build (ou detectado automaticamente)
Output Directory: .next (detectado automaticamente)
Install Command: npm install
Development Command: npm run dev
```

**NÃO altere nada aqui.** A Vercel já detectou tudo corretamente.

### Passo 4: Configurar Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://kitnet-manager-production.up.railway.app/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | `Kitnet Manager` |
| `NEXT_PUBLIC_APP_VERSION` | `1.0.0` |

**⚠️ IMPORTANTE:**
- Certifique-se de que as variáveis estão em **Production**, **Preview** e **Development**
- As variáveis `NEXT_PUBLIC_*` são expostas no client-side (isso é esperado)

### Passo 5: Deploy!

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos
3. ✅ Deploy concluído!

Você verá uma tela com:
- 🎉 Congratulations!
- URL do projeto: `https://seu-projeto.vercel.app`

### Passo 6: Testar a Aplicação

1. Clique na URL do projeto
2. Teste o login:
   - **Usuário:** `admin`
   - **Senha:** `admin123`
3. Navegue pelas páginas principais
4. Teste criar uma unidade
5. Verifique se a API está respondendo

---

## ⚡ Método 2: Deploy via CLI (Avançado)

### Instalação da CLI

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

### Deploy

```bash
# Deploy em preview (para testar)
vercel

# Deploy em production
vercel --prod
```

### Configurar Variáveis de Ambiente via CLI

```bash
vercel env add NEXT_PUBLIC_API_URL production
# Cole o valor: https://kitnet-manager-production.up.railway.app/api/v1

vercel env add NEXT_PUBLIC_APP_NAME production
# Cole o valor: Kitnet Manager

vercel env add NEXT_PUBLIC_APP_VERSION production
# Cole o valor: 1.0.0
```

---

## 🔧 Configurações da Vercel

### vercel.json Explicado

```json
{
  "framework": "nextjs",
  "regions": ["gru1"],  // São Paulo - melhor latência para Brasil
  "headers": [...],     // Security headers (XSS, clickjacking, etc)
  "rewrites": [...]     // SPA routing (todas as rotas vão para /)
}
```

### Regiões Disponíveis

- `gru1` - São Paulo, Brazil (RECOMENDADO)
- `iad1` - Washington, D.C., USA
- `sfo1` - San Francisco, USA

**Para aplicação brasileira, use `gru1` para melhor performance.**

---

## 🌐 Configurar Domínio Customizado (Opcional)

### Passo 1: Adicionar Domínio

1. Vá em **Settings** > **Domains**
2. Adicione seu domínio (ex: `kitnet-manager.com.br`)
3. A Vercel fornecerá instruções de DNS

### Passo 2: Configurar DNS

Configure no seu provedor de domínio:

**Para domínio raiz (kitnet-manager.com.br):**
```
Tipo: A
Nome: @
Valor: 76.76.21.21
```

**Para subdomínio (www.kitnet-manager.com.br):**
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

### Passo 3: Aguardar Propagação

- DNS pode levar até 48h para propagar
- Geralmente leva 5-15 minutos
- A Vercel verificará automaticamente

---

## 📊 Monitoramento e Analytics

### Vercel Analytics (Gratuito)

1. Vá em **Analytics** no dashboard da Vercel
2. Ative o **Web Vitals**
3. Veja métricas em tempo real:
   - Page views
   - Top pages
   - Top referrers
   - Real User Monitoring (RUM)

### Vercel Speed Insights (Gratuito)

1. Instale o pacote:
   ```bash
   npm install @vercel/speed-insights
   ```

2. Adicione no `app/layout.tsx`:
   ```tsx
   import { SpeedInsights } from '@vercel/speed-insights/next'

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <SpeedInsights />
         </body>
       </html>
     )
   }
   ```

3. Commit e push:
   ```bash
   git add .
   git commit -m "feat: add Vercel Speed Insights"
   git push
   ```

---

## 🐛 Error Tracking com Sentry (Opcional)

### Instalação

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Configuração

Siga o wizard interativo. Ele criará:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`

### Variáveis de Ambiente na Vercel

Adicione na Vercel:
```
SENTRY_DSN=sua_dsn_aqui
SENTRY_ORG=sua_org
SENTRY_PROJECT=seu_projeto
```

---

## 🔄 CI/CD - Deploy Automático

### Configuração Atual

A Vercel já está configurada para:

✅ **Deploy automático em cada push para `main`**
- Push para `main` → Deploy em Production

✅ **Preview deploy para cada Pull Request**
- Abrir PR → Deploy de preview
- URL única para testar antes do merge

✅ **Deploy apenas se o build passar**
- Se `npm run build` falhar, deploy não acontece

### Branches

| Branch | Ambiente | URL |
|--------|----------|-----|
| `main` | Production | `https://kitnet-manager.vercel.app` |
| `develop` | Preview | `https://kitnet-manager-git-develop.vercel.app` |
| PR #123 | Preview | `https://kitnet-manager-git-pr-123.vercel.app` |

### Proteger Branch Main

No GitHub:

1. Vá em **Settings** > **Branches**
2. Adicione **Branch protection rule**
3. Branch name pattern: `main`
4. Ative:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require conversation resolution before merging

---

## 🚨 Troubleshooting

### Build falha na Vercel

**Erro:** `Module not found`

**Solução:**
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

Se funcionar localmente, commitar e fazer push do `package-lock.json` atualizado.

---

### Variáveis de ambiente não funcionam

**Sintomas:** API retorna 404, aplicação não conecta no backend

**Solução:**
1. Vá em **Settings** > **Environment Variables**
2. Verifique se `NEXT_PUBLIC_API_URL` está correta
3. Clique em **Redeploy** (não precisa mudar código)

**⚠️ IMPORTANTE:** Variáveis de ambiente precisam do prefixo `NEXT_PUBLIC_` para funcionar no client-side.

---

### Erro 404 ao navegar

**Sintomas:** Página funciona, mas ao dar refresh retorna 404

**Solução:** Já está resolvido pelo `vercel.json` (rewrites configurados)

Se ainda ocorrer:
1. Verifique se `vercel.json` está commitado
2. Faça redeploy

---

### Deploy muito lento

**Solução:**
1. Verifique região: deve ser `gru1` (São Paulo)
2. Vá em **Settings** > **General** > **Region**
3. Mude para `gru1`
4. Redeploy

---

### Aplicação funciona localmente mas não na Vercel

**Checklist:**

- [ ] Variáveis de ambiente configuradas?
- [ ] Build passa localmente? (`npm run build`)
- [ ] TypeScript sem erros? (`npm run type-check`)
- [ ] ESLint sem erros? (`npm run lint`)
- [ ] `.env.local` não foi commitado? (deve estar no `.gitignore`)
- [ ] Todas as dependências estão no `package.json`? (não em `devDependencies`)

---

## 📈 Performance Otimização

### Checklist Pós-Deploy

- [ ] Lighthouse Score > 90 (rodar no Chrome DevTools)
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.5s
- [ ] Cumulative Layout Shift < 0.1

### Como Testar

1. Abra Chrome DevTools (F12)
2. Vá em **Lighthouse**
3. Selecione **Performance** e **Best Practices**
4. Clique em **Analyze page load**

### Melhorias Comuns

Se performance estiver ruim:

1. **Imagens grandes?**
   - Use `next/image` (já está configurado)
   - Comprima imagens (TinyPNG, Squoosh)

2. **Bundle muito grande?**
   ```bash
   npm install -D @next/bundle-analyzer
   ```

   Em `next.config.ts`:
   ```ts
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   })

   module.exports = withBundleAnalyzer({
     // sua config
   })
   ```

   Analisar:
   ```bash
   ANALYZE=true npm run build
   ```

3. **Muitas re-renderizações?**
   - Use React DevTools Profiler
   - Adicione `React.memo` onde necessário
   - Use `useMemo` e `useCallback`

---

## 🔐 Segurança

### Headers de Segurança

Já configurados no `vercel.json`:

- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: DENY`
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`

### HTTPS

✅ Vercel fornece HTTPS automático (Let's Encrypt)

### Environment Variables

⚠️ **NUNCA commitar `.env.local`** (já está no `.gitignore`)

Variáveis sensíveis (API keys, secrets):
- Adicionar na Vercel UI (Settings > Environment Variables)
- Nunca expor no client-side (sem prefixo `NEXT_PUBLIC_`)

---

## 📞 Suporte

### Recursos Oficiais

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Logs da Vercel

1. Vá no dashboard da Vercel
2. Clique no deployment
3. Veja os logs em tempo real
4. Filtre por:
   - Build logs
   - Function logs
   - Edge logs

---

## ✅ Checklist Final

Antes de considerar o deploy concluído:

- [ ] Aplicação acessível via URL da Vercel
- [ ] Login funcionando (admin/admin123)
- [ ] Dashboard carregando com dados da API
- [ ] CRUD de unidades funcionando
- [ ] CRUD de inquilinos funcionando
- [ ] CRUD de contratos funcionando
- [ ] Pagamentos funcionando
- [ ] Relatórios funcionando
- [ ] Configurações funcionando
- [ ] Mobile responsivo
- [ ] Performance aceitável (Lighthouse > 80)
- [ ] Sem erros no console do browser
- [ ] Variáveis de ambiente corretas

---

## 🎉 Próximos Passos

Após o deploy básico funcionando:

1. **Fase 2: Melhorias** (opcional)
   - [ ] Configurar domínio customizado
   - [ ] Ativar Vercel Analytics
   - [ ] Ativar Speed Insights
   - [ ] Configurar Sentry (error tracking)

2. **Fase 3: Otimizações** (opcional)
   - [ ] Análise de bundle size
   - [ ] Implementar lazy loading
   - [ ] Otimizar imagens
   - [ ] Adicionar service worker (PWA)

3. **Fase 4: Monitoramento** (opcional)
   - [ ] Configurar alertas no Sentry
   - [ ] Dashboard de métricas
   - [ ] Uptime monitoring

---

**Criado em:** 2025-01-15
**Versão:** 1.0.0
**Última atualização:** Sprint 9 - Production Ready
