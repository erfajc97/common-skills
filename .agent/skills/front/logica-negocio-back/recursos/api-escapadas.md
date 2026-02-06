# API Escapadas — Endpoints y contratos (Back → Front)

Base URL típica en desarrollo: `http://localhost:3001`. Documentación interactiva: `http://localhost:3001/api` (Swagger).

---

## Autenticación en requests

- **Rutas protegidas**: enviar `Authorization: Bearer <access_token>`.
- **Rutas opcionales** (ej. `GET /events/:id/pricing`): si se envía Bearer, el back aplica descuento por membresía; si no, devuelve precio base.
- **Solo ADMIN**: algunas rutas requieren rol ADMIN (401/403 si no).

---

## Auth (`/auth`)

| Método | Ruta                        | Auth          | Body / Query                          | Notas                     |
| ------ | --------------------------- | ------------- | ------------------------------------- | ------------------------- |
| POST   | `/auth/register`            | No            | email, password, name?, surname?, ... | Registro                  |
| POST   | `/auth/login`               | No            | email, password                       | Devuelve access + refresh |
| POST   | `/auth/refresh`             | Refresh token | body según back                       | Renovar access            |
| POST   | `/auth/logout`              | Bearer        | —                                     | Invalida refresh          |
| GET    | `/auth/google`              | No            | —                                     | Inicia OAuth Google       |
| GET    | `/auth/google/callback`     | No            | query code                            | Callback OAuth            |
| POST   | `/auth/verify-email`        | No            | token (query/body)                    | Verificación email        |
| POST   | `/auth/resend-verification` | No            | email                                 | Reenviar verificación     |
| POST   | `/auth/forgot-password`     | No            | email                                 | Envía enlace reset        |
| POST   | `/auth/reset-password`      | No            | token, newPassword                    | Reset con token           |

---

## Users (`/users`)

| Método | Ruta                    | Auth         | Query / Body           | Respuesta                                             |
| ------ | ----------------------- | ------------ | ---------------------- | ----------------------------------------------------- |
| GET    | `/users/me`             | Bearer       | —                      | Perfil del usuario                                    |
| PATCH  | `/users/me`             | Bearer       | body parcial           | Perfil actualizado                                    |
| GET    | `/users/me/attendances` | Bearer       | page, per_page         | Lista paginada de compras de eventos                  |
| GET    | `/users`                | Bearer ADMIN | page, per_page, search | Lista paginada de usuarios                            |
| GET    | `/users/:id`            | Bearer ADMIN | —                      | Usuario por ID                                        |
| GET    | `/users/:id/detail`     | Bearer ADMIN | —                      | Detalle completo (membresías, gastos, eventPurchases) |
| POST   | `/users`                | Bearer ADMIN | body create            | Crear usuario                                         |
| DELETE | `/users/:id`            | Bearer ADMIN | —                      | Eliminar usuario                                      |

**Paginación (listas)**: query `page`, `per_page`, `search`. Respuesta: `{ data, total, page, per_page, total_pages }`.

---

## Attendances (`/attendances`) — Compras de eventos

| Método | Ruta              | Auth   | Query          | Respuesta                                |
| ------ | ----------------- | ------ | -------------- | ---------------------------------------- |
| GET    | `/attendances/me` | Bearer | page, per_page | Lista paginada de mis compras de eventos |

Cada ítem incluye evento (y steps) y datos de la compra (amountPaid, status, purchasedAt).

---

## Events (`/events`)

| Método | Ruta                   | Auth            | Query / Body           | Respuesta                                                                              |
| ------ | ---------------------- | --------------- | ---------------------- | -------------------------------------------------------------------------------------- |
| GET    | `/events`              | No              | page, per_page, search | Lista paginada de eventos                                                              |
| GET    | `/events/map`          | No              | —                      | Eventos próximos (hoy → +10 días) con id, name, eventAt, latitude, longitude, location |
| GET    | `/events/:id`          | No              | —                      | Evento por ID (con steps)                                                              |
| GET    | `/events/:id/pricing`  | Opcional Bearer | —                      | basePrice, discountPercent, finalPrice, canPurchase, reason?                            |
| POST   | `/events/:id/purchase` | Bearer          | —                      | Compra creada (evento + amountPaid, status)                                             |
| POST   | `/events`              | Bearer ADMIN    | body create            | Evento creado                                                                          |
| PUT    | `/events/:id`          | Bearer ADMIN    | body parcial           | Evento actualizado                                                                     |
| DELETE | `/events/:id`          | Bearer ADMIN    | —                      | Evento eliminado                                                                      |

**Forma típica de evento**: id, name (i18n), description (i18n), location, images[], price, capacity, preSaleAt?, saleAt, eventAt, latitude?, longitude?, videos? ([]{ url, thumbnailUrl }), earlyAccessEnabled, steps[].

**Forma de pricing**: `{ basePrice, discountPercent, finalPrice, canPurchase, reason? }` (todos los precios en EUR).

---

## Memberships (`/memberships`)

| Método | Ruta                          | Auth         | Query / Body           | Respuesta                           |
| ------ | ----------------------------- | ------------ | ---------------------- | ----------------------------------- |
| GET    | `/memberships`                | No           | page, per_page, search | Lista paginada de membresías        |
| GET    | `/memberships/:id`            | No           | —                      | Membresía por ID                    |
| GET    | `/memberships/my-memberships` | Bearer       | —                      | Mis membresías activas/histórico    |
| POST   | `/memberships/:id/purchase`   | Bearer       | —                      | Membresía comprada (UserMembership) |
| POST   | `/memberships`                | Bearer ADMIN | body create            | Membresía creada                    |
| PUT    | `/memberships/:id`            | Bearer ADMIN | body parcial           | Membresía actualizada               |
| DELETE | `/memberships/:id`            | Bearer ADMIN | —                      | Membresía eliminada                 |

**Membresía**: level (ASPIRANT | PRIVE | ELITE), name (i18n), benefits (i18n[]), price (EUR), currency ("EUR"), durationMonths, maxEventsAllowed?.

---

## Statistics (`/statistics`)

| Método | Ruta          | Auth         | Query                          | Respuesta                                                                 |
| ------ | ------------- | ------------ | ------------------------------ | ------------------------------------------------------------------------- |
| GET    | `/statistics` | Bearer ADMIN | period? (day \| month \| year) | Ingresos (membresías + eventos), ventas por período; totales; todo en EUR |

---

## Upload (`/upload`)

| Método | Ruta      | Auth         | Body           | Notas                         |
| ------ | --------- | ------------ | -------------- | ----------------------------- |
| POST   | `/upload` | Bearer ADMIN | multipart file | Subida de imagen (Cloudinary) |

---

## Health

| Método | Ruta            | Auth | Respuesta                    |
| ------ | --------------- | ---- | ---------------------------- |
| GET    | `/` o `/health` | No   | OK / health check según back |

---

## Códigos HTTP típicos

- **200**: OK (GET/PUT/PATCH/DELETE que devuelven cuerpo).
- **201**: Creado (POST que crea recurso).
- **400**: Bad Request (validación, negocio: sin cupo, fuera de venta, ya comprado).
- **401**: No autenticado (falta o token inválido).
- **403**: Sin permiso (ej. no ADMIN).
- **404**: Recurso no encontrado.
- **409**: Conflicto (ej. ya comprado el evento).

---

## Tipos útiles para el front (referencia)

- **PaginatedResponse&lt;T&gt;**: `{ data: T[], total: number, page: number, per_page: number, total_pages: number }`.
- **Event (lista/detalle)**: id, name (es/en...), description, location, images[], price, capacity, preSaleAt?, saleAt, eventAt, latitude?, longitude?, videos?, earlyAccessEnabled, steps[].
- **Event (mapa)**: id, name, eventAt, latitude, longitude, location.
- **Pricing**: basePrice, discountPercent, finalPrice, canPurchase, reason?.
- **User**: id, email, name?, surname?, role, isEmailVerified, ...
- **Membership**: level, name, benefits, price, currency ("EUR"), durationMonths.
- **EventPurchase**: id, eventId, userId, amountPaid, status (CONFIRMED | COMPLETED), purchasedAt, event?.
