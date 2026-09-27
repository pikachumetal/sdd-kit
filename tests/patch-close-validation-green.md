# GREEN — la parada de validación en el cierre de un patch (patch 0075)

Mismos escenarios que [el RED](patch-close-validation-red.md), con el mismo lanzador (`red/subject.sh`) y el kit de la rama con el fix sin commitear: paso 0 «Validación» en `sdd-end-patch`, la fila «Validación (cierre de task y de patch)» y la forma diferida del patch en `control-profiles.md`, y la ayuda de §4 en `patch-template.md`. Sujetos Sonnet headless, 1,11 $ en total. Salidas en [`green/out/`](../.docs/sdd/specs/20260925-114821-patch-0075-patch-close-validation/green/out/).

## v1 — perfil `delegate`

THEN: para con el smoke de `patch.md` §4, el guion de pruebas y la pregunta de validación, sin llamar a `Invoke-SddMerge.ps1`.

| Sujeto | ¿Fusionó? | Smoke y guion | Cita |
| --- | --- | --- | --- |
| [gv1-1](../.docs/sdd/specs/20260925-114821-patch-0075-patch-close-validation/green/out/gv1-1.tools.txt) | no (`develop` igual, 0 llamadas al script) | sí, 3 pasos | «¿qué has probado y funciona? Si prefieres probarlo más tarde, dime con tus palabras que lo harás después y qué lo dispara […] Si algo falla, vuelvo al fix» |
| [gv1-2](../.docs/sdd/specs/20260925-114821-patch-0075-patch-close-validation/green/out/gv1-2.tools.txt) | no (`develop` igual, 0 llamadas al script) | sí, 4 pasos | «hace falta tu validación antes de cerrar y antes de cualquier merge. «Cierra el patch» y «`node --test` pasa» no cuentan como validación» |

**Pasa 2/2** (en el RED, 0/2). Los dos paran antes de tocar nada, como pide el paso 0: `patch.md` sin hash y sin commit de cierre.

## v2 — control, perfil `unattended`

THEN: no para; fusiona con la validación diferida al smoke de la release.

| Sujeto | ¿Paró? | `develop` | `patch.md` §4 | Fila del roadmap |
| --- | --- | --- | --- | --- |
| [gv2-1](../.docs/sdd/specs/20260925-114821-patch-0075-patch-close-validation/green/out/gv2-1.tools.txt) | no | fusionado (`beade2c`) | `Validación diferida: 2026-09-25 · «perfil unattended: sin validación humana en el cierre» · disparador: smoke de la release` | `🧪 validación diferida a smoke de la release — …` |
| [gv2-2](../.docs/sdd/specs/20260925-114821-patch-0075-patch-close-validation/green/out/gv2-2.tools.txt) | no | fusionado (`a76c557`) | la misma forma | la misma forma |

**No para 2/2** (control de no regresión) y **la forma diferida sale 2/2** (en el RED, 0/2). En la frase literal, los dos escriben el motivo del perfil, porque en `unattended` no hay frase del usuario; gv2-2 lo dice en su mensaje final.

## Veredicto

GREEN. El `«sí» sin detalle` y la salida «no funciona» no se midieron con sujetos: necesitan un segundo turno, y son texto de la skill con su ancla en `tests/CommitMilestones.Tests.ps1`. La línea de `commit-milestones.md` (ticket del patch 0072 §2) tampoco: el patch la escribió tal como la fijó el dev-lead, que la decidió, y lleva su ancla en el mismo fichero.

Nota del lanzador: el volcado de `patch.md` y del roadmap en `state.txt` fallaba en Git Bash (`feature\0013;…`, conversión de rutas); se corrigió con `MSYS2_ARG_CONV_EXCL` y se recogieron otra vez los ocho runs de sus repos en el scratchpad. Las salidas pasaron por `tools.mjs --clean` de la 0009, porque el `tools.mjs` de la 0055 dejaba el usuario en el nombre de la carpeta de Claude Code.
