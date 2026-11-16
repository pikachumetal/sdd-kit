---
status: accepted
date: 2026-10-08
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

Cancelar no dejaba rastro: nadie sabía por qué se liberó una sala. Hay que guardar el motivo de cada cancelación (feature 0010) y decidir dónde vive ese dato.

## Opciones consideradas

- Guardar el motivo en la propia reserva cancelada.
- Una tabla de motivos aparte, enlazada a la reserva.

## Decisión

El motivo se guarda en la propia reserva (`status: cancelled` y `reason`). La tabla aparte exige un segundo almacén y un enlace entre ambos que hoy no aportan nada: el listado de canceladas solo necesita la reserva y su motivo. Las reservas siguen en memoria (ADR 0001), así que la 0014 decide cómo se persiste.

### Consecuencias

- `canceladas` lista las reservas con estado cancelada y enseña su motivo, sin cruzar nada.
- El motivo se pierde al reiniciar, igual que la reserva (ADR 0001).
- Si más adelante los motivos necesitan atributos propios (informes, 0012), habrá que separarlos y escribir otra ADR.

### Confirmación

`test/cancel.test.js` (cancelar con motivo y listado de canceladas) y la revisión.
