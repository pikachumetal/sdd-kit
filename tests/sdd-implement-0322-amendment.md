# RED y GREEN — un revisor de spec antes de parar por una enmienda que cambia el delta (feature 0322)

Escenarios `c6`, `c8`, `c10` y `c10e` de la [batería de `sdd-verify`](batteries/sdd-verify/battery.md), sujetos headless con el modelo de cada escenario (Sonnet; `c10` en Opus). RED con el kit de `develop` (`git archive origin/develop:dist`, `3b179f84`); GREEN con `dist/` de la rama tras la Task 1. Salidas en [`red/out/`](../.docs/sdd/specs/20261109-102437-feature-0322-deviations-and-amendments/red/out/) y [`green/out/`](../.docs/sdd/specs/20261109-102437-feature-0322-deviations-and-amendments/green/out/). Origen: tickets de las features [0297 §1](../.docs/sdd/field-reports/20261108-180157-feature-0297-verify-removed-by-requirement.md) y [0306 §3](../.docs/sdd/field-reports/20261106-132240-feature-0306-propose-rework.md).

La fila nueva (C6r y C10r): falla si el sujeto para sin haber despachado antes un revisor en `sonnet` cuyo encargo trae los siete puntos de `review-spec.md` sobre la enmienda, o si su ✋ no trae sus hallazgos. Se lee en el `<etiqueta>.jsonl` (el encargo del `Agent`) y en `texts.txt` (el ✋). C5, C6 y C8 pasan a fallar por «otra re-revisión del código (el revisor de la enmienda no cuenta)».

## RED — kit de `develop`

| Sujeto | Qué hizo | Despachos `Agent` | C6 / C10 | C6r / C10r |
| --- | --- | --- | --- | --- |
| c6-1 | Para con 🦆 y ✋; el THEN corregido y su línea «sin aprobar» en «Enmiendas», sin commitear | 0 | pasa | falla |
| c6-2 | Lo mismo: «dejé la corrección en `spec.md` sin commitear… El THEN pasa a «Norte lun 10:00-12:00 — sala ocupada»» | 0 | pasa | falla |
| c10-1 | Para por el Minor que cambia la decisión 4; `spec.md` corregida sin commitear | 0 | pasa | falla |
| c10-2 | Lo mismo | 0 | pasa | falla |
| c10-3 | Lo mismo, «su línea en «Enmiendas», marcada como pendiente de aprobar» | 0 | pasa | falla |

**Veredicto RED: 0/5 en la fila nueva** (5 sujetos, 2,41 $). Los cinco paran bien por desvío, y ninguno pasa la enmienda por otra lectura: es el caso de la 0297. Las campañas guardadas daban lo mismo con kits anteriores (0 de 15 sujetos de `c6` y `c10` en la 0222, la 0246 y la 0291).

## GREEN — kit de la rama

| Sujeto | Revisor despachado (`model`, encargo) | El ✋ trae los hallazgos | Fila del escenario | Fila nueva |
| --- | --- | --- | --- | --- |
| c6-1 | `sonnet`, `sdd-kit:effort-medium`, encargo adversarial con los siete puntos | «**Qué dijo el revisor de la spec** (`sonnet`, `sdd-kit:effort-medium`, siete puntos)» | C6 pasa | C6r pasa |
| c6-2 | Lo mismo | «**Revisor de la enmienda** (uno, `sonnet`, con los siete puntos). Marco con * lo que yo cambiaría ahora» | C6 pasa | C6r pasa |
| c10-1 | Lo mismo | «Lo que hizo el revisor de la enmienda (sonnet). Le he aceptado dos cosas…» | C10 pasa | C10r pasa |
| c10-2 | Lo mismo | contrasta el hallazgo 4 del revisor con `mission.md` y lo nombra en el ✋ | C10 pasa | C10r pasa |
| c10-3 | `sonnet`, encargo que cita `review-spec.md` y sus siete puntos | «Un revisor `sonnet` leyó la enmienda: «aprobar con cambios». Ya están aplicados…» | C10 pasa | C10r pasa |

**Veredicto GREEN: 5/5 en la fila nueva** (C6r 2/2, C10r 3/3), con las filas de cada escenario en verde (`battery.mjs verdict`: puerta verde en los cuatro).

**Controles en la misma tanda**:

- `c8` 2/2 en C8, pero sin enmienda que medir. Los dos paran por el Important de `canceladas` a preguntar qué texto responde sin canceladas («elegir un texto cambiaría la salida observable»), con un THEN propuesto y sin escribirlo en la spec ni despachar el revisor. Es la parada de un freno de alcance (una decisión que cambia la salida observable), no la de un desvío con su corrección. El AND vigente aplica la acción update cuando la respuesta del dev-lead cambia la spec, y ahí sale el revisor. La revisión final (eje Spec, Important 2) lo leyó como la regla incumplida. El riesgo es el caso de la 0297 por otra puerta: que el dev-lead apruebe el THEN propuesto sin otra lectura. Va al ticket.
- `c10e` 2/2: los dos aplican la excepción (el ` - ` commiteado con su línea `sin aprobar`) sin parar por ella. `c10e-1` para después por otro hallazgo que sí cambia la spec (recortar espacios del motivo), con su revisor; `c10e-2` despacha la re-revisión del código. C10e pasa.

**Los encargos**: los de cada despacho `Agent`, enteros, en [`green/out/agent-prompts.md`](../.docs/sdd/specs/20261109-102437-feature-0322-deviations-and-amendments/green/out/agent-prompts.md) (los de `u1` y `u2` del tramo, en `tramo/out/agent-prompts.md`), extraídos de los `.jsonl`, que no se versionan.

**Coste de la tanda**: 9 sujetos (los 7 previstos más `c8`). Campaña acumulada tras RED, RED de `k4` y GREEN: 17 sujetos y 8,76 $.

**De paso**: la línea de aviso de `c6-1` mezcla inglés («dispatch the spec reviewer…»). Es el hallazgo §5 de la 0306 (la frase de idioma, en la 0311), no esta frase.
