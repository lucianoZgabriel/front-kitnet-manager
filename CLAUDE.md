# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MANDATORY INSTRUCTIONS

**⚠️ EXECUTION MODE - CRITICAL:**
- **NEVER execute tools or tasks in CONCURRENT/PARALLEL mode**
- **ALWAYS execute tools SEQUENTIALLY (one at a time)**
- This prevents API errors and conversation loss
- Wait for each tool to complete before executing the next one
- Examples:
  - ❌ BAD: Making multiple Read/Glob/Bash calls in a single response
  - ✅ GOOD: Make one call, wait for result, then make the next call
  - ❌ BAD: Using Task tool to launch multiple agents simultaneously
  - ✅ GOOD: Complete one task/agent fully before starting another
- EXCEPTION: Only use parallel execution when explicitly requested by the user with phrases like "in parallel" or "concurrently"

**⚠️ FILE ENCODING - CRITICAL:**
- **ALL files MUST be created with UTF-8 encoding**
- **ALL Portuguese text MUST use proper accents and special characters**
- Examples of CORRECT usage:
  - ✅ "Usuário" (NOT "Usuario")
  - ✅ "Função" (NOT "Funcao")
  - ✅ "Informações" (NOT "Informacoes")
  - ✅ "Autenticação" (NOT "Autenticacao")
  - ✅ "Próximos" (NOT "Proximos")
  - ✅ "Gestão" (NOT "Gestao")
  - ✅ "válido" (NOT "valido")
- When creating files, ALWAYS verify encoding is UTF-8
- Use Edit tool (not Write tool with bash heredoc) for files with Portuguese text
- Never use ISO-8859 or other non-UTF-8 encodings
  - ✅ "Próximos" (NOT "Proximos")
  - ✅ "Gestão" (NOT "Gestao")
  - ✅ "válido" (NOT "valido")
- When creating files, ALWAYS verify encoding is UTF-8
- Use Edit tool (not Write tool with bash heredoc) for files with Portuguese text
- Never use ISO-8859 or other non-UTF-8 encodings

## Project Overview

This is the **frontend documentation repository** for Kitnet Manager - a property management system for administering 31 rental units (kitnets). The repository contains comprehensive API documentation, TypeScript type definitions, and integration guides for building the frontend application.

**Backend API:** https://kitnet-manager-production.up.railway.app
**API Docs (Swagger):** https://kitnet-manager-production.up.railway.app/swagger/index.html

## Repository Structure

```
frontend-docs/
├── README.md                  # Documentation index and quick start
├── API.md                     # Complete API reference and examples
├── SUMMARY.md                 # Quick reference summary
├── validation-rules.md        # Business rules and validation logic
├── examples.md                # Code examples and utilities
├── types/                     # TypeScript type definitions
│   ├── auth.ts                # Authentication & user types
│   ├── unit.ts                # Unit/property types
│   ├── tenant.ts              # Tenant/renter types
│   ├── lease.ts               # Contract/lease types
│   ├── payment.ts             # Payment types
│   └── dashboard.ts           # Dashboard & report types
└── endpoints/                 # Detailed endpoint documentation
    ├── auth.md
    ├── units.md
    ├── tenants.md
    ├── leases.md
    ├── payments.md
    └── dashboard.md
```

## API Integration

### Base Configuration

- **Production URL:** `https://kitnet-manager-production.up.railway.app/api/v1`
- **Authentication:** JWT Bearer tokens (24h expiry)
- **Default Credentials:** `admin` / `admin123` (change in production)

### Response Format

All API responses follow this structure:

```typescript
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response payload */ }
}

// Error
{
  "success": false,
  "error": "Error message",
  "data": null
}
```

### Authentication Flow

1. Login via `POST /auth/login` with credentials
2. Store JWT token from response
3. Include token in all requests: `Authorization: Bearer {token}`
4. Refresh token before 24h expiry via `POST /auth/refresh`
5. Handle 401 errors by redirecting to login

## Key Business Rules

### Leases (Contracts)
- **Duration:** Fixed 6 months
- **Requirements:** Unit must be `available`, tenant cannot have active lease
- **Auto-generation:** Creates 6 monthly payment records + painting fee installments
- **Status transitions:** Creates payments on lease creation, marks unit as `occupied`

### Payments
- **Status flow:** `pending` → `overdue` (auto after due date) → `paid` (manual)
- **Late fees:** 2% fixed penalty + 1% monthly interest (pro-rated daily)
- **Types:** `monthly_rent` and `painting_fee`

### Units
- **Status:** `available`, `occupied`, `maintenance`, `renovation`
- **Rent calculation:** `current_rent_value` based on `is_renovated` flag
- **Constraints:** Cannot delete if status is `occupied`

### Tenants
- **CPF format:** Must be `XXX.XXX.XXX-XX` (with dots and dash)
- **Uniqueness:** CPF must be unique system-wide
- **Immutability:** CPF cannot be changed after creation

## TypeScript Types

All TypeScript types are ready to use in [frontend-docs/types/](frontend-docs/types/). Copy these to your frontend project (suggested path: `@/types/api/` or `src/types/api/`).

Key types:
- `LoginRequest`, `LoginResponse`, `User` - Authentication
- `Unit`, `CreateUnitRequest`, `UnitStatus` - Units/properties
- `Tenant`, `CreateTenantRequest` - Tenants/renters
- `Lease`, `CreateLeaseRequest`, `LeaseStatus` - Contracts
- `Payment`, `PaymentStatus`, `PaymentType` - Payments
- `DashboardResponse`, `Alert`, `FinancialReport` - Dashboard/reports

## Common Development Workflows

### Creating a New Lease
1. Query available units: `GET /units?status=available`
2. Select/create tenant: `GET /tenants` or `POST /tenants`
3. Create lease: `POST /leases` (auto-generates 6 monthly payments)
4. Verify unit status changed to `occupied`

### Processing a Payment
1. Get lease payments: `GET /leases/:id/payments`
2. Mark as paid: `PUT /payments/:id/pay` with payment date and method
3. If painting fee: Updates `painting_fee_paid` counter on lease

### Renewing a Contract
1. Find expiring leases: `GET /leases/expiring-soon` (45-day window)
2. Renew: `POST /leases/:id/renew` (creates new 6-month lease + payments)

## Validation Patterns

### CPF Validation
```typescript
const validateCPF = (cpf: string): boolean => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
  if (!cpfRegex.test(cpf)) return false
  const digits = cpf.replace(/[.\-]/g, '')
  return digits.length === 11
}
```

### Monetary Values
- Always use strings with 2 decimal places: `"1000.00"`
- Use `shopspring/decimal` precision on backend
- Format for display: `R$ 1.000,00` (pt-BR)

### Date Formats
- API expects: `YYYY-MM-DD` (ISO 8601 date only)
- Display format: `DD/MM/YYYY` (pt-BR)

## User Roles & Permissions

| Role | Read | Write | Manage Users |
|------|------|-------|--------------|
| admin | ✅ | ✅ | ✅ |
| manager | ✅ | ✅ | ❌ |
| viewer | ✅ | ❌ | ❌ |

## Error Handling

- **400 Bad Request:** Validation error - display error message to user
- **401 Unauthorized:** Token invalid/expired - redirect to login
- **404 Not Found:** Resource doesn't exist - show not found message
- **409 Conflict:** Duplicate entry (CPF, username) - show conflict message
- **500 Server Error:** Server issue - show generic error, allow retry

## Testing the API

Use Swagger UI for interactive testing:
https://kitnet-manager-production.up.railway.app/swagger/index.html

Or test with curl:
