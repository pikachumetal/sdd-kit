# GREEN — umbral para proponer partir una feature (patch 0078)

Mismos escenarios que [el RED](split-threshold-red.md), con el mismo lanzador y `red/subject.sh`, y el kit de la rama con el fix sin commitear: paso 2 y fila de racionalizaciones de `sdd-start-feature`, y punto 5 de «Qué entrada es» de `sdd-roadmap`. Sujetos Sonnet headless, 1,07 $. Salidas en [`green/out/`](../.docs/sdd/specs/20260925-175850-patch-0078-split-threshold/green/out/).

## h — 4-5 tasks homogéneas: NO debe proponer partir

| Sujeto | ¿Propone partir? | Cita |
| --- | --- | --- |
| [h-1](../.docs/sdd/specs/20260925-175850-patch-0078-split-threshold/green/out/h-1.texts.txt) | no | «prevés 5 tasks, una por subcomando. Todas tocan la misma superficie (CLI en un fichero), son de solo lectura y no llevan migración. **No propongo partirla.**» |
| [h-2](../.docs/sdd/specs/20260925-175850-patch-0078-split-threshold/green/out/h-2.texts.txt) | no | «prevé unas 5 tasks (una por subcomando). Todas tocan la misma superficie (CLI), sin migración. Por eso **no propongo partirla**» |

**Pasa 2/2** (en el RED, 1/2). Los dos cuentan 5, no 3: con el tramo 4-5 ya no hace falta rebajar el recuento para no partir.

## x — 4-5 tasks heterogéneas: debe proponer partir

| Sujeto | ¿Propone partir? | Cita |
| --- | --- | --- |
| [x-1](../.docs/sdd/specs/20260925-175850-patch-0078-split-threshold/green/out/x-1.texts.txt) | sí, recomendada | «prevo **4 tasks** que tocan superficies distintas, y una lleva migración … el kit manda proponer partirla» |
| [x-2](../.docs/sdd/specs/20260925-175850-patch-0078-split-threshold/green/out/x-2.texts.txt) | sí, recomendada | «Tocan superficies distintas (datos, API, UI) y una lleva migración, así que propongo partirla» |

**Pasa 2/2**, y ahora con el motivo del criterio (superficies y migración), no solo el recuento.

## Veredicto

GREEN. No se midieron con sujetos los extremos (≤ 3 y > 5), que no cambian de conducta respecto del umbral viejo salvo por el tramo 4-5, ni el punto 5 de `sdd-roadmap`, que remite al mismo criterio. Ancla del literal en `tests/ControlProfiles.Tests.ps1`.
