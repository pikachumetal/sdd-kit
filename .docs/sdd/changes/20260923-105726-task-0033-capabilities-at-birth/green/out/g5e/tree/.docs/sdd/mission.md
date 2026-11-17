# Misión — gym-bookings

## Por qué existe

Los socios del gimnasio reservan sus clases por WhatsApp y recepción pierde reservas al gestionarlas a mano. El proyecto sustituye ese canal por reservas en línea: socios reservan y cancelan sus propias plazas, recepción gestiona el calendario de clases y monitores ven quién asiste. Funcional entregado por el cliente: [sources/funcional-cliente.md](sources/funcional-cliente.md).

## Usuarios y roles

- **Socio**: reserva y cancela sus propias plazas de clase; entra en lista de espera cuando una clase está llena.
- **Monitor**: ve la lista de asistentes de sus clases y marca quién no se presentó.
- **Recepción**: publica y gestiona el calendario de clases; su calendario manda sobre cualquier reserva ante un conflicto.

## Qué es y qué no es

- **Es**: reservas en línea de clases de gimnasio — calendario de clases, reservas de socios, lista de espera y avisos automáticos.
- **No es**: no gestiona pagos ni facturación, ni sustituye el control de acceso físico al gimnasio.

## Dominio (lenguaje del proyecto)

- **Socio**: persona con reservas activas propias, sujeta al límite de 3 reservas y al bloqueo por faltas.
- **Monitor**: responsable de una clase; ve y marca la asistencia.
- **Clase**: sesión con aforo máximo (6-30 plazas), monitor asignado y horario, publicada por recepción.
- **Reserva**: plaza de un socio en una clase, activa hasta que se cancela, se consume o se convierte en falta.
- **Falta**: reserva no cancelada a tiempo y no atendida; 3 faltas en 30 días bloquean al socio 7 días.
- **Lista de espera**: cola de socios (máximo 10) para una clase llena; ofrece la plaza liberada por orden.
- **Plaza liberada**: hueco que deja una cancelación y que se ofrece al primero de la lista de espera.
