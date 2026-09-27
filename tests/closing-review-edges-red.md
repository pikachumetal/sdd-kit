# RED — bordes del cierre frente a la revisión final (feature 0091)

Pasos 6 y 7 de `sdd-start-feature` y pasos 0 y 9 de `sdd-end-feature`, con el kit de la rama en `fbe8a0f` (el de `develop` tras la 0085 y el patch 0088, más la spec). El lanzador es el de referencia (`tests/headless/run.sh`) con [`red/subject.sh`](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/red/subject.sh). Sujetos Sonnet headless aislados (`SUPERPOWERS_DIR`, superpowers 6.4.2), 2026-09-27.

El molde es el repo `salas` de la 0085, feature 0012 en Native, con el hook de la 0085 ([`deny-agent.mjs`](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/deny-agent.mjs)): deniega `Agent` y guarda el encargo en `agent-prompts.txt`. Salidas en [`red/out/`](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/red/out/).

## Pieza (1) — El cierre re-revisa el tramo antes del walkthrough

Escenarios:

- `e1`: el sujeto entra por `sdd-end-feature` con `Revisión final: …, sobre <sha>` en `tasks.md` y un commit posterior en `src/slots.js` (el minor diferido de la validación repetida). El dev-lead ya validó y pide cerrar.
- `e0`, control: igual, pero sin commits posteriores salvo el de `tasks.md` (3 líneas de docs, que se revisa en el hilo).

Criterio: (a) en `e1`, despacha la re-revisión del tramo antes de escribir el walkthrough; en `e0`, no despacha ninguna.

| Sujeto | (a) |
| --- | --- |
| [e1-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/red/out/e1-1.tools.txt) | ❌ `Agent` «Re-revisión del tramo b31233c..9796f08» después de escribir el walkthrough, el roadmap y el changelog |
| [e1-2](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/red/out/e1-2.tools.txt) | ❌ `Agent` «Re-review post-final-review commit 1c6e728» después del changelog, el roadmap, la capacidad y el walkthrough |
| [e0-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/red/out/e0-1.tools.txt) | ✅ ningún despacho |

**`e1` falla 0/2 y `e0` pasa 1/1.** Los dos sujetos de `e1` re-revisan, y lo sacan del «Ruling» de `control-profiles.md`: e1-1 dice «ese commit no entra en la excepción de commits pequeños de `.docs/`». Pero la re-revisión llega en la posición del paso 9, después de la documentación. Es el fallo del ticket 0085 §2.

Coste: 3,97 $ (e1: 1,35 + 1,78 $; e0: 0,84 $).

## Pieza (2) — La pasada de fix de la revisión final no abre re-revisión

Escenarios:

- `r1`: la revisión final de Native devolvió un Important real, el mensaje recortado de `free`, y está apuntada en `tasks.md`. Se pide hacer la pasada de fix y presentar la validación.
- `r2`, control: la pasada ya está hecha y apuntada (`Pasada de fix: <sha>, 1 hallazgo RED→GREEN`), y después hay un commit del hilo en `src/`.

Criterio: (a) en `r1`, no despacha re-revisión tras su pasada y lo dice; en `r2`, sí la despacha; (b) en `r2`, el tramo empieza en la pasada.

| Sujeto | (a) | (b) |
| --- | --- | --- |
| [r1-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/red/out/r1-1.texts.txt) | ❌ arregla con TDD y despacha «Re-review final del tramo post-fix» `ddf3e15..dfc9eb6` | — |
| [r1-2](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/red/out/r1-2.texts.txt) | ❌ arregla con TDD y despacha la re-revisión del tramo `ddf3e15..HEAD` | — |
| [r2-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/red/out/r2-1/agent-prompts.txt) | ✅ despacha | ❌ «revisar SOLO el tramo `e394581..HEAD`», desde la revisión, con la pasada dentro |

**`r1` falla 0/2; `r2` pasa (a) 1/1 y falla (b) 0/1.** La letra del paso 7 («si `HEAD` avanzó desde el commit de la línea `Revisión final:`») manda re-revisar la pasada, aunque `executing-plans` diga «Do not dispatch a re-review». Es el fallo del ticket 0085 §3.

Coste: 2,31 $ (r1: 0,72 + 0,90 $; r2: 0,69 $).

## Pieza (3) — El revisor final en lite

Escenarios:

- `l1`: una feature lite con la implementación commiteada y sin revisión final. Se pide seguir hasta presentar la validación.
- `l2`: la misma spec sin nada implementado. Se pide implementar y seguir con el flujo, como en la 0086.

Criterio: (a) despacha el revisor final antes de presentar la validación.

| Sujeto | (a) |
| --- | --- |
| [l1-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/red/out/l1-1.texts.txt) | ✅ `Agent` `sdd-kit:effort-high` + `opus` «Revisión final feature 0012», con la cabecera, antes de presentar |
| [l1-2](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/red/out/l1-2.texts.txt) | ✅ el mismo despacho, antes de presentar |
| [l2-1](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/red/out/l2-1.texts.txt) | ✅ sube a full por su cuenta, implementa y despacha el revisor final antes de presentar |
| [l2-2](../.docs/sdd/specs/20260927-150813-feature-0091-closing-review-edges/red/out/l2-2.texts.txt) | — ruido del molde: la base no tiene `free`, el predicado lite cae y el sujeto para a preguntar el alcance |

**Pasa 3/3 entre los sujetos válidos.** No sacan la conducta de una fuente incidental, sino del propio `SKILL.md`: la revisión final que presupone el paso 7 y el revisor final de Native del paso 6. El baseline no muestra el fallo, así que la guía no se escribe (Art. I). Lo aprobó el dev-lead como enmienda de la spec: «Recortarla (Recomendada)». `l1` queda como control en el GREEN.

Coste: 3,70 $ (l1: 0,92 + 0,60 $; l2: 1,69 + 0,49 $).

## Total

10 sujetos, 9,99 $.

Límites:

- El hook impide ver qué apunta el sujeto cuando vuelve el revisor. En `r1`, la línea `Pasada de fix:` no se mide en el RED, porque la forma no existe en el kit vigente.
- Un primer intento del GREEN, con 10 sujetos en paralelo, agotó los procesos de la máquina (`fork: Resource temporarily unavailable`) y ninguno terminó. Su coste parcial no queda medido: el `result` de cada sujeto no llegó a escribirse.
