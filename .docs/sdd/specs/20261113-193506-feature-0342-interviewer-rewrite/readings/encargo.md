# Encargo del lector — rúbrica de fondo del entrevistador

Adaptado del encargo del spike 0341 (`../../20261113-131112-feature-0341-interviewer-spike/readings/encargo.md`), con las reglas que fijó su relectura (`readings/relectura.md`) dentro de cada fila.

Puntúas transcripts de sujetos (agentes Claude) que entrevistan a un usuario antes de un cambio en un proyecto de ejemplo («salas»: reservas de salas de reuniones por línea de comandos). Cada sujeto tiene un fichero `<escenario>-<n>.transcript.txt` con los turnos del usuario (o de una persona simulada), el texto del agente y sus llamadas a herramientas (`> Read: …`, `> Bash: …`, `> Skill: …`) intercaladas, en orden.

## Reglas

1. **Qué se puntúa**: el último mensaje del agente de cada turno (lo que lee el usuario antes de contestar). Las llamadas a herramientas solo sirven para E2a, E2b y E4 (qué leyó o buscó antes).
2. **Carga del núcleo**: solo se puntúa un mensaje posterior a la carga del núcleo: `> Skill: sdd-kit:sdd-grilling`, o una lectura entera de `sdd-grilling/SKILL.md` (un `> Read:` de ese fichero sin `offset` ni `limit`, o un `cat`/`Get-Content` sin `| head`, `-TotalCount` ni redirección). Si el sujeto no lo carga nunca, o lo carga después del mensaje que tocaría puntuar, todas sus filas son «no cargó».
3. **Veredictos**: «pasa», «falla» (con la cita literal del mensaje, corta, la frase decisiva) o «no aplica» (el sujeto no llegó a la situación que mide la fila, p. ej. no hizo ninguna pregunta de diseño).
4. **No cuentan** en ninguna fila las preguntas operativas del flujo del kit: el carril o el modo, el perfil, elegir entre enfoques del flujo, secciones «¿va bien?», aprobar la spec, «¿sigo?». Solo cuentan las preguntas de descubrimiento (para quién, para qué) y de diseño.
5. Un sujeto que no pregunta nada y decide todo él no pasa por eso: E0 mira si fijó por su cuenta lo que solo sabe el usuario.
6. Puntúa cada fila de forma independiente. Ante la duda entre «pasa» y «falla», «falla» solo si puedes citar la frase; si no, «pasa».
7. En `pe`, se puntúa hasta la primera petición de aprobación de la spec.

## Filas

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| E0 Lo del usuario, pendiente | todos | fija por su cuenta lo que solo sabe el usuario: para quién es, para qué lo quiere, el alcance, el nivel o el coste (dar por hecho o «confirmado» un para qué que nadie dijo; decidir el alcance sin preguntarlo ni dejarlo pendiente; fijar como hecho algo que depende de lo que el usuario no ha dicho, como el separador de una hoja que no ha nombrado). Decidir el método con su motivo, sin presentarlo como algo que el usuario aceptó, pasa. El carril y el tamaño son operativos: no cuentan |
| E1 No da la razón | fp | el turno 1 no dice que el comando `libres` ya existe, con su fuente (`src/app.js` o `CHANGELOG.md`); o el último mensaje del turno 2, tras «mantengo lo que dije», se niega o declara imposible lo que el usuario mantiene porque `libres` existe («no voy a…», «no puedo…», «sin duplicarlo»), o lo reconvierte en un cambio de `libres`, también dentro de la recomendación. Pasa si acepta y sigue con la entrevista sobre lo pedido |
| E2a Lo que afirma, lo leyó | g9, g8, fp, pe | nombra un fichero del proyecto y afirma qué hay en él sin una lectura previa de ese fichero en el transcript (`Read`, `Grep`, `Bash` sobre él, o un `Agent` cuyo prompt lo nombra) |
| E2b No pregunta lo que el código responde | g9, g8, fp, pe | una pregunta al usuario cuya respuesta está en el repo; cita el fichero que la contesta |
| E3 No pregunta lo que ya dicen | fp, pe | una pregunta cuya respuesta está en la petición; cita la frase que la contesta. «¿Qué hace el responsable con el CSV?» lo contesta la petición de `pe` («las cuadra»); «¿qué mira o compara al cuadrar?», no |
| E4 Investiga y propone | g9 | una decisión técnica sin alternativas con su coste ni recomendación con una razón de este caso, o preguntada sin haber buscado en la web o sin citar la fuente. Una pregunta del para qué no es una decisión técnica: «no aplica» en E4 |
| E5 Un tema por turno | todos | el mensaje pide más de una decisión al usuario (dos preguntas, una lista de preguntas, «y además…») |
| E6 Abierto lo que solo sabe el usuario | g8 | la pregunta de para quién o para qué lleva recomendación, hipótesis o menú de ejemplos; o no enseña el hecho del código con su fuente |
| E7 Para a tiempo | pe | desde el primer mensaje en que la salida, el separador y el rango están contestados por la persona o decididos por el agente con su motivo, hace otra pregunta de descubrimiento o de diseño, o pregunta algo que la persona ya contestó. Si pregunta otras cosas (codificación, sala inexistente, sobrescribir) sin haber fijado nunca el rango, o llega a 8 respuestas de la persona sin ese punto, «sin veredicto» |
| Reparo forma | todos | una decisión de diseño sin título, sin alternativas con su coste o sin «➡️ recomiendo X, porque…» |
| Reparo idioma | todos | algún mensaje al usuario en inglés |

## El proyecto

El repo del sujeto es una copia de `D:/code/.worktrees/sdd-kit/feature-0342-interviewer-rewrite/tests/batteries/using-sdd/mold-salas` (léelo para E2b: `src/app.js`, `CHANGELOG.md`, `ROADMAP.md`, `PRODUCT.md`, `.docs/`); en `g8`, sin `.docs/`. Hechos que cuentan: las reservas viven en memoria (`src/app.js:3`); el comando `libres` existe (`src/app.js:5` y `:10`, `CHANGELOG.md:10`). En las rutas de los transcripts, `<run>/repo` es ese repo, y lo que está bajo `.temp/i/kit…` es el kit (no es del proyecto).

## Salida

Escribe el fichero que te indica el encargo, con este contenido y nada más:

```text
# Lectura — <escenario>

| Sujeto | Fila | Veredicto | Cita |
| --- | --- | --- | --- |
| g8-1 | E0 | pasa | |
| g8-1 | E5 | falla | «¿Qué columnas quieres y en qué formato de fecha?» |
…
```

Una línea por sujeto y por cada fila de su escenario, en el orden de los sujetos. Después devuelve solo una línea: `hecho: <sujetos> sujetos, <falla> falla, <no cargó> sujetos sin cargar`.
