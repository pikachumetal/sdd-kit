---
id: 20261030-122823-patch-0012-slot-format
task: 0012
title: Patch — Franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-10-30
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — Franja no válida en libres

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

`libres 25:00-26:00` lista las salas («Norte, Sur») en vez de rechazar la franja.

## 2. Solución fijada (petición cerrada)

Fila 0012 del roadmap (dev-lead): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Comprobado que existe lo que da por existente: `libres` y `freeRooms(slot)` en `src/app.js`, sin validación alguna (deuda «Sin validación del formato de franja horaria»).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja con `HH:MM-HH:MM` (horas 00-23, minutos 00-59) antes de buscar salas; si no cumple, responde el mensaje literal de la fila.
- **Decisiones**:
  - Mensaje «franja no válida: usa HH:MM-HH:MM» — dev-lead (fila 0012)
  - Horas 00-23 y minutos 00-59 (lo que hace inválida `25:00`) — dev-lead (fila 0012, por su ejemplo)
  - Una franja ausente o con otro formato (`libres`, `10-12`) da el mismo mensaje, porque el mensaje dice «usa HH:MM-HH:MM» — sin el dev-lead (confirmar en la validación)
  - Fuera de alcance, no se valida: fin anterior o igual al inicio (`12:00-10:00`)

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → unit: corrió 5/5 · lint: sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `libres 25:00-26:00` devolvía «Norte, Sur» | ✅ fallaba |
| 2 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» | ✅ |
| 3 | `libres 10:00-12:00` sigue devolviendo «Sur» | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h (patch 0007) + 0,01 h del gate de cierre (~1 s, medido en este patch)
- Inicio: 2026-10-30T12:27Z
- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-10-30T12:27Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: no aplica
