# Misión — Salas

## Por qué existe

App interna para reservar salas de reuniones de la oficina. Resuelve el conflicto de reservas manuales o informales, dando un sistema único donde empleados ven disponibilidad y reservan sin choques, y la organización mantiene trazabilidad de quién usa qué sala y cuándo.

## Usuarios y roles

- **Empleado**: consulta salas, crea y gestiona sus propias reservas dentro de la ventana de 30 días vista, recibe avisos por correo.
- **Administrador**: además de lo anterior, gestiona el catálogo de salas.

## Qué es y qué no es

- **Es**: gestión de salas, reservas a corto-medio plazo (máximo 30 días vista) y avisos por correo al confirmar reserva.
- **No es**: gestor de tickets, ni sistema de facturación/recursos externos a la sala en sí.

## Dominio (lenguaje del proyecto)

- **Sala**: espacio físico reservable, gestionado por el administrador.
- **Reserva**: bloque de tiempo asignado a un empleado sobre una sala, dentro de la ventana de 30 días vista.
- **Aviso**: notificación por correo enviada al confirmarse una reserva.
