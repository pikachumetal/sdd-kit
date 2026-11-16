---
status: accepted
date: 2026-11-12
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

Cancelar debe dejar rastro del porqué (feature 0010). Hay que decidir dónde vive ese motivo.

## Opciones consideradas

- En la propia reserva cancelada (`reason` junto a `status`).
- Una tabla de motivos aparte, enlazada a la reserva.

## Decisión

En la propia reserva: el motivo es un dato de la cancelación y solo se lee junto a ella (`canceladas`). Una tabla aparte añade una relación que nada necesita hoy.

### Consecuencias

- `canceladas` lista las reservas con estado cancelada y lee el motivo de la misma fila.
- Cambiar la lista cerrada de motivos no migra nada: el valor es un texto de la reserva.
- Si algún día los motivos necesitan atributos propios (códigos, textos por idioma), habrá que extraerlos y migrar las reservas ya canceladas.

### Confirmación

La revisión, y el test `canceladas enseña sala, día y motivo` de `test/cancel.test.js`.
