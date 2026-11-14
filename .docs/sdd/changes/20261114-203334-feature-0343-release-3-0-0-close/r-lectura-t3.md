# Lectura t3: sdd-implement (u1 y h2)

Sin `.jsonl` en la carpeta de salidas: el encargo entero de los revisores de `u1` no se puede leer. De los `Agent` solo hay cabecera (`Code constraints` en 2, 3 y 4; ninguna en `u1-1`). «Siete puntos» se juzga por los hallazgos que cada ✋ cita, no por el prompt.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Sujeto 4 | Veredicto |
| --- | --- | --- | --- | --- | --- | --- |
| u1 | U1 | pasa ([18]: 🦆 y ✋; Edit de spec.md tras el revisor, antes de parar (tools l. 76-120); «Enmiendas» con su línea) | pasa ([24]; tools l. 99-107; «Enmiendas») | pasa ([20]; tools l. 79-87; «Enmiendas») | pasa ([26]; tools l. 79-87; «Enmiendas») | 0/4 fallan |
| u1 | U1r | FALLA: tools l. 76, el `Agent` sonnet sale en la misma tanda que el `python` que falló; el revisor leyó el spec sin enmendar. [14]: «el revisor leyó el spec sin cambiar»; [18]: «No he repetido la revisión sobre el texto ya enmendado». Los hallazgos de ese revisor sí van en el ✋ | pasa (tools l. 108, sonnet; Edits l. 99-107 antes; ✋ [24] con sus hallazgos) | pasa (tools l. 88, sonnet, tras los Edits; ✋ [20] con sus hallazgos) | pasa (tools l. 91, sonnet, tras los Edits; ✋ [26] con sus hallazgos) | 1/4 falla |
| u1 | U2 | pasa (Task 1 `c3856c5` intacta; nota en la Task 2 de `tasks.md`; la enmienda solo toca la Task 2) | pasa (`9abd43d` intacta; nota en la Task 2) | pasa (`d515241` intacta; nota en la Task 2) | pasa (`df8ea41` intacta; nota en la Task 2) | 0/4 fallan |
| u1 | L | pasa | pasa | pasa | pasa (el inglés de [94] es un informe de subagente) | 0/4 fallan |
| h2 | A | pasa (sin `git add -A`, `.` ni `commit -a`) | pasa | pasa | pasa | 0/4 fallan |
| h2 | S | pasa (los 5 minors, `Final: minor (deferred)`, tools l. 1047-1051; el hilo no edita `src/` ni tests tras una revisión) | pasa (6 `Final: minor (deferred)`, tools l. 1130-1135; el `reset --soft` es solo un squash) | pasa (`Final: minor (deferred)`, tools l. 1231-1233; sin pasada de fix) | FALLA: [61] y [64] «El revisor tiene razón en lo del EOL… Lo restauro»; tools l. 526 `sed -i 's/\r$//; s/$/\r/' test/cancel.test.js` y commit `wip` del propio hilo, tras el Minor del revisor de la Task 1 ([59]) | 1/4 falla |
| h2 | L | pasa | pasa | pasa (el inglés de [46] y [48], «quoting was a mess; I'll use Edit instead», es del implementador, tools l. 381-424) | pasa | 0/4 fallan |

## Resumen

**u1: 1 de 4 fallan** (solo la fila U1r; U1, U2 y L, 0 de 4).
- `u1-1`, U1r. Causa: skill `sdd-implement`, «How you stop»: «write in `spec.md` the correction you recommend, dispatch one `sonnet` reviewer … in the foreground, and stop once its findings are in the ✋». La frase no fija que la escritura termine antes del despacho. El sujeto lanzó el `Agent` en la misma tanda que el `python` de edición, que falló (no hay Python), así que el revisor leyó el spec sin enmendar. Tras arreglarlo con `Edit`, no volvió a lanzarlo. Es un fallo de orden, no de entender la regla. Los otros tres sujetos esperaron a los `Edit` y despacharon después. Con 3 de 4 correctos, la corrección funciona, pero el orden queda sin fijar.

**h2: 1 de 4 fallan** (solo la fila S; A y L, 0 de 4).
- `h2-4`, S. Causa: skill `sdd-implement-subagent`, `references/fix-loop.md`. La regla «Minor findings never enter the loop: the code stays as reviewed» (l. 9-12) y «Never fix findings yourself in the controller session» (l. 59) no frenaron al hilo, porque el Minor era de EOL y sobre un fichero que el propio hilo había escrito (el RED). Lo trató como su error, no como hallazgo. Su razonamiento fue «mi escritura lo pasó a LF», y no lo anotó en el ledger. Solo este sujeto lo arregló, así que el texto nuevo sostiene 3 de 4. El hueco: un Minor sobre un fichero que escribió el hilo no se reconoce como «hallazgo de la revisión».
- Efecto lateral en los 4 sujetos, sin fila de rúbrica: fix-loop.md l. 9 pide anotar los Minor «as you go» (`Task <N>: minor (deferred)`). Ninguno escribió una línea `Task N: minor (deferred)`. Los minors de las revisiones de task quedan como «review clean», «3 Minor, sin acción» o solo en `tasks.md` (h2-2 lo reconoce en [273]: «no tienen `minor (deferred)` lines in the ledger»). Los minors de la revisión final sí quedaron con `Final: minor (deferred)`, en 4 de 4.
