### Turno 1 — dev-lead

Invoca la skill sdd-kit:sdd-init-brownfield: quiero empezar a trabajar este proyecto con SDD. El código es de ayer y quiero el onboarding completo.

### Turno 1 — agente

Inventario rápido (repo pequeño, sin subagentes necesarios):

**Stack real**: Node.js (entorno actual v26.9.0; README declara "Node 22" pero no hay `.nvmrc` ni `package.json` con `engines` — queda como discrepancia sin verificar). Sin dependencias externas, sin manifest `package.json`. Tests con `node:test` nativo (`test/format.test.js`).

**Estructura**: `statusline.js` (entry point, lee stdin) → `lib/format.js` (formateo modelo/coste) + `lib/git.js` (rama git vía `execSync`). README describe uso (`node --test`).

**Deuda/señales**: sin `package.json` pese a `.gitignore` con `node_modules/` (vestigio o dependencia futura no confirmada); sin manejo de errores en `main()` si stdin no es JSON válido; `gitBranch` traga cualquier error silenciosamente. Un solo commit en el repo (`b1bb5e3`), sin `CLAUDE.md` previo que cosechar.

No hay rama de integración distinta de `master`, así que la pregunta de política de merge no aplica.

**Pregunta 1/6** — ¿Cómo numeráis las tasks: ids del gestor de tickets (`tracker`) o secuencia propia (`sequence`)? Si no sabéis, dejo `tracker`.

### Turno 2 — dev-lead

Secuencia propia, sin gestor de tickets. Usamos numeración interna para el seguimiento.

### Turno 2 — agente

`ids.mode: sequence` anotado.

**Pregunta 2/6** — Perfil de control: `pair`, `delegate` o `unattended`. Recomiendo `delegate`: para en spec, desvíos y validación; sin gate en el plan. ¿Cuál usáis?

### Turno 3 — dev-lead

Perfecto, `delegate`. Es lo que necesitamos: que avances en spec sin bloqueos, pero me paras si ves desvíos o algo no cuadra para validar.

### Turno 3 — agente

`control.profile: delegate` anotado.

**Pregunta 3/6** — ¿Os valen los frenos por defecto: hasta 3 agentes en paralelo, aviso tras 8 min de silencio entre pasos o tras 20 min en comando largo? Son los defaults del kit.

### Turno 4 — dev-lead

Sí, los frenos por defecto van bien. Con dos compañeros y tareas ligeras, eso es suficiente control.

### Turno 4 — agente

Frenos por defecto anotados (sin escribir claves: rigen los defaults del kit).

**Pregunta 4/6** — ¿Llevamos changelog técnico del proyecto (`changelog.md`, formato Keep a Changelog)?

### Turno 5 — dev-lead

Sí, llevamos changelog técnico. Usamos Keep a Changelog en `changelog.md`.

### Turno 5 — agente

`changelog.md` activado.

**Pregunta 5/6** — ¿También queréis novedades para cliente (`client-changelog.md`, alimentado en cada cierre de release)?

### Turno 6 — dev-lead

No, solo el changelog interno. No generamos novedades para cliente.

### Turno 6 — agente

**Documento 1/5 — `mission.md`** creado en `.docs/sdd/mission.md` (contenido arriba, calcado del comportamiento real observado en `statusline.js`, `lib/format.js`, `lib/git.js`). ¿Lo apruebas tal cual o hay algo que corregir?

### Turno 7 — dev-lead

Sí, apruebo. Refleja bien lo que hace la herramienta.

### Turno 7 — agente

**Documento 2/5 — `tech-stack.md`** creado. Recoge dos discrepancias reales como "Decisiones abiertas": versión de Node no verificable (README dice 22, entorno corre v26.9.0, sin manifest) y `.gitignore` con `node_modules/` sin `package.json`. ¿Apruebas o corriges?

### Turno 8 — dev-lead

Sí, apruebo. Dejemos esas discrepancias documentadas como decisiones abiertas; así cuando incorporemos compañeros sabrán qué necesita resolverse.

### Turno 8 — agente

**Documento 3/5 — `architecture.md`** creado (estructura, piezas, flujo y regla de reparto para código nuevo, calcados del código actual). ¿Apruebas?

### Turno 9 — dev-lead

Sí, apruebo. Adelante con el siguiente documento.

### Turno 9 — agente

**Documento 4/5 — `constitution.md`** creado: 3 principios propuestos + reglas de oro brownfield fijas, convenciones (idioma/ramas/commits) marcadas como propuesta, y las 5 reglas de producto (2 pendientes: límites y avisos, sin código que los defina). ¿Apruebas, o corriges algún artículo?

### Turno 10 — dev-lead

Sí, apruebo. Las convenciones propuestas me van bien — en cuanto tengas código que defina los límites y avisos, cerramos los dos pendientes. Adelante con el siguiente.

### Turno 10 — agente

**Documento 5/5 — `roadmap.md`** creado: 5 ítems de deuda técnica inventariados (2 medios, 3 bajos), tabla de patches vacía, sin backlog/próximo aún. ¿Apruebas?

### Turno 11 — dev-lead

Sí, apruebo. La deuda técnica inventariada está bien, empezaremos a atacar los medios en las próximas sprints.

### Turno 11 — agente

Onboarding SDD completo. Resumen:

**Creado en `.docs/sdd/`**: `mission.md`, `tech-stack.md`, `architecture.md`, `constitution.md`, `roadmap.md` (los 5, todos aprobados por ti), `changelog.md`, `estimation.md`, `estimation-log.md`, `specs/` (vacía), `sdd-kit.json` (`ids.mode: sequence`, `control.profile: delegate`, frenos por defecto).

**No creado** (no aplica): `client-changelog.md` (rechazado), `environments.md` (no hay scripts de entorno por worktree en el repo), `capabilities/` (nace con la primera task que toque una capacidad).

**`CLAUDE.md`** reescrito a punteros + 4 reglas críticas.

**Discrepancias abiertas** (en `tech-stack.md` y `roadmap.md`, no resueltas hoy):
- Versión de Node: README dice 22, entorno real corre v26.9.0, sin manifest que lo fije.
- `.gitignore` ignora `node_modules/` sin `package.json`.
- `constitution.md`: reglas de producto "límites" y "avisos" quedan pendientes hasta que el código las defina.

**Siguiente paso**: primera task real vía `sdd-start-task` — buen candidato es atacar una de las dos deudas de impacto medio (captura de `JSON.parse` en `statusline.js`, o tests para `formatModel`/`gitBranch`/flujo principal).

### FIN (simulador)
