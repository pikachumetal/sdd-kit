---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261026-172719-feature-0221-affected-closing-gate
task: 0221
mode: full
date: 2026-10-27
---

# Ticket para el kit — feature 0221: el gate de cierre corre solo lo afectado

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-propose`, `sdd-start-feature`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-feedback` (las del working tree, contrastadas con `Read` tras reanudar la sesión desde la caché)
- Proyecto: el propio kit (skills en Markdown, CLI en TypeScript, Vitest y Pester, moon), un dev-lead, tres ramas abiertas a la vez
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (eje Spec y re-revisión), Sonnet 5.5 (eje Código); 24 sujetos headless Sonnet
- Coste en reloj: 2,45 h de esfuerzo frente a 4,5 h estimadas, con 19,54 h de reloj de sesión (incluye la noche de un cuelgue del PC); el cierre gastó ~2 h en gates
- Coste en tokens: 67.665.174 del hilo y 5.418.474 de subagentes; 26,91 $ de sesión y 9,42 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La regla de la propia 0221 repetía tras el sync todo lo que tocó la base, y corrió dos veces un test de 25 min que la rama no tocaba

- **Qué pasó**: la decisión 1 de la spec descartó la intersección rama ∩ base («casi nunca ahorra nada») y el paso 6 repetía, tras el sync, las tareas cuyos inputs tocó la base. En el cierre de la propia 0221, la base trajo la 0227, que cambió el lanzador de sujetos, y `kit:test-headless` corrió dos veces (24 min 54 s, y ~34 min hasta que lo paré), en rojo con carga, sin que la rama lo tocara. El dev-lead: «PORQU ENO LO HACEMOS YA!!!!!!!!!». La intersección (`kit:test`, `cli:typecheck`, `cli:test-min`) dio verde en 5 min 47 s.
- **Fuente**: `spec.md` de la 0221, decisión 1 y «Enmiendas»; commit `0622a9ac`; `walkthrough.md` §3.
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md` paso 6 y `references/merge-recipe.md`, «The suite again» (ya corregidos en `0622a9ac`).
- **Por qué el kit no lo evitó**: la decisión era mía, y la prueba (`g5`) solo medía una base que tocaba lo mismo que la rama. Ningún escenario tenía una base que tocara una tarea que la rama no toca.
- **Coste**: ~1 h de gates (respaldo: walkthrough §3 y `0622a9ac`).
- **Propuesta**: un escenario de la batería de `sdd-archive` con una base que solo toca una tarea que la rama no toca, y que mida que esa tarea no corre.
- **Verificada**: sí — aplicado en el cierre de la 0221 (5 min 47 s frente a 25 min).
- **Criterio de aceptación**: GIVEN una rama que toca `bookings:test` y una base que solo toca `rooms:test` WHEN el cierre integra la base THEN no corre ninguna tarea y la línea `Gate:` dice `rooms:test: saltada (solo la toca la base)`.

### 2. Con otra rama abierta, el gate del cierre corrió antes de que esa rama fusionara y hubo que repetirlo dos veces

- **Qué pasó**: con la 0226 y la 0227 abiertas, el cierre integró la base y corrió el gate filtrado (27 min 37 s, verde sobre `8ef39d59`). Al ir a fusionar, la 0226 ya estaba en `develop`: `sdd merge` paró con `merge: conflicto en .docs/sdd/capabilities/archive.md, .docs/sdd/tech-stack.md, tests/ArchiveSkill.Tests.ps1, tests/ClosingVerification.Tests.ps1.` Tras resolverlo, el gate siguiente esperó ~21 min el cerrojo de suites, que tenía la 0227 con su propio gate de cierre. El dev-lead: «llevas 30min!!!» y «estais los dos esperando la nada. Hablaaros y decidi quein va!». Por `SendMessage`, la 0227 fue primero; al fusionar, otro conflicto (`base: conflicto en .docs/sdd/tech-stack.md.`) y otro gate.
- **Fuente**: salidas de `sdd merge` y `sdd merge --sync` de la sesión; `.git/sdd-tests.lock` → `"branch":"feature/0227-behavior-tests-to-vitest"…"since":"2026-10-27T16:00:28.834Z"`; `walkthrough.md` de la 0221 §4.1.
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md` paso 0.3 (aviso «Abiertas a la vez») y paso 6.
- **Por qué el kit no lo evitó**: el aviso de otras ramas abiertas no cambia ningún paso. La 0221 ya integra la base antes de la primera suite, pero eso no evita que otra rama fusione mientras esa suite corre. Nadie coordina qué cierre corre primero, y el cerrojo solo dice quién lo tiene, no cuándo acaba.
- **Coste**: un gate de 27 min invalidado, ~21 min de espera en el cerrojo y dos conflictos resueltos a mano (sin respaldo en commit, salvo los merges `cda69036` y `d23afd39`).
- **Propuesta**: con otra rama abierta en cierre (su cerrojo de suites tomado, o un aviso por `SendMessage`), el paso 6 pregunta a esa sesión antes de correr el gate: si va a fusionar en minutos, se espera a su merge y se integra la base una sola vez. El mensaje de espera del cerrojo dice además qué comando corre su dueño y desde cuándo.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN dos ramas en cierre a la vez y la otra con el cerrojo de suites WHEN el cierre llega al paso 6 THEN no corre su gate antes del merge de la otra: se coordina con ella y corre una sola vez, tras integrar su merge.

### 3. `sdd merge --sync` aborta todo el merge cuando choca un fichero que no es registro, y la resolución a mano pierde la unión por id del roadmap

- **Qué pasó**: los dos syncs abortaron por conflictos en `tech-stack.md`, una capacidad y dos Pester borrados por la otra rama. Con `git merge --no-commit` a mano, `roadmap.md` y `estimation-log.md` también salieron en conflicto: filas 0224 y 0221 contiguas, editadas por las dos ramas. El primer commit del merge falló en el pre-commit con `roadmap.md: línea 104: fila fuera de una tabla con cabecera y separador`, porque quedó un marcador sin ver.
- **Fuente**: salida de `sdd roadmap check` en la sesión; `cli/src/merge/registries.ts` (`KEYED_REGISTRIES`).
- **Dónde en el kit**: `skills/sdd-archive/references/merge-recipe.md` («Integrated base»: `base: conflicto en` → «a person resolves it»); `cli/src/merge/sync.ts`.
- **Por qué el kit no lo evitó**: `--sync` resuelve los registros solo si resuelve todo; si algo choca, hace `git merge --abort` y el registro vuelve al merge de git.
- **Coste**: ~15 min de resolución y un commit rechazado (sin respaldo).
- **Propuesta**: con conflictos fuera de los registros, `--sync` deja el merge a medias con los registros ya unidos por id y lista solo el resto, en vez de abortar.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una rama y una base que editan filas contiguas del roadmap y la misma línea de `tech-stack.md` WHEN `sdd merge --sync` THEN el roadmap queda unido y solo `tech-stack.md` queda en conflicto.

### 4. La copia del kit para los sujetos no llevaba `cli/`, y una tanda RED entera no midió nada

- **Qué pasó**: saqué la copia con `git archive b999c87d skills .claude-plugin`, como dice el mensaje de la guarda. Los 4 sujetos del RED no pudieron ejecutar `sdd merge` («El CLI del kit … sigue sin existir»), y la tanda se descartó.
- **Fuente**: `tests/headless/lib.sh:53` → `sácala con git archive <commit> skills .claude-plugin`; `red-invalid` de la sesión (texto de `g5-1`).
- **Dónde en el kit**: `tests/headless/lib.sh`, `subject_init` (mensaje de la guarda); `.docs/sdd/tech-stack.md` «Entrega de la skill al sujeto» (la 0221 añadió la línea).
- **Por qué el kit no lo evitó**: la guarda comprueba que no haya `.docs/` ni `tests/`, pero no que esté `cli/bin/sdd.js`, que las skills invocan.
- **Coste**: 4 sujetos, 1,28 $ (respaldo: `tests/affected-gate-red.md`).
- **Propuesta**: el mensaje dice `git archive <commit> skills .claude-plugin cli hooks`, y `subject_init` aborta si falta `cli/bin/sdd.js` en la copia.
- **Verificada**: sí — reproducido en la sesión (tanda descartada) y contrastado con `tests/headless/lib.sh:53`.
- **Criterio de aceptación**: GIVEN una copia del kit sin `cli/` WHEN `subject_init` THEN aborta con el comando completo de `git archive`.

### 5. La previsión de coste de la spec no contaba la tanda de REFACTOR ni los controles, y la prueba pidió tres paradas por dinero

- **Qué pasó**: la spec preveía 12 sujetos y ~6 $; acabaron en 24 sujetos y 9,42 $. Hubo tres paradas por coste: otra tanda de `g5` y `g6`, un sujeto de control y la medición tras la revisión final.
- **Fuente**: `spec.md` de la 0221, decisión 9; `tests/affected-gate-green.md`.
- **Dónde en el kit**: constitution Art. I («la previsión de coste… una tanda más de REFACTOR incluida»); `skills/sdd-templates/templates/spec-template.md` (sin hueco para la previsión).
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué: mi previsión era RED más GREEN. La plantilla no tiene hueco que separe RED, GREEN, REFACTOR y controles.
- **Coste**: tres paradas del dev-lead (sin respaldo en minutos).
- **Propuesta**: hueco «Previsión de coste (Art. I)» en la plantilla de spec, con filas RED, GREEN, una tanda de REFACTOR, controles y medición tras la revisión final.
- **Verificada**: sí — contrastado con la constitution, Art. I.
- **Criterio de aceptación**: GIVEN una spec que edita una skill con batería WHEN se escribe THEN la previsión lleva las cinco filas y su suma.

### 6. La spec pidió en el walkthrough un sha que nace después del commit de cierre

- **Qué pasó**: dos ANDs aprobados pedían el sha del merge de sincronización en `Validación en campo:` y la línea `Gate:` del sync en el 4.1. El walkthrough entra en el commit de cierre, antes del sync. Ningún sujeto pudo cumplirlo (0/2), y hubo dos enmiendas.
- **Fuente**: `spec.md` de la 0221, «Enmiendas»; `tests/affected-gate-green.md` (g6, G6c 0/2).
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 4, repaso de coherencia.
- **Por qué el kit no lo evitó**: el repaso de coherencia no comprueba el orden temporal entre un THEN y el artefacto donde se registra.
- **Coste**: dos paradas del dev-lead y dos rondas de sujetos que no podían pasar (sin respaldo en cifra).
- **Propuesta**: en el repaso de coherencia, para cada THEN que pide escribir algo en un artefacto commiteado, comprobar que el dato existe cuando se commitea ese artefacto.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec cuyo THEN pide en el walkthrough el sha del merge de sincronización WHEN pasa el repaso de coherencia THEN lo marca y lo mueve al mensaje final o a `--verified-at`.

## Menores

- Los tests del lanzador en Vitest (`caps-and-locks`, `ports`) fallan con la suite entera y pasan solos (el de dos `run.sh` tardó 1270 s en las dos pasadas); fila de deuda abierta en el cierre.
- `test/merge/cleanup.slow.test.ts` falló una vez con `unable to migrate objects to permanent storage` y pasó solo (fila de la 0204).

- La rúbrica G6a de la batería de `sdd-archive` contaba la verificación de un fichero de la task como «suite»; se desempató en la batería.
- El molde `reservas-gate-base` del RED metía una fila del roadmap pegada a la 0010, y `--sync` chocó; el GREEN la quitó.
- La línea base de la rama dio un rojo de carga (`afterAll` de `hotfix.slow.test.ts`); el contraste lo resolvió con la regla, y queda una fila de intermitentes.
