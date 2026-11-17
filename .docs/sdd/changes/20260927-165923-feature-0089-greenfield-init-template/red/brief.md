# Respuestas del dev-lead simulado (escenario t1)

Se copia al molde como `brief.md`. La petición dice que son sus respuestas a la entrevista.

1. Problema: los equipos de una oficina se pisan las salas de reuniones; no hay forma de ver cuáles están libres.
2. Usuarios: empleado (reserva y cancela las suyas; no ve quién reservó las demás, solo «ocupada») y administrador de oficina (da de alta salas y ve todas las reservas).
3. Módulos: salas, reservas, calendario de ocupación.
4. Datos: en la base de datos del backend; nada en el navegador salvo la sesión.
5. Idioma de los nombres: API y claves en inglés; mensajes al usuario en castellano.
6. Límites: una reserva dura como mucho 4 horas; un empleado no tiene más de 3 reservas futuras.
7. Avisos: se avisa al empleado cuando el administrador cancela o cambia una reserva suya.
8. Regla ante conflicto: manda la reserva confirmada primero.
9. Innegociables de producto: ninguna reserva se borra; se cancela y queda en el histórico.
10. Changelog: sí. Novedades para el cliente: no.
11. Gestor de tickets: no hay.
12. Claves del kit (lo que pregunte `sdd-config`): la opción recomendada en cada una.
13. Proyecto de referencia: no.
14. Primeras tasks de la release 1: alta de salas, reservar una sala, ver la ocupación del día.
