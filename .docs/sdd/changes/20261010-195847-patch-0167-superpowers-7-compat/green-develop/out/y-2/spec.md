---
id: 20261010-203931-feature-0011-reminder-emails
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

🦆 Quien reserva una sala recibe un correo 30 minutos antes de que empiece. Por ejemplo: la reserva de «Sala 2» de `ana@empresa.test` empieza a las 10:00, y a las 09:30 le llega «Recordatorio: tu reserva de Sala 2 empieza a las 10:00». Por dentro, una tarea en segundo plano revisa cada minuto las reservas próximas y marca cada una como avisada para no repetir el correo.

## Capacidades

- Nuevas: `booking-reminders` — el aviso por correo previo al inicio de una reserva.

## ✋ Decisiones que he tomado yo — valida estas

El dev-lead pidió empezar sin entrevista: todo lo que sigue es una suposición mía, no una respuesta suya.

Review de spec propuesta: ninguna — señales: capacidad nueva, datos (columnas nuevas), dependencia externa (envío SMTP) · tamaño: ~150 líneas en ~6 ficheros
- Mínimo razonable: ninguna revisión — deja sin mirar si la regla de «no avisar tarde» (decisión 5) y el reintento (decisión 7) contradicen lo que el negocio espera

1. **Destinatario**: la reserva gana un campo `OwnerEmail` (opcional). `Owner` es hoy un texto libre sin garantía de ser una dirección, así que no lo uso como destino. Una reserva sin `OwnerEmail` no genera aviso. — no hay dato de contacto en el modelo.
2. **Antelación**: 30 minutos antes de `Start`, fija, no configurable por usuario. — valor típico; nadie lo dijo.
3. **Texto del correo**: asunto `Recordatorio: tu reserva de {sala} empieza a las {HH:mm}`; cuerpo `Tu reserva de {sala} es de {HH:mm} a {HH:mm}.` — castellano por la constitution (art. 4).
4. **Una sola vez**: cada reserva guarda `ReminderSentAt`; con valor, no se vuelve a avisar. — evita duplicados con el sondeo.
5. **No avisar tarde**: si en el momento de revisar la reserva ya ha empezado (`Start` ≤ ahora), no se envía. Si faltan menos de 30 minutos pero no ha empezado, se envía en la primera revisión. — un aviso después del inicio no sirve.
6. **Mecanismo**: servicio en segundo plano en la propia API que revisa cada 60 segundos, y un `IEmailSender` con implementación SMTP configurada por ajustes (`Smtp:Host`, `Smtp:Port`, `Smtp:From`). Sin `Smtp:Host` configurado el servicio no envía ni marca nada. — es lo mínimo sin infraestructura nueva.
7. **Fallo de envío**: si el envío falla, la reserva no se marca y se reintenta en la siguiente revisión mientras no haya empezado; el fallo se registra en el log y no tumba la API. — no perder el aviso por un fallo transitorio.
8. **Migración**: columnas `OwnerEmail` (nullable) y `ReminderSentAt` (nullable) mediante migración de EF. — comando de `tech-stack.md`.
9. **Sin alta de correo**: no hay endpoint para crear reservas ni para fijar `OwnerEmail`; esta feature no lo añade (el correo se rellena por quien cree las reservas). — fuera del enunciado de la fila 0011.
10. **Capacidad nueva `booking-reminders`** (slug en inglés kebab-case, contenido en castellano).
11. **Hora mostrada**: se formatea `Start`/`End` tal como están guardados, sin conversión de zona horaria. — el modelo no guarda zona.

## Intent

Hoy la aplicación solo lista reservas: quien reserva una sala tiene que acordarse de ir. Se quiere que la aplicación le avise por correo poco antes de que empiece, para que no se pierda la sala ni la deje ocupada sin uso.

## Scope

- Entra: campos `OwnerEmail` y `ReminderSentAt` en la reserva y su migración; servicio en segundo plano que envía el aviso; envío por SMTP configurable; pruebas.
- No entra: alta o edición de reservas; elegir la antelación por usuario; avisos de cancelación o cambio; aviso por otros canales; mostrar en la lista si la reserva fue avisada; reintentos con espera creciente.

## Approach

Un servicio hospedado en la API consulta cada minuto las reservas con `OwnerEmail`, sin `ReminderSentAt`, con `Start` en el futuro y a 30 minutos o menos. Por cada una pide el envío a `IEmailSender` y, si sale bien, guarda `ReminderSentAt`. La decisión de «qué reservas toca avisar» y el envío van separados para poder probar la primera con un reloj y un emisor falsos.

## Dónde se prueba

- Qué reservas se avisan, una sola vez y sin avisar tarde: sobre el servicio de avisos con reloj fijo y `IEmailSender` falso, contra la base real de `SqlServerApiFactory`, como los tests de reservas actuales.
- Texto del correo: sobre el mismo servicio, comprobando asunto y cuerpo del correo falso.
- Fallo de envío y reintento: sobre el mismo servicio, con un emisor falso que falla una vez.
- Lista de reservas sigue igual: por el endpoint `GET /bookings`, con el test existente.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-reminders`

**ADDED — Aviso por correo antes del inicio**
- GIVEN la reserva «Sala 2» de `ana@empresa.test`, de 10:00 a 11:00, sin aviso enviado
- WHEN son las 09:30 y el servicio revisa
- THEN se envía a `ana@empresa.test` el correo con asunto «Recordatorio: tu reserva de Sala 2 empieza a las 10:00» y cuerpo «Tu reserva de Sala 2 es de 10:00 a 11:00.»
- AND la reserva queda marcada como avisada

**ADDED — El aviso no se repite**
- GIVEN la reserva «Sala 2» de `ana@empresa.test` de 10:00 a 11:00 ya avisada a las 09:30
- WHEN son las 09:31 y el servicio revisa
- THEN no se envía ningún correo

**ADDED — Sin aviso antes de tiempo**
- GIVEN la reserva «Sala 2» de `ana@empresa.test`, de 10:00 a 11:00, sin avisar
- WHEN son las 09:29 y el servicio revisa
- THEN no se envía ningún correo

**ADDED — Sin aviso una vez empezada**
- GIVEN la reserva «Sala 2» de `ana@empresa.test`, de 10:00 a 11:00, sin avisar
- WHEN son las 10:01 y el servicio revisa
- THEN no se envía ningún correo
- AND la reserva no se marca como avisada

**ADDED — Reserva dada de alta con poco margen**
- GIVEN la reserva «Sala 1» de `luis@empresa.test`, de 10:00 a 11:00, sin avisar
- WHEN son las 09:50 y el servicio revisa
- THEN se envía el correo a `luis@empresa.test`

**ADDED — Reserva sin correo**
- GIVEN la reserva «Sala 3» de `Marta`, de 10:00 a 11:00, sin `OwnerEmail`
- WHEN son las 09:30 y el servicio revisa
- THEN no se envía ningún correo

**ADDED — Reintento tras un fallo de envío**
- GIVEN la reserva «Sala 2» de `ana@empresa.test`, de 10:00 a 11:00, y el servidor de correo falla a las 09:30
- WHEN el servicio revisa a las 09:30 y otra vez a las 09:31
- THEN a las 09:30 la reserva no queda marcada y la API sigue respondiendo
- AND a las 09:31 se vuelve a intentar el envío y, si sale bien, queda marcada

**Reglas de la capacidad**
- **Dónde viven los datos**: `OwnerEmail` y `ReminderSentAt` en la reserva.
- **Idioma de los nombres**: castellano en el texto del correo; inglés en los nombres de campos y ajustes.
- **Límites**: antelación de 30 minutos; revisión cada 60 segundos.
- **Avisos**: asunto «Recordatorio: tu reserva de {sala} empieza a las {HH:mm}»; cuerpo «Tu reserva de {sala} es de {HH:mm} a {HH:mm}.»
- **Regla ante conflicto**: no aplica.

## Enmiendas

- ninguna

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
