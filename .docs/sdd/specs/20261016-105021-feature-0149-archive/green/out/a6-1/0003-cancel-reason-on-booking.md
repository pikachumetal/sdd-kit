---
status: proposed
date: 2026-10-16
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

Cancelar no dejaba rastro de por qué se liberó una sala. Hay que guardar el motivo y poder listarlo después.

## Opciones consideradas

- Guardar el motivo como un campo más de la reserva cancelada
- Una tabla de motivos aparte

## Decisión

El motivo vive en la propia reserva cancelada (`reason`), junto a su estado. Con las reservas en memoria (ADR 0001) una tabla aparte solo añadiría una unión sin beneficio.

### Consecuencias

- El listado de canceladas lee la reserva y no necesita otra estructura.
- Se pierde al reiniciar, como el resto de las reservas.
- Está en `proposed`: la sección que la origina entró en la spec tras su aprobación y el dev-lead no la ha firmado. La fila 0014 del roadmap (motivo guardado en el almacén) puede solaparse con ella.

### Confirmación

El test `canceladas enseña sala, día y motivo` de `test/cancel.test.js` y la revisión.
