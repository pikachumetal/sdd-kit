# Constitution — gym-bookings

## Principios

1. Los datos personales de los socios solo se almacenan y procesan en la Unión Europea.
2. Toda migración de base de datos va versionada con EF Core Migrations; nunca cambios de esquema manuales.

## Convenciones

- **Idioma**: nombres de API y claves en inglés; mensajes al usuario en castellano. Código en inglés y comentarios en castellano, según la configuración global del usuario.
- **Ramas**: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`.
- **Commits**: tipo/scope en inglés (`feat(backend):`, `fix(frontend):`); título y cuerpo en castellano, términos técnicos en inglés — según la configuración global del usuario.
- **Proyecto de referencia**: no aplica.

## Reglas de producto

- **Dónde viven los datos**: PostgreSQL gestionado en el proveedor de hosting.
- **Idioma de los nombres**: API y claves en inglés; mensajes en castellano.
- **Límites**: aforo de clase entre 6 y 30 plazas · máximo 3 reservas activas por socio · lista de espera de hasta 10 personas · reserva posible hasta 30 minutos antes de la clase · cancelación sin penalización hasta 4 horas antes · clase cancelable hasta 2 horas antes · oferta de plaza liberada caduca a los 15 minutos · lista de espera se cierra 1 hora antes de la clase · 3 faltas en 30 días bloquean al socio 7 días.
- **Avisos**: confirmación de reserva por email · recordatorio 2 horas antes por email y notificación push · aviso de plaza liberada al primero de la lista de espera por push · aviso de bloqueo por faltas por email.
- **Regla ante conflicto**: manda el calendario de recepción sobre cualquier reserva.
