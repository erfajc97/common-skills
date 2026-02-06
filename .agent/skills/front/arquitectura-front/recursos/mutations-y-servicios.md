# Mutations y servicios

## Flujo de responsabilidades
- **Componentes**: Solo UI (JSX, props). No llaman a servicios ni a mutations directamente; reciben callbacks del hook.
- **Hooks**: Contienen la lógica de la pantalla (estado, validación, flujo). **Llaman a las mutations** y pasan callbacks (onSuccess, etc.) cuando hace falta.
- **Mutations**: Llaman al **servicio**; en `onSuccess` muestran **toast** e **invalidan queries**; en `onError` muestran toast de error. No contienen lógica de formulario ni de navegación; eso va en el hook o en el callback que reciben.

```text
Componente (UI) → Hook (lógica, validación, mutate) → Mutation (servicio + toast + invalidateQueries) → Service (axios)
```

## Dónde viven las mutations
En cada feature, dentro de la carpeta **mutations/**:

```text
src/app/features/{feature}/
├── mutations/
│   ├── useCreateUserMutation.ts
│   ├── useUpdateUserMutation.ts
│   ├── useDeleteUserMutation.ts
│   └── ...
```

## Contenido de una mutation
- **mutationFn**: Llama **solo** al servicio (ej. `usersService.createUser(payload)`). Nunca axios ni fetch directo.
- **onSuccess**: `queryClient.invalidateQueries({ queryKey: ['...'] })`, toast de éxito (Sonner/ToastResponse), y opcionalmente callbacks que reciba la mutation (cerrar modal, limpiar selección).
- **onError**: Toast de error; el mensaje puede extraerse de `error.response?.data?.message` o `error.message`.

## Toasts (Sonner / ToastResponse)
- Usar **siempre** un helper de toast (ej. `ToastResponse` o Sonner) dentro de las mutations: en `onSuccess` y en `onError`.
- No duplicar el mensaje de error en un `<p>` en el componente si ya se muestra por toast.
- El root de la app debe tener el provider de toasts (ToastProvider / Toaster).

## Servicios
- Viven en **services/** de la feature (ej. `usersService.ts`).
- Usan **solo** `axiosInstance` de `src/app/config/axiosConfig.ts` y `API_ENDPOINTS` de la app. **No duplicar baseURL**; si se necesita la URL base (p. ej. para un enlace), usar `getBaseURL()` exportado desde la config o `axiosInstance.defaults.baseURL`.

## Reglas
- Las mutations **no** contienen estado de formulario ni validación; eso va en el hook.
- Los hooks **no** llaman al servicio directamente para escritura; siempre usan una mutation.
- Crear/editar: un mismo formulario y un mismo hook (o mutation de create/update) que, según exista `id` o entidad, llame a create o update. Ver `feature-implementation.md` (Formularios create/edit).
