---
id: 20261015-110000-feature-0032-free-rooms-fast
title: Research — carga de `libres` con 1.000 reservas
spec: ./spec.md
status: draft
created: 2026-11-15
timeboxed: 2h
---

# Research — carga de `libres` con 1.000 reservas

## 1. Pregunta a resolver

¿Aguanta `libres` 1.000 reservas?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | no cumple tal como se definió | Media por ronda de 2.000 llamadas: 0,0328–0,0411 ms en 11 de 12 rondas; la ronda 9 midió 0,0538 ms, por encima del umbral. La mediana queda en 0,029–0,047 ms, pero el p99 está entre 0,0635 y 0,3065 ms, siempre por encima. La spec no fija si el umbral es media, mediana o p99: con la media cumple casi siempre y con el p99 no cumple nunca | `libres-salida-bruta.txt` (script: `measure-libres.mjs`) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed`, más la del arranque: 1.001 activas. Todas son de `Norte` y de días distintos, así que `Sur` obliga a `some` a recorrerlas todas.

| Repetición | Tiempo (media por llamada) | Recurso acumulado (heap) |
| --- | --- | --- |
| 1 | 0,0374 ms | 4,97 MB |
| 2 | 0,0358 ms | 5,13 MB |
| 3 | 0,0363 ms | 4,75 MB |
| 4 | 0,0379 ms | 6,27 MB |
| 5 | 0,0360 ms | 5,81 MB |
| 6 | 0,0357 ms | 5,47 MB |
| 7 | 0,0370 ms | 5,07 MB |
| 8 | 0,0411 ms | 6,07 MB |
| 9 | 0,0538 ms | 5,06 MB |
| 10 | 0,0328 ms | 5,93 MB |
| 11 | 0,0356 ms | 8,67 MB |
| 12 | 0,0357 ms | 7,31 MB |

Doce repeticiones seguidas de 2.000 llamadas, tras 500 de calentamiento. El tiempo no crece con las repeticiones. El heap sube y baja entre 4,75 y 8,67 MB sin tendencia clara: lo recoge el GC, aunque 12 rondas no bastan para descartar una fuga lenta. Una sola máquina, un solo Node (v26.10.0), sin aislar otros procesos.

## 4. Recomendación

- **Elegida**: no abrir `libres` a toda la oficina dando O1 por cumplido, y no meter la caché todavía. Primero, quitar el `sort` de `freeRooms`, cuyo resultado se descarta, y volver a medir con este mismo script · **Por qué**: O1 queda `no cumple tal como se definió` (ronda 9 y p99 por encima de 0,05 ms), pero la media está en 0,033–0,041 ms, así que el margen es corto y no hay evidencia de que haga falta caché. El `sort` se ejecuta en cada llamada sobre una copia de las 1.001 reservas, y esa medida no se ha aislado: no sé cuánto del tiempo es suyo.
- **Descartadas**: caché de `libres` ya (no hay una fila medida que diga que el recorrido sin el `sort` supere el umbral); dar O1 por cumplido con la media (la ronda 9 y el p99 lo contradicen, y la spec no dice qué estadístico vale).

## 5. Lo que sale

- Quitar el `bookings.slice().sort(...)` de `freeRooms` en `src/app.js` (su resultado no se usa) y repetir la medida → fila del roadmap por abrir
- Fijar en la spec qué estadístico (media, mediana o p99) mide el umbral de `libres` antes de repetir el spike → fila del roadmap por abrir
