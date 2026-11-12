---
id: 20261015-110000-feature-0031-free-rooms-load
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
| O1 — `libres` con 1.000 reservas responde en < 50 ms | cumple | Con la carga de la spec (1.000 reservas activas en la misma franja, cargadas con `seed`): primera llamada en frío 0,0166 ms; máximo de una llamada en las 12 repeticiones 0,0311 ms, es decir ~1.600 veces por debajo del umbral. Medido en un solo equipo, con Node v26.10.0 | `salida-libres.txt` (script: `medir-libres.mjs`) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja, cargadas con `seed` (la que el dev-lead confirmó: «esa es la peor, sí»).

12 repeticiones seguidas de 200 llamadas cada una; en cada fila, el máximo de una llamada, la media y el heap tras `gc()`.

| Repetición | Tiempo (máx. / media, ms) | Recurso acumulado (heap, MB) |
| --- | --- | --- |
| 1 | 0,0252 / 0,0015 | 4,48 |
| 2 | 0,0064 / 0,0006 | 4,48 |
| 3 | 0,0158 / 0,0005 | 4,49 |
| 4 | 0,0068 / 0,0007 | 4,49 |
| 5 | 0,0038 / 0,0007 | 4,49 |
| 6 | 0,0050 / 0,0005 | 4,49 |
| 7 | 0,0030 / 0,0004 | 5,01 |
| 8 | 0,0031 / 0,0006 | 4,53 |
| 9 | 0,0311 / 0,0007 | 4,53 |
| 10 | 0,0228 / 0,0007 | 4,53 |
| 11 | 0,0023 / 0,0005 | 4,53 |
| 12 | 0,0029 / 0,0003 | 4,53 |

El heap no crece de forma sostenida (4,48 → 4,53 MB; el 5,01 de la repetición 7 no se repite).

Dato aparte, que **no** es la carga confirmada: con las 1.000 reservas en salas que `libres` no descarta pronto (el recorrido no corta nunca), el máximo de una llamada fue 0,3349 ms y la media ~0,008 ms (`salida-libres-completo.txt`). Sigue ~150 veces por debajo del umbral.

## 4. Recomendación

- **Elegida**: no abrir una caché para `libres` por ahora; abrirlo a toda la oficina con el cálculo actual · **Por qué**: fila O1 (cumple, 0,0311 ms de máximo frente a 50 ms) y el aguante sin crecimiento del heap.
- **Descartadas**: caché de `libres` — no hay tiempo que ganar con 1.000 reservas; habría que invalidarla en `cancelar` y `anular`, coste sin beneficio medido.

Límite de lo medido: solo 1.000 reservas, en memoria y en un equipo; el coste de `libres` es lineal en el número de reservas, y la medida no dice nada por encima de esa carga.

## 5. Lo que sale

- El script `medir-libres.mjs` con su salida queda como evidencia; sin cambios de producción → nada.
- Un detalle del script: `src/app.js` lee `process.argv` al importarse, así que el argumento `completo` hace que imprima `salas` (primera línea de `salida-libres-completo.txt`); no afecta a las medidas → nada.
