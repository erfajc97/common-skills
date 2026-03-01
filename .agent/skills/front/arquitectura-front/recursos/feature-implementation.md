# Patrón de Implementación de Feature (Completa)

Ejemplo de cómo orquestar una Feature (ej: `Users`) conectando Hooks, Queries compartidas, Mutations, Store y Componentes UI.

## Flujo de responsabilidades (obligatorio)
- **Componentes**: Responsabilidad única, solo UI (JSX y props). No llaman a servicios ni a mutations; reciben del hook callbacks y datos. La lógica (estado de formulario, validación, envío) vive en hooks; el componente solo usa el hook y pinta. No deben ser grandes; si crecen, extraer subcomponentes o más lógica al hook.
- **Componente principal** (`{Feature}.tsx`): Delgado. Solo importa el hook de página (ej. `useUsersPageHook`) y renderiza; no debe tener useState, useDisclosure ni handlers inline. Toda la orquestación (modales, selección, mutations) va en el hook.
- **Hooks**: Contienen la lógica de la pantalla (estado, validación, flujo). Llaman a **mutations** (y opcionalmente a **queries compartidas** de `@/app/tanstack-queries`). Los componentes solo consumen lo que el hook expone (handleSubmit, errors, isPending, etc.).
- **Mutations**: Llaman al **servicio**; en onSuccess: invalidateQueries + toast; en onError: toast. Ver `mutations-y-servicios.md`.
- **Servicios**: Solo axiosInstance y API_ENDPOINTS; sin baseURL duplicado. Ver `axios-config` y `estructura-features.md`.

## 1. Estructura del Componente Principal (`Users.tsx`)
Debe ser limpio y delegar lógica al hook.

```typescript
import { useUsersHook } from './hooks/useUsersHook'
import { UsersTable } from './components/UsersTable'
import { UsersFilters } from './components/UsersFilters'
import { DeleteUserModal } from './components/modals/DeleteUserModal'
import { useUsersStore } from '@/app/store/users/usersStore'

export function Users() {
  // 1. Hook de lógica de negocio (Queries, formatters, handlers locales)
  const {
    users, isLoading, totalPages, page, setPage, // Data & Pagination
    searchText, setSearchText, // Filters
    handleDeleteClick, handleEditClick // Actions
  } = useUsersHook()

  // 2. Store global para estado de UI compartido (visibilidad de modales)
  const { deleteModalVisible, setDeleteModalVisible, setUserToDelete } = useUsersStore()

  return (
    <div className="p-6">
      <Header title="Gestión de Usuarios" />
      
      <UsersFilters value={searchText} onChange={setSearchText} />

      {/* Tabla tonta: recibe datos y callbacks */}
      <UsersTable
        users={users}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      {/* Modales controlados por Store o Estado local si es simple */}
      <DeleteUserModal
        isOpen={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
      />
    </div>
  )
}
```

## 2. Tabla Tonta (`components/UsersTable.tsx`)
Aquí se define la configuración visual de la tabla.

```typescript
import { Button, Tooltip } from '@heroui/react'
import CustomTableNextUi from '@/app/components/UI/table-nextui/CustomTableNextUi'

export const UsersTable = ({ users, onEditClick, ...props }) => {
  const columns = [
    { name: 'NOMBRE', uid: 'name' },
    { name: 'ACCIONES', uid: 'actions' }
  ]

  const renderCell = (user, columnKey) => {
    switch(columnKey) {
      case 'name': return user.name
      case 'actions': return (
        <Button onPress={() => onEditClick(user)} isIconOnly>
            <EditIcon />
        </Button>
      )
    }
  }

  return <CustomTableNextUi columns={columns} renderCell={renderCell} items={users} {...props} />
}
```

## Claves
1. **Componentes**: Solo UI (JSX y props), responsabilidad única y escalables (si crecen, extraer subcomponentes o lógica al hook). La lógica de formularios (estado, validación, envío) va en hooks; los hooks usan mutations y servicios. Las mutations viven en la carpeta `mutations/` y son las que llaman al servicio y muestran toasts / invalidan queries.
2. **Hook**: Maneja `useQuery`, filtros y paginación; en formularios, estado local, validación y llamada a la mutation.
3. **Store**: Maneja estado global de UI (múltiples modales que se abren desde distintos sitios).
4. **UI**: Usa siempre los wrappers de `src/app/components/UI`. Botones: siempre HeroUI `Button` con `onPress`; contraste legible (ver `components-ui.md`, sección Botones).

### Formularios create/edit
Un mismo formulario puede usarse para crear y editar. El hook (o el contenedor) recibe un identificador (id o entidad) y en el submit decide si llama a la mutation de create o update; el componente de formulario no necesita saber si está en modo crear o editar más allá de los valores iniciales que recibe.

### useEffects (uso mínimo)
- **Casi nulo** salvo cuando sea estrictamente necesario (ej. suscripciones, timers, sincronización con APIs externas).
- Evitar useEffects que solo sincronizan estado o disparan acciones que podrían ejecutarse en un **manejador de evento** o en el **momento de abrir/cerrar** un modal. Preferir funciones que se llamen en el momento adecuado (ej. al abrir modal para editar, llamar a una función que rellene el formulario).
- Si se mantiene un useEffect (ej. “sync form when user changes”), documentarlo y reducir otros useEffects en la feature.

## Auth y flujos de formulario (login, registro, forgot/reset password)
1. **Toasts**: Usar Sonner o helper de toast (ej. `ToastResponse`) **dentro de las mutations** en `onSuccess` y `onError`. Incluir el provider (ToastProvider / Toaster) en el root.
2. **Mutations**: Cada flujo (login, register, forgot, reset) tiene su mutation en `mutations/`; la mutation llama al servicio y muestra toast. La lógica de “qué hacer al tener éxito” (navegar, cerrar modal, guardar token) va en un callback `onSuccess` que el hook pasa a la mutation o en un helper (ej. `applyAuthSuccess`) invocado desde ese callback.
3. **Responsabilidad única**: Los componentes de formulario solo UI; el hook tiene estado, validación y llama a la mutation. No duplicar mensaje de error en un `<p>` si ya se muestra por toast.
