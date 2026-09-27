---
title: Misión — App
status: draft
---

# Misión

## Por qué existe

Los equipos de una oficina se pisan las salas de reuniones: no hay forma de ver de un vistazo
cuáles están libres. La app da de alta las salas, deja reservarlas y muestra su ocupación para
que nadie choque con otra reserva.

## Usuarios y roles

- **Empleado**: reserva y cancela sus propias reservas de sala; de las reservas ajenas solo ve si
  la sala está «ocupada», nunca quién la reservó.
- **Administrador de oficina**: da de alta salas y ve todas las reservas, de cualquier empleado.

## Qué es y qué no es

- **Es**: alta de salas, reserva y cancelación de una sala, calendario de ocupación por sala/día.
- **No es** _(asunción a confirmar)_: no gestiona otros recursos de oficina (proyectores, plazas
  de parking, catering); una sola oficina, sin multi-sede en esta versión.

## Dominio (lenguaje del proyecto)

- **Sala**: recurso reservable que da de alta el administrador de oficina.
- **Reserva**: bloque horario, de hasta 4 horas, que un empleado asigna a una sala. Nunca se
  borra: se cancela y queda en el histórico.
- **Reserva confirmada**: la que manda cuando dos vías proponen la misma franja para la misma
  sala.
- **Ocupación**: vista de calendario con qué salas están libres u ocupadas en un rango horario.
