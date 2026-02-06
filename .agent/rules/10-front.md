---
trigger: always_on
---
---
trigger: glob
globs: "**/escapadas-front/**/*.{ts,tsx,css,mdx,json}, **/escapadas-front/**/tailwind.config.*, **/escapadas-front/**/postcss.config.*, **/escapadas-front/**/vite.config.*, **/escapadas-front/**/next.config.*"
---

# Front Rules

## Prioridad: arquitectura del proyecto
- **Siempre priorizar** la arquitectura y convenciones definidas en `.agent/skills/front/arquitectura-front`. Es la forma de desarrollo de la software factory; las skills vendor aportan buenas prácticas pero **no deben contradecir** esta arquitectura.
- Si hay conflicto entre una skill vendor y la arquitectura-front: gana la arquitectura-front.

## Skills del proyecto (obligatorias en front)
- **Arquitectura**: `.agent/skills/front/arquitectura-front` — Estructura de features, queries compartidas, mutations, servicios, tipos, estilos, componentes, iconos. Es la fuente de verdad de cómo se organiza el front.
- **Estilo y marca**: `.agent/skills/front/estilo-marca` — Colores, tipografías, tono, textos, guía visual. Usar siempre que se genere UI o copy.
- **Lógica de negocio (back)**: `.agent/skills/front/logica-negocio-back` — Contexto de la API y reglas de negocio (backend) para que el front implemente flujos alineados con la API.
- **Figma** (si aplica): `.agent/skills/front/figma` — Alinear UI a diseños (spacing, tipografías, componentes).

## Skills vendor (buenas prácticas)
- Aplicar estándares técnicos cuando no contradigan la arquitectura del proyecto:
  - .agents/skills/tailwind-design-system
  - .agents/skills/tanstack-query
  - .agents/skills/tanstack-router
  - .agents/skills/tanstack-start
  - .agents/skills/zod
  - .agents/skills/zustand-state-management

## MCPs
- Si hay **MCPs conectados** (Context7, documentación de librerías, etc.): **usarlos** para información actualizada y documentación oficial antes de asumir APIs o patrones.

## UI
- Usar **Hero UI** para tablas, botones, paginación, modales y componentes necesarios.
- Usar los **CustomComponents** de `src/app/components/UI/` cuando existan (CustomTableNextUi, CustomModalNextUI, CustomPagination).
- Si un componente Hero UI se puede convertir en custom reusable, hacerlo solo si no existe uno equivalente.

## Data fetching y estado
- **Queries compartidas** en `src/app/tanstack-queries/`; las features las importan. Ver arquitectura-front (queries-compartidas.md).
- **Mutations** en `mutations/` de cada feature; llaman al servicio, toast e invalidateQueries. Ver arquitectura-front (mutations-y-servicios.md).
- **Axios**: una instancia centralizada (`axiosConfig.ts`); los servicios no duplican baseURL.
- Evitar estado duplicado: no guardar en Zustand datos que ya están en caché de TanStack Query (salvo auth/session, UI global, feature flags).

## Arquitectura y tamaño
- Mobile first.
- Componentes de **responsabilidad única**: solo UI (JSX y props). La lógica va en **hooks**; los componentes importan el hook y renderizan con lo que expone. El componente principal de la feature (`{Feature}.tsx`) debe ser **delgado**: una llamada al hook de página y render; sin useState/handlers inline.
- Si un componente crece, extraer subcomponentes y/o mover lógica a hooks.
- **useEffect** mínimo; preferir funciones llamadas en el momento adecuado (ver arquitectura-front, feature-implementation.md).
