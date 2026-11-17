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
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | cumple | 0,0202–0,0252 ms por llamada en 15 repeticiones seguidas de 2.000 llamadas; la primera llamada, en frío, tardó 0,2094 ms | `evidence-o1.txt` (script: `measure.mjs`) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed`, más la reserva previa de `src/app.js`.

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,0208 ms | +2 KiB de heap tras gc |
| 2 | 0,0211 ms | +2 KiB |
| 3 | 0,0240 ms | +3 KiB |
| 4 | 0,0209 ms | +11 KiB |
| 5 | 0,0226 ms | +43 KiB |
| 6 | 0,0223 ms | +44 KiB |
| 7 | 0,0222 ms | +44 KiB |
| 8 | 0,0238 ms | +44 KiB |
| 9 | 0,0209 ms | +44 KiB |
| 10 | 0,0215 ms | +44 KiB |
| 11 | 0,0219 ms | +45 KiB |
| 12 | 0,0252 ms | +45 KiB |
| 13 | 0,0234 ms | +45 KiB |
| 14 | 0,0202 ms | +45 KiB |
| 15 | 0,0210 ms | +45 KiB |

El heap sube 45 KiB en las cinco primeras repeticiones y se queda plano después: no crece con las llamadas. El tiempo no deriva. Margen sobre el umbral: ×2 (el peor, 0,0252 ms, frente a 0,05 ms).

## 4. Recomendación

- **Elegida**: no poner caché antes de abrir `libres` a toda la oficina · **Por qué**: O1 cumple con la peor carga confirmada, con margen ×2 y sin recurso creciente (filas de O1 y de §3).
- **Descartadas**: caché de `libres` — no hace falta con estas medidas y añadiría invalidación al cancelar y anular reservas.

Límites de la medida: es un solo proceso con `hrtime` y una media sobre 2.000 llamadas, no la latencia de una llamada aislada; la primera llamada en frío (0,2094 ms) supera el umbral y no está cubierta por O1. No se midió concurrencia ni más de 1.000 reservas.

## 5. Lo que sale

- `freeRooms` ordena una copia de las reservas (`bookings.slice().sort(...)`) y descarta el resultado: es trabajo inútil en cada llamada, y crece con las reservas. No cambia lo que responde; quitarlo sería un patch, que este spike no hace → fila por abrir en el roadmap (patch: quitar la ordenación sin uso de `libres`).
