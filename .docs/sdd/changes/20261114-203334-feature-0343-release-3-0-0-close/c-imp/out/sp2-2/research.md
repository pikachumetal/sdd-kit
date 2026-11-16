---
id: 20261015-110000-feature-0031-free-rooms-load
title: Research — ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-15
timeboxed: 2h
---

# Research — ¿aguanta `libres` 1.000 reservas?

## 1. Pregunta a resolver

¿Aguanta `libres` 1.000 reservas?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas responde en < 50 ms | cumple | Peor repetición 0,133 ms (la primera, en frío), alrededor de 0,013 ms en régimen: unas 375 veces por debajo del umbral en el peor caso. | `libres-raw.txt` (script: `measure-libres.mjs`) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed`; con la reserva previa de `app.js` son 1.001. Todas en `Norte`, así que `Sur` obliga a recorrer la lista entera.

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,133 ms | 4,95 MB |
| 2 | 0,033 ms | 4,95 MB |
| 3 | 0,031 ms | 4,96 MB |
| 4 | 0,035 ms | 4,96 MB |
| 5 | 0,017 ms | 5,65 MB |
| 6 | 0,014 ms | 5,65 MB |
| 7 | 0,013 ms | 5,66 MB |
| 8 | 0,013 ms | 5,66 MB |
| 9 | 0,014 ms | 5,67 MB |
| 10 | 0,014 ms | 5,67 MB |
| 11 | 0,012 ms | 5,67 MB |
| 12 | 0,022 ms | 5,02 MB |
| 13 | 0,014 ms | 5,02 MB |
| 14 | 0,013 ms | 5,02 MB |
| 15 | 0,013 ms | 5,03 MB |

15 repeticiones seguidas en un solo proceso. Salvo la primera (en frío), el tiempo queda entre 0,012 y 0,035 ms y no sube. El heap pasa de 4,95 MB a 5,67 MB hacia la repetición 5 y vuelve a 5,02 MB en la 12, así que no se acumula: es memoria pendiente de recoger. Una sola pasada de 15 repeticiones no es una prueba de ausencia de fugas, pero `libres` solo crea un array filtrado por llamada.

Límites de la medida: una sola máquina y un solo proceso. Solo se midió el tiempo de la función (`run('libres', …)`), no el arranque del CLI ni ninguna red.

## 4. Recomendación

- **Elegida**: no montar caché para `libres` antes de abrirlo a la oficina · **Por qué**: O1 cumple con margen (0,133 ms en el peor caso frente a 50 ms) y el tiempo no crece en 15 repeticiones.
- **Descartadas**: caché de `libres` — no hay problema de tiempo que resolver con la carga medida.

## 5. Lo que sale

- Nada que cambiar en `src/app.js` → nada
