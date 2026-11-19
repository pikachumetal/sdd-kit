---
id: 20261008-120000-feature-0013-cancel-many-days
feature: 0013
title: Cancelar varios días de una vez
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Cancelar varios días de una vez

## Capacidades

- Modificadas: `bookings` — `cancelar` acepta varios días.

## Decisiones que he tomado yo — valida estas

1. Los días van separados por espacios, sin límite.

## Intent

Hoy, para cancelar una semana hay que lanzar `cancelar` cinco veces. Quien cancela quiere hacerlo de una vez y saber si la operación entera salió.

## Scope

- Entra: `cancelar <sala> <día> <día>…` en `src/app.js` (`run` pasa hoy solo `params[0]` y `params[1]`; `cancelBooking` atiende un día) y su test en `test/cancel.test.js`.
- No entra: reservar varios días.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada | | |

- Filas que implementa: 0013 → su fila en `ROADMAP.md:9` (único hit de `git grep -n 0013` fuera de las specs); `sdd-archive` la mueve a Hecho al cerrar.

## Approach

`cancelar` comprueba todos los días antes de tocar ninguna reserva.

## Dónde se prueba

- cancelar varios días: por el comando, como `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Cancelar varios días de una vez

- GIVEN reservas activas de Norte el lunes y el miércoles
- WHEN la persona ejecuta `cancelar Norte lun mie`
- THEN las dos quedan canceladas y responde `canceladas Norte lun mie`
- AND con `cancelar Norte lun mar`, sin reserva el martes, no cancela ninguna y responde `sin reserva Norte mar`

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
