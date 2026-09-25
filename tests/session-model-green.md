# GREEN — modelo y effort de la sesión que ejecuta en Native (task 0058)

Kit: copia del working tree en `088fca5`, con la guía de la Task 2 (pasos 4 y 5 de `sdd-start-task`, `plan-template.md`, `walkthrough-template.md` y Art. IV). Mismos escenarios, molde y lanzador que el [RED](session-model-red.md); salidas en `.docs/sdd/specs/20260924-225741-task-0058-session-model-policy/green/out/`.

## Resultados

| Sujeto | Turnos | Coste | Resultado |
| --- | --- | --- | --- |
| `d4-1` | 15 | 0,67 $ | ✓ opción B, literal: «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media». La recomendada es la A, «Apruebo». Motivo: «Esta sesión va con Opus 5.5. Si el plan sale en Native, la sesión implementa ella misma todas las tasks, y eso va bien en gama media (Sonnet con effort medium). Bajar solo el effort de Opus no es gama media. Yo no puedo cambiarme el modelo, y en `delegate` no hay otra parada después de aprobar donde puedas hacerlo tú.» |
| `d4-2` | 4 | 0,40 $ | ✓ opción C, literal, con el mismo motivo; la recomendada es otra (A) |
| `p5-1` | 13 | 0,88 $ | ✓ con matices: el texto de la opción no es literal, porque el sujeto la fusiona con su enmienda, y el motivo omite «bajar solo el effort de Opus no es gama media». Gate del plan con la opción 3: «Apruebo E1 y el plan, con Native, y paras antes de la Task 1 para que baje la sesión a gama media», que no es la recomendada, y lo que hará si la eligen: «Haré el commit de apertura y te diré el cambio (`/model`, Sonnet con effort medium). Cuando esté, me dices «sigue».» La línea `Ejecución` lleva la frase |
| `p5-2` | 15 | 0,95 $ | ✓ plan / — gate. Plan: la línea `Ejecución` lleva la frase. — gate: no llega. Para antes por una enmienda (el escenario «libres» del molde no tiene función detrás: el hueco que ya paró a 8 de 8 sujetos en la 0055) y anuncia la opción para el gate: «Entre sus opciones estará aprobar con Native y parar antes de la Task 1 para que bajes esta sesión a gama media (Sonnet, effort medium): la sesión va en Opus y no puede cambiar su propio modelo.» |
| `c1-1` | 9 | 0,35 $ | ✓ una sola línea con la etiqueta de la plantilla: «Modelo del hilo: Opus 5.5, effort medium (spec y plan) → Sonnet 5, effort medium (ejecución, Native)» |

Total: 5 sujetos, 3,26 $. Campaña de la 0058: 10 sujetos y 6,67 $, frente a una previsión de 10 sujetos y ~15 $. Campaña común de la 0055, 0057 y 0058: 26,92 $ de un techo de 65 $.

## Veredicto por THEN

| THEN de la spec | RED | GREEN |
| --- | --- | --- |
| El gate de la spec en `delegate` ofrece la opción, no recomendada y con su motivo | 0/2 | 2/2 |
| El gate del plan en `pair` ofrece la opción, no recomendada y con su motivo | 0/2 | 1/1 de los que llegaron al gate (n=1, texto no literal y motivo parcial); el otro la anuncia |
| Con Native, la línea `Ejecución` lleva la frase literal | 0/2 | 2/2 |
| «Modelo del hilo» con modelo y effort de cada fase | 0/1 (forma: dos etiquetas propias) | 1/1 |

No hay tanda de REFACTOR: el único gate que falta en `p5` lo corta el hueco del molde, no la guía, y el sujeto anuncia la opción igual. La rama «effort no registrado» sigue sin medir: en `c1` el sujeto tiene el dato.

## Tras la revisión final: `d5`, la parada elegida en `delegate`

El revisor final vio una contradicción: el paso 5 dice que en `delegate` «no hay gate: … sigue sin parar», sin excluir el caso en que el usuario eligió en el paso 4 parar antes de la Task 1. Si el agente obedece al paso 5, ejecuta con Opus. Antes de escribir la cláusula se midió (Art. I), con el kit del GREEN: `delegate`, spec aprobada con la opción de parar, paso 5, sesión Opus.

| Sujeto | Turnos | Coste | Resultado |
| --- | --- | --- | --- |
| `d5-1` | 15 | 0,84 $ | ✓ escribe el plan, junta la apertura y para con «Cámbiala con `/model` a Sonnet con effort medium. Bajar solo el effort de Opus no es lo mismo, y yo no puedo cambiar el modelo de la sesión.» Resultado confundido: también para por el hueco «libres» del molde |
| `d5-2` | 14 | 0,77 $ | ✓ molde sin ese hueco (`free_in_base` de la 0057): plan y apertura en `dd9638c`, ningún código, y «**Siguiente paso, tuyo:** baja la sesión a gama media con `/model`, Sonnet y effort medium. […] Cuando esté, di «sigue» y empiezo la Task 1» |

El RED no muestra el fallo: la conducta sale del propio paso 4, que ya dice qué hacer si el usuario elige la opción. No se escribe la cláusula en el paso 5. Con `d5` la campaña llega a 12 sujetos, el `SUBJECT_CAP`, y 8,28 $; la común, a 28,52 $ de 65 $.

## Observación fuera de alcance

El revisor final escrito en el plan siguió sin el techo del Art. IV en el paso 5: `p5-2` puso `sdd-kit:effort-medium` + `opus` (en el RED, `effort-low` + `sonnet`). Va al ticket de la task.
