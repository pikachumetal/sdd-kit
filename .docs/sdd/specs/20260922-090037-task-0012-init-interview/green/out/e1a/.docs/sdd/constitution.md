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

### Art. VI — Nunca perder una reserva confirmada

Compromiso de fondo del producto: ninguna reserva confirmada se pierde por un fallo del sistema. Es la razón de ser de `reservas`.

## Reglas de producto

- **Persistencia**: reservas, salas y usuarios viven en PostgreSQL. Catálogo de empleados y autenticación vienen resueltos por el template.
- **Idioma de nombres**: API y claves JSON en inglés; mensajes de error, avisos e interfaz en castellano.
- **Límites**: reserva máx. 4 horas; antelación máx. 30 días. Capacidad de sala y máximo de reservas simultáneas por empleado — pendiente, sin definir aún.
- **Avisos**: al empleado, 15 min antes del inicio de su reserva y cuando recepción libera una sala suya.
- **Desempate**: en solapamiento de dos reservas confirmadas, manda la más antigua; la otra se cancela. Conflictos entre recepción liberando y admin dando de baja la misma sala — pendiente, queda al diseño de concurrencia del backend.
