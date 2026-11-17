---
id: 20261010-200347-feature-0011-booking-email-reminders
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

> **Estado**: draft.
> **Siguiente paso**: aprobación del dev-lead → `plan.md` con `superpowers:writing-plans`.

## Capacidades

Índice de `capabilities/`: no existe la carpeta, el proyecto no tiene capacidades todavía.

- Nuevas: `booking-reminders` — el aviso por correo al propietario de una reserva antes de que empiece.
- Modificadas: ninguna.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva, datos (columna nueva con migración), dependencia externa (envío de correo, que el proyecto no usaba) · tamaño: ~150 líneas en ~8 ficheros
- Mínimo razonable: ninguna, que es también lo propuesto — con 3 señales y sin contrato público ni `MODIFIED`, no hay lente que justifique un revisor. Queda sin mirar por otra mano si «el propietario es la dirección» (decisión 1) encaja con cómo llegan hoy los datos.

Pediste empezar sin preguntas, así que lo que habría salido de ellas lo he decidido yo. Las dos primeras son las que más cambian el resultado:

1. **El destinatario es el campo `Owner` de la reserva, y solo se avisa si su valor es una dirección de correo.** `Booking` no tiene ningún campo de correo y la API no tiene alta de reservas, así que no sé cómo llega hoy el dato. Elijo no añadir un campo `OwnerEmail` (sería una segunda columna y nadie sabe quién la rellenaría). Si `Owner` guarda nombres, esta feature no avisará a nadie hasta que se decida de dónde sale la dirección. **Es la decisión que debes mirar primero.**
2. **«Antes de la reserva» son 15 minutos antes de `Start`, un solo aviso por reserva.** No me dijiste la antelación; 15 minutos es lo habitual para llegar a una sala. No es configurable por usuario ni por sala.
3. **El aviso lo envía un proceso en segundo plano del backend que mira cada minuto**, no un trabajo externo. Con esa frecuencia el aviso llega, como mucho, un minuto después de los 15.
4. **Para no repetir avisos se guarda `ReminderSentAt` en la reserva** (columna nueva, nullable, con migración). Las reservas existentes quedan con `NULL`: una reserva futura de antes de esta feature también recibe su aviso.
5. **Si el envío falla, no se marca y se reintenta en el minuto siguiente** mientras la reserva no haya empezado; llegada la hora de inicio, ya no se avisa. Un fallo con una reserva no impide avisar las demás.
6. **Las reservas que ya han empezado no se avisan**, aunque nunca hubieran recibido aviso.
7. **Las horas se comparan y se muestran tal como están guardadas** (`DateTime` sin zona, contra la hora del servidor): no introduzco conversión de zona horaria porque el modelo actual no la tiene.
8. **Texto del correo en castellano** (constitution, art. 4): asunto «Recordatorio: <sala> a las <HH:mm>» y cuerpo con sala, inicio y fin.
9. **Capacidad nueva `booking-reminders`** (inglés kebab-case, por ser nombre de fichero), en vez de ampliar una existente: no hay ninguna.
10. **La configuración del servidor de correo (host, puerto, remitente) es de despliegue**, no de la spec; el plan decide cómo se declara. Sin servidor configurado, el backend arranca igual y cada envío cuenta como fallido, con las reglas de los dos escenarios de fallo.
11. **No hay cambios de frontend ni de la API pública**: `docs/api.md` y `frontend/` no se tocan, y no hay `§Frontend` que proponer.

### Decisiones tomadas con el dev-lead

- Carril feature, modo full, perfil `delegate`, entera sin partir — «feature 0011 del roadmap. Carril feature, perfil delegate, entera sin partir. Modo full.»
- Escribir la spec sin preguntas de diseño; los huecos van a las decisiones de arriba — «Sí, sáltate las preguntas y empieza ya.»

## Intent

Hoy una reserva solo existe en la lista: nadie le recuerda a quien reservó que su sala empieza en un rato, y las salas se pierden o se llegan tarde. Se quiere que, poco antes de que empiece una reserva, su propietario reciba un correo con la sala y la hora.

## Scope

- Entra: el aviso por correo al propietario 15 minutos antes del inicio; el registro de que ya se envió; el reintento si falla; la migración de la columna `ReminderSentAt`; los tests de los escenarios; una línea en `tech-stack.md` con la dependencia de correo, enlazando la capacidad.
- Entra, ficheros: `backend/src/Bookings.Api/Data/Booking.cs`, `Data/BookingsDb.cs` y la migración; el servicio de avisos y el envío de correo, ficheros nuevos en `backend/src/Bookings.Api/`; `backend/tests/Bookings.Tests/`.
- No entra: elegir la antelación por usuario o sala; avisos de cancelación o de cambio; un campo de correo propio o el alta de reservas; cualquier cambio en `frontend/` o en `docs/api.md`; conversión de zonas horarias; plantillas HTML del correo.

## Approach

Un servicio en segundo plano del backend consulta cada minuto las reservas sin `ReminderSentAt` cuyo `Start` cae en los próximos 15 minutos, envía el correo a las que tienen una dirección válida en `Owner` y marca `ReminderSentAt` al confirmarse el envío. El cómo (la abstracción del envío, el cliente de correo, la configuración, el reloj inyectable para los tests) es contenido del plan.

## Delta de comportamiento

### Capacidad: `booking-reminders`

**ADDED — El propietario recibe un aviso 15 minutos antes del inicio**
- GIVEN la reserva de `Sala Atlas` con `Owner` `ana@example.com`, `Start` 10:00, `End` 11:00 y sin aviso enviado
- WHEN llega el primer sondeo con la hora del servidor a partir de las 09:45 y antes de las 10:00
- THEN se envía un correo a `ana@example.com` con asunto «Recordatorio: Sala Atlas a las 10:00» y cuerpo con la sala, el inicio 10:00 y el fin 11:00
- AND la reserva queda con `ReminderSentAt` informado

**ADDED — Una reserva recibe un solo aviso**
- GIVEN la reserva anterior, ya con `ReminderSentAt` informado a las 09:46
- WHEN llegan los sondeos de las 09:47 a las 09:59
- THEN no se envía ningún otro correo a `ana@example.com` por esa reserva

**ADDED — No se avisa fuera de la ventana**
- GIVEN la reserva de `Sala Atlas`, `Start` 10:00, sin aviso enviado
- WHEN el sondeo corre a las 09:30
- THEN no se envía ningún correo y `ReminderSentAt` sigue sin informar

**ADDED — Una reserva que ya empezó no se avisa**
- GIVEN la reserva de `Sala Atlas`, `Start` 10:00, sin aviso enviado porque el servicio estuvo parado
- WHEN el sondeo corre a las 10:05
- THEN no se envía ningún correo y `ReminderSentAt` sigue sin informar

**ADDED — Sin dirección de correo en `Owner` no se avisa**
- GIVEN la reserva de `Sala Beta` con `Owner` `Ana`, `Start` 10:00 y sin aviso enviado
- WHEN el sondeo corre a las 09:50
- THEN no se envía ningún correo y `ReminderSentAt` sigue sin informar
- AND los avisos de las demás reservas en ventana se envían igual

**ADDED — El envío fallido se reintenta**
- GIVEN la reserva de `Sala Atlas`, `Start` 10:00, sin aviso enviado, y el servidor de correo rechaza el envío del sondeo de las 09:46
- WHEN el sondeo de las 09:46 falla y el de las 09:47 envía con éxito
- THEN tras el de las 09:46 `ReminderSentAt` sigue sin informar, y tras el de las 09:47 se envía el correo y `ReminderSentAt` queda informado
- AND el sondeo de las 09:48 no envía otro correo

**ADDED — Un envío que no llega antes del inicio se abandona**
- GIVEN la reserva de `Sala Atlas`, `Start` 10:00, y el servidor de correo rechaza todos los envíos entre las 09:45 y las 09:59
- WHEN corre el sondeo de las 10:00
- THEN no se envía ningún correo y `ReminderSentAt` sigue sin informar

**Reglas de la capacidad**
- **Dónde viven los datos**: `ReminderSentAt` (nullable) en la reserva; el destinatario es `Owner`.
- **Idioma de los nombres**: castellano en el asunto y el cuerpo del correo; el nombre de la capacidad y de la columna, en inglés.
- **Límites**: antelación de 15 minutos; sondeo cada minuto; un aviso por reserva.
- **Avisos**: correo con asunto «Recordatorio: <sala> a las <HH:mm>» y cuerpo con sala, inicio y fin.
- **Regla ante conflicto**: un fallo de envío no marca la reserva y no detiene el aviso de las demás.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
