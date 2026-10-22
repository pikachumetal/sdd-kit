# GREEN — Temporales por worktree en la init y la migración (feature 0209)

Campañas de la [feature 0209](../.docs/sdd/specs/20261022-083957-feature-0209-worktree-temp/spec.md) con el kit del working tree de la Task 3 (copia antes de su commit), sobre los escenarios del [RED](temp-dir-red.md). Sujetos Sonnet con `tests/headless/run.sh`, superpowers 7.0.1, `RUNS_DIR` y `CLAUDE_CODE_TMPDIR` en `.temp/` del worktree. Salidas en `green/`, `refactor/` y `refactor2/` de la carpeta de la feature. 11 sujetos, 3,17 $; con el RED, 13 sujetos y 3,95 $ (techo 16 y 10 $). Los moldes de los 13 se borraron al acabar cada sujeto (Task 2).

## GREEN 1

| Escenario | Resultado |
| --- | --- |
| `n3` ×1 (sin config de Playwright) | **pasa** T3: `unitarias` · `no declarado`; `e2e` · `no declarado` |
| `n6` ×2 | **falla 2 de 2** T3: «not in the config, `no declarado`» leído literal con un `playwright.config.ts` sin `outputDir` |
| `v3` ×1 | **pasa** el `.gitignore` (lo crea con `.temp/`); **falla** «Temporales»: `e2e` · `no declarado` |

Clase de fallo: de forma. El sitio sale de la config **o, si no lo fija, del valor por defecto del runner** (Playwright: `test-results/`), como pide el THEN de la spec.

## REFACTOR 1

| Escenario | Resultado |
| --- | --- |
| `v3` ×1 | **pasa** V14: `e2e` · `test-results/` · propuesta `outputDir: '.temp/playwright'`; `.gitignore` creado con `.temp/`; config sin tocar |
| `v1` ×1 (sin E2E) | **pasa** el `.gitignore`; **falla** «Temporales»: copia `## Testing` «tal cual» y el campo no sale |
| `n6` ×2 | **sin observar**: los dos paran en la pregunta de flujos core antes del borrador (un turno); `n6-1` ya da `test-results/` como sitio |

Clase de fallo de `v1`: elemento omitido. «Tal cual, salvo «Temporales»» se quedó en «tal cual»; la segunda vuelta lo escribe como frase propia: `## Testing` gana siempre el campo «Temporales», con o sin E2E. Segunda vuelta aprobada por el dev-lead: «Sí, una vuelta más (Recomendada)».

## REFACTOR 2

| Escenario | Resultado |
| --- | --- |
| `n6` ×2, con `TURN2` «Los dos son flujos core. Sigue.» | **pasa 2 de 2** T3: `test-results/` con la propuesta `.temp/playwright`; `playwright.config.ts` y `package.json` sin tocar |
| `v1` ×1 | **pasa** V14: «Temporales»: `vitest` · `no declarado`, sin propuesta inventada; `.gitignore` con `.temp/` en el commit del marcador |

## Límites

- `n6` necesita dos turnos para llegar al borrador de `operations.md`: con uno, la pregunta de flujos core va antes.
- El «no» del dev-lead a la propuesta y el `.gitignore` que ya tiene `.temp/` no tienen sujeto (decisiones del plan, §4).
