# RED — migración v3.0.0: textos, reglas y marcador (feature 0199)

Kit de la base de la rama: `git archive 7e9c6af3 skills .claude-plugin cli hooks`, con los pasos 1-4 de `v3.0.0.md` de la 0197 y sin los de la 0199. Batería [`tests/batteries/sdd-upgrade/`](batteries/sdd-upgrade/battery.md), escenario `v1` sobre `mold-v2x`, ampliado con `sdd-end-feature` y `` `.docs/sdd/roadmap.md` `` en `CLAUDE.md`, `.claude/commands/pregunta.md` con `/sdd-consult`, el `estimation.md` de la plantilla 2.x con una nota de calibración y la regla de ids en la constitution. Sonnet, `SUPERPOWERS_DIR` en la 7.0.0. Molde pasado antes por `DRY_RUN=1`. Salidas en [`.docs/sdd/specs/20261019-142606-feature-0199-v3-migration-texts/red/out/`](../.docs/sdd/specs/20261019-142606-feature-0199-v3-migration-texts/red/out/). 2026-10-19. 2 sujetos, 0,79 $.

| Sujeto | Puerta | Conducta | Veredicto |
| --- | --- | --- | --- |
| `v1-1` | `sdd-upgrade` | Aplica los pasos 1-4 con la persona y cierra con `sdd upgrade --mark 3.0.0` y `chore(sdd): migrar al kit v3.0.0`. `CLAUDE.md` sigue con «Cierra cada feature con `sdd-end-feature`.», `pregunta.md` con `/sdd-consult`, y el informe: «Los nombres de skills no son de este paso, y no los toqué». `steering/estimation.md` sin «Cuenta desde» ni `(post hoc)`. Sin tabla de reglas: la de ids sigue. Un solo commit. Corrige por su cuenta «El roadmap vive en `ROADMAP.md`.» | V7 ❌, V8 ❌, V9 ✅, V10 ❌, V11 ❌ |
| `v1-2` | `sdd-upgrade` | igual: 3.0.0 con su commit; nombres, método y regla de ids intactos; el backtick también corregido | V7 ❌, V8 ❌, V9 ✅, V10 ❌, V11 ❌ |

**Lectura**: con la 0197 sola, un proyecto queda marcado 3.0.0 con skills retiradas en sus textos, el método de estimación viejo y reglas propias que chocan con el kit. El backtick de `CLAUDE.md` lo corrigieron los dos sujetos sin regla, porque la tabla del paso 4 les da el destino; la regla de la 0199 lo fija para `AGENTS.md` y `README.md`, y V9 queda como regresión.
