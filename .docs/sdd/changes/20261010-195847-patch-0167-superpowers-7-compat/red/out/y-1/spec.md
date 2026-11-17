---
id: 20261010-200042-feature-0011-booking-email-reminders
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

## Capacidades

- Nuevas: `booking-reminders` — el aviso por correo que recibe quien tiene una reserva poco antes de que empiece.
- Modificadas: ninguna (`capabilities/` no existe todavía en el proyecto).

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: pendiente de la pregunta previa al gate — señales: capacidad nueva (`booking-reminders`), datos (columnas `OwnerEmail` y `ReminderSentAt` + migración), dependencia externa (servidor SMTP), condición de visibilidad (la dirección no sale por `GET /bookings`) · tamaño: ~150 líneas en ~8 ficheros
- Dominio: si «un aviso por reserva», «ventana vencida» y «sin dirección» cubren los casos reales sin avisos duplicados ni huérfanos (señal: capacidad nueva)
- Técnica: si `OwnerEmail` queda fuera de la respuesta de `GET /bookings` y si la migración deja las reservas existentes sin aviso en vez de fallar (señal: datos + visibilidad)
- Mínimo razonable: ninguna — deja sin mirar si la dirección se filtra por la API y qué pasa con las filas anteriores a la migración

1. **El destinatario es una columna nueva `OwnerEmail` (nullable) en `Bookings`.** Hoy `Owner` es un texto libre sin garantía de ser una dirección y la API no tiene `POST`: no hay de dónde sacar un correo. Alternativa descartada: usar `Owner` si contiene `@`. Es la decisión que más condiciona el resto: **cómo se rellena `OwnerEmail` queda fuera de esta feature** (sin endpoint de alta, hoy solo entra por base de datos o por la feature que añada el alta).
2. **Las reservas sin `OwnerEmail` no reciben aviso** y no se marcan: si después se rellena y aún falta tiempo, el aviso saldrá.
3. **Un único aviso por reserva, 60 minutos antes del inicio**, configurable en `Reminders:LeadMinutes` (valor mío: la fila dice «avisos» sin plazo ni número).
4. **El aviso sale en el primer barrido con `inicio − antelación ≤ ahora < inicio`.** Una reserva creada con menos de 60 min de margen se avisa en el siguiente barrido; una que ya empezó no se avisa nunca (un recordatorio tardío no sirve).
5. **Barrido cada 60 s en un servicio en segundo plano del propio proceso de la API** (`BackgroundService`), con envío por SMTP configurado en `Smtp:Host`, `Smtp:Port` y `Smtp:From`; la librería de envío se decide en `plan.md`. Sin cola externa ni scheduler aparte porque hay un solo proceso y un solo SQL Server. Con varias instancias de la API un aviso podría duplicarse: límite asumido, anotado en «No entra».
6. **`ReminderSentAt` se escribe solo tras un envío correcto.** Si el envío falla, el siguiente barrido lo reintenta mientras la ventana siga abierta; fuera de ella no hay reintentos ni aviso de que falló.
7. **`Start` y `End` se interpretan como UTC**, igual que el resto de la API (el modelo no tiene zona horaria). Si el proyecto los guarda en hora local, el aviso saldría desplazado: a comprobar en la validación.
8. **Texto del correo en castellano** (constitution, art. 4): asunto `Recordatorio: <sala> a las <HH:mm>`, cuerpo con sala, inicio y fin. La hora se muestra tal cual está guardada.
9. **`OwnerEmail` no aparece en la respuesta de `GET /bookings`:** el contrato público no cambia y la lista no expone direcciones a quien la consulta.
10. **No se toca el frontend.** Ninguna pantalla cambia, así que no hay `§Frontend` que proponer.
11. **El proyecto no tiene `capabilities/`:** `booking-reminders` es la primera; lo existente (listar reservas con paginación) queda sin capacidad y no se retro-documenta aquí.

### Decisiones tomadas con el dev-lead

- Carril feature, modo full, perfil `delegate`, entera sin partir — «carril feature, perfil delegate, entera, sin partir. Modo full.»
- Redactar la spec sin la ronda de preguntas del brainstorming — «Sí, sáltate las preguntas y empieza ya.»

## Intent

Hoy las reservas existen en la base de datos y se listan, pero nadie recibe ningún aviso: quien reservó una sala se entera de que le toca cuando mira la lista, o cuando ya ha empezado. Se quiere que, poco antes de que empiece, la persona que tiene la reserva reciba un correo que le diga qué sala y a qué hora, una sola vez.

## Scope

- Entra: columnas `OwnerEmail` y `ReminderSentAt` en `Bookings` con su migración; servicio en segundo plano que barre cada minuto y envía el aviso; envío por SMTP configurable; tests de los escenarios; una nota en `docs/api.md` de que `OwnerEmail` no se expone.
- No entra: alta o edición de reservas (no hay `POST`) ni forma de rellenar `OwnerEmail`; activar, desactivar o elegir la antelación por reserva; más de un aviso por reserva; avisos de cancelación o de cambio; plantillas HTML; varias instancias de la API sin duplicados; zonas horarias; cambios en el frontend.

## Approach

Un barrido periódico selecciona las reservas con dirección, sin marca de envío y con el inicio dentro de la ventana `[ahora, ahora + antelación]`, envía el correo de cada una y escribe `ReminderSentAt` al confirmar el envío. La selección, el envío y la marca van en piezas separadas para poder probar cada THEN con un reloj y un remitente falsos, sin SMTP real. El cómo concreto (tipos, DI, migración) es de `plan.md`.

## Delta de comportamiento

### Capacidad: `booking-reminders`

**ADDED — Aviso por correo antes del inicio**
- GIVEN la reserva de «Sala Norte» con `OwnerEmail` `ana@example.com`, inicio 2026-10-12 14:00 y sin aviso enviado, antelación 60 min
- WHEN el barrido corre a las 13:00
- THEN se envía un correo a `ana@example.com` con asunto `Recordatorio: Sala Norte a las 14:00` y cuerpo con la sala, el inicio (14:00) y el fin
- AND la reserva queda con `ReminderSentAt` = 13:00

**ADDED — Un solo aviso por reserva**
- GIVEN la misma reserva con `ReminderSentAt` = 13:00
- WHEN el barrido corre a las 13:01, 13:30 y 14:00
- THEN no se envía ningún otro correo

**ADDED — Antes de la ventana no hay aviso**
- GIVEN la reserva de «Sala Norte» a las 14:00, antelación 60 min, sin aviso
- WHEN el barrido corre a las 12:59
- THEN no se envía correo y `ReminderSentAt` sigue vacío

**ADDED — Reserva creada con menos margen que la antelación**
- GIVEN una reserva de «Sala Sur» con `OwnerEmail` `luis@example.com`, inicio 14:00, que existe desde las 13:40
- WHEN el barrido corre a las 13:41
- THEN se envía el correo a `luis@example.com` con asunto `Recordatorio: Sala Sur a las 14:00`

**ADDED — Sin dirección no hay aviso**
- GIVEN una reserva de «Sala Norte» a las 14:00 con `OwnerEmail` vacío
- WHEN el barrido corre a las 13:30
- THEN no se envía correo y `ReminderSentAt` sigue vacío

**ADDED — Una reserva que ya empezó no se avisa**
- GIVEN una reserva de «Sala Norte» a las 14:00 con dirección y sin aviso, y la API parada de 12:50 a 14:05
- WHEN el barrido corre a las 14:05
- THEN no se envía correo

**ADDED — Un envío fallido se reintenta dentro de la ventana**
- GIVEN la reserva de «Sala Norte» a las 14:00 con `OwnerEmail` `ana@example.com` y el servidor SMTP sin responder a las 13:00
- WHEN el barrido corre a las 13:00 y de nuevo a las 13:01 con el SMTP ya disponible
- THEN a las 13:00 `ReminderSentAt` queda vacío, y a las 13:01 se envía el correo y se marca
- AND si el SMTP no responde hasta las 14:00, ese aviso no se envía nunca

**ADDED — La dirección no sale por la API**
- GIVEN una reserva de «Sala Norte» con `OwnerEmail` `ana@example.com`
- WHEN se llama a `GET /bookings`
- THEN la respuesta incluye `id`, `room`, `start`, `end` y `owner` como hasta ahora y ningún campo con `ana@example.com`

**Reglas de la capacidad**
- **Dónde viven los datos**: `Bookings.OwnerEmail` (nullable) y `Bookings.ReminderSentAt` (nullable), en la base de datos de reservas.
- **Idioma de los nombres**: texto del correo en castellano; columnas y claves de configuración en inglés.
- **Límites**: un aviso por reserva; antelación 60 min por defecto, en `Reminders:LeadMinutes`; barrido cada 60 s.
- **Avisos**: el correo descrito en «Aviso por correo antes del inicio»; sin aviso de fallo al usuario.
- **Regla ante conflicto**: no aplica.

## Enmiendas

- Ninguna.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
