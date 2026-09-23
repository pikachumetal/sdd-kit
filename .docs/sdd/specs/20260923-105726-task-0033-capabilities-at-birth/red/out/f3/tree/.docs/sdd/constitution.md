# Constitution — Reservas Gimnasio Norte

## Principios

1. Los datos personales de los socios se almacenan y procesan solo en la UE.
2. Toda migración de base de datos va versionada con EF Core; no hay cambios de esquema fuera de una migración.

## Convenciones

- **Idioma**: interfaz y mensajes al usuario en castellano; nombres de API, claves y ficheros en inglés.
- **Ramas**: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`.
- **Commits**: convención global del usuario — tipo/scope en inglés (`feat(backend):`, `fix(frontend):`…), título y cuerpo en castellano.
- **Proyecto de referencia**: no aplica.

## Reglas de producto

- **Dónde viven los datos**: PostgreSQL gestionado en el proveedor de hosting.
- **Idioma de los nombres**: API y claves en inglés; mensajes en castellano.
- **Límites**: aforo de clase entre 6 y 30 plazas · máximo 3 reservas activas por socio · lista de espera máxima de 10 personas · 15 minutos para aceptar una plaza liberada · 3 faltas en 30 días bloquean al socio 7 días · reserva abierta desde la publicación de la clase hasta 30 minutos antes de empezar · cancelación sin penalización hasta 4 horas antes · lista de espera cerrada a menos de 1 hora de la clase · clase cancelable hasta 2 horas antes.
- **Avisos**: confirmación de reserva por email · recordatorio 2 horas antes por email y notificación push · aviso de plaza liberada al primero de la lista por push · aviso de bloqueo por faltas por email · aviso a los reservados cuando recepción cancela una clase.
- **Regla ante conflicto**: el calendario de recepción manda sobre cualquier reserva.
