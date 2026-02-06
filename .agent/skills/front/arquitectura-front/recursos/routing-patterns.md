# Patrones de Routing (TanStack Router)

Complementa `estructura-features.md` y `feature-implementation.md`. La estructura general de la app está en `estructura-global.md` y `SKILL.md`.

El routing se basa en el sistema de archivos de TanStack Router, con reglas estrictas para autenticación y layouts.

## 1. Protección de Rutas (Authenticated Route)

Para crear una sección protegida, usamos un archivo layout route `_authenticated.tsx` que actúa como guardián.

**Archivo**: `src/routes/_authenticated.tsx`
```typescript
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    // Verificación de sesión
    if (!context.auth.isLogged()) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => <Outlet />, // Renderiza las rutas hijas si pasa el check
})
```

## 2. Rutas Hijas Protegidas

Las rutas que requieren auth deben ir DENTRO de la carpeta `src/routes/_authenticated/`.
Estas rutas importan sus componentes visuales desde `src/app/features/` y usan layouts desde `src/app/layout/`.

**Ejemplo**: `src/routes/_authenticated/dashboard/categories.tsx`
```typescript
import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/app/layout/DashboardLayout'
import { Categories } from '@/app/features/categories/Categories' // Import feature entry point

export const Route = createFileRoute('/_authenticated/dashboard/categories/')({
  beforeLoad: ({ context }) => {
    // Verificación de roles específica
    if (context.auth.roles !== 'ADMIN') {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => (
    <DashboardLayout>
      <Categories />
    </DashboardLayout>
  ),
})
```

## 3. Login y flujo principal

No existe ruta `/login` para el flujo principal de inicio de sesión: el login se realiza mediante un **modal** abierto desde el header de la landing. La ruta `/login` puede existir como redirect a `/` para no romper bookmarks. Ver `auth-login-modal.md`.

## Reglas
1. **Separación**: El archivo de ruta (`routes/xyz.tsx`) solo maneja la lógica de routing (permissions, loaders, layout wrapping). El contenido real viene de `features/`.
2. **Contexto**: Usar `context.auth` para validar permisos en `beforeLoad`.
3. **Layouts**: Los layouts visuales viven en `src/app/layout/` y envuelven a los componentes de feature.
