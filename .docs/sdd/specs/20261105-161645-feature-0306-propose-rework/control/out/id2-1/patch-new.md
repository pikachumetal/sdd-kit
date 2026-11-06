---
id: 20261105-211731-patch-0016-slot-format
task: 0016
title: Patch — validar el formato de la franja en `libres`
type: patch
solution: dev-lead
status: done
created: 2026-11-05
branch: feature/0016-slot-format
commit: pendiente
---

# Patch 0016 — validar el formato de la franja en `libres`

Validación: dev-lead — es un mensaje que el usuario ve.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Petición: «`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»». Medido: `node src/app.js libres 25:00-26:00` imprime `Norte, Sur`. Es la fila de deuda «Sin validación del formato de franja horaria».

## 2. Solución fijada

Frase literal del dev-lead: «debe responder «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente, comprobado: el comando `libres` y `freeRooms` en `src/app.js`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/slot.test.js`
- **Cambio**: `libres <franja>` comprueba la franja con `/^HH:MM-HH:MM$/` (hora 00-23, minutos 00-59) y, si no cuadra, responde el mensaje fijado.
- **Decisiones**:
  - Texto del mensaje — dev-lead
  - `25:00-26:00` es inválida, luego «válida» exige hora 00-23 y minutos 00-59 (deducido del ejemplo) — dev-lead
  - No se exige fin posterior al inicio, porque la petición no lo pide — sin el dev-lead (no cambia ningún caso pedido; queda como posible fila de deuda)
  - `libres` sin franja se deja como estaba (lista las salas) — sin el dev-lead (fuera de lo pedido)

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 5/5 · lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `run('libres', ['25:00-26:00'])` devolvía `Norte, Sur` | ✅ visto fallar |
| 2 | `libres 25:00-26:00`, `10:60-11:00` y `mañana` → «franja no válida: usa HH:MM-HH:MM» | ✅ |
| 3 | `libres 10:00-12:00` sigue devolviendo `Sur` | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h
- Inicio: 2026-11-05T21:17Z
- Esfuerzo real: aproximado con las marcas de los commits (se rellena al cerrar)

Revisión (sonnet, effort medium): sin hallazgos Críticos ni Importantes. Menores: (1) falta test positivo de `libres 10:00-12:00` — rechazado, ya lo cubre `test/app.test.js`; (2) el `Cambio` describe el regex en notación descriptiva — aceptado, intencionado.
