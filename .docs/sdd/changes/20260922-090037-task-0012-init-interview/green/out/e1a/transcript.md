### Turno 1 — dev-lead

Acabo de crear este proyecto desde nuestro template. Inicializa la documentación SDD con sdd-init-greenfield.

### Turno 1 — agente

Init es trabajo arquitectónico (nueva documentación de anclaje), sigo checklist de `sdd-init-greenfield` como motor de entrevista.

Antes de preguntar, confirmo lo que el template `angular-dotnet` ya fijó (no lo pregunto, solo lo reviso contigo):

- **Stack**: Angular 20 + ASP.NET Core 9 + PostgreSQL 16 (cerrado, Art. I).
- **Innegociables**: migraciones EF Core (Art. II), Conventional Commits (Art. III), test de integración con Testcontainers por endpoint (Art. IV), secretos solo en env vars (Art. V).
- **Changelog**: sí, ya existe `changelog.md`.
- **Numeración de tasks**: `sequence` (ya en `sdd-kit.json`).
- **Ramas**: git-flow — `feature/<id>` desde `develop`, `hotfix/<id>` desde `main` (ya en `CLAUDE.md`).
- **Worktrees**: sí, y con entorno propio (`environments.md` ya describe Docker + puerto por rama).

¿Confirmas que esto queda tal cual, o cambia algo?

### Turno 2 — dev-lead

Confirmo todo tal cual. El template nos trae lo que necesitamos; no hay cambios en esos innegociables.

### Turno 2 — agente

Confirmado. Pregunta 1: ¿qué problema resuelve el proyecto `reservas`?

### Turno 3 — dev-lead

El proyecto resuelve los conflictos de reserva de salas que tenemos actualmente en la oficina. Hoy reservamos todo en una hoja de cálculo compartida y hay choques casi cada semana entre 200 empleados. Necesitamos un sistema que gestione las reservas y evite esos solapamientos.

### Turno 3 — agente

Pregunta 2: ¿quién usa `reservas` y con qué roles? (p.ej. empleado que reserva, admin que gestiona salas...)

### Turno 4 — dev-lead

Tenemos tres roles principales: **empleado** (reserva y cancela sus propias salas), **recepción** (consulta el día y puede liberar salas no ocupadas), y **admin** (da de alta nuevas salas y genera informes de uso). Todos dentro de la oficina, son alrededor de 200 personas en total.

### Turno 4 — agente

Pregunta 3: ¿qué módulos imaginas? (p.ej. salas, reservas, usuarios, informes...)

### Turno 5 — dev-lead

Los módulos principales son: **salas** (gestión del catálogo), **reservas** (crear, consultar, cancelar), **calendario del día** (vista diaria de ocupación) e **informes de uso** (para la parte administrativa).

### Turno 5 — agente

Pregunta 4: ¿dónde viven los datos — reservas, salas, usuarios — todo en PostgreSQL, o hay algo (auth, catálogo de empleados) que venga de fuera (AD/LDAP, SSO)?

### Turno 6 — dev-lead

Todo en PostgreSQL: reservas, salas y usuarios. El catálogo de empleados y la autenticación vienen del template, eso ya viene resuelto en los documentos.

### Turno 6 — agente

Pregunta 5: ¿en qué idioma van los nombres — API, claves JSON, mensajes de error/UI?

### Turno 7 — dev-lead

Los nombres de la API y las claves JSON van en inglés. Los mensajes de error, avisos y toda la interfaz al usuario van en castellano.

### Turno 7 — agente

Pregunta 6: ¿qué límites hay — duración máxima de reserva, antelación máxima para reservar, número de reservas simultáneas por empleado, capacidad de sala?

### Turno 8 — dev-lead

Duración máxima de reserva: 4 horas. Antelación máxima: 30 días. Respecto al número de reservas simultáneas por empleado y capacidad de sala, no tengo esa información definida aún.

### Turno 8 — agente

Vale, quedan pendientes — capacidad de sala y límite de reservas simultáneas por empleado.

Pregunta 7: ¿qué se avisa al usuario y cuándo? (p.ej. sala liberada por recepción, reserva a punto de empezar, cancelación por solapamiento)

### Turno 9 — dev-lead

Avisar al empleado 15 minutos antes de que empiece su reserva y cuando recepción libera la sala que había reservado. En caso de conflicto por solapamiento, se mantiene la reserva confirmada más antigua y se cancela la otra.

### Turno 9 — agente

Pregunta 8: cuando dos vías dan el mismo dato — p.ej. recepción libera una sala a la vez que admin la da de baja, o dos peticiones de reserva llegan a la vez — ¿cuál manda?

### Turno 10 — dev-lead

Para dos reservas simultáneas: manda la confirmada más antigua. Para los otros conflictos (recepción libera mientras admin da de baja, etc.), aún no lo hemos definido formalmente—lo vemos como parte del diseño de concurrencia en el backend.

### Turno 10 — agente

Pregunta 12: además del changelog técnico, ¿lleváis también novedades para cliente (`client-changelog.md`)?

### Turno 11 — dev-lead

No, solo mantenemos changelog técnico. Novedades para cliente no llevaremos.

### Turno 11 — agente

Pregunta 13: ¿hay gestor de tickets (Jira, Linear, GitHub Issues...)?

### Turno 12 — dev-lead

Sí, usamos Jira. Los tickets tienen el formato RES-123.

### Turno 12 — agente

Pregunta 14: con Jira ya en juego, ¿numeramos las tasks con los ids de Jira (`tracker`, ej. RES-123) o con secuencia propia del kit (`sequence`)? El `sdd-kit.json` actual trae `sequence` por defecto del template.

### Turno 13 — dev-lead

Usamos los IDs de Jira (`tracker`, RES-123). Así mantenemos la trazabilidad directa entre documentación y tickets.

### Turno 13 — agente

Entrevista completa. Redacto `mission.md` primero, para tu aprobación.

---

**# Misión — reservas**

**## Por qué existe**

La oficina gestiona hoy las reservas de salas en una hoja de cálculo compartida, con choques casi semanales entre los 200 empleados. `reservas` sustituye esa hoja por un sistema que impide solapamientos y ordena el proceso de reserva.

**## Usuarios y roles**

- **Empleado**: crea y cancela sus propias reservas.
- **Recepción**: consulta la ocupación del día y libera salas no ocupadas.
- **Admin**: da de alta salas nuevas y genera informes de uso.

**## Módulos**

- **Salas**: catálogo de salas.
- **Reservas**: crear, consultar, cancelar.
- **Calendario del día**: vista diaria de ocupación.
- **Informes de uso**: para la parte administrativa.

**## Dominio (lenguaje del equipo)**

- **Reserva**: bloque de tiempo (máx. 4 h, hasta 30 días de antelación) que un empleado ocupa en una sala.
- **Solapamiento**: dos reservas confirmadas que comparten sala y franja horaria; gana la confirmada más antigua, la otra se cancela.
- **Liberar**: acción de recepción que cancela una reserva sobre una sala no ocupada.

---

¿Apruebo así `mission.md`, o cambia algo?

### Turno 14 — dev-lead

Sí, apruebo. Recoge bien el problema, los roles y los límites del negocio.

### Turno 14 — agente

`mission.md` guardado. Ahora `constitution.md` — Reglas de producto, para tu aprobación:

---

**## Reglas de producto**

- **Persistencia**: reservas, salas y usuarios viven en PostgreSQL. Catálogo de empleados y autenticación vienen resueltos por el template.
- **Idioma de nombres**: API y claves JSON en inglés; mensajes de error, avisos e interfaz en castellano.
- **Límites**: reserva máx. 4 horas; antelación máx. 30 días. Capacidad de sala y máximo de reservas simultáneas por empleado — **pendiente**, sin definir aún.
- **Avisos**: al empleado, 15 min antes del inicio de su reserva y cuando recepción libera una sala suya.
- **Desempate**: en solapamiento de dos reservas confirmadas, manda la más antigua; la otra se cancela. Conflictos entre recepción liberando y admin dando de baja la misma sala — **pendiente**, queda al diseño de concurrencia del backend.

---

¿Apruebo así, con los dos pendientes marcados, o cambia algo?

### Turno 15 — dev-lead

Sí, apruebo. Los pendientes están bien marcados — capacidad de sala y máximo de reservas concurrentes por empleado los cerramos con el backend; el desempate en concurrencia (recepción vs. admin) lo abordamos en el diseño de transacciones. Adelante.

### Turno 15 — agente

Antes de cerrar `constitution.md`: queda también la sección **«Artículos de producto»** (distinta de «Reglas de producto»), sin pregunta propia en la entrevista. ¿Hay alguna regla de negocio dura de más —tipo artículo, al nivel de los Art. I-V técnicos— o la cierro como "no aplica"?

### Turno 16 — dev-lead

Sí, una: **nunca perder una reserva confirmada**. Es el compromiso de fondo del producto —la razón por la que el sistema existe. Cierralo como artículo, no como regla operativa.

### Turno 16 — agente

`roadmap.md` — sección Módulos ya la cubre la Q3. Falta **Próximo**: ¿qué módulo entra primero — salas, reservas, calendario, informes?

### Turno 17 — dev-lead

**Salas** entra primero: es la base, sin salas no hay qué reservar. Luego **Reservas**, que es el core, y el calendario como interfaz principal para los usuarios.

### Turno 17 — agente

`.docs/sdd/` ya queda anclado. Resumen:

- **`mission.md`** — por qué, roles, módulos, dominio. Aprobado.
- **`constitution.md`** — Art. VI (nunca perder reserva confirmada) + reglas de producto, con dos pendientes explícitos: capacidad de sala/reservas simultáneas, y desempate recepción-vs-admin (van al diseño de concurrencia del backend).
- **`roadmap.md`** — orden: Salas → Reservas → Calendario del día → Informes de uso.
- **`sdd-kit.json`** — `ids.mode: tracker` (Jira, `RES-123`).
- **`CLAUDE.md`** — puntero a Jira añadido.
- Stack, arquitectura, entornos, changelog: ya venían fijados por el template `angular-dotnet`, confirmados sin cambios.
- Git: rama actual `develop`, convención git-flow ya coincide con lo acordado. Sin cambios.

Siguientes pasos: cuando arranque la primera task (`RES-123` o la que toque), `sdd-start-task` cierra los dos pendientes de concurrencia como parte del diseño de esa spec.

### FIN (simulador)
