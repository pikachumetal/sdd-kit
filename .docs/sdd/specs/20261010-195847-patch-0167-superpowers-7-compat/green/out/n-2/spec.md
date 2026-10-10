---
id: 20261010-200343-feature-0011-aviso-correo-reserva
feature: 0011
title: Aviso por correo 24 h antes de la reserva
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

# Spec — Aviso por correo 24 h antes de la reserva

## Capacidades

- Nuevas: `booking-reminders` — el correo de aviso previo a una reserva confirmada.
- Nuevas: `bookings` — el estado de una reserva y su cancelación.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: pendiente de la respuesta del dev-lead (ver la pregunta previa a esta presentación).

1. **Hay que poder cancelar, y hoy no se puede.** La API solo lista reservas y no tienen estado: «confirmada» y «cancelar» no existen. Añado un estado (`Confirmed`/`Cancelled`) y `POST /bookings/{id}/cancel`. Sin ello la regla «si la cancela, no le llega» no se puede observar. Alternativa: que cancele otro sistema que escribe el estado en la BD; dime si es así y quito el endpoint.
2. **De dónde sale el correo del cliente.** Añado `OwnerEmail` a la reserva. Tampoco hay endpoint para crear reservas, así que no añado uno (No entra): quien las crea hoy tiene que rellenar ese campo.
3. **Las reservas ya existentes no avisan.** La migración las deja `Confirmed` y sin correo; sin dirección no hay aviso, y no es un error.
4. **El correo del cliente no sale en `GET /bookings`.** La lista la ve cualquiera que abra la aplicación; el estado sí sale, la dirección no.
5. **Mecanismo de envío (tu «elige tú»):** un proceso del propio backend que cada minuto busca reservas confirmadas a 24 h o menos del inicio y envía por SMTP. Servidor, puerto, usuario y remitente salen de configuración. Es una dependencia nueva (cliente SMTP). Sin configurar, no envía y lo registra en el log.
6. **Una reserva creada con menos de 24 h de antelación** recibe el aviso en la siguiente ejecución, no se queda sin él. Una reserva que ya empezó no recibe nada.
7. **Un solo aviso por reserva**, aunque se reprograme el proceso; si el envío falla, se reintenta en la siguiente ejecución hasta que empiece la reserva.
8. **Hora:** `Start` se guarda sin zona; lo trato como hora local del servidor y el correo la muestra tal cual, en `dd/MM/yyyy` y `HH:mm`.
9. **Cancelar después de recibir el aviso** no manda un segundo correo («reserva cancelada»): no entra.
10. **Contradicción con el roadmap:** la fila 0012 (filtrar por estado) figura ✅, pero en el código y en el changelog no hay estado ni filtro. Asumo que no existe; si 0012 trae un estado de reserva en otra rama, hay que alinear nombres antes de implementar.
11. **Nombres de capacidad** `booking-reminders` y `bookings` (slugs en inglés): las apruebas con la spec.

### Decisiones tomadas con el dev-lead

- Carril feature, modo full, perfil `delegate`, entera sin partir — «feature, delegate, entera, sin partir. Modo full.»
- Enunciado — «Quiero que al cliente le llegue un correo 24 horas antes de una reserva confirmada, con la fecha, la hora y la sala; si la cancela antes, que no le llegue. […] lo de cómo enviarlo me da igual, elige tú.»

## Intent

La gente olvida que reservó y las salas se quedan vacías. Hoy el sistema no manda ningún correo. Se quiere que cada cliente reciba un recordatorio 24 horas antes de su reserva confirmada, y que quien cancela a tiempo no lo reciba.

## Scope

- Entra: estado de la reserva y cancelación; correo del cliente en la reserva; proceso de avisos con envío SMTP; migración de datos; documentación en `docs/api.md`.
- No entra: crear reservas desde la API; mostrar o editar el correo en la interfaz; correo de cancelación; recordatorios distintos de 24 h; reintentos más allá del inicio de la reserva; plantillas configurables; cambios en el frontend.

## Approach

Un proceso periódico del backend selecciona las reservas confirmadas, con correo, sin aviso enviado y a 24 h o menos de empezar, y envía el correo por SMTP; al enviarlo, deja constancia en la reserva para no repetirlo. La cancelación cambia el estado y el proceso solo mira las confirmadas, de modo que la cancelación siempre gana al aviso pendiente.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Cancelar una reserva**
- GIVEN la reserva 12 de «Sala 3», 2026-10-15 10:00, estado `Confirmed`
- WHEN `POST /bookings/12/cancel`
- THEN responde 204 y `GET /bookings` muestra la reserva 12 con `status: "Cancelled"`

**ADDED — Cancelar una reserva inexistente**
- GIVEN no existe la reserva 999
- WHEN `POST /bookings/999/cancel`
- THEN responde 404

**ADDED — Cancelar es idempotente**
- GIVEN la reserva 12 ya está `Cancelled`
- WHEN `POST /bookings/12/cancel`
- THEN responde 204 y sigue `Cancelled`

**ADDED — La lista muestra el estado y no el correo**
- GIVEN la reserva 12 con `OwnerEmail` `ana@empresa.test`
- WHEN `GET /bookings`
- THEN la reserva 12 trae `status` y no trae ninguna propiedad con `ana@empresa.test`

**Reglas de la capacidad**
- **Dónde viven los datos**: tabla `Bookings`, columnas `Status` y `OwnerEmail`; las reservas existentes pasan a `Confirmed` con correo vacío.
- **Idioma de los nombres**: API y columnas en inglés, como las vigentes.
- **Límites**: no aplica.
- **Avisos**: no aplica.
- **Regla ante conflicto**: no aplica.

### Capacidad: `booking-reminders`

**ADDED — Aviso 24 h antes de la reserva**
- GIVEN la reserva confirmada de «Sala 3», 2026-10-15 10:00, con correo `ana@empresa.test`, y ahora son las 2026-10-14 10:00
- WHEN se ejecuta el proceso de avisos
- THEN `ana@empresa.test` recibe un correo con asunto «Recordatorio: Sala 3, 15/10/2026 a las 10:00» y cuerpo que contiene `Sala 3`, `15/10/2026` y `10:00`

**ADDED — Antes de las 24 h no se avisa**
- GIVEN la misma reserva y ahora son las 2026-10-14 09:59
- WHEN se ejecuta el proceso de avisos
- THEN no se envía ningún correo

**ADDED — Un solo aviso por reserva**
- GIVEN la misma reserva, con el aviso enviado a las 2026-10-14 10:00
- WHEN el proceso se ejecuta a las 2026-10-14 10:01 y a las 2026-10-15 09:00
- THEN no se envía ningún correo más

**ADDED — La reserva cancelada no avisa**
- GIVEN la misma reserva, cancelada a las 2026-10-14 09:00
- WHEN el proceso se ejecuta a las 2026-10-14 10:00
- THEN no se envía ningún correo

**ADDED — Reserva creada con menos de 24 h**
- GIVEN una reserva confirmada de «Sala 1», 2026-10-15 10:00, con correo `luis@empresa.test`, creada a las 2026-10-14 18:00
- WHEN se ejecuta el proceso de avisos a las 2026-10-14 18:01
- THEN `luis@empresa.test` recibe el correo con `Sala 1`, `15/10/2026` y `10:00`

**ADDED — La reserva ya empezada no avisa**
- GIVEN la reserva confirmada de «Sala 3», 2026-10-14 09:00, con correo `ana@empresa.test`, sin aviso enviado
- WHEN se ejecuta el proceso a las 2026-10-14 10:00
- THEN no se envía ningún correo

**ADDED — Reserva sin correo**
- GIVEN dos reservas confirmadas a 24 h: la de «Sala 2» sin correo y la de «Sala 3» con `ana@empresa.test`
- WHEN se ejecuta el proceso de avisos
- THEN no falla, no se envía nada para «Sala 2» y `ana@empresa.test` recibe el de «Sala 3»

**ADDED — Fallo de envío se reintenta**
- GIVEN la reserva de «Sala 3» a 24 h y el servidor de correo caído a las 10:00
- WHEN el proceso se ejecuta a las 10:00 y a las 10:01, con el servidor ya disponible
- THEN no hay aviso a las 10:00 y `ana@empresa.test` recibe un único correo a las 10:01

**Reglas de la capacidad**
- **Dónde viven los datos**: columna `ReminderSentAt` de la reserva; el servidor SMTP sale de la configuración del backend.
- **Idioma de los nombres**: texto del correo en castellano; fecha `dd/MM/yyyy`, hora `HH:mm`.
- **Límites**: un aviso por reserva; se envía cuando faltan 24 h o menos para el inicio y la reserva no ha empezado; el proceso se ejecuta cada minuto.
- **Avisos**: el único correo es el recordatorio; sin servidor configurado no se envía y se registra en el log.
- **Regla ante conflicto**: una reserva `Cancelled` nunca recibe aviso, aunque el aviso ya estuviera pendiente.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
