---
id: 20261015-105728-feature-0187-closing-cli
feature: 0187
title: Plan de implementación — CLI del cierre
spec: ./spec.md
status: done
created: 2026-10-15
---

# Plan de implementación — CLI del cierre: `sdd merge` para el hotfix, el destino sacado, la base en rojo, la suite una vez y el push que reintenta

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, en la sesión (Opus 5.5). La revisión final, con los ejes de `sdd-verify`: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`. No hay eje Arquitectura.
2. **Ejecución**: Native, porque las 5 tasks van encadenadas por `integrate` de `cli/src/merge/run.ts`, un error lo caza el test lento de su task y el plan cabe en un contexto.
3. **Registros** por nombre de fichero, sin mirar la carpeta: `/^(roadmap|changelog|estimation-log)\.md$/i` sobre el `basename`. Así entran `ROADMAP.md` y `CHANGELOG.md` en la raíz, como resuelve `layout.ts`.
4. **El texto de las salidas** sale de una función pura, `destinationExits(into, path, files)`, que se prueba sin repos.
5. **«Último commit verificado»** en el bucle del push: el `HEAD` tras la última verificación que pasó, o el `--verified-at` si se omitió. Se guarda en `integrate` como variable local.
6. **El hotfix compone** `integrate` dos veces bajo un cerrojo, con una función `undoAll` que resetea cada destino a su commit inicial y borra la etiqueta. El push atómico sale de la segunda pasada.
7. **Coste**: unas 4 h de implementación, sin subagentes salvo los dos de la revisión final (~250k tokens).
8. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que `sdd merge` dé salidas accionables al destino sacado y a un rojo, no repita la suite ni se rinda a un push movido, y fusione un hotfix con git-flow en un comando.

**Architecture**: todo dentro de `cli/src/merge/`. `withDestination` gana un modo de solo comprobación. `integrate` gana el salto de verificación, la pasada sobre la base y el bucle del push. Un módulo nuevo, `hotfix.ts`, compone dos destinos con la etiqueta y el deshacer.

**Tech Stack**: TypeScript sobre Node ≥ 22.18 sin dependencias, Vitest (`*.test.ts` rápidos, `*.slow.test.ts` con repos y procesos).

**Spec**: `./spec.md`

**Ejecución**: native, porque 5 tasks encadenadas por `integrate` de `run.ts`, un error lo caza el test lento de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el interior de `cli/src/merge/`, sin módulo, dependencia ni contrato entre módulos nuevos; las opciones nuevas son del verbo que ya existe.

## Restricciones globales

### De código

- Las llamadas de hoy sin opciones nuevas se comportan igual: los tests de `cli/test/merge/` siguen en verde sin tocarlos, salvo el texto de destino sacado.
- Literales de la spec, exactos (castellano, comillas simples alrededor de ramas y rutas):
  - `destino sacado: el checkout de '<into>' en '<ruta>' tiene cambios sin commitear; el merge se haría encima de ellos, así que no se toca.`
  - `sin seguimiento: <ficheros separados por ', '>`
  - `Salidas:` · `1. Que quien los hizo los commitee (o los descarte) en '<ruta>', y relanzar el merge.` · `2. Llevarlos a la rama de la feature: solo tocan registros (roadmap, changelog, estimation-log).` · `<n>. Dejar el merge para luego.`
  - `destino: listo: '<into>' sacado en '<ruta>', sin cambios` · `destino: listo: '<into>' irá en el worktree temporal '<ruta>'`
  - `verificación: omitida: desde <sha corto> solo cambian docs` · `--verified-at: '<valor>' no es un commit`
  - `base: en rojo: el mismo comando también falla sin la rama (salida en <log>); mira la deuda del proyecto antes de investigar` · `base: en verde: el rojo lo trae la rama`
  - `push: '<into>' avanzó en '<remoto>'; integro y reintento (<n>/3)` · `push: '<into>' sigue moviéndose en '<remoto>' tras 3 intentos; relanza el merge en un rato`
  - `--into '<rama>' distinta de merge.into necesita --order "<frase del dev-lead>"` · `--tag solo con --into a la rama estable` · `--tag: ya existe '<nombre>'`
  - `--into: a '<into>' solo llegan ramas hotfix/ o release/ (git-flow); '<rama>' no lo es`
  - `vuelta: hay varias ramas release/ abiertas (<lista separada por ', '>); fusiona a mano`
  - `vuelta: conflicto en <ficheros>; se deshacen el merge en '<into>' y la etiqueta: porta el arreglo a '<vuelta>' a mano`
  - `push: '<into>' o '<vuelta>' avanzó en '<remoto>'; relanza el hotfix`
  - Commit: título `merge: <rama> en <destino>`, cuerpo `Orden del dev-lead: «<frase>»` y `Fusión hecha con sdd merge (sdd-kit).`; etiqueta anotada con mensaje `<tag> — <rama>`.
  - Salida: `Fusionado <rama> en <destino>: <hash corto>` · `etiqueta <tag> en <hash corto>` · `publicado en <remoto>`.
- 3 intentos de push como máximo; en el hotfix, uno.
- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos (spec, task, capacidad); los tests con nombres en castellano como los de `cli/test/merge/`.
- Un error de uso es `UsageError` (sale con 2); uno de dominio, `DomainError` (sale con 1).

### De proceso

- Native: la sesión implementa; la revisión final despacha los ejes Spec y Código.
- Un commit por task al quedar limpia, `feat(cli): …` en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Cada task corre su verificación; el gate completo, una vez en §3.

## Review Focus

- `--verified-at` con un sha de otra rama no antecesor de `HEAD` → el diff se calcula igual y, si cambia código, verifica: no se exige ancestría · Task 2, `verifica si desde el sha cambió código de la base`.
- Destino sacado con ficheros solo sin seguimiento → no hay `diff --stat` pero sí la línea `sin seguimiento:` y las salidas · Task 1, `lista los ficheros sin seguimiento aunque no haya diff`.
- Un push rechazado cuyo reintento encuentra un conflicto al integrar → falla con `base: conflicto en …` como al empezar, con la rama destino como estaba · Task 4, `un conflicto al reintegrar deja la rama destino como estaba`.
- Un hotfix con `--check` → comprueba los dos destinos y las negativas de git-flow sin coger el cerrojo · Task 5, `--check del hotfix comprueba los dos destinos`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: cada pieza va en la función que ya existe (`withDestination`, `runVerification`, `pushDestination`); lo único nuevo es `hotfix.ts`.
- [x] **YAGNI gate**: sin clave de rama estable ni bucle en el hotfix.
- [x] **Brownfield gate**: opciones nuevas opcionales; los tests de hoy quedan.
- [x] **Constitution check**: Art. I (solo CLI: Vitest, sin RED de skill), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/src/merge/exits.ts` — `destinationExits` y `isRegistry`: el texto del destino sacado.
- `cli/src/merge/hotfix.ts` — `mergeHotfix`: validaciones de git-flow, release abierta, merge en la estable, etiqueta, vuelta, push atómico y deshacer.
- `cli/test/merge/exits.test.ts`, `cli/test/merge/destination.slow.test.ts`, `cli/test/merge/hotfix.slow.test.ts`.

**Modificar**:

- `cli/src/merge/destination.ts` — mensaje nuevo; `checkDestination` para `--check`.
- `cli/src/merge/run.ts` — opciones nuevas en `MergeOptions`; `integrate` con salto, base en rojo y bucle; despacho a `mergeHotfix` y a `--check`.
- `cli/src/merge/verify.ts` — `runVerification` devuelve el log al fallar para la pasada de la base; `verificationSkipped`.
- `cli/src/merge/steps.ts` — `pushDestination` distingue «avanzó» de otros rechazos; `mergeFeature` acepta título, cuerpo y `noFf`.
- `cli/src/merge/verbs.ts` — opciones `check`, `verified-at`, `into`, `order`, `tag`.
- `cli/test/merge/failures.slow.test.ts`, `verify.slow.test.ts`, `lock-and-base.slow.test.ts`, `usage.test.ts`.
- `.docs/sdd/roadmap.md` — fila 0191 y la 0187 sin el punto (f) (commit de apertura).
- `.docs/sdd/specs/20261007-144256-proposal-0131-kit-rework/proposal.md` — enmienda del reparto (commit de apertura).

**NO se tocan**:

- `skills/**` — la receta que usa las opciones nuevas es la de `sdd-archive` (0149).
- `cli/src/capabilities/**` — el punto (f) es la 0191.

### 1.6 Dependencias

Ninguna nueva.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El test del bucle con un `--verify` que publica desde otro clon es frágil en Windows | Media | Medio | El comando de verificación es un `git -C <seed> push` que se ejecuta con el shell del gate; si da guerra, se empuja desde un fichero marcador en el primer intento |
| El deshacer del hotfix olvida un destino tras un fallo intermedio | Baja | Alto | `undoAll` resetea cada destino a su commit inicial guardado al empezar, haya llegado o no a fusionar |
| `git push --atomic` no lo soporta el remoto | Baja | Medio | Los remotos de prueba son bare locales; git ≥ 2.4 lo soporta |

### 1.8 Rollout

Directo: sale en la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Destino sacado con `diff --stat` y salidas, y `--check`

**Tras**: —
**Modelo**: la sesión (Native), effort de la sesión.
**Tests RED**: Native: TDD del propio hilo · `cli/test/merge/exits.test.ts`, `cli/test/merge/destination.slow.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/merge/exits.test.ts test/merge/destination.slow.test.ts test/merge/failures.slow.test.ts --test-timeout 120000` y `pnpm --dir cli exec vitest run test/merge/exits.test.ts`
**Se prueba en la aplicación**: no, porque es la CLI: lo prueban los tests con repos.

**Interfaces**:
- Consume: nada.
- Produce: `isRegistry(file: string): boolean`; `destinationExits(into: string, path: string, files: string[]): string[]`; `checkDestination(request: DestinationRequest): Promise<string>` (la línea `destino: listo: …`, o lanza `DomainError` con el mensaje de destino sacado).

**Ficheros**: crear `cli/src/merge/exits.ts`, `cli/test/merge/exits.test.ts`, `cli/test/merge/destination.slow.test.ts`; modificar `cli/src/merge/destination.ts`, `cli/src/merge/run.ts`, `cli/src/merge/verbs.ts`.

- [ ] **Step 1: Implementación**
  - `exits.ts`: `isRegistry` con `/^(roadmap|changelog|estimation-log)\.md$/i` sobre `basename`. `destinationExits` devuelve `['Salidas:', '  1. Que quien los hizo…', '  2. Llevarlos…' (solo si files.every(isRegistry)), '  <n>. Dejar el merge para luego.']`.
  - `destination.ts`: `assertClean` arma `destino sacado: …` + `git diff --stat HEAD` + `sin seguimiento: …` (de `status --porcelain` con `??`) + `destinationExits`; los ficheros vienen de `status --porcelain` (columna 4 en adelante). `checkDestination` hace `worktree prune`, busca el destino, `assertClean` y devuelve una línea `destino: listo: …`; sin checkout, comprueba que la carpeta `merge-<basename(branch)>` no exista o sea huérfana vacía (la regla de `addWorktree`) y devuelve la del worktree temporal.
  - `run.ts`: `MergeOptions.check: boolean`; con `check`, `mergeBranch` resuelve política y rama y escribe la línea de `checkDestination` sin `withLock`.
  - `verbs.ts`: opción `check: { type: 'boolean' }`.
  - Tests: `exits.test.ts` — `ofrece llevarlo a la feature si solo hay registros` (`destinationExits('develop','D:/r',['.docs/sdd/roadmap.md','CHANGELOG.md'])` contiene la línea 2 y acaba en `3. Dejar…`); `con un fichero que no es registro las salidas son dos` (`['.gitignore']` → sin «Llevarlos», acaba en `2. Dejar…`). `destination.slow.test.ts` — con `develop` sacada en un worktree y `roadmap.md` modificado: `el merge para con diff --stat y tres salidas` (texto contiene `destino sacado: el checkout de 'develop'`, `roadmap.md | `, `3. Dejar el merge para luego.`; `develop` sin cambiar); `lista los ficheros sin seguimiento aunque no haya diff` (solo `notas.txt` nuevo → `sin seguimiento: notas.txt`, dos salidas); `--check con el destino sucio sale con 1 sin tocar nada` (mismo texto, `sdd-merge.lock` no existe, refs de `develop` y `origin/develop` iguales a antes); `--check con el destino limpio dice listo` (`destino: listo: 'develop' sacado en`); `--check sin el destino sacado dice el worktree temporal` (`irá en el worktree temporal`, la carpeta `merge-0001` no se crea). Ajustar en `failures.slow.test.ts` los asserts del mensaje viejo de destino sacado, si los hay.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit`. Esperado: sin errores.
- [ ] **Step 3: Verificación** — los comandos de «Verificación». Esperado: verde.
- [ ] **Step 4: Commit de la task** — `feat(cli): destino sacado con diff --stat y salidas, y sdd merge --check (feature 0187)`.

### Task 2 — La suite una vez: `--verified-at`

**Tras**: Task 1
**Modelo**: la sesión (Native), effort de la sesión.
**Tests RED**: Native: TDD del propio hilo · `cli/test/merge/verify.slow.test.ts`, `cli/test/merge/usage.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/merge/verify.slow.test.ts --test-timeout 120000` y `pnpm --dir cli exec vitest run test/merge/usage.test.ts`
**Se prueba en la aplicación**: no, porque es la CLI.

**Interfaces**:
- Consume: nada de la Task 1.
- Produce: `MergeOptions.verifiedAt: string | null`; `onlyDocsSince(worktree: string, sha: string): Promise<boolean>` en `verify.ts`; `resolveCommit(root: string, value: string): Promise<string>` (lanza `UsageError('--verified-at: \'<valor>\' no es un commit')`).

**Ficheros**: modificar `cli/src/merge/verify.ts`, `cli/src/merge/run.ts`, `cli/src/merge/verbs.ts`, `cli/test/merge/verify.slow.test.ts`, `cli/test/merge/usage.test.ts`.

- [ ] **Step 1: Implementación**
  - `onlyDocsSince`: `git diff --quiet <sha> HEAD -- . ':!.docs' ':!*.md'` → código 0.
  - `integrate`: tras `mergeFeature`, si hay `verify` y `verifiedAt` y `onlyDocsSince`, `io.out('verificación: omitida: desde <sha corto> solo cambian docs')`; si no, `runVerification`.
  - `mergeBranch` resuelve `verifiedAt` con `resolveCommit` (`rev-parse --verify --quiet <valor>^{commit}`) antes de `withLock`.
  - Tests en `verify.slow.test.ts`: `omite la verificación si desde el sha solo cambian docs` (remoto avanza en `.docs/sdd/roadmap.md`; `--verify 'exit 1' --verified-at <sha de feature/0001>` → código 0 y la línea `omitida`); `verifica si desde el sha cambió código de la base` (remoto avanza en `src.txt`; mismo comando → falla con `verificación:`); `usage.test.ts` o slow: `--verified-at nada` → 2 y `--verified-at: 'nada' no es un commit`, sin cerrojo.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit`.
- [ ] **Step 3: Verificación** — los de «Verificación». Esperado: verde.
- [ ] **Step 4: Commit de la task** — `feat(cli): sdd merge --verified-at no repite la suite si solo cambian docs (feature 0187)`.

### Task 3 — La base en rojo

**Tras**: Task 2
**Modelo**: la sesión (Native), effort de la sesión.
**Tests RED**: Native: TDD del propio hilo · `cli/test/merge/verify.slow.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/merge/verify.slow.test.ts test/merge/failures.slow.test.ts --test-timeout 120000` y `pnpm --dir cli exec vitest run test/merge/verify.test.ts`
**Se prueba en la aplicación**: no, porque es la CLI.

**Interfaces**:
- Consume: `integrate` con la verificación de la Task 2.
- Produce: `class VerificationFailed extends DomainError` en `verify.ts`, lanzada solo por el rojo de la suite (no por `bloqueado:`), con `log: string`; `baseVerdict(worktree, command, io): Promise<string>` que devuelve la línea `base: …`.

**Ficheros**: modificar `cli/src/merge/verify.ts`, `cli/src/merge/run.ts`, `cli/test/merge/verify.slow.test.ts`.

- [ ] **Step 1: Implementación**
  - En `integrate`, en el `catch`: tras `undoFailedMerge`, si el error es `VerificationFailed`, corre `baseVerdict` sobre el commit restaurado y relanza `DomainError(\`${error.message}\n${linea base}\`)`.
  - `baseVerdict` usa `runTee` con su propio log; rojo → `base: en rojo: … (salida en <log>); …`, conservando el log; verde → `base: en verde: el rojo lo trae la rama`, borrando el log.
  - Tests: `con la base también en rojo lo dice` (`--verify` que falla si existe `README.md`, que está en la base → texto con `base: en rojo` y la ruta del log); `con la base en verde dice que el rojo es de la rama` (`--verify` que falla si existe `feature-0001.txt` → `base: en verde: el rojo lo trae la rama`); `tras un bloqueado no repite la suite en la base` (la salida simulada de fichero bloqueado de `verify.test.ts` → sin línea `base:`). El comando de cada test, con `Test-Path` en Windows y `test -f` fuera, como `sleepCommand`.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit`.
- [ ] **Step 3: Verificación** — los de «Verificación». Esperado: verde.
- [ ] **Step 4: Commit de la task** — `feat(cli): sdd merge dice si la base también está en rojo (feature 0187)`.

### Task 4 — El push que reintenta

**Tras**: Task 3
**Modelo**: la sesión (Native), effort de la sesión.
**Tests RED**: Native: TDD del propio hilo · `cli/test/merge/lock-and-base.slow.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/merge/lock-and-base.slow.test.ts test/merge/failures.slow.test.ts --test-timeout 120000`
**Se prueba en la aplicación**: no, porque es la CLI.

**Interfaces**:
- Consume: `syncBaseBranch`, `onlyDocsSince`, `runVerification`.
- Produce: `pushDestination(worktree, remote, into): Promise<'pushed' | 'moved'>` (lanza el `push: no se pudo publicar` de hoy si no avanzó); `PUSH_ATTEMPTS = 3`.

**Ficheros**: modificar `cli/src/merge/steps.ts`, `cli/src/merge/run.ts`, `cli/test/merge/lock-and-base.slow.test.ts`.

- [ ] **Step 1: Implementación**
  - `pushDestination`: si el push falla, fetch del destino y `merge-base --is-ancestor <remoto>/<into> HEAD`; no antecesor → `'moved'`; antecesor → lanza el error de hoy.
  - `integrate`: bucle `for attempt 1..3`; con `'moved'` y `attempt < 3`, `io.out('push: … avanzó …; integro y reintento (<attempt+1>/3)')`, `syncBaseBranch` y la verificación con la regla de la Task 2 contra el último commit verificado; con `'moved'` en el 3.º, lanza `push: … sigue moviéndose … tras 3 intentos; …`. El `catch` deshace al commit de antes del merge, como hoy.
  - Tests: `si la rama destino avanzó durante la verificación integra y publica` (`--verify` que, la primera vez, hace commit y push al remoto desde `seed` y crea un marcador → código 0, texto con `(2/3)`, `remote develop` contiene el commit ajeno y `feature/0001`); `tras tres intentos con la rama moviéndose falla y deja el destino como estaba` (`--verify` que siempre publica → `tras 3 intentos`, `develop` local como antes); `un conflicto al reintegrar deja la rama destino como estaba` (el commit ajeno cambia la misma línea que la feature → `base: conflicto en`); y el de hoy de push rechazado sin avance sigue dando `push: no se pudo publicar`.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit`.
- [ ] **Step 3: Verificación** — los de «Verificación». Esperado: verde.
- [ ] **Step 4: Commit de la task** — `feat(cli): el push de sdd merge reintenta si la rama destino avanzó (feature 0187)`.

### Task 5 — El hotfix con git-flow: `--into`, `--order` y `--tag`

**Tras**: Task 4
**Modelo**: la sesión (Native), effort de la sesión.
**Tests RED**: Native: TDD del propio hilo · `cli/test/merge/hotfix.slow.test.ts`, `cli/test/merge/usage.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/merge/hotfix.slow.test.ts --test-timeout 120000` y `pnpm --dir cli exec vitest run test/merge/usage.test.ts`
**Se prueba en la aplicación**: no, porque es la CLI.

**Interfaces**:
- Consume: `withDestination`, `checkDestination`, `syncBaseBranch`, `mergeFeature`, la verificación de las Tasks 2 y 3, `undoFailedMerge`.
- Produce: `MergeOptions.into | order | tag: string | null`; `mergeHotfix(job): Promise<void>` en `hotfix.ts`; `mergeFeature(worktree, branch, { into, noFf, body })`.

**Ficheros**: crear `cli/src/merge/hotfix.ts`, `cli/test/merge/hotfix.slow.test.ts`; modificar `cli/src/merge/run.ts`, `cli/src/merge/steps.ts`, `cli/src/merge/verbs.ts`, `cli/test/merge/usage.test.ts`.

- [ ] **Step 1: Implementación**
  - `verbs.ts`/`run.ts`: con `into` distinto de `policy.into` y sin `order` → `UsageError` con el literal; `tag` sin ese `into` → `UsageError`. Con `into === policy.into` se sigue el camino de hoy.
  - `hotfix.ts`, antes del cerrojo: rama sin `hotfix/` ni `release/` → `DomainError` git-flow; etiqueta existente (`rev-parse --verify --quiet refs/tags/<tag>`) → `--tag: ya existe`. Dentro del cerrojo: `withDestination` de `into` y, anidado, del destino de vuelta; `syncBaseBranch` de los dos; release abierta = `for-each-ref refs/heads/release/ refs/remotes/<remoto>/release/` sin duplicar nombre y no antecesora de `into`; más de una → `vuelta: hay varias…`; `hotfix/` con una abierta → vuelta a ella; si no, a `policy.into`. Merge en `into` con `--no-ff` y cuerpo `Orden del dev-lead: «<frase>»`; verificación; `git tag -a <tag> -m '<tag> — <rama>'`; merge en la vuelta con `--no-ff` y el mismo cuerpo; verificación; con `push`, `git push --atomic <remoto> refs/heads/<into> refs/heads/<vuelta> refs/tags/<tag>`, y si falla con alguno movido → el literal `push: … o … avanzó …; relanza el hotfix`. Cualquier fallo: `undoAll` (reset de los dos al commit inicial, `tag -d`) y el conflicto de la vuelta reescrito como `vuelta: conflicto en …`.
  - `--check` con `into`: las validaciones de antes del cerrojo y `checkDestination` de los dos destinos, una línea por destino.
  - Fixture: `mergeFixture` gana una rama `main` en `seed` (desde la base) y una `hotfix/0200-fix` desde `main`, o se crean en el test con `git` sobre `seed` y `push` al remoto antes de clonar; lo que sea más corto.
  - Tests en `hotfix.slow.test.ts`: `fusiona en main, etiqueta y vuelve a develop con un push atómico` (los asserts del ADDED: `main^2` y `develop^2` son la rama, cuerpo con la orden, `git cat-file -t v3.0.1` = `tag`, `v3.0.1^{commit}` = `main`, remoto con los tres, las tres líneas de salida); `con una release abierta la vuelta va a ella`; `con dos releases abiertas falla sin tocar nada`; `una rama release vuelve a develop`; `a main solo llegan hotfix y release` (`patch/0201-typo` → literal git-flow, refs iguales); `una vuelta con conflicto deshace main y la etiqueta`; `--check del hotfix comprueba los dos destinos`. En `usage.test.ts`: sin `--order` y `--tag` sin `--into` → 2 y sus literales.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit`.
- [ ] **Step 3: Verificación** — los de «Verificación». Esperado: verde.
- [ ] **Step 4: Commit de la task** — `feat(cli): sdd merge --into fusiona un hotfix con git-flow (feature 0187)`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,25h
- Estimación de implementación: 4h (rango 3–5,5h)
- Base de la estimación: 5 tasks de CLI con tests de repos reales; la del hotfix pesa la mitad. Las features de CLI recientes de `estimation-log.md` (0144, 0182) cerraron por debajo de lo estimado.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`), con `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «Con la rama destino sacada y con cambios sin commitear, el cierre no fusiona» → Task 1. ✓
- ADDED «La comprobación del destino no toca nada» → Task 1 (y Task 5 para el hotfix). ✓
- ADDED «La suite no se repite si desde el commit verificado solo cambian docs» → Task 2. ✓
- MODIFIED «Un merge del cierre que falla deja la rama destino como estaba» (línea `base:`) → Task 3. ✓
- ADDED «El push del cierre reintenta si la rama destino avanzó» → Task 4. ✓
- ADDED «Un hotfix se fusiona en la rama estable, se etiqueta y vuelve a la integración» → Task 5. ✓
- ADDED «A la rama estable solo llegan ramas hotfix y release» → Task 5. ✓
- ADDED «Un hotfix cuya vuelta falla se deshace entero» → Task 5. ✓
- Reglas de la capacidad, Límites → se fusionan al cierre con `sdd capability merge`. ✓
- Las 4 líneas del Review Focus → Tasks 1, 2, 4 y 5, con su test nombrado. ✓
