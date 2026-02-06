# Tipos y estilos (Tailwind / tema)

## Tipos por feature
- **Un solo archivo** `types.ts` por feature en la raíz de la feature: `src/app/features/{feature}/types.ts`.
- Ahí van todos los tipos usados por esa feature: payloads de API, respuestas, tipos de formulario, props compartidas. Los componentes, hooks, servicios y mutations importan desde `../types` o `@/app/features/{feature}/types`.
- **No** definir interfaces en los servicios ni repetir el mismo tipo en varios archivos. Re-exportar desde `types.ts` si el tipo viene de `@/app/types` (ej. `User`).

## Tailwind y tema
- Los colores y variables de diseño se definen **en un solo lugar**: el archivo de estilos global (ej. `src/styles.css`) en `:root` y en el bloque `@theme inline` (Tailwind v4) para que se generen clases de utilidad.
- En los **componentes** se usan **solo clases de Tailwind** derivadas del tema (ej. `text-primary`, `bg-form-primary`, `text-form-muted`, `border-form-border`). **No** usar en componentes:
  - `style={{ color: 'var(--color-primary)' }}`
  - Clases con hex sueltos (ej. `text-[#8B7355]`) salvo que ese hex esté definido como variable en el theme y la clase sea la generada por el theme (ej. `text-form-accent`).
- Objetivo: poder cambiar el branding modificando solo el theme; los componentes no dependen de variables CSS ni hex hardcodeados.

## Nombres semánticos en el theme
- Definir colores con nombres semánticos (ej. `form-foreground`, `form-muted`, `form-accent`, `form-primary`, `form-bg`, `form-border`) en el theme y usarlos en formularios y modales.
- Para botones, textos y fondos usar siempre las clases generadas por el theme (primary, secondary, form-primary, etc.), nunca `--var` ni hex dentro del JSX/className.

## Reglas
- Tipos: un `types.ts` por feature; todo lo que sea tipos va ahí.
- Estilos: theme en `styles.css`; en componentes solo clases como `text-primary`, `bg-form-primary`, etc., nunca `var(--...)` ni hex en className.
