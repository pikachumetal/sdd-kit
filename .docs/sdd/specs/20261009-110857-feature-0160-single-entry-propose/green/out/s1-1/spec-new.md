---
id: 20261009-115947-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: draft
created: 2026-10-09
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` cancela y no queda por qué. Con esta feature, al cancelar eliges un motivo de una lista fija —cambio de planes, sala ocupada u otro—: `cancelar Norte lun --motivo sala-ocupada` responde «cancelada Norte lun (motivo: sala ocupada)». Y un comando nuevo, `canceladas`, lista las reservas canceladas con su motivo: «Norte lun 10:00-12:00 — sala ocupada». Si no das motivo, o das uno que no está en la lista, no se cancela nada y se te dice cuáles hay.

> **Estado**: draft
> **Siguiente paso**: modo full → `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Nuevas: `bookings` — reservas de salas: cancelar con motivo y listado de canceladas (hoy no hay capacidades escritas).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: ninguna, a petición del dev-lead («Sin review»).

1. **Sintaxis**: el motivo se da con `--motivo <código>` tras sala y día (`cancelar Norte lun --motivo otro`). Nadie fijó cómo se elige en una herramienta de terminal.
2. **Códigos de la lista**: `cambio-de-planes`, `sala-ocupada`, `otro`. Se enseñan con espacios en lugar de guiones («cambio de planes», «sala ocupada», «otro»).
3. **El motivo es obligatorio**: «se elige un motivo» lo leo como que no se puede cancelar sin él. Es un cambio del `cancelar` actual, que hoy funciona sin motivo.
4. **Textos**:
   - Éxito: `cancelada Norte lun (motivo: cambio de planes)`.
   - Falta el motivo: `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`.
   - Motivo fuera de la lista: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.
5. **Orden de comprobación**: primero si existe la reserva, después el motivo. Así `cancelar Sur mar` sin reserva sigue diciendo `sin reserva Sur mar`.
6. **Comando del listado**: se llama `canceladas`.
7. **Formato del listado**: una línea por reserva, `<sala> <día> <franja> — <motivo>`, en el orden en que se cancelaron; sin ninguna, `sin canceladas`.
8. **El listado no incluye las anuladas** (`anular`): según `PRODUCT.md` una anulación la hace el responsable y es otra cosa. `anular` no pide motivo; eso, si se quiere, es de la 0011.
9. **Capacidad nueva `bookings`**: no hay `capabilities/`. La declaro para que el delta tenga dónde fusionarse. El slug va en inglés aunque el producto evite «booking» en castellano.
10. **Sin persistencia nueva**: el motivo vive en la reserva, en memoria, como el resto de datos de `src/app.js`.

### Decisiones tomadas con el dev-lead

- Motivo elegido de una lista con tres valores (cambio de planes, sala ocupada, otro) — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro)».
- El listado de canceladas enseña el motivo — «el listado de canceladas lo enseña».
- Sin review de la spec — «Sin review».

## Intent

Hoy cancelar una reserva no deja rastro de por qué, y no hay forma de ver las canceladas. Se quiere saber el motivo de cada cancelación, elegido de una lista corta para que sea comparable, y poder consultarlo.

## Scope

- Entra: `cancelar` pide un motivo de la lista y lo guarda; comando `canceladas` que lista las canceladas con su motivo; los avisos de motivo ausente o no válido; actualizar los tests de `cancelar` existentes.
- No entra: motivo en `anular` (0011); motivos propios o editables; cambiar el motivo de una reserva ya cancelada; la regla de las 24 h de `PRODUCT.md`; filtros o ficheros de exportación del listado.
- Ficheros: `src/app.js` (`cancelBooking`, el despacho de `run` y la función del listado) y `test/cancel.test.js`. Otros sitios donde el `cancelar` actual esté implementado o documentado: ninguno (`README.md` y `PRODUCT.md` no describen comandos).

## Approach

`cancelar` acepta `--motivo <código>`; si hay reserva activa y el código es de la lista, la marca cancelada y guarda el motivo en ella. El comando `canceladas` recorre las reservas con estado cancelado y las imprime con su motivo. Todo en `src/app.js`, que sigue siendo el único fichero de entrada.

## Dónde se prueba

- Cancelar con motivo, motivo ausente o no válido, y reserva inexistente: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Listado de canceladas: por `run('canceladas', [])`, en el mismo fichero, tras cancelar por `run`.

## Términos y ADR

- Términos resueltos: **Motivo** — la razón, de una lista cerrada, por la que se cancela una reserva. Es de la cancelación, no de la anulación.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Cancelar con motivo**
- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo cambio-de-planes`
- THEN responde `cancelada Norte lun (motivo: cambio de planes)` y la reserva queda cancelada con ese motivo
- AND con `--motivo sala-ocupada` responde `cancelada Norte lun (motivo: sala ocupada)`; con `--motivo otro`, `cancelada Norte lun (motivo: otro)`

**ADDED — El motivo es obligatorio y de la lista**
- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun` (sin motivo)
- THEN responde `falta el motivo: elige cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa
- WHEN `cancelar Norte lun --motivo aburrimiento`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa

**ADDED — Cancelar sin reserva**
- GIVEN no hay reserva activa de Sur el martes (`mar`)
- WHEN `cancelar Sur mar` (con o sin motivo)
- THEN responde `sin reserva Sur mar`

**ADDED — Listado de canceladas**
- GIVEN Norte lun 10:00-12:00 cancelada con motivo `sala-ocupada`
- WHEN `canceladas`
- THEN responde `Norte lun 10:00-12:00 — sala ocupada`
- AND con varias canceladas, una línea por reserva en el orden en que se cancelaron
- AND una reserva anulada con `anular` no aparece

**ADDED — Listado vacío**
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

## Enmiendas

_Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
