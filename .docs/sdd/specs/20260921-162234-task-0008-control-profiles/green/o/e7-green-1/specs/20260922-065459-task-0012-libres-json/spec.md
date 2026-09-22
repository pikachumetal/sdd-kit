---
id: 20260922-065459-task-0012-libres-json
task: 0012
title: libres --json
mode: full
profile: delegate
status: draft
created: 2026-09-22
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — libres --json

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`room-availability`), contrato público (el JSON lo consume el panel del coworking). 2 señales, por debajo del umbral de 4 (o contrato público + datos) que activaría dos revisores.

1. Declaro la capacidad nueva `room-availability` en `capabilities/` — el comando `libres` no tenía capacidad documentada; esta task es la primera que la toca bajo SDD full, y su comportamiento (qué salas devuelve, en qué formato) es justo lo que `capabilities/` existe para fijar.
2. El flag `--json` va como argumento final tras la franja (`libres <franja> --json`), igual que `reservar ... --cada-semana` — mismo patrón ya usado en `src/app.js`, sin inventar una sintaxis nueva.
3. Salida JSON en una sola línea vía `console.log(JSON.stringify(...))`, sin pretty-print — coherente con que la salida actual también es una sola línea.
4. Sin `--json`, el comportamiento actual (texto plano, salas unidas por `", "`) no cambia.
5. Si no hay salas libres en la franja, `libres` es `[]` (array vacío), nunca se omite el campo ni es `null`.

## Intent

`libres <franja>` ya devuelve las salas libres como texto plano para uso interactivo. El panel del coworking necesita consumir ese mismo dato por programa, y el texto libre no es parseable de forma fiable. Se añade un modo de salida JSON sin tocar el modo texto existente.

## Scope

- Entra: flag `--json` en el comando `libres`; salida `{"franja": "…", "libres": ["…"]}`.
- No entra: `--json` en `reservar` o `cancelar`; validar el formato de la franja (task 0009); paginar o dar formato legible al JSON.

## Approach

En `run()`, cuando `cmd === 'libres'`, comprobar si `params` incluye `--json`. La franja sigue siendo `params[0]`. Con el flag, construir `{ franja, libres: freeRooms(franja) }` y devolver `JSON.stringify(...)`; sin el flag, mantener el `join(', ')` actual.

## Delta de comportamiento

### Capacidad: `room-availability`

**ADDED — Salida JSON de salas libres**
- GIVEN una franja horaria y el flag `--json`
- WHEN se ejecuta `libres <franja> --json`
- THEN se imprime una única línea JSON `{"franja": "<franja>", "libres": ["<sala>", …]}` con las salas libres en esa franja
- AND si ninguna sala está libre, `libres` es `[]`

**Reglas de la capacidad**
- **Dónde viven los datos**: no aplica (se calcula en memoria a partir de `rooms`/`bookings`, igual que el modo texto)
- **Idioma de los nombres**: castellano — claves `franja` y `libres`, fijadas por el roadmap (0012)
- **Límites**: no aplica
- **Avisos**: no aplica
- **Regla ante conflicto**: no aplica

## Enmiendas

(ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
