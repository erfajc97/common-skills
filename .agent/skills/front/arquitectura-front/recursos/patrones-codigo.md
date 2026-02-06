# Patrones de Código y Flujo de Datos

El flujo de datos en la arquitectura front es estricto y unidireccional.

**Flujo de escritura:** `Componente (UI)` -> `Hook (lógica, validación)` -> `Mutation` -> `Service` -> `axiosInstance` -> API.

**Flujo de lectura:** `Componente` -> `Hook` -> `Query compartida` (en `@/app/tanstack-queries`) -> `Service` -> `axiosInstance` -> API.

- Los **hooks** contienen la lógica de la pantalla y **llaman a las mutations** (y opcionalmente a las queries compartidas). Los componentes solo reciben datos y callbacks del hook.
- Las **queries** compartidas viven en `src/app/tanstack-queries/`; las features las importan y las usan desde sus hooks. Ver `queries-compartidas.md`.
- Las **mutations** llaman al servicio, muestran toast e invalidan queries. Ver `mutations-y-servicios.md`.

## 1. Mutations (TanStack Query)
Las mutaciones **NUNCA** hacen llamadas directas a Axios. Deben llamar a un servicio.
Deben manejar los efectos secundarios de UI (toasts, invalidación de queries).

```typescript
// features/cart/mutations/useCartMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToCartService } from '../services/addToCartService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addToCartService, // Llama al servicio, no a axios directamente
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      sonnerResponse('Producto agregado al carrito', 'success')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      sonnerResponse(message, 'error')
    },
  })
}
```

## 2. Services (Capa de API)
Los servicios son funciones asíncronas puras que usan la instancia de Axios configurada y los Endpoints centralizados. **NUNCA** hardcodees URLs aquí.

```typescript
// features/cart/services/addToCartService.ts
import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints' // Importar desde central de endpoints
import axiosInstance from '@/app/config/axiosConfig' // Usar instancia con interceptores

export const addToCartService = async (data: {
  productId: string
  quantity: number
}) => {
  try {
    // Uso estricto de API_ENDPOINTS
    const response = await axiosInstance.post(API_ENDPOINTS.CART, data)
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Ocurrió un error desconocido')
  }
}
```

## 3. Configuración de Axios
- Usar **siempre** `src/app/config/axiosConfig.ts`: una sola instancia (`axiosInstance`) con baseURL, interceptores y refresh de token.
- Los **servicios** usan solo `axiosInstance` y `API_ENDPOINTS`. No duplicar baseURL en los servicios; si se necesita la URL base (p. ej. para un enlace), usar `getBaseURL()` exportado desde la config.
- No usar `axios` directamente en componentes ni en mutations; todo pasa por los servicios.
- Ver plantilla en `recursos/axios-config.ts`.
