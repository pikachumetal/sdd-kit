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

1. ⚠️ **Choca con la 0009.** `docs/config.md` dice que quién es cada responsable y su fichero «los define la 0009», y la 0009 (ítem anterior del roadmap, pendiente) es «Responsables de sala». Esta spec define aquí `room-managers` y `data/managers.json`, y solo uno de los dos puede ser dueño. Pendiente de tu decisión (ver la pregunta del gate).
2. Capacidad nueva `room-managers`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`) — válido solo si ganas tú sobre la 0009.
3. Quien ejecuta el comando se identifica con `--como <nombre>`.
4. *(añadido en la pasada de coherencia)* Hoy las reservas no guardan a nombre de quién están (`src/app.js:3`), y el escenario «reserva de Pedro» lo necesita: las reservas ganan un campo con la persona. Dato persistente nuevo; la reserva semilla pasa a ser de Pedro.
5. *(añadido)* Quien anula su propia reserva con `anular` puede hacerlo aunque no sea responsable (el Intent solo restringe las reservas «de otras personas»).
6. *(añadido)* Sin `--como`, `anular` rechaza con «indica quién eres con --como»; una sala sin responsable en el fichero rechaza con «Sur no tiene responsable». Son textos míos, en castellano por la constitución.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular las reservas de otras personas.

## Scope

- Entra: `anular <sala> <día> --como <nombre>`; `data/managers.json`.
- Ficheros que lo implementan: `src/app.js` (`voidBooking`, línea 20, y su despacho en `run`, línea 31; el campo de persona en `bookings`, línea 3), `test/` (test nuevo de `anular`), `docs/config.md` (hoy dice que la 0009 define el fichero).
- No entra: cancelar la propia reserva (`cancelar`), que sigue igual.

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

**ADDED — Anular sin identificarse, sin responsable o la propia** *(decisiones 5 y 6)*
- GIVEN la reserva de Norte del lunes, de Pedro
- WHEN `anular Norte lun` (sin `--como`)
- THEN responde «indica quién eres con --como» y la reserva sigue activa
- AND con `data/managers.json` sin entrada para Norte, `anular Norte lun --como Ana` responde «Norte no tiene responsable» y la reserva sigue activa
- AND `anular Norte lun --como Pedro` responde «anulada Norte lun»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
