# GREEN — `sdd-config` con `review.minors` y `pricing` (feature 0178)

Mismos escenarios que el [RED](sdd-config-0178-red.md), con el kit de la rama (Task 1): `sdd-config` en inglés, con las preguntas 9 (`review.minors`) y 10 (`pricing`). Salidas en `green/out/` y `green-init/out/` de la [carpeta de la feature](../.docs/sdd/specs/20261020-112618-feature-0178-sdd-config-english/).

**Gastado en la Task 1**: 7 sujetos (2 RED, 4 GREEN de `sdd-config` en dos rondas, 1 humo de `sdd-init`) y 1,18 $.

| Escenario | Medida | RED | GREEN |
| --- | --- | --- | --- |
| `cf1` | la tabla enseña `pricing` como «falta» y que el cierre da «sin precio» | 0/1 | 1/1 (ronda 1) · 1/1 (ronda 2) |
| | propone la tabla de precios en la pregunta, leída de la página oficial, con modelos, columnas, fuente y fecha | 0/1 | ronda 1: **0/1** (preguntó «¿la escribo?» sin leer la página ni enseñar la tabla) · ronda 2: **1/1** (leyó `https://platform.claude.com/docs/en/about-claude/pricing`, tabla de `claude-opus-5-5`, `claude-sonnet-5-5` y `claude-haiku-5-5` con las cinco columnas, `source` y `updated: 2026-10-20`) |
| | «defer» se escribe como `review.minors` | 0/1 | 1/1 · 1/1 (`"review": {"minors": "defer"}` en `sdd-kit.json`) |
| | no escribe sin respuesta: `pricing` sigue sin escribir (control) | 1/1 | 1/1 · 1/1 |
| `cf2` | pregunta `review.minors`, sola, con `defer` recomendada y el motivo del catálogo | 0/1 | 1/1 |
| | la tabla enseña `pricing` con su `updated` y no la pregunta | 0/1 | 1/1 («Opus 5.5 y Sonnet 5.5, leído el 2026-10-11»; avisa de que falta Haiku, sin preguntarla) |
| ambos | habla en castellano (control de la traducción) | 2/2 | 3/3 |
| `n4` de `sdd-init` | la init arranca con la lista nueva de claves (humo) | — | 1/1 |

## Ronda 2

El fallo de la ronda 1 es de forma (Art. II): el sujeto sabía que tocaba la tabla, pero preguntó sin ella. La fila 10 pasó de «Recommended yes, with the table proposed in the question…» a «Recommended yes. Before asking, read <página> and put the proposed table in the question…»: un paso literal en el sitio donde se decide, como la regla de la feature 0165.

## Observaciones

- En `cf1` ronda 2, el sujeto avisa por su cuenta de que Haiku 5.5 tiene un tramo más caro para prompts de más de 100.000 tokens, y de que la tabla usa el barato. La tabla `pricing` de este repo dice lo mismo en su `source`. No se escribe guía: la página lo dice y el sujeto lo cuenta.
- La sesión del sujeto avisa de que «carga el kit 2.3.4 y el proyecto pide el 3.0.0»: el marcador del molde lleva la versión de la última migración (`v3.0.0.md`) y `plugin.json` sigue en 2.3.4 hasta la release. Es ruido del molde y no cambia lo medido.
