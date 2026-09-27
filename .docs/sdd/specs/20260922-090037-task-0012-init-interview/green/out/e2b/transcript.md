### Turno 1 — dev-lead

Quiero empezar a trabajar este proyecto con SDD. Lanza sdd-init-greenfield: el código es de ayer y quiero la entrevista completa.

### Turno 1 — agente

Repo revisado: código de ayer es una statusline para Claude Code (`statusline.js`, `lib/format.js`, `lib/git.js`) que muestra modelo, rama git y coste, sin dependencias (Node 22). Un commit, sin tests aparte del `format.test.js`.

Arranco entrevista completa (17 preguntas, ritmo SDD, una por turno).

**Pregunta 1 — ¿Qué problema resuelve el proyecto?**

¿Confirmo que es esto: dar visibilidad en la statusline de Claude Code sobre modelo activo, rama git y coste de la sesión, sin depender de paquetes externos? ¿O el alcance es otro / más amplio?

### Turno 2 — dev-lead

Sí, confirmo. Es exactamente eso: una statusline compacta (máx 120 caracteres) que muestra de un vistazo el modelo activo, la rama git y el coste de la sesión. Nada más, sin dependencias externas.

### Turno 2 — agente

**Pregunta 2 — ¿Quién lo usa y con qué roles?**

¿Solo tú como desarrollador que corre Claude Code en local, o hay más perfiles (equipo, otros usuarios de la statusline) con roles distintos?

### Turno 3 — dev-lead

Yo y quizá dos compañeros más, todos en el mismo nivel. Sin roles diferenciados.

### Turno 3 — agente

**Pregunta 3 — ¿Qué módulos imaginas?**

En código ya veo `lib/format.js` (formateo) y `lib/git.js` (info de rama). ¿Añades algo más — módulo de coste/sesión, config de usuario, caché — o el proyecto se queda en estos dos más el entrypoint `statusline.js`?

### Turno 4 — dev-lead

Sí, añado `lib/input.js` para leer el JSON con modelo, rama y coste — eso que necesito ver de un vistazo. Lo demás (formato, git, y el entrypoint) cubre lo necesario; sin config de usuario ni caché, todo vive en memoria. Esos cuatro módulos bastan.

### Turno 4 — agente

**Pregunta 4 — ¿Dónde viven los datos?**

Claude Code pasa el JSON (modelo, rama, coste) por stdin a la statusline, ¿correcto? ¿Algo persiste entre invocaciones (fichero, caché en disco) o cada ejecución es stateless, solo lee ese JSON de entrada y pinta?

### Turno 5 — dev-lead

Exacto, Claude Code pasa el JSON por stdin. Es completamente stateless: cada ejecución lee ese JSON, lo procesa en memoria y pinta la línea. Nada persiste entre invocaciones.

### Turno 5 — agente

**Pregunta 5 — ¿En qué idioma van los nombres (API, claves, mensajes)?**

Código en inglés (variables, funciones — ya así en `lib/format.js`, `lib/git.js`). ¿Confirmo: identificadores, claves del JSON de entrada y mensajes de error/log también en inglés? ¿O algún mensaje va en español (p. ej. si algo se muestra al usuario final por stdout aparte de la statusline misma)?

### Turno 6 — dev-lead

Código en inglés: sí, todo (identificadores, claves del JSON, todo). Los mensajes que ve el usuario por stdout van en español. La statusline misma es solo símbolos y valores, sin texto.

### Turno 6 — agente

**Pregunta 6 — ¿Qué límites hay?**

Ya mencionaste 120 caracteres máx de línea. ¿Otros límites — longitud máx de nombre de rama antes de truncar, número de decimales en el coste, timeout para `lib/git.js` si el repo es lento o no es repo git?

### Turno 7 — dev-lead

No tengo definidos esos límites aún. El único fijo es la línea de 120 caracteres; el resto (truncatura de rama, decimales del coste, timeout de git) me los recomiendas vos y adelante.

### Turno 7 — agente

Propuesta: rama truncada a 30 caracteres con `…`; coste con 2 decimales (`$0.42`); `git` con timeout 200ms — si expira o no es repo, omite ese segmento sin romper línea. Queda anotado en constitution como recomendación mía, no decisión tuya cerrada.

**Pregunta 7 — ¿Qué se avisa al usuario y cuándo?**

¿Hay algo que la statusline deba señalar explícitamente (p. ej. coste por encima de un umbral, git no disponible, JSON malformado) o simplemente omite el segmento afectado y sigue sin avisos?

### Turno 8 — dev-lead

Sin avisos. Si algo falla (JSON malformado, git no disponible, coste no calculable), simplemente omite ese segmento y pinta lo que puedas. Línea limpia, sin alertas.

### Turno 8 — agente

**Pregunta 8 — Cuando dos vías dan el mismo dato, ¿cuál manda?**

Ejemplo: el JSON de stdin trae un campo de rama/proyecto, pero `lib/git.js` también puede leerlo directo del repo local. Si ambos existen y difieren, ¿manda el dato de stdin (lo que Claude Code dice) o el que lee `git` en vivo? ¿O este caso no aplica porque el JSON nunca trae rama y siempre la calcula `git.js`?

### Turno 9 — dev-lead

Manda siempre lo que lee `git.js` en vivo del repo — es la fuente de verdad. El JSON de stdin trae modelo, coste y contexto, pero rama y commit siempre se calculan directo del estado local, aunque stdin diga otra cosa.

### Turno 9 — agente

**Pregunta 9 — ¿Qué stack?**

Ya veo Node 22 puro, sin dependencias, `node --test` para tests. ¿Confirmo ese stack cerrado (Node 22, sin librerías externas, `node:test` como runner) o queda algo abierto (ESM vs CommonJS, TypeScript vs JS plano)?

### Turno 10 — dev-lead

Confirmado: Node 22, sin dependencias externas, `node:test` cerrado. ESM vs CommonJS y TypeScript vs JS plano ya está en mi CLAUDE.md global, así que ahí van las convenciones.

### Turno 10 — agente

**Pregunta 10 — ¿Qué es innegociable?**

¿Hay algo que nunca se puede romper (p. ej. tests en verde antes de commit, statusline nunca debe crashear —siempre imprime algo aunque falle todo—, no tocar el repo git del usuario más que en modo lectura)?

### Turno 11 — dev-lead

Sin dependencias externas, jamás. Y la statusline nunca crashea: aunque falle todo, siempre imprime algo. Y están los 120 caracteres de línea máximo.

### Turno 11 — agente

Eso fue un ToolSearch de más, ignorado. Sigo entrevista.

**Pregunta 11 — ¿Llevamos changelog?**

¿Quieres `changelog.md` para registrar cambios de este proyecto, o sin changelog dado el tamaño?

### Turno 12 — dev-lead

Sí, quiero un `changelog.md`. Es un proyecto pequeño, pero así quedan registrados los cambios para referencia interna; nada que exponer al cliente, solo para nosotros.

### Turno 12 — agente

Sin cliente → pregunta 12 (client-changelog) no aplica. Salto a 13.

**Pregunta 13 — ¿Hay gestor de tickets?**

¿Usáis algo (GitHub Issues, Linear, Jira...) para trackear tasks, o no hay gestor?

### Turno 13 — dev-lead

No, no usamos gestor de tickets. Apenas somos dos o tres, así que todo se maneja en conversaciones directas y en el código.

### Turno 13 — agente

Sin gestor → pregunta 14 queda `tracker` por defecto según regla ("no sé" deja tracker), pero sin gestor real toca decidir explícito.

**Pregunta 14 — ¿Cómo se numeran las tasks: `tracker` o `sequence`?**

Sin gestor de tickets, ¿uso `sequence` (numeración propia del kit, tipo TASK-001) o prefieres otra cosa?

### Turno 14 — dev-lead

Usa `sequence` — sin gestor de tickets real no tiene sentido tracker. La numeración propia (TASK-001, etc.) es más limpia y autónoma para documentar cambios internos del proyecto.

### Turno 14 — agente

**Pregunta 15 — ¿Qué convención de ramas?**

Recomendación del kit: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`. ¿La aceptas, o prefieres otra (p. ej. trunk-based con `main` + `feature/*` directo, sin `develop`)?

### Turno 15 — dev-lead

Prefiero trunk-based: `main` + `feature/*` directo. Para un proyecto tan pequeño (tres personas, un modulo) git-flow añade fricción sin beneficio; una rama de integración es overkill aquí.

### Turno 15 — agente

**Pregunta 16 — ¿Trabajaréis con worktrees?**

¿Usaréis git worktrees para aislar features, o cada uno trabaja en un solo checkout?

### Turno 16 — dev-lead

No, sin worktrees. Es un proyecto pequeño, personal casi, así que cada uno trabaja en un solo checkout — es más simple y no lo necesitamos.

### Turno 16 — agente

Sin plantilla fija para estos documentos de anclaje (los redacta la entrevista, según `estructura.md`). Presento mission.md para tu aprobación antes de escribirlo:

---
**mission.md**

**Por qué existe**
`statusline` es una statusline compacta para Claude Code: en una línea de máximo 120 caracteres muestra el modelo activo, la rama git en vivo y el coste de la sesión. Sin alertas, sin dependencias externas, nunca crashea — si un dato falla, omite ese segmento y sigue.

**Quién lo usa**
Un grupo pequeño (2-3 personas) de desarrolladores que corren Claude Code en local. Sin roles diferenciados.

**Dominio**
- **stdin (JSON)**: entrada de Claude Code con modelo, coste y contexto de sesión.
- **git en vivo**: fuente de verdad para rama y commit — si stdin difiere, gana git.
- Ejecución **stateless**: cada invocación lee, procesa en memoria y pinta; nada persiste entre invocaciones.

**Módulos**
- `statusline.js` — entrypoint
- `lib/input.js` — lee y parsea el JSON de stdin
- `lib/git.js` — lee rama/commit en vivo del repo
- `lib/format.js` — compone la línea final (máx. 120 caracteres)

---

¿Apruebas mission.md tal cual, o hay algo que ajustar?
