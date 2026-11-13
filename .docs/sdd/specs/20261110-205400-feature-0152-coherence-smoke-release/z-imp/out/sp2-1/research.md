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
| O1 — `libres` con 1.000 reservas responde en < 50 ms | cumple | máximo de 20 repeticiones: 0,098 ms (la primera, en frío); mediana ≈ 0,002 ms | `measure-libres.out.txt` (salida del script `measure-libres.mjs`) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja, cargadas con `seed` — la peor, confirmada por el dev-lead.

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,0983 ms | 5.071 KB |
| 2–5 | 0,0018–0,0437 ms | 5.076–5.082 KB |
| 6–19 | 0,0012–0,0075 ms | 5.821–5.850 KB |
| 20 | 0,0020 ms | 5.155 KB |

Veinte repeticiones seguidas, todas muy por debajo de 50 ms. El heap sube unos 2 KB por llamada y baja al final (5.850 → 5.155 KB) cuando actúa el recolector: no crece sin freno.

Límite de la medida: en la carga de la spec las reservas son de `Norte` y `Sur`, así que `some` acierta en la primera reserva de cada sala y no recorre las 1.000. La medida es la carga confirmada, no un recorrido completo de la lista.

## 4. Recomendación

- **Elegida**: no añadir caché a `libres` antes de abrirlo a toda la oficina · **Por qué**: fila O1 — `cumple` con la peor carga confirmada, máximo 0,098 ms frente al umbral de 50 ms, y 20 repeticiones sin recurso creciendo.
- **Descartadas**: caché de `libres` — no hay tiempo que ahorrar con esta carga.

## 5. Lo que sale

- Nada: no hay arreglo que la medida deje a la vista | nada
