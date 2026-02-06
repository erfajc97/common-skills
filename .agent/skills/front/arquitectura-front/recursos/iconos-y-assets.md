# Iconos y assets (SVG)

## Dónde van los SVG
- Los **SVG** que se usan como iconos (logos, iconos de botón, etc.) van en **assets**, no inline en los componentes.
- Ruta estándar: `src/assets/svg/` (o `src/app/assets/svg/` según convención del proyecto).
- Cada icono es un **componente React** en su propio archivo, con nombre descriptivo (ej. `GoogleIcon.tsx`, `MailIcon.tsx`).

## Patrón del componente de icono
- Archivo: `src/assets/svg/{Nombre}Icon.tsx`.
- Exportar un componente que reciba props opcionales (ej. `width`, `height`) y renderice el `<svg>` con esos atributos. Los `fill` o colores que sean fijos (ej. marca de Google) pueden quedar en el SVG; si el icono debe aceptar color por prop, usar `fill={fill}`.
- Incluir `aria-hidden` cuando el icono sea decorativo.

Ejemplo:

```typescript
// src/assets/svg/GoogleIcon.tsx
interface GoogleIconProps {
  width?: number
  height?: number
}

export function GoogleIcon({ width = 20, height = 20 }: GoogleIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" xmlns="..." aria-hidden>
      {/* paths del icono */}
    </svg>
  )
}
```

## Uso en componentes
- En el componente que necesite el icono: **importar** desde `@/assets/svg/GoogleIcon` y usar `<GoogleIcon width={20} height={20} />`.
- **No** pegar el SVG inline en el componente; así los componentes se mantienen pequeños y el icono es reutilizable.

## Reglas
- SVG reutilizables → `src/assets/svg/{Nombre}Icon.tsx`, importar donde se necesiten.
- No inflar componentes con bloques grandes de SVG inline; usar siempre el componente de icono.
