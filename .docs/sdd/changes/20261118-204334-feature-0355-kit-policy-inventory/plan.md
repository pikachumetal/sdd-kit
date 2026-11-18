---
id: 20261118-204334-feature-0355-kit-policy-inventory
feature: 0355
title: Plan de implementación — Spike: inventario del texto del kit que es política de cada proyecto
spec: ./spec.md
status: approved
created: 2026-11-18
---

# Plan de implementación — Spike: inventario del texto del kit que es política de cada proyecto

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: el hilo hace las dos tasks (Native, el de todo spike), sin subagentes (spec, política de modelos). Revisión final de rama: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: native, porque un spike siempre va en Native.
3. Las palabras de cada pieza no se cuentan a mano: la tabla de piezas se escribe primero como `pieces.tsv` (fichero, líneas, destino, motivo, enganche) y `measure.mjs` cuenta las líneas de cada pieza con el `words()` de `word-budget.test.ts` y genera las tablas de `research.md`. Así las sumas cuadran por construcción y el script lo comprueba (O2).
4. El conteo se hace sobre `dist/skills/` del commit de apertura: es lo que mide el tope; `skills/` y `dist/` no cambian en esta rama.
5. Gate de cierre: el de `operations.md`. Pide `node_modules`, que este worktree no tiene: lo instala el paso de preparación de `sdd-worktrees` antes de la gate, no antes, porque las tasks solo corren `node` sin dependencias.
6. Coste estimado: ~2 h de hilo, sin despachos salvo la revisión final.
7. Review Focus: 3 entradas; ver la sección.

**Goal**: dejar `research.md` con una fila por pieza del terreno de la fila (destino, motivo, palabras, enganche), una fila por terreno del resto, la suma por skill, la propuesta de enganche y el corte por versiones.

**Architecture**: un script `measure.mjs` en la carpeta del spike hace el barrido (marcadores y encabezados) y el conteo; el hilo lee y clasifica en `pieces.tsv`; el mismo script genera las tablas de `research.md` desde `pieces.tsv`.

**Tech Stack**: Node 22 (`.mjs` sin dependencias), Markdown.

**Spec**: `./spec.md`

**Ejecución**: native, porque un spike siempre va en Native, las dos tasks se encadenan por `pieces.tsv` y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo añade evidencia en `.docs/sdd/changes/`; no toca módulos, manifests ni contratos.

## Restricciones globales

### De código

- Art. X de la constitution, literal: «**Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario.» · «**Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough.» · «Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).»
- El conteo es el de `cli/test/kit/word-budget.test.ts`: `text.split(/\s+/).filter(Boolean).length`, sobre `dist/skills/`, sin ficheros bajo `migrations/`.
- `skills/`, `dist/`, `cli/` y `tests/` no se tocan; todo lo nuevo va en la carpeta de la spec.

### De proceso

- Sin subagentes salvo la revisión final de `sdd-verify`.
- Commits: tipo/scope en inglés, título y cuerpo en castellano (Art. VI), con la atribución `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Una pieza cuyo rango de líneas solapa con otra del mismo fichero → `measure.mjs` sale con código distinto de 0 nombrando las dos; si no, la suma por skill cuenta dos veces · Task 1, `node measure.mjs table` sobre un `pieces.tsv` con un solape a mano.
- Una fila de `pieces.tsv` que nombra un fichero de `dist/skills/` inexistente o un rango fuera del fichero → código distinto de 0 con la fila · Task 1, la misma comprobación.
- La suma por skill de `research.md` no coincide con el total del tope para esa skill → la columna «hoy» sale del mismo recorrido que `skillWords()` del test y se compara con lo que da `count` · Task 2, línea `cuadra:` de `measure.mjs table`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y dos ficheros de datos; nada fuera de la carpeta.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Constitution check**: Art. I (no edita skills), Art. III (castellano), Art. X (script), Art. XI (evidencia en el artefacto del evento).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (en `.docs/sdd/changes/20261118-204334-feature-0355-kit-policy-inventory/`):

- `measure.mjs` — subcomandos `sweep` (marcadores y encabezados a `out/`) y `table` (lee `pieces.tsv` y `terrains.tsv`, cuenta, valida y escribe las tablas en `out/tables.md`).
- `out/hits.tsv`, `out/headings.md` — salida en bruto del barrido.
- `pieces.tsv` — una fila por pieza: `file	from	to	destination	reason	hook_words` (`destination` ∈ `queda`, `skill-proyecto`, `template`).
- `terrains.tsv` — una fila por terreno del resto: `terrain	files	note`.
- `research.md` — calcado de `research-template.md` de `sdd-templates`, con las tablas de `out/tables.md`.

**NO se tocan**: `skills/`, `dist/`, `cli/`, `tests/` — el spike no retira nada.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Una regla de proyecto sin marcador queda fuera | media | medio | índice de encabezados de cada fichero; límite declarado con ficheros leídos frente al total |
| El contexto se llena al leer los ficheros con acierto | media | medio | leer por secciones con `offset`/`limit` desde `out/headings.md`; apuntar en `pieces.tsv` al acabar cada fichero |

### 1.8 Rollout

Directo: solo evidencia.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Barrido e inventario de piezas

**Tras**: —
**Modelo**: el hilo (Native).
**Evidencia**: O1 y O1 bis · `out/hits.tsv`, `out/headings.md`, `pieces.tsv`, `terrains.tsv`, generados o escritos en la carpeta de la spec · tabla «Piezas» y tabla «Otros terrenos» de `research.md`.
**Superficies**: docs
**Verificación**: `node measure.mjs table` desde la carpeta → última línea `piezas: <n> · sin destino: 0 · solapes: 0`, código 0.

**Interfaces**:
- Consume: nada.
- Produce: `pieces.tsv` (columnas `file	from	to	destination	reason	hook_words`, `file` relativo a `dist/skills/`, líneas 1-indexadas inclusivas) y `terrains.tsv` (`terrain	files	note`, `files` separados por `,`).

**Ficheros**: crear `measure.mjs`, `out/`, `pieces.tsv`, `terrains.tsv`.

- [ ] **Step 1: `measure.mjs sweep`** — recorre `dist/skills/**/*.md` sin `migrations/`; escribe `out/hits.tsv` (`file	line	marker`) con los marcadores de la decisión 7 de la spec, sin distinguir mayúsculas, y `out/headings.md` (por fichero, sus líneas `#` con número y palabras del fichero).
- [ ] **Step 2: Lectura** — enteros los seis de la fila (`sdd-tdd/references/writing-e2e.md`, `sdd-archive/references/e2e-suite.md`, campos E2E de `sdd-templates/templates/operations-template.md`, la sección «E2E tests» y «Project E2E» de `sdd-verify/references/code-reviewer-prompt.md`, `sdd-archive/references/dev-validation.md`, `sdd-implement/references/frontend-verification.md`), más `validation-template.md` y `validation-modes.md`, y cada fichero con acierto, por secciones. Contrastar `writing-e2e.md` con `templates/*/.claude/skills/e2e` de `sdd-project-template` y `dev-validation.md` con `.claude/skills/validation-script/SKILL.md` de `document-manager`.
- [ ] **Step 3: Clasificar** — cada pieza a `pieces.tsv` con el criterio de las decisiones 2-4 de la spec; los terrenos de fuera a `terrains.tsv`.
- [ ] **Step 4: `measure.mjs table`** — valida (fichero existe, rango dentro, sin solapes, destino válido, motivo no vacío; si no, código 1 con la fila) y escribe `out/tables.md` con «Piezas» (skill, fichero, líneas, destino, motivo, palabras, enganche) y «Otros terrenos» (terreno, ficheros, palabras). Comprobar el código 1 con un solape a mano y deshacerlo.
- [ ] **Step 5: Commit de la task**.

### Task 2 — Sumas por skill, enganche y corte por versiones

**Tras**: Task 1
**Modelo**: el hilo (Native).
**Evidencia**: O2 y O3 · `out/tables.md` (tabla «Por skill» y línea `cuadra:`) · `research.md` completo.
**Superficies**: docs
**Verificación**: `node measure.mjs table` → incluye `cuadra: sí` (la columna «hoy» de cada skill es igual a la suma de palabras de sus ficheros, y «sale» a la suma de sus piezas no `queda`), código 0.

**Interfaces**:
- Consume: `pieces.tsv` y `terrains.tsv` de la Task 1.
- Produce: `research.md`.

**Ficheros**: modificar `measure.mjs`; crear `research.md`.

- [ ] **Step 1: Tabla «Por skill»** en `measure.mjs table`: skill, hoy, sale, entra (suma de `hook_words` de sus piezas que salen), neto (hoy − sale + entra), y la línea `cuadra:`.
- [ ] **Step 2: `research.md`**, calcado de `research-template.md`: pregunta, método y límite (decisión 11: ficheros leídos enteros frente a 100), las tres tablas, las dos formas de enganche con su coste (decisión 5), y el corte por versiones (decisión 9) con lo que pide cada corte a los proyectos y su nivel SemVer, y el coste de un proyecto sin template por corte.
- [ ] **Step 3: Commit de la task**.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los objetivos de la spec (O1, O1 bis, O2, O3)
- [ ] Spec satisfecha: cada objetivo tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- O1, una fila por pieza con destino, motivo, palabras y enganche; cero sin destino → Task 1, `measure.mjs table` (`sin destino: 0`). ✓
- O1 bis, una fila por terreno del resto → Task 1, tabla «Otros terrenos». ✓
- O2, por skill hoy/sale/entra/neto y sumas que cuadran → Task 2, línea `cuadra: sí`. ✓
- O3, corte por versiones con lo que pide y su SemVer → Task 2, sección de `research.md`. ✓
- Decisión 5, dos formas de enganche con coste → Task 2, Step 2. ✓
- Decisión 11, límite declarado → Task 2, Step 2. ✓
- Review Focus (solape, fichero o rango inválido, cuadre) → Tasks 1 y 2, comprobaciones de `measure.mjs`. ✓
