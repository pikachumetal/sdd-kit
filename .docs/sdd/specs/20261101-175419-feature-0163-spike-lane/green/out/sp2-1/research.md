---
id: 20261015-110000-feature-0031-free-rooms-load
title: Research — ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: done
created: 2026-11-01
timeboxed: 2h
---

# Research — ¿aguanta `libres` 1.000 reservas?

## 1. Pregunta a resolver

¿Aguanta `libres` 1.000 reservas?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas responde en < 50 ms | cumple | Peor carga de la spec (1.000 reservas activas en la misma franja, cargadas con `seed`): una llamada tarda entre 0,0007 ms y 0,4188 ms en las 12 repeticiones (máximo 0,4188 ms, ~120 veces por debajo del umbral). Medido en proceso, sin CLI ni consola. | `medida-libres-1000.txt` |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed`, más la reserva base de `src/app.js`. Node v26.10.0, tras 1.000 llamadas de calentamiento.

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,0048 ms | heap 5,32 MB |
| 2 | 0,0009 ms | heap 5,33 MB |
| 3 | 0,0007 ms | heap 5,33 MB |
| 4 | 0,0008 ms | heap 5,33 MB |
| 5 | 0,0020 ms | heap 5,33 MB |
| 6 | 0,0009 ms | heap 5,33 MB |
| 7 | 0,0008 ms | heap 6,06 MB |
| 8 | 0,0008 ms | heap 6,06 MB |
| 9 | 0,4188 ms | heap 5,39 MB |
| 10 | 0,0013 ms | heap 5,40 MB |
| 11 | 0,0007 ms | heap 5,40 MB |
| 12 | 0,0007 ms | heap 5,40 MB |

El heap no crece de forma sostenida: el salto a 6,06 MB baja después a 5,39 MB (recolección de basura). Los tiempos son estables salvo un pico aislado de 0,4 ms (repetición 9).

Límite de la medida: con las reservas alternando `Norte` y `Sur`, `some` encuentra coincidencia en las primeras posiciones, así que la franja ocupada no recorre las 1.000. Aun así, el recorrido completo de 1.000 elementos por sala cabe de sobra en el margen medido; no se midió esa variante.

## 4. Recomendación

- **Elegida**: no añadir caché a `libres` antes de abrirlo a toda la oficina · **Por qué**: O1 cumple con margen de ~120× en la peor carga confirmada y el recurso no crece.
- **Descartadas**: caché de `libres` (añade invalidación al cancelar/anular sin que ninguna fila medida la pida).
- **Sin medir**: carga con más de 1.000 reservas; concurrencia; latencia a través de la CLI (arranque de Node).

## 5. Lo que sale

- Ningún cambio de código → nada

## 6. Validación

Validación por el agente: 2026-11-01 · medidas rehechas desde `medida-libres-1000.txt` (12 repeticiones, máximo 0,4188 ms < 50 ms); suite del repo `node --test` → 4/4, 0 fallos. Gate: `node --test` → 4/4. Revisión final: autorrevisión sin herramienta de subagentes (no hubo revisores con contexto limpio).
