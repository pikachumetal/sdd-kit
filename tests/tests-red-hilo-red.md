# Evidencia RED — tests escritos por el hilo principal antes de despachar (2026-09-09)

Baseline de la task [tests-red-hilo](../.docs/sdd/specs/20260909-173929-task-0000-tests-red-hilo/spec.md) (T16), que responde al §1 de [research-hackaton.md](../.docs/sdd/releases/v1.0.0/research-hackaton.md): con el default del kit (`subagent-driven-development`), ¿quién escribe los tests de una task y qué describen?

## Método

Sin gasto nuevo: la campaña GREEN de T11 ya es la fixture que pide §1.4 —spec `0077` de tres escenarios (un `MODIFIED`, dos `ADDED`), plan sin campo `Tests RED` (aunque su Step 1 dicta los tests), `sdd-start-task` paso 6 con `subagent-driven-development`— y sus dos runs con implementación (`rev-green-e3c`, `rev-green-e3d`, Sonnet headless, copia limpia del kit tras T11, `stream-json`) se releen con esta pregunta. Lo que se mira en el stream: `tool_use` de `Write`/`Edit` sobre `test/` y su posición respecto al primer `Agent`. Además, el análisis se corrió sobre los seis streams con despacho de la release (T11 E3, T12 A/B, T14 A/B): ningún hilo escribió tests antes de despachar en ninguno.

## Resultados

| | E3c | E3d |
| --- | --- | --- |
| Tests escritos por el hilo antes del primer `Agent` | **0** | **0** |
| Tests escritos por el implementador (tras el `Agent`) | `refunds.test.js` (Write), `orders.test.js` (Edit) | `refunds.test.js` (Write), `orders.test.js` (Edit) |
| Frase de contrato en el encargo del implementador | no | no |
| Un test por THEN de la spec | sí (3/3) | sí (3/3) |
| Aserciones fuera de la spec | — | `refund === null` al cancelar un pedido confirmado (la spec no lo dice) |
| Coste / turnos | 2,04 $ | 2,11 $ |

## Conclusión

**El origen falla 2/2**: el kit no dice quién escribe el RED con subagentes y el implementador los escribe siempre, en la misma pasada que el código. **La forma no falla en esta fixture**: los tests siguieron los tres THEN porque el plan los dictaba en su Step 1 y son tres escenarios de una función; la tautología que §1.2 vio en SifAcademy (la palabra del estado en la fixture del test) no aparece a esta escala. Se deja escrito: lo que mide este RED es el origen, que es lo que la guidance cambia; el aviso de forma queda como recomendación en la ayuda del campo `Tests RED` de `plan-template`, sin RED propio (Art. I).

GREEN en [tests-red-hilo-green.md](tests-red-hilo-green.md).
