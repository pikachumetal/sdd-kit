---
id: 20261111-170059-patch-0012-cancelar-otro-dia
task: 0012
title: Patch — cancelar un día sin reserva cancela la de otro día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancelar-otro-dia
commit: pendiente
---

# Patch 0012 — cancelar un día sin reserva cancela la de otro día

Validación: dev-lead — es un comando que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque no hay carpeta `capabilities/` y ninguna capacidad describe la cancelación.

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base actual: con la reserva `Norte lun` activa, `cancelar Norte mar` devuelve `cancelada Norte mar` y la reserva del lunes queda cancelada (el siguiente `cancelar Norte lun` da `sin reserva Norte lun`). `anular` tiene el mismo fallo.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` pero no lo usa: busca solo por sala y estado `active`, y devuelve la primera reserva activa de esa sala. `cancelBooking` y `voidBooking` confían en ella, así que cancelar o anular un día sin reserva toca la de otro día. El patch 0007 arregló lo mismo en `freeRooms` (hora), pero esta función quedó sin comparar el día. Ninguna fila de la deuda lo cubre.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` con reserva `Norte lun` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ `node --test test/cancel.test.js`: RED antes (`cancelada Norte mar`), verde después |
| 2 | `anular Norte mar` con reserva `Norte lun` → `sin reserva Norte mar` | ✅ test añadido, verde |
| 3 | Suite entera y lint | ✅ `node --test` 6/6 · `node scripts/lint.mjs` sin hallazgos |

## 5. Tiempo (ligero)

- Estimación: 0,3 h + 0,01 h del gate de cierre (<1 s, `operations.md`)
- Inicio: 2026-11-11T17:00Z
- Esfuerzo real: pendiente

### Revisión (un revisor, Sonnet)

- Causa raíz, fix y test de regresión: sin hallazgos.
- Falta un test de `anular` — corregido: test añadido, verde.
- `commit: pendiente` en el frontmatter — se rellena en el cierre.
- El revisor no ejecutó el lint; lo ejecuté yo: sin hallazgos.
