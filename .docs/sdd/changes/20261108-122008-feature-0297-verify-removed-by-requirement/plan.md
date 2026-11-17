---
id: 20261108-122008-feature-0297-verify-removed-by-requirement
feature: 0297
title: Plan de implementación — El eje Spec busca un REMOVED por lo que dice su requisito vigente
spec: ./spec.md
status: approved
created: 2026-11-08
---

# Plan de implementación — El eje Spec busca un REMOVED por lo que dice su requisito vigente

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las tasks (dos al aprobar el plan; la Task 3 la añadió la enmienda del 2026-11-08) las hace la sesión (Native); los sujetos de la batería, en `opus`, el modelo de las filas del eje Spec; la revisión final con los ejes de `sdd-verify` (Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: Native — tres tasks encadenadas (la 2 necesita el RED de la 1 para decidir qué frases entran), un error lo cazan las comprobaciones y la batería de su task, y el plan cabe en un contexto.
3. El RED corre con el kit de `HEAD` antes de tocar la viñeta: `KIT_DIR` sale de `git archive HEAD:dist` en `.temp/k0297r` (ruta corta, `tech-stack.md`, «`RUNS_DIR` en una ruta corta»), y el GREEN, de `dist/` reconstruido y sin commitear, copiado a `.temp/k0297g`.
4. Los tres moldes comparten código y cambian solo la capacidad o su historia (decisión 8 de la spec); `compose-axis.mjs` lee `fixtures/axis-rm.json` para los tres, igual que `f3n` lee el de `f3`.
5. Tandas de hasta 3 sujetos a la vez (`MAX_PARALLEL=3`, `control.maxParallelAgents`), con `COST_CAP` de la previsión de la spec.
6. Coste: ~2 h de implementación y campaña; sujetos 15,17 $ como techo (spec, «Previsión de coste»).
7. Review Focus: 2 entradas que la spec no fija; ver la sección.

**Goal**: medir si el eje Spec busca un `REMOVED` por el cuerpo de su requisito vigente, lo recupera del historial si falta y no lo da por bueno sin vigente utilizable, y escribir solo la regla cuyo RED falle; OpenSpec e impeccable al día en `upstream.json`. (Tras las enmiendas del 2026-11-08: las tres salieron limpias y la viñeta no cambia.)

**Architecture**: una viñeta de un encargo de eje, su registro de fuente (`upstream.json` y los avisos que genera) y tres escenarios nuevos de la batería de `sdd-verify`. La frase que falla se sustituye en su sitio (ADR 0022).

**Tech Stack**: Markdown de `skills/`, `moon run kit:build`, `kit:notices`, `kit:copies`, `kit:upstream`, `kit:own`, el lanzador de baterías de `tests/headless/` y Vitest en `cli/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks encadenadas por el veredicto del RED, un error lo caza la comprobación o la batería de su propia task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — cambia una viñeta, una entrada de `upstream.json` y escenarios de batería; ni módulo, ni dependencia, ni contrato, ni datos.

## Restricciones globales

### De código

- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario.
- Sin comentarios que citen documentos. Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- Las skills, en inglés (Art. III).
- La frase que falla se sustituye en su sitio: ninguna frase nueva al lado de la viñeta del `REMOVED` (ADR 0022, regla 3).
- `dist/`, `THIRD_PARTY_NOTICES.md` y los `NOTICE` no se editan a mano: salen de `moon run kit:build` y `moon run kit:notices`.

### De proceso

- Política de modelos: la de la spec (✋, «Política de modelos»); `fable` y `opus xhigh`, prohibidos.
- Método: Native.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task; trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- ~~Un `REMOVED` cuyo vigente sí nombra lo retirado (el correo de `f3`) → sigue saliendo Critical `contradicts` con la viñeta nueva · Task 2, control `f3` (rúbrica S).~~ Sin objeto tras las enmiendas del 2026-11-08: la viñeta no cambia.
- La entrada de `upstream.json` que deja de existir → `kit:notices` regenerado sin más cambios que las filas de OpenSpec e impeccable, y `notices.test.ts` en verde · Task 2, `git diff --stat` tras `kit:notices` y `pnpm exec vitest run test/kit/notices.test.ts`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una viñeta sustituida y una entrada movida a `from`; los moldes reutilizan `reservas` y el montaje de `f3`.
- [x] **YAGNI gate**: nada se abstrae; `axis-rm.json` lo comparten tres escenarios reales.
- [x] **Brownfield gate**: `f3` y `f3n` siguen igual; la entrada de superpowers de `spec-reviewer-prompt.md` no cambia de versión.
- [x] **Constitution check**: Art. I (RED antes, previsión en la spec), Art. IX (la frase de la fuente sustituye a la del kit), Art. X (código de `subject.mjs`).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/sdd-verify/fixtures/spec-0025.md` — la spec de juguete «Quitar el aviso por correo al anular», con `#### REMOVED — Avisar por correo` en `bookings` y `- motivo: el responsable avisa en persona`.
- `tests/batteries/sdd-verify/fixtures/plan-0025.md` — su plan, con un `## Review Focus` de una línea.
- `tests/batteries/sdd-verify/fixtures/app-rm-base.js` y `app-rm.js` — la app antes y después: la base tiene `formatMail()`, `outbox`, `voidBooking()` que hace `outbox.push(...)` y el comando `salida`; la rama quita `formatMail()` y deja el `outbox.push`.
- `tests/batteries/sdd-verify/fixtures/capabilities-rm/bookings-rm1.md` (vigente con escenario y «AND `salida` lista «anulada Norte lun» para el responsable de sala, y la oficina se lo envía por correo») y `bookings-rm2.md` (vigente «- Se avisa por correo.», sin escenarios).
- `tests/batteries/sdd-verify/fixtures/axis-rm.json` — los valores del encargo (rutas de la spec y el plan de la 0025, «De código», Review Focus).
- `tests/sdd-verify-0297-removed.md` — la evidencia RED/GREEN.

**Modificar**:

- `tests/batteries/sdd-verify/subject.mjs` — montaje de `rm1`, `rm2`, `rm2b` y `rm3`, y `--scenario=rm` para los cuatro.
- `tests/batteries/sdd-verify/battery.md` — filas `rm1`-`rm3` y `rm2b`, montaje, rúbrica `RM1`-`RM3` y `RM2b`, y procedencia.
- ~~`skills/sdd-verify/references/spec-reviewer-prompt.md` — la viñeta del `REMOVED` (Task 2).~~ No se toca: RED limpio (enmiendas del 2026-11-08).
- `upstream.json` — OpenSpec a `from`, impeccable a `skill-v4.8.1` (Task 2).
- `THIRD_PARTY_NOTICES.md`, `skills/sdd-verify/NOTICE`, `dist/` — regenerados (Task 2).

**NO se tocan**:

- `fixtures/capabilities/bookings.md`, `app-f3*.js`, `spec-0021.md` — los de `f3`, que sirve de control.
- `.docs/sdd/capabilities/verification.md` — el delta lo fusiona `sdd-archive`.

### 1.6 Dependencias

El lanzador de la 0320 (`battery.mjs plan`, `N`, `run --resume`).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| RED limpio en `rm1`: el revisor de hoy ya abre `bookings.md` por el índice de capacidades | media | la fila queda sin fallo | parar como desvío (decisión 4 de la spec) |
| El molde de `rm3` no deja el vigente en el historial que ve el sujeto | baja | `rm3` mide otra cosa | antes de lanzar, `git log -p -- .docs/sdd/capabilities/bookings.md` en el molde en seco (`DRY_RUN=1`) |

### 1.8 Rollout

Directo: entra en la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — RED de `rm1`, `rm2` y `rm3` con el kit de `HEAD`

**Tras**: —
**Modelo**: la sesión (Native); sujetos `opus`, el de la fila.
**Tests RED**: los escenarios `rm1`, `rm2` y `rm3` de `tests/batteries/sdd-verify/battery.md`, lanzados con el kit de `HEAD`.
**Superficies**: tooling (batería), docs (evidencia).
**Verificación**: `DRY_RUN=1 BATTERY=sdd-verify SCENARIOS="rm1 rm2 rm3" … node tests/headless/battery.mjs run` monta los tres moldes sin `claude -p`; en el de `rm3`, `git log -p -- .docs/sdd/capabilities/bookings.md` muestra «Avisar por correo» con su escenario y `HEAD` no lo tiene. Después, `BATTERY=sdd-verify SCENARIOS="rm1 rm2 rm3" SPEC_DIR=<carpeta de la spec> PHASE=red KIT_DIR=.temp/k0297r RUNS_DIR=.temp/r0297 MAX_PARALLEL=3 COST_CAP=5 node tests/headless/battery.mjs run`, y la rúbrica `RM1`-`RM3` leída sujeto a sujeto. Desde `cli/`, `npx vitest run test/kit/headless/molds.test.ts` → `Test Files  1 passed (1)` si `molds.test.ts` construye los moldes nuevos (corre en `kit:test-headless`).

**Interfaces**:
- Consume: el montaje de `f3` en `subject.mjs` (`reviewBase`, `reviewPackage`, `axisBrief`).
- Produce: la tabla del RED en `tests/sdd-verify-0297-removed.md`, con qué reglas entran (0 de 2 fallan = limpio).

**Ficheros**: crear los fixtures de §1.1 y `tests/sdd-verify-0297-removed.md`; modificar `subject.mjs` y `battery.md`.

- [ ] **Step 1: Molde** — en `subject.mjs`, `reviewRemoved()` para `rm1`-`rm3`: la base con `fixtures/app-rm-base.js` y `capabilities/bookings.md` de `rm1` (en `rm2`, el de `rm2`); en `rm3`, un commit de `develop` que quita «Avisar por correo» de `bookings.md` después de la base; la rama `feature/0025-...` con `spec-0025.md`, `plan-0025.md` y `app-rm.js`; el encargo con `reviewPackage(base, true)`, y `--scenario=rm` para los tres. `Agent` deshabilitado y 25 turnos, como `f3`.
- [ ] **Step 2: Batería** — filas `rm1`, `rm2` y `rm3` (paso `axes`, molde `reservas`, esperado `ninguna`, n 2, umbral 2/2, `opus`, procedencia «feature 0297: OpenSpec v1.16.1, #2083 y #2114»), su montaje, las filas `RM1`, `RM2` y `RM3` de la rúbrica (texto de la decisión 8 de la spec; `RM3` con `` `tools: /git[^\n]*log[^\n]*capabilities\/bookings\.md/` presente ``), y `rm1`-`rm3` fuera de `L Idioma`.
- [ ] **Step 3: Seco** — `DRY_RUN=1` y la comprobación del historial de `rm3`.
- [ ] **Step 4: RED** — `git archive HEAD:dist` a `.temp/k0297r`, la tanda de 6 sujetos y la rúbrica leída; la tabla del RED y qué reglas entran en `tests/sdd-verify-0297-removed.md`. Con `rm1` limpio, parar como desvío (decisión 4 de la spec).
- [ ] **Step 5: Commit de la task** — `test(sdd-verify): RED de un REMOVED buscado por su requisito vigente`, con la batería, los fixtures, la evidencia y las salidas en `red/` de la carpeta de la spec.

### Task 2 — OpenSpec e impeccable al día en `upstream.json` (enmienda del 2026-11-08)

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: `node tests/copies/check.ts` da hoy `skills/sdd-verify/references/: sin anotar → 0297`, y `moon run kit:upstream` da las líneas de OpenSpec y de impeccable.
**Superficies**: tooling (`upstream.json`), docs.
**Verificación**: `moon run kit:notices`, y `git diff --stat` solo con `THIRD_PARTY_NOTICES.md`, `dist/THIRD_PARTY_NOTICES.md` y los dos `NOTICE` de `sdd-verify` además de lo editado; `moon run kit:build`; `node tests/copies/check.ts` → `Copias al día: 31 ficheros.`; `moon run kit:upstream` sin línea de OpenSpec ni de impeccable (quedan las de superpowers `skills/sdd-grilling/SKILL.md` y `cli/src/tasks/`, y mattpocock `skills/sdd-grilling/SKILL.md`); desde `cli/`, `npx vitest run test/kit/notices.test.ts test/kit/dist.test.ts test/kit/copies.test.ts` → `Test Files  3 passed (3)`.

**Interfaces**:
- Consume: nada.
- Produce: la copia de `spec-reviewer-prompt.md` con OpenSpec en `from`, que la Task 3 anota si entra la regla 3.

**Ficheros**: modificar `upstream.json`, y con él la spec, el plan y `tasks.md` de la enmienda; regenerar `THIRD_PARTY_NOTICES.md`, `skills/sdd-verify/NOTICE`, `dist/`.

- [ ] **Step 1: Implementación** — en `upstream.json`, la entrada de `spec-reviewer-prompt.md` con `"note": "Las comprobaciones del delta de `openspec-verify-change`, adaptadas en bloques del kit: no son literales y no llevan `de:`."` y `"from": [{ "source": "OpenSpec", "version": "v1.16.1", "path": "src/core/templates/workflows/verify-change.ts" }]`; fuera la entrada `pending: "0297"`; impeccable a `"version": "skill-v4.8.1"`.
- [ ] **Step 2: Build** — `moon run kit:notices` y `moon run kit:build`.
- [ ] **Step 3: Verificación** — las comprobaciones de «Verificación».
- [ ] **Step 4: Commit de la task** — `chore(kit): OpenSpec v1.16.1 e impeccable skill-v4.8.1 en upstream.json`, con la enmienda de spec, plan y `tasks.md`.

### Task 3 — enmienda 2026-11-08: la regla 3 con `rm2b`, y RM2

**Tras**: Task 2
**Modelo**: la sesión (Native); sujetos `opus`.
**Tests RED**: `rm2b`, con el kit de `HEAD`: el vigente sin cuerpo de `rm2` y un diff que no delata el aviso.
**Superficies**: tooling (batería), docs; skills solo si la regla 3 entra.
**Verificación**: `DRY_RUN=1` de `rm2b`; RED `BATTERY=sdd-verify SCENARIOS=rm2b SPEC_DIR=<carpeta de la spec> PHASE=red2 KIT_DIR=<git archive HEAD:dist> RUNS_DIR=.temp/r0297 MAX_PARALLEL=3 COST_CAP=2 node tests/headless/battery.mjs run`, fila RM2b leída a mano. Si RM2b falla en 1 o 2 de 2: la frase de la regla 3 en la viñeta, `moon run kit:build`, `node tests/copies/check.ts` → `Copias al día: 31 ficheros.`, `moon run kit:own` con las mismas 26 líneas, y el GREEN `SCENARIOS="rm2b rm2 f3"` con `PHASE=green` y el kit de `dist/` reconstruido, rúbricas RM2b, RM2 y S. Siempre: `moon run kit:test-headless` → `Tests  448 passed (448)` o más.

**Interfaces**:
- Consume: la entrada de `upstream.json` de la Task 2 y el montaje `reviewRemoved()` de la Task 1.
- Produce: la fila RM2 reescrita y, si entra, la viñeta con la regla 3.

**Ficheros**: crear `tests/batteries/sdd-verify/fixtures/app-rm2b-base.js` y `app-rm2b.js`; modificar `tests/batteries/sdd-verify/subject.mjs`, `battery.md`, `tests/sdd-verify-0297-removed.md`; si entra la regla 3, `skills/sdd-verify/references/spec-reviewer-prompt.md` y `dist/`, y la spec (sin la regla 3, salen del delta el ADDED 3 y el `MODIFIED`, por la enmienda aprobada).

- [ ] **Step 1: Molde** — `rm2b`: la base con el aviso sin rastro de correo (`outbox.push({ to: 'responsable', body: … })` y `salida`) y la rama que solo cambia otra cosa del comando `anular` (el texto de «sin reserva»), sin tocar el aviso; `bookings-rm2.md` como vigente. Fila `rm2b` (n 2, `opus`), su montaje y la fila RM2b: falla si da la retirada de «Avisar por correo» por buena o confirmada sin «no verificado». RM2 reescrita: falla si da la retirada por buena o confirmada.
- [ ] **Step 2: RED** — 2 sujetos con el kit de `HEAD`; tabla en la evidencia. Con 0 de 2 que fallan, la regla 3 no entra: la spec quita el ADDED 3 y el `MODIFIED` del delta (enmienda aprobada) y `rm2b` queda como regresión.
- [ ] **Step 3: GREEN, si entra** — la frase «A current requirement with nothing beyond its title, no body and no scenarios, is no evidence: write «no verificado: sin requisito vigente utilizable» for that entry and don't search.» en la viñeta del `REMOVED`, que se sustituye entera en un bloque `<!-- kit: 0297 -->` seguido de `<!-- kit: 0312 -->`; GREEN de `rm2b`, `rm2` y `f3`, con REFACTOR de n = 2 si falla; fila de procedencia en `battery.md`.
- [ ] **Step 4: Commit de la task** — `test(sdd-verify): la regla 3 de OpenSpec medida con rm2b` o, si entra, `feat(sdd-verify): un REMOVED sin requisito vigente utilizable queda no verificado`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,2 h
- Estimación de implementación: 2 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks al aprobar el plan (la 3 vino de la enmienda); la campaña (4 tandas de ~10 min) manda; referencia, la 0307 (3 tasks de texto, humo)
- Confianza: media (un RED limpio cambia el alcance)

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

> Tras las enmiendas del 2026-11-08: el `MODIFIED` y el ADDED del «no verificado» salieron del delta, y la viñeta no cambia.

- ADDED «busca un REMOVED por lo que dice su requisito vigente», THEN → Task 1, `rm1` (rúbrica RM1), como regresión. ✓
- ADDED «recupera del historial…», THEN → Task 1, `rm3` (rúbricas RM3 y RM3h, la de máquina sobre `tools.txt`), como regresión. ✓
- La regla 3 (vigente sin cuerpo) → Task 3, `rm2b` (RM2b) y `rm2` (RM2), como regresión; sin requisito en el delta. ✓
- Las cláusulas «a similar title is not a match» y «empty output means a wrong path» → no se escriben. ✓
- «Lo que se retira o cambia de forma»: la entrada `pending: "0297"` → Task 2, `node tests/copies/check.ts`; OpenSpec `v1.14.1` en el `NOTICE` → Task 2, `kit:notices`; impeccable → Task 2, `kit:upstream`. ✓
- Review Focus → Task 2, `notices.test.ts`. ✓
