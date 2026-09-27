# Misión — Gestor de Reservas de Salas

## Por qué existe

Los empleados necesitan reservar salas de reuniones sin choques de horario ni gestión manual. El sistema centraliza la disponibilidad de las salas y automatiza la confirmación de cada reserva, evitando dobles reservas y falta de visibilidad sobre qué sala está libre y cuándo.

## Usuarios y roles

- **Empleado**: consulta la disponibilidad de las salas y crea, consulta y cancela sus propias reservas dentro del límite de 30 días vista.
- **Administrador**: además de lo anterior, gestiona el alta, edición y baja lógica de las salas.

## Qué es y qué no es

- **Es**: un sistema de reserva de salas de reuniones internas, con confirmación por correo y horizonte de reserva de 30 días.
- **No es**: un gestor de recursos genérico (equipos, vehículos, otros espacios), ni un calendario corporativo completo.

## Dominio (lenguaje del proyecto)

- **Sala**: espacio físico reservable, con capacidad y disponibilidad propias.
- **Reserva**: bloque de tiempo asignado a un empleado sobre una sala concreta, dentro de los 30 días vista.
- **Aviso**: notificación por correo enviada al confirmar una reserva.
