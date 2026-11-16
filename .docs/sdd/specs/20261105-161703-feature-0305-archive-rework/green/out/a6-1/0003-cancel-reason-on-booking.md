---
status: accepted
date: 2026-11-05
rutas:
  - src/**
---

# El motivo de una cancelación se guarda en la propia reserva

## Contexto y problema

Al cancelar una reserva hay que recordar por qué se hizo, para poder listar las canceladas con su motivo. Hay que decidir dónde vive ese dato.

## Opciones consideradas

- El motivo en la propia reserva cancelada (`reason` junto a `status`).
- Una tabla de motivos aparte, enlazada a la reserva.

## Decisión

El motivo se guarda en la propia reserva. Es un solo dato por cancelación, solo se lee desde el listado de canceladas y las reservas ya viven en memoria (ADR 0001): una tabla aparte añadiría una estructura y un enlace que hoy no hacen falta.

### Consecuencias

- `canceladas` lee la reserva y su motivo sin cruzar nada.
- Una reserva cancelada solo puede tener un motivo.
- Como las reservas están en memoria (ADR 0001), el motivo se pierde al reiniciar; cada orden de la CLI es un proceso nuevo, así que `canceladas` desde la línea de comandos no ve cancelaciones de otra orden. Lo recoge la fila 0014 del roadmap.

### Confirmación

`test/cancel.test.js` comprueba que `canceladas` devuelve el motivo guardado al cancelar.
