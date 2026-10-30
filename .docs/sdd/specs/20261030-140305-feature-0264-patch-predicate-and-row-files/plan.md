---
id: 20261030-140305-feature-0264-patch-predicate-and-row-files
feature: 0264
title: Plan de implementación — El predicado de patch en el roadmap y la evidencia de una fila nacida de otro cambio
spec: ./spec.md
status: approved
created: 2026-10-30
---

# Plan de implementación — El predicado de patch en el roadmap y la evidencia de una fila nacida de otro cambio

## Decisiones que he tomado yo — valida estas

1. Modelo: la task la hace esta sesión, Opus 5.5; sujetos Sonnet. Una sola task: bajar de modelo costaría más en caché de lo que ahorra.
2. Ejecución: native — ver la línea de abajo.
3. El RED cuenta `rl1` con su prompt solo en el GREEN: el `TURN2` «Dame el prompt de esa fila.» entra ahora, porque el RED ya falló en la fila, y el GREEN mide fila y prompt.
4. `n` de `rl1` y `re1` pasa a 2 y umbral 2/2; `rf1` y `pw1` se quedan con n = 1 y umbral 1/1, como controles.
5. Coste estimado: 0,5 h y 2,40 $ de sujetos, los de la spec.
6. Review Focus: 2 entradas que la spec no fija; ver la sección.

**Goal**: dos frases en «Something concrete» de `sdd-roadmap`, pagadas con cuatro líneas redundantes, y su batería en verde.

**Architecture**: la regla va donde se escribe cualquier fila, porque el triaje y las demás entradas remiten a «Something concrete». No cambia la CLI ni la plantilla del prompt.

**Tech Stack**: batería de sujetos de `tests/headless/battery.mjs`; `cli/test/kit/word-budget.test.ts` para el tope.

**Spec**: `./spec.md`

**Ejecución**: native, porque es una task sin interfaces entre tasks, un error lo caza su batería y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y su batería.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros; texto humano en castellano con tildes.
- El saldo de `skills/sdd-roadmap/SKILL.md` queda igual o baja: 3.595 → 3.584 con `wc -w`.

### De proceso

- Sujetos Sonnet, con kit congelado de la rama; un rojo no se relanza sin leer por qué falló.
- Los ejes de la revisión final: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
- Commits: tipo y scope en inglés, título y cuerpo en castellano, con la línea de atribución.

## Review Focus

- Una fila de un solo test → sigue siendo «Patch:», como dice «Un patch pendiente es una fila de «Próximo»» · Task 1, control `m5`, y lectura del texto: la regla cuenta dos o más.
- Un patch ya cerrado cuyo artefacto recibe las cifras → adenda fechada al final, sin reescribir el cuerpo · Task 1, `re1`, comparando `patch-0007.md` con el del molde.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos frases y sin pieza nueva.
- [x] **YAGNI gate**: sin abstracción.
- [x] **Brownfield gate**: un patch de un test sigue igual.
- [x] **Constitution check**: Art. I (RED antes y batería), Art. II (predicado observable: contar tests), Art. XI (adenda).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `skills/sdd-roadmap/SKILL.md` — las dos frases y las cuatro líneas que salen.
- `tests/batteries/sdd-roadmap/battery.md` — `rl1` y `re1` con n = 2, y procedencia de las dos reglas y de lo retirado.
- `tests/batteries/sdd-roadmap/subject.mjs` — `TURN2` de `rl1`.
- `.docs/sdd/roadmap.md` — al cerrar.

**NO se tocan**:

- `skills/sdd-start-patch/SKILL.md`, `launch-prompt-template.md` — fuera por la spec.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El molde `salas-gate` da las cifras por un log y la fila sigue copiándolas sin enlace | Media | Otra tanda | Una tanda de REFACTOR prevista en la spec |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Las dos reglas de la fila en `sdd-roadmap`

**Tras**: —
**Modelo**: la sesión, Native (Opus 5.5); effort: el de la sesión
**Tests RED**: hilo principal; ya corridos: `roadmap/red/out/rl1-1` y `re1-1`, en rojo
**Superficies**: docs (skill), tooling (batería)
**Verificación**: `node tests/headless/battery.mjs run` con `BATTERY=sdd-roadmap`, `STEPS="row-lane row-evidence"`, `PHASE=green` → `rl1 · 2/2` y `re1 · 2/2`, más la rúbrica RL1 y RE1 leída de `roadmap.md`, `patch-0007.md` y `texts.txt`; `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`
**Se prueba en la aplicación**: no, porque es texto de una skill: lo prueban los sujetos.

**Interfaces**:
- Consume: nada
- Produce: los escenarios `rl1` y `re1`

**Ficheros**: `skills/sdd-roadmap/SKILL.md`, `tests/batteries/sdd-roadmap/battery.md`, `tests/batteries/sdd-roadmap/subject.mjs`

- [ ] **Step 1: Implementación** — tras «the «Patches» section is the register of the closed ones.», los dos literales de la decisión 6 de la spec. Se borran la racionalización «I freeze the scope in a separate document» y las red flags «edit the row or the spec of a feature in flight», «rewrite a rule of a proposal» y «take in a meeting without keeping its literal notes». En `subject.mjs`, `if (s.SC === 'rl1') s.env.TURN2 = 'Dame el prompt de esa fila.';`. En `battery.md`, n y umbral, y dos filas de «Procedencia de las reglas».
- [ ] **Step 2: Build** — `node --check` de `subject.mjs`. Esperado: sin salida.
- [ ] **Step 3: Verificación** — copia congelada del kit de la rama, los comandos de arriba, y controles `m5` y `rf1`.
- [ ] **Step 4: Commit de la task** — uno solo, con los escenarios `pw1`, `rf1` y la evidencia de `roadmap/` y `propose/`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,6 h
- Estimación de implementación: 0,5 h
- Base de la estimación: una task; 0224 con tres ficheros, 0,96 h
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN la fila no empieza por «Patch:», ni lleva `**Carril:** patch` → Task 1, RL1 sobre `roadmap.md` de `rl1`. En la forma 3.0.0 no se mide: misma frase, nombrada en la regla (avisado aquí). ✓
- AND el prompt lleva `***Carril:***` lite o feature y `***Nombre:***` `feature/<id>-<slug>` → Task 1, RL1 sobre `texts.txt` del segundo turno. ✓
- THEN la fila enlaza el `patch.md` con la sección → Task 1, RE1 sobre `roadmap.md` de `re1`. ✓
- AND ese `patch.md` lleva las cifras en una adenda fechada → Task 1, RE1 sobre `patch-0007.md`. ✓
- Retirado: cuatro líneas → Task 1, sus destinos siguen en la skill (`grep`) y controles `m5`, `rf1`. ✓
- Review Focus → Task 1, `m5` y `re1`. ✓
