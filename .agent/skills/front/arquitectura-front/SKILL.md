---
name: arquitectura-front
description: Estándar de Screaming Architecture para el frontend. Define estructura por features, queries compartidas, mutations, servicios, componentes UI, tipos, estilos y assets. Incluye reglas para no repetir errores de linter/TypeScript (aserciones innecesarias, optional chaining o condicionales redundantes cuando el tipo ya lo garantiza); ver recursos/errores-linter-typescript.md.
---

# Skill: Arquitectura Front (Screaming Architecture)

## Cuándo usar este Skill
- **Feature**: Al crear o refactorizar una feature (CRUD, auth, etc.).
- **Landing / sitio público**: Al organizar o tocar la feature que agrupa home, listados públicos y detalle (hero, layout, secciones). Ver `recursos/estructura-landing.md`.
- **UI**: Al crear tablas, modales, paginación o formularios.
- **Queries/Mutations**: Al cargar datos o al mutar (crear, editar, eliminar).
- **Routing**: Al definir rutas protegidas.
- **Setup**: Al configurar endpoints, providers o tema.

## Fuente de verdad (recursos)

| Regla | Recurso | Resumen |
|-------|---------|--------|
| Estructura de features y app | `recursos/estructura-features.md` | Carpetas por feature, `types.ts`, `mutations/`, `services/`, `tanstack-queries/` a nivel app. |
| Queries compartidas | `recursos/queries-compartidas.md` | Queries en `src/app/tanstack-queries/`; un archivo por dominio; features las importan. |
| Mutations y servicios | `recursos/mutations-y-servicios.md` | Mutations llaman al servicio; toast e invalidateQueries en mutations; hooks llaman a mutations. |
| Implementación de feature | `recursos/feature-implementation.md` | Componentes solo UI; hooks con lógica; create/edit mismo formulario; useEffect mínimo. |
| Tipos y estilos | `recursos/tipos-y-estilos.md` | Un `types.ts` por feature; Tailwind con tema (primary, form-*); nunca `--var` ni hex en componentes. |
| Iconos y SVG | `recursos/iconos-y-assets.md` | SVG en `src/assets/svg/` como componentes; importar, no inline. |
| Componentes UI | `recursos/components-ui.md` | HeroUI + CustomComponents; no repetir; SVGs en assets. |
| Flujo de datos | `recursos/patrones-codigo.md` | Componente → Hook → Mutation/Query → Service → axios. |
| Errores linter/TS | `recursos/errores-linter-typescript.md` | No aserciones innecesarias, no optional chaining ni condicionales redundantes con el tipo. Orden de importaciones. |
| Estructura landing | `recursos/estructura-landing.md` | Feature landing: puntos de entrada en raíz, hero/layout/sections, hooks por página, SectionHeader, tema sin hex. Reutilizable en otros proyectos. |
| Axios | `recursos/axios-config.ts` | Una instancia; servicios sin baseURL duplicado. |
| Estado auth | `recursos/state-auth.ts` | Store de autenticación. |

## Checklist antes de crear o modificar una feature

- [ ] **Tipos**: ¿Todos los tipos de la feature están en `types.ts`? No definir interfaces en servicios.
- [ ] **Queries**: ¿La query vive en `src/app/tanstack-queries/xxxQuery.ts` y la feature la importa?
- [ ] **Mutations**: ¿Están en `mutations/` y llaman al servicio + toast + invalidateQueries?
- [ ] **Servicios**: ¿Usan solo `axiosInstance` y `API_ENDPOINTS`? ¿Sin baseURL duplicado?
- [ ] **Hooks**: ¿Contienen la lógica (estado, validación) y llaman a mutations (y queries compartidas)?
- [ ] **Componentes**: ¿Solo UI (JSX y props)? ¿No llaman a servicios ni mutations directamente?
- [ ] **useEffect**: ¿Se evita salvo cuando sea estrictamente necesario?
- [ ] **Create/Edit**: ¿Mismo formulario; el hook decide create vs update por id/entidad?
- [ ] **Toasts**: ¿Sonner/Toast en las mutations (onSuccess/onError)?
- [ ] **Estilos**: ¿Clases del tema (text-primary, bg-form-primary, etc.) y no hex ni `var(--...)` en componentes?
- [ ] **Linter/TS**: ¿Sin aserciones innecesarias (`as`), optional chaining (`?.`) ni condicionales redundantes cuando el tipo ya lo garantiza? Ver `recursos/errores-linter-typescript.md`.
- [ ] **SVG**: ¿Iconos en `assets/svg/` e importados, no inline?
- [ ] **UI**: ¿HeroUI y CustomComponents (CustomTableNextUi, CustomModalNextUI, CustomPagination)? ¿Botones con `Button` y `onPress` (nunca `<button>`)? ¿Texto de botones legible (en fondos claros usar `text-form-foreground`)? Ver `recursos/components-ui.md`.

## Workflow al crear una feature

1. Crear `types.ts` con payloads y tipos de la feature.
2. Crear o usar servicio en `services/` (solo axiosInstance + API_ENDPOINTS).
3. Si hay lectura de lista/datos compartidos: crear o usar query en `src/app/tanstack-queries/xxxQuery.ts`.
4. Crear mutations en `mutations/` (servicio + toast + invalidateQueries).
5. Crear hooks en `hooks/` que usen las queries compartidas y las mutations; exponer datos y callbacks.
6. Crear componentes en `components/` solo con UI; que consuman los hooks.
7. Punto de entrada: `{Feature}.tsx` que orquesta hooks y componentes.

## Relación con otras skills del proyecto
- **arquitectura-front** define **cómo** se estructura y se escribe el código (carpetas, flujo, tipos, estilos, queries, mutations). Tiene prioridad sobre skills vendor en caso de conflicto.
- **estilo-marca** define **cómo se ve** la marca (colores, tipografías, tono, textos). Los estilos en componentes deben respetar el tema definido en arquitectura-front (tipos-y-estilos.md) y la guía visual de estilo-marca.
- **logica-negocio-back** define **qué hace** el back y los contratos API; el front se alinea a eso usando la arquitectura-front.
- En conjunto forman el ecosistema del front: arquitectura (estructura y patrones) + marca (visual y copy) + negocio (API y reglas).

## Output esperado
- Código alineado con los recursos anteriores.
- Imports desde `@/app/tanstack-queries/`, `@/app/components/UI/`, `@/app/config/axiosConfig`, etc.
- Sin duplicar lógica ni tipos; sin useEffects innecesarios; sin hex ni `var()` en componentes.
