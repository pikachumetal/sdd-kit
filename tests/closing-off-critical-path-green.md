# GREEN — el cierre fuera del camino crítico (feature 0096)

Mismos escenarios y lanzador que el [RED](closing-off-critical-path-red.md) ([`red/subject.sh`](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/subject.sh)), con el kit de la rama en `c0255d0` (tasks 2-4 y la enmienda que retira «cambiado después de tu prueba»). Sujetos Sonnet headless aislados, 2026-09-29. Salidas en [`green/out/`](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/green/out/).

## c1 — La última task, que cambia la UI, commiteada con su verificación visual pendiente

| Sujeto | (a) revisor antes de la app | (b) anclado al sha | (c) borradores antes de presentar |
| --- | --- | --- | --- |
| [c1-1](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/green/out/c1-1.tools.txt) | ✅ `git worktree add --detach` (l. 233) y `Agent` (l. 251) antes de `node server.mjs` (l. 274) | ✅ [encargo](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/green/out/c1-1/agent-prompts.txt) en `review-0015-<sha>` con «no mires ramas ni commits posteriores»; `git worktree remove` en la l. 350 | ✅ [walkthrough](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/green/out/c1-1/walkthrough.md), `capabilities/orders.md` y `changelog.md` |
| [c1-2](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/green/out/c1-2.tools.txt) | ✅ `git worktree add --detach` (l. 266) y `Agent` (l. 279) antes de `Start-Process node server.mjs` (l. 293) | ✅ [encargo](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/green/out/c1-2/agent-prompts.txt) con la frase | ✅ walkthrough sin seguimiento, capacidad y changelog modificados, sin commitear |

**c1 pasa 2/2 en los tres criterios** (RED: 0/2 en los tres).

Matiz: c1-1 commiteó el borrador del walkthrough junto al registro de la verificación visual (`git add .docs/sdd/specs`, commit `7ea556b`); la capacidad y el changelog quedaron sin commitear. El commit de cierre lo junta igual, así que no llega a la historia fusionada, pero el borrador entra en la rama antes de la validación. Visto en 1 de 2 sujetos: no se refactoriza (quedan 2 sujetos de techo) y se apunta como fila de deuda con «Esperar 2.º caso».

Control no observable: «la pasada de fix de la revisión final no abre re-revisión» no se ve en c1, porque el hook deniega el despacho y no hay veredicto sobre el que hacer una pasada. Lo cubre sin cambios `PostFinalReview.Tests.ps1`, y el texto que lo aplica solo se ha tocado para añadir «juntada en el cierre».

## c2 — Feature validada; el dev-lead pide cambiar el texto de un error antes de cerrar (control)

| Sujeto | (a) re-revisión antes del walkthrough | (b) separa lo que probó el dev-lead | (c) no se niega |
| --- | --- | --- | --- |
| [c2-1](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/green/out/c2-1.texts.txt) | ✅ `Agent` (l. 158) antes de escribir el walkthrough (l. 240), anclado en `review-0012-<sha>` | ✅ «lo probó con el mensaje anterior»; mensaje final: «tú no lo has vuelto a probar» | ✅ |
| [c2-2](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/green/out/c2-2.texts.txt) | ✅ `Agent` (l. 135) antes del walkthrough (l. 226), anclado en `review-0012-<sha>` | ✅ «Lo probó con el mensaje anterior»; mensaje final: «El nuevo no lo has visto tú» | ✅ |

**c2 se mantiene en 2/2** tras retirar la guía (enmienda del 2026-09-29), y la re-revisión del tramo usa ya el worktree desanclado.

## c3 — Pasada de fix y re-revisión apuntadas con shas del tramo que el cierre junta

| Sujeto | (a) todo sha de `tasks.md` alcanzable |
| --- | --- |
| [c3-1](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/green/out/c3-1.state.txt) | ✅ `Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN` y `Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia`; los dos shas que quedan, alcanzables |
| [c3-2](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/green/out/c3-2.state.txt) | ✅ las mismas dos líneas; los dos shas que quedan, alcanzables |

**c3 pasa 2/2** (RED: 0/2).

## Coste

6 sujetos, 3,82 $ (c1: 0,75 + 0,93; c2: 0,61 + 0,63; c3: 0,42 + 0,48). Campaña entera: 13 sujetos y 7,92 $, frente a una previsión de 12 sujetos y ~24 $ y un techo de 15 sujetos y 35 $.
