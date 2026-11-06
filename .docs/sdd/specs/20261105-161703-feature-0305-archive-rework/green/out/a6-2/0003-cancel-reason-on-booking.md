---
status: accepted
date: 2026-11-05
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

Al cancelar una reserva hay que conservar el motivo para que `canceladas` lo enseñe. Había que decidir dónde vive ese dato.

## Opciones consideradas

- Guardarlo en la propia reserva cancelada (`booking.reason`).
- Una tabla de motivos aparte, enlazada a la reserva.

## Decisión

En la propia reserva: la lista de motivos es cerrada y pequeña (cambio de planes, sala ocupada, otro), y el listado de canceladas solo necesita la reserva y su motivo. Una tabla aparte añade una relación que no aporta nada con tres valores fijos.

### Consecuencias

- `canceladas` lee un solo sitio, sin cruce.
- Cambiar la lista de motivos es cambiar una constante de `src/app.js`; si algún día los motivos llevan datos propios, hará falta otra ADR.
- Como las reservas viven en memoria (ADR 0001), el motivo se pierde al reiniciar con ellas.

### Confirmación

`test/cancel.test.js`: «cancelar con un motivo de la lista» y «canceladas enseña sala, día y motivo».
