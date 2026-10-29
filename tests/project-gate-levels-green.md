# GREEN — el gate de los proyectos por niveles y por lo afectado (feature 0236)

Kit de la rama sin commitear (copia de `skills`, `.claude-plugin`, `cli` sin `node_modules` y `hooks`), sujetos headless Sonnet, superpowers 7.0.0. Salidas en `.docs/sdd/specs/20261029-082734-feature-0236-project-gate-levels/green/out/`. RED en [`project-gate-levels-red.md`](project-gate-levels-red.md).

## Task 1 — los campos de `operations.md` y quien los propone

### Ronda 1 (sujetos 1 y 2)

| Escenario | Resultado | Lectura |
| --- | --- | --- |
| n7 | 0/2 | `n7-1` para en la primera pregunta (las suites) sin llegar a los demás campos; `n7-2` da `e2e` `pendiente` con una config de Playwright, «Lint» `ninguno` con un script `lint` y «CI de la base» `sin orden de lectura` porque no hay remoto |
| v4 | 1/2 | `v4-1`: `e2e` `pendiente` y «Lint» `ninguno` con `.husky/pre-commit` → `lint-staged`; `v4-2` pasa |
| g2 | 0/2 | el aviso sale, parafraseado: «`sdd merge --verify` ya no lo admite. El lint va en «Lint»…» |

La copia del kit de esta ronda llevaba `v3.0.0.md` con 150 líneas duplicadas (un `String.replace` que interpretó el `` $` `` del texto nuevo): `v4` y `g2` se repiten en la ronda 2 con el fichero rehecho desde `HEAD`.

**REFACTOR 1** (fallos de forma, Art. II: el campo salía, con el valor equivocado). En la fila de `sdd-init` y el paso 2 de la migración: una config de Playwright es `E2E` con o sin tests; un script `lint` o `format`, o lo que corre el pre-commit (`lint-staged`, un hook de husky), es «Lint» sin fichero de config; la orden de `gh` se escribe sin ejecutarla, también sin remoto. En el paso 9: cada aviso va como está escrito, y el del lint no nombra `sdd merge --verify`. La batería: `n7` gana `TURN2` (una pregunta por turno es conducta del kit), y N7a acepta `unitario` con su motivo, porque el molde trae `src/app.test.ts`, que solo llama a funciones.

### Ronda 2 (sujetos 3 y 4)

| Escenario | Fila | Resultado | Evidencia |
| --- | --- | --- | --- |
| n7 | N7a-d | 2/2 | `n7-4.texts.txt:25-32`: `unit` unitario («el test solo llama a funciones»), `e2e` E2E, «Sin filtro» con `package.json`, `package-lock.json`, las dos configs y `tests/helpers/**`, «Lint» `npm run lint` fuera del gate, CI con `gh run list --workflow ci.yml …`; `n7-3.texts.txt:14-16`, lo mismo |
| v4 | V4a-e | 2/2 | `v4-3.state.txt:131-134` y `v4-4.state.txt:127-131`: `unit` pendiente, `e2e` E2E, `lint-staged` en el pre-commit, `azure-pipelines.yml` · `sin orden de lectura` |
| g2 | G2a-c | 2/2 | `g2-3.texts.txt:150` y `g2-4.texts.txt:159`: `Gate con lint: «moon run :typecheck :test :lint» — el lint va en «Lint», al editar y en el pre-commit; sácalo del gate`, literal; la línea sin tocar; nada sobre `:typecheck` |

## Task 2 — correr un gate: unitarios, salvaguarda y tras un rojo

| Ronda | Escenario | Resultado | Lectura |
| --- | --- | --- | --- |
| 1 | t2 | 2/2 | los tests rojos solos, el gate con `--base <rojo>` y `rooms:test` con `(no corrió en la pasada roja)` |
| 1 | t1 | T1b 2/2, T1a 0/2 | la línea sale bien, pero tras los tests rojos corren también el gate con `--base <rojo>`: `README.md` es input de `bookings:test` |
| 1 | g7 | 0/2 | ninguno abre «Running a gate» (`g7-1` y `g7-2` solo leen `encargo-revision.md`): el gate filtrado sin `unit`, o `node --test` entero |
| 1 | humo | w2 ✓; g6 sin observar (para en una decisión de la revisión); k6-1 sin observar (no carga ninguna skill) | |

**REFACTOR 1**: las condiciones que deciden suben al paso 1 de `sdd-archive` (`tech-stack.md`: «Una regla que solo vive en una referencia no se lee»); en `sdd-verify`, el arreglo solo de docs pasa al principio del punto 3: «no gate and no suite, even if a task's inputs include that file».

| Ronda | Escenario | Resultado | Lectura |
| --- | --- | --- | --- |
| 2 | t1 | 2/2 | `t1-3` y `t1-4`: solo `node --test test/docs.test.js`; la línea empieza por `tras el rojo en <sha>, arreglo <sha> solo de docs:` |
| 2 | g7 | G7a 1/2, G7b 0/2 | `g7-3` corre `unit` y el gate sin filtro; `g7-4` no corre `unit`; ninguno pone `unit` antes de la flecha |
| 2 | k6-2 | ✓ | carga `sdd-propose`, corre sin filtro la tarea cuya definición cambia y commitea |

**REFACTOR 2** (forma, Art. II): receta literal de la línea en el paso 1 de `sdd-archive`. **Ronda 3**: `g7-5` para en una decisión de la re-revisión (sin observar); `g7-6` corre `unit` y el gate sin filtro, con `unit` tras la flecha. La causa era la plantilla: `walkthrough-template.md` (4.1) y `patch-template.md` solo tenían hueco para una orden. **REFACTOR 3**: las dos plantillas ganan el hueco de la suite unitaria y de la marca. **Ronda 4** (`g7-7`, n = 1, el tope de coste): `unit` antes de la flecha y el gate sin filtro; la marca solo en `bookings:test`.

Cierre (dev-lead, 2026-10-29, con 23,78 $ de 25 $: «Cerrar con lo medido»): las conductas pasan; G7b (la marca en cada tarea) queda sin medir tras su afinado, con fila de deuda.

## Task 3 — lo que trae la base y el conflicto solo de docs

| Ronda | Escenario | Resultado | Lectura |
| --- | --- | --- | --- |
| 1 | g5, a3 | ✓ | controles: la intersección de la deuda de la 0230 y la base de siempre |
| 1 | g8 | a medias | `g8-1` corre `node --test` entero tras `--sync` (no el gate sin filtro); ninguno marca las tareas |
| 1 | m1, m2 | sin observar | el molde hacía nombrar a la rama `src/rooms.js` y `slot-format`, que el proyecto no tiene; el sujeto lo corregía antes de integrar y el conflicto dejaba de medir |
| 2 | m1 | M1a-b 2/2, M1c 0/2 | juntan la frase de la rama y la de la base, commitean y fusionan; el aviso sale nombrado («Conflicto de la base resuelto por mí: …»), no literal |
| 2 | m2 | 2/2 | Node 20 frente a Node 24: no resuelve ni fusiona (`m2-3` «No terminado»; `m2-4` para a preguntar) |
| 2 | g8 | G8a 2/2, G8b 0/2 | el gate sin filtro tras `--sync` por el lockfile; la marca, en prosa |

Cierre: M1c y G8b quedan sin medir tras afinar el aviso («as written») y la marca («every task of the line»), con fila de deuda.

Coste total de la campaña: 53 sujetos, 23,78 $ (RED 5,12 $, GREEN 18,66 $).
