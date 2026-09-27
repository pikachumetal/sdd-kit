### Turno 1 — dev-lead

Quiero empezar a trabajar este proyecto con SDD. Lanza sdd-init-greenfield: el código es de ayer y quiero la entrevista completa.

### Turno 1 — agente

Contexto revisado: statusline para Claude Code, Node 22 sin dependencias, muestra modelo/rama/coste. Código de ayer, aún pequeño.

Clasificación: **architectural** — proyecto nuevo, es la init SDD completa (mission, constitution, tech-stack...), no un cambio acotado.

Arranco la entrevista, bloque producto, una pregunta cada vez.

**Pregunta 1 — problema y usuarios.** ¿Qué problema resuelve este statusline y para quién? Por ejemplo: ¿es para ti personalmente, para publicarlo como herramienta que otros usuarios de Claude Code instalen, o para un equipo/empresa concreta?

### Turno 2 — dev-lead

Resuelve ver de un vistazo el modelo, rama y coste de la sesión en la statusline de Claude Code. Es para mí y quizá dos compañeros más, solo uso personal.

### Turno 2 — agente

**Pregunta 2 — roles y módulos.** ¿Hay distintos roles (tú/compañeros con permisos distintos) o todos usan el statusline igual? Y aparte del formato actual (modelo, rama, coste), ¿ya ves módulos futuros (ej: tiempo de sesión, tokens restantes, estado de tests) o de momento son solo esos tres campos?

### Turno 3 — dev-lead

No hay distintos roles: tú y los compañeros usan el statusline igual, sin permisos diferenciados.

### Turno 3 — agente

Pendiente todavía: módulos futuros previstos (tiempo de sesión, tokens, tests...) o de momento solo modelo/rama/coste.

**Pregunta 2b.** ¿Ya ves campos futuros para la statusline, o de momento se queda en esos tres?

### Turno 4 — dev-lead

De momento me queda en esos tres para cerrar el MVP, pero tengo en la mira tiempo de sesión, tokens y tests. Mejor validar primero que esto funciona bien antes de cargar la barra de status.

### Turno 4 — agente

Claro, MVP: modelo/rama/coste. Roadmap: tiempo sesión, tokens, tests — post-validación.

Ahora las cinco reglas de producto, una a una.

**Regla 1 — dónde viven los datos.** El input llega por stdin como JSON de sesión (`input.model`, `input.workspace`, `input.cost`). No hay fichero, tabla ni almacenamiento propio: el statusline es sin estado, solo lee stdin y ejecuta `git branch` en el directorio recibido. ¿Confirmas que no hay ni habrá almacenamiento propio (ni caché, ni fichero de config), o falta algo aquí?

### Turno 5 — dev-lead

Confirmo. Sin almacenamiento propio: stdin (JSON), procesamiento en memoria, salida a statusline y listo. No hay caché, config ni persistencia.

### Turno 5 — agente

**Regla 2 — idioma de nombres.** Código ya usa inglés (`formatModel`, `gitBranch`, `formatCost`). ¿Confirmas inglés para nombres de funciones/variables/claves, con mensajes de error también en inglés? ¿O mensajes de error en castellano de cara al usuario final?

### Turno 6 — dev-lead

Confirmado: inglés para nombres (funciones, variables, claves) como ya está. Mensajes de error en castellano para el usuario final. Es lo que tenemos ahora y funciona bien.

### Turno 6 — agente

**Regla 3 — límites.** ¿Hay topes que quieras fijar? Por ejemplo: longitud máxima de la línea de statusline, truncar nombre de rama muy largo, timeout para el `execSync` de git (por si el repo es lento o está colgado). ¿Alguno de estos importa, o de momento sin límites explícitos?

### Turno 7 — dev-lead

Los 120 caracteres ya obligan a truncar inteligentemente rama y modelo. Sobre timeout en git, de momento no me preocupa; si el repo se cuelga, que falle y que lo vea.

### Turno 7 — agente

Anotado: 120 caracteres máx, truncado inteligente de rama y modelo. Sin timeout en git: si se cuelga, que falle visible.

**Regla 4 — avisos.** ¿Hay algo que deba avisarse al usuario? Por ejemplo: coste de sesión superando un umbral, JSON de stdin malformado, git no disponible en el sistema. ¿Quieres avisos para alguno de estos, o de momento silencioso (campo vacío si falla, sin aviso)?

### Turno 8 — dev-lead

Silencioso por ahora. Si falla algo (JSON roto, git no disponible), que el campo quede vacío; sin aviso visible. Cuando haya usuarios reales, revisamos si hace falta alertar de algo.

### Turno 8 — agente

**Regla 5 — conflicto.** Última: cuando dos vías dan el mismo dato y no coinciden, ¿qué manda? Aquí el único caso real es el directorio de trabajo: ¿`input.workspace.current_dir` manda siempre para calcular la rama git, o hay otra fuente (cwd del proceso, variable de entorno) que pudiera competir?

### Turno 9 — dev-lead

`input.workspace.current_dir` manda siempre. Es la entrada oficial que recibe la herramienta; el cwd del proceso o variables de entorno son secundarias y podrían no estar sincronizadas.

### Turno 9 — agente

Bloque producto cerrado. Ahora bloque stack.

**Stack.** Por el código ya tienes: Node 22, cero dependencias, testing con `node --test` nativo. ¿Confirmas esto como stack definitivo (sin añadir linter, bundler, TypeScript, etc.), o algo queda abierto?

### Turno 10 — dev-lead

Confirmo: Node 22, cero dependencias, testing nativo. Sin linter, bundler, TypeScript ni nada más. Stack cerrado.

### Turno 10 — agente

Bloque principios ahora.

**Principios.** ¿Qué es innegociable aquí? Por ejemplo: ¿siempre tests antes de mergear? ¿algún límite estricto de rendimiento (statusline no puede tardar X ms en pintar)? ¿convención de commits obligatoria? ¿algo sobre no romper compatibilidad con el formato JSON que envía Claude Code?

### Turno 11 — dev-lead

Cero dependencias externas —es la piedra angular. La línea no pasa de 120 caracteres. Para commits y tests, tengo mi CLAUDE.md global con la convención que sigo siempre; en lo demás, no sé si hay límites estrictos en lo que me preguntas.

### Turno 11 — agente

Anotado: cero dependencias (principio central), línea ≤120 caracteres, convención de commits = la de tu CLAUDE.md global. El resto (tests obligatorios antes de merge, límite de rendimiento) queda pendiente.

Bloque proceso ahora.

**Proceso — changelog.** ¿Quieres `changelog.md` en `.docs/sdd/` para este proyecto? Y si sí: ¿también `client-changelog.md` para compañeros/usuarios no técnicos, o con el changelog técnico basta (dado que sois tú y dos compañeros, todos técnicos)?

### Turno 12 — dev-lead

Sí, quiero `changelog.md` en `.docs/sdd/`. Con el changelog técnico basta; somos todos técnicos.

### Turno 12 — agente

**Gestor de tickets.** ¿Usas alguno (GitHub Issues, Linear, Jira...) para este proyecto, o no hay gestor y las tasks se numeran con secuencia propia del proyecto (`sequence`)?

### Turno 13 — dev-lead

No usamos gestor de tickets. Es un proyecto personal y pequeño, así que no hay necesidad de uno por ahora.

### Turno 13 — agente

Sin tracker → numeración de tasks: `sequence`.

**Convención de ramas.** ¿Cuál usas o quieres (ej. `feat/nombre`, `main` directo, `task/NNN-nombre`)? Y ¿trabajas con worktrees para aislar tasks, o directo sobre la rama?

### Turno 14 — dev-lead

No tengo preferencia fuerte. Me recomiendas qué convención usar y la sigo.

### Turno 14 — agente

Recomiendo `task/NNN-slug` (NNN = número de secuencia de la task, coincide con la numeración que ya vamos a usar sin tracker; slug corto en inglés). Trade-off: es más ceremonia que ramas sueltas tipo `feat/x`, pero como no hay tracker externo, el número de rama es la única referencia cruzada al changelog y al estimation-log — vale la pena.

¿Te sirve? Y aparte: ¿trabajas con **worktrees** para aislar cada task, o vas directo sobre la rama en el mismo directorio?

### Turno 15 — dev-lead

Sí, me sirve. El número como referencia única tiene sentido sin tracker, y es consistente con lo que necesito para el changelog.

### Turno 15 — agente

Falta la parte de worktrees: ¿los usas para aislar cada task, o trabajas directo sobre la rama en el mismo directorio?

### Turno 16 — dev-lead

Trabajo directo sobre la rama en el mismo directorio, sin worktrees. Como es una herramienta personal, no hay fricción de aislar tasks.

### Turno 16 — agente

**`mission.md` creado** — resume por qué existe, usuarios y el glosario mínimo (statusline, sesión).

¿Lo apruebas tal cual, o hay algo que corregir antes de anclarlo?
