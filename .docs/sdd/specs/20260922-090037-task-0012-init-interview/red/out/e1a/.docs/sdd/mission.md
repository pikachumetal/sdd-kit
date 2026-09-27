# Misión — reservas

## Por qué existe

200 empleados de oficina reservan salas de reuniones con una hoja de cálculo compartida; genera conflictos de disponibilidad cada semana. Reservas sustituye esa hoja por un sistema con disponibilidad en tiempo real y sin dobles reservas.

## Usuarios y roles

- **Empleado**: reserva y cancela sus propias reservas.
- **Recepción**: ve el calendario del día y libera salas no ocupadas (no presentados).
- **Admin**: da de alta salas nuevas y accede a informes de uso.

## Módulos

- **Salas**: gestión y disponibilidad.
- **Reservas**: crear, modificar, cancelar.
- **Calendario del día**: vista de ocupación en tiempo real.
- **Informes de uso**: consumo por sala/departamento.

## Dominio (lenguaje del equipo)

- **Reserva**: bloque de tiempo confirmado sobre una sala, para un empleado.
- **No presentado**: reserva no ocupada que recepción libera manualmente.
- **Solape**: intento de reservar una sala ya ocupada; gana la reserva confirmada más antigua.
