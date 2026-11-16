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
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | no cumple tal como se definió | Media por llamada de 0,065 a 0,095 ms en 12 repeticiones de 2.000 llamadas (1,3× a 1,9× el umbral). p99 de 0,19 a 0,32 ms. | `evidencia-libres-1000.txt` |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed`, más la reserva inicial del molde (1.001 en total). Node v26.10.0.

| Repetición | Tiempo (media por llamada) | Recurso acumulado (heapUsed) |
| --- | --- | --- |
| 1 | 0,0951 ms | 4,43 MB |
| 2 | 0,0870 ms | 4,43 MB |
| 3 | 0,0777 ms | 4,43 MB |
| 4 | 0,0720 ms | 4,43 MB |
| 5 | 0,0731 ms | 5,07 MB |
| 6 | 0,0777 ms | 4,44 MB |
| 7 | 0,0721 ms | 4,44 MB |
| 8 | 0,0711 ms | 4,47 MB |
| 9 | 0,0706 ms | 4,47 MB |
| 10 | 0,0674 ms | 4,47 MB |
| 11 | 0,0720 ms | 4,47 MB |
| 12 | 0,0651 ms | 4,47 MB |

Ninguna repetición cumple el umbral. El tiempo baja un poco tras el calentamiento y se estabiliza en torno a 0,07 ms. La memoria no crece (4,43 → 4,47 MB tras `gc`; el 5,07 de la repetición 5 no se repite).

Sobre la causa: `freeRooms` hace `bookings.slice().sort(...)` y descarta el resultado, así que cada llamada ordena una copia de las 1.001 reservas. Una copia de la lógica sin esa línea, medida fuera de `src/` con las mismas reservas, da 0,00007 a 0,0003 ms por llamada (`evidencia-libres-sin-sort.txt`). Es una pista de causa, no una medida de `libres`: la copia no es el código de producción.

Límite de la medida: con las reservas repartidas entre `Norte` y `Sur`, `some` corta en cuanto encuentra una activa de cada sala, así que el filtro es optimista. El `sort` es igual con cualquier reparto. No se ha medido un recorrido completo del filtro (sala libre en una franja con 1.000 reservas de otra sala).

## 4. Recomendación

- **Elegida**: no abrir una caché; quitar antes el `sort` descartado de `freeRooms` y volver a medir con esta misma carga · **Por qué**: O1 `no cumple tal como se definió` (0,065 a 0,095 ms frente a 0,05 ms), y la copia sin `sort` queda unas 300 veces por debajo del umbral (`evidencia-libres-sin-sort.txt`). La memoria no crece, así que no hay fuga que justifique una caché. Hasta que esa remedición cumpla O1, `libres` no está listo para toda la oficina.
- **Descartadas**: añadir una caché de `libres` ahora (añade invalidación al cancelar y anular, para un coste que parece venir de una línea inútil); abrir `libres` a la oficina sin cambios (O1 no cumple).

## 5. Lo que sale

- Quitar `bookings.slice().sort(...)` de `freeRooms` en `src/app.js` y repetir la medida con `seed` de 1.000 reservas → fila nueva en el roadmap (a abrir con `sdd-roadmap`; este spike no deja código de producción).
