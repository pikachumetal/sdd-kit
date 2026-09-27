# RED — modelo y effort de la sesión que ejecuta en Native (task 0058)

Kit: copia del working tree en `3924330`, antes de la guía. Molde `salas` (tasks 0044, 0055 y 0057). Lanzador y sujetos en `.docs/sdd/specs/20260924-225741-task-0058-session-model-policy/red/`, salidas en `red/out/`.

| Escenario | Qué mide | Sesión del sujeto |
| --- | --- | --- |
| `d4` | gate de la spec en `delegate`: ¿ofrece bajar la sesión a gama media antes de ejecutar? | Opus |
| `p5` | paso 5 en `pair` hasta el gate del plan: ¿lo ofrece? ¿la línea `Ejecución` lo registra? | Opus |
| `c1` | cierre tras una ejecución Native; la petición da el modelo y el effort de cada fase: ¿qué escribe en «Modelo del hilo»? | Sonnet |

Con Sonnet, `d4` y `p5` no miden nada: la sesión ya es de gama media. Por eso los 8 streams de gate de la 0055, todos en Sonnet, no valen como RED, aunque 0 de 8 mencionan el modelo de la sesión.

## Resultados

| Sujeto | Turnos | Coste | Resultado |
| --- | --- | --- | --- |
| `d4-1` | 9 | 0,77 $ | ✗ presenta la spec y pregunta «¿Apruebas la spec?». Ninguna mención al modelo de la sesión. Dice: «Después sigo sin más paradas hasta la validación (en `delegate` el plan no tiene gate).» |
| `d4-2` | 12 | 0,47 $ | ✗ igual: ninguna mención al modelo ni al effort de la sesión |
| `p5-1` | 16 | 1,02 $ | ✗ carga `superpowers:writing-plans`, con su «Runs well with a mid-tier session model» delante, y no lo traslada: «5. **Ejecución recomendada: Native.** Es una task aislada y el plan ya trae el código.» La línea `Ejecución` no dice nada de la sesión |
| `p5-2` | 12 | 0,76 $ | ✗ carga `writing-plans` y no lo menciona; la línea `Ejecución` no dice nada de la sesión |
| `c1-1` | 14 | 0,40 $ | ✗ de forma: registra las dos fases con su effort, pero parte la línea en dos etiquetas propias, «Modelo de spec y plan: Opus 5.5, effort medium.» y «Modelo del hilo de ejecución (Tasks 1 y 2, Native): Sonnet 5, effort medium (cambio con `/model` antes de la Task 1).», y la línea «Modelo del hilo» de la plantilla desaparece |

Total: 5 sujetos, 3,41 $. Campaña común de la 0055, 0057 y 0058: 23,66 $ de un techo de 65 $.

## Veredicto

- **`d4`, 0 de 2** ofrecen bajar la sesión antes de ejecutar. El gate de la spec es la última parada de `delegate`, y el sujeto lo dice él mismo: tras aprobar sigue sin parar. El usuario no tiene otro momento para cambiar de modelo.
- **`p5`, 0 de 2** lo ofrecen, y **0 de 2** lo registran en el plan. La fuente estaba delante: los dos cargaron `writing-plans`, cuyo handoff trae «Runs well with a mid-tier session model». No es una fuente incidental que otro sujeto pueda no abrir: la abrieron todos y no la usaron. Se escribe la guía.
- **`c1`, 1 de 1 con el contenido y 0 de 1 con la forma.** Con las dos fases delante, el sujeto las registra, pero con etiquetas que inventa. Es un fallo de forma (Art. II): la guía es la receta del placeholder, no una prohibición. La rama «effort no registrado» no se mide: el sujeto tenía el dato.
- **No se recorta nada.** Los tres escenarios se repiten en el GREEN.

## Observación fuera de alcance

`p5-2` escribió en el plan el revisor final con `sdd-kit:effort-low` + `sonnet` («diff de ~10 líneas, sin diseño que juzgar»), contra el techo del Art. IV (Opus con effort high) que fijó la 0057. El paso 6, que es donde la 0057 puso el despacho del revisor final, no llega a leerse en el paso 5. Va al ticket de la task.
