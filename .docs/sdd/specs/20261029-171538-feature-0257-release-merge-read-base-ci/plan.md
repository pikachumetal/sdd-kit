---
id: 20261029-171538-feature-0257-release-merge-read-base-ci
feature: 0257
title: Plan de implementación — La release y el merge leen la CI de la base
spec: ./spec.md
status: draft
created: 2026-10-29
---

# Plan de implementación — La release y el merge leen la CI de la base

## Decisiones que he tomado yo — valida estas

1. **Modelo por task**: las dos las hace la sesión (Native); los sujetos headless, `sonnet` (`tech-stack.md`, «Baterías por skill»). Revisión final: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`; Arquitectura no.
2. **Los cuatro escenarios van en la batería de `sdd-archive`**, con ids `ci1`, `ci2`, `rc1` y `rc2` (los `c1`, `c2`, `r1` y `r2` de la spec, decisión 9; `r1` y `r2` ya existen en esa batería). `sdd-end-release` no tiene batería en `tests/batteries/`, y sus dos escenarios necesitan el mismo molde y el mismo `gh` falso: `rc1` y `rc2` llevan `Esperado` `sdd-kit:sdd-end-release`, como `g6` lleva `sdd-start-feature`. La evidencia narrativa, en `tests/base-ci-red.md` y `tests/base-ci-green.md`, como dice la spec.
3. **RED con n = 1, GREEN con n = 2**, como la 0236: RED con la copia del kit de `develop` en el merge-base `1aa1105f` (`git archive 1aa1105f skills .claude-plugin cli hooks`), GREEN con el kit de la rama copiado. `RUNS_DIR` en `.temp/r257`. `SUPERPOWERS_DIR` en `~/.claude/plugins/cache/superpowers-marketplace/superpowers/7.0.0`, la versión del README.
4. **El `gh` falso**: `bin/gh.mjs` junto al molde (en `s.RUN`, fuera del repo del sujeto), con `bin/gh` (sh) y `bin/gh.cmd` que lo lanzan, delante en el `PATH` del sujeto (la clave que ya tenga, `Path` en Windows). Lee `bin/gh.json` (`{ "stdout", "stderr", "code" }`) y apunta cada llamada en `bin/gh.log`, que el sujeto guarda en `state.txt`.
5. **Coste**: RED 4 sujetos y GREEN 8, a ~0,60 $ de media ≈ 7,2 $, más una tanda de REFACTOR de 4 ≈ 2,4 $: ~9,6 $, bajo el techo de 14,5 $ de la spec.
6. **Estimación**: ~2,5 h de implementación (moldes y `gh` falso ~0,7 h, textos ~0,5 h, 12 sujetos en tandas de 3 ~1 h, cierre ~0,3 h).
- Review Focus: 2 entradas que la spec no fija; ver la sección.

**Goal**: el cierre no fusiona con la CI de la base en `failure` y avisa si no responde; la release no corta sin la suite completa o el último verde de la CI en su sha.

**Architecture**: solo texto de skills, `CLAUDE.md` y su prueba. La regla del merge va en una sección nueva de `merge-recipe.md` y el paso 7 de `sdd-archive` la nombra; la del corte, en el «Gate de entrada» de `sdd-end-release`.

**Tech Stack**: Markdown (skills), Node (`tests/batteries/sdd-archive/subject.mjs`, el `gh` falso), sujetos headless con `node tests/headless/battery.mjs run`, Vitest en `cli/test/kit/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks de texto que no comparten interfaz salvo el molde, un error lo caza el GREEN de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills y un molde de test.

## Restricciones globales

### De código

- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos; clean code.
- Literales de la spec: `CI de <merge.into> en rojo en <headSha>`; `CI de <merge.into> sin respuesta: <primera línea del error>; sigo sin leerla`.
- El texto de skills y referencias se edita con `Edit`, nunca con un script de reemplazo (ticket de la 0236 §6).
- Topes de `cli/test/kit/word-budget.test.ts` sin cambio.

### De proceso

- Sujetos `sonnet`, en tandas de hasta `control.maxParallelAgents` (3).
- Commits con tipo/scope en inglés y título en castellano; `Co-Authored-By` de la sesión.

## Review Focus

- La orden de la CI sale con 0 y una lista vacía (`[]`, ningún run aún) → no es `failure`: fusiona sin aviso · Task 1, cubierto por la regla «solo `failure` para»; sin escenario, revisado en el texto.
- En `rc2`, la CI con `success` en el sha pero el gate de entrada pide además «build/lint del proyecto en verde» → el sujeto no debe correr la suite por esa frase · Task 2, `rc2`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una sección de receta y una frase por skill.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Constitution check**: Art. I (RED antes de escribir, previsión de coste), «una pieza entra, otra sale» (regla 7 de `CLAUDE.md`).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/sdd-archive/fixtures/gh/gh.mjs` — el `gh` falso.
- `tests/base-ci-red.md`, `tests/base-ci-green.md` — evidencia.

**Modificar**:

- `tests/batteries/sdd-archive/battery.md` — moldes `reservas-ci-red`, `reservas-ci-down`, `reservas-release-ci`, `reservas-release-ci-old`; escenarios `ci1`, `ci2`, `rc1`, `rc2`; rúbrica.
- `tests/batteries/sdd-archive/subject.mjs` — los cuatro moldes y el `gh` falso.
- `skills/sdd-archive/references/merge-recipe.md` — sección «The base's CI».
- `skills/sdd-archive/SKILL.md` — paso 7 la nombra; red flag.
- `skills/sdd-end-release/SKILL.md` — «Gate de entrada» y red flag.
- `CLAUDE.md` — regla 7 sin la mitad de `develop`.

**NO se tocan**: `cli/src/merge/` (la CLI no lee la CI: spec, «No entra»); `operations-template.md` y `sdd-upgrade` (ya tienen el campo).

### 1.6 Dependencias

La 0236 (campo «CI de la base»), ya en `develop`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El Bash del sujeto no ve el `PATH` con el `gh` falso | media | sin medida | el primer sujeto del RED se lee entero; `bin/gh.log` vacío con una llamada a `gh` en `tools.txt` = molde roto |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — El merge lee la CI de la base

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: `ci1` y `ci2` de `tests/batteries/sdd-archive/battery.md`, con el kit de `develop`, n = 1.
**Superficies**: docs (skills), tooling (molde).
**Verificación**: `BATTERY=sdd-archive STEPS="ci" … node tests/headless/battery.mjs run` y la rúbrica leída fila por fila; `npx vitest run cli/test/kit/word-budget.test.ts cli/test/kit/skills.test.ts` → `Tests  N passed (N)`.

**Interfaces**:
- Produce: `ghFake(json)` en `subject.mjs`, que planta `bin/` y prepende el `PATH`; la línea de `tech-stack.md` del molde `- **CI de la base**: \`.github/workflows/ci.yml\` · \`gh run list --workflow ci.yml --branch develop -L 1 --json conclusion,headSha\``.

**Ficheros**: los de §1.1 de `sdd-archive`, `merge-recipe.md`, `CLAUDE.md`.

- [ ] **Step 1: Molde** — `reservas-ci-red`: `reservas` + `done0010()` + la línea de CI en `tech-stack.md` (commit en `develop` antes de abrir la rama) + `gh.json` con `stdout` `[{"conclusion":"failure","headSha":"<sha de develop>"}]`. `reservas-ci-down`: lo mismo con `code` 1 y `stderr` `To get started with GitHub CLI, please run:  gh auth login`. `state.txt` guarda `bin/gh.log`.
- [ ] **Step 2: RED** — `ci1`, `ci2` con el kit de `develop`. Rúbrica `ci1`: (a) llama a la orden de la CI antes de `sdd merge`; (b) no ejecuta `sdd merge` (ni `develop` avanza); (c) dice `CI de develop en rojo en <sha>`; (d) fila de deuda con el sha. `ci2`: (a) llama a la orden; (b) dice `CI de develop sin respuesta: To get started with GitHub CLI, please run:  gh auth login; sigo sin leerla`; (c) fusiona.
- [ ] **Step 3: Texto** — `merge-recipe.md`, sección `## The base's CI` antes de «The merge is a script»: con «CI de la base» de `tech-stack.md` §Testing (`operations.md` en 3.0.0) y su orden, córrela antes de `sdd merge`; `conclusion` `failure` → los literales de la spec, la búsqueda en la deuda como «Fails without the branch», fila con el `headSha` si no hay, sin `sdd merge`, «No terminado»; cualquier otra salida → sigue; la orden falla → el literal de sin respuesta y sigue; `ninguna` o `sin orden de lectura` → nada; hotfix → no se lee. `SKILL.md` paso 7: una frase que la nombra; red flag «Vas a fusionar sin leer la CI de la base declarada, o sobre su `failure`». `CLAUDE.md` regla 7: queda la mitad de la rama.
- [ ] **Step 4: GREEN** — `ci1`, `ci2` con el kit de la rama, n = 2; umbral 2/2.
- [ ] **Step 5: Verificación** — los tests de Vitest de arriba.
- [ ] **Step 6: Commit de la task**.

### Task 2 — El corte lee la CI de la base

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: `rc1` y `rc2`, con el kit de `develop`, n = 1.
**Superficies**: docs (skills), tooling (molde).
**Verificación**: `BATTERY=sdd-archive STEPS="release-ci" … node tests/headless/battery.mjs run` y la rúbrica; los tests de Vitest de la Task 1.

**Interfaces**:
- Consume: `ghFake(json)` y la línea de CI de la Task 1.

**Ficheros**: `subject.mjs`, `battery.md`, `skills/sdd-end-release/SKILL.md`.

- [ ] **Step 1: Molde** — `reservas-release-ci`: `reservas` (develop con `[Unreleased]` de 0005, 0006 y 0007) + `tech-stack.md` con `## Testing` (`- **Suites**: \`node --test\` · ~1 s · unitario` y la línea de CI) + `gh.json` con `success` en el `HEAD` de `develop` (`rc2`). `reservas-release-ci-old`: lo mismo con `success` en `HEAD~1` (`rc1`). Petición: «Invoca la skill sdd-kit:sdd-end-release y sigue. Cierra la release 0.4.0 con lo de [Unreleased]; la 0010 pasa a la siguiente.»
- [ ] **Step 2: RED** — rúbrica `rc1`: (a) lee la CI o la suite antes de sellar el changelog; (b) corre `node --test` entero antes de sellar o proponer el corte. `rc2`: (a) lee la CI; (b) no corre `node --test`.
- [ ] **Step 3: Texto** — «Gate de entrada»: la frase de la suite completa sobre el sha de `merge.into` al arrancar el corte, o el `success` de la CI en ese sha (decisiones 5-7 de la spec); red flag «Vas a sellar el changelog sin la suite completa en verde sobre el sha que cortas, ni el `success` de la CI en él».
- [ ] **Step 4: GREEN** — `rc1`, `rc2`, n = 2; umbral 2/2.
- [ ] **Step 5: Verificación** — Vitest como en la Task 1.
- [ ] **Step 6: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,8h
- Estimación de implementación: 2,5h
- Base de la estimación: 2 tasks de texto con batería; la 0236 (5 h con 3 tasks y ~31 sujetos).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver §4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- archive THEN (no fusiona, literal, deuda, «No terminado») → Task 1, `ci1` (a)-(d). ✓
- archive AND `success`/vacía/`cancelled` fusiona → Task 1, texto; `success` lo cubre `ci2` por el camino de seguir; el resto, Review Focus. ⚠ sin escenario propio
- archive AND sin respuesta → Task 1, `ci2`. ✓
- archive AND `ninguna`/`sin orden de lectura` → Task 1, texto: todos los moldes sin la línea (`a1` y el resto de la batería) son su control. ✓
- archive AND hotfix no la lee → Task 1, texto; sin escenario (el hotfix `a4` no lleva la línea). ⚠
- control-profiles AND en cualquier perfil no fusiona con `failure` → Task 1, `ci1` (perfil `delegate`). ✓
- release-flow THEN corre la suite antes de sellar → Task 2, `rc1`. ✓
- release-flow AND `success` en el sha no corre nada → Task 2, `rc2`. ✓
- release-flow AND `failure` en el sha o suite roja no corta → Task 2, texto; sin escenario. ⚠
- release-flow AND sin CI corre siempre → Task 2, texto. ⚠
- Retirada: la mitad de `develop` de la regla 7 → Task 1, Step 3; se comprueba leyendo `CLAUDE.md`. ✓
