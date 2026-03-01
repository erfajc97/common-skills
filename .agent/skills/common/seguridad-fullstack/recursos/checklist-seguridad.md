# Checklist de seguridad (detalle por capa)

## Backend

| Área | Regla | Ejemplo |
|------|--------|---------|
| Body size | Límite global JSON (y urlencoded) | `express.json({ limit: '200kb' })` |
| DTOs | Todos los strings con `.max()` | email 255, password 128, name 200, etc. |
| Rate limiting | Endpoints públicos y costosos | Throttler: short (min), email (hora), day (24h) por IP |
| IP real | Detrás de proxy | `trust proxy` + guard con `req.ips?.[0] ?? req.ip` |
| SQL | Sin concatenar input de usuario | Prisma con parámetros; `Prisma.sql` con variables |
| Upload | Tamaño + whitelist MIME | 5 MB imagen, 100 MB video; solo image/* y video/* permitidos |
| Secretos | Nunca en código | ENV para DB, API keys, tokens |
| Errores | No exponer internals | HTTP exceptions; no mensajes crudos de DB al cliente |

## Frontend

| Área | Regla | Ejemplo |
|------|--------|---------|
| Formularios | Zod con `.max()` alineado al back | Mismos límites que DTOs del API |
| Envío | No buffers arbitrarios en contact/auth/profile | Solo JSON; FormData solo para 1 archivo en uploads con límite en back |
| Sensibles | No guardar tokens/secretos en código ni en respuestas visibles | Env vars o estado seguro; no loguear tokens |

## Endpoints costosos (eDoS)

Aplicar límite **diario** además del por minuto/hora:

- Contact (email): ej. 30/día por IP.
- Forgot-password / Resend-verification: ej. 8/día por IP.
- Register (email verificación): ej. 12/día por IP.

## Validación alineada front/back

- Mismos valores de `.max()` en campos equivalentes (email, password, name, phone, etc.).
- Backend es la fuente de verdad; front aplica defensa en profundidad.
