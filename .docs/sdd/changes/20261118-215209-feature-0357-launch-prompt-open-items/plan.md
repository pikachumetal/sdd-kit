---
id: 20261118-215209-feature-0357-launch-prompt-open-items
feature: 0357
title: Plan de implementación — El prompt de arranque no da por decidido lo que no decidió el dev-lead
spec: ./spec.md
status: approved
created: 2026-11-18
---

# Plan de implementación — El prompt de arranque no da por decidido lo que no decidió el dev-lead

## Decisiones que he tomado yo — valida estas

1. **Modelo** — Native: la sesión hace las dos tasks. Los sujetos van en sonnet, como fija la batería. Revisión final con los ejes de `sdd-verify`: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución** — native (motivo en la línea `Ejecución`).
3. **`subject.mjs` no se toca** — la spec lo listaba en el Scope, pero los dos sujetos eligen el molde por la celda «Molde» de `battery.md`. `salas-0013` ya existe en `sdd-roadmap/subject.mjs:171`, y `salas`, con `engines` `>=22`, en `sdd-explore/subject.mjs`. Así que `m8` y `e4` son solo filas de `battery.md`. Es menos de lo que permite el Scope, no un desvío.
4. **RED con el kit de `develop`** — `dist/` construido desde el HEAD de la rama, que aún no toca la plantilla. GREEN con `moon run kit:build` y una copia de `dist/` como `KIT_DIR`, en un `RUNS_DIR` corto bajo `.temp/` (`operations.md`, «`RUNS_DIR` en una ruta corta»).
5. **Coste estimado** — ~2,3 $ en sujetos (spec, «Previsión de coste») y ~2 h de sesión.
6. Review Focus: 2 entradas; ver la sección.

**Goal**: la plantilla del prompt de arranque separa lo seguro, cada línea con su origen, de lo abierto, y las baterías de `sdd-roadmap` y `sdd-explore` lo miden.

**Architecture**: un cambio de texto en `launch-prompt-template.md`: regla en el bloque de ayuda, sección `Abierto:` en la forma y en el ejemplo. Lo miden dos escenarios nuevos, RED con el kit de hoy y GREEN con el nuevo. Las skills solo se tocan si el RED lo exhibe.

**Tech Stack**: Markdown de skills, baterías headless (`tests/headless/battery.mjs`), `moon run kit:build`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks encadenadas: la 2 necesita el RED de la 1. Un error lo caza el GREEN de su batería, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una plantilla y filas de dos baterías; ni módulo, ni dependencia, ni contrato entre módulos de código.

## Restricciones globales

### De código

- La sección se llama `Abierto:` y va entre «Decisiones ya tomadas:» y «Antes de diseñar, lee:». Cada punto es `- <lo que no está claro>. Propuesta: <recomendación>`, y sin nada abierto la sección no se escribe.
- Línea de decisión: `- <decisión>, porque <su porqué> (<origen>)`. El origen es uno de tres: `dev-lead, <AAAA-MM-DD>: «<frase>»`, `<ruta o fila>` o `agente por delegación, <ruta, fila o AAAA-MM-DD>`.
- El valor de un punto abierto no aparece en ningún otro sitio del prompt fuera de `Abierto:`, tampoco en el título ni en `***Nombre:***`.
- Una edición de `skills/sdd-roadmap/SKILL.md` o `skills/sdd-explore/SKILL.md` deja el saldo de palabras de las skills tocadas igual o más bajo (CLAUDE.md, regla 6).
- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos.

### De proceso

- Sujetos en sonnet, n y umbral de la batería; tope de turnos el de `subject.mjs` (30).
- Commits: tipo y scope en inglés, título y cuerpo en castellano; `git diff --cached --name-only` antes de commitear.

## Review Focus

- Un prompt sin nada abierto → no lleva `Abierto:`, y su forma sigue igual que hoy: la miden los controles `m1`, `m4` y `e2`. · Task 2, controles.
- Una decisión delegada («decide tú») → `agente por delegación, …`: ningún escenario la ejerce (decisión 7 de la spec). · Task 2, la regla y el ejemplo de la plantilla, leídos en la revisión final.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una plantilla y dos filas por batería; ni código ni `subject.mjs`.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: la forma vieja sigue valiendo para un prompt sin nada abierto; los controles lo miden.
- [x] **Constitution check**: Art. I (una edición de skill lleva su RED y su GREEN): Tasks 1 y 2.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `skills/sdd-templates/templates/launch-prompt-template.md` — la regla, la forma y el ejemplo.
- `tests/batteries/sdd-roadmap/battery.md` — escenario `m8`, fila M8 y procedencia.
- `tests/batteries/sdd-explore/battery.md` — escenario `e4`, fila E4 y procedencia.

**NO se tocan**:

- `tests/batteries/*/subject.mjs` — los moldes ya existen (decisión 3).
- `now-next-later-template.md` y `skills/sdd-roadmap/SKILL.md:104` — fuera del Scope.
- `skills/sdd-roadmap/SKILL.md` y `skills/sdd-explore/SKILL.md` — salvo que el RED lo exhiba.
- `.docs/sdd/capabilities/` — el delta lo fusiona `sdd-archive`.

### 1.6 Dependencias

- La 0356, sin orden de fusión (spec, decisión 9).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED sale verde: el sujeto ya separa lo propuesto | baja | el escenario no prueba la regla | spec, decisión 7: queda de control, se reformula la petición y se dice en la evidencia |
| El GREEN falla porque el sujeto no lee la regla del bloque de ayuda | media | la regla no llega | una línea en la skill que lo exhibe, con el saldo de palabras igual o más bajo |

### 1.8 Rollout

Directo: llega con la próxima release del plugin.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Escenarios `m8` y `e4`, y su RED

**Tras**: —
**Modelo**: la sesión (Native); sujetos `sonnet` (batería).
**Tests RED**: hilo principal · `tests/batteries/sdd-roadmap/battery.md` (`m8`) y `tests/batteries/sdd-explore/battery.md` (`e4`).

**Superficies**: tooling (baterías)
**Verificación**: `node --check tests/batteries/sdd-roadmap/subject.mjs` y `node --check tests/batteries/sdd-explore/subject.mjs`, sin salida; `BATTERY=sdd-roadmap SCENARIOS=m8 node tests/headless/battery.mjs run` y `BATTERY=sdd-explore SCENARIOS=e4 node tests/headless/battery.mjs run` con el kit de hoy, y M8 y E4 leídos en `texts.txt` de cada sujeto.

**Interfaces**:
- Consume: nada.
- Produce: los ids `m8` y `e4` y las filas M8 y E4, que la Task 2 relanza.

**Ficheros**: modificar `tests/batteries/sdd-roadmap/battery.md` y `tests/batteries/sdd-explore/battery.md`.

- [ ] **Step 1: Filas** — en `sdd-roadmap/battery.md`, escenario `| m8 | open | Dame el prompt de la 0013. Cómo se manda el aviso (correo, Slack…) no lo tengo claro: propón tú. | salas-0013 | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | feature 0357: lo que propone el agente va a «Abierto:» |`. En la rúbrica, la fila **M8 Lo abierto, aparte**, con el texto literal de la decisión 7 de la spec. En `sdd-explore/battery.md`, escenario `| e4 | open | Quiero subir el mínimo de node en los engines de package.json y no sé si a 22 o a 24: recomiéndame tú y dame el prompt para hacerlo en otro worktree. | salas | `sdd-kit:sdd-explore` | 2 | 2/2 | sonnet | feature 0357: la recomendación del agente va a «Abierto:» |`, y la fila **E4 Recomendación abierta**, literal de la decisión 7.
- [ ] **Step 2: RED** — lanzar los dos escenarios con el kit de hoy y juzgar M8 y E4 solo sobre el bloque de código del prompt. Esperado: rojo por una condición de M8 o E4 (el canal o la versión fuera de `Abierto:`, o sin `Abierto:`). Si sale verde, aplicar la decisión 7 de la spec: el escenario queda de control, se reformula la petición y se dice en la evidencia.
- [ ] **Step 3: Evidencia** — `tests/sdd-roadmap-0357-red.md` y `tests/sdd-explore-0357-red.md`, con la cita literal del bloque de cada sujeto y la condición que falla.
- [ ] **Step 4: Commit de la task** — `test(batteries): escenarios m8 y e4 del prompt con lo abierto aparte (0357)`.

### Task 2 — La plantilla separa lo seguro de lo abierto, y su GREEN

**Tras**: Task 1
**Modelo**: la sesión (Native); sujetos `sonnet`.
**Tests RED**: los de la Task 1 (`m8`, `e4`).

**Superficies**: docs (plantilla de skill), tooling (baterías)
**Verificación**: `moon run kit:build kit:skill-size kit:own`, verde. GREEN de `m8` y `e4` con el kit nuevo, umbral 2/2. Controles `m1`, `m4` y `e2`, cada uno a su umbral de la batería.

**Interfaces**:
- Consume: los escenarios `m8` y `e4` de `battery.md`.
- Produce: la forma nueva del prompt, que lee `sdd-propose` y nombra la 0356.

**Ficheros**: modificar `skills/sdd-templates/templates/launch-prompt-template.md`; si el GREEN lo exhibe, `skills/sdd-roadmap/SKILL.md` o `skills/sdd-explore/SKILL.md`.

- [ ] **Step 1: Plantilla** — en el bloque de ayuda, sustituir «Cuenta lo que no encuentra mirando: cada decisión con su literal y su porqué.» por la regla de las decisiones 1, 2 y 3 de la spec:
  - Qué es seguro: lo dicho o aceptado por el dev-lead; lo que consta en el roadmap, una propuesta y sus enmiendas, una spec aprobada, una ADR o la constitution; y lo delegado, marcado.
  - Delegar no es pedir una propuesta.
  - Todo lo demás, y la duda, va a `Abierto:`.
  - Ante un choque: la enmienda más reciente manda, luego la frase más reciente del dev-lead; lo que no se resuelve, a `Abierto:` con las dos fuentes.
  - Los hechos comprobados no son decisiones.
  - El valor abierto no aparece fuera de `Abierto:`.

  En la forma, `- <decisión>, porque <su porqué> (<origen>)` y, después, `Abierto:` con `- <lo que no está claro>. Propuesta: <recomendación>` y la nota «sin nada abierto, se omite». En el ejemplo, la línea de decisión acaba en `(.docs/sdd/changes/20261007-144256-proposal-0131-kit-rework/proposal.md)`, y se añade un `Abierto:` con un punto inventado y su propuesta, sin frase del dev-lead.
- [ ] **Step 2: Build** — `moon run kit:build kit:skill-size kit:own`. Esperado: verde.
- [ ] **Step 3: GREEN y controles** — relanzar `m8` y `e4` con `KIT_DIR` en una copia de `dist/` y `RUNS_DIR` corto bajo `.temp/`. Esperado: 2/2 cada uno. Después, `m1`, `m4` y `e2`, cada uno a su umbral. Si un GREEN falla porque el sujeto no aplica la regla, mover la regla a la skill que lo exhibe, con el saldo de palabras igual o más bajo, y relanzar (REFACTOR).
- [ ] **Step 4: Evidencia y procedencia** — `tests/sdd-roadmap-0357-green.md` y `tests/sdd-explore-0357-green.md`, y una fila en «Procedencia de las reglas» de cada batería: la regla de la plantilla, su RED y su GREEN, y los escenarios `m8` y `e4`.
- [ ] **Step 5: Commit de la task** — `feat(sdd-templates): el prompt de arranque separa lo decidido de lo abierto (0357)`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 1,5h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks; una plantilla y dos escenarios; la incertidumbre es si el sujeto lee la regla del bloque de ayuda.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- planning ADDED, THEN, prompt en la forma de la plantilla con las 8:00 y su origen → Task 2, GREEN `m8` (M8: las 8:00 con origen de la 0010) y control `m1`. ✓
- planning ADDED, AND, el canal en `Abierto:` y en ningún otro sitio → Task 1 RED y Task 2 GREEN `m8` (M8). ✓
- planning ADDED, AND, sin nada abierto no hay `Abierto:` → Task 2, controles `m1` y `m4` (la forma de M1 y M4). ✓
- planning, Regla ante conflicto → Task 2 Step 1 (la regla en la plantilla); sin escenario que la ejerza: se lee en la revisión final. ⚠
- routing ADDED, THEN, `sdd-explore` termina con el prompt en la forma → Task 2, GREEN `e4` y control `e2`. ✓
- routing ADDED, AND, la versión en `Abierto:` y en ningún otro sitio → Task 1 RED y Task 2 GREEN `e4` (E4). ✓
- Tabla «Lo que se retira o cambia de forma», línea de forma, bloque de ayuda y ejemplo → Task 2 Step 1. ✓
- Brief y triaje, sin cambio → N/A (confirmado en la spec). ✓
- Review Focus, prompt sin nada abierto → Task 2, controles. ✓
- Review Focus, origen `agente por delegación` → sin observar: ningún molde delega (spec, decisión 7). ⚠
