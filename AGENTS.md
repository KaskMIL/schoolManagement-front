# AGENTS.md — EscuelaGest Frontend

Este documento guía a agentes de código (Claude Code, OpenCode, etc.) para trabajar en este repo.

---

## Contexto del Proyecto

**EscuelaGest** es un sistema de gestión escolar para dos instituciones en San Miguel, Buenos Aires, Argentina:
- **Jardín de Infantes La Alpina Verde** (Sala de 3, 4 y 5 — turnos mañana/tarde)
- **Colegio San Miguel Arcángel** (Primaria 1°-6° — cursos A/B, Secundaria 1°-6° — único)

La **unidad de facturación es la familia**, no el alumno individual.

Este repo es el **frontend** (SPA). El backend vive en el repo `schoolManagement/`.

---

## Stack

| | |
|---|---|
| Framework | React 19 · TypeScript |
| Build | Vite 7 |
| UI | Mantine 8 |
| Server state | TanStack Query v5 |
| Routing | React Router v7 |
| Formularios | `@mantine/form` |
| Notificaciones | `@mantine/notifications` |
| Montos financieros | `Decimal.js` con strings — NUNCA `number` nativo |
| PDF | react-pdf (recibos) |
| Package Manager | pnpm >=10 |
| Node | >=22 |

---

## Comandos

```bash
pnpm install    # Instalar dependencias
pnpm dev        # Dev server Vite
pnpm build      # Build producción
pnpm lint       # ESLint --fix
pnpm format     # Prettier --write
pnpm clean      # lint + format
```

---

## Estructura

```
src/
├── main.tsx              # Entry point
├── app.tsx               # Providers: MantineProvider, QueryClient, Notifications
├── router.tsx            # Rutas React Router v7
├── theme.ts              # Configuración del tema Mantine
├── lib/
│   ├── api.ts            # fetch wrapper — lanza ApiError con status HTTP
│   ├── api-error.ts      # ApiError class + getErrorMessage() en español argentino
│   └── notifications.ts  # notifyError() — toast via @mantine/notifications
├── layout/
│   └── app-shell.tsx     # Sidebar con nav + logout + username
├── auth/                 # IMPLEMENTADO
│   ├── auth.types.ts
│   ├── auth.api.ts
│   ├── auth-guard.tsx    # Protege rutas — redirige a /login si no autenticado
│   ├── login-page.tsx
│   └── hooks/
│       ├── use-current-user.ts
│       ├── use-login.ts
│       └── use-logout.ts
├── institutions/         # IMPLEMENTADO
│   ├── institutions.types.ts
│   ├── institutions.api.ts
│   └── hooks/use-institutions.ts
├── users/                # IMPLEMENTADO
│   ├── constants.ts      # USER_ROLES, USER_ROLE_LABELS
│   ├── users.types.ts
│   ├── users.api.ts
│   ├── components/
│   │   └── user-form.tsx
│   ├── hooks/
│   │   ├── use-users.ts
│   │   ├── use-create-user.ts
│   │   └── use-update-user-profile.ts
│   └── pages/
│       └── users-config-page.tsx
├── families/             # IMPLEMENTADO
│   ├── families.types.ts
│   ├── families.api.ts
│   ├── hooks/
│   │   ├── use-families.ts
│   │   ├── use-family.ts
│   │   ├── use-create-family.ts
│   │   ├── use-update-family.ts
│   │   ├── use-deactivate-family.ts
│   │   ├── use-reactivate-family.ts
│   │   ├── use-create-guardian.ts
│   │   ├── use-update-guardian.ts
│   │   └── use-delete-guardian.ts
│   ├── components/
│   │   ├── family-form.tsx
│   │   └── guardian-form.tsx
│   └── pages/
│       ├── families-list-page.tsx
│       └── family-detail-page.tsx
├── students/             # IMPLEMENTADO
│   ├── students.types.ts
│   ├── students.api.ts
│   ├── hooks/
│   │   ├── use-students.ts
│   │   ├── use-student.ts
│   │   ├── use-create-student.ts
│   │   ├── use-update-student.ts
│   │   ├── use-create-enrollment.ts
│   │   ├── use-update-enrollment.ts
│   │   ├── use-create-emergency-contact.ts
│   │   ├── use-update-emergency-contact.ts
│   │   └── use-delete-emergency-contact.ts
│   ├── components/
│   │   ├── student-form.tsx
│   │   ├── enrollment-form.tsx
│   │   └── emergency-contact-form.tsx
│   └── pages/
│       ├── students-list-page.tsx
│       └── student-detail-page.tsx  # Incluye sección de servicios adicionales
├── fee-concepts/         # IMPLEMENTADO
│   ├── fee-concepts.types.ts
│   ├── fee-concepts.api.ts
│   ├── components/
│   │   └── fee-concept-form.tsx
│   └── hooks/
│       ├── use-fee-concepts.ts
│       ├── use-create-fee-concept.ts
│       ├── use-update-fee-concept.ts
│       └── use-toggle-fee-concept.ts
├── fee-prices/           # IMPLEMENTADO
│   ├── fee-prices.types.ts
│   ├── fee-prices.api.ts
│   ├── components/
│   │   └── fee-price-form.tsx
│   └── hooks/
│       ├── use-fee-prices.ts
│       ├── use-create-fee-price.ts
│       ├── use-update-fee-price.ts
│       └── use-delete-fee-price.ts
├── student-services/     # IMPLEMENTADO
│   ├── student-services.types.ts
│   ├── student-services.api.ts
│   ├── components/
│   │   └── student-service-form.tsx
│   └── hooks/
│       ├── use-student-services.ts
│       ├── use-create-student-service.ts
│       ├── use-update-student-service.ts
│       └── use-delete-student-service.ts
├── system-config/        # IMPLEMENTADO
│   ├── system-config.types.ts
│   ├── system-config.api.ts
│   └── hooks/
│       ├── use-system-config.ts
│       └── use-update-system-config.ts
├── installments/         # IMPLEMENTADO
│   ├── installments.types.ts
│   ├── installments.api.ts
│   ├── components/
│   │   └── generate-installment-form.tsx
│   └── hooks/
│       ├── use-installments.ts
│       ├── use-generate-installment.ts
│       └── use-annul-installment.ts
├── payments/             # IMPLEMENTADO
│   ├── payments.types.ts
│   ├── payments.api.ts
│   ├── components/
│   │   └── payment-form.tsx
│   └── hooks/
│       ├── use-payments.ts
│       └── use-create-payment.ts
└── configuracion/        # IMPLEMENTADO
    ├── configuracion-layout.tsx  # tabs: usuarios, instituciones, precios, general
    └── pages/
        ├── precios-config-page.tsx
        └── general-config-page.tsx  # año lectivo activo
```

---

## Rutas (router.tsx)

```
/login                          → LoginPage (pública)
/ (AuthGuard)
  / (AppShellLayout)
    /familias                   → FamiliesListPage
    /familias/:familyId         → FamilyDetailPage
    /alumnos                    → StudentsListPage
    /alumnos/:studentId         → StudentDetailPage
    /configuracion              → redirect a /configuracion/usuarios
    /configuracion/usuarios     → UsersConfigPage
    /configuracion/instituciones
    /configuracion/precios      → PreciosConfigPage
    /configuracion/general      → GeneralConfigPage (año lectivo activo)
```

---

## Patrón para Nuevas Features

Referencia: `families/` y `students/` son los ejemplos más recientes.

```
src/[feature]/
├── [feature].types.ts
├── [feature].api.ts
├── hooks/
│   ├── use-[feature]s.ts          # lista (useQuery)
│   ├── use-[feature].ts           # detalle por id (useQuery)
│   ├── use-create-[feature].ts    # (useMutation)
│   ├── use-update-[feature].ts    # (useMutation)
│   └── use-delete-[feature].ts    # (useMutation)
├── components/
│   └── [feature]-form.tsx
└── pages/
    ├── [feature]s-list-page.tsx
    └── [feature]-detail-page.tsx
```

---

## Manejo de Errores

### `ApiError`

Lanzada por `lib/api.ts` con el status HTTP del backend.

### `getErrorMessage(error)`

Traduce errores al español argentino:

| Status | Mensaje |
|--------|---------|
| 400 | "Los datos ingresados no son válidos." |
| 401 | "Usuario o contraseña incorrectos." |
| 403 | "No tenés permiso para realizar esta acción." |
| 404 | "El recurso solicitado no fue encontrado." |
| 409 | usa `error.message` del backend directamente |
| 500 | "Error del servidor. Intentá de nuevo más tarde." |

### Cuándo usar qué

- **Errores en modales / submit de forms** → `Alert` inline arriba del form con `getErrorMessage(error)`
- **Errores en acciones inline** (botones en tablas/listas) → `notifyError(error)` toast

---

## Convenciones

### Estilo de código

- Sin punto y coma
- Comillas simples
- Trailing commas
- NO usar alias `@/` — usar rutas relativas (`../../lib/api`)

### Componentes y archivos

- Componentes: PascalCase, `default export` para páginas
- Hooks: `use-kebab-case.ts` con named export `useXxx`
- API modules: `[feature].api.ts` exportando `const [feature]Api = { ... }`
- Types: `[feature].types.ts`

### Montos financieros

Siempre usar **`Decimal.js`** operando sobre strings. Nunca `number` nativo.

```typescript
import Decimal from 'decimal.js'
const total = new Decimal(price.amount).plus(new Decimal(service.amount))
```

### Texto de UI

Todo en **español argentino** (vos, no tú).

### Mantine 8

No pasar strings a props que esperan componentes React (ej: `scrollAreaComponent`). Leer la documentación de Mantine 8 — hay breaking changes respecto a v7.

---

## Estado del MVP (Fase 1)

- [x] Auth — login, auth guard, logout
- [x] Layout — AppShell con sidebar, logout, username
- [x] Families — lista, detalle, forms de familia y responsables
- [x] Students — lista, detalle, forms (inscripciones, contactos de emergencia, servicios)
- [x] Error handling — ApiError, getErrorMessage(), notifyError()
- [x] Configuración — usuarios, instituciones, precios (FeeConcepts + FeePrices)
- [x] StudentServices — sección en detalle de alumno
- [x] SystemConfig — /configuracion/general (año lectivo activo)
- [x] Installments — generación y vista de cuotas en family-detail-page (con detalles expandibles)
- [x] Payments — registro de pagos y pagos a cuenta en family-detail-page
- [ ] Discounts — UI de descuentos por familia/alumno
- [ ] Estado de cuenta — vista consolidada (cuotas + pagos + saldo a favor)
- [ ] Recibo PDF — react-pdf
- [ ] Dashboard — recaudación del mes, deudores

---

## Notas para el Agente

- **No commitear ni pushear** sin confirmación explícita del usuario.
- Todo el texto visible al usuario en **español argentino**.
- Montos financieros: **siempre `Decimal.js`** con strings, NUNCA `number` nativo.
- No usar alias `@/` — rutas relativas siempre.
- `auth/` es el ejemplo canónico de feature con guard.
- `families/` y `students/` son la referencia más reciente para nuevas features.
- La API del backend corre en el mismo origen (proxy configurado en Vite para dev).
- `PriceTiers` no tienen UI de creación/edición, solo se leen.
- `FeeConcepts` de tipo `servicio` son los que se asignan a alumnos via `StudentService`.
- `useSystemConfig()` devuelve `{ currentAcademicYear }` — usarlo donde se necesite el año activo.
- `useCreatePayment(familyId)` invalida tanto `payments` como `installments` queries (para reflejar cambio de status de la cuota).
- En `family-detail-page.tsx` el state `payingInstallment` usa `null` (modal cerrado), `undefined` (pago a cuenta), o `Installment` (pago de cuota específica).
