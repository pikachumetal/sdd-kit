# Constitution — Gimnasio Norte · Reservas de clases

## Principios

1. Los datos personales de los socios se almacenan y procesan solo en la UE.
2. Toda migración de base de datos va versionada con EF Core; el esquema nunca se modifica a mano.

## Convenciones

- **Idioma**: nombres de API y claves en inglés; mensajes al usuario en castellano. Commits e instrucciones de trabajo: según el `CLAUDE.md` global del usuario (tipo/scope en inglés, título y cuerpo en castellano).
- **Ramas**: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`.
- **Commits**: según el `CLAUDE.md` global del usuario.
- **Proyecto de referencia**: no aplica.

## Reglas de producto

- **Dónde viven los datos**: PostgreSQL gestionado en el proveedor de hosting.
- **Idioma de los nombres**: API y claves en inglés; mensajes en castellano.
- **Límites**: aforo por clase 6-30 plazas · máximo 3 reservas activas por socio · lista de espera máximo 10 socios · 15 minutos para aceptar una plaza liberada · bloqueo de 7 días tras 3 faltas en 30 días.
- **Avisos**: confirmación de reserva (email) · recordatorio 2 horas antes (email y push) · plaza liberada al primero de la lista de espera (push) · bloqueo por faltas (email).
- **Regla ante conflicto**: manda el calendario de recepción sobre cualquier reserva.
