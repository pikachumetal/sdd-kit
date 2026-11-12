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
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | no cumple tal como se definió | 0,0645–0,0967 ms por llamada en 10 repeticiones (mediana ≈ 0,079 ms), es decir, 1,3–1,9 veces el umbral. La primera llamada tarda 7,57 ms (en frío). | `salida-libres.txt` (script `medir-libres.mjs`) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed` (más la reserva inicial de `src/app.js`). 10 repeticiones seguidas de 1.000 llamadas a `run('libres', [franja])` en un mismo proceso.

| Repetición | Tiempo (ms/llamada) | Recurso acumulado (heapUsed, MB) |
| --- | --- | --- |
| 1 | 0,0645 | 5,11 |
| 2 | 0,0737 | 5,12 |
| 3 | 0,0854 | 5,12 |
| 4 | 0,0702 | 5,12 |
| 5 | 0,0820 | 5,83 |
| 6 | 0,0804 | 5,67 |
| 7 | 0,0783 | 5,70 |
| 8 | 0,0809 | 5,70 |
| 9 | 0,0967 | 5,69 |
| 10 | 0,0710 | 5,70 |

El tiempo no crece con las repeticiones y el heap se estabiliza en ≈ 5,7 MB tras un escalón en la repetición 5: no hay una fuga visible en 10.000 llamadas. Ninguna de las 10 repeticiones baja de 0,05 ms.

### Causa probable

`freeRooms` (`src/app.js`) ejecuta `bookings.slice().sort(...)` en cada llamada y descarta el resultado: ordena una copia de 1.000 reservas sin usarla. Para comprobarlo se midió una **copia** de `freeRooms` sin esa línea; `src/` no se ha tocado.

| Variante (copia sin el `sort`, 10 repeticiones × 1.000 llamadas) | Tiempo (ms/llamada) | Evidencia |
| --- | --- | --- |
| Reservas repartidas entre `Norte` y `Sur` (el `some` corta pronto) | 0,0001–0,0003 | `salida-libres-sin-sort.txt` |
| Las 1.000 reservas en `Norte` con `Sur` libre (el `some` recorre las 1.000) | 0,0063–0,0069 | `salida-libres-sin-sort-completo.txt` |

Ambas variantes quedan por debajo de 0,05 ms; la de recorrido completo, unas 7 veces por debajo. Límite de estas filas: miden una copia y no el código de producción, y la carga repartida en dos salas no es la peor para el recorrido.

## 4. Recomendación

- **Elegida**: no abrir una caché; quitar el `slice().sort()` descartado de `freeRooms` y volver a medir con `medir-libres.mjs` antes de abrir `libres` a toda la oficina · **Por qué**: O1 no cumple con el código actual (filas de O1 y de Aguante), y la copia sin el `sort` mide 0,0063–0,0069 ms en la carga de recorrido completo.
- **Descartadas**: caché de `libres`, porque el coste medido está en un `sort` sin efecto y no en la búsqueda, y una caché añadiría invalidación (reservar y cancelar) por un problema que no hace falta resolver así · abrir `libres` tal cual, porque O1 no cumple.

## 5. Lo que sale

- Quitar el `slice().sort(...)` descartado de `freeRooms` y repetir la medida de O1 sobre el código real → fila del roadmap por abrir (la abre el dev-lead; el spike no deja código de producción).
