# RED — lo que crean las init (task 0019)

Baseline previo a la spec. Detalle, moldes y salidas en [`red/README.md`](../.docs/sdd/specs/20260922-211157-task-0019-init-files/red/README.md) de la carpeta de la task.

## Frentes y resultado

| Frente | Tipo | Medida | Resultado |
| --- | --- | --- | --- |
| Columna «Ficheros que toca» | estructural | `control-profiles.md` la lee; `roadmap-template.md` no la tiene | falla |
| `autoMemoryEnabled: false` | estructural | 0 menciones en `skills/` | falla |
| `.playwright-mcp/` y `.superpowers/` en `.gitignore` | estructural | 0 menciones en `skills/` | falla |
| Paridad migración–init | estructural | sin test general; solo comprobaciones sueltas por clave | falla |
| Log de estimación generado por el script | conducta | 10 sujetos de init archivados (tasks 0012, 0013 y 0020) | falla 10/10: 6 logs de 0 bytes y 4 cabeceras inventadas (una dice «Generado por `Build-EstimationLog.ps1`» sin haberlo ejecutado) |
| Proyecto de referencia citado por `sdd-start-task` | conducta | 2 sujetos headless con el campo en la constitution | **pasa 2/2**: los dos leen `../orders-api` antes del brainstorming y lo citan en la spec |

## Qué entra en la guidance

- Entran los cuatro frentes estructurales y el del log.
- El proyecto de referencia entra solo como **campo** de la constitution y **pregunta** de la entrevista. `sdd-start-task` no recibe guidance, porque el baseline no exhibió el fallo con el dato escrito (Art. I).
- La cita desde el brainstorming queda en deuda como **posible falso negativo**. El disparador observable sería un campo que solo da la ruta, sin «replica sus patrones», o una task que no parece un portado.

Coste del RED: 1,87 $ (dos sujetos). Los diez sujetos del log salen de streams archivados, sin coste.
