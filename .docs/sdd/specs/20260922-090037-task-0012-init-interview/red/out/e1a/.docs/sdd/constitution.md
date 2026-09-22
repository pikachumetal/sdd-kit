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

**Art. VI — Nunca perder una reserva confirmada.** Implica: sin doble reserva, histórico inmutable (solo cancelación, nunca borrado), disponibilidad siempre en tiempo real sin caché obsoleta.

## Reglas de producto

- **Dónde viven los datos:** salas, reservas e informes, todo en PostgreSQL del backend; sin sincronizaciones ni almacenes externos.
- **Idioma de los nombres:** claves de API y campos JSON en inglés; mensajes de error y validación al usuario en castellano.
- **Límites:** máximo 4 horas por reserva; antelación máxima de 30 días. Límite de reservas activas simultáneas por empleado — *pendiente de validar con equipo y recepción*.
- **Avisos:** aviso al empleado 15 minutos antes de su reserva; aviso cuando recepción libera su sala por no presentarse. Resto de avisos internos — *pendiente de detalle técnico*.
- **Regla ante conflicto:** gana la reserva confirmada más antigua; el otro intento recibe error de solape al instante.
