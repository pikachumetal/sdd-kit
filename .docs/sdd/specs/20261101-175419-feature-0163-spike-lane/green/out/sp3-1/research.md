---
id: 20261015-110000-feature-0032-free-rooms-fast
title: Research — ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-01
timeboxed: 2h
---

# Research — ¿aguanta `libres` 1.000 reservas?

## 1. Pregunta a resolver

¿Aguanta `libres` 1.000 reservas?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | cumple | 12 repeticiones de 2.000 llamadas cada una: entre 0,0230 y 0,0322 ms por llamada, siempre por debajo de 0,05 ms. Medido por un agente en una sola máquina (Node v26.10.0, win32 x64) | [measurements.txt](./measurements.txt) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed` sobre la reserva inicial de `src/app.js`. Todas están en la sala Norte, de modo que para Sur `libres` recorre la lista entera. La spec no fija la distribución por sala; esta es la que obliga a más trabajo.

| Repetición | Tiempo (ms por llamada) | Recurso acumulado (heap, MB) |
| --- | --- | --- |
| 1 | 0,0237 | 5,97 |
| 2 | 0,0232 | 4,95 |
| 3 | 0,0242 | 4,92 |
| 4 | 0,0322 | 4,92 |
| 5 | 0,0283 | 4,93 |
| 6 | 0,0254 | 4,96 |
| 7 | 0,0230 | 4,96 |
| 8 | 0,0240 | 4,96 |
| 9 | 0,0268 | 4,96 |
| 10 | 0,0232 | 4,96 |
| 11 | 0,0236 | 4,96 |
| 12 | 0,0244 | 4,96 |

El tiempo no crece entre repeticiones y el heap se queda en torno a 4,96 MB tras la primera (que incluye la carga). El pico de 0,0322 ms (repetición 4) sigue por debajo del umbral, con un 36 % de margen.

## 4. Recomendación

- **Elegida**: no añadir caché a `libres` por ahora · **Por qué**: O1 cumple con margen en la peor carga confirmada y el tiempo no crece con las repeticiones.
- **Descartadas**: caché de `libres` — no hace falta con 1.000 reservas; solo cambiaría la respuesta si se midiera una carga mayor.
- **Sin medir**: nada de lo que pide la spec. Fuera de su alcance y sin medir: cargas por encima de 1.000 reservas, otras distribuciones por sala y otras máquinas.

## 5. Lo que sale

- Nada. `freeRooms` hace un `bookings.slice().sort(...)` cuyo resultado se descarta; es trabajo inútil en cada llamada y no cambia la respuesta. Se deja como observación, sin fila de roadmap, porque ninguna medida lo exige.
