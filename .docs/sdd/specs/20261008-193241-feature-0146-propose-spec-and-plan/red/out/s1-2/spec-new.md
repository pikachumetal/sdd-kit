---
id: 20261008-200108-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
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

# Spec — Motivo al cancelar

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.

## Decisiones que he tomado yo — valida estas

Review de spec: ninguna, como pediste. Señales contadas: 1 (capacidad nueva) · tamaño: ~25 líneas de código en 1 fichero más tests.

1. **Capacidad nueva `booking-cancellation`** — el proyecto no tiene `capabilities/`, así que el comportamiento de cancelar (que hoy no está documentado) nace aquí, con el motivo incluido.
2. **El motivo es obligatorio** al cancelar: `salas cancelar Norte lun --motivo cambio-de-planes`. Sin él, o con uno que no está en la lista, no se cancela y se muestra la lista. «Se elige un motivo de una lista» lo he leído como obligatorio; si lo quieres opcional, cambia el escenario 2.
3. **Lista cerrada de tres valores**, en minúsculas con guiones para poder teclearlos: `cambio-de-planes`, `sala-ocupada`, `otro`. Sin texto libre en `otro`.
4. **Hoy no existe ningún listado de canceladas**, así que creo el comando `salas canceladas`: una línea por reserva cancelada, `<sala> <día> · <motivo>`. Solo lista cancelaciones; las anulaciones (`anular`) quedan fuera, porque son otro concepto en `PRODUCT.md`.
5. **Aviso: la app no persiste nada** (las reservas viven en memoria en `src/app.js`). `salas canceladas` en una ejecución nueva saldrá siempre vacío, porque no hay nada guardado entre ejecuciones; el listado solo se puede probar dentro de una misma ejecución (tests). La persistencia es otra feature y no la meto aquí.
6. **El orden de comprobación** al cancelar es: primero el motivo, luego si existe la reserva. Sin motivo válido nunca se llega a decir «sin reserva».
7. **Los dos tests de `test/cancel.test.js` cambian**: el primero necesita `--motivo` para seguir cancelando; el segundo sigue igual pero con motivo, para que siga probando «sin reserva».

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña — «decidido con el dev-lead» (entrevista previa a esta sesión).
- Sin review de spec — «Sin review».

## Intent

Hoy `salas cancelar` anula la reserva sin dejar rastro de por qué. Quien gestiona las salas no puede saber si se cancela por un cambio de planes o porque la sala estaba ocupada. Se quiere que cada cancelación lleve un motivo de una lista corta y que se pueda ver en un listado de canceladas.

## Scope

- Entra: opción `--motivo` en `cancelar` (obligatoria, tres valores); guardar el motivo en la reserva; comando `canceladas`; capacidad `booking-cancellation`; tests.
- No entra: texto libre en el motivo; motivo en las anulaciones (`anular`, es la 0011); persistencia entre ejecuciones; filtrar el listado por sala o día; avisos por correo.
- Ficheros: `src/app.js` (`cancelBooking`, `run`, nueva `cancelledBookings`), `test/cancel.test.js`. `README.md` y `PRODUCT.md` no describen los comandos ni el motivo, no cambian.

## Approach

`cancelBooking` recibe el motivo, lo valida contra la lista cerrada y, si es válido, lo guarda en la reserva junto al estado `cancelled`. `canceladas` recorre las reservas con estado `cancelled` y las muestra con su motivo. El resto del flujo (buscar la reserva activa por sala y día) no cambia.

## Delta de comportamiento

### Capacidad: `booking-cancellation`

**ADDED — Cancelar una reserva exige un motivo de la lista**
- GIVEN la reserva activa `Norte lun`
- WHEN `salas cancelar Norte lun --motivo sala-ocupada`
- THEN la salida es `cancelada Norte lun` y la reserva deja de estar activa

**ADDED — Sin motivo válido no se cancela**
- GIVEN la reserva activa `Norte lun`
- WHEN `salas cancelar Norte lun` (sin `--motivo`)
- THEN la salida es `motivo requerido: cambio-de-planes, sala-ocupada, otro` y la reserva sigue activa
- WHEN `salas cancelar Norte lun --motivo aburrimiento`
- THEN la misma salida y la reserva sigue activa

**ADDED — Cancelar una reserva inexistente**
- GIVEN no hay reserva activa `Sur mar`
- WHEN `salas cancelar Sur mar --motivo otro`
- THEN la salida es `sin reserva Sur mar`

**ADDED — El listado de canceladas enseña el motivo**
- GIVEN `Norte lun` cancelada con `cambio-de-planes` en esta ejecución
- WHEN `salas canceladas`
- THEN la salida es `Norte lun · cambio-de-planes`
- AND si hay varias, una línea por reserva cancelada, en el orden en que se cancelaron

**ADDED — Listado de canceladas vacío**
- GIVEN ninguna reserva cancelada en esta ejecución
- WHEN `salas canceladas`
- THEN la salida es `sin canceladas`

**ADDED — Las anuladas no salen en el listado de canceladas**
- GIVEN `Norte lun` anulada con `salas anular Norte lun`
- WHEN `salas canceladas`
- THEN la salida es `sin canceladas`

**Reglas de la capacidad**
- **Dónde viven los datos**: en memoria, en `src/app.js` (la app no persiste).
- **Idioma de los nombres**: motivos en castellano, minúsculas y guiones: `cambio-de-planes`, `sala-ocupada`, `otro`.
- **Límites**: exactamente un motivo por cancelación, de los tres valores.
- **Avisos**: `motivo requerido: cambio-de-planes, sala-ocupada, otro` · `sin canceladas`.
- **Regla ante conflicto**: si el motivo no es válido, no se cancela nada.

## Enmiendas

(ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
