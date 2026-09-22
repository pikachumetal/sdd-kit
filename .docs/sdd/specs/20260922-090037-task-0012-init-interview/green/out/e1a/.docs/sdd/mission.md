# Misión — reservas

## Por qué existe

La oficina gestiona hoy las reservas de salas en una hoja de cálculo compartida, con choques casi semanales entre los 200 empleados. `reservas` sustituye esa hoja por un sistema que impide solapamientos y ordena el proceso de reserva.

## Usuarios y roles

- **Empleado**: crea y cancela sus propias reservas.
- **Recepción**: consulta la ocupación del día y libera salas no ocupadas.
- **Admin**: da de alta salas nuevas y genera informes de uso.

## Módulos

- **Salas**: catálogo de salas.
- **Reservas**: crear, consultar, cancelar.
- **Calendario del día**: vista diaria de ocupación.
- **Informes de uso**: para la parte administrativa.

## Dominio (lenguaje del equipo)

- **Reserva**: bloque de tiempo (máx. 4 h, hasta 30 días de antelación) que un empleado ocupa en una sala.
- **Solapamiento**: dos reservas confirmadas que comparten sala y franja horaria; gana la confirmada más antigua, la otra se cancela.
- **Liberar**: acción de recepción que cancela una reserva sobre una sala no ocupada.
