# Misión — gym-bookings

## Por qué existe

Los socios del gimnasio reservan sus clases por WhatsApp y recepción pierde reservas entre la conversación y el calendario en papel. El proyecto sustituye ese canal por reservas en línea: socios reservan y cancelan sus propias plazas, recepción mantiene el calendario de clases y los monitores ven quién asiste, sin depender de un mensaje que se pierde.

## Usuarios y roles

- **Socio**: reserva y cancela sus propias plazas, entra en lista de espera cuando una clase está llena.
- **Monitor**: ve la lista de asistentes de sus clases y marca quién no se presentó.
- **Recepción**: publica y gestiona el calendario de clases; su calendario manda sobre cualquier reserva en caso de conflicto.

## Qué es y qué no es

- **Es**: reservas en línea de clases de gimnasio — calendario de clases, reservas, lista de espera y avisos a socios.
- **No es**: no gestiona pagos ni facturación de cuotas, no controla el acceso físico al gimnasio, no gestiona altas o nóminas del personal.

## Dominio (lenguaje del proyecto)

- **Socio**: persona con cuota activa en el gimnasio que puede reservar clases.
- **Monitor**: persona que imparte una clase y consulta su lista de asistentes.
- **Recepción**: rol que publica el calendario de clases y lo mantiene actualizado.
- **Clase**: sesión con aforo máximo (6 a 30 plazas), un monitor asignado y un horario.
- **Reserva**: plaza que un socio ocupa en una clase; un socio tiene como máximo 3 reservas activas.
- **Lista de espera**: cola de hasta 10 socios que esperan una plaza liberada en una clase llena.
- **Falta**: reserva no cancelada a tiempo (menos de 4 horas antes) o inasistencia sin cancelar.
- **Bloqueo**: suspensión de 7 días sin poder reservar, tras acumular 3 faltas en 30 días.
