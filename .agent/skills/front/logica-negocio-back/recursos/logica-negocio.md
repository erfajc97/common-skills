# Lógica de negocio Escapadas (Back → Front)

Resumen de cómo funciona el backend para que el front implemente pantallas y flujos correctos.

---

## 1. Visión general

- **Escapadas** vende **membresías** (planes con beneficios) y **eventos** (escapadas) que se **compran de forma independiente**.
- Los **eventos no dependen de la membresía** para ser comprados: cualquier usuario puede comprar un evento (respetando cupos y fechas de venta).
- La **membresía** da: **descuento** en la compra de eventos y, en nivel Privé, **acceso anticipado** (48 h antes de la venta oficial) cuando el evento tiene `earlyAccessEnabled`.
- **Moneda**: todo en **EUR** (precios de membresías, eventos y gastos).

---

## 2. Eventos

- Cada evento tiene: **precio**, **cupos** (`capacity`), fechas **preSaleAt** (opcional), **saleAt** (inicio venta oficial), **eventAt** (fecha/hora del evento).
- **Ubicación**: `location` (texto), `latitude`, `longitude` (para mapa).
- **Multimedia**: `images` (array de URLs), `videos` (array de `{ url, thumbnailUrl }`).
- **Early access**: si `earlyAccessEnabled` es true, usuarios con membresía **Privé** pueden comprar desde **saleAt - 48 h**; el resto desde **saleAt**.
- **Compra**: un usuario no puede comprar el mismo evento dos veces; se respetan cupos y ventana de venta (saleAt/early access hasta eventAt).

**Qué debe hacer el front:**

- Listar eventos (paginado, búsqueda por nombre/descripción).
- Mostrar evento con precio, cupos, fechas, coords, imágenes y videos (con thumbnail).
- Para **precio final** (con descuento): usar `GET /events/:id/pricing` (opcional Bearer para aplicar descuento por membresía).
- Para **mapa**: usar `GET /events/map` (eventos desde hoy hasta +10 días, con id, name, eventAt, latitude, longitude, location).
- Comprar con `POST /events/:id/purchase` (Bearer obligatorio); solo si `canPurchase` es true en la respuesta de pricing.

---

## 3. Membresías (3 niveles)

| Nivel    | Descuento en eventos | Early access 48 h       | Notas             |
| -------- | -------------------- | ----------------------- | ----------------- |
| Aspirant | 10%                  | No                      | Solo descuento    |
| Privé    | 20%                  | Sí (si evento lo tiene) | Descuento + early |
| Elite    | —                    | —                       | Coming soon       |

- Las membresías se **compran** (UserMembership: inicio, fin, estado ACTIVE/EXPIRED/CANCELLED).
- **Beneficios** son sobre todo descriptivos (texto i18n en `name` y `benefits`); la lógica que afecta al front es **descuento** y **early access**.
- **Moneda**: precios en **EUR**.

**Qué debe hacer el front:**

- Listar planes (membresías) con precio en EUR.
- Comprar membresía con `POST /memberships/:id/purchase` (Bearer).
- Mostrar "mis membresías" con `GET /memberships/my-memberships` (Bearer).

---

## 4. Precios y descuentos en eventos

- El **descuento** se aplica **al cobro**: el usuario ve el precio final en checkout (o en detalle de evento si el back devuelve pricing).
- **GET /events/:id/pricing** (opcional Bearer):
  - Sin auth: `basePrice`, `discountPercent: 0`, `finalPrice = basePrice`, `canPurchase` según fechas y cupos.
  - Con auth y membresía activa: `discountPercent` (10 o 20 según nivel), `finalPrice` ya con descuento, `canPurchase` y `reason` si no puede comprar.
- El front debe mostrar **precio final** (y opcionalmente "Precio base X EUR, -Y% con tu membresía") cuando haya descuento.

---

## 5. Compras de eventos (EventPurchase)

- Una compra genera un **EventPurchase** (userId, eventId, amountPaid, status CONFIRMED/COMPLETED).
- **Mis compras**: `GET /attendances/me` o `GET /users/me/attendances` (paginado, Bearer). Misma respuesta: lista paginada de compras con evento y datos necesarios.
- **Estado**: CONFIRMED hasta que pase la fecha del evento; luego el back puede marcar COMPLETED (el front puede mostrar "Completado" cuando `eventAt` ya pasó).

---

## 6. Autenticación y roles

- **Roles**: `USER`, `ADMIN`.
- **Access token**: JWT en `Authorization: Bearer <token>`; payload incluye `sub` (userId), `email`, `role`.
- **Refresh**: `POST /auth/refresh` con refresh token para renovar access token.
- **Flujos**: registro, login, logout, Google OAuth, verificación de email, resend verification, forgot password, reset password.
- Rutas **solo ADMIN**: listar/crear/editar/eliminar usuarios, detalle usuario, estadísticas, crear/editar/eliminar eventos, crear/editar/eliminar membresías, upload.

**Qué debe hacer el front:**

- Enviar Bearer en todas las rutas que lo requieran (Swagger/API indica 401 si falta).
- Renovar token con refresh antes de que caduque.
- Ocultar o deshabilitar acciones de admin para usuarios sin rol ADMIN.

---

## 7. Paginación y búsqueda

- **Query estándar** en listados: `page` (default 1), `per_page` (default 10, máx 100), `search` (opcional).
- **Respuesta paginada**:
  ```json
  { "data": [...], "total": N, "page": 1, "per_page": 10, "total_pages": M }
  ```
- Listados que usan paginación: users, memberships, events, mis compras (attendances/me), etc.

---

## 8. Estadísticas (solo ADMIN)

- **GET /statistics** (Bearer, ADMIN): ingresos por membresías y por eventos (ventas), por período (día, mes, año) o totales.
- Todos los importes en **EUR** (implícito en el back).

---

## 9. Resumen para el front

- **Moneda**: EUR en toda la app (precios, gastos, estadísticas).
- **Eventos**: compra directa; precio con descuento vía `GET /events/:id/pricing`; mapa con `GET /events/map`.
- **Membresías**: 3 niveles (Aspirant 10%, Privé 20% + early access, Elite coming soon); compra y "mis membresías".
- **Compras**: "Mis compras" en `/attendances/me` o `/users/me/attendances`; comprar evento con `POST /events/:id/purchase` cuando `canPurchase` sea true.
- **Auth**: Bearer + refresh; roles USER/ADMIN; flujos de verificación y reset de contraseña.
- **Paginación**: `page`, `per_page`, `search` y respuesta `{ data, total, page, per_page, total_pages }`.
