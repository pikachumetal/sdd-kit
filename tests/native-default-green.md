# Evidencia GREEN — Native por defecto, el método lo elige el handoff (task 0055, 2026-09-24)

Mismas conductas que el RED ([`native-default-red.md`](native-default-red.md)). Previsión y techo comunes a las tasks 0055, 0057 y 0058: techo de 65 $, que aplica el lanzador común [`red/run.sh`](../.docs/sdd/specs/20260924-082516-task-0055-native-default/red/run.sh). Salidas: `green/out/`.

## Método

- **Paso 5** (`g1`, `g2`, `g3`): Sonnet headless sobre el molde `salas` de la 0044, con la spec de la task 0012 aprobada en `feature/0012` y la petición «escribe el plan y sigue hasta justo antes de ejecutar la Task 1; para ahí». `g1`: `delegate`, sin `execution`. `g2`: `pair`, sin `execution`. `g3-1`: `delegate` con `"execution": "subagent"`. `g3-2`: `pair` con `"execution": "native"`. Lanzador: [`red/subject.sh`](../.docs/sdd/specs/20260924-082516-task-0055-native-default/red/subject.sh).
- **Entrevistas** (`ig`, `ib`, `im`), a un turno: init greenfield con la pregunta 20 (frenos) respondida, init brownfield con la 4 (frenos) respondida, y migración v1.2.0 de un proyecto al que solo le falta `execution`. Lanzador: [`red/interview.sh`](../.docs/sdd/specs/20260924-082516-task-0055-native-default/red/interview.sh).
- `KIT_DIR`: copia de `5c9f401` (Task 1) en la primera tanda; copia de `a789242` (Tasks 1–3 y REFACTOR) en la segunda.

## Sujetos

| Sujeto | Escenario | Kit | Coste | Resultado |
| --- | --- | --- | --- | --- |
| `g1-1` | `delegate`, `auto` | `5c9f401` | 0,49 $ | Cabecera `**Ejecución**: native, porque el plan tiene una sola task pequeña sin interfaces entre tasks…`. No para por el método; para por un hueco de alcance del molde (la spec pide validar «libres» y el código no tiene esa función) |
| `g1-2` | `delegate`, `auto` | `5c9f401` | 0,47 $ | `**Ejecución**: native, porque es una sola task pequeña en un solo fichero, sin dependencias entre tasks.` No para por el método: «En `delegate` el plan no tiene gate, pero paro aquí por lo pedido y por la pregunta» |
| `g2-1` | `pair`, `auto` | `5c9f401` | 0,46 $ | Cabecera `native, porque…`; la pregunta del gate: «¿Apruebas el plan tal como está (con la opción A…)?», **sin el método entre las opciones** |
| `g2-2` | `pair`, `auto` | `5c9f401` | 0,48 $ | «¿Apruebas el plan y la ejecución native?»: nombra el método, pero **sin ofrecer el otro** como opción |
| `g3-1` | `delegate`, `subagent` fijado | `5c9f401` | 0,57 $ | `**Ejecución**: subagent, fijado en sdd-kit.json`; no pregunta el método |
| `g3-2` | `pair`, `native` fijado | `5c9f401` | 0,41 $ | `**Ejecución**: native, fijado en sdd-kit.json`; la parada solo pide aprobar el plan |
| `g2-3` | `pair`, `auto` | `a789242` | 0,45 $ | Cabecera `native, porque…`; «¿Apruebas el plan, con ejecución native (recomendada), con subagent, o quieres cambios?»: el método entre las opciones, la recomendada primero. Va en el mismo mensaje que la pregunta del hueco del molde |
| `g2-4` | `pair`, `auto` | `a789242` | 0,41 $ | Cabecera `native, porque…`; «¿Apruebas el plan, y con qué método?» con «Apruebo, con Native (Recomendada)», «Apruebo, con subagent-driven» y «Cambios» |
| `ig-1` | init greenfield | `a789242` | 0,24 $ | «Pregunta 21 de la entrevista, método de ejecución», sola, con `auto` recomendado y su motivo; no escribe `sdd-kit.json` antes de la respuesta |
| `ib-1` | init brownfield | `a789242` | 0,20 $ | «Pregunta 5: ¿cómo se ejecutan los planes?», sola, con `auto` recomendado; no escribe nada antes de la respuesta |
| `im-1` | migración v1.2.0 | `a789242` | 0,28 $ | Detecta que solo falta `execution`, hace esa única pregunta con `auto` recomendado y deja el marcador sin escribir hasta la respuesta |

**Coste del GREEN**: 11 sujetos, 4,44 $. **Campaña de la 0055** (RED + GREEN): 13 sujetos, 5,83 $. **Acumulado de la campaña 0055–0058**: 5,83 $ de 65 $.

## Veredicto

| Conducta | RED | GREEN |
| --- | --- | --- |
| En `delegate` y con `auto`, el plan lleva `Ejecución: <método>, porque <motivo>` y no para por el método (`g1`) | falla 2/2 | **pasa 2/2** |
| En `pair`, una sola pregunta aprueba el plan y elige el método, con la recomendada primero (`g2`) | falla (texto) | 0/2 con la celda de la tabla → **2/2 tras el REFACTOR** |
| Con `execution` fijado, el método no se pregunta y manda el valor fijado (`g3`) | falla (texto) | **pasa 2/2** |
| Las init y la migración preguntan `execution` (`ig`, `ib`, `im`) | falla (texto) | **pasa 3/3** |
| El aviso del hook nombra los agentes | falla (texto) | **pasa**: `KitSessionSource.Tests.ps1`, 3 `It` nuevos |

## REFACTOR

`g2` falló 2/2 la forma: la regla de `pair` solo estaba en la celda de la tabla de gates, y los dos sujetos la leyeron (`control-profiles.md` está entre sus lecturas) y aun así pidieron aprobar el plan sin dejar elegir el método. Es un fallo de forma (Art. II): el paso 5 da ahora la forma literal de la pregunta —«Apruebo, con <método recomendado> (Recomendada)», «Apruebo, con <el otro método>» y «Cambios»; con `execution` fijado, solo «Apruebo» y «Cambios»—, fijada por el `Describe 'REFACTOR — …'` de `NativeDefault.Tests.ps1`.

## Observaciones sin guía

- **El molde tiene un hueco de alcance**: la spec de la task 0012 pide validar la franja al «consultar libres» y `src/slots.js` no tiene esa función. 8 de 8 sujetos del paso 5 lo vieron y pararon a preguntarlo, en `delegate` también, porque cambia la spec (desvío) o la salida observable. No es el handoff: ninguno paró por el método.
