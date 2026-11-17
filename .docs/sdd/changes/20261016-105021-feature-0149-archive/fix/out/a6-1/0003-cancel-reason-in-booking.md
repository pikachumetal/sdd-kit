---
status: accepted
date: 2026-10-08
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

Cancelar no dejaba rastro. Hay que guardar el motivo de cada cancelación y listarlo después.

## Opciones consideradas

- Un campo `reason` en la propia reserva cancelada.
- Una tabla de motivos aparte, enlazada a la reserva.

## Decisión

Un campo `reason` en la reserva, junto a su `status`. La lista de motivos válidos (cambio de planes, sala ocupada, otro) es cerrada y vive en el código; no es una tabla de datos. La tabla aparte se descartó: añade una estructura y un enlace para un dato que solo existe mientras la reserva existe.

### Consecuencias

- `canceladas` lee el motivo directamente de la reserva.
- El motivo se pierde con la reserva y, hoy, con el reinicio (ver 0001).

### Confirmación

La revisión y el test de `canceladas` en `test/cancel.test.js`.
