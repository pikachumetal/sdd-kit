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

## Task 2 — Commit pequeño de solo docs revisado en el hilo

Kit de la rama tras la Task 1 (`459a738`), para medir la excepción contra la regla nueva. Escenarios: `s1`, tras la revisión final el hilo integró `develop` con un merge cuyo único cambio propio resuelve el conflicto de la fila 0012 de `.docs/sdd/roadmap.md` (1 línea en `git show --remerge-diff`); `s2`, control del umbral, un commit que crea `.docs/sdd/architecture.md` con 26 líneas. En los dos, el tramo lleva también el commit que apunta la revisión final en `tasks.md` (3 líneas).

Criterio: (a) en `s1` no despacha revisor y anota la lectura en el hilo; (b) en `s2` despacha la re-revisión del tramo.

| Sujeto | (a) `s1` sin revisor | Sujeto | (b) `s2` con re-revisión |
| --- | --- | --- | --- |
| [s1-1](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/s1-1.texts.txt) | ❌ `Agent` `sdd-kit:effort-high` + `opus`, «Re-revisión rango 7c3ee1c..c66872a» | [s2-1](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/s2-1.texts.txt) | ❌ solo un `Explore` para buscar `review-package`; revisa él y reescribe `architecture.md` |
| [s1-2](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/s1-2.texts.txt) | ❌ `Agent` `sdd-kit:effort-high` + `opus`, «Re-revisión bd8d7ac..6aaf338» | [s2-2](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/s2-2.texts.txt) | ✅ `Agent` `sdd-kit:effort-high` + `opus`, «Re-revisión final tramo 6351b7a..HEAD» |

**(a) falla 0/2; (b) pasa 1/2.** Es el coste del ticket 0005 §5: un revisor Opus (~85k tokens) por una fila del roadmap, que ahora pide la regla nueva de la Task 1 en cada tramo. (b) no es el fallo que se busca: s2-1 despachó un `Explore` en vez del revisor y se tomó el tramo como suyo. Queda como control de que la excepción no se come los commits de docs grandes.

Coste: 2,42 $ (s1: 0,57 + 0,65 $; s2: 0,73 + 0,47 $).

## Task 3 — Reproducir antes de arreglar un hallazgo de ejecución

Kit de la rama tras la Task 2 (`788b2c2`), que no toca la ronda de fix. El hook guarda ahora el `prompt` de cada `Agent` denegado en `<etiqueta>/agent-prompts.txt`. Molde: el revisor devuelve un Important de premisa falsa, «`reserve('Sur', undefined)` lanza `TypeError: Cannot read properties of undefined`… Fix: comprobar `typeof slot === 'string'`». `SLOT.test(undefined)` convierte el argumento en la cadena «undefined», no lanza, y sale el error de formato de la spec. Escenarios: `f1`, plan `Ejecución: subagent` y el Important en la revisión de la Task 1, con la petición de abrir la ronda de fix; `f2`, plan Native y el Important en la revisión final de rama, con la petición de hacer la pasada de fix.

Criterio: (a) `f1`: el encargo del implementador pide primero un test que reproduzca la premisa en RED y volver con `NEEDS_CONTEXT` si no sale; (b) `f2`: el sujeto comprueba la premisa antes de editar `src/` y, al no reproducirse, no cambia `src/` y lo registra como ruling.

| Sujeto | (a) `f1`: encargo | Sujeto | (b) `f2`: pasada de fix |
| --- | --- | --- | --- |
| [f1-1](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/f1-1/agent-prompts.txt) | ❌ reenvía el hallazgo y su fix; nada de reproducir | [f2-1](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/f2-1.texts.txt) | ✅ «the Important finding doesn't reproduce», `src/` sin tocar, ruling |
| [f1-2](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/f1-2/agent-prompts.txt) | ❌ «Fix: comprobar `typeof slot === 'string'`», y «si crees que hace falta un test adicional… añádelo» | [f2-2](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/f2-2.texts.txt) | ✅ «no reproduce contra HEAD actual», `src/` sin tocar |

**(a) falla 0/2; (b) pasa 2/2.** En Native la conducta viene de la «Final Review» de `executing-plans` («write the test that reproduces the finding, watch it fail»), que el sujeto tiene delante al hacer la pasada: no es incidental. En SDD, el hilo traduce el hallazgo a un encargo de fix, y el implementador recibe el arreglo como orden: es el fallo del ticket 0016 §1, que costó tres reanudaciones. La guía se escribe para el encargo de SDD, y `f2` queda como control de no regresión.

Coste: 2,64 $ (f1: 0,60 + 0,73 $; f2: 0,82 + 0,49 $).

## Pasada de fix de la revisión final — el conteo de un merge en los pasos

La revisión final marcó como Important que los pasos 6 y 7 no dicen cómo se cuenta un merge ni qué ficheros son docs, y que `s1` no lo distingue porque `develop` solo trae una línea del roadmap. Escenario nuevo `s3`: `s1` con `develop` trayendo además `src/cancel.js` (27 líneas) de otra feature. El tramo da 29 líneas con `src/` en `git diff --numstat`, y el merge da 6 líneas de docs en `--remerge-diff`. Kit de la rama en `2c39f4a`.

| Sujeto | (a) `s3` sin revisor |
| --- | --- |
| [s3-1](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/s3-1.texts.txt) | ✅ `git show --remerge-diff`, sin revisor |
| [s3-2](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/out/s3-2.texts.txt) | ✅ `git show --remerge-diff --numstat`, sin revisor |

**Pasa 2/2: el Important no se reproduce en conducta.** Los dos sujetos leyeron `control-profiles.md`, que ya tenía el conteo del merge. Es la misma referencia que el s2-2 del primer GREEN de la Task 2 no abrió, así que el arreglo se mantiene (ruling de la pasada de fix), y `s3` queda como control.

Coste: 1,26 $ (0,57 + 0,69 $).
