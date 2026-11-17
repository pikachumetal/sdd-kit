---
id: 20261112-155535-patch-0013-slot-format
task: 0013
title: Patch — franja no válida en libres
type: patch
solution: ticket
status: done
created: 2026-11-12
branch: feature/0013-slot-format
commit: pendiente
---

# Patch 0013 — franja no válida en libres

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (`capability index`: «Sin capacidades»).

## 1. Síntoma

Fila del roadmap (antes 0012, renumerada a 0013 por colisión en `origin/develop`): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»».
Medido: `libres 25:00-26:00` devuelve `Norte, Sur`, es decir, lista las salas como si la franja fuera buena.

## 2. Solución fijada (petición cerrada)

Autor: ticket (fila del roadmap) y petición del dev-lead: «`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»».
Lo que da por existente, comprobado: el comando `libres` existe en `run()` de `src/app.js`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida su franja con `HH:MM-HH:MM` (horas 00-23, minutos 00-59) antes de buscar salas; si no cumple, responde el texto literal de la petición.
- **Decisiones**:
  - Validez = formato `HH:MM-HH:MM` con horas y minutos reales; sin franja también es no válida — sin el dev-lead, pero es lo que dice el literal «usa HH:MM-HH:MM»; no cambia el texto ni la regla pedida.
  - Fuera de alcance, no decidido: fin anterior o igual al inicio, `24:00` como fin.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `node --test` antes del fix, `libres 25:00-26:00` → `Norte, Sur` (esperado el aviso) | ✅ falló por lo esperado |
| 2 | GREEN: `node --test` → 5/5; `node src/app.js libres 25:00-26:00` → `franja no válida: usa HH:MM-HH:MM`; `libres 10:00-12:00` → `Sur` | ✅ |
| 3 | Revisor (sonnet): sin bloqueantes. Hallazgo 1 (sin franja sin test) y 2 (minutos y formato roto sin test): corregidos con un segundo test; ya pasaba porque el regex los cubría. Hallazgo 3 (`commit: pendiente`): se rellena al cerrar. | ✅ node --test 6/6 |

## 5. Tiempo (ligero)

- Estimación: 0,3 h + gate de cierre (`node --test`, sin medida previa)
- Inicio: 2026-11-12T15:54Z
- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-11-12T15:54Z, sin 0 min de espera al dev-lead (0 esperas)
