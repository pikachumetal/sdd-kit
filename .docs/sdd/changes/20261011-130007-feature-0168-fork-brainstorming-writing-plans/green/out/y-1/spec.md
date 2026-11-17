---
id: 20261011-134944-feature-0011-avisos-correo-reserva
feature: 0011
title: Avisos por correo antes de la reserva
mode: full
status: draft
created: 2026-10-11
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Avisos por correo antes de la reserva

🦆 Quien tiene una sala reservada recibirá un correo poco antes de que empiece: si Ana reservó Norte de 10:00 a 11:00, a las 09:30 le llega «Tu reserva de Norte empieza a las 10:00». Cada reserva avisa una sola vez, y solo si tiene un correo guardado. Un proceso del servidor mira cada minuto qué reservas están a 30 minutos o menos de empezar y manda el correo; si el envío falla, lo reintenta al minuto siguiente.

## Capacidades

- Nuevas: `booking-reminders` — avisa por correo al dueño de una reserva antes de que empiece.
- Modificadas: ninguna (no hay capacidades previas en `capabilities/`).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: capacidad nueva, datos (columnas `OwnerEmail` y `ReminderSentAt`), dependencia externa (envío por SMTP) · tamaño: ~130 líneas en ~7 ficheros
- Mínimo razonable: ninguna (3 señales, por debajo del umbral; el contrato público queda sin tocar por la decisión 14) — deja sin mirar si el reintento al minuto siguiente puede mandar el correo dos veces cuando el envío tarda más de un minuto
```

1. **Destinatario: columna nueva `OwnerEmail` en la reserva.** La pregunta «¿a qué dirección?» no llegó a contestarse porque pediste empezar ya; tomé la opción que recomendaba: `Owner` es texto libre y no se reutiliza, y un buzón fijo no avisa a la persona. Cuesta una migración.
2. **Las reservas sin `OwnerEmail` no se avisan.** Incluye todas las que ya existen. No hay relleno automático ni aviso de que no se avisó.
3. **✋ Hueco que conviene que mires: la API no tiene `POST` ni `PUT`**, solo `GET /bookings`. Esta feature no añade ninguno (No entra), así que `OwnerEmail` solo se rellena hoy directamente en la base de datos. Sin una feature que cree o edite reservas, el aviso funciona de punta a punta pero no hay pantalla ni endpoint desde el que alguien ponga el correo. Si prefieres que 0011 incluya un endpoint para fijarlo, es un cambio de alcance: dímelo y se enmienda.
4. **30 minutos de antelación**, fijo, no configurable. El roadmap no dice cuánto es «antes».
5. **Un solo aviso por reserva.** Si ya se avisó, no se repite aunque cambie algo después.
6. **El proceso comprueba cada minuto**, así que el aviso puede llegar hasta 1 minuto más tarde de lo que marca la ventana.
7. **Una reserva que ya empezó no se avisa**, aunque nadie la haya avisado nunca. Una reserva creada con menos de 30 minutos de margen se avisa en la siguiente comprobación, mientras no haya empezado.
8. **Texto del correo** (castellano, por la constitution):
   - Asunto: `Tu reserva de {Room} empieza a las {HH:mm}`
   - Cuerpo: `Hola {Owner}: tu reserva de la sala {Room} empieza a las {HH:mm} y termina a las {HH:mm}.`
9. **Zona horaria**: las horas son las guardadas en `Start` y `End`, sin conversión; el servidor compara contra su reloj local. No hay zona horaria declarada en el proyecto.
10. **Fallo de envío**: no se marca como avisada y se reintenta en la comprobación siguiente, sin tope de reintentos mientras la reserva no haya empezado.
11. **Capacidad nueva `booking-reminders`**, slug en inglés kebab-case por ser nombre de fichero.
12. **Envío por SMTP, con servidor y remitente en la configuración de la API.** El proyecto no usaba ningún servicio de correo. La elección concreta (librería, valores) es del plan, pero el SMTP es mío: nadie dijo qué proveedor.
13. **Sin frontend**: la lista de reservas no muestra el estado del aviso.
14. **`GET /bookings` no cambia: no devuelve `OwnerEmail` ni `ReminderSentAt`.** El endpoint hoy serializa la entidad entera, así que una columna nueva saldría sola en la respuesta; lo evito para no publicar correos de personas a cualquiera que liste reservas, y porque así el contrato de la API no se toca. Cuesta devolver una proyección en vez de la entidad.

### Decisiones tomadas con el dev-lead

- Empezar sin más preguntas, con las decisiones sin contestar a cargo del agente y listadas arriba — «Sí, sáltate las preguntas y empieza ya.» Esto no aprueba la spec: la aprobación va por el gate.

## Intent

Hoy la aplicación solo lista reservas: nadie recibe ningún aviso y es fácil olvidar una sala reservada o llegar tarde. Se quiere que quien reservó reciba un correo poco antes de que la reserva empiece. El éxito es que cada reserva con correo guardado avisa una vez, antes de empezar, y ninguna sin correo avisa.

## Scope

- Entra: columna `OwnerEmail` (y la marca de «ya avisada») en la reserva con su migración · proceso de fondo que cada minuto busca reservas a 30 minutos o menos de empezar · envío del correo por SMTP, configurado en la API · que `GET /bookings` siga devolviendo lo mismo que hoy (decisión 14).
- No entra: cambiar la respuesta de `GET /bookings` · endpoint para crear o editar reservas, y por tanto para rellenar `OwnerEmail` (decisión 3) · frontend · plazo configurable · avisos por otros canales · avisos de cancelación o de cambio · reintentos con tope o cola.

## Approach

Un servicio de fondo del backend que, cada minuto, consulta las reservas con correo, sin aviso previo, que no hayan empezado y empiecen en 30 minutos o menos; manda el correo de cada una y, solo si el envío termina bien, la marca como avisada. El detalle (librería de envío, reloj inyectable, forma de la migración) es del plan.

## Dónde se prueba

- Avisar, no repetir, no avisar sin correo o fuera de ventana, y reintentar tras un fallo: llamando al servicio de avisos con un reloj fijo y un remitente falso, sobre la base de tests de `BookingsEndpointsTests` (SQL Server con Testcontainers); sin tocar el endpoint, que no cambia.
- La migración y las columnas nuevas: las ejercita el mismo test al crear la base.
- `GET /bookings` no devuelve las columnas nuevas: por el endpoint, como `Lists_bookings_ordered_by_start`.
- Que sale un correo real por SMTP: no se prueba en la suite; es una verificación manual en la validación.

## Términos y ADR

- Términos resueltos: aviso — el correo que se manda antes de empezar la reserva (no «notificación» ni «recordatorio»); ventana — los 30 minutos previos al inicio.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `booking-reminders`

**ADDED — Aviso por correo antes de empezar la reserva**
- GIVEN la reserva de Norte de Ana (`ana@example.com`), de 10:00 a 11:00, sin aviso previo, y son las 09:30
- WHEN el proceso de avisos hace su comprobación
- THEN se manda un correo a `ana@example.com` con asunto `Tu reserva de Norte empieza a las 10:00` y cuerpo `Hola Ana: tu reserva de la sala Norte empieza a las 10:00 y termina a las 11:00.`
- AND la reserva queda marcada como avisada

**ADDED — Una reserva solo se avisa una vez**
- GIVEN la misma reserva de Norte ya avisada a las 09:30, y son las 09:31
- WHEN el proceso de avisos hace su comprobación
- THEN no se manda ningún correo

**ADDED — Sin correo guardado no se avisa**
- GIVEN la reserva de Sur de Luis, de 10:00 a 11:00, con `OwnerEmail` vacío, y son las 09:30
- WHEN el proceso de avisos hace su comprobación
- THEN no se manda ningún correo
- AND la reserva no queda marcada como avisada

**ADDED — No se avisa fuera de la ventana**
- GIVEN la reserva de Norte de Ana de 11:00 a 12:00, y son las 09:30
- WHEN el proceso de avisos hace su comprobación
- THEN no se manda ningún correo (faltan 90 minutos, más de 30)

**ADDED — No se avisa de una reserva que ya empezó**
- GIVEN la reserva de Norte de Ana de 09:00 a 10:00, sin aviso previo, y son las 09:30
- WHEN el proceso de avisos hace su comprobación
- THEN no se manda ningún correo

**ADDED — Un envío fallido se reintenta**
- GIVEN la reserva de Norte de Ana de 10:00 a 11:00 y el servidor de correo caído a las 09:30
- WHEN el proceso de avisos hace su comprobación a las 09:30 y a las 09:31, con el servidor ya disponible
- THEN a las 09:30 no queda marcada como avisada
- AND a las 09:31 se manda el correo y queda marcada como avisada

**ADDED — El correo del dueño no sale en la lista de reservas**
- GIVEN la reserva de Norte de Ana con `OwnerEmail` `ana@example.com`
- WHEN se pide `GET /bookings`
- THEN la reserva aparece sin `OwnerEmail` ni `ReminderSentAt`

**Reglas de la capacidad**
- **Dónde viven los datos**: en la reserva (`Booking`): `OwnerEmail` (texto, opcional) y `ReminderSentAt` (fecha y hora, nula si no se avisó).
- **Idioma de los nombres**: el texto del correo en castellano, como el resto de la interfaz (constitution, art. 4); los nombres de columna en inglés, como `Booking`.
- **Límites**: ventana de 30 minutos antes del inicio; comprobación cada minuto; un solo aviso por reserva.
- **Avisos**: asunto `Tu reserva de {Room} empieza a las {HH:mm}`; cuerpo `Hola {Owner}: tu reserva de la sala {Room} empieza a las {HH:mm} y termina a las {HH:mm}.`
- **Regla ante conflicto**: no aplica; un envío fallido no marca la reserva y se reintenta en la comprobación siguiente.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
