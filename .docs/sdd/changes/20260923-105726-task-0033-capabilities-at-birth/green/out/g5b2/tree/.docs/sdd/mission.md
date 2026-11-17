# Misión — Gimnasio Norte · Reservas de clases

## Por qué existe

Los socios reservan las clases del gimnasio por WhatsApp y recepción pierde reservas al gestionarlas a mano. El proyecto sustituye ese canal por reservas en línea: los socios reservan y cancelan por sí mismos, y recepción mantiene un único calendario que manda sobre cualquier reserva.

Funcional del cliente: [sources/funcional-cliente.md](sources/funcional-cliente.md).

## Usuarios y roles

- **Socio**: reserva y cancela sus propias clases.
- **Monitor**: ve la lista de asistentes de las clases que imparte.
- **Recepción**: gestiona el calendario de clases.

## Qué es y qué no es

- **Es**: calendario de clases, reservas de socios, lista de espera y los avisos asociados (email y push).
- **No es**: gestión de cuotas o pagos de los socios, ni altas/bajas de socios — el proyecto asume que esos datos ya existen.

## Dominio (lenguaje del proyecto)

- **Clase**: sesión con aforo máximo (6-30 plazas) y un monitor asignado, publicada por recepción.
- **Reserva**: plaza de un socio en una clase; un socio tiene como máximo 3 activas a la vez.
- **Lista de espera**: cola (máximo 10 socios) para una clase llena.
- **Falta**: cancelación tardía (menos de 4 horas antes) o no presentarse a una reserva.
- **Bloqueo**: 7 días sin poder reservar, tras 3 faltas en 30 días.
