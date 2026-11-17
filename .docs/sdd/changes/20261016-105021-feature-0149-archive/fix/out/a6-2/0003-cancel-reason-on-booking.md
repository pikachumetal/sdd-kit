---
status: accepted
date: 2026-10-08
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

Cancelar no dejaba rastro (feature 0010): hay que guardar el motivo de cada cancelación y poder listarlo. Había que decidir dónde vive ese dato.

## Opciones consideradas

- En la propia reserva cancelada (`reason`, junto a `status`).
- En una tabla de motivos aparte, con una referencia desde la reserva.

## Decisión

En la propia reserva. El motivo solo tiene sentido con la reserva que lo origina, el listado de canceladas lo lee de ahí y la tabla aparte añadiría una estructura y una relación sin que nada las pida todavía.

### Consecuencias

- `canceladas` se resuelve filtrando las reservas con estado cancelada, sin cruzar tablas.
- Como las reservas viven en memoria ([0001](0001-bookings-in-memory.md)), el motivo se pierde al reiniciar igual que ellas.
- Si más adelante hay que consultar o contar motivos por separado (informe de canceladas, 0012), el dato estará repartido por las reservas.

### Confirmación

`test/cancel.test.js`: `canceladas enseña sala, día y motivo`, y la revisión.
