---
id: 20261108-144153-feature-0310-init-explore-release-feedback-rework
feature: 0310
title: Plan de implementación — sdd-init, sdd-explore, sdd-end-release, sdd-feedback y add-to-changelog con las tres reglas de la ADR 0022
spec: ./spec.md
status: draft
created: 2026-11-08
---

# Plan de implementación — sdd-init, sdd-explore, sdd-end-release, sdd-feedback y add-to-changelog con las tres reglas de la ADR 0022

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las tres las hace esta sesión (Native); los sujetos de batería van en `sonnet` (política de la spec). La revisión final va con los ejes de `sdd-verify`: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: Native (abajo).
3. Una task por skill que cambia, con su sujeto GREEN dentro: el sujeto es la prueba de la task, y una task sin él no se podría rechazar por separado. `add-to-changelog` va con `sdd-end-release` porque las mide el mismo sujeto (`r4`).
4. La evidencia de cada tanda va en la carpeta de la spec, `green/` y `refactor/`, con `RUNS_DIR` corto en `.temp/` y el veredicto copiado a la carpeta, como en las features anteriores (`tech-stack.md`, «Baterías por skill»).
5. Riesgo alto: ninguno; el más probable es que `n2` no llegue a presentar `operations.md` con tabla (fila 1 de §1.7).
6. Coste estimado: 1,17 $ de sujetos (spec, «Previsión de coste») y ~2 h de sesión.
7. Review Focus: 2 entradas que la spec no fija; ver la sección.

**Goal**: dejar en un solo sitio cada regla de P6, P7, P8 y S686, sin rojos nuevos en los sujetos ni en `kit:own`, `kit:copies` y `kit:skill-size`.

**Architecture**: seis sustituciones de texto en `skills/` y dos filas en la batería de `sdd-feedback`. No se crea ningún fichero de skill ni se mueve nada a `references/`.

**Tech Stack**: Markdown de skills, `moon run kit:build`, `node tests/headless/battery.mjs`, los checks de `tests/own`, `tests/copies` y `tests/skill-size`, Vitest (`word-budget.test.ts`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks independientes de texto, un error lo caza su sujeto o `kit:own` y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills y una rúbrica de batería; ningún módulo, dependencia ni contrato.

## Restricciones globales

### De código

- La frase que falla se sustituye, sin añadir otra al lado (ADR 0022, regla 3).
- Las sustituciones son literales, las de las decisiones 2 a 5 de la spec, y se aplican a `skills/`, nunca a `dist/`.
- Ninguna frase sale hacia `references/`.
- Art. X: sin comentarios que repitan el código ni que citen documentos.

### De proceso

- Política de modelos: sujetos en `sonnet`, por tandas, hasta `control.maxParallelAgents` (3).
- Antes de cada sujeto, `moon run kit:build`; el sujeto corre con `KIT_DIR` en el `dist/` del working tree.
- Un rojo se compara con el mismo escenario y el kit de `develop` (`KIT_DIR` de `git archive develop:dist`); solo cuenta un rojo nuevo.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- El ticket de `fb1` nombra el dominio en un sitio que no es prosa (nombre de fichero, «Fuente») → la fila P también falla: mira el ticket entero · Task 3, fila P de `fb1`.
- `r4` cierra sin hallazgos de smoke y escribe `smoke: pendiente` → cuenta como la forma del paso 3 si el sujeto no corrió smoke · Task 2, lectura del `CHANGELOG.md` sellado de `r4`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: seis sustituciones y dos filas; no cabe menos.
- [x] **YAGNI gate**: no se abstrae nada.
- [x] **Brownfield gate**: sin refactor fuera de las frases de la spec.
- [x] **Constitution check**: Art. I (tramo de batería o humo por edición), Art. X, ADR 0022.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/specs/20261108-144153-feature-0310-init-explore-release-feedback-rework/green/` y `refactor/` — veredictos y salidas de los sujetos.

**Modificar**:

- `skills/sdd-init/SKILL.md` — paso 4: «the form is the template's» pasa a «its sections and table headers are the template's, literal».
- `skills/sdd-init/references/structure.md` — sale el párrafo «No `templates/` folder…».
- `skills/sdd-end-release/SKILL.md` — paso 3 gana «if none ran».
- `skills/sdd-end-release/references/release-notes.md` — sale la forma de la línea `smoke:`.
- `skills/sdd-feedback/SKILL.md` — sale la regla «**Privacy**».
- `skills/add-to-changelog/SKILL.md` — línea 10 sin «backward/forward-looking».
- `tests/batteries/sdd-feedback/battery.md` — fila P de la rúbrica; privacidad en fila propia de «Procedencia», sin la remisión a `tests/KitFeedback.Tests.ps1`.

**NO se tocan**:

- `skills/sdd-explore/` y `skills/sdd-init/SKILL.md:31` — decisiones 6 y 7 de la spec.
- `skills/sdd-templates/`, `skills/sdd-verify/`, `skills/sdd-roadmap/` — de otras filas.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `n2` no presenta `operations.md` con tabla y no se puede leer la cabecera | media | P8 sin medir en sujeto | se dice en la evidencia; la frase queda leída en `dist/` |
| `fb1` sale rojo en una fila ajena | baja | control de 0,17 $ | control con el kit de `develop` |

### 1.8 Rollout

Directo, con la próxima release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `sdd-init`: P8

**Tras**: —
**Modelo**: esta sesión (Native); sujeto `sonnet`.
**Tests RED**: ninguno (spec, decisión 9).
**Superficies**: docs, tooling
**Verificación**: `moon run kit:build`; `SCENARIOS="n2" N=1` de `tests/batteries/sdd-init/battery.md` con `battery.mjs run` → veredicto `n2` en verde; lectura a mano: el `operations.md` presentado lleva los títulos de sección y las cabeceras de tabla de `operations-template.md`.
**Se prueba en la aplicación**: no, porque refactor: el sujeto es la prueba.

**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: modificar `skills/sdd-init/SKILL.md`, `skills/sdd-init/references/structure.md`

- [ ] **Step 1: Implementación** — en `SKILL.md`, «the form is the template's, the content is» → «its sections and table headers are the template's, literal; the content is». En `structure.md`, quitar el párrafo entero que empieza por «No `templates/` folder: the templates live in the kit's `sdd-templates` skill» y acaba en «drags in other people's notes and decisions.», con su línea en blanco.
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: verde.
- [ ] **Step 3: Verificación** — el sujeto `n2` y la lectura a mano; evidencia en `green/`.
- [ ] **Step 4: Commit de la task**.

### Task 2 — `sdd-end-release` y `add-to-changelog`: P6 y S686

**Tras**: —
**Modelo**: esta sesión (Native); sujeto `sonnet`.
**Tests RED**: ninguno (spec, decisión 9).
**Superficies**: docs, tooling
**Verificación**: `moon run kit:build`; `SCENARIOS="r4" N=1` de `tests/batteries/sdd-retro/battery.md` → veredicto `r4` en verde; lectura a mano: el `CHANGELOG.md` sellado lleva la línea `smoke:` con la forma del paso 3 de `sdd-end-release` y una línea por entrada.
**Se prueba en la aplicación**: no, porque refactor: el sujeto es el humo.

**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: modificar `skills/sdd-end-release/SKILL.md`, `skills/sdd-end-release/references/release-notes.md`, `skills/add-to-changelog/SKILL.md`

- [ ] **Step 1: Implementación** — `sdd-end-release/SKILL.md`: «or `smoke: pendiente`, per [release-notes.md]» → «or `smoke: pendiente` if none ran, per [release-notes.md]». `release-notes.md`: «The line is `smoke: <date> · <N> hallazgos (<what ran>; <M> corregidos en la release)`, or `smoke: pendiente` if none ran: the number is never made up. It reads» → «The number of the line is never made up. The line reads». `add-to-changelog/SKILL.md`: «The changelog is the project's **technical** record (Keep a Changelog 1.1.0), *backward-looking*. The roadmap is *forward-looking*: touching one doesn't replace the other.» → «The changelog is the project's **technical** record (Keep a Changelog 1.1.0): touching it doesn't replace touching the roadmap, nor the reverse.»
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: verde.
- [ ] **Step 3: Verificación** — el sujeto `r4` y la lectura a mano; evidencia en `green/`.
- [ ] **Step 4: Commit de la task**.

### Task 3 — `sdd-feedback`: P7 y la fila P

**Tras**: —
**Modelo**: esta sesión (Native); sujetos `sonnet`.
**Tests RED**: ninguno (spec, decisión 9).
**Superficies**: docs, tooling
**Verificación**: `moon run kit:build`; `SCENARIOS="fb1" N=1` de `tests/batteries/sdd-feedback/battery.md` → veredicto `fb1` en verde, fila P incluida; REFACTOR: `SCENARIOS="fb1" N=2` → las dos en verde.
**Se prueba en la aplicación**: no, porque refactor: los sujetos son la prueba.

**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: modificar `skills/sdd-feedback/SKILL.md`, `tests/batteries/sdd-feedback/battery.md`

- [ ] **Step 1: Implementación** — `SKILL.md`: quitar la línea entera «- **Privacy**: never client, project, product or people names, nor code or business rules. … the finding is never omitted for privacy.». `battery.md`: en la rúbrica, fila P «Privacidad» sobre `fb1`: falla si el ticket nombra `reservas`, `Excel` o `salas` (el dominio del molde, `notas-sesion.md:3`); en «Procedencia de las reglas», la privacidad sale de la fila «Las demás reglas…» a una fila propia, «vive en `kit-feedback-template.md`; fila P de `fb1`», y esa fila pierde la remisión a `tests/KitFeedback.Tests.ps1`.
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: verde.
- [ ] **Step 3: Verificación** — GREEN `fb1` N=1 en `green/`, REFACTOR `fb1` N=2 en `refactor/`.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2h
- Estimación de implementación: 1h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 3 tasks de texto ya medidas en borrador; la espera es de sujetos (5 en total)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] `moon run kit:build kit:copies kit:own kit:skill-size` sin rojos nuevos frente a la rama sin cambios (los de hoy: `skills/sdd-verify/references/` sin anotar, 0297; `sdd-roadmap/SKILL.md` en 21.680 bytes, 0308); `node tests/own/check.ts` sin líneas de las cinco skills salvo las cuatro repetidas con otras filas.
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Párrafo «No `templates/` folder…» sale de `structure.md` → Task 1, `n2` y `kit:own` sin línea nueva. ✓
- «sections and table headers… literal» vive en `sdd-init/SKILL.md` → Task 1, lectura a mano de las cabeceras del `operations.md` de `n2`. ✓
- Forma de la línea `smoke:` solo en el paso 3 → Task 2, lectura del `CHANGELOG.md` sellado de `r4`. ✓
- Privacidad vive en `kit-feedback-template.md` → Task 3, fila P de `fb1` (GREEN y REFACTOR). ✓
- «backward/forward-looking» sale de `add-to-changelog`; la regla se queda → Task 2, `r4` (una línea por entrada en el changelog). ✓
- `capabilities/onboarding.md:52`, `release-flow.md:94-95`, `kit-feedback.md:40, 77` sin cambio → N/A (confirmado en spec). ✓
- `sdd-explore` y P9 sin cambios → N/A (decisiones 6 y 7). ✓
- `kit:own` sin líneas de las cinco salvo las de otras filas; `kit:copies` y `kit:skill-size` sin rojos nuevos → §3. ✓
- Topes de palabras → §3, `cli:test` (`word-budget.test.ts`). ✓
- Review Focus: dominio fuera de la prosa → Task 3, fila P; `smoke: pendiente` → Task 2, lectura de `r4`. ✓
