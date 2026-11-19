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

🦆 Hoy `anular` lo puede usar cualquiera sobre cualquier reserva. Con esta feature, `anular Norte lun --como responsable` anula y `--como cliente` lo rechaza con un aviso y deja la reserva activa. Además aparece un comando nuevo, `anuladas`, que lista cada anulada con quién la anuló. El rol sale de `--como` porque la app no tiene usuarios. `cancelar` no se toca.

## Capacidades

- Nuevas: `bookings` — anular una reserva: solo el responsable de sala, sobre reservas de cualquiera, guardando quién anuló, y el listado `anuladas`.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores (pendiente de tu confirmación para paralelizar) — señales: capacidad nueva (`bookings`), reglas de permiso, datos (quién anula), contrato público (la salida de `anular`, comando nuevo `anuladas`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): si el cliente queda sin poder anular y qué falta decir de lo que NO puede hacer (p. ej. `--como` ausente o con otro valor) (señal: permiso)
- Técnica (sonnet): si `anular` sin `--como` y la salida de `anular` siguen definidos, y si `anuladas` necesita guardar quién anuló en `bookings` (señal: contrato público + datos)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. `bookings` es capacidad nueva: el repo no tiene `capabilities/`, así que no hay requisito vigente que modificar; `anular` existe en `src/app.js` pero sin spec.
3. `anuladas` no existe hoy en `src/app.js`: es un comando nuevo, no un cambio de formato (quito el «no romper el formato actual» del dimensionado de la review).
- Fusión del delta en una copia (`sdd capability merge`): `bookings.md: añadido «Anular una reserva»`, `bookings.md: añadido «Listar las anuladas»`; `capabilities/` del repo sin tocar. Retiradas: nada; id 0011 solo aparece en `ROADMAP.md` (lo cierra archive).
- Política de modelos: dos revisores en paralelo, dominio opus y técnica sonnet (~100k tokens cada uno) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no.

## Scope

- Entra: `anular` con `--como` y el listado `anuladas`, en `src/app.js` (`voidBooking` y `run`, único sitio que implementa `anular`), con su test en `test/anular.test.js`.
- No entra: `cancelar`.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva de Norte del lun, de Ana
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND con `--como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue activa

#### ADDED — Listar las anuladas

- GIVEN la reserva de Norte del lun anulada con `--como responsable`
- WHEN `anuladas`
- THEN lista `Norte lun — anulada por responsable`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
