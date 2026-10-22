---
id: 20261022-083957-feature-0209-worktree-temp
feature: 0209
title: Temporales por worktree
mode: full
profile: delegate
status: approved
created: 2026-10-22
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-22
---

# Spec — Temporales por worktree

🦆 Hoy los tests del kit dejan unas 1.000 carpetas al día en `%TEMP%`, y Claude Code guarda ahí el scratchpad y las salidas en segundo plano de cada sesión, que no borra nunca (hay casos públicos de 107 GB y 537 GB). Con este cambio, cada worktree tiene su `.temp/` en la raíz, ignorada por git: los tests escriben ahí y la vacían al acabar, una sesión arrancada con `Start-KitSession.ps1` guarda ahí sus temporales, y los sujetos headless borran su molde al terminar. Al borrar el worktree, `.temp/` se va con él. Los proyectos que inicializan o migran con el kit ganan `.temp/` en su `.gitignore`, y la init les propone llevar ahí los temporales de cada suite.

## Capacidades

- Modificadas: `cli` — `sdd init --finish` añade `.temp/` al `.gitignore`
- Modificadas: `onboarding` — la init ignora `.temp/`, y la entrevista de Testing apunta dónde deja cada suite sus temporales (`operations.md`, campo «Temporales»)
- Modificadas: `migration` — la migración a v3.0.0 ignora `.temp/` y hace la misma propuesta, también en un proyecto sin E2E

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: dos revisores (dominio Opus, técnica Sonnet), pedidos por el dev-lead · señales: MODIFIED (cinco requisitos vivos), tres capacidades, área no explorada · tamaño: ~170 líneas en ~15 ficheros. Hallazgos al final de este bloque.

1. **Vitest, una carpeta por ejecución**: la config de Vitest crea `.temp/vitest-<aleatorio>` bajo la raíz del repo (la de `git rev-parse --show-toplevel`, en forma absoluta con `/`), la pone en `TEMP` y `TMP` de los workers con `GIT_CEILING_DIRECTORIES=<raíz>/.temp`, y el teardown la borra con 5 reintentos (`EBUSY`/`EPERM` en Windows); si aun así no puede, avisa y no rompe la suite. Al arrancar, borra las `vitest-*` con más de 24 h: una pasada muerta no corre el teardown y el repo principal no se borra nunca. Se borra también cuando la suite sale en rojo: un fixture que hace falta mirar se reproduce con el test solo. Los 25 ficheros con `mkdtemp(tmpdir())` no se tocan. Si los workers no heredan el entorno, el plan cae al `env` de las tareas moon de `cli/moon.yml`, como dice la fila.
2. **Pester, sin borrado por test y con la carpeta compartida**: `kit:test` y `kit:test-fast` llevan `TEMP`, `TMP` y `GIT_CEILING_DIRECTORIES` en `<raíz>/.temp` (por el `env` de su tarea moon si moon sustituye `$workspaceRoot` en `env`; si no, `tests/Invoke-KitTests.ps1` los fija). Su `$TestDrive` cae ahí por el mismo `env`. Dos pasadas a la vez comparten `.temp/`: los Pester ya usan nombres únicos (`$TestDrive`, GUID), y lo que dejen muere con el worktree.
3. **`sdd merge --verify` no cambia**: su log ya se borra en verde, y en rojo se queda porque es la evidencia del fallo; los `sdd-merge-verify-*.log` acumulados venían de los tests, que ahora caen en la carpeta por ejecución.
4. **`run.sh` borra, al acabar cada sujeto, la copia del molde** (`RUNS_DIR/<fase>/<etiqueta>/`) **y su carpeta de Claude Code** en `<CLAUDE_CODE_TMPDIR o %TEMP%>/claude/<nombre de la ruta del molde>`; se quedan `<etiqueta>.jsonl`, `.err` y `.args`, y la conversación de `~/.claude/projects`. La regla del nombre de esa carpeta no está documentada: la sonda de la decisión 6 la mide con la ruta en forma Windows (`cygpath -w`). **Guardas del borrado**: solo bajo `RUNS_DIR/<fase>/<etiqueta>` con etiqueta y fase no vacías, y solo una subcarpeta exacta de `<base>/claude/` cuyo nombre no esté vacío y no sea la de la sesión que lanza la campaña; si una falla, no borra y avisa. Con `KEEP_MOLD=1` no borra el molde, para mirar el disco del sujeto antes del veredicto. Cambia la regla de `tech-stack.md` «las copias por run se quedan en el scratchpad»: se quedan los streams.
5. **La guarda de `RUNS_DIR`** acepta una ruta que contenga `scratchpad` (como hoy) o que cuelgue de `<REPO_ROOT>/.temp/`, con `REPO_ROOT` el que ya calcula `lib.sh` desde su propia ruta; fuera de las dos aborta con `RUNS_DIR fuera del scratchpad o de .temp/: <ruta>`.
6. **Sonda de los sujetos dentro del worktree**: con el scratchpad en `<worktree>/.temp/`, el `cwd` de un sujeto cuelga del repo del kit. Antes de cambiar `Start-KitSession.ps1`, un sujeto Haiku (~0,03 $) lanzado con `lib.sh` desde `.temp/`, con `CLAUDE_CODE_TMPDIR` apuntando ahí, dice qué ve. **Es un desvío y paro** si ve el `CLAUDE.md` del kit, si en el stream sale el hook `SessionStart` o la memoria del repo, o si lista skills distintas de las de la copia del kit y superpowers. La misma sonda mide el nombre de la carpeta de la decisión 4.
7. **`Start-KitSession.ps1`** fija `CLAUDE_CODE_TMPDIR=<raíz del worktree>\.temp` mientras dura la sesión y lo restaura al salir, como ya hace con `SDD_KIT_SESSION_ROOT`; Claude Code crea `claude\` dentro.
8. **El campo «Temporales»** de `## Testing` en `operations-template.md`, fuera del bloque E2E: «dónde deja hoy cada suite sus temporales y, si no es `.temp/`, la propuesta para llevarlos ahí», con el ejemplo `e2e` · `test-results/` · propuesta `outputDir: '.temp/playwright'`. La init y la migración leen el sitio de la config de la suite o, si no lo fija, del valor por defecto de su runner (Playwright: `test-results/`); si ninguno lo dice, el campo dice `no declarado` para esa suite y no proponen nada; con el «no» del usuario, apunta solo el sitio. No editan la config de las suites ni añaden filas al roadmap: lo apuntado en `operations.md` es la propuesta, y moverlo es trabajo del proyecto.
9. **La migración v3.0.0** (sin publicar: `plugin.json` dice 2.3.4) gana un paso: `.temp/` en `.gitignore` si falta, sin duplicar la línea exacta, y crea el fichero si no existe; y la misma pregunta de «Temporales» que la init, desde la misma fila de `sdd-init` (Art. V). Sin el dev-lead, los dos quedan pendientes en el informe, como el resto de la v3.0.0.
10. **`structure.md` de `sdd-init`** lista `.temp/` entre las líneas de `.gitignore`.
11. **Prueba de las skills (Art. I)**: el tramo de la batería de `sdd-init` (`n3` y `n6`, con una fila de rúbrica nueva, T3 «Temporales») y de `sdd-upgrade` (el escenario de v3.0.0 con Playwright, y uno sin E2E). Previsión: RED 4 sujetos, GREEN 8, una vuelta de REFACTOR de 4; techo `SUBJECT_CAP=16`, `COST_CAP=10` $, ~75 min, Sonnet. Pasos nuevos o cambiados de lo que sigue el agente: fila «How it is tested» de `sdd-init/SKILL.md` → `n3`, `n6`; paso de `.gitignore` de `v3.0.0.md` → los dos escenarios de `sdd-upgrade`; pregunta de «Temporales» de `v3.0.0.md` → los mismos; `structure.md` → sin escenario (lista de ficheros que ya lee `n6`).
12. **Una pieza entra, otra sale**: sale la regla «las copias por run se quedan en el scratchpad» de `tech-stack.md`, sustituida por la de la decisión 4, y la frase «aborta si `RUNS_DIR` no está en el scratchpad» se condensa con la decisión 5; nada más se retira, porque la feature añade borrados, no ceremonia.
13. **El prompt para el repo de PowerShell del dev-lead** lo entrego al cerrar, en el formato de rama y prompt: `Select-Claude` fija `CLAUDE_CODE_TMPDIR=<raíz del repo o worktree>\.temp` antes de lanzar, y un hook `SessionEnd` de usuario borra de `<CLAUDE_CODE_TMPDIR>\claude` lo que lleve más de 24 h. No se implementa aquí. Al cerrar también apunto, fuera del kit, que un Dev Drive con el modo rendimiento de Defender es lo que Microsoft recomienda para repos y cachés, por la deuda de los fallos de git con la máquina cargada.
- Delta probado con `sdd capability merge` sobre una copia de `.docs/sdd`: 5 requisitos sustituidos (1 de `cli`, 3 de `onboarding`, 1 de `migration`), 1 añadido y la regla «Dónde viven los datos» de `onboarding` sustituida, exit 0.
- Política de modelos: revisores de la spec, dominio opus y técnica sonnet (hechos) · revisión final en ejes: Spec opus+high, Código sonnet+high · sujetos Sonnet, por tandas de 5 como máximo · la sonda de la decisión 6, Haiku · en paralelo hasta `control.maxParallelAgents` (3)

### Hallazgos de la review

- Técnica 1 (Pester sin `GIT_CEILING_DIRECTORIES`) → aceptado: decisión 2.
- Técnica 2 y dominio 8 (borrado sobre una ruta calculada) → aceptado: guardas y medida en la decisión 4, sonda en la 6, caso `DRY_RUN=1` en «Dónde se prueba».
- Técnica 3 (la sonda solo mira `CLAUDE.md`) → aceptado: decisión 6, con la condición de parada.
- Técnica 4 (borrar en rojo, `EBUSY`) → aceptado en parte: reintentos y aviso sin romper; en rojo también se borra, con el motivo en la decisión 1.
- Técnica 5 (el éxito solo se cuenta a mano; rutas largas) → aceptado: test que falla si `tmpdir()` no cuelga de `.temp/vitest-`, y la ruta más larga de un fixture medida en el walkthrough.
- Técnica 6 (concurrencia) → aceptado: barrido de 24 h en la decisión 1; Pester compartida, declarada en la 2.
- Técnica 7 (forma de la raíz y del techo) → aceptado: decisión 1, y aserción de que `git rev-parse` falla desde un fixture.
- Técnica 8 y dominio 5 (casos sueltos de la migración) → aceptado: ANDs de idempotencia, sin dev-lead y «no»; la v3.0.0 está sin publicar.
- Técnica 9 (decisiones del cuerpo fuera de ✋) → aceptado: decisiones 5 y 7.
- Técnica 10 y dominio 10 (suite desconocida; `TEMP=.temp` no funciona en Windows) → aceptado: `no declarado` sin propuesta, y el ejemplo queda solo `outputDir`.
- Dominio 1 («`## Testing` pasa tal cual» sin E2E) → aceptado: `MODIFIED` de ese requisito.
- Dominio 2 («4 sustituidos» frente a 3 `MODIFIED`) → rechazado: eran 4 (`onboarding` tiene 3); la cuenta nueva, en la línea del merge.
- Dominio 3 y 4 (la fila de `ROADMAP.md` sin id ni gate) → aceptado quitándola: decisión 8, la propuesta vive en «Temporales».
- Dominio 6 (cinco reglas) → aceptado en parte: «Dónde viven los datos» de `onboarding` nombra `.temp/`; el duplicado es la línea exacta, como hoy en `mergeGitignore`; un `.temp/` ya versionado no se avisa, porque ignorar no deja de seguir lo que git ya sigue.
- Dominio 7 (el Intent promete más de lo que da) → aceptado: criterio de éxito acotado.
- Dominio 9 (`$TestDrive` también se muda) → aceptado: decisión 2 y Scope.

### Decisiones tomadas con el dev-lead

- La 0209 se queda entera, con la pieza (e) dentro — «Mantenerla entera»
- Las secciones 1 y 3 del diseño — «Va bien (Recomendada)»
- `CLAUDE_CODE_TMPDIR` en `Start-KitSession.ps1` y, aparte, en `Select-Claude` — «En los dos»
- La conversación de cada sujeto en `~/.claude/projects` no se borra — «No, dejarla»
- El borrado por antigüedad de los temporales de Claude va en `Select-Claude` y los settings de usuario, fuera de la 0209 — «Sí, en Select-Claude/settings de usuario (Recomendada)»
- Review de la spec con dos revisores y búsqueda final en internet — «Has una busqueda ne internet final para ver si hay cosas qu enos hemos dejado que otros solucionan diferente, y dom opus y tec sonnet»

## Intent

El dev-lead se quedó sin `C:` dos días esta semana (~40 GB) y tuvo que mover `%TEMP%` a un disco mecánico, que tumbó el gate. Los tests de la CLI dejan ~1.000 carpetas `sdd-*` al día en `%TEMP%` sin borrarlas, cada sujeto headless deja su molde y su carpeta en `%TEMP%\claude`, y Claude Code no limpia nunca las salidas de sus tareas en segundo plano (issues #35164, #26911, #32964 y #31048 de `anthropics/claude-code`, cerradas sin arreglo). El éxito: tras una pasada del gate de cierre en un worktree, `%TEMP%` no tiene ninguna carpeta `sdd-*` nueva y `<worktree>/.temp/` no tiene carpetas `vitest-*`; desde una sesión de `Start-KitSession.ps1` y sin `KEEP_MOLD`, una campaña de sujetos no deja moldes ni carpetas de Claude en `C:` (sus conversaciones siguen en `~/.claude/projects`, decidido con el dev-lead); y borrar un worktree se lleva sus temporales sin `--force`. Fracasa si el gate pasa a fallar por rutas largas o por fixtures que encuentran el repo del kit.

## Scope

- Entra: `.temp/` en `.gitignore` del kit; config de Vitest con la carpeta por ejecución y el barrido; `env` de las tareas moon de Pester; `tests/headless/run.sh` y `lib.sh` (guarda, borrado del molde y de la carpeta de Claude del sujeto, con sus guardas) y sus casos en `tests/HeadlessLauncher.Tests.ps1`; `Start-KitSession.ps1` con `CLAUDE_CODE_TMPDIR`; `INIT_IGNORES` y sus tests; `sdd-init/SKILL.md` (fila «How it is tested»), `sdd-init/references/structure.md`, `operations-template.md` y `migrations/v3.0.0.md`; las baterías de `sdd-init` y `sdd-upgrade`; `tech-stack.md` (decisiones 4, 5 y la carpeta temporal dentro de un repo); la fila de deuda «Los tests de la CLI dejan sus fixtures en `%TEMP%`», saldada.
- No entra: tocar los 25 `mkdtemp` de los tests ni los `.Tests.ps1` (su `$TestDrive` cae en `.temp/` por el `env`); `verify.ts`; el borrado de `~/.claude/projects`; `Select-Claude` y el hook `SessionEnd` (prompt al cerrar); editar la config de las suites de los proyectos o añadirles filas de roadmap; la deuda «Dos tests lentos ajenos…» (si el `%TEMP%` fuera de Defender la mejora, se apunta, no se salda).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Las copias por run y las transcripciones `stream-json` se quedan en el scratchpad» | `tech-stack.md:52` | decisión 4: se quedan los streams; el molde se borra salvo `KEEP_MOLD=1` |
| «aborta si `RUNS_DIR` no está en el scratchpad» | `tech-stack.md:132`, `tests/headless/run.sh:4,14`, `lib.sh:12,33`, `HeadlessLauncher.Tests.ps1:231-239` | decisión 5, con el mensaje nuevo |
| «La carpeta temporal puede estar dentro de un repositorio git» | `tech-stack.md:65` | Scope: dice que en el kit lo está siempre (`.temp/`) y que Vitest y Pester fijan `GIT_CEILING_DIRECTORIES` |
| Líneas de `.gitignore` de la init | `cli/src/init/gitignore.ts:1`, `capabilities/cli.md:86`, `capabilities/onboarding.md:70`, `sdd-init/references/structure.md:10` | delta `MODIFIED` (`cli`, `onboarding`) y Scope (`structure.md`) |
| Campos de `## Testing` | `operations-template.md:14-19`, `capabilities/onboarding.md:131-134` | delta `MODIFIED` («`operations.md` dice cómo se ejecuta…») |
| «en un proyecto sin E2E la sección `## Testing` pasa tal cual» | `capabilities/migration.md:309` | delta `MODIFIED` («La migración a v3.0.0 propone los campos E2E…») |

- Filas que implementa: 0209 → `.docs/sdd/roadmap.md:8` (Próximo) y las filas 0198 y 0152, que la nombran en su «tras»: el cierre la marca; deuda «Los tests de la CLI dejan sus fixtures en `%TEMP%`» (`roadmap.md:149`) → saldada por el cierre. Comprobado con `grep -rln 0209 skills .docs/sdd/capabilities README.md CLAUDE.md`: nada fuera del roadmap.

## Approach

Una `.temp/` por worktree, ignorada, como único sitio de temporales del repo, y borrado donde hay un dueño claro: la ejecución de Vitest borra su carpeta (y las huérfanas de más de 24 h) y `run.sh` el molde de cada sujeto. Lo demás muere con el worktree (`git worktree remove` sin `--force` lo acepta: probado el 2026-10-22 con un `.temp/` ignorado con contenido, exit 0). Claude Code se mueve con `CLAUDE_CODE_TMPDIR` en el entorno porque en `.claude/settings.json` se ignora (documentación de variables de entorno: «Ignored in project and local settings»). En los proyectos, el kit solo ignora `.temp/` y apunta la propuesta; mover sus suites es trabajo del proyecto.

## Dónde se prueba

- Carpeta por ejecución de Vitest: un test de `cli/test/` que falla si `tmpdir()` no cuelga de `<raíz>/.temp/vitest-`, si `GIT_CEILING_DIRECTORIES` no está fijado, o si `git rev-parse` desde una carpeta de `tmpdir()` encuentra un repo; el borrado y el barrido, contando carpetas `sdd-*` de `%TEMP%` y `vitest-*` de `.temp/` antes y después de `moon run cli:test` (walkthrough), con la ruta más larga de un fixture medida.
- `TEMP` y techo de Pester: un test de `kit:test-fast` que comprueba que `$env:TEMP` cuelga de `<raíz>/.temp` y que `git rev-parse` falla desde `$TestDrive`.
- Guarda y borrado de `run.sh`/`lib.sh`: casos `DRY_RUN=1` en `HeadlessLauncher.Tests.ps1`, como los existentes: borra el molde, conserva el stream, respeta `KEEP_MOLD=1`, y no borra con etiqueta vacía ni fuera de `RUNS_DIR` ni la carpeta `claude/` entera.
- `CLAUDE_CODE_TMPDIR` y sujetos en `.temp/`: la sonda Haiku de la decisión 6 y, en la sesión siguiente arrancada con el script, el `Scratchpad directory` del system prompt dentro de `.temp/` (validación en campo).
- `INIT_IGNORES`: `cli/test/init/`, como los tests actuales de `--finish`.
- Init y migración: el tramo de batería de la decisión 11.

## Términos y ADR

- Términos resueltos: `.temp/` — la carpeta de temporales del worktree, en su raíz, ignorada, que se borra con él
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `cli`

**MODIFIED — `sdd init --finish` escribe lo determinista de la init**

- GIVEN un proyecto sin `.claude/settings.json`, con un `.gitignore` con CRLF que tiene `node_modules/` y `.superpowers/`, y un `sdd-kit.json` en curso con `init.config` = `{"ids":{"mode":"sequence"},"control":{"profile":"delegate"}}`
- WHEN se ejecuta `sdd init --root <raíz> --finish --ignore .auth/`
- THEN `.claude/settings.json` tiene el bloque de la init (memoria desactivada, los dos marketplaces con `autoUpdate: true` y los dos plugins activados), igual al bloque marcado con `<!-- sdd-init: settings -->` del README
- AND `.gitignore` conserva `node_modules/` y `.superpowers/` una vez, gana `.playwright-mcp/`, `.docs/sdd/sdd-kit.local.json`, `.temp/` y `.auth/` con CRLF, y termina en salto de línea
- AND `.docs/sdd/sdd-kit.json` tiene `version` igual a la de `.claude-plugin/plugin.json`, `channel` `plugin`, `updated` del día, `ids.mode` `sequence` y `control.profile` `delegate`, sin `init`, y es el último fichero que se escribe
- AND la salida tiene una línea por fichero con `creado` o `actualizado`, y sale con 0
- AND repetir el mismo comando deja los tres ficheros iguales y dice `sin cambios` en los tres
- AND sin `.gitignore`, lo crea con las líneas de la init
- AND con un `sdd-kit.json` de template que ya tiene `"version": "1.1.0"`, la conserva

### Capacidad: `onboarding`

**MODIFIED — La init deja la memoria automática desactivada y los temporales ignorados**

- GIVEN un `sdd-init` sobre un proyecto cuyo `.claude/settings.json` es `{"permissions": {"allow": ["Bash(npm test)"]}}`
- WHEN ejecuta `sdd init --root <raíz> --finish`
- THEN `.claude/settings.json` conserva `permissions` y gana `"autoMemoryEnabled": false`, `extraKnownMarketplaces.sdd-kit` con la fuente `github` `pikachumetal/sdd-kit` y `extraKnownMarketplaces.superpowers-marketplace` con la fuente `github` `obra/superpowers-marketplace`, los dos con `"autoUpdate": true`, y `enabledPlugins` con `"sdd-kit@sdd-kit": true` y `"superpowers@superpowers-marketplace": true`
- AND `.gitignore` contiene las líneas `.playwright-mcp/`, `.superpowers/`, `.docs/sdd/sdd-kit.local.json` y `.temp/` una sola vez cada una, y cada ruta de `--ignore`
- AND con `"autoMemoryEnabled": true` previo, la salida dice `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia` y el agente pregunta; con su «sí», repite `--finish` con `--memory-off` y la clave queda en `false`; con su «no», se queda en `true` y el resumen de cierre lo anota
- AND si `claude plugin marketplace list` no muestra `superpowers-marketplace`, el agente ejecuta `claude plugin marketplace add obra/superpowers-marketplace`

**MODIFIED — `operations.md` dice cómo se ejecuta y se verifica el proyecto**

- GIVEN `operations-template.md`
- WHEN se lee
- THEN tiene `## Comandos`, `## Testing`, `## Frontend` y `## Entornos`, y no tiene tabla de versiones ni «Decisiones abiertas»
- AND `## Testing` pide cada suite con su comando y su duración, el comando de lo afectado, el gate de cierre y el de merge, cómo entra el agente en la aplicación, si los tests usan el motor de producción y dónde deja cada suite sus temporales
- AND `## Frontend` tiene los campos URL, Detector, Viewports, Runner E2E, Acceso, Temas, Pantalla de referencia y Skills de apoyo
- AND `## Testing`, solo si el proyecto tiene E2E, pide los flujos core con su test, el presupuesto de la suite E2E, los retries, los timeouts, el entorno de la suite y cómo crea y borra cada test sus datos; y cómo entra el agente nombra el usuario del agente, distinto del de la persona que valida

**MODIFIED — La entrevista fija cómo se prueba el proyecto**

- GIVEN una init con código cuyo `package.json` tiene los scripts `test` (`vitest run`) y `e2e` (`playwright test`), y un CI que ejecuta `npm test`
- WHEN genera `operations.md`
- THEN `## Testing` propone las suites `unit` · `npm test` y `e2e` · `npm run e2e`, el gate de cierre y el de merge con esos comandos, y cada duración como `pendiente`
- AND con un `playwright.config.ts` sin `outputDir`, «Temporales» propone `e2e` · `test-results/` · propuesta `outputDir: '.temp/playwright'`, sin editar la config ni añadir filas al roadmap; una suite cuyo sitio no fijan ni su config ni el valor por defecto de su runner sale como `no declarado`, sin propuesta
- AND sin código, pregunta «¿Cómo se prueba?» con la recomendación que sale del stack; con «no sé», cada campo sin respuesta queda `no declarado`

**Reglas de la capacidad**
- **Dónde viven los datos**: el funcional aportado, en `.docs/sdd/sources/`, literal y sin editar. El progreso de una init en curso, en la clave `init` de `.docs/sdd/sdd-kit.json` (`approved` y `config`), que `sdd init --finish` quita. El bloque de `.claude/settings.json` que escribe la init, en una constante de `cli/src/init/`, que el README reproduce. Los temporales del proyecto, en `.temp/` de la raíz, que la init ignora en `.gitignore`.

### Capacidad: `migration`

**MODIFIED — La migración a v3.0.0 propone los campos E2E en un proyecto con E2E**

- GIVEN un proyecto 2.x en 2.3.4 con `playwright.config.ts` (`retries: process.env.CI ? 2 : 0`, `timeout: 60_000`) y `e2e/booking.spec.ts`
- WHEN el dev-lead pide «Actualízame al kit» y aprueba la tabla de operaciones
- THEN `.docs/sdd/steering/operations.md` lleva en `## Testing` los campos E2E de `operations-template.md`, con `Retries: 0 en local; 2 en CI`, `Timeouts: 60 s por test, sin motivo escrito` y `Presupuesto E2E: pendiente`
- AND lleva también «Entorno de la suite» y «Datos», con su valor o `pendiente`
- AND los flujos core son los que el dev-lead nombra entre los candidatos de `e2e/`, y en un proyecto sin E2E la sección `## Testing` pasa tal cual salvo «Temporales»

**ADDED — La migración a v3.0.0 ignora `.temp/` y propone los temporales de las suites**

- GIVEN un proyecto 2.x en 2.3.4 cuyo `.gitignore` no tiene `.temp/`, con `playwright.config.ts` sin `outputDir`
- WHEN el dev-lead pide «Actualízame al kit» y aprueba la tabla de operaciones
- THEN `.gitignore` gana la línea `.temp/` una sola vez, sin tocar las demás
- AND `## Testing` de `.docs/sdd/steering/operations.md` lleva «Temporales» con `e2e` · `test-results/` · propuesta `outputDir: '.temp/playwright'`, sin editar la config de la suite
- AND en un proyecto sin E2E cuyo `package.json` tiene `test` (`vitest run`) sin carpeta de salida en su config, «Temporales» dice `unit` · `no declarado`, sin propuesta
- AND con `.temp/` ya en `.gitignore`, el paso lo dice y no duplica la línea
- AND con el «no» del dev-lead a la propuesta, «Temporales» apunta solo el sitio actual de cada suite
- AND sin el dev-lead, ni `.gitignore` ni «Temporales» cambian, y el informe los deja como pendientes con cómo reanudarlos

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-init`, `SKILL.md` | 2438 / 2460 | 22 | 2490 (~30 palabras en la fila «How it is tested»); 2500 por la enmienda |
| `sdd-init`, total | 3034 / 3060 | 26 | 3090 (lo anterior y `.temp/` en `structure.md`); 3100 por la enmienda |
| `sdd-templates`, total | 15620 / 15620 | 0 | 15680 (~40 palabras del campo «Temporales»); 15690 por la enmienda |
| kit entero | 90248 / 90300 | 52 | 90380 (~75 palabras entre las tres); 90400 por la enmienda |
| `tech-stack.md` | 19266 / 19280 | 14 | sin cambio: las decisiones 4 y 5 sustituyen frases (decisión 12) |

## Enmiendas

- 2026-10-22 — «Temporales» sale de la config de la suite o, si no lo fija, del valor por defecto de su runner; `no declarado` solo si ninguno lo dice; las frases del «no» y de las filas del roadmap van al texto, con los topes `sdd-init` 2500/3100, `sdd-templates` 15690 y kit 90400 — la regla decía «no se lee de su config → `no declarado`» y contradecía el THEN de `playwright.config.ts` sin `outputDir`; la revisión final (eje Spec) lo vio — aprobada: «Apruebo la enmienda (Recomendada)»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-22 | aprobada (opción «Apruebo») |
