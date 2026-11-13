---
id: 20261111-194738-patch-0012-cancel-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancel-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — lo usa una persona desde la terminal y el fallo es lo que ella ve.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base actual (`develop`, 596742d), en una sola sesión con la reserva inicial de Norte del lunes:

- `cancelar Norte mar` → `cancelada Norte mar`; después `cancelar Norte lun` → `sin reserva Norte lun` (la del lunes ya estaba cancelada).
- `anular Norte mar` → `anulada Norte mar`; después `cancelar Norte lun` → `sin reserva Norte lun`. Mismo fallo en la anulación, no reportado.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` y no lo compara: devuelve la primera reserva activa de la sala, de cualquier día. `cancelBooking` y `voidBooking` la usan, así que ambas marcan como cancelada o anulada la reserva de otro día y devuelven un mensaje con el día pedido. El patch 0007 (`.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`) arregló un fallo parecido, una comparación solo por hora; esta búsqueda nunca ha mirado el día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-dia.test.js` (nuevo: el estado de las reservas vive en memoria por proceso y `node --test` aísla cada fichero)
- **Cambio**: `findBooking` compara también `b.day === day`. Con eso, un día sin reserva da el mensaje que ya existe (`sin reserva <sala> <día>`) en `cancelar` y en `anular`.
- **Decisiones**: ninguna sobre lo que el usuario ve: el mensaje `sin reserva Norte mar` ya lo emite el código para ese caso.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → unit: corrió 6/6 · lint: sin hallazgos

RED visto antes del fix (`node --test test/cancel-dia.test.js`): cancelar dio «cancelada Norte mar» (esperado «sin reserva Norte mar»); anular, ejecutado solo (`--test-name-pattern=anular`), dio «anulada Norte mar». La copia del RED guardada fuera del repo no difiere del test.

Revisión del patch (un revisor, Sonnet con effort medio):

1. «El patch 0007 no deja rastro en el repo» — **rechazado**: consta en `ROADMAP.md` (fila 0007, ✅) y en `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md` (causa raíz: «comparación solo por hora»). §2 ahora cita esa ruta.
2. «Con el fichero entero, el RED de anular falla por `libres`, no por el mensaje» — **corregido**: el test 1 cancela antes la reserva del lunes y el test 2 falla en su segunda aserción (`libres` → `Norte, Sur`); solo, falla por el mensaje (`anulada Norte mar`). Con el fix ninguno de los dos muta el estado, y el orden da igual.

El revisor confirmó la causa raíz, que el fix es mínimo y completo, y que `freeRooms` no es otra instancia del fallo: `libres` solo recibe franja, sin día, y cambiarlo sería decidir algo que el usuario ve (queda fuera del patch).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa (`libres 10:00-12:00` → `Sur`) | ✅ |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ |
| 3 | CLI real: `node src/app.js cancelar Norte mar` → `sin reserva Norte mar` | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,0003 h del gate de cierre (~1 s, `operations.md`; sin medida previa en un patch)
- Inicio: 2026-11-11T19:47Z
- Esfuerzo real: pendiente
