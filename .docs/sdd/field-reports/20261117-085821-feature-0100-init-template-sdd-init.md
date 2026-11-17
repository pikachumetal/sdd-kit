---
kit_version: 3.0.0
lane: feature
id: 20261117-085821-feature-0100-init-template-sdd-init
task: 0100
mode: full
date: 2026-11-17
---

# Ticket para el kit — feature 0100: el onboarding de un template 2.x con el kit 3.0.0 choca con el aviso de migración y con lo que escribe `sdd init --finish`

## Contexto

- Carril y modo: feature full, perfil delegate, validación manual (diferida)
- Skills del kit usadas: sdd-propose, sdd-grilling, sdd-parallel-agents, sdd-implement, sdd-implement-native, sdd-worktrees, sdd-tdd, sdd-agent-writing, sdd-verify, sdd-archive, sdd-retro, sdd-feedback; y `sdd-init` como sujeto, invocada por una skill del proyecto
- Proyecto: repo de templates de aplicación (monorepo .NET + frontend); cada template trae un esqueleto `.docs/sdd/` en forma 2.x con marcadores `<!-- sdd-template: pending -->` y una skill de proyecto que, en la instancia, invoca `sdd-kit:sdd-init` y cierra con un commit; una persona
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: claude-sonnet-5-5 (revisores de spec, eje Código), claude-opus-5-5 (eje Spec); sujetos `claude -p --model sonnet`
- Coste en reloj: 0,77 h frente a 2,5 h estimadas (sin 560 min de espera al dev-lead)
- Coste en tokens: hilo 57.029.155; subagentes 3.564.634 en 6 despachos; sujetos 6,75 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `sdd init --finish` escribe fuera de `.docs/` y, en modo template, nada lo anuncia: el commit de cierre del proyecto choca con su guard de rama protegida

- **Qué pasó**: en una instancia recién creada, con el esqueleto marcado, `sdd-init` entró por el predicado 1 y completó solo lo marcado, en la forma 2.x. Al acabar, `sdd init --finish` añadió una entrada `UserPromptSubmit` a `.claude/settings.json`, creó `.claude/hooks/sdd-kit-loaded.mjs` y añadió `.temp/` a `.gitignore`. La skill de cierre del proyecto commitea en `develop`, y su guard de rama protegida solo deja commitear ahí cambios en `.docs/**` y en la carpeta de esa skill. El sujeto dejó todo en el índice y dijo: «Cambios que no te había anunciado: al cerrar, `sdd init --finish` también modificó cuatro cosas». La función del guard, evaluada sobre la instancia, devolvió `{"branch":"develop",…}` (bloqueado). Además, el test del proyecto que exige que cada hook de `settings.json` apunte a un script de su carpeta de hooks se puso en rojo: `AssertionError: node "${CLAUDE_PROJECT_DIR}/.claude/hooks/sdd-kit-loaded.mjs"`.
- **Fuente**: `skills/sdd-init/SKILL.md:68` («It writes, in this order and without asking: `.claude/settings.json` …, `.claude/hooks/sdd-kit-loaded.mjs`, `.gitignore` and `.docs/sdd/sdd-kit.json`»); `cli/src/init/run.ts` (`plan()`: cuatro escrituras con `--finish`); el `stream-json` del sujeto `claude -p` del GREEN completo; walkthrough de la feature, §3.
- **Dónde en el kit**: `skills/sdd-init/SKILL.md`, paso 7 «Finish» y paso 8 «Closing summary»; predicado 1 («Template»), que no dice que `--finish` toca ficheros que el template ya trae decididos.
- **Por qué el kit no lo evitó**: el paso 7 lo documenta para el init general, pero el predicado 1 promete «don't touch its complete documents», y para un template `.claude/settings.json` (hooks y `permissions.deny`) y `.gitignore` son ficheros completos. El resumen de cierre no lista esas escrituras, así que quien cierra después (una skill del template, el dev) no sabe que van en su commit.
- **Coste**: una enmienda de la spec con un revisor, una parada del dev-lead y un segundo GREEN completo (1,68 $ de sujetos); respaldo: spec de la feature, «Enmiendas» 2026-11-17, y `tasks.md`, «Fixes adicionales».
- **Propuesta**: en el predicado 1, que el resumen de cierre (paso 8) liste, literal, cada fichero fuera de `.docs/` que `--finish` escribió o cambió, y diga que van en el commit de cierre. Valorar además un `--finish --docs-only` (o que en modo template `--finish` no toque `.claude/` si el template ya declara el marketplace y el plugin), dejando el hook como propuesta en el resumen.
- **Verificada**: sí — contrastado con `skills/sdd-init/SKILL.md:68` y reproducido con el sujeto `claude -p` del GREEN completo (PowerShell 7, Windows 11).
- **Criterio de aceptación**: GIVEN un template con esqueleto marcado y `.claude/settings.json` propio, WHEN `sdd-init` termina con `--finish`, THEN su resumen de cierre nombra `.claude/settings.json`, `.claude/hooks/sdd-kit-loaded.mjs` y `.gitignore` como cambiados fuera de `.docs/` (o no los cambia con el modo solo-docs), y un sujeto que cierra después no los presenta como «cambios que no te había anunciado».

### 2. El aviso de inicio de sesión ofrece migrar un proyecto de template sin inicializar, antes de `sdd-init`

- **Qué pasó**: con el kit 3.0.0 cargado, cada sesión en una instancia sin inicializar (esqueleto 2.x, `sdd-kit.json` con `"version": "2.3.2"` y marcadores `sdd-template: pending`) abre con el aviso de migraciones pendientes. En la prueba de humo, el sujeto lo citó por su cuenta: «El aviso de sesión indica que el proyecto está en el kit 2.3.2 y que el kit cargado trae migraciones hasta la 3.0.0». En la validación manual, el dev-lead abrió la instancia y la sesión lanzó `sdd-upgrade` antes que la skill de onboarding. Migrar ese esqueleto antes de inicializarlo cambia su forma (de 2.x a 3.0.0) y deja en rojo el test del proyecto que exige la forma 2.x mientras quedan marcadores.
- **Fuente**: `cli/bin/session-start.js:78` («AVISO sdd-kit: el proyecto tiene aplicado el kit ${wanted} (.docs/sdd/sdd-kit.json) y el kit cargado trae migraciones hasta la ${latest}. Para aplicarlas, pide «actualízame al kit».»); `skills/sdd-init/references/structure.md:29` («A 2.x template (`mission.md`, `tech-stack.md`, `roadmap.md`) keeps its shape; the migration moves it.»); `skills/sdd-init/SKILL.md`, predicado 1; el `stream-json` de la prueba de humo; la frase del dev-lead en el walkthrough, §4.2.
- **Dónde en el kit**: el hook de inicio de sesión (`cli/bin/session-start.js`, su fuente en `cli/src/hook/`) y `skills/sdd-upgrade/SKILL.md` (entrada por la oferta del aviso).
- **Por qué el kit no lo evitó**: el aviso solo compara la versión de `sdd-kit.json` con la del kit cargado; no mira si el proyecto aún tiene marcadores `sdd-template: pending`, que según el predicado 1 de `sdd-init` es el estado que se inicializa primero, en la forma en que llega.
- **Coste**: la validación de la feature se difirió a la siguiente; respaldo: walkthrough de la feature, §4.2 («Validación diferida … disparador: la 0101»). El coste de una migración aplicada sobre una instancia real queda sin medir.
- **Propuesta**: con algún `<!-- sdd-template: pending -->` en `.docs/sdd/` o en `PRODUCT.md`/`ROADMAP.md`, el aviso de inicio no ofrece la migración: dice que el proyecto viene de un template sin inicializar y que la entrada es `sdd-init`. `sdd-upgrade`, invocado igualmente, para y deriva a `sdd-init` por la misma condición.
- **Verificada**: sin verificar (la condición del aviso se leyó en `cli/bin/session-start.js:78`; el comportamiento con marcadores no se reprodujo por separado).
- **Criterio de aceptación**: GIVEN una instancia con `sdd-kit.json` en 2.3.2 y marcadores `sdd-template: pending`, WHEN arranca una sesión con el kit 3.0.0, THEN el aviso no contiene «actualízame al kit» y nombra `sdd-init`; y GIVEN la misma instancia, WHEN se pide «actualízame al kit», THEN `sdd-upgrade` para sin escribir y remite a `sdd-init`.

## Lo que hice por iniciativa propia

- Probar la skill de onboarding de extremo a extremo con un sujeto `claude -p` retomado con `--resume` y respuestas guionadas hasta el commit de cierre, no solo hasta la primera pregunta. Fue lo que destapó el hallazgo 1: la revisión de spec lo predijo, pero solo el recorrido completo lo midió.
- Cargar un kit anterior en un sujeto con `--plugin-dir` a su carpeta de la caché y `--plugin-dir` a su dependencia (`superpowers`): sin la dependencia, el plugin no carga y el evento `init` no lo lista.

## Funcionó, no tocar

- El predicado 1 de `sdd-init`: sobre un esqueleto 2.x marcado completó solo lo marcado, sin crear `steering/` ni tocar los documentos completos, y no preguntó stack, ramas ni worktrees.
- La rúbrica de review de spec con dos lentes: la técnica avisó en las dos rondas de que lo que escribe `--finish` podía chocar con el cierre y con los hooks del proyecto, que es el hallazgo 1.
