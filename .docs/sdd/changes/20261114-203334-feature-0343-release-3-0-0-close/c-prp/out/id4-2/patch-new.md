---
id: 20261116-111001-patch-0013-slot-format
task: "0013"
title: Patch — franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-11-16
branch: feature/0013-slot-format
commit: pendiente
---

# Patch 0013 — franja no válida en libres

Validación: dev-lead — lo usa una persona desde la terminal; no hay frase de delegación del dev-lead para validar por el agente.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Petición (fila 0012 del roadmap, hoy 0013): «`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»».
Medido: `node src/app.js libres 25:00-26:00` imprime `Norte, Sur`.

## 2. Solución fijada (petición cerrada)

Solución fijada por el dev-lead, en la fila del roadmap y en la petición: `libres` con una franja que no es `HH:MM-HH:MM` responde `franja no válida: usa HH:MM-HH:MM`. Lo que da por existente existe: el comando `libres` en `run` (`src/app.js`).
Causa de lo observado: `freeRooms` compara la franja como cadena sin validarla, así que cualquier texto se trata como una franja sin reservas.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/slot-format.test.js`
- **Cambio**: `libres` valida la franja con `^HH:MM-HH:MM$` (horas 00–23, minutos 00–59) antes de buscar salas; si no encaja, responde el texto pedido.
- **Decisiones**:
  - «HH:MM» se lee como hora de reloj válida (00–23, 00–59); es lo que hace inválida `25:00-26:00` — dev-lead (la petición la da por inválida)
- Fuera de alcance: que el fin sea posterior al inicio y `libres` sin franja (que sigue como hoy): no están pedidos.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 11/11 tests, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `libres 25:00-26:00` devolvía `Norte, Sur` (`node --test test/slot-format.test.js`) → ahora `franja no válida: usa HH:MM-HH:MM` | ✅ |
| 2 | `libres 10:00-12:00` sigue listando `Sur` | ✅ |

Revisión (sonnet, 1 revisor): sin hallazgos bloqueantes ni medios. (1) límites de la regex sin test — corregido: añadidos 24:00, 10:60, sin rango, vacío y 23:59-23:59; con la regex relajada a `dd` en los minutos, un test falla. (2) 24:00 rechazado — rechazado el hallazgo: es la decisión 00–23.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (~1 s de tests; sin medida previa en el proyecto)
- Inicio: 2026-11-16T11:10Z
- Esfuerzo real: pendiente
