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
- [ ] Errores mapeados correctamente a HTTP (sin mensajes crudos)
- [ ] Guard(s)/interceptor(s) aplicados si corresponde
- [ ] Prisma queries eficientes (sin N+1, selects adecuados)
- [ ] Código sin lints/warnings y consistente con el repo
- [ ] No hardcode de secrets / conexión / credenciales
- [ ] Listados con paginación usan DTO común (PaginationQueryDto) y PaginatedResponse
