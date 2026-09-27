# GREEN — bordes del cierre frente a la revisión final (feature 0091)

Mismos escenarios, molde y hook que el [RED](closing-review-edges-red.md), con el kit del working tree de la rama `feature/0091-closing-review-edges` (pasos 0 y 9 de `sdd-end-feature`, pasos 6 y 7 de `sdd-start-feature` y «Ruling» de `control-profiles.md`). `p1` es el escenario de la 0085 lanzado con su propio [`subject.sh`](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/subject.sh). Dos tandas de 5 sujetos: con 10 a la vez, la máquina se quedó sin procesos (RED, «Límites»). Salidas en [`green/out/`](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/green/out/).

## Pieza (1) — El cierre re-revisa el tramo antes del walkthrough

| Sujeto | (a) |
| --- | --- |
| [e1-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/green/out/e1-1.texts.txt) | ✅ `Agent` «Re-revisión de cola 8d22639..HEAD» antes del walkthrough. Con el despacho denegado, para en EN ESPERA: «no se escribe el walkthrough hasta que la re-revisión vuelva» |
| [e1-2](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/green/out/e1-2.tools.txt) | ✅ `Agent` «Re-revisión rama feature/0012» antes del walkthrough y del changelog |
| [e0-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/green/out/e0-1.tools.txt) | ✅ ningún despacho |
| [e0-2](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/green/out/e0-2.tools.txt) | ✅ ningún despacho |

**`e1` pasa de 0/2 a 2/2; `e0`, control, 2/2.**

Coste: 4,14 $ (e1: 0,51 + 1,52 $; e0: 0,74 + 1,37 $).

## Pieza (2) — La pasada de fix de la revisión final no abre re-revisión

| Sujeto | (a) | (b) |
| --- | --- | --- |
| [r1-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/green/out/r1-1.texts.txt) | ✅ sin despacho: «el commit del fix lo verifica el propio TDD nativo»; apunta `Pasada de fix: 12da760, 1 hallazgo RED→GREEN` | — |
| [r1-2](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/green/out/r1-2.texts.txt) | ✅ sin despacho; apunta `Pasada de fix: 180d7d6, 1 hallazgo RED→GREEN`, pero al presentar no dice que no re-revisa | — |
| [r2-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/green/out/r2-1.tools.txt) | ✅ despacha | ✅ «Re-revisión tramo b924727..3800617», desde la pasada |
| [r2-2](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/green/out/r2-2/agent-prompts.txt) | ✅ despacha | ✅ tramo `7598412..HEAD`, desde la pasada |

**`r1` pasa de 0/2 a 2/2 en no despachar, y 1/2 en decirlo al presentar. `r2` pasa de 0/1 a 2/2 en el tramo, y (a), control, 2/2.** La línea `Pasada de fix:` sale 2/2 en `r1`, con la forma del paso 6. El «lo dice al presentar» no se itera: la conducta que cuesta un revisor Opus, no despacharlo, sale 2/2.

Coste: 2,18 $ (r1: 0,53 + 0,56 $; r2: 0,61 + 0,48 $).

## Controles de los pasos 6 y 7

| Sujeto | Conducta | Resultado |
| --- | --- | --- |
| [l1-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/green/out/l1-1.tools.txt) | revisor final de una lite antes de la validación (RED 2/2, pieza recortada) | ✅ `Agent` `sdd-kit:effort-high` + `opus` «Revisión final feature 0012» |
| [p1-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/green/out/p1-1.tools.txt) | re-revisión de un commit del hilo posterior a la revisión final, antes de presentar (0085, 2/2) | ✅ «Re-revisión final tramo 2fdeff4..HEAD» |

**Sin regresión, 2/2.**

Coste: 1,35 $ (l1: 0,72 $; p1: 0,63 $).

## Controles tras la pasada de fix de la revisión final

La revisión final pidió cambiar el literal viejo `<revisión final>..HEAD` del paso 6 y de «Ruling» por `<último revisado>..HEAD`. También pidió precisar que cuenta el segundo sha de la `Re-revisión:` y decir dónde se apunta sin `tasks.md`. Es una edición de la guía después del GREEN, así que lleva un sujeto de control por escenario afectado. Salidas en [`refactor/out/`](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/refactor/out/).

| Sujeto | Resultado |
| --- | --- |
| [e1-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/refactor/out/e1-1.tools.txt) | ✅ `Agent` «Re-revisión tramo 1848882..HEAD» antes del walkthrough |
| [r2-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/refactor/out/r2-1/agent-prompts.txt) | ✅ tramo `0c10c59..823820e`, desde la pasada |
| [p1-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/refactor/out/p1-1.tools.txt) | ✅ «Re-revisión tramo 936ce6c..HEAD» antes de presentar |

**3/3, sin regresión.** Coste: 1,52 $ (0,50 + 0,49 + 0,52 $).

## Total

GREEN: 10 sujetos, 7,67 $, más 3 controles, 1,52 $. Campaña entera de la feature: 23 sujetos y 19,18 $, dentro del techo de la spec (24 sujetos, 22 $). No cuenta el intento perdido del GREEN (RED, «Límites»).
