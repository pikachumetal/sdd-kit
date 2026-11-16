---
id: 20261015-110000-feature-0032-free-rooms-fast
title: Research — ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: approved
created: 2026-11-01
timeboxed: 2h
---

# Research — ¿aguanta `libres` 1.000 reservas?

## 1. Pregunta a resolver

¿Aguanta `libres` 1.000 reservas?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | no cumple tal como se definió | Media por llamada entre 0,0636 y 0,0741 ms en las 12 repeticiones (típica ≈ 0,065 ms), ≈ 30 % por encima del umbral; funciona, pero no baja de 0,05 ms | [evidencia-libres-1000.txt](./evidencia-libres-1000.txt) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja, cargadas con `seed` (más la reserva previa de `app.js`). Cada repetición son 1.000 llamadas a `run('libres', [franja])`, tras 2.000 de calentamiento. Medido con `medir.mjs` en Node v26.10.0 (el stack declara Node 22).

| Repetición | Tiempo (ms por llamada) | Recurso acumulado (heapUsed, MB) |
| --- | --- | --- |
| 1 | 0,0645 | 6,46 |
| 2 | 0,0651 | 5,76 |
| 3 | 0,0652 | 5,05 |
| 4 | 0,0646 | 6,30 |
| 5 | 0,0650 | 5,60 |
| 6 | 0,0660 | 4,89 |
| 7 | 0,0652 | 6,15 |
| 8 | 0,0649 | 5,47 |
| 9 | 0,0642 | 4,81 |
| 10 | 0,0683 | 6,07 |
| 11 | 0,0741 | 5,05 |
| 12 | 0,0636 | 5,94 |

El tiempo es estable y la memoria oscila sin crecer (la recolección de basura la recoge). Las 12 repeticiones superan 0,05 ms. Una sola máquina y un solo runtime: es un orden de magnitud, no un presupuesto garantizado.

## 4. Recomendación

- **Elegida**: no abrir `libres` a toda la oficina con 1.000 reservas hasta quitar el coste que sobra en `freeRooms`; si hace falta caché queda sin decidir hasta volver a medir · **Por qué**: O1 `no cumple tal como se definió` (≈ 0,065 ms); `freeRooms` copia y ordena las reservas (`bookings.slice().sort(...)`) y descarta el resultado, trabajo O(n log n) que no afecta a la respuesta. Que quitar eso baje de 0,05 ms **no está medido**: la recomendación se apoya en que el umbral falla, no en una cifra tras el arreglo.
- **Descartadas**: añadir una caché ahora (invalidación en cada `reservar`/`cancelar`/`anular` sin haber medido antes el arreglo barato); dar O1 por cumplido porque la diferencia es de centésimas de milisegundo (el umbral era 0,05).

## 5. Lo que sale

- Quitar el `bookings.slice().sort(...)` descartado de `freeRooms` y volver a medir con `medir.mjs` → fila por añadir en «Deuda técnica» del roadmap (escrita en el cierre)

Validación por el agente: 2026-11-01 · `node --test` → 4/4 pass, fail 0; `node medir.mjs` repetido: mínimo 0,0638 ms por llamada (> 0,05), O1 sigue en `no cumple tal como se definió`. Revisión final propia (sin herramienta de subagentes).
