---
name: errores-linter-prettier
description: Evita errores de lint/Prettier en el backend: firmas de métodos con parámetros multínea, decoradores API con objetos multínea, y objetos de opciones largos. Usar al escribir o modificar servicios, controladores y DTOs en escapadas-back.
---

# Skill: Errores de Linter/Prettier en Backend

## Cuándo usar este Skill
- Al crear o editar servicios, controladores o DTOs en `escapadas-back`.
- Cuando el linter pide "Replace ... with" o "Insert `⏎`" (línea demasiado larga).
- Al añadir decoradores Swagger (`@ApiResponse`, `@ApiBody`, etc.) con descripciones largas.

## Fuente de verdad
- `recursos/errores-linter-prettier.md`: patrones a evitar y formato correcto.

## Reglas principales
1. **Firmas de métodos**: Parámetros en varias líneas cuando la línea supera el límite.
2. **Decoradores API**: Objetos `@ApiResponse`, `@ApiBody`, etc. con propiedades en varias líneas.
3. **Objetos de opciones**: Refines, classNames y configuraciones largas en varias líneas.

Para DTOs con Zod, ver también `dto-zod-lint` (aserciones no-null y formateo de refines).

## Checklist antes de guardar
- [ ] Firmas de métodos con parámetros largos están partidas en varias líneas.
- [ ] Objetos en decoradores Swagger están formateados en varias líneas si la línea es larga.
- [ ] El archivo pasa el linter sin warnings ni errores.
