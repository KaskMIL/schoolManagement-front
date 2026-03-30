# EscuelaGest — Frontend

React 19 · TypeScript · Vite 7 · **Mantine 8** (NOT v7) · TanStack Query v5 · React Router v7

## Comandos

```bash
pnpm dev      # Dev server (proxy al backend en :8080)
pnpm build    # Build producción
pnpm clean    # lint + format
```

## Convenciones de código

- Sin punto y coma · comillas simples · trailing commas
- NUNCA alias `@/` — usar rutas relativas (`../../lib/api`)
- Componentes: PascalCase, `default export` para páginas
- Hooks: `use-kebab-case.ts` con named export `useXxx`
- API modules: `[feature].api.ts` exportando `const [feature]Api = { ... }`
- Types: `[feature].types.ts`

## Montos financieros — CRÍTICO

```typescript
import Decimal from 'decimal.js'
// SIEMPRE Decimal.js con strings
const total = new Decimal(price.amount).plus(new Decimal(service.amount))
// NUNCA: price.amount + service.amount, Number(price.amount), parseFloat(price.amount)
```

## Mantine 8 — reglas críticas

NUNCA usar patrones de v6/v7. Diferencias clave:

```typescript
// @mantine/dates — callbacks devuelven STRING no Date
onChange={(value: string | null) => setDate(value)}  // correcto
onChange={(value: Date | null) => setDate(value)}    // NUNCA

// AppShell — patrón estándar
const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
<AppShell navbar={{ width: 280, breakpoint: 'sm', collapsed: { mobile: !mobileOpened, desktop: !desktopOpened } }}>

// Tablas con sorting/filter/paginación: mantine-datatable — NUNCA Table nativo para esos casos
// TypographyStylesProvider: DEPRECADO — usar Typography
// positionDependencies: DEPRECADO — eliminar el prop
```

## Manejo de errores

```typescript
// Errores en modales / submit de forms
<Alert color="red">{getErrorMessage(error)}</Alert>

// Errores en acciones inline (botones en tabla)
notifyError(error)
```

`getErrorMessage()` traduce: 400→datos inválidos, 401→usuario/pass, 403→sin permiso, 404→no encontrado, 409→`error.message` directo, 500→error servidor.

## Patrón para nuevas features

Referencia: `families/` y `students/`.

```
src/[feature]/
├── [feature].types.ts
├── [feature].api.ts
├── hooks/
│   ├── use-[feature]s.ts          # lista (useQuery)
│   ├── use-[feature].ts           # detalle (useQuery)
│   ├── use-create-[feature].ts    # (useMutation)
│   ├── use-update-[feature].ts    # (useMutation)
│   └── use-delete-[feature].ts    # (useMutation)
├── components/
│   └── [feature]-form.tsx
└── pages/
    ├── [feature]s-list-page.tsx
    └── [feature]-detail-page.tsx
```

## Notas clave

- `useSystemConfig()` devuelve `{ currentAcademicYear }` — usarlo donde se necesite el año activo
- `useCreatePayment(familyId)` invalida tanto `payments` como `installments` queries
- En `family-detail-page.tsx`: `payingInstallment` state usa `null` (modal cerrado), `undefined` (pago a cuenta), `Installment` (cuota específica)
- `PriceTiers` no tienen UI de creación/edición — solo lectura
- `FeeConcepts` tipo `servicio` son los asignables via `StudentService`
- La API del backend corre en el mismo origen (proxy Vite en dev)
