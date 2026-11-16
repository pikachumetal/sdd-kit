---
id: 20261027-164105-feature-0228-no-powershell
feature: 0228
title: Walkthrough — Sin PowerShell en el repo y un turno del cerrojo por gate
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-27
---

# Walkthrough — Sin PowerShell en el repo y un turno del cerrojo por gate

## 1. Cambios realizados

- **Cerrojo de suites** (`1b932e22`, pasada de fix `0813a2b8`): `sdd lock run` pasa `SDD_SUITE_LOCK_OWNER=<su PID>` a su comando, y un `sdd lock run` anidado cuyo padre figura como dueño en `sdd-tests.lock` corre sin pedirlo. Las esperas entran en `<git common dir>/sdd-tests.queue/` por orden de llegada (nombre `<ms>-<pid>.json`, escrito aparte y renombrado), las entradas de PID muerto se borran, y el aviso dice el puesto y quién va delante. El «desde» del cerrojo es la hora en que se coge. Espera máxima, 180 min. `withLock` sin cola (ids, merge) no cambia de texto. `cli/src/git/lock.ts`, `cli/src/lock/verbs.ts`, `cli/test/lock/`.
- **Arranque y hook** (`e6224f5a`): `start-kit-session.mjs` sustituye a `Start-KitSession.ps1`; lanza `claude` con `runInherited` de la CLI, pone `SDD_KIT_SESSION_ROOT` y, si falta, `CLAUDE_CODE_TMPDIR` solo para el hijo, ignora `SIGINT` y sale con el código de `claude` (sin `claude` en el PATH, lo dice). El hook pasa a `.claude/hooks/kit-session-source.mjs` con los mismos textos y `.claude/settings.json` lo lanza con `node`.
- **moon y pre-commit** (`3001ab1e`): fuera `kit:test`, `kit:test-fast`, `tests/Invoke-KitTests.ps1` y `language: powershell`; el pre-commit queda en `moon run cli:typecheck cli:test kit:roadmap`; `taskOptions.shell: false` en `moon.yml` y `cli/moon.yml`. `stopPort` (`cli/test/kit/headless/campaign.ts`) para por el puerto con `netstat -ano`.
- **Docs** (`196af4e5` y la pasada de fix): `CLAUDE.md`, `README.md`, `tech-stack.md` (herramientas, conjunto rápido, gate de cierre, Orca, verificación Native) y `architecture.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4 h
- Esfuerzo real: 4,07 h — reloj de 3 sesiones 20,68 h desde 2026-10-27T16:35Z, sin 186 min de espera al dev-lead (24 esperas), sin 13,52 h sin actividad (1 hueco)
- Desviación: +0,1 h (+2 %)
- Causa de la desviación: la implementación salió en 1,40 h (−65 %): la cola y el turno anidado tardaron ~25 min con el patrón de `withLock` ya hecho, y el arranque y el hook fueron traducción. Las otras ~2,7 h son del cierre: tres cuelgues de `kit:test-headless` (~100, 22 y 28 min) que el hilo esperó sin mirar los procesos, un contraste anidado en `sdd lock run` que se esperó a sí mismo (20 min), y el repro del fork de MSYS.
- Compactación: sí, en el cierre, tras las tasks y la revisión
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 84.725.498 — claude-opus-5-5 84.441.320; claude-haiku-5-5 284.178
- Tokens de subagentes: 4.987.718 en 3 despachos — Final review — Code axis claude-sonnet-5-5 763.111 / 3 min; Final review — Spec axis claude-opus-5-5 3.301.728 / 8 min; Re-revisión final 0228 claude-opus-5-5 922.879 / 2 min
- Coste de la sesión: 29,43 $ (hilo 25,91 $ + subagentes 3,52 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- `cli/moon.yml` gana `taskOptions.shell: false`, aunque no estaba en el plan: sin él, moon envuelve cada tarea en `pwsh` o `powershell.exe` y nada arranca sin PowerShell.
- `stopPort` usa `netstat -ano`, no `-ano -p TCP`: `-p TCP` no lista IPv6.
- La pasada de fix añadió `waitersAhead` exportada, `listeningPids` exportada y dos ficheros de test rápidos (`cli/test/lock/queue.test.ts`, `cli/test/kit/headless/listening-pids.test.ts`).

### Decisiones tomadas sin el dev-lead

- Task 4: `git grep` sin hits sale con 1 y `sdd task done` lo daría por rojo — la Verificación de `sdd task done` es solo el vitest; el `git grep` se corre aparte — coste si mal: ninguno.
- Task 1: el regex del test de la cola exigía «\);» tras el dueño — corregido a «\) desde .+;» antes del código, sin cambiar el texto de la spec — coste si mal: ninguno.
- Task 1: la medida con moon real se hizo cuando el baseline soltó el cerrojo, antes de la Task 3 — coste si mal: rehacer la Task 3 (moon hereda la variable: medido).
- Task 2: Ctrl+C quedó «no probado» en Orca y se borró el `.ps1`; después lo probó el dev-lead — coste si mal: ninguno ya.
- Task 3: `taskOptions.shell: false` en los dos `moon.yml` — coste si mal: una tarea que necesite shell (ninguna hoy).
- Task 3: la Task 3 se cerró con los rojos intermitentes de `kit:test-headless` sin arreglar — son la deuda «Tres tests del lanzador en Vitest pasan de su tope con la máquina cargada» (0227) — coste si mal: un rojo real escondido entre intermitentes.
- Final: sin aviso cuando el cerrojo está libre con alguien delante — sería un texto fuera de la spec; caso raro — coste si mal: una espera muda en ese caso.
- Final: `netstat -ano` en vez de `-ano -p TCP` — IPv6 — coste si mal: ninguno.
- Final: el aviso «no encuentro claude en el PATH» no está en la spec — es el que daba PowerShell con el `.ps1` — coste si mal: un texto que reescribir.
- Final: el hueco de un sondeo entre coger el cerrojo y borrar la entrada se deja — se corrige solo — coste si mal: un aviso de más.
- Final: `fake-claude-*` en `tmpdir()`, que es `.temp/` del worktree — coste si mal: ninguno.
- Final: los «Declined to judge» de los ejes (varios hosts con el mismo common dir, reloj que retrocede, `claude.cmd` de npm, `stopPort` fuera de Windows) quedan fuera — coste si mal: rehacer la cola si cambia el uso.
- Final: README y tech-stack no nombran `merge/verify.ts` ni su test entre lo que usa PowerShell — es conducta de `--verify` en los proyectos — coste si mal: una frase.
- Final: `holdUntil` sin tope, y dos tests con `holdFor` — solo afectan a un test ya rojo o con carga — coste si mal: un intermitente.
- Final: un `.json.tmp` de un proceso muerto entre escribir y renombrar se queda en la cola — se filtra — coste si mal: un fichero suelto.
- Cierre: `--maxWorkers 4` en `kit:test-headless` para bajar la carga — se colgó igual a los 28 min; revertido a 8 — coste si mal: ninguno.
- Cierre: no reescribir los `$(…)` de `tests/headless/lib.sh` (58), `run.sh`, `battery.sh` y los 14 `subject.sh` dentro de la 0228 — es el lanzador que la 0216 pasa a Node, en curso — coste si mal: el gate de headless sigue rojo hasta la 0216.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test-min --affected --base develop` sobre `0813a2b8` → salida 1: `kit:test-headless` 81/84 (`pwd: write error: Bad file descriptor` en `tests/headless/lib.sh` y `Cannot find module 'C:\Program Files\Git\battery.mjs'`), y `cli:test-min` sin correr. Por partes, sobre `0813a2b8`:
  - `moon run cli:typecheck cli:test-min --force` (dentro de `sdd lock run`) → `Tasks: 2 completed`, 1849 passed | 12 skipped (1861), 865,35 s, `merge/cleanup.slow.test.ts` incluido.
  - `moon run kit:test-headless --force`, repetido en la rama → colgado ~100 min y cortado al cerrarse la sesión; con `--maxWorkers 4` (prueba, revertida) → colgado a los 28 min, parado por PID: `battery.sh`, `run.sh` y un `subject.sh` bloqueados y sin hijos.
  - Contraste sin la rama, `moon run kit:test-headless --force` en un worktree desanclado de `develop` (`f4ac894e`) → 11 failed | 70 passed (81), 1334,98 s, con el mismo `pwd: write error: Bad file descriptor` y el mismo `Cannot find module 'C:\Program Files\Git\battery.mjs'`. `base: en rojo: el mismo comando también falla sin la rama`.
  - Repro fuera de los tests: 12 `bash` lanzados con `spawn` de Node (`stdio: ['ignore', fd, fd]`), cada uno con 5 trabajos en segundo plano que hacen `$(cd /usr && pwd)` 150 veces: en 1 de 4 rondas, 2 con `pwd: write error: Bad file descriptor` y 5 de 12 colgados; sin subshell (`cd` y `$PWD`), 0 en 3 rondas y 8-10 veces más rápido. Es el fork de MSYS con muchos `bash` a la vez en la máquina (sesiones, statuslines, suites de otras ramas).
  - Fusión sobre ese rojo: decisión del dev-lead, 2026-10-28, «haz lo que tengas que hacer», «arréglalo» y, tras ver que no se arregla sin rehacer el lanzador, «cierra».
- Conjunto rápido sin PowerShell en el `PATH` (ni `pwsh` ni `powershell.exe`): `moon run cli:typecheck cli:test kit:roadmap --force` → `Tasks: 3 completed`, 1448 tests (sobre `0813a2b8`).
- Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre `196af4e5`; re-revisión `196af4e5..0813a2b8` opus+high, limpia.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-28 · verificación del agente: smoke real del cerrojo (tres `sdd lock run` en tres worktrees, anidado, `moon` dentro), arranque y hook en Orca, `moon` y pre-commit sin PowerShell en el `PATH`, `cli:test-min` 1849/1849; `kit:test-headless` en rojo, el mismo que `develop` sin la rama (4.1); Ctrl+C y Esc de la TUI, reportado por el dev-lead («si todo ok»); no probado: dos gates reales a la vez

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| MODIFIED: el segundo escribe «Esperando el cerrojo de suites: vas 1.º en la cola; lo tiene …» y no arranca hasta que acaba el primero | ejecución real | tres `sdd lock run` en tres worktrees del clon: «vas 1.º en la cola; lo tiene feature/0228-no-powershell (…, PID 43792) desde 2026-10-27 19:13:01.» |
| MODIFIED AND: sale con el código del comando | suite | `exits with the code of the command` |
| ADDED anidado: arranca sin esperar ni escribir «Esperando», y el cerrojo sigue siendo del exterior | ejecución real | `sdd lock run -- sdd lock run -- node -e …` → «anidado sin esperar» sin aviso propio; `sdd lock run -- moon run kit:test-headless` → el vitest interior arranca sin aviso (moon hereda la variable) |
| ADDED anidado AND: con un dueño heredado que no es el del cerrojo, o sin dueño, lo pide | suite | `asks for the lock when the inherited owner is not the holder`, `takes the lock as usual with an inherited owner and nobody holding it` |
| ADDED cola: «vas 2.º en la cola; lo tiene …; delante de ti, …» | ejecución real | el tercero escribió «vas 2.º en la cola; … delante de ti,  (…review-0228-196af4e5, PID 7964).» (el doble espacio del desanclado, arreglado en `0813a2b8`) |
| ADDED cola AND: lo coge el que llegó antes, con el «desde» de cuando lo cogió | ejecución real + suite | B arrancó antes que C en el smoke; el «desde» (hallazgo del smoke) lo fija `records when the waiter took the lock, not when it arrived` |
| ADDED cola AND: una espera muerta sale de la cola | suite | `drops the queue entry of a dead waiter` |
| Arranque: variables solo para el hijo, argumentos tal cual, código de `claude` | ejecución real + suite | Orca: `claude.EXE --settings "{…false}" --plugin-dir D:\code\.worktrees\sdd-kit\feature-0228-no-powershell --model haiku`; tests de `start-kit-session.mjs` |
| Arranque: la TUI conserva modo raw y Ctrl+C | reportado por el dev-lead | Windows Terminal, `node start-kit-session.mjs --model haiku`, Esc y Ctrl+C ×2: «si todo ok»; flechas, también en Orca |
| Hook con `node`, mismos avisos | ejecución real | sin `SDD_KIT_SESSION_ROOT`: el aviso con «node start-kit-session.mjs», salida 0; con la variable: nada, salida 0 |
| Pre-commit y moon sin PowerShell | ejecución real | `PATH` sin las carpetas de PowerShell → `Tasks: 3 completed` |
| `stopPort` sin `pwsh` | suite | `stopPort para lo que escucha en el puerto`, `listeningPids` (castellano, IPv6) |
| Gate en un turno con dos gates reales a la vez | no probado | el smoke fue con `sdd lock run` sueltos; el gate de cierre corrió solo |

### 4.3 Residuales / deuda generada

- Los rojos y cuelgues de `kit:test-headless` con la máquina cargada, también en `develop` sin la rama: deuda existente «Tres tests del lanzador en Vitest pasan de su tope con la máquina cargada» (0227, **Actuar → 0216**), con este tercer caso y el repro del fork de MSYS.
- `merge/cleanup.slow.test.ts` no se repitió (1849/1849): su fila queda saldada.
- El hallazgo del patch 0232 (`kit:test` en verde sin tests: Pester sin `*.Tests.ps1` y `exit 0`) lo cierra la rama al quitar `kit:test`, `kit:test-fast` y `tests/Invoke-KitTests.ps1`; `git grep` sin referencias fuera de los registros.
- Un `vitest run test/kit` sin acotar en otra rama lanza las baterías del lanzador fuera de `sdd lock run` y carga la máquina durante el gate de otra (visto con la 0237): al ticket.

## 5. Aprendizajes

- moon 2.6 envuelve en Windows cada tarea en `pwsh`, y si no, en `powershell.exe`: sin ellos, «program not found». `taskOptions.shell: false` lo quita → `tech-stack.md` (Herramientas del repo).
- `orca terminal read --screen` no repinta lo escrito sin Enter, y Orca no entrega un Ctrl+C real a una TUI → `tech-stack.md` (Probar una sesión interactiva).
- Un smoke real de la cola encontró el «desde» equivocado que la suite no veía: los tests miraban el puesto, no la hora.

## 6. Adendas
