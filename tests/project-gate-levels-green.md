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
