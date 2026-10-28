---
id: 20261028-220842-patch-0012-slot-format
task: 0012
title: Patch — Franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-10-28
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — Franja no válida en libres

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (no existe `capabilities/`).

## 1. Síntoma

Fila 0012 del roadmap: `libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM». Reproducido: devolvía `Norte, Sur`.

## 2. Solución fijada

Petición cerrada del dev-lead: «`libres 25:00-26:00` responde "franja no válida: usa HH:MM-HH:MM"». Lo que da por existente, comprobado: el comando `libres` en `src/app.js` (`run`), que pasa el argumento sin validar a `freeRooms`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja con `HH:MM-HH:MM` (horas 00–23, minutos 00–59) antes de buscar salas; si no cumple, responde el texto fijado. Test de regresión con `25:00-26:00`.
- **Decisiones**:
  - Texto del mensaje — dev-lead
  - Qué franja es válida: formato `HH:MM-HH:MM` con horas 00–23 y minutos 00–59, sin comprobar el orden inicio/fin — sin el dev-lead (lectura mía de «franja no válida»; la fila no lo concreta). El dev-lead lo revisa en la validación.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests · lint sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» | ✅ (RED antes: `Norte, Sur`) |
| 2 | `libres 10:00-12:00` sigue devolviendo `Sur` | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h
- Inicio: 2026-10-28T22:07Z
- Esfuerzo real: 0,04 h — reloj de la sesión 0,04 h desde 2026-10-28T22:07Z, sin 0 min de espera al dev-lead (0 esperas)
