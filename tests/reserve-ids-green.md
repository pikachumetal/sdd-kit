# GREEN — reservar ids en vez de calcularlos (task 0059)

Los mismos escenarios y el mismo molde que el [RED](reserve-ids-red.md), ahora con la guidance nueva:

- **`nombrado.md`**: «el que reserva `Get-NextSddId.ps1 … -Reserve`», y la task partida toma un id reservado.
- **`sdd-start-patch`**, paso 2: el mismo cambio.
- **`sdd-start-release`**, paso 3: pasa a llamarse «Ids reservados», con una sola reserva `-Reserve -Count N`. También cambia `roadmap-fuente.md`.

Lanzador: [`red/run.sh`](../.docs/sdd/specs/20260924-105243-task-0059-reserve-ids/red/run.sh) con `OUT_NAME=green`. Salidas en [`green/out/`](../.docs/sdd/specs/20260924-105243-task-0059-reserve-ids/green/out/).

## Resultado: 3 de 3 reservan

| Sujeto | ¿Reserva? | Llamada | Contador | Coste |
| --- | --- | --- | --- | --- |
| p1-1 | sí, 0014 | `Get-NextSddId.ps1 … -Reserve`; rama `feature/0014` y carpeta `patch-0014` | 0014 | 0,31 $ |
| r1-1 | sí, 0014–0016 | `Get-NextSddId.ps1 -ProjectRoot . -Reserve -Count 3`, una sola reserva como pide el paso 3 | 0016 | 0,25 $ |
| t1-1 | sí, 0014 | `Get-NextSddId.ps1 … -Reserve` para la mitad partida | 0014 | 0,34 $ |

Veredicto contra el fallo del RED (r1-2, que calculó sin `-Reserve`): en release la reserva sale ahora del paso de la skill, con `-Count 3` en una sola llamada. Antes solo la hacía quien leía la ayuda del script.

## Límite de la medición

El RED falló 1 de 6 y el GREEN pasa 3 de 3, con un sujeto por escenario. Con esta muestra no se puede afirmar que el fallo haya desaparecido, solo que no reaparece. No se amplió la campaña porque el total de 9 sujetos es justo el techo declarado en la spec (decisión 10). La barrera que no depende de la muestra es el contrato de texto de `tests/TaskIds.Tests.ps1`: los tres arranques nombran `-Reserve`, y release nombra `-Reserve -Count`.

**Coste de la campaña completa (RED + GREEN)**: 9 sujetos y 2,95 $. La previsión era de 6 sujetos y ~5 $, y el techo de 9 sujetos y 10 $.
