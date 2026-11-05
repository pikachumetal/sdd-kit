---
id: 20261105-161928-feature-0307-verify-and-tdd
feature: 0307
title: Plan de implementación — sdd-verify y sdd-tdd con las tres reglas
spec: ./spec.md
status: approved
created: 2026-11-05
---

# Plan de implementación — sdd-verify y sdd-tdd con las tres reglas

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las tres tasks las hace la sesión (Native); los sujetos del humo, en sonnet, los de cada batería; la revisión final con los ejes de `sdd-verify` (Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: Native — tres tasks de texto, sin interfaz entre ellas salvo `dist/`, que regenera cada una; un error lo cazan `kit:copies`, `kit:own` y `cli:test` en su task; el plan cabe en un contexto.
3. Orden: `sdd-tdd` primero (lo más pequeño y lo que da las dos líneas «→ 0307»), después `sdd-verify` y por último la traducción, que no toca lo que mueve la Task 2.
4. Las S de cada `sustituye` las fija `kit:copies`: se escribe el bloque, se corre y se ajusta la S a lo que el bloque quita (`mismatch` da el texto exacto). Si la herramienta pide una S que no es la frase del original que el bloque sustituye, se reescribe el bloque, no la S.
5. Coste: ~2,5 h de implementación; humo ~2,3 $ (hasta ~4,6 $ con REFACTOR), dentro del umbral de ~6 $ de la spec.
6. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: `sdd-verify` por debajo de 20.000 bytes, sin excepciones pegadas en `sdd-verify` ni `sdd-tdd`, y `encargo-revision.md` en inglés fuera de su bloque literal.

**Architecture**: solo texto de skills, su registro (`upstream.json`) y la procedencia de una batería. Cada frase que falla se reescribe en su sitio (ADR 0022); lo que se mueve se mueve sin reescribir, salvo K31.

**Tech Stack**: Markdown de `skills/`, `moon run kit:build` (dist), las comprobaciones `kit:copies`, `kit:own`, `kit:skill-size` y Vitest en `cli/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks de texto sin interfaz entre ellas, un error lo caza la comprobación de su propia task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de dos skills y una entrada de `upstream.json`; ni módulo, ni dependencia, ni contrato, ni datos.

## Restricciones globales

### De código

- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario.
- Sin comentarios que citen documentos. Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- Las skills, en inglés (Art. III); una restricción con salvedad se escribe «no X other than Y», nunca «only … except …» en la misma frase.
- La frase que falla se sustituye en su sitio: ninguna frase nueva ni excepción («except», «unless», «instead of») al lado (ADR 0022, regla 3).
- `dist/` no se edita a mano: sale de `moon run kit:build`.

### De proceso

- Política de modelos: la de la spec (✋, «Política de modelos»); `fable` y `opus xhigh`, prohibidos.
- Método: Native.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task; trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- El puntero de `## Closing the review` y el agente que vuelve de los ejes → abre `references/closing-the-review.md` antes de tocar un hallazgo, y hace una sola pasada de fix y una re-revisión en opus · Task 2, humo `c1` (rúbrica C1).
- Un Minor con `review.minors: fix` que ningún test reproduce → entra en la pasada y el ledger lo apunta `Final: fixed <finding> — suite <N>/<N>`, no `minor (deferred)` · Task 2, humo `c1f` (rúbrica C1f).
- Un implementador que carga `sdd-tdd` con un RED recibido → lo ejecuta y lo ve fallar antes del primer `Edit` sobre `src/` · Task 1, humo `t1b` (rúbrica R).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: se mueve una sección entera y se reescriben cuatro frases; nada más.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Brownfield gate**: anclas y citas por nombre siguen valiendo (spec, decisión 2); `sdd-implement` no se toca.
- [x] **Constitution check**: Art. I (humo), Art. III (inglés), Art. IX (sustituir, no añadir), Art. XI (tickets y specs con fecha no se reescriben).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-verify/references/closing-the-review.md` — el cierre de la revisión final, propio y sin marcas.

**Modificar**:

- `skills/sdd-tdd/SKILL.md` — cuatro sustituciones (spec, decisiones 6 y 7).
- `skills/sdd-verify/SKILL.md` — el cuerpo de `## Closing the review` sale y queda el puntero; «Running a gate», punto 3.
- `skills/sdd-verify/references/encargo-revision.md` — traducido fuera del bloque.
- `upstream.json` — `skills/sdd-verify/references/closing-the-review.md` en `own`.
- `tests/batteries/sdd-verify/battery.md` — procedencia `:111`, `:119`, `:120`.
- `dist/` — regenerado.

**NO se tocan**:

- `skills/sdd-implement/` — lo reescribe la 0296; las citas por nombre siguen valiendo.
- Los `*-reviewer-prompt.md` y el bloque literal del encargo — spec, decisión 8.
- `.docs/sdd/capabilities/` — sin delta.

### 1.6 Dependencias

- Ninguna fila pendiente: la 0302, la 0312, la 0304 y la 0315 están cerradas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Tras mover el cierre, el agente no abre la referencia | media | alto: dos pasadas de fix o sin re-revisión | puntero como primera frase del paso; humo `c1` y `c1f` |
| `kit:copies` no acepta una sustitución con la frase entera | media | bajo | decisión 4: se reescribe el bloque hasta que la S sea la frase del original |
| Conflicto al fusionar con la 0296, que toca `upstream.json` | baja | bajo | una línea en la lista `own`; `sdd merge` lo resuelve |

### 1.8 Rollout

Directo: `dist/` viaja en el próximo corte de la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `sdd-tdd`: las cuatro frases sustituidas

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: el rojo existente de `moon run kit:copies`: `skills/sdd-tdd/SKILL.md:122: añadido del kit sin sustituye en un párrafo con una absoluta del original («never») → 0307` y `:319: … («every») → 0307`.
**Superficies**: docs (skill)
**Verificación**: `moon run kit:build`, después `moon run kit:copies` sin ninguna línea «→ 0307» ni de `skills/sdd-tdd/`; `moon run kit:own` sin línea de `dist/skills/sdd-tdd/` salvo la del preámbulo; desde `cli/`, `npx vitest run test/kit/copies.test.ts test/kit/dist.test.ts test/kit/skills.test.ts test/kit/word-budget.test.ts` → `Test Files  4 passed (4)`. Humo: `BATTERY=sdd-implement SCENARIOS=t1b node tests/headless/battery.mjs run`, con la rúbrica R de `tests/batteries/sdd-implement/battery.md`.

**Interfaces**:
- Consume: nada.
- Produce: nada que usen las demás.

**Ficheros**: modificar `skills/sdd-tdd/SKILL.md`, `dist/skills/sdd-tdd/SKILL.md` (build).

- [ ] **Step 1: Implementación** — con marcas `<!-- kit: 0307 · sustituye: «S» -->` y su `<!-- kit: fin -->` donde haga falta, quitando las `arregla: 0307`:
  - Verify RED: el par «**MANDATORY. Never skip.**» + bloque «Also for a RED you received…» → «**MANDATORY, a RED you received included: never skip it.** Run it before touching the code it covers, and keep the command and the failing output for the report's «TDD Evidence».»
  - «**Test passes?** You're testing existing behavior. Fix test.» + bloque → «**Test passes?** You're testing existing behavior. Fix a test you wrote; report a test you received (`DONE_WITH_CONCERNS` with the green output), and don't write code to «make it pass».»
  - «**Test errors?** Fix error, re-run until it fails correctly.» + bloque «A compile or import error…» → «**Test errors?** Any other error: fix it, re-run until it fails correctly.» El bullet de «Confirm:» (`sustituye: «errors)»`) no cambia.
  - Checklist: «- [ ] All tests pass» + «(the task's «Verificación»)» → «- [ ] The task's «Verificación» passes».
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: verde.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; con un rojo de `kit:copies`, se ajusta la marca (decisión 4) y se repite. Después, el humo `t1b`.
- [ ] **Step 4: Commit de la task** — `refactor(sdd-tdd): sustituir las frases de superpowers que el kit ampliaba debajo`.

### Task 2 — `sdd-verify`: el cierre a su referencia, K31 y «Running a gate»

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: el rojo existente de `moon run kit:skill-size` (`FALLA: dist/skills/sdd-verify/SKILL.md ocupa 22881 bytes`) y de `moon run kit:own` (`dist/skills/sdd-verify/SKILL.md:61: absoluta con excepción en la misma frase («every» … «instead of»)`).
**Superficies**: docs (skill), tooling (`upstream.json`), tests (procedencia de batería)
**Verificación**: `moon run kit:build`; `moon run kit:skill-size` sin `FALLA` de `sdd-verify`; `moon run kit:copies` sin rojo de `skills/sdd-verify/SKILL.md`; `moon run kit:own` sin la línea `:61` ni otra de `dist/skills/sdd-verify/SKILL.md` o `references/closing-the-review.md` salvo la del preámbulo; desde `cli/`, `npx vitest run test/kit/skills.test.ts test/kit/dist.test.ts test/kit/notices.test.ts test/kit/word-budget.test.ts test/kit/skill-size.test.ts` → `Test Files  5 passed (5)`. Humo: `BATTERY=sdd-verify SCENARIOS=c1,c1f,t2 node tests/headless/battery.mjs run`, con las rúbricas C1, C1f, T2a y T2b.

**Interfaces**:
- Consume: nada.
- Produce: `skills/sdd-verify/references/closing-the-review.md`, que la Task 3 no toca.

**Ficheros**: crear `skills/sdd-verify/references/closing-the-review.md`; modificar `skills/sdd-verify/SKILL.md`, `upstream.json`, `tests/batteries/sdd-verify/battery.md`, `dist/` (build).

- [ ] **Step 1: Implementación**:
  - `closing-the-review.md`: `# Closing the review` y el cuerpo de la sección tal cual, sin marcas; enlaces relativos reescritos: `[encargo-revision.md](encargo-revision.md)`, `[re-review-prompt.md](../../sdd-implement/references/re-review-prompt.md)`, `[Closing the review](#…)` internas como anclas del propio fichero y las que apuntan a `SKILL.md`, `../SKILL.md#…`. K31: «A fix without a test that failed first is not verified, except a Minor no test reproduces; a suite…» → «A fix is verified by the test that reproduces its finding and failed first, or, when no test can reproduce it (a Minor: a name, a wording), by the whole suite, with the ledger line `Final: fixed <finding> — suite <N>/<N>`. A suite…».
  - `SKILL.md`: bajo `## Closing the review`, un bloque `<!-- kit: 0307 -->` con «When the axes return, the first thing in this step is to read [references/closing-the-review.md](references/closing-the-review.md) and follow it, before you act on any finding.»; fuera, todos los bloques `kit: 0312` del cuerpo. Punto 3 de «Running a gate»: «with `--base <sha>` instead of `--base <merge.into>`» → «with `--base <sha>`, not `--base <merge.into>`».
  - `upstream.json`: `"skills/sdd-verify/references/closing-the-review.md"` en `own`, junto a `encargo-revision.md`.
  - `battery.md:111, 119, 120`: «`## Closing the review`» → «`references/closing-the-review.md`» (la de `:120`, «la viñeta del Minor de `references/closing-the-review.md`»).
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: verde.
- [ ] **Step 3: Verificación** — los comandos de «Verificación» y el humo `c1`, `c1f`, `t2` en paralelo.
- [ ] **Step 4: Commit de la task** — `refactor(sdd-verify): mover el cierre de la revisión a su referencia y quitar la excepción de K31`.

### Task 3 — `encargo-revision.md` en inglés

**Tras**: Task 2
**Modelo**: la sesión (Native)
**Tests RED**: el rojo existente de `moon run kit:own`: 16 líneas `dist/skills/sdd-verify/references/encargo-revision.md:<n>: prosa en castellano`.
**Superficies**: docs (skill)
**Verificación**: `moon run kit:build`; `moon run kit:own`, filtrada por `sdd-verify|sdd-tdd`, con una sola línea (la del preámbulo); desde `cli/`, `npx vitest run test/kit/skills.test.ts test/kit/dist.test.ts test/kit/own.test.ts test/kit/word-budget.test.ts` → `Test Files  4 passed (4)`.

**Interfaces**:
- Consume: nada.
- Produce: nada.

**Ficheros**: modificar `skills/sdd-verify/references/encargo-revision.md`, `dist/` (build).

- [ ] **Step 1: Implementación** — se traduce frase a frase toda la prosa de fuera de los bloques ```` ```markdown ```` y ```` ```bash ````, que no cambian. Títulos: `# Review brief — mandatory header`, `## Final reviewer («Revisor final»)`, `## Implementer brief`. Se quedan entre «…» los nombres «De código», «De proceso», «Restricciones de código», «Cómo revisar», «Final review» y la frase del worktree, que se cita literal en castellano porque es la del bloque que recibe el eje. Una salvedad, «no X other than Y».
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: verde.
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task** — `docs(sdd-verify): traducir encargo-revision.md al inglés fuera del bloque del encargo`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,2 h
- Estimación de implementación: 1,5 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 3 tasks de texto, la segunda con humo de 3 sujetos; referencia, la 0316 (traducción de 13 migraciones con humo de 2 sujetos)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec: `kit:skill-size`, `kit:copies` y `kit:own` como en «Dónde se prueba»
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `kit:skill-size` sin FALLA en `sdd-verify` → Task 2, `moon run kit:skill-size`. ✓
- `kit:copies` sin «→ 0307» → Task 1, `moon run kit:copies`. ✓
- `kit:own` con una sola línea de `sdd-verify|sdd-tdd` → Tasks 1, 2 y 3, `moon run kit:own` filtrada. ✓
- `cli:test` en verde → cada task, sus Vitest; el gate en §3. ✓
- El agente lee el cierre desde la referencia (Intent, «fracasa si…») → Task 2, humo `c1`, `c1f`. ✓
- El implementador ve fallar el RED recibido → Task 1, humo `t1b`. ✓
- K34, K35 y la checklist → sin observar: riesgo aceptado en la spec, decisión 7. ⚠
- Tabla «Lo que se retira o cambia de forma»: el cuerpo movido → Task 2 (anclas y citas: `skills.test.ts` comprueba enlaces); K31 y «instead of» → Task 2; los añadidos de `sdd-tdd` → Task 1; los títulos de `encargo-revision.md` → Task 3; el bloque del encargo → N/A (spec, decisión 8). ✓
- Review Focus → Tasks 1 y 2, humo. ✓
- Spec: cada escenario de la spec tiene su task (delegate, sin gate de plan): comprobado. ✓
