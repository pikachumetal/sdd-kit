# Misión — gym-bookings

## Por qué existe

Los socios del gimnasio reservan sus clases por WhatsApp y recepción pierde reservas en el proceso. `gym-bookings` ofrece reservas de clases en línea para socios, con calendario, lista de espera y avisos automáticos, de forma que recepción deje de gestionar reservas a mano y los socios tengan un canal fiable para apuntarse y cancelar.

## Usuarios y roles

- **Socio**: reserva y cancela sus clases, consulta su lista de espera y recibe avisos.
- **Monitor**: ve la lista de asistentes de sus clases y marca quién no se presentó.
- **Recepción**: publica y gestiona el calendario de clases; su calendario manda sobre cualquier reserva en caso de conflicto.

## Qué es y qué no es

- **Es**: un sistema de reservas de clases con calendario publicado por recepción, reservas y cancelaciones de socios, lista de espera con oferta automática de plazas liberadas, control de faltas y bloqueos, y avisos por email/push.
- **No es**: no gestiona altas, bajas o datos administrativos de socios, ni cobros o facturación — el funcional del cliente no los menciona y quedan fuera del alcance descrito.

## Dominio (lenguaje del proyecto)

- **Socio**: persona con reserva activa, con máximo 3 reservas simultáneas.
- **Clase**: sesión con aforo (6-30 plazas), monitor asignado y horario, publicada por recepción cada jueves a las 12:00 para la semana siguiente.
- **Reserva**: plaza de un socio en una clase, posible desde que se publica hasta 30 minutos antes de empezar.
- **Lista de espera**: cola de hasta 10 socios para una clase llena; se cierra 1 hora antes de la clase.
- **Falta**: cancelación tardía (menos de 4 horas antes) o no presentarse a una clase reservada.
- **Bloqueo**: suspensión de 7 días sin poder reservar, tras 3 faltas en 30 días.
