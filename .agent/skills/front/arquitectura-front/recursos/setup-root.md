# Configuración del Root y Main

Complementa `estructura-features.md` y `estructura-global.md`. Patrones para la inicialización de la aplicación (`main.tsx`) y el componente raíz del Router (`__root.tsx`).

## 1. Main Entry (`src/main.tsx`)
Debe configurar:
- **Router Context**: Inyectar `auth` y `queryClient`.
- **StrictMode**.
- **TanStackQueryProvider**.

```typescript
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'
import { routeTree } from './routeTree.gen'
import { useAuthStore } from './app/store/auth/authStore.ts'

// Contexto para el Router
const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
    auth: undefined as unknown as AuthContext, // Placeholder para tipado
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
})

// Tipado seguro
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  const authStore = useAuthStore()
  // Adaptador de contexto Auth para el router
  const auth = {
    ...authStore,
    isLogged: () => Boolean(authStore.token),
  }

  return <RouterProvider router={router} context={{ auth }} />
}

ReactDOM.createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
      <App />
    </TanStackQueryProvider.Provider>
  </StrictMode>,
)
```

## 2. Root Route (`src/routes/__root.tsx`)
Debe incluir:
- **Providers Globales**: `HeroUIProvider`, `ToastProvider` (Sonner), `SyncContext`.
- **Layout Base**: Header, Main (Outlet), Footer.
- **NotFoundComponent**: Página 404 personalizada.

```typescript
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { Toaster } from 'sonner'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCartSync } from '../app/features/cart/hooks/useCartSync'
import { CartSyncContext } from '../app/features/cart/context/CartSyncContext'

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

function RootComponent() {
  const { syncAndWait } = useCartSync()

  return (
    <CartSyncContext.Provider value={{ syncAndWait }}>
      <HeroUIProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
            {/* Sonner Toaster */}
          <ToastProvider placement="top-right" />
          <Toaster position="top-right" />
          
          <main className="flex-1">
            <Outlet />
          </main>
          
          <Footer />
        </div>
      </HeroUIProvider>
    </CartSyncContext.Provider>
  )
}

function NotFoundComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <Link to="/" className="btn-primary">Volver al inicio</Link>
    </div>
  )
}
```
