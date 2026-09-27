# Constitution — Gestor de Reservas de Salas

## Principios

1. Sin borrados físicos: ninguna entidad (sala, reserva, aviso) se elimina de la base de datos. Toda baja es lógica (marca de estado / fecha de baja), para preservar historial y trazabilidad de reservas pasadas.

## Convenciones

- **Idioma**: código, nombres de API, claves y ficheros en inglés; mensajes de interfaz y de usuario en castellano.
- **Ramas**: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`.
- **Commits**: tipo/scope en inglés (`feat(backend):`, `fix(frontend):`), título y cuerpo en castellano, con términos técnicos en inglés.

## Reglas de producto

- **Dónde viven los datos**: PostgreSQL.
- **Idioma de los nombres**: código, API y claves en inglés; mensajes mostrados al usuario en castellano.
- **Límites**: una reserva no puede hacerse con más de 30 días de antelación (horizonte de reserva a 30 días vista).
- **Avisos**: se envía un correo al empleado al confirmarse una reserva.
- **Regla ante conflicto**: cuando dos vías dan el mismo dato, manda lo que hay en la base de datos.
