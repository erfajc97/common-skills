# Login como modal (patrón anko)

Complementa `feature-implementation.md` y `components-ui.md`. El login **no es una ruta dedicada**; es un **modal** que se abre desde el header de la landing (o global) con `useDisclosure` de HeroUI.

## Flujo

1. Usuario está en la **landing** (`/`).
2. El **HeaderLanding** muestra:
   - Si **no** está logueado: "Iniciar sesión" (abre el modal) y opcionalmente "Registrarse".
   - Si está logueado: "Ir a admin" (link a `/admin/...`) y "Cerrar sesión".
3. Al hacer clic en "Iniciar sesión" se llama `onOpen()` del `useDisclosure` y se renderiza **LoginModal** (CustomModalNextUI) con el formulario (FormToLogin) dentro.
4. Tras login exitoso se cierra el modal (`onOpenChange(false)`) y se puede redirigir al panel.

## Uso de useDisclosure en el header

El estado del modal vive en el componente que renderiza el header (p. ej. **Home/Landing**). Ese componente usa:

- `const loginDisclosure = useDisclosure()`
- Pasa al header: `isLoginOpen={loginDisclosure.isOpen}`, `onOpenLogin={loginDisclosure.onOpen}`, `onLoginOpenChange={() => loginDisclosure.onOpenChange(false)}` (o equivalente para cerrar).
- El header renderiza **LoginModal** con `isOpen={isLoginOpen}` y `onOpenChange={onLoginOpenChange}`.

Referencia: patrón anko **HeaderLanding** + **LoginModal**.
