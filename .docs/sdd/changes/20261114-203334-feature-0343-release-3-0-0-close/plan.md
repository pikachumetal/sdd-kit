---
id: 20261114-203334-feature-0343-release-3-0-0-close
feature: 0343
title: Plan de implementación — Cierre de la 3.0.0, lo que quedó de la 0152 y el corte
spec: ./spec.md
status: approved
created: 2026-11-14
---

# Plan de implementación — Cierre de la 3.0.0, lo que quedó de la 0152 y el corte

## Decisiones que he tomado yo — valida estas

1. **Ejecución en Native** — las cuatro tasks son campañas de sujetos que lanza y lee el hilo, encadenadas por el sha medido; un implementador por task no ahorra contexto, porque las salidas las leen los lectores.
2. **Modelo por task: el hilo** (Opus 5.5, la sesión). Lectores `sdd-kit:effort-medium` + `sonnet`, hasta 3 a la vez. Revisión final: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
3. **La ronda se parte en dos tasks por coste y por skill** — Task 2 (`sdd-roadmap`, `sdd-upgrade`, `sdd-archive`, ~5,6 $ por tanda) y Task 3 (`sdd-implement`, ~11,7 $ por tanda): un revisor puede rechazar el arreglo de una y aprobar la otra.
4. **El corte (decisión 11 de la spec, pasos tras el merge) no es una task**: va tras `sdd-archive`, en §3, porque corre sobre `develop`.
5. **Fases y subcarpetas** (decisión 10 de la spec): `SPEC_DIR` = la carpeta de esta spec; fases `r-rmp`, `r-upg`, `r-arc`, `r-imp` (GREEN), `r2-…` (REFACTOR), `c-<batería corta>` (corte: `c-int`, `c-agw`, `c-arc`, `c-dbg`, `c-exp`, `c-fbk`, `c-grl`, `c-imp`, `c-ini`, `c-prp`, `c-ret`, `c-rmp`, `c-rbd`, `c-upg`, `c-ver`, `c-use`, `c-usesp`), `c4-…` para relanzamientos a n = 4. `RUNS_DIR=.temp/r43`.
6. Coste estimado: ~12 h de reloj con las tandas en segundo plano; 333 $ de sujetos (techo 485 $) y ~40 $ de lectores y revisiones.
7. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: cortar la 3.0.0 con la ronda de los seis rojos cerrada, la batería del corte medida sobre el sha que se publica y cada rojo con su destino.

**Architecture**: no hay código nuevo. Cada arreglo es texto de una skill (la regla al paso donde se decide, saldo ≤ 0) o una fila de rúbrica; la medida la dan `battery.mjs run` y un lector por batería; la deuda, filas de `debt.md`.

**Tech Stack**: Markdown de `skills/`, `tests/batteries/`, `tests/headless/` (Node), `moon run kit:build`, Vitest en `cli/` (`word-budget.test.ts`).

**Spec**: `./spec.md`

**Ejecución**: native, porque 4 tasks encadenadas por el sha medido, cada una es una campaña que el hilo lanza y lee, un error lo caza el GREEN de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills, filas de baterías y registros; ningún módulo, dependencia ni contrato.

## Restricciones globales

### De código

- Saldo de palabras de las skills tocadas, contadas juntas, en 0 o menos; en `sdd-upgrade` (977 / 980) el arreglo sustituye texto, no añade.
- Ningún tope de `cli/test/kit/word-budget.test.ts` cambia.
- Una regla se mueve al paso donde se decide, o sustituye o quita otra; nunca se suma una regla nueva (`CLAUDE.md`, regla 6).
- Las skills se escriben en inglés; lo que lee el usuario, en castellano.
- Art. X: sin comentarios que repitan el código ni que citen documentos.
- Una `|` en el regex de una fila de rúbrica de máquina va escapada, `\|`.

### De proceso

- Antes de editar una skill, cargar `sdd-agent-writing`.
- Sujetos sonnet, por tandas de hasta 5 (`MAX_PARALLEL`), con `node tests/headless/battery.mjs run`; `COST_CAP=485`, `SUBJECT_CAP=1060`, `SPEC_DIR` único (la carpeta de la spec); llegar al techo es una parada.
- No se edita `subject.mjs` ni una batería con una tanda en marcha.
- Un rojo no se relanza para sacar verde: se lee por qué falló.
- Commits con tipo/scope en inglés, título y cuerpo en castellano, y `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Un arreglo de la ronda que vuelve verde su escenario y rompe un vecino del mismo paso → la batería del corte de esa skill lo mide sin filtrar · Task 4, fases `c-rmp`, `c-upg`, `c-arc`, `c-imp`.
- Una fila de bug cuya tasa cita una fase equivocada (no la última que midió el escenario) → cada fila de `debt.md` cita fase y kit, comprobables en `tests/release-3.0.0.md` · Task 4, Step 1.
- Un rojo de la batería del corte que el lector da como «sujeto» sin mirar `tools.txt` (un «no cargó» por un `cat` recortado) → el lector comprueba cada «no cargó» en `tools.txt` (`operations.md`, spike 0341) · Task 4, Step 3.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin código nuevo; los arreglos mueven reglas.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Brownfield gate**: solo texto de skills y filas de baterías; sin refactor fuera de los seis rojos.
- [x] **Constitution check**: Art. I (RED antes de la guía: los rojos de la 0152 son el RED), Art. IV (merge a `main` y etiqueta los decide una persona), Art. V (`kit:upstream` al preparar la release), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `skills/sdd-roadmap/SKILL.md` (y su referencia, si la causa está ahí) — `m1`: la forma exacta del título del prompt en la entrada 1; `m3`: proponer el descarte con `caducada` en el triaje.
- `skills/sdd-upgrade/SKILL.md` — `v5` (V16): los patches posteriores a la última release cerrada pasan a Now con ✅.
- `skills/sdd-archive/references/closing-suite.md` o `tests/batteries/sdd-archive/battery.md` (G5a-G5c) — `g5`, según la capacidad `archive` (decisión 9).
- `skills/sdd-implement/SKILL.md` — `u1`: escribir la corrección, despachar su revisor y esperar sus hallazgos antes del ✋.
- `skills/sdd-implement-subagent/SKILL.md` (o el paso de `sdd-implement` que despacha la revisión) — `h2`: los minors de la revisión los arregla el implementador reanudado, no el hilo.
- `tests/batteries/sdd-retro/battery.md` — fila «No carga `add-to-changelog`» en `r4`.
- `tests/batteries/sdd-propose/battery.md` — fila «No carga `sdd-templates`» en `sp1`, `co4` y `p2`.
- `tests/batteries/<skill>/battery.md` de los rojos de la ronda — solo la fila que la capacidad desmienta (G5a-G5c) o la procedencia de la regla movida.
- `tests/release-3.0.0.md` — secciones literales de los lectores bajo «Batería del corte (feature 0343)».
- `.docs/sdd/steering/debt.md` — filas de bug en «Por triar», una por skill.
- `.docs/sdd/changes/20261114-203334-feature-0343-release-3-0-0-close/` — evidencia por fase, `tasks.md`, walkthrough.

**NO se tocan**:

- `cli/` — salvo un rojo del comando del corte.
- `skills/sdd-grilling/`, `tests/batteries/interviewer/` — los rojos de la 0342 no se reabren.
- Los topes de `word-budget.test.ts`.

### 1.6 Dependencias

- `SDD_UPSTREAM_DIR` con los clones de las fuentes de `upstream.json` (pre-commit y `kit:upstream`) y un clon de superpowers para `SUPERPOWERS_DIR`: hoy no están en la máquina; los prepara el dev-lead.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La batería del corte pasa el techo | media | parada | `plan` antes de cada tanda; el orden de la Task 4 deja `sdd-propose` y `sdd-implement`, las más caras, al final |
| Una regresión para el corte | media | parada y re-medida | decisión 6 y 14 de la spec |
| Otro merge a `develop` toca `skills/` antes del corte | baja | re-medir | `git diff --stat <sha medido> HEAD -- skills includes` antes del corte |

### 1.8 Rollout

Directo: `sdd merge --push` a `develop`, después `sdd-end-release` con su parada de merge a `main` y etiqueta.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Precondiciones, `kit:upstream` y filas de humo

**Tras**: —
**Modelo**: el hilo (Native)
**Tests RED**: las dos filas nuevas sobre los `tools.txt` de la 0152 (`z-ret/out/r4-*`, `z-prp/out/sp1-*`, `co4-*`, `p2-*`).
**Superficies**: tooling · docs
**Verificación**: `node tests/headless/battery.mjs verdict tests/batteries/sdd-retro/battery.md <carpeta de la 0152>/z-ret/out` y lo mismo con `sdd-propose` y `z-prp/out`; `git config core.hooksPath` → `.githooks`; `moon run kit:upstream` → `Fuentes al día: <n> entradas.` o la lista de fuentes que revisar.

**Interfaces**:
- Consume: nada.
- Produce: las filas «No carga `add-to-changelog`» (`r4`) y «No carga `sdd-templates`» (`sp1`, `co4`, `p2`), que la Task 4 aplica en la batería del corte.

**Ficheros**: `tests/batteries/sdd-retro/battery.md`, `tests/batteries/sdd-propose/battery.md`, la evidencia del RED en `rf/` de la carpeta de la spec.

- [ ] **Step 1: Precondiciones** — `SDD_UPSTREAM_DIR` existe y contiene un clon por fuente de `upstream.json`; `SUPERPOWERS_DIR` apunta a un clon de superpowers; `git config core.hooksPath` → `.githooks`. Si falta algo, parar y pedirlo.
- [ ] **Step 2: `moon run kit:upstream`** — verde, o la lista de fuentes que revisar; lo que convenga traer va a una fila del roadmap, sin parar.
- [ ] **Step 3: Filas** — añadir a la rúbrica de cada batería, con la forma de la fila K de `tests/batteries/interviewer/battery.md`, cambiando `sdd-grilling` por la skill: `` `tools: /^>>> (Skill: \S*add-to-changelog(\s\|$)\|Read: [^\n]*add-to-changelog[\\/]SKILL\.md(\n\|$)\|(Bash\|PowerShell): ([^\n]*[;&\n] *)?(cat\|Get-Content) (?![^;&\|\n]*(-TotalCount\|-Tail\|-Head\|-First\|>))[^;&\|\n]*add-to-changelog[\\/]SKILL\.md(?![\w.])[^;&\|\n]*([;&\n]\|$))/` ausente `` (y lo mismo con `sdd-templates`), con su línea de procedencia («feature 0343, decisión 8»).
- [ ] **Step 4: Prueba de la fila** — `verdict` sobre un `tools.txt` que carga la skill (pasa) y otro sin la carga (falla), en una carpeta temporal.
- [ ] **Step 5: RED** — `verdict` sobre las salidas de `z-ret` y `z-prp` de la 0152; anotar la tasa de cada fila nueva en `tasks.md`.
- [ ] **Step 6: Commit de la task**.

### Task 2 — Ronda: `m1`, `m3`, `v5` y `g5`

**Tras**: Task 1
**Modelo**: el hilo (Native); un lector sonnet por fase.
**Tests RED**: las lecturas de la 0152 (`tests/release-3.0.0.md`: z-rmp `m1` 0/2 y `m3` 0/2; z-upg y f-upg `v5`; y3-arc `g5` 0/2).
**Superficies**: docs (skills) · tooling (baterías)
**Verificación**: `moon run kit:build` → `Tasks: 1 completed`; `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  <n> passed (<n>)`; `BATTERY=sdd-roadmap SCENARIOS="m1 m3" N=4 PHASE=r-rmp …  node tests/headless/battery.mjs run` y lo mismo con `sdd-upgrade` `v5` (`r-upg`) y `sdd-archive` `g5` (`r-arc`), con `KIT_DIR` = `dist/` copiado del árbol tras el build → veredicto por escenario y lector.

**Interfaces**:
- Consume: nada.
- Produce: el texto arreglado de `sdd-roadmap`, `sdd-upgrade` y `sdd-archive` (o las filas G5a-G5c), que la Task 4 mide en la batería del corte.

**Ficheros**: `skills/sdd-roadmap/`, `skills/sdd-upgrade/SKILL.md`, `skills/sdd-archive/references/closing-suite.md` o `tests/batteries/sdd-archive/battery.md`, la evidencia en `r-rmp/`, `r-upg/`, `r-arc/`.

- [ ] **Step 1: Causa** — por rojo, la regla que lo decide y el paso donde se decide, leídos en `dist/skills/` y en la lectura de la 0152; para `g5`, la conducta que da la capacidad `archive` al molde `reservas-gate-base` (decisión 9 de la spec), y si no la decide, parar como desvío.
- [ ] **Step 2: Arreglo** — cargar `sdd-agent-writing`; mover la regla al paso, con saldo ≤ 0 contado antes y después en `tasks.md`.
- [ ] **Step 3: GREEN** — las tres tandas con `N=4`; verde con 4/4.
- [ ] **Step 4: REFACTOR, si hace falta** — un rojo que no sale 4/4 tiene una vuelta más (fase `r2-…`); si sigue sin 4/4, su tasa y su causa van a `tasks.md` para la fila de bug de la Task 4.
- [ ] **Step 5: Commit de la task**.

### Task 3 — Ronda: `u1` y `h2`

**Tras**: Task 2
**Modelo**: el hilo (Native); un lector sonnet.
**Tests RED**: w-imp de la 0152 (`u1` 0/2 en U1r, u1-1 también en U1; `h2` 0/1 en S).
**Superficies**: docs (skills) · tooling (baterías)
**Verificación**: `moon run kit:build`; `npx vitest run test/kit/word-budget.test.ts` desde `cli/`; `BATTERY=sdd-implement SCENARIOS="u1 h2" N=4 PHASE=r-imp … node tests/headless/battery.mjs run` → veredicto y lector.

**Interfaces**:
- Consume: nada.
- Produce: el texto arreglado de `sdd-implement` y `sdd-implement-subagent`.

**Ficheros**: `skills/sdd-implement/SKILL.md`, `skills/sdd-implement-subagent/SKILL.md`, la evidencia en `r-imp/`.

- [ ] **Step 1: Causa** — `u1`: «A deviation that changes the delta: write in `spec.md` the correction you recommend, dispatch its reviewer, then stop with its findings in ✋» (U1: no lo escribe ni lo despacha; U1r: para antes de que vuelva el revisor); `h2`: la racionalización «I'll fix it myself» de `sdd-implement-subagent` no llega al paso que reparte los minors.
- [ ] **Step 2: Arreglo** — cargar `sdd-agent-writing`; la espera del revisor y la reanudación del implementador al paso donde se deciden, con saldo ≤ 0; la regla de desvío repetida en «How you stop» de `sdd-implement` (walkthrough de la 0152) se quita si el GREEN lo aguanta.
- [ ] **Step 3: GREEN** — `N=4`; verde con 4/4.
- [ ] **Step 4: REFACTOR, si hace falta** — como en la Task 2 (fase `r2-imp`).
- [ ] **Step 5: Commit de la task**.

### Task 4 — Batería del corte y filas de bug

**Tras**: Task 3
**Modelo**: el hilo (Native); lectores sonnet, hasta 3 a la vez.
**Tests RED**: no aplica: es la medida.
**Superficies**: tooling · docs
**Verificación**: por batería, `BATTERY=<skill> PHASE=c-<corta> KIT_DIR=<copia de git archive <sha medido>:dist> SPEC_DIR=<carpeta de la spec> RUNS_DIR=.temp/r43 COST_CAP=485 SUBJECT_CAP=1060 node tests/headless/battery.mjs run` → veredicto por escenario; `f2 f3` de `using-sdd` con `SUPERPOWERS_DIR` (`c-usesp`); `node cli/bin/sdd.js roadmap check` → `Roadmap válido`.

**Interfaces**:
- Consume: el texto de las Tasks 2 y 3 y las filas de la Task 1, commiteados y con `dist/` reconstruido: ese commit es el sha medido.
- Produce: el sha medido (lo usa el corte), las secciones de los lectores en `tests/release-3.0.0.md` y las filas de bug en `debt.md`.

**Ficheros**: `tests/release-3.0.0.md`, `.docs/sdd/steering/debt.md`, la evidencia en `c-…/`.

- [ ] **Step 1: Filas de bug de (b)** — cada rojo de la medida final de la 0152 que no está en la ronda, con «k de n fallan» de su última fase, las anteriores entre paréntesis, la fila de rúbrica y la causa del lector; una fila por skill en «Por triar» (`interviewer` → `sdd-grilling`; `f2`/`f3` → `using-sdd`).
- [ ] **Step 2: Sha medido** — `moon run kit:build`, comprobar que `dist/` no tiene cambios sin commitear, anotar el sha en `tasks.md`; una ruta real de salida se compara con 140 caracteres.
- [ ] **Step 3: Batería del corte** — `plan` y `run` por batería, de la más barata a la más cara; un lector por batería con la rúbrica, los textos de esa skill en el sha medido y la regla de comprobar cada «no cargó» en `tools.txt`.
- [ ] **Step 4: Destinos** — aplicar la decisión 6 de la spec a cada rojo (relanzar a n = 4 en `c4-…` las posibles regresiones); añadir la tasa del corte a las filas de bug.
- [ ] **Step 5: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 8h (hilo; las tandas corren en segundo plano)
- Estimación de revisión: 1h
- Estimación de cierre: 1,5h (incluye el corte)
- Base de la estimación: 4 tasks, seis rojos y 16 baterías; referencia, la 0342 (5h estimadas, 4,54h reales) y la Task 4 de la 0152
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`); después, el corte de la decisión 11 de la spec: `git diff --stat <sha medido> HEAD -- skills includes` vacío en `develop`, `node cli/bin/sdd.js lock run -- moon run kit:build kit:skill-size kit:own kit:copies cli:test-slow cli:test-min` y `sdd-end-release` para la 3.0.0

---

## 4. Self-review (cobertura spec → tasks)

- (a) los seis rojos, verdes con 4/4 o con su fila → Tasks 2 y 3 (GREEN `r-…`) y Task 4 Step 4. ✓
- (b) filas de bug de los rojos de la 0152 fuera de la ronda → Task 4, Step 1. ✓
- (c) batería del corte con su n, `f2`/`f3` con `SUPERPOWERS_DIR` y las filas de la decisión 8 → Task 1 (filas) y Task 4 Step 3. ✓
- (d) `kit:upstream` → Task 1 Step 2; comando del corte y `sdd-end-release` → §3. ✓
- Decisión 2 (saldo ≤ 0) → Tasks 2 y 3, conteo antes y después y `word-budget.test.ts`. ✓
- Decisión 6 (regresión y relanzamiento a n = 4) → Task 4, Step 4. ✓
- Decisión 9 (`g5` por la capacidad, G5a-G5c) → Task 2, Step 1. ✓
- Decisión 11 (sha medido sin cambios en `develop`) → §3. ✓
- Decisión 12 (precondiciones) → Task 1, Step 1. ✓
- Decisión 14 (re-medida tras un arreglo posterior) → Task 4, Step 4. ✓
- La etiqueta y el merge a `main` → `sdd-end-release`, con la parada del dev-lead; nada en la rama la observa (es post-merge). ⚠
- Review Focus → Task 4, Steps 1, 3 y 4. ✓
