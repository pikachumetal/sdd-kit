---
id: 20261028-220320-patch-0012-slot-format
task: 0012
title: Patch — Franja no válida en libres
type: patch
solution: ticket
status: done
created: 2026-10-28
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — Franja no válida en libres

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (`sdd capability index` → «Sin capacidades»).

## 1. Síntoma

Fila 0012 del roadmap: «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»».
Medido en la base actual: `node src/app.js libres 25:00-26:00` imprime `Norte, Sur`, es decir, lista las salas como si la franja existiera.

## 2. Solución fijada

Petición cerrada. Frase literal de la fila 0012 del roadmap (autor: ticket): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»».
Lo que da por existente, comprobado: el comando `libres` existe (`run` en `src/app.js`) y hoy no valida la franja (`freeRooms` solo la compara como texto con `b.slot`); la deuda técnica del roadmap lo confirma: «Sin validación del formato de franja horaria».

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` comprueba que la franja sea `HH:MM-HH:MM` con horas 00–23 y minutos 00–59; si no, responde `franja no válida: usa HH:MM-HH:MM` en lugar de listar salas.
- **Decisiones**:
  - Texto de la respuesta y comando afectado — ticket
  - «Válida» = formato `HH:MM-HH:MM` con horas y minutos reales (lectura literal de `HH:MM`; el ejemplo 25:00 solo cabe así) — ticket
  - `libres` sin franja queda como está (no lo pide la fila) — ticket

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests · lint sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → `franja no válida: usa HH:MM-HH:MM` (test rojo antes, verde después) | ✅ agente |
| 2 | `libres 10:00-12:00` → `Sur`; `9:00-10:00` y `08:00-09:60` → franja no válida | ✅ agente |

## 5. Tiempo (ligero)

- Estimación: 0,3 h + gate de cierre sin medir (`node --test && node scripts/lint.mjs`)
- Inicio: 2026-10-28T22:03Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
