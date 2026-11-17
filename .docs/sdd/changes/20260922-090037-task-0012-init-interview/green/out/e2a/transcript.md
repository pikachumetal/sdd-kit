### Turno 1 — dev-lead

Quiero empezar a trabajar este proyecto con SDD. Lanza sdd-init-greenfield: el código es de ayer y quiero la entrevista completa.

### Turno 1 — agente

Repo: statusline para Claude Code, Node 22, sin dependencias, 1 commit (`089ead2`). Módulos: `statusline.js`, `lib/format.js`, `lib/git.js`, `test/format.test.js`. Sin `.docs/sdd/` aún.

Empiezo entrevista SDD greenfield, una pregunta cada vez.

**Pregunta 1/17 — ¿Qué problema resuelve el proyecto?**

Por lo visto en el código: pinta una statusline para Claude Code con modelo, rama git y coste. ¿Confirmas ese alcance o hay más detrás?

### Turno 2 — dev-lead

Sí, exacto: ver modelo, rama y coste de la sesión en una sola línea sin salir de Claude Code. Es lo justo, nada más.

### Turno 2 — agente

Pregunta 1 cerrada.

**Pregunta 2/17 — ¿Quién lo usa y con qué roles?**

Por el alcance (statusline local de Claude Code), asumo un único rol: el desarrollador que corre Claude Code en su máquina, sin roles ni permisos diferenciados. ¿Confirmas o hay más de un rol (p. ej. equipo con configuración compartida)?

### Turno 3 — dev-lead

Correcto, confirmado. Un único rol: desarrollador ejecutando Claude Code en su máquina local, sin roles ni permisos diferenciados. Aunque lo usen dos compañeros más, cada uno es independiente.

### Turno 3 — agente

Pregunta 2 cerrada.

**Pregunta 3/17 — ¿Qué módulos imaginas?**

Por código ya visto: `lib/format.js` (formato modelo/coste), `lib/git.js` (rama git), `statusline.js` (orquestador que lee stdin y compone la línea). ¿Se queda así de simple, o hay más módulos previstos (p. ej. temas de color, configuración por usuario, más segmentos)?

### Turno 4 — dev-lead

Se queda así de simple: entrada, formato, git y orquestador. Sin configuración por usuario (no hay roles), sin temas de color. Modelo, rama y coste son los segmentos.

### Turno 4 — agente

Pregunta 3 cerrada.

**Pregunta 4/17 — ¿Dónde viven los datos (fichero, tabla, memoria, almacenamiento del cliente)?**

Por el código: todo entra por stdin (JSON de sesión que pasa Claude Code) y sale por stdout. Sin persistencia propia, sin fichero de estado, sin BD. ¿Confirmas, o hay algo que sí persiste (p. ej. caché de coste entre invocaciones)?

### Turno 5 — dev-lead

Confirmado: entrada por stdin, salida por stdout, todo en memoria durante la ejecución. Nada persiste entre invocaciones, ni caché de costes ni estado alguno.

### Turno 5 — agente

Pregunta 4 cerrada.

**Pregunta 5/17 — ¿En qué idioma van los nombres (API, claves, mensajes)?**

Por código visto: identificadores en inglés (`formatModel`, `gitBranch`, `formatCost`), comentario del fichero en castellano. ¿Confirmas esa convención: código/nombres en inglés, comentarios en castellano?

### Turno 6 — dev-lead

Sí, confirmo: identificadores y API en inglés, comentarios y mensajes en castellano. Esa es la convención.

### Turno 6 — agente

Pregunta 5 cerrada.

**Pregunta 6/17 — ¿Qué límites hay (tamaños, profundidades, número de resultados)?**

Es una línea de una sola pasada, sin loops ni colecciones que crezcan. ¿Hay algún límite real a fijar (p. ej. longitud máxima de la línea, truncar nombre de rama muy largo) o no aplica ninguno?

### Turno 7 — dev-lead

Sí, un límite real: la línea no puede pasar de 120 caracteres. Truncamos el nombre de rama si es muy largo, y en general priorizamos mostrar el modelo y el coste sobre información menos crítica.

### Turno 7 — agente

Pregunta 6 cerrada: máx 120 caracteres, truncar rama, prioridad modelo/coste sobre rama.

**Pregunta 7/17 — ¿Qué se avisa al usuario y cuándo (p. ej. un secreto en claro)?**

En este proyecto no hay secretos, credenciales ni datos sensibles en juego. ¿Hay algún aviso a mostrar (p. ej. fallo al leer stdin, git no disponible) o no aplica ningún aviso?

### Turno 8 — dev-lead

Sí, dos avisos: si falla la lectura de stdin y si git no está disponible en el PATH. Todo lo demás funciona con degradación silenciosa.

### Turno 8 — agente

Pregunta 7 cerrada: aviso si falla stdin y si git no está en PATH; resto, degradación silenciosa.

**Pregunta 8/17 — Cuando dos vías dan el mismo dato, ¿cuál manda?**

No veo ahora mismo dos vías para el mismo dato (modelo/coste vienen solo del JSON de stdin, rama solo de git). ¿Hay algún caso real de conflicto a resolver, o no aplica?

### Turno 9 — dev-lead

No, no hay conflicto real. Cada dato viene de una única fuente: modelo y coste del JSON, rama de git. No aplica.

### Turno 9 — agente

Pregunta 8 cerrada: no aplica.

**Pregunta 9/17 — ¿Qué stack?**

Por código: Node 22, sin dependencias, `node --test` para tests. ¿Confirmas ese stack tal cual, o hay algo más a decidir (p. ej. TypeScript, linter)?

### Turno 10 — dev-lead

Confirmo: Node 22 puro, sin dependencias, `node --test` para tests. Sin TypeScript ni linters—mantenemos la regla de cero dependencias externas.

### Turno 10 — agente

Pregunta 9 cerrada.

**Pregunta 10/17 — ¿Qué es innegociable (datos, migraciones, commits, seguridad)?**

Propongo, en línea con lo ya confirmado: cero dependencias externas, sin persistencia de datos, sin secretos en el output, límite de 120 caracteres. ¿Añades algo más como innegociable (p. ej. formato de commits, compatibilidad de versión Node)?

### Turno 11 — dev-lead

Aprobado. Añado que los commits siguen el formato que tengo definido en mi CLAUDE.md global, y Node 22 es el requisito mínimo (sin retrocompatibilidad). El resto de lo que propones es correcto.

### Turno 11 — agente

Pregunta 10 cerrada: cero dependencias, sin persistencia, sin secretos en output, 120 chars máx, commits según CLAUDE.md global, Node 22 mínimo sin retrocompatibilidad.

**Pregunta 11/17 — ¿Llevamos changelog?**

### Turno 12 — dev-lead

Sí, llevamos changelog. Solo lo que es relevante para nosotros internamente, sin detalles para el cliente.

### Turno 12 — agente

Pregunta 11 cerrada: changelog interno, sin `client-changelog.md` (ya responde la 12: no aplica).

**Pregunta 13/17 — ¿Hay gestor de tickets?**

### Turno 13 — dev-lead

No, no usamos gestor de tickets. Las tareas las coordinamos directamente.

### Turno 13 — agente

Pregunta 13 cerrada: sin gestor de tickets.

**Pregunta 14/17 — ¿Cómo se numeran las tasks: ids del gestor (`tracker`) o secuencia propia (`sequence`)?**

Sin gestor de tickets, propongo `sequence`. ¿Confirmas?

### Turno 14 — dev-lead

Sí, confirmo `sequence`. Sin gestor de tickets, es lo más práctico.

### Turno 14 — agente

Pregunta 14 cerrada: `sequence`.

**Pregunta 15/17 — ¿Qué convención de ramas?**

Recomendación del kit: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`. Repo actual solo tiene `master` (local y `origin/master`). ¿Aceptas git-flow, o prefieres algo más simple dado el tamaño del proyecto (p. ej. trunk-based: `main` + `feature/<id>`)?

### Turno 15 — dev-lead

Voy con **trunk-based**: `main` + `feature/<id>`. Para un proyecto personal y pequeño como este, git-flow sería overhead innecesario.

### Turno 15 — agente

Pregunta 15 cerrada: trunk-based, `main` + `feature/<id>`. (Nota: repo actual usa `master`, no `main` — lo trato en el paso de git.)

**Pregunta 16/17 — ¿Trabajaréis con worktrees?**

### Turno 16 — dev-lead

No, no usaremos worktrees. Mantenemos el flujo simple: rama por feature, pull request, merge a main.

### Turno 16 — agente

¿Apruebas `mission.md` tal cual, o hay cambios?
