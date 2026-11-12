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
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | no cumple tal como se definió | 0,1122–0,2961 ms por llamada en las 10 repeticiones (la mejor, 0,1122 ms, es más del doble del umbral). Causa a la vista: `freeRooms` ordena una copia de todas las reservas (`bookings.slice().sort(...)`) y descarta el resultado. Una copia de diagnóstico sin ese `sort` mide 0,00007–0,005 ms. | `evidence-libres-raw.txt` (script: `measure-libres.mjs`); diagnóstico: `evidence-libres-sin-sort-raw.txt` (script: `measure-libres-sin-sort.mjs`) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed`, más la reserva inicial de `src/app.js` (1.001 en total), repartidas entre `Norte` y `Sur`. Cada repetición son 2.000 llamadas a `run('libres', [franja])` y se anota el tiempo medio por llamada (Node v26.10.0).

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,2351 ms | 5,26 MB |
| 2 | 0,1875 ms | 5,02 MB |
| 3 | 0,2961 ms | 5,56 MB |
| 4 | 0,2025 ms | 6,12 MB |
| 5 | 0,1749 ms | 4,73 MB |
| 6 | 0,1474 ms | 5,31 MB |
| 7 | 0,1149 ms | 5,34 MB |
| 8 | 0,1122 ms | 5,04 MB |
| 9 | 0,1133 ms | 4,77 MB |
| 10 | 0,1131 ms | 6,43 MB |

El `heapUsed` oscila entre 4,7 y 6,4 MB sin crecer de forma sostenida. Los tiempos son de una máquina y de un proceso; no hay medida con una persona ni en la oficina.

## 4. Recomendación

- **Elegida**: quitar el `sort` que `freeRooms` descarta, y no montar una caché todavía · **Por qué**: O1 no cumple tal como se definió (0,1122–0,2961 ms frente a 0,05 ms) y la copia de diagnóstico sin el `sort` queda muy por debajo del umbral (0,00007–0,005 ms). Es una medida de diagnóstico sobre una copia, no sobre `src/app.js` arreglado: hay que volver a medirlo tras el arreglo antes de dar O1 por cumplido.
- **Descartadas**: caché de `libres` — la medida apunta a un coste evitable sin ella; el aguante no muestra crecimiento de memoria que pida acotar nada.

## 5. Lo que sale

- Quitar `bookings.slice().sort(...)` de `freeRooms` en `src/app.js` y repetir `measure-libres.mjs` → fila del roadmap por abrir (la abre `sdd-propose`, no este spike).
