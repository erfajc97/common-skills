# Estándar de Componentes UI (HeroUI / NextUI)

Se prioriza SIEMPRE el uso de **HeroUI** (anteriormente NextUI). No usar componentes nativos HTML para elementos complejos.

## Reglas de uso
- **Botones, tablas, menú, modales**: Usar siempre HeroUI (`Button`, `Table`, `Modal`, etc.). Para tablas, paginación y modales usar los **CustomComponents** de `src/app/components/UI/` (CustomTableNextUi, CustomPagination, CustomModalNextUI) para estilos y comportamiento consistente.
- **No repetir código**: Reutilizar componentes y hooks. Los formularios de **crear** y **editar** pueden ser el mismo; el hook (o contenedor) identifica por `id` o entidad si es create o update y rellena los campos en modo edición. Ver `feature-implementation.md` (Formularios create/edit).
- **Iconos SVG**: No pegar SVG inline en componentes; ponerlos en `src/assets/svg/` como componentes (ej. `GoogleIcon.tsx`) e importarlos donde se necesiten. Ver `iconos-y-assets.md`.

## Ubicación Global
Los wrappers personalizados deben residir en: `src/app/components/UI/`

## 1. Custom Table (`src/app/components/UI/table-nextui/CustomTableNextUi.tsx`)
Wrapper sobre `Table` de HeroUI para estandarizar estilos y paginación.

```typescript
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from '@heroui/react'
// ... imports completos

export const CustomTableNextUi = ({ items, columns, renderCell, ...props }) => {
  return (
    <div className="p-4 md:p-6 bg-content flex flex-col gap-4 md:gap-5 h-full rounded-xl sm:rounded-2xl">
      <Table 
        // props estandarizadas (isStriped, color="primary", etc)
        classNames={{
            wrapper: "p-0 rounded-none h-full shadow-none table-report dark:bg-[#28292b]",
            th: "bg-primary text-white h-9",
            tr: "!rounded-full"
        }}
      >
        <TableHeader columns={columns}>{(col) => <TableColumn>{col.name}</TableColumn>}</TableHeader>
        <TableBody items={items}>{(item) => <TableRow><TableCell>{renderCell(item)}</TableCell></TableRow>}</TableBody>
      </Table>
    </div>
  )
}
```

## 2. Custom Pagination (`src/app/components/UI/table-nextui/CustomPagination.tsx`)
Usa `useDeviceType` para responsividad.

```typescript
import { Pagination } from '@heroui/pagination'

const CustomPagination = ({ page, pages, setPage }) => (
    <div className="flex justify-center items-center mt-auto pt-1">
      <Pagination showControls showShadow color="primary" radius="full" page={page} total={pages} onChange={setPage} />
    </div>
)
```

## 3. Custom Modal (`src/app/components/UI/customModalNextUI/CustomModalNextUI.tsx`)
Wrapper para modales con backdrop blur y estilos oscuros consistentes.

```typescript
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'

const CustomModalNextUI = ({ isOpen, onClose, children, headerContent, footerContent }) => (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} 
        classNames={{ base: "dark:bg-[#28292b]" }}
    >
        <ModalContent>
            <ModalHeader>{headerContent}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>{footerContent}</ModalFooter>
        </ModalContent>
    </Modal>
)
```

## Reglas de Uso
1. **Tablas**: Definir `columns` y función `renderCell` switch-case en el componente consumidor. Usar `CustomTableNextUi` de `src/app/components/UI`.
2. **Botones**: Usar `Button` de `@heroui/react`. Prop `onPress` en lugar de `onClick`.
3. **Paginación**: Siempre via `CustomPagination` al pie de la tabla.
4. **Modales**: Usar `CustomModalNextUI` para formularios y confirmaciones.
5. **Reutilización**: Mismo formulario para crear y editar; el hook decide create vs update según id/entidad.
6. **SVG**: Iconos en `src/assets/svg/` como componentes; importar, no inline.
