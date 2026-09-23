# Constitution — gym-bookings

## Principios

1. Los datos personales de los socios se almacenan solo en la UE.
2. Todo cambio de esquema de base de datos pasa por una migración versionada con EF Core; nunca un cambio manual.

## Convenciones

- **Idioma**: API y claves en inglés; mensajes de usuario en castellano. Código y comentarios, según el `CLAUDE.md` global del usuario (código en inglés, comentarios en castellano).
- **Ramas**: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`.
- **Commits**: el que fija el `CLAUDE.md` global del usuario (tipo/scope en inglés; título y cuerpo en castellano).
- **Proyecto de referencia**: no aplica.

## Reglas de producto

- **Dónde viven los datos**: PostgreSQL gestionado en el proveedor de hosting.
- **Idioma de los nombres**: API y claves en inglés; mensajes en castellano.
- **Límites**: los del funcional del cliente — aforo de clase entre 6 y 30 plazas; máximo 3 reservas activas por socio; lista de espera máxima de 10 personas; oferta de plaza liberada con 15 minutos para aceptarla; lista de espera cerrada a menos de 1 hora de la clase; cancelación de clase hasta 2 horas antes; cancelación de socio sin penalización hasta 4 horas antes; 3 faltas en 30 días bloquean al socio 7 días ([sources/funcional-cliente.md](sources/funcional-cliente.md) §1-§3).
- **Avisos**: los del funcional del cliente — confirmación de reserva por email; recordatorio 2 horas antes por email y push; aviso de plaza liberada al primero de la lista por push; aviso de bloqueo por faltas por email ([sources/funcional-cliente.md](sources/funcional-cliente.md) §4).
- **Regla ante conflicto**: manda el calendario de recepción sobre cualquier reserva.
