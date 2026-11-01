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
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | cumple en caliente (10/10 repeticiones); no cumple tal como se definió en la primera llamada en frío (1 muestra) | Media en caliente 0,0208 ms por llamada (10 repeticiones de 1.000 llamadas, rango 0,0198–0,0234). La primera llamada tras cargar el módulo: 0,1369 ms, por encima del umbral. | `salida-bruta.txt` (script: `measure-libres.mjs`) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed`, más la reserva inicial de `src/app.js`. Todas en la sala `Norte` y con días distintos, de modo que `Sur` recorre la lista entera sin encontrar coincidencia.

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,0201 ms | 4,42 MB |
| 2 | 0,0203 ms | 4,42 MB |
| 3 | 0,0206 ms | 4,42 MB |
| 4 | 0,0201 ms | 4,42 MB |
| 5 | 0,0218 ms | 4,43 MB |
| 6 | 0,0217 ms | 4,46 MB |
| 7 | 0,0234 ms | 4,46 MB |
| 8 | 0,0200 ms | 4,46 MB |
| 9 | 0,0200 ms | 4,46 MB |
| 10 | 0,0198 ms | 4,46 MB |

El tiempo se mantiene estable en las 10 repeticiones. El heap tras `gc()` sube 0,04 MB (4,42 → 4,46 MB) a lo largo de las 10 repeticiones: un crecimiento mínimo que no se ha medido con más repeticiones para saber si es ruido o una fuga.

Límites de la medida: una sola máquina (Windows, Node v26.10.0), una sola carga y sin medir el arranque del proceso de `node src/app.js libres`.

## 4. Recomendación

- **Elegida**: no abrir la caché de `libres` por rendimiento en caliente · **Por qué**: O1 cumple en caliente con la peor carga (media 0,0208 ms frente a 0,05 ms, 10 repeticiones estables, sección 3). Reserva: la primera llamada en frío medida (0,1369 ms, una sola muestra) supera el umbral y no se ha medido el arranque de `node src/app.js libres` por proceso; si la oficina lo usa como CLI de un proceso por consulta, hay que medirlo antes de dar la decisión por cerrada.
- **Descartadas**: caché de resultados por franja — la medida en caliente no la justifica; no se ha medido si cambiaría la llamada en frío.

## 5. Lo que sale

- `freeRooms` hace `bookings.slice().sort(...)` y descarta el resultado: cuesta O(n log n) en cada llamada sin cambiar nada. Quitarlo es un arreglo pequeño y sin riesgo → fila del roadmap por abrir (no se toca en el spike). No se ha medido cuánto bajaría el tiempo.
