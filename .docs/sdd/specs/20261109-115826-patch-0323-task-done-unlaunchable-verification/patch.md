---
id: 20261109-115826-patch-0323-task-done-unlaunchable-verification
task: 0323
title: Patch — `sdd task done` rechaza un Vitest con lentos sin `--test-timeout`
type: patch
solution: dev-lead
status: done
created: 2026-11-09
branch: patch/0323-task-done-unlaunchable-verification
commit: ee69a613
---

# Patch 0323 — `sdd task done` rechaza un Vitest con lentos sin `--test-timeout`

Validación: agente, «Perfil delegate» con `validation.mode: field` en `sdd-kit.json` — es una comprobación de la CLI que cubren sus tests; el uso real la valida en campo con los tickets de `sdd-feedback`.

## Capacidades

- Modificadas: `cli` — `sdd task done` no lanza un `vitest` que toca un `*.slow.test.ts` sin `--test-timeout`

## 1. Síntoma

De la fila 0323 del roadmap y la de deuda «La «Verificación» del plan no se puede lanzar tal cual con `sdd task done`»:

- En la 0284, la «Verificación» `cd cli; pnpm exec vitest …` no se pudo lanzar sin shell y acabó en un ruling ([ticket](../../field-reports/20261109-112742-feature-0284-word-budgets-without-slack.md) §1).
- En la 0319, `npx vitest run test/roadmap/` sin `--test-timeout 120000` dio dos rojos, 17 y 18 tests con `Error: Test timed out in 5000ms.`, todos en `*.slow.test.ts` ([ticket](../../field-reports/20261108-131801-feature-0319-roadmap-check-file-overlap.md) §2).

Medido en `develop` (`9bf26d72`), Windows 11, PowerShell, con un plan de prueba y `HEAD~1` de base:

- `sdd task done <plan> 1 HEAD~1 -- cd cli` y `-- cd 'cli;' pnpm exec vitest run test/tasks/done.test.ts`: los dos salen con 127 sin lanzar nada (`resolveCommand` no encuentra `cd` en el `PATH`), con `task-done: test command exited 127; Task <n> NOT recorded`.
- Desde `cli/`, `sdd task done <plan> 3 HEAD~1 -- npx vitest run test/roadmap/`: `Tests  209 passed (209)` en 47,96 s, sale con 0 y apunta `Task 3: complete` en el ledger. Los tiempos de espera de la 0319 dependen de la carga de la máquina; la herramienta acepta el comando sin el tope que pide `tech-stack.md` §Testing.

## 2. Solución fijada

Del dev-lead, en la petición del patch (2026-11-09): «(2) un vitest run cuyas rutas contienen un *.slow.test.ts sin --test-timeout sale con un código distinto de 0 antes de lanzar, nombrando el fichero lento». Da por existentes `sdd task done` (`cli/src/tasks/done.ts`) y los `*.slow.test.ts` de `cli/test/` (`cli/test/roadmap/` tiene tres): comprobado.

El caso (1), un builtin de shell o `;`/`&&`, sale del patch por la decisión del dev-lead en la petición: «Si alguno ya falla antes de lanzar, sale con un ruling». La medida de arriba da 127 sin lanzar nada.

## 3. Fix

- **Fichero(s)**: `cli/src/tasks/done.ts`, `cli/test/tasks/executing.slow.test.ts` (los tests de `task done` que lanzan la CLI)
- **Cambio**: antes de lanzar el comando, `finishTask` busca los `*.slow.test.ts` que casan con los filtros de un `vitest` sin `--test-timeout` y, si hay alguno, sale con 1 nombrándolos.
- **Decisiones**:
  - El caso (1) no entra: ya sale con 127 sin lanzar nada — dev-lead («Si alguno ya falla antes de lanzar, sale con un ruling»)
  - El comando es de Vitest si un argumento es `vitest` (o acaba en `/vitest`, `\vitest.cmd`…), y lleva tope si trae `--test-timeout` o `--testTimeout`. Los argumentos que siguen sin `-` delante son filtros, salvo `run` y el valor de una opción conocida (`-t`, `--config`, `--maxWorkers`, `--reporter`…); una ruta absoluta se pasa a relativa a la raíz. Casan como subcadena de la ruta, igual que en Vitest, con los `*.slow.test.ts` que da `git ls-files --cached --others --exclude-standard` en la raíz del repo; sin filtros, todos. Así la forma `pnpm --dir cli exec vitest run …` casa sin leer `--dir`. El valor de una opción que no está en la lista cuenta como filtro, marcado `ponytail:` en el código — sin el dev-lead; no cambia lo que se ve, solo cómo se encuentran los ficheros
  - El mensaje nombra los 3 primeros lentos y «y N más»: sin filtros, en `cli/` son 51 — sin el dev-lead; el mensaje sigue nombrando el fichero, como pide la solución fijada
  - El mensaje: `Task <n> NOT recorded: vitest corre <ficheros> sin --test-timeout: añade --test-timeout 120000` — dev-lead (nombra el fichero y `--test-timeout`)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `pnpm --dir cli exec vitest run test/tasks/executing.slow.test.ts -t 'vitest and slow' --test-timeout 120000` | ❌ esperado: los dos casos de rechazo, `AssertionError: expected +0 to be 1` (hoy lanza el comando); los dos de paso, verdes |
| 2 | Tras el fix: `pnpm --dir cli exec vitest run test/tasks/ --test-timeout 120000` | ✅ `Tests  93 passed (93)`; `tsc --noEmit` limpio |
| 2b | Tras la revisión, seis casos más, RED primero con el mismo comando y `-t 'vitest and slow'` | ❌ esperado: 4 rojos (`--maxWorkers 8`, ruta absoluta, lento sin commitear, `-t slow`); sin filtros y `--testTimeout=1` ya pasaban. Tras el arreglo, `test/tasks/` → ✅ `Tests  99 passed (99)`; `tsc --noEmit` limpio; la copia RED es idéntica al test (`git diff --no-index`, sin diferencias) |
| 3 | El criterio con el binario real, desde `cli/`: `node ../dist/cli/bin/sdd.js task done <plan> 1 HEAD~1 -- npx vitest run test/roadmap/` | ✅ sale con 1 sin lanzar: `Task 1 NOT recorded: vitest corre cli/test/roadmap/cut.slow.test.ts, cli/test/roadmap/publish-failures.slow.test.ts, cli/test/roadmap/publish.slow.test.ts sin --test-timeout: añade --test-timeout 120000` |
| 4 | Sin lentos, desde `cli/`: `… -- npx vitest run test/roadmap/check.test.ts` | ✅ corre (`Tests  54 passed (54)`), sale con 0 y apunta `Task 1: complete` |

Revisión del patch (un reviewer `sdd-kit:effort-medium`, sonnet): 0 críticos, 0 importantes, 6 menores, todos arreglados (`review.minors: fix`):

- El valor de una opción contaba como filtro: `--maxWorkers 8` dejaba pasar un lento y `-t slow` daba un falso rechazo → arreglado con la lista de opciones con valor; test de los dos.
- Una ruta absoluta dejaba pasar el lento → arreglado, pasa a relativa a la raíz; test.
- Un lento sin commitear no se veía → arreglado con `--others --exclude-standard`; test.
- Sin filtros, el mensaje listaba 51 ficheros → arreglado, nombra 3 y «y N más».
- Faltaban tests de «sin filtros» y `--testTimeout=…` → añadidos. El comando que no es Vitest ya lo cubre el resto de `executing.slow.test.ts` (`node -e`).
- `patch.md`: §3 nombraba `done.test.ts`, §4 tenía una fila vacía y §6 no decía `--testTimeout` ni los lentos sin commitear → arreglado.

Smoke del cierre, por ejecución real con `node ../dist/cli/bin/sdd.js task done <plan> 1 HEAD~1 -- …` desde `cli/`, sobre `ee69a613`:

| # | THEN / AND | Evidencia |
| --- | --- | --- |
| 1 | `npx vitest run test/roadmap/` → sale con 1 sin lanzar, nombra los lentos y `--test-timeout` | ejecución real: fila 3 de arriba |
| 2 | `npx vitest run --maxWorkers 8` → el valor no cuenta como filtro: rechaza todos, 3 nombrados y «y 47 más» | ejecución real: `vitest corre cli/test/cli.slow.test.ts, cli/test/comments/verb.slow.test.ts, cli/test/estimation/releases.slow.test.ts y 47 más sin --test-timeout`, exit 1 |
| 3 | `npx vitest run <ruta absoluta de cut.slow.test.ts>` → casa igual que la relativa | ejecución real: `vitest corre cli/test/roadmap/cut.slow.test.ts sin --test-timeout`, exit 1 |
| 4 | `npx vitest run test/roadmap/ --test-timeout 120000` → lanza como hasta ahora | ejecución real: `Tests  209 passed (209)`, exit 0, `Task 1: complete` |
| 5 | `npx vitest run test/roadmap/check.test.ts` (ningún lento) → lanza como hasta ahora | ejecución real: fila 4 de arriba |

Validación en campo: 2026-11-09 · smoke 5/5 por ejecución real · `test/tasks/` 99/99 · el gate de cierre corre en el merge de sincronización, porque la `feature/0322` sigue abierta: su línea `Gate:` va en el mensaje final.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-09T11:58Z
- Esfuerzo real: 0,26 h — reloj de la sesión 0,26 h desde 2026-11-09T11:55Z, sin 0 min de espera al dev-lead (0 esperas). −54 % sobre la estimación (0,57 h con el gate): sin esperas ni huecos; la medida inicial sacó el caso del builtin de shell, la mitad del alcance, y el gate de cierre aún no ha corrido (corre en el merge de sincronización)
- Coste de sujetos: no aplica

## 6. Delta de capacidad

### Capacidad: `cli`

#### ADDED — `sdd task done` no lanza un Vitest con lentos sin `--test-timeout`

- GIVEN un plan con commits en el rango de la task
- WHEN se ejecuta `node sdd.js task done <plan> <n> <base> -- npx vitest run <filtros>` sin `--test-timeout`, y algún filtro está en la ruta de un `*.slow.test.ts` (o no hay filtros)
- THEN escribe en stderr `Task <n> NOT recorded: vitest corre <ficheros> sin --test-timeout: añade --test-timeout 120000`, sale con 1 y no ejecuta el comando
- AND con `--test-timeout <ms>`, o sin ningún lento entre los filtros, lo lanza como hasta ahora
