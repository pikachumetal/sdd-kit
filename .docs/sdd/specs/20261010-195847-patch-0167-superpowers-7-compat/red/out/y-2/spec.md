---
id: 20261010-200028-feature-0011-booking-reminders
feature: 0011
title: Avisos por correo antes de la reserva
mode: full
status: draft
created: 2026-10-10
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Avisos por correo antes de la reserva

## Capacidades

> `.docs/sdd/capabilities/` no existe en este proyecto: no hay índice que consultar y no se toca ninguna capacidad vigente.

- Nuevas: `booking-reminders` — el aviso por correo que recibe quien reservó una sala antes de que empiece su reserva.

## Decisiones que he tomado yo — valida estas

> El enunciado de la fila 0011 es una frase; el dev-lead pidió empezar sin preguntas. Todo lo que sigue lo he fijado yo y es lo único que hay que leer para aprobar.

Review de spec propuesta: ninguna — señales: capacidad nueva, datos (columna nueva), dependencia externa (SMTP) · tamaño: ~60 líneas de código y 1 migración en ~5 ficheros
- Mínimo razonable: ninguna — deja sin mirar si el cambio de esquema es compatible con las reservas ya guardadas, que cubre el escenario 4 y se comprueba en la validación.

1. **Capacidad nueva `booking-reminders`** — el aviso es comportamiento observable nuevo y no encaja en ninguna capacidad vigente (no hay ninguna escrita).
2. **El aviso va a una dirección propia de la reserva (`OwnerEmail`, opcional)**, no se deduce de `Owner` — hoy `Owner` es texto libre sin correo. Las reservas sin `OwnerEmail` no reciben aviso y no es un error.
3. **Aviso único, 60 min antes del inicio** (`Start`) — un solo recordatorio es lo mínimo que cumple el enunciado; 60 min deja tiempo de reaccionar. El valor es configurable (`Reminders:LeadMinutes`, por defecto 60).
4. **Se marca el envío en la reserva (`ReminderSentAt`, opcional)** para que no se repita tras un reinicio de la API.
5. **Se envía en segundo plano, comprobando cada minuto** — un servicio hospedado en la API .NET; no hay planificador en el proyecto y es lo más simple dentro de este stack.
6. **Reserva creada dentro de la ventana de 60 min** (la reserva empieza en 20 min) **recibe el aviso en la siguiente comprobación**, una sola vez. Una reserva que ya empezó no recibe nada.
7. **Si el envío falla, no se marca y se reintenta en la comprobación siguiente** hasta que la reserva empieza; el fallo se registra en el log y no tumba la API.
8. **El correo va en castellano** (Art. 4 de la constitution), asunto `Recordatorio: reserva de <sala> a las <HH:mm>`. La hora es la de `Start` tal como está guardada, sin conversión de zona: hoy la columna no guarda zona y no la invento.
9. **El servidor SMTP se configura por `appsettings` / variables de entorno** (`Smtp:Host`, `Smtp:Port`, `Smtp:From`); sin `Smtp:Host` el servicio no envía y lo dice una vez en el log al arrancar. No entran credenciales en el repositorio.
10. **No toca el frontend.** El aviso no cambia nada que se vea en la lista; por eso no hace falta `§Frontend` en `tech-stack.md`.
11. **⚠ La API no tiene alta de reservas** (solo `GET /bookings`): nada en la aplicación rellena `OwnerEmail`. Dejo fuera cualquier forma de captarlo — es una decisión tuya si la 0011 debe incluir un `POST /bookings` o un campo en la pantalla; lo he dejado como feature aparte para no inventar un contrato público. Con esto, hoy los avisos solo salen para reservas con `OwnerEmail` puesto directamente en la base.

### Decisiones tomadas con el dev-lead

- Carril feature, perfil `delegate`, feature entera sin partir, modo full — «carril feature, perfil delegate, entera, sin partir. Modo full.»
- Empezar sin preguntas de diseño — «Sí, sáltate las preguntas y empieza ya.»

## Intent

Hoy quien reserva una sala solo ve su reserva si abre la lista; nada le avisa cuando se acerca. Se quiere que reciba un correo antes de que empiece, para que no se le pase ni deje la sala ocupada sin usar.

## Scope

- Entra: columnas `OwnerEmail` y `ReminderSentAt` en `Booking` con su migración; servicio en segundo plano que envía el aviso; envío por SMTP configurable; sus tests (xUnit).
- No entra: captar o editar el correo desde la API o la pantalla (decisión 11); aviso al cancelar o modificar una reserva; varios avisos por reserva; avisos a otros asistentes; plantillas HTML; conversión de zona horaria; frontend.

## Approach

Un servicio hospedado en `Bookings.Api` consulta cada minuto las reservas con `OwnerEmail`, sin `ReminderSentAt`, cuyo inicio cae entre ahora y ahora + 60 min, envía el correo por SMTP y marca `ReminderSentAt`. Reloj y envío van detrás de interfaces para poder probar el comportamiento sin esperar ni mandar correo real. El detalle (migración, registro del servicio en el arranque de la API, elección de la librería SMTP) es contenido de `plan.md`.

## Delta de comportamiento

### Capacidad: `booking-reminders`

**ADDED — Aviso por correo antes del inicio**
- GIVEN la reserva de la sala «Sala Norte» de 10:00 a 11:00 con `OwnerEmail` `ana@ejemplo.test` y sin aviso enviado
- WHEN son las 09:00 o más tarde y antes de las 10:00
- THEN se envía un correo a `ana@ejemplo.test` con asunto `Recordatorio: reserva de Sala Norte a las 10:00`, en castellano
- AND la reserva queda marcada como avisada

**ADDED — Un solo aviso por reserva**
- GIVEN la misma reserva ya avisada a las 09:00
- WHEN pasan 10 comprobaciones más, o se reinicia la API, antes de las 10:00
- THEN no se envía ningún correo más

**ADDED — Antes de la ventana no se avisa**
- GIVEN la reserva de «Sala Norte» a las 10:00 con `OwnerEmail` y sin aviso
- WHEN son las 08:59
- THEN no se envía correo

**ADDED — Reserva sin correo no se avisa**
- GIVEN una reserva de «Sala Sur» a las 10:00 con `OwnerEmail` vacío (como todas las ya existentes)
- WHEN son las 09:30
- THEN no se envía correo, no hay error y la reserva sigue sin marcar

**ADDED — Reserva creada dentro de la ventana**
- GIVEN una reserva de «Sala Norte» que empieza a las 10:00 y se guarda a las 09:40 con `OwnerEmail`
- WHEN llega la comprobación siguiente
- THEN se envía un único correo con asunto `Recordatorio: reserva de Sala Norte a las 10:00`

**ADDED — Reserva ya empezada no se avisa**
- GIVEN una reserva de 10:00 con `OwnerEmail` y sin aviso
- WHEN son las 10:05
- THEN no se envía correo

**ADDED — Fallo del envío se reintenta**
- GIVEN la reserva de 10:00 con `OwnerEmail` y el servidor SMTP caído a las 09:00
- WHEN el envío falla a las 09:00 y funciona a las 09:01
- THEN a las 09:00 la reserva no queda marcada y la API sigue respondiendo, y a las 09:01 se envía un único correo y se marca

**ADDED — Sin SMTP configurado no se envía**
- GIVEN la API arranca sin `Smtp:Host`
- WHEN hay una reserva con `OwnerEmail` dentro de la ventana
- THEN no se envía ni se marca, y el log dice al arrancar que los avisos están desactivados

**Reglas de la capacidad**
- **Dónde viven los datos**: `OwnerEmail` y `ReminderSentAt` en la tabla de reservas.
- **Idioma de los nombres**: el texto del correo en castellano; los campos en inglés, como los de `Booking`.
- **Límites**: un aviso por reserva; 60 min antes de `Start` (configurable con `Reminders:LeadMinutes`); comprobación cada minuto.
- **Avisos**: el correo `Recordatorio: reserva de <sala> a las <HH:mm>`; no hay otros.
- **Regla ante conflicto**: no aplica.

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
