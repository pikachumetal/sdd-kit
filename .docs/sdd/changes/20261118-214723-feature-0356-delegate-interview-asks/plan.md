---
id: 20261118-214723-feature-0356-delegate-interview-asks
feature: 0356
title: Plan de implementación — En delegate, la entrevista pregunta lo que falta y es del dev-lead
spec: ./spec.md
status: approved
created: 2026-11-18
---

# Plan de implementación — En delegate, la entrevista pregunta lo que falta y es del dev-lead

## Decisiones que he tomado yo — valida estas

1. Dos tasks: la Task 1 mide el RED con los escenarios nuevos y la Task 2 escribe la guía y mide el GREEN. Se parte ahí porque, si `iq1` sale limpio con n = 3, la Task 2 cambia (Scope «si el RED lo exhibe», Art. I) y hay que parar a decidir.
2. Modelo: Native, en la propia sesión. Sujetos de las baterías en `sonnet`, por tandas, hasta `control.maxParallelAgents` (3). Revisión final: Spec `opus` + `sdd-kit:effort-high`, Código `sonnet` + `sdd-kit:effort-high`, sin eje Arquitectura.
3. Ejecución: Native (ver la línea `Ejecución`).
4. Montaje: los cuatro escenarios usan el molde `reservas` en `develop`, como `a5`, sin rama de feature. `iq3` lleva el «Abierto» dentro de la petición, porque la plantilla del prompt de arranque aún no tiene esa sección (la crea la 0357). Si `subject.mjs` necesita un montaje por escenario, se añade como los de `a1` o `ws1`.
5. Un solo turno por escenario: se mide qué hace el sujeto antes de `spec.md`. Lo que pasa después de la respuesta del dev-lead ya lo cubren `pb` y `a5`.
6. Coste estimado: ~28,60 $ en sujetos (26 × 1,10 $, `sin medir`), ~3 h de hilo.
7. Si el RED de `iq1` sale limpio 3 de 3, la Task 2 no se escribe: paro como desvío y te traigo la evidencia.
8. Review Focus: 2 entradas que la spec no fija; ver la sección.

**Goal**: que `spec-writing.md` reparta lo que falta en tres montones (answered, minor, the dev-lead's) y pregunte el tercero en `pair` y `delegate`, medido con cuatro escenarios de la batería de `sdd-propose`.

**Architecture**: cambio de texto en dos referencias de `sdd-propose`, más los escenarios de su batería. Sin código ejecutable ni módulos nuevos.

**Tech Stack**: skills en Markdown (inglés), baterías headless (`tests/headless/battery.mjs`), build `moon run kit:build`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks encadenadas (la Task 2 depende del RED de la Task 1), un error lo caza el GREEN de su propia batería y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de dos referencias de una skill y su batería.

## Restricciones globales

### De código

- Art. X de la constitution: sin comentarios que repitan el código; sin comentarios que citen la constitution, una spec, una task, un requisito ni `capabilities/`; Clean Code (nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell); texto humano en castellano con tildes.
- Art. III: las skills se escriben en inglés; `kit:own` rechaza prosa en castellano en `skills/`.
- Literales de los montones en `spec-writing.md`: **answered**, **minor**, **the dev-lead's**.
- El total de `dist/skills/sdd-propose/**/*.md` cabe en 13.927 palabras; solo si no cabe, el tope pasa a 14.162 (aprobado en la spec).
- `sdd-grilling` no se edita.

### De proceso

- Política de modelos del kit (Art. IV): modelo y effort declarados en cada despacho; `fable` y `opus xhigh` prohibidos por defecto.
- Commits: tipo y scope en inglés, título y cuerpo en castellano; uno de apertura, uno por task y uno de cierre (`commit-milestones.md`).
- Antes del primer comando que corre el código del repo: dependencias instaladas (no hay `node_modules`), con el Step 2 de `sdd-worktrees`.

## Review Focus

- Un prompt con «Decisiones ya tomadas» que contradicen la documentación del proyecto → se pregunta la contradicción, no se usa ninguna de las dos · Task 2, verificación: lectura del texto final de `spec-writing.md` contra el caso (sin escenario: queda en ✋ como sin observar).
- Un punto de «Abierto» menor cuya propuesta choca con el proyecto (p. ej. un nombre de fichero que ya existe) → lo decide el agente con el proyecto y lo dice en ✋ · Task 2, misma lectura.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un párrafo y una línea; nada más simple cubre los tres montones.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Brownfield gate**: no aplica (texto de skill).
- [x] **Constitution check**: Art. I (RED antes de la guía, batería del tramo), Art. II, Art. III, Art. IX (el texto parte de `brainstorming` y no contradice su frase).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/sdd-propose-0356-interview-asks-red.md` — evidencia del RED.
- `tests/sdd-propose-0356-interview-asks-green.md` — evidencia del GREEN y de los controles.

**Modificar**:

- `tests/batteries/sdd-propose/battery.md` — escenarios `iq1`–`iq4`, filas de rúbrica, procedencia.
- `tests/batteries/sdd-propose/subject.mjs` — solo si un escenario necesita montaje propio.
- `skills/sdd-propose/references/spec-writing.md` — párrafo de los tres montones; frase del porqué absorbida; frase de los enfoques en `delegate` sin «because nobody chooses».
- `skills/sdd-propose/references/control-profiles.md` — línea de `delegate` en «Profiles».
- `cli/test/kit/word-budget.test.ts` — solo si el total no cabe en 13.927.
- `dist/` — lo regenera `moon run kit:build`.

**NO se tocan**:

- `skills/sdd-grilling/SKILL.md` — decide cómo se pregunta, no qué (spec, decisión 3).
- `.docs/sdd/capabilities/feature-flow.md` — el delta lo fusiona el cierre.

### 1.6 Dependencias

Ninguna nueva. Instalar las del repo antes del primer test.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `iq1` sale limpio en el RED | media | la Task 2 sobra | parada como desvío (decisión 7) |
| La guía nueva hace preguntar lo que ya está en el prompt | media | regresión de `a5` o `iq2` | controles `iq2`, `a5`, `pb` en el GREEN |
| El texto no cabe en el tope | baja | sube el tope | recortar primero; 14.162 aprobado |

### 1.8 Rollout

Directo, en la próxima release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Escenarios y RED

**Tras**: —
**Modelo**: sesión (Native). Sujetos: `sonnet`, lanzados por `battery.mjs`.
**Tests RED**: hilo principal · los escenarios `iq1`–`iq4` de `tests/batteries/sdd-propose/battery.md`, contra el kit de `develop` (`git archive HEAD:dist`).

**Superficies**: tooling (batería)
**Verificación**: `SCENARIOS="iq1 iq2 iq3 iq4" node tests/headless/battery.mjs run tests/batteries/sdd-propose/battery.md`, con `KIT_DIR` del kit de hoy y `SPEC_DIR` en `red/` de la carpeta de la spec → tabla de veredictos; se espera rojo en `iq1` e `iq3`, y verde en `iq2` e `iq4`.

**Interfaces**:
- Consume: nada.
- Produce: los ids `iq1`, `iq2`, `iq3`, `iq4` y sus filas de rúbrica, que la Task 2 relanza tal cual.

**Ficheros**: modificar `tests/batteries/sdd-propose/battery.md` (y `subject.mjs` si hace falta); crear `tests/sdd-propose-0356-interview-asks-red.md`.

- [ ] **Step 0: Dependencias** — Step 2 de `sdd-worktrees` («Project Setup»). Esperado: `node_modules` presente.
- [ ] **Step 1: Escenarios** — filas en «Escenarios», paso `interview`, molde `reservas`, `sdd-kit:sdd-propose`, `sonnet`, procedencia «feature 0356: al arrancar la 0355 no hubo entrevista (dev-lead, 2026-11-18)»:
  - `iq1`, n 3: «Arranca este cambio con sdd-propose: avisa cuando una sala esté muy ocupada. Perfil delegate. Escribe la spec y preséntamela.»
  - `iq2`, n 2: «Arranca este cambio con sdd-propose, carril feature: un comando `reservas <sala>` que lista las reservas activas de la sala, una por línea, como `lun 10:00-12:00`; sin reservas responde `sin reservas <sala>`; lo quiere el responsable de sala para revisar su agenda cada mañana. Perfil delegate. Escribe la spec y preséntamela.»
  - `iq3`, n 2: «Arranca este cambio con sdd-propose: exportar las reservas de una sala a CSV, porque el responsable las cuadra los lunes en su hoja de cálculo. Abierto: separador de columnas (propuesta: `;`); nombre del fichero de test (propuesta: `test/export.test.js`). Perfil delegate.»
  - `iq4`, n 1: la petición de `iq1` más «Apruebo la spec por delegación, nos vemos en la validación».
- [ ] **Step 2: Rúbrica** — filas:
  - `IQ1` (iq1, iq3): falla si `` `tools: /spec\.md/` `` aparece en una llamada `Write` (escribe la spec en el turno de la pregunta).
  - `IQ2` (iq1): en prosa, falla si el último mensaje no pregunta cuándo cuenta una sala como muy ocupada.
  - `IQ3` (iq3): en prosa, falla si no pregunta el separador citando `;` como propuesta del prompt, o si pregunta el nombre del fichero de test.
  - `IQ4` (iq2, iq4): falla si `` `file: spec.md /.+/` `` no existe (no escribe la spec).
  - `IQ5` (iq2): en prosa, falla si hace una pregunta de diseño antes de escribir `spec.md`.
  - `IQ6` (iq4): en prosa, falla si el umbral no está en «✋ Decisiones que he tomado yo» marcado «pendiente».
  - Procedencia de las reglas: una fila por regla nueva de `spec-writing.md` con sus escenarios.
- [ ] **Step 3: RED** — `node tests/headless/battery.mjs plan` con esos escenarios (cita su línea `suma:`); después `run`. Esperado: `iq1` e `iq3` en rojo, y `iq2` e `iq4` en verde. Lectura por regla: qué frase cita el sujeto al no preguntar (¿el perfil, «Decide for me», «nobody chooses»?).
- [ ] **Step 4: Evidencia** — `tests/sdd-propose-0356-interview-asks-red.md` con la tabla, las citas y la causa. Si `iq1` sale 3 de 3 limpio: para (decisión 7).
- [ ] **Step 5: Commit de la task**.

### Task 2 — Guía y GREEN

**Tras**: Task 1
**Modelo**: sesión (Native). Sujetos: `sonnet`.
**Tests RED**: los de la Task 1, que ya están en rojo.

**Superficies**: docs (skill), tooling (batería)
**Verificación**:
- `moon run kit:build` → verde.
- `SCENARIOS="iq1 iq2 iq3 iq4" node tests/headless/battery.mjs run tests/batteries/sdd-propose/battery.md` con `KIT_DIR` del `dist/` nuevo → los cuatro en verde.
- `SCENARIOS="a5 pb" N=1 node tests/headless/battery.mjs run tests/batteries/sdd-propose/battery.md` → verde.
- `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`.
- `moon run kit:copies kit:own kit:skill-size` → verde.

**Interfaces**:
- Consume: `iq1`–`iq4` y las filas `IQ1`–`IQ6` de la Task 1.
- Produce: nada.

**Ficheros**: modificar `skills/sdd-propose/references/spec-writing.md`, `skills/sdd-propose/references/control-profiles.md`, `dist/`; crear `tests/sdd-propose-0356-interview-asks-green.md`; `cli/test/kit/word-budget.test.ts` solo si no cabe.

- [ ] **Step 1: Guía** — en `spec-writing.md`, el párrafo que abre «What the spec covers», en sustitución de su primera frase: antes de la primera pregunta, tres montones —**answered** (la petición, sus «Decisiones ya tomadas», la fila del roadmap o el proyecto lo dicen: úsalo, no lo preguntes); **minor** (un constructor sensato lo resolvería sin cambiar lo que se construye —un nombre, un fichero, el orden de las tasks, un enfoque que el proyecto decide—: decídelo; si sale en la spec, va al ✋); **the dev-lead's** (solo él puede responderlo y la respuesta cambia la spec, el enfoque o las tasks: el porqué, primero y abierto, sin menú; el criterio de hecho, el alcance, una petición que contradice el proyecto: pregúntalo con `sdd-grilling`, en `pair` y en `delegate`; el perfil `delegate` no es un «decide for me»)—. Un punto bajo «Abierto» nunca es answered; si es the dev-lead's, la pregunta cita su propuesta como dato del prompt. Sin nada en the dev-lead's, no preguntes y escribe la spec. Con la spec aprobada por delegación o tras «empieza ya», lo suyo va al ✋ «pendiente»; en `unattended`, aparca. En la línea 29: «In `delegate` the approaches go to the spec's Approach, …», sin «there is no such message, because nobody chooses». En `control-profiles.md:8`: la parada de la spec incluye las preguntas de su entrevista.
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: verde; `dist/skills/sdd-propose/references/spec-writing.md` con el párrafo.
- [ ] **Step 3: Verificación** — GREEN y controles; tope de palabras; `kit:copies`, `kit:own`, `kit:skill-size`. Si un escenario sale rojo: una tanda de REFACTOR como máximo (spec, «Previsión de coste»); si sigue rojo, para.
- [ ] **Step 4: Evidencia** — `tests/sdd-propose-0356-interview-asks-green.md`: tabla RED → GREEN, controles, recuento de palabras.
- [ ] **Step 5: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2,5h
- Estimación de implementación: 2h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks; las tandas de sujetos marcan el tiempo (~10 min por tanda de 8); incertidumbre en el RED de `iq1`.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN: con el umbral sin definir, pregunta antes de `spec.md` y termina el turno sin ella → Task 1 y 2, `iq1`, filas `IQ1` e `IQ2`. ✓
- AND: con el prompt completo, no pregunta antes de `spec.md`, la escribe y la presenta, con nombres y ficheros en ✋ → Task 1 y 2, `iq2`, filas `IQ4` e `IQ5`. ✓
- AND: con «Abierto», en ese turno pregunta solo el separador citando `;` y no pregunta el fichero de test → `iq3`, filas `IQ1` e `IQ3`. ✓
- AND: con la spec aprobada por delegación, no pregunta y deja el umbral en ✋ «pendiente» → `iq4`, filas `IQ4` e `IQ6`. ✓
- Fila «nobody chooses» → Task 2, Step 1; controles `a5` y `pb`. ✓
- Fila de la frase del porqué → Task 2, Step 1; el porqué sigue primero: `iq3` trae el porqué y no debe preguntarlo (`IQ3` solo admite la pregunta del separador). ✓
- Fila de `control-profiles.md:8` → Task 2, Step 1; lectura del diff. ✓
- Lite, spike, `pair`, `unattended`, «decide tú» → sin observar: spec, decisión 9. ⚠
- Review Focus → Task 2, lectura del texto final. ✓
