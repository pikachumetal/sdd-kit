# Capacidad: bookings

## Requisitos

**Búsqueda por cliente**
- GIVEN reservas de varios clientes
- WHEN el recepcionista escribe parte del nombre del cliente
- THEN ve las reservas cuyo cliente contiene ese texto, sin distinguir mayúsculas

**Código de reserva**
- GIVEN una reserva creada en la sede
- THEN tiene un código `R-` seguido de cuatro dígitos (`R-0042`)
- AND una reserva importada de la otra sede conserva su código de origen con el prefijo de esa sede delante (`MAD-R-0042`)
