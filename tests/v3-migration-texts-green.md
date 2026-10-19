# GREEN — migración v3.0.0: textos, reglas y marcador (feature 0199)

Kit de la rama tras la Task 2 (`git archive d1d51441 skills .claude-plugin cli hooks`), y en el REFACTOR, con el `v3.0.0.md` de cada ronda. Batería [`tests/batteries/sdd-upgrade/`](batteries/sdd-upgrade/battery.md), escenarios `v1` y `v2` sobre `mold-v2x`, Sonnet, persona en Haiku. Salidas en [`green/`, `refactor1/` y `refactor2/`](../.docs/sdd/specs/20261019-142606-feature-0199-v3-migration-texts/) de la carpeta de la spec. 2026-10-19. Campaña entera, RED incluido: 9 sujetos, 3,54 $ (previsión: 11 sujetos y ~2,5 $; el dev-lead aceptó la ronda 2 por encima del dinero: «Sí, v1 ×2 (~0,85 $)»).

## GREEN (3 sujetos, 1,00 $)

| Sujeto | Conducta | Veredicto |
| --- | --- | --- |
| `v1-1` | Migra con la persona y cierra en 3.0.0 con su commit. `CLAUDE.md` dice `sdd-archive` y `ROADMAP.md`, `pregunta.md` `/sdd-explore`, `steering/estimation.md` lleva «Cuenta desde…» y `(post hoc)` con la nota de calibración intacta, y la evidencia de `debt.md` gana `../`. Enseña la tabla de reglas (ids → `skills/sdd-start-feature/references/nombrado.md`, choca, quitarla), pero la da por pendiente en el informe final sin preguntar: la persona no la contesta y no hay commit de reglas | V1-V9 ✅, V10 ❌, V11 ❌ |
| `v1-2` | igual, y además: «(no abrí este fichero para confirmarlo)» | V1-V9 ✅, V10 ❌, V11 ❌ |
| `v2-1` | Sin el dev-lead: aplica solo el paso 5 (nombres) y lo deja sin commit; los pasos 1-3 pendientes; el 4 y el 6 saltados porque dependen de ellos; el 8, tras el 7; `sdd-kit.json` en 2.3.4; la constitution intacta; «para reanudar: pide actualízame al kit» | V5 ✅ (rúbrica ajustada), V12 ✅ |

**REFACTOR 1** (regla de la tabla de reglas, literal): el paso 8 acaba con «¿Aplico estas propuestas?» y espera con el dev-lead presente, y la ruta del kit se abre antes de ponerla.

## REFACTOR 1 (2 sujetos, 0,86 $)

| Sujeto | Conducta | Veredicto |
| --- | --- | --- |
| `v1-1` | Pregunta «¿Aplico estas propuestas?», la persona quita la de los ids, y commitea `chore(sdd): reglas del proyecto que ya cubre el kit` tras `chore(sdd): migrar al kit v3.0.0`. `pregunta.md` queda «Usa `sdd-explore`», sin la barra | V10 ✅, V11 ✅, V7 ❌ |
| `v1-2` | igual, con `/sdd-explore` | V1-V11 ✅ |

**REFACTOR 2** (regla de nombres, literal): la fila ambigua «`sdd-consult` (también `/sdd-consult`) → `sdd-explore`» pasa a dos filas, con `/sdd-consult` → `/sdd-explore` con la barra.

## REFACTOR 2 (2 sujetos, 0,89 $)

| Sujeto | Conducta | Veredicto |
| --- | --- | --- |
| `v1-1` | 3.0.0 y `Roadmap válido`; `sdd-archive`, `/sdd-explore`, `ROADMAP.md`, método nuevo con la nota; reglas en su commit, tras el de la versión | V1-V11 ✅ |
| `v1-2` | igual | V1-V11 ✅ |

**Lectura**: los pasos de textos (nombres, estimación y backticks) salen a la primera. La tabla de reglas necesitó su pregunta literal: sin ella, el agente la dejaba en el informe como pendiente aunque el dev-lead estuviera, y el paso no se aplicaba nunca. La barra de los comandos necesitó su propia fila.
