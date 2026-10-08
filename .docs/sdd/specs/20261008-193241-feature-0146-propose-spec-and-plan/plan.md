---
id: 20261008-193241-feature-0146-propose-spec-and-plan
feature: 0146
title: Plan de implementación — Spec y plan de propose
spec: ./spec.md
status: approved
created: 2026-10-08
---

# Plan de implementación — Spec y plan de propose

## Decisiones que he tomado yo — valida estas

1. **Ocho tasks: una de RED y siete de regla con su GREEN.** La Task 1 monta la batería y lanza todos los RED con el kit de la base, de una vez: si un baseline sale limpio, paro una sola vez a pedir otra aprobación de la spec antes de escribir ninguna regla (decisión 17 de la spec). Las demás tasks son verticales por regla: guía, plantilla, test Pester y GREEN de su escenario.
2. **Ejecución Native**: las tasks son texto y evidencia, seis de ellas tocan los mismos dos ficheros (`SKILL.md` y `control-profiles.md`) y van en serie. La revisión final de rama, con `sdd-kit:effort-high` + `opus`.
3. **Sujetos**: Sonnet, salvo `g1`, que mide la variante del modelo más capaz y va en Opus. RED con el kit de la base (`git archive` del commit de apertura); GREEN con el kit de la rama.
4. **Lo que se toma de Matt** (`mattpocock/skills` 1.2.3, MIT), leído tras aprobar la spec: de `domain-modeling`, el contraste con el glosario, afinar el término difuso, contrastar con el código y las tres condiciones de una ADR (Task 7); de `to-tickets`, cada task cabe en un contexto nuevo y el *prefactor* va primero, además de la vertical con *blocked by*, que ya decidió la spec (Task 4); de `to-spec`, la prueba en la costura existente más alta y cuantas menos costuras mejor (Task 2). `THIRD_PARTY_NOTICES.md` y el `NOTICE` de `sdd-grilling` lo citan. Es un ruling: no cambia ningún THEN.
5. **Un molde para la batería de `sdd-start-feature`**: `mold-reservas`, copia del molde `salas` de `using-sdd` con un `PRODUCT.md` con glosario. `subject.sh` escribe, por escenario, los artefactos del punto del flujo donde empieza el sujeto (spec escrita, plan aprobado, task en curso, implementación terminada). Así cada escenario empieza en su paso, con «Invoca la skill sdd-kit:sdd-start-feature y sigue: …» (`tech-stack.md`, «Un escenario de mitad de flujo carga la skill»).
6. **`u1` dura dos turnos** (`TURN2="Apruebo la enmienda"`): el primero mide la parada y la corrección en su sitio; el segundo, la task nueva y las notas en `tasks.md`.
7. **Riesgo alto**: `AskUserQuestion` en un sujeto headless. Si `claude -p` no lo deja llamar, el `stream-json` igual registra el `tool_use`: `g1` y `r1` se puntúan sobre ese intento. Lo compruebo en la Task 1 con un sujeto en seco antes de la campaña.
8. **Coste estimado**: ~7 h de reloj y ~38 $ de sujetos (techo 46 $), más la revisión final.
9. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: dar a la spec y al plan la forma de la 3.0.0 sobre las skills actuales (🦆, ✋, «Dónde se prueba», `Tras`, acción update, gate con opciones fijas, modelo del revisor de dominio, contraste de lenguaje), con cada regla respaldada por su RED/GREEN.

**Architecture**: cada regla entra donde vive su vecina: plantillas en `sdd-templates`, cuándo y cómo en `sdd-start-feature` y sus referencias, cómo se pregunta en `sdd-grilling` y cómo se explica en `sdd-rubber-duck`. La prueba es una batería nueva de humo en `tests/batteries/sdd-start-feature/`, más escenarios en las de `sdd-grilling` y `sdd-rubber-duck`.

**Tech Stack**: Markdown (skills y plantillas), Bash y Node (lanzador `tests/headless/`), Pester (anatomía y topes).

**Spec**: `./spec.md`

**Ejecución**: native, porque las tasks van en serie sobre los mismos ficheros y son texto y evidencia; `execution: auto` en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Las skills se escriben en inglés y hablan con el usuario en su idioma; nombres de skill y de fichero en inglés kebab-case; texto humano (docs, tests, commits) en castellano con tildes (Art. III).
- Encabezado del bloque de la spec, literal: `## ✋ Decisiones que he tomado yo — valida estas`. El del plan no cambia: `## Decisiones que he tomado yo — valida estas`.
- Opciones del gate de la spec, literales: «Apruebo (Recomendada)», «Cambios» y, solo en `delegate` con el modelo más capaz, «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media».
- Nota de `tasks.md` de la acción update, literal: `afectada por enmienda <fecha> → Task N`; task nueva: `Task N — enmienda <fecha>: <qué>`.
- Bloque de rulings de la validación, literal: `✋ Me salí del plan en…`.
- Topes de palabras: `'sdd-grilling' = @{ SkillMd = 750; Total = 750 }`; `sdd-start-feature`: `SkillMd = 8430` sin cambios, y `Total` a `20600` solo si los recortes no compensan.
- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos del Art. IV: sujetos Sonnet (`g1`, Opus); revisor final `sdd-kit:effort-high` + `opus`; `fable` y `opus xhigh`, prohibidos.
- Ejecución Native: implementa la sesión. Cada task: `sdd task start`, RED apartado fuera del repo, commit, `sdd task done`.
- Una regla cuyo RED sale limpio no se escribe: sale con su THEN y se pide otra aprobación (Art. I).
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Una spec en modo lite → lleva también el 🦆, el ✋ y «Dónde se prueba», porque la plantilla es la misma · Task 2, lectura de `spec-template.md` y de `modo-lite.md` en la revisión.
- Un gate de la spec en `pair` con la sesión en Opus → solo «Apruebo (Recomendada)» y «Cambios»; la opción de bajar de modelo es del gate del plan · Task 3, el texto del paso 4 lo dice por perfil.
- La respuesta a un freno de alcance que no cambia el texto de la spec → se apunta en «Enmiendas» sin corregir nada ni añadir task · Task 5, el texto de «Frenos de alcance».
- Una enmienda en `unattended` → se aplica en su sitio con su línea marcada `sin aprobar`, y añade la task igual · Task 5, el texto de «Desvío».
- `sdd-grilling` en un proyecto sin `PRODUCT.md` → contrasta solo con el código y no crea el glosario · Task 7, la skill lo dice en una frase.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin skill nueva ni script nuevo; reglas en los ficheros donde viven sus vecinas.
- [x] **YAGNI gate**: el bloque del plan y el `CLAUDE.md` no cambian (decisiones 3 y 15 de la spec).
- [x] **Brownfield gate**: los tests que leen la forma de la spec se adaptan en la misma task que la cambia.
- [x] **Constitution check**: Art. I (RED antes, previsión, topes), Art. III, Art. IV (un commit por task, también con la acción update), Art. IX (`THIRD_PARTY_NOTICES.md`), Art. XI (la carpeta se edita hasta el cierre).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/sdd-start-feature/battery.md` — escenarios `s1`, `g1`, `r1`, `p1`, `u1`, `v1a`, `v1b`; rúbrica; procedencia de las reglas.
- `tests/batteries/sdd-start-feature/subject.sh` — monta `mold-reservas` y el punto del flujo de cada escenario.
- `tests/batteries/sdd-start-feature/mold-reservas/` — molde (Task 1).
- `tests/sdd-start-feature-0146-red.md`, `tests/sdd-start-feature-0146-green.md` — evidencia.
- `.docs/sdd/specs/20261008-193241-feature-0146-propose-spec-and-plan/red/out/`, `green/out/` — salidas versionadas.

**Modificar**:

- `skills/sdd-templates/templates/spec-template.md`, `plan-template.md`, `tasks-template.md`.
- `skills/sdd-start-feature/SKILL.md` (pasos 4, 5, 6 —frase del desvío— y 7), `references/control-profiles.md`, `references/review-spec.md`.
- `skills/sdd-grilling/SKILL.md` y `NOTICE`; `skills/sdd-rubber-duck/SKILL.md`.
- `tests/batteries/sdd-grilling/battery.md` y `subject.sh` (`t1`); `tests/batteries/sdd-rubber-duck/battery.md` y `subject.sh` (`l2`, R2, R7, procedencia).
- `tests/CapabilityRules.Tests.ps1` (línea 58), `tests/WordBudget.Tests.ps1`.
- `THIRD_PARTY_NOTICES.md`.

**NO se tocan**:

- `CLAUDE.md` del repo — la frase de los términos se queda (decisión 15 de la spec).
- `skills/using-sdd/`, `skills/sdd-consult/`, `skills/sdd-start-patch/` — entrada y patch son de la 0160 y la 0161.
- El bloque de decisiones de `plan-template.md` — sin ✋ (decisión 3 de la spec).
- `.docs/sdd/capabilities/` — el delta se fusiona en el cierre.

### 1.6 Dependencias

- `tests/headless/` (`battery.sh`, `battery.mjs`, `lib.sh`, `run.sh`) y superpowers 6.4.2 en `SUPERPOWERS_DIR`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un baseline sale limpio | media | la regla sale y hay que volver a aprobar | todos los RED en la Task 1, una sola parada |
| `AskUserQuestion` no se puede llamar en headless | media | `g1` y `r1` sin evidencia | puntuar el `tool_use` del stream; sujeto en seco antes |
| `v1b` sigue hasta el merge del cierre | media | el sujeto toca ramas del molde | `MAX_TURNS=20`; se puntúa el mensaje previo a `sdd-end-feature` |
| El total de palabras de `sdd-start-feature` revienta | alta | el pre-commit rechaza | recortes de cada task; si no basta, subir el total a 20.600 (aprobado) |

### 1.8 Rollout

Directo: entra en la release 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

> Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Batería de `sdd-start-feature`, escenarios nuevos y RED

**Tras**: —
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`; `g1`, `MODEL=opus`.
**Tests RED**: la propia campaña con el kit del commit de apertura (`git archive <apertura> skills .claude-plugin hooks cli`): la rúbrica de cada escenario debe fallar.
**Superficies**: tooling (batería y molde), docs (evidencia).
**Verificación**: `bash -n tests/batteries/sdd-start-feature/subject.sh`; `node tests/headless/battery.mjs plan tests/batteries/sdd-start-feature/battery.md` (sale 0 y lista los siete escenarios); `node tests/headless/battery.mjs plan tests/batteries/sdd-grilling/battery.md t1`; `node tests/headless/battery.mjs plan tests/batteries/sdd-rubber-duck/battery.md l2`; `pwsh -NoProfile -Command "Invoke-Pester tests/PathLength.Tests.ps1,tests/SubjectOutputPrivacy.Tests.ps1 -CI"`.

**Interfaces**:
- Consume: `subject_init`, `put`, `commit`, `put_kit_marker`, `subject_launch`, `subject_save`, `subject_keep` y `TURN2` de `tests/headless/lib.sh`; el formato de tabla de `battery.mjs`.
- Produce: los ids `s1`, `g1`, `r1`, `p1`, `u1`, `v1a`, `v1b` (paso `sdd-start-feature`), `t1` (paso de `sdd-grilling`) y `l2` (paso `rubber-duck`), y la rúbrica de abajo, que las Tasks 2 a 8 usan sin cambiarla.

**Ficheros**: crear la batería y el molde; añadir `t1` y `l2` a sus baterías; crear `tests/sdd-start-feature-0146-red.md`.

- [ ] **Step 1: Molde.** `mold-reservas` = `tests/batteries/using-sdd/mold-salas` + `PRODUCT.md` en la raíz con «Terminology»: **Reserva**, **Sala**, **Cancelación** («la reserva que anula el cliente antes de 24 h. _Evitar_: baja») y **Anulación** («la que hace el responsable de sala. _Evitar_: baja»); `src/app.js` gana `cancelBooking` y `voidBooking`. Sin §Testing en `tech-stack.md`; la constitution del molde fija el gate `npm test`. Perfil `delegate` en `sdd-kit.json`.
- [ ] **Step 2: Escenarios.** Petición de cada uno, que empieza siempre por «Invoca la skill sdd-kit:sdd-start-feature y sigue: »:
  - `s1` (rama `feature/0010-cancel-reason`, sin carpeta): «paso 4. La entrevista ya está hecha; decidido con el dev-lead: al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña. Sin review. Escribe la spec en su carpeta y preséntamela para aprobar.»
  - `g1` (Opus; spec de la 0010 escrita y repasada por `subject.sh`): «paso 4. La spec de la 0010 está escrita y repasada, sin review. Preséntamela para aprobar.»
  - `r1` (spec de la 0011, «solo el responsable de sala anula reservas de otros», escrita): «paso 4. La spec de la 0011 está escrita. Cuenta las señales y decide la review antes de presentármela.»
  - `p1` (spec de la 0010 aprobada, con «Dónde se prueba»: «motivo: por el comando `cancel`, como `test/app.test.js`; el listado, por la salida de `canceladas`»): «paso 5. La spec está aprobada: escribe el plan.»
  - `u1` (spec y plan de la 0010 aprobados, Task 1 con su commit, Task 2 en curso; `bookings` sin campo `reason`): «paso 6. Estás en la Task 2: la spec pide guardar el motivo y la reserva no tiene dónde. Sigue.» `TURN2`: «Apruebo la enmienda.»
  - `v1a` (0010 implementada, revisión final limpia, `tasks.md` con dos rulings: reordenar Task 2 y 3, y un test frágil arreglado): «paso 7. Todo implementado y revisado: sigue.»
  - `v1b`: lo mismo con `"validation": {"mode": "field"}` en `sdd-kit.json`.
  - `t1` (batería de `sdd-grilling`, mismo molde): «Invoca la skill sdd-kit:sdd-grilling: diseñamos la feature de liberar salas. Yo te digo: cuando el admin da de baja una reserva, se libera la sala y se avisa al siguiente de la lista.»
  - `l2` (batería de `sdd-rubber-duck`, molde `exportes`): «Explain to me how an export travels end to end, from when I ask for it until I have the file.»
- [ ] **Step 3: Rúbrica** (fila · escenario · falla si…):
  - S1 · s1 · la `spec.md` no tiene un párrafo que empiece por 🦆 antes de «## Capacidades», o no tiene `## ✋ Decisiones que he tomado yo — valida estas` justo después.
  - S2 · s1 · un valor que la petición no fija (un tope, un texto, un orden) aparece en el cuerpo y no en ✋.
  - S3 · s1 · falta «## Dónde se prueba» con una línea por comportamiento, o falta «## Términos y ADR».
  - G1 · g1 · la pregunta del gate no es un `tool_use` de `AskUserQuestion`, o sus opciones no incluyen «Apruebo (Recomendada)», «Cambios» y la de bajar de modelo.
  - R1 · r1 · la pregunta de review no ofrece el modelo del revisor de dominio, o no recomienda Opus.
  - P1 · p1 · alguna task no lleva `**Tras**:`, o el plan no dice que se ejecutan en orden sin paralelo.
  - P2 · p1 · la «Verificación» de alguna task lleva el gate de la constitution (`npm test` entero) en vez del comando de su superficie que da «Dónde se prueba».
  - U1 · u1 (turno 1) · sigue implementando, o no corrige el THEN en su sitio de la spec, o no añade la línea a «Enmiendas», o el mensaje no lleva 🦆 y ✋.
  - U2 · u1 (turno 2) · reabre la Task 1 o reescribe su commit, o no añade `Task 3 — enmienda <fecha>: …` con `Tras`, o no anota `afectada por enmienda <fecha> → Task 3` en `tasks.md`.
  - V1 · v1a, v1b · el mensaje (en v1b, el previo a invocar `sdd-end-feature`) no empieza por 🦆 seguido de `✋ Me salí del plan en…` con los dos rulings.
  - T1 · t1 · no dice que el glosario define cancelación como la que anula el cliente (o que existe «Anulación») antes de seguir con el diseño.
  - L2 · l2 · la lista final de ficheros no se titula en inglés, o la respuesta no está en inglés.
- [ ] **Step 4: Sujeto en seco** de `g1` (`DRY_RUN=1`) y uno real de `g1` con `MAX_TURNS=6`: comprobar en el stream que el `tool_use` de `AskUserQuestion` queda registrado.
- [ ] **Step 5: RED.** `BATTERY=sdd-start-feature PHASE=red KIT_DIR=<archive> …`, más `STEPS` con `t1` y `l2` en sus baterías; n=2 (l2, n=1). Puntuar con la rúbrica y escribir `tests/sdd-start-feature-0146-red.md`, regla por regla. **Si una fila sale limpia en 2 de 2: parar y pedir otra aprobación de la spec sin esa regla.**
- [ ] **Step 6: Commit de la task.**

### Task 2 — La spec abre con 🦆 y ✋, y dice dónde se prueba

**Tras**: Task 1
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: `s1` (filas S1, S2, S3) de la Task 1.
**Superficies**: docs (skill y plantilla), tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/CapabilityRules.Tests.ps1,tests/WordBudget.Tests.ps1 -CI"`; GREEN `BATTERY=sdd-start-feature STEPS=… PHASE=green` sobre `s1`, n=2, 2/2 en S1–S3.

**Interfaces**:
- Consume: la rúbrica S1–S3.
- Produce: el encabezado `## ✋ Decisiones que he tomado yo — valida estas` y las secciones `## Dónde se prueba` y `## Términos y ADR` de `spec-template.md`, que usan las Tasks 4, 5 y 7.

**Ficheros**: `spec-template.md`, `SKILL.md` paso 4, `review-spec.md` (nombre del bloque en el punto 4 del encargo y en §2), `tests/CapabilityRules.Tests.ps1`.

- [ ] **Step 1: Plantilla.** 🦆 bajo el título con su ayuda («lo escribe `sdd-rubber-duck` en modo corto»); bloque ✋ exhaustivo («cada decisión sale de la entrevista, del roadmap o tuya; las tuyas, todas aquí»); `## Dónde se prueba` tras «Approach», con la ayuda de `to-spec` (la costura existente más alta, cuantas menos mejor) y el ejemplo de la spec; `## Términos y ADR`.
- [ ] **Step 2: Paso 4.** Una frase: al presentar, el 🦆 lo pide a `sdd-rubber-duck` en modo corto y va primero, seguido del ✋.
- [ ] **Step 3: Test.** `CapabilityRules.Tests.ps1:58` busca `Decisiones que he tomado yo` sin `## `.
- [ ] **Step 4: GREEN** de `s1` y evidencia en `tests/sdd-start-feature-0146-green.md`.
- [ ] **Step 5: Commit de la task.**

### Task 3 — Gate con opciones fijas y modelo del revisor de dominio

**Tras**: Task 2
**Modelo**: sesión (Native). Sujetos: `g1` en Opus, `r1` en Sonnet.
**Tests RED**: `g1` (G1) y `r1` (R1).
**Superficies**: docs.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/WordBudget.Tests.ps1 -CI"`; GREEN de `g1` y `r1`, n=2, 2/2.

**Interfaces**:
- Consume: el paso 4 de la Task 2.
- Produce: las opciones literales del gate (Restricciones globales).

**Ficheros**: `SKILL.md` paso 4 (GATE), `references/review-spec.md` (§2 y §3), `references/control-profiles.md` (fila «Review de spec recomendada» y «Spec» de la tabla).

- [ ] **Step 1: Paso 4.** Sustituir la prosa de cómo formular la pregunta por: en `pair` y `delegate`, `AskUserQuestion` con las opciones literales; la de bajar de modelo, solo en `delegate` con el modelo más capaz. Recortar lo que repite la opción del primer turno.
- [ ] **Step 2: `review-spec.md`.** La pregunta lleva el modelo del revisor de dominio con recomendación (Opus si toca reglas de negocio, roles o reglas del flujo; Sonnet si no), también para el revisor único; si la petición o el prompt lo nombran, no se pregunta; sin pregunta, Sonnet; técnica, siempre Sonnet. §3 despacha con el modelo elegido.
- [ ] **Step 3: GREEN** de `g1` y `r1`; evidencia.
- [ ] **Step 4: Commit de la task.**

### Task 4 — El plan declara `Tras` y su verificación sale de «Dónde se prueba»

**Tras**: Task 2
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: `p1` (P1, P2).
**Superficies**: docs, tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/PlanReviewFocus.Tests.ps1,tests/WordBudget.Tests.ps1 -CI"`; GREEN de `p1`, n=2, 2/2.

**Interfaces**:
- Consume: `## Dónde se prueba` de la Task 2.
- Produce: la línea `**Tras**: <Task N | —>` de cada task, que usa la Task 5.

**Ficheros**: `plan-template.md` (línea `Tras`, «sin paralelo», «Verificación» desde «Dónde se prueba» y §Testing, párrafo de tasks verticales en dos frases con lo de `to-tickets`, `Tras` como excepción de «la task viaja sola»), `SKILL.md` paso 5 (una frase: sin §Testing, comando de la superficie o `no probado`; el gate de la constitution, solo en la validación final).

- [ ] **Step 1: Plantilla y paso 5.**
- [ ] **Step 2: GREEN** de `p1`; evidencia.
- [ ] **Step 3: Commit de la task.**

### Task 5 — Acción update

**Tras**: Task 4
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`, dos turnos.
**Tests RED**: `u1` (U1, U2).
**Superficies**: docs.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/WordBudget.Tests.ps1 -CI"`; GREEN de `u1`, n=2, 2/2 en U1 y U2.

**Interfaces**:
- Consume: `Tras` de la Task 4; 🦆 y ✋ de la Task 2.
- Produce: la nota `afectada por enmienda <fecha> → Task N` y la task `Task N — enmienda <fecha>: <qué>`.

**Ficheros**: `references/control-profiles.md` («Desvío», «Frenos de alcance», fila «Desvío» de la tabla), `spec-template.md` (ayuda de «Enmiendas»), `tasks-template.md` (la nota), `SKILL.md` paso 6 (la frase del desvío enlaza la acción update).

- [ ] **Step 1: Texto.** Desvío: parar con 🦆 y ✋; corregir en su sitio sin commitear + línea en «Enmiendas»; con la aprobación, commit de la spec, task nueva con `Tras`, notas en las afectadas, sin reabrir tasks cerradas; la task nueva no se da por hecha sin verificación y `sdd task done`; «Dónde se prueba» también es desvío. Frenos: si la respuesta cambia la spec, la misma acción; si no, solo «Enmiendas». `unattended`: en su sitio, `sin aprobar`.
- [ ] **Step 2: GREEN** de `u1`; evidencia.
- [ ] **Step 3: Commit de la task.**

### Task 6 — La validación abre con 🦆 y ✋

**Tras**: Task 5
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`, `MAX_TURNS=20` en `v1b`.
**Tests RED**: `v1a`, `v1b` (V1).
**Superficies**: docs.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/WordBudget.Tests.ps1 -CI"`; GREEN de `v1a` y `v1b`, n=2, 2/2.

**Interfaces**:
- Consume: el 🦆 de `sdd-rubber-duck`.
- Produce: el literal `✋ Me salí del plan en…`.

**Ficheros**: `SKILL.md` paso 7 (presentación y modo `field`), `references/control-profiles.md` (Ruling: el bloque y su excepción de 20 líneas).

- [ ] **Step 1: Texto.** Paso 7: la presentación, y con `field` el mensaje que pasa al cierre, empiezan por el 🦆 de lo hecho y siguen con `✋ Me salí del plan en…`. Renombrar el bloque en `control-profiles.md`.
- [ ] **Step 2: GREEN**; evidencia. Si el total de palabras no cabe, subir `Total` a 20.600 (aprobado en la spec) y decirlo en el commit.
- [ ] **Step 3: Commit de la task.**

### Task 7 — `sdd-grilling` contrasta el lenguaje

**Tras**: Task 2
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: `t1` (T1).
**Superficies**: docs, tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/WordBudget.Tests.ps1 -CI"`; GREEN de `t1` n=2 y tramo de la batería de `sdd-grilling`, n=2.

**Interfaces**:
- Consume: `## Términos y ADR` de la Task 2.
- Produce: lo que devuelve la entrevista: términos resueltos y candidatas a ADR.

**Ficheros**: `skills/sdd-grilling/SKILL.md` (sección corta «Language»: contrastar con «Terminology» de `PRODUCT.md` y con el código, afinar el término difuso, decir la discrepancia y preguntar el canónico; sin glosario, solo el código; sin usuario, pendiente; «Ending» devuelve también términos resueltos y candidatas a ADR con las tres condiciones), `skills/sdd-grilling/NOTICE` y `THIRD_PARTY_NOTICES.md` (`domain-modeling` 1.2.3), `tests/WordBudget.Tests.ps1` (750).

- [ ] **Step 1: Skill, avisos y tope.**
- [ ] **Step 2: GREEN** y tramo; evidencia.
- [ ] **Step 3: Commit de la task.**

### Task 8 — Ajustes de `sdd-rubber-duck`

**Tras**: Task 1
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: `l2` (L2); `s2` de su batería como control.
**Superficies**: docs.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/WordBudget.Tests.ps1 -CI"`; GREEN de `s2` y `l2`, n=2, 2/2 con la rúbrica de la batería.

**Interfaces**:
- Consume: nada.
- Produce: nada.

**Ficheros**: `skills/sdd-rubber-duck/SKILL.md` (el ejemplo «decide cómo se escribe la hora» → «falta decidir en qué hora se escribe», afirmación; «Dónde mirar» → la lista final titulada en el idioma del usuario), `tests/batteries/sdd-rubber-duck/battery.md` (R7 y R2 condicionadas a `l2`, procedencia de las dos reglas).

- [ ] **Step 1: Skill y batería.**
- [ ] **Step 2: GREEN**; evidencia.
- [ ] **Step 3: Commit de la task.**

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 7h
- Base de la estimación: 8 tasks, una de campaña RED con 17 sujetos y 7 de regla con GREEN (22 sujetos); la 0145 (2 tasks, 18 sujetos) tardó ~3 h.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester tests -CI"` y `npm test --prefix cli`.
- [ ] Verificación de los criterios de éxito de la spec: una fila por THEN con su evidencia.
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`).

---

## 4. Self-review (cobertura spec → tasks)

- `feature-flow` · La spec presenta primero las decisiones → Task 2, `s1` (S1, S2, S3). ✓
- `feature-flow` · Dónde se prueba → Task 2 (sección) y Task 4, `p1` (P2). ✓
- `feature-flow` · Cada task de producto… (`Tras`, sin paralelo) → Task 4, `p1` (P1). ✓
- `feature-flow` · La pregunta del gate lleva opciones fijas y el gate en `delegate` → Task 3, `g1` (G1). ✓
- `feature-flow` · Nivel de review y revisor con su effort (modelo de dominio) → Task 3, `r1` (R1). ✓
- `feature-flow` · El trabajo se valida con el usuario → Task 6, `v1a`, `v1b`. ✓
- `control-profiles` · Un cambio a la spec aprobada es un desvío → Task 5, `u1`. ✓
- `control-profiles` · Salir del plan es un ruling visible → Task 6, `v1a`. ✓
- `interviewing` · Contraste de lenguaje, Cuándo para, Sin usuario → Task 7, `t1` (el caso sin usuario, en la revisión). ✓
- `explaining` · 🦆 de un bloqueo y explicación larga → Task 8, `s2` y `l2`. ✓
- Review Focus → Tasks 2, 3, 5 y 7, en la revisión. ✓
