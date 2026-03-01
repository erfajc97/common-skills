---
name: entornos-env
description: Implementa y documenta NODE_ENV (development, staging, production) en el backend para throttle, logs y config sensible al entorno.
---

# Skill: Entornos (NODE_ENV) en Backend

## Cuándo usar este skill
- Al configurar rate limiting (Throttler), logs o cualquier comportamiento que deba cambiar entre desarrollo y producción.
- Al añadir o revisar variables de entorno del backend.
- Cuando el proyecto deba funcionar en desarrollo local, staging y producción con límites o reglas distintas.

## Valores de NODE_ENV que debe soportar el back
- **development**: entorno local; límites de throttle altos, logs verbosos si aplica.
- **staging**: preproducción; mismos límites/rigor que producción (throttle estricto, sin debug).
- **production**: producción; límites de seguridad y rate limit estrictos.

## Implementación obligatoria

### 1. Configuración según entorno
- Usar `ConfigService.get('NODE_ENV')` (o `process.env.NODE_ENV`) para ramificar lógica.
- Considerar desarrollo cuando `NODE_ENV` no sea `'production'` ni `'staging'`.
- Ejemplo: ThrottlerModule con `forRootAsync`, inyectando `ConfigService` y definiendo límites distintos según `NODE_ENV`.

### 2. Documentación en .env.example
- Incluir `NODE_ENV` con un comentario que indique los valores posibles y su efecto.
- Ejemplo: `# NODE_ENV: development (por defecto) | staging | production`

### 3. No hardcodear entorno
- No asumir "si no existe es production". Por defecto, si no se define, tratar como desarrollo (límites permisivos) para no bloquear a quien desarrolla sin setear la variable.

### 4. Throttlers nombrados en NestJS (@nestjs/throttler)
- **Importante**: En Throttler, **todos** los throttlers definidos en `forRoot`/`forRootAsync` se aplican a **todas** las rutas. Cada request se evalúa contra short, email, day, etc.
- Si defines un throttler "email" con `limit: 3` por hora a nivel global, **todas** las rutas (incl. GET /memberships, GET /events) tendrán ese límite y devolverán 429 tras 3 requests/hora.
- **Patrón correcto**: Límite global alto para "email" (ej. 10_000 en dev, 1000 en prod). Las rutas sensibles (forgot-password, resend-verification) deben usar `@Throttle({ email: { limit: 3, ttl: 3600000 } })` para **sobrescribir** solo en ese endpoint. Así el resto de la API no se ve afectado.
- Ver `recursos/env-node-env.md` para el ejemplo correcto.

## Checklist al aplicar este skill
- [ ] Cualquier límite o comportamiento sensible al entorno (throttle, CORS, etc.) depende de `NODE_ENV`.
- [ ] `.env.example` documenta `NODE_ENV` y sus valores (development, staging, production).
- [ ] En desarrollo: límites altos para no obstaculizar; en staging/production: límites razonables de seguridad.
- [ ] Si hay throttlers nombrados (ej. "email"): límite global alto; rutas sensibles con `@Throttle({ nombre: { limit, ttl } })` para no bloquear el resto de la API.

## Recurso de referencia
- Ver `recursos/env-node-env.md` para resumen de valores y ejemplos de uso en Throttler y similares.
