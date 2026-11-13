---
status: accepted
date: 2026-10-08
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

La feature 0010 pide un motivo al cancelar y un listado de canceladas que lo enseñe. Hay que decidir dónde vive el motivo.

## Opciones consideradas

- En la propia reserva, junto a su estado.
- En una tabla de motivos aparte, enlazada por reserva.

## Decisión

En la propia reserva: `cancelBooking` escribe `status: 'cancelled'` y `reason` en el mismo objeto, y `canceladas` filtra por estado. Una tabla aparte añade una estructura y un cruce para un dato que tiene una sola vida con la reserva.

### Consecuencias

- Un solo almacén y un solo recorrido para listar las canceladas.
- El motivo no se puede consultar sin cargar la reserva: un informe por motivo (0012) lo lee de ahí.
- Si algún día los motivos necesitan atributos propios, habrá que extraerlos y migrar los datos.

### Confirmación

`test/cancel.test.js`: «canceladas enseña sala, día y motivo» falla si el motivo no viaja con la reserva.
