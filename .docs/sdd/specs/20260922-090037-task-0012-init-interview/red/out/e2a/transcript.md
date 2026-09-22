### Turno 1 — dev-lead

Quiero empezar a trabajar este proyecto con SDD. Lanza sdd-init-greenfield: el código es de ayer y quiero la entrevista completa.

### Turno 1 — agente

Entrevista SDD, bloque (a) producto. Una pregunta cada vez.

**Pregunta 1** — ¿Qué problema resuelve este proyecto y para quién? Por lo que veo en el código (statusline.js, lib/format.js, lib/git.js) parece una statusline para Claude Code que muestra modelo, rama git y coste. ¿Confirmas ese problema/objetivo, o hay más alcance previsto?

### Turno 2 — dev-lead

Confirmo exacto. El problema es que quiero ver de un vistazo el modelo, la rama git y el coste de la sesión. Los usuarios somos principalmente yo y posiblemente dos compañeros más. Sin más alcance previsto por ahora.

### Turno 2 — agente

**Pregunta 2** — ¿Hay roles distintos entre tú y tus compañeros (por ejemplo, uno mantiene el código y otros solo lo usan), o todos tenéis el mismo rol de "desarrollador que usa y modifica la statusline"?

### Turno 3 — dev-lead

No hay roles distintos. Todos somos desarrolladores que usamos y modificamos la statusline.

### Turno 3 — agente

**Pregunta 3** — ¿Qué módulos imaginas para el proyecto? Por el código actual veo: `format.js` (formateo de modelo/coste) y `git.js` (rama git). ¿Añades algún módulo más a futuro (ej. detección de coste por proyecto, temas de color, config por usuario) o el alcance queda en estos dos + `statusline.js` como orquestador?

### Turno 4 — dev-lead

El alcance queda en esos dos módulos más el orquestador: modelo, rama y coste en una línea, sin ambiciones de config por usuario ni temas de color. Si después vemos que lo necesitamos, evolucionamos, pero por ahora mantenemos la simplicidad.

### Turno 4 — agente

Ahora las cinco reglas de producto, una a una. "No sé" deja la entrada pendiente.

**Regla 1/5 — Dónde viven los datos.** Este proyecto no persiste datos propios (lee JSON de sesión por stdin, consulta git en caliente). ¿Confirmas que no hay almacenamiento propio (ni fichero, ni tabla, ni caché), o hay algo que sí deba guardarse (ej. cachear coste entre invocaciones)?

### Turno 5 — dev-lead

Confirmo: no hay almacenamiento propio. Todo vive en memoria durante la sesión, nada persiste ni se cachea entre invocaciones.

### Turno 5 — agente

**Regla 2/5 — Idioma de los nombres.** En el código actual los identificadores (funciones, variables) están en inglés (`formatModel`, `gitBranch`, `formatCost`) y los comentarios en castellano. ¿Confirmas esa convención — código/API en inglés, comentarios en castellano — como regla fija del proyecto?

### Turno 6 — dev-lead

Sí, confirmo. Código e identificadores en inglés, comentarios y mensajes en castellano. Es la convención que ya tenemos.

### Turno 6 — agente

**Regla 3/5 — Límites.** ¿Hay topes que deba respetar la statusline? Por ejemplo: longitud máxima de la línea de salida, truncar nombre de rama muy largo, qué pasa si falta un campo (modelo/coste/rama) en el JSON de entrada.

### Turno 7 — dev-lead

Sí, la statusline tiene un tope: no puede exceder 120 caracteres de largo. Para truncar rama o manejar campos faltantes en el JSON, no tengo directiva clara.

### Turno 7 — agente

Anotado: tope 120 caracteres, resto pendiente (truncado de rama, campos faltantes en el JSON).

**Regla 4/5 — Avisos.** ¿Qué se avisa al usuario y cuándo? Por ejemplo: ¿algo debe advertirse si el coste supera un umbral, si el JSON de stdin viene mal formado, o si git no está disponible en el directorio? ¿O de momento no hay ningún aviso previsto (falla en silencio / muestra lo que puede)?

### Turno 8 — dev-lead

Por ahora, sin avisos: si JSON viene mal formado o git no está disponible, la línea muestra lo que puede (trunca, omite el campo). Podemos sumarlos después si vemos que es necesario.

### Turno 8 — agente

**Regla 5/5 — Regla ante conflicto.** ¿Hay algún caso donde dos vías puedan dar el mismo dato y haga falta saber cuál manda? Por ejemplo: ¿el modelo o el coste podrían venir tanto del JSON de stdin como de una variable de entorno? ¿O aquí no aplica (una sola fuente por dato: el JSON de sesión por stdin, y git para la rama)?

### Turno 9 — dev-lead

No aplica: una sola fuente por dato. El modelo y coste vienen del JSON de entrada, la rama de git. No hay variables de entorno en juego.

### Turno 9 — agente

Bloque producto cerrado. Ahora bloque (b) stack.

**Pregunta stack** — El README dice "Sin dependencias: Node 22" y usa `node --test`. ¿Confirmas Node 22 + cero dependencias externas + `node:test` como runner fijo, o queda algo abierto (ej. valorar TypeScript, un linter, empaquetado para distribuir)?

### Turno 10 — dev-lead

Confirmo Node 22, cero dependencias externas y `node:test` como runner. El resto (TypeScript, linter, empaquetado) no está decidido; queda abierto según lo que recomiende el equipo.

### Turno 10 — agente

Recomendación breve para dejar registrada como pendiente en tech-stack: mantener JS plano (sin TypeScript) dado el tamaño del proyecto (3 ficheros) — coste de tooling no compensa; añadir ESLint es barato y evita errores tontos entre 3 devs; empaquetado no hace falta si se instala copiando el script. Queda anotado como pendiente, decisión abierta.

Bloque (c) principios.

**Pregunta principios** — ¿Qué es innegociable en este proyecto? Por ejemplo: ¿tests obligatorios antes de commit, formato de mensajes de commit, algo de seguridad (el JSON de sesión podría traer datos sensibles del workspace)?

### Turno 11 — dev-lead

Sin dependencias externas, punto. Para commits y formato, lo tengo en mi CLAUDE.md global. Lo del JSON sensible es válido — habría que aclarar qué datos pueden estar ahí y si hace falta sanitizar o avisar en los logs.

### Turno 11 — agente

**Pregunta seguridad** — El JSON de sesión trae campos como `model`, `workspace.current_dir`, `cost`, `session_id`, `transcript_path`. La statusline solo imprime en pantalla (no hace logging a fichero ni red). ¿Ves algún dato ahí que deba sanitizarse antes de imprimir (ej. rutas con nombre de usuario del sistema), o con "imprime tal cual, no hay logging externo" es suficiente como regla?

### Turno 12 — dev-lead

**Respuesta:** "Imprime tal cual, no hay logging externo" es suficiente. La statusline solo pinta en pantalla (el usuario ya ve sus propias rutas ahí), así que no veo necesidad de sanitizar. Si fuese logging a fichero o red, sería distinto.

### Turno 12 — agente

Bloque (d) proceso.

**Pregunta 1/4 — Changelog.** ¿Llevas `changelog.md` para las tasks/patches? Y si sí, ¿quieres también `client-changelog.md` con novedades de cara a cliente, o esto es solo interno (tú + 2 compañeros, sin cliente externo)?

### Turno 13 — dev-lead

Sí, llevo `changelog.md` para tasks y patches. Pero no necesito `client-changelog.md` — somos tres y sin cliente externo, así que es solo interno.

### Turno 13 — agente

**Pregunta 2/4 — Gestor de tickets.** ¿Usáis alguno (GitHub Issues, Linear, Jira...) o no hay gestor externo?

### Turno 14 — dev-lead

No, no usamos gestor de tickets. Es un proyecto personal y lo que hago lo gestiono directamente en mi CLAUDE.md.

### Turno 14 — agente

**Pregunta 3/4 — Numeración de tasks.** Sin gestor de tickets, ¿las tasks se numeran con secuencia propia del proyecto (`sequence`: TASK-001, TASK-002...) o prefieres otro criterio?

### Turno 15 — dev-lead

No les pongamos secuencia propia; es un proyecto pequeño y personal. El changelog con descripciones claras es suficiente para rastrear qué se hizo.

### Turno 15 — agente

El kit solo soporta dos valores para `ids`: `tracker` (referencia externa) o `sequence` (numeración propia tipo TASK-001). Sin gestor y sin querer numeración, ¿cuál se ajusta mejor — `sequence` pero sin usarla de forma estricta (nombres descriptivos en vez de IDs numerados), o prefieres que quede como pendiente/abierto?

### Turno 16 — dev-lead

Adelante con `sequence` usando nombres descriptivos en lugar de numeración estricta. Sin gestor de tickets y siendo un proyecto pequeño, nos da estructura suficiente para referenciarnos sin la rigidez que no necesitamos.

### Turno 16 — agente

**Pregunta 4/4 — Ramas y worktrees.** ¿Qué convención de ramas usáis (ej. `feature/`, `fix/`, directo a `master`)? ¿Usáis worktrees? Y si sí a worktrees: ¿el entorno de un worktree necesita algo más que instalar dependencias (BD, puertos, servicios, datos), o con clonar y listo funciona?
