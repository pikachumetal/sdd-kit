# Misión — reservas

## Por qué existe

La oficina gestiona sus 200 empleados y la reserva de salas de reunión con una hoja de cálculo compartida, lo que provoca solapamientos constantes. El sistema automatiza la reserva y garantiza, por diseño (constraint en BD), que no hay dos equipos en la misma sala a la misma hora.

## Usuarios y roles

- **Empleado**: reserva y cancela sus propias reservas.
- **Recepción**: ve el calendario del día y libera salas no ocupadas.
- **Administrador**: da de alta salas nuevas y accede a informes de uso.

## Módulos

- Gestión de salas
- Reservas (incluye avisos: 15 min antes de la reserva, y al liberar sala)
- Calendario del día
- Informes de uso

Fuera de scope MVP: check-in físico, integración con Outlook/Google Calendar.

## Dominio (lenguaje del equipo)

- **Reserva**: bloque de sala + franja horaria, máx. 4 horas, hasta 30 días de antelación.
- **Confirmada**: reserva que ha superado el constraint de solapamiento y prevalece frente a cualquier conflicto posterior.
- **Liberar**: acción de recepción que anula una reserva no ocupada.
- **Histórico**: tabla de auditoría de cambios en reservas.
