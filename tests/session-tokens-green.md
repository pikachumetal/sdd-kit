# GREEN — el cierre mide la sesión (task 0068)

Mismo escenario `w2` y el mismo molde que el [RED](session-tokens-red.md), con dos sujetos. El kit es `HEAD` de la rama más la guidance nueva: el paso 2 de `sdd-end-task` y las líneas de coste de `walkthrough-template.md`. Salidas en [`green/out/`](../.docs/sdd/specs/20260924-230945-task-0068-session-tokens/green/out/).

## Resultado

| Sujeto | Tokens del hilo | Tokens de subagentes | Coste de la sesión | ¿Ejecutó el script? | Coste |
| --- | --- | --- | --- | --- | --- |
| w2-g1 | `135.002 - claude-sonnet-5 135.002` | `no aplica` | `0,16 $ (hilo 0,16 $)` | sí, con `-Path` y `-Branch feature/0012` | 0,25 $ |
| w2-g2 | `188.728 - claude-sonnet-5 188.728` | `no aplica` | `0,20 $ (hilo 0,20 $)` | sí, con `-Path` y `-Branch feature/0012` | 0,26 $ |

**Veredicto contra el RED**: el fallo desaparece, 2 de 2. Los dos ejecutan el script desde el Base directory de `sdd-templates` y pegan las tres líneas sin retocar las cifras. Los dos dicen además que la cifra solo cubre la sesión de cierre: «Miden la sesión de cierre; lo anterior a esta sesión (planificación y ejecución de las tasks) no consta en ese transcript» (w2-g1).

**Hueco del propio script que destapó el GREEN**: en las dos líneas, la raya «—» llegó como «-». Causa: llamado desde Git Bash, `pwsh` hereda la página de códigos `ibm437` de la consola, y la salida redirigida no va en UTF-8. Se arregló en el script (`[Console]::OutputEncoding` en UTF-8), con el test «escribe UTF-8 cuando la salida va redirigida a otro proceso», en RED antes del cambio, que fuerza una consola `Latin1`. No afecta a la conducta que mide la campaña ni al log, que lee la primera cifra. Por eso no se relanzó: la campaña ya había llegado a `SUBJECT_CAP=4`.

Coste de la campaña: 1,06 $ en 4 sujetos (RED 0,56 $ y GREEN 0,50 $), frente a una previsión de ~3,5 $ y un techo de 6 $.
