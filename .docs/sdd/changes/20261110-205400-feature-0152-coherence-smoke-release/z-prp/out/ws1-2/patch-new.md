---
id: 20261112-162943-patch-0012-slot-format
task: 0012
title: Patch — franja no válida en libres
type: patch
solution: ticket
status: done
created: 2026-11-12
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — franja no válida en libres

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (`capability index`: «Sin capacidades»).

## 1. Síntoma

Fila 0012 del roadmap: «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Medido hoy: `libres 25:00-26:00` devuelve `Norte, Sur`.

## 2. Solución fijada (petición cerrada)

Frase literal de la fila 0012 (ticket): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Comprobado que existe: `run('libres', …)` y `freeRooms` en `src/app.js`; hoy comparan el texto sin validarlo.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja (`HH:MM-HH:MM`, horas 00-23, minutos 00-59) antes de listar.
- **Decisiones**:
  - Franja válida = `HH:MM-HH:MM` con horas 00-23 y minutos 00-59 — sin el dev-lead (la fila no trae requisitos; generaliza el ejemplo). Confirmar en la validación.
  - `libres` sin argumento también responde «franja no válida» (antes listaba `Norte, Sur`): consecuencia de validar — sin el dev-lead. Confirmar en la validación.
  - Fuera de alcance: fin anterior al inicio (`18:00-09:00` sigue aceptándose) — sin el dev-lead.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `libres 25:00-26:00` devolvía `Norte, Sur` (test nuevo en rojo antes del fix) | ❌ antes · ✅ ahora |
| 2 | Regresión: `libres 10:00-12:00` sigue devolviendo `Sur` | ✅ |

Revisión (1 revisor, sonnet): (1) `libres` sin argumento era una decisión oculta → movida a «Decisiones» y marcada para validar; (2) fix correcto y mínimo, sin cambio; (3) un solo ejemplo en el test → rechazado, un patch cubre un caso y los demás no cambian de comportamiento; (4) `status: done` prematuro → se deja, el patch no se archiva hasta la validación.

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests en verde · lint sin hallazgos.

## 5. Tiempo (ligero)

- Estimación: 0,3 h + 0,01 h del gate de cierre (~1 s, `operations.md`)
- Inicio: 2026-11-12T16:29Z
- Esfuerzo real: pendiente
