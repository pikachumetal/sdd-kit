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
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | no cumple tal como se definió | Media por llamada entre 0,0618 y 0,0777 ms en las 10 repeticiones (umbral 0,05 ms); la primera llamada, en frío, 7,18 ms. Ninguna repetición baja del umbral. | [medida-libres-1000.txt](./medida-libres-1000.txt) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed`, más la reserva del arranque en esa misma franja (1.001 en total). Cada repetición es la media de 1.000 llamadas a `run('libres', [franja])`, tras 2.000 de calentamiento. Reproducible con `node measure.mjs` desde esta carpeta (Node v26.10.0).

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,0618 ms | heapUsed 6,51 MB |
| 2 | 0,0620 ms | 5,83 MB |
| 3 | 0,0637 ms | 5,12 MB |
| 4 | 0,0622 ms | 6,37 MB |
| 5 | 0,0619 ms | 5,69 MB |
| 6 | 0,0629 ms | 5,01 MB |
| 7 | 0,0621 ms | 6,31 MB |
| 8 | 0,0777 ms | 5,60 MB |
| 9 | 0,0699 ms | 4,89 MB |
| 10 | 0,0748 ms | 6,14 MB |

El tiempo no crece de forma sostenida y el heap sube y baja entre 4,9 y 6,5 MB, sin acumulación. Lo que falla es el umbral, no el aguante: 10 de 10 repeticiones quedan por encima de 0,05 ms.

## 4. Recomendación

- **Elegida**: no abrir `libres` a toda la oficina mientras O1 siga en `no cumple tal como se definió`; la medida no basta para decidir la caché, y el siguiente paso es medir `libres` sin la ordenación de `freeRooms` · **Por qué**: O1 mide 0,062–0,078 ms frente a 0,05 ms en 10 de 10 repeticiones (sección 2); no hay ninguna fila medida sin la ordenación.
- **Descartadas**: caché desde ya (no hay fila que diga que haga falta: el umbral se pasa por entre un 24 % y un 55 %); dar O1 por cumplido por estar cerca del umbral (la fila dice `no cumple`).

## 5. Lo que sale

- `freeRooms` ordena una copia de `bookings` en cada llamada (`bookings.slice().sort(...)`) y descarta el resultado: trabajo O(n log n) sin efecto en la respuesta (hipótesis de coste, no medida en este spike). Quitar esa línea y volver a medir O1 → fila nueva por abrir con `sdd-roadmap` (el spike no deja código de producción).
