---
id: 20261027-164105-feature-0228-no-powershell
feature: 0228
proposal: 0225
title: Sin PowerShell en el repo y un turno del cerrojo por gate
mode: full
profile: delegate
status: approved
created: 2026-10-27
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-27
---

# Spec — Sin PowerShell en el repo y un turno del cerrojo por gate

🦆 Quien trabaja en el repo del kit arranca la sesión con `node start-kit-session.mjs --model sonnet` en vez de `./Start-KitSession.ps1 --model sonnet`, y el pre-commit, moon y el hook de sesión corren sin `pwsh` instalado. Al cerrar, el gate entero coge el cerrojo de suites una sola vez: si la 0210 cierra a la vez, la segunda rama espera a que la primera acabe todo su gate, no solo una tarea, y ve «vas 2.º en la cola». Por dentro: un script de Node lanza `claude` con las variables solo para el hijo, el hook pasa a `.mjs`, `kit:test` y `kit:test-fast` salen porque ya no queda ningún Pester, y `sdd lock run` se vuelve reentrante y hace cola por orden de llegada.

## Capacidades

- Modificadas: `cli` — «`sdd lock run` corre un comando con el cerrojo de las suites del clon»: su ejemplo deja de lanzar `tests/Invoke-KitTests.ps1`, y gana el turno único anidado y la cola con su puesto.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (un requisito de `cli`), contrato público (la salida de `sdd lock run` y la variable que hereda el hijo, que consumen las tareas de moon) · tamaño: ~350 líneas en 14 ficheros
- Mínimo razonable: ninguna — deja sin mirar por otro par de ojos si la cola cubre la carrera de dos ramas que llegan en el mismo milisegundo; lo cubre el escenario de la cola con dos procesos reales.

1. **Turno único por herencia**: `sdd lock run` pasa a su hijo `SDD_SUITE_LOCK_OWNER=<su PID>`. Un `sdd lock run` anidado que la recibe y lee ese mismo PID como dueño en `sdd-tests.lock` corre su comando sin pedir el cerrojo; si el PID no casa o el fichero no existe, lo pide como hoy — una variable heredada de una sesión vieja no salta el cerrojo.
2. **Cola por orden de llegada** en `<git common dir>/sdd-tests.queue/`: cada espera deja una entrada con su llegada, su PID y su dueño; coge el cerrojo solo la primera entrada viva. Una entrada de un PID muerto en esta máquina se borra, como hoy el cerrojo huérfano.
3. **Texto de la espera**: «Esperando el cerrojo de suites: vas 1.º en la cola; lo tiene feature/0210 (D:\code\sdd-kit-0210, PID 4120) desde 2026-10-27 17:05:12.»; con más gente esperando delante, «vas 2.º» y, tras el dueño, «; delante de ti, feature/0211 (D:\code\sdd-kit-0211, PID 5332).» con las ramas en orden. El puesto cuenta solo a los que esperan, no al dueño: corrijo la sección 1, que decía «vas 2.º… delante de ti, nadie más» para el primero en espera. Se imprime cada vez que cambia el puesto o el dueño, no en cada sondeo.
4. **La cola es solo del cerrojo de suites**: los cerrojos de `sdd merge` y de `sdd id next` (`withLock`) no cambian de conducta ni de texto.
5. **Espera máxima de `sdd lock run`: 180 min** (hoy 60): con el gate entero en un turno (~20 min) y tres ramas delante, 60 min cortaría una espera legítima. `--lock-timeout` sigue mandando.
6. **El gate de cierre** de `tech-stack.md` pasa a `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test-min --affected --base develop`. `kit:test-headless`, `cli:test-slow` y `cli:test-min` conservan su `sdd lock run` propio, que dentro del gate no vuelve a pedir el cerrojo y fuera de él sí.
7. **`kit:test`, `kit:test-fast` y `tests/Invoke-KitTests.ps1` salen**: tras la 0227 no queda ningún `tests/*.Tests.ps1` y las dos tareas corren `Invoke-Pester` sobre cero ficheros. Sale también `language: powershell` de `moon.yml`. El pre-commit queda en `moon run cli:typecheck cli:test kit:roadmap`, y su mensaje de bloqueo, con ese mismo comando.
8. **Arranque**: `start-kit-session.mjs` en la raíz lanza `claude` (`claude.exe`, sin shell) con `spawn` y `stdio: 'inherit'`, ignora `SIGINT` mientras el hijo vive y sale con su código. Antes de borrar el `.ps1` se comprueba a mano en un terminal de Orca que la TUI conserva el modo raw (flechas, Esc) y que Ctrl+C llega a `claude`.
9. **Hook**: `.claude/hooks/kit-session-source.mjs`, lanzado desde `.claude/settings.json` con `node "${CLAUDE_PROJECT_DIR}/.claude/hooks/kit-session-source.mjs"` y `"shell": "bash"`. Sus textos son los de hoy con `./Start-KitSession.ps1` → `node start-kit-session.mjs` y `Start-KitSession.ps1` → `start-kit-session.mjs`.
10. **`stopPort`** (`cli/test/kit/headless/campaign.ts`) para por el puerto con `netstat -ano -p TCP` y `process.kill(pid)`: una línea escucha si su dirección local acaba en `:<puerto>` y la remota es `0.0.0.0:0` o `[::]:0`, sin leer la palabra del estado, que se traduce con el idioma de Windows (`LISTENING` / `ESCUCHANDO`).
11. **Se quedan con PowerShell**, fuera del Scope: `tests/headless/lib.sh` (al cerrar una campaña real necesita la hora de arranque del proceso, que en Windows solo da PowerShell, y sin `pwsh` ya escribe «no comprobado»); `cli/test/merge/failures.slow.test.ts` (necesita un fichero abierto en exclusiva, que Node no abre); `cli/src/merge/verify.ts` (conducta de la CLI en los proyectos); `skills/sdd-start-feature/references/nombrado.md` (`Get-Date`, instrucción a los proyectos); el `.ps1` de evidencia de la spec 0009.
12. **Docs**: `CLAUDE.md` del repo, `tech-stack.md`, `architecture.md` y `README.md` dicen el arranque y el gate nuevos (sección 4 del diseño). Las evidencias (`tests/*-red.md`), las ADR, el changelog y las specs cerradas no se editan.
13. **Repaso de coherencia**: corregido el puesto de la decisión 3 frente a la sección 1 y una hora sin fijar en el THEN de la cola. `sdd capability merge` sobre una copia de `.docs/sdd`: «sustituido «`sdd lock run` corre un comando con el cerrojo de las suites del clon»», dos «añadido», salida 0. El aviso de espera solo lo comprueba `cli/test/lock/run.slow.test.ts:43` para las suites; los de ids y merge no cambian (decisión 4).
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin sujetos · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que piden las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Carril: lite elegido al clasificar (opción «Lite»); sube a full al entrar el cerrojo, que toca la CLI y pasa de media jornada — regla «el carril solo sube».
- El turno del cerrojo entra en la 0228 — «Dentro de la 0228»; la cola, «eso es crítico» (2026-10-27, al triar el ticket de la 0227, vía la sesión `develop`). La fila pasa de tamaño S a M; no se parte.
- Sin `--dangerously-skip-permissions` en el arranque — `cdd7842f`, enmienda del 2026-10-27 de la propuesta 0225.
- Diseño por secciones: el turno del gate, el arranque, moon y los tests, la documentación — «si» a las cuatro (2026-10-27).
- Coordinar los cambios de `Select-Claude.ps1` con su sesión — «el agente de Powershell core esta abierto asi que si le tienmes qu epasar un amensaje con los cambnios y or coordinais». Acordado con `powershell-be`: si `CLAUDE_CODE_TMPDIR` ya viene en el entorno, `start-kit-session.mjs` la respeta, y solo la fija a `<raíz del worktree>/.temp` cuando falta; `Find-KitScript` busca por raíz (worktree, después clon principal), `.mjs` antes que `.ps1`, y lo implementa al fusionarse la 0228 en `develop`.

## Intent

Tras la 0226 y la 0227 no queda ningún Pester, pero el repo sigue atado a PowerShell: el arranque de sesión es un `.ps1`, el hook `SessionStart` llama a `pwsh`, `moon.yml` y el pre-commit corren `Invoke-KitTests.ps1` sobre cero ficheros, y dos tests de `cli/test/kit/` lanzan `pwsh`. A la vez, en el cierre de la 0227 cada tarea lenta pidió el cerrojo por su cuenta y otra rama se colaba entre tarea y tarea: `kit:test` 29 min 19 s de reloj para 31 s de tests, `kit:test-headless` 52 min 22 s para 739,5 s, ~2 h de cierre esperando ([ticket de la 0227](../../field-reports/20261027-160700-feature-0227-behavior-tests-to-vitest.md) §1). Éxito: `moon run cli:typecheck cli:test kit:roadmap` y el hook corren en una máquina sin `pwsh`; dos gates a la vez se ejecutan uno detrás de otro, enteros, y el que espera sabe su puesto. Fracaso aunque funcione: una TUI que pierde Ctrl+C o las flechas, o un gate que se queda esperando a su propio cerrojo.

## Scope

- Entra: `start-kit-session.mjs` (nuevo) y fuera `Start-KitSession.ps1`; `.claude/hooks/kit-session-source.mjs` (nuevo) y fuera `Test-KitSessionSource.ps1`; `.claude/settings.json`; `moon.yml`; `.githooks/pre-commit`; fuera `tests/Invoke-KitTests.ps1`; `cli/src/lock/verbs.ts` y `cli/src/git/lock.ts` (turno anidado y cola); `cli/test/lock/run.slow.test.ts`; `cli/test/kit/kit-session-source.slow.test.ts`; `cli/test/kit/headless/campaign.ts`; `.docs/sdd/capabilities/cli.md` (vía el delta, al cerrar); `CLAUDE.md`; `.docs/sdd/tech-stack.md`; `.docs/sdd/architecture.md`; `README.md`.
- No entra: lo que la decisión 11 deja con PowerShell; los cerrojos de `sdd merge` y de ids; `Select-Claude.ps1` (fuera del repo, lo hace su sesión); hacer más rápida ninguna suite.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `Start-KitSession.ps1` → `start-kit-session.mjs` | `CLAUDE.md:3`, `:30`; `README.md:151-152`; `tech-stack.md:152`; `.claude/hooks/Test-KitSessionSource.ps1` (textos); `cli/test/kit/kit-session-source.slow.test.ts` | Scope · decisiones 8, 9 y 12 |
| `.claude/hooks/Test-KitSessionSource.ps1` → `kit-session-source.mjs` | `.claude/settings.json:24`; `architecture.md:33`; `cli/test/kit/kit-session-source.slow.test.ts` | Scope · decisión 9 |
| `tests/Invoke-KitTests.ps1` | `moon.yml:5`, `:11`; `capabilities/cli.md:167`; `tech-stack.md:65` | Scope · delta `MODIFIED` · decisión 7 |
| `kit:test`, `kit:test-fast` | `moon.yml`; `.githooks/pre-commit`; `tech-stack.md:6`, `:8`, `:32`; `README.md:162`, `:165` | Scope · decisiones 6 y 7 |
| «los Pester que quedan» | `CLAUDE.md:23`; `tech-stack.md:6`, `:215`; `README.md:159` | Scope · decisión 12 |
| `pwsh` en `stopPort` | `cli/test/kit/headless/campaign.ts:165` | Scope · decisión 10 |
| `language: powershell` | `moon.yml:1` | Scope · decisión 7 |
| `SUITE_LOCK_TIMEOUT_MINUTES = 60` → 180 | `cli/src/lock/verbs.ts:9` | Scope · decisión 5 |
| Gate de cierre | `tech-stack.md:32` | Scope · decisión 6 |

- Filas que implementa: 0228 → `roadmap.md` (fila de «Próximo»; la cierra `sdd-archive`); «El cerrojo de suites hace cola entre ramas que cierran a la vez y los gates se van a horas» y «`merge/cleanup.slow.test.ts` falla a ratos con la máquina cargada» → `roadmap.md` «Deuda técnica», se marcan al cerrar (la segunda, saldada solo si el gate de cierre no la repite). Comprobado con `git grep -n '0228\|cerrojo de suites hace cola\|cleanup.slow'` en `.docs/sdd/`, `skills/` y `capabilities/`: sin más hits fuera del roadmap y las specs.

## Approach

El arranque y el hook se reescriben en Node con la misma conducta y los mismos textos (salvo el nombre del script). `sdd lock run` gana dos cosas: reconoce que su padre ya tiene el cerrojo (variable heredada contrastada con el PID del fichero del cerrojo) y, si lo tiene otro, espera en una cola por orden de llegada que imprime el puesto. Con eso el gate se envuelve en un solo `sdd lock run` sin quitar el de cada tarea lenta. Las tareas de moon que solo corrían Pester salen, y los dos tests que lanzaban `pwsh` usan Node. Por último, los documentos dicen lo nuevo.

## Dónde se prueba

- Turno anidado y cola de `sdd lock run`: `cli/test/lock/run.slow.test.ts`, con procesos reales de `sdd lock run` en un repo temporal, como sus tests actuales.
- Hook de sesión: `cli/test/kit/kit-session-source.slow.test.ts`, lanzando el `.mjs` con `node` y las mismas aserciones que hoy.
- Arranque: el mismo fichero, con un `claude` falso en el `PATH` (un `.cmd` o un ejecutable de Node) que escribe las variables y los argumentos que recibe; la TUI (modo raw y Ctrl+C), a mano en un terminal de Orca, registrado en el walkthrough.
- `settings.json` llama al hook con `node`: el mismo fichero, como su test actual de `settings.json`.
- `stopPort`: `cli/test/kit/headless/` (los tests que ya lo usan) en `kit:test-headless`.
- Sin `pwsh`: `moon run cli:typecheck cli:test kit:roadmap` con un `PATH` sin `pwsh`, a mano, registrado en el walkthrough.
- Gate en un turno: dos gates reales a la vez en dos worktrees del clon, mirando que el segundo imprime su puesto y no arranca hasta que el primero acaba; en la validación de la feature.

## Términos y ADR

- Términos resueltos: turno del gate — el cerrojo de suites cogido una vez por el `sdd lock run` que envuelve el gate entero; cola del cerrojo — las esperas en orden de llegada.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `cli`

**MODIFIED — `sdd lock run` corre un comando con el cerrojo de las suites del clon** (antes: el WHEN lanzaba `tests/Invoke-KitTests.ps1`, y el aviso no decía el puesto)

- GIVEN el worktree de `feature/0210` con `sdd lock run -- pnpm exec vitest run slow.test` en marcha desde las 19:30:00 del 2026-10-25
- WHEN otro worktree del mismo clon lanza `sdd lock run -- pnpm exec vitest run test/kit/headless`
- THEN el segundo escribe «Esperando el cerrojo de suites: vas 1.º en la cola; lo tiene feature/0210 (D:\code\sdd-kit-0210, PID 4120) desde 2026-10-25 19:30:00.» y no arranca su comando hasta que acaba el primero
- AND `sdd lock run` sale con el código del comando

**ADDED — Un `sdd lock run` dentro de otro no vuelve a pedir el cerrojo**

- GIVEN `sdd lock run -- moon run kit:test-headless cli:test-min` en marcha en `feature/0228`, con el cerrojo de suites cogido por su PID 7100
- WHEN `kit:test-headless`, hijo de ese proceso, lanza `sdd lock run -- pnpm --dir cli exec vitest run test/kit/headless`
- THEN el comando arranca sin esperar ni escribir «Esperando el cerrojo», y el cerrojo sigue siendo del PID 7100 hasta que acaba el `moon run` entero
- AND un `sdd lock run` con `SDD_SUITE_LOCK_OWNER=7100` heredado cuando el cerrojo lo tiene otro PID, o cuando no lo tiene nadie, lo pide como cualquier otro

**ADDED — La espera del cerrojo de suites va por orden de llegada y dice el puesto**

- GIVEN `feature/0210` con el cerrojo de suites desde las 17:05:12 del 2026-10-27, y `feature/0211` esperándolo desde las 17:06:00
- WHEN `feature/0212` lanza `sdd lock run` a las 17:07:00
- THEN escribe «Esperando el cerrojo de suites: vas 2.º en la cola; lo tiene feature/0210 (D:\code\sdd-kit-0210, PID 4120) desde 2026-10-27 17:05:12; delante de ti, feature/0211 (D:\code\sdd-kit-0211, PID 5332).»
- AND al soltarlo la 0210 a las 17:31:40, lo coge la 0211 aunque la 0212 sondee antes, y la 0212 escribe «Esperando el cerrojo de suites: vas 1.º en la cola; lo tiene feature/0211 (D:\code\sdd-kit-0211, PID 5332) desde 2026-10-27 17:31:40.»
- AND una espera cuyo proceso muere sale de la cola, y quien iba detrás sube de puesto

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `.docs/sdd/tech-stack.md` | 19699 / 24579 (19663 × 1,25) | 4880 | sin cambio |
| `.docs/sdd/architecture.md` | 1900 / 2375 (1900 × 1,25) | 475 | sin cambio |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-27 | aprobada (opción «Apruebo») |
