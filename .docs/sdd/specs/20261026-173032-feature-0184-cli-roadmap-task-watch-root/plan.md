---
id: 20261026-173032-feature-0184-cli-roadmap-task-watch-root
feature: 0184
title: Plan de implementación — CLI: columnas del roadmap, task start lite, vigía reanudado y raíz del proyecto
spec: ./spec.md
status: draft
created: 2026-10-26
---

# Plan de implementación — CLI: columnas del roadmap, task start lite, vigía reanudado y raíz del proyecto

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa las cinco tasks; la revisión final, en ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`; Arquitectura no (ver abajo).
2. Ejecución: native (motivo en la línea `Ejecución`).
3. Las líneas de test fallido salen de una función pura `failedTestLines` en `cli/src/merge/verify.ts`, que también usa `attempt.ts`: un solo sitio para el patrón de Pester y Vitest.
4. `--project-root` se resuelve con un helper `rootOption` en `cli/src/cli/args.ts`; la pista de `--path`/`--root` desconocidos, en `toUsageError`, que ya recibe el verbo a través de `parseVerbArgs`.
5. Riesgo alto: el check de celdas puede sacar filas rotas en el `roadmap.md` del repo, y el pre-commit las bloquearía; la Task 1 las arregla en su commit.
6. Coste: ~3 h de implementación; revisión final ~$5 (dos ejes).
7. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: los seis arreglos de la CLI de la spec, cada uno con su test en `cli/test/`.

**Architecture**: cada arreglo en el módulo del verbo que falla, sin módulos nuevos; las opciones nuevas en el `options` de cada verbo y su resolución en `cli/src/cli/args.ts`.

**Tech Stack**: TypeScript ejecutado por Node 22.18 (type stripping), Vitest 5; tests en `cli/test/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 5 tasks independientes entre sí (ninguna consume la interfaz de otra), cada error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulos, dependencias ni contratos entre módulos; las opciones nuevas son alias de las de hoy.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario; se conserva el *porqué* no deducible. La ayuda de `--help` no es un comentario.
- Art. X: sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`).
- Art. X: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. Mensajes en castellano con tildes.
- `cli/package.json` sin `dependencies`.
- Literales exactos: `línea <n>: la fila tiene <X> celdas y la cabecera <Y>`; `línea <n>: apunta a <ids>, ya ✅: sáldala` (ids separadas por `, `; el prefijo `aviso: ` lo pone el check); `tests fallidos:`; `--<opción> y --project-root no van juntas`; `opción desconocida: «--<opción>»; la raíz del proyecto va en --project-root`.

### De proceso

- Política de modelos del Art. IV; `fable` y `opus xhigh` prohibidos.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Cada task se abre con `sdd task start` y se cierra con `sdd task done … -- <Verificación>`.

## Review Focus

- Una fila con `\|` escapado dentro de un código (`` `a \| b` ``) → no cuenta como celda; no da problema · Task 1, `does not count an escaped pipe`
- `roadmap check --project-root <raíz>` sin `.docs/sdd` en la raíz → el mismo mensaje que `--path` a una carpeta inexistente (`Sin roadmap que validar`), no una excepción · Task 4, `project-root resolves the docs folder`
- La salida de un hook con más de 20 líneas de test fallido → solo las 20 primeras, en orden · Task 5, `caps the failed test lines at 20`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: cada arreglo en su módulo; un helper para las opciones y una función pura para los tests fallidos.
- [x] **YAGNI gate**: `rootOption` tiene 7 usos; `failedTestLines`, 2.
- [x] **Brownfield gate**: retrocompatible: `--path` y `--root` siguen; los mensajes de hoy no cambian sin líneas de test fallido.
- [x] **Constitution check**: Art. I (sin skills editadas), Art. X (restricciones arriba).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `cli/src/roadmap/tables.ts` — `cellCountProblems` compara también cada fila con la cabecera.
- `cli/src/roadmap/warnings.ts` — aviso de filas que apuntan a una tarea ✅ (roadmap 2.x).
- `cli/src/tasks/brief.ts` — spec lite como brief.
- `cli/src/watch/events.ts` — `isFinished` mira si hay un `user` tras el último `end_turn`.
- `cli/src/cli/args.ts` — `rootOption` y la pista de `--path`/`--root`.
- `cli/src/{roadmap,capabilities,decisions,estimation,init,upgrade,session}/verbs.ts` — declaran `project-root` y usan `rootOption`.
- `cli/src/merge/verify.ts`, `cli/src/merge/attempt.ts` — `tests fallidos:` antes de la cola.
- `.docs/sdd/roadmap.md` — solo si el check nuevo saca filas rotas.
- Tests: `cli/test/roadmap/check.test.ts`, `cli/test/roadmap/debt.test.ts`, `cli/test/tasks/` (fichero nuevo `brief.test.ts`), `cli/test/watch/watch.test.ts`, `cli/test/cli.test.ts`, `cli/test/merge/verify.test.ts`, `cli/test/merge/attempt.test.ts`.

**NO se tocan**:

- `skills/` — siguen nombrando `--path .docs/sdd`, que funciona.
- `cli/src/watch/verbs.ts` — `watch command --path` es un log, no la raíz.

### 1.6 Dependencias

Ninguna nueva.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El check de celdas saca filas rotas en `roadmap.md` | media | el pre-commit bloquea el commit | Task 1 corre el check sobre el repo y arregla las filas en su commit |
| La 0221 añade un verbo con `--path` en paralelo | baja | ese verbo no tendría `--project-root` | se ve al integrar la base en el cierre; si llega, se le añade |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `roadmap check`: celdas por fila y filas que apuntan a una tarea ✅

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/roadmap/check.test.ts`, `cli/test/roadmap/debt.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/roadmap` → `Tests  N passed (N)`; `node cli/bin/sdd.js roadmap check --path .docs/sdd` → última línea `Roadmap válido`

**Interfaces**:
- Consume: `cells`, `rowsOf`, `openRows`, `CLOSING_PREFIX` de hoy.
- Produce: nada para otras tasks.

**Ficheros**: modificar `cli/src/roadmap/tables.ts`, `cli/src/roadmap/warnings.ts`; tests.

- [ ] **Step 1: Implementación**
  - `cellCountProblems(lines, block)`: además de cabecera contra separador, cada fila de `rowsOf` con `cells(line).length !== headerCells` da `línea ${row.index + 1}: la fila tiene ${X} celdas y la cabecera ${Y}`.
  - `roadmapWarnings(lines, blocks)` suma `pointerWarnings(lines, blocks)`: ids ✅ = `openRows` cuyo último celda empieza por `✅` (celda 0 = id). Filas ⏳ de `openRows` cuyo `cells[1]` contiene `**Absorbida por …**` y no empieza por el prefijo de saldada; ids = las `\d{4}` tras `→` dentro de ese tramo en negrita, o la `\d{4}` de `Absorbida por la <id>` si no hay flecha (sin contar ids dentro de un enlace `[…](…)`). Filas de «Deuda técnica» cuyo `cells[2]` empieza por `**Actuar → ` y `cells[0]` no empieza por `**[`; ids = las `\d{4}` del tramo en negrita. Avisa si `ids.length > 0` y todas están ✅: `línea ${n}: apunta a ${ids.join(', ')}, ya ✅: sáldala`.
  - Tests (`check.test.ts`): `flags a row with an extra empty cell` (fila `| 3 | Piloto . || ✅ |` → `roadmap.md: línea <n>: la fila tiene 4 celdas y la cabecera 3`, código 1); `flags an unescaped pipe inside code in a debt row` (→ `la fila tiene 4 celdas y la cabecera 3`); `does not count an escaped pipe`; `warns of a row absorbed by a closed task` (escenario de la spec: avisos de las líneas de `0047` y de la deuda, ninguno de `0048`, `Roadmap válido`, código 0); `does not warn of a settled or deferred pointer`. `debt.test.ts`: `flags a debt.md row with a different cell count`.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit`. Esperado: sin errores.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; si el roadmap del repo da filas rotas, arreglarlas.
- [ ] **Step 4: Commit de la task** — `fix(cli): roadmap check compara las celdas de cada fila y avisa de filas que apuntan a una tarea cerrada`.

### Task 2 — `task start` con spec lite

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/tasks/brief.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/tasks/brief` → `Tests  N passed (N)`

**Interfaces**:
- Consume: `extractTask`, `writeBrief` de hoy.
- Produce: `isLiteSpec(text: string): boolean` en `cli/src/tasks/brief.ts`.

**Ficheros**: modificar `cli/src/tasks/brief.ts`; crear `cli/test/tasks/brief.test.ts`.

- [ ] **Step 1: Implementación** — `isLiteSpec`: frontmatter (entre el primer `---` y el siguiente) con una línea `mode: lite` (admite comentario tras el valor). En `writeBrief`, con spec lite, el brief es el texto entero. Tests: `isLiteSpec` true con `mode: lite`, false con `mode: full` y sin frontmatter; `writes the whole lite spec as the brief` (con `out` en un temp dir: el fichero es igual a la spec); `keeps the not-found error without mode lite` (`/task 1 not found in .* \(no heading matching 'Task 1'\)/`).
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit`.
- [ ] **Step 3: Verificación** — el comando de «Verificación»; smoke: `node cli/bin/sdd.js task start <spec lite de una feature cerrada> 1` → `brief:` y `base:`, código 0.
- [ ] **Step 4: Commit de la task** — `fix(cli): task start admite una spec lite como brief`.

### Task 3 — El vigía no da por terminado un subagente reanudado

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/watch/watch.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/watch/watch` → `Tests  N passed (N)`

**Interfaces**:
- Consume: `isFinished(events)`, `subagentVerdict` de hoy.
- Produce: nada.

**Ficheros**: modificar `cli/src/watch/events.ts`; test.

- [ ] **Step 1: Implementación** — `isFinished`: índice del último evento `assistant`; terminado si su `stop_reason` es `end_turn` y ningún evento posterior es `type: 'user'`. Test `does not finish a subagent resumed after end_turn`: transcript con `assistant end_turn` + `user` (texto de la reanudación) → `subagentVerdict(...).status` es `EN MARCHA` (fichero recién escrito); el test de hoy de `TERMINADO` sigue verde.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit`.
- [ ] **Step 3: Verificación** — el comando de «Verificación».
- [ ] **Step 4: Commit de la task** — `fix(cli): el vigía no da por terminado un subagente reanudado`.

### Task 4 — `--project-root` en todo verbo que sitúa el proyecto

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/cli.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/cli.test.ts test/docs-claims.test.ts` → `Tests  N passed (N)`

**Interfaces**:
- Consume: `parseVerbArgs`, `requiredOption`, `text` de `cli/src/cli/args.ts`.
- Produce: `rootOption(args: VerbArgs, legacy: 'path' | 'root', toLegacy: (root: string) => string): string | null` — el valor de `legacy`, o `toLegacy(project-root)`; con los dos, `UsageError('--<legacy> y --project-root no van juntas')`.

**Ficheros**: modificar `cli/src/cli/args.ts` y los `verbs.ts` de `roadmap` (check), `capabilities` (index, check, merge), `decisions` (check, index), `estimation` (log), `init`, `upgrade`, `session` (tokens); test.

- [ ] **Step 1: Implementación**
  - Verbos de documentos: `rootOption(args, 'path', (root) => join(root, '.docs', 'sdd'))`; si es `null`, `falta la opción --path` como hoy.
  - `estimation log`, `init`, `upgrade`: `rootOption(args, 'root', (root) => root)`; `session tokens`: `rootOption(args, 'path', (root) => root)`; el default de hoy si es `null`.
  - `toUsageError(error, verb)`: con `ERR_PARSE_ARGS_UNKNOWN_OPTION`, token `--path` o `--root` y `'project-root' in verb.options`, añade `; la raíz del proyecto va en --project-root`.
  - Tests (`cli.test.ts`, por proceso como los de uso de hoy): `project-root resolves the docs folder` (`roadmap check --project-root <tmp>` = salida de `--path <tmp>/.docs/sdd`; sin `.docs/sdd` → `Sin roadmap que validar`); `capability index` y `decision check` igual; `estimation log --project-root` = `--root`; `session tokens --project-root` = `--path`; `rejects path with project-root` (código 2 y `--path y --project-root no van juntas`); `rejects root with project-root` en `upgrade`; `hints project-root on merge --path` (código 2 y `opción desconocida: «--path»; la raíz del proyecto va en --project-root`).
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit`.
- [ ] **Step 3: Verificación** — el comando de «Verificación».
- [ ] **Step 4: Commit de la task** — `fix(cli): --project-root en todos los verbos que sitúan el proyecto`.

### Task 5 — `sdd merge` dice qué test falló

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/merge/verify.test.ts`, `cli/test/merge/attempt.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/merge/verify.test.ts test/merge/attempt.test.ts` → `Tests  N passed (N)`

**Interfaces**:
- Consume: `abortedMergeError`, `runVerification` de hoy.
- Produce: `failedTestLines(lines: string[]): string[]` y `failureReport(lines: string[]): string` en `cli/src/merge/verify.ts`: `failureReport` = (`tests fallidos:` + hasta 20 líneas de `failedTestLines`, si hay) + las últimas 20 líneas.

**Ficheros**: modificar `cli/src/merge/verify.ts`, `cli/src/merge/attempt.ts`; tests.

- [ ] **Step 1: Implementación** — patrón de línea fallida: `/(?:^|\s|\|)(?:\[-\]|×|FAIL)\s/`. `runVerification` y `abortedMergeError` usan `failureReport` en lugar de su `slice(-20)`. Tests (`verify.test.ts`): `picks the Pester failed line` (`[-] se llama sdd-archive 12ms` entre líneas `[+]`); `picks Vitest failures behind a moon prefix` (`cli:test |  FAIL  test/a.test.ts > grupo > nombre` y `cli:test |    × nombre 3ms`); `caps the failed test lines at 20`; `keeps the plain tail without failed tests` (`failureReport` = las 20 últimas, sin `tests fallidos:`). `attempt.test.ts`: si `abortedMergeError` no se puede probar sin git, el test va en `failureReport` y el hilo lo comprueba con el diff.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit`.
- [ ] **Step 3: Verificación** — el comando de «Verificación».
- [ ] **Step 4: Commit de la task** — `fix(cli): sdd merge saca los tests fallidos antes de la cola`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 3h
- Base de la estimación: 5 tasks pequeñas e independientes en la CLI, cada una con su test; la incertidumbre es cuántas filas rotas saca el check en `roadmap.md`
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- roadmap MODIFIED: THEN de cabecera y estados, AND de fila suelta/vacía/separador, AND de números de línea → tests de hoy de `check.test.ts`. ✓
- roadmap MODIFIED: AND `. || ✅ |`, `|` sin escapar, `\|` escapado, `ROADMAP.md` y `debt.md` → Task 1, `flags a row with an extra empty cell`, `flags an unescaped pipe inside code in a debt row`, `does not count an escaped pipe`, `flags a debt.md row with a different cell count`; `ROADMAP.md` comparte `tableBlockProblems` (sin test propio: mismo código que `debt.md`). ✓
- roadmap ADDED: THEN avisos de 0047 y deuda, ninguno de 0048 → Task 1, `warns of a row absorbed by a closed task`. ✓
- roadmap ADDED: AND saldada o 🧪 no avisa → Task 1, `does not warn of a settled or deferred pointer`. ✓
- roadmap ADDED: AND `Roadmap válido` y 0 → Task 1, `warns of a row absorbed by a closed task`. ✓
- control-profiles MODIFIED: THEN, AND de error, conflicto, `bloqueado:`, `base:` → sin cambio, tests de hoy de `cli/test/merge/`. ✓
- control-profiles MODIFIED: AND hook con tests fallidos y cola; AND `tests fallidos:` con Pester, Vitest, moon, tope 20, sin ninguna → Task 5, sus cuatro tests. ✓
- cli ADDED task start lite: THEN y AND sin lite → Task 2, `writes the whole lite spec as the brief`, `keeps the not-found error without mode lite`, y el smoke de `brief:`/`base:`. ✓
- cli ADDED vigía: THEN y AND → Task 3, `does not finish a subagent resumed after end_turn` y el test de `TERMINADO` de hoy. ✓
- cli ADDED `--project-root`: THEN por familia, AND las dos a la vez, AND pista en `merge --path` → Task 4, sus tests. `init --project-root` sin test propio: mismo `rootOption` que `upgrade`. ✓
- cli Reglas «Avisos» → Task 4 (los dos literales nuevos). ✓
- Review Focus → Task 1, Task 4, Task 5 (tests nombrados). ✓
