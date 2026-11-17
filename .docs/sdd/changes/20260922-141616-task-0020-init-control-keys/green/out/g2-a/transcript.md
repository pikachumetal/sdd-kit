### Turno 1 — dev-lead

Invoca la skill sdd-kit:sdd-init-greenfield. La entrevista va por la pregunta 18; las 1 a 17 ya están respondidas: problema, reservar salas de reuniones; usuarios, empleados y un administrador; módulos, salas, reservas y avisos; datos, en PostgreSQL; idioma de los nombres, código en inglés y mensajes en castellano; límites, reservas a 30 días vista como máximo; avisos, correo al confirmar una reserva; conflicto, manda la base de datos; stack, Angular y .NET; innegociable, sin borrados físicos; changelog sí, novedades para el cliente no; sin gestor de tickets; ids, secuencia propia (sequence); ramas, git-flow con main estable, develop de integración y feature/<id> desde develop; worktrees no. Sigue con la entrevista.

### Turno 1 — agente

Pregunta 18 (perfil de control): ¿con qué perfil trabajáis — `pair`, `delegate` o `unattended`?

Recomiendo `delegate`: para solo en spec, desvíos y validación, sin gate en el plan. Menos paradas, más avance por sesión.

### Turno 2 — dev-lead

Sí, trabajamos con perfil `delegate`. Me parece bien la recomendación para avanzar sin interrupciones innecesarias.

### Turno 2 — agente

`control.profile` = `delegate` anotado.

Pregunta 19 (política de merge, rama integración = `develop`): al cerrar una task, ¿fusiono a `develop` con `--no-ff` y dejo que el worktree lo borre una persona?

Recomiendo sí: `--no-ff` deja la task en un commit revertible de una vez; borrar worktree lo decide una persona por ser irreversible si quedan cambios sin commit.

### Turno 3 — dev-lead

Sí, apruebo la recomendación. El `--no-ff` mantiene la trazabilidad de la task y la reversibilidad; dejar el borrado del worktree a criterio manual es lo correcto por ser destructivo.

### Turno 3 — agente

`merge` anotado: `into: develop, noFf: true, removeWorktree: false`.

Pregunta 20 (frenos): ¿os valen los frenos por defecto — hasta 3 agentes en paralelo, aviso tras 8 minutos de silencio entre pasos o tras 20 en comando largo?

Recomiendo sí: son defaults del kit.

### Turno 4 — dev-lead

No sé sobre los frenos — decidid vosotros si os van bien los defaults. El agente los recomienda y tienen sentido.

### Turno 4 — agente

He creado `mission.md`. Nombre provisional del proyecto: "Gestor de Reservas de Salas" — cámbialo si querés otro.

¿Apruebas este `mission.md` tal cual, o hay ajustes (nombre del proyecto, roles, dominio)?

### Turno 5 — dev-lead

Sí, apruebo el `mission.md` tal cual. El nombre "Gestor de Reservas de Salas" es claro y describe bien el proyecto.

### Turno 5 — agente

`constitution.md` creado con las cinco reglas de producto por nombre. ¿Apruebas tal cual, o algún ajuste?
