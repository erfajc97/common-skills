# Estructura Global del Proyecto

La estructura de carpetas de alto nivel está diseñada para separar claramente configuración, lógica global, features y rutas.

```text
src/
├── app/
│   ├── api/             # Definición de endpoints (endpoints.ts)
│   ├── config/          # Configuraciones globales (axiosConfig.ts)
│   ├── features/        # Módulos de funcionalidad (Auth, Cart, etc.)
│   ├── layout/          # Layouts principales (DashboardLayout, AuthLayout)
│   ├── store/           # Estado global (Zustand)
│   ├── tanstack-queries/# Queries compartidas (useUsersQuery, etc.). Ver queries-compartidas.md
│   ├── helpers/         # Utilidades generales
│   ├── hooks/           # Hooks globales (si son globales)
│   └── types/           # Tipos globales
├── assets/              # Assets estáticos (svg/ para iconos como componentes). Ver iconos-y-assets.md
│   └── svg/
├── routes/              # Definición de rutas (TanStack Router)
│   ├── _authenticated/  # Carpeta para rutas protegidas
│   ├── _authenticated.tsx # Layout route para protección de rutas
│   ├── __root.tsx       # Root de la aplicación
│   └── index.tsx        # Página de inicio
├── components/         # Componentes UI compartidos (si no viven en app/components/UI)
└── integrations/       # Integraciones externas (TanStack Query provider, etc.)
```

## Definiciones Clave
- **`app/layout/`**: Contiene los wrappers visuales macro (ej: Sidebar + Header + Content).
- **`app/tanstack-queries/`**: Queries compartidas de TanStack Query; un archivo por dominio. Las features importan desde aquí. Ver `queries-compartidas.md`.
- **`assets/svg/`**: Iconos SVG como componentes React; se importan en lugar de inline. Ver `iconos-y-assets.md`.
- **`routes/_authenticated/`**: Toda ruta dentro de esta carpeta hereda automáticamente la protección de `_authenticated.tsx`.
- **`app/features/`**: Contiene la lógica de negocio fragmentada. Las rutas importan componentes desde aquí.
