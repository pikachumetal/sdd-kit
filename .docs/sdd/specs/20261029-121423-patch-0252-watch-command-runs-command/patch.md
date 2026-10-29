---
id: 20261029-121423-patch-0252-watch-command-runs-command
task: 0252
title: Patch — `sdd watch command` lanza el comando y termina con él
type: patch
solution: ticket
status: done
created: 2026-10-29
branch: patch/0252-watch-command-runs-command
commit: <hash>
---

# Patch 0252 — `sdd watch command` lanza el comando y termina con él

## Capacidades

- Modificadas: `feature-flow` — el vigía de una verificación lenta lanza el comando y termina con él

## 1. Síntoma

Reportado ([ticket de la feature 0150](../../field-reports/20261014-113248-feature-0150-roadmap-triage-release-feedback.md) §5): tres campañas de sujetos en segundo plano terminaron, el harness lo avisó y sus vigías `sdd watch command --path <log>` siguieron: los tres acabaron con `SILENCIO: <log> lleva 20 min sin escribir` sobre una campaña ya terminada. La regla de parar el vigía a mano existe en `control-profiles.md` («Vigía de silencio») y no se aplicó ninguna de las tres veces.

Medido en el código: `watch command` solo recibe `--path`, y `verdictFor` (`cli/src/watch/watch.ts`) no tiene más veredictos que `EN MARCHA` y `SILENCIO` para un comando: no sabe que su comando acabó, porque no lo lanzó él.

## 2. Solución fijada

Fila 0252 del roadmap (triaje del ticket del patch 0239, 2026-10-28): «`sdd watch command -- <comando…>` lanza el comando, guarda su salida y termina con `TERMINADO: <comando> salió con <rc>`, o con `SILENCIO:` si deja de escribir; el modo que solo vigila un fichero se queda para los comandos que ya corren». Escenario de la fila: GIVEN `sdd watch command -- node -e "setTimeout(()=>{},100)"` WHEN el comando sale con 0 THEN el vigía termina con `TERMINADO: … salió con 0` y no escribe `SILENCIO:`. El verbo `watch command` y el lanzador de comandos de `cli/src/tasks/command.ts` existen.

## 3. Fix

- **Fichero(s)**: `cli/src/watch/watch.ts`, `cli/src/watch/verbs.ts`, `cli/src/tasks/command.ts`, `cli/test/watch/loop.test.ts`, `skills/sdd-implement/SKILL.md`, `skills/sdd-start-feature/references/control-profiles.md`, `skills/sdd-templates/SKILL.md`
- **Cambio**: con `--`, el vigía lanza el comando (`startToLog`, junto al lanzador de `sdd lock run` y `sdd task done`) con su salida en `.temp/sdd/watch/<hora>-<pid>.log` del worktree, mira ese fichero como hasta ahora y, en cuanto el comando sale, termina con `TERMINADO: <comando> salió con <rc>` y `salida: <ruta>`; si pasa `longCommandMinutes` sin escribir, termina con `SILENCIO:` y para el comando. Las tres skills lanzan la verificación lenta con la forma nueva; `--path` queda para un comando que ya corre.
- **Decisiones**:
  - El modo `--path` se queda para los comandos que ya corren — ticket
  - El test va en `cli/test/watch/` con el reloj inyectado — dev-lead
  - Las skills que nombran el vigía pasan a la forma nueva cuando lanzan el comando — dev-lead
  - La salida va a `.temp/sdd/watch/<yyyyMMdd-HHmmss>-<pid>.log` del worktree (la carpeta de temporales de la CLI, `.temp/sdd`) y su ruta sale en la segunda línea — sin el dev-lead (no es lo que el usuario ve: la fila pide guardarla y no dice dónde)
  - Al dar `SILENCIO:` el vigía para el comando con sus hijos: el comando es hijo del vigía, y el vigía que termina no puede dejarlo huérfano — sin el dev-lead (deriva de «termina con `SILENCIO:`»: sin pararlo, el proceso del vigía no acaba)
  - `--` con `--path` o con `--once` es error de uso — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | escenario de la fila: `watch command -- node -e "setTimeout(()=>{},100)"` (`loop.test.ts`, reloj de vitest) | ✅ RED: sale con 2 (`--` no se admitía) → GREEN: `TERMINADO: … salió con 0` + `salida:`, sin `SILENCIO:` |
| 2 | comando que no escribe durante `longCommandMinutes` → `SILENCIO:` y el comando parado (`loop.test.ts`: el hijo deja de tocar su marcador) | ✅ RED: sale con 2 → GREEN |
| 3 | CLI real en Windows: `node cli/bin/sdd.js watch command -- node -e "setTimeout(()=>console.log('hola'),100)"` | ✅ termina en 0,5 s con `TERMINADO:` y el log contiene `hola`; `--path x -- node -v` → `-- no va con --path ni con --once`, rc 2 |
| 4 | `cli/test/watch/` entera y `tsc --noEmit` | ✅ 35/35 · tsc limpio |

No probado: el paro del árbol en POSIX (`process.kill(-pid)` con `detached`); lo cubre el test 2 en la CI de Linux.

## 5. Tiempo (ligero)

- Estimación: 1 h + 0,2 h del gate de cierre (12 min, patch 0245)
- Inicio: 2026-10-29T12:14Z
- Esfuerzo real:
- Coste de sujetos: no aplica

## 6. Delta de capacidad

### Capacidad: `feature-flow`

#### MODIFIED — Todo subagente y toda verificación lenta llevan su vigía de silencio

- GIVEN un proyecto con `"control": { "silence": { "betweenStepsMinutes": 8, "longCommandMinutes": 20 } }` en `sdd-kit.json`, y un plan Native con la implementación terminada
- WHEN el hilo despacha el revisor final de rama
- THEN en el mismo turno lanza en segundo plano `sdd watch subagent` sobre el transcript de ese revisor, y la orden no lleva ni 8 ni 20: los umbrales los lee el script
- AND lo mismo al despachar un implementador, un revisor de task, un fix wave o una re-revisión en SDD, un revisor de spec o la re-revisión del cierre
- AND la verificación lenta `Invoke-Pester tests/` la lanza en segundo plano el propio vigía, `sdd watch command -- Invoke-Pester tests/`, que guarda su salida y termina con `TERMINADO: Invoke-Pester tests/ salió con <rc>` en cuanto el comando sale, o con `SILENCIO:` si deja de escribir; `sdd watch command --path <fichero>` queda para un comando que ya corre

#### ADDED — El vigía de una verificación lenta termina con su comando

- GIVEN `longCommandMinutes: 20`
- WHEN se ejecuta `sdd watch command -- node -e "setTimeout(()=>{},100)"` y el comando sale con 0
- THEN el vigía termina con `TERMINADO: node -e setTimeout(()=>{},100) salió con 0` y `salida: <ruta del log>`, y no escribe `SILENCIO:`
- AND con un comando que no escribe nada en 20 min 30 s, el vigía termina con `SILENCIO:` y el comando ya no corre
