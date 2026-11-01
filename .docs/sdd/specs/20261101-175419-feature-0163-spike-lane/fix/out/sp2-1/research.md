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
| O1 — `libres` con 1.000 reservas responde en < 50 ms | cumple | Máximo de 20 repeticiones: 0,198 ms (la primera, en frío); el resto entre 0,018 y 0,055 ms. Margen de ~250× sobre el umbral. | `medida-libres.txt` (script: `medir-libres.mjs`) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed`, más la reserva previa del propio `src/app.js`. Todas en la sala Norte, para que Sur recorra las 1.001 sin acierto (el recorrido más largo de `some`). 20 repeticiones seguidas de `run('libres', [franja])` en Node v26.10.0, con `--expose-gc` y `gc()` antes de cada lectura del heap.

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,1976 ms | heap 4.472.232 B |
| 2 | 0,0552 ms | heap 4.472.248 B |
| 3 | 0,0457 ms | heap 4.472.632 B |
| 4 | 0,0323 ms | heap 4.472.624 B |
| 5 | 0,0315 ms | heap 4.702.768 B |
| 6 | 0,0238 ms | heap 4.480.176 B |
| 7 | 0,0191 ms | heap 4.708.616 B |
| 8 | 0,0198 ms | heap 4.519.504 B |
| 9 | 0,0218 ms | heap 4.520.040 B |
| 10 | 0,0200 ms | heap 4.520.072 B |
| 11 | 0,0226 ms | heap 4.520.696 B |
| 12 | 0,0222 ms | heap 4.520.696 B |
| 13 | 0,0295 ms | heap 4.520.696 B |
| 14 | 0,0184 ms | heap 4.520.696 B |
| 15 | 0,0178 ms | heap 4.520.696 B |
| 16 | 0,0188 ms | heap 4.520.696 B |
| 17 | 0,0364 ms | heap 4.520.696 B |
| 18 | 0,0219 ms | heap 4.520.696 B |
| 19 | 0,0328 ms | heap 4.520.696 B |
| 20 | 0,0428 ms | heap 4.520.832 B |

El tiempo no crece con las repeticiones. El heap sube ~48 KB en total (de 4.472.232 a 4.520.832 B) y se queda plano desde la repetición 9: no hay recurso creciente. El detalle en bruto está en `medida-libres.txt`.

## 4. Recomendación

- **Elegida**: no poner caché a `libres` antes de abrirlo a toda la oficina · **Por qué**: O1 cumple con ~250× de margen (máx. 0,198 ms frente a 50 ms) y el heap no crece en 20 repeticiones.
- **Descartadas**: caché de `libres` (no hay tiempo que ahorrar con esta carga); índice por franja (misma razón; solo si una carga mucho mayor lo pidiera, y eso no se midió).

Límite de lo medido: una sola carga (la peor de la spec, en un solo proceso, sin concurrencia ni E/S). No se midió con más de 1.000 reservas ni con otras salas.

## 5. Lo que sale

- nada
