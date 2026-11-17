### Turno 1 — dev-lead

Acabo de crear este proyecto desde nuestro template. Inicializa la documentación SDD con sdd-init-greenfield.

### Turno 1 — agente

Vale. Ya hay `.docs/sdd/` con la parte técnica del template `angular-dotnet` rellena (stack, arquitectura, entornos, constitution Art. I-V). Falta la parte de producto: mission, artículos/reglas de producto y roadmap. Voy con la entrevista, una pregunta cada vez.

**Pregunta 1 — Producto:** ¿Qué problema resuelve "reservas" y para qué tipo de negocio o usuarios? (p. ej. reservas de mesas en restaurante, citas en clínica, recursos compartidos en oficina...)

### Turno 2 — dev-lead

Resuelve el problema de conflictos en la reserva de salas de reunión en nuestra oficina: actualmente usamos una hoja de cálculo compartida donde los 200 empleados se solapan las reservas continuamente. El sistema automatiza esto y garantiza que no hay dos equipos en la misma sala a la misma hora.

### Turno 2 — agente

**Pregunta 2 — Usuarios y roles:** ¿Qué roles distintos maneja el sistema? Por ejemplo: empleado (reserva salas), administrador (gestiona salas/edificios), ¿algún rol más (recepción, IT, gerentes con prioridad)?

### Turno 3 — dev-lead

Tres roles: empleado (reserva y cancela sus propias salas), recepción (ve el calendario del día y libera salas no ocupadas) y administrador (da de alta salas nuevas y accede a los informes de uso).

### Turno 3 — agente

**Pregunta 3 — Módulos:** ¿Qué módulos imaginas para el MVP? Por ejemplo: gestión de salas, reservas/calendario, informes de uso. ¿Algo más (notificaciones, check-in físico, integración con calendario externo tipo Outlook/Google)?

### Turno 4 — dev-lead

Para el MVP vemos cuatro módulos: **gestión de salas**, **reservas**, **calendario del día** e **informes de uso**. Las notificaciones (aviso 15 minutos antes y cuando se libera una sala) van integradas en la lógica de reservas, no como módulo separado. El check-in físico e integración con Outlook/Google quedan fuera del scope inicial.

### Turno 4 — agente

Ahora las cinco reglas de producto, una por una.

**Regla 1 — Datos:** ¿Dónde vive el dato de reserva? Ya sabemos que es PostgreSQL vía EF Core (Art. I constitution) — ¿hay algo que NO deba vivir en la base de datos relacional (p. ej. logs de auditoría en otro sitio, ficheros adjuntos, caché de disponibilidad en memoria)?

### Turno 5 — dev-lead

Los datos de reserva viven íntegramente en PostgreSQL — no hay almacenamiento separado ni caché de disponibilidad; si lo necesitamos durante el proyecto, lo decidiremos entonces. La auditoría (cambios en reservas) sí la guardamos en la BD, en una tabla de histórico.

### Turno 5 — agente

**Regla 2 — Idioma de nombres:** ¿En qué idioma van nombres de API, claves JSON, mensajes de error y textos de UI? (p. ej. código/API en inglés, mensajes de usuario en español; o todo en un mismo idioma)

### Turno 6 — dev-lead

API y claves JSON en inglés; mensajes de error y textos de UI en castellano.

### Turno 6 — agente

**Regla 3 — Límites:** ¿Qué topes maneja el sistema? Por ejemplo: duración máxima de una reserva, cuántas reservas futuras puede tener un empleado a la vez, con cuánta antelación máxima se puede reservar, tamaño máximo de sala/informe.

### Turno 7 — dev-lead

Una reserva dura como máximo 4 horas y se puede hacer con hasta 30 días de antelación. Sobre el número máximo de reservas futuras por empleado y los tamaños máximos de sala o informes, no lo sé aún.

### Turno 7 — agente

Anoto máximo de reservas futuras y tamaños de sala/informe como pendiente.

**Regla 4 — Avisos:** ¿Qué se avisa al usuario y cuándo? Ya mencionaste notificación 15 min antes y al liberar sala. ¿Algo más — p. ej. aviso al intentar reservar una sala ya ocupada, al cancelar con poca antelación, o al superar algún límite?

### Turno 8 — dev-lead

De momento solo tenemos esos dos avisos definidos: 15 minutos antes y cuando recepción libera la sala. Los otros casos que mencionas—intentar reservar ocupada, cancelación con poca antelación, superar límites—no están en las especificaciones de producto aún, así que no sé si los vamos a incluir.

### Turno 8 — agente

Vale, queda pendiente.

**Regla 5 — Conflicto entre fuentes:** cuando dos vías puedan decir cosas distintas sobre el estado de una reserva —p. ej. recepción libera una sala a la vez que un empleado intenta reservarla, o dos peticiones simultáneas para el mismo hueco— ¿qué manda? (última escritura gana, la BD con constraint de solapamiento rechaza, recepción tiene prioridad sobre empleado...)

### Turno 9 — dev-lead

La BD debe tener constraint de solapamiento que rechace conflictos; en escrituras simultáneas, gana quien llegue primero a grabar. Pero siempre: nunca se pierde una reserva confirmada, así que si hay una ya confirmada en ese hueco, se rechaza cualquier otra petición para ese mismo slot.

### Turno 9 — agente

**Artículos de producto** (constitution): más allá de lo técnico (stack, migraciones, commits, tests, seguridad, ya cerrados), ¿hay algún principio de producto innegociable? Por ejemplo: "nunca se pierde una reserva confirmada" (ya lo dijiste, ese entra aquí), "recepción puede liberar cualquier sala sin excepción", "un empleado solo ve/edita sus propias reservas". ¿Algo más que consideres innegociable?

### Turno 10 — dev-lead

Esos dos que mencioné son los innegociables: nunca pierdes una reserva confirmada y nada de datos personales más allá de nombre y correo. A eso suma que en conflictos la reserva más antigua confirmada siempre prevalece—sin excepciones, es cómo protegemos la confianza en el sistema.

### Turno 10 — agente

**Proceso — changelog de cliente:** ya hay `changelog.md` técnico. ¿Quieres también un `client-changelog.md` con novedades en lenguaje de cliente (se alimenta al cerrar cada release)?

### Turno 11 — dev-lead

No, no lo necesitamos. Con el `changelog.md` técnico es suficiente para nuestras necesidades internas.

### Turno 11 — agente

**Proceso — numeración de tasks:** `sdd-kit.json` ya trae `ids.mode: "sequence"` (numeración propia del proyecto, sin gestor externo tipo Jira/Linear). ¿Confirmas eso, o usáis un gestor de tickets externo?

### Turno 12 — dev-lead

No, usamos Jira como gestor de tickets externo, los IDs son del tipo RES-123. Hay que ajustar esa configuración en `sdd-kit.json`.

### Turno 12 — agente

Entrevista de producto completa. Antes de escribir, te presento el borrador de **mission.md** para aprobación.

---

**# Misión — reservas**

**## Por qué existe**
La oficina gestiona sus 200 empleados y la reserva de salas de reunión con una hoja de cálculo compartida, lo que provoca solapamientos constantes. El sistema automatiza la reserva y garantiza, por diseño (constraint en BD), que no hay dos equipos en la misma sala a la misma hora.

**## Usuarios y roles**
- **Empleado**: reserva y cancela sus propias reservas.
- **Recepción**: ve el calendario del día y libera salas no ocupadas.
- **Administrador**: da de alta salas nuevas y accede a informes de uso.

**## Módulos**
- Gestión de salas
- Reservas (incluye avisos: 15 min antes de la reserva, y al liberar sala)
- Calendario del día
- Informes de uso

Fuera de scope MVP: check-in físico, integración con Outlook/Google Calendar.

**## Dominio (lenguaje del equipo)**
- **Reserva**: bloque de sala + franja horaria, máx. 4 horas, hasta 30 días de antelación.
- **Confirmada**: reserva que ha superado el constraint de solapamiento y prevalece frente a cualquier conflicto posterior.
- **Liberar**: acción de recepción que anula una reserva no ocupada.
- **Histórico**: tabla de auditoría de cambios en reservas.

---

¿Apruebas este mission.md, o hay algo que ajustar?

### Turno 13 — dev-lead

Sí, apruebo. Está completo y refleja exactamente el problema que resolvemos y los límites del MVP. Adelante con la escritura.

### Turno 13 — agente

mission.md escrito. Ahora borrador de **constitution.md** (artículos y reglas de producto) para aprobar.

---

**## Artículos de producto**

- Nunca se pierde una reserva confirmada: en conflicto, prevalece siempre la reserva confirmada más antigua.
- No se guardan datos personales más allá de nombre y correo.

**## Reglas de producto**

- **Datos**: reserva vive íntegramente en PostgreSQL, sin caché de disponibilidad ni almacenamiento separado. Auditoría de cambios en tabla de histórico (BD).
- **Idioma de nombres**: API y claves JSON en inglés; mensajes de error y textos de UI en castellano.
- **Límites**: reserva máx. 4 horas, hasta 30 días de antelación. Máximo de reservas futuras por empleado y tamaños máximos de sala/informe — *pendiente*.
- **Avisos**: 15 min antes de la reserva; al liberar sala recepción. Avisos sobre reserva ya ocupada, cancelación con poca antelación o superar límites — *pendiente*.
- **Conflicto**: constraint de solapamiento en BD rechaza conflictos; en escritura simultánea, gana quien graba primero, pero una reserva confirmada nunca se sustituye — la más antigua confirmada prevalece siempre.

---

¿Apruebas, o ajusto algo?

### Turno 14 — dev-lead

Sí, apruebo. Está claro y completo —los puntos pendientes son detalles que definiremos según la capacidad del equipo. Adelante con la siguiente sección.

### Turno 14 — agente

Borrador de **roadmap.md**:

---

**## Próximo**
MVP: gestión de salas, reservas (con avisos), calendario del día, informes de uso.

**## Módulos**
- Gestión de salas
- Reservas
- Calendario del día
- Informes de uso

---

¿Apruebas?

### Turno 15 — dev-lead

Sí, apruebo. Cubre exactamente lo que necesitamos para resolver el problema de las salas compartidas.

### Turno 15 — agente

SDD inicializado. Resumen:

- **mission.md** — problema (hoja de cálculo → solapamientos), roles (empleado/recepción/administrador), módulos MVP, dominio.
- **constitution.md** — artículos técnicos ya venían del template; añadidos artículos y reglas de producto (datos, idioma, límites, avisos, conflicto), con dos puntos marcados pendiente (tope de reservas por empleado, avisos extra) — se definen cuando el equipo llegue a esa capacidad.
- **roadmap.md** — próximo (MVP) y los 4 módulos.
- **sdd-kit.json** — `ids.mode` corregido a `tracker` (Jira, formato `RES-123`).
- Resto (tech-stack, architecture, environments, changelog, CLAUDE.md) ya venían correctos del template `angular-dotnet` — no tocados.
- No se crea `client-changelog.md` (no lo necesitáis).
- Nada commiteado — avisa si quieres que lo haga.

Próximo paso: `sdd-kit:sdd-start-task` para la primera task (probablemente gestión de salas, base de las demás).

### FIN (simulador)
