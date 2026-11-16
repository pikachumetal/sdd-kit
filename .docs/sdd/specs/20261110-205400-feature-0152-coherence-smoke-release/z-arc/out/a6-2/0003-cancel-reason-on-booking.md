---
status: accepted
date: 2026-11-12
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

Cancelar pide un motivo de una lista cerrada y el listado de canceladas lo enseña (feature 0010). Hay que decidir dónde vive ese motivo.

## Opciones consideradas

- En la propia reserva, como el campo `reason` de la reserva cancelada.
- Una tabla de motivos aparte, con la reserva apuntando a ella.

## Decisión

En la propia reserva: el motivo solo tiene sentido con la reserva que se cancela, y `canceladas` lo lee de ahí sin cruzar nada. La tabla aparte se descarta: añade una estructura que hoy nadie consulta por su cuenta.

### Consecuencias

- El listado de canceladas es un filtro sobre las reservas; no hay nada que mantener sincronizado.
- Un informe por motivo (fila 0012) agrupa sobre las reservas, sin tabla propia.
- Cambiar la lista de motivos no migra las reservas ya canceladas.
- Las reservas viven en memoria ([0001](0001-bookings-in-memory.md)): el motivo se pierde con ellas al reiniciar.

### Confirmación

`test/cancel.test.js` cubre la cancelación con motivo y el listado; la revisión final de Código lo confirmó sobre 0c22655.
