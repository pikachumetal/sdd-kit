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

- Nueva: `bookings` — `anular` lo puede usar solo el responsable de sala, sobre reservas de cualquiera, y guarda quién anuló. El proyecto aún no tiene capacidades: se crea con este requisito.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), contrato público (la entrada y la salida de `anular`, y el comando nuevo `anuladas`), reglas de permiso (qué NO puede hacer el cliente), datos (quién anuló) · tamaño: ~40 líneas en 2 ficheros
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló, y si «responsable de sala» es uno por sala, como dice la fila 0011 del roadmap, o un rol general (señal: permiso)
- Técnica (sonnet): que `anular` sin `--como` y con un valor desconocido tenga un resultado definido, y que `anuladas` nazca sin romper la salida de `libres` ni de `cancelar` (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. Capacidad nueva `bookings` (el proyecto no tiene ninguna en `capabilities/`).
3. `anuladas` es un comando nuevo: hoy no existe, así que no hay formato previo que mantener. Formato propuesto: `<sala> <día> — anulada por <rol>`.
4. Quién anula se guarda como el rol (`responsable`), no como persona: sin usuarios no hay otro dato.
5. Enfoque: A, frente a B y C (ver Approach).
6. **Pendiente** — «responsable de cada sala» (roadmap): la spec trata a `responsable` como un rol general, sin vínculo con una sala concreta. Si debe ser uno por sala, cambia el delta.
7. **Pendiente** — `anular` sin `--como` o con otro valor: propongo tratarlo como `cliente` (rechaza). Hoy sin la opción anula; este cambio lo cierra.
8. **Pendiente** — las reservas no guardan quién las hizo; «anular las de otros» se cumple dejando que el responsable anule cualquiera. No se añade dueño.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no.

## Scope

- Entra: `anular` con `--como`, y quién anuló en el listado nuevo `anuladas`.
- No entra: `cancelar`, usuarios o dueños de reserva, y un responsable por sala.

## Approach

- **A (elegido)**: `--como` como parámetro de `anular`, igual que `--cada-semana` en `reservar`; la reserva guarda `voidedBy` al anular y `anuladas` lee de ahí. Es lo que ya hace la app y no necesita usuarios.
- B: variable de entorno con el rol. Más difícil de probar con `run(...)` y de ver en un comando.
- C: guardar el rol en la reserva al crearla. Exige dueños de reserva, fuera de alcance.

## Dónde se prueba

- Anular y `anuladas`: por `run('anular', …)` y `run('anuladas', [])`, en `test/anular.test.js`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Anular una reserva**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND con `--como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND sin `--como` responde lo mismo que con `cliente` (pendiente, ✋ 7)
- AND `anuladas` lista `Norte lun — anulada por responsable`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
