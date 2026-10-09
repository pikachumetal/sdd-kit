---
id: 20261008-203328-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar una reserva
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` cancela y no guarda por qué. Con esto, al cancelar eliges un motivo de tres (cambio de planes, sala ocupada, otro): `cancelar Norte lun sala-ocupada`. Un comando nuevo, `canceladas`, lista las reservas canceladas con su motivo: `Norte lun · sala ocupada`. Si no pones motivo, o pones uno que no está en la lista, no se cancela nada y te dice cuáles hay.

> **Estado**: draft. **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.
- Modificadas: ninguna (el proyecto no tiene capacidades; el comportamiento de `cancelar` vigente, que no está documentado, se recoge en la nueva).

## ✋ Decisiones que he tomado yo — valida estas

Review de la spec: ninguna, por decisión del dev-lead («Sin review»); el repaso de coherencia lo he hecho yo.

1. Capacidad nueva `booking-cancellation` — no hay `capabilities/`; el comportamiento de cancelar no tiene dónde vivir.
2. El motivo es **obligatorio** y va como tercer parámetro: `cancelar <sala> <día> <motivo>`. Esto cambia `cancelar Norte lun` a secas (hoy cancela); sus tests actuales se actualizan.
3. Identificadores del motivo en la línea de comandos: `cambio-de-planes`, `sala-ocupada`, `otro`. En el listado se muestran con espacios: «cambio de planes», «sala ocupada», «otro».
4. Motivo ausente o fuera de la lista → no se cancela y responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`.
5. Comando nuevo `canceladas`, sin parámetros. Una línea por reserva: `<sala> <día> · <motivo>`; sin ninguna responde `sin reservas canceladas`.
6. El listado solo enseña las canceladas, no las anuladas (`anular`, 0011), que tienen su propio estado.
7. Orden del listado: el de cancelación (la más antigua primero).
8. Orden de comprobación: primero el motivo (decisión 4) y después la reserva; con motivo válido y sin reserva, `cancelar` sigue diciendo `sin reserva <sala> <día>`.
9. Las reservas ya canceladas antes de esta feature no tienen motivo; al vivir los datos en memoria (`bookings` en `src/app.js`) no hay datos previos que migrar.

## Intent

Hoy se cancela una reserva sin dejar rastro de por qué. Se quiere elegir un motivo de una lista cerrada al cancelar y poder ver, en el listado de canceladas, qué motivo tuvo cada una.

## Scope

- Entra: motivo obligatorio en `cancelar`; comando `canceladas`; actualizar los tests de `cancelar` existentes.
- No entra: motivos libres o configurables; motivo al anular (0011); filtros del listado; persistencia.
- Ficheros: `src/app.js` (cancelar y listado, único sitio que lo implementa), `test/cancel.test.js` (tests existentes de `cancelar`) y un test nuevo para `canceladas`.

## Approach

`cancelBooking` recibe el motivo, lo valida contra la lista cerrada y lo guarda en la reserva al marcarla `cancelled`. `run` añade el comando `canceladas`, que recorre las reservas con estado `cancelled`.

## Dónde se prueba

- Cancelar con motivo, motivo inválido y listado: por `run(...)`, como `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: cancelada — reserva cancelada por quien la tenía (`cancelled`); anulada (`voided`) es otra cosa y no entra en el listado.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

**ADDED — Cancelar con motivo**
- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun` y la reserva queda cancelada con el motivo «sala ocupada»

**ADDED — Motivo obligatorio y de la lista**
- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun` o `cancelar Norte lun porque-si`
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa

**ADDED — Cancelar sin reserva**
- GIVEN no hay reserva activa Sur mar
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

**ADDED — Listado de canceladas**
- GIVEN canceladas Norte lun (sala ocupada) y luego Sur mar (cambio de planes), y Norte mié anulada
- WHEN `canceladas`
- THEN responde dos líneas, `Norte lun · sala ocupada` y `Sur mar · cambio de planes`, en ese orden, sin Norte mié

**ADDED — Listado vacío**
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin reservas canceladas`

**Reglas de la capacidad**
- **Límites**: motivos válidos `cambio-de-planes` («cambio de planes»), `sala-ocupada` («sala ocupada»), `otro` («otro»).
- **Avisos**: `motivo no válido: elige cambio-de-planes, sala-ocupada u otro` · `sin reservas canceladas` · `sin reserva <sala> <día>`.

## Enmiendas

- ninguna

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
