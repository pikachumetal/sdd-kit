---
id: 20261026-170842-feature-0227-behavior-tests-to-vitest
feature: 0227
proposal: 0225
title: Conducta a Vitest: el lanzador de sujetos, los hooks y git
mode: full
status: approved
created: 2026-10-26
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-26
---

# Spec — Conducta a Vitest: el lanzador de sujetos, los hooks y git

🦆 Hoy, los tests que arrancan procesos de verdad (el lanzador de sujetos, el hook que deniega matar por nombre, la vigilancia de fuentes, el hook de sesión del repo) son Pester y necesitan PowerShell. Tras esta feature son Vitest, en `cli/test/kit/`, y prueban lo mismo caso por caso. Por ejemplo, `DRY_RUN=1 bash tests/headless/run.sh` con `RUNS_DIR` bajo `.temp/` sigue sin abortar, y `taskkill //F //IM node.exe` sigue denegado. Los del lanzador siguen corriendo solo cuando cambia `tests/headless/`, ahora con `vitest` en vez de Pester. En `tests/` no queda ningún Pester de conducta ni los dos helpers de PowerShell que los servían.

## Capacidades

- Ninguna, porque es herramientas: la forma de probar este repo, no el comportamiento del kit en los proyectos (propuesta 0225, «Capacidades que toca»).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: ninguna de la rúbrica (sin capacidad, sin delta, sin contrato público, sin datos, sin dependencia nueva; todo lo que toca está leído en esta sesión) · tamaño: ~1.900 líneas Pester portadas en ~12 ficheros, más ~15 líneas de `moon.yml`, `cli/moon.yml` y `tech-stack.md`
- Mínimo razonable: ninguna — lo que deja sin cubrir (que un caso portado pruebe menos que el Pester) lo cubre la tabla caso a caso del plan y la revisión final de rama, no una review de la spec.

`sdd capability merge` sobre una copia de `.docs/sdd`: «Sin delta que fusionar», exit 0.

1. **Qué ficheros son de conducta (10)**: `HeadlessLauncher`, `Battery`, `SubjectOutputPrivacy`, `UpstreamWatch`, `DenyKillHook`, `Hook`, `KitSessionSource`, `Clear-GitEnv`, `TempDir` y `FastSuiteBudget`. Es la misma lista que la spec de la 0226 deja fuera de su alcance (su decisión 14). `PathLength` lo lleva la 0226 (su tabla del Approach, «Útiles enteros»), así que aquí no entra.
2. **Se portan caso a caso**, con el mismo nombre en castellano, la misma fixture y la misma aserción, salvo los tres casos de las decisiones 9 y 10, que se retiran con su motivo. El plan lleva la tabla `It` de Pester → `it` de Vitest; un caso sin fila es un caso perdido.
3. **Carpetas**: `cli/test/kit/headless/` para los del lanzador que hoy corre `kit:test-headless` (`HeadlessLauncher` y `Battery`), y `cli/test/kit/` para el resto. Todos los que lanzan procesos son `*.slow.test.ts`. La excepción es el control del commit de `SubjectOutputPrivacy` («La evidencia que lleva el commit no tiene el home de la máquina»), que hoy no es `Slow` y frena el commit: sigue en el conjunto rápido, como `*.test.ts`. Así lo pide la regla del patch 0176 en `tech-stack.md` («deja en el rápido un control de lo que el commit lleva»).
4. **`HeadlessLauncher` se parte por temas** (69 `It`, 921 líneas) en 5-6 ficheros: ensayo en seco y salidas, settings y aislamiento, puertos, topes y cerrojos, limpieza y rutas, y `lib.sh` (turnos y marcador). Vitest corre los ficheros en paralelo y los tests de un fichero en serie ([Vitest, Parallelism](https://vitest.dev/guide/parallelism)). Los helpers comunes (la campaña mínima, el claude falso, lanzar la campaña) van en un `.ts` de esa carpeta. El reparto exacto es del plan.
5. **Entorno por llamada, nunca global**: cada `spawn` recibe su `env` (el claude falso en el `PATH` del hijo, `USERPROFILE`/`HOME` de Alice, `DRY_RUN`, `SPEC_DIR`…), y ningún test muta `process.env` salvo el que prueba que `git()` ignora las variables de git (decisión 8), que las repone. El Pester las ponía en el proceso y las restauraba; con Vitest eso impediría correr casos a la vez. Es la técnica habitual de stub por `PATH` ([How to mock in Bash tests](https://advancedweb.hu/how-to-mock-in-bash-tests)).
6. **`tests/Resolve-Bash.ps1` → `resolveBash()` en `cli/test/kit/bash.ts`**: prefiere `%ProgramFiles%\Git\bin\bash.exe`, después `%ProgramFiles(x86)%\Git\bin\bash.exe`, y después el `bash` del `PATH` si no está en `System32`; fuera de Windows, `bash`. La misma regla que el `.ps1` y que `tech-stack.md` §«En Windows, `bash` del PATH es el lanzador de WSL».
7. **`tests/Clear-GitEnv.ps1` → el `env` limpio que ya usan los tests de la CLI** (`cleanEnv` de `cli/test/ids/helpers.ts` y `cli/test/merge/helpers.ts`, e `isolatedEnv` de `cli/src/git/git.ts`). No se escribe un helper nuevo si uno de esos sirve; el plan elige cuál se importa.
8. **`Clear-GitEnv.Tests.ps1` se porta en dos partes**: (a) los cinco casos del helper pasan a un test de que `git()` y `gitSync()` de `cli/src/git/git.ts` no heredan `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE`, `GIT_COMMON_DIR` ni `GIT_OBJECT_DIRECTORY` (con `GIT_DIR` apuntando a otro repo, `rev-parse --show-toplevel` da el del `cwd`); (b) la regla «cada test que llama a git limpia las variables» pasa a `cli/test/`: toda llamada directa a git en `cli/test/**/*.ts` (`spawnSync('git'`, `spawn('git'`, `execFileSync('git'`, `execFile('git'`) pasa un `env` en sus opciones. Hoy la incumplen `cli/test/merge/histogram.slow.test.ts:30-31` y `cli/test/merge/sync.slow.test.ts:96`: se arreglan aquí, con su `cleanEnv`. La forma de reconocer la llamada (texto o AST de TypeScript) es del plan.
9. **`TempDir.Tests.ps1`**: sus dos casos de la carpeta temporal («TEMP cuelga de .temp», «git no sube del TestDrive») prueban `Invoke-KitTests.ps1`, y para Vitest ya los prueba `cli/test/temp-dir.test.ts` («tmpdir lives in the run folder under .temp», «git does not climb into .temp»): se retiran sin portar. El tercero («lanza claude con `CLAUDE_CODE_TMPDIR` en `.temp/` y restaura el valor anterior») se porta junto a los de `Start-KitSession.ps1` de `KitSessionSource`: corre el script con `pwsh` y un `claude` falso en el `PATH` que escribe la variable que ve.
10. **`FastSuiteBudget.Tests.ps1` se retira sin portar**: mide que el conjunto rápido de Pester no pase de 30 s, y cuando cierren la 0226 y esta no queda conjunto rápido de Pester. El conjunto rápido de Vitest (`cli:test`) no tiene tope hoy; ponérselo es una regla nueva y no entra.
11. **`KitSessionSource` y `Hook` se portan tal cual**, también los casos que leen ficheros (`Start-KitSession.ps1` exporta la variable antes de `claude`, `.claude/settings.json` llama a `pwsh`, `hooks/hooks.json` en forma exec, `.githooks/pre-merge-commit` delega en `pre-commit`). La 0228 cambia esos ficheros y sus tests a la vez; borrarlos aquí dejaría el hook de sesión sin test hasta entonces. El hook `Test-KitSessionSource.ps1` se sigue lanzando con `pwsh` desde Vitest.
12. **`moon.yml`, solo `kit:test-headless`**: pasa a `node cli/bin/sdd.js lock run -- pnpm --dir cli exec vitest run test/kit/headless --test-timeout 120000 --maxWorkers 8`, con los mismos `inputs` de hoy salvo los `.ps1` que desaparecen, que cambian por `/cli/test/kit/headless/**`. El comentario de `kit:test` que nombra `FastSuiteBudget` dice «el conjunto rápido» en su lugar. `kit:test` y `kit:test-fast` no se tocan: siguen con `pwsh` hasta la 0228.
13. **`cli/moon.yml`**: `cli:test-slow` y `cli:test-min` excluyen `test/kit/headless/**`; `testInputs` gana `/tests/**` (los scripts que prueban `cli/test/kit/` y la evidencia del control del commit), `/hooks/**`, `/.githooks/**`, `/.claude/**` y `/Start-KitSession.ps1`. La 0226 añade a la misma línea `/README.md`, `/.claude-plugin/**`, `/agents/**`, `/.docs/**` y `/tests/**` (su decisión 3): el cierre que llegue segundo junta las dos listas.
14. **`tests/Invoke-KitTests.ps1`**: sale el parámetro `-Headless` y la lista `$headlessTests`, que nombran ficheros que ya no existen. El fichero sigue para `kit:test` y `kit:test-fast` hasta la 0228.
15. **Los dos helpers `.ps1` se borran si nadie los usa al cerrar**: con la 0226 cerrada antes, `git grep -l 'Clear-GitEnv.ps1\|Resolve-Bash.ps1' -- tests` sale vacío y se borran aquí. Si esta cierra antes, los usan aún `VerifySkill`, `PlanEntry`, `PathLength`, `FeatureRename` y `DispatchBrief`, que son de la 0226: se quedan, y la fila 0228 gana «borrar `tests/Clear-GitEnv.ps1` y `tests/Resolve-Bash.ps1`».
16. **`tech-stack.md`, solo líneas de estado**: la 6 (`kit:test-headless` corre los Vitest de `cli/test/kit/headless/`), la 8 (`-Tag 'Slow'` y `FastSuiteBudget` salen de la regla de lentos), la 38 (`resolveBash()` en vez de `tests/Resolve-Bash.ps1`) y la 42 (los tests pasan un `env` limpio en vez de `tests/Clear-GitEnv.ps1`). Las 65, 209 y 218 son aprendizajes cronológicos que nombran los Pester como historia: no se tocan, como decidió la 0226. `architecture.md` no se toca: la 0226 ya describe `cli/test/kit/`.
17. **Medida**: el plan mide `moon run kit:test-headless` en Pester antes de la Task 1 y en Vitest al final, y el walkthrough da las dos cifras. Sin umbral; si sale más lento, se dice.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo previstos · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Los Pester que lanzan procesos pasan a Vitest en `cli/test/kit/` como `*.slow.test.ts`, conservando lo que prueban; `tests/Clear-GitEnv.ps1` y `tests/Resolve-Bash.ps1` pasan a sus equivalentes en Node; los de frases y anatomía son de la 0226 — prompt de arranque, 2026-10-26
- Esta feature toca `moon.yml` (`kit:test-headless`) y `cli/moon.yml`, aunque el prompt reservaba `moon.yml` a la 0228, para conservar el «solo cuando cambia» de la 0223 y no dejar el lanzador sin test en el gate — «1», 2026-10-26
- El método de los tests lo decide el agente — «al final esta parte, a mi s eme escapa un poco. tu seguramente puedes encontrar mes informacion sobre test y como aplicarlos que yo... en general veo bien lo que me propones», y «buesaca en internet mejores practicas y tal», 2026-10-26

## Intent

Hoy, 10 ficheros Pester prueban conducta de verdad: lanzan `bash`, `git` y `node` sobre el lanzador de sujetos, los hooks y la vigilancia de fuentes. Son lo que impide quitar PowerShell del repo (propuesta 0225), y `HeadlessLauncher` solo tarda ~600 s porque Pester corre sus 69 casos en serie. Éxito: tras la feature, `tests/` no tiene ningún Pester de conducta, cada caso tiene su `it` en Vitest con la misma aserción, `kit:test-headless` sigue corriendo solo cuando cambia el lanzador y el control del commit de privacidad sigue parando el commit. Fracaso aunque funcione: que un caso se pierda o pruebe menos al portarlo, que el gate deje de correr los tests del lanzador cuando cambia `tests/headless/`, o que los ~600 s vuelvan al gate en cada cambio de la CLI.

## Scope

- Entra: portar los 10 Pester de conducta (decisión 1) a `cli/test/kit/` y `cli/test/kit/headless/`; `resolveBash()`; la regla de git en `cli/test/` y arreglar sus dos incumplimientos; `kit:test-headless` en `moon.yml`; `cli/moon.yml`; `-Headless` de `tests/Invoke-KitTests.ps1`; las líneas de estado de `tech-stack.md`; borrar los `.ps1` portados y los dos helpers si nadie los usa (decisión 15); la fila 0228 si los helpers se quedan.
- No entra: los Pester de frases y anatomía (`PathLength` incluido) y `architecture.md` (0226); `kit:test`, `kit:test-fast`, `.githooks/`, `Start-KitSession.ps1`, `.claude/hooks/Test-KitSessionSource.ps1` y `.claude/settings.json` (0228); los scripts que se prueban (`tests/headless/`, `tests/upstream/check.ts`); un tope de tiempo para `cli:test` (decisión 10); los aprendizajes de `tech-stack.md`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `tests/HeadlessLauncher.Tests.ps1`, `tests/Battery.Tests.ps1` | `moon.yml:24-25` (inputs de `kit:test-headless`), `tests/Invoke-KitTests.ps1:6`, `tech-stack.md:6` | decisiones 12, 14 y 16 |
| `tests/Resolve-Bash.ps1`, `tests/Clear-GitEnv.ps1` | `moon.yml:27-28`, `tech-stack.md:38,42`, cinco Pester de la 0226 | decisiones 12, 15 y 16 |
| `tests/FastSuiteBudget.Tests.ps1`, `-Tag 'Slow'` | `moon.yml:16` (comentario), `tech-stack.md:8` | decisiones 10, 12 y 16 |
| `tests/SubjectOutputPrivacy.Tests.ps1`, `tests/DenyKillHook.Tests.ps1`, `tests/TempDir.Tests.ps1` | `tech-stack.md:65,209,218` | aprendizajes cronológicos: no se tocan (decisión 16) |
| `tests/UpstreamWatch`, `Clear-GitEnv`, `Hook`, `KitSessionSource` `.Tests.ps1` | ninguna fuera de `tests/` (`git grep` en `skills/`, `capabilities/`, documentos, `moon.yml`, `cli/`, `.claude/`, `.githooks/`) | se borran con su port |

- Filas que implementa: 0227 → `roadmap.md` (fila propia, y las filas 0216 y 0224, que van «tras 0227»: no cambian); propuesta 0225 (su reparto) → nada que cambiar. Comprobado con `git grep -n 0227 -- .docs skills`.

## Approach

Se porta cada fichero Pester a Vitest caso a caso, con la tabla del plan como contrato, y se borra el `.ps1` en la misma task que su port, cuando el port pasa. Los tests lanzan los mismos procesos que hoy (`bash`, `git`, `node`, `pwsh` para los dos scripts de PowerShell que siguen hasta la 0228), con el entorno por llamada. El lanzador va en su carpeta para que `kit:test-headless` lo corra aparte, como hoy, y quede fuera de `cli:test-slow` y `cli:test-min`.

## Dónde se prueba

- Cada caso portado: su `it` en `cli/test/kit/`, con la tabla `It` → `it` del plan, y en verde con `pnpm --dir cli exec vitest run test/kit`.
- Que el lanzador corre solo cuando cambia: `moon run kit:test-headless --affected --base develop` corre la tarea en esta rama (cambia `cli/test/kit/headless/`), y la salta en un worktree desechable de `develop` con un cambio solo en `skills/`.
- Que `cli:test-slow` y `cli:test-min` no corren el lanzador: su salida no lista `test/kit/headless/`.
- Que el control de privacidad sigue en el commit: `moon run cli:test` lista `subject-output-privacy` (el fichero rápido) y no sale de la caché tras tocar solo un fichero de `tests/`.
- La regla de git: un caso con un fichero de fixture que llama a `spawnSync('git', …)` sin `env` la hace fallar, y `cli/test/` entero la pasa.
- La medida: `moon run kit:test-headless` antes y después, en el walkthrough.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna (la regla que sustituye a la de la ADR 0011 sobre los Pester la escribe la 0226)

## Delta de comportamiento

Sin delta: no cambia comportamiento observable del kit.

## Topes de palabras

Medido con el conteo de `tests/WordBudget.Tests.ps1` (`-split '\s+'`), 2026-10-26. Las cuatro líneas de la decisión 16 se reescriben sin crecer: la 8 pierde la frase de `FastSuiteBudget`.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `.docs/sdd/tech-stack.md` | 19.652 / 19.663 | 11 | sin cambio |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-26 | aprobada (opción «Apruebo») |
