---
id: 20261110-141415-feature-0327-review-conduct-plain-names
feature: 0327
title: Plan de implementación — La revisión de la spec ve una prueba que pasa sin la conducta, y el 🦆 no nombra ids sin explicarlos
spec: ./spec.md
status: done
created: 2026-11-10
---

# Plan de implementación — La revisión de la spec ve una prueba que pasa sin la conducta, y el 🦆 no nombra ids sin explicarlos

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, el hilo implementa las dos tasks; sujetos en sonnet; la revisión final con los ejes de `sdd-verify` (Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: Native, porque son dos frases en dos skills sin interfaz entre ellas y el plan cabe en un contexto.
3. **Los dos RED en una campaña**: `SPEC_DIR` de la spec, `PHASE=red`, `COST_CAP=3.85` (la Suma de la previsión, techo de toda la campaña): si lo gastado lo alcanza, `battery.mjs` no lanza más y se para a preguntar (spec, nota de la previsión).
4. **Coste**: ~1 h de reloj; sujetos 3,85 $ (spec); sin otros despachos hasta la revisión final.

**Goal**: que el revisor de la spec señale una fila de rúbrica que pasa sin la conducta, y que el 🦆 de una parada no use un id de la batería sin explicarlo.

**Architecture**: dos sustituciones de texto en skills (`review-spec.md`, `sdd-rubber-duck/SKILL.md`), cada una medida con un escenario nuevo de su batería.

**Tech Stack**: Node, pnpm, moon; baterías con `tests/headless/battery.mjs`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks independientes de una frase cada una. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para el eje Spec de la revisión final.

**Eje Arquitectura**: no — dos frases de skills y dos escenarios de batería.

## Restricciones globales

### De código

- Textos literales de la spec, decisiones 2, 3 y 5; ningún otro cambio en las dos skills.
- Saldo de palabras de `sdd-propose` y `sdd-rubber-duck` juntas ≤ 0 (−8 previsto); `word-budget.test.ts` en verde.
- Un arreglo se escribe solo si su RED sale rojo (spec, decisión 6).

### De proceso

- Native; el hilo implementa. Commits: tipo/scope en inglés, título y cuerpo en castellano, con la línea `Co-Authored-By` de la sesión.
- RED con `KIT_DIR` sacado con `git archive origin/develop:dist` en el scratchpad; GREEN con el `dist/` de la rama.

## Review Focus

- Spec cuya fila de rúbrica es `text: /pendiente/` para un THEN que nombra la 0011 → el revisor lo devuelve como hallazgo · Task 1, fila `RC1` de `rc1`
- Parada por dinero con ids de la batería en el material → el 🦆 no los nombra o los explica antes · Task 2, fila `R12` de `s5`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos frases sustituidas.
- [x] **YAGNI gate**: sin código nuevo.
- [x] **Brownfield gate**: el revisor y el 🦆 conservan sus demás puntos.
- [x] **Constitution check**: Art. I (RED antes de cada frase).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/sdd-propose/fixtures/spec-0031.md` — la spec de la 0031, limpia salvo la fila `text: /pendiente/`.
- `tests/sdd-propose-0327-red.md` y `-green.md`; `tests/sdd-rubber-duck-0327-red.md` y `-green.md` — evidencia.

**Modificar**:

- `tests/batteries/sdd-propose/battery.md` y `subject.mjs` — escenario `rc1` y fila `RC1`.
- `tests/batteries/sdd-rubber-duck/battery.md` y `subject.mjs` — escenario `s5` y fila `R12`.
- `skills/sdd-propose/references/review-spec.md` — punto (2) y su saldo (Task 1, si el RED lo exhibe).
- `skills/sdd-rubber-duck/SKILL.md` — «Words» (Task 2, si el RED lo exhibe).
- `cli/test/kit/word-budget.test.ts` — los totales nuevos, si cambian.
- `dist/` — `moon run kit:build`.

**NO se tocan**:

- `skills/sdd-implement-native/SKILL.md` — sin parada tras dos GREEN rojos (decisión 7).
- `.docs/sdd/capabilities/` — las fusiona `sdd-archive`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un RED sale limpio | media | el arreglo no entra | n = 3 y, limpio, se quita del Scope (decisión 6) |
| `rc1` cuesta como `t1` (1,10 $) | alta | la campaña pasa de 3,85 $ | `COST_CAP=3.85`: se para y se pregunta |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; los RED de las dos se lanzan juntos.

### Task 1 — El revisor de la spec señala una fila que pasa sin la conducta

**Tras**: —
**Modelo**: Native, el hilo; sujetos de `rc1` en sonnet, `N=2`.
**Tests RED**: `BATTERY=sdd-propose SCENARIOS="rc1" N=2 PHASE=red node tests/headless/battery.mjs run` con `KIT_DIR` del kit de `develop`.

**Superficies**: docs (skill), tooling (batería).
**Verificación**: la misma tanda con `PHASE=green` y el `dist/` de la rama → `rc1 · 2/2`, fila `RC1` en verde; `pnpm --dir cli exec vitest run test/kit/word-budget.test.ts` en verde.

**Interfaces**:
- Consume: nada.
- Produce: nada.

**Ficheros**: `skills/sdd-propose/references/review-spec.md`, la batería de `sdd-propose`, su fixture y su `subject.mjs`, `dist/`.

- [ ] **Step 1: Implementación** — RED; si sale rojo, las frases de las decisiones 2 y 3; si sale limpio, `N=1` más y, limpio, sin frase.
- [ ] **Step 2: Build** — `moon run kit:build kit:skill-size kit:own`.
- [ ] **Step 3: Verificación** — GREEN y `word-budget.test.ts`; evidencia en `tests/sdd-propose-0327-red.md` y `-green.md`.
- [ ] **Step 4: Commit de la task** — `feat(sdd-propose): el revisor de la spec señala una prueba que pasa sin la conducta`.

### Task 2 — El 🦆 de una parada no nombra ids sin explicarlos

**Tras**: —
**Modelo**: Native, el hilo; sujetos de `s5` en sonnet, `N=2`.
**Tests RED**: `BATTERY=sdd-rubber-duck SCENARIOS="s5" N=2 PHASE=red node tests/headless/battery.mjs run` con `KIT_DIR` del kit de `develop`.

**Superficies**: docs (skill), tooling (batería).
**Verificación**: la misma tanda con `PHASE=green` → `s5 · 2/2`, fila `R12` en verde; `word-budget.test.ts` en verde con `sdd-rubber-duck` ≤ 600.

**Interfaces**:
- Consume: nada.
- Produce: nada.

**Ficheros**: `skills/sdd-rubber-duck/SKILL.md`, la batería de `sdd-rubber-duck` y su `subject.mjs`, `dist/`.

- [ ] **Step 1: Implementación** — RED; si sale rojo, la frase de la decisión 5; si sale limpio, `N=1` más y, limpio, sin frase.
- [ ] **Step 2: Build** — `moon run kit:build kit:skill-size kit:own`.
- [ ] **Step 3: Verificación** — GREEN y `word-budget.test.ts`; evidencia en `tests/sdd-rubber-duck-0327-red.md` y `-green.md`.
- [ ] **Step 4: Commit de la task** — `feat(sdd-rubber-duck): el 🦆 no nombra un id sin decir qué es`.

---

## Estimación y esfuerzo

- Tipo: skill
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 1h
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,4h
- Base de la estimación: dos frases con RED/GREEN; referencia: la Task 3 de la 0326 con `co2p` (una tanda RED y una GREEN).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `feature-flow` ADDED, el revisor señala la fila → Task 1, fila `RC1`. ✓
- `explaining` ADDED, el 🦆 sin ids sin explicar → Task 2, fila `R12`. ✓
- Tabla «Lo que se retira», filas 1 y 2 → Task 1; fila 3 → Task 2. ✓
- Topes de palabras → Tasks 1 y 2, `word-budget.test.ts`. ✓
- Decisión 7, sin parada → restricción «NO se tocan». ✓
