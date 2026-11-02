---
id: 20261102-163922-feature-0194-roadmap-whats-next
feature: 0194
title: Plan de implementación — sdd-roadmap, entrada «qué sigue»
spec: ./spec.md
status: done
created: 2026-11-02
---

# Plan de implementación — `sdd-roadmap`, entrada «qué sigue»

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las dos tasks las hace la sesión; sujetos Sonnet; revisión final con Spec `sdd-kit:effort-high` + `opus` y Código `sdd-kit:effort-high` + `sonnet`.
2. Ejecución Native: el plan es texto de skill y escenarios ya escritos.
3. Se prevén dos tasks, no las tres que dije en la parada: juntar la regla y lo que la paga evita un estado intermedio por encima del saldo.
4. El escenario de puerta de `using-sdd` es `r8`, con «qué sigue» sobre el molde `salas` (2.x, sin familia), por ser su molde de siempre.
5. Coste: el de la spec, ~20 $ en sujetos; ~2 h.
6. Review Focus: 2 entradas que la spec no fija; ver la sección.

**Goal**: «qué sigue» y «dame la siguiente» entran por `sdd-roadmap`, que propone primero las piezas abiertas de una familia a medias y da el prompt.

**Architecture**: una entrada más en «Which entry it is», tras «Give a row's prompt», que reutiliza su forma y el paso 1. Lo que paga el saldo sale en la misma task. Sin CLI nueva.

**Tech Stack**: Markdown de skills; `tests/headless/battery.mjs`; Vitest en `cli/test/kit/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks sin interfaces entre ellas, un error lo caza su batería y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de dos skills y una batería.

## Restricciones globales

### De código

- `skills/sdd-roadmap/SKILL.md` ≤ 3.560 palabras al acabar, contadas como `word-budget.test.ts`; sin subir ningún tope.
- `skills/using-sdd/SKILL.md` ≤ 570 palabras.
- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code; nombres en inglés.

### De proceso

- Sujetos Sonnet, hasta `MAX_PARALLEL=3`; un rojo no se relanza para sacar verde, se lee por qué.
- `KIT_DIR` es una copia sacada con `git archive` del commit que se mide, con `RUNS_DIR=.temp/r`.

## Review Focus

- Familia con todas sus piezas abiertas bloqueadas → no adelanta a Now, y dice a qué esperan · Task 1, ningún molde lo ejercita: lo cubre la lectura del texto en el eje Spec.
- Dos familias a medias → gana la primera fila en orden de roadmap · Task 1, ídem.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una entrada de prosa; sin CLI.
- [x] **YAGNI gate**: nada abstraído.
- [x] **Brownfield gate**: la entrada 1 no cambia de forma.
- [x] **Constitution check**: Art. I (RED hecho, previsión declarada, una pieza entra y otra sale).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: los moldes `tests/batteries/sdd-roadmap/mold-salas-3-family/` y `mold-salas-3-nofamily/`, ya medidos.

**Modificar**:

- `skills/sdd-roadmap/SKILL.md` — `description`, línea 14, entrada nueva, tres racionalizaciones fuera.
- `skills/using-sdd/SKILL.md` — las dos frases en la fila de planificación.
- `tests/batteries/sdd-roadmap/battery.md` y `subject.mjs` — escenarios, cabecera de moldes, procedencia y lo retirado.
- `tests/batteries/using-sdd/battery.md` — `r8`.

**NO se tocan**:

- `skills/sdd-explore/SKILL.md` — salvo que el GREEN lo exija (Scope).
- `skills/sdd-archive/` — ya recuerda la familia al cerrar.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| «qué sigue» sigue entrando por `sdd-explore` | Media | Alto | La rama condicionada del Scope; `wn1` y `r8` lo miden |
| Quitar las racionalizaciones baja `m3` o `id3` | Baja | Medio | Batería entera; lo retirado repite reglas que se quedan |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — La entrada y lo que la paga

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: `wn1`, `wn2` y `wn3`, ya en rojo en `red/out/`; `r8`, nuevo.
**Superficies**: docs, tooling
**Verificación**: `BATTERY=sdd-roadmap STEPS="next next-none" PHASE=green node tests/headless/battery.mjs run` → `wn1 · 3/3`, `wn2 · 3/3`, `wn3 · 2/2`, con WN1, WN2, WN3 y L leídas a mano; `BATTERY=using-sdd STEPS=<paso de r8> PHASE=green-gate node tests/headless/battery.mjs run` → `r8` en umbral; `npx vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts` desde `cli/` → sin `failed`.

**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: los de §1.1.

- [ ] **Step 1: Implementación** — En `SKILL.md`: «qué sigue» y «dame la siguiente» en la `description`; quitar la cola de la línea 14 («with «dame el prompt de la <id>», it gives only that prompt») y las racionalizaciones «The roadmap of my worktree is the real state», «I put the next free number to get ahead» y «The report says it fails and cites the line». Entrada nueva, 2.ª de la lista, renumerando: «**What comes next**», frases «qué sigue» y «dame la siguiente»: con el paso 1 hecho, ofrece primero las filas abiertas con el `parent:` o el `proposal:` de algo empezado (una pieza cerrada o en curso), luego Now en orden, luego Next (2.x: «Próximo»); no ofrece, y dice por qué, una en curso, una con «Tras» o `tras NNNN` sin cerrar o 🔒, una madre «partida en …» ni una de Later; una familia solo bloqueada no adelanta a Now; da el prompt de la primera como la entrada 1, sin esperar; nombrar otra da el de esa; sin nada que ofrecer, lo dice; no escribe nada. En `using-sdd`, las dos frases en la fila de planificación. En `using-sdd/battery.md`, `r8`: «qué sigue», molde `salas`, esperado `sdd-kit:sdd-roadmap`, n = 2, umbral 2/2, sonnet.
- [ ] **Step 2: Build** — no hay build: `node --check tests/batteries/sdd-roadmap/subject.mjs`.
- [ ] **Step 3: Verificación** — los comandos de arriba. Si «qué sigue» sigue entrando por `sdd-explore`, se acota su `description` y se repite.
- [ ] **Step 4: Commit de la task** — `feat(sdd-roadmap): …`, con evidencia `green/`.

### Task 2 — Baterías enteras de control

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: no aplica: control de no regresión.
**Superficies**: tooling, docs
**Verificación**: `BATTERY=sdd-roadmap PHASE=ctl node tests/headless/battery.mjs run` y `BATTERY=using-sdd PHASE=ctl node tests/headless/battery.mjs run` con `SPEC_DIR` propio: cada escenario en su umbral; filas en prosa de `sdd-roadmap` leídas a mano. Una fila roja se lee contra el kit de `develop` antes de atribuirla.

**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: `tests/batteries/sdd-roadmap/battery.md`; `.docs/sdd/specs/20261102-163922-feature-0194-roadmap-whats-next/ctl/`.

- [ ] **Step 1: Implementación** — Lanzar las dos; en `battery.md`, «Ocho moldes» pasa a once con sus nombres, fila de procedencia de la entrada, y bloque «Retirado (feature 0194, para pagar el saldo)» con lo que sale y su control `id3`, `m3`, `m3b`, `m1`, `m4`.
- [ ] **Step 2: Build** — no hay build.
- [ ] **Step 3: Verificación** — las dos baterías y la lectura de filas.
- [ ] **Step 4: Commit de la task** — `test(sdd-roadmap): …`, con evidencia.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 2 h
- Base de la estimación: 2 tasks; la 0276 costó 39 sujetos con un módulo aparte; aquí 96 sujetos, casi todos de control, que esperan más que trabajan.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Propone primero la 0013 y da su prompt → Task 1, `wn1`, fila WN1. ✓
- Dice por qué no 0014 ni 0015 → Task 1, `wn1`, fila WN1. ✓
- No escribe, no reserva, no publica, no commitea, no arranca → Task 1, `state.txt` y WN1-WN3. ✓
- 2.x: propone la 0033, no 0030, 0031 ni 0032, sin `ROADMAP.md` → Task 1, `wn2`, fila WN2. ✓
- Sin familia, la 0020 con prompt y el porqué de la 0019 → Task 1, `wn3`, fila WN3. ✓
- Con Now vacío sigue por Next; Later no se ofrece; sin nada, lo dice → sin observar en molde: se lee en el texto (eje Spec). ⚠
- Las dos frases entran por `sdd-roadmap` → Task 1, puerta de `wn1`-`wn3` y `r8`. ✓
- Filas retiradas de la spec → Task 2, `id3`, `m3`, `m3b`, `m1`, `m4`; las reglas que se quedan, por lectura. ✓
- Review Focus → eje Spec, por lectura. ⚠
