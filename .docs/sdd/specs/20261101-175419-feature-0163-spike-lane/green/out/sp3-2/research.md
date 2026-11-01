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
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | no cumple tal como se definió | 0,067–0,073 ms por llamada (12 repeticiones de 2.000 llamadas; máximo 0,07271 ms, mínimo 0,06735 ms), un 35–45 % por encima del umbral. | `medida-libres.txt` |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed` (500 en `Norte`, 500 en `Sur`, más la reserva inicial de `Norte` que ya trae `src/app.js`), tal como confirmó el dev-lead. Node v26.10.0 (el `tech-stack.md` dice Node 22: no se midió en esa versión).

| Repetición | Tiempo (ms por llamada) | Recurso acumulado (heapUsed, MB) |
| --- | --- | --- |
| 1 | 0,07271 | 5,81 |
| 2 | 0,06982 | 6,38 |
| 3 | 0,06735 | 4,96 |
| 4 | 0,06795 | 5,52 |
| 5 | 0,06906 | 6,06 |
| 6 | 0,07031 | 6,61 |
| 7 | 0,06895 | 5,22 |
| 8 | 0,06818 | 5,84 |
| 9 | 0,06857 | 6,27 |
| 10 | 0,06805 | 5,94 |
| 11 | 0,06831 | 5,61 |
| 12 | 0,06745 | 5,33 |

El tiempo es estable, sin deriva; el heap sube y baja con el recolector de basura, sin crecer de forma sostenida. Ninguna repetición baja de 0,05 ms.

Límites de la medida: es una sola máquina y un solo proceso, con calentamiento previo de 2.000 llamadas. La carga reparte las reservas entre las dos salas; no se midió ninguna otra distribución. Se leyó en `src/app.js` que `freeRooms` ordena una copia de todas las reservas (`bookings.slice().sort(...)`) y descarta el resultado en cada llamada; es una observación del código, no una medida: no se probó cuánto del tiempo se debe a ese ordenado.

## 4. Recomendación

- **Elegida**: no abrir `libres` a toda la oficina con 1.000 reservas tal como está · **Por qué**: O1 `no cumple tal como se definió` (0,067–0,073 ms frente a < 0,05 ms), estable en las 12 repeticiones.
- **Descartadas**: añadir ya una caché (la medida no dice que la caché sea lo que falta: el ordenado descartado de `freeRooms` no se ha medido, y quitarlo es una opción más barata que decidir en otra feature); dar por bueno el umbral (está medido por encima).
- **Sin medir**: cuánto del tiempo se debe al ordenado descartado; el comportamiento en Node 22; otras distribuciones de la carga.

## 5. Lo que sale

El spike no deja código de producción.

- Decidir si se mide `libres` sin el ordenado descartado antes de plantear una caché → fila nueva en el roadmap, a decidir por el dev-lead.
