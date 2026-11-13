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
- Nuevas: `bookings` — anular una reserva de otra persona exige ser responsable de la sala (el comportamiento de hoy vive solo en `src/app.js`: no hay `capabilities/`).

## Decisiones que he tomado yo — valida estas

1. Capacidad nueva `room-managers`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`).
2. Quien ejecuta el comando se identifica con `--como <nombre>`.
3. `bookings` entra como capacidad nueva con un `ADDED`, no como `MODIFIED`: hoy no existe `capabilities/bookings.md` y `sdd capability merge` sobre una copia rechazaba el `MODIFIED` («`bookings` no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»»). Cambia de verdad el `anular` de `src/app.js`, que hoy anula sin preguntar quién.

### Pasada de coherencia

- Corregido: `bookings` pasa de `MODIFIED` a `ADDED` (arriba). Se vuelve a pasar el merge en copia tras la corrección, antes del gate.
- Hallazgo del código, sin decidir: `bookings` en `src/app.js` no guarda propietario de la reserva y `voidBooking` no recibe quién anula; el GIVEN «reserva de Pedro» exige ese dato. Va a los revisores.
- `anular` ya existe y no tiene tests (`git grep` fuera de specs: solo `src/app.js:31`); PRODUCT.md ya define «Anulación» como cosa del responsable.
- `sin medir`: nada que contar; no hay recuento que la spec fije.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular las reservas de otras personas.

## Scope

- Entra: `anular <sala> <día> --como <nombre>`; `data/managers.json`.
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

**ADDED — Anular una reserva**
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
