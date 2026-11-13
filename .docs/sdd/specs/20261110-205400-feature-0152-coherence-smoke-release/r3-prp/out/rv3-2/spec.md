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

- Modificadas: `bookings` — `anular` lo puede usar solo el responsable de sala, sobre reservas de cualquiera, y guarda quién anuló.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED, reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): que `--como cliente` no pueda anular y que el THEN de «Anular una reserva» diga también qué no ve el cliente de `anuladas` (señal: permiso)
- Técnica (sonnet): que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no.

## Scope

- Entra: `anular` con `--como`, y quién anuló en el listado `anuladas`.
- No entra: `cancelar`.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Anular una reserva**
- GIVEN la reserva de Norte del lun, de Ana
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND con `--como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND `anuladas` lista `Norte lun — anulada por responsable`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
