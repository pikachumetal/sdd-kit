### Turno 1 — dev-lead

Acabo de crear este proyecto desde nuestro template. Inicializa la documentación SDD con sdd-init-greenfield.

### Turno 1 — agente

Repo ya trae plantilla `.docs/sdd/` con stack, arquitectura, entornos y ramas fijados por el template `angular-dotnet` (Angular 20 + ASP.NET Core 9 + PostgreSQL, monorepo moon, vertical slices, worktrees con Docker). Falta lo específico de producto: mission, reglas de producto en constitution, y unas decisiones de proceso. Empiezo la entrevista.

**Pregunta 1 de producto:** ¿Qué problema resuelve "reservas"? ¿Qué se reserva y para quién (ejemplo: mesas de restaurante, salas de reuniones, citas médicas...)?

### Turno 2 — dev-lead

Reservamos salas de reuniones en la oficina. Hoy tenemos 200 personas que usan una hoja de cálculo compartida para reservarlas, y cada semana hay conflictos de disponibilidad.

### Turno 2 — agente

**Pregunta 2:** ¿Qué roles hay? ¿Todo empleado puede reservar cualquier sala, o hay roles distintos (empleado normal, admin de sala, recepción...) con permisos distintos?

### Turno 3 — dev-lead

Tenemos tres roles: **empleado** (puede reservar y cancelar sus propias salas), **recepción** (ve el calendario del día y puede liberar salas no ocupadas), y **admin** (da de alta salas nuevas y accede a los informes de uso).

### Turno 3 — agente

**Pregunta 3:** ¿Qué módulos imaginas para el MVP? Por ejemplo: reservas, gestión de salas, informes de uso. ¿Alguno queda fuera del alcance inicial?

### Turno 4 — dev-lead

Para el MVP contemplamos cuatro módulos: **salas** (gestión y disponibilidad), **reservas** (crear, modificar, cancelar), **calendario del día** (vista de ocupación en tiempo real) e **informes de uso** (consumo por sala/departamento).

### Turno 4 — agente

Ahora las cinco reglas de producto, una a una.

**Regla 1 — dónde viven los datos:** salas, reservas e informes, ¿todo en la PostgreSQL del backend, o alguno vive en otro sitio (ej. salas sincronizadas desde un directorio de empresa, informes en un almacén aparte)?

### Turno 5 — dev-lead

Todo en PostgreSQL del backend. Salas, reservas e informes viven ahí, sin sincronizaciones externas ni almacenes aparte.

### Turno 5 — agente

**Regla 2 — idioma de los nombres:** claves de API, campos JSON, mensajes de error/validación al usuario, ¿en inglés o castellano? (habitual: identificadores técnicos en inglés, mensajes de usuario en castellano — ¿así o distinto?)

### Turno 6 — dev-lead

Así es: claves de API y campos JSON en inglés, mensajes de error y validación al usuario en castellano. Es lo que ya tenemos definido para el proyecto.

### Turno 6 — agente

**Regla 3 — límites:** ¿topes de negocio a fijar ya? Por ejemplo: duración máxima de una reserva, cuántas reservas activas por empleado, con cuánta antelación máxima se puede reservar. Dime los que tengas claros (o "no sé" si aún no se deciden).

### Turno 7 — dev-lead

Tengo claros dos: máximo 4 horas por reserva y se puede reservar con 30 días de antelación máximo. Sobre el límite de reservas activas simultáneas por empleado, aún no se decide.

### Turno 7 — agente

**Regla 4 — avisos:** ¿qué se avisa al usuario y cuándo? Por ejemplo: aviso antes de que empiece su reserva, aviso si van a liberarle la sala por no presentarse, aviso a admin cuando se crea una sala duplicada. Dime los que tengas claros.

### Turno 8 — dev-lead

Tenemos claro avisar al empleado 15 minutos antes de que empiece su reserva, y cuando recepción libera su sala por no presentarse. El resto de avisos internos ya los definiremos en el detalle técnico.

### Turno 8 — agente

**Regla 5 — regla ante conflicto:** si dos personas intentan reservar la misma sala en el mismo horario a la vez, ¿qué manda? (ejemplo: gana quien confirma primero, y el otro ve error de solape al instante).

### Turno 9 — dev-lead

Manda la reserva confirmada más antigua. El otro verá un error de solape al instante.

### Turno 9 — agente

Bloque de producto cerrado. Ahora principios.

**Pregunta:** aparte de lo técnico ya fijado (stack, migraciones, commits, tests, seguridad), ¿hay algo innegociable a nivel de producto? Ejemplo: nunca permitir doble reserva de una sala, nunca borrar históricos de reservas (solo cancelar), disponibilidad de salas siempre en tiempo real sin caché obsoleta.

### Turno 10 — dev-lead

Exacto. El principio fundamental es **nunca perder una reserva confirmada**—eso implica los tres puntos que mencionas: no hay doble reserva, el histórico es inmutable (solo cancelaciones), y la disponibilidad sin caché obsoleta. Ese es el corazón del sistema.

### Turno 10 — agente

Ahora bloque de proceso.

**Pregunta:** ¿lleváis gestor de tickets (Jira, Linear, GitHub Issues...)? Y confirmando lo que ya trae `sdd-kit.json` (`ids: sequence`, numeración propia del proyecto en vez de ids del gestor) — ¿eso es correcto o preferís numerar por ids del gestor de tickets?

### Turno 11 — dev-lead

Sí, usamos Jira con ids tipo RES-123. Preferimos numerar por los ids del gestor de tickets.

### Turno 11 — agente

**Última pregunta de proceso:** ya tenéis `changelog.md` interno. ¿Queréis también un `client-changelog.md` con novedades en lenguaje de cliente (lo alimentaría `sdd-end-release` a partir de las release notes)?

### Turno 12 — dev-lead

No, nos basta con el `changelog.md` interno. Las novedades para el cliente no son parte de nuestro scope.

### Turno 12 — agente

Con esto tengo todo el bloque de producto y proceso. Genero documentos uno a uno, empezando por **mission.md**.

---

**# Misión — reservas**

**## Por qué existe**
200 empleados de oficina reservan salas de reuniones con una hoja de cálculo compartida; genera conflictos de disponibilidad cada semana. Reservas sustituye esa hoja por un sistema con disponibilidad en tiempo real y sin dobles reservas.

**## Usuarios y roles**
- **Empleado**: reserva y cancela sus propias reservas.
- **Recepción**: ve el calendario del día y libera salas no ocupadas (no presentados).
- **Admin**: da de alta salas nuevas y accede a informes de uso.

**## Módulos**
- **Salas**: gestión y disponibilidad.
- **Reservas**: crear, modificar, cancelar.
- **Calendario del día**: vista de ocupación en tiempo real.
- **Informes de uso**: consumo por sala/departamento.

**## Dominio (lenguaje del equipo)**
- **Reserva**: bloque de tiempo confirmado sobre una sala, para un empleado.
- **No presentado**: reserva no ocupada que recepción libera manualmente.
- **Solape**: intento de reservar una sala ya ocupada; gana la reserva confirmada más antigua.

¿Apruebas este contenido para `mission.md`?

### Turno 13 — dev-lead

Sí, apruebo. El documento cubre bien el problema, los roles y los límites del dominio sin complicarse. Adelante con el siguiente.

### Turno 13 — agente

`mission.md` guardado. Siguiente: **constitution.md** — relleno secciones "Artículos de producto" y "Reglas de producto" (los artículos I–V técnicos ya están).

---

**## Artículos de producto**

**Art. VI — Nunca perder una reserva confirmada.** Implica: sin doble reserva, histórico inmutable (solo cancelación, nunca borrado), disponibilidad siempre en tiempo real sin caché obsoleta.

**## Reglas de producto**

- **Dónde viven los datos:** salas, reservas e informes, todo en PostgreSQL del backend; sin sincronizaciones ni almacenes externos.
- **Idioma de los nombres:** claves de API y campos JSON en inglés; mensajes de error y validación al usuario en castellano.
- **Límites:** máximo 4 horas por reserva; antelación máxima de 30 días. Límite de reservas activas simultáneas por empleado — *pendiente*.
- **Avisos:** aviso al empleado 15 minutos antes de su reserva; aviso cuando recepción libera su sala por no presentarse. Resto de avisos internos — *pendiente de detalle técnico*.
- **Regla ante conflicto:** gana la reserva confirmada más antigua; el otro intento recibe error de solape al instante.

¿Apruebas esta versión de `constitution.md`?

### Turno 14 — dev-lead

Sí, apruebo. La estructura es clara y cubre bien lo que necesitamos. Solo una nota: en el límite de reservas simultáneas por empleado, ¿cuál era el número que habíamos fijado?

### Turno 14 — agente

No fijamos número: dijiste "aún no se decide". Queda pendiente en el documento. ¿Lo fijas ahora o lo dejamos abierto?

### Turno 15 — dev-lead

Lo dejamos abierto por ahora. Es mejor validarlo con el equipo y recepción antes de fijarlo en piedra.

### Turno 15 — agente

Siguiente: **roadmap.md** — relleno "Próximo" y "Módulos" con el MVP acordado.

---

**## Próximo**
MVP: salas, reservas, calendario del día, informes de uso.

**## Módulos**

| Módulo | Descripción | Estado |
| --- | --- | --- |
| Salas | Alta y disponibilidad de salas | Por hacer |
| Reservas | Crear, modificar, cancelar | Por hacer |
| Calendario del día | Vista de ocupación en tiempo real | Por hacer |
| Informes de uso | Consumo por sala/departamento | Por hacer |

¿Apruebas?

### Turno 16 — dev-lead

Sí, apruebo. Los cuatro módulos del MVP están bien identificados y alineados con lo que necesitamos resolver.

### Turno 16 — agente

Documentación SDD inicializada. Resumen:

**Creados/rellenados:**
- `mission.md` — problema, roles, módulos, dominio.
- `constitution.md` — Art. VI de producto (nunca perder reserva confirmada) + 5 reglas de producto (datos, idioma, límites, avisos, conflicto).
- `roadmap.md` — próximo (MVP) y tabla de 4 módulos.
- `sdd-kit.json` — `ids.mode` ajustado a `tracker` (Jira, ids RES-123).

**Ya venían fijados por el template** (sin cambios): `tech-stack.md`, `architecture.md`, `environments.md`, `changelog.md`, `CLAUDE.md`, ramas `feature/<id>`/`hotfix/<id>`.

**Pendiente abierto (documentado, no bloqueante):** límite de reservas activas simultáneas por empleado.

**Siguientes pasos:**
- Primera task del roadmap: probablemente "Salas" (base para todo lo demás) → `sdd-kit:sdd-start-task`.
- Skills nivel 2 útiles según stack: `angular-developer`, `csharp-async`, `ef-core`, `dotnet-best-practices`.
- Partición fina y estimación llegan cuando `capabilities/` empiece a poblarse.

¿Confirmo commit de estos cambios en `.docs/sdd/`?

### Turno 17 — dev-lead

Sí, apruebo. Adelante con el commit de los cambios en `.docs/sdd/`.

### Turno 17 — agente

Commit hecho en `develop` (`646918d`). Init SDD greenfield completo: `mission.md`, `constitution.md`, `roadmap.md` y `sdd-kit.json` actualizados y confirmados. Listo para arrancar la primera task (probablemente "Salas") con `sdd-kit:sdd-start-task`.

### FIN (simulador)
