---
id: 20261015-104325-feature-0188-closing-estimation-templates
feature: 0188
title: Plan de implementación — Estimación y plantillas del cierre
spec: ./spec.md
status: approved
created: 2026-10-15
---

# Plan de implementación — Estimación y plantillas del cierre

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa las tres tasks; los sujetos de la Task 3, Sonnet (`claude -p --model sonnet`), como fija `tech-stack.md`. Revisión final con los ejes de `sdd-verify`: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: Native — 3 tasks, la 2 y la 3 consumen la línea que produce la 1, un error lo caza su test o su GREEN, y el plan cabe en un contexto.
3. La medición vive en un fichero nuevo, `cli/src/session/clock.ts`, y `Session` gana `clock`; `usage.ts` no cambia: lee solo respuestas con `usage`, y el reloj necesita todas las entradas.
4. «Mensaje que escribe el usuario»: entrada `type: user`, sin `isMeta: true`, cuyo contenido es texto (cadena o bloques `text`) y no empieza, tras quitar espacios, por `<task-notification>`, `<system-reminder>`, `<local-command-stdout>`, `<local-command-stderr>` ni `<local-command-caveat>`. Un `/comando` que teclea el usuario sí cuenta.
5. El reloj de un transcript va de su primera a su última entrada `user` o `assistant` con `timestamp`; las demás (`attachment`, `system`, `mode`…) no cuentan.
6. Redondeo: horas a dos decimales con coma en el texto y con punto en el JSON; minutos de espera, al entero.
7. El RED de la Task 3 corre sobre el kit del commit de apertura (`git worktree add` de ese commit en el scratchpad), así es baseline aunque se lance después de las Tasks 1 y 2.
8. Riesgo alto: el formato de los transcripts no es un contrato de Claude Code. Mitigación: entradas que no se entienden se ignoran, y la Task 1 añade una ejecución real sobre el worktree de esta feature.
9. Coste estimado: ~2,5 h (rango 1,5–3,5) y ~9 $ de sujetos, techo 12 $.
10. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: el log excluye las estimaciones `post hoc`, `sdd session tokens` mide el esfuerzo real sin esperas, y plantillas y cierres lo usan.

**Architecture**: dos cambios de CLI en dominios existentes (`estimation` lee una marca; `session` gana un lector de reloj sobre los mismos transcripts), plantillas que piden pegar la línea nueva y dos frases de skill con su RED/GREEN.

**Tech Stack**: TypeScript sin compilar en Node ≥ 22.18.0, Vitest (`cli/test/`), Pester 5 para frases (`tests/`), sujetos headless de Claude Code.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks encadenadas por la línea `Esfuerzo real` que produce la Task 1, un error lo caza el test de su task o el GREEN, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulos ni dependencias; `clock.ts` es un fichero más del dominio `session`, y la salida nueva extiende la de un verbo existente.

## Restricciones globales

### De código

- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende; lo que se conserva es el porqué no deducible.
- Sin comentarios que citen documentos: nunca la constitution, una spec, una task, un requisito ni `capabilities/`.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes.
- Solo módulos `node:*`, sin `dependencies`; solo sintaxis TypeScript que se borra.
- Literales de la spec: `- Esfuerzo real: <h> h — reloj de la sesión <h> h desde <AAAA-MM-DDTHH:MMZ>, sin <n> min de espera al dev-lead (<n> esperas)`; con varias sesiones `reloj de <n> sesiones`; `- Estimación: <X>h (post hoc)`; `post hoc` en la columna Ratio.

### De proceso

- Política de modelos del Art. IV; `fable` y `opus xhigh` prohibidos.
- Los tests RED se escriben antes de la implementación de su task y van en su commit; el pre-commit corre la suite rápida.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; un commit por task tras su revisión.

## Review Focus

- Un transcript con un `AskUserQuestion` sin resultado (sesión cortada) → no suma espera ni rompe · Task 1, `ignora una pregunta sin respuesta`.
- Un mensaje del usuario antes de la primera respuesta del agente (el arranque) → no es espera · Task 1, `el primer mensaje no es espera`.
- Una fila `post hoc` sin estimado legible (`- Estimación: (post hoc)`) → estimado vacío, Ratio `post hoc`, sin aviso · Task 1, `post hoc sin cifra`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: la marca es texto en la línea que ya existe; el reloj reusa la búsqueda de transcripts.
- [x] **YAGNI gate**: sin desglose por fases (fila nueva tras la 0149).
- [x] **Brownfield gate**: `- Real:` y walkthroughs viejos se siguen leyendo.
- [x] **Constitution check**: Art. I (RED antes en la Task 3), Art. II (huecos en plantilla), Art. X, Art. XI.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/src/session/clock.ts` — reloj y esperas de los transcripts de la rama.
- `cli/test/session/clock.test.ts` y `cli/test/fixtures/session-tokens/clock/` — transcripts de fixture.
- `cli/test/estimation/post-hoc.test.ts` — fila `post hoc`, coste de sujetos y línea pegada en un patch.
- `tests/ClosingEstimation.Tests.ps1` — frases de las plantillas y de las dos skills.
- `tests/closing-estimation-red.md`, `tests/closing-estimation-green.md` — evidencia de los sujetos.

**Modificar**:

- `cli/src/estimation/artifacts.ts` — `Row.postHoc`, ratio nulo si `post hoc`.
- `cli/src/estimation/log.ts` — celda Ratio `post hoc`.
- `cli/src/session/session.ts`, `format.ts`, `measure.ts` — `clock` en `Session`, cuarta línea y clave `real`.
- `cli/test/session/tokens.test.ts` — las aserciones de tres líneas pasan a cuatro.
- `skills/sdd-templates/templates/patch-template.md`, `walkthrough-template.md`, `tasks-template.md`, `estimation-template.md`.
- `skills/sdd-end-patch/SKILL.md` (paso 1), `skills/sdd-end-feature/SKILL.md` (paso 2), `tests/SessionTokensClose.Tests.ps1`.
- `.docs/sdd/estimation.md`.

**NO se tocan**:

- `cli/src/session/usage.ts` — su lectura de respuestas sigue igual (decisión 3).
- `skills/sdd-start-patch/SKILL.md` — ya escribe estimación e inicio antes del fix.
- `cli/src/estimation/calibration.ts` y `releases.ts` — ya filtran por `ratio !== null` y suman todos los reales.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El formato del transcript cambia | media | el real sale mal | entradas desconocidas se ignoran; ejecución real en la Task 1 |
| El RED sale limpio en `p1` | baja | se recorta la guidance de `post hoc` | Art. I: se reencuadra y se avisa |

### 1.8 Rollout

Directo; release 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — CLI: `post hoc` en el log y esfuerzo real medido

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/estimation/post-hoc.test.ts`, `cli/test/session/clock.test.ts`, `cli/test/session/tokens.test.ts` (cuatro líneas)
**Superficies**: tooling
**Verificación**: `moon run cli:typecheck cli:test`

**Interfaces**:
- Consume: `readResponses(file, branch)` de `usage.ts`; `threadFiles` de `session.ts`.
- Produce: `interface Clock { hours: number; clockHours: number; start: string; waitMinutes: number; waits: number; sessions: number }`; `readClock(files: string[], branch: string): Clock | null` en `clock.ts`; `Session.clock: Clock | null`; `realLine(clock: Clock): string` en `format.ts`; `Row.postHoc: boolean`.

**Ficheros**: los de §1.1 de esta task.

- [ ] **Step 1: Tests RED**
  - `post-hoc.test.ts`, con `project()` y `row()` de `helpers.ts`:
    - patch con `- Estimación: 0,5h (post hoc)` y `- Real: 0,75h` → `row(...)` es `| 2026-10-09 | 0201 | patch | 0.5 | 0.75 | post hoc | — | — | — | — | <carpeta> |`.
    - ese patch más otro con ratio 2 → la cabecera dice `(ratio mediano real/estimado, 1 artefacto): **2**`.
    - `post hoc sin cifra`: `- Estimación: (post hoc)` → celda Est `—`, Ratio `post hoc`, `warnings` vacío.
    - patch con `- Coste de sujetos: 1,20 $ en 2 sujetos sonnet` → celda Sujetos `1.2`.
    - patch con `- Esfuerzo real: 0,82 h — reloj de la sesión 1,15 h desde 2026-10-14T12:26Z, sin 20 min de espera al dev-lead (2 esperas)` → Real `0.82`.
  - `clock.test.ts`, con `newWorktree(['clock'], null)` y el verbo `session tokens`:
    - fixture `clock/s5.jsonl`: usuario 12:26 (develop) → agente 12:27 (develop) → agente 12:40 (`feature/0181`) → usuario «sí» 12:58 → agente 13:05 → notificación `<task-notification>` 13:10 → agente 13:28 con `tool_use` `AskUserQuestion` id `q1` → `tool_result` `q1` 13:30 → agente 13:35; el 2026-10-14.
    - `--branch feature/0181` → la cuarta línea es `- Esfuerzo real: 0,82 h — reloj de la sesión 1,15 h desde 2026-10-14T12:26Z, sin 20 min de espera al dev-lead (2 esperas)`.
    - `--json` → `real` es `{ measured: true, hours: 0.82, clockHours: 1.15, start: '2026-10-14T12:26Z', waitMinutes: 20, waits: 2 }`.
    - con un segundo fichero `clock2/s6.jsonl` de la rama → `reloj de 2 sesiones`; con uno de otra rama → no cuenta.
    - `ignora una pregunta sin respuesta`; `el primer mensaje no es espera`.
  - `tokens.test.ts:99` y `:163`: las aserciones de `no medido` esperan cuatro líneas, la cuarta `- Esfuerzo real: no medido (<motivo>)`.
- [ ] **Step 2: Implementación** — `artifacts.ts`: `postHoc = /\(post hoc\)/i.test(estimateText ?? '')`, `ratio: null` si `postHoc`; `log.ts`: celda Ratio `post hoc` si `row.postHoc`. `clock.ts` con las reglas de las decisiones 4-6; `readSession` rellena `clock`; `reportLines` añade `realLine` como cuarta línea; `notMeasuredLines` añade `Esfuerzo real`; `toJson` añade `real`.
- [ ] **Step 3: Build** — `moon run cli:typecheck`.
- [ ] **Step 4: Verificación** — `moon run cli:test`, y `node cli/bin/sdd.js session tokens --path . --branch feature/0188-closing-estimation-templates` imprime las cuatro líneas con un real menor que el reloj.
- [ ] **Step 5: Commit de la task**.

### Task 2 — Plantillas y método

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `tests/ClosingEstimation.Tests.ps1` (frases de plantilla), `tests/SessionTokensClose.Tests.ps1`
**Superficies**: docs, tooling
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ClosingEstimation.Tests.ps1,tests/SessionTokensClose.Tests.ps1 -CI"`

**Interfaces**:
- Consume: la línea `- Esfuerzo real: …` de `sdd session tokens` y la marca `(post hoc)`.
- Produce: §5 de `patch-template.md` con `- Estimación:`, `- Inicio:`, `- Esfuerzo real:` y `- Coste de sujetos:`; `## Rulings` en `tasks-template.md`.

**Ficheros**: las cuatro plantillas, `.docs/sdd/estimation.md`, los dos Pester.

- [ ] **Step 1: Tests RED** — `ClosingEstimation.Tests.ps1`: `tasks-template.md` contiene `## Rulings` y `sdd ledger rulings`; §5 de `patch-template.md` contiene `(post hoc)`, `- Esfuerzo real:`, `sdd session tokens` y `- Coste de sujetos:`; `estimation-template.md` contiene `espera` y `post hoc`. `SessionTokensClose.Tests.ps1`: la sección 2 del walkthrough contiene `- Esfuerzo real:` con `sdd session tokens`.
- [ ] **Step 2: Implementación**
  - `patch-template.md` §5: `- Estimación:` dice que, si llega en el commit de cierre, lleva `(post hoc)` detrás; `- Real: <Yh>` pasa a `- Esfuerzo real:` pegada de `sdd session tokens --path <worktree> --branch <rama>`, y sin transcripts, aproximada con las marcas de los commits y dicho; `- Coste de sujetos: <X> $ en <n> sujetos <modelo> — <campaña> <X> $; … | no aplica`.
  - `walkthrough-template.md` §2: `- Esfuerzo real:` pegada de `sdd session tokens` (desde el arranque de la sesión que abrió el trabajo, sin las esperas al dev-lead); la aproximación con commits, solo sin transcripts.
  - `tasks-template.md`: `## Rulings` tras «Fixes adicionales», con ayuda: lo pega `sdd-implement` al cerrar con la salida de `sdd ledger rulings <plan>`; `_Ninguno_` si no hubo.
  - `estimation-template.md`: punto 2, el real cuenta desde el arranque de la sesión que abre el trabajo, con la investigación previa, y las esperas al dev-lead van aparte, con su duración (la línea de `sdd session tokens`); punto 3, la estimación que llega en el commit de cierre lleva `(post hoc)` y no calibra.
  - `.docs/sdd/estimation.md`: un párrafo con lo mismo, con fecha y feature 0188.
- [ ] **Step 3: Verificación** — el comando de «Verificación».
- [ ] **Step 4: Commit de la task**.

### Task 3 — Cierres: `post hoc` y la línea medida, con RED/GREEN

**Tras**: Task 2
**Modelo**: la sesión (Native); sujetos `claude -p --model sonnet`
**Tests RED**: hilo principal · sujetos `p1` (n = 2) y `f1` (n = 1) sobre el kit del commit de apertura; `tests/ClosingEstimation.Tests.ps1` (frases de las dos skills)
**Superficies**: skills, tooling
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ClosingEstimation.Tests.ps1,tests/SessionTokensClose.Tests.ps1 -CI"` y el GREEN (`p1` n = 2, `f1` n = 1)

**Interfaces**:
- Consume: §5 de `patch-template.md` y §2 de `walkthrough-template.md` de la Task 2; la cuarta línea de la Task 1.
- Produce: nada que use otra task.

**Ficheros**: `skills/sdd-end-patch/SKILL.md`, `skills/sdd-end-feature/SKILL.md`, `tests/ClosingEstimation.Tests.ps1`, evidencia en `tests/` y moldes en `.docs/sdd/specs/<esta carpeta>/red/` y `green/`.

- [ ] **Step 1: RED** — moldes sin `.git` (el lanzador hace `git init`, ramas y commits con `GIT_AUTHOR_DATE` distintos):
  - `p1`: proyecto con `.docs/sdd/` (`estimation.md`, `roadmap.md`, `changelog.md`, `sdd-kit.json` con `control.profile: delegate`, `validation.mode: field`, sin bloque `merge`), rama `feature/0042` con el commit del fix cuyo `patch.md` §5 tiene `- Inicio:` y no `- Estimación:`. Prompt: «Invoca la skill sdd-kit:sdd-end-patch y cierra el patch 0042. No fusiones.» Criterio: `patch.md` §5 lleva `- Estimación: … (post hoc)`; el real sale de `sdd session tokens` (se observa en el stream).
  - `f1`: feature en el paso de tiempo real de `sdd-end-feature`. Prompt: «Invoca la skill sdd-kit:sdd-end-feature y haz solo su paso 2 (tiempo real) del walkthrough de la 0042; no hagas nada más.» Criterio: §2 lleva las líneas pegadas, `Esfuerzo real` incluida.
  - Kit del RED: `git worktree add <scratchpad>/kit-red <commit de apertura>`, cargado con `--plugin-dir`. Evidencia en `tests/closing-estimation-red.md`. Si `p1` sale limpio, para: Art. I.
- [ ] **Step 2: Implementación** — `sdd-end-patch` paso 1: si la línea `- Estimación:` no está en el `patch.md` del commit del fix (`git show <fix>:<ruta>`), la escribes con `(post hoc)` detrás, con su motivo y el RED citado; el tiempo real es la línea `Esfuerzo real` de `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" session tokens --path <worktree> --branch <rama>`, pegada tal cual. `sdd-end-feature` paso 2: «pega sus cuatro líneas (`Esfuerzo real`, …)»; «lo anterior a crear la rama no cuenta» queda solo para los tokens, y el real cuenta desde el arranque de la sesión que abrió el trabajo. Frases en `ClosingEstimation.Tests.ps1`: `post hoc` y `git show` en el paso 1 de `sdd-end-patch`; `cuatro líneas` y `Esfuerzo real` en el paso 2 de `sdd-end-feature`.
- [ ] **Step 3: GREEN** — `p1` n = 2 y `f1` n = 1 con el kit del working tree; evidencia en `tests/closing-estimation-green.md`, con coste real frente a la previsión (9 $, techo 12 $).
- [ ] **Step 4: Verificación** — el comando de «Verificación».
- [ ] **Step 5: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: ~0,9 h
- Estimación de implementación: 2,5 h (rango 1,5–3,5)
- Base de la estimación: 3 tasks; la Task 1 con dos dominios de CLI y fixtures nuevas (~1 h); la 2, plantillas y frases (~0,4 h); la 3, dos moldes y 6 sujetos en paralelo, redacción de evidencia (~1,1 h). Condicionada al RED de `p1`.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`), con `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «La sesión mide el esfuerzo real sin las esperas al dev-lead» (THEN, AskUserQuestion, 2 sesiones, otra rama, `--json`, lectura por el log) → Task 1. ✓
- ADDED «Una estimación de patch escrita al cerrar queda `post hoc` y no calibra»: la escritura → Task 3 (`p1`); la fila, la exclusión → Task 1; las horas reales de la release → `releases.ts` sin cambios, suma todas las filas (comprobado en `releases.ts:69`). ✓
- ADDED «El patch registra el coste de sus sujetos» → Task 1 (test) y Task 2 (hueco). ✓
- MODIFIED «Sin transcripts, «no medido»» → Task 1. ✓
- MODIFIED «El cierre rellena los tokens y el coste de la sesión» → Task 2 (plantillas) y Task 3 (skills, `f1`). ✓
- `## Rulings` → Task 2. ✓
- Review Focus → Task 1, sus tres tests. ✓
- Delegate: cada escenario de la spec tiene su task; sin gate de plan. ✓
