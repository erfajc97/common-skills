# Queries compartidas (tanstack-queries)

## Dónde viven
Todas las **queries** de TanStack Query que consumen la API viven en una carpeta compartida a nivel de app, no dentro de cada feature:

```text
src/app/tanstack-queries/
├── usersQuery.ts
├── statisticsQuery.ts
└── {dominio}Query.ts
```

Así se evita duplicar lógica de `useQuery` y se centraliza el `queryKey` y la `queryFn` por dominio.

## Patrón por archivo
- Un archivo por dominio (ej. `usersQuery.ts`, `statisticsQuery.ts`).
- Cada archivo exporta uno o más hooks `useXxxQuery` que reciben parámetros (queryParams, enabled, etc.) y devuelven el resultado de `useQuery`.
- La `queryFn` llama **siempre** al servicio de la feature correspondiente (ej. `usersService.getUsers`), no a axios ni a endpoints directamente.
- El `queryKey` debe ser estable y coherente (ej. `['users', queryParams]`) para que las mutations puedan invalidar con `invalidateQueries({ queryKey: ['users'] })`.

## Ejemplo

```typescript
// src/app/tanstack-queries/usersQuery.ts
import { useQuery } from '@tanstack/react-query'
import type { GetUsersParams } from '@/app/features/users/types'
import { usersService } from '@/app/features/users/services/usersService'

export interface UseUsersQueryParams {
  enabled?: boolean
  queryParams?: GetUsersParams
}

export function useUsersQuery({ enabled = true, queryParams = {} }: UseUsersQueryParams = {}) {
  return useQuery({
    queryKey: ['users', queryParams],
    queryFn: () => usersService.getUsers({ page: 1, per_page: 10, ...queryParams }),
    enabled,
  })
}
```

## Uso en la feature
Los hooks de la feature (p. ej. `useUsersHook`) **usan** la query compartida y exponen datos derivados (lista, totalPages, setPage, onSearchChange, etc.). No definen `useQuery` inline con la misma clave.

```typescript
// features/users/hooks/useUsersHook.ts
import { useUsersQuery } from '@/app/tanstack-queries/usersQuery'

export function useUsersHook() {
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const debouncedSearch = useDebouncedValue(searchText, 300)

  const { data, isLoading } = useUsersQuery({
    queryParams: { page, per_page: 10, search: debouncedSearch || undefined },
  })

  const users = data?.data ?? []
  const totalPages = data?.total_pages ?? 1
  // ...
}
```

## Reglas
- No crear `useQuery` con la misma `queryKey` dentro de la feature; usar siempre el hook de `tanstack-queries`.
- Las mutations que afecten esos datos invalidan con `queryClient.invalidateQueries({ queryKey: ['users'] })` (o la clave correspondiente).
