---
id: 20261010-203954-feature-0011-avisos-correo-reserva
feature: 0011
title: Avisos por correo antes de la reserva
mode: full
profile: delegate
status: draft
created: 2026-10-10
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Avisos por correo antes de la reserva

🦆 Cuando falten 30 minutos para que empiece una reserva, quien la hizo recibe un correo con la sala y la hora. Ejemplo: Ana reserva Norte de 10:00 a 11:00 con `ana@example.com`; a las 09:30 le llega «Recordatorio: reserva de Norte a las 10:00», y no recibe otro. Por dentro, un proceso de la API mira cada minuto qué reservas entran en esa ventana y las marca como avisadas.

## Capacidades

- Nuevas: `booking-reminders` — el aviso por correo que recibe quien reservó antes de que empiece su reserva.
- Modificadas: ninguna (el proyecto no tiene capacidades todavía).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-reminders`), datos (dos columnas nuevas en `Booking` y su migración), dependencia externa (servidor de correo), contrato público (el JSON de `GET /bookings` no debe cambiar) · tamaño: ~150 líneas en ~8 ficheros
- Dominio (Sonnet): si los escenarios cubren que un aviso nunca se repite ni se pierde por un fallo de envío, y qué pasa con reservas sin correo o ya empezadas (señal: capacidad nueva)
- Técnica (Sonnet): si la migración deja las reservas existentes sin aviso y si el proceso en segundo plano no rompe el arranque sin servidor de correo (señal: datos + dependencia externa)
- Mínimo razonable: solo técnica — deja sin mirar los casos de borde del aviso (reserva creada tarde, ya empezada)

La entrevista no llegó a hacerse («sáltate las preguntas y empieza ya»), así que todo lo siguiente lo he decidido yo:

1. **Quién recibe el aviso**: la persona que hizo la reserva, en una dirección nueva `OwnerEmail` de la reserva. Hoy `Owner` es un texto libre sin correo — por eso hace falta el dato nuevo.
2. **Las reservas sin `OwnerEmail` no reciben aviso** y no dan error. Las existentes quedan así tras la migración: no se inventa ninguna dirección.
3. **Antelación fija de 30 minutos**, no configurable en esta feature.
4. **Un solo aviso por reserva**, guardado en `ReminderSentAt` (nulo = no avisada).
5. **Reserva creada con menos de 30 minutos de margen**: se avisa en la siguiente comprobación, mientras no haya empezado. Una reserva que ya empezó no se avisa nunca.
6. **Si el envío falla**, la reserva no se marca y se reintenta en la siguiente comprobación (cada minuto) hasta que empiece.
7. **Comprobación cada minuto**, dentro de la propia API (proceso en segundo plano), sin servicio aparte.
8. **Texto del correo**: asunto «Recordatorio: reserva de {sala} a las {HH:mm}»; cuerpo «Hola {Owner}: tu reserva de {sala} empieza a las {HH:mm} y termina a las {HH:mm}.» Hora tal como está guardada, sin conversión de zona.
9. **Sin servidor de correo configurado la API arranca igual**, no envía nada y deja un aviso en el log.
10. **La lista no expone `OwnerEmail` ni `ReminderSentAt`**: la pantalla no los necesita y la dirección es un dato personal. `GET /bookings` devuelve el mismo JSON de hoy.
11. **No hay pantalla ni endpoint nuevos**: las reservas no se crean por la API hoy, así que `OwnerEmail` se informa donde ya se crean (fuera de esta feature).
12. **Capacidad nueva `booking-reminders`** (nombre en inglés kebab-case, ya que es un fichero).
13. **Librería y ajustes del envío** (biblioteca SMTP, claves de configuración) se deciden en el plan: no cambian lo que se observa.

## Intent

Hoy las reservas de sala no avisan a nadie: quien reserva debe acordarse de la hora, y la sala se queda vacía o se llega tarde. Se quiere que la persona reciba un correo poco antes de que empiece.

## Scope

- Entra: aviso por correo 30 minutos antes; una sola vez por reserva; reintento si falla; columnas `OwnerEmail` y `ReminderSentAt` con su migración; la lista sigue sin exponerlas; arranque sin correo configurado.
- No entra: configurar la antelación; avisos al terminar o al cancelar; avisar a otros asistentes; pantalla o endpoint para informar `OwnerEmail`; cambios en el frontend; zonas horarias.

## Approach

Un proceso en segundo plano de la API revisa cada minuto las reservas sin aviso cuyo inicio cae en los próximos 30 minutos y que aún no han empezado, y envía el correo a cada una. Al enviarlo con éxito, anota la hora en la reserva. Los detalles técnicos van en `plan.md`.

## Dónde se prueba

- Aviso, no repetición, reintento, reserva sin correo, reserva creada tarde y reserva empezada: llamando una vez a la comprobación contra la base de pruebas con un reloj y un buzón falsos — costura nueva, porque lo que se observa no pasa por ningún endpoint; usa el mismo `SqlServerApiFactory` de los tests de reservas.
- La lista no expone el correo: por el endpoint, como `Lists_bookings_ordered_by_start`.
- Arranque sin servidor de correo: arrancando la API de pruebas sin configuración y pidiendo `GET /bookings`.

## Términos y ADR

- Términos resueltos: aviso — el único correo de recordatorio de una reserva | ninguno más
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-reminders`

**ADDED — Aviso 30 minutos antes**
- GIVEN la reserva Norte de 10:00 a 11:00 de Ana, `ana@example.com`, sin aviso enviado
- WHEN son las 09:30
- THEN Ana recibe en `ana@example.com` un correo con asunto «Recordatorio: reserva de Norte a las 10:00»
- AND la reserva queda marcada como avisada

**ADDED — Un solo aviso por reserva**
- GIVEN la reserva Norte de 10:00 ya avisada a las 09:30
- WHEN pasa la comprobación de las 09:31
- THEN no se envía ningún otro correo

**ADDED — Sin correo no hay aviso**
- GIVEN la reserva Sur de 10:00 de Luis sin `OwnerEmail`
- WHEN son las 09:30
- THEN no se envía nada y la comprobación no falla

**ADDED — Reserva creada con poco margen**
- GIVEN la reserva Norte de 10:00 con `ana@example.com`, creada a las 09:50 y sin avisar
- WHEN pasa la comprobación de las 09:51
- THEN Ana recibe el aviso

**ADDED — Reserva ya empezada no se avisa**
- GIVEN la reserva Norte de 10:00 con `ana@example.com`, sin avisar
- WHEN son las 10:05
- THEN no se envía ningún correo

**ADDED — Fallo de envío se reintenta**
- GIVEN la reserva Norte de 10:00 con `ana@example.com` y el servidor de correo caído
- WHEN a las 09:30 el envío falla
- THEN la reserva no queda marcada como avisada
- AND a las 09:31, con el servidor de vuelta, Ana recibe el aviso y la reserva queda marcada

**ADDED — Arranque sin servidor de correo**
- GIVEN la API sin servidor de correo configurado
- WHEN arranca y se pide `GET /bookings`
- THEN responde la lista como siempre y no se envía ningún aviso

**ADDED — La lista no expone el correo**
- GIVEN la reserva Norte de Ana con `OwnerEmail` `ana@example.com` y `ReminderSentAt` informado
- WHEN se pide `GET /bookings`
- THEN el JSON de esa reserva no contiene `OwnerEmail` ni `ReminderSentAt`

**Reglas de la capacidad**
- **Dónde viven los datos**: `OwnerEmail` y `ReminderSentAt` en cada reserva.
- **Idioma de los nombres**: asunto y cuerpo del correo en castellano.
- **Límites**: antelación de 30 minutos; comprobación cada minuto.
- **Avisos**: asunto «Recordatorio: reserva de {sala} a las {HH:mm}»; cuerpo «Hola {Owner}: tu reserva de {sala} empieza a las {HH:mm} y termina a las {HH:mm}.»
- **Regla ante conflicto**: un solo aviso por reserva; si el envío falla se reintenta hasta que la reserva empiece.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
