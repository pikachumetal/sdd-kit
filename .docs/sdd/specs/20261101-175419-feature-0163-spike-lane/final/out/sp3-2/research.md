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
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | cumple | 0,0148–0,0214 ms por llamada en las 10 repeticiones (1.000 llamadas cada una, en caliente tras 200 de calentamiento); la peor, 0,0214 ms, es el 43 % del umbral | `libres-1000-salida.txt` (script: `medir-libres.mjs`) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed` (más la reserva de partida de `src/app.js`, 1.001 en total). Todas en `Norte`, de modo que `Sur` recorre las 1.000 sin cortocircuitar: es la peor distribución dentro de la franja, y la spec no fija otra.

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,0214 ms | heap 4,83 MB · rss 82,07 MB |
| 2 | 0,0206 ms | heap 5,39 MB · rss 82,10 MB |
| 3 | 0,0210 ms | heap 5,75 MB · rss 84,13 MB |
| 4 | 0,0204 ms | heap 5,01 MB · rss 84,13 MB |
| 5 | 0,0200 ms | heap 6,23 MB · rss 84,13 MB |
| 6 | 0,0202 ms | heap 5,49 MB · rss 84,16 MB |
| 7 | 0,0202 ms | heap 4,78 MB · rss 84,24 MB |
| 8 | 0,0200 ms | heap 6,02 MB · rss 84,25 MB |
| 9 | 0,0171 ms | heap 5,10 MB · rss 84,23 MB |
| 10 | 0,0148 ms | heap 6,04 MB · rss 84,20 MB |

El tiempo no crece. El heap oscila entre 4,8 y 6,2 MB (recolector) sin tendencia; el rss sube ~2 MB entre la 2.ª y la 3.ª repetición y se queda en 84 MB. No hay recurso creciendo. Una sola máquina y un solo proceso; no se midió el arranque en frío.

## 4. Recomendación

- **Elegida**: no añadir caché a `libres` antes de abrirlo a la oficina · **Por qué**: O1 cumple con margen (≈2,3× bajo el umbral en el peor caso) y la repetición 1-10 no muestra degradación ni recurso creciendo.
- **Descartadas**: caché de resultados por franja — no hace falta con estas cifras y añadiría invalidación al reservar/cancelar/anular.

## 5. Lo que sale

- `freeRooms` hace `bookings.slice().sort(...)` y descarta el resultado: es trabajo inútil, O(n log n) por llamada, que la medida no muestra como problema pero que se puede quitar → fila del roadmap por abrir (arreglo trivial, fuera de este spike, que no deja código de producción)
