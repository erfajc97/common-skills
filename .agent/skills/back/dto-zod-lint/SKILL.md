---
name: dto-zod-lint
description: Evita errores de lint en DTOs con Zod: no usar aserciones no-null innecesarias en refines y formatear mensajes/opciones largas. Usar al escribir o modificar schemas Zod en el backend.
---

# Skill: DTOs con Zod sin errores de lint

## Cuándo usar este Skill
- Al crear o editar DTOs/schemas con Zod en `escapadas-back` (ej. `*.dto.ts`, `*Schema`).
- Al usar `.refine()` o `.superRefine()` con datos opcionales o que el linter marca como posiblemente undefined.
- Cuando el linter pide partir líneas largas (Insert `⏎`) en mensajes de error o opciones de refine.

## Reglas obligatorias

### 1. No usar aserciones no-null (`!`) innecesarias
El linter marca como error el uso de `!` cuando TypeScript ya puede inferir el tipo o cuando hay alternativas más seguras.

**Evitar:**
```ts
.refine((data) => data.preSaleEndAt! >= data.preSaleAt && data.preSaleEndAt! <= data.saleAt, { ... })
```

**Hacer (opción A — guard + variable):**
```ts
.refine((data) => {
  if (!data.preSaleEndAt || !data.preSaleAt || !data.saleAt) return true
  return data.preSaleEndAt >= data.preSaleAt && data.preSaleEndAt <= data.saleAt
}, { ... })
```

**Hacer (opción B — desestructuración tras guard):**
```ts
.refine((data) => {
  const { preSaleEndAt, preSaleAt, saleAt } = data
  if (!preSaleEndAt || !preSaleAt || !saleAt) return true
  return preSaleEndAt >= preSaleAt && preSaleEndAt <= saleAt
}, { ... })
```

**Hacer (opción C — condición explícita sin `!`):**
```ts
.refine((data) =>
  data.preSaleEndAt != null &&
  data.preSaleEndAt >= data.preSaleAt &&
  data.preSaleEndAt <= data.saleAt,
  { ... }
)
```

Usar guards o comprobaciones explícitas (`!= null`, `&& data.campo`) en lugar de `!`.

### 2. Formatear mensajes y opciones largas
Si el linter pide "Insert `⏎`" (línea demasiado larga), partir el objeto de opciones del refine en varias líneas.

**Evitar (línea única muy larga):**
```ts
.refine(..., { message: 'preSaleEndAt must be after preSaleAt and before or equal to saleAt' })
```

**Hacer:**
```ts
.refine(..., {
  message:
    'preSaleEndAt must be after preSaleAt and before or equal to saleAt',
})
```

O si el mensaje es largo y hay más opciones:
```ts
.refine(..., {
  message: 'preSaleEndAt must be after preSaleAt and before or equal to saleAt',
  path: ['preSaleEndAt'],
})
```

Mantener cada propiedad en su línea cuando la línea supere el límite del linter/Prettier.

## Checklist antes de guardar DTOs con Zod
- [ ] No hay `!` en expresiones dentro de refines; se usa guard, desestructuración o comprobación explícita.
- [ ] Los objetos de opciones de `.refine()` / `.superRefine()` están formateados en varias líneas si la línea es larga.
- [ ] El archivo pasa el linter sin warnings ni errores.

## Relación con el backend
- Esta skill complementa las reglas de validación en `.agent/rules/20-back.md` y el agente en `.agent/agents/backend.md`.
- Aplicar siempre que se toquen schemas Zod en el backend para evitar reintroducir los mismos errores de lint.
