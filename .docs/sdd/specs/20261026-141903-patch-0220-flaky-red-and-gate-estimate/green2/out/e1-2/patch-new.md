---
id: 20261026-145100-patch-0012-cancel-msg
task: 0012
title: Patch — mensaje de cancelar
type: patch
solution: dev-lead
status: done
created: 2026-10-26
branch: feature/0012-cancel-msg
commit: <hash>
---

# Patch 0012 — mensaje de cancelar

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

Petición: «cambia el mensaje de cancelar: en vez de "cancelada Norte lun" que diga "reserva cancelada: Norte lun"».

## 2. Solución fijada

Frase literal del dev-lead: «en vez de "cancelada Norte lun" que diga "reserva cancelada: Norte lun"». Lo que da por existente, comprobado: `cancelBooking` en `src/app.js:17` devuelve `` `cancelada ${room} ${day}` `` y `test/cancel.test.js:6` lo fija.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: el mensaje de éxito de `cancelar` pasa a `` `reserva cancelada: ${room} ${day}` ``; el test se actualiza.
- **Decisiones**: ninguna; el texto es el literal del dev-lead.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte lun` → «reserva cancelada: Norte lun» | ✅ RED antes del fix; tras él, `node --test && node scripts/lint.mjs` verde (4/4, lint sin hallazgos, 1,3 s) |

## 5. Tiempo (ligero)

- Estimación: 0,25 h + 0,63 h del gate de cierre (38 min, patch 0007)
- Inicio: 2026-10-26T14:51Z
- Esfuerzo real: ~0,1 h, aproximado; el gate de cierre tardó 1,3 s, no los 38 min del patch 0007
