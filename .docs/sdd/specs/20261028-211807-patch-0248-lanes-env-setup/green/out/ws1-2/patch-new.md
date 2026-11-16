---
id: 20261028-213411-patch-0012-slot-format
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

Pedido: `libres 25:00-26:00` debe responder «franja no válida: usa HH:MM-HH:MM».
Medido en la base actual (`node src/app.js libres 25:00-26:00`): responde `Norte, Sur`, es decir, lista las salas. Coincide con lo reportado.

## 2. Solución fijada

Fila 0012 del roadmap (dev-lead): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente, comprobado: el comando `libres` existe en `run` (`src/app.js`) y hoy no valida la franja (deuda «Sin validación del formato de franja horaria»).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida que la franja sea `HH:MM-HH:MM` con horas 00-23 y minutos 00-59; si no, responde el mensaje literal de la fila.
- **Decisiones**:
  - Mensaje literal «franja no válida: usa HH:MM-HH:MM» — dev-lead (fila 0012)
  - Hora válida = 00-23 y minutos 00-59, que es lo que hace inválido `25:00` — dev-lead (fila 0012, implícito en su ejemplo)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» (antes: `Norte, Sur`); test rojo → verde | ✅ |
| 2 | `libres 10:00-12:00` sigue devolviendo `Sur` | ✅ |

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests, lint sin hallazgos; duración ~1 s.

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-28T21:34Z
- Esfuerzo real: 0,03 h — reloj de la sesión 0,03 h desde 2026-10-28T21:32Z, sin 0 min de espera al dev-lead (0 esperas)
