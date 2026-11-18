---
id: 20261118-183552-patch-0351-remove-validation-panel
task: 0351
title: Patch — quitar el panel de validación hasta la 3.1
type: patch
solution: dev-lead
status: done
created: 2026-11-18
branch: patch/0351-remove-validation-panel
commit: 81a64077c
---

# Patch 0351 — quitar el panel de validación hasta la 3.1

## Capacidades

- Modificadas: `archive` — la validación manual da el guion en texto, sin panel; se retiran sus dos requisitos y sus reglas
- Modificadas: `cli` — se retira `sdd | 1 | `git grep` de `validation-panel`, `validation serve`, `sddValidationPanel` y `Panel:` en `skills`, `cli/src` y `dist/skills` | sin coincidencias ✅ |`

## 1. Síntoma

En un proyecto con `validation.mode: manual` y sin Claude in Chrome, el cierre levanta `sdd | 1 | `git grep` de `validation-panel`, `validation serve`, `sddValidationPanel` y `Panel:` en `skills`, `cli/src` y `dist/skills` | sin coincidencias ✅ |`, una página local sin estilos que no ve la app. El panel no se había probado en uso ni se había decidido cómo lo quiere el dev-lead.

## 2. Causa raíz (o intención, en un ajuste visual; o solución fijada, en una petición cerrada)

Solución fijada por el dev-lead, 2026-11-18: «hay que quitarlo ya!!! … Quiero que el kit funcione como funciona en document manager. no quiero vovler ha ver el panel hasta qu enos pongamos con el». El panel entró en la 0208 desde la fila B14, que el cierre del spike 0162 marcó «en la 3.0.0» sin frase del dev-lead.

## 3. Fix

- **Fichero(s)**: `skills/sdd-archive/references/dev-validation.md`, `skills/sdd-archive/references/validation-panel.js` (borrado), `skills/sdd-archive/references/validation-modes.md`, `skills/sdd-templates/templates/validation-template.md`, `cli/src/validation/` (borrado), `cli/src/cli/verbs.ts`, `cli/test/validation/` (borrado), `cli/test/kit/headless/campaign.test.ts`, `tests/batteries/sdd-archive/battery.md`.
- **Cambio**: la validación manual vuelve al guion en texto: sin la línea `Panel:`, sin panel en Chrome y sin plan B; el registro es la frase del dev-lead. Se retira el verbo `sdd | 1 | `git grep` de `validation-panel`, `validation serve`, `sddValidationPanel` y `Panel:` en `skills`, `cli/src` y `dist/skills` | sin coincidencias ✅ |`.
- **Retirado**: `validation-panel.js`, `sdd | 1 | `git grep` de `validation-panel`, `validation serve`, `sddValidationPanel` y `Panel:` en `skills`, `cli/src` y `dist/skills` | sin coincidencias ✅ |`, la línea `Panel:`, el escenario `g3d` y las filas `G6` de la batería de `sdd-archive` · Lo que el usuario deja de poder hacer: marcar los pasos en un panel; los dice en el chat.

## 4. Verificación

- Fila propuesta: ninguna
- Gate: `moon run kit:test-headless cli:typecheck cli:test` → kit:test-headless: corrió 775/775 · cli:typecheck: corrió · cli:test: corrió 2473/2485 (12 saltados por el runner) · sin filtro: la rama retira un verbo de la CLI

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `git grep` de `validation-panel`, `validation serve`, `sddValidationPanel` y `Panel:` en `skills`, `cli/src` y `dist/skills` | sin coincidencias ✅ |
| 2 | `node dist/cli/bin/sdd.js validation serve` | «comando desconocido: «validation»» ✅ |

Validación por el agente: 2026-11-18 · los dos casos y la gate · el guion en texto de `dev-validation.md` §1-§4 no cambia salvo el registro

## 5. Tiempo (ligero)

- Esfuerzo real: ~30 min, aproximado con las marcas de los commits (la sesión corre desde el checkout de `develop`)

## 6. Delta de capacidad

### Capacidad: `archive`

#### MODIFIED — Mientras la persona prueba, el agente no lanza nada contra el entorno

- GIVEN la 0010 lista para validar en `validation.mode` `manual` o sin la clave, con una suite E2E de ~50 s cuyo `env-up` reinicia el servidor
- WHEN el dev-lead pide «dame ya el guion y, mientras lo pruebo, pasa en segundo plano tres veces las specs E2E que toca la rama»
- THEN desde el mensaje que presenta el guion hasta la respuesta de la persona, no deja en marcha ni lanza ninguna tanda, suite, `env-up`, `env-down`, sonda ni escritura en datos
- AND la tanda corre antes de presentar el guion, esperando su resultado, o queda para después de la validación, y el mensaje dice cuál y por qué
- AND sigue en marcha el entorno que levantó antes de presentar, comprobado antes

#### REMOVED — La persona valida con un panel en su navegador

- motivo: el panel de validación no estaba probado ni decidido para la 3.0; vuelve a diseñarse en la 3.1 (patch 0351)

#### REMOVED — Sin Claude in Chrome, el panel lo sirve la CLI

- motivo: el panel de validación no estaba probado ni decidido para la 3.0; vuelve a diseñarse en la 3.1 (patch 0351)

#### Reglas de la capacidad — archive

- **Dónde viven los datos**: la skill en `skills/sdd-archive/`; la receta del merge en `skills/sdd-archive/references/merge-recipe.md`; cuándo corre la suite del cierre y qué corre tras el merge de sincronización, en `skills/sdd-archive/references/closing-suite.md`; la comprobación de la revisión final, en `skills/sdd-archive/references/final-review-check.md`; qué corre, envía y registra cada modo de validación, en `skills/sdd-archive/references/validation-modes.md`; adónde va cada aprendizaje, en `skills/sdd-archive/references/learnings.md`; la de la validación del dev en `skills/sdd-archive/references/dev-validation.md`; las ADR en `.docs/sdd/decisions/`; la deuda en `.docs/sdd/steering/debt.md`; la lista del camino crítico del proyecto en `.docs/sdd/steering/critical-path.md`, y su check y su alcance en «Camino crítico» y «Tests de feature» de `operations.md` §Testing
- **Idioma de los nombres**: skill y ficheros en inglés kebab-case; marcas de carril de la skill `Feature only:`, `Patch only:`, `Hotfix only:`; las líneas de registro, en castellano (`Validado:`, `no ensayado:`)
- **Avisos**: «Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?» · «Abiertas a la vez: `<rama>` (`<ruta>`). La que fusione segunda integra la base y repite sus gates.» · «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?» · el bloque del rojo (comando, código de salida, ruta del log, últimas 20 líneas, línea `base:`, «`<merge.into>` sin tocar en `<hash>`») · «`base: en rojo: el mismo comando también falla sin la rama`» (contraste a mano) · «Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas; su prompt lo da `sdd-roadmap`: «dame el prompt de la `<id>`».» · «Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.» · «Para acabar la propuesta `<N>` falta: …» · «La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.» · «`<documento>` no existía: creado desde la plantilla» · `ADR: <candidata> → decisions/NNNN-<slug>.md` · `no ensayado: <motivo>` · `Conflicto de la base resuelto por el agente: <fichero> — <qué juntó de cada lado>` · «¿Pegas en `critical-path.md` la fila `<fila>`? Si no, el cierre borra `<test>`.» · «La base trae `<cuántos>` tests fuera de la lista (`ya-en-base:`): `<test>`[, …]. Recomiendo un patch que los borre; decide el dev-lead.» · «`Camino crítico` declarado sin `critical-path.md`: no borro nada.»
- **Regla ante conflicto**: un conflicto al integrar la base o al fusionar que `sdd merge` no resuelve lo resuelve una persona, salvo el que cae solo en Markdown y en el que los dos lados solo añaden o tocan filas distintas sin cambiar lo del otro, que lo resuelve el agente, repite el gate y lo nombra; un rojo que también falla sin la rama lo decide el dev-lead tras la búsqueda en la deuda; el merge a la rama estable, el tag y su push solo con la frase del dev-lead; la fila de la madre de una familia la cierra el dev-lead, no el cierre; con «Camino crítico», `critical-path.md` manda sobre «Flujos core», solo la escribe una persona, y un test con fila propuesta sin respuesta no se borra, salvo en `unattended`, donde se borra y su propuesta va a la deuda

### Capacidad: `cli`

#### MODIFIED — La CLI se ejecuta con Node y sin dependencias

- GIVEN el plugin instalado y Node 22.18.0 o posterior en el `PATH`, sin pnpm, moon ni proto
- WHEN se ejecuta `node "<raíz del plugin>/cli/bin/sdd.js" --help`
- THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish|causes`, `id next|claim`, `merge`, `estimation log`, `init`, `upgrade`, `session tokens`, `watch subagent|command`, `hook session-start|session-end`, `task start|done|brief`, `review package|comments`, `workspace`, `ledger rulings`, `lock run`) con una línea de ayuda, y sale con 0
- AND `cli/package.json` no tiene `dependencies`, y el plugin no necesita `pnpm install` para ejecutar ningún verbo

#### REMOVED — `sdd | 1 | `git grep` de `validation-panel`, `validation serve`, `sddValidationPanel` y `Panel:` en `skills`, `cli/src` y `dist/skills` | sin coincidencias ✅ |` sirve el panel y guarda las marcas

- motivo: el panel de validación sale del kit hasta la 3.1 (patch 0351)

#### Reglas de la capacidad — cli

- **Dónde viven los datos**: `sdd init` escribe `.claude/settings.json`, `.claude/hooks/sdd-kit-loaded.mjs`, `.gitignore` y `.docs/sdd/sdd-kit.json` del proyecto; la versión, de `.claude-plugin/plugin.json` del kit; el bloque de settings, de su constante en `cli/src/init/`, y el hook, de `hooks/project/` del kit. `sdd upgrade` lee las migraciones de `skills/sdd-upgrade/references/migrations/` del kit cargado y escribe `.docs/sdd/sdd-kit.json`, o, con `--project-hook`, el hook y su entrada en settings. `sdd hook session-start` escribe la marca de la sesión en la carpeta temporal del sistema. `sdd hook session-end` lee el JSON de stdin, `CLAUDE_CODE_TMPDIR` y `CLAUDE_PROJECT_DIR`, borra esa marca y su `.warned`, y solo borra subcarpetas de `<CLAUDE_CODE_TMPDIR o la carpeta temporal del sistema>/claude/<carpeta del proyecto>/`.
- **Límites**: `--ignore` relativo a la raíz, sin vacío, absoluto, `..`, espacios al borde ni saltos de línea; una acción por llamada; `--mark`, solo una versión `X.Y.Z` numérica, con su `vX.Y.Z.md` en el kit y mayor que la del proyecto; `sdd hook session-end` borra solo las sesiones sin escrituras en las últimas 24 h, nunca la del `session_id`, y tras 1 s desde que arranca no empieza a borrar ninguna más; el id de una task, tramos de letras y dígitos separados por puntos con al menos un dígito, comparado como texto entero; `-C` de `sdd workspace`, `sdd task brief` y `sdd review package`, un directorio que existe; la lista de encabezados con forma de task, cinco como mucho.
- **Regla ante conflicto**: en `settings.json`, la hoja que ya existe manda sobre la de la init, salvo `autoMemoryEnabled` con `--memory-off`; en `sdd-kit.json`, `channel` y `updated` los fija la CLI, `version` la fija la CLI salvo que ya exista (la de un template), y en el resto gana el `--config`; con `sdd upgrade --mark`, `version` es la que se marca y el resto de claves se queda; en `sdd task start` y `sdd task brief`, para la primera comprobación que falla, en este orden: el directorio de `-C`, el repo, `tasks.md`, el bloque sin cerrar y la task no encontrada; un `.temp/sdd/.gitignore` que ya existe manda sobre el de la CLI.
