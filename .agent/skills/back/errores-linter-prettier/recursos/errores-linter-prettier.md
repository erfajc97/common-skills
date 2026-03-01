# Errores de Linter/Prettier que no repetir (Backend)

Al escribir o revisar código en el backend (NestJS), evitar estos patrones. ESLint y Prettier los marcan y deben corregirse para mantener consistencia en el repo.

## 1. Firma de método con parámetros en una sola línea

**Regla:** Cuando la firma del método supera el límite de línea (p. ej. 80–100 caracteres), Prettier pide partir los parámetros en varias líneas.

**Evitar:**
```typescript
async changePassword(userId: string, currentPassword: string, newPassword: string) {
```

**Correcto:**
```typescript
async changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
```

Cada parámetro en su propia línea; la coma final tras el último parámetro es opcional pero recomendada (trailing comma).

---

## 2. Objetos en decoradores (API/Swagger) en una sola línea

**Regla:** Cuando un objeto pasado a un decorador (`@ApiResponse`, `@ApiBody`, `@ApiQuery`, etc.) supera el límite de línea, Prettier pide partir las propiedades en varias líneas.

**Evitar:**
```typescript
@ApiResponse({ status: 404, description: 'No hay membresía activa para cancelar' })
```

**Correcto:**
```typescript
@ApiResponse({
  status: 404,
  description: 'No hay membresía activa para cancelar',
})
```

Cada propiedad en su línea; incluir coma final (trailing comma) después de la última propiedad.

---

## 3. Objetos de opciones largos en general

**Regla:** Cualquier objeto (opciones de `refine`, `classNames`, configuración) que genere una línea demasiado larga debe formatearse en varias líneas.

**Evitar:**
```typescript
.refine(..., { message: 'preSaleEndAt must be after preSaleAt and before or equal to saleAt' })
```

**Correcto:**
```typescript
.refine(..., {
  message:
    'preSaleEndAt must be after preSaleAt and before or equal to saleAt',
})
```

---

## Resumen

| Anti‑patrón | Acción |
|-------------|--------|
| Parámetros en una línea (firma larga) | Partir en varias líneas, un parámetro por línea. |
| Objeto en decorador en una línea | Partir propiedades en varias líneas. |
| Objeto de opciones largo en una línea | Partir propiedades en varias líneas. |

Al tocar servicios, controladores o DTOs, cumplir Prettier/ESLint; si el linter sugiere "Replace ... with" (Insert `⏎`), aplicar el formateo multínea indicado.
