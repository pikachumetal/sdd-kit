# GREEN — effort real al despachar (task 0031)

**Kit medido**: `git archive 7263e43 skills agents .claude-plugin hooks`, cargado con `--plugin-dir` y con el plugin publicado deshabilitado. RED en [`dispatch-effort-red.md`](dispatch-effort-red.md).

**Escenario**: el molde es un repo con un `plan.md` de una sola task. Su campo `Modelo` sigue la plantilla nueva: «Sonnet, effort medium — `subagent_type: sdd-kit:effort-medium` + `model: sonnet`». La petición es «Ejecuta la Task 1 de plan.md con superpowers:subagent-driven-development. Cuando vuelva el informe del implementador, para ahí». La sesión corre en `--model sonnet --effort high`, detrás del proxy del RED. El lanzador aborta si su `cwd` no está en el scratchpad. Molde, lanzador, streams y registros de peticiones en [`green/`](../.docs/sdd/specs/20260923-213417-task-0031-dispatch-effort/green/).

## Resultados

| Sujeto | Llamada `Agent` | Peticiones del subagente | Peticiones del hilo | Coste |
| --- | --- | --- | --- | --- |
| 1 | `subagent_type: sdd-kit:effort-medium`, `model: sonnet` | 5 de 5 con `effort: medium` | 12, todas `effort: high` (la sesión) | 1,90 $ |
| 2 | `subagent_type: sdd-kit:effort-medium`, `model: sonnet` | 5 de 5 con `effort: medium` | 17, todas `effort: high` | 0,96 $ |

Los dos implementadores crearon `hola.txt` y commitearon (`feat: añadir saludo`): el cuerpo neutro del agente no les impidió seguir el encargo, que era el riesgo 1 del plan.

## Veredicto por THEN

| THEN de la spec | Evidencia | Resultado |
| --- | --- | --- |
| La llamada a `Agent` lleva `subagent_type: sdd-kit:effort-medium` y `model: sonnet` | ejecución real, 2/2 | ✅ |
| Cada petición a la API del subagente lleva `effort: medium` | ejecución real (proxy), 10/10 peticiones | ✅ |
| Sin effort en el harness, `Modelo` dice «effort: no disponible en este harness, hereda el de la sesión» | suite (`AgentDefinitions.Tests.ps1`); no probado en ejecución real con un kit sin agentes | ✅ suite |
| El revisor de spec se despacha con `sdd-kit:effort-medium` y `model: sonnet` | suite (`AgentDefinitions.Tests.ps1`); no probado en ejecución real | ✅ suite |

Frente al RED: un despacho con solo `model` heredaba el effort de la sesión (P2, `probe-plain`: `high`). Con el tipo que nombra el plan, el subagente corre en `medium`, aunque la sesión esté en `high`.

**Lo que no se mide**: si un hilo con un plan antiguo («Sonnet, effort medio», sin el par literal) deduce el tipo. La spec no lo pide: los planes nuevos salen de la plantilla. El paso 6 de `sdd-start-task` no se tocó, y el GREEN confirma que no hacía falta.

**Coste de la campaña (previsión y techo comunes)**: RED ~2,0 $ + GREEN 2,86 $ = **~4,9 $** de un techo de 6 $. Sujetos lanzados: 4 sondas en el RED (1 inválida) y 2 sujetos en el GREEN, frente a los 7 previstos. La sonda de control no se relanzó: la cubre P2.
