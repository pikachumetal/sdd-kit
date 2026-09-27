# GREEN — ciclo de vida de capacidades (task 0003)

Kit de la rama `feature/0003` tras `9a2089a`, servido desde una copia limpia con `--plugin-dir`. Mismos moldes y peticiones que E1 y E2 del [RED](capabilities-red.md), dos sujetos headless Sonnet por escenario. Cuatro sujetos, 3,20 $ en total. E3–E5 no se repiten: no fallaron en el RED.

Moldes y lo que produjo cada sujeto: [`green/`](../.docs/sdd/specs/20260921-081125-task-0003-cap-lifecycle/green/). Lanzador: el mismo `red/run.sh`, apuntado a `green/`.

## Veredicto por fallo del RED

| Fallo del RED | E | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| Slug de la capacidad nueva en castellano (`avisos` 2/2) | E1 | `email-notifications` | `booking-notifications` | **Corregido 2/2** |
| Valores de comportamiento copiados a `tech-stack.md` (2/2) | E2 | «Cuándo se envía cada aviso y con qué tiempos: [`capabilities/bookings.md`]… Los valores viven solo allí.» | «Constantes de los avisos: `REMINDER_HOURS_BEFORE`… Los valores y su significado viven en [`capabilities/bookings.md`]» | **Corregido 2/2** |

Los dos sujetos de E2 hicieron lo que pide la regla y no solo evitaron el valor: nombraron dónde está la pieza técnica (la constante, el fichero) y enlazaron la capacidad. El plan del molde seguía pidiendo «documentar en `tech-stack.md` … los tiempos», así que la regla del paso de aprendizajes ganó a la instrucción del plan.

## Los positivos del RED siguen igual

| Conducta | E | Sujeto 1 | Sujeto 2 |
| --- | --- | --- | --- |
| Capacidad nueva en vez del cajón `aulario` | E1 | sí | sí, y nombra la alternativa descartada («meterlo en `aulario` como en las tasks 0001–0003») |
| Fusión del delta al cierre | E2 | sí | sí |
| `MODIFIED` aditivo sin perder los `AND` vigentes | E2 | cambia solo el `THEN`; los dos `AND` siguen | ídem |
| Valor construido (12 h), no el del delta (24 h) | E2 | 12 h | 12 h, y lo anota en el historial |
| Texto de recordatorios retirado de `legacy.md` | E2 | sí | sí |

El `MODIFIED` de bloque entero no cambió la conducta de fusión, que era el riesgo de la decisión 9 de la spec: los agentes ya fusionaban así, y ahora la letra de la plantilla dice lo mismo que hacen.

## Huecos de la propia guidance

Ninguno observado. Queda sin medir la conducta bajo presión (sesiones largas con subagentes), que el RED tampoco midió: va a la fila de deuda del roadmap junto con los frentes que el RED no reprodujo.
