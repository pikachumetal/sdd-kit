---
id: 20261025-203518-patch-0218-cross-worktree-test-lock
task: 0218
title: Patch — las suites lentas de varios worktrees del clon no corren a la vez
type: patch
solution: dev-lead
status: done
created: 2026-10-25
branch: feature/0218-cross-worktree-test-lock
commit: <hash>
---

# Patch 0218 — las suites lentas de varios worktrees del clon no corren a la vez

## Capacidades

- Modificadas: `cli` — nuevo requisito «`sdd lock run` corre un comando con el cerrojo de las suites del clon»

## 1. Síntoma

[Ticket de la feature 0210](../../field-reports/20261025-193042-feature-0210-session-end-temp-cleanup.md) §1: «con otras tres features abiertas en sus worktrees, el gate de cierre (`moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`) tardó 1094 s y dejó `cli:test-slow` y `cli:test-min` sin correr; al relanzarlas con `moon run --force cli:test-slow cli:test-min` (8 workers), una pasada dio 63 tests en el tope de 120 s (`Tests  63 failed | 234 passed (297)`), y las dos siguientes coincidieron con un cuelgue del PC». El `mutex: heavy-tests` del patch 0190 ordena las suites de un `moon run`, no las de varios worktrees: es lo que dejó abierto la fila de deuda del 0190 («la carga de otras sesiones»).

## 2. Solución fijada

Dev-lead, 2026-10-25, al triar el ticket de la 0210 («Patch: cerrojo entre worktrees») y en el prompt de arranque: «`kit:test`, `cli:test-slow` y `cli:test-min` toman un cerrojo común del clon, y la suite de otro worktree espera a que acabe la que está en marcha y lo dice»; «El cerrojo es el withLock de sdd merge (cli/src/git/lock.ts), común a todos los worktrees del clon»; «El mutex: heavy-tests de moon.yml y cli/moon.yml se queda»; «--maxWorkers 8 no cambia»; «Cómo envuelve la tarea de moon (un verbo de la CLI o un envoltorio del comando) se decide al arrancar». Criterio de aceptación: «GIVEN dos worktrees del kit con cli:test-slow en marcha en uno, WHEN el otro lanza el gate de cierre, THEN el segundo espera al primero y ningún test llega al tope de 120 s por carga».

Lo que da por existente, comprobado: `withLock` en `cli/src/git/lock.ts`, con el aviso «Esperando el cerrojo de <label>: lo tiene …» y la limpieza del cerrojo huérfano; `sdd merge` lo toma en el directorio común de git (`git rev-parse --git-common-dir`), compartido por todos los worktrees; las tres tareas están en `moon.yml` (`test`) y `cli/moon.yml` (`test-slow`, `test-min`).

## 3. Fix

- **Fichero(s)**: `cli/src/lock/verbs.ts`, `cli/src/cli/verbs.ts`, `cli/src/tasks/command.ts`, `moon.yml`, `cli/moon.yml`, `cli/test/lock/run.slow.test.ts`, `.docs/sdd/tech-stack.md`
- **Cambio**: verbo `sdd lock run [--lock-timeout <min>] -- <comando> [args…]`: toma `withLock` sobre `<git-common-dir>/sdd-tests.lock`, corre el comando con la salida heredada y devuelve su código. Las tres tareas de moon lo llevan delante de su comando.
- **Decisiones**:
  - Cerrojo de `withLock` en el directorio común de git; `mutex: heavy-tests` y `--maxWorkers 8` se quedan — dev-lead (2026-10-25)
  - Envoltorio: un verbo de la CLI, `sdd lock run`, y no un script PowerShell: reutiliza `withLock` y el lanzador de `sdd task done` sin otra pieza — sin el dev-lead (decisión de método, perfil `delegate`; se lo dio a decidir al arrancar)
  - Fichero `sdd-tests.lock`, aparte de `sdd-merge.lock`: un merge no espera a una suite — sin el dev-lead (no se ve fuera del repo)
  - Espera máxima por defecto, 60 min: una suite lenta tarda ~11 min y puede haber varias en cola — sin el dev-lead (método)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cli/test/lock/run.slow.test.ts` sin el verbo | ✅ RED: 2/2 en rojo (el cerrojo nunca aparece; `lock run` es un verbo desconocido) |
| 2 | El mismo test con el verbo: la suite del otro worktree espera, avisa con el dueño y sale con el código del comando | ✅ GREEN: 2/2 |
| 3 | Criterio de aceptación: otro worktree del clon (temporal, en el scratchpad) sujeta el cerrojo 60 s con `sdd lock run`; aquí, el gate de cierre `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min --cache off` | ✅ `kit:test` escribe «Esperando el cerrojo de suites: lo tiene  (…\scratchpad\holder, PID 7604) desde 2026-10-25 21:47:33.» y arranca al soltarlo; después, una a una: `kit:test` 1394 passed / 0 failed (8m 42s), `cli:test-min` 1481/1481 (3m 58s), `cli:test-slow` 299/299 (3m 55s); `cli:test` 1182/1182, `cli:typecheck` en verde. Gate entero: 1005 s, exit 0, ningún test en el tope de 120 s |
| 4 | Un `sdd lock run` matado con el cerrojo cogido (`taskkill /T /F`) | ✅ el siguiente escribe «Cerrojo huérfano: lo tenía feature/0218-cross-worktree-test-lock (…, PID 22944) desde 2026-10-25 21:39:25.», lo quita y corre su comando |
| 5 | `sdd lock run` sin comando | ✅ sale con 2: «falta el comando tras --» y la línea de uso |

Notas: el dueño sale con la rama vacía («lo tiene  (») cuando el otro worktree está en HEAD separado; es el formato de `withLock` que ya usa `sdd merge`. Un primer gate, cortado por el `usage` sin `uso:` (corregido), enseñó que moon espera a la tarea en vuelo tras un fallo: el `kit:test` en espera siguió vivo hasta que lo paré.

Validación en campo: 2026-10-25 · RED/GREEN de `run.slow.test.ts` 2/2 · gate de cierre con el cerrojo ocupado desde otro worktree: 1394/0, 1182/1182, 1481/1481 y 299/299, exit 0

## 5. Tiempo (ligero)

- Estimación: 1,5 h
- Inicio: 2026-10-25T20:35Z
- Esfuerzo real: <pendiente>
- Coste de sujetos: no aplica

## 6. Delta de capacidad

### Capacidad: `cli`

**ADDED — `sdd lock run` corre un comando con el cerrojo de las suites del clon**
- GIVEN un worktree del clon con `sdd lock run -- <comando>` en marcha
- WHEN otro worktree del mismo clon lanza `sdd lock run -- <comando>`
- THEN el segundo escribe «Esperando el cerrojo de suites: lo tiene <rama> (<worktree>, PID <n>) desde <fecha>.» y no arranca su comando hasta que acaba el primero
- AND `sdd lock run` sale con el código del comando
