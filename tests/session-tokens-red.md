# RED — el cierre mide la sesión (task 0068)

Campaña proporcional (Art. I): un escenario, dos sujetos. Previsión común con el GREEN: 4 sujetos, ~30 min y ~3,5 $; techo `COST_CAP=6` y `SUBJECT_CAP=4` en el lanzador, con parada a petición en `red/stop`.

- **Molde**: el repo de juguete `salas` de la 0060 (`closing_state`), más `.docs/sdd/estimation.md` y una tabla `pricing` en `sdd-kit.json`. Lanzador y salidas: [`red/`](../.docs/sdd/specs/20260924-230945-task-0068-session-tokens/red/).
- **Kit**: copia de `HEAD` de la rama tras la Task 2 (`5af7490`). Ya trae `Measure-SessionTokens.ps1`, pero no la guidance del cierre.
- **Escenario `w2`**: «Invoca la skill sdd-kit:sdd-end-task y cierra la task 0012 […]. El dev-lead validó: […]. Escribe `walkthrough.md` (pasos 1 y 2 del checklist) y para ahí». Sujetos `claude -p --model sonnet`.

## Resultado

| Sujeto | Tokens del hilo | Tokens de subagentes | Coste de la sesión | ¿Ejecutó el script? | Coste |
| --- | --- | --- | --- | --- | --- |
| w2-1 | `no medido` | `no consta en el hilo de cierre` | — (no hay línea) | no | 0,30 $ |
| w2-2 | `no medido` | `no medido — el plan prevé implementadores y revisores Sonnet…` | — (no hay línea) | no | 0,26 $ |

**Fallo exhibido, 2 de 2**: con el script en el kit, ninguno lo ejecuta, y los dos rellenan el hilo con «no medido», que es lo que la plantilla vigente llama «la salida honesta». Frases textuales: «Los tokens del hilo van como «no medido»» (w2-1); «Lo he dejado como «no medido» y anotado como pendiente del dev-lead» (w2-2).

**Fuente de la conducta**: la plantilla (`walkthrough-template.md`: ««no medido» es la salida honesta: el agente no tiene contador expuesto»). No es una fuente incidental: el fallo lo produce la guidance vigente, así que no hace falta otra tanda antes de escribir la nueva.

Coste del RED: 0,56 $ en 2 sujetos.
