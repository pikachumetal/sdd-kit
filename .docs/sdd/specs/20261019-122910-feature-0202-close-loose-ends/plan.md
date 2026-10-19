---
id: 20261019-122910-feature-0202-close-loose-ends
feature: 0202
title: Plan de implementación — Cierra lo que quedó abierto en la 0193 y la 0201
spec: ./spec.md
status: approved
created: 2026-10-19
---

# Plan de implementación — Cierra lo que quedó abierto en la 0193 y la 0201

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native en la sesión (Opus 5.5). Revisión final con los ejes Spec (`opus` + `sdd-kit:effort-high`) y Código (`sonnet` + `sdd-kit:effort-high`).
2. **«Ahora» inyectado**: `measureSession` recibe `now?: number`. La CLI pasa `Date.now()` y los tests de ventana llaman a `measureSession` directamente. No se añade una opción `--now` pública.
3. **Datos de git de la medición** en un módulo nuevo, `cli/src/session/branches.ts`:
   - `branchStart(root, branch)`: la entrada más antigua del reflog (`git reflog show --date=unix --format=%H %gd refs/heads/<rama>`), con su sha y su hora.
   - `lastMergeTime(root, branch, into)`: el commit de primer padre de `into` más reciente cuyo segundo padre es antecesor de la rama y no lo es del sha de inicio.
   - `mergeTimes(root, into, branches)`: el último merge de cada rama, para filtrar las respuestas de la ventana.
4. **Selector de respuestas**: `readResponses` y `readClock` pasan de recibir `branch: string` a recibir un `Selector`, con dos modos:
   - `{ branch, until? }`: el de hoy, con el corte en el último merge.
   - `{ window: { from, to, countable(branch, time) } }`: la ventana.

   El reloj de la ventana recorta cada transcript a `[from, to]`.
5. **Limpieza tras fusionar** en un módulo nuevo, `cli/src/merge/cleanup.ts`, con `cleanRegistries(worktree, before, report)`. Compara los ids repetidos del resultado con los de `before` (el sha de la rama destino antes del merge), usando la misma `identities` de `keyed.ts`, que pasa a exportarse. La llaman `mergeFeature` (tras `completeMergeAttempt`) y `syncBranch`.
6. **Aviso de id repetido** en `cli/src/roadmap/duplicates.ts`, con `duplicateIdWarnings(lines)`. Lo usan `twoPointRoadmapReport` y la rama de `ROADMAP.md` de `roadmapReport`.
7. **Mergiraf solo sobre código**: filtro `isCode(file)` (fuera de `.docs/` y que no acabe en `.md`) en `resolveConflicts`. `resolveConflicts` devuelve también si Mergiraf resolvió algo (`MergeAttempt.mergirafSolved`), y `mergeFeature` y la Task 2 lo usan para no omitir `--verify`.
8. **Riesgo alto**: la ventana de `session tokens`. Se cubre con tests de fixture para cada AND de la spec, con un repo git temporal y fechas fijadas con `GIT_COMMITTER_DATE`.
9. **Coste**: ~4 h. Sin sujetos.
10. **Review Focus**: 4 entradas; ver la sección.

**Goal**: cerrar los 12 puntos abiertos de la 0193 y la 0201 sin dejar nada diferido.

**Architecture**: dos módulos nuevos (`merge/cleanup.ts`, `session/branches.ts`) y uno pequeño (`roadmap/duplicates.ts`). El resto son cambios en los módulos que ya existen.

**Tech Stack**: CLI TypeScript sin build, Vitest.

**Spec**: `./spec.md`

**Ejecución**: native, porque las 5 tasks comparten `registries.ts` y `session/`, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — módulos nuevos dentro de dominios que ya existen (`merge`, `session`, `roadmap`), sin dependencia en `package.json` ni datos nuevos. Mergiraf ya era un binario externo.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación; texto humano (mensajes) en castellano con tildes.
- Literales:
  - `<fichero>: aviso: línea <n>: el id «<id>» ya está en la línea <m>`
  - `docs(registros): quita las filas repetidas del merge`, con el cuerpo `Filas: <ids>.`
  - `registros: no se pudo commitear la limpieza de filas repetidas`
  - `- Medición: por ventana — transcripts de <ruta> desde <AAAA-MM-DDTHH:MMZ> (la rama no tiene transcripts propios)`
  - `no medido (sin reflog de <rama>: no se sabe cuándo se creó)`
  - `mergiraf no está en el PATH: instálalo (tech-stack.md, «Herramientas del repo»)`
- Mergiraf solo sobre ficheros fuera de `.docs/` que no acaben en `.md`.

### De proceso

- Commits: tipo/scope en inglés, título y cuerpo en castellano, `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; uno por task.
- Hooks activos; nunca `--no-verify`.
- Los Minor de la revisión final entran en la pasada de fix (spec, punto 2).

## Review Focus

- Una respuesta de la ventana cuyo `gitBranch` es una rama fusionada después de esa respuesta → no cuenta · Task 4, `ventana: una rama fusionada después no cuenta`
- Una limpieza tras fusionar con un id que ya estaba repetido en la destino → no se toca · Task 3, `limpieza: un id ya repetido en la destino no se toca`
- Un `--verified-at` con docs que solo cambian en los registros y sin Mergiraf → se sigue omitiendo · Task 2, test que ya existe en `verified-at.slow.test.ts`
- Una rama fusionada dos veces (la segunda, el ticket) → corta en el último merge · Task 4, `rama: corta en el último merge`

---

## 2. Tasks

### Task 1 — `tech-stack.md`, su tope y Mergiraf obligatorio

**Tras**: —
**Modelo**: Native
**Ficheros**: `.docs/sdd/tech-stack.md`, `tests/WordBudget.Tests.ps1`, `cli/test/merge/mergiraf.slow.test.ts`
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/WordBudget.Tests.ps1 -CI"` → `Failed: 0`; `npx vitest run test/merge/mergiraf.slow.test.ts` → verde

- [ ] Dos líneas en `tech-stack.md`: en «Herramientas del repo», mergiraf 0.20.0 (`cargo binstall mergiraf` o `cargo install --locked mergiraf`) como dependencia de desarrollo del repo; y el descarte del merge driver. Medir y subir el tope de `tech-stack.md` en `WordBudget.Tests.ps1` a lo medido + 2 %, redondeado a la decena. La medida va en «Enmiendas» de la spec.
- [ ] En `mergiraf.slow.test.ts`: fuera los `describe.skipIf`; nuevo test `mergiraf está en el PATH`, que falla con el literal si `mergirafRuns()` es false.
- [ ] Commit `docs(tech-stack): Mergiraf obligatorio en el repo y descarte del merge driver`.

### Task 2 — Mergiraf solo sobre código y tests que faltaban

**Tras**: Task 1
**Ficheros**: `cli/src/merge/registries.ts`, `attempt.ts`, `steps.ts`, `run.ts`, `hotfix.ts`, `verify.ts`; tests `mergiraf.slow.test.ts`, `histogram.slow.test.ts` (nuevo), `hotfix.test.ts` (nuevo)
**Verificación**: `npx vitest run test/merge` → verde

- [ ] RED: `mergiraf no se lanza sobre un .md` (README en conflicto, sin línea `mergiraf:`); `mergiraf une dos imports cambiados en los dos lados` (`import { a, b }` + `import { a, c }`, `--verify` verde y resultado `{ a, b, c }`); `con mergiraf resuelto, --verified-at no omite --verify`; `histogram: mover c y cambiar c fusiona sin conflicto` (con `-X diff-algorithm=myers` daría conflicto: lo comprueba el propio test con git); `publishedBack con ls-remote 128 lanza «vuelta: no se pudo consultar»` (vi.mock).
- [ ] GREEN: `isCode` en `registries.ts`; `MergeAttempt.mergirafSolved`; `verifyMerge` no omite si `mergirafSolved`; `publishedBack` exportada.
- [ ] Commit `fix(cli): Mergiraf solo sobre código, verificado siempre, y tests de histogram y de la vuelta`.

### Task 3 — Ids repetidos

**Tras**: Task 2
**Ficheros**: `cli/src/roadmap/duplicates.ts` (nuevo), `check.ts`; `cli/src/merge/cleanup.ts` (nuevo), `keyed.ts`, `steps.ts`, `sync.ts`; tests `cli/test/roadmap/duplicates.test.ts`, `registries.slow.test.ts`, `sync.slow.test.ts`
**Verificación**: `npx vitest run test/roadmap test/merge` → verde

- [ ] RED (roadmap): `aviso de id repetido tras los fallos, código 0`; `Patches no se mira`; `ROADMAP.md con B1 repetido avisa con el prefijo ROADMAP.md`.
- [ ] RED (merge): `limpieza: fila idéntica en dos sitios queda una con commit propio`; `limpieza: filas distintas con el mismo id avisan sin commit`; `limpieza: un id ya repetido en la destino no se toca`; `limpieza: Added y Changed no se tocan`; `limpieza en --sync`; `limpieza: si el commit falla, el merge se deshace` (hook pre-commit que sale con 1 en el destino).
- [ ] GREEN: `duplicateIdWarnings`; `identities` exportada; `cleanRegistries`.
- [ ] Commit `feat(cli): ids repetidos avisados en roadmap check y limpiados tras sdd merge`.

### Task 4 — `session tokens` por ventana y con corte en el último merge

**Tras**: Task 3
**Ficheros**: `cli/src/session/branches.ts` (nuevo), `usage.ts`, `clock.ts`, `session.ts`, `measure.ts`, `format.ts`; tests `cli/test/session/window.slow.test.ts` (nuevo)
**Verificación**: `npx vitest run test/session` → verde

- [ ] RED, un test por AND: `rama: corta en el último merge`; `ventana: mide la sesión de la otra rama fusionada desde la creación`; `ventana: quinta línea y window en json`; `ventana: una rama viva en paralelo no cuenta`; `ventana: una rama fusionada después no cuenta`; `ventana: otra rama sin transcripts creada después la corta`; `ventana: sin reflog, no medido`; `ventana vacía: sin respuestas de la rama`.
- [ ] GREEN: `Selector`; `branches.ts`; `measureSession({ now })`; `format.ts`, la quinta línea.
- [ ] Commit `feat(cli): session tokens mide por ventana una rama sin transcripts propios`.

### Task 5 — Los menores de la 0201

**Tras**: Task 4
**Ficheros**: `cli/src/merge/mergiraf.ts`, `registries.ts`, `attempt.ts`, `keyed.ts`; tests `sync.slow.test.ts`, `destination.slow.test.ts`, `keyed.test.ts`, `registries.slow.test.ts`
**Verificación**: `npx vitest run test/merge` → verde

- [ ] (b) test `destino sacado con un fichero sin seguimiento`; (c) aserción de `HEAD` en el test del HEAD desacoplado; (d) `onSolved` y `onUnsolved`; (e) sin `void`; (f) `abortedMergeError` con early return; (g) test de `mergeKeyedHunk` con la cabecera en los dos lados; (h) cabeceras desde `:1:`, con el test `cabecera separada de su separador`.
- [ ] Commit `refactor(cli): menores de sdd merge diferidos de la 0201`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 4 h
- Base de la estimación: 5 tasks; la ventana de session tokens es lo nuevo con más casos; la 0193 y la 0201 salieron en el 30 % de lo estimado
- Confianza: media

## 3. Validación final

- [ ] Gate de cierre: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Cada THEN y AND de la spec con su test (§4)
- [ ] Revisión final con su pasada de fix, Minor incluidos
- [ ] Cierre con `sdd-archive` y `sdd merge --push`

## 4. Self-review (cobertura spec → tasks)

- control-profiles «Tras fusionar…»: THEN y los 4 AND → Task 3, los tests de limpieza. ✓
- «Mergiraf resuelve…», los 3 AND nuevos → Task 2. ✓ La excepción de la regla ante conflicto → test de los dos imports. ✓
- «Los registros se unen por id», AND de la cabecera → Task 5 (h). ✓
- roadmap «Un id repetido…»: THEN y los 2 AND → Task 3. ✓
- estimation «Con `--branch`…», AND del corte → Task 4. ✓ «Sin transcripts…», AND de la ventana vacía → Task 4. ✓ «Una rama sin transcripts…», THEN y los 5 AND → Task 4. ✓
- Punto 6 (Mergiraf obligatorio) y punto 7 (tope) → Task 1. ✓
- Puntos 10 y 11 → Task 2. ✓ Punto 12 → Task 5. ✓
