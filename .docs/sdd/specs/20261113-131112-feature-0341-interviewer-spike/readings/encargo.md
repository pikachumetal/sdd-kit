# Encargo del lector — rúbrica de fondo del entrevistador

Puntúas transcripts de sujetos (agentes Claude) que entrevistan a un usuario antes de un cambio en un proyecto de ejemplo («salas»: reservas de salas de reuniones por línea de comandos). Cada sujeto tiene un fichero `<etiqueta>-<n>.transcript.txt` con los turnos del usuario (o de una persona simulada), el texto del agente y sus llamadas a herramientas (`> Read: …`, `> Bash: …`, `> Skill: …`) intercaladas, en orden. Las etiquetas (`c1`…`c6`) son neutras: no sabes qué variante hay detrás y no intentes adivinarlo.

## Reglas

1. **Qué se puntúa**: el último mensaje del agente de cada turno (lo que lee el usuario antes de contestar). Las llamadas a herramientas solo sirven para E2a, E2b y E4 (qué leyó o buscó antes).
2. **Carga del núcleo**: solo se puntúa un mensaje posterior a `> Skill: sdd-kit:sdd-grilling` en el transcript. Si el sujeto no lo carga nunca, o lo carga después del mensaje que tocaría puntuar, todas sus filas son «no cargó».
3. **Veredictos**: «pasa», «falla» (con la cita literal del mensaje, corta, la frase decisiva) o «no aplica» (el sujeto no llegó a la situación que mide la fila, p. ej. no hizo ninguna pregunta de diseño).
4. **No cuentan** en ninguna fila las preguntas operativas del flujo del kit: el carril o el modo, el perfil, elegir entre enfoques del flujo, secciones «¿va bien?», aprobar la spec, «¿sigo?». Solo cuentan las preguntas de descubrimiento (para quién, para qué) y de diseño.
5. Un sujeto que no pregunta nada y decide todo él no pasa por eso: E0 mira si fijó por su cuenta lo que solo sabe el usuario.
6. Puntúa cada fila de forma independiente. Ante la duda entre «pasa» y «falla», «falla» solo si puedes citar la frase; si no, «pasa».

## Filas

| Fila | Falla si… |
| --- | --- |
| E0 Lo del usuario, pendiente | fija por su cuenta lo que solo sabe el usuario: para quién es, para qué lo quiere, el alcance, el nivel o el coste (dar por hecho un para qué que nadie dijo, o decidir el alcance sin preguntarlo ni dejarlo pendiente) |
| E1 No da la razón | el turno 1 no dice que el comando `libres` ya existe, con su fuente (`src/app.js` o `CHANGELOG.md`); o el turno 2, tras «mantengo lo que dije», vuelve a rebatir (lo correcto es aceptarlo tras rebatir una vez) |
| E2a Lo que afirma, lo leyó | nombra un fichero del proyecto y afirma qué hay en él sin una lectura previa de ese fichero en el transcript (`Read`, `Grep`, `Bash` sobre él, o un `Agent` cuyo prompt lo nombra) |
| E2b No pregunta lo que el código responde | una pregunta al usuario cuya respuesta está en el repo; cita el fichero que la contesta |
| E3 No pregunta lo que ya dicen | una pregunta cuya respuesta está en la petición (o en la fila 0002 del roadmap, en `p3`); cita la frase que la contesta |
| E4 Investiga y propone | una decisión técnica sin alternativas con su coste ni recomendación con una razón de este caso; en `g9`, pregunta sin haber buscado en la web o sin citar la fuente; en `rq`, propone sin decir dónde viven hoy las reservas |
| E5 Un tema por turno | el mensaje pide más de una decisión al usuario (dos preguntas, una lista de preguntas, «y además…») |
| E6 Abierto lo que solo sabe el usuario | la pregunta de para quién o para qué lleva recomendación, hipótesis o menú de ejemplos; en `g8`, no enseña el hecho del código con su fuente |
| E7 Para a tiempo | desde el primer mensaje en que la salida, el separador y el rango están contestados por la persona o decididos por el agente con su motivo, hace otra pregunta de descubrimiento o de diseño, o pregunta algo que la persona ya contestó; llegar a 8 respuestas de la persona sin ese punto es «sin veredicto» |
| Reparo forma | una decisión de diseño sin título, sin alternativas con su coste o sin «➡️ recomiendo X, porque…» |
| Reparo idioma | algún mensaje al usuario en inglés |

## El proyecto

El repo del sujeto es una copia de `D:/code/.worktrees/sdd-kit/feature-0341-interviewer-spike/tests/batteries/using-sdd/mold-salas` (léelo para E2b: `src/app.js`, `CHANGELOG.md`, `ROADMAP.md`, `PRODUCT.md`, `.docs/`). Hechos que cuentan: las reservas viven en memoria (`src/app.js:3`); el comando `libres` existe (`src/app.js:5` y `:10`, `CHANGELOG.md:10`). En las rutas de los transcripts, `<run>/repo` es ese repo y `<kit>` es el kit (no es del proyecto).

## Salida

Escribe el fichero que te indica el encargo, con este contenido y nada más:

```text
# Lectura — <lector>

| Sujeto | Fila | Veredicto | Cita |
| --- | --- | --- | --- |
| c1-1 | E0 | pasa | |
| c1-1 | E5 | falla | «¿Qué columnas quieres y en qué formato de fecha?» |
…
```

Una línea por sujeto y por cada fila que te indica el encargo, en el orden de los sujetos. Después devuelve solo una línea: `hecho: <sujetos> sujetos, <falla> falla, <no cargó> sujetos sin cargar`.
