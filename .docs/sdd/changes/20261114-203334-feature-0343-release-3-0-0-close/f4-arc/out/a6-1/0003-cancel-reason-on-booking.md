---
status: accepted
date: 2026-11-16
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

Cancelar no dejaba rastro. La feature 0010 pide un motivo por cancelación y hay que decidir dónde vive ese dato.

## Opciones consideradas

- Guardarlo en la propia reserva cancelada (`reason` junto a `status`)
- Una tabla de motivos aparte, enlazada a la reserva

## Decisión

El motivo se guarda en la propia reserva cancelada. Es un dato de una sola cancelación, sin ciclo de vida propio, y `canceladas` lo lee de la misma lista que ya recorre. La tabla aparte añadía un segundo almacén sin que nada la necesitara.

### Consecuencias

- `canceladas` no hace joins: filtra las reservas con estado cancelada.
- Un informe por motivo (0012) agrupa sobre las reservas.
- Hoy las reservas viven en memoria (ADR 0001): el motivo se pierde al reiniciar hasta que la 0014 lo guarde en el almacén.

### Confirmación

`test/cancel.test.js`: `canceladas enseña sala, día y motivo`.
