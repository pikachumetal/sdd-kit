---
status: accepted
date: 2026-11-11
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

La feature 0010 pide un motivo al cancelar y un listado de canceladas que lo enseñe. Hay que decidir dónde vive ese motivo.

## Opciones consideradas

- Guardarlo en la propia reserva cancelada (`booking.reason`).
- Una tabla de motivos aparte, con una referencia desde la reserva.

## Decisión

Se guarda en la propia reserva: el listado de canceladas lee un solo sitio y el motivo no sobrevive a la reserva que lo explica. La tabla aparte se descarta: añade un segundo almacén en memoria (ver 0001) sin ninguna consulta que la necesite.

### Consecuencias

- `canceladas` filtra las reservas con estado cancelada y lee su motivo.
- La lista de motivos (cambio de planes, sala ocupada, otro) es cerrada y se valida al cancelar, no al guardar.
- Un motivo no se puede cambiar sin volver a cancelar.

### Confirmación

`test/cancel.test.js` y la revisión: el motivo aparece en la salida de `canceladas` sin consultar otra estructura.
