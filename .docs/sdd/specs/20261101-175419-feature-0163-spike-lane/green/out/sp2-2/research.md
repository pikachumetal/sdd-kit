---
id: 20261015-110000-feature-0031-free-rooms-load
title: Research — ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: final
created: 2026-11-01
timeboxed: 2h
---

# Research — ¿aguanta `libres` 1.000 reservas?

## 1. Pregunta a resolver

¿Aguanta `libres` 1.000 reservas?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas responde en < 50 ms | cumple | Peor llamada de todo el test: 0,560 ms (primera en frío: 0,056 ms; p50 0,0003 ms). Margen ≈ 90× sobre el umbral. | [evidencia-libres-1000.txt](./evidencia-libres-1000.txt) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed` de `src/app.js`; se llama a `run('libres', [franja])`.

10 repeticiones seguidas de 1.000 llamadas cada una (node v26.10.0, win32):

| Repetición | Peor llamada | Recurso acumulado (heapUsed / rss) |
| --- | --- | --- |
| 1 | 0,5599 ms | 4,50 / 81,00 MB |
| 2 | 0,0183 ms | 4,50 / 81,08 MB |
| 3 | 0,0037 ms | 4,50 / 81,19 MB |
| 4 | 0,0112 ms | 4,50 / 81,19 MB |
| 5 | 0,0303 ms | 4,50 / 81,27 MB |
| 6 | 0,0163 ms | 4,51 / 81,30 MB |
| 7 | 0,0046 ms | 4,54 / 81,36 MB |
| 8 | 0,0041 ms | 4,54 / 81,68 MB |
| 9 | 0,0287 ms | 4,54 / 81,76 MB |
| 10 | 0,0401 ms | 4,54 / 81,94 MB |

El tiempo no se degrada. El `rss` sube ≈ 1 MB en las 10 repeticiones y el `heapUsed` ≈ 0,04 MB (medido tras forzar GC): crecimiento pequeño, sin tendencia a disparar el umbral, pero **existe** y no se ha medido más allá de 10 repeticiones.

Medida complementaria, fuera de la carga de la spec: con la carga pedida `libres` sale pronto (`some` encuentra una reserva de Norte y otra de Sur en las primeras posiciones). Con 1.000 reservas que obligan a recorrer toda la lista (otra franja): p50 0,0124 ms, p99 0,0334 ms, máx 0,1757 ms. También muy por debajo de 50 ms.

Método: dos scripts temporales (no versionados; el spike no deja código) que importan `seed` y `run` de `src/app.js` y miden cada llamada con `performance.now()`. La salida en bruto está en el fichero de evidencia.

## 4. Recomendación

- **Elegida**: no añadir caché a `libres` antes de abrirlo a la oficina · **Por qué**: O1 cumple con ≈ 90× de margen y el aguante de 10 repeticiones no muestra degradación.
- **Descartadas**: caché de resultados por franja — añade invalidación (reservar, cancelar, anular) para ganar microsegundos que nadie necesita.
- **Sin medir**: más de 10 repeticiones seguidas; otras máquinas o versiones de Node; concurrencia de varias personas a la vez (la spec solo fija la carga de 1.000 reservas).

## 5. Lo que sale

- Ninguna caché que construir → nada
