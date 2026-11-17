---
id: 20261001-125122-feature-0120-skill-regression-batteries
feature: 0120
title: Plan de implementación — Baterías de regresión por skill, topes de palabras y «una entra, otra sale»
spec: ./spec.md
status: draft
created: 2026-10-01
---

# Plan de implementación — Baterías de regresión por skill, topes de palabras y «una entra, otra sale»

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native.** Son 4 tasks en serie, cada una sobre la interfaz de la anterior (`lib.sh` → batería → experimento). Dos de ellas son campañas que lanza el hilo. Una revisión por task con subagentes no aporta sobre scripts de ~100 líneas y duplicaría el contexto. Revisor final: `sdd-kit:effort-high` + `opus`.
2. **El segundo turno real se activa con una variable, `TURN2="<mensaje>"`**, además de con la función `subject_resume`. Con la variable, `subject_launch` reanuda la sesión sola. Así cualquier `subject.sh` ya cerrado, como el de la 0125, mide dos turnos sin editarlo, y el experimento de la decisión 7 de la spec no copia ese lanzador.
3. **El veredicto y la lectura de `battery.md` van en `tests/headless/battery.mjs`** (Node, como `extract.mjs`). La orquestación va en `tests/headless/battery.sh`, que llama a `run.sh`. Parsear una tabla Markdown en awk sería frágil con las comillas y las tildes de las peticiones.
4. **La batería de `using-sdd` tiene 18 escenarios y 24 sujetos**, no los ~19 y ~26 que estimaba la spec. Son las 15 frases de la 0074 y tres de la 0098 sobre el molde `ventas`: `v1` (patch visual) y `c2` (texto visible) con n=2, que fallaban en el RED de la 0098, y `c1` (lógica en la plantilla) de control. `h1`, `f*`, `b1` y `k1` de la 0098 miden el carril patch, no la puerta: no entran. El techo de la spec no cambia.
5. **Moldes propios de la batería.**
   - `mold-salas/` es copia de `molde-code` de la 0014, sin su `sdd-kit.json`.
   - `ventas.sh` es copia de las funciones de `mold.sh` de la 0098, sin la escritura de su `sdd-kit.json` ni `playwright` (para la puerta no hace falta navegador).
   - El marcador lo escribe `put_kit_marker` con la versión del kit (decisión 3 de la spec).
6. **Los topes se fijan dos veces.** En la Task 1 se fijan con las medidas de la rama, para que el test nazca en verde. Al cerrar se vuelven a medir sobre la base al día, después de sincronizar (decisión 9 de la spec). La segunda medida va en el commit de cierre.
7. **Coste**: unas 5 h de reloj. La campaña tiene un techo de 34 sujetos y 8 $ (spec, decisión 16), más el revisor final en Opus (~1–2 $).
8. Review Focus: 6 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: dejar una batería de regresión reutilizable por skill (la primera, `using-sdd`), un lanzador que la ejecute por tramos con veredicto, el segundo turno real en el lanzador de referencia, topes de palabras con test y las dos reglas nuevas de la constitution.

**Architecture**: `battery.sh` lee la tabla de `tests/batteries/<skill>/battery.md` con `battery.mjs` y lanza cada escenario con `run.sh`, con su n y su modelo; después cuenta el veredicto. `lib.sh` gana el marcador del molde con la versión del kit y la reanudación de sesión. Los topes son una tabla en `WordBudget.Tests.ps1`, dentro del conjunto rápido.

**Tech Stack**: bash (Git Bash), Node (`.mjs`, sin dependencias), PowerShell 7 + Pester 5, `claude -p` headless.

**Spec**: `./spec.md`

**Ejecución**: native, porque las tasks van en serie sobre interfaces de la anterior y dos son campañas que lanza el hilo. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Ningún fichero de `skills/**` cambia, `spec-template.md` incluido.
- El código ejecutable del kit sigue el Art. X de la constitution, literal:
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- Las palabras se cuentan con `-split '\s+'` sin vacíos, como `UsingSdd.Tests.ps1`.
- El total de una skill son todos sus `.md` salvo `references/migrations/`.
- Todo test que lance `bash`, `node` o git lleva `-Tag 'Slow'`; `WordBudget.Tests.ps1` solo lee ficheros y no lo lleva.
- Un test que lanza bash usa `tests/Resolve-Bash.ps1`, y si ejecuta git, `Clear-GitEnv`/`Restore-GitEnv`.
- Las salidas versionadas no pasan de 140 caracteres de ruta (`PathLength.Tests.ps1`) y pasan por `extract.mjs`.

### De proceso

- Política de modelos (Art. IV): modelo y effort explícitos en cada despacho; `fable` y `opus xhigh` prohibidos. Los sujetos van con Sonnet.
- Campaña: `SUBJECT_CAP=34`, `COST_CAP=8`, comunes a las fases `battery` y `exp`. Tandas de 5 como máximo. Sin commits mientras corre una tanda.
- Sujetos con `SUPERPOWERS_DIR` en la caché de superpowers 6.4.2, y `KIT_DIR` un `git archive` del `HEAD` de la rama (`skills`, `.claude-plugin`, `agents`).
- Commits: tipo/scope en inglés, cuerpo en castellano, con la línea `Co-Authored-By` de la sesión.

## Review Focus

- `battery.md` con un escenario de n=2 y solo un sujeto terminado (techo alcanzado o sujeto cortado) → el veredicto lo da rojo con «faltan 1», no verde por los que hay · Task 2, `verdict cuenta como rojo un escenario con sujetos de menos`
- `STEPS` con un paso que no existe en la tabla → `battery.sh` sale con error «paso desconocido: <paso>» sin lanzar nada · Task 2, `battery.sh rechaza un paso desconocido`
- Una petición con comillas latinas y tildes («Guadar», `¿cómo…?`) → llega intacta como último argumento de `claude` · Task 2, `la petición llega intacta con comillas latinas y tildes`
- `TURN2` con un primer turno sin `session_id` en el stream (claude falló) → el sujeto muere con «sin session_id: no se puede reanudar», sin lanzar un `--resume` vacío · Task 2, `subject_resume sin session_id muere con su mensaje`
- Migraciones `v2.10.0.md` y `v2.9.0.md` con `plugin.json` en 2.9.1 → `kit_version` da 2.10.0 (comparación SemVer, no de texto) · Task 2, `kit_version compara por SemVer`
- Una skill nueva sin tope en la tabla → `WordBudget.Tests.ps1` falla nombrando la skill · Task 1, `toda skill tiene tope`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el veredicto automático solo sabe «primera skill» o «ninguna». Lo demás se lee a mano hasta que otra batería lo pida.
- [x] **YAGNI gate**: sin formato genérico de escenario ni plugin de veredicto; un solo lanzador sobre `run.sh`.
- [x] **Brownfield gate**: `lib.sh` y `run.sh` siguen compatibles con las campañas cerradas (`TURN2` y `put_kit_marker` son opcionales).
- [x] **Constitution check**: Art. I (sin skill editada, la batería es evidencia), Art. III, Art. X y Art. XI (documentos de estado reescritos, no añadidos).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/WordBudget.Tests.ps1` — topes por `SKILL.md`, por skill, del kit y de los documentos de anclaje.
- `tests/headless/battery.sh` — lanza una batería o un tramo sobre `run.sh` y da el veredicto.
- `tests/headless/battery.mjs` — `plan`, `ask` y `verdict` sobre `battery.md`.
- `tests/Battery.Tests.ps1` — casos en seco de `battery.sh`/`battery.mjs` (`Slow`).
- `tests/batteries/using-sdd/battery.md` — escenarios y procedencia.
- `tests/batteries/using-sdd/subject.sh` — monta el molde del escenario y lanza la petición de la tabla.
- `tests/batteries/using-sdd/mold-salas/` — copia de `molde-code` de la 0014, sin `sdd-kit.json`.
- `tests/batteries/using-sdd/ventas.sh` — molde `ventas` de la 0098, sin marcador ni `playwright`.
- `<spec>/battery/out/`, `<spec>/exp/out/` — salidas de la pasada y del experimento.
- `tasks.md` — registro vivo.

**Modificar**:

- `tests/headless/lib.sh` — `kit_version`, `put_kit_marker`, `subject_resume`, `TURN2`, `session_id` en el stream en seco.
- `tests/HeadlessLauncher.Tests.ps1` — casos de las piezas nuevas de `lib.sh`.
- `tests/UsingSdd.Tests.ps1` — sale el `It` del tope de 530.
- `.docs/sdd/constitution.md` — Art. I («una entra, otra sale») y Art. V (versión mayor).
- `.docs/sdd/tech-stack.md` — subsección «Baterías por skill»; salen las entradas de la decisión 14 de la spec.
- `.docs/sdd/architecture.md` — cota de los documentos de anclaje, `tests/batteries/` en la estructura y en la anatomía de la evidencia.
- `.docs/sdd/roadmap.md` — filas de deuda que destapen la pasada y el experimento (si las hay).

**NO se tocan**:

- `skills/**` — la feature no edita skills.
- `tests/headless/run.sh` — `battery.sh` lo llama tal cual.
- Las carpetas de spec de la 0014, la 0074, la 0098 y la 0125 — evidencia cerrada; se copian o se llaman, no se editan.

### 1.6 Dependencias

- superpowers 6.4.2 en la caché (`SUPERPOWERS_DIR`) y `claude` en el PATH.
- `red/subject.sh` de la 0125 (fila 2, escenario `b1`) para el experimento.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La pasada da rojos con el kit de hoy (la skill creció a 519 palabras con la 0098) | media | medio | Es su función: fila de deuda con evidencia, sin editar la skill (decisión 5 de la spec) |
| Las features paralelas cambian `skills/` antes del cierre y los topes de la Task 1 quedan cortos | alta | bajo | Se vuelven a medir al cerrar, con la base al día (decisión 6) |
| `tech-stack.md` no cabe en el neto cero | media | bajo | Condensar entradas duplicadas; si no basta, es un desvío y se para |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Topes de palabras y reglas de la constitution

**Modelo**: sesión (Native).
**Tests RED**: hilo · `tests/WordBudget.Tests.ps1`, escritos antes de la tabla de topes.
**Superficies**: tooling · docs.
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/WordBudget.Tests.ps1,tests/UsingSdd.Tests.ps1 -CI"`, y borrar `testResults.xml`.
**Se prueba en la aplicación**: no, porque es tooling del repo. Se comprueba añadiendo 200 palabras a `skills/using-sdd/SKILL.md` en una copia (`SDD_KIT_ROOT`) y viendo el fallo con su mensaje.

**Interfaces**:
- Consume: nada.
- Produce: `tests/WordBudget.Tests.ps1`, con la tabla `$script:Budgets` así:

  ```powershell
  @{ Skills = @{ '<skill>' = @{ SkillMd = <n>; Total = <n> } }; Kit = <n>; Anchors = @{ 'constitution.md' = <n>; ... } }
  ```

  Respeta `SDD_KIT_ROOT` como `UsingSdd.Tests.ps1`.

**Ficheros**: crear `tests/WordBudget.Tests.ps1`; modificar `tests/UsingSdd.Tests.ps1` y `.docs/sdd/constitution.md`.

- [ ] **Step 1: Tests RED**, en `Describe 'Topes de palabras'`:
  - `toda skill tiene tope`: cada carpeta de `skills/` está en `Budgets.Skills`, con el mensaje `"la skill <s> no tiene tope en WordBudget.Tests.ps1"`.
  - `<skill>: SKILL.md cabe en su tope` (`-ForEach` sobre las skills).
  - `<skill>: la skill completa cabe en su tope`, sin `references/migrations/`.
  - `el kit entero cabe en su presupuesto`.
  - `<doc> cabe en su tope` para los cuatro de anclaje.

  Cada `Should -BeLessOrEqual` lleva `-Because "mide <n> y el tope es <t>: recorta, o sube el tope con la decisión del dev-lead escrita en la spec"`. Con la tabla vacía, el test falla en rojo.
- [ ] **Step 2: Tabla de topes.** Mide la rama y redondea cada valor a la centena siguiente (`[math]::Ceiling(n/100)*100`). El kit es el total redondeado, no la suma de los topes.
- [ ] **Step 3: Quita el `It` del tope de 530** de `UsingSdd.Tests.ps1`.
- [ ] **Step 4: Constitution.**
  - **Art. I**: un párrafo nuevo, «**Una pieza entra, otra sale.**». La spec de toda feature o patch del kit dice qué retira o adelgaza; «nada» se justifica y se aprueba en el gate. Los topes de palabras por `SKILL.md`, por skill y de los documentos de anclaje, y el presupuesto del kit, viven en `tests/WordBudget.Tests.ps1`, y solo suben por decisión del dev-lead escrita en la spec. El cómo de las baterías vive en `tech-stack.md`.
  - **Art. V**: una frase nueva. «Una release es **mayor** si tras ella un proyecto tiene que cambiar algo para seguir trabajando: una frase o un comando que deja de funcionar, un artefacto que cambia de forma, o una migración con pasos además del marcador; si no, es menor (o patch, si solo arregla). El número se decide al cortar, con este criterio.»
- [ ] **Step 5: Verificación.** Los dos tests en verde. En una copia con 200 palabras más en `using-sdd`, rojo con «mide … y el tope es …».
- [ ] **Step 6: Commit de la task**: `test(budget): topes de palabras por skill, kit y anclaje; reglas de versión mayor y «una entra, otra sale»`.

### Task 2 — Lanzador de baterías y segundo turno real

**Modelo**: sesión (Native).
**Tests RED**: hilo · `tests/HeadlessLauncher.Tests.ps1` (casos nuevos) y `tests/Battery.Tests.ps1`, en seco (`DRY_RUN=1`).
**Superficies**: tooling.
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1,tests/Battery.Tests.ps1 -CI"`.
**Se prueba en la aplicación**: no, porque es tooling. Se comprueba con la pasada de la Task 3.

**Interfaces**:
- Consume: `run.sh` sin cambios (`SPEC_DIR`, `PHASE`, `SUBJECT_SH`, `KIT_DIR`, `RUNS_DIR`, `SCENARIOS`, `SUBJECT`, `SUBJECT_CAP`, `COST_CAP`, `MODEL`).
- Produce, en `lib.sh`:
  - `kit_version` imprime la mayor, por SemVer, entre `version` de `$KIT/.claude-plugin/plugin.json` y las `v*.md` de `$KIT/skills/sdd-init-brownfield/references/migrations/`.
  - `put_kit_marker '<resto del JSON sin llaves>'` escribe `.docs/sdd/sdd-kit.json` en el molde como `{"version": "<kit_version>", <resto>}`.
  - `subject_resume "<mensaje>"` lee el primer `session_id` de `$JSONL`, muere con «sin session_id: no se puede reanudar» si no lo hay, y lanza `claude` con `CLAUDE_ARGS` más `--resume <id>`, añadiendo la salida a `$JSONL`; los argumentos quedan en `<etiqueta>.resume.args`.
  - Con `TURN2` no vacío, `subject_launch` llama a `subject_resume "$TURN2"` tras el primer turno.
  - En seco, el stream empieza por `{"type":"system","subtype":"init","session_id":"dry-<etiqueta>"}`.
- Produce, en `battery.mjs`:
  - `node battery.mjs plan <battery.md> [paso…]` imprime una línea por escenario: `<id> <modelo> <n>`. Sale con 2 y «paso desconocido: <paso>» si un paso no está en la tabla.
  - `node battery.mjs field <battery.md> <id> <columna>` imprime la celda (`Petición`, `Molde`), sin comillas de código.
  - `node battery.mjs verdict <battery.md> <out> [paso…]` imprime, por escenario, `<id> · <pasan>/<n> · umbral <u> · verde|rojo[ · faltan <k>]`, y sale con 1 si hay algún rojo. Un sujeto pasa si la primera línea `>>> Skill: ` de `<id>-<i>.tools.txt` es la del esperado, o si no hay ninguna y el esperado es `ninguna`.
  - La tabla de escenarios es la primera tabla con cabecera `| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |`. El umbral se escribe `k/n`.
- Produce, en `battery.sh`:
  - Recibe `BATTERY=<skill>` y opcionalmente `STEPS="<paso> …"`, además de las variables de `run.sh` salvo `SUBJECT_SH` y `SCENARIOS`.
  - Lanza `run.sh` por cada índice de sujeto `i` (de 1 al n máximo) y por cada modelo, con los escenarios de n ≥ i en grupos de 5, con `MODEL`, `SUBJECT=i` y `SUBJECT_SH=tests/batteries/<skill>/subject.sh`.
  - Termina con `verdict` y su código de salida.

**Ficheros**: modificar `tests/headless/lib.sh` y `tests/HeadlessLauncher.Tests.ps1`; crear `tests/headless/battery.sh`, `tests/headless/battery.mjs` y `tests/Battery.Tests.ps1`.

- [ ] **Step 1: Tests RED**, en seco y con una batería de juguete en `$TestDrive`:
  - `kit_version compara por SemVer`: `v2.9.0.md` y `v2.10.0.md` con `plugin.json` en 2.9.1 → `2.10.0`.
  - `put_kit_marker escribe la versión del kit`: el `sdd-kit.json` del molde tiene `"version": "2.10.0"` y el resto del JSON.
  - `TURN2 reanuda la sesión del primer turno`: `<etiqueta>.resume.args` contiene `--resume` seguido de `dry-<etiqueta>`, y los mismos `--setting-sources` y `--plugin-dir` que `.args`. `tools.txt` tiene dos `=== RESULTADO`, y `run.sh` cuenta el último.
  - `subject_resume sin session_id muere con su mensaje`.
  - `battery.sh lanza solo el tramo pedido`: con `STEPS=roadmap`, solo existen `.args` de los escenarios de ese paso, tantos como su n, con su `--model`.
  - `battery.sh rechaza un paso desconocido`: código distinto de 0 y «paso desconocido: nope»; ningún `.args`.
  - `la petición llega intacta con comillas latinas y tildes`: el último argumento de `.args` es `Corrige la errata «Guadar», ¿vale?`.
  - `verdict da verde y rojo por escenario`: con `tools.txt` fabricados → `r1 · 2/2 · umbral 2/2 · verde`, `f1 · 0/1 · umbral 1/1 · rojo` y salida 1.
  - `verdict cuenta como rojo un escenario con sujetos de menos`: n=2 y un solo `tools.txt` → `rojo · faltan 1`.
- [ ] **Step 2: Implementar** `lib.sh`, `battery.mjs` y `battery.sh` con las firmas de arriba.
- [ ] **Step 3: Verificación**: los dos ficheros en verde, y `HeadlessLauncher.Tests.ps1` sin regresiones.
- [ ] **Step 4: Commit de la task**: `test(headless): lanzador de baterías por tramo y segundo turno real con --resume`.

### Task 3 — Batería de `using-sdd` y su pasada

**Modelo**: sesión (Native). Sujetos: Sonnet.
**Tests RED**: hilo · un caso en `tests/Battery.Tests.ps1`, `la batería de using-sdd monta su molde con el marcador del kit`. En seco, `STEPS=sdd-config`: `state.txt` sin aviso de migración y el marcador del molde igual a `kit_version`.
**Superficies**: tooling.
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/Battery.Tests.ps1 -CI"`.
**Verificación lenta**: la pasada real, `BATTERY=using-sdd PHASE=battery SPEC_DIR=<spec absoluta> KIT_DIR=<git archive del HEAD> RUNS_DIR=<scratchpad>/runs SUPERPOWERS_DIR=<caché 6.4.2> SUBJECT_CAP=34 COST_CAP=8 bash tests/headless/battery.sh` (~15 min, 24 sujetos, ~5 $).
**Se prueba en la aplicación**: no, porque es tooling. La pasada es la prueba.

**Interfaces**:
- Consume, de la Task 2: `put_kit_marker` y `subject_launch`, y `battery.mjs field <md> <id> Petición|Molde`. `battery.sh` llama a `subject.sh <kit> <id>-<i> <id> <out>`, igual que `run.sh`.
- Produce: `tests/batteries/using-sdd/battery.md`, que la 0121 usa para adelgazar `using-sdd`.

**Ficheros**: crear `tests/batteries/using-sdd/{battery.md,subject.sh,ventas.sh}` y `tests/batteries/using-sdd/mold-salas/`.

- [ ] **Step 1: Test RED** del montaje en seco.
- [ ] **Step 2: `battery.md`.**
  - Un párrafo de uso.
  - La tabla de escenarios, con estas filas:
    - Las 15 frases de `red/subject.sh` de la 0074, literales: `i1`, `c1`, `r1`…`r5`, `f1`…`f3`, `p1`, `e1`, `s1`, `d1`, `t1`, con molde `salas`.
    - `v1`, `c1w` (el `c1` de la 0098, renombrado para no chocar) y `c2`, de `red/subject.sh` de la 0098, con molde `ventas`.
  - Pasos con el nombre de la puerta: `sdd-init`, `sdd-consult`, `sdd-roadmap`, `sdd-start-feature`, `sdd-start-patch`, `sdd-end-release`, `sdd-config`, `duda`, `directa`.
  - n=2 y umbral 2/2 en `r1`, `r3`, `s1`, `d1`, `v1` y `c2`; el resto, n=1 y 1/1. Modelo `sonnet`.
  - Procedencia por escenario (`using-sdd-red.md`, `visual-patch-red.md` o la fila de la 0014).
  - La tabla «Procedencia de las reglas»: una fila por fila de la tabla de puertas, por la regla de duda y por cada racionalización de `skills/using-sdd/SKILL.md`, con su RED o ticket de origen y los escenarios que la cubren. Lo que no tenga escenario lo dice: «sin escenario».
  - Una nota en `d1`: la pregunta única se lee en `texts.txt`.
- [ ] **Step 3: Moldes y `subject.sh`.**
  - El `subject.sh` sigue el patrón del de la 0074: `subject_init … using-sdd`, la petición con `battery.mjs field`, y el molde según la columna `Molde`.
  - Con `salas`: `cp -r mold-salas/.`, `rm -r .docs` en `i1`, la línea de la errata en `t1`, y `put_kit_marker '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}'` salvo en `i1`.
  - Con `ventas`: `ventas_base`, con `put_kit_marker` en lugar de su `sdd-kit.json`.
  - `MAX_TURNS=8`, como en la 0074.
- [ ] **Step 4: Verificación en seco.** Después, el `git archive` del `HEAD` y la pasada real (verificación lenta) en segundo plano, con su vigía de silencio.
- [ ] **Step 5: Lectura.**
  - Por cada rojo, `texts.txt` del sujeto y una fila de deuda en el roadmap con la evidencia y el disparador: frase, puerta esperada y puerta real.
  - `d1`: se comprueba la pregunta única.
  - Ningún escenario se relanza para sacar verde.
- [ ] **Step 6: Commit de la task**, con las salidas de `battery/out/`: `test(using-sdd): batería de regresión por puerta y su pasada con el kit de la rama`.

### Task 4 — Experimento de dos turnos y documentos de anclaje

**Modelo**: sesión (Native). Sujetos: Sonnet.
**Tests RED**: no hay código nuevo; la verificación es la pasada de `WordBudget` y de la suite rápida.
**Superficies**: docs.
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests -ExcludeTagFilter Slow -CI"`.
**Verificación lenta**: el experimento, `TURN2='Apruebo la enmienda: arregla también el segundo Important en src/cli.js y sigue hasta presentar la validación.' PHASE=exp SPEC_DIR=<spec absoluta> SUBJECT_SH=<ruta de red/subject.sh de la 0125> KIT_DIR=<git archive del HEAD> RUNS_DIR=<scratchpad>/runs SUPERPOWERS_DIR=<caché 6.4.2> SCENARIOS=b1 SUBJECT_CAP=34 COST_CAP=8`. Se lanza dos veces, con `SUBJECT=1` y `SUBJECT=2` (~1,5 $).
**Se prueba en la aplicación**: no, porque es documentación y medida.

**Interfaces**:
- Consume: `TURN2` (Task 2) y el resultado de la pasada (Task 3).
- Produce: la subsección «Baterías por skill» de `tech-stack.md`, que la 0121 sigue.

**Ficheros**: modificar `.docs/sdd/tech-stack.md`, `.docs/sdd/architecture.md` y, si el experimento reproduce, `.docs/sdd/roadmap.md` (la fila de la 0125 se reabre con la evidencia).

- [ ] **Step 1: Experimento.**
  - Lanza dos sujetos en segundo plano, con vigía.
  - Criterio: en el segundo turno, ¿intenta despachar (`Agent`, denegado por el hook) una re-revisión de su propia pasada de fix? ¿Qué sha lleva la línea `Pasada de fix:`?
  - Reproduce si lo hace en 1 de 2 o más.
- [ ] **Step 2: `tech-stack.md`.** La subsección «### Baterías por skill» va en «Cómo se testean las skills», tras «Fixtures y baselines». Contenido:
  - la unidad (batería por paso en `tests/batteries/<skill>/`, sus tres piezas);
  - qué lanza una edición (el tramo de su paso más un escenario del fallo) y cuándo la batería entera (al adelgazar, al cortar release);
  - umbral y modelo (Sonnet por defecto, Opus si el fallo de origen vino de Opus), y que un rojo no se relanza;
  - la procedencia vive en la batería, no en la skill;
  - el marcador generado (`put_kit_marker`, y por qué no basta `plugin.json`);
  - el segundo turno (`TURN2` y `subject_resume`; el molde del segundo, con la salida real del primero);
  - la sesión larga, con el resultado del experimento;
  - los topes (`WordBudget.Tests.ps1`, cómo se suben).

  Salen: «Un gate que aparece después de una respuesta del usuario se mide a dos turnos», «`tests/headless/lib.sh` lanza un solo turno», «Techo de una campaña de entrevista simulada» (duplicado) y «Batería de puertas, en cada release». `tech-stack.md` no crece en neto: compara las palabras con `git show HEAD~:…`.
- [ ] **Step 3: `architecture.md`.**
  - En la tabla de documentos, la cota de los cuatro de anclaje pasa a `WordBudget.Tests.ps1` (y `tech-stack.md` deja «hoy usado como diario»).
  - `tests/` gana `batteries/` en la estructura.
  - La anatomía de la evidencia gana `tests/batteries/<skill>/`.
- [ ] **Step 4: Verificación**: la suite rápida en verde, `WordBudget` incluido (los anclajes, dentro del tope de la Task 1).
- [ ] **Step 5: Commit de la task**: `docs(sdd): método de baterías por skill, segundo turno real y respuesta a la sesión larga`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 4h
- Base de la estimación: 4 tasks, dos de ellas con campaña en segundo plano (~20 min de reloj); el lanzador, ~150 líneas de bash y Node con tests en seco. Comparable con el patch 0076 (lanzador de referencia) más la campaña de la 0074.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre en el hilo: `Invoke-Pester -Path tests` completo, desde PowerShell.
- [ ] Re-medición de los topes con la base al día (decisión 6) y su commit.
- [ ] Smoke por THEN de la spec: `suite` o `ejecución real`.
- [ ] Cierre con `sdd-end-feature` (validación en campo).

---

## 4. Self-review (cobertura spec → tasks)

- Decisiones 1, 2 y 4 (batería, lanzador, `using-sdd`) → Tasks 2 y 3. ✓
- Decisión 3 (marcador generado) → Task 2 (`put_kit_marker`) y Task 3 (molde). ✓
- Decisión 5 (rojo sin editar la skill) → Task 3, Step 5. ✓
- Decisión 6 (segundo turno) → Task 2 (`TURN2`, `subject_resume`) y Task 4 (método). ✓
- Decisión 7 (sesión larga) → Task 4, Step 1. ✓
- Decisiones 8, 9 y 10 (topes) → Task 1; re-medida en §3. ✓
- Decisiones 11 y 12 (constitution) → Task 1, Step 4. ✓
- Decisiones 13, 14 y 15 (`tech-stack.md`, retiradas, `architecture.md`) → Task 4. ✓
- Decisión 16 (techo) → «De proceso» y la verificación lenta de las Tasks 3 y 4. ✓
- Cada escenario de verificación de la spec tiene su task: topes → Task 1; molde → Task 3; tramo, veredicto y segundo turno → Task 2; veredicto real → Task 3; sesión larga → Task 4; constitution → Task 1. ✓
- Review Focus → Task 1 (`toda skill tiene tope`) y Task 2 (los otros cinco). ✓
