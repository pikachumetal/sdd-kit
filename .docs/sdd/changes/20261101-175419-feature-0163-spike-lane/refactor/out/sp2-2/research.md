---
id: 20261015-110000-feature-0031-free-rooms-load
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
| O1 — `libres` con 1.000 reservas responde en < 50 ms | cumple | Con la carga de la spec (1.000 reservas activas en la franja `10:00-12:00`, cargadas con `seed`): primera llamada en frío 0,038 ms; mediana 0,0001-0,0002 ms por llamada; máximo de una llamada 0,377 ms. Es la llamada `run('libres', [franja])` dentro del proceso; no incluye el arranque de `node`. | [evidencia-libres.txt](./evidencia-libres.txt), script [medir-libres.mjs](./medir-libres.mjs) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja, cargadas con `seed` (la peor, confirmada por el dev-lead).

10 repeticiones seguidas de 1.000 llamadas a `libres` cada una, en un mismo proceso. «Recurso acumulado» es `heapUsed`.

| Repetición | Tiempo (mediana / máx por llamada) | Recurso acumulado (heapUsed) |
| --- | --- | --- |
| 1 | 0,0002 / 0,3591 ms | 4,84 MB |
| 2 | 0,0002 / 0,3770 ms | 4,80 MB |
| 3 | 0,0002 / 0,0010 ms | 5,34 MB |
| 4 | 0,0002 / 0,1010 ms | 4,96 MB |
| 5 | 0,0002 / 0,0735 ms | 5,52 MB |
| 6 | 0,0002 / 0,1273 ms | 5,12 MB |
| 7 | 0,0002 / 0,0091 ms | 4,72 MB |
| 8 | 0,0001 / 0,0011 ms | 5,25 MB |
| 9 | 0,0001 / 0,1214 ms | 4,83 MB |
| 10 | 0,0001 / 0,0008 ms | 5,36 MB |

El tiempo no sube con las repeticiones y el `heapUsed` oscila entre 4,7 y 5,5 MB sin crecer.

Variante de control, fuera de la carga de la spec: las 1.000 reservas en una sala que no es ninguna de las dos (`Otra`), de modo que `Sur` se comprueba recorriendo todas. Es el recorrido más largo que hace el código (`bookings.some` sin cortocircuito): mediana 0,006 ms, máximo 0,403 ms, primera llamada 0,140 ms. Sigue muy por debajo de 50 ms (misma evidencia, variante `sin-coincidencia`).

## 4. Recomendación

- **Elegida**: no añadir caché a `libres` antes de abrirlo a toda la oficina · **Por qué**: O1 cumple con un margen de más de 100 veces sobre el umbral en la peor llamada (máximo 0,4 ms frente a 50 ms), sin crecimiento de tiempo ni de memoria en 10 repeticiones.
- **Descartadas**: caché de `libres` — no hay tiempo que ahorrar con esta carga y añadiría invalidación al cancelar, anular y reservar.

Límites de la medida: es una medida en proceso, de una sola máquina (Node v26.10.0), y mide la función, no el arranque de la CLI ni una persona esperando. El agente no la ha medido con una persona.

## 5. Lo que sale

- nada
