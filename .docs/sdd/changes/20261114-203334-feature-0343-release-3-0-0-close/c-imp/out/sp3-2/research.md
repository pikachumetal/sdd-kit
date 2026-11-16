---
id: 20261015-110000-feature-0032-free-rooms-fast
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
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | no cumple tal como se definió | Media por llamada entre 0,0702 y 0,1082 ms en las 12 repeticiones (2.000 llamadas cada una), siempre por encima de 0,05 ms. Máximo de una llamada suelta: 1,5078 ms. | `libres-salida-bruta.txt` (script: `measure-libres.mjs`) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed` (las confirmadas por el dev-lead como la peor).

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,0766 ms | 4,42 MB |
| 2 | 0,0880 ms | 4,42 MB |
| 3 | 0,0877 ms | 4,42 MB |
| 4 | 0,0945 ms | 4,43 MB |
| 5 | 0,0808 ms | 4,43 MB |
| 6 | 0,0892 ms | 4,43 MB |
| 7 | 0,0798 ms | 4,46 MB |
| 8 | 0,0853 ms | 4,47 MB |
| 9 | 0,0893 ms | 4,47 MB |
| 10 | 0,1082 ms | 4,47 MB |
| 11 | 0,0837 ms | 4,47 MB |
| 12 | 0,0702 ms | 4,47 MB |

Tiempo estable, sin tendencia a crecer. El heap sube 0,05 MB en 24.000 llamadas (`global.gc()` antes de cada lectura).

## 4. Recomendación

- **Elegida**: no abrir una caché por ahora; quitar antes el `sort` de `freeRooms` y volver a medir con una carga que no deje las dos salas al principio de la lista · **Por qué**: O1 no cumple (0,07–0,11 ms). `freeRooms` ordena en cada llamada una copia de las 1.000 reservas (`bookings.slice().sort(...)`) y descarta el resultado. Una copia de `src/app.js` sin esa línea, medida aparte con el mismo script, dio ≈0,0002–0,0005 ms (`libres-salida-bruta-sin-sort.txt`). Esa medida no es un objetivo de la spec y no cuenta como `cumple`. Con esta carga `some` sale en la primera o segunda reserva, porque Norte y Sur ocupan los índices 0 y 1, así que no mide el recorrido completo.
- **Descartadas**: caché de `libres` (el coste medido está en un `sort` sobrante, no en la búsqueda); dar O1 por cumplido con la copia sin `sort` (no es el código de producción ni una medida con la carga que cubre el recorrido completo).

## 5. Lo que sale

- Quitar `bookings.slice().sort(...)` de `freeRooms` en `src/app.js` → fila del roadmap por abrir (arreglo de rendimiento con su test) y repetir la medida de O1 con reservas que obliguen a recorrer la lista.
