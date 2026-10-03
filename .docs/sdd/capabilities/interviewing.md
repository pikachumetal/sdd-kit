# Capacidad — interviewing

## Propósito

Cómo pregunta el kit al usuario cuando una skill necesita sus decisiones: una por turno, forma de cada pregunta, recomendación, rechazo, «decide tú» y cuándo para.

## Requisitos

### Una decisión por turno

- GIVEN una entrevista de `sdd-grilling` con tres decisiones abiertas sin dependencia entre ellas (nombre del comando, formato de salida, si admite filtro)
- WHEN el agente pregunta
- THEN el turno termina con una sola decisión, la que más cambia el resto (la que reabre otras ramas va primero)
- AND si el usuario pide en la sesión «pregúntamelo todo de golpe», en esa sesión pregunta por rondas
- AND en otra entrevista, una decisión que depende de otra todavía abierta espera a que esa se cierre (enmienda 2026-10-03)
- AND no termina con nada supuesto en silencio: cada suposición del agente es una pregunta o una entrada de «decidido por mí» (enmienda 2026-10-03)

### Una decisión de diseño va en texto con formato fijo; una operativa, con diálogo

- GIVEN una decisión cuyas alternativas solo se entienden con su consecuencia explicada (más de una línea por alternativa: un coste, una escena, un argumento), como el diseño del RED con o sin persona en bucle
- WHEN el agente la pregunta
- THEN la escribe en texto, no con `AskUserQuestion`: ❓ título y cuerpo, las alternativas numeradas de 1 a N, tantas como tenga la decisión (1️⃣, 2️⃣…; 🔀 para una mezcla que se defiende sola), la recomendada como primera alternativa, y ➡️ la recomendada con su razón
- AND los iconos solo marcan alternativas de esa pregunta: para referirse a una de una pregunta anterior usa su nombre («primer turno»), no su icono
- AND una decisión operativa, cuyas alternativas se entienden en una línea sin explicar nada (aprobar o pedir cambios, seguir o parar, confirmar carril y perfil), va con `AskUserQuestion`, la recomendada primero
- AND unas etiquetas cortas no hacen operativa una decisión de diseño: «¿1️⃣ o 2️⃣?» con costes distintos detrás va en texto

### Alternativas reales, mezclas incluidas

- GIVEN una decisión con dos alternativas defendibles y una tercera que nadie elegiría («ni clave ni salida en sesión»)
- WHEN el agente la pregunta
- THEN ofrece solo las dos defendibles, y la mezcla de ambas si combinarlas es defendible
- AND con cinco alternativas defendibles ofrece las cinco: no hay número fijo
- AND con una sola alternativa defendible la dice y pide confirmarla, y no añade una mezcla 🔀 que no defendería sola (enmienda 2026-10-03)

### La recomendada se gana con una razón del caso

- GIVEN una decisión de método, técnica o alcance
- WHEN el agente recomienda
- THEN la razón cita un hecho, un coste o una evidencia de este caso, y dice lo que cuesta la recomendada («a cambio, …»)
- AND «es lo habitual», «es lo estándar» o «es más simple» sin decir qué ahorra no son razón
- AND sin razón para preferir, no marca recomendada: dice «empate, depende de X» y pregunta X

### El descubrimiento no se ancla

- GIVEN una pregunta sobre lo que solo sabe el usuario («¿quién usa el producto?») en un proyecto sin código
- WHEN el agente la pregunta
- THEN la hace abierta, sin recomendación ni hipótesis
- AND en un proyecto con código donde encontró `roles.ts` con `clinic_admin` y `patient`, enseña ese hecho con su fuente y pide confirmarlo, sin recomendar

### Escena concreta en las decisiones de producto

- GIVEN una decisión sobre lo que ve o hace quien usa el producto (pegar un vínculo cuando el plugin no ve el portapapeles)
- WHEN el agente la pregunta
- THEN cada alternativa lleva una escena con datos y lo que se ve en cada paso («pegas `https://…/doc/42` → sale la tarjeta "Informe Q3"»), y la limitación técnica se cuenta por su efecto, no por su causa
- AND si la decisión es cómo se ve o cómo se siente una pantalla, deja de preguntar y propone enseñar un boceto o un prototipo desechable

### Rebatir una vez

- GIVEN una respuesta del usuario que choca con un hecho del proyecto, o una premisa floja en lo que pide
- WHEN el agente la recibe
- THEN la rebate una vez, con el argumento y la alternativa concreta
- AND si el usuario mantiene su respuesta, la acepta y sigue, sin volver a rebatirla

### «Decide tú»

- GIVEN una entrevista con una decisión de método abierta y una de descubrimiento sin hechos pendiente
- WHEN el usuario contesta «decide tú» a toda la entrevista
- THEN el agente decide la de método sin preguntar y la anota en «decidido por mí» con su motivo
- AND sigue preguntando solo lo que es del usuario (alcance, nivel, dinero), explicando los términos
- AND la de descubrimiento queda «pendiente», no decidida: «seguro que son los administrativos» no es una decisión delegada
- AND con «decide tú» a una sola pregunta, decide esa y sigue preguntando las demás

### Tras un rechazo, esa decisión sigue en texto

- GIVEN una decisión que el usuario rechaza para aclarar («no, espera, explícamelo mejor»)
- WHEN el agente sigue
- THEN la conversación de esa decisión sigue en prosa hasta que el usuario la cierra, y su respuesta en texto la cierra sin volver a presentarla con el formato fijo
- AND la decisión siguiente vuelve al formato fijo

### Cuándo para la entrevista

- GIVEN una entrevista en la que no queda ninguna decisión por preguntar
- WHEN el agente termina
- THEN devuelve a la skill que la invocó dos listas: lo que decidió el usuario y lo que decidió el agente (con su motivo), más lo pendiente
- AND si la skill que invoca tiene gate (spec, documento de la init, propuesta), la confirmación es ese gate: no pide una confirmación propia antes
- AND invocada desde `sdd-consult`, que no tiene gate, confirma con una sola pregunta
- AND no pregunta lo que la petición ya dice o delega, ni lo que puede averiguar leyendo el proyecto

### Busca fuera del repo antes de preguntar lo que depende de un hecho externo

- GIVEN una decisión que depende de un hecho que el repo no tiene y que cambia con el tiempo: cómo se comporta una librería o herramienta en su versión actual, qué recomienda su documentación oficial, qué hace otro proyecto con el mismo problema o qué exige una licencia
- WHEN el agente va a preguntarla
- THEN antes lo busca, sin que el usuario se lo pida: primero en el repo; después en el MCP de documentación que tenga la sesión para esa tecnología (Context7, Microsoft Learn…), respetando los límites de llamadas que fijen las instrucciones del usuario; si no hay, en internet
- AND la pregunta cita lo que encontró con su fuente (enlace o fichero), y solo las decisiones que dependen de esa búsqueda esperan: el resto se pregunta mientras
- AND «lo sé de memoria» no vale para lo que cambia con las versiones o con el tiempo; sí para lo estable (qué es una licencia MIT, cómo funciona git)

### Habla en el idioma del usuario

- GIVEN un usuario que escribe en castellano y la skill escrita en inglés
- WHEN el agente pregunta
- THEN pregunta en castellano

### Sin usuario, no pregunta

- GIVEN una entrevista sin usuario presente (perfil `unattended`, o la skill que invoca dice que no hay nadie)
- WHEN `sdd-grilling` llega a una decisión
- THEN no la pregunta: decide las de método con su motivo, deja las demás como pendientes y devuelve las dos listas y lo pendiente a quien la invocó
- AND las paradas de cada perfil siguen siendo las de `control-profiles`: `sdd-grilling` no añade ni quita ninguna

## Reglas de la capacidad

- **Dónde viven los datos**: no aplica; `sdd-grilling` no escribe ficheros, y lo que devuelve lo escribe quien la invoca, en sus documentos de siempre.
- **Idioma de los nombres**: el texto que ve el usuario (preguntas, listas «decidido por ti», «decidido por mí», «pendiente») va en su idioma; la skill, en inglés.
- **Límites**: una decisión por turno; sin tope de preguntas por entrevista (para con la frontera vacía); rebatir, una vez por respuesta.
- **Avisos**: no aplica.
- **Regla ante conflicto**: si el usuario pide rondas en la sesión, gana su petición en esa sesión; las paradas de `control-profiles` mandan sobre la entrevista.
