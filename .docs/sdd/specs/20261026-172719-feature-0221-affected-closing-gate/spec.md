---
id: 20261026-172719-feature-0221-affected-closing-gate
feature: 0221
title: El gate de cierre corre solo lo afectado
mode: full
profile: delegate
status: approved
created: 2026-10-26
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-26
---

# Spec — El gate de cierre corre solo lo afectado

🦆 Hoy el cierre repite la suite entera cada vez que la base trae algo de código, aunque no toque nada de lo que prueba la rama: en la 0211 fueron ~110 min de suite para un cambio de un módulo, y en la 0220 otros 29 min por dos números de un test. Con esto, tras integrar la base solo se repite la tarea del gate que lee lo que trajo la base («`kit:test` corrió 71/71; `cli:test-min` saltada: la base no toca sus inputs»). Si hay otra rama abierta o la base va por delante, la base se integra antes y la suite corre una sola vez. Y ningún gate filtrado vuelve a dar «verde» sin decir qué tareas corrieron: hoy la línea base de una rama nueva no corre ninguna y sale con 0.

## Capacidades

- Modificadas: `archive` — qué se repite tras el merge de sincronización, y cuándo la suite corre una sola vez, después de él
- Modificadas: `feature-flow` — la línea base de `sdd-worktrees` con un gate filtrado, y la repetición del gate en el cierre
- Modificadas: `verification` — la línea `Gate:` nombra cada tarea, corrida o saltada

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (tres requisitos de archive y feature-flow), tres capacidades · tamaño: ~90 líneas en 9 ficheros
- Mínimo razonable: ninguna — deja sin mirar por otro par de ojos si el predicado «otra rama abierta o base por delante» choca con la validación manual (lo cubre la decisión 4)
```

1. **Qué cuenta como cruce: el grafo de la herramienta del gate, no `git diff --name-only`.** Tras el merge de sincronización se repite el gate con su filtro de base apuntando al sha de la última suite en verde (`moon run <gate> --affected --base <sha>`): corre cada tarea cuyos inputs toca lo que trajo la base, y ninguna más. Descarto el cruce por ficheros: una base que cambia una función que llama la rama no comparte ningún fichero con ella y la rompe; los `inputs` de moon ya dicen qué lee cada suite (por eso `testInputs` incluye `skills/`). Descarto también la intersección «afectadas por la base ∩ afectadas por la rama»: ahorra solo las tareas que toca la base y no la rama, pide dos consultas y una cuenta a mano, y con `testInputs` tan anchos casi nunca ahorra nada.
2. **El predicado es observable en el comando**: «el gate de cierre filtra por una base» (`--affected --base <ref>`, `--changed <ref>`). Sin filtro (`node --test`), sigue la regla de hoy: el gate entero si la base trae cambios fuera de `.docs/` que no sean `*.md`. No añado un campo nuevo a §Testing: sería una pregunta más en la init y una migración para un dato que ya está en el comando.
3. **El escenario del roadmap pasa a granularidad de tarea**: la fila pedía «`cli:typecheck`, `cli:test` y los lentos de `test/tasks/` y `test/session/`»; desde la 0223 el gate solo tiene `cli:test-min` para la CLI, así que el THEN es «corren `cli:typecheck` y `cli:test-min`, no `kit:test-headless`». Afinar por fichero dentro de una tarea (`vitest --changed`) queda fuera: no lee las skills que leen los tests de la CLI.
4. **«Otra rama abierta o la base por delante» vale en cualquier modo de validación**, no solo en `field`: la suite es del agente, no de la persona. En `manual` el guion se presenta igual, y la suite corre tras el merge de sincronización, antes del merge. Predicado: `git worktree list` muestra otra rama `feature/*` o `patch/*`, o `git rev-list --count HEAD..<remote>/<merge.into>` > 0 tras `git fetch`. La suite que corre entonces es el gate tal cual lo declara el proyecto, sobre el merge de sincronización: es la de la validación y la de la base, y su sha va en el registro de la validación y en `--verified-at`.
5. **Qué lista el walkthrough: la línea `Gate:` por tarea, no la lista de ficheros cruzados.** Formato: `` Gate: `<comando>` → <tarea>: corrió <N>/<M> · <tarea>: saltada (<porqué>) ``, con N/M los tests en verde y los totales que da la tarea. El porqué de una saltada sale de la herramienta (`moon task <t>` frente a `moon query changed-files --base <ref>`). La lista de ficheros no evita ningún fallo que la línea por tarea no evite (Principio 1), y en una base grande es ruido.
6. **La tarea cuya definición cambia corre sin filtro**: si el cambio edita la definición de una tarea del gate (su `moon.yml`, el script del `package.json`, la línea del gate en §Testing), esa tarea corre sin `--affected` antes de declarar el gate, y su línea dice `(sin filtro: cambia su definición)`.
7. **La regla de la línea `Gate:` vive en una sola fuente, `sdd-verify`** («Common Failures»: un gate filtrado que sale con 0 no prueba nada por sí solo), y la citan el carril config de `sdd-propose`, el 4.1 del walkthrough, la línea base de `sdd-worktrees` y el paso 6 de `sdd-archive`.
8. **Línea base en lite y en full, no solo en lite**: con un gate filtrado corre sin el filtro solo las tareas cuyos inputs incluyen ficheros del Scope de la spec; las demás, `saltada (fuera del Scope de la spec)`. Lo comprobé en esta rama: `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop` sobre una rama recién abierta da «No tasks affected by changed files» y `exit=0` en 1,6 s, así que hoy la línea base no corre nada en ningún modo. Sin filtro de base, el gate entero, como hoy.
9. **Coste de las pruebas (Art. I)**: cuatro escenarios RED/GREEN con sujetos headless Sonnet —s1 base que solo trae un test, s2 otra rama abierta y base por delante, s3 gate filtrado en el carril config con una tarea saltada y otra cuya definición cambia, s4 línea base en rama nueva—, RED n = 1 y GREEN n = 2: 12 sujetos, ~6 $ y ~150 min de sujetos, por tandas de 3. Si se pasa, para y decide el dev-lead.
10. **Lo que sale (Art. I, «una pieza entra, otra sale»)**: la regla «la suite completa otra vez si la base trae código» del paso 6 de `sdd-archive` y de «The suite again» de `merge-recipe.md`, y el informe «Tests passing (<N> tests, 0 failures)» de `sdd-worktrees`, que pasa a ser la línea `Gate:`.
11. **Las frases con Pester**: si una edición rompe un Pester de frases de `ArchiveSkill.Tests.ps1` o de otra skill, lo actualizo en la misma task solo si la 0226 aún no lo ha borrado al integrar la base; no porto nada a Vitest (es de la 0226).
12. **Repaso de coherencia**: `sdd capability merge` sobre una copia de `.docs/sdd` → quita 1 y añade 2 requisitos en `archive`, sustituye «Límites», sustituye 2 en `feature-flow` y añade 1 en `verification`; `sdd capability check` → «Capacidades válidas: 20».
- Política de modelos: sin revisores de la spec · revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica (no hay código ejecutable nuevo) · sujetos headless sonnet por tandas de 3 · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar

### Decisiones tomadas con el dev-lead

- Es una feature nueva — «Feature nueva» (2026-10-26, al triar el ticket de la 0211)
- Tras integrar la base se repite solo lo que afecta lo que trajo; con otra rama abierta o la base por delante, la base se integra antes de la primera suite y corre una sola — «Sí, las dos → 0221» (2026-10-26, al triar el ticket de la 0220)
- La línea `Gate:` nombra cada tarea como `corrió N/M` o `saltada` con su porqué comprobado con la herramienta, y la tarea cuya definición cambia tiene que correr — «Sí, así» (2026-10-26, al triar el ticket de la 0223)

## Intent

En la 0211 un lite de un módulo corrió el gate completo cinco veces (~110 min) y lo que cruzaba las ramas daba verde en 1 min 48 s; en la 0220 la suite se iba a repetir 29 min por dos números de `WordBudget.Tests.ps1`, y además se integró la base después de la primera suite, lo que obligaba a otra. En la 0223 un gate con `--affected` salió con 0 sin correr `kit:test`, que escondía dos rojos. El éxito: tras la base integrada solo corre lo que lee lo que trajo; con otra rama abierta, una sola suite por cierre; y ninguna línea `Gate:` dice verde sin nombrar qué corrió. Fracasa si, para ahorrar, se salta una tarea que lee lo que cambió: el filtro es el de la herramienta, nunca un juicio del agente.

## Scope

- Entra: `skills/sdd-archive/SKILL.md` pasos 1 y 6 · `skills/sdd-archive/references/merge-recipe.md` «Integrated base» · `skills/sdd-start-feature/SKILL.md` paso 7 (la suite de la validación) · `skills/sdd-worktrees/SKILL.md` «Step 3» y su informe · `skills/sdd-verify/SKILL.md` «Common Failures» · `skills/sdd-propose/SKILL.md` §Config lane paso 4 · `skills/sdd-templates/templates/walkthrough-template.md` 4.1 · las capacidades `archive`, `feature-flow` y `verification` · los escenarios de prueba en `tests/` · la migración de la próxima release («sin cambios en el proyecto»).
- No entra: afinar dentro de una tarea (`vitest --changed`) · la caché de moon que dio `cached` con la cifra vieja (fila de deuda aparte, hallazgo 2 de la 0211) · `sdd merge` que no ofrece `--sync` en un conflicto de registros (hallazgo 2 de la 0223) · cambiar el gate de este repo · un verbo nuevo de la CLI · portar Pester (0226, 0227).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «The full suite runs again only if the base brought changes outside `.docs/` that aren't `*.md`» | `skills/sdd-archive/SKILL.md` paso 6 | Scope: pasa a «repite el gate con su base en el sha de la última suite en verde; sin filtro de base, la regla de hoy» |
| «**The suite again**: only if, since the sha of the validation's suite…» | `skills/sdd-archive/references/merge-recipe.md` «Integrated base» | Scope: la misma regla nueva |
| Requisito «El cierre integra la base tras su commit y repite la suite solo si la base trae código» | `capabilities/archive.md` | delta: `REMOVED` + `ADDED` con título nuevo (el título deja de ser verdad) |
| Cláusula de la suite en «Límites» | `capabilities/archive.md`, Reglas | delta: «Reglas de la capacidad», `Límites` entera |
| AND «el cierre de `sdd-archive` solo lo repite tras su merge de sincronización, y solo si la base trajo cambios fuera de `.docs/`…» | `capabilities/feature-flow.md`, «El gate de cierre se ejecuta una vez» | delta: `MODIFIED` |
| AND «la baseline ejecuta `node --test`, el gate de cierre del proyecto…» | `capabilities/feature-flow.md`, «El worktree de la implementación lo prepara `sdd-worktrees`» | delta: `MODIFIED` (se mantiene y se añade el AND del gate filtrado) |
| Informe `Tests passing (<N> tests, 0 failures)` | `skills/sdd-worktrees/SKILL.md` «Report» | Scope: pasa a la línea `Gate:` |
| `` Gate: `<comando>` → <resultado> `` | `skills/sdd-propose/SKILL.md` §Config lane paso 4; `capabilities/routing.md` «Un config en una rama de feature se fusiona al terminar» (nombra «su línea `Gate:`», sin formato) | Scope para la skill; `routing` no cambia: no fija el formato |
| «Suite completa: `<comando>` → <resultado>» | `walkthrough-template.md` 4.1 | Scope: lleva la línea `Gate:` por tarea |

- Filas que implementa: 0221 → solo `roadmap.md` (fila 28; la cierra `sdd-archive`); las cuatro de deuda «El gate completo corre aunque la base no se cruce con la rama», «Un gate con `--affected` da verde sin correr una de sus tareas», «La suite completa se repite tras el merge de sincronización por un cambio que no la afecta» y «Con otra rama abierta, la base se integra después de la primera suite y obliga a otra» → solo `roadmap.md` (filas 511, 512, 514 y 527; prefijo de saldada en el cierre). Comprobado con `grep -rn '0221' skills .docs/sdd/capabilities .docs/sdd/tech-stack.md .docs/sdd/architecture.md`: sin otras menciones.

## Approach

Una regla y tres sitios. La regla, en `sdd-verify`: la línea `Gate:` nombra cada tarea, corrida (N/M) o saltada (con el porqué de la herramienta), y la tarea cuya definición cambia corre sin filtro. Los sitios: el paso 6 de `sdd-archive` y su receta repiten el gate con la base en el sha de la última suite en verde; el paso 7 de `sdd-start-feature` y el paso 1 de `sdd-archive` no corren la suite si hay otra rama abierta o la base va por delante, y la corre el paso 6 una sola vez sobre el merge de sincronización; `sdd-worktrees` corre, con un gate filtrado, las tareas del Scope sin el filtro. Todo es texto de skill; ningún verbo nuevo.

## Dónde se prueba

- Repetición tras la base (s1) y suite única con otra rama abierta (s2): batería headless de `sdd-archive`, como los escenarios de `tests/closing-verification-*.md`, con un repo de fixture con gate `moon` filtrado, una rama de cierre y una base que avanza.
- Línea `Gate:` por tarea en el carril config (s3): tramo de la batería de `sdd-propose`, como `tests/sdd-propose-0160-*.md`.
- Línea base filtrada (s4): humo de `sdd-worktrees`, como `tests/sdd-worktrees-green.md`.
- Los deltas: `sdd capability merge` sobre una copia y `sdd capability check` en el cierre.

## Términos y ADR

- Términos resueltos: **gate filtrado** — el gate de cierre cuyo comando filtra por una base (`--affected --base <ref>`); **tarea saltada** — una tarea del gate que el filtro no corrió, con su porqué de la herramienta
- ADR candidatas: ninguna — es aplicar el filtro que ya eligió la 0223; la alternativa del cruce por ficheros queda en la decisión 1

## Delta de comportamiento

### Capacidad: `archive`

**REMOVED — El cierre integra la base tras su commit y repite la suite solo si la base trae código**
- motivo: lo sustituye «El cierre integra la base tras su commit y repite solo lo que afecta lo que trae la base»: con un gate filtrado ya no se repite la suite entera por cualquier código de la base

**ADDED — El cierre integra la base tras su commit y repite solo lo que afecta lo que trae la base**
- GIVEN la 0081 con la suite en verde en `a1b2c3d`, en la validación, un gate de cierre `moon run app:test api:test --affected --base develop`, y `origin/develop` que avanzó con el merge de la 0080, que solo cambia `src/api/rooms.js` (input de `api:test`, no de `app:test`)
- WHEN el cierre ha hecho su commit de cierre
- THEN hace `git fetch` y `sdd merge --sync --project-root <worktree>`, que integra `origin/develop` en la rama como último commit, y corre `moon run app:test api:test --affected --base a1b2c3d` sobre el resultado: corre `api:test` y no `app:test`
- AND el 4.1 del walkthrough lleva `` Gate: `moon run app:test api:test --affected --base a1b2c3d` → api:test: corrió 212/212 · app:test: saltada (la base no toca sus inputs: `moon task app:test`) ``
- AND el merge final lleva `--verified-at <sha del merge de sincronización>`
- AND si la 0080 solo hubiera cambiado `.docs/sdd/roadmap.md`, no corre nada y el merge lleva `--verified-at a1b2c3d`
- AND con un gate sin filtro de base (`node --test`), corre el gate entero (E2E incluidos si el proyecto los declara) si la base trae cambios fuera de `.docs/` que no sean `*.md`
- AND con conflicto en `roadmap.md`, `changelog.md` o un add/add de dos requisitos al final de una capacidad, `--sync` lo resuelve y el cierre sigue; con `base: conflicto en src/slots.js`, el cierre queda «No terminado» para una persona

**ADDED — Con otra rama abierta o la base por delante, la suite corre una sola vez, tras el merge de sincronización**
- GIVEN `validation.mode: field`, la 0081 implementada, `git worktree list` que muestra `feature/0083-room-photos`, y `git rev-list --count HEAD..origin/develop` que da 2 tras `git fetch`
- WHEN la validación y el cierre de la 0081
- THEN el smoke por THEN corre y la suite no corre antes del commit de cierre
- AND tras el commit de cierre y `sdd merge --sync`, el gate de cierre corre una sola vez, tal como lo declara el proyecto, sobre el merge de sincronización
- AND `Validación en campo:` dice que la suite corrió sobre el merge de sincronización, y el merge final lleva `--verified-at` con su sha, que da también el mensaje final
- AND sin otra rama abierta y con la base al día (`git rev-list --count` da 0), la suite corre en la validación como hasta ahora
- AND con `validation.mode: manual`, el guion se presenta igual, y la suite corre tras el merge de sincronización, antes del merge

**Reglas de la capacidad**
- **Límites**: tope de palabras de `sdd-archive`, `SKILL.md` 3.920 y total 8.000 (`tests/WordBudget.Tests.ps1`); el gate de cierre corre una vez por árbol: en la validación o, con otra rama abierta o la base por delante, solo sobre el merge de sincronización; tras el merge de sincronización se repite solo lo que afecta lo que trae la base: con un gate filtrado, el gate con su base en el sha de la última suite en verde; sin filtro, el gate entero si la base trae cambios fuera de `.docs/` que no sean `*.md`; el informe de rojo lleva las últimas 20 líneas; una suite E2E que pasa de su «Presupuesto E2E», o sin presupuesto, una suite de más de 10 minutos, va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` dentro del `NOTICE` y el anexo de procedencia de `sdd-archive` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0)

### Capacidad: `feature-flow`

**MODIFIED — El gate de cierre se ejecuta una vez** (antes: "y solo si la base trajo cambios fuera de `.docs/` que no sean `*.md`")
- GIVEN una constitution que pide el gate completo en verde al cerrar cada task
- WHEN se escribe el plan y se despacha una task de solo frontend
- THEN el gate completo aparece una sola vez, en la validación final, y lo ejecuta el hilo principal
- AND no aparece en «De código» ni en la verificación de esa task, y el encargo de su implementador le dice que ejecute su verificación y no la suite completa
- REMOVED AND el cierre de `sdd-archive` solo lo repite tras su merge de sincronización, y solo si la base trajo cambios fuera de `.docs/` que no sean `*.md`
- AND tras su merge de sincronización, el cierre de `sdd-archive` repite solo lo que afecta lo que trajo la base, y con otra rama abierta o la base por delante la validación no lo corre: lo corre el cierre una sola vez sobre el merge de sincronización

**MODIFIED — El worktree de la implementación lo prepara `sdd-worktrees`**
- GIVEN la 0010 con la spec y el plan aprobados, abierta en un worktree que creó Orca en la rama `feature/0010-cancel`, y un proyecto con `.docs/sdd/environments.md` y `.docs/sdd/operations.md` §Testing `Gate de cierre: node --test`
- WHEN `sdd-implement` hace su preparación
- THEN invoca `sdd-worktrees`, que detecta que ya está en un worktree enlazado, lo dice con su rama, y no crea otro
- AND ejecuta `env:setup` después de instalar las dependencias, y los encargos de implementador dicen dónde está `.sdd-env.json`
- AND la baseline ejecuta `node --test`, el gate de cierre del proyecto; sin gate declarado en `operations.md`, `tech-stack.md` ni la constitution, lo dice y pregunta qué ejecutar
- AND con un gate filtrado (`moon run app:test api:test --affected --base develop`), la baseline corre sin el filtro solo las tareas cuyos inputs incluyen ficheros del Scope de la spec (`moon run api:test` si el Scope solo toca `src/api/`), y su informe es la línea `Gate:` con `app:test: saltada (fuera del Scope de la spec)`; nunca da la baseline por buena con un gate que no corrió ninguna tarea
- AND si la baseline falla, corre el mismo comando en un worktree temporal desanclado de la rama de integración; si también falla allí, busca las primeras líneas de error en la deuda del proyecto y cita la fila o abre una en «Por triar»; después informa de los fallos con ese veredicto y pregunta si sigue o investiga
- AND ningún fichero de `skills/` invoca `superpowers:using-git-worktrees` ni `superpowers:dispatching-parallel-agents`

### Capacidad: `verification`

**ADDED — La línea `Gate:` nombra cada tarea, corrida o saltada**
- GIVEN un cambio en carril config que edita la definición de `app:test` en `moon.yml`, con el gate `moon run app:test api:test --affected --base develop`, que sale con 0 y `Tasks: 0 completed, 2 skipped`
- WHEN el agente va a declarar el gate y commitear
- THEN corre `moon run app:test` sin `--affected`, porque cambia su definición, antes de commitear
- AND la línea del commit es `` Gate: `moon run app:test api:test --affected --base develop` → app:test: corrió 98/98 (sin filtro: cambia su definición) · api:test: saltada (ningún fichero cambiado casa con sus inputs: `moon task api:test`) ``
- AND nunca escribe `→ verde` ni da el gate por bueno solo por su código de salida
- AND la misma forma, una entrada por tarea del gate, vale en el 4.1 del walkthrough, en el §4 de `patch.md` y en el informe de la baseline de `sdd-worktrees`

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-archive` `SKILL.md` | 3.941 / 3.920 (×1,25 = 4.900) | 959 | sin cambio (previsto ~+40) |
| `sdd-archive` total | 8.090 / 8.000 (×1,25 = 10.000) | 1.910 | sin cambio (previsto ~+40) |
| `sdd-worktrees` | 1.278 / 1.300 (×1,25 = 1.625) | 347 | sin cambio (previsto ~+70) |
| `sdd-start-feature` total | 11.322 / 11.322 (×1,25 = 14.152) | 2.830 | sin cambio (previsto ~+50) |
| `sdd-propose` `SKILL.md` | 5.281 / 5.250 (×1,25 = 6.562) | 1.281 | sin cambio (previsto ~+20) |
| `sdd-verify` total | medir en la task | — | sin cambio (previsto ~+60) |
| `sdd-templates` total | medir en la task | — | sin cambio (previsto ~+15) |
| Kit | 98.533 / 91.328 (×1,25 = 114.160) | 15.627 | sin cambio |

## Enmiendas

- 2026-10-26 — `Validación en campo:` ya no cita el sha del merge de sincronización: dice que la suite corrió sobre él, y el sha va en `--verified-at` y en el mensaje final — el walkthrough entra en el commit de cierre, antes del sync, y no puede llevar un sha posterior (GREEN `g6`, 0/2 en ese punto) — Task 3 — aprobada (opción «Apruebo»)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-26 | aprobada (opción «Apruebo») |
