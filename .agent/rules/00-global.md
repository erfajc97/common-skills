---
trigger: always_on
---

# Global Rules (Siempre activas)

Estas reglas, junto con las rules de seguridad (05-security), las rules por dominio (10-front, 20-back) y las skills en `.agent/skills/`, forman un **ecosistema reutilizable**: la arquitectura y convenciones del proyecto son la prioridad; las skills vendor y los MCPs aportan buenas prácticas e información actualizada sin contradecirla.

## Prioridades (orden de autoridad)
1) Estas reglas globales (.agent/rules/00-global.md)
2) Reglas de seguridad (.agent/rules/05-security.md) — aplican a front y back en todo lo que afecte a seguridad.
3) Reglas específicas por dominio (.agent/rules/10-front.md, .agent/rules/20-back.md)
4) **Arquitectura y convenciones del proyecto** (skills en .agent/skills/**: arquitectura-front, estilo-marca, logica-negocio-back). Tienen prioridad sobre skills vendor.
5) Skills vendor (.agents/skills/**): buenas prácticas y contexto de librerías; usarlas sin contradecir la arquitectura del proyecto.
6) Preferencias del modelo (lo último)
7) Crear plan usando la SKILL.md dentro de la carpeta .agent/skills/common/planificacion-pro
8) **MCPs**: Si hay MCPs conectados (Context7, documentación, etc.), usarlos para información actualizada y documentación oficial.

## Calidad mínima obligatoria
- Entregar cambios reproducibles, coherentes y mantenibles.
- No introducir deuda innecesaria: preferir cambios pequeños y seguros.
- Siempre que sea posible: código listo para usar (no pseudocódigo).

## Seguridad y secretos
- Nunca exponer secrets (tokens, passwords, connection strings).
- Configuración sensible debe ir por ENV (no hardcode).
- Si una salida requiere credenciales: pedirlas al usuario o usar placeholders.

## Criterios de decisión
- Si hay conflicto entre estándares: **gana siempre la arquitectura/convenciones del proyecto** (definidas en .agent/skills y rules).
- Las skills vendor aportan buenas prácticas y contexto de librerías; la forma de aplicarlas debe respetar la arquitectura del proyecto (software factory).
- Si falta contexto: asumir la opción más conservadora y documentar con TODO.

## Estilo de entrega
- Si el usuario pide código: incluir el diff o los archivos completos relevantes.
- Mantener consistencia con el estilo existente del repo (naming, estructura, imports).
