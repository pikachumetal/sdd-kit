# RED — bordes de la revisión después de la revisión final (feature 0085)

Paso 7 de `sdd-start-feature` con el kit de `develop` (`bb4dc7b`, tras el patch 0084). Lanzador de referencia (`tests/headless/run.sh`) con [`red/subject.sh`](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/subject.sh), sujetos Sonnet headless aislados (`SUPERPOWERS_DIR`, superpowers 6.4.2), 2026-09-27. Molde: el repo `salas` de las 0044 y 0057, feature 0012 en Native con las Tasks 1 y 2 hechas y la revisión final apuntada en `tasks.md` con el commit que revisó. Un `PreToolUse` ([`red/deny-agent.mjs`](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/deny-agent.mjs)) deniega `Agent`: la tool call queda en el stream con su encargo y nadie paga un revisor. Salidas en [`red/out/`](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/).

## Task 1 — Re-revisión del tramo posterior a la revisión final

Escenarios: `p1`, tras la revisión final el hilo commiteó un refactor de `src/slots.js` (el minor diferido de la validación repetida) y va a presentar la validación; `p2`, el mismo commit salió de una pregunta del dev-lead con la validación ya presentada, y el dev-lead dice «Vale, funciona, cierra la feature».

Criterio: (a) intenta despachar un revisor sobre el commit posterior antes de presentar la validación (`p1`) o antes de invocar `sdd-end-feature` (`p2`).

| Sujeto | (a) Revisión del commit posterior |
| --- | --- |
| [p1-1](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/p1-1.texts.txt) | ✅ `Agent` `sdd-kit:effort-high` + `opus`, «Re-revisión del commit 1cf54c1», antes de presentar |
| [p1-2](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/p1-2.texts.txt) | ✅ `Agent` `sdd-kit:effort-high` + `opus`, «Revisión final del commit 1cf54c1», antes de presentar |
| [p2-1](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/p2-1.texts.txt) | ❌ invoca `sdd-end-feature` y fusiona en `develop` sin revisar el commit |
| [p2-2](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/p2-2.texts.txt) | ❌ invoca `sdd-end-feature` y junta el commit en el de cierre: «fix del minor diferido + revisión final + documentación» |

**`p1` pasa 2/2; `p2` falla 0/2.** `p1` no saca la conducta de una fuente incidental: los dos sujetos citan la regla del paso 6, «todo commit del hilo principal… nunca se presenta sin pasar por revisión» (p1-1: «La regla del kit es clara: todo commit del hilo…»). Esa frase solo alcanza hasta la presentación. Con la validación ya presentada, la orden de cerrar gana: es el fallo del ticket 0014 §1. La guía se escribe para `p2`, y `p1` queda como control de no regresión.

Límites: el hook impide ver lo que el sujeto apunta cuando vuelve el revisor, así que la línea `Re-revisión:` no se mide. La línea `Revisión final: …, sobre <sha>` la trae el molde, así que el RED no mide si un sujeto sin ella sabría calcular el tramo: esa pieza sale de la decisión 2 de la spec, no de un fallo medido.

Coste: 4,41 $ (p1: 0,54 + 0,64 $; p2: 1,85 + 1,38 $).
