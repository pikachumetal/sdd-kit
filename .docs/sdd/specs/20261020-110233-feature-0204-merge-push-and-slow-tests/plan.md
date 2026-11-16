---
id: 20261020-110233-feature-0204-merge-push-and-slow-tests
feature: 0204
title: Plan de implementación — sdd merge dice qué publica de más, y la suite lenta deja de pasarse de tiempo
spec: ./spec.md
status: approved
created: 2026-10-20
---

# Plan de implementación — sdd merge dice qué publica de más, y la suite lenta deja de pasarse de tiempo

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native en la sesión (Opus 5.5). Revisión final con los ejes Spec (`opus` + `sdd-kit:effort-high`) y Código (`sonnet` + `sdd-kit:effort-high`).
2. **Commits ajenos** en `cli/src/merge/steps.ts`:
   - `unpublishedCommits(worktree, remote, into): Promise<string[]>` devuelve `git log --format=%h %s <remote>/<into>..HEAD`, y `[]` sin remoto.
   - `unpublishedLines(into, branch, commits): string[]` da la cabecera en singular o plural y una línea `- <hash> <asunto>` por commit, o `[]` si no hay commits.
   - `integrate` (`run.ts`) lo calcula tras `syncBaseBranch` y antes de `mergeFeature`, y `reportMerge` lo escribe antes de `publicado en`.
   - En el hotfix, `integrateHotfix` lo calcula para la rama estable y para la de vuelta tras sus sincronizaciones, y `report` lo escribe antes de `publicado en`.
3. **stderr en el error de push**: `pushDestination` y `pushAll` añaden `\n<stderr recortado>` al `DomainError`, solo si el stderr no está vacío.
4. **Workers**: `--maxWorkers 8` en los `args` de `test-slow` y `test-min` de `cli/moon.yml`.
5. **Coste**: ~1,5 h. Sin sujetos.

**Goal**: que el cierre nombre lo que publica de más, que un push rechazado diga por qué y que la suite lenta no se pase de tiempo con carga.

**Architecture**: sin módulos nuevos; dos funciones en `steps.ts`.

**Tech Stack**: CLI TypeScript sin build, Vitest, moon.

**Spec**: `./spec.md`

**Ejecución**: native, porque las 2 tasks son pequeñas, independientes y caben en un contexto; un error lo caza el test de su task. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para el eje Spec de la revisión final.

**Eje Arquitectura**: no — ni módulos, ni dependencias, ni contratos entre módulos nuevos.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos; nombres en inglés; funciones ≤ 20 líneas y ≤ 3 parámetros; mensajes en castellano con tildes.
- Literales:
  - `push: también publica 1 commit de '<destino>' que no es de <rama>:`
  - `push: también publica <n> commits de '<destino>' que no son de <rama>:`
  - `- <hash corto> <asunto>`

### De proceso

- Commits: tipo/scope en inglés, título y cuerpo en castellano, `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; uno por task.
- Hooks activos; nunca `--no-verify`.

## Review Focus

- Un reintento del push que integra commits de la remota → no salen en la línea · Task 2, `push-retry`: `si la rama destino avanzó durante la verificación integra y publica` sin la línea nueva
- Un merge sin `--push` con commits locales en la destino → no sale la línea · Task 2, `sin --push no nombra los commits locales`

---

## 2. Tasks

### Task 1 — Suite lenta con 8 workers y stderr en el error de push

**Tras**: —
**Ficheros**: `cli/moon.yml`, `cli/src/merge/steps.ts`, `cli/src/merge/hotfix.ts`, `.docs/sdd/tech-stack.md`; test `cli/test/merge/push-retry.slow.test.ts`
**Verificación**: `pnpm exec vitest run test/merge/push-retry.slow.test.ts --test-timeout 120000` → verde

- [ ] RED: en `un rechazo sin que la rama destino avance falla sin reintentar`, el `pre-receive` escribe `rama protegida` en stderr, y el test espera `remote: rama protegida` en la salida.
- [ ] GREEN: el stderr en `pushDestination` y `pushAll`.
- [ ] `--maxWorkers 8` en `cli/moon.yml`; una frase en «Conjunto rápido y tests lentos» de `tech-stack.md` con el porqué medido.
- [ ] Commit `fix(cli): la suite lenta corre con 8 workers y el error de push dice lo que contestó git`.

### Task 2 — El push nombra los commits ajenos

**Tras**: Task 1
**Ficheros**: `cli/src/merge/steps.ts`, `run.ts`, `hotfix.ts`; `skills/sdd-archive/references/merge-recipe.md`; tests `push-retry.slow.test.ts`, `hotfix.slow.test.ts`
**Verificación**: `pnpm exec vitest run test/merge --test-timeout 120000` → verde

- [ ] RED: `con un commit local en develop lo nombra antes de publicado en` (singular); `con dos commits locales los nombra en plural`; `sin --push no nombra los commits locales`; `sin commits locales no sale la línea` (aserción en un test que ya existe); en el reintento, la línea no sale; en el hotfix, `un commit local en develop sale en la línea de develop`.
- [ ] GREEN: `unpublishedCommits` y `unpublishedLines`, llamadas desde `integrate`, `reportMerge`, `integrateHotfix` y `report`.
- [ ] La fila de `merge-recipe.md`, «Its outputs».
- [ ] Commit `feat(cli): sdd merge --push nombra los commits de la destino que no son del cambio`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1 h (con las medidas de la 104)
- Estimación de implementación: 1,5 h
- Base de la estimación: 2 tasks pequeñas en código conocido; la 0201 y la 0202 salieron en el 30-50 % de lo estimado
- Confianza: media

## 3. Validación final

- [ ] Gate de cierre: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Cada THEN y AND de la spec con su test (§4)
- [ ] La medida de la suite lenta repetida con `cli:test-slow` de la rama
- [ ] Revisión final con su pasada de fix
- [ ] Cierre con `sdd-archive` y `sdd merge --push`

## 4. Self-review (cobertura spec → tasks)

- ADDED «El push nombra…»: el THEN → Task 2, singular; AND plural → Task 2; AND sin commits, sin `--push` o sin remoto → Task 2 (sin remoto: `unpublishedCommits` devuelve `[]`, test con `fx` sin remoto si existe el patrón, si no, se cubre con la guarda de `reportMerge` y se dice en el walkthrough); AND reintento → Task 2; AND hotfix → Task 2. ✓
- MODIFIED «El push del cierre reintenta…»: el AND del stderr → Task 1; el hotfix → Task 1, `pushAll`. ✓
- Decisión 1 (workers) → Task 1 y la medida de la validación final. ✓
