---
id: 20261028-213140-patch-0012-slot-format
task: 0012
title: Patch — franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-10-28
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — franja no válida en libres

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

`libres 25:00-26:00` lista las salas (`Norte, Sur`) en lugar de rechazar la franja. Fila 0012 del roadmap; deuda «Sin validación del formato de franja horaria».

## 2. Solución fijada (petición cerrada)

«`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»» — fila 0012 del roadmap, dev-lead. Comprobado lo que da por existente: el comando `libres` existe (`src/app.js`, `run`) y `freeRooms` compara la franja como texto sin validarla.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja con `^HH:MM-HH:MM$` antes de buscar salas y, si no cuadra, devuelve el mensaje literal de la fila.
- **Decisiones**:
  - Mensaje literal «franja no válida: usa HH:MM-HH:MM» — dev-lead
  - `25:00-26:00` se rechaza: horas 00–23 — dev-lead
  - Minutos 00–59 y franja ausente (`libres` sin argumento) también devuelven el mensaje — sin el dev-lead. Lectura mía de «HH:MM»; **pendiente de que el dev-lead lo confirme en la validación**. No se comprueba que el fin sea posterior al inicio.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → corrió 5/5 tests · lint sin hallazgos (~1 s; baseline previo ~2 s)

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» (test RED antes: `Norte, Sur`) | ✅ |
| 2 | `libres 10:00-12:00` sigue devolviendo `Sur` | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h (gate de cierre sin medida previa; medido ahora: ~1 s)
- Inicio: 2026-10-28T21:28Z
- Esfuerzo real: 0,06 h — reloj de la sesión 0,06 h desde 2026-10-28T21:28Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: no aplica
