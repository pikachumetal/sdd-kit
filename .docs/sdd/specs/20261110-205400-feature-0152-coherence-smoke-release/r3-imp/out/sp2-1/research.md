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
| O1 — `libres` con 1.000 reservas responde en < 50 ms | cumple | Máximo 0,084 ms (la primera, en frío); el resto entre 0,005 y 0,025 ms. Unas 600 veces por debajo del umbral. | `medida-libres-salida.txt` (script: `medir-libres.mjs`) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed` (más la reserva de la semilla por defecto).

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,084 ms | 4,38 MB |
| 2 | 0,005 ms | 4,38 MB |
| 3 | 0,007 ms | 4,38 MB |
| 4 | 0,007 ms | 4,38 MB |
| 5 | 0,025 ms | 4,38 MB |
| 6 | 0,006 ms | 4,93 MB |
| 7 | 0,005 ms | 4,39 MB |
| 8 | 0,007 ms | 4,93 MB |
| 9 | 0,007 ms | 4,43 MB |
| 10 | 0,007 ms | 4,43 MB |

El heap (`heapUsed`, con `gc` antes de cada repetición) oscila entre 4,38 y 4,93 MB sin crecer de forma sostenida. Una sola ejecución de 10 repeticiones; el tiempo es de proceso en memoria, sin el arranque de Node ni la E/S de la interfaz.

## 4. Recomendación

- **Elegida**: no añadir caché antes de abrir `libres` a toda la oficina · **Por qué**: O1 cumple con margen (fila O1, máximo 0,084 ms frente a 50 ms) y el aguante no muestra crecimiento del recurso.
- **Descartadas**: caché de `libres` — no hay tiempo que ahorrar con esta carga.

Límite de lo medido: solo la carga que confirmó el dev-lead; con dos salas, el `some` de `libres` corta en la primera reserva coincidente. No se ha medido otra forma de carga.

## 5. Lo que sale

- nada
