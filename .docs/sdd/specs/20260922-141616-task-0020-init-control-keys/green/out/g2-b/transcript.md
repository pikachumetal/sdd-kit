### Turno 1 — dev-lead

Invoca la skill sdd-kit:sdd-init-greenfield. La entrevista va por la pregunta 18; las 1 a 17 ya están respondidas: problema, reservar salas de reuniones; usuarios, empleados y un administrador; módulos, salas, reservas y avisos; datos, en PostgreSQL; idioma de los nombres, código en inglés y mensajes en castellano; límites, reservas a 30 días vista como máximo; avisos, correo al confirmar una reserva; conflicto, manda la base de datos; stack, Angular y .NET; innegociable, sin borrados físicos; changelog sí, novedades para el cliente no; sin gestor de tickets; ids, secuencia propia (sequence); ramas, git-flow con main estable, develop de integración y feature/<id> desde develop; worktrees no. Sigue con la entrevista.

### Turno 1 — agente

Pregunta 18 — perfil de control.

¿Con qué perfil trabajáis: `pair`, `delegate` o `unattended`?

Recomiendo **`delegate`** (default): para en spec, desvíos y validación; sin gate en el plan. Menos paradas que `pair`, más control que `unattended`.

### Turno 2 — dev-lead

Trabajamos con **`delegate`**. Es el balance correcto para nosotros: respeta la autonomía del equipo con puntos de control cuando sea necesario.

### Turno 2 — agente

`control.profile: delegate` registrado.

Pregunta 19 — política de merge a `develop` (rama de integración, distinta de `main`).

Al cerrar una task, ¿fusiono a `develop` con `--no-ff` y dejo que el worktree lo borre una persona?

Recomiendo **sí**: `--no-ff` deja la task en un commit revertible de una vez; borrar worktree lo decide una persona porque es irreversible si quedan cambios sin commit.

### Turno 3 — dev-lead

Sí, apruebo esa política. `--no-ff` mantiene la trazabilidad de la task y deja el borrado del worktree en manos del equipo, que sabe si hay cambios pendientes.

### Turno 3 — agente

`merge`: `into: develop`, `noFf: true`, `removeWorktree: false`.

Pregunta 20 — frenos por defecto.

¿Os valen los frenos por defecto: hasta 3 agentes en paralelo, aviso tras 8 minutos de silencio entre pasos o tras 20 minutos en comando largo?

Recomiendo **sí**: son los defaults del kit.

### Turno 4 — dev-lead

No sé, la verdad. Pero si los recomendáis como defaults del kit, adelante con esos frenos.

### Turno 4 — agente

Proyecto: "salas" (README.md ya lo confirma). Redacto `mission.md` para aprobación.

---

**Misión — Salas**

**Por qué existe**
App interna para reservar salas de reuniones de la oficina. Resuelve el conflicto de reservas manuales o informales, dando un sistema único donde empleados ven disponibilidad y reservan sin choques, y la organización mantiene trazabilidad de quién usa qué sala y cuándo.

**Usuarios y roles**
- **Empleado**: consulta salas, crea y gestiona sus propias reservas dentro de la ventana de 30 días vista, recibe avisos por correo.
- **Administrador**: además de lo anterior, gestiona el catálogo de salas.

**Qué es y qué no es**
- **Es**: gestión de salas, reservas a corto-medio plazo (máximo 30 días vista) y avisos por correo al confirmar reserva.
- **No es**: gestor de tickets, ni sistema de facturación/recursos externos a la sala en sí.

**Dominio (lenguaje del proyecto)**
- **Sala**: espacio físico reservable, gestionado por el administrador.
- **Reserva**: bloque de tiempo asignado a un empleado sobre una sala, dentro de la ventana de 30 días vista.
- **Aviso**: notificación por correo enviada al confirmarse una reserva.

---

¿Apruebo este `mission.md` tal cual, o hay cambios?

### Turno 5 — dev-lead

Sí, apruebo. El `mission.md` está bien definido, deja claro el alcance y los roles sin ambigüedades.

### Turno 5 — agente

Redacto `constitution.md` para aprobación.

---

**Constitution — Salas**

**Principios**
1. Sin borrados físicos: toda entidad se marca como inactiva/anulada, nunca se elimina de la base de datos.

**Convenciones**
- **Idioma**: código (variables, funciones, clases, API) en inglés; mensajes de interfaz y notificaciones en castellano.
- **Ramas**: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`.
- **Commits**: tipo/scope en inglés (`feat(backend):`, `fix(frontend):`), título y cuerpo en castellano, términos técnicos en inglés.

**Reglas de producto**
- **Dónde viven los datos**: PostgreSQL.
- **Idioma de los nombres**: código en inglés; mensajes de usuario (validaciones, avisos, correos) en castellano.
- **Límites**: reservas admitidas hasta 30 días vista como máximo.
- **Avisos**: correo al empleado al confirmar una reserva.
- **Regla ante conflicto**: manda la base de datos.

---

¿Apruebo así, o algún cambio?
