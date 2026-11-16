---
id: 20261008-203643-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: draft
created: 2026-10-08
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar una reserva

🦆 Al cancelar una reserva hay que decir por qué, eligiendo de una lista: cambio de planes, sala ocupada u otro. Ejemplo: `cancelar Norte lun --motivo sala-ocupada` cancela la reserva de Norte del lunes y guarda «sala ocupada». Un nuevo comando `canceladas` enseña cada reserva cancelada con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Por dentro, la reserva cancelada guarda el motivo y el listado recorre las reservas con estado cancelado.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva propia con motivo y listar las canceladas.
- Modificadas: ninguna (aún no hay capacidades en `capabilities/`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — decidido con el dev-lead («Sin review»).

1. **Capacidad nueva `booking-cancellation`** — hoy `capabilities/` está vacío; el comportamiento de cancelar y listar canceladas necesita su capacidad.
2. **El motivo es obligatorio** al cancelar — «se elige un motivo de una lista» lo pide; sin motivo no se cancela y la reserva sigue activa.
3. **Lista de motivos y sus claves en el comando**: `cambio-de-planes`, `sala-ocupada`, `otro` (en pantalla: «cambio de planes», «sala ocupada», «otro»). Claves sin espacios para que valgan como argumento de terminal.
4. **Sintaxis**: `cancelar <sala> <día> --motivo <clave>`.
5. **Texto de motivo ausente o no válido**: `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`.
6. **Orden de comprobación**: primero que exista la reserva (`sin reserva <sala> <día>`, como hoy) y después el motivo; así el aviso de «sin reserva» no cambia.
7. **Comando de listado**: `canceladas`; una línea por reserva, `<sala> <día> <franja> · <motivo en pantalla>`; sin ninguna, `sin canceladas`.
8. **Las anuladas no salen en `canceladas`** — son otro estado (anulación del responsable, tarea 0011); `PRODUCT.md` las distingue y no llevan motivo aquí.
9. **El test existente `cancelar una reserva activa`** (`test/cancel.test.js`) se actualiza para pasar motivo: el comportamiento «cancelar sin motivo» deja de existir. `cancelar sin reserva` no cambia.
10. **Persistencia**: las reservas viven en memoria (`src/app.js`), así que `canceladas` en otra ejecución de la terminal verá la lista vacía; no se añade almacenamiento, queda fuera de esta tarea.

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista: cambio de planes, sala ocupada, otro — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro)»
- El listado de canceladas enseña el motivo — «y el listado de canceladas lo enseña»
- Sin review de spec — «Sin review»

## Intent

Hoy `cancelar` marca la reserva como cancelada y no deja rastro de por qué, ni hay forma de ver las canceladas. Se quiere saber por qué se cancela y poder verlo en un listado.

## Scope

- Entra: motivo obligatorio en `cancelar`, comando `canceladas`, actualizar `test/cancel.test.js` y tests nuevos de los escenarios; fichero implicado: `src/app.js` (`cancelBooking` y `run`).
- No entra: anulaciones (`voidBooking`), motivos libres o configurables, persistencia entre ejecuciones, filtros del listado, avisos por correo.

## Approach

La reserva cancelada guarda su motivo junto al estado. `cancelar` valida el motivo contra la lista fija y `canceladas` recorre las reservas con estado cancelado. El cómo va en `plan.md`.

## Dónde se prueba

- Cancelar con motivo, motivo no válido y sin motivo: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Listado de canceladas: por `run('canceladas', [])`, mismo patrón y fichero.

## Términos y ADR

- Términos resueltos: **motivo** — la razón elegida de la lista al cancelar una reserva.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

**ADDED — Cancelar con motivo**
- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `cancelada Norte lun` y la reserva queda cancelada con el motivo «sala ocupada»

**ADDED — Motivo obligatorio y de la lista**
- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun` (sin motivo) o `cancelar Norte lun --motivo aburrimiento`
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa

**ADDED — Cancelar sin reserva**
- GIVEN no hay reserva activa en Sur mar
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`

**ADDED — Listar canceladas**
- GIVEN Norte lun 10:00-12:00 cancelada con `cambio-de-planes`
- WHEN `canceladas`
- THEN responde `Norte lun 10:00-12:00 · cambio de planes`

**ADDED — Listado sin canceladas ni anuladas**
- GIVEN ninguna reserva cancelada y Norte lun anulada por el responsable
- WHEN `canceladas`
- THEN responde `sin canceladas`

**Reglas de la capacidad**
- **Límites**: motivos válidos `cambio-de-planes`, `sala-ocupada`, `otro`.
- **Avisos**: `motivo no válido: elige cambio-de-planes, sala-ocupada u otro` · `sin reserva <sala> <día>` · `sin canceladas`.
- **Idioma de los nombres**: texto de la interfaz en castellano (constitution, Art. 4).
- **Dónde viven los datos**: en memoria, junto a la reserva.
- **Regla ante conflicto**: no aplica.

## Enmiendas

(ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
