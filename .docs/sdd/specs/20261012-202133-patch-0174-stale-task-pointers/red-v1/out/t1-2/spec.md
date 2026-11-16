---
id: 20261008-110000-feature-0011-void-others
feature: 0011
title: Anular reservas de otros
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Anular reservas de otros

## Capacidades

- Nuevas: `room-managers` — quién es responsable de cada sala.
- Modificadas: `bookings` — anular una reserva de otra persona exige ser responsable de la sala.

## Decisiones que he tomado yo — valida estas

1. Capacidad nueva `room-managers`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`). **Abierta, bloquea la aprobación:** el roadmap tiene la 0009 «Responsables de sala» pendiente (y `PRODUCT.md` dice que quién es cada responsable «lo define la 0009»). Esta spec define lo mismo. Hay que decidir: (A) la 0011 espera a la 0009 y solo consume `room-managers` (recomendada: una sola dueña de la capacidad y del formato del fichero), o (B) la 0011 la define y la 0009 se recorta a «qué más puede hacer el responsable».
2. Quien ejecuta el comando se identifica con `--como <nombre>`. Es una declaración, no una autenticación: cualquiera puede escribir `--como Ana`. Vale aquí porque la misión dice que la usa una sola persona.
3. Sin `--como`, `anular` no anula: responde «indica quién anula con --como <nombre>».
4. Una sala que no figura en `data/managers.json` no tiene responsable y nadie la anula: responde «Sur no tiene responsable».
5. `anular` exige ser responsable aunque la reserva sea tuya: las reservas hoy no guardan quién las hizo, y la propia se retira con `cancelar` (la «Cancelación» de `PRODUCT.md`). La «reserva de Pedro» de los escenarios es solo el ejemplo.
6. `bookings` no existe aún en `capabilities/`: trato el escenario como `MODIFIED` del comportamiento actual de `anular` (hoy sin comprobación) y el cierre de la feature crea `capabilities/bookings.md`.

### Pasada de coherencia (lo que he corregido)

- Scope: faltaban `src/app.js` (`voidBooking`, `run`) y el test nuevo; los he añadido.
- Escenarios: añadidos los de sin `--como` y sala sin responsable (decisiones 3 y 4); sin ellos esos valores no tenían THEN.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular las reservas de otras personas.

## Scope

- Entra: `anular <sala> <día> --como <nombre>` (`voidBooking` y `run` en `src/app.js`); `data/managers.json`; `test/void.test.js`.
- No entra: cancelar la propia reserva, que sigue igual.

## Approach

`anular` lee `data/managers.json` y rechaza a quien no es responsable de la sala.

## Delta de comportamiento

### Capacidad: `room-managers`

**ADDED — Cada sala tiene un responsable**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN se pregunta el responsable de Norte
- THEN es Ana

### Capacidad: `bookings`

**MODIFIED — Anular una reserva**
- GIVEN la reserva de Norte del lunes, de Pedro
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND `anular Norte lun --como Ana` responde «anulada Norte lun»

**ADDED — Anular exige decir quién anula**
- GIVEN la reserva de Norte del lunes
- WHEN `anular Norte lun` (sin `--como`)
- THEN responde «indica quién anula con --como <nombre>» y la reserva sigue activa

**ADDED — Una sala sin responsable no se anula**
- GIVEN `data/managers.json` sin entrada para Sur y una reserva de Sur del martes
- WHEN `anular Sur mar --como Luis`
- THEN responde «Sur no tiene responsable» y la reserva sigue activa

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
