# Arquitectura de la feature Landing

Patrón reutilizable para la feature que agrupa la **zona pública** del sitio: home, páginas de contenido (destinos, blog, membresías, etc.) y detalle de entidades (evento, artículo). Aplica a cualquier proyecto con marketing site + múltiples páginas de entrada bajo una misma feature.

## Cuándo usar este recurso

- Crear o refactorizar la feature **landing** (o equivalente: public, marketing, site).
- La app tiene varias **páginas de entrada** en la zona pública (home, listados, detalle) que comparten hero, header/footer y secciones reutilizables.
- Se quiere mantener un solo punto de organización para todo el “sitio público” sin mezclar con features de admin o dashboard.

## Principios

- **Puntos de entrada en raíz**: Cada página pública es un componente en la raíz de la feature (`Home.tsx`, `Destinos.tsx`, `EventDetail.tsx`, etc.), importado desde las rutas. No colocar páginas dentro de `components/`.
- **Lógica en hooks**: Cada página usa un hook dedicado (`useHomeHook`, `useDestinosHook`, `useEventDetailHook`). El componente solo llama al hook y renderiza; sin estado complejo ni llamadas a servicios en el componente.
- **Componentes solo UI**: Los componentes bajo `components/` reciben datos y callbacks por props (o de un hook que el componente usa); no llaman a servicios ni mutations directamente.
- **useEffect mínimo**: Evitar useEffects salvo sincronización con store externo, actualización imperativa de DOM (p. ej. `video.src`) o cleanup documentado (p. ej. limpiar hero al entrar en detalle).
- **Tema y tokens**: Fondos y textos de secciones con clases del tema (p. ej. `bg-landing-section`, `bg-form-primary`, `text-accent`). Sin hex ni `bg-[#...]` en componentes. Definir variables en el CSS global y exponerlas en el theme de Tailwind.

---

## Estructura de carpetas

```text
src/app/features/landing/
├── components/
│   ├── hero/                    # Hero reutilizable (video, imagen, CTA)
│   │   ├── HeroWithVideo.tsx    # Sincroniza query → store; no pinta HTML
│   │   ├── PersistentHeroSection.tsx
│   │   └── EmpireHeroSection.tsx  # (o nombre de negocio)
│   ├── layout/                  # Header, footer, botón flotante
│   │   ├── HeaderLanding.tsx
│   │   ├── FooterLanding.tsx
│   │   └── FloatingWhatsAppButton.tsx
│   ├── sections/                # (Opcional) Secciones de contenido reutilizables
│   │   ├── SectionHeader.tsx    # Eyebrow + título; variantes row/center
│   │   ├── HomeManifestoSection.tsx
│   │   └── ...
│   ├── event-detail/            # (Opcional) Subdominio: detalle de entidad
│   │   ├── EventDetailHero.tsx
│   │   ├── AgendaSection.tsx
│   │   └── ...
│   ├── HomeFeatureCards.tsx     # O en sections/ si se prefiere
│   └── ...
├── context/                     # (Opcional) Estado compartido público (auth modal, etc.)
│   └── PublicAuthContext.tsx
├── hooks/
│   ├── useHomeHook.ts
│   ├── useDestinosHook.ts
│   └── useEventDetailHook.ts
├── types.ts                     # Tipos propios de la feature (HomeFeatureItem, etc.)
├── Home.tsx                     # Puntos de entrada en raíz
├── Destinos.tsx
├── Cronicas.tsx
├── Journal.tsx
├── Membresias.tsx
└── EventDetail.tsx
```

- **hero/**: Componentes que gestionan el hero (video persistente, hero por página, CTA). El hero que vive en el layout suele recibir datos vía store (url, título, subtítulo) actualizados por un componente “sin UI” que sincroniza query → store.
- **layout/**: Header, footer y elementos fijos (botón flotante). El layout público importa desde aquí.
- **sections/** (opcional): Secciones de contenido reutilizadas en varias páginas (manifesto, voces, membresías, etc.). Si son pocas, pueden estar en la raíz de `components/`.
- **event-detail/** (o nombre equivalente): Bloques propios de la página de detalle (hero, agenda, mapa, precios). Se importan desde el punto de entrada `EventDetail.tsx`.

---

## Puntos de entrada (páginas)

- Cada **ruta pública** que renderiza una “página” debe importar un **único componente** desde la feature, situado en la **raíz** de la feature: `Home.tsx`, `Destinos.tsx`, `EventDetail.tsx`, etc.
- Ese componente:
  - Llama a **un hook** (o varios) que concentran la lógica (datos, estado, callbacks).
  - **Solo** renderiza JSX con los valores que devuelve el hook; sin `useState`, `useEffect` innecesarios ni llamadas a servicios.
- Ejemplo: `Home.tsx` usa `useHomeHook()` y pinta `HeroWithVideo`, `HomeFeatureCards`, secciones, etc. con `heroTitle`, `heroSubtitle`, `homeFeatureItems` que vienen del hook.

---

## Hooks por página

| Página       | Hook                 | Responsabilidad |
|-------------|----------------------|------------------|
| Home        | `useHomeHook`        | i18n, construcción de `homeFeatureItems` (o equivalente); título/subtítulo del hero. |
| Destinos    | `useDestinosHook`    | Estado (tabs, paginación), `useEventsQuery`, helpers (`formatEventDate`, `isInPresale`), `handleTabChange`. |
| EventDetail | `useEventDetailHook` | `eventId`, query de evento y precios, `handleAcquire`, derivados (heroMedia, carouselImages, pricing). |
| Otras       | Hook específico o sin hook | Si la página solo compone secciones y traducción, puede no tener hook o uno mínimo. |

- Los hooks **exportan** helpers reutilizables (p. ej. `formatEventDate`, `isInPresale`) si otras partes del landing los usan.
- **PresaleBadge** (o similar) puede vivir en el mismo archivo que la página que lo usa, o en `components/` si se reutiliza en varias vistas.

---

## Componentes reutilizables

- **SectionHeader**: Eyebrow + título; variantes `layout="row"` (con acción a la derecha) y `layout="center"` (centrado, sin línea opcional). Props: `eyebrow`, `title`, `action?`, `layout?`, `showLine?`. Evita repetir el mismo bloque en Cronicas, Journal, Destinos, etc.
- **Hero**: Un componente “sin UI” que lee la query del hero y escribe en el store; el layout renderiza un único hero persistente que lee del store. Así el `<video>` no se remonta al cambiar de página.
- Botones: Siempre `Button` de HeroUI con `onPress`; en tabs o navegación, no usar `<button>`.

---

## Tema y estilos (landing)

- En el **CSS global** (o theme): definir variables para secciones de landing, por ejemplo:
  - `--color-landing-section`: fondo crema/claro de secciones.
  - `--color-landing-cream`, `--color-surface-dark`: variantes para cards o bloques.
  - `--color-success`: mensajes de éxito (p. ej. “acceso concedido”).
  - Hero: `--color-hero-fallback-green`, `--color-hero-fallback-blue` y clases de overlay (`.hero-overlay-green`, `.hero-overlay-blue`) si se usan fondos con imagen.
- En **componentes**: usar solo clases generadas por el tema (`bg-landing-section`, `bg-form-primary`, `text-accent`, `border-accent/40`, `text-success`). Nunca `bg-[#4B0D0D]` ni `text-[#333]`.
- Estilos de **terceros** (p. ej. estilos de mapa de Google) pueden seguir en un archivo de config como constantes; no son clases Tailwind.

---

## Tipos

- **Un solo `types.ts`** en la raíz de la feature. Tipos compartidos por la landing (props de secciones, payloads de i18n, etc.) se definen o re-exportan ahí. Los hooks y componentes importan desde `../types` o `@/app/features/landing/types`.

---

## Orden de importaciones

- Respetar el orden que exige el linter del proyecto (habitualmente: React → externos → relativos `./` → `import type` desde `@/` → imports `@/` de valores). Ver `recursos/errores-linter-typescript.md`, sección 5.

---

## Resumen

| Aspecto           | Regla |
|-------------------|--------|
| Páginas           | Una por archivo en la **raíz** de la feature; las rutas importan desde ahí. |
| Lógica            | En **hooks**; componentes solo UI y composición. |
| Hero / layout     | `components/hero/`, `components/layout/`; hero persistente vía store. |
| Secciones         | Reutilizables en `components/` o `components/sections/`; SectionHeader para eyebrow + título. |
| Estilos           | Solo clases del tema; variables de landing en CSS/theme. |
| Tipos             | Un `types.ts` en la raíz de la feature. |
| useEffects        | Mínimos; documentar cuando se usen (sync store, DOM imperativo, cleanup). |

Este patrón es **genérico**: los nombres (Destinos, EventDetail, EmpireHeroSection) se sustituyen por los del proyecto (Products, ProductDetail, BrandHeroSection, etc.), manteniendo la misma estructura y reglas.
