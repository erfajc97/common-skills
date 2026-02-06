---
name: logica-negocio-back
description: Contexto de la lógica de negocio (backend) para que el front implemente flujos, pantallas y contratos alineados con la API.
---

# Skill: Lógica de negocio (Back → Front)

## Cuándo usar este Skill

- Al implementar o refactorizar **pantallas/features** que consumen la API del proyecto (auth, usuarios, membresías, eventos, compras, etc.).
- Al definir **contratos** (tipos, payloads, query params) entre front y back.
- Al resolver **dudas de negocio** (descuentos, early access, precios, roles, paginación).
- Al integrar **nuevos endpoints** o flujos.

## Fuente de verdad

1. **Lógica de negocio**: `recursos/logica-negocio.md` (eventos, membresías, compras, descuentos, early access, auth, moneda).
2. **API y contratos**: `recursos/api-escapadas.md` (endpoints, métodos, auth, query/body, respuestas paginadas y formas de respuesta).

## Qué aporta este Skill

- **Contexto**: Cómo trabaja el back (compra directa de eventos, membresías en 3 niveles, precios en EUR, descuento al cobro, ventana de venta y early access).
- **Contratos**: Rutas, métodos, paginación (`page`, `per_page`, `search`), formato de listas (`data`, `total`, `page`, `per_page`, `total_pages`), y formas típicas (evento, pricing, compra).
- **Expectativas del front**: Qué debe mostrar (precio base vs final con descuento, mapa de eventos próximos, “mis compras”), qué debe enviar (Bearer token, body según DTO) y qué errores puede recibir (401, 403, 404, 400, 409).

## Workflow recomendado

1. **Antes de implementar una feature**: Leer `recursos/logica-negocio.md` (sección relevante: eventos, membresías, auth, etc.) y `recursos/api-escapadas.md` (endpoints afectados).
2. **Al definir tipos/clients**: Usar los contratos descritos en `api-escapadas.md` (paginación, respuesta de evento, pricing, detalle de usuario).
3. **Al mostrar precios o descuentos**: Consultar la sección de precios y membresías en `logica-negocio.md` y el endpoint `GET /events/:id/pricing`.
4. **Si algo no cuadra**: Verificar en el backend (README, Swagger, DTOs) y actualizar los recursos de esta skill si el contrato cambia.

## Checklist (Front alineado con Back)

- [ ] Auth: Access token en `Authorization: Bearer <token>`; refresh cuando caduque; rutas protegidas según rol (USER / ADMIN).
- [ ] Listados: Query `page`, `per_page`, `search` donde aplique; respuesta paginada con `data`, `total`, `page`, `per_page`, `total_pages`.
- [ ] Precios: Mostrar precio final (con descuento de membresía) usando `GET /events/:id/pricing`; moneda EUR.
- [ ] Compra de evento: Solo si `canPurchase` es true; usar `POST /events/:id/purchase`; no permitir doble compra.
- [ ] Mapa: Eventos próximos (10 días) con `GET /events/map`; usar `latitude`, `longitude`, `id`, `name`, `eventAt`, `location`.

## Output

- Código y flujos del front coherentes con la lógica de negocio y con la API documentada en los recursos.
- Tipos y llamadas que respeten paginación, auth y formas de respuesta del back.
