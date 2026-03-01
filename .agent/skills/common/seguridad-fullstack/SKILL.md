---
name: seguridad-fullstack
description: >
  Guía de seguridad para aplicaciones web (front y back). Define checklist y
  buenas prácticas contra SQL injection, DDoS/eDoS, payload bombs, uploads
  inseguros y exposición de secretos. Se usa junto con las rules 05-security.
---

# Skill: Seguridad Fullstack

## Cuándo usar este skill
- Al implementar o modificar formularios (contacto, login, registro, perfil).
- Al tocar auth (login, refresh, forgot-password, resend-verification, cambio de contraseña).
- Al añadir o cambiar endpoints públicos o que envíen emails / suban archivos.
- Al validar inputs (body, query, params) o respuestas con datos sensibles.
- Al revisar protección frente a DDoS, eDoS o inyecciones.

## Fuente de verdad
- **Checklist y matriz**: `recursos/checklist-seguridad.md` (resumen por capa).
- **Reglas**: `.agent/rules/05-security.md`.

## Workflow (revisión de seguridad)
1. Identificar capa: front, back o ambos.
2. Aplicar ítems del checklist en `recursos/checklist-seguridad.md` según la capa.
3. Verificar que no se hayan introducido vectores nuevos (inputs sin validar, rutas sin límite, etc.).
4. Confirmar alineación front/back en límites de validación cuando haya formularios compartidos.

## Checklist resumido (detalle en recursos)
- **Backend**: Body size limit, DTOs con .max(), rate limiting (corto + diario en costosos), MIME en uploads, Prisma sin concat SQL, secretos por ENV.
- **Frontend**: Zod con .max() alineado al back, no enviar buffers en formularios de contacto/auth/perfil.
- **Común**: Sin secretos en código; respuestas y logs sin datos sensibles.

## Si el output no cumple
- Rechazar o corregir: no entregar cambios que omitan validación de inputs, rate limit en endpoints costosos o subidas sin whitelist MIME cuando el skill aplique.
