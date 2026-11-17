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

1. Capacidad nueva `room-managers`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`).
2. Quien ejecuta el comando se identifica con `--como <nombre>`.
3. Pasada de coherencia: añado al Scope los ficheros que implementan el cambio (`src/app.js`: `voidBooking` y `run`; `test/`), que la spec no nombraba.

### Huecos que la pasada de coherencia ha encontrado y no cierro yo

- **Solape con la 0009.** El roadmap y `PRODUCT.md` dicen que quién es responsable de cada sala lo define la 0009 (⏳, anterior a esta). Esta spec crea `room-managers` y `data/managers.json` por su cuenta: o se hace tras la 0009 y consume lo que ella defina, o se parte y la 0011 absorbe ese trozo.
- **Las reservas no tienen dueño.** En `src/app.js` una reserva es `{ room, day, slot, status }`: no hay «de Pedro». El escenario de `bookings` y «reservas de otras personas» exigen un dueño que hoy no existe ni se puede dar de alta (`reservar` no recibe `--como`).
- **Qué pasa con el propio dueño.** El Intent solo habla de reservas de *otras* personas; la spec no dice si el dueño puede `anular` la suya, ni qué responde `anular` sin `--como`, con una sala que no está en `managers.json` o con el fichero ausente.
- **`MODIFIED` sin capacidad previa.** No existe `capabilities/`: la regla actual de anular («cualquiera anula cualquier reserva») no está escrita en ningún sitio, así que el `MODIFIED` de `bookings` no tiene requisito que modificar.
- **Aprobador.** El frontmatter pone a «Laura» como dev-lead; la misión dice que solo trabaja una persona y el autor de git es otra. Confirma quién aprueba.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular las reservas de otras personas.

## Scope

- Entra: `anular <sala> <día> --como <nombre>`; `data/managers.json`; `src/app.js` (`voidBooking`, `run`) y sus tests en `test/`.
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

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
