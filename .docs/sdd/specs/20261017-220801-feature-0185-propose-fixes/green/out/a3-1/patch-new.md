---
id: 20261018-115951-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar respeta el día
type: patch
solution: causa raíz
status: done
created: 2026-10-18
branch: feature/0012-cancelar-dia
commit:
---

# Patch 0012 — cancelar respeta el día

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.» Reproducido: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, y la reserva de `Norte lun` queda cancelada.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` pero no lo compara: devuelve la primera reserva activa de la sala. `cancelBooking` la cancela y responde con el día pedido. El patch 0007 arregló el mismo síntoma por la hora, pero el día nunca llegó a esta función. `voidBooking` (`anular`) usa la misma función y tenía el mismo fallo.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` también exige `b.day === day`. Test de regresión: cancelar `Norte mar` da `sin reserva Norte mar` y `libres 10:00-12:00` sigue devolviendo `Sur` (la de `lun` sigue activa).

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`, la de `lun` intacta | ✅ |
| 2 | Test nuevo en rojo sin el fix (`cancelada Norte mar`), en verde con él | ✅ |
| 3 | `node --test && node scripts/lint.mjs` → 5/5, lint sin hallazgos | ✅ |

## 5. Tiempo (ligero)

- Estimación: no hay; no me llegó de `sdd-propose` y no la estimé antes del fix (el proyecto dice que los patches solo registran tiempo real). No calibra.
- Inicio: 2026-10-18T11:59Z
- Esfuerzo real: | Hilo | claude-sonnet-5-5 | 14 | 0 | 7.712 | 409.114 | 5.141 | 421.981 | sin precio |
- Coste de sujetos: no aplica
