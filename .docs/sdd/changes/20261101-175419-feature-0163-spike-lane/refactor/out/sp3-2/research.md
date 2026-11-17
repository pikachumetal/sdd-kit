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
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | no cumple tal como se definió | Peor carga medida (1.000 activas en la franja, salas al azar): 0,068–0,085 ms por llamada en las 12 repeticiones (mediana 0,070). Con las salas alternadas, 0,061–0,069 ms. Solo con todas las reservas en una sala cumple (0,015–0,023 ms), pero no es la peor carga. | `evidencia-libres-aleatoria.txt`, `evidencia-libres-alternada.txt`, `evidencia-libres-una_sala.txt` |

Medida con `measure-libres.mjs`: `seed` carga 1.000 reservas activas de la franja `10:00-12:00` (más la que ya trae `app.js`) y cada repetición promedia 2.000 llamadas a `run('libres', [franja])` tras 500 de calentamiento. La carga de la spec no dice cómo se reparten las salas, y el reparto cambia la medida: el orden de las salas decide lo que cuesta el `sort` de `freeRooms`. Se midieron tres repartos y el objetivo se juzga con el peor.

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja, cargadas con `seed`; reparto al azar (la peor medida). 12 repeticiones seguidas de 2.000 llamadas.

| Repetición | Tiempo (ms por llamada) | Recurso acumulado (heapUsed, MB) |
| --- | --- | --- |
| 1 | 0,0713 | 4,82 |
| 2 | 0,0726 | 4,53 |
| 3 | 0,0852 | 5,98 |
| 4 | 0,0725 | 5,47 |
| 5 | 0,0699 | 4,51 |
| 6 | 0,0696 | 5,57 |
| 7 | 0,0720 | 6,35 |
| 8 | 0,0683 | 4,97 |
| 9 | 0,0679 | 4,71 |
| 10 | 0,0679 | 6,42 |
| 11 | 0,0693 | 6,12 |
| 12 | 0,0688 | 5,83 |

El tiempo no deriva con las repeticiones y el heap oscila entre 4,5 y 6,4 MB sin tendencia: no hay recurso creciendo. El problema es el nivel del tiempo, no el aguante.

## 4. Recomendación

- **Elegida**: no poner caché; quitar de `freeRooms` el `sort` cuyo resultado se descarta (`bookings.slice().sort(...)`, `src/app.js`) y volver a medir · **Por qué**: O1 no cumple (0,07 ms frente a 0,05 ms) y la réplica sin el `sort` baja de 0,0884 a 0,0001 ms por llamada (`evidencia-diagnostico-sort.txt`), así que el coste es ese `sort` y no la búsqueda.
- **Descartadas**: caché de `libres` — la réplica sin el `sort` ya responde en 0,0001 ms (`evidencia-diagnostico-sort.txt`), 500 veces por debajo del umbral, así que una caché no tiene nada que ganar; no se midió ninguna caché. Dejarlo como está — O1 no cumple.

La réplica del diagnóstico es una copia aislada de `freeRooms`, no `app.js` corregido: tras el arreglo hay que repetir la medida de O1 sobre `app.js`.

## 5. Lo que sale

- Quitar el `sort` descartado de `freeRooms` y repetir la medida de O1 con `measure-libres.mjs` → fila nueva del roadmap (pendiente de crear por quien cierre la feature)
