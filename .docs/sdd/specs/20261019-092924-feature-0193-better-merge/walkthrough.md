---
id: 20261019-092924-feature-0193-better-merge
feature: 0193
title: Walkthrough — Merge mejor que el de git por defecto
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-19
---

# Walkthrough — Merge mejor que el de git por defecto

## 1. Cambios realizados

- **Opciones de git y Mergiraf** (`cli/src/merge/attempt.ts`, `steps.ts`, `mergiraf.ts`): cada `git merge` de la CLI lleva `-c merge.conflictStyle=zdiff3` y `-X diff-algorithm=histogram` (`mergeArgs`). La cadena de resolución devuelve los ficheros que quedan, y si `mergiraf --version` arranca lanza `mergiraf solve --keep-backup=false` en cada uno (`mergiraf: resuelto | no resuelve <fichero>`). La reescritura de marcas para resolver se queda en `diff3` (enmienda de la decisión 5).
- **Registros por id** (`keyed.ts`, `registries.ts`, `exits.ts`): roadmap, changelog y deuda, en la forma 2.x y la 3.0.0, por ruta, se unen por id dentro de cada trozo en conflicto. Si la unión por id no decide, caen a la unión de trozos que solo añaden, que quita las filas idénticas repetidas. Si la rama reordena filas de la base, decide una persona. `isRegistry` reconoce los registros por ruta, y la salida 2 del destino sacado nombra la deuda.
- **`sdd merge --sync`** (`sync.ts`): el merge de sincronización del cierre, con la misma resolución, sin cerrojo, sin `--verify` y sin push. Las líneas de la rama destino van primero (`destinationIsTheirs`). El paso 6 de `sdd-archive` y la receta lo usan en vez de `git merge` a mano. `SyncMerge.Tests.ps1` y `ArchiveSkill.Tests.ps1` se actualizaron a las frases nuevas, y la batería de `sdd-archive` tiene el escenario `a3c` con el molde `reservas-capbase`.
- **Hotfix** (`hotfix.ts`): `--tag` se valida con `git check-ref-format` y sale con 2 antes del cerrojo. La etiqueta que solo está en el remoto falla igual que la local. La vuelta se decide tras traer del remoto la rama estable y las `release/*`, antes de sincronizar nada, y con remoto solo cuentan las `release/` del remoto. Falla antes de tocar nada si la vuelta tiene otro remoto, si el fetch falla o si `ls-remote` no puede consultarla.
- **Menores de la 0187**:
  - `MergeConflict` con sus ficheros.
  - Firmas de 3 parámetros o menos y funciones de 20 líneas o menos.
  - `fetchBase` y `shortHead` compartidos.
  - Hooks de los tests con bit de ejecución.
  - Tests de `--verified-at` con un sha de otra rama y con código cambiado en la rama.
- Commits:
  - Apertura: `65a3d7c7`.
  - Tasks: `d36f314c`, `8aa46dc`, `51fa7ad9`, `483435c9` y `2b1374d6`.
  - Pasada de fix y cierre: juntados en el commit de cierre.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 5 h
- Esfuerzo real: 1,58 h — reloj de la sesión 2,01 h desde 2026-10-19T09:24Z, sin 26 min de espera al dev-lead (1 espera)
- Desviación: −3,42 h (−68 %)
- Causa de la desviación: la estimación pesó la unión por id y la batería como inciertas. La unión salió como función pura en una pasada, y los sujetos de la batería corrieron en segundo plano mientras se implementaban las Tasks 4 y 5. Es la misma tendencia que la 0187 (4 h estimadas, 1,5 h reales).
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 75.757.293 — claude-opus-5-5 75.757.293
- Tokens de subagentes: 4.451.888 en 3 despachos — Final re-review 0193 claude-opus-5-5 648.915 / 2 min; Final review — Spec axis claude-opus-5-5 2.906.948 / 6 min; Final review — Code axis claude-sonnet-5-5 896.025 / 3 min
- Coste de la sesión: 26,99 $ (hilo 23,33 $ + subagentes 3,67 $)
- Coste de sujetos: 1,98 $ en 5 sujetos sonnet — RED `a3c` 0,50 $; GREEN `a3` ×2, `a3n` y `a3c` 1,48 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La reescritura de marcas se queda en `diff3`: lo dice la enmienda de la spec del 2026-10-19 y lo encontraron los dos ejes.
- `SyncMerge.Tests.ps1` y `ArchiveSkill.Tests.ps1` se reescribieron, aunque el plan no los nombraba.
- El GREEN de `a3` corrió con n = 2, la n que fija la batería.
- El descarte del merge driver no entra en `tech-stack.md`, porque no cabe en su tope de palabras.

### Decisiones tomadas sin el dev-lead

La lista completa, con el coste si es errónea, está en `tasks.md`, `## Rulings`. Las que cambian algo que se ve:

- La reescritura de marcas va en `diff3`. Con `zdiff3`, la unión de trozos dejaría dos métodos sin cerrar, y `mergiraf` no lee `zdiff3`. Si es erróneo, no hay efecto visible.
- Con remoto, una `release/` que solo existe en local no cuenta como abierta para la vuelta del hotfix. Si es erróneo, un hotfix vuelve a `develop` en vez de a una release sin publicar.
- El menor 4 de la 0187 no se junta: hotfix y merge normal tienen esqueletos distintos (dos checkouts, etiqueta y push atómico, frente a reintentos), y juntarlos pediría callbacks. Si es erróneo, queda una refactorización pendiente.
- El descarte del merge driver se queda en la decisión 10 de la spec y aquí, no en `tech-stack.md`: tech-stack, architecture y constitution están en su tope de palabras, y subirlos es decisión del dev-lead. Si es erróneo, el descarte no está en el documento de anclaje.
- Los duplicados que git fusiona sin conflicto, en sitios distintos, quedan fuera, por la decisión 8. Si es erróneo, puede quedar una fila doble.
- La revisión declinó juzgar cuatro puntos; los adjudico así:
  - `--ff-only` va sin `-c`/`-X`: un fast-forward no hace merge de tres vías.
  - Mergiraf puede resolver un import que cambian los dos lados: lo decidió el dev-lead.
  - `--sync` va sin cerrojo, por la decisión 3.
  - Una etiqueta que empieza por `-` es un problema heredado.

## 4. Verificación

### 4.1 Builds

- Suite completa (gate de cierre): `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → `cli:test` 1048/1048, `cli:test-slow` 207/207 (con `mergiraf` 0.20.0 en el PATH), `cli:test-min` 1255/1255, `kit:test` 1322 pass / 0 fail / 15 skipped · 473 s · sobre la pasada de fix, juntada en el cierre.
- Pre-commit (`cli:typecheck cli:test kit:test-fast kit:roadmap`) en verde en cada commit de la rama. La pasada de fix lo pasó al segundo intento: el primero lo rechazó `WordBudget` por el borrador de `tech-stack.md`, que se retiró.
- Prueba de la skill (`tests/batteries/sdd-archive`): RED `a3c` con el kit de `develop`, con puerta verde y conducta roja (abortó el merge de sincronización por `capabilities/bookings.md`); GREEN `a3` 2/2, `a3n` 1/1 y `a3c` 1/1, con puerta y conducta verdes. La evidencia está en `red/out/` y `green/out/`.
- Revisión final: Spec opus+high y Código sonnet+high, los dos con arreglos, sobre `2b1374d6`; Arquitectura no (plan, sin señales en el diff). Pasada de fix: 3 hallazgos RED→GREEN y 1 refactor. Re-revisión desde `2b1374d6` hasta la pasada de fix, opus+high, limpia, con 3 Minor diferidos.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-19 · suite completa verde (cli 1048 + slow 207 + min 1255, kit 1322/0) · smoke con 3 THEN con ejecución real en este repo y 3 con ejecución real de los sujetos de la batería, el resto por suite · revisión final Spec y Código sobre 2b1374d6, re-revisión limpia

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Todo `git merge` de la CLI lleva `zdiff3` e `histogram` | suite | `attempt.test.ts` |
| Las marcas `zdiff3` en el conflicto que llega a una persona | no probado | tras el abort no queda trozo con marcas (enmienda de la decisión 5) |
| Registros: la destino marca la 0190 y la rama añade la 0201 | suite | `registries.slow.test.ts`, 2.x y 3.0.0 |
| La misma fila nueva queda una; dos filas distintas con el mismo id se quedan y se avisan | suite | `keyed.test.ts` y `registries.slow.test.ts` (changelog y debt) |
| Mismo id en Added y en Changed; la misma fila cambiada distinto es conflicto | suite | `keyed.test.ts` |
| Mergiraf resuelve dos métodos y dos imports, lo dice y la suite corre | suite | `mergiraf.slow.test.ts` (mergiraf 0.20.0) |
| Mergiraf no resuelve → conflicto; sin mergiraf → igual que hoy y sin línea | suite | `mergiraf.slow.test.ts` |
| `--sync` integra la base con los dos requisitos y las dos filas | ejecución real | batería `a3c-1` (GREEN): `develop` con los tres requisitos de `bookings.md` |
| `--sync` sin avance: `base: al día` | ejecución real | batería `a3n-1`: `base: al día: 'develop' ya está en 'feature/0010-cancel-reason'` |
| `--sync` con conflicto real | suite | `sync.slow.test.ts` |
| `--sync` con cambios sin commitear | ejecución real | en este repo, con los borradores: `base: 'feature/0193-better-merge' tiene cambios sin commitear…`, código 1 |
| `--sync` con opciones del merge | ejecución real | `merge --sync --push` en este repo → `--sync no admite --push`, código 2 |
| Destino sacado: la salida 2 con la deuda; `docs/roadmap.md` → dos salidas | suite | `exits.test.ts`, `destination.slow.test.ts` |
| El cierre integra la base con `--sync` y repite la suite si la base trae código | ejecución real | batería `a3-1` y `a3-2` |
| Hotfix: etiqueta inválida → 2 antes de tocar nada | ejecución real | `merge --check --branch hotfix/9999-smoke --into main --tag 'v3.0.1 beta'` → `--tag: 'v3.0.1 beta' no es un nombre de etiqueta válido`, código 2 |
| Hotfix: etiqueta solo en el remoto; dos releases en el remoto antes de sincronizar; release solo local; remotos distintos | suite | `hotfix.slow.test.ts` |
| Hotfix: vuelta que no se puede consultar | no probado | sin test; revisado por el eje Spec |

### 4.3 Residuales / deuda generada

- Fila de deuda «Menores diferidos de la feature 0193»: los 18 Minor de la revisión final y de la re-revisión, listados en `tasks.md`, `## Minors diferidos`.

## 5. Aprendizajes

- Una reescritura con `zdiff3` rompe cualquier unión de trozos que concatene los dos lados, y `mergiraf` no la lee → comentario del porqué en `readConflict` (`cli/src/merge/registries.ts`) y enmienda de la spec.
- El descarte del merge driver en `.gitattributes` (su definición es `git config` local, y sin ella git vuelve al merge normal sin avisar) → decisión 10 de esta spec. No cabe en `tech-stack.md` sin subir su tope, que es decisión del dev-lead.
- Revisión de skills: se editó `sdd-archive`, con su prueba. El resto no aplica: ninguna otra skill nombra el merge de sincronización a mano (comprobado con `grep -rn "git merge --no-edit" skills`).

## 6. Adendas
