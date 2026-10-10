---
id: 20261010-200329-feature-0011-avisos-correo-reserva
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

- Nuevas: `booking-reminders` — el aviso por correo que recibe quien reservó poco antes de que empiece su reserva.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-reminders`), datos (dos columnas nuevas en `Booking` y migración), dependencia externa (servidor de correo), regla de visibilidad (el correo y el estado del aviso no salen por `GET /bookings`), área no explorada (el repo versionado no trae `Program.cs` ni `.csproj` del API) · tamaño: ~230 líneas en ~8 ficheros
- Dominio: si los escenarios 3, 4 y 6 cierran el ciclo de vida del aviso (qué pasa con una reserva creada tarde, ya empezada o con el envío fallido) y si el escenario 7 deja claro qué no debe ver quien lista reservas (señal: regla de visibilidad)
- Técnica: si la migración de `OwnerEmail` y `ReminderSentAt` es nullable sin romper las filas existentes, y si el servicio de fondo y el servidor de correo dejan el API arrancable sin configuración (señal: datos + dependencia externa)
- Mínimo razonable: solo técnica — deja sin mirar si el ciclo de vida del aviso tiene huecos de negocio (reserva tardía, ya empezada, fallo de envío)
```

1. **Capacidad nueva `booking-reminders`** — no existe `capabilities/`; el aviso es un comportamiento propio, no una modificación de la lista de reservas.
2. **El destinatario es un correo propio de la reserva (`OwnerEmail`, opcional)** — hoy `Owner` es texto libre y no hay dirección en ningún sitio. Una reserva sin `OwnerEmail` no recibe aviso y no da error.
3. **Hoy no hay endpoint que cree reservas** (solo `GET /bookings`), así que esta feature no añade forma de rellenar `OwnerEmail` desde la API ni desde la interfaz: queda fuera y habrá que pedirla como feature aparte. Las reservas existentes no reciben aviso hasta que alguien les ponga la dirección.
4. **Antelación fija de 30 minutos** — el enunciado no la fija; 30 min da tiempo de llegar a la sala. Es la regla `Límites` de la capacidad.
5. **Un solo aviso por reserva** — se marca `ReminderSentAt` al enviarlo; no hay segundo recordatorio.
6. **Revisión cada minuto, por un servicio de fondo del propio API** — sin cola ni proceso aparte; la precisión es de ±1 min. Es la opción más pequeña que cumple el enunciado.
7. **`Start` se interpreta como UTC** al compararlo con el reloj del servidor; la hora del asunto es la guardada, sin conversión. Si la aplicación guarda hora local, el aviso llegará desfasado: **valida este punto**.
8. **Reserva detectada tarde (menos de 30 min para empezar) recibe el aviso en el momento**, mientras no haya empezado; una ya empezada no recibe nada.
9. **Si el envío falla, no se marca como enviado y se reintenta en el ciclo siguiente** hasta que la reserva empiece; sin límite de reintentos ni alarma.
10. **El correo y el estado del aviso no salen por `GET /bookings`** — el endpoint devuelve hoy la entidad entera y las columnas nuevas la ensuciarían; el contrato de la lista no cambia.
11. **Texto en castellano** (constitución, art. 4): asunto «Recordatorio: <sala> a las <HH:mm>» y cuerpo de una línea con sala, hora de inicio y fin.
12. **Servidor de correo por configuración (`Reminders:Smtp…`)**; sin configurar, el servicio no envía avisos y el API sigue funcionando. El proveedor concreto (SMTP propio, servicio externo) lo decide el plan.
13. **Sin cambios en `frontend/`** — el aviso no se ve en la lista; `booking.ts` no cambia.
14. **Detalle del repo**: el repositorio versionado no trae `Program.cs`, `.csproj` ni migraciones previas del API; el plan lo comprobará antes de la primera task y, si faltan, lo dirá antes de tocar nada.

### Decisiones tomadas con el dev-lead

- Carril feature, modo full, perfil `delegate`, entera sin partir — «feature, perfil delegate, entera, sin partir. Modo full.» (2026-10-10)
- Escribir la spec sin más preguntas — «Sí, sáltate las preguntas y empieza ya.» (2026-10-10)

## Intent

Hoy la aplicación guarda reservas de salas pero no avisa a nadie: quien reserva depende de acordarse. Se quiere que, poco antes de que empiece su reserva, reciba un correo que le diga sala y hora, para que llegue a tiempo y la sala no quede ocupada sin uso.

## Scope

- Entra: columnas `OwnerEmail` y `ReminderSentAt` en `Booking` con su migración; servicio de fondo que envía el aviso; envío de correo configurable; que `GET /bookings` no las exponga; tests de cada escenario; nota en `docs/api.md` de que la lista no incluye esos datos.
- No entra: crear o editar reservas (no existe endpoint) y por tanto rellenar `OwnerEmail`; cambiar la antelación por usuario o por sala; más de un aviso; avisos de cancelación o cambio; aviso en la interfaz; cualquier cambio en `frontend/`.
- Ficheros previstos: `backend/src/Bookings.Api/Data/Booking.cs`, `Data/BookingsDb.cs`, `BookingsEndpoints.cs` (que la lista no exponga las columnas), nueva migración, nuevos ficheros del servicio y del envío, `Program.cs` (si existe), `backend/tests/Bookings.Tests/`, `docs/api.md`.

## Approach

Un servicio de fondo del API consulta cada minuto las reservas con `OwnerEmail`, sin aviso enviado y cuyo inicio cae dentro de los próximos 30 minutos, envía un correo a cada una y marca `ReminderSentAt` solo si el envío tuvo éxito. El envío se hace tras una interfaz pequeña para poder probarlo sin servidor de correo real. La lista de reservas proyecta solo los campos que ya expone.

## Delta de comportamiento

### Capacidad: `booking-reminders`

**ADDED — Aviso 30 minutos antes del inicio**
- GIVEN la reserva «Sala Mar» de ana@example.com, inicio 2026-11-03 10:00, sin aviso enviado
- WHEN el reloj del servidor llega a 2026-11-03 09:30 y corre la revisión
- THEN se envía un correo a ana@example.com con asunto «Recordatorio: Sala Mar a las 10:00»
- AND la reserva queda con el aviso marcado como enviado

**ADDED — Un solo aviso por reserva**
- GIVEN la reserva «Sala Mar» de ana@example.com, inicio 10:00, con el aviso ya enviado a las 09:30
- WHEN corren las revisiones de las 09:31 a las 09:59
- THEN no se envía ningún otro correo a ana@example.com

**ADDED — Reserva detectada con menos de 30 minutos**
- GIVEN la reserva «Sala Río» de luis@example.com, inicio 10:00, sin aviso, y el servicio la ve por primera vez a las 09:50
- WHEN corre la revisión de las 09:50
- THEN se envía en ese momento el correo con asunto «Recordatorio: Sala Río a las 10:00»

**ADDED — Reserva ya empezada no recibe aviso**
- GIVEN la reserva «Sala Río» de luis@example.com, inicio 10:00, sin aviso
- WHEN corre la revisión de las 10:05
- THEN no se envía ningún correo y la reserva sigue sin aviso marcado

**ADDED — Reserva sin correo**
- GIVEN la reserva «Sala Mar», inicio 10:00, sin `OwnerEmail`
- WHEN corre la revisión de las 09:30
- THEN no se envía ningún correo y la revisión sigue con las demás reservas sin error

**ADDED — Envío fallido se reintenta**
- GIVEN la reserva «Sala Mar» de ana@example.com, inicio 10:00, y el servidor de correo rechaza el envío de las 09:30
- WHEN corre la revisión de las 09:30 y, con el servidor ya disponible, la de las 09:31
- THEN la de las 09:30 no marca la reserva como avisada
- AND la de las 09:31 envía el correo y la marca como avisada

**ADDED — La lista de reservas no expone el aviso**
- GIVEN la reserva «Sala Mar» con `OwnerEmail` ana@example.com y aviso enviado
- WHEN se llama a `GET /bookings`
- THEN el JSON de «Sala Mar» contiene `id`, `room`, `start`, `end` y `owner`, y no contiene `ownerEmail` ni `reminderSentAt`

**Reglas de la capacidad**
- **Dónde viven los datos**: `OwnerEmail` y `ReminderSentAt` (ambas opcionales) en la tabla de reservas de la BD del API.
- **Idioma de los nombres**: texto del correo en castellano; columnas y campos en inglés, como el resto de `Booking`.
- **Límites**: aviso 30 minutos antes del inicio; revisión cada minuto; un aviso por reserva.
- **Avisos**: asunto «Recordatorio: <sala> a las <HH:mm>»; cuerpo con sala, hora de inicio y hora de fin.
- **Regla ante conflicto**: si el envío falla, la reserva no se marca y se reintenta en la revisión siguiente hasta que empiece.

## Enmiendas

- Ninguna.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
