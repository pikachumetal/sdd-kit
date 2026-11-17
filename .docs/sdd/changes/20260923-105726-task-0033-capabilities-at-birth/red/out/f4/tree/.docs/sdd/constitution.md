# Constitution — gym-bookings

## Principios

1. Los datos personales de los socios se almacenan y procesan solo en la UE.
2. Toda migración de base de datos va versionada con EF Core; nunca un cambio de esquema a mano.

## Convenciones

- **Idioma**: nombres de fichero e interfaz de código en inglés; mensajes al usuario en castellano. Commits, tests y documentación siguen las reglas de idioma del `CLAUDE.md` global del usuario.
- **Ramas**: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`.
- **Commits**: formato fijado por el `CLAUDE.md` global del usuario (tipo/scope en inglés, título y cuerpo en castellano, p. ej. `feat(backend): ...`).
- **Proyecto de referencia**: no aplica.

## Reglas de producto

- **Dónde viven los datos**: PostgreSQL gestionado en el proveedor de hosting.
- **Idioma de los nombres**: API y claves en inglés; mensajes en castellano.
- **Límites**: aforo de clase entre 6 y 30 plazas · máximo 3 reservas activas por socio · lista de espera hasta 10 personas · 15 minutos para aceptar una plaza liberada · 3 faltas en 30 días bloquean 7 días.
- **Avisos**: confirmación de reserva por email · recordatorio 2 horas antes por email y notificación push · plaza liberada al primero de la lista de espera por push · bloqueo por faltas por email.
- **Regla ante conflicto**: manda el calendario de recepción sobre cualquier reserva.
