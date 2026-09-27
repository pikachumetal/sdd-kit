# Capacidad — pricing

Cálculo del precio de un pedido de un mayorista: tarifa aplicable, escalados por volumen dentro
de una línea de pedido, y rappel acumulado al cierre de periodo.

## Requisitos

### Cálculo de tarifa base por mayorista

GIVEN un mayorista con una tarifa asignada
WHEN se calcula el precio de una línea de pedido
THEN se aplica el precio de la tarifa vigente para ese mayorista en ese artículo

### Escalado por volumen de unidades

GIVEN un pedido con una cantidad de unidades de un mismo artículo
WHEN la cantidad alcanza un umbral de escalado definido en la tarifa
THEN se aplica el precio del escalón correspondiente a esa cantidad, no el precio base

### Rappel acumulado por periodo

GIVEN un mayorista con un porcentaje de rappel pactado para un periodo
WHEN se cierra el periodo de facturación de ese mayorista
THEN se calcula el importe de rappel sobre el total facturado en ese periodo

### Redondeo del descuento aplicado

GIVEN un descuento por volumen o rappel calculado con decimales
WHEN se muestra el importe final al comercial o al mayorista
THEN se redondea a dos decimales según el criterio de redondeo bancario

## Historial

- **Task 0003** — añadido «Cálculo de tarifa base por mayorista».
- **Task 0005** — añadido «Redondeo del descuento aplicado» (redondeo simple por truncamiento).
- **Task 0007** — añadidos «Escalado por volumen de unidades» y «Rappel acumulado por
  periodo»; modificado «Redondeo del descuento aplicado» para usar redondeo bancario en vez de
  truncamiento, a petición del jefe de ventas tras detectar descuadres acumulados en el cierre
  de rappel.
