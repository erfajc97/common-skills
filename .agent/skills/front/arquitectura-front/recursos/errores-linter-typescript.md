# Errores de Linter/TypeScript que no repetir

Al escribir o revisar código en el front, evitar estos patrones. El linter (p. ej. ESLint con TypeScript) los marca y deben corregirse; no añadir código redundante que el tipo ya garantiza.

## 1. Aserción de tipo innecesaria

**Regla:** No usar `as Tipo` cuando la expresión ya tiene ese tipo. La aserción no cambia el tipo y el linter reporta: *"This assertion is unnecessary since it does not change the type of the expression"*.

**Evitar:**
```typescript
getLocalizedText(event.name as Record<string, string>)
```

**Correcto:** Si `event.name` ya es `Record<string, string>`, pasar sin aserción:
```typescript
getLocalizedText(event.name)
```

Solo usar `as` cuando sea estrictamente necesario (p. ej. narrowing que TypeScript no infiere). Revisar el tipo en `types.ts` antes de aseverar.

---

## 2. Optional chaining innecesario

**Regla:** No usar `?.` en propiedades que el tipo define como obligatorias (no opcionales). Si el tipo garantiza que la propiedad existe, usar acceso normal.

**Evitar:**
```typescript
event.images?.[0]
```
cuando `event.images` es `string[]` (requerido).

**Correcto:**
```typescript
event.images[0]
```

Usar `?.` solo cuando la propiedad es opcional en el tipo (`images?: string[]` o `images: string[] | undefined`).

---

## 3. Condicional innecesaria sobre datos ya garantizados

**Regla:** No comprobar con `if (!x) return null` (o similar) cuando el tipo del prop/objeto ya garantiza que `x` está presente. Ejemplo: un item que por tipo siempre tiene `event` no debe tener un guard `if (!event)`.

**Evitar:**
```typescript
const { purchase } = props
const event = purchase.event
if (!event) return null  // innecesario si MyPurchaseItem.event es requerido
```

**Correcto:** Si `purchase.event` es obligatorio en el tipo (p. ej. `MyPurchaseItem`), no añadir el guard; usar `event` directamente.

Revisar la definición en `types.ts`: si el campo no es opcional, no duplicar la comprobación en runtime.

---

## 4. Tipo de array: usar `Array<T>` en anotaciones

**Regla:** En anotaciones de tipo (interfaces, retornos de funciones, parámetros), usar la forma `Array<T>` en lugar de `T[]` para consistencia del proyecto.

**Evitar:**
```typescript
blocks: JournalBlock[]
items: string[]
```

**Correcto:**
```typescript
blocks: Array<JournalBlock>
items: Array<string>
```

Aplica a tipos explícitos en archivos de la feature y en retornos de hooks. En expresiones como `[]` (array literal) no se cambia la sintaxis; solo las anotaciones de tipo.

---

## 5. Orden de importaciones (obligatorio)

**Regla:** Respetar siempre este orden en todos los archivos del front. El linter marca error si no se cumple.

### Orden por grupos (de arriba a abajo)

Este orden es el que aplica el ESLint del proyecto (TanStack config). Respétalo siempre.

1. **React** (solo si se usa): `import … from 'react'` (y `react-dom` si aplica).
2. **Librerías externas**: en orden **alfabético por nombre del paquete**.
   - Ejemplos: `@heroui/react`, `@tanstack/react-router`, `lucide-react`, `react-i18next`.
3. **Imports relativos `./` o `../`**: en orden **alfabético por la ruta**.
   - Ejemplos: `./components/...`, `./context/...`, `./hooks/...`
4. **Imports de solo tipo `import type`** desde `@/`: todos los `import type { X } from '@/app/...'` en orden alfabético por ruta.
5. **Imports con alias `@/`** (valores, no type): en orden **alfabético por la ruta completa**.
   - Ejemplos: `@/app/components/...`, `@/app/features/...`, `@/app/helpers/...`, `@/app/store/...`, `@/app/tanstack-queries/...`, `@/app/types`.
   - Dentro de `@/app/components/UI/`, orden por path: p. ej. `LoadingSpinner` antes que `table-nextui/CustomPagination`.

### Ejemplo correcto (componente de feature)

```typescript
import { useEffect } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AgendaSection } from './components/event-detail/AgendaSection'
import { EventDetailHero } from './components/event-detail/EventDetailHero'
import { useEventDetailHook } from './hooks/useEventDetailHook'
import { AnimateOnScroll } from '@/app/components/AnimateOnScroll'
import { LoadingSpinner } from '@/app/components/UI/LoadingSpinner'
import { formatCurrency } from '@/app/features/statistics/helpers/formatCurrency'
import { useHeroVideoStore } from '@/app/store/heroVideo/heroVideoStore'
```

- Grupo 1: React.
- Grupo 2: Externos por orden de paquete.
- Grupo 3: Relativos `./` por orden de path.
- Grupo 4 (si hay): `import type` desde `@/`.
- Grupo 5: `@/app/...` (valores) por orden de path.

Al añadir o modificar imports, revisar que sigan este orden para no generar errores de linter.

---

## Resumen

| Anti‑patrón | Acción |
|-------------|--------|
| `as Tipo` cuando el tipo ya es correcto | Quitar la aserción. |
| `obj.prop?.x` con `prop` requerido | Usar `obj.prop.x`. |
| `if (!obj) return null` con `obj` garantizado por tipo | Eliminar el guard. |
| `T[]` en anotaciones de tipo | Usar `Array<T>`. |
| Imports desordenados | Orden: (1) React, (2) externos A–Z, (3) `./` relativos A–Z, (4) `import type` desde `@/`, (5) `@/` valores A–Z. Ver sección 5. |

Al tocar componentes o hooks, revisar tipos en `types.ts` y no añadir aserciones, optional chaining ni condicionales redundantes con lo que el tipo ya asegura.
