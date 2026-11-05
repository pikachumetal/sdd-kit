---
id: 20261105-115706-patch-0318-eol-only-not-dirty
task: 0318
title: Patch — sdd merge no ve como cambio sin commitear un fichero que solo cambia de finales de línea o de stat
type: patch
solution: causa raíz
status: done
created: 2026-11-05
branch: patch/0318-eol-only-not-dirty
commit: <hash>
---

# Patch 0318 — sdd merge no ve como cambio sin commitear un fichero que solo cambia de finales de línea o de stat

Validación: agente, «Perfil delegate» — `validation.mode: field`: el uso real lo validan los tickets.

## Capacidades

- Ninguna, porque el fix devuelve `sdd merge`, `sdd merge --sync`, `sdd merge --check`, `sdd id claim` y `sdd roadmap publish` a lo que ya dicen `control-profiles`, `feature-ids` y `release-flow`: paran con «cambios sin commitear», y un fichero sin cambio de contenido no lo es.

## 1. Síntoma

Con `core.autocrlf=true`, un fichero en CRLF con `eol=lf` sale ` M` en `git status --porcelain` sin diff de contenido, y `sdd merge` se para como si hubiera cambios sin commitear. Pasó en tres cierres:

- 0302 ([ticket](../../field-reports/20261104-102149-feature-0302-annotated-copies.md) §3): `sdd merge --check` → «destino sacado: el checkout de 'develop' … tiene cambios sin commitear», por `dist/hooks/hooks.json` reescrito con los mismos bytes.
- 0304 ([ticket](../../field-reports/20261104-183657-feature-0304-own-and-size-checks.md) §2): `sdd merge --sync` → `base: 'feature/0304-own-and-size-checks' tiene cambios sin commitear; commitéalos antes de integrar la base`, por 129 ficheros de `dist/`.
- patch 0317: todo `dist/` modificado solo por CRLF al arrancar.

Medido en este worktree al abrir el patch: `git status --porcelain` → 129 líneas ` M`, todas en `dist/` (122 de `dist/cli/`, más `dist/.claude-plugin/plugin.json`, los 3 de `dist/agents/`, `dist/hooks/project/sdd-kit-loaded.mjs`, `dist/LICENSE` y `dist/THIRD_PARTY_NOTICES.md`); `git diff --quiet` → 0 y `git diff --cached --quiet` → 0; `git ls-files --eol` → `i/lf w/crlf attr/text eol=lf` en `dist/LICENSE` y `i/lf w/crlf attr/` en sus fuentes (`LICENSE`, `cli/src/merge/steps.ts`).

## 2. Causa raíz

Dos piezas, una de la CLI y otra del repo:

- **La CLI lee el estado de git, no el contenido.** Los cinco sitios que deciden «hay cambios sin commitear» miran `git status --porcelain`: `cli/src/merge/destination.ts:22` (`assertClean`, para el merge y `--check`), `cli/src/merge/steps.ts:50` (`assertNothingPending`, para `--sync` y el merge con `--verify`), `cli/src/ids/claim.ts:184` (`assertClean` del destino) y `:220` (`fastForward` de la rama) y `cli/src/roadmap/publish.ts:41` (`assertTargetClean`). Git da por cambiado sin hashearlo un fichero cuyo tamaño no coincide con el stat del índice: el CRLF lo alarga, así que `git status`, `git update-index --refresh` y `git diff-index --quiet HEAD` lo dan como ` M` aunque su contenido, normalizado por `eol=lf`, sea el del índice. `git diff --quiet` sí compara el contenido y da 0. Y `git merge` hace la misma comprobación de stat: reproducido en un repo desechable, con la base cambiando ese mismo fichero, `git merge` se niega con «Your local changes to the following files would be overwritten by merge» y aborta; tras `git add -u`, que sin cambio de contenido solo reescribe el stat del índice, integra. Con un conflicto a medias, `git diff --quiet` y `git diff --cached --quiet` dan 1.
- **El ruido nace en el build.** `build/dist.ts` (`buildDist`) copia los bytes del working copy de cada fuente de su lista blanca. Las fuentes sin regla de EOL en `.gitattributes` (`cli/`, `agents/`, `hooks/project/` —`hooks/*` no baja a subcarpetas—, `.claude-plugin/plugin.json`, `LICENSE`, `THIRD_PARTY_NOTICES.md`) salen en CRLF con `core.autocrlf=true`, y `dist/**` lleva `eol=lf`: cada build deja en `dist/` ficheros CRLF que git da por cambiados.

## 3. Fix

- **Fichero(s)**: `cli/src/git/git.ts`, `cli/src/merge/destination.ts`, `cli/src/merge/steps.ts`, `cli/src/ids/claim.ts`, `cli/src/roadmap/publish.ts`, `.gitattributes`, `cli/test/merge/sync.slow.test.ts`, `cli/test/merge/destination.slow.test.ts` y sus copias en `dist/cli/src/`
- **Cambio**: `hasContentChanges` (`git diff --quiet` y `git diff --cached --quiet`) decide el cambio sin commitear en los cinco sitios, y los ficheros sin seguimiento se miran como hoy en cada uno; donde sigue un merge, `refreshStat` (`git add -u`) reescribe antes el stat del índice. `.gitattributes` da `text eol=lf` a todas las fuentes de la lista blanca del build.
- **Decisiones**:
  - `git diff --quiet` y no `git update-index --refresh`, y los cinco sitios a la vez — dev-lead
  - `git add -u` antes del merge, solo donde sigue uno (el merge del cierre, `--sync`, el merge con `--verify` y `sdd id claim`), nunca en `--check`, que promete no tocar el índice (`control-profiles`, «La comprobación del destino no toca nada»): sin él, `git merge` aborta igual si la base cambia el fichero — sin el dev-lead
  - `.gitattributes` cubre toda la lista blanca del build y no solo `cli/**`, y `hooks/**` sustituye a `hooks/*`: con solo `cli/**`, 7 de los 129 seguían saliendo; `cli/**` deja sobrantes y quita las tres reglas de `cli/test/fixtures/` — sin el dev-lead
  - El recuento del umbral del patch deja fuera las copias de `dist/`, que genera el build: 6 ficheros y 42 líneas — sin el dev-lead
- **En un clon ya sacado**: `.gitattributes` no reescribe las fuentes que ya están en CRLF; siguen así, sin salir modificadas, hasta que git las vuelve a sacar, y el build sigue copiándolas a `dist/` en CRLF. La CLI ya no se para por ellas. Un clon o un worktree nuevo sale en LF (caso 6); en uno ya sacado, `git add -- dist` tras el build limpia el estado sin stagear nada, el remedio de la fila de deuda.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `pnpm --dir cli exec vitest run test/merge/sync.slow.test.ts test/merge/destination.slow.test.ts --test-timeout 120000` | ❌ 3 de 19 con el síntoma literal: `--sync` → `base: 'feature/0001' tiene cambios sin commitear; commitéalos antes de integrar la base` (0304); el merge y `--check` → `destino sacado: el checkout de 'develop' … tiene cambios sin commitear` (0302). La guarda nueva del cambio solo en el índice ya pasaba |
| 2 | GREEN: los mismos ficheros más `test/ids/claim.slow.test.ts`, `test/roadmap/publish.slow.test.ts`, `test/roadmap/publish-failures.slow.test.ts` y `test/merge/outside-lock.slow.test.ts` | ✅ 6 ficheros, 85/85; `moon run cli:typecheck` en 0. La copia del RED, igual que lo commiteado (`git diff --no-index`) |
| 3 | GIVEN un clon con `core.autocrlf=true` y un fichero de `dist/` en CRLF con `eol=lf` y sin diff, con la base cambiando ese fichero, WHEN `sdd merge --sync` THEN integra la base | ✅ test 1 de `sync.slow.test.ts` («un fichero de dist/ que solo cambia de finales de línea…»): `base: integrada`, `git status --porcelain` vacío después · ejecución real en un repo desechable |
| 4 | GIVEN un cambio de contenido sin commitear, en el working tree o solo en el índice, WHEN `sdd merge --sync` THEN se para como hoy | ✅ «con cambios sin commitear no toca nada» y «con un cambio solo en el índice no toca nada» |
| 5 | El destino sacado con un fichero que solo cambia de finales de línea: `--check` da «listo» sin refrescar el índice, y el merge fusiona encima | ✅ los dos casos nuevos de `destination.slow.test.ts`; tras `--check`, `git status --porcelain` sigue en `M README.md` |
| 6 | Tras `moon run kit:build`, `git status --porcelain -- dist` en un clon nuevo con `core.autocrlf=true` | ✅ 0 líneas con el fix (fuentes en `i/lf w/lf attr/text eol=lf`); control, el mismo clon sacado en el commit anterior: 129 líneas ` M`, `git diff --quiet` en 0 · ejecución real con `core.longpaths=true` |

## 5. Tiempo (ligero)

- Estimación: 1 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-05T11:57Z
- Esfuerzo real:
- Coste de sujetos: no aplica
