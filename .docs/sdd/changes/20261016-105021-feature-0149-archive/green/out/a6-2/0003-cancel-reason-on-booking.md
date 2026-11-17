---
status: accepted
date: 2026-10-08
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

Cancelar no dejaba rastro: nadie sabía por qué se liberaba una sala. La feature 0010 pide un motivo de una lista cerrada y un listado de canceladas que lo enseñe, y hay que decidir dónde vive ese motivo.

## Opciones consideradas

- Guardarlo en la propia reserva cancelada (`reason`, junto a `status`).
- Una tabla de motivos aparte, enlazada a la reserva.

## Decisión

El motivo se guarda en la propia reserva, junto a su estado. `canceladas` lista las reservas con estado cancelada y lee el motivo de ahí. Una tabla aparte no aporta nada mientras la lista de motivos sea cerrada y las reservas vivan en memoria ([0001](0001-bookings-in-memory.md)).

### Consecuencias

- Una sola estructura que leer; el listado no necesita cruzar nada.
- Si más adelante el motivo gana atributos propios (texto libre, quién lo puso), habrá que reabrir la decisión con otra ADR.
- La fila 0014 del roadmap («Motivo guardado») pide persistirlo en el almacén de reservas: parte de esta decisión y habrá que reconciliarla al planificarla.

### Confirmación

`test/cancel.test.js`: `canceladas` enseña el motivo que se guardó al cancelar; la revisión comprueba que no aparece una estructura de motivos aparte.
