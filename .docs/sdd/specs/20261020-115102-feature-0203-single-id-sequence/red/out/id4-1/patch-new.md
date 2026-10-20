---
id: 20261020-135016-patch-0012-slot-format
task: 0012
title: Patch — franja no válida en libres
type: patch
solution: causa raíz
status: done
created: 2026-10-20
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — franja no válida en libres

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

Roadmap 0012: `libres 25:00-26:00` debe responder «franja no válida: usa HH:MM-HH:MM». Medido en la base actual (`22880aa`): `node src/app.js libres 25:00-26:00` imprime `Norte, Sur`, es decir, lista todas las salas como libres. Coincide con lo reportado.

## 2. Causa raíz

`freeRooms(slot)` (`src/app.js`) usa `slot` solo para compararlo como texto con `b.slot`; `run` le pasa `params[0]` sin comprobar nada. Una franja que no es una hora real nunca coincide con ninguna reserva, así que todas las salas salen libres. Es la deuda «Sin validación del formato de franja horaria» del roadmap. Es determinista: cualquier cadena inválida da el mismo resultado.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja antes de listar: `HH:MM-HH:MM` con horas 00-23 y minutos 00-59; si no, responde «franja no válida: usa HH:MM-HH:MM».
- **Decisiones**:
  - Qué es una hora válida (00-23 y 00-59): lo implica el ejemplo `25:00-26:00` de la fila 0012 — ticket
  - No se comprueba que el fin sea posterior al inicio: la fila no lo pide — ticket

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» | ✅ RED antes (devolvía `Norte, Sur`), verde después; `node --test` 5/5 y `node scripts/lint.mjs` sin hallazgos |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-20T13:50Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
