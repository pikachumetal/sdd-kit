---
id: 20261008-195618-feature-0010-cancel-reason
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

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas (el proyecto aún no tiene capacidades; hoy la cancelación solo vive en el código).

## Decisiones que he tomado yo — valida estas

Review de la spec: ninguna, por decisión del dev-lead (ver abajo). Hecho solo el repaso de coherencia.

1. **El motivo es obligatorio.** `cancelar <sala> <día> <motivo>`; sin motivo o con uno fuera de la lista, no se cancela y se dicen los motivos válidos. Cambia el comportamiento actual de `cancelar <sala> <día>`, y por tanto el test existente de `test/cancel.test.js`, que se actualiza. Alternativa descartada: motivo opcional (con «otro» por defecto), que vaciaría de sentido elegir de una lista.
2. **Lista cerrada de tres motivos**, con estos identificadores en la línea de comandos: `cambio-de-planes`, `sala-ocupada`, `otro`. En pantalla se escriben en llano: «cambio de planes», «sala ocupada», «otro». «Otro» no admite texto libre.
3. **El «listado de canceladas» no existe hoy** (`src/app.js` no tiene ningún listado): lo creo como comando nuevo `canceladas`, una línea por reserva: `<sala> <día> <franja> · <motivo>`. Es lo que obliga a abrir la capacidad nueva `booking-cancellation`.
4. **El listado solo enseña las canceladas**, no las anuladas (`anular`, estado `voided`): la feature 0011 trata las anulaciones y no quiero adelantarla.
5. **Las reservas ya canceladas antes de esta feature**: el almacén es en memoria (`bookings` en `src/app.js`), así que no hay datos previos que migrar ni motivo que inventar.
6. **Modo `full`**, con plan: la feature toca el comando, el almacén y un comando nuevo, y no he confirmado el modo lite contigo.
7. **Capacidad nueva**: `booking-cancellation`, para aprobar el nombre (inglés kebab-case).

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña — decidido en la entrevista previa a esta spec, antes de escribirla.
- Sin review de la spec — «Sin review».

## Intent

Hoy `cancelar` borra la reserva sin dejar rastro de por qué, y no hay forma de ver qué se ha cancelado. Se quiere saber el motivo de cada cancelación y poder consultarlo en un listado.

## Scope

- Entra: elegir un motivo de la lista al cancelar; guardarlo con la reserva; comando `canceladas` que lista las canceladas con su motivo; actualizar el test de cancelar.
- No entra: texto libre en «otro»; editar el motivo después; anular reservas de otros (0011); mostrar anuladas; filtros u ordenación del listado; persistencia en disco.
- Ficheros que implementan lo que cambia: `src/app.js` (`cancelBooking` y `run`, único sitio donde vive el comando y el almacén); `test/cancel.test.js` (el test que cancela sin motivo). No hay más apariciones en el repo.

## Approach

El comando `cancelar` pasa a recibir un tercer parámetro, el motivo, validado contra la lista cerrada; la reserva cancelada lo guarda. Un comando `canceladas` recorre las reservas en estado cancelado y las escribe con su motivo. El cómo va en `plan.md`.

## Delta de comportamiento

### Capacidad: `booking-cancellation`

**ADDED — Cancelar con motivo**
- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun · sala ocupada` y la reserva deja de estar activa (la sala Norte vuelve a salir libre en 10:00-12:00)

**ADDED — Motivo obligatorio y de la lista**
- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun` (sin motivo)
- THEN responde `falta el motivo: cambio-de-planes, sala-ocupada, otro` y la reserva sigue activa
- AND con `cancelar Norte lun aburrimiento` responde `motivo no válido: aburrimiento (cambio-de-planes, sala-ocupada, otro)` y la reserva sigue activa

**ADDED — Cancelar sin reserva**
- GIVEN no hay reserva activa Sur mar
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

**ADDED — Listado de canceladas**
- GIVEN Norte lun 10:00-12:00 cancelada por `cambio-de-planes` y Sur mar 14:00-16:00 cancelada por `otro`
- WHEN `canceladas`
- THEN responde dos líneas: `Norte lun 10:00-12:00 · cambio de planes` y `Sur mar 14:00-16:00 · otro`
- AND una reserva anulada con `anular` no aparece

**ADDED — Listado de canceladas vacío**
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

**Reglas de la capacidad**
- **Límites**: motivos válidos, y solo estos: `cambio-de-planes` («cambio de planes»), `sala-ocupada` («sala ocupada»), `otro` («otro»).
- **Avisos**: `falta el motivo: cambio-de-planes, sala-ocupada, otro` · `motivo no válido: <motivo> (cambio-de-planes, sala-ocupada, otro)` · `sin reserva <sala> <día>` · `sin canceladas`.

## Enmiendas

Ninguna.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
