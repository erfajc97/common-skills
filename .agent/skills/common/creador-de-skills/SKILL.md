---
name: creador-de-skills
description: Genera nuevos Skills para Antigravity con estructura estandarizada, archivos y reglas de mantenimiento.
---

# Skill: Creador de Skills

## Cuándo usar este Skill
- Cuando el usuario pida "crear un skill para X".
- Cuando el usuario quiera estandarizar un proceso repetitivo.
- Cuando se necesite convertir un prompt complejo en una herramienta reutilizable.
- Cuando haya que definir una nueva capacidad con estructura de archivos estricta.

## Fuente de Verdad
- **Guía Maestra**: `recursos/guia-maestra.md` (Consulta este archivo para detalles profundos sobre filosofía y reglas).

## Inputs Necesarios
1. **Nombre del Skill**: (Sugerido o dado por el usuario).
2. **Objetivo**: Qué debe lograr el skill.
3. **Contexto/Fuente**: Documentos, prompts anteriores o explicación del usuario.
4. **Nivel de Libertad**: (Alto/Medio/Bajo) según el riesgo de la tarea.

## Workflow de Creación
1. **Analizar Requisitos**: Entender qué hace el skill y qué inputs necesita. Lee `recursos/guia-maestra.md` si tienes dudas sobre el estándar.
2. **Definir Estructura**:
   - Carpeta: `agent/skills/<nombre-kebab-case>/`
   - Archivo Principal: `SKILL.md`
   - Recursos: `recursos/` (si hay tablas, guías de estilo, JSONs).
   - Scripts: `scripts/` (solo si hay código ejecutable).
3. **Redactar SKILL.md**:
   - YAML Frontmatter (name, description).
   - Secciones: Introducción, Triggers, Inputs, Workflow, Checklist, Output.
   - **IMPORTANTE**: No inventes contenido. Si falta info, pon un placeholder o pregunta.
4. **Crear Recursos**: Mover información estática a archivos separados en `recursos/`.
5. **Validación**: Verificar contra el checklist de calidad.

## Reglas de Diseño (Checklist de Calidad)
- [ ] **Nombre**: Kebab-case, corto (ej: `planificar-video`).
- [ ] **Descripción**: < 220 chars, 3ra persona.
- [ ] **Estructura**: Mínimo `SKILL.md`. No crear archivos vacíos o innecesarios.
- [ ] **Claridad**: Pasos numerados, triggers claros.
- [ ] **Output**: Formato de salida explícito (Markdown, JSON, Tabla).
- [ ] **Separación**: Estilos y datos grandes van a `recursos/`, no en `SKILL.md`.

## Formato de Salida (Entregable)
Tu respuesta debe generar los archivos usando `write_to_file` y confirmar la creación con el siguiente resumen:

**Carpeta creada**: `agent/skills/<nombre-del-skill>/`
**Archivos**:
- `SKILL.md`: (Lógica principal)
- `recursos/...`: (Si aplica)

## Ejemplo de SKILL.md
```markdown
---
name: nombre-del-skill
description: Breve descripción en tercera persona.
---
# Skill: Nombre Legible
## Cuándo usar
- Caso 1
## Workflow
1. Paso 1
```
