---
id: 20261013-112220-feature-0150-roadmap-triage-release-feedback
feature: 0150
title: Plan de implementación — Roadmap Now / Next / Later y debt.md con triaje
spec: ./spec.md
status: approved
created: 2026-10-13
---

# Plan de implementación — Roadmap Now / Next / Later y debt.md con triaje

## Decisiones que he tomado yo — valida estas

1. **Cinco tasks**:
   - la Task 1 monta los moldes y los escenarios y lanza todos los RED de una vez con el kit del commit de apertura;
   - la Task 2 escribe las plantillas;
   - la Task 3, el check;
   - la Task 4 reescribe `sdd-roadmap` y lanza su GREEN;
   - la Task 5 hace lo mismo con `sdd-feedback`.

   Si un RED sale limpio, paro una sola vez a pedir otra aprobación (decisión 21 de la spec).
2. **Plantillas antes que el check**: los Vitest de la Task 3 calcan las dos plantillas (`architecture.md`: un verbo que lee un artefacto se prueba contra su plantilla).
3. **Ejecución SDD**:
   - una task rota de la Task 3 llega a `develop` y bloquea el pre-commit de todas las sesiones, porque `kit:roadmap` corre en él; la revisión por task lo caza antes;
   - la sesión ya se compactó una vez, y cinco tasks no caben en lo que le queda;
   - las campañas las lanza el hilo principal en cualquier método.

   La revisión final de rama va con `sdd-kit:effort-high` y `opus`.
4. **Modelos**:
   - Tasks 1 a 3: `sdd-kit:effort-medium` con `sonnet`. Son moldes, plantillas y una CLI con su contrato escrito.
   - Tasks 4 y 5: `sdd-kit:effort-high` con `sonnet`. Traducen dos skills sin perder ninguna regla y escriben guía nueva; el revisor de cada task lo comprueba contra la tabla «Reglas que cambian o salen».
   - Revisores de task: `sdd-kit:effort-medium` con `sonnet`.
   - Sujetos: Sonnet.
5. **Moldes nuevos**: `mold-salas-3` (`ROADMAP.md`, `steering/debt.md`, `CHANGELOG.md`, el informe de QA y el fallo de la planta) y `mold-salas-qa` (el molde `salas` 2.x con el informe y las versiones en su changelog), en `tests/batteries/sdd-roadmap/`, como capas sobre `using-sdd/mold-salas`. `sdd-feedback` estrena batería de humo con un escenario, `fb1`.
6. **Gate de cierre de este repo** (§3): no hay `operations.md` ni §Testing en `tech-stack.md`, así que sería `no declarado`. Uso las tareas de moon que nombra `tech-stack.md` en «Contenido y build», como las 0160 y 0161.
7. **Coste estimado**: ~4,5 h de reloj y ~28 $ de sujetos (techo 34 $, `COST_CAP`; 54 sujetos, `SUBJECT_CAP`), más la revisión final (~3 $).
8. **Review Focus**: 6 entradas que la spec no fija, con su comportamiento esperado; están en su sección.

**Goal**: dar a la 3.0.0 su roadmap Now / Next / Later y su `debt.md` con triaje, con plantillas, check, `sdd-roadmap` y `sdd-feedback` en inglés, sin romper el roadmap 2.x de este repo.

**Architecture**: el check elige las reglas por el fichero que resuelve `layout.ts`: `ROADMAP.md`, las 3.0.0 de un módulo nuevo, y `.docs/sdd/roadmap.md`, las 2.x de hoy, sin el aviso del «Destino». `steering/debt.md` se valida en el mismo verbo. Las dos plantillas nuevas son la única fuente de la forma. `sdd-roadmap` escribe la forma del fichero que encuentra, y `sdd-feedback` gana el hueco «Fuente» en su plantilla.

**Tech Stack**: TypeScript en Node ≥ 22.18.0 sin dependencias (CLI `sdd`) y Vitest; Markdown (skills y plantillas); Bash y Node (lanzador `tests/headless/`); Pester (frases, anatomía y topes).

**Spec**: `./spec.md`

**Ejecución**: subagent, porque la Task 3 cambia un check que corre en el pre-commit de todas las sesiones, y un error que llegue a la rama es caro; son cinco tasks en una sesión ya compactada, que no caben en un contexto; las Tasks 4 y 5 dependen de la interfaz de la 3 solo por el check que ejecuta `sdd-roadmap`. Con `execution: auto`, fijado en sdd-kit.json.

## Restricciones globales

### De código

- Ficheros, literales: `skills/sdd-templates/templates/now-next-later-template.md` → `ROADMAP.md` en la raíz; `skills/sdd-templates/templates/debt-template.md` → `.docs/sdd/steering/debt.md`. `roadmap-template.md` no se toca: es la forma 2.x hasta la 0157.
- `ROADMAP.md`:
  - las secciones `## Now`, `## Next` y `## Later`, en ese orden y solo con tablas;
  - el título de Now es `## Now` o `## Now — <versión> · en preparación|comprometida`;
  - la única línea de texto es `Perfil de control: <perfil>`, entre `## Now` y su tabla;
  - la cabecera de las tres tablas es `| Id | Externo | Tarea | Estado | Tras | Tamaño |`;
  - estados: `⏳`, `🔄`, `✅`, `🧪 validación diferida a…` y `⏸️ aparcada: …`; Later solo admite `⏳` y `⏸️`;
  - tamaño: `S`, `M` o `L`, obligatorio en Now y Next;
  - id de Later: `B<n>`;
  - Tarea: `**<título>**<br>*<one-liner>*<details><summary>Brief</summary>…</details>`, con el brief obligatorio en Now y Next;
  - etiquetas del brief: `**Carril:**`, `**Requisitos:**`, `**Decisiones ya tomadas:**`, `**Salda:**` y `**Toca:**`;
  - un `|` dentro de una celda se escribe `\|`.
- `debt.md`:
  - primera línea `# Deuda técnica`;
  - secciones en orden: `## Por triar` (`| Ítem | Origen | Fecha |`), `## En espera` (`| Ítem | Origen | Impacto | Falta | Fecha |`), `## Lista` (`| Ítem | Origen | Impacto | Evidencia | Destino |`) y `## Descartadas` (`| Ítem | Origen | Motivo | Fecha |`);
  - «Fecha» es `AAAA-MM-DD`.
  - una release es una versión `## [X.Y.0] - AAAA-MM-DD` (o con `—`) del changelog; un patch no cuenta, ni `[Unreleased]`.
- Mensajes del check: los literales del delta de `roadmap` de la spec, con el prefijo `ROADMAP.md: `, `roadmap.md: ` o `debt.md: `. Avisos con `aviso: ` tras el prefijo. Orden de salida: fallos del roadmap, fallos de `debt.md`, avisos del roadmap y avisos de `debt.md`; sin fallos, la última línea es `Roadmap válido`, y con un fallo sale con 1.
- Las skills se escriben en inglés y hablan con el usuario en su idioma. El ticket de `sdd-feedback` sigue en castellano. Nombres de skill y de fichero, en inglés kebab-case. Texto humano (docs, tests, commits, mensajes de la CLI), en castellano con tildes (Art. III).
- Cada regla de una skill cita solo la ruta de su evidencia (`tests/…`), sin recuentos: los recuentos van a «Procedencia de las reglas» de la batería.
- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos del Art. IV:
  - implementadores y revisores de task, con el modelo y el effort de cada task;
  - sujetos, en Sonnet;
  - revisor final, con `sdd-kit:effort-high` y `opus`;
  - `fable` y `opus xhigh`, prohibidos.
- Ejecución SDD (`sdd-implement`). Cada task sigue este orden:
  1. `sdd task start`;
  2. los RED en el hilo principal, sin commitear;
  3. el despacho del implementador;
  4. el revisor de la task;
  5. el commit;
  6. `sdd task done`.

  Las campañas (`Verificación lenta`) las lanza el hilo principal en segundo plano, y el hilo principal califica cada sujeto con la rúbrica, literal y fila a fila.
- Los RED corren con el kit del commit de apertura (`git archive` a una carpeta del scratchpad, en `KIT_DIR`), y los GREEN con el kit de la rama. `SUPERPOWERS_DIR` apunta a la versión del README.
- Una regla cuyo RED sale limpio no se escribe: sale con su THEN, y se pide otra aprobación (Art. I). Antes de recortar por un baseline limpio, se mira de dónde sacó el sujeto la conducta y, si depende del idioma o del tono, se repite el baseline (`tech-stack.md`, «Baterías por skill»).
- Techo: 34 $ (`COST_CAP`) y 54 sujetos (`SUBJECT_CAP`), comunes a todas las fases. Si se pasa, paro y decide el dev-lead.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Antes de decir «pre-commit en verde», `git config core.hooksPath` devuelve `.githooks`.

## Review Focus

- Un `ROADMAP.md` con fin de línea CRLF → valida igual que con LF, con los mismos números de línea · Task 3, `accepts CRLF in ROADMAP.md and debt.md`.
- Un brief con `\|` dentro de la celda «Tarea» → la fila sigue teniendo seis celdas y no da fallo de cabecera ni de estado · Task 3, `keeps escaped pipes inside the brief`.
- Un proyecto 2.x (`.docs/sdd/roadmap.md`) con `steering/debt.md` → valida los dos, el roadmap con las reglas 2.x · Task 3, `validates debt.md next to a 2.x roadmap`.
- Un changelog con el título `## [1.4.0] — 2026-09-01` (raya) → cuenta como release para la caducidad · Task 3, `counts releases with an em dash heading`.
- «Tras» con `0012, 0013` y espacios, o con un solo id → cada id se busca por separado · Task 3, `checks each id of Tras`.
- «Prepara la release 1.3» en un proyecto 2.x → sigue escribiendo `## Release 1.3` con «Ficheros que toca», no un `## Now` · Task 4, tabla de equivalencias; lectura en la revisión.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el check reutiliza `parse.ts` (`parseSections`, `tableBlocks`, `cells`) y `layout.ts`; sin verbo nuevo; `debt.md` en el mismo verbo.
- [x] **YAGNI gate**: sin validar el formato de «Id», «Externo» ni los ids repetidos (decisión 7 bis); sin reglas del corte (0177).
- [x] **Brownfield gate**: el roadmap 2.x de este repo sigue en verde, sin los 106 avisos; `roadmap-template.md` intacta; los Pester que leen las dos skills se adaptan en su task.
- [x] **Constitution check**:
  - Art. I: RED antes de cada regla, humo y controles, tabla de reglas que cambian, previsión y topes;
  - Art. III: inglés;
  - Art. VIII: plantillas en `sdd-templates`;
  - Art. X: calidad de la CLI;
  - Art. XI: la cota de `debt.md`, en su plantilla.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/templates/now-next-later-template.md`: la forma de `ROADMAP.md` (Task 2).
- `skills/sdd-templates/templates/debt-template.md`: la forma de `debt.md`, con quién la escribe, quién la lee y su cota en el bloque de ayuda (Task 2).
- `cli/src/roadmap/now-next-later.ts`: las reglas 3.0.0 de `ROADMAP.md` (Task 3).
- `cli/src/roadmap/debt.ts`: las reglas y los avisos de `debt.md` (Task 3).
- `cli/src/roadmap/changelog.ts`: las fechas de las releases `X.Y.0` y si el changelog nombra un id (Task 3).
- `cli/test/roadmap/now-next-later.test.ts` y `cli/test/roadmap/debt.test.ts` (Task 3).
- `tests/batteries/sdd-roadmap/mold-salas-3/` y `tests/batteries/sdd-roadmap/mold-salas-qa/` (Task 1).
- `tests/batteries/sdd-feedback/battery.md`, `subject.sh` y `mold-sesion/` (Task 1).
- Las evidencias `tests/sdd-roadmap-0150-red.md`, `tests/sdd-feedback-0150-red.md` (Task 1), `tests/sdd-roadmap-0150-green.md` (Task 4) y `tests/sdd-feedback-0150-green.md` (Task 5).

**Modificar**:

- `cli/src/roadmap/check.ts`: elige las reglas por el fichero, valida `debt.md` y ordena la salida (Task 3).
- `cli/src/roadmap/warnings.ts`: sin `destinationWarning`; solo el aviso del prefijo de cierre (Task 3).
- `cli/src/roadmap/verbs.ts`: el `summary` de `roadmap check` (Task 3).
- `cli/test/roadmap/check.test.ts` y `root-roadmap.test.ts`: los avisos del «Destino» y los fixtures de `ROADMAP.md` en forma 2.x (Task 3).
- `skills/sdd-templates/templates/kit-feedback-template.md` (hueco «Fuente») y `launch-prompt-template.md` (la línea del carril) (Task 2).
- `skills/sdd-templates/SKILL.md`: el índice y la fila de `sdd roadmap check` (Task 2).
- `skills/sdd-roadmap/SKILL.md` (Task 4) y `skills/sdd-feedback/SKILL.md` (Task 5), reescritas.
- `skills/sdd-start-feature/references/control-profiles.md`, líneas 17 y 75 (Task 4).
- `skills/using-sdd/SKILL.md`, solo si el RED de r7 no entra por `sdd-roadmap` (Task 4).
- `tests/batteries/sdd-roadmap/battery.md` y `subject.sh`, y `tests/batteries/using-sdd/battery.md` (Task 1).
- Los Pester: `AnchorTemplates`, `Skills`, `KitFeedback` y `LaunchPrompt` (Task 2); `RoadmapStructure` (Task 3); `PlanEntry`, `TaskIds`, `MigrationInitParity`, `FeatureRename`, `ReleaseFlow`, `RoadmapClosing`, `SingleEntry` y `WordBudget` (Task 4); `KitFeedback` (Task 5).

**NO se tocan**:

- `skills/sdd-templates/templates/roadmap-template.md`: es la forma 2.x, de la que leen los cierres, las init y la migración v2.3.0 (decisión 1 de la spec).
- `skills/sdd-end-feature/`, `sdd-end-patch/`, `sdd-end-release/` y las init: son de las 0149, 0177 y 0156.
- `cli/src/ids/scan.ts`: ya lee el id de la primera columna (decisión 7 bis).
- `cli/src/cli/layout.ts`: `resolveDocument` ya da `ROADMAP.md` o `roadmap.md`, y el changelog de la raíz o el 2.x.
- `.docs/sdd/architecture.md`: decisión 31 de la spec.

### 1.6 Dependencias

- La 0144 (rutas de la CLI y `roadmap publish` con `ROADMAP.md`), ya en `develop`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La traducción de `sdd-roadmap` pierde una regla vigente | media | alto | La tabla «Reglas que cambian o salen» de la spec va en el encargo del implementador y del revisor; m1 y m2 de control |
| Con el `ROADMAP.md` 3.0.0 del molde, el check viejo falla en el RED y el sujeto «arregla» el roadmap a la forma 2.x | alta | medio | Es el baseline real; la rúbrica lo puntúa y la evidencia lo dice |
| `sdd-roadmap` pasa de 2.700 palabras | media | bajo | Decisión 17 de la spec: el tope sube a la centena de arriba |
| Un RED limpio en m4 o m5: el sujeto imita las filas del molde | media | medio | Se repite el baseline antes de recortar, y la regla sale con su THEN (Art. I) |

### 1.8 Rollout

Directo: entra en `develop` con `sdd merge --push`. Los proyectos lo verán con la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — RED: moldes, escenarios y baseline

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: esta task es el RED del Art. I: los escenarios nuevos y su baseline con el kit del commit de apertura.
**Superficies**: tooling (baterías y moldes)
**Verificación**:
- `DRY_RUN=1 BATTERY=sdd-roadmap STEPS=triage,prompt,write,legacy bash tests/headless/battery.sh`;
- `DRY_RUN=1 BATTERY=sdd-feedback bash tests/headless/battery.sh`;
- `DRY_RUN=1 BATTERY=using-sdd STEPS=sdd-roadmap bash tests/headless/battery.sh`.

Cada una sale con 0, y el molde montado de cada escenario tiene lo que su GIVEN pide.

**Verificación lenta**: la campaña RED, en el hilo principal. Son m3, m4 y m5 (2 sujetos cada uno), r7 (2) y fb1 (1), con `KIT_DIR` del commit de apertura, `COST_CAP=34` y `SUBJECT_CAP=54`. Dura ~40 min.
**Se prueba en la aplicación**: no, porque es tooling: moldes y escenarios.

**Interfaces**:
- Consume: `tests/batteries/using-sdd/mold-salas/` (con `src/app.js`, que arranca por `process.argv`, y `.docs/sdd/changelog.md`), `tests/batteries/sdd-roadmap/subject.sh` (moldes `salas` y `salas-0013`) y `tests/headless/lib.sh` (`subject_init`, `subject_launch`, `subject_keep`, `subject_save`, `put`, `put_kit_marker`).
- Produce:
  - los moldes `salas-3` y `salas-qa`;
  - los escenarios m3 a m6 de `sdd-roadmap`, r7 de `using-sdd` y fb1 de `sdd-feedback`, con sus filas de rúbrica;
  - las evidencias RED.

  Las Tasks 4 y 5 lanzan su GREEN sobre ellos.

**Ficheros**:

- `tests/batteries/sdd-roadmap/mold-salas-3/`: capa sobre `mold-salas`, sin `.docs/sdd/roadmap.md`. Lleva:
  - `ROADMAP.md`, con la forma de la Task 2: en Now, `0012` ✅; en Next, `0013` «Aviso semanal a los responsables», con el brief `**Carril:** feature<br>**Requisitos:** <ruta de la propuesta 0010>, §Reglas de negocio y §Enmiendas<br>**Decisiones ya tomadas:** el aviso sale los lunes a las 8:00<br>**Salda:** nada<br>**Toca:** <ficheros>`, «Tras» `0012` y tamaño `M`; y en Later, `B1`;
  - `.docs/sdd/steering/debt.md`: en «Por triar», «La exportación a CSV pierde las tildes desde la 1.4.2» y «`salas libres --planta 2` lista también salas de la planta 1», las dos con origen `docs/qa/2026-10-12-informe.md`; en «En espera», «Las reservas de más de 8 h no avisan al responsable», del 2026-07-01, con «Falta» `2.º caso`;
  - `CHANGELOG.md`, con `## [1.4.1] - 2026-10-05`, `## [1.4.0] - 2026-09-01` y `## [1.3.0] - 2026-07-20`;
  - `docs/qa/2026-10-12-informe.md`, con los dos hallazgos;
  - `src/app.js`: `libres --planta 2` devuelve `Norte (planta 1)` y la exportación conserva las tildes;
  - la propuesta 0010 en `.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md`.
- `tests/batteries/sdd-roadmap/mold-salas-qa/`: capa sobre `mold-salas` (2.x), con el mismo informe, el mismo `src/app.js` y esas tres versiones añadidas al `.docs/sdd/changelog.md` del molde.
- `tests/batteries/sdd-roadmap/subject.sh`:
  - los casos `salas-3` (copia la capa y borra `.docs/sdd/roadmap.md`) y `salas-qa`;
  - `subject_keep` de `ROADMAP.md`, `.docs/sdd/steering/debt.md` y `.docs/sdd/roadmap.md` cuando existan.
- `tests/batteries/sdd-roadmap/battery.md`, con estas filas:

  | Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo |
  | --- | --- | --- | --- | --- | --- | --- | --- |
  | m3 | triage | Tria lo que hay por triar en la deuda. | salas-3 | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet |
  | m4 | prompt | dame el prompt de la 0013 | salas-3 | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet |
  | m5 | write | Apunta en el roadmap: exportar las reservas a CSV. No la arranques. | salas-3 | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet |
  | m6 | legacy | Tria el informe de QA de docs/qa/2026-10-12-informe.md. Decide tú. | salas-qa | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet |

  Filas de rúbrica:
  - **M3** falla si propone en «Lista» la fila del CSV o da la 1.4.2 por buena; si no cita el changelog como fuente; si la fila de la planta no lleva «Evidencia» con el comando; si no propone la de las 8 h en «Descartadas» con `caducada`; o si escribe en `debt.md` o en `ROADMAP.md` antes de la decisión.
  - **M4** falla si el carril, los requisitos, las decisiones o «Nada que saldar» del prompt no salen del brief de la 0013; o si escribe, reserva o commitea.
  - **M5** falla si la fila nueva no está en Next con el id `0014`, título, one-liner, brief con las cinco etiquetas, `⏳` y tamaño; o si no ejecuta el check.
  - **M6** falla si una fila de «Deuda técnica» queda sin «Destino» que empiece por `**Actuar**`, `**Esperar 2.º ticket**` o `**Descartada**`; si da la 1.4.2 por buena; o si crea `ROADMAP.md` o `debt.md`.
- `tests/batteries/using-sdd/battery.md`: r7, paso `sdd-roadmap`, «Tria lo que hay por triar en la deuda.», molde `salas`, esperado `sdd-kit:sdd-roadmap`, n 2, umbral 2/2, sonnet.
- `tests/batteries/sdd-feedback/`:
  - `battery.md`: fb1, «Escribe el ticket de mejora del kit de la sesión que resumen las notas de notas-sesion.md.», molde `sesion`, esperado `sdd-kit:sdd-feedback`, n 1;
  - rúbrica **F1**: falla si «Qué pasó» da una versión o una cifra sin su fuente, o si da la versión de las notas que contradice a `.docs/sdd/sdd-kit.json`;
  - `subject.sh`, sobre la forma de `tests/batteries/sdd-roadmap/subject.sh`;
  - `mold-sesion/`: `mold-salas` con `notas-sesion.md`, una sesión que cita «kit 2.4.0» con `sdd-kit.json` en 2.3.3, y un coste «~40 min» sin respaldo.

- [ ] **Step 1: Implementación**: los ficheros de arriba. `subject.sh` comprueba con `die` cada ancla del molde que edita, como hoy con la fila 0013.
- [ ] **Step 2: Build**: no aplica (Bash y Markdown).
- [ ] **Step 3: Verificación**:
  1. los tres `DRY_RUN=1` en verde;
  2. en el hilo principal, la campaña RED;
  3. con la rúbrica, `tests/sdd-roadmap-0150-red.md` (m3, m4, m5 y r7) y `tests/sdd-feedback-0150-red.md` (fb1).

  Un escenario sin fallo, y repetido sin fallo, saca su regla: paro y pido otra aprobación.
- [ ] **Step 4: Commit de la task**: `test(batteries): RED de la 0150: triaje, prompt desde el brief, fila 3.0.0 y fuente del ticket`.

### Task 2 — Plantillas: `ROADMAP.md`, `debt.md`, «Fuente» y el carril del prompt

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal, sin commitear, uno por fichero:
- `tests/AnchorTemplates.Tests.ps1`: `now-next-later-template.md` → `ROADMAP.md` en la raíz, `debt-template.md` → `.docs/sdd/steering/debt.md`, y `roadmap-template.md` marcada «2.x: la retira la 0157»;
- `tests/KitFeedback.Tests.ps1`: la plantilla tiene `- **Fuente**:` justo bajo la línea de «Qué pasó»;
- `tests/LaunchPrompt.Tests.ps1`: la ayuda del carril nombra `**Carril:**` del brief.

**Superficies**: docs (plantillas) y tooling (Pester)
**Verificación**: `moon run kit:test-fast`
**Se prueba en la aplicación**: no, porque es base común: las plantillas las usan las Tasks 3 a 5.

**Interfaces**:
- Consume: nada.
- Produce:
  - las dos plantillas, que calcan los Vitest de la Task 3 y los moldes de la Task 1. Calcadas sin sus bloques de ayuda, pasan el check de la Task 3, y sin tocar solo fallan por la prosa de esos bloques;
  - el hueco «Fuente», que la Task 5 nombra.

**Ficheros**:

- `now-next-later-template.md`:
  - la primera línea es `# Roadmap — <proyecto>`;
  - el bloque de ayuda dice quién la escribe y quién la lee (`sdd-roadmap`, los cierres y el corte), que la prioridad es el orden de las filas, los estados, el tamaño, el brief y sus cinco etiquetas, el `\|`, la línea `Perfil de control:` y Later con `B<n>`;
  - lleva `## Now` (con su ayuda sobre el título con versión), `## Next` y `## Later`;
  - cada tabla lleva una fila de ejemplo que pasa el check: en Now y Next, id `<id>`, brief y tamaño `M`; en Later, `B1`, sin brief ni tamaño.
- `debt-template.md`:
  - la primera línea es `# Deuda técnica — <proyecto>`;
  - el bloque de ayuda dice que es documento de estado: lo escriben `sdd-roadmap`, al triar, y los cierres, que quitan de «Lista» lo que saldan; lo leen `sdd-roadmap`, los cierres y `sdd roadmap check`;
  - la ayuda da también la cota (caducidad de «En espera» y salida de «Descartadas» tras dos releases `X.Y.0`), las reglas de «Lista» (nada sin «Evidencia» ni «Destino») y la «Fecha» (la entrada en el estado, que se conserva);
  - las cuatro tablas van vacías, con su fila de ejemplo dentro de la ayuda.
- `kit-feedback-template.md`, bajo «Qué pasó»: `- **Fuente**: <de dónde sale cada versión, cifra o cita de «Qué pasó»: un fichero o metadato del kit con su línea, o un comando con su salida — «`.docs/sdd/sdd-kit.json:3` → `"version": "2.3.3"`», «`claude plugin list` → `superpowers@7.0.0`»; un fichero del proyecto, con un descriptor genérico>`.
- `launch-prompt-template.md`, la ayuda del carril: «El del brief de la fila (`**Carril:**`), o el de la fila 2.x («Patch:» → patch), o el que pasó `sdd-explore`; sin ninguno, el que ves al leer la fila.», y el resto de la frase igual.
- `skills/sdd-templates/SKILL.md`:
  - dos filas en el índice;
  - `roadmap-template.md` → `.docs/sdd/roadmap.md`, «**2.x: la retira la 0157.**»;
  - `client-changelog-template.md`, «la retira la 0177»;
  - la fila de `sdd roadmap check` dice que valida `ROADMAP.md` (forma de `now-next-later-template.md`) o `.docs/sdd/roadmap.md` (forma de `roadmap-template.md`), y `steering/debt.md` si existe.

- [ ] **Step 1: Implementación**: los ficheros de arriba.
- [ ] **Step 2: Build**: no aplica.
- [ ] **Step 3: Verificación**: `moon run kit:test-fast`, en verde con los RED nuevos.
- [ ] **Step 4: Commit de la task**: `feat(templates): plantillas de ROADMAP.md y debt.md, y la fuente del ticket del kit`.

### Task 3 — `sdd roadmap check`: `ROADMAP.md` 3.0.0, `debt.md` y sin aviso del «Destino»

**Tras**: Task 2
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal, sin commitear, un test por THEN y AND del delta de `roadmap`.
- `cli/test/roadmap/now-next-later.test.ts`:
  - `requires Now, Next and Later in order, only tables`;
  - `accepts the profile line under Now and nothing else`;
  - `checks the Now title`;
  - `checks header, state, task, brief, size and ids of each row`;
  - `rejects a B id in Now or Next`;
  - `rejects an active state in Later`;
  - `accepts Tras ids named by the changelog as whole words`;
  - `checks each id of Tras`;
  - `keeps escaped pipes inside the brief`;
  - `the template without its help passes`;
  - `the untouched template only fails because of its help`.
- `cli/test/roadmap/debt.test.ts`:
  - `requires the four sections in order, only tables`;
  - `requires Evidencia and Destino in Lista`;
  - `checks the date format`;
  - `warns of a waiting row after two releases`;
  - `warns of a discarded row after two releases`;
  - `ignores patch versions and Unreleased`;
  - `counts releases with an em dash heading`;
  - `the debt template without its help passes`.
- `check.test.ts`:
  - `no longer warns about Destino`;
  - `still warns about a closing prefix`;
  - `validates debt.md next to a 2.x roadmap`;
  - `orders errors and warnings by file`;
  - `accepts CRLF in ROADMAP.md and debt.md`.
- En `root-roadmap.test.ts`, los fixtures de `ROADMAP.md` pasan a la forma 3.0.0.

**Superficies**: tooling (CLI)
**Verificación**: `moon run cli:typecheck cli:test kit:roadmap` y `node cli/bin/sdd.js roadmap check --path .docs/sdd`. Sobre este repo, el check da `Roadmap válido` sin ninguna línea `«Destino»` (hoy da 106).
**Se prueba en la aplicación**: no, porque es base común: el check lo usan el pre-commit y `sdd-roadmap`.

**Interfaces**:
- Consume:
  - de `parse.ts`: `parseSections(lines)`, `tableBlocks(lines, sections)`, `cells(line)` (respeta `\|`) y `lineAt`;
  - de `tables.ts`: `rowsOf(lines, block)` y `Row { index, title, cells }`;
  - de `layout.ts`: `resolveDocument(docsPath, 'roadmap' | 'changelog')` y `shadowWarning`;
  - las plantillas de la Task 2.
- Produce:
  - `nowNextLaterProblems(lines: string[], changelogText: string): string[]`;
  - `debtProblems(lines: string[]): string[]`;
  - `debtWarnings(lines: string[], releaseDates: string[]): string[]`;
  - `releaseDates(changelogText: string): string[]`, con las fechas de las versiones `X.Y.0`;
  - `namesId(changelogText: string, id: string): boolean`.

  Ninguna de estas funciones lleva el prefijo del fichero, que lo pone `checkRoadmap`. La salida de `checkRoadmap(sddPath): RoadmapResult` (`errors`, `warnings`, `lines`, `code`) no cambia de forma; `--json` lleva las líneas de los dos ficheros.

**Ficheros**: crear `cli/src/roadmap/now-next-later.ts`, `debt.ts` y `changelog.ts`; modificar `check.ts`, `warnings.ts`, `verbs.ts` (`summary`: «Valida que el roadmap y la deuda tienen la forma de su plantilla») y `tests/RoadmapStructure.Tests.ps1` (el comentario de los avisos).

- [ ] **Step 1: Implementación**:
  - `checkRoadmap` aplica `nowNextLaterProblems` si el fichero resuelto es `ROADMAP.md`, y las reglas 2.x de hoy si es `roadmap.md`;
  - valida `<docs>/steering/debt.md` si existe, también sin roadmap. Sin ninguno de los dos, la salida es la de hoy, `Sin roadmap que validar`;
  - en `warnings.ts` salen `destinationWarning`, `DESTINATIONS` y el ramal de «Deuda técnica», y se queda `closingWarning` para «Backlog» y «Deuda técnica».

  Mensajes, literales, sin el prefijo del fichero:

  | Regla | Mensaje |
  | --- | --- |
  | Prosa en una sección de `ROADMAP.md` | `línea <n>: prosa en «<sección>»; el roadmap solo lleva tablas` |
  | Sección fuera de la plantilla | `línea <n>: sección «<título>» fuera de la plantilla` |
  | Falta una sección | `falta la sección «<sección>»` |
  | Secciones fuera de orden | `línea <n>: «<la que va antes>» va antes que «<la que va después>»` |
  | Título de Now | `línea <n>: «<título>» no es «## Now» ni «## Now — <versión> · en preparación\|comprometida»` |
  | Cabecera de tabla | `línea <n>: la cabecera de «<sección>» debe ser «<cabecera>»` |
  | Estado no admitido | `línea <n>: estado «<estado>» no admitido: ⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …` |
  | Estado no admitido en Later | `línea <n>: estado «<estado>» no admitido en «Later»: ⏳, ⏸️ aparcada: …` |
  | «Tarea» sin título | `línea <n>: la «Tarea» no empieza por «**<título>**»` |
  | Fila sin brief | `línea <n>: la fila <id> no lleva brief («<details>»)` |
  | «Tras» con un id que no existe | `línea <n>: «Tras» nombra <id>, que no está en el roadmap ni en CHANGELOG.md` |
  | Tamaño no admitido | `línea <n>: tamaño «<valor>» no admitido: S, M, L` |
  | Id de Later sin `B<n>` | `línea <n>: el id «<id>» de «Later» no es «B<n>»` |
  | `B<n>` en Now o Next | `línea <n>: el id «<id>» de «<sección>» es de Later: resérvale uno al subirla` |
  | Prosa en `debt.md` | `línea <n>: prosa en «<sección>»; debt.md solo lleva tablas` |
  | «Lista» sin «Evidencia» | `línea <n>: fila de «Lista» sin «Evidencia»` |
  | «Lista» sin «Destino» | `línea <n>: fila de «Lista» sin «Destino»` |
  | «Fecha» mal escrita | `línea <n>: «Fecha» «<valor>» no es AAAA-MM-DD` |
  | Aviso de «En espera» | `aviso: línea <n>: en espera desde <fecha>, dos releases sin 2.º caso: caduca` |
  | Aviso de «Descartadas» | `aviso: línea <n>: descartada el <fecha>, dos releases después: sale en el corte` |

  Una celda «Evidencia» o «Destino» vacía, o con `—`, cuenta como sin valor.
- [ ] **Step 2: Build**: `moon run cli:typecheck`.
- [ ] **Step 3: Verificación**: `moon run cli:typecheck cli:test kit:roadmap` en verde. `node cli/bin/sdd.js roadmap check --path .docs/sdd` da `Roadmap válido` sin ninguna línea con `«Destino»`.
- [ ] **Step 4: Commit de la task**: `feat(cli): roadmap check valida ROADMAP.md 3.0.0 y debt.md, sin avisos del Destino`.

### Task 4 — `sdd-roadmap` en inglés: forma 3.0.0, equivalencias 2.x, prompt desde el brief y triaje

**Tras**: Task 3
**Modelo**: `subagent_type: sdd-kit:effort-high` + `model: sonnet`
**Tests RED**: los de la Task 1 (m3, m4, m5 y r7, con su evidencia). En el hilo principal, sin commitear, los Pester de forma:
- `sdd-roadmap` nombra `now-next-later-template.md` y `debt-template.md`;
- tiene la entrada «Triage»;
- su `description` lleva «triage»;
- `control-profiles.md` nombra `**Toca:**` y `## Now`.

**Superficies**: docs (skill) y tooling (Pester y baterías)
**Verificación**: `moon run kit:test-fast`
**Verificación lenta**: la campaña GREEN, en el hilo principal: m1 a m6 (2 sujetos cada uno), r7 (2) y la batería entera de `using-sdd` (30), con el kit de la rama. Dura ~90 min.
**Se prueba en la aplicación**: no, porque la conducta se mide con sujetos headless sobre los moldes: m3 a m6.

**Interfaces**:
- Consume:
  - el check de la Task 3, que `sdd-roadmap` ejecuta en su paso 5;
  - las plantillas de la Task 2;
  - los escenarios y las evidencias RED de la Task 1;
  - la tabla «Reglas que cambian o salen» de la spec.

  La tabla, copiada aquí para el implementador:

  | Regla de hoy | Dónde vive ahora |
  | --- | --- |
  | Paso 1: lee `.docs/sdd/roadmap.md` de la integración y de cada `feature/*` | Lee `ROADMAP.md` (o `.docs/sdd/roadmap.md` sin él) y `steering/debt.md` |
  | «Algo concreto»: fila en «Próximo» o «Backlog»; un patch con «Patch:» | 3.0.0: Now, Next o Later, con brief y tamaño; el patch, en Now con «Carril: patch». 2.x: la tabla de equivalencias |
  | «Algo grande» y «Reordenar»: «`proposal: <id>`» y «tras NNNN» en «Ítem» | 3.0.0: el `**Requisitos:**` del brief, la columna «Tras» y el orden; la propuesta, en `changes/`. 2.x: la tabla |
  | «Preparar una release», paso 6: `## Release <N>` con «Ficheros que toca» | 3.0.0: el título de Now, el orden de las filas y el «Toca:» de cada brief. 2.x: la tabla |
  | «Dar el prompt de una fila» | Además, el brief es la fuente de cada línea; una fila de Later no da prompt |
  | Red flag: sección que no está en `roadmap-template.md` | «… que no está en la plantilla de su forma» |
  | — | Entrada nueva «Triage», con su red flag: «vas a proponer en Lista un ítem sin evidencia, o con un dato que no has contrastado» |
  | `description` | En inglés, con «triage» |

  El resto de pasos, entradas, red flags y racionalizaciones se traduce sin cambiar la regla.
- Produce: `skills/sdd-roadmap/SKILL.md` en inglés y la evidencia GREEN.

**Ficheros**:

- `skills/sdd-roadmap/SKILL.md`:
  - la tabla de equivalencias 2.x de la decisión 1 de la spec (Now y Next → «Próximo»; Later → «Backlog» con `B<n>`; «Tras» → «tras NNNN» en «Ítem»; el patch → «Patch:»; preparar release → `## Release <N>` con «Ficheros que toca»; Lista → `**Actuar**`; En espera → `**Esperar 2.º ticket**`, con lo que falta; Descartada → `**Descartada**`, con su motivo; sin «Por triar»);
  - la entrada «Triage», con las reglas de las decisiones 11 y 7 ter de la spec y los ANDs del delta de `planning`;
  - la `description`, en inglés.
- `skills/sdd-start-feature/references/control-profiles.md`:
  - línea 17: «(en `ROADMAP.md`, entre `## Now` y su tabla)»;
  - línea 75: «en el `**Toca:**` del brief de su fila (`ROADMAP.md`) o en «Ficheros que toca» (roadmap 2.x)».
- `skills/using-sdd/SKILL.md`: «triar la deuda o un ticket» en la fila de planificar, **solo si** r7 no entró por `sdd-roadmap` en el RED.
- Los Pester que leen `sdd-roadmap` (`PlanEntry`, `TaskIds`, `MigrationInitParity`, `FeatureRename`, `ReleaseFlow`, `RoadmapClosing` y `SingleEntry`): la frase pasa al inglés, o se retira si la mide la batería, y se dice cuál.
- `tests/WordBudget.Tests.ps1`: el tope de `sdd-roadmap`, si se pasa, sube a la centena de arriba de lo medido (decisión 17 de la spec).
- `tests/batteries/sdd-roadmap/battery.md`: «Procedencia de las reglas», una fila por regla nueva con su RED y su GREEN.

- [ ] **Step 1: Implementación**: la skill y los ficheros de arriba. Cada regla nueva cita su evidencia (`tests/sdd-roadmap-0150-red.md`, `<escenario>`).
- [ ] **Step 2: Build**: no aplica.
- [ ] **Step 3: Verificación**:
  1. `moon run kit:test-fast`;
  2. la campaña GREEN, en el hilo principal;
  3. con la rúbrica, `tests/sdd-roadmap-0150-green.md`.

  Un GREEN en rojo pasa por REFACTOR, con un sujeto de control por escenario afectado.
- [ ] **Step 4: Commit de la task**: `feat(sdd-roadmap): Now / Next / Later, triaje de la deuda y prompt desde el brief, en inglés`.

### Task 5 — `sdd-feedback` en inglés, con la fuente de cada dato

**Tras**: Task 2
**Modelo**: `subagent_type: sdd-kit:effort-high` + `model: sonnet`
**Tests RED**: el de la Task 1 (fb1, con su evidencia). En el hilo principal, sin commitear, un Pester en `tests/KitFeedback.Tests.ps1` que comprueba dos cosas:
- `sdd-feedback` pide «Fuente» para cada versión, cifra o cita de «What happened»;
- y quita lo que no está comprobado.

**Superficies**: docs (skill) y tooling (Pester y batería)
**Verificación**: `moon run kit:test-fast`
**Verificación lenta**: GREEN de fb1 (1 sujeto) en el hilo principal, ~10 min.
**Se prueba en la aplicación**: no, porque la conducta se mide con un sujeto headless (fb1).

**Interfaces**:
- Consume:
  - el hueco `- **Fuente**:` de `kit-feedback-template.md` (Task 2);
  - fb1 y su evidencia RED (Task 1).
- Produce: `skills/sdd-feedback/SKILL.md` en inglés y `tests/sdd-feedback-0150-green.md`.

**Ficheros**: `skills/sdd-feedback/SKILL.md` y `tests/KitFeedback.Tests.ps1` (la frase pasa al inglés).

- [ ] **Step 1: Implementación**:
  - la skill, traducida sin cambiar sus reglas;
  - en la regla de verificación, la nueva: «Every version, figure or quote in "What happened" comes from a file or a command named in "Fuente"; one you remember and haven't checked doesn't go in: check it or drop it», con su evidencia (`tests/sdd-feedback-0150-red.md`, fb1);
  - «Fuente» cita metadatos o ficheros del kit, o un comando, y un dato del proyecto va con un descriptor genérico;
  - el ticket se sigue escribiendo en castellano.
- [ ] **Step 2: Build**: no aplica.
- [ ] **Step 3: Verificación**: `moon run kit:test-fast` y el GREEN de fb1, en el hilo principal, con la rúbrica.
- [ ] **Step 4: Commit de la task**: `feat(sdd-feedback): la fuente de cada dato del ticket, en inglés`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 3,5 h
- Estimación de implementación: 4,5 h
- Base de la estimación: cinco tasks, una CLI con su contrato escrito y dos campañas (RED y GREEN, ~54 sujetos). La referencia es la 0161 (cinco tasks y dos baterías, estimada en 7 h y hecha en 2,7 h), con más CLI y menos skills.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `no declarado` en `operations.md` ni en `tech-stack.md` §Testing (decisión 6); se ejecutan las tareas de moon de «Contenido y build»: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Verificación de los criterios de éxito de la spec:
  - el check sin avisos de «Destino» sobre este repo;
  - m3: ningún sujeto propone en «Lista» la fila de la 1.4.2;
  - fb1: el ticket da la versión instalada con su fuente.
- [ ] Spec satisfecha: cada requisito tiene su task (§4).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`), con la validación en campo (`validation.mode: field`).

---

## 4. Self-review (cobertura spec → tasks)

- `roadmap`, cuatro ADDED: «`ROADMAP.md` tiene Now, Next y Later…», «El título de Now…», «Las filas de `ROADMAP.md`…» y «`debt.md` tiene una sección por estado…» → Task 3, más las plantillas de la Task 2. ✓
- `roadmap` ADDED «Una fila en espera caduca…» → Task 3, `warns of a waiting row…`, `warns of a discarded row…`, `ignores patch versions…`. ✓
- `roadmap` MODIFIED «El roadmap vive en `ROADMAP.md`…» → Task 3, `root-roadmap.test.ts` y `validates debt.md next to a 2.x roadmap`. ✓
- `roadmap` MODIFIED «Cada feature de una release declara los ficheros que toca» → Task 2 (etiqueta `**Toca:**`) y Task 4 (`sdd-roadmap` la escribe). ✓
- `roadmap` REMOVED y ADDED del aviso de cierre 2.x → Task 3, `no longer warns about Destino` y `still warns about a closing prefix`. ✓
- `planning` ADDED de la fila nueva → Task 4, m5. ✓
- `planning` ADDED del triaje → Task 4, m3. ✓
- `planning` ADDED de la forma 2.x → Task 4, m6. ✓
- `planning` MODIFIED «Dame el prompt…» → Task 4, m4 (brief) y m1 (2.x). ✓
- `planning` MODIFIED «Algo grande», «Una reunión», «Un cambio de definición», «Reordenar», «Preparar una release», «Solo escribe en las secciones…» y «Un patch pendiente» → Task 4, tabla de equivalencias y Pester de forma; sin escenario propio, con su motivo en la decisión 21 de la spec. ✓
- `kit-feedback` MODIFIED → Tasks 2 y 5, fb1. ✓
- `control-profiles`, los dos MODIFIED → Task 4 (`control-profiles.md`, líneas 17 y 75) y Task 3 (la línea `Perfil de control:` que admite el check). ✓
- `routing` ADDED → Task 4, r7 y la batería de `using-sdd`. ✓
- `onboarding` MODIFIED → Task 2, `AnchorTemplates.Tests.ps1`. ✓
- Saldar las filas de deuda de los avisos del «Destino» (patch 0164) y de la «7.1.0» (0165 §1) → cierre, con el walkthrough. ✓
- Review Focus → Task 3 (cinco tests nombrados) y Task 4 (tabla de equivalencias, lectura en la revisión). ✓
