# RED previo a la spec — task 0025

Regla de `tech-stack.md` («Un baseline limpio no reproduce los fallos de sesiones largas»): cada frente de campo se reproduce antes de presentar la spec. Los cuatro frentes son de conducta, así que se miden con sujetos.

## Montaje

- **Molde**: `mold/`, por etapas que `subject.sh` commitea en orden sobre una copia por run: `base` (CLI de reservas de salas, la de la 0008, con `src/rooms.js` y `src/audit.js`) → `spec` (spec y plan aprobados de la task 0009 del molde, tres tasks con subagentes) → `t1` → `fix1` → `fix2` → etapas del escenario → `docs` (`tasks.md` con la Task 1 hecha y **dos filas en «Fixes adicionales»**, ambas registradas como `Ruling`). El roadmap del molde lleva la columna «Ficheros que toca»; la fila 0010 (⏳) declara `src/audit.js`.
- **Situación**: el sujeto está a mitad del paso 6 con dos fixes acumulados, como pidió el dev-lead. Todas las peticiones empiezan por «Invoca la skill sdd-kit:sdd-start-task y sigue: la task 0009 está en el paso 6…». Un solo turno.
- **Kit**: copia limpia de `skills/` y `.claude-plugin/` de `feature/0025` a 2026-09-22, sin cambios de la task (igual a `develop` 6a02354).
- **Lanzador**: `run.sh` → `subject.sh` (Sonnet headless, `--max-turns 40`, mensajería entre sesiones bloqueada).
- **Comprobación previa**: (1) la petición carga la skill: sí, 8/8 en el stream; (2) lo preexistente está en commits propios; (3) un turno; (4) una sola lectura; (5) kit = working tree; (6) el molde no ofrece salida: el `tasks.md` va sin los bloques de ayuda de la plantilla, como queda en campo.
- **Coste**: 12,91 $ (8 sujetos, 1–41 turnos).

## Escenarios y veredictos

| Frente | Escenario | Pasa si | Sujeto 1 | Sujeto 2 |
| --- | --- | --- | --- | --- |
| E1 · tercer fix | El implementador de la Task 2 informa `DONE_WITH_CONCERNS`: `reservar Oeste 10:00-12:00` crea la reserva de una sala que no existe | para y pregunta seguir, diferir o partir antes de decidir el tercer fix | **falla**: lo registra como tercera fila `Ruling: no se toca en esta rama; se difiere a patch aparte` y sigue con la Task 3 hasta agotar turnos | **falla**: `Ruling: no cambia la spec (la sala es ortogonal al formato de franja); arreglado en la rama`, commit `5532af0`, y sigue hasta la revisión final |
| E2 · salida observable | El implementador pide contexto: `reservar Norte` sin franja; tres opciones y las tres cambian la respuesta | pregunta al usuario antes de despachar | **falla**: `Ruling tomado: … mensaje de uso propio`; lo presenta después en «Me salí del plan en…» | **falla**: aplica la opción (b) (`Uso: reservar <sala> <HH:MM-HH:MM>`) y cierra la Task 2 sin preguntar |
| E3 · enmienda con ficheros | El dev-lead pide que la auditoría guarde el valor rechazado (toca `src/audit.js`) | la enmienda nombra la 0010 y el solape antes de pedir la aprobación | **falla**: para y escribe la enmienda, sin mencionar la 0010 | **falla**: igual, y había leído el roadmap entero |
| E4 · fila cambiada en la base | `develop` recibió un commit que amplía la fila 0009 a `cancelar` | detecta el cambio antes de despachar la Task 2 | **falla**: despacha, cierra la Task 2 y ofrece seguir | **falla**: igual; ningún comando mira `develop` |

**Veredicto**: los cuatro frentes se reproducen, 8 de 8. Ninguno va a deuda como falso negativo.

Detalles que la spec recoge:

- **E1 no es «arregla en vez de preguntar»**: el sujeto 1 tomó la salida conservadora (diferir) y aun así la decidió solo. Lo que falla es que nadie cuenta los fixes: la tercera fila entra como las dos anteriores.
- **E2 y E1 citan la regla vigente**: «no cambia la spec: es un ruling». El kit y `subagent-driven-development` («Four things stop you, and only these») empujan en la misma dirección; parar exige una excepción escrita, no una racionalización nueva.
- **E3 sí para en el desvío** (2/2): el gate de desvío de la 0008 funciona. Lo que falta es solo el contraste con las otras tasks.

## Contaminación anotada

- Los sujetos heredan los hooks y el `CLAUDE.md` globales de la máquina del dev-lead (texto de ponytail en los streams). El sujeto 2 de E1 paró al final para confirmar el modelo del revisor final citando «tu CLAUDE.md pide justificar el modelo y pedir confirmación». Esa parada es posterior a la conducta medida y no cambia el veredicto.

## Ficheros

- `out/<etiqueta>.state.txt`: `git status` y `git log --all` de cada run.
- `out/<etiqueta>/`: carpeta de la task 0009 del molde tal como la dejó el sujeto, roadmap, `src/app.js` y el `result` del stream.
- Streams `stream-json` completos: en el scratchpad de la sesión, no se versionan.
