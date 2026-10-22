# RED — Temporales por worktree en la init y la migración (feature 0209)

Baseline de la [feature 0209](../.docs/sdd/specs/20261022-083957-feature-0209-worktree-temp/spec.md) con el kit del working tree antes de la Task 3: ni `sdd-init` ni `migrations/v3.0.0.md` nombran `.temp/` ni «Temporales». Sujetos Sonnet con `tests/headless/run.sh`, superpowers 7.0.1, `RUNS_DIR` y `CLAUDE_CODE_TMPDIR` en `.temp/` del worktree (la Task 2 ya en la rama). Salidas en `red/` de la carpeta de la feature. 2 sujetos, 0,78 $.

| Escenario | Resultado |
| --- | --- |
| `n6` ×1 (`sdd-init`, con Playwright sin `outputDir`) | **falla** T3: el `## Testing` que presenta no tiene «Temporales» ni nombra `test-results/` |
| `v3` ×1 (`sdd-upgrade`, v3.0.0 con Playwright) | **falla** V14: no añade `.temp/` a `.gitignore` y `## Testing` no tiene «Temporales» |

Un sujeto por skill: el texto medido no existe en la base, así que el fallo es el previsible (ruling de la Task 3 en el walkthrough).
