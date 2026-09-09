# Evidencia RED — comentarios que citan documentos (2026-09-09)

Baseline de la task [comentarios-sin-citas](../.docs/sdd/specs/20260909-164438-task-0000-comentarios-sin-citas/spec.md) (T14), que responde al §4 de [research-hackaton.md](../.docs/sdd/releases/v0.6.0/research-hackaton.md): en los dos retos hubo 110 comentarios que citaban constitution, spec, task o funcional, y en el experimento del 9 de septiembre el implementador rompió la regla escrita 4 veces en 2 de 4 tasks. ¿Pasa lo mismo con el implementador que despacha el kit? Si no, el punto explícito para el revisor no se escribe (Art. I) y la regla queda como principio (Art. X) y forma (Restricciones globales).

## Método

Sujetos Sonnet headless (copia limpia del kit **anterior** a las ediciones de T14, `--add-dir`, `Agent`, `stream-json`), fixture "Ledgerly-rev" en estado `e3` (spec y plan aprobados; el plan lleva el Art. V de calidad de la fixture —sin comentarios que repitan el código— pero **no** la regla de citas). Petición: implementar la task 77 con `subagent-driven-development` en `feature/77`, despachos preaprobados. Medida: comentarios en `src/` y `test/` y cuántos contienen «spec», «constitution», «Art.», «task», «requisito» o «funcional».

## Resultados

| Run | Despachos | Comentarios | Con cita | Coste |
| --- | --- | --- | --- | --- |
| A | 3 (implementador, revisor de task, revisor final) | **0** | **0** | 2,06 $ |
| B | 1 — inconcluso: despachó al implementador en segundo plano y terminó el turno «esperando el informe» (trampa de método, anotada en `tech-stack.md`) | — | — | 0,84 $ |
| B2 (despachos en primer plano) | 4 (implementador, revisor de task, fix, re-revisión) | **0** | **0** | 2,59 $ |
| T11 E3 / E3c / E3d + RED (misma fixture, mismo flujo) | 5 + 3 + 3 + 5 | **0** en los cuatro | **0** | — |

## Conclusión

**El baseline no falla: 6/6 runs con implementador y revisores del kit producen código sin un solo comentario**, con o sin la regla de citas en las Restricciones. El fallo del hackaton (110 citas; 4 violaciones con la regla escrita) no se reproduce con este método: allí los implementadores trabajaban con C#/TypeScript y docs largos que citar; aquí Sonnet con Art. V en el encargo no comenta. Sin fallo no hay guidance (Art. I): **el punto explícito para el revisor en `encargo-revision.md` no se escribe**. Queda lo que ya es principio y forma: la regla en el Art. X del kit y nombrada en la ayuda de Restricciones globales de `plan-template`, que viaja al encargo de implementador y revisores por la cabecera de T11. Si un consumidor ve citas en su código, la review de task ya recibe el bloque y las marca como Important por el propio artículo.

Trampa de método (B): un sujeto que despacha con `run_in_background` termina su turno «esperando el informe» y la sesión headless acaba sin resultado; la petición debe pedir despachos en primer plano.
