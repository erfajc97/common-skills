# Errores frecuentes (Backend) – Prettier/ESLint

Este documento recoge patrones que el linter (Prettier/ESLint) suele marcar y cómo corregirlos para no volver a cometerlos.

---

## 1. Llamadas a `new Date(...).toLocaleDateString(...)`

**Evitar:** Poner el argumento de `new Date()` y la llamada a `toLocaleDateString` en una sola línea cuando es larga.

```ts
// Mal
const eventDateStr = new Date(purchase.event.eventAt).toLocaleDateString(
  'es-ES',
  {
```

**Correcto:** El argumento de `new Date()` en su propia línea; el objeto de opciones con indentación consistente y cierre `});` en una sola línea.

```ts
// Bien
const eventDateStr = new Date(
  purchase.event.eventAt,
).toLocaleDateString('es-ES', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});
```

---

## 2. Propiedad `html` en objetos largos (p. ej. `resend.emails.send`)

**Evitar:** Una línea muy larga con `html: html || \`...\``.

```ts
// Mal (línea demasiado larga)
html: html || `<p>Has adquirido ${membershipName}. Beneficios hasta ${endDate}.</p>`,
```

**Correcto:** Partir en varias líneas cuando la línea supera el límite.

```ts
// Bien
html:
  html ||
  `<p>Has adquirido ${membershipName}. Beneficios hasta ${endDate}.</p>`,
```

Si la línea es corta (p. ej. fallback simple), puede quedarse en una sola línea:

```ts
html: html || `<p>De: ${name} &lt;${email}&gt;</p><p>${message}</p>`,
```

---

## 3. Objetos en una sola línea (decoradores, opciones)

**Evitar:** Objetos con varias propiedades en una sola línea cuando el linter pide formato multilínea.

```ts
// Mal
@ApiResponse({ status: 400, description: 'Datos inválidos o contacto no configurado' })
```

**Correcto:** Una propiedad por línea, con **trailing comma** (coma final), según Prettier.

```ts
// Bien
@ApiResponse({
  status: 400,
  description: 'Datos inválidos o contacto no configurado',
})
```

---

## 4. Asignaciones cortas partidas en varias líneas

**Evitar:** Partir una asignación simple que cabe en una línea.

```ts
// Mal
const subjectLine =
  payload.subject?.trim() || payload.email;
```

**Correcto:** Dejar la expresión en una sola línea cuando no sea demasiado larga.

```ts
// Bien
const subjectLine = payload.subject?.trim() || payload.email;
```

---

## Resumen

- **Prettier** usa `singleQuote: true` y `trailingComma: "all"`.
- Objetos y argumentos largos: partirlos en varias líneas con indentación consistente.
- Líneas cortas: no partirlas innecesariamente.
- Ejecutar `npm run lint` (y, si existe, `npm run format`) antes de hacer commit para evitar estos errores.
