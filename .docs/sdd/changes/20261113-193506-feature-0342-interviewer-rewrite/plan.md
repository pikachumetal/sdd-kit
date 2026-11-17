---
id: 20261113-193506-feature-0342-interviewer-rewrite
feature: 0342
title: Plan de implementación — Reescribir el entrevistador del kit
spec: ./spec.md
status: approved
created: 2026-11-13
---

# Plan de implementación — Reescribir el entrevistador del kit

## Decisiones que he tomado yo — valida estas

1. Modelo por task: las cinco las hace el hilo (Native), en la sesión de hoy (Opus 5.5); los lectores de las tandas, `sdd-kit:effort-medium` + `sonnet` (spec, decisión 7), de 3 en 3; los sujetos los lanza `battery.mjs` con el modelo de su fila (Sonnet; la persona de `pe`, Haiku). La revisión final, con los ejes de `sdd-verify`: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: native — ver la línea `Ejecución`. La sesión viene de una compactación que pasó durante la spec, antes de existir este plan y su ledger: la regla de compactación del método protege tasks empezadas antes de compactar, y aquí no hay ninguna; si la sesión compacta durante la implementación, se aplica tal cual.
3. Los tests de `extract.mjs` van en `cli/test/kit/interviewer-transcript.test.ts` junto a los de `transcript.mjs`: hoy ningún test llama a `extract.mjs tools` directamente (solo `subject-output-privacy` mira su `clean`), y los dos ficheros cambian por la misma razón (la línea de un `Read`).
4. El kit de cada tanda: el RED, `dist/` de la Task 1 copiado a `.temp/i/kit-red`; el GREEN y el REFACTOR, `dist/` de la Task 3 en adelante copiado a `.temp/i/kit`; los dos sin `.docs/` ni `tests/` (spec, Approach).
5. Riesgo alto: el GREEN en rojo tras dos rondas de REFACTOR (spec, decisión 8) — parada y desvío al dev-lead.
6. Coste estimado: ~6 h de hilo; sujetos ≤ 42,76 $ (`COST_CAP=44`), lectores y revisores ~5,5 $ (spec, «Previsión de coste»).
7. Gate de cierre: el de `operations.md` §Testing, literal en §3.
- Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el núcleo de `sdd-grilling` reescrito de cero (cómo se pregunta), el territorio en cada llamante y la batería del entrevistador en verde con su n, sin subir el saldo de palabras.

**Architecture**: primero se arregla el instrumento (fila K, `extract.mjs`, `transcript.mjs`) y se mide el RED con el núcleo de hoy; después se escribe el núcleo del borrador aprobado y cada territorio compensado en su paso, y el GREEN decide qué frase se queda. Nada de código de producto: herramientas de batería, tests y texto de skills.

**Tech Stack**: Node (`.mjs` de `tests/`), Vitest en `cli/`, moon (`kit:build`, `kit:skill-size`, `kit:own`, `kit:notices`), baterías headless (`tests/headless/battery.mjs`).

**Spec**: `./spec.md`

**Ejecución**: native, porque las cinco tasks se encadenan (el RED necesita la K arreglada, el GREEN el núcleo escrito), el grueso son tandas de batería que lanza el hilo en segundo plano en cualquier método, un error de texto lo caza el GREEN y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no entra módulo, dependencia ni contrato entre módulos; cambia la línea `Read` de `tools.txt`, que solo leen las baterías (spec, decisión 11, comprobado en la Task 1).

## Restricciones globales

### De código

- Fila K, literal: `` `tools: /^>>> (Skill: \S*sdd-grilling(\s\|$)\|Read: [^\n]*sdd-grilling[\\/]SKILL\.md(\n\|$)\|(Bash\|PowerShell): ([^\n]*[;&\n] *)?(cat\|Get-Content) (?![^;&\|\n]*(-TotalCount\|-Tail\|-Head\|-First\|>))[^;&\|\n]*sdd-grilling[\\/]SKILL\.md(?![\w.])[^;&\|\n]*([;&\n]\|$))/` ausente ``.
- Línea de `Read` con rango: `<ruta> · offset=<n> · limit=<n>`, solo con los campos presentes.
- `transcript.mjs`: `ARG_MAX = 160` solo para el volcado JSON; `Bash`, `PowerShell` y `Read` sin cortar.
- Núcleo: el de `50317a64` sin territorio, con las tres piezas medidas de la decisión 15 de la spec (enmiendas del 2026-11-14); menos de 887 palabras (`wc -w` sobre `skills/sdd-grilling/SKILL.md`); lo traído sustituye una regla, nunca se suma.
- Topes: `sdd-grilling` 886; los demás sin cambio; saldo de las skills tocadas ≤ 0. `proposal.md`, `sdd-config` y `spec-template.md` sin cambio frente a `50317a64`; `spec-writing.md` lleva literal la frase del porqué del núcleo de antes.
- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Skills en inglés; lo que ve el usuario, en su idioma. Al editar una skill, cargar antes `sdd-agent-writing`.

### De proceso

- Política de modelos: la de la spec (✋, «Política de modelos»); lectores Sonnet effort medium de 3 en 3 (`control.maxParallelAgents` 3).
- Las tandas: `COST_CAP=44` en todas (techo de campaña, no por tanda), `RUNS_DIR=.temp/i/runs`, transcripts con `node tests/batteries/interviewer/transcript.mjs <RUNS_DIR>/<fase> <salida>`.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, `git commit -F <fichero del scratchpad>`, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Un `Read` de `sdd-grilling/SKILL.md` con `limit: 2000` explícito sobre el fichero entero → la K lo da por «no cargó» y el sujeto se relanza una vez (spec, decisión 6) · Task 1, `K: Read con limit no casa`.
- Un sujeto que carga el núcleo con `Skill` en la tercera llamada, tras leer otros ficheros → K pasa · Task 1, `K: carga en una llamada que no es la primera`.
- Un `tools.txt` de una batería existente con un `Read` con rango → sus filas `tools:` dan lo mismo que antes, porque ninguna casa tras la ruta · Task 1, comprobación con `git grep` apuntada en `tasks.md`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: la K es una celda; el rango de `Read` son dos campos en una línea.
- [x] **YAGNI gate**: sin abstracción nueva; `describeCall` de `transcript.mjs` y `describe` de `extract.mjs` siguen separados, como hoy.
- [x] **Brownfield gate**: retrocompatible (la línea `Read` sin rango no cambia); sin refactor fuera de Scope.
- [x] **Constitution check**: Art. I (RED antes de la guidance, tramo de cada batería, previsión de coste), Art. II (paradas observables), Art. IX (piezas que sustituyen), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/test/kit/interviewer-transcript.test.ts` — `transcript.mjs` y `extract.mjs`: no cortan lecturas y enseñan el rango de `Read`.
- `.docs/sdd/specs/20261113-193506-feature-0342-interviewer-rewrite/tasks.md` — registro vivo.
- `.docs/sdd/specs/20261113-193506-feature-0342-interviewer-rewrite/{red,green}/` — evidencia de las tandas (transcripts, lecturas, totales).

**Modificar**:

- `tests/batteries/interviewer/battery.md` — fila K y n/umbral de `g9 g8 fp pe`.
- `tests/batteries/interviewer/transcript.mjs` — `describeCall`.
- `tests/headless/extract.mjs` — `describe`.
- `cli/test/kit/headless/battery.test.ts` — tests de la K.
- `skills/sdd-grilling/SKILL.md` — de cero.
- `skills/sdd-explore/SKILL.md` (paso 2), `skills/sdd-init/SKILL.md` (paso 3), `skills/sdd-propose/references/spec-writing.md`, `skills/sdd-roadmap/references/proposal.md`, `skills/sdd-config/SKILL.md` (paso 2) — territorio.
- `skills/sdd-templates/templates/spec-template.md` — línea «Pendiente de ti».
- `upstream.json`, `THIRD_PARTY_NOTICES.md` (regenerado), `README.md`, `tests/batteries/sdd-grilling/battery.md`, `cli/test/kit/word-budget.test.ts`.
- `.docs/sdd/steering/debt.md`, `ROADMAP.md`, `.docs/sdd/capabilities/interviewing.md` (al fusionar, en el cierre).

**NO se tocan**:

- `tests/headless/battery.mjs` — `presenceCheck` ya aplica la celda por llamada.
- Las capacidades `configuration`, `feature-flow`, `onboarding`, `routing` — citan `interviewing` sin repetir sus reglas.

### 1.6 Dependencias

- Spike 0341: `research.md` §4, §5, §8; `readings/encargo.md`, `readings/relectura.md`; `tests/batteries/interviewer/make-kits.mjs`, `persona-pe.md`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| GREEN en rojo tras dos REFACTOR | media | parada | desvío al dev-lead (spec, decisión 8) |
| Un territorio no cabe en su paso | media | tope sube | techo de 83 palabras (decisión 21) |
| `g9` sigue sin buscar en la web | media | E4w rojo | REFACTOR sobre la frase de «Look it up»; si no, desvío |
| Gasto cerca del techo | baja | corte | `COST_CAP=44` lo aplica el arnés |

### 1.8 Rollout

Directo: entra con la próxima release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — La batería mide la carga entera

**Tras**: —
**Modelo**: hilo principal (Native), Opus 5.5 de la sesión.
**Tests RED**: hilo · `cli/test/kit/headless/battery.test.ts` (K), `cli/test/kit/interviewer-transcript.test.ts`.
**Superficies**: tooling.
**Verificación**: desde `cli/`, `npx vitest run test/kit/headless/battery.test.ts test/kit/interviewer-transcript.test.ts` → `Tests  N passed (N)`.
**Se prueba en la aplicación**: no, porque herramientas de batería.

**Interfaces**:
- Consume: nada.
- Produce: la celda K; la línea `>>> Read: <ruta> · offset=<n> · limit=<n>` en `tools.txt`; `> Read: <ruta> · offset=<n> · limit=<n>` en el transcript; `g9 g8 fp pe` con n = 5 y umbral 5/5.

**Ficheros**: modificar `tests/batteries/interviewer/battery.md`, `tests/batteries/interviewer/transcript.mjs`, `tests/headless/extract.mjs`, `cli/test/kit/headless/battery.test.ts`; crear `cli/test/kit/interviewer-transcript.test.ts`.

- [ ] **Step 1: tests RED de la K** — en `battery.test.ts`, `describe('fila K de la batería del entrevistador')`: lee la celda real de `tests/batteries/interviewer/battery.md` y corre `verdict` sobre un `tools.txt` de muestra por caso (el `GRILLING`/`finished` de la línea ~775 da la forma). Casan (pasa K): `Skill: sdd-kit:sdd-grilling`; `Read: D:/k/skills/sdd-grilling/SKILL.md`; `Read` en la última línea sin salto; `Read` con `\`; `Bash: cd x && cat $K/skills/sdd-grilling/SKILL.md; head -40 test/app.test.js`; `cat` de otro fichero `;` `cat` del núcleo al final; `PowerShell: Get-Content D:\k\skills\sdd-grilling\SKILL.md`; carga en la tercera llamada. No casan (falla K): `Read … · offset=1 · limit=80`; `cat … | head -80`; `cat núcleo otro | head -80`; `cat spec-writing.md` con «Ask with `sdd-grilling`» en el `<<<`; `Grep: sdd-grilling`; `Get-Content … -TotalCount 20`; `Get-Content -Tail 5 …`; `cat … > x.txt`; `cat …/SKILL.md.bak`; `Skill: sdd-kit:sdd-grilling-x`. Ver los que fallan con la celda de hoy.
- [ ] **Step 2: celda K y n** — la celda de la Restricción global; `g9 g8 fp pe` a n = 5, umbral 5/5. Tests de la K en verde.
- [ ] **Step 3: tests RED de las líneas** — `interviewer-transcript.test.ts`: (a) `render(parseStream(<stream>))` de `transcript.mjs` con un `Bash` de 220 caracteres que acaba en `cat $K/skills/sdd-grilling/SKILL.md` → la línea `> Bash:` lo trae entero; (b) un `Read` con `{ file_path, offset: 1, limit: 80 }` → `> Read: <ruta> · offset=1 · limit=80`; (c) una herramienta sin argumento conocido con un JSON de 300 caracteres → cortado a 160; (d) `node tests/headless/extract.mjs tools <stream> <run>` sobre un stream con ese `Read` → `>>> Read: <ruta> · offset=1 · limit=80`, y un `Read` sin rango → `>>> Read: <ruta>` sin más.
- [ ] **Step 4: implementación** — `describeCall` de `transcript.mjs` y `describe` de `extract.mjs` añaden ` · offset=<n>` y ` · limit=<n>` a `Read` cuando vienen; `transcript.mjs` corta a `ARG_MAX` solo el `JSON.stringify(input)`. Tests en verde.
- [ ] **Step 5: los `tools:` existentes** — `git grep -n "tools: /" -- tests/batteries` y comprobar que ninguna celda casa con lo que va tras la ruta de un `Read`; apuntar el resultado en `tasks.md`.
- [ ] **Step 6: Commit de la task** — `test(interviewer): fila K por llamada y lecturas sin cortar en la batería`.

### Task 2 — RED con el núcleo de hoy

**Tras**: Task 1
**Modelo**: hilo; lectores `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: la tanda es el RED.
**Superficies**: tooling (baterías).
**Verificación lenta**: `moon run kit:build`; copia de `dist/` a `.temp/i/kit-red` sin `.docs/` ni `tests/`; `BATTERY=interviewer SCENARIOS="g9 fp g8 pe" SPEC_DIR=<carpeta de la spec> PHASE=red KIT_DIR=.temp/i/kit-red RUNS_DIR=.temp/i/runs COST_CAP=44 node tests/headless/battery.mjs run` → 20 sujetos, ~4,68 $, ~40 min; después `transcript.mjs` y los lectores.
**Se prueba en la aplicación**: no, porque medición.

**Interfaces**:
- Consume: la batería de la Task 1.
- Produce: `red/` con los transcripts, una lectura por escenario y los totales por fila (K, E0–E7, E4w) de `g9 fp g8 pe`.

**Ficheros**: crear `red/` en la carpeta de la spec.

- [ ] **Step 1: lanzar la tanda** en segundo plano; relanzar una vez el que no cargó (spec, decisión 6).
- [ ] **Step 2: transcripts y lectores** — un lector por escenario con el encargo de `readings/encargo.md` del spike adaptado a esta rúbrica; el hilo relee cada «falla» con `readings/relectura.md`.
- [ ] **Step 3: totales** — tabla por escenario y fila en `red/totales.md`; el RED vale si E0 (`g8`, `pe`), E4w (`g9`) o E1 (`fp`) salen en rojo; si ninguno, parar: la guidance no se escribe (Art. I).
- [ ] **Step 4: Commit de la task** — `test(interviewer): RED de la 0342 con el núcleo de hoy`.

### Task 3 — Núcleo y territorios

**Tras**: Task 2
**Modelo**: hilo, con `sdd-agent-writing` cargada.
**Tests RED**: los rojos de la Task 2.
**Superficies**: docs (skills).
**Verificación**: `moon run kit:build kit:skill-size kit:own kit:notices`; desde `cli/`, `npx vitest run test/kit/word-budget.test.ts test/kit/notices.test.ts test/kit/skills.test.ts` → `Tests  N passed (N)`.
**Se prueba en la aplicación**: no, porque texto de skills; lo mide la Task 4.

**Interfaces**:
- Consume: el borrador aprobado del núcleo (797 palabras) y la decisión 13 de la spec.
- Produce: `skills/sdd-grilling/SKILL.md` nuevo; los cinco territorios; «Pendiente de ti» en el ✋ de la plantilla; tope `'sdd-grilling': { skillMd: 817, total: 817 }`.

**Ficheros**: los de «Modificar» de §1.1 salvo la batería y `debt.md`/`ROADMAP.md`.

- [ ] **Step 1: núcleo** — `skills/sdd-grilling/SKILL.md` con las secciones Overview, Posture, One decision per turn, Look it up, Shape of a question, What only the user knows, Answers, Ending; la parada por defecto: «each user decision is answered or pending (they said they don't know, or left it unanswered once asked)»; `wc -w` < 887.
- [ ] **Step 2: territorios** — cada uno en su paso, con su `wc -w` antes y después y lo que sale del mismo paso para compensar: `sdd-explore` paso 2 (el porqué si nadie lo dice, la dirección; parada por defecto; confirma con una pregunta); `spec-writing.md` (para qué primero, objetivos, no objetivos, antiobjetivos; parada por defecto; método que queda → ✋ «decidido por mí», lo no contestado → «Pendiente de ti»; la regla de `fp`: lo mantenido tras el rebate → «Decisiones tomadas con el dev-lead» con su frase literal, también si ya existe, y la entrevista sigue sobre lo pedido); `sdd-init` paso 3 («Problem it solves» primero; para con cada tema contestado, pendiente o «no aplica»); `proposal.md` (cada regla con su ejemplo y el reparto; para con cada regla con ejemplo y cada feature con orden y dependencia); `sdd-config` paso 2 (para sin clave sin valor ni clave pedida por cambiar).
- [ ] **Step 3: plantilla** — `- Pendiente de ti: <lo que no contestaste o dijiste no saber>` en el ✋ de `spec-template.md`, compensado en el mismo bloque.
- [ ] **Step 4: procedencia** — `upstream.json` (decisión 16), `moon run kit:notices`, `README.md` (decisión 18), la tabla de `tests/batteries/sdd-grilling/battery.md` (decisión 17).
- [ ] **Step 5: topes** — `word-budget.test.ts` con 817 para `sdd-grilling`; si un territorio sube su tope, la cifra y el motivo en `tasks.md`, con la suma ≤ 83.
- [ ] **Step 6: Commit de la task** — `feat(sdd-grilling): núcleo de cero y el territorio en cada skill que pregunta`.

### Task 4 — GREEN y REFACTOR

**Tras**: Task 3
**Modelo**: hilo; lectores `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: el GREEN es la medida.
**Superficies**: tooling (baterías), docs (REFACTOR).
**Verificación lenta**: `moon run kit:build`; copia a `.temp/i/kit`; con `COST_CAP=44`, `PHASE=green`: `BATTERY=interviewer` entera; `BATTERY=sdd-grilling SCENARIOS="g4 g5 g6 g7 t1 sk sk-c fl ag k1 u1"`; `BATTERY=sdd-roadmap SCENARIOS="m2" N=3`; `BATTERY=sdd-explore SCENARIOS="e1"`; `BATTERY=sdd-init SCENARIOS="n4" N=1` → 59 sujetos, ~13,86 $; transcripts y lectores en el entrevistador; `verdict` y lectura en las demás.
**Se prueba en la aplicación**: no, porque medición.

**Interfaces**:
- Consume: el kit de la Task 3.
- Produce: `green/` con los totales; las frases que el REFACTOR quita o cambia.

**Ficheros**: crear `green/`; modificar las skills de la Task 3 si hay REFACTOR.

- [ ] **Step 1: tandas** en segundo plano, de una en una.
- [ ] **Step 2: lectura** — como en la Task 2; verde = cada fila de fondo con todos sus sujetos en «pasa» o «no aplica»; en las demás baterías, su umbral.
- [ ] **Step 3: REFACTOR** — como mucho dos rondas sobre los escenarios en rojo (`PHASE=refactor-1`, `refactor-2`); una frase de territorio que no mueve ninguna fila, fuera; tras la última, el GREEN entero otra vez (`PHASE=green-2`). Si sigue en rojo, parar: desvío al dev-lead.
- [ ] **Step 4: Commit de la task** — `test(interviewer): GREEN de la 0342`.

### Task 5 — Pasada por los llamantes y cierre de la deuda

**Tras**: Task 4
**Modelo**: hilo.
**Tests RED**: ninguno nuevo.
**Superficies**: docs, tooling.
**Verificación**: `moon run kit:build kit:skill-size kit:own`; desde `cli/`, `npx vitest run test/kit/word-budget.test.ts test/kit/headless/battery.test.ts test/kit/interviewer-transcript.test.ts` → `Tests  N passed (N)`; `wc -w` de las siete skills frente a la tabla de topes → saldo ≤ 0.
**Se prueba en la aplicación**: no, porque cierre de texto.

**Interfaces**:
- Consume: todo lo anterior.
- Produce: saldo medido en `tasks.md`; la fila de `debt.md:58` saldada.

**Ficheros**: `.docs/sdd/steering/debt.md`; las skills si la pasada encuentra una frase que choca.

- [ ] **Step 1: pasada** — cada llamante leído con el núcleo nuevo al lado: nada repite una regla del núcleo ni la contradice (`kit:own`).
- [ ] **Step 2: saldo** — tabla antes/después por skill en `tasks.md`.
- [ ] **Step 3: deuda** — la fila del transcript cortado a 160 sale de `debt.md` (la salda esta feature).
- [ ] **Step 4: Commit de la task** — `docs(sdd-grilling): pasada por los llamantes y deuda del transcript saldada`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 2.5h
- Estimación de implementación: 5h
- Estimación de revisión: 0.5h
- Estimación de cierre: 0.5h
- Base de la estimación: 5 tasks, dos de ellas tandas de batería con lectores (como el spike 0341: 8 h estimadas, 3,43 h reales con 174 sujetos); incertidumbre en el número de rondas de REFACTOR.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (Intent): batería del entrevistador en verde con su n, la de forma y los tramos sin regresión, núcleo < 887, saldo ≤ 0.
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- «Una decisión por turno» THEN y AND de dependencia → Task 4, E5 en todos los escenarios. ✓
- AND «pregúntamelo todo de golpe» → sin observar: ninguna batería pide rondas (spec, Hallazgos). ⚠
- AND «no termina con nada supuesto en silencio» → Task 4, E0 en todos los escenarios. ✓
- ADDED: el para qué pendiente y el separador preguntado o pendiente → Task 2 y Task 4, E0 en `g8` y `pe`. ✓
- «El descubrimiento no se ancla» THEN y AND → Task 4, E6 (`g2 p1 g8`). ✓
- «Rebatir una vez» THEN y AND de seguir con lo que mantiene → Task 2 y Task 4, E1 en `fp`. ✓
- AND de `sdd-propose` (lo mantenido va a «Decisiones tomadas con el dev-lead») → sin observar: E1 mide que no vuelva a rebatir, no dónde lo apunta. ⚠
- «Cuándo para» GIVEN por defecto y listas → Task 4, E7 en `pe`; `g7` en la de forma. ✓
- AND gate y `sdd-explore` confirma con una pregunta → Task 4, `u1` y `g1 g9 rq`. ✓
- AND paradas de `sdd-roadmap` y `sdd-config` (por defecto) y de `sdd-init` → Task 4, `m2`, `g7`, `g2 g8 n4`; sin fila de parada propia (spec, decisión 4). ⚠
- Reglas (Límites, Regla ante conflicto) → Task 3, texto del núcleo. ✓
- «Busca fuera» y E4w: fuera de la feature desde la primera enmienda del 2026-11-14. N/A ✓
- Tabla «Lo que se retira»: cada frase del núcleo de hoy → Task 3 Step 1 (el núcleo no la lleva; `git grep` de cada frase en `skills/` vacío en Task 5); ARG_MAX y `extract.mjs` → Task 1; K → Task 1; README, word-budget, notices, procedencia → Task 3; `debt.md:58` → Task 5. ✓
- Review Focus → Task 1, tests de la K y `git grep` del Step 5. ✓
