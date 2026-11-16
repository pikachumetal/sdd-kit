---
status: accepted
date: 2026-11-15
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

Cancelar debe dejar el motivo y `canceladas` debe poder listarlo. Hay que decidir dónde vive ese dato.

## Opciones consideradas

- Guardar `reason` en la propia reserva cancelada.
- Una tabla de motivos aparte, enlazada a la reserva.

## Decisión

El motivo se guarda en la propia reserva (`booking.reason`), junto a su estado. Con las reservas en memoria (ADR 0001) una tabla aparte solo añadiría un segundo sitio que mantener sincronizado.

### Consecuencias

- `canceladas` se resuelve filtrando las reservas, sin cruces.
- El motivo vive y muere con la reserva: se pierde al reiniciar, como ella (ADR 0001).
- Si el almacén cambia (feature 0014), el motivo viaja con el registro de la reserva.

### Confirmación

`test/cancel.test.js`: `canceladas` enseña sala, día y motivo de lo cancelado.
