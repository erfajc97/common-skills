# Estándar de Estructura de Features (Screaming Architecture)

Cada feature debe seguir esta estructura estrictamente. El objetivo es que al mirar la carpeta `features/`, la estructura "grite" qué hace la aplicación.

## Queries compartidas (nivel app)

Las **queries** de TanStack Query que consumen la API viven en una carpeta compartida, no dentro de cada feature. Así se reutilizan y se mantiene una sola fuente de verdad por dominio.

```text
src/app/tanstack-queries/
├── usersQuery.ts       # useUsersQuery({ queryParams?, enabled? })
├── statisticsQuery.ts  # useStatisticsQuery({ period?, enabled? })
└── ...                 # Un archivo por dominio (nombreQuery.ts)
```

- Cada archivo exporta uno o más hooks `useXxxQuery` que reciben parámetros y llaman a `useQuery` con `queryKey` y `queryFn` (que usa el servicio de la feature).
- Las features **importan** estas queries desde `@/app/tanstack-queries/xxxQuery`; los hooks de la feature (p. ej. `useUsersHook`) pueden usar `useUsersQuery` y exponer datos derivados (lista, totalPages, etc.).
- Detalle: `recursos/queries-compartidas.md`.

## Estructura por feature

```text
src/app/features/{feature-name}/
├── components/          # Solo UI: JSX y props. Sin lógica de negocio ni llamadas directas a servicios/mutations. La lógica (estado, validación, handlers) vive en hooks que el componente importa y usa.
│   ├── {ComponentName}.tsx
│   └── modals/         # FormModal, DeleteModal, etc. Usan CustomModalNextUI.
│       └── {ModalName}Modal.tsx
├── hooks/              # Lógica: estado, validación, llamadas a mutations y/o a queries compartidas.
│   ├── use{Component}Hook.ts
│   └── use{Feature}Hook.ts
├── mutations/          # Mutations de TanStack Query: llaman al servicio, toast en onSuccess/onError, invalidateQueries.
│   └── use{Xxx}Mutation.ts
├── services/           # Llamadas a API usando solo axiosInstance y API_ENDPOINTS (sin baseURL duplicado).
│   └── {feature}Service.ts
├── types.ts            # Todos los tipos de la feature (payloads, respuestas, props). Un solo archivo.
├── helpers/            # (Opcional) Funciones puras reutilizables (ej. applyAuthSuccess).
│   └── {helperFunction}.ts
├── context/            # (Opcional) Solo si el estado compartido lo justifica.
│   └── {Feature}Context.tsx
└── {Feature}.tsx       # Punto de entrada: orquesta hooks y componentes. Sin lógica pesada.
```

## Tipos
Todo lo que sea tipos (payloads, respuestas API, props de la feature) debe vivir en **un solo archivo** `types.ts` en la raíz de la feature. Los servicios, hooks, mutations y componentes importan desde `../types` o `@/app/features/{feature}/types`. No definir interfaces en los servicios ni repetir tipos en varios archivos.

## Reglas del Componente Principal `{Feature}.tsx`
- **Ubicación**: Raíz de la feature (`src/app/features/{feature-name}/{Feature}.tsx`).
- **Función**: Punto de entrada único. Orquesta los componentes y hooks.
- **Delgado**: No debe contener lógica de negocio ni estado complejo. Solo importa uno o más hooks que concentran toda la lógica (listado, modales, formularios) y retornan datos y callbacks; el componente únicamente renderiza JSX con eso. Si el archivo crece, extraer lógica a un hook (ej. `useUsersPageHook`).
- **Importación**: Se debe importar desde las rutas (`routes/`) usando este archivo.
- **Contenido**: Una única llamada al hook de página (o varias a hooks específicos), layout y renderizado de componentes hijos con los valores que devuelve el hook.

## Servicios
Las llamadas a API usan la instancia de axios configurada en `src/app/config/axiosConfig.ts` (baseURL, interceptors). **No duplicar baseURL** en los servicios; si se necesita la URL base (p. ej. para construir un enlace), obtenerla desde la config (p. ej. `getBaseURL()`) o desde `axiosInstance.defaults.baseURL`.

## Mutations
Cuando una mutation modifica datos que una query muestra (ej. lista de usuarios), en `onSuccess` de la mutation se debe invalidar esa query (`queryClient.invalidateQueries({ queryKey: ['...'] })`) para que la UI se actualice.

## Modales por formulario (CRUD)

Para CRUD (usuarios, etc.), cada flujo (crear, editar, eliminar) puede usar un **modal** que envuelve un formulario o confirmación. El formulario vive en un **componente aparte** (FormRegister, FormToLogin); el modal solo usa **CustomModalNextUI**. Ejemplo: feature Users con **FormModal** (crear/editar) + **DeleteModal** (confirmar eliminación); el formulario de usuario está en `components/FormRegister.tsx` y los modales en `components/modals/`.

## Recursos relacionados
- Queries compartidas: `recursos/queries-compartidas.md`.
- Mutations y servicios: `recursos/mutations-y-servicios.md`.
- Tipos y estilos: `recursos/tipos-y-estilos.md`.
- Iconos: `recursos/iconos-y-assets.md`.
- Implementación: `recursos/feature-implementation.md`.

## Ejemplo
Para una feature `cart`:
```
src/app/features/cart/
├── components/
│   ├── CartItem.tsx
│   └── CartSummary.tsx
├── hooks/
│   └── useCart.ts
├── services/
│   └── cartService.ts
└── Cart.tsx  <-- Entry point
```
