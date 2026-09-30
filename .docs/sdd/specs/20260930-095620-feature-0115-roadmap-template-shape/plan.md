---
id: 20260930-095620-feature-0115-roadmap-template-shape
feature: 0115
title: Plan de implementación — El roadmap en la forma de la plantilla
spec: ./spec.md
status: approved
created: 2026-09-30
---

# Plan de implementación — El roadmap en la forma de la plantilla

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native** — tres de las cuatro tasks son del hilo por fuerza: la campaña GREEN, los documentos y el gate de la migración con el dev-lead. Solo la Task 1 es código, y cabe en una sesión.
2. **Modelo** — la sesión (Opus 5.5) implementa las cuatro tasks. El dev-lead aprobó la spec sin la parada para bajar a Sonnet. Revisor final de rama: `sdd-kit:effort-high` + `opus`.
3. **Orden** — validador, migración con su GREEN, principio en los documentos y, al final, este roadmap. Así el roadmap se migra con el texto ya medido.
4. **El test del roadmap del repo cambia en dos pasos** — en la Task 1 sigue comprobando solo la estructura de tablas, a través del script. En la Task 4, con el roadmap migrado, exige `Roadmap válido`. Con el orden inverso el pre-commit bloquearía tres tasks.
5. **Los tests del validador no llevan `Slow`**, salvo el que lanza un `pwsh` hijo: ejecutan el script en el mismo proceso sobre cadenas en un directorio temporal, en décimas de segundo. El del roadmap del repo tiene que correr en el pre-commit (decisión 10 de la spec).
6. **Sin roadmap, el script escribe `Sin roadmap que validar` y sale con 0**, como `Test-Capabilities.ps1` sin capacidades.
7. **El estado se comprueba por su comienzo**: `⏳`, `🔄`, `✅`, `🧪 validación diferida a` o `⏸️ aparcada:`. Lo que sigue (un enlace, un disparador) es libre.
8. **Bajo «Releases cerradas» el script solo lee las cabeceras `### v…`** y el texto de cada subsección para buscar ids. No valida tablas ahí.
9. **Riesgo alto**: el gate de la Task 4 mueve unas 25 decisiones y poda más de 60 filas. Mitigación: `roadmap-before.md`, la tabla de destinos aprobada por el dev-lead y el validador al final.
10. **Coste estimado** — ~2,5 h de implementación; ~2 $ de sujetos (5 de GREEN más 2 de reserva, techo 10 $ para la campaña entera); revisor final ~130k tokens.
11. **Review Focus**: 6 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: dejar `roadmap-template.md`, `Test-Roadmap.ps1` y `migrations/v2.3.0.md` de forma que cualquier roadmap tenga una sola forma comprobable, y migrar el de este repo.

**Architecture**: un script PowerShell sin dependencias que lee `roadmap.md` línea a línea y escribe una línea por regla incumplida. La migración es prosa con pasos-predicado que usa el script como predicado de entrada y como verificación. La plantilla es la fuente de las reglas.

**Tech Stack**: PowerShell 7, Pester ≥ 5, Markdown, `tests/headless/` para los sujetos.

**Spec**: `./spec.md`

**Ejecución**: native, porque tres de las cuatro tasks son del hilo (campaña, documentos y un gate con el dev-lead) · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende; se conserva el porqué no deducible. El bloque de ayuda de `Get-Help` no es un comentario.
- Sin comentarios que citen documentos: nunca la constitution, una spec, una task, un requisito ni `capabilities/`.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, ayuda) en castellano con tildes.
- El revisor marca el incumplimiento como Important, salvo un umbral numérico superado en una unidad, que es Minor.
- Scripts portables: sin APIs exclusivas de Windows ni rutas con `\` fijas.
- Un script cuya salida se pega fija `[Console]::OutputEncoding` en UTF-8 y lo restaura en un `finally`.
- Secciones literales del roadmap, en este orden: `Próximo`, `Release <versión>` (cero o más), `Backlog`, `Deuda técnica`, `Patches`, `Releases cerradas`.
- Cabeceras literales: «Próximo» `| # | Ítem | Estado |` · release `| id | Feature | Origen | Ficheros que toca | Estado |` · «Backlog» `| # | Ítem | Origen |` · «Deuda técnica» `| Ítem | Impacto | Destino |` · «Patches» `| Fecha | Id | Descripción |`.
- Todo mensaje de fallo empieza por `roadmap.md: `; el éxito es `Roadmap válido`.

### De proceso

- Política de modelos: la del Art. IV. Revisor final con `sdd-kit:effort-high` + `opus`; sujetos headless con Sonnet.
- Campaña: 9 sujetos en total y techo de 10 $ (`SUBJECT_CAP=9`, `COST_CAP=10`); van 2 sujetos y 0,61 $.
- Commits: tipo y scope en inglés, título y cuerpo en castellano, con el trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Un commit por hito.
- Nunca `--no-verify`. La suite completa se lanza desde la herramienta PowerShell.

## Review Focus

- Un `roadmap.md` con finales de línea CRLF → el mismo resultado que con LF · Task 1, `da el mismo resultado con CRLF`
- Una celda con `\|` escapado (el `grep` del formato de cierre) → no cuenta como separador de celda · Task 1, `no cuenta la barra escapada como celda`
- Una subsección `### …` fuera de «Releases cerradas» → fallo `subsección «<título>» fuera de «Releases cerradas»` · Task 1, `rechaza una subsección fuera de Releases cerradas`
- Ids que no son de cuatro cifras (`ids.mode: tracker`, `AB-4512`) en filas y en el resumen de una release → la regla de la feature publicada funciona igual y nada revienta · Task 1, `reconoce un id de gestor publicado`
- Una tabla dentro de «Releases cerradas» → no se valida ni da fallo · Task 1, `no valida tablas bajo Releases cerradas`
- `-Path` sin `roadmap.md` → `Sin roadmap que validar` y salida 0 · Task 1, `sin roadmap sale con 0`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y un fichero de migración; sin configuración ni modos.
- [x] **YAGNI gate**: sin fichero de volcado en los proyectos, sin comprobación de la línea de validaciones, sin niveles de aviso (eso es de la 0123).
- [x] **Brownfield gate**: el script sigue el patrón de `Test-Capabilities.ps1`; la migración, el de `v2.0.0.md`.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en la Task 2), Art. V (migración con `**Escribe**:`), Art. VIII (plantilla única), Art. X (restricciones de código).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/scripts/Test-Roadmap.ps1` — el validador.
- `tests/Test-Roadmap.Tests.ps1` — sus tests.
- `skills/sdd-init-brownfield/references/migrations/v2.3.0.md` — la migración.
- `tests/roadmap-shape-green.md` — evidencia del GREEN.
- `.docs/sdd/specs/20260930-095620-feature-0115-roadmap-template-shape/green/subject.sh` y `green/out/` — lanzador y salidas.
- `.docs/sdd/specs/20260930-095620-feature-0115-roadmap-template-shape/roadmap-before.md` — el roadmap anterior, literal.
- `.docs/sdd/specs/20260930-095620-feature-0115-roadmap-template-shape/migration-gate.md` — la tabla de destinos que aprueba el dev-lead.

**Modificar**:

- `skills/sdd-templates/templates/roadmap-template.md` — bloques de ayuda por sección.
- `skills/sdd-templates/SKILL.md` — fila del script en la tabla de scripts.
- `tests/RoadmapStructure.Tests.ps1` — llama al script.
- `.docs/sdd/constitution.md` — Art. XI.
- `.docs/sdd/architecture.md` — tabla de documentos.
- `.docs/sdd/tech-stack.md` — referencias de vigilancia y nota del validador.
- `CLAUDE.md` — índice.
- `.docs/sdd/roadmap.md` — migrado.
- `.docs/sdd/mission.md` — solo si la tabla del gate le manda una decisión.

**NO se tocan**:

- `skills/sdd-end-release/`, `skills/sdd-roadmap/`, `skills/sdd-end-feature/`, `skills/sdd-end-patch/` — son de la 0123.
- `skills/sdd-init-greenfield/`, `skills/sdd-init-brownfield/SKILL.md` y sus `references/` salvo `migrations/v2.3.0.md`.
- `.docs/sdd/capabilities/release-flow.md` y `planning.md`.
- `.claude-plugin/plugin.json`, `.docs/sdd/sdd-kit.json`, `.docs/sdd/changelog.md` salvo la entrada de `[Unreleased]` del cierre.
- Walkthroughs, `patch.md` y tickets históricos.

### 1.3 Migraciones

`v2.3.0.md`, con el formato de `v2.0.0.md`: pasos numerados con nombre en negrita, predicado, marca **gate**, línea `**Escribe**:` y «Verificación».

### 1.6 Dependencias

- `tests/headless/run.sh` y `lib.sh` para el GREEN; `SUPERPOWERS_DIR` en la caché 6.4.2.
- El molde `salas` de `red/subject.sh`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El validador rechaza un roadmap legítimo de un proyecto | media | alto: bloquea su migración | tests con la plantilla calcada y con ids de gestor; los mensajes dicen la regla |
| La migración de este roadmap pierde un dato | baja | alto | `roadmap-before.md` y el gate con la tabla |
| El GREEN falla por el escenario y no por la guía | media | medio | comprobación previa de cada escenario; 2 sujetos de reserva |
| El pre-commit tarda más de 30 s | baja | medio | los tests nuevos corren en proceso; `FastSuiteBudget` lo vigila |

### 1.8 Rollout

Llega con la 2.3.0. Los proyectos la reciben al pedir «ponme el proyecto al día».

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Validador y plantilla

**Modelo**: la sesión (Native).
**Tests RED**: Native: TDD del propio hilo · `tests/Test-Roadmap.Tests.ps1`, con copia apartada antes del código.
**Superficies**: tooling, docs.
**Verificación**: `pwsh -NoProfile -Command "$PSStyle.OutputRendering='PlainText'; $r = Invoke-Pester -Path tests/Test-Roadmap.Tests.ps1, tests/RoadmapStructure.Tests.ps1, tests/Skills.Tests.ps1, tests/AnchorTemplates.Tests.ps1 -PassThru -Output Normal; exit $r.FailedCount"`

**Interfaces**:
- Consume: nada.
- Produce: `Test-Roadmap.ps1 -Path <carpeta .docs/sdd>`; escribe una línea por fallo con prefijo `roadmap.md: ` y sale con 1, o `Roadmap válido` y 0, o `Sin roadmap que validar` y 0.

**Ficheros**: crear `skills/sdd-templates/scripts/Test-Roadmap.ps1`, `tests/Test-Roadmap.Tests.ps1`; modificar `skills/sdd-templates/templates/roadmap-template.md`, `skills/sdd-templates/SKILL.md`, `tests/RoadmapStructure.Tests.ps1`.

- [ ] **Step 1: Tests** — `tests/Test-Roadmap.Tests.ps1`. Ayudantes en `BeforeAll`: `New-Roadmap([string]$Content)` escribe `roadmap.md` en un directorio temporal propio y devuelve la carpeta; `Invoke-Roadmap([string]$Sdd)` devuelve `Lines` y `Code`; `$script:Valid`, un roadmap válido con «Próximo», «Release 1.3», «Backlog», «Deuda técnica», «Patches» y «Releases cerradas» con `### v1.2.0 — 2026-09-20` y `### v1.1.0 — 2026-09-05`. Cada test parte de `$script:Valid` y cambia una cosa. Tests y asserts:
  - `un roadmap válido pasa` → `Lines` es `Roadmap válido`, `Code` 0.
  - `pasa sin sección de release y con dos releases seguidas` → `Code` 0 en los dos.
  - `rechaza una sección fuera de la plantilla` → contiene `roadmap.md: línea <n>: sección «Versión siguiente» fuera de la plantilla` y la de «Decisiones tomadas»; `Code` 1.
  - `rechaza que falte una sección` → `roadmap.md: falta la sección «Patches»`.
  - `rechaza el orden alterado` → `roadmap.md: línea <n>: «Próximo» va antes que «Backlog»`.
  - `rechaza una release repetida` → `roadmap.md: línea <n>: sección «Release 1.3» repetida`.
  - `rechaza una release sin versión` con `## Release próxima` y `## Release` → `roadmap.md: línea <n>: «Release próxima» no lleva versión: «## Release <versión>»`.
  - `rechaza una subsección fuera de Releases cerradas` → `roadmap.md: línea <n>: subsección «Validación diferida» fuera de «Releases cerradas»`.
  - `rechaza la prosa fuera de Releases cerradas` → `roadmap.md: línea 13: prosa en «Backlog»; fuera de «Releases cerradas» el roadmap solo lleva tablas` y la de una cita `>` en «Patches»; el resumen, el smoke y `validaciones pendientes:` bajo `### v1.2.0` no dan fallo.
  - `admite una línea de estado en una release y rechaza la segunda`.
  - `rechaza una cabecera de release distinta` → `roadmap.md: línea <n>: la cabecera de «Release 1.3» debe ser «| id | Feature | Origen | Ficheros que toca | Estado |»`.
  - `rechaza un estado no admitido` con `pendiente` y `❌ descartado` → `roadmap.md: línea <n>: estado «pendiente» no admitido: ⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …`; `✅ [walkthrough](x.md)` y `⏸️ aparcada: descartada por el cliente, 2026-09-01` pasan.
  - `rechaza una fila saldada no posterior a la última release` → `roadmap.md: línea <n>: fila saldada el 2026-09-10, no posterior a la v1.2.0 (2026-09-20): sale en el corte`, también para `Task 0012, 2026-09-20` en «Backlog»; la de `2026-09-25` y una `parcial` de `2026-09-01` pasan; sin subsecciones en «Releases cerradas» no hay fallo.
  - `rechaza la fila de una feature ya publicada` → `roadmap.md: línea <n>: la 0021 ya está en la v1.2.0: su fila sale de «Release 1.3»`; la fila 0024 con «tras 0021» pasa.
  - `conserva los mensajes de estructura` sobre `tests/fixtures/roadmap-structure/roadmap-0fc231e-parent.md` → contiene, con el prefijo `roadmap.md: `, las siete líneas que hoy espera `RoadmapStructure.Tests.ps1`.
  - Los seis del Review Focus, con los nombres de esa sección.
  - `la plantilla sin sus bloques de ayuda pasa` → `roadmap-template.md` sin las líneas `>` da `Code` 0; `la plantilla sin tocar solo falla por su ayuda` → todas sus líneas de fallo contienen `prosa en`.
  - `fija la salida en UTF-8 desde un pwsh hijo` (`-Tag 'Slow'`) → la salida de `pwsh -NoProfile -File` con consola `Latin1` contiene `Roadmap válido`.
  - Cada test con `línea <n>` fija el número exacto de su fixture.
- [ ] **Step 2: Rojo** — ejecutar la «Verificación»; esperado: fallan por `Test-Roadmap.ps1` inexistente. Guardar copia del test fuera del repo.
- [ ] **Step 3: Script** — `Test-Roadmap.ps1` con `param([Parameter(Mandatory)][string]$Path)` y bloque de ayuda como el de `Test-Capabilities.ps1`. Funciones, todas devuelven cadenas de fallo sin prefijo salvo las `Get-`:
  - `Get-RoadmapSections([string[]]$Lines)` → objetos `Title`, `Line` (1-based), `First`, `Last` por cada `## `.
  - `Get-ClosedReleases([string[]]$Lines, $Section)` → objetos `Version`, `Date`, `Text` por cada `### v<versión> — <AAAA-MM-DD>`, en orden de aparición.
  - `Test-SectionSet($Sections)` · `Test-Subsections([string[]]$Lines, $Sections)` · `Test-Prose([string[]]$Lines, $Sections)` · `Test-TableStructure([string[]]$Lines)` (la lógica de `Get-RoadmapStructureProblems`, movida) · `Test-TableHeaders([string[]]$Lines, $Sections)` · `Test-States([string[]]$Lines, $Sections)` · `Test-SettledRows([string[]]$Lines, $Sections)` · `Test-PublishedRows([string[]]$Lines, $Sections)`.
  - El id de una fila es su primera celda, con cualquier formato. «Publicada» es ese id como palabra entera (`(?<![\w-])<id>(?![\w-])`) en el `Text` de una release cerrada.
  - Las líneas se leen con `Get-Content -Encoding utf8`, que ya parte CRLF.
  - Salida y codificación como en `Test-Capabilities.ps1`.
- [ ] **Step 4: `RoadmapStructure.Tests.ps1`** — quitar `Get-RoadmapStructureProblems`. `el roadmap del repo no tiene filas sueltas…` ejecuta el script sobre `.docs/sdd` y exige que ninguna línea case con `fila fuera de una tabla|fila vacía|la cabecera tiene|no empieza por`. El test del roadmap roto se va (lo cubre `conserva los mensajes de estructura`). El de la cabecera de release se queda.
- [ ] **Step 5: Plantilla** — en `roadmap-template.md`, un bloque de ayuda por sección con qué va y qué no:
  - Cabecera: las secciones son solo estas y en este orden; fuera de «Releases cerradas» no hay prosa; lo comprueba `Test-Roadmap.ps1`. Una decisión tomada no va aquí: regla o descarte, al documento de anclaje de su tema; el porqué de una feature, a su spec; lo de una release, a su resumen.
  - «Próximo»: lo que se va a hacer y aún no está en una release: features con su id e hitos. Una fila ✅ sale en el corte.
  - `## Release <N>`: `<N>` es la versión que dice el usuario, nunca supuesta; admite una línea con el estado de la release.
  - «Backlog»: producto sin decidir, y las decisiones pendientes, con la numeración del Backlog.
  - «Deuda técnica»: añadir al formato de cierre que la fila saldada sale en el corte de la release siguiente, y las etiquetas de «Destino»: Actuar · Esperar 2.º ticket · Descartada.
  - «Releases cerradas»: resumen, enlaces, línea de smoke y, si quedan, `validaciones pendientes: <ids>`; el disparador sigue en el walkthrough.
- [ ] **Step 6: Índice** — fila de `Test-Roadmap.ps1` en la tabla de scripts de `sdd-templates/SKILL.md`: qué comprueba, el comando con `<Base directory de sdd-templates>` y que hoy lo ejecuta la migración a v2.3.0.
- [ ] **Step 7: Verificación** — el comando de «Verificación»; esperado: 0 fallos. Comparar el test con la copia apartada (`git diff --no-index`).
- [ ] **Step 8: Commit de la task** — `feat(templates): validador del roadmap y reglas por sección en la plantilla`.

### Task 2 — Migración a v2.3.0 y GREEN

**Modelo**: la sesión (Native); sujetos `claude -p --model sonnet`.
**Tests RED**: Native · el RED es `tests/roadmap-shape-red.md`; test estático nuevo en `tests/MigrationInitParity.Tests.ps1`.
**Superficies**: docs, tooling.
**Verificación**: `pwsh -NoProfile -Command "$PSStyle.OutputRendering='PlainText'; $r = Invoke-Pester -Path tests/MigrationInitParity.Tests.ps1, tests/PathLength.Tests.ps1, tests/SubjectOutputPrivacy.Tests.ps1 -PassThru -Output Normal; exit $r.FailedCount"`

**Interfaces**:
- Consume: `Test-Roadmap.ps1 -Path <carpeta>` de la Task 1, con sus salidas `Roadmap válido` y `roadmap.md: …`.
- Produce: `migrations/v2.3.0.md` con los pasos «Roadmap en la forma de la plantilla» y «Marcador».

**Ficheros**: crear `skills/sdd-init-brownfield/references/migrations/v2.3.0.md`, `green/subject.sh`, `green/out/`, `tests/roadmap-shape-green.md`; modificar `tests/MigrationInitParity.Tests.ps1`.

- [ ] **Step 1: Test estático** — en `MigrationInitParity.Tests.ps1`, `Describe 'Migración a v2.3.0 — roadmap'`: `declara roadmap.md en su línea **Escribe**` (`Get-DeclaredTokens` contiene `roadmap.md`); `el paso del roadmap nombra el validador, el gate y el sha` (el texto contiene `Test-Roadmap.ps1`, `**gate**`, `git show`, `pendiente explícito`). Rojo: el fichero no existe.
- [ ] **Step 2: `v2.3.0.md`** — dos pasos. **1. Roadmap en la forma de la plantilla.** *Predicado*: `Test-Roadmap.ps1` sale con 1; si sale con 0, el paso se salta y se dice. Con `roadmap.md` sin commitear, parar y decirlo. Apuntar `git rev-parse --short HEAD` como el sha del roadmap anterior. **gate**: presentar la tabla «bloque → destino» y esperar; sin dev-lead, pendiente explícito con la tabla en el informe y `roadmap.md` sin tocar. Receta de destinos, solo lo que el RED no dio por sabido:
  - Trabajo pendiente en una sección fuera de la plantilla: preguntar si hay una release en preparación y su versión. Con versión, `## Release <versión>` con las cinco columnas; sin ella, «Próximo», con «Origen: …» y «Ficheros: …» al final de «Ítem». Nunca proponer un número de versión.
  - Fila de una feature o un patch ya publicado (su id está en una release cerrada o en el changelog sellado): sale. Si estaba en `🧪`, su id va a `validaciones pendientes:` de esa release. Igual las tablas de validaciones diferidas.
  - Decisión pendiente o pendiente rescatado sin hacer: fila de «Backlog» con el número siguiente del Backlog, sin id de la secuencia.
  - Decisión tomada: si ya está en un documento de anclaje, sale; si es de una release, a su resumen en «Releases cerradas»; si es una regla o un descarte, al documento de anclaje de su tema.
  - Fila saldada no posterior a la última release cerrada, y fila ✅ de «Próximo»: sale.
  - Filas duplicadas: se listan en la tabla para el dev-lead.
  - «Destino» con una versión ya publicada: «versión siguiente».
  - Celda que la tabla destino exige y el roadmap no traía: `—`.
  - Enlaces internos a una sección que sale: a la sección destino.
  Tras aprobar: aplicar, y el cuerpo del commit lleva `git show <sha>:.docs/sdd/roadmap.md`. **2. Marcador.** Como `v2.2.0.md`. `**Escribe**: \`roadmap.md\`; \`sdd-kit.json\` → \`version\`, \`channel\`, \`updated\`.` «Verificación»: `Test-Roadmap.ps1` da `Roadmap válido`; el marcador dice `2.3.0`; `git status --short` solo lista lo que la tabla aprobó.
- [ ] **Step 3: Commit intermedio** — commitear Task 2 hasta aquí, para sacar la copia del kit con `git archive HEAD skills .claude-plugin agents`.
- [ ] **Step 4: `green/subject.sh`** — sobre `tests/headless/lib.sh`, cargando el molde `salas` de `red/subject.sh` (mismo roadmap). Escenarios: `g1` «Ponme el proyecto al día con sdd-init-brownfield. Estaré fuera un rato: déjame al final un informe con lo que has hecho.»; `g2` «Ponme el proyecto al día con sdd-init-brownfield. No estaré: apruebo de antemano los gates de la migración. No hay release en preparación. Déjame un informe al final.»; `g3` la petición de `g1` sobre el roadmap válido de los tests de la Task 1. Guarda el roadmap, el estado, `sdd-kit.json` y la salida de `Test-Roadmap.ps1` sobre el resultado. Comprobación previa de cada escenario y `DRY_RUN=1` con `PHASE=dry`.
- [ ] **Step 5: GREEN** — `SUBJECT_CAP=9 COST_CAP=10 SUBJECT_TIMEOUT=900`; `g1`×2, `g2`×2, `g3`×1, en segundo plano. Antes del veredicto, comprobar en cada stream que el sujeto leyó `v2.3.0.md`. Criterios: g1, `roadmap.md` sin cambios, sin commit, marcador en 2.2.0 y tabla en el informe; g2, validador en verde sobre el resultado, F1 a F8 del RED resueltos y C1 a C7 sin regresión; g3, roadmap sin cambios, paso saltado y dicho, marcador en 2.3.0. Si un criterio falla, una ronda de ajuste del texto con los 2 sujetos de reserva; si se supera el techo, parar y decide el dev-lead.
- [ ] **Step 6: Evidencia** — `tests/roadmap-shape-green.md`: previsión y gasto, una tabla por escenario con el veredicto por fallo del RED y por control, citas de los sujetos, límites.
- [ ] **Step 7: Verificación** — el comando de «Verificación»; esperado: 0 fallos.
- [ ] **Step 8: Commit de la task** — juntar en `feat(migration): migración a v2.3.0, el roadmap a la forma de la plantilla`.

### Task 3 — Documentos acotados: principio y tabla

**Modelo**: la sesión (Native).
**Tests RED**: Native · no aplica: documentos de este repo que ninguna skill lee.
**Superficies**: docs.
**Verificación**: `pwsh -NoProfile -Command "$PSStyle.OutputRendering='PlainText'; $r = Invoke-Pester -Path tests -ExcludeTagFilter Slow -PassThru -Output Minimal; exit $r.FailedCount"`

**Interfaces**:
- Consume: nada.
- Produce: Art. XI y la tabla de documentos, que la Task 4 enlaza desde las filas nuevas del roadmap.

**Ficheros**: modificar `.docs/sdd/constitution.md`, `.docs/sdd/architecture.md`, `CLAUDE.md`.

- [ ] **Step 1: Art. XI — Documentos acotados** en `constitution.md`: todo documento de `.docs/sdd/` es de estado (dice cómo es el proyecto hoy; se reescribe, no se le añade) o un artefacto de evento (un fichero por evento, que no se edita después); declara quién lo escribe, quién lo lee y qué lo acota; un documento de estado no guarda la historia de cómo llegó a ser así: esa historia está en el artefacto del evento. La tabla vive en `architecture.md`. Sin citas de task en el artículo.
- [ ] **Step 2: Tabla** en `architecture.md`, sección «Documentos de `.docs/sdd/`», columnas `Documento | Tipo | Lo escribe | Lo lee | Cota`. Filas: `roadmap.md` (estado · `sdd-roadmap` y los cierres · las skills de arranque y cierre · `Test-Roadmap.ps1`), `capabilities/` (estado · cierres · arranques y consulta · forma por `Test-Capabilities.ps1`; **sin cota** de tamaño: propuesta «documentos acotados»), `constitution.md`, `mission.md`, `architecture.md` (estado · dev-lead y cierres · toda sesión · **sin cota**: misma propuesta), `tech-stack.md` (estado, hoy usado como diario · cierres · toda sesión · **sin cota**: misma propuesta), `changelog.md` (diario por release · `add-to-changelog` · `sdd-end-release` · solo se lee la cabecera), `estimation-log.md` (generado · `Build-EstimationLog.ps1` · los planes · una fila por cierre), `specs/`, `field-reports/`, `releases/` y `tests/*.md` (evento · un fichero por evento). Medidas del 2026-09-30 en palabras.
- [ ] **Step 3: `CLAUDE.md`** — en el índice, la línea de `roadmap.md` dice «próximo, release en preparación, backlog, deuda técnica, patches y releases cerradas»; la regla 5 cita `architecture.md` para saber a qué documento va cada cosa.
- [ ] **Step 4: Verificación** — el comando de «Verificación»; esperado: 0 fallos.
- [ ] **Step 5: Commit de la task** — `docs(sdd): Art. XI, documentos acotados, y tabla de documentos`.

### Task 4 — Este roadmap, migrado

**Modelo**: la sesión (Native).
**Tests RED**: Native · `tests/RoadmapStructure.Tests.ps1`: `el roadmap del repo tiene la forma de la plantilla`.
**Superficies**: docs, tooling.
**Verificación**: `pwsh -NoProfile -Command "$PSStyle.OutputRendering='PlainText'; $r = Invoke-Pester -Path tests -ExcludeTagFilter Slow -PassThru -Output Minimal; exit $r.FailedCount"` y `pwsh -NoProfile -File skills/sdd-templates/scripts/Test-Roadmap.ps1 -Path .docs/sdd`

**Interfaces**:
- Consume: `Test-Roadmap.ps1` (Task 1), el paso 1 de `v2.3.0.md` (Task 2), la tabla de `architecture.md` (Task 3).
- Produce: `roadmap.md` válido, `roadmap-before.md`, `migration-gate.md`.

**Ficheros**: crear `roadmap-before.md`, `migration-gate.md`; modificar `.docs/sdd/roadmap.md`, `.docs/sdd/tech-stack.md`, `tests/RoadmapStructure.Tests.ps1`, y los documentos de anclaje que nombre la tabla.

- [ ] **Step 1: Test** — en `RoadmapStructure.Tests.ps1`, `el roadmap del repo tiene la forma de la plantilla`: el script sobre `.docs/sdd` da `Roadmap válido` y código 0. Sustituye al test de estructura de la Task 1. Rojo esperado: las líneas de fallo del roadmap actual. Se aparta fuera del repo hasta el Step 5.
- [ ] **Step 2: Volcado** — copiar `.docs/sdd/roadmap.md` de `HEAD` a `roadmap-before.md`, byte a byte (`git show HEAD:.docs/sdd/roadmap.md`), y comprobar con `git diff --no-index`.
- [ ] **Step 3: Tabla del gate** — `migration-gate.md` siguiendo el paso 1 de `v2.3.0.md`, con: cada fila de «Versión siguiente» y su destino; las filas ya publicadas (0096, 0098, 0099) y las 🧪 de «Validación diferida de la 2.0.0», del Backlog y de «Patches», cerradas como «validación en campo (dev-lead, 2026-09-29)»; cada decisión tomada con «ya está en <documento>» o «se añade a <documento>»; las filas saldadas que salen, contadas; los duplicados para decidir; la 0015 disuelta en filas de deuda con su etiqueta; «2.0.1» → «versión siguiente» en «Destino»; «Reglas de ejecución en worktrees» y «Pendientes rescatados» fuera, con la A13 al Backlog; «Referencias de vigilancia» a `tech-stack.md`.
- [ ] **Step 4: ⛔ Gate** — presentar la tabla al dev-lead con las dos preguntas: `## Release 2.3.0` o «Próximo» para las features pendientes, y qué duplicados se funden. Esperar su sí.
- [ ] **Step 5: Aplicar** — según la tabla aprobada. Añadir las tres filas nuevas de la decisión 21 de la spec y CodeMySpec, MySpec y `spec-driven-with-adr` a las referencias. Reescribir los enlaces `#versión-siguiente`. Devolver el test del Step 1.
- [ ] **Step 6: Verificación** — los dos comandos de «Verificación»; esperado: 0 fallos y `Roadmap válido`. Comprobar que `Get-NextSddId.ps1 -ProjectRoot .` sigue dando un id mayor que 0123.
- [ ] **Step 7: Commit de la task** — `docs(roadmap): el roadmap en la forma de la plantilla`, con `git show <sha>:.docs/sdd/roadmap.md` en el cuerpo.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 3,5h
- Estimación de implementación: 2,5h (rango 1,5–3h)
- Base de la estimación: 4 tasks; la Task 1 es un script de ~180 líneas con ~25 tests; la Task 2 se estima como redacción, con los sujetos en segundo plano; la Task 4 depende de una parada del dev-lead y de clasificar ~25 decisiones y ~60 filas. El ratio de la 2.1.0 en el log es 0,54.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal, desde la herramienta PowerShell: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`
- [ ] Verificación de los escenarios de la spec, una fila por THEN con su evidencia
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama con `sdd-end-feature`

---

## 4. Self-review (cobertura spec → tasks)

- `roadmap` MODIFIED «Cerrar una fila… prefijo contable» → Task 1, Step 5 (formato de cierre de la plantilla). ✓
- `roadmap` «Una fila saldada antes de la última release está de más» → Task 1, `rechaza una fila saldada no posterior a la última release`. ✓
- `roadmap` «El roadmap solo lleva las secciones de la plantilla» → Task 1, tests de sección, orden, repetida y sin versión. ✓
- `roadmap` «El roadmap no lleva prosa fuera de las releases cerradas» → Task 1, tests de prosa y de la línea de estado. ✓
- `roadmap` «Las cabeceras de tabla y los estados…» → Task 1, tests de cabecera, de estado y de estructura. ✓
- `roadmap` «Una feature publicada no sigue como fila…» → Task 1, `rechaza la fila de una feature ya publicada`. ✓
- `roadmap` «Una release cerrada guarda sus validaciones pendientes…» → Task 2, receta y criterio de g2. ✓
- `migration` «La migración a v2.3.0 lleva el roadmap a la forma…» → Task 2, Steps 1, 2 y g2; el rechazo y el roadmap sin commitear, en el texto del paso. ✓
- `migration` «Con el dev-lead ausente…» → Task 2, g1. ✓
- `migration` «Un roadmap que ya tiene la forma no se migra» → Task 2, g3. ✓
- `migration` «La migración del roadmap no inventa datos» → Task 2, receta y criterios F1, F2 y F5 de g2. ✓
- Scope «Entra»: plantilla → Task 1 · script, índice y tests → Task 1 · `RoadmapStructure.Tests.ps1` → Tasks 1 y 4 · `v2.3.0.md` → Task 2 · roadmap migrado y `roadmap-before.md` → Task 4 · Art. XI, tabla y `CLAUDE.md` → Task 3 · referencias en `tech-stack.md` → Task 4 · documentos de anclaje destino → Task 4 · tres filas nuevas → Task 4. ✓
- Review Focus, las seis líneas → Task 1, los tests de sus nombres. ✓
- Capacidades `roadmap` y `migration` en `capabilities/` → las fusiona el cierre, no una task. ✓
