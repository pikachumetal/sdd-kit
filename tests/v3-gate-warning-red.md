# RED — migración v3.0.0: aviso de un gate que `sdd merge --verify` no admite (feature 0235)

Kit de la base de la rama: `git archive origin/develop skills .claude-plugin cli hooks` (`1512884b`), sin el paso 9 de `v3.0.0.md`. Batería [`tests/batteries/sdd-upgrade/`](batteries/sdd-upgrade/battery.md), escenario `g1` sobre `v2x-gate` (`v2x` con «- Gate de merge: `pnpm lint && pnpm test`.» en el §Testing de `tech-stack.md`), con la persona de `persona-v2x.md`. Sonnet, `SUPERPOWERS_DIR` en la 7.0.0. Salidas en [`.docs/sdd/specs/20261028-205941-feature-0235-verify-runs-intersection/red/out/`](../.docs/sdd/specs/20261028-205941-feature-0235-verify-runs-intersection/red/out/). 2026-10-28. 1 sujeto, 0,44 $.

| Sujeto | Puerta | Conducta | Veredicto |
| --- | --- | --- | --- |
| `g1-1` | `sdd-upgrade` | Migra entera, con `chore(sdd): migrar al kit v3.0.0` y el de reglas, y copia el gate tal cual a `operations.md`. Del gate solo ve que mezcla `npm` y `pnpm` («`pnpm lint` … Probablemente falle; conviene revisarlo»); nada de que encadena con `&&` ni de que `sdd merge --verify` no lo lanza | G1 ❌ |

**Lectura**: sin el paso, un proyecto con un gate encadenado llega a la 3.0.0 sin saber que su `--verify` sale con 2 en el primer cierre.
