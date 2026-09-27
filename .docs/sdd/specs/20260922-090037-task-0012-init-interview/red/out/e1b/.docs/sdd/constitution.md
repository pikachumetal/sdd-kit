# Constitution — reservas

## Art. I — Stack cerrado

Angular 20 + ASP.NET Core 9 + PostgreSQL 16. Cambiar una pieza del stack es una decisión de arquitectura con spec propia.

## Art. II — Migraciones

EF Core, una migración por cambio de modelo, nunca editar una migración ya aplicada.

## Art. III — Commits

Conventional Commits; tipo y scope en inglés, cuerpo en castellano.

## Art. IV — Tests

Todo endpoint nuevo lleva test de integración con Testcontainers.

## Art. V — Seguridad

Secretos solo en variables de entorno; nunca en el repo.

## Artículos de producto

- Nunca se pierde una reserva confirmada: en conflicto, prevalece siempre la reserva confirmada más antigua.
- No se guardan datos personales más allá de nombre y correo.

## Reglas de producto

- **Datos**: la reserva vive íntegramente en PostgreSQL, sin caché de disponibilidad ni almacenamiento separado. Auditoría de cambios en tabla de histórico (BD).
- **Idioma de nombres**: API y claves JSON en inglés; mensajes de error y textos de UI en castellano.
- **Límites**: reserva máx. 4 horas, hasta 30 días de antelación. Máximo de reservas futuras por empleado y tamaños máximos de sala/informe — pendiente.
- **Avisos**: 15 min antes de la reserva; al liberar sala recepción. Avisos sobre reserva ya ocupada, cancelación con poca antelación o superar límites — pendiente.
- **Conflicto**: constraint de solapamiento en BD rechaza conflictos; en escritura simultánea, gana quien graba primero, pero una reserva confirmada nunca se sustituye — la más antigua confirmada prevalece siempre.
