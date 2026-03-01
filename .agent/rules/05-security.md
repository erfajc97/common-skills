---
trigger: always_on
---

# Security Rules (Siempre activas para front y back)

Estas reglas aplican a **cualquier cambio** que toque formularios, autenticación, endpoints públicos, subida de archivos o datos sensibles. Los agentes frontend y backend deben cumplirlas y apoyarse en `.agent/skills/common/seguridad-fullstack` para detalles.

## Prioridad
- En decisiones que afecten a **seguridad**, las reglas de este archivo y la skill seguridad-fullstack tienen prioridad sobre convenciones de estilo o arquitectura que las contradigan (ej.: no omitir validación o rate limit "por simplicidad").

## Reglas obligatorias

### Inputs y payloads
- **Backend**: Todo input (body, query, params) validado con Zod (o equivalente). Strings con `.max()` para evitar payload bombs. Límite global de tamaño de body JSON (ej. 200 KB) cuando aplique.
- **Frontend**: Esquemas Zod de formularios alineados al backend (mismos `.max()`). No enviar buffers arbitrarios en formularios de contacto/auth/perfil; solo datos estructurados.

### Rate limiting y abuso
- Endpoints **públicos** o que generen **coste** (emails, subidas): protegidos con rate limiting (por minuto y, en costosos, por día por IP).
- Usar IP real cuando la app esté detrás de proxy (trust proxy + guard que use `req.ips` o `X-Forwarded-For`).

### Base de datos
- No concatenar input de usuario en SQL. Usar ORM (Prisma) con consultas parametrizadas; si hay raw, solo con parámetros escapados (ej. `Prisma.sql` con variables).

### Subida de archivos
- Límite de tamaño por ruta (imagen/video). Whitelist de tipos MIME; rechazar el resto con 400.

### Secretos y configuración
- Sin tokens, passwords ni connection strings en código. Configuración sensible por variables de entorno.

### Respuestas y logs
- No exponer mensajes crudos de base de datos ni datos sensibles en respuestas HTTP o logs.

## Consulta al agente de seguridad
- Para revisiones de seguridad o dudas: usar el agente **security** (`.agent/agents/security.md`) y la skill **seguridad-fullstack** (`.agent/skills/common/seguridad-fullstack/`).
