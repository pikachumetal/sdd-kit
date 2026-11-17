# Misión — Reservas Gimnasio Norte

## Por qué existe

Los socios reservan clases hoy por WhatsApp y recepción pierde reservas en el proceso. El proyecto sustituye ese canal informal por reservas en línea: un calendario de clases publicado por recepción, con reserva, cancelación, lista de espera y avisos automáticos para los socios.

## Usuarios y roles

- **Socio**: reserva y cancela sus plazas en las clases.
- **Monitor**: ve la lista de asistentes de sus clases y marca quién no se presentó.
- **Recepción**: gestiona el calendario de clases (publicación y cancelación).

## Qué es y qué no es

- **Es**: reserva en línea de clases del gimnasio, con calendario, lista de espera y avisos automáticos.
- **No es**: gestión de altas/bajas de socios ni facturación — el funcional del cliente no las contempla; el sistema asume un socio ya dado de alta.

## Dominio (lenguaje del proyecto)

- **Socio**: persona con membresía en el gimnasio que puede reservar clases.
- **Clase**: sesión con aforo máximo (6-30 plazas), monitor asignado y horario, publicada por recepción cada jueves a las 12:00 para la semana siguiente.
- **Reserva**: plaza confirmada de un socio en una clase; un socio tiene como máximo 3 reservas activas a la vez.
- **Lista de espera**: cola de socios cuando una clase está llena, máximo 10 personas; la plaza liberada se ofrece al primero, con 15 minutos para aceptarla.
- **Falta**: no presentarse a una clase reservada, o cancelarla fuera de plazo (menos de 4 horas antes).
- **Bloqueo**: suspensión de 7 días sin poder reservar, tras 3 faltas en 30 días.
