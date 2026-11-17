---
id: 20261028-211332-patch-0239-watch-ignores-moon-heartbeat
task: 0239
title: Patch — sdd watch command no cuenta el latido de moon como actividad
type: patch
solution: causa raíz
status: done
created: 2026-10-28
branch: patch/0239-watch-ignores-moon-heartbeat
commit: 837676ef
---

# Patch 0239 — sdd watch command no cuenta el latido de moon como actividad

## Capacidades

- Ninguna, porque el fix devuelve `sdd watch command` a lo que ya dice `feature-flow` («Todo subagente y toda verificación lenta llevan su vigía de silencio»): un comando colgado acaba en su aviso de silencio.

## 1. Síntoma

Ticket de la feature 0228 §1 (fila 0239 del roadmap): moon escribe `▮▮▮▮ <tarea> (running for <n>s)` cada 30 s aunque la tarea esté colgada, así que el fichero de salida nunca queda en silencio y el vigía no avisa. En la 0228, `kit:test-headless` estuvo colgado ~100, 22 y 28 min sin aviso.

## 2. Causa raíz

`headVerdict` (`cli/src/watch/verdict.ts`) mide el silencio con el `mtime` del fichero vigilado (`silenceMinutes`), y `watch command` lo llama sin más (`verdictFor`, `cli/src/watch/watch.ts`). Cada latido de moon añade una línea y renueva el `mtime`, así que el silencio nunca pasa de 30 s. El formato del latido, sin códigos ANSI, está medido en `.temp/sdd/plan/baseline.log` de la feature 0235: `▮▮▮▮ kit:test-headless (running for 30s)`.

## 3. Fix

- **Fichero(s)**: `cli/src/watch/watch.ts`, `cli/src/watch/verdict.ts`, `cli/test/watch/loop.test.ts`
- **Cambio**: el vigía de un comando recuerda el tamaño del fichero entre vueltas; si lo añadido son solo líneas de latido, la última actividad no se mueve, y `headVerdict` mide el silencio desde esa actividad en lugar del `mtime`.
- **Decisiones**:
  - El latido se reconoce por `▮… <tarea> (running for <duración>)` en una línea entera, con la duración libre por si moon la escribe en minutos pasados los 120 s medidos — sin el dev-lead (no lo ve el usuario del kit)
  - Con `--once` no hay vueltas que comparar: se queda con el `mtime`, como antes — sin el dev-lead (no lo ve el usuario del kit)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | un fichero que solo recibe latidos durante `longCommandMinutes` termina en `SILENCIO:` (reloj inyectado) | ✅ RED antes del fix (`Received: undefined`: el vigía seguía en marcha a los 20,5 min) → GREEN |
| 2 | una línea que no es latido sí cuenta como actividad: 15 min de latidos, una línea de test y otros 15 min de latidos no avisan | ✅ |
| 3 | `cli/test/watch/` entera | ✅ 33/33 |

Validación en campo: 2026-10-28 · RED → GREEN del test del latido con el reloj inyectado · `cli/test/watch/` 33/33 · typecheck limpio · pre-commit en verde · no probado: un gate de moon colgado de verdad, y la forma del latido pasados los 120 s (solo medidos 30-120 s; el patrón acepta cualquier duración entre paréntesis)

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,18 h del gate de cierre (11 min, patch 0245)
- Inicio: 2026-10-28T21:13Z
- Esfuerzo real: 0,09 h — reloj de la sesión 0,09 h desde 2026-10-28T21:12Z, sin 0 min de espera al dev-lead (0 esperas). −87 % sobre la estimación (0,68 h con el gate): la fila traía la causa y el formato del latido, y el fix cabe en una función del vigía; el gate de cierre aún no ha corrido (corre en la integración con la base, con otras dos ramas abiertas)
- Coste de sujetos: no aplica
