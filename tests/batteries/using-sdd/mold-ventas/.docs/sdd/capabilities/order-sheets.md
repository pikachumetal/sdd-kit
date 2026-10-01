# Capacidad — order-sheets

## Propósito

Las fichas de pedido y de albarán: qué acciones ofrecen y cómo calculan el total de cada línea.

## Requisitos

### El total de la línea incluye el IVA

- GIVEN una línea de 3 unidades a 9,99 € con IVA del 21 %
- WHEN se abre la ficha
- THEN la columna «Total con IVA» muestra `36,26 €`

### La ficha ofrece guardar, cancelar y borrar

- GIVEN una ficha de pedido o de albarán
- WHEN se abre
- THEN ofrece las acciones Guardar, Cancelar y Borrar
