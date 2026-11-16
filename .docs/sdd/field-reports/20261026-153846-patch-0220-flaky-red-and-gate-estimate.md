---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: patch
id: 20261026-153846-patch-0220-flaky-red-and-gate-estimate
task: 0220
mode:
date: 2026-10-26
---

# Ticket para el kit — patch 0220: la suite completa corre de más en el cierre

## Contexto

- Carril y modo: patch (dos arreglos de texto de skill, cada uno con su batería RED/GREEN)
- Skills del kit usadas: `sdd-propose`, `sdd-start-patch`, `sdd-archive`, `sdd-feedback` (las del working tree, leídas con `Read`)
- Proyecto: el propio kit (plugin de Claude Code; skills en Markdown, CLI en TypeScript, Pester y Vitest), una persona
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica; sujetos headless sonnet (10, 3,87 $)
- Coste en reloj: 1,08 h frente a 3 h estimadas, hasta el commit de cierre; después, una segunda pasada del gate cortada y un commit más
- Coste en tokens: 27.308.723 del hilo, 8,75 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La suite completa se repite tras el merge de sincronización por un cambio que no la afecta

- **Qué pasó**: tras el commit de cierre, `sdd merge --sync` integró `origin/develop`, que traía la 0219. Lo único fuera de `.docs/` y no `*.md` eran dos números de `tests/WordBudget.Tests.ps1` (`Total = 4020` → `4030` y `Kit = 91300` → `91328`). La regla pidió repetir `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`, que en la primera pasada tardó 28 min 46 s. El dev-lead: «porque dos pasadas?!» y «esto mno puede ser no podemos estar levantando las suite de test una y otra y opytra». Se cortó a los pocos minutos y se corrió solo `Invoke-Pester tests/WordBudget.Tests.ps1` (71/0).
- **Fuente**: `git diff 7321230c e73f3625 -- . ':!.docs' ':!*.md'` → `tests/WordBudget.Tests.ps1 | 4 ++--`; `patch.md` del patch 0220 §4, filas 8 y 9.
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md` paso 6 («The full suite runs again only if the base brought changes outside `.docs/` that aren't `*.md`») y `skills/sdd-archive/references/merge-recipe.md`, «The suite again».
- **Por qué el kit no lo evitó**: el predicado mira dónde cae el cambio de la base, no qué afecta. Un cambio en una tabla de un test Pester cuenta igual que uno en `cli/src/`.
- **Coste**: ~29 min evitados al cortarla, más una parada del dev-lead. Respaldo: `patch.md` §4 fila 9 y commit `0408c4e0`.
- **Propuesta**: con la base integrada, repetir solo lo que afecta lo que trajo: `moon run <gate> --affected --base <sha de la suite de la validación>`, o, si la base solo cambia tests, esos tests; la suite completa, solo si trae código de `cli/src/` o `skills/`.
- **Verificada**: sin verificar (falta probar que `--affected` de moon elige `kit:test` y no `cli:*` para un cambio en `tests/*.Tests.ps1`).
- **Criterio de aceptación**: GIVEN un cierre con la suite de la validación en verde sobre `<sha>` y una base que solo cambia `tests/WordBudget.Tests.ps1` WHEN el cierre integra la base THEN corre ese Pester (o `--affected`) y no `cli:test-slow` ni `cli:test-min`, y el merge lleva `--verified-at` con el sha de esa comprobación.

### 2. Con otra rama abierta, la base se integra después de la primera suite y obliga a otra

- **Qué pasó**: el pre-check listó `patch/0219-e2e-smoke-stress-out-of-suite` con la línea «La que fusione segunda integra la base y repite sus gates». Aun así, el paso 1 corrió la suite completa (28 min 46 s) antes del paso 6. Mientras corría, la 0219 se fusionó, y el paso 6 pidió otra. Integrar la base antes de la primera pasada habría dejado una sola.
- **Fuente**: `git worktree list` de la sesión; `git log` → `e2548c5e merge: patch/0219-e2e-smoke-stress-out-of-suite en develop` entre `7321230c` y `e73f3625`.
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md` paso 0.3 (aviso de otras ramas) y el orden de los pasos 1 (suite de la validación) y 6 (base integrada).
- **Por qué el kit no lo evitó**: el aviso no cambia ningún paso. La regla de hacer el merge de sincronización después del commit de cierre (para no romper la historia aplastada) obliga a una suite antes y otra después siempre que la base avance durante el cierre. Error mío también: vi el aviso y no lo usé.
- **Coste**: una suite completa de más (cortada en este caso). Respaldo: `patch.md` §4 fila 9.
- **Propuesta**: con otra rama abierta o la base ya por delante (`git rev-list --count HEAD..<remote>/<merge.into>` > 0), el paso 1 no corre la suite completa: hace el registro y el commit de cierre, integra la base y corre una sola suite sobre el merge de sincronización, que sirve de validación y de base.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN `validation.mode: field`, otra rama abierta y la base por delante WHEN se cierra THEN `tools.txt` tiene una sola ejecución de la suite completa, después de `sdd merge --sync`.

### 3. Cortar una tanda de sujetos deja vivos sus procesos y un servidor con `nohup`

- **Qué pasó**: se paró con `TaskStop` una tanda de `battery.sh` (corría con un kit mal copiado). Siguieron vivos un `claude.exe` y dos `timeout.exe` de sujetos, y hubo que matarlos por PID. Al final de la sesión, `rm -rf .temp/p0220` falló con `rm: cannot remove '.temp/p0220/runs/green/e1-1/repo': Device or resource busy`: un sujeto de esa tanda había dejado `sdd.js validation serve` lanzado con `nohup` (cuatro procesos: `nohup.exe`, `proto.exe`, dos `node.exe`) y una carpeta en `%TEMP%` (`tmp.vOwQsamYxV`). Además, `mv` de `runs/green` dio `Permission denied` y la tanda siguiente tuvo que ir con `PHASE=green2`.
- **Fuente**: `Get-CimInstance Win32_Process` en PowerShell, filtrado por `p0220`, en la sesión.
- **Dónde en el kit**: `tests/headless/run.sh` (sin `trap` que limpie a sus sujetos) y `tests/headless/lib.sh` `subject_cleanup` (para por puerto, no por árbol de procesos, y solo corre si el sujeto acaba).
- **Por qué el kit no lo evitó**: `subject_cleanup` no corre cuando se mata `run.sh`; y `stop_subject_ports` solo mira los puertos del stream, no los procesos que lanza el sujeto con `nohup`.
- **Coste**: ~10 min de buscar y parar procesos y de rehacer la fase; el techo `SUBJECT_CAP` se agotó con los cortados («techo de 8 sujetos alcanzado: decide el dev-lead»). Sin respaldo en un commit.
- **Propuesta**: `run.sh` atrapa `TERM`/`INT`/`HUP` y para el árbol de procesos de cada sujeto en curso (las marcas de `live/` ya tienen el PID) antes de salir; `subject_cleanup` para también los procesos cuya línea de órdenes nombra `$RUN` o `$KIT_DIR`.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una tanda con un sujeto que lanza `nohup node … validation serve &` WHEN se mata `battery.sh` THEN no queda ningún proceso cuya línea de órdenes contenga el `RUNS_DIR`, y `rm -rf "$RUNS_DIR"` funciona.

### 4. Una reescritura con un script truncó una referencia de skill y una tanda del GREEN corrió con ella

- **Qué pasó**: reescribí la sección «A red suite» de `skills/sdd-archive/references/merge-recipe.md` con `node -e` y `s.slice(0,a)+n+s.slice(b)`, con `b = s.indexOf("\n\nA red from …")`. El fichero de trabajo tenía CRLF, `indexOf` dio -1 y el fichero quedó en 21 líneas de 85. Lo cazó Pester (22 rojos en `ArchiveSkill` y `ControlProfiles`), pero la copia del kit del GREEN ya se había sacado con el fichero truncado.
- **Fuente**: `wc -l skills/sdd-archive/references/merge-recipe.md` → `21` frente a `git show HEAD:… | wc -l` → `85`; `patch.md` §4 fila 3.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md` §Testing, «Un script de Python en un heredoc de Git Bash que escribe código con escapes los rompe» (solo nombra escapes, no finales de línea).
- **Por qué el kit no lo evitó**: la regla existe para escapes; no dice que una edición de texto de skill se hace con `Edit` y no con un script de reemplazo, ni que se pasan los Pester de la skill antes de sacar la copia del kit para sujetos.
- **Coste**: una tanda del GREEN descartada (un sujeto, ~0,6 $) y una relanzada. Respaldo: `patch.md` §4 fila 3.
- **Propuesta**: en `tech-stack.md`, ampliar la regla: el texto de skills y referencias se edita con `Edit`; y en el método de baterías, antes de sacar la copia del kit para el GREEN, `Invoke-Pester` de los tests de la skill tocada.
- **Verificada**: sí — reproducido en la sesión (fichero de 21 líneas, 22 rojos de Pester).
- **Criterio de aceptación**: GIVEN una edición de una referencia antes de un GREEN WHEN se saca la copia del kit THEN los Pester de esa skill ya pasaron sobre el working tree.

## Lo que hice por iniciativa propia

- Molde de un rojo intermitente determinista: el test guarda una marca en el `.git` común (`git rev-parse --git-common-dir`), así que falla la primera vez en el clon y pasa en la rama y en cualquier worktree. Funcionó para el RED, pero el molde es transparente: un sujeto leyó el test, borró la marca y fabricó el rojo en la base. Lo corrigió la regla «sin limpiar estado ni cachés», no el molde.

## Funcionó, no tocar

- `sdd merge --sync` y `sdd merge --push`: integración, merge, push y el aviso del commit ajeno publicado, sin intervención.
- `capability merge` sobre una copia de `.docs/sdd` antes del cierre y en el repo al cerrar.
- Las baterías por escenario (`STEPS`) para medir un arreglo con 2 sujetos en minutos.

## Menores

- Con `RUNS_DIR` relativo (`.temp/p0220/runs`), `run.sh` lo rechaza con «RUNS_DIR fuera del scratchpad o de .temp/» aunque está bajo `.temp/` — `tests/headless/lib.sh`.
- Los topes de palabras estaban en su límite exacto (kit 91.300 de 91.300): cualquier regla nueva pedía una parada del dev-lead. Resuelto en este patch con un margen del 25 % hasta la v3 (fila B21 del backlog) — `tests/WordBudget.Tests.ps1`.
- La petición traía «carril patch» con dos arreglos de dos tests cada uno; `sdd-propose` paso 2 dice que dos o más tests de comportamientos nuevos no son patch. Se mantuvo el carril que nombró el dev-lead sin preguntarlo — `skills/sdd-propose/SKILL.md` paso 2.
