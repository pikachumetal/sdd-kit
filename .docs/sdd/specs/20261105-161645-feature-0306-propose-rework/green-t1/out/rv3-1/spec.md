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

- Nuevas: `bookings` — comportamiento de `anular` (el proyecto no tiene `capabilities/` y nada de reservas está escrito aún): solo el responsable de sala anula, sobre reservas de cualquiera, y se guarda quién anuló.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED, reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular`) · tamaño: ~60 líneas en 3 ficheros
- Dominio: que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica: que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. `bookings` es capacidad nueva (no existe `capabilities/`; `capability merge` rechazaba el `MODIFIED`): el delta es `ADDED` y solo cubre `anular`.
3. `anuladas` no existe hoy en `src/app.js`: es un comando nuevo, con salida `<sala> <día> — anulada por <rol>`, sin salida actual que romper.
4. Sin `--como`, `anular` responde como con `--como cliente` (lo más restrictivo). Es mi suposición.
5. Textos literales míos: `solo el responsable de sala puede anular` y `anulada por responsable`.
6. Las reservas no tienen dueño en el código: el GIVEN no depende de «de Ana», lo quito.
7. `sdd capability merge` sobre una copia en temp: `bookings.md: añadido «Anular una reserva»` (exit 0); el `capabilities/` del repo no cambia.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular <sala> <día>` sin `--como` deja de anular | `src/app.js` (`run`), roadmap 0011, `PRODUCT.md` (Anulación) | delta `ADDED` (último AND) y decisión 4 |

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no.

## Scope

- Entra: `anular` con `--como`, y quién anuló en el listado `anuladas`.
- No entra: `cancelar`.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Anular una reserva**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND con `--como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND `anuladas` lista `Norte lun — anulada por responsable`
- AND `anular Norte lun` sin `--como` responde `solo el responsable de sala puede anular` y la reserva sigue activa

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
