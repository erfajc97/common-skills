---
name: errores-frecuentes
description: >
  Patrones concretos de errores Prettier/ESLint en backend (Date/toLocaleDateString,
  propiedad html larga, decoradores en una línea, asignaciones cortas partidas).
  Consultar al escribir o modificar código en el back para no repetir estos fallos.
---

# Skill: Errores frecuentes (Backend)

## Cuándo usar este skill
- Al escribir o modificar código en el backend (servicios, controladores, DTOs, email, utilidades).
- Cuando el linter reporta "Replace ... with" o pide insertar saltos de línea.
- Al formatear llamadas a `new Date().toLocaleDateString()`, objetos en decoradores `@ApiResponse`/`@ApiBody`, propiedades `html` largas o asignaciones cortas.

## Fuente de verdad
- `recursos/errores-frecuentes.md`: patrones a evitar y ejemplos correctos (Date, html, decoradores, asignaciones).

## Reglas principales
1. **Date + toLocaleDateString**: Argumento de `new Date()` en su propia línea; opciones de `toLocaleDateString` con indentación consistente.
2. **Propiedad `html` larga**: Partir en varias líneas cuando supere el límite; si es corta, una línea está bien.
3. **Decoradores y objetos**: Una propiedad por línea con trailing comma cuando el objeto es largo.
4. **Asignaciones cortas**: No partir en varias líneas si la expresión cabe en una línea.

Complementa la skill **errores-linter-prettier** (firmas de métodos, decoradores API, objetos de opciones). Para DTOs Zod, ver también **dto-zod-lint**.

## Checklist antes de guardar
- [ ] No hay `new Date(x).toLocaleDateString(...)` con línea larga; el argumento de `Date` en su línea.
- [ ] Objetos en decoradores y propiedades `html` largas partidos en varias líneas.
- [ ] Asignaciones que caben en una línea no están partidas innecesariamente.
- [ ] El archivo pasa el linter sin warnings.
