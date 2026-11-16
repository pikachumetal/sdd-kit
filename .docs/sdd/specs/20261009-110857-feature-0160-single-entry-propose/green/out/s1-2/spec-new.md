---
id: 20261009-120559-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar una reserva
mode: full
profile: delegate
status: draft
created: 2026-10-09
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar una reserva

🦆 Al cancelar una reserva hay que decir por qué, eligiendo de una lista de tres motivos: cambio de planes, sala ocupada u otro. Por ejemplo, `cancelar Norte lun sala-ocupada` cancela la reserva de Norte del lunes y guarda «sala ocupada». Un comando nuevo, `canceladas`, enseña las reservas canceladas con su motivo: «Norte lun 10:00-12:00 · sala ocupada». Si el motivo falta o no es de la lista, no se cancela nada y el aviso dice cuáles valen.

> **Estado**: draft
> **Siguiente paso**: modo full → `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Nuevas: `bookings` — cancelar una reserva con motivo y ver las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Revisión de la spec: ninguna, por decisión del dev-lead. Hice la pasada de coherencia yo (literales del aviso y del listado repetidos en decisiones y escenarios, comprobados); nadie más relee esta spec.

1. Capacidad nueva `bookings` (inglés, kebab-case): el proyecto no tiene ninguna capacidad escrita y lo de cancelar vive hoy solo en el código y en los tests.
2. El motivo es la tercera palabra de `cancelar`: `cancelar <sala> <día> <motivo>`, con tres valores en la línea de comandos: `cambio-de-planes`, `sala-ocupada`, `otro`. Sin espacios para no obligar a entrecomillar.
3. El listado es un comando nuevo, `canceladas`: hoy no existe ningún listado de canceladas, así que «el listado de canceladas lo enseña» lo creo yo. Sin parámetros.
4. Texto del aviso cuando el motivo falta o no es de la lista: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.
5. El motivo se comprueba antes de buscar la reserva: con motivo no válido sale ese aviso aunque no haya reserva (y no se cancela nada).
6. Texto al cancelar con éxito: `cancelada Norte lun (cambio de planes)`; el motivo se enseña con su nombre legible, con espacios, no con guiones.
7. Formato de cada línea del listado: `<sala> <día> <franja> · <motivo legible>`, una por línea, en el orden en que se cancelaron. Sin canceladas: `sin canceladas`.
8. El listado solo enseña las canceladas, no las anuladas (`anular` es otra cosa en el glosario y queda como está).
9. Las reservas viven en memoria y se pierden al acabar cada comando, como hoy: `canceladas` solo ve lo cancelado en el mismo proceso. Persistirlas no entra aquí (ver Scope); si lo quieres, es otra feature.
10. Sin reserva no hay motivo que guardar: `sin reserva <sala> <día>` se queda igual que hoy.

### Decisiones tomadas con el dev-lead

- Motivo elegido de una lista cerrada: cambio de planes, sala ocupada, otro — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro)».
- El listado de canceladas enseña el motivo — «y el listado de canceladas lo enseña».
- Sin review de la spec — «Sin review».

## Intent

Hoy cancelar una reserva (`cancelar Norte lun`) no deja rastro de por qué. Interesa saberlo para ver qué pasa con las salas (planes que cambian, salas que no estaban libres). Se quiere que cancelar pida un motivo de una lista corta y que se pueda consultar después junto a cada cancelada.

## Scope

- Entra: `cancelar` exige un motivo de la lista y lo guarda; comando `canceladas` que lista las canceladas con su motivo; los tests de cancelar actuales se actualizan al comando nuevo.
- No entra: persistir reservas entre ejecuciones; motivos editables o configurables; motivo «otro» con texto libre; filtrar el listado por sala o día; las anuladas (`anular`, feature 0011); la regla de las 24 h.
- Dónde se implementa lo que cambia (comprobado con búsqueda en el repo): `src/app.js` (`cancelBooking` y `run`) y `test/cancel.test.js` (los dos tests de cancelar). No hay más usos de `cancelar` en README, scripts ni operations.

## Approach

`cancelar` pasa a recibir sala, día y motivo. Se valida el motivo contra la lista de tres; si vale, la reserva se marca cancelada con su motivo. `canceladas` recorre las reservas canceladas y escribe una línea por cada una. Detalle de código en `plan.md`.

## Dónde se prueba

- Cancelar con motivo, aviso por motivo no válido y sin reserva: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Listado `canceladas`: por `run('canceladas', [])` en el mismo fichero, tras cancelar con `run`.

## Términos y ADR

- Términos resueltos: motivo — la razón elegida de la lista al cancelar; cancelada — según `PRODUCT.md`, sin cambios.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Cancelar una reserva con motivo**
- GIVEN reserva activa de Norte el lunes (10:00-12:00)
- WHEN `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun (sala ocupada)`
- AND la reserva queda cancelada con el motivo «sala ocupada»

**ADDED — Motivos de cancelación válidos**
- GIVEN reserva activa de Norte el lunes
- WHEN `cancelar Norte lun cambio-de-planes` / `cancelar Norte lun otro`
- THEN responde `cancelada Norte lun (cambio de planes)` / `cancelada Norte lun (otro)`

**ADDED — Motivo obligatorio y de la lista**
- GIVEN reserva activa de Norte el lunes
- WHEN `cancelar Norte lun` (sin motivo) o `cancelar Norte lun aburrimiento`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa (`libres 10:00-12:00` sigue sin incluir Norte)

**ADDED — Cancelar sin reserva**
- GIVEN no hay reserva activa de Sur el martes
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

**ADDED — Listado de canceladas**
- GIVEN Norte lun (10:00-12:00) cancelada por «sala ocupada»
- WHEN `canceladas`
- THEN responde `Norte lun 10:00-12:00 · sala ocupada`
- AND con varias canceladas, una línea por cada una, en el orden en que se cancelaron

**ADDED — Listado de canceladas vacío**
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

**Reglas de la capacidad**
- **Límites**: tres motivos — `cambio-de-planes` («cambio de planes»), `sala-ocupada` («sala ocupada»), `otro` («otro»).
- **Avisos**: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro` · `sin reserva <sala> <día>` · `sin canceladas`.

### Estimación y esfuerzo

No aplica en modo full: vive en `plan.md` (el proyecto tiene `estimation.md`).

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
