---
status: accepted
date: 2026-10-08
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

Cancelar pide ahora un motivo de una lista cerrada y `canceladas` lo enseña. Hay que decidir dónde vive ese motivo.

## Opciones consideradas

- En la propia reserva cancelada (`reason` junto a `status`)
- Una tabla de motivos aparte, enlazada a la reserva

## Decisión

En la propia reserva: la lista es corta y cerrada, el motivo solo se lee junto a la reserva y las reservas ya viven en memoria (0001). Una tabla aparte añadiría una estructura y un enlace sin nada que ganar hoy.

### Consecuencias

- `canceladas` filtra las reservas por estado y lee el motivo de cada una: no hay joins ni segunda estructura.
- El motivo se pierde con la reserva al reiniciar el proceso, como todo lo demás (0001); la 0014 lo lleva al almacén.
- Si algún día los motivos necesitan atributos propios (informes por motivo, motivos por sala), habrá que sacarlos a su propia estructura.

### Confirmación

`test/cancel.test.js`: `cancelar … --motivo` y `canceladas` leen el motivo de la reserva.
