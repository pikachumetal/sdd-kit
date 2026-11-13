---
id: 20261015-110000-feature-0032-free-rooms-fast
title: Research — ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-12
timeboxed: 2h
---

# Research — ¿aguanta `libres` 1.000 reservas?

## 1. Pregunta a resolver

¿Aguanta `libres` 1.000 reservas?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | no cumple tal como se definió | Con la carga de la spec, 0,0591–0,0628 ms por llamada en 12 repeticiones de 2.000 llamadas (típico 0,060 ms, ~20 % sobre el umbral). Con las 1.000 reservas en otras salas (el `some` recorre todo): 0,0633–0,0824 ms. | `medicion-libres.txt`; script `medir-libres.mjs` |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed`, más la reserva inicial de `Norte`; salida de `libres`: vacía. Cada repetición son 2.000 llamadas, con GC forzado antes de leer el heap.

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,0628 ms | heap 4,41 MiB |
| 2 | 0,0611 ms | heap 4,41 MiB |
| 3 | 0,0605 ms | heap 4,41 MiB |
| 4 | 0,0605 ms | heap 4,41 MiB |
| 5 | 0,0599 ms | heap 4,41 MiB |
| 6 | 0,0600 ms | heap 4,41 MiB |
| 7 | 0,0603 ms | heap 4,41 MiB |
| 8 | 0,0598 ms | heap 4,41 MiB |
| 9 | 0,0596 ms | heap 4,42 MiB |
| 10 | 0,0591 ms | heap 4,42 MiB |
| 11 | 0,0597 ms | heap 4,42 MiB |
| 12 | 0,0600 ms | heap 4,42 MiB |

El tiempo no crece con las repeticiones y el heap queda plano (+0,01 MiB).

Dato que explica la cifra: `freeRooms` hace `bookings.slice().sort(...)` y descarta el resultado (`src/app.js`). La misma consulta sin ese `sort` tarda 0,0001–0,0002 ms con la carga de la spec y 0,002–0,012 ms con la variante de otras salas (referencia calculada en el mismo script, sin tocar `src/`). Una sola medida por variante, en una máquina; no se ha medido el código de producción sin el `sort`.

## 4. Recomendación

- **Elegida**: no abrir una caché; quitar antes el `sort` descartado de `freeRooms` y volver a medir · **Por qué**: O1 no cumple (0,060 ms > 0,05 ms), pero la referencia sin `sort` queda por debajo del umbral con ambas cargas (0,0002 ms y hasta 0,012 ms); el coste que se ve es ese `sort`, no el recorrido.
- **Descartadas**: caché de `libres` — añade invalidación con `cancelar` y `anular`, y la referencia sin `sort` ya baja del umbral sin ella · Subir el umbral a 0,07 ms — la spec fijó 0,05 ms y no es decisión del spike.

## 5. Lo que sale

- Quitar el `sort` descartado de `freeRooms` y repetir esta medida sobre el código real → fila de roadmap por abrir (patch)
