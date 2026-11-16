# Carril spike — GREEN (feature 0163)

Kit de la rama, Sonnet, 2026-11-01. Salidas en `green/out/` y `refactor/out/` de la carpeta de la spec.

| Frente | Escenario | Resultado | Evidencia |
| --- | --- | --- | --- |
| Spec corta | `k2` | 2/2 | `mode: spike`, con pregunta, objetivos y decisión, sin Intent, Scope ni delta |
| Plan con «Evidencia» | `k2p` | 2/2 | ningún «Tests RED»; `Ejecución: native` |
| Estados del research | `sp1` | 2/2 | `no cumple tal como se definió`, `no medido`, `no medido con una persona`; la recomendación no apoya en ninguno |
| Aguante | `sp2` | 3/3 | 10-12 repeticiones, con la carga confirmada y el recurso acumulado |
| Sin código de producción | `sp3` | GREEN 1/2 en la fila; tras REFACTOR, 2/2 | `src/` intacto en los cuatro; §5 con el arreglo y su fila tras escribir el hueco en la plantilla |
| Control | `h1` | 1/1 | la feature normal sigue con sus RED |

Las reglas del research funcionan solo con la plantilla: sin el párrafo en `sdd-implement`, `sp1` y `sp2` salieron 2/2 (ADR 0014). Por eso esa skill solo gana una frase, y baja 30 palabras.

## Eje Spec

`sv1`, Opus, RED limpio 3/3 sobre el kit de la apertura: los tres sujetos marcan la recomendación que cita O2, la fila de O1 y `src/app.js`. Con caso de campo se midió con n = 3 y sale de lo que se arregla: `spec-reviewer-prompt.md` no cambia, y `sv1` sigue como control. La regla del research la lleva la plantilla, y el eje recibe su ruta (ticket de la 0091 §2). «Solo el eje Spec» es texto de la tabla, sin sujeto propio.

## Tras la revisión final

Kit de la rama con la pasada de fix, Sonnet, n = 1 salvo `sp3`: `sp1` con O4 medido con otra carga da `no medido` sin frase nueva; `sp2` deja el script en la carpeta de la spec, y `sp3-1` no, porque el plan del molde no lo nombraba: corregido el molde, ver abajo; `k2p` nombra `research.md` y el script; controles `p2` y `ax` sin cambios. `sp3` nombra el arreglo y dice que la fila se abre con `sdd-roadmap`, pero ninguno de los dos la abrió: esa parte de la rúbrica queda a medias. «Sale solo el eje Spec» y `execution: subagent` en un spike, sin medir. Campaña: 34 sujetos, 23,64 $.
