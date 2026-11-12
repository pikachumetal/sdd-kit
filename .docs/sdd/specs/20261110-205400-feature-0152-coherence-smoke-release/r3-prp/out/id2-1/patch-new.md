---
id: 20261111-190744-patch-0016-slot-format
task: 0016
title: Patch — validar el formato de la franja en `libres`
type: patch
solution: dev-lead
status: done
created: 2026-11-11
branch: feature/0016-slot-format
commit: pendiente
---

# Patch 0016 — validar el formato de la franja en `libres`

Validación: dev-lead — es lo que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Petición del dev-lead: «`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»». Medido en la base: `run('libres', ['25:00-26:00'])` devuelve `Norte, Sur`.

## 2. Solución fijada

Petición cerrada, autor dev-lead: «`libres 25:00-26:00` … debe responder «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente, comprobado: el comando `libres` y `freeRooms` en `src/app.js` existen y hoy aceptan cualquier texto como franja. Salda la fila de deuda «Sin validación del formato de franja horaria».

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja antes de listar; si no es `HH:MM-HH:MM` con hora 00–23 y minutos 00–59, responde `franja no válida: usa HH:MM-HH:MM`.
- **Decisiones**:
  - Mensaje literal y caso `25:00-26:00` — dev-lead
  - «Válida» = forma `HH:MM-HH:MM` con horas y minutos en rango: lo exige el propio caso (`25:00` tiene forma correcta y es inválido) — dev-lead (deducido del caso dado)
  - `libres` sin franja no cambia (se valida solo si hay franja): nadie pidió tocarlo
  - No se valida que el fin sea posterior al inicio: nadie lo pidió — queda fuera

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `node --test test/app.test.js` → falla, actual `Norte, Sur`, esperado el mensaje | ✅ |
| 2 | GREEN: `node --test` → 5/5; `node scripts/lint.mjs` → sin hallazgos; `node src/app.js libres 25:00-26:00` → `franja no válida: usa HH:MM-HH:MM`; `libres 10:00-12:00` → `Sur` | ✅ |

Revisor (sonnet): (1) caso sin parámetro, decisión no fijada → corregido: `libres` sin franja queda como estaba; (2) fila GREEN ausente → corregido; (3) cobertura estrecha → rechazado: el patch es un solo test y el caso válido ya lo cubre `libres excluye la sala reservada en la franja`.

## 5. Tiempo (ligero)

- Estimación: 0,25 h + gate de cierre (suite ~1 s, sin medida previa en el proyecto)
- Inicio: 2026-11-11T19:08Z
- Esfuerzo real: pendiente
