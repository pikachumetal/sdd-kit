---
status: accepted
date: 2026-10-08
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

Cancelar no dejaba rastro. Hay que guardar el motivo de cada cancelación y poder listarlo.

## Opciones consideradas

- Guardar el motivo en la propia reserva cancelada.
- Una tabla de motivos aparte.

## Decisión

El motivo vive en la reserva (`reason`, junto a `status: cancelled`). Es lo más simple mientras las reservas viven en memoria (ADR 0001) y `canceladas` solo filtra por estado.

### Consecuencias

- `canceladas` no necesita cruzar nada: lista las reservas con estado cancelada.
- Cuando la 0014 mueva las reservas a un almacén, el motivo viaja con ellas.
- Se pierde al reiniciar, como el resto de las reservas.

### Confirmación

`test/cancel.test.js` y la revisión.
