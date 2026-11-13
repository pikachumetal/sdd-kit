---
id: 20261113-131112-feature-0341-interviewer-spike
feature: 0341
title: Plan de implementación — Spike: qué postura de entrevista va en el núcleo del entrevistador del kit
spec: ./spec.md
status: approved
created: 2026-11-13
---

# Plan de implementación — Spike: qué postura de entrevista va en el núcleo del entrevistador del kit

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: el hilo hace las cinco tasks (Native, el de todo spike); los sujetos son los de la batería (Sonnet, persona Haiku en `pe`), y los lectores de la Task 4 van con `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (decisión 12 de la spec). Revisión final de rama: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: native, porque un spike siempre va en Native.
3. El corte de `pe` en la primera petición de aprobación (decisión 7 de la spec) se hace con la hoja de la persona y la rúbrica, sin tocar `converse` de `tests/headless/lib.mjs`: la persona contesta a esa petición «déjame pensarlo; por hoy lo dejamos aquí» sin signo de interrogación, y E7 y las demás filas se puntúan solo hasta esa petición. Tocar `converse` exigiría su test en `cli/test/kit/headless/` para un solo escenario.
4. El `transcript.txt` sale de un script de la batería, `tests/batteries/interviewer/transcript.mjs`, y no de un modo nuevo de `tests/headless/extract.mjs`: es del spike y de la 0342, que adopta la batería; el `.jsonl` vive en `RUNS_DIR`, sin versionar, así que el transcript se genera al acabar cada tanda y va a `<fase>/out/` junto a `texts.txt` y `tools.txt`.
5. Las copias del kit las hace `tests/batteries/interviewer/make-kits.mjs` desde `dist/` (tras `moon run kit:build`), una por núcleo, en `.temp/i/kit-<núcleo>` (ruta corta); `RUNS_DIR` en `.temp/i/runs`.
6. Fases: `seco` (pasada en seco), `control-a`, `control-b`, `matt`, `brainstorming`, `openspec` y `look-decide-ask`; `SPEC_DIR` es la carpeta de esta spec, así `SUBJECT_CAP` cuenta la campaña entera.
7. Riesgo alto: que `g9` o `rq` no carguen el núcleo desde `sdd-explore` (la batería actual anota «g9 no carga la skill»); la pasada en seco lo mide antes de gastar en los seis brazos.
8. Coste estimado: ~75 $ de campaña (tabla de la spec), ~7 h de reloj, casi todo esperando a los sujetos; el hilo y las reviews, en `timing.json`.
9. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: medir cinco núcleos de `sdd-grilling` (seis brazos con el A/A) con una batería de fondo en explore, init y propose, y dejar `research.md` con la tabla, la matriz de cobertura y una recomendación para que elija el dev-lead.

**Architecture**: cada brazo es una copia de `dist/` con solo `skills/sdd-grilling/SKILL.md` sustituido por su núcleo de `cores/`; la batería nueva `interviewer` lanza los once escenarios con `KIT_DIR` en esa copia. Los lectores puntúan transcripts barajados por escenario; el hilo relee, junta y escribe `research.md`.

**Tech Stack**: Node (los scripts `.mjs` de `tests/headless/` y de la batería), `claude -p` de los sujetos, `moon run kit:build`.

**Spec**: `./spec.md`

**Ejecución**: native, porque un spike siempre va en Native, sus cinco tasks se encadenan por los datos de la anterior y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo añade una batería de pruebas y evidencia; no toca módulos, manifests ni contratos de `cli/` o `skills/`.

## Restricciones globales

### De código

- Art. X de la constitution, literal: «**Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario.» · «**Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough.» · «Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).»
- El texto con escapes o rutas de Windows se escribe con las herramientas de edición, no desde la shell (`operations.md`, «Cómo se testean las skills»).
- Un `|` dentro del regex de una fila de rúbrica de máquina va escapado, `\|`.
- La batería actual de `sdd-grilling` y `skills/` no se tocan.

### De proceso

- Política de modelos del Art. IV; `fable` y `opus xhigh`, prohibidos salvo justificación escrita (la review de la spec en Fable la pidió el dev-lead).
- Sujetos con `COST_CAP=75` y `SUBJECT_CAP=230`; paradas de la spec: `pe` a n = 4 si pasa de 1,5 $ por sujeto en seco; parar antes de los lectores si los seis brazos con relanzamientos pasan de 65 $; parar si la campaña pasa de 75 $.
- Commits: tipo/scope en inglés, título y cuerpo en castellano (Art. VI), con la atribución `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Un sujeto cuyo `.jsonl` corta a mitad (timeout, `SUBJECT_TIMEOUT`) → su transcript acaba en el último evento entero y lleva la línea `(stream cortado)`; cuenta como «sin evidencia» y se relanza · Task 1, comprobación de `transcript.mjs` sobre un `.jsonl` truncado a mano.
- Un sujeto que carga `sdd-grilling` después del mensaje puntuado → para esa fila cuenta como «no cargó», no como «pasa» · Task 4, regla del encargo de los lectores, y relectura del hilo.
- En `pe`, el sujeto que nunca pide aprobación → se puntúa hasta su último mensaje, y si llega a 8 respuestas sin el punto de parada de E7, «sin veredicto» · Task 1, `persona-pe.md` y fila E7 de `battery.md`.
- Un brazo cuya copia del kit no lleva su núcleo (copia equivocada) → la Task 2 compara el `SKILL.md` de cada copia con su `cores/<núcleo>.md` byte a byte antes de lanzar · Task 2, salida de `make-kits.mjs --check`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: se reutiliza el arnés (`battery.mjs`, `lib.mjs`, moldes de `sdd-grilling` y `using-sdd`); solo hay dos scripts nuevos y pequeños.
- [x] **YAGNI gate**: `transcript.mjs` y `make-kits.mjs` los usan esta campaña y la 0342.
- [x] **Brownfield gate**: no cambia nada existente; la batería nueva vive al lado.
- [x] **Constitution check**: Art. I (previsión declarada en la spec), Art. IX (avisos MIT en `cores/NOTICE.md`), Art. X (restricciones de código), Art. XI (evidencia en la carpeta de la spec).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/interviewer/battery.md` — los once escenarios (Id, Paso, Petición, Molde, Esperado, n, Umbral, Modelo, Procedencia) y la rúbrica E0–E7 con los reparos.
- `tests/batteries/interviewer/subject.mjs` — moldes (`salas`, `salas-csv`, `salas-sin-docs`, `vacio`, con los de `sdd-grilling` por ruta), turnos (`TURN2` de `g1`, `g3`, `fp`), web en `g9`, `converse` en `pe`.
- `tests/batteries/interviewer/persona-pe.md` — la hoja de la decisión 7 de la spec.
- `tests/batteries/interviewer/transcript.mjs` — `.jsonl` → `transcript.txt`.
- `tests/batteries/interviewer/make-kits.mjs` — copias del kit por núcleo y su comprobación.
- `.docs/sdd/specs/20261113-131112-feature-0341-interviewer-spike/<fase>/out/` — evidencia de cada tanda (la escribe `battery.mjs`), más los transcripts.
- `.docs/sdd/specs/20261113-131112-feature-0341-interviewer-spike/readings/` — la salida de cada lector y la relectura del hilo.
- `.docs/sdd/specs/20261113-131112-feature-0341-interviewer-spike/research.md` — calcado de `research-template.md`.

**Modificar**:

- `ROADMAP.md` — la 0342 lleva la 0338, y la 0338 sale (hecho en la apertura, con `sdd-roadmap`).

**NO se tocan**:

- `skills/` y `dist/skills/` — el spike no edita ninguna skill; los núcleos viven en las copias de `.temp/`.
- `tests/batteries/sdd-grilling/` — su batería sigue midiendo la skill vigente.
- `tests/headless/lib.mjs` y `extract.mjs` — decisión 3 y 4 de este plan.

### 1.6 Dependencias

- Clones de las fuentes en `D:\code\github\upstream` (solo para releer; los núcleos ya están en `cores/`).
- `claude -p` en la máquina, con red para `g9`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `g9` o `rq` no cargan el núcleo desde explore | media | alta: escenario vacío | pasada en seco; escenario fuera de la recomendación si carga menos del 80 % (decisión 10 de la spec) |
| `pe` cuesta más de lo previsto | media | media | pasada en seco; n = 4 si pasa de 1,5 $ por sujeto |
| Un lector desborda el contexto con 30 transcripts | baja | media | `fp` y `pe` en dos lectores de 15 |
| Carga de la máquina alarga los sujetos | media | baja | sujetos de 3 en 3; `SUBJECT_TIMEOUT` por omisión |

### 1.8 Rollout

Directo: evidencia y una batería de pruebas; no viaja en el plugin (`dist/` no cambia).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Batería `interviewer` y transcript

**Tras**: —
**Modelo**: hilo principal (Native).
**Evidencia**: O1 necesita una batería que llegue a cada fila · `node --check` de los tres `.mjs`, `battery.mjs plan` y `transcript.mjs` sobre un `.jsonl` truncado a mano · sin fila de `research.md` (es la herramienta de las demás).

**Superficies**: tooling.
**Verificación**: `node --check tests/batteries/interviewer/subject.mjs && node --check tests/batteries/interviewer/transcript.mjs && node --check tests/batteries/interviewer/make-kits.mjs` → sin salida, código 0 · `node tests/headless/battery.mjs plan tests/batteries/interviewer/battery.md` → última línea `suma: 28 sujetos · coste previsto: <x> $`.

**Interfaces**:
- Consume: `scenarioCell`, `subjectCell`, `moldFrom` de `tests/headless/battery.mjs`; `initSubject` de `tests/headless/lib.mjs` (`s.copy`, `s.putKitMarker`, `s.put`, `s.initRepo`, `s.env`, `s.launch`, `s.resume`, `s.converse`, `s.keep`, `s.save`, `s.git`); moldes `tests/batteries/using-sdd/mold-salas` y la fila 0002 de `salas-csv` de `tests/batteries/sdd-grilling/subject.mjs`.
- Produce: `BATTERY=interviewer`; `node tests/batteries/interviewer/transcript.mjs <runs-de-la-fase> <out-de-la-fase>` escribe `<etiqueta>.transcript.txt` por cada `<etiqueta>.jsonl`; formato de cada línea: `## usuario` / `## persona` / `## agente` con su texto, y `> <Herramienta>: <primer argumento, recortado a 160 caracteres>` por llamada, en el orden del stream; `(stream cortado)` si la última línea no parsea.

**Ficheros**: crear `tests/batteries/interviewer/battery.md`, `subject.mjs`, `persona-pe.md`, `transcript.mjs`, `make-kits.mjs`.

- [ ] **Step 1: Implementación**
  - `battery.md`: cabecera (qué mide, cómo se lanza, molde, turnos extra) y la tabla de escenarios con estas filas literales de petición (las de `g2`, `g3`, `g8`, `g9`, `p1`, `p2`, `p3` copiadas de `tests/batteries/sdd-grilling/battery.md`):
    - `g1` · sdd-explore · «Pensémoslo bien antes de tocar nada: ¿cómo enfocarías dejar reservar medias horas?» · salas · `sdd-kit:sdd-explore` · n 2 · umbral 2/2 · sonnet
    - `rq` · sdd-explore · «Pensemos cómo guardar las reservas para que no se pierdan al reiniciar.» · salas · `sdd-kit:sdd-explore` · 2
    - `fp` · sdd-propose · «Carril feature, modo full: añade un comando para ver qué salas están libres en una franja, que todavía no existe.» · salas · `sdd-kit:sdd-propose` · 5
    - `pe` · sdd-propose · la petición de `p2` · salas · `sdd-kit:sdd-propose` · 5
    - las demás con n 2 (`g8` sube de 1 a 2).
    La rúbrica: E0–E7 y los reparos, con el texto de la decisión 9 de la spec; E5 y las demás dicen que las preguntas operativas del llamante no cuentan; cada fila admite «no aplica»; la regla de carga (decisión 10).
  - `subject.mjs`: como el de `sdd-grilling` en moldes y guardado; `turn2 = { g1: 'lo quiero porque hay reuniones de media hora y hoy bloquean una franja entera de dos horas', g3: goAhead, fp: 'mantengo lo que dije' }`; `g9` con `EXTRA_ALLOWED = 'WebSearch WebFetch'`; `pe` lanza y después `s.converse(join(HERE, 'persona-pe.md'), 8)`; `MAX_TURNS` 30.
  - `persona-pe.md`: la hoja de la decisión 7 de la spec, con la respuesta a la aprobación «déjame pensarlo; por hoy lo dejamos aquí» (sin «?»).
  - `transcript.mjs`: `main(runsDir, outDir)`; `renderEvent(event)` → líneas; los mensajes `user` de texto son `## usuario`, salvo los que siguen a una respuesta de la persona (fichero `<etiqueta>.persona-<n>.txt` presente), que son `## persona`; los `tool_result` no se copian.
  - `make-kits.mjs`: `makeKits(distDir, coresDir, targetDir)` copia `dist/` a `<target>/kit-<núcleo>` por cada `cores/<núcleo>.md` salvo `NOTICE.md` y sustituye `skills/sdd-grilling/SKILL.md`; `--check` compara cada copia con su núcleo y sale con 1 si alguna difiere.
- [ ] **Step 2: Build** — no aplica (scripts Node sin compilar).
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; además, `transcript.mjs` sobre un `.jsonl` truncado a mano en `.temp/i/` → acaba en `(stream cortado)`.
- [ ] **Step 4: Commit de la task** — `test(interviewer): batería de fondo del entrevistador y transcript por sujeto`.

### Task 2 — Copias del kit y pasada en seco

**Tras**: Task 1
**Modelo**: hilo principal (Native).
**Evidencia**: decisiones 10 y 11 de la spec · `seco/out/` con `g1`, `g9`, `rq`, `fp` y `pe` (un sujeto cada uno, núcleo `control`), sus transcripts, y una línea por escenario: cargó el núcleo sí/no, coste · fila «Pasada en seco» de `research.md`.

**Superficies**: tooling.
**Verificación**: `moon run kit:build` → verde · `node tests/batteries/interviewer/make-kits.mjs dist .docs/sdd/specs/20261113-131112-feature-0341-interviewer-spike/cores .temp/i --check` → código 0 · la tanda en seco: `BATTERY=interviewer SCENARIOS="g1 g9 rq fp pe" N=1 SPEC_DIR=<carpeta de la spec> PHASE=seco KIT_DIR=.temp/i/kit-control RUNS_DIR=.temp/i/runs COST_CAP=75 SUBJECT_CAP=230 node tests/headless/battery.mjs run` → cinco sujetos con `tools.txt` y RESULTADO.

**Interfaces**:
- Consume: `make-kits.mjs` y `transcript.mjs` de la Task 1.
- Produce: `.temp/i/kit-<núcleo>` para los cinco núcleos; el coste medido de `pe` y la decisión de su n (5, o 4 si pasa de 1,5 $); si `g9` o `rq` no cargan el núcleo, se dice ya y la Task 3 los lanza igual (la regla del 80 % decide con las dos tandas del control).

**Ficheros**: evidencia en `seco/out/`.

- [ ] **Step 1: Implementación** — build, copias, `--check`, tanda en seco, `transcript.mjs .temp/i/runs/seco <carpeta>/seco/out`.
- [ ] **Step 2: Build** — `moon run kit:build`.
- [ ] **Step 3: Verificación** — los comandos de arriba; leer los cinco transcripts: el `Skill` de `sdd-grilling` aparece, los turnos de `g1`, `fp` y la persona de `pe` se ven separados.
- [ ] **Step 4: Commit de la task** — `test(interviewer): pasada en seco del control y copias del kit por núcleo`.

### Task 3 — Seis brazos

**Tras**: Task 2
**Modelo**: hilo principal (Native); los sujetos, los de la batería.
**Evidencia**: O1 y O3 · `control-a/out/`, `control-b/out/`, `matt/out/`, `brainstorming/out/`, `openspec/out/`, `look-decide-ask/out/`, con transcripts, y `battery.mjs verdict` de cada fase · filas de la tabla de cumplimiento de `research.md` (las rellena la Task 4).

**Superficies**: tooling.
**Verificación**: por brazo, `BATTERY=interviewer SPEC_DIR=<carpeta> PHASE=<brazo> KIT_DIR=.temp/i/kit-<núcleo> RUNS_DIR=.temp/i/runs COST_CAP=75 SUBJECT_CAP=230 node tests/headless/battery.mjs run` (con `N` si `pe` bajó a 4), y `node tests/headless/battery.mjs verdict tests/batteries/interviewer/battery.md <carpeta>/<brazo>/out` → una línea por escenario; después `transcript.mjs`.

**Interfaces**:
- Consume: las copias del kit y la n de `pe` de la Task 2.
- Produce: 28 sujetos por brazo (o 26 con `pe` a 4), con transcript; lista de sujetos que no cargaron el núcleo y de los relanzados una vez (`run --resume` o `SCENARIOS` con esos ids).

**Ficheros**: evidencia en `<brazo>/out/`.

- [ ] **Step 1: Implementación** — lanzar los seis brazos en orden `control-a`, `matt`, `brainstorming`, `openspec`, `look-decide-ask`, `control-b`; tras cada uno, transcripts y lista de «no cargó»; relanzar una vez los que no cargaron o salen «sin evidencia».
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — coste acumulado tras cada brazo; si los seis con relanzamientos pasan de 65 $, parar antes de la Task 4 y preguntar al dev-lead.
- [ ] **Step 4: Commit de la task** — `test(interviewer): seis brazos del spike con sus transcripts`.

### Task 4 — Lectura por escenario y matriz de cobertura

**Tras**: Task 3
**Modelo**: lectores `subagent_type: sdd-kit:effort-medium` + `model: sonnet`, 13 (uno por escenario; `fp` y `pe`, dos de 15 sujetos), de 3 en 3; el hilo relee.
**Evidencia**: O1 y O2 · `readings/<escenario>.md` (una línea por sujeto y fila: pasa · falla con cita · no aplica · no cargó), `readings/key.md` (la clave etiqueta neutra → brazo, que los lectores no ven), `readings/relectura.md` (los «falla» y la muestra fija de «pasa» releídos, con acuerdo o corrección) y `readings/coverage.md` (matriz fila × núcleo: sí · no · la contradice, con la frase del núcleo) · tabla de cumplimiento y matriz de `research.md`.

**Superficies**: docs.
**Verificación**: cada sujeto puntuado tiene una línea por fila que le aplica; los totales por fila y brazo cuadran con `readings/`; la clave no aparece en ningún encargo de lector.

**Interfaces**:
- Consume: transcripts de la Task 3; la rúbrica de `tests/batteries/interviewer/battery.md`.
- Produce: recuentos por fila, brazo y sitio; diferencia del A/A por fila; matriz de cobertura.

**Ficheros**: crear `readings/`.

- [ ] **Step 1: Implementación** — barajar etiquetas por escenario (`c1`…`c6` por sujeto, al azar, clave en `readings/key.md`); encargo del lector: la rúbrica, la regla de carga, «no aplica» y que las preguntas operativas del llamante no cuentan, los transcripts del escenario, y «devuelve solo la tabla»; relectura del hilo; matriz de cobertura leyendo los cinco `cores/`.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — la de arriba.
- [ ] **Step 4: Commit de la task** — `test(interviewer): lectura por escenario, relectura y matriz de cobertura`.

### Task 5 — `research.md` y recomendación

**Tras**: Task 4
**Modelo**: hilo principal (Native).
**Evidencia**: O1, O2 y O3 · `research.md` calcado de `research-template.md`: pregunta, método (brazos, núcleos con palabras, escenarios, n, lectura), pasada en seco, tabla de cumplimiento por fila y brazo con el A/A, tabla por sitio, matriz de cobertura, indicio O3, recomendación con el umbral de la decisión 13, límites (Sonnet, lectura no ciega del todo, lo que ponen los llamantes), insumos (interview-me de Addy Osmani y de Sorbh, papers, buenas prácticas de Claude Code) y condiciones de la 0342.

**Superficies**: docs.
**Verificación**: cada número de `research.md` sale de `readings/` o de los `verdict`; cada fila de fondo tiene su línea en la tabla; la recomendación cita la regla de la decisión 13 que cumple o la que no.

**Interfaces**:
- Consume: los recuentos y la matriz de la Task 4; el coste real de las tandas.
- Produce: la recomendación que lee el dev-lead para elegir.

**Ficheros**: crear `research.md`.

- [ ] **Step 1: Implementación** — escribir `research.md`.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — la de arriba; presentar la tabla y la recomendación al dev-lead y esperar su elección (la condición de hecho de la spec), que se anota en `research.md` con su frase.
- [ ] **Step 4: Commit de la task** — `docs(sdd): research del spike 0341 y elección del dev-lead`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 3h
- Estimación de implementación: 8h (7 h de reloj de campaña, casi todo esperando; 1 h de scripts)
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 5 tasks; la campaña de la 0152 (z-grl, 35 sujetos) como referencia de ritmo; incertidumbre en `pe` y en la carga del núcleo desde explore.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los objetivos de la spec (O1, O2, O3)
- [ ] Spec satisfecha: cada decisión medible tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`), tras la elección del dev-lead

---

## 4. Self-review (cobertura spec → tasks)

- O1, tabla por fila (E0–E7) y brazo con el A/A → Task 3 (fases), Task 4 (`readings/`), Task 5 (tabla). ✓
- O1, tabla por sitio → Task 5, agrupando `readings/` por el paso del escenario. ✓
- O1, «no aplica» fuera del denominador → Task 4, encargo del lector. ✓
- O2, recomendación con el umbral de la decisión 13 → Task 5. ✓
- O3, indicio de la frase → Task 5, con `p2`, `p3` y `pe` de `look-decide-ask` frente a `control-a` y `control-b`. ✓
- Decisión 2, bloques comunes iguales → ya en `cores/`; Task 2, `make-kits.mjs --check`. ✓
- Decisión 3, matriz de cobertura → Task 4, `readings/coverage.md`. ✓
- Decisión 6, once escenarios y sus turnos → Task 1, `battery.md` y `subject.mjs`. ✓
- Decisión 7, hoja de la persona y corte → Task 1, `persona-pe.md`; el corte, por la hoja y la rúbrica (decisión 3 de este plan). ✓
- Decisión 10, carga del núcleo, relanzar una vez y regla del 80 % → Task 3 (relanzar), Task 4 (no cargó), Task 5 (escenario fuera). ✓
- Decisión 11, n y `pe` a 4 → Task 2 (precio), Task 3. ✓
- Decisión 12, transcript, lectores por escenario, relectura → Task 1 (`transcript.mjs`), Task 4. ✓
- Decisión 14, condiciones de la 0342 → Task 5. ✓
- Decisión 15, 0338 en la 0342 → hecho en la apertura (`ROADMAP.md`). ✓
- Paradas de coste → Task 2 (`pe`), Task 3 (65 $), `COST_CAP=75` en cada tanda. ✓
- Review Focus → Task 1 (stream cortado, `pe` sin aprobación), Task 2 (`--check`), Task 4 (carga tras el mensaje). ✓
