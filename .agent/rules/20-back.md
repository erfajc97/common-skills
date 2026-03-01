---
trigger: always_on
---

---
trigger: glob
globs: "escapadas-back/**/*.{ts,prisma,json}, escapadas-back/**/prisma/**/*, escapadas-back/**/.env*, escapadas-back/**/docker-compose*.yml"
---

# Backend Rules (NestJS + Prisma + PostgreSQL)

## Stack y estándares obligatorios
- Framework: NestJS
- ORM: Prisma
- DB: PostgreSQL
- Validación: Zod

## Skills del proyecto (back)
- **.agent/skills/back/entornos-env**: Soportar NODE_ENV (development, staging, production). Configuración sensible al entorno (throttle, etc.) con límites altos en desarrollo y estrictos en staging/production. Documentar NODE_ENV en .env.example. Ver `recursos/env-node-env.md`.
- **.agent/skills/back/dto-zod-lint**: Al escribir o modificar DTOs/schemas con Zod:
  - No usar aserciones no-null (`!`) innecesarias en refines; usar guards, desestructuración o comprobaciones explícitas.
  - Formatear mensajes y opciones largas en refines (varias líneas) para cumplir el linter.
- **.agent/skills/back/errores-linter-prettier**: Al escribir o modificar servicios, controladores o DTOs:
  - Firmas de métodos con parámetros largos: partir en varias líneas.
  - Decoradores Swagger (`@ApiResponse`, etc.) con objetos largos: partir propiedades en varias líneas.
  - Ver `recursos/errores-linter-prettier.md` para patrones a evitar.
- **.agent/skills/back/errores-frecuentes**: Al escribir o modificar código en el back, tener en cuenta los patrones de `recursos/errores-frecuentes.md`: `new Date().toLocaleDateString()`, propiedad `html` larga, objetos en decoradores en una línea, asignaciones cortas partidas innecesariamente.

## Skills vendor que SIEMPRE deben guiar el trabajo
- .agents/skills/nestjs-best-practices
- .agents/skills/nestjs-guards-interceptors
- .agents/skills/prisma-expert
- .agents/skills/zod

> Estas skills definen arquitectura, manejo de errores, guards/interceptors, seguridad, patrones Prisma, etc.

## Convenciones backend obligatorias
- Arquitectura Nest: módulos por dominio (Module/Controller/Service).
- Manejo de errores:
  - Usar Exceptions de Nest (`HttpException`, `BadRequestException`, etc.).
  - Centralizar errores cuando aplique (Exception Filters si el proyecto lo usa).
- Seguridad:
  - Proteger rutas con Guards cuando aplique.
  - No filtrar data sensible en responses/logs.
- Validación:
  - Validar inputs con Zod (body/query/params) antes de usarlos.
  - Transformar y tipar usando `z.infer` cuando aplique.
- Prisma:
  - Evitar N+1 (incluir relaciones con `include/select` según convención).
  - Respetar transacciones cuando hay escritura múltiple.
  - Mantener consistencia en naming de modelos/campos.

## Paginación y filtros en listados
- Los endpoints que devuelven **listas** (ej. GET /users, GET /memberships, GET /events) deben:
  - Aceptar query **page** (default 1), **per_page** (default razonable, ej. 10) y **search** (opcional).
  - Usar el DTO común `PaginationQueryDto` en `common/dto/pagination-query.dto.ts`.
  - Devolver siempre el tipo común `PaginatedResponse<T>`: `{ data, total, page, per_page, total_pages }`.
- El parámetro **search** aplica sobre campos acordados por recurso:
  - Usuarios: id, email, name, surname, phone, identityNumber.
  - Membresías: nombre (JSON es/en).
  - Eventos: nombre y descripción (JSON es/en).
- Documentar en Swagger los query params (page, per_page, search) en cada listado afectado.

## Checklist antes de entregar cambios backend
- [ ] Inputs validados con Zod (body/query/params)
- [ ] DTOs Zod: sin `!` innecesarios en refines; mensajes/opciones largas en varias líneas (ver skill dto-zod-lint)
- [ ] Linter/Prettier: firmas de métodos y decoradores API formateados en varias líneas cuando la línea es larga (ver skill errores-linter-prettier)
- [ ] Errores mapeados correctamente a HTTP (sin mensajes crudos)
- [ ] Guard(s)/interceptor(s) aplicados si corresponde
- [ ] Prisma queries eficientes (sin N+1, selects adecuados)
- [ ] Código sin lints/warnings y consistente con el repo
- [ ] No hardcode de secrets / conexión / credenciales
- [ ] Listados con paginación usan DTO común (PaginationQueryDto) y PaginatedResponse
- [ ] Entornos: si hay rate limit o config por entorno, usar NODE_ENV (development | staging | production) y documentar en .env.example (skill entornos-env)
