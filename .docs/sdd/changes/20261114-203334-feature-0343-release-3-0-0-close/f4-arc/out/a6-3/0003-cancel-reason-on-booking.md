---
status: accepted
date: 2026-10-08
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

Cancelar debe dejar el motivo (lista cerrada: cambio de planes, sala ocupada, otro) y `canceladas` debe enseñarlo. Había que decidir dónde vive ese dato.

## Opciones consideradas

- Un campo `reason` en la propia reserva cancelada
- Una tabla de motivos aparte, enlazada a la reserva

## Decisión

Campo `reason` en la propia reserva, junto a `status: 'cancelled'`: el motivo no existe sin la cancelación y `canceladas` lo lee sin cruzar nada.

### Consecuencias

- El listado es un filtro por estado sobre las reservas.
- Con las reservas en memoria (ADR 0001), el motivo se pierde al reiniciar; la 0014 lo lleva al almacén.
- Un análisis de motivos por separado tendría que recorrer las reservas.

### Confirmación

`test/cancel.test.js` (motivo y listado) y la revisión.
