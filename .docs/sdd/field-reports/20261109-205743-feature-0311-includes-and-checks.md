---
kit_version: 2.3.4
lane: feature
id: 20261109-205743-feature-0311-includes-and-checks
task: 0311
mode: full
date: 2026-11-09
---

# Ticket para el kit — feature 0311: una sola fuente por regla y las comprobaciones del corte en el pre-commit y la CI

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`, Native
- Skills del kit usadas: `sdd-propose`, `sdd-grilling` (no hizo falta), `sdd-parallel-agents`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown, CLI y herramientas en TypeScript, baterías headless), una persona
- Modelo del hilo: Opus 5.5, effort no registrado
- Modelos de los subagentes: revisores de spec opus y sonnet (`sdd-kit:effort-medium`); ejes Spec opus y Código sonnet, re-revisión opus (`sdd-kit:effort-high`); lector de filas en prosa sonnet; sujetos de baterías sonnet
- Coste en reloj: 2,57 h de esfuerzo frente a 7 h estimadas de implementación; reloj de la sesión 6,38 h, 229 min de espera
- Coste en tokens: hilo 188.366.573; subagentes 37.203.403 en 7 despachos; sesión 70,77 $ y sujetos 27,25 $ en 59

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una tanda de baterías se cuelga horas si un sujeto deja un proceso huérfano con la salida heredada

- **Qué pasó**: el humo de 11 baterías se paró ~3 h después de `sdd-verify`. Un sujeto había lanzado `find / -name review-code.md | head` (PID 98716 y 89880); su shell murió, el `find` siguió recorriendo el disco con la salida de la tanda heredada, y el `tail -3` del script que la lanzaba no recibía el fin de fichero. Parado por su PID, la tanda siguió.
- **Fuente**: `Get-CimInstance Win32_Process` → `find.exe … / -name review-code.md` con padre 104852 inexistente; walkthrough §2, `Esperas y huecos` → `17:23Z 120 min`; ledger del plan.
- **Dónde en el kit**: `tests/headless/run.mjs` y `tests/headless/lib.mjs` (limpieza del sujeto al acabar); `tests/headless/deny-kill.mjs` no cubre los hijos huérfanos
- **Por qué el kit no lo evitó**: la limpieza para lo que escucha en los puertos del sujeto, no el árbol de procesos que deja; y `tech-stack.md`, «Baterías por skill», no dice que una tanda vaya a fichero con la entrada cerrada
- **Coste**: ~3 h de reloj parado (walkthrough §2); 0 $ de más
- **Propuesta**: al acabar cada sujeto, `run.mjs` para el árbol de procesos que lanzó (por PID, no por nombre), o lanza el sujeto sin heredar la salida de la tanda; y una línea en «Baterías por skill»: la salida de una tanda va a un fichero, con `< /dev/null`
- **Verificada**: sin verificar (la segunda tanda, ya con la salida a fichero y la entrada cerrada, no se colgó)
- **Criterio de aceptación**: GIVEN un sujeto que deja `find /` corriendo en segundo plano WHEN acaba la tanda con su salida en una tubería THEN la tanda termina y el proceso huérfano ya no existe

### 2. `kit:copies` en el pre-commit para el merge en un checkout con CRLF viejo en disco

- **Qué pasó**: el primer `sdd merge --push` falló en el `pre-merge-commit` del checkout de `develop`: `kit:copies | skills/sdd-debugging/references/defense-in-depth.md: tiene finales de línea CRLF; la fuente de una copia va en LF` (y `condition-based-waiting-example.ts`). Los dos estaban `i/lf w/crlf attr/text eol=lf`: limpios para git, con CRLF en disco de un checkout anterior a la regla de `.gitattributes`, con `core.autocrlf=true`. Reescritos en LF (sin cambio para git), el merge entró.
- **Fuente**: `.temp/sdd/plan/merge.log`; `git ls-files --eol` en el checkout de `develop` → `i/lf w/crlf attr/text eol=lf`; `git config core.autocrlf` → `true`
- **Dónde en el kit**: `tests/copies/annotated.ts` (`checkCopy`, el aviso `crlf`), que lee el disco; `.githooks/pre-commit` (la 0311 lo mete en el hook)
- **Por qué el kit no lo evitó**: la comprobación de LF mira el árbol de trabajo, y en la CI y en worktrees nuevos el disco siempre está en LF; un checkout viejo solo aparece al fusionar
- **Coste**: un merge parado y ~10 min; sin respaldo en el walkthrough (lo cuenta el ticket)
- **Propuesta**: que el aviso de CRLF compare el blob del índice (`git ls-files --eol`, columna `i/`) en vez del disco, o una línea en `CLAUDE.md` junto a `SDD_UPSTREAM_DIR`: `git add --renormalize . && git checkout -- skills` una vez por checkout viejo
- **Verificada**: sí — reproducido con `node cli/bin/sdd.js merge --project-root … --push` en Git Bash; con los dos ficheros en LF, `node tests/copies/check.ts` da `Copias al día: 31 ficheros.` y el merge entra (`74b15751`)
- **Criterio de aceptación**: GIVEN un fichero de copia `i/lf w/crlf` con `eol=lf` WHEN corre `kit:copies` THEN no da el aviso de CRLF; y con `i/crlf`, sí

### 3. La previsión de palabras de la spec contaba ahorros que una inclusión no da, y paró por desvío

- **Qué pasó**: la spec preveía −85 palabras en el kit (con la frase de idioma a +257 y salidas a −340); con todo el texto escrito el kit medía 103.511 sobre un `kitBudget` de 103.372, y al cierre 103.527 (+189 frente a `develop`). Paré por desvío; el dev-lead aprobó quitar `kitBudget`.
- **Fuente**: spec, «Topes de palabras» y «Enmiendas»; walkthrough §3; `.temp/…/words.mjs` sobre `dist/`
- **Dónde en el kit**: `skills/sdd-templates/templates/spec-template.md`, «Topes de palabras» («Mide cada uno antes de presentarla»); `skills/sdd-propose/references/coherence-pass.md` («each count of a check it fixes against what running it gives… on a copy with the change made»)
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué: medí el tamaño de hoy, pero la columna «Previsto» fue una estimación sin borrador; el encargo de arranque también lo pedía («Mide cada recuento sobre un borrador antes de fijarlo en la spec»). Además, `word-budget.test.ts` cuenta `dist/` con la inclusión expandida, y eso no estaba escrito en ningún documento (ya va en `tech-stack.md`)
- **Coste**: una parada del dev-lead y una enmienda (spec, «Enmiendas»)
- **Propuesta**: en la ayuda de «Topes de palabras», «Previsto» se mide sobre un borrador de lo que sale y de lo que entra, o se escribe `sin medir` y la decisión del dev-lead nombra el peor caso
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec que mueve frases a `includes/` WHEN se escribe «Topes de palabras» THEN «Previsto» lleva la medida de un borrador o `sin medir`, y la revisión técnica lo marca si no

### 4. La traducción renombró huecos que las baterías usaban como clave, y el repaso de coherencia no los buscó

- **Qué pasó**: la Task 3 tradujo `<copia literal del bloque «De código»…>` y `<ruta del paquete que imprime la receta>` en los encargos; `compose-axis.mjs`, siete `fixtures/axis-*.json` de `sdd-verify` y el `subject.mjs` de `sdd-implement` los usaban como clave con `split().join()`, que no falla, y esos encargos salían sin rellenar. Lo vieron los dos ejes de la revisión final (Important); la pasada de fix añadió las claves inglesas y que los scripts fallen con un hueco sin rellenar. Mi `Ruling:` de la Task 3 decía que el literal solo lo usaba el kit antiguo.
- **Fuente**: `node tests/batteries/sdd-verify/compose-axis.mjs --kit .temp/k11g --axis spec --scenario f3 …` → salida 0 con 3 huecos `<literal copy of…>`; informes de los ejes Spec (I1) y Código (Important 1)
- **Dónde en el kit**: `skills/sdd-propose/references/coherence-pass.md`, «What is retired or changes form» (un literal de plantilla, también un hueco)
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué del todo: busqué con `git grep` los dos títulos («Restricciones de código», «Cómo revisar»), no los huecos del mismo bloque
- **Coste**: un Important de cada eje y su arreglo en la pasada de fix (`tasks.md`, «Pasada de fix»)
- **Propuesta**: en «What is retired or changes form», que una traducción de un bloque liste cada literal del bloque, títulos y huecos `<…>`, y los busque con `git grep -F` en todo el repo
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec que traduce un bloque con huecos `<…>` WHEN se hace el repaso de coherencia THEN «Lo que se retira o cambia de forma» tiene una fila por hueco con cada fichero que lo usa como clave

### 5. Rojos del humo que también salen con el kit de `develop`

- **Qué pasó**: con el kit de `develop` (control, N=1) fallan igual: `pt1` de `sdd-implement` (PT-B: despacha un revisor «Revisar patch 0015» en un patch); `u1` (U1: para sin dejar la enmienda escrita en `spec.md`; U1r: sin el revisor `sonnet` de la enmienda); `h1` y `h2` (W: no dicen dónde está el workspace del plan ni qué guarda; `h1` A: `git add -A`); `c1` de `sdd-verify` (C1: sin ✋ al parar); `n1` de `sdd-init` (C2: quita el puerto sin decir que vive en `operations.md`); `d1` de `sdd-debugging` (C: atribuye la causa a `"type": "module"` y no al `GIT_INDEX_FILE` heredado)
- **Fuente**: `.docs/sdd/specs/20261109-143437-feature-0311-includes-and-checks/control2-*/out/` y `control-sdd-implement/out/pt1-1.tools.txt` → `>>> Agent: … · Revisar patch 0015`
- **Dónde en el kit**: `skills/sdd-implement/references/patch-flow.md` (pt1), la inclusión `deviation` en `skills/sdd-implement/SKILL.md` (u1), `skills/sdd-implement/SKILL.md` Overview (W), `skills/sdd-verify/references/closing-the-review.md` (c1), `skills/sdd-init/SKILL.md` (n1), `skills/sdd-debugging/SKILL.md` (d1)
- **Por qué el kit no lo evitó**: no localizado; son rojos de la base con N=1, sin RED propio
- **Coste**: 11 sujetos de control, ~6 $ (walkthrough §2, coste de sujetos)
- **Propuesta**: medir cada uno con n=2 en `develop` antes de abrir fila; `u1` toca la enmienda que trajo la 0322
- **Verificada**: sí — control con `KIT_DIR` de `git archive origin/develop:dist`
- **Criterio de aceptación**: GIVEN el kit de `develop` WHEN corren `pt1`, `u1`, `h1`, `h2`, `c1` de `sdd-verify`, `n1` de `sdd-init` y `d1` con n=2 THEN cada rojo se repite (fila) o no (ruido)

### 6. F1-C y M5 fallan 2 de 2 con la rama sin cambio en el texto que los gobierna

- **Qué pasó**: `f1` de `sdd-propose` (F1-C: avisos «Ahora: … Queda: …» que faltan en la revisión y el plan) y `m5` de `sdd-roadmap` (M5: la fila en Later, o una tabla sin brief ni ⏳) fallan en el humo y en la segunda medida con la rama, y pasan 1/1 con `develop`. El `SKILL.md` de `sdd-propose` de la rama es el de `develop` salvo un salto de línea (la frase de idioma en su línea), y el paso que fija la forma de la fila de `sdd-roadmap` no cambia
- **Fuente**: `humo-sdd-propose/out/f1-1`, `humo2-sdd-propose/out/f1-1`, `humo-sdd-roadmap/out/m5-1`, `humo2-sdd-roadmap/out/m5-1`; `diff` de `dist/skills/sdd-propose/SKILL.md` entre `origin/develop` y la rama
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` («Phase notice»); `skills/sdd-roadmap/SKILL.md` paso 4
- **Por qué el kit no lo evitó**: sin atribuir
- **Coste**: 4 sujetos, ~2 $
- **Propuesta**: medir F1-C y M5 con n=3 en `develop` y en la rama antes de atribuir; si la diferencia sigue, A/B de la frase de idioma en su línea frente a dentro del párrafo
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN `f1` y `m5` con n=3 en los dos kits WHEN se comparan THEN la tasa de la rama no es peor que la de `develop`

## Lo que hice por iniciativa propia

- Dejé una tanda de sujetos con la salida a fichero y `< /dev/null` tras el cuelgue: las siguientes no se colgaron.
- Un solo lector `sonnet` leyó las ~50 filas en prosa de 33 sujetos y después las del control y la segunda medida (`SendMessage` al mismo): ahorró contexto del hilo; 13,2 M tokens.
- Probé el pre-commit en un worktree de prueba con cinco casos reales (frase repetida, sin `SDD_UPSTREAM_DIR`, solo `.docs/`, solo `upstream.json`, clon sin el tag).
- Para juntar los dos commits de la Task 5 sin tocar los de después usé `git commit-tree` con el árbol del último; funcionó, pero no está en `commit-milestones.md`.

## Funcionó, no tocar

- Parar por desvío con la cifra medida y dos opciones: el dev-lead decidió en dos mensajes (quitar `kitBudget`).
- La ronda RED/GREEN/REFACTOR de `c2`: el GREEN 1/2 señaló una regla que solo vivía en la referencia, y subirla al paso dio 2/2.
- La segunda ronda de la review de spec cazó las cuentas de topes que no cuadraban.

## Menores

- `texts.txt` mezcla los mensajes de los subagentes con los del sujeto: la fila L se lee con `parent_tool_use_id` nulo — `tests/headless/extract.mjs`
- Siete fixtures de `sdd-verify` no traen la clave de «Flujos core…» (eje código: `f3`, `rm`, `sv1`) o de «ruta de research.md…» (eje spec: `f4`, `f5`, `f6`, `f6b`), y ese hueco sale literal; ya pasaba en la base — `tests/batteries/sdd-verify/fixtures/`
- Reescribí `tasks.md` con una regex dentro de `node -e` y el escapado de la shell la rompió; `tech-stack.md` ya pide editar con las herramientas de edición — regla existente, no aplicada
- La Task 5 quedó en dos commits porque su REFACTOR fue tras el commit de la task y antes de `sdd task done`; `commit-milestones.md` pide juntar antes — regla existente, no aplicada
