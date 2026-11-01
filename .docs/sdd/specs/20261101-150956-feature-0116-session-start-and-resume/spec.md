---
id: 20261101-150956-feature-0116-session-start-and-resume
feature: 0116
title: Arranque de sesión sin el kit y puerta para retomar
mode: full
profile: delegate
status: approved
created: 2026-11-01
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-01
---

# Spec — Arranque de sesión sin el kit y puerta para retomar

🦆 Si una sesión arranca sin el kit, hoy nadie lo dice y el agente busca las skills por la caché. Con esto, en un proyecto que declara el kit 3.0.0, el primer mensaje de esa sesión sale con un aviso que da la ruta `…/sdd-kit/3.0.0/skills/`; con el kit cargado no sale nada. Para que funcione, cada proyecto lleva un pequeño hook propio, porque el del plugin no corre si el plugin no cargó. Y «retoma la feature» o «retoma el patch» entran directos por `sdd-implement` y siguen por lo pendiente, sin pasar antes por `sdd-propose`.

Validación: agente — `validation.mode: field` en `sdd-kit.json`; se cierra con tests, smoke headless y batería, y el uso real llega por los tickets.

## Capacidades

- Modificadas: `cli` — `sdd init --finish` escribe un fichero más; `sdd upgrade --project-hook`; `session-end` borra la marca
- Modificadas: `routing` — una sesión sin el kit avisa; retomar entra por `sdd-implement`
- Modificadas: `onboarding` — la init deja el hook del proyecto
- Modificadas: `migration` — la migración a v3.0.0 deja el hook del proyecto

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: contrato público (entrada de `.claude/settings.json` y fichero del proyecto), `MODIFIED` (`onboarding`), tres capacidades (cuatro tras la enmienda; siguen tres señales) · tamaño: ~150 líneas en 12 ficheros. Tres señales no proponen review.

1. **Cambio sobre lo que pediste: el aviso no puede vivir solo en `hookSessionStartVerb`.** Medido en `red/hook-probe.md`: un hook del plugin no corre si el plugin no cargó, y la entrada de un hook (`session_id`, `transcript_path`, `cwd`, `hook_event_name`, `source`) no trae la lista de skills. Solo un hook del proyecto puede avisar. Eso añade un fichero y una entrada de settings a cada proyecto, y un paso a la migración v3.0.0. Es decisión tuya: el impacto de la fila era «Bajo, ~3 min». **Mi recomendación es hacerlo**, porque es lo único que cumple tu «hecho está cuando». La alternativa, «Cambios: sin aviso», deja solo la puerta de retomar, salda la fila con esta medición y retira la Task 1 y la Task 2.
2. Cómo se sabe que el kit cargó: el hook del plugin escribe en SessionStart la marca `<tmpdir del SO>/sdd-kit-sessions[-<uid>]/<session_id>`, y el hook del proyecto la mira en `UserPromptSubmit`, porque en SessionStart los dos corren a la vez y no hay orden. Descartados: leer `installed_plugins.json` o el transcript (formatos sin documentar) y `claude plugin list` (dice qué hay instalado, no qué cargó esta sesión).
3. El aviso sale una vez por sesión, en el primer mensaje del usuario, a él (`systemMessage`) y al agente (contexto). Es un mensaje más tarde que SessionStart, antes de que el agente responda.
4. Literal del aviso: `AVISO sdd-kit: esta sesión no tiene cargadas las skills del kit. El proyecto declara el kit <versión>: léelas en <ruta>/<skill>/SKILL.md. Instálalo o actualízalo con «claude plugin install sdd-kit@sdd-kit --scope project» y reinicia Claude Code.` Si la carpeta de esa versión no existe, la frase de lectura cambia a `y esa versión no está en la caché (<ruta>)`. Sin `version` en `sdd-kit.json`, sin ruta: `esta sesión no tiene cargadas las skills del kit. Instálalo…`.
5. Ruta: `<CLAUDE_CONFIG_DIR o ~/.claude>/plugins/cache/sdd-kit/sdd-kit/<versión>/skills`. El formato de la caché no está documentado; si cambia, sale la frase de «no está en la caché» y la orden de instalar sigue valiendo.
6. Fichero del proyecto: `.claude/hooks/sdd-kit-loaded.mjs`, solo con módulos `node:*`. Un fallo suyo no sale nunca al usuario: el hook acaba con 0 y sin escribir. La marca la borra `session-end`.
7. El hook del plugin pierde el `matcher` de SessionStart para marcar también al reanudar: en `resume` escribe la marca y no inyecta nada, igual que hoy.
8. `INIT_SETTINGS` no sirve tal cual: `mergeNode` deja un array que ya existe. La entrada de `hooks.UserPromptSubmit` se añade al array si falta, sin tocar las demás.
9. El hook se copia a cada proyecto y no se actualiza solo: solo una migración lo cambia. Por eso es mínimo.
10. Puerta nueva, fila de `using-sdd`: `Resuming a paused feature or patch («retoma la feature», «sigue con la Task 3», «retoma el patch») | sdd-kit:sdd-implement`. Las `description` de `sdd-implement` y `sdd-propose` lo dicen también, porque el primer salto lo decide la `description` (feature 0117).
11. Regla de entrada en `sdd-implement`: sin ledger, las tasks hechas salen de `tasks.md` y `git log`; se sigue por la primera pendiente. En `patch-flow.md`: un patch se retoma por el primer paso cuya salida falta en `patch.md`, no por el paso 1. Sin `spec.md` aprobada ni `patch.md` en la rama, a `sdd-propose`, como ya dice Setup.
12. Saldo de palabras, contado (`word-budget.test.ts`): `using-sdd` 524, `sdd-implement` 9.737 y 17.507 con referencias, `sdd-propose` 5.336 y 13.929. Cada una queda igual o baja. Lo que sale de `using-sdd`: «(a new project, one with code or fresh from a template)», «With the answer, choose the gate.» y, si no basta, «which interview with `sdd-grilling`», que no cambia lo prohibido. La batería entera lo comprueba. En `sdd-implement`, la frase del Overview que repite el paso 2 de Setup y una de las tablas; en `sdd-propose`, lo que entra en su `description`.
13. El aviso de versión del hook del plugin (patch 0100) no cambia: ya cubre el kit viejo en caché cuando el plugin carga.
14. Límite que queda sin cubrir: el plugin cargado sin skills (`--disable-slash-commands`, medido, o `skillOverrides`). El hook corre y no puede saberlo. Es elección de quien lanza la sesión.
15. El ticket 6300 no dice por qué faltaron las skills y las vio aparecer a mitad de sesión; no lo he reproducido. Si fue un retraso de carga con el hook del plugin ya ejecutado, este aviso no saltaría.
16. El molde `rp1` se corrige antes del GREEN: su `patch.md` hablaba de sala y `cancelar` no recibe sala, y por eso `rp1-2` paró con razón. Se repite `rp1` en RED con el molde corregido (2 sujetos), para no comparar moldes distintos.
17. Repaso de coherencia: `sdd capability merge` sobre una copia acepta el delta (dos añadidos en `routing`, uno sustituido en `onboarding`, uno añadido en `migration`).
- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high · otros despachos en paralelo: sujetos de la batería, por tandas · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Un frente limpio sale de lo que se arregla y sigue como control; un RED limpio con caso de campo se mide con n = 3 antes de sacarlo — «Un RED limpio de un frente con caso de campo se mide con n = 3 antes de sacarlo, sin que la petición del molde traiga la orden.»
- Saldo de palabras igual o menor — «El saldo de palabras de cada skill editada queda igual o baja, contado antes de presentar la spec.»
- Si hay margen, el recorte sale de alcance — «si hay margen, el recorte sale de alcance y se dice en la spec»

## Intent

Una sesión sin el kit no lo dice, y «retoma la feature» quedó sin puerta tras la 0206. El RED de retomar (`red/out/`, 6 sujetos Sonnet, 2,04 $) matiza el hueco: **el fallo del ticket 0010b, retomar a mano sin skill, no se reproduce**. Los 6 llegaron a `sdd-implement`, ninguno repitió la Task 1 y los de feature miraron la base. Lo que sí se mide es un rodeo: con «retoma la feature» y «retoma el patch», 4 de 4 cargan antes `sdd-propose`, que no ejecuta nada y cuesta más de 5.000 palabras; con «sigue con la Task 2», 2 de 2 van directos. El frente se queda porque el rodeo es real y lo pides en el «hecho», pero su beneficio medido es ese ahorro, no evitar un error. Éxito: 6 de 6 con `sdd-implement` como primera skill, sin repetir lo hecho; y el aviso sale sin el plugin y no sale con él.

## Scope

- Entra: `cli/bin/session-start.js` y `session-end.js` (marca), `hooks/hooks.json`, el hook del proyecto y su instalación en `cli/src/init/`, `cli/src/upgrade/` si hace falta, `migrations/v3.0.0.md`, README, `using-sdd`, `sdd-implement` y `patch-flow.md`, la `description` de `sdd-propose`, y `tests/batteries/using-sdd/`.
- Sale de alcance: el recorte con A/B de la fila «`using-sdd` pasa del tope…». Recuento: 524 palabras contra un tope de 570, y la fila dice 519 de 530 en un test que ya no existe. Caducó, y se salda.
- No entra: rehacer el aviso de migraciones, reescribir el ledger o `tasks.md`, limpiar la caché de versiones, y migrar este repo (es la 0198).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `"matcher": "startup\|clear\|compact"` del SessionStart | `hooks/hooks.json:5` | decisión 7 |
| Requisito de settings de la init | `capabilities/onboarding.md:65` | delta, `MODIFIED` |
| Frases recortadas de `using-sdd` | `skills/using-sdd/SKILL.md:16,26` | decisión 12; ningún requisito las nombra |
| «Sin puerta hasta la 0116» | spec y walkthrough de la 0206 | no se tocan: artefactos cerrados |

- Filas que implementa: 0116, las dos de deuda que nombra y la de `using-sdd` → `roadmap.md`, y las filas 0198 y 0121 la citan como orden o absorción: sin cambio. Ni `skills/` ni `capabilities/` la nombran: comprobado con `grep -rln "0116" skills .docs/sdd/capabilities`.
- **Una pieza entra, otra sale**: sale el recorte con A/B de la fila caducada y las frases de la decisión 12.

## Approach

Tres tasks, sin partir: (1) la marca en el hook del plugin y `sdd-kit-loaded.mjs`, con sus tests; (2) la instalación por `sdd init` y por la migración v3.0.0, y el README; (3) la puerta y las reglas de entrada, con la batería. Las tasks 1 y 2 salen si eliges la alternativa de la decisión 1.

## Dónde se prueba

- Marca y aviso: Vitest en `cli/test/hook/`, como `session-start.test.ts`, con el caso de «falta el fichero» que pide `tech-stack.md`.
- Sesión real sin plugin y con plugin: smoke headless con Haiku, como el sondeo.
- Instalación: `cli/test/init/verbs.test.ts` y `project-hook.test.ts`; la migración, con el test de `--project-hook` y la paridad de `cli/test/kit/`.
- Puerta y retomar: batería `using-sdd`, tramo `retomar` y entera, con sus filas en prosa leídas a mano (`d1`).

## Términos y ADR

- Términos resueltos: hook del proyecto — el de `.claude/settings.json`, que corre aunque el plugin no cargue; hook del plugin — el de `hooks/hooks.json`.
- ADR candidatas: el aviso de kit no cargado vive en un hook copiado al proyecto — alternativa descartada: solo en el hook del plugin, que no corre en ese caso.

## Delta de comportamiento

### Capacidad: `cli`

#### ADDED — `sdd upgrade --project-hook` instala el hook del proyecto

- GIVEN un proyecto sin `.claude/hooks/sdd-kit-loaded.mjs`
- WHEN se ejecuta `sdd upgrade --root <raíz> --project-hook`
- THEN escribe el fichero y su entrada en `hooks.UserPromptSubmit` de `.claude/settings.json`, con una línea de salida por fichero, y sale con 0
- AND repetirlo no duplica la entrada y dice `sin cambios` en los dos
- AND con `--mark` sale con 2 y no escribe

#### MODIFIED — `sdd init --finish` escribe lo determinista de la init

- GIVEN un proyecto sin `.claude/settings.json`, con un `.gitignore` con CRLF que tiene `node_modules/` y `.superpowers/`, y un `sdd-kit.json` en curso con `init.config` = `{"ids":{"mode":"sequence"},"control":{"profile":"delegate"}}`
- WHEN se ejecuta `sdd init --root <raíz> --finish --ignore .auth/`
- THEN `.claude/settings.json` tiene el bloque de la init (memoria desactivada, los dos marketplaces con `autoUpdate: true` y los dos plugins activados), igual al bloque marcado con `<!-- sdd-init: settings -->` del README, más la entrada del hook del proyecto
- AND `.gitignore` conserva `node_modules/` y `.superpowers/` una vez, gana `.playwright-mcp/`, `.docs/sdd/sdd-kit.local.json`, `.temp/` y `.auth/` con CRLF, y termina en salto de línea
- AND `.docs/sdd/sdd-kit.json` tiene `version` igual a la de `.claude-plugin/plugin.json`, `channel` `plugin`, `updated` del día, `ids.mode` `sequence` y `control.profile` `delegate`, sin `init`, y es el último fichero que se escribe
- AND la salida tiene una línea por fichero con `creado` o `actualizado`, y sale con 0
- AND repetir el mismo comando deja los cuatro ficheros iguales y dice `sin cambios` en los cuatro
- AND `.claude/hooks/sdd-kit-loaded.mjs` queda escrito y su entrada, en `hooks.UserPromptSubmit` de `.claude/settings.json`, antes de `sdd-kit.json`
- AND sin `.gitignore`, lo crea con las líneas de la init
- AND con un `sdd-kit.json` de template que ya tiene `"version": "1.1.0"`, la conserva

#### Reglas de la capacidad — cli

- **Dónde viven los datos**: `sdd init` escribe `.claude/settings.json`, `.claude/hooks/sdd-kit-loaded.mjs`, `.gitignore` y `.docs/sdd/sdd-kit.json` del proyecto; la versión, de `.claude-plugin/plugin.json` del kit; el bloque de settings, de su constante en `cli/src/init/`, y el hook, de `hooks/project/` del kit. `sdd upgrade` lee las migraciones de `skills/sdd-upgrade/references/migrations/` del kit cargado y escribe `.docs/sdd/sdd-kit.json`, o, con `--project-hook`, el hook y su entrada en settings. `sdd validation serve` lee los pasos de `--steps` y el panel de `skills/sdd-archive/references/validation-panel.js` del kit cargado, y escribe solo el fichero de `--out`. `sdd hook session-start` escribe la marca de la sesión en la carpeta temporal del sistema. `sdd hook session-end` lee el JSON de stdin, `CLAUDE_CODE_TMPDIR` y `CLAUDE_PROJECT_DIR`, borra esa marca y su `.warned`, y solo borra subcarpetas de `<CLAUDE_CODE_TMPDIR o la carpeta temporal del sistema>/claude/<carpeta del proyecto>/`.

### Capacidad: `routing`

#### ADDED — Una sesión sin el kit cargado lo avisa con la ruta

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `3.0.0` y `.claude/hooks/sdd-kit-loaded.mjs`, y una sesión sin el plugin `sdd-kit` cargado
- WHEN el usuario escribe su primer mensaje
- THEN el usuario y el agente reciben `AVISO sdd-kit: esta sesión no tiene cargadas las skills del kit. El proyecto declara el kit 3.0.0: léelas en <config>/plugins/cache/sdd-kit/sdd-kit/3.0.0/skills/<skill>/SKILL.md. Instálalo o actualízalo con «claude plugin install sdd-kit@sdd-kit --scope project» y reinicia Claude Code.`
- AND en el segundo mensaje de esa sesión no sale
- AND si la carpeta de `3.0.0` no existe, dice `y esa versión no está en la caché (<ruta>)` en lugar de la frase de lectura
- AND sin `version` en `sdd-kit.json` no da ruta, y sin `.docs/sdd/` no escribe nada
- AND con el plugin cargado, también por `--plugin-dir` o al reanudar, no sale
- AND si el hook falla, sale con 0 y no escribe nada

#### ADDED — Retomar una feature o un patch entra por `sdd-implement`

- GIVEN la rama `feature/0020-room-filter` con spec aprobada, plan de 3 tasks y `tasks.md` con la Task 1 hecha, sin ledger
- WHEN el usuario escribe «Retoma la feature.» o «Sigue con la Task 2.»
- THEN la primera skill que se invoca es `sdd-kit:sdd-implement`, no `sdd-kit:sdd-propose`
- AND no crea carpeta ni rama, no repite la Task 1 y sigue por la Task 2, tras mirar la base
- AND en la rama `patch/0021-cancel-missing`, con `patch.md` hasta el fix y sin commitear, «Retoma el patch, lo dejé ayer a medias.» invoca primero `sdd-kit:sdd-implement`, que sigue por el primer paso cuya salida falta, sin crear otro `patch.md`
- AND sin `spec.md` aprobada ni `patch.md` en la rama, lo manda a `sdd-propose`

### Capacidad: `onboarding`

#### MODIFIED — La init deja la memoria automática desactivada y los temporales ignorados

- GIVEN un `sdd-init` sobre un proyecto cuyo `.claude/settings.json` es `{"permissions": {"allow": ["Bash(npm test)"]}}`
- WHEN ejecuta `sdd init --root <raíz> --finish`
- THEN `.claude/settings.json` conserva `permissions` y gana `"autoMemoryEnabled": false`, `extraKnownMarketplaces.sdd-kit` con la fuente `github` `pikachumetal/sdd-kit` y `extraKnownMarketplaces.superpowers-marketplace` con la fuente `github` `obra/superpowers-marketplace`, los dos con `"autoUpdate": true`, y `enabledPlugins` con `"sdd-kit@sdd-kit": true` y `"superpowers@superpowers-marketplace": true`
- AND `.gitignore` contiene las líneas `.playwright-mcp/`, `.superpowers/`, `.docs/sdd/sdd-kit.local.json` y `.temp/` una sola vez cada una, y cada ruta de `--ignore`
- AND con `"autoMemoryEnabled": true` previo, la salida dice `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia` y el agente pregunta; con su «sí», repite `--finish` con `--memory-off` y la clave queda en `false`; con su «no», se queda en `true` y el resumen de cierre lo anota
- AND si `claude plugin marketplace list` no muestra `superpowers-marketplace`, el agente ejecuta `claude plugin marketplace add obra/superpowers-marketplace`
- AND la init escribe `.claude/hooks/sdd-kit-loaded.mjs` y añade su entrada a `hooks.UserPromptSubmit` de `.claude/settings.json` una sola vez, sin tocar las que ya hubiera

### Capacidad: `migration`

#### ADDED — La migración a v3.0.0 deja el hook del proyecto

- GIVEN un proyecto que migra a v3.0.0 sin `.claude/hooks/sdd-kit-loaded.mjs`
- WHEN corre la migración
- THEN el fichero queda escrito y su entrada en `hooks.UserPromptSubmit` de `.claude/settings.json`, una sola vez, sin gate y sin tocar las demás entradas
- AND si la entrada ya estaba, no la duplica, y la línea `**Escribe**:` de la migración los nombra

## Previsión de coste

Precios medidos en el RED de esta feature: 0,34 $ por sujeto de retomar, 14 turnos. El resto de la batería, ~0,15 $ por sujeto, 8 turnos (estimado: es lo que hay que confirmar).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 6 de retomar, ya hechos, y 2 de `rp1` con el molde corregido | 2,04 + 0,70 |
| GREEN | 6 de retomar | 2,05 |
| Una tanda de REFACTOR | 6 de retomar | 2,05 |
| Controles | batería entera sin retomar: 34 sujetos | 5,10 |
| Medición tras la revisión final | smoke de hook con Haiku, 3 sujetos, y 1 de control por escenario afectado | 0,50 |
| Suma | | 12,44 |

Paso cambiado → escenario: fila de `using-sdd` → `rf1`, `rf2`, `rp1`; regla de `sdd-implement` → `rf1`, `rf2`; regla de `patch-flow.md` → `rp1`; `description` de `sdd-implement` y `sdd-propose` → batería entera; frases recortadas → `i1`, `i2`, `d1`, `f2`, `f3`; paso de la migración → test y la «Verificación», sin sujetos, porque es una escritura mecánica.

## Enmiendas

- 2026-11-01 — capacidad `cli` en el delta (`--project-hook`, reglas) y la línea de la migración en «Dónde se prueba»; el requisito de `--finish` de `cli` pasa a cuatro ficheros; la ruta de la marca de la decisión 2 lleva el uid donde el sistema lo tiene — los ejes Spec y Arquitectura de la revisión final: sin esto, `cli.md` queda falsa — aprobada (opción «Apruebo»)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-01 | aprobada (opción «Apruebo») |
